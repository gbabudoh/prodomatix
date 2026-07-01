import { TYPE_HUE } from '../data/options.js';

// Colored pill for a supplier's business type.
export default function TypeBadge({ type }) {
  const hue = TYPE_HUE[type] ?? 250;
  return (
    <span
      className="type-badge"
      style={{
        color: `oklch(0.45 0.13 ${hue})`,
        background: `oklch(0.95 0.04 ${hue})`,
        borderColor: `oklch(0.88 0.06 ${hue})`
      }}
    >
      {type}
    </span>
  );
}
