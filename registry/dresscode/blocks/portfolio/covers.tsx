"use client"

// Project covers for the sample work: six small compositions (an app screen, a ferry map, a studio brand,
// a type specimen, a fold-out map, a photo book) drawn with the theme's own colors, so the demo work wears
// every theme. They scale with their box (container units), so any aspect ratio works.
// Your own work: give a project an `image` in data.ts and <ProjectCover> shows that instead.
import { Leaf } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import type { Plate, Project } from "./data"

/** cqmin: a share of the cover's shorter side, so a composition keeps its proportions in any box. */
const q = (n: number) => `${n}cqmin`
const mix = (a: string, pct: number, b: string) => `color-mix(in oklab, ${a} ${pct}%, ${b})`

const motionQuery = "(prefers-reduced-motion: no-preference)"
function useMotionOK() {
  return useSyncExternalStore(
    (on) => {
      const m = window.matchMedia(motionQuery)
      m.addEventListener("change", on)
      return () => m.removeEventListener("change", on)
    },
    () => window.matchMedia(motionQuery).matches,
    () => false,
  )
}

/** The cover's background. A theme can swap its colors (--pf-<slug>-bg and -fg, see coverCss in site.ts). */
function Ground({ id, bg, fg, className, children }: { id?: string; bg: string; fg: string; className?: string; children: ReactNode }) {
  const style = { background: id ? `var(--pf-${id}-bg, ${bg})` : bg, color: id ? `var(--pf-${id}-fg, ${fg})` : fg, containerType: "size" } as CSSProperties
  return (
    <div className={cn("relative size-full overflow-hidden select-none", className)} style={style}>
      {children}
    </div>
  )
}

/** A centered square the size of the cover's shorter side: compositions that must stay together sit in it. */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: q(100), height: q(100) }}>
      {children}
    </div>
  )
}

const card: CSSProperties = {
  background: "var(--dc-surface)",
  color: "var(--dc-ink)",
  borderRadius: q(3),
  boxShadow: `0 ${q(1.4)} ${q(5)} ${q(-1.5)} rgb(0 0 0 / 0.28), 0 0 0 ${q(0.25)} rgb(0 0 0 / 0.06)`,
}

