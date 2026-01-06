
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getOrCreateStripeCustomer(brandId: string) {
  const brand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  });

  if (!brand) throw new Error("Brand not found");

  if (brand.stripeCustomerId) {
    return brand.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    name: brand.name,
    metadata: {
      brandId: brand.id,
    },
  });

  await db.update(brands)
    .set({ stripeCustomerId: customer.id })
    .where(eq(brands.id, brand.id));

  return customer.id;
}

export async function createCheckoutSession(brandId: string, priceId: string) {
  const customerId = await getOrCreateStripeCustomer(brandId);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${NEXT_PUBLIC_APP_URL}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    metadata: {
      brandId,
    },
  });

  return session.url;
}

export async function createPortalSession(brandId: string) {
  const brand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  });

  if (!brand?.stripeCustomerId) {
    throw new Error("No Stripe customer found for this brand");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: brand.stripeCustomerId,
    return_url: `${NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });

  return session.url;
}
