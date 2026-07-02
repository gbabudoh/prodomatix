// Purchases: checkout (paid or free), purchase history, owned records.
import { Router } from 'express';
import { prisma } from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { audit } from '../lib/audit.ts';
import { getBusinessesByIds, getOwnedBusinessIds } from '../lib/businesses.ts';
import { summarize, priceOf } from '../lib/pricing.ts';

const router = Router();

const makeRef = () => 'PD-' + Math.floor(100000 + Math.random() * 899999);

// POST /api/purchases/checkout  { businessIds: number[], free?: boolean }
router.post('/checkout', requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const ids: number[] = (req.body?.businessIds || []).map(Number).filter(Boolean);
  const useFree = !!req.body?.free;
  if (!ids.length) return res.status(400).json({ error: 'No records selected.' });

  const businesses = await getBusinessesByIds(ids);
  if (businesses.length !== ids.length) {
    return res.status(400).json({ error: 'One or more records no longer exist.' });
  }

  // Block re-purchasing data the user already owns.
  const ownedSet = new Set(await getOwnedBusinessIds(userId));
  const already = businesses.filter((b) => ownedSet.has(b.id));
  if (already.length) {
    return res.status(409).json({
      error: 'You already own some of these records.',
      ownedIds: already.map((b) => b.id)
    });
  }

  const totals = summarize(businesses);

  try {
    const result = await prisma.$transaction(async (tx) => {
      let isFree = false;
      let charged = totals;

      if (useFree) {
        const user = await tx.user.findUnique({ where: { id: userId }, select: { freeCredits: true } });
        const credits = user?.freeCredits ?? 0;
        if (credits < businesses.length) {
          throw new InsufficientCreditsError(credits);
        }
        await tx.user.update({
          where: { id: userId },
          data: { freeCredits: { decrement: businesses.length } }
        });
        isFree = true;
        charged = { ...totals, discount: 0, tax: 0, total: 0 };
      }

      const purchase = await tx.purchase.create({
        data: {
          userId,
          reference: makeRef(),
          subtotal: charged.subtotal,
          discount: charged.discount,
          tax: charged.tax,
          total: charged.total,
          isFree,
          items: {
            create: businesses.map((b) => ({ businessId: b.id, unitPrice: isFree ? 0 : priceOf(b) }))
          }
        }
      });

      return { reference: purchase.reference, purchaseId: purchase.id, isFree, totals: charged };
    });

    await audit(req, 'purchase.checkout', { userId, resource: 'purchase', resourceId: String(result.purchaseId), metadata: { count: businesses.length, isFree: result.isFree } });
    res.status(201).json({ ...result, count: businesses.length });
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return res.status(403).json({ error: `Not enough free credits. You have ${err.credits} left.` });
    }
    throw err;
  }
});

// GET /api/purchases — current user's purchase history with item summaries.
router.get('/', requireAuth, async (req, res) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          business: {
            select: { id: true, businessName: true, industry: true, location: true, contacts: true }
          }
        }
      }
    }
  });
  res.json(purchases);
});

// GET /api/purchases/owned — flat list of every business the user owns.
router.get('/owned', requireAuth, async (req, res) => {
  const ids = await getOwnedBusinessIds(req.user!.id);
  const businesses = await getBusinessesByIds(ids);
  res.json(businesses);
});

class InsufficientCreditsError extends Error {
  credits: number;
  constructor(credits: number) {
    super('insufficient credits');
    this.credits = credits;
  }
}

export default router;