/* 1 · Fieldnotes: the survey app's plot screen, with the day's count behind it. */
function Fieldnotes() {
  const rows = [
    ["Quercus suber", "09:42", "40.32° N  7.61° W"],
    ["Erica arborea", "10:15", "40.33° N  7.60° W"],
    ["Cistus ladanifer", "10:51", "40.33° N  7.62° W"],
  ]
  return (
    <Ground id="fieldnotes" bg={mix("var(--dc-accent)", 16, "var(--dc-surface)")} fg="var(--dc-ink)">
      <div
        className="absolute"
        style={{
          ...card,
          width: q(46),
          height: q(58),
          left: "50%",
          top: "50%",
          padding: q(4.5),
          transform: `translate(-6%, -62%) rotate(5deg)`,
          opacity: 0.92,
        }}
      >
        <p style={{ fontSize: q(2.8), color: "var(--dc-muted)" }}>Today</p>
        <p className="dc-h dc-num" style={{ fontSize: q(11), lineHeight: 1, marginTop: q(1) }}>
          142
        </p>
        <p
          style={{
            fontSize: q(2.8),
            color: "var(--dc-muted)",
            marginTop: q(1),
          }}
        >
          records · 3 waiting for signal
        </p>
        <div className="flex items-end" style={{ gap: q(1.2), height: q(14), marginTop: q(5) }}>
          {[38, 62, 45, 80, 56, 92, 70].map((h, i) => (
            <span
              key={i}
              className="flex-1"
              style={{
                height: `${h}%`,
                borderRadius: q(0.8),
                background: mix("var(--dc-accent)", i === 5 ? 100 : 35, "var(--dc-surface)"),
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute"
        style={{
          ...card,
          width: q(60),
          left: "50%",
          top: "50%",
          padding: q(4.5),
          transform: `translate(-62%, -42%) rotate(-3deg)`,
        }}
      >
        <div className="flex items-baseline justify-between" style={{ gap: q(2) }}>
          <p className="dc-h" style={{ fontSize: q(4.8), lineHeight: 1.1 }}>
            Plot 14
          </p>
          <p style={{ fontSize: q(2.6), color: "var(--dc-muted)" }}>Serra da Estrela</p>
        </div>
        <div style={{ marginTop: q(3.5), display: "grid", gap: q(2.6) }}>
          {rows.map(([name, time, pos]) => (
            <div key={name} className="flex items-center" style={{ gap: q(2.6) }}>
              <span
                className="grid shrink-0 place-items-center"
                style={{
                  width: q(9),
                  height: q(9),
                  borderRadius: q(2),
                  background: mix("var(--dc-accent)", 14, "var(--dc-surface)"),
                  color: "var(--dc-accent)",
                }}
              >
                <Leaf style={{ width: q(4.4), height: q(4.4) }} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block truncate italic" style={{ fontSize: q(3.4), fontWeight: 600 }}>
                  {name}
                </span>
                <span className="dc-num block truncate" style={{ fontSize: q(2.4), color: "var(--dc-muted)" }}>
                  {time} · {pos}
                </span>
              </span>
            </div>
          ))}
        </div>
        <span
          className="inline-flex items-center"
          style={{
            marginTop: q(4),
            gap: q(1.2),
            fontSize: q(2.4),
            fontWeight: 600,
            padding: `${q(0.9)} ${q(2)}`,
            borderRadius: 999,
            background: mix("var(--dc-accent)", 12, "var(--dc-surface)"),
          }}
        >
          <span
            style={{
              width: q(1.4),
              height: q(1.4),
              borderRadius: 999,
              background: "var(--dc-accent)",
            }}
          />
          Synced 3 min ago
        </span>
      </div>
    </Ground>
  )
}

/* 2 · Tidewater: four ferry lines across the estuary, boats moving on them, one line's load card. */
const FERRY = [
  {
    d: "M 14 22 C 20 36, 34 46, 44 56",
    color: "var(--dc-highlight)",
    dur: 11,
    still: [27.5, 40.5],
  },
  {
    d: "M 38 24 C 44 38, 58 46, 68 55",
    color: mix("var(--dc-accent)", 70, "var(--dc-page)"),
    dur: 9,
    still: [51.5, 41.4],
  },
  {
    d: "M 62 22 C 68 38, 82 48, 90 58",
    color: mix("var(--dc-primary)", 55, "var(--dc-page)"),
    dur: 13,
    still: [75.3, 42.3],
  },
  {
    d: "M 86 21 C 70 34, 34 42, 20 57",
    color: "var(--dc-page)",
    dur: 17,
    still: [70.9, 30],
  },
]
const PIERS: [number, number, string, "n" | "s"][] = [
  [14, 22, "North Quay", "n"],
  [38, 24, "Old Dock", "n"],
  [62, 22, "Market Pier", "n"],
  [86, 21, "Lighthouse", "n"],
  [20, 57, "Shipworks", "s"],
  [44, 56, "South Yard", "s"],
  [68, 55, "Garden Pier", "s"],
  [90, 58, "Ferry Point", "s"],
]
function Tidewater() {
  const motion = useMotionOK()
  return (
    <Ground id="tidewater" bg="var(--dc-ink)" fg="var(--dc-page)">
      {/* A square map in the middle; the water and the street lines run on past it to the cover's edges. */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d="M -150 30 C -60 24, 20 36, 50 30 S 110 24, 250 32 V 50 C 150 56, 90 44, 50 50 S -60 58, -150 48 Z" fill={mix("var(--dc-page)", 9, "var(--dc-ink)")} />
        {[6, 10, 74, 80].map((y) => (
          <path key={y} d={`M -150 ${y} H 250`} stroke={mix("var(--dc-page)", 9, "var(--dc-ink)")} strokeWidth="0.35" />
        ))}
        {FERRY.map((f) => (
          <path key={f.d} d={f.d} fill="none" stroke={f.color} strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {FERRY.map((f, i) => (
          <circle key={`boat-${f.d}`} r="1.8" fill={f.color} stroke="var(--dc-ink)" strokeWidth="0.6" transform={motion ? undefined : `translate(${f.still[0]} ${f.still[1]})`}>
            {motion ? <animateMotion dur={`${f.dur}s`} repeatCount="indefinite" path={f.d} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" begin={`-${i * 2.3}s`} /> : null}
          </circle>
        ))}
        {PIERS.map(([x, y, name, side]) => (
          <g key={name}>
            <circle cx={x} cy={y} r="2" fill="var(--dc-ink)" stroke="var(--dc-page)" strokeWidth="0.75" />
            <text x={x} y={side === "n" ? y - 4 : y + 6.4} textAnchor="middle" fontSize="3" fill={mix("var(--dc-page)", 72, "var(--dc-ink)")} style={{ fontFamily: "var(--dc-font-body)" }}>
              {name}
            </text>
          </g>
        ))}
      </svg>
      <Stage>
        <div
          className="absolute"
          style={{
            ...card,
            left: q(5),
            bottom: q(5),
            width: q(42),
            padding: q(3.6),
          }}
        >
          <div className="flex items-center" style={{ gap: q(1.6) }}>
            <span
              className="shrink-0"
              style={{
                width: q(2.2),
                height: q(2.2),
                borderRadius: 999,
                background: mix("var(--dc-primary)", 55, "var(--dc-page)"),
                boxShadow: `0 0 0 ${q(0.3)} var(--dc-line)`,
              }}
            />
            <span className="dc-h whitespace-nowrap" style={{ fontSize: q(3.4) }}>
              Line C · Market Pier
            </span>
          </div>
          <div
            className="flex justify-between"
            style={{
              marginTop: q(2.6),
              fontSize: q(2.5),
              color: "var(--dc-muted)",
            }}
          >
            <span>Load</span>
            <span className="dc-num" style={{ color: "var(--dc-ink)", fontWeight: 600 }}>
              62%
            </span>
          </div>
          <div
            style={{
              marginTop: q(1),
              height: q(1.6),
              borderRadius: 999,
              background: "var(--muted)",
            }}
          >
            <div
              style={{
                width: "62%",
                height: "100%",
                borderRadius: 999,
                background: "var(--dc-ink)",
              }}
            />
          </div>
          <p
            style={{
              marginTop: q(2.2),
              fontSize: q(2.5),
              color: "var(--dc-muted)",
            }}
          >
            Next boat in 3 min
          </p>
        </div>
      </Stage>
    </Ground>
  )
}

/* 3 · Kiln: the wordmark, the wall of glaze tests it came from, a class you can book. */
const GLAZES = [
  ["var(--dc-primary)", 100],
  ["var(--dc-primary)", 62],
  ["var(--dc-accent)", 80],
  ["var(--dc-ink)", 82],
  ["var(--dc-accent)", 40],
  ["var(--dc-surface)", 100],
  ["var(--dc-primary)", 30],
  ["var(--dc-ink)", 45],
  ["var(--dc-ink)", 18],
  ["var(--dc-accent)", 100],
  ["var(--dc-primary)", 84],
  ["var(--dc-accent)", 58],
] as const
function Kiln() {
  return (
    <Ground id="kiln" bg="var(--dc-highlight)" fg="var(--dc-highlight-fg)">
      <Stage>
        <div className="absolute" style={{ left: q(6), top: q(6) }}>
          <p className="dc-h" style={{ fontSize: q(19), lineHeight: 0.85 }}>
            kiln
          </p>
          <p style={{ fontSize: q(2.7), marginTop: q(2.4), opacity: 0.72 }}>Ceramics studio · wheel, glaze, fire</p>
        </div>
        <div className="absolute grid grid-cols-4" style={{ right: q(6), top: q(6), gap: q(2.2) }}>
          {GLAZES.map(([c, pct], i) => (
            <span
              key={i}
              style={{
                width: q(9.5),
                height: q(9.5),
                borderRadius: 999,
                background: `radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.42), transparent 42%), ${mix(c, pct, "var(--dc-page)")}`,
                boxShadow: `inset 0 ${q(-0.8)} ${q(1.4)} rgb(0 0 0 / 0.16), 0 0 0 ${q(0.25)} rgb(0 0 0 / 0.08)`,
              }}
            />
          ))}
        </div>
        <div
          className="absolute"
          style={{
            ...card,
            left: q(6),
            bottom: q(6),
            width: q(52),
            padding: q(3.8),
          }}
        >
          <p style={{ fontSize: q(2.5), color: "var(--dc-muted)" }}>Thursday · 18:30</p>
          <p className="dc-h" style={{ fontSize: q(4.6), marginTop: q(0.6) }}>
            Wheel class
          </p>
          <div className="flex items-center justify-between" style={{ marginTop: q(3), gap: q(2) }}>
            <span className="whitespace-nowrap" style={{ fontSize: q(2.5), color: "var(--dc-muted)" }}>
              4 of 6 seats left
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: q(2.5),
                fontWeight: 600,
                padding: `${q(1)} ${q(2.4)}`,
                borderRadius: q(1.4),
                background: "var(--dc-primary)",
                color: "var(--dc-primary-fg)",
              }}
            >
              Book a seat
            </span>
          </div>
        </div>
      </Stage>
    </Ground>
  )
}

/* 4 · Lumen Type: the specimen. The name breathes through the weight axis; the cuts sit below. */
function Lumen() {
  const motion = useMotionOK()
  return (
    <Ground id="lumen-type" bg="var(--dc-primary)" fg="var(--dc-primary-fg)">
      <style>{`@keyframes dc-pf-breathe{0%,100%{font-weight:300}50%{font-weight:900}}`}</style>
      <p className="absolute" style={{ left: q(6), top: q(6), fontSize: q(2.7), opacity: 0.75 }}>
        Lumen Variable · weight, width, slant
      </p>
      <p
        className="absolute inset-x-0 text-center"
        style={{
          top: "50%",
          transform: "translateY(-62%)",
          fontFamily: "var(--dc-font-heading)",
          fontSize: q(24),
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontWeight: 700,
          animation: motion ? "dc-pf-breathe 6s ease-in-out infinite" : undefined,
        }}
      >
        Lumen
      </p>
      <div className="absolute flex justify-between" style={{ left: q(6), right: q(6), bottom: q(14) }}>
        {[300, 450, 650, 850].map((w) => (
          <div key={w} className="text-center">
            <p
              style={{
                fontFamily: "var(--dc-font-heading)",
                fontWeight: w,
                fontSize: q(7),
                lineHeight: 1,
              }}
            >
              Aa
            </p>
            <p className="dc-num" style={{ fontSize: q(2.3), opacity: 0.7, marginTop: q(1) }}>
              {w}
            </p>
          </div>
        ))}
      </div>
      <div
        className="absolute flex items-center"
        style={{
          left: q(6),
          right: q(6),
          bottom: q(6),
          gap: q(2.4),
          fontSize: q(2.4),
        }}
      >
        <span style={{ opacity: 0.75 }}>Weight</span>
        <span className="relative flex-1" style={{ height: q(0.5), background: "currentColor", opacity: 0.35 }} />
        <span className="dc-num" style={{ opacity: 0.75 }}>
          720
        </span>
      </div>
    </Ground>
  )
}

/* 5 · Northbound: the fold-out print of one trip, route and stops on four panels. */
function Northbound() {
  const stops: [number, number][] = [
    [8, 84],
    [22, 70],
    [37, 62],
    [52, 46],
    [66, 38],
    [80, 24],
    [93, 12],
  ]
  return (
    <Ground id="northbound" bg={mix("var(--dc-ink)", 7, "var(--dc-page)")} fg="var(--dc-ink)">
      <Stage>
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "46%",
            width: q(78),
            height: q(54),
            transform: "translate(-50%, -50%)",
            boxShadow: `0 ${q(2)} ${q(6)} ${q(-2)} rgb(0 0 0 / 0.3)`,
          }}
        >
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-full flex-1"
                style={{
                  background: `linear-gradient(to right, ${i % 2 ? "rgb(0 0 0 / 0.1)" : "rgb(255 255 255 / 0.0)"}, ${i % 2 ? "rgb(0 0 0 / 0.02)" : "rgb(0 0 0 / 0.07)"}), var(--dc-surface)`,
                }}
              />
            ))}
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
            {[20, 40, 60, 80].map((v) => (
              <path key={v} d={`M 0 ${v} H 100`} stroke="var(--dc-line)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
            ))}
            <polyline
              points={stops.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke="var(--dc-primary)"
              strokeWidth="2.2"
              strokeDasharray="1 5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {stops.map(([x, y], i) => (
            <span
              key={i}
              className="dc-num absolute grid place-items-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: q(4.2),
                height: q(4.2),
                transform: "translate(-50%, -50%)",
                borderRadius: 999,
                background: "var(--dc-primary)",
                color: "var(--dc-primary-fg)",
                fontSize: q(2.2),
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
          ))}
          <span
            className="absolute"
            style={{
              left: q(6),
              bottom: q(4.5),
              fontSize: q(2.6),
              fontWeight: 600,
              color: "var(--dc-ink)",
            }}
          >
            Lisbon
          </span>
          <span
            className="absolute"
            style={{
              right: q(10),
              top: q(4),
              fontSize: q(2.6),
              fontWeight: 600,
              color: "var(--dc-ink)",
            }}
          >
            Tromsø
          </span>
        </div>
        <p className="absolute inset-x-0 text-center" style={{ bottom: q(7), fontSize: q(2.7), opacity: 0.75 }}>
          Lisbon to Tromsø · 41 days · 6,140 km
        </p>
      </Stage>
    </Ground>
  )
}

/* 6 · Atlas of Small Rooms: the book, a floor plan on its cover, the second edition behind it. */
function SmallRooms() {
  const line = {
    stroke: "currentColor",
    strokeWidth: 1.4,
    fill: "none",
    vectorEffect: "non-scaling-stroke" as const,
  }
  return (
    <Ground id="small-rooms" bg="var(--dc-band)" fg="var(--dc-band-fg)">
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: q(42),
          height: q(60),
          transform: "translate(-22%, -54%) rotate(7deg)",
          borderRadius: q(1),
          background: "var(--dc-primary)",
          boxShadow: `0 ${q(2)} ${q(5)} ${q(-1)} rgb(0 0 0 / 0.35)`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: q(44),
          height: q(62),
          transform: "translate(-72%, -50%) rotate(-2deg)",
          borderRadius: q(1),
          padding: q(4),
          background: "linear-gradient(to right, rgb(0 0 0 / 0.14), rgb(0 0 0 / 0) 7%), var(--dc-page)",
          color: "var(--dc-ink)",
          boxShadow: `0 ${q(2.5)} ${q(6)} ${q(-1)} rgb(0 0 0 / 0.4)`,
        }}
      >
        <p className="dc-h" style={{ fontSize: q(5.6), lineHeight: 1 }}>
          Atlas of
          <br />
          Small Rooms
        </p>
        <svg
          viewBox="0 0 100 80"
          className="absolute"
          style={{
            left: q(4),
            right: q(4),
            top: q(22),
            width: `calc(100% - ${q(8)})`,
          }}
          aria-hidden="true"
        >
          <rect x="2" y="2" width="96" height="76" {...line} />
          <path d="M 58 2 V 44 H 98 M 58 56 V 78 M 2 46 H 30 M 42 46 H 58" {...line} />
          <path d="M 30 46 A 12 12 0 0 1 42 34" {...line} strokeWidth={0.8} />
          <path d="M 58 44 A 12 12 0 0 1 70 56" {...line} strokeWidth={0.8} />
          <path d="M 14 2 H 34 M 74 78 H 92" stroke="currentColor" strokeWidth={4} vectorEffect="non-scaling-stroke" opacity={0.35} />
          <rect x="66" y="10" width="24" height="12" {...line} strokeWidth={0.8} />
        </svg>
        <p
          className="absolute"
          style={{
            left: q(4),
            bottom: q(4),
            fontSize: q(2.3),
            color: "var(--dc-muted)",
          }}
        >
          40 flats under 30 m²
          <br />
          Noor Halvorsen
        </p>
      </div>
    </Ground>
  )
}

