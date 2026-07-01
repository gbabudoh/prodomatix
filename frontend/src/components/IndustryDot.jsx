import { INDUSTRY_HUE } from '../data/options.js';

// Small reusable indicator dot colored by industry.
export default function IndustryDot({ industry }) {
  const hue = INDUSTRY_HUE[industry] ?? 250;
  return <span className="dot" style={{ background: `oklch(0.62 0.16 ${hue})` }} />;
}
