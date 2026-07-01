// Pricing — server-side source of truth. Never trust client-computed totals.
// Each business carries a flat unit price (set by admins), decoupled from any
// hidden detail like the contact count.

export const TAX_RATE = 0.0825;

export interface Priceable {
  price: number;
}

export const priceOf = (business: Priceable): number => Math.round(business.price || 0);

// Volume discount tiers based on subtotal.
export function discountPctFor(subtotal: number): number {
  if (subtotal >= 1500) return 0.15;
  if (subtotal >= 600) return 0.1;
  if (subtotal >= 300) return 0.05;
  return 0;
}

export interface Totals {
  subtotal: number;
  discountPct: number;
  discount: number;
  tax: number;
  total: number;
  count: number;
}

// Full price breakdown for a set of businesses.
export function summarize(businesses: Priceable[]): Totals {
  const subtotal = businesses.reduce((sum, b) => sum + priceOf(b), 0);
  const discountPct = discountPctFor(subtotal);
  const discount = subtotal * discountPct;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;
  return {
    subtotal,
    discountPct,
    discount: round2(discount),
    tax: round2(tax),
    total: round2(total),
    count: businesses.length
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
