// Stripe payment routes: create PaymentIntent + webhook.
import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.ts';
import { prisma } from '../db/prisma.ts';
import { getBusinessesByIds } from '../lib/businesses.ts';
import { summarize } from '../lib/pricing.ts';
import { config } from '../config.ts';

const router = Router();
const stripe = new Stripe(config.stripeSecretKey);

// POST /api/payments/create-intent
// Called before checkout: creates a Stripe PaymentIntent for the selected businesses.
// Returns { clientSecret } — passed to Stripe.js on the frontend to confirm the card.
router.post('/create-intent', requireAuth, async (req, res) => {
  const ids: number[] = (req.body?.businessIds || []).map(Number).filter(Boolean);
  if (!ids.length) return res.status(400).json({ error: 'No records selected.' });

  const businesses = await getBusinessesByIds(ids);
  if (businesses.length !== ids.length)
    return res.status(400).json({ error: 'One or more records no longer exist.' });

  const { total } = summarize(businesses);
  if (total <= 0) return res.status(400).json({ error: 'Nothing to charge.' });

  // Stripe amounts are in the smallest currency unit (cents for USD)
  const amountCents = Math.round(total * 100);

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    metadata: {
      userId: String(req.user!.id),
      businessIds: ids.join(','),
    },
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: intent.client_secret, amount: total });
});

// POST /api/payments/webhook
// Stripe calls this when a payment is confirmed. We record the purchase here.
// IMPORTANT: must be registered with raw body (before express.json()).
router.post(
  '/webhook',
  // Raw body needed for Stripe signature verification — handled in index.ts.
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig || !config.stripeWebhookSecret) {
      return res.status(400).send('Missing signature or webhook secret.');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        config.stripeWebhookSecret
      );
    } catch (err: any) {
      console.error('Webhook signature error:', err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const userId = Number(intent.metadata.userId);
      const businessIds = (intent.metadata.businessIds || '')
        .split(',').map(Number).filter(Boolean);

      if (!userId || !businessIds.length) {
        return res.status(200).send('Missing metadata — skipped.');
      }

      const makeRef = () => 'PD-' + Math.floor(100000 + Math.random() * 899999);

      // Idempotency: skip if this intent was already recorded.
      const existing = await prisma.purchase.findFirst({
        where: { stripeIntentId: intent.id }
      });
      if (existing) return res.status(200).send('Already recorded.');

      const businesses = await getBusinessesByIds(businessIds);
      const { subtotal, discount, tax, total } = summarize(businesses);
      const { priceOf } = await import('../lib/pricing.ts');

      await prisma.purchase.create({
        data: {
          userId,
          reference: makeRef(),
          subtotal,
          discount,
          tax,
          total,
          isFree: false,
          stripeIntentId: intent.id,
          items: {
            create: businesses.map(b => ({ businessId: b.id, unitPrice: priceOf(b) }))
          }
        }
      });
    }

    res.status(200).json({ received: true });
  }
);

export default router;
