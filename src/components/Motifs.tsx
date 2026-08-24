/** Decorative cleaning motifs (soap bubbles, squeegee sweep). Purely visual. */

export function Bubbles({ className = "" }: { className?: string }) {
  const b = [
    { cx: 58, cy: 62, r: 34 },
    { cx: 118, cy: 104, r: 22 },
    { cx: 150, cy: 52, r: 14 },
    { cx: 92, cy: 150, r: 12 },
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      {b.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill="var(--color-brand-200)" opacity="0.28" />
          <circle cx={c.cx} cy={c.cy} r={c.r} stroke="var(--color-brand-300)" strokeOpacity="0.5" />
          <ellipse
            cx={c.cx - c.r * 0.32}
            cy={c.cy - c.r * 0.36}
            rx={c.r * 0.22}
            ry={c.r * 0.15}
            fill="#ffffff"
            opacity="0.7"
          />
        </g>
      ))}
    </svg>
  );
}

/** A single squeegee stroke of clean light, for section accents. */
export function SqueegeeStroke({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={className} fill="none" aria-hidden="true">
      <rect x="0" y="4" width="120" height="4" rx="2" fill="var(--color-accent)" opacity="0.5" />
      <rect x="0" y="4" width="46" height="4" rx="2" fill="var(--color-accent)" />
    </svg>
  );
}
