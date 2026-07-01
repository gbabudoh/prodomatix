// Static UI config (filter options + per-industry colors). Supplier data
// itself comes from the API.

export const BUSINESS_TYPES = ['Manufacturer', 'Distributor', 'Wholesaler'];

// Hue per category, used for the indicator dots (oklch hue).
export const INDUSTRY_HUE = {
  'Food & Beverage': 95,
  'Electronics': 255,
  'Apparel & Textiles': 330,
  'Construction & Materials': 35,
  'Industrial Equipment': 215,
  'Health & Beauty': 155,
  'Automotive': 15,
  'Packaging': 285
};

// Color accent per business type (for badges).
export const TYPE_HUE = {
  Manufacturer: 255,
  Distributor: 165,
  Wholesaler: 35
};
