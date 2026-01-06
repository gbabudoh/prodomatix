
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.subscription || !session.customer) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        
        await db.update(brands)
          .set({
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            subscriptionStatus: "active",
            subscriptionTier: priceId === process.env.STRIPE_PRICE_ID_PRO ? "pro" : "enterprise",
          })
          .where(eq(brands.stripeCustomerId, session.customer as string));
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const updatedSub = event.data.object as Stripe.Subscription;
        const priceId = updatedSub.items.data[0]?.price.id;

        await db.update(brands)
          .set({
            subscriptionStatus: updatedSub.status === "active" ? "active" : "past_due",
            subscriptionTier: updatedSub.status === "active" ? (priceId === process.env.STRIPE_PRICE_ID_PRO ? "pro" : "enterprise") : "free",
          })
          .where(eq(brands.stripeSubscriptionId, updatedSub.id));
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown processing error";
    console.error(`Webhook processing failed: ${message}`);
    return new NextResponse(`Processing Error: ${message}`, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
