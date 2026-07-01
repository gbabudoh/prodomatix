import { getCountryCode } from '../lib/countries.js';

// Renders "[flag] [country]" with the flag in a fixed-width slot so flags line
// up on a straight vertical line regardless of country-name length. Uses
// flag-icons SVG flags — identical across all browsers and operating systems.
export default function CountryFlag({ country, showName = true }) {
  const code = getCountryCode(country);
  return (
    <span className="country-flag">
      {code ? (
        <span className={`fi fi-${code} country-flag__img`} aria-label={country} title={country} />
      ) : (
        <span className="country-flag__placeholder" title={country} aria-hidden="true" />
      )}
      {showName && <span className="country-flag__name">{country}</span>}
    </span>
  );
}
