// The Bento home's map tile: a small drawn map of a riverside city with a pin where you are. It is
// drawn, not fetched, so it needs no map service; water and parks keep their map colors, mixed into
// the theme's surface, and the pin wears the theme's primary. Swap it for a static
// map image of your own city if you like (an <img> in the same tile).
export function BentoMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="320" height="240" fill="var(--dc-surface)" />
      {/* Parks */}
      <path d="M18 30 l46 -8 l10 34 l-44 10 z" fill="color-mix(in oklab, #5fae6e 24%, var(--dc-surface))" />
      <path d="M206 24 l52 6 l-6 30 l-50 -4 z" fill="color-mix(in oklab, #5fae6e 24%, var(--dc-surface))" />
      <circle cx="96" cy="128" r="16" fill="color-mix(in oklab, #5fae6e 24%, var(--dc-surface))" />
      {/* The river */}
      <path d="M0 196 C 60 182, 110 176, 160 170 S 250 150, 320 120 L 320 240 L 0 240 Z" fill="color-mix(in oklab, #4f9fd8 30%, var(--dc-surface))" />
      <path d="M0 196 C 60 182, 110 176, 160 170 S 250 150, 320 120" fill="none" stroke="color-mix(in oklab, #4f9fd8 55%, var(--dc-surface))" strokeWidth="1.5" />
      {/* Piers */}
      {[150, 190, 230, 270].map((x, i) => (
        <path key={x} d={`M${x} ${172 - i * 11} l6 22`} stroke="color-mix(in oklab, var(--dc-ink) 30%, var(--dc-surface))" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* Streets: a grid knocked a little off square, and two avenues */}
      <g stroke="color-mix(in oklab, var(--dc-ink) 16%, var(--dc-surface))" strokeWidth="1.2" fill="none">
        {[40, 70, 100, 130, 160].map((y, i) => (
          <path key={y} d={`M0 ${y + i * 2} L320 ${y - 22 + i * 3}`} />
        ))}
        {[30, 70, 110, 150, 190, 230, 270, 310].map((x, i) => (
          <path key={x} d={`M${x} 0 L${x - 18 + (i % 3) * 6} 200`} />
        ))}
      </g>
      <g stroke="color-mix(in oklab, var(--dc-ink) 30%, var(--dc-surface))" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M120 0 C 130 60, 150 110, 176 168" />
        <path d="M0 92 C 90 84, 200 70, 320 40" />
      </g>
      {/* You are here */}
      <g transform="translate(176 118)">
        <circle r="16" fill="var(--dc-primary)" opacity="0.18" className="pb-ping" />
        <path d="M0 6 C -9 -4, -10 -10, -10 -14 a10 10 0 0 1 20 0 c0 4 -1 10 -10 20 z" fill="var(--dc-primary)" stroke="var(--dc-ink)" strokeWidth="1.5" />
        <circle cy="-14" r="3.6" fill="var(--dc-surface)" />
      </g>
    </svg>
  )
}
