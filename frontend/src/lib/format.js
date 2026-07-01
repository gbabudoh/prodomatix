// Pricing, formatting, and filter helpers (frontend). The server is the source
// of truth at checkout; prices are flat per-record values.

export const priceOf = (b) => Math.round(b.price || 0);

export function discountPctFor(subtotal) {
  if (subtotal >= 1500) return 0.15;
  if (subtotal >= 600) return 0.1;
  if (subtotal >= 300) return 0.05;
  return 0;
}

export function summarize(businesses) {
  const subtotal = businesses.reduce((s, b) => s + priceOf(b), 0);
  const discountPct = discountPctFor(subtotal);
  const discount = subtotal * discountPct;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + tax;
  return { subtotal, discountPct, discount, tax, total, count: businesses.length };
}

// Client-side filtering over the loaded catalogue. Only teaser fields are
// guaranteed present on non-owned records.
export function applyFilters(businesses, filters) {
  const q = filters.search.trim().toLowerCase();
  return businesses.filter((b) => {
    if (
      q &&
      !b.businessName.toLowerCase().includes(q) &&
      !(b.country || '').toLowerCase().includes(q) &&
      !(b.industry || '').toLowerCase().includes(q) &&
      !(b.businessType || '').toLowerCase().includes(q)
    )
      return false;
    if (filters.types.length && !filters.types.includes(b.businessType)) return false;
    if (filters.industries.length && !filters.industries.includes(b.industry)) return false;
    if (filters.regions.length && !filters.regions.includes(b.region)) return false;
    return true;
  });
}

// Formatting
export const fmtNum = (n) => (n || 0).toLocaleString('en-US');
export const money = (n) =>
  '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const moneyRound = (n) => '$' + Math.round(n || 0).toLocaleString('en-US');
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
