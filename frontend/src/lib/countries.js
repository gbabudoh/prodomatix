// Maps country display names to ISO 3166-1 alpha-2 codes (lowercase) used by
// the `flag-icons` SVG flags. Covers the seed catalogue plus common countries;
// admin can add others here. Aliases included for common variations.

const COUNTRY_CODES = {
  'afghanistan': 'af', 'argentina': 'ar', 'australia': 'au', 'austria': 'at',
  'bangladesh': 'bd', 'belgium': 'be', 'brazil': 'br', 'bulgaria': 'bg',
  'canada': 'ca', 'chile': 'cl', 'china': 'cn', 'colombia': 'co', 'croatia': 'hr',
  'czech republic': 'cz', 'czechia': 'cz', 'denmark': 'dk',
  'egypt': 'eg', 'estonia': 'ee', 'finland': 'fi', 'france': 'fr',
  'germany': 'de', 'greece': 'gr', 'hong kong': 'hk', 'hungary': 'hu',
  'india': 'in', 'indonesia': 'id', 'ireland': 'ie', 'israel': 'il', 'italy': 'it',
  'japan': 'jp', 'kenya': 'ke', 'malaysia': 'my', 'mexico': 'mx', 'morocco': 'ma',
  'netherlands': 'nl', 'new zealand': 'nz', 'nigeria': 'ng', 'norway': 'no',
  'pakistan': 'pk', 'peru': 'pe', 'philippines': 'ph', 'poland': 'pl', 'portugal': 'pt',
  'romania': 'ro', 'russia': 'ru', 'saudi arabia': 'sa', 'singapore': 'sg',
  'slovakia': 'sk', 'slovenia': 'si', 'south africa': 'za',
  'south korea': 'kr', 'korea': 'kr', 'spain': 'es', 'sweden': 'se', 'switzerland': 'ch',
  'taiwan': 'tw', 'thailand': 'th', 'turkey': 'tr', 'türkiye': 'tr', 'turkiye': 'tr',
  'ukraine': 'ua', 'united arab emirates': 'ae', 'uae': 'ae',
  'united kingdom': 'gb', 'uk': 'gb', 'great britain': 'gb',
  'united states': 'us', 'united states of america': 'us', 'usa': 'us', 'us': 'us',
  'vietnam': 'vn'
};

// Returns the lowercase ISO2 code for a country name, or null if unknown.
export function getCountryCode(name) {
  if (!name) return null;
  return COUNTRY_CODES[name.trim().toLowerCase()] || null;
}