const COVERS: Record<string, () => ReactNode> = {
  fieldnotes: Fieldnotes,
  tidewater: Tidewater,
  kiln: Kiln,
  "lumen-type": Lumen,
  northbound: Northbound,
  "small-rooms": SmallRooms,
}

/** A project's cover: its own image when it has one, else the drawn sample. Fills its box. */
export function ProjectCover({ project, className, label }: { project: Project; className?: string; label?: string }) {
  if (project.image)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt={label ?? project.title} className={cn("size-full object-cover", className)} />
  const Cover = COVERS[project.slug]
  return (
    <div role="img" aria-label={label ?? `${project.title} cover`} className={cn("size-full", className)}>
      {Cover ? (
        <Cover />
      ) : (
        <Ground bg="var(--muted)" fg="var(--dc-muted)">
          {null}
        </Ground>
      )}
    </div>
  )
}

/**
 * A picture in a case study or gallery: the plate's own image, else the project's sample cover. With a
 * `crop`, the cover is drawn square and zoomed in on that point (so a detail stays put at any ratio);
 * without one it lays itself out at the plate's ratio. Fills its box.
 */
export function PlateImage({ project, plate, className }: { project: Project; plate: Plate; className?: string }) {
  if (plate.src)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={plate.src} alt={plate.alt ?? plate.caption} className={cn("size-full object-cover", className)} />
  const label = plate.alt ?? plate.caption
  if (!plate.crop) return <ProjectCover project={project} label={label} className={className} />
  const [x, y, zoom] = plate.crop
  // The square's side covers the box at zoom 1; its point (x, y) goes to the middle, kept inside the box.
  const side = `max(100cqw, 100cqh) * ${zoom}`
  return (
    <div className={cn("relative size-full overflow-hidden", className)} style={{ containerType: "size" }}>
      <div
        className="absolute"
        style={{
          width: `calc(${side})`,
          height: `calc(${side})`,
          left: `clamp(calc(100cqw - ${side}), calc(50cqw - ${x / 100} * ${side}), 0px)`,
          top: `clamp(calc(100cqh - ${side}), calc(50cqh - ${y / 100} * ${side}), 0px)`,
        }}
      >
        <ProjectCover project={project} label={label} />
      </div>
    </div>
  )
}
