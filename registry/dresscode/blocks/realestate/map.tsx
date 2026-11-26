"use client"

// The city map: a drawn map of Port Avery (streets, the bay, the parks, the neighborhoods) with a price
// pin for every listing. It needs no map service or key. Pins light up with their card in the list,
// open a small card when clicked, and the map zooms, pans and lets you draw an area to search in.
// Swap MapArt for a real map (MapLibre, Mapbox, Google) when you have one: pins are placed by `at`,
// in % of the map's width and height, so they need a projection from your coordinates.
import { Minus, PenLine, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"

import { cn } from "@/lib/utils"

import { photo } from "./assets"
import { HOODS, type Listing } from "./data"
import { fullAddress, hoodOf, money, short, to } from "./site"

export type Area = { x1: number; y1: number; x2: number; y2: number }

export const inArea = (l: Pick<Listing, "at">, a: Area | null) =>
  !a || (l.at[0] >= Math.min(a.x1, a.x2) && l.at[0] <= Math.max(a.x1, a.x2) && l.at[1] >= Math.min(a.y1, a.y2) && l.at[1] <= Math.max(a.y1, a.y2))

const WATER = "color-mix(in oklab, #4f9fd8 26%, var(--dc-surface))"
const SHORE = "color-mix(in oklab, #4f9fd8 48%, var(--dc-surface))"
const PARK = "color-mix(in oklab, #5fae6e 20%, var(--dc-surface))"
const STREET = "color-mix(in oklab, var(--dc-ink) 10%, var(--dc-surface))"
const ROAD = "color-mix(in oklab, var(--dc-ink) 18%, var(--dc-surface))"

/** The drawn city. Pins and labels live in the 1000 × 700 core; the drawing runs on well past it on
 * every side, so the core can sit whole in a frame of any shape and the map still fills the frame. */
const X0 = -1500
const Y0 = -1000
const W = 4000
const H = 2700
function MapArt({ labels = true }: { labels?: boolean }) {
  const streets: string[] = []
  for (let y = Y0 + 40; y < Y0 + H; y += 55) streets.push(`M${X0} ${y} L${X0 + W} ${y - 40 + ((y / 55) % 3) * 6}`)
  for (let x = X0 + 30; x < X0 + W; x += 60) streets.push(`M${x} ${Y0} L${x - 18 + ((x / 60) % 4) * 5} ${Y0 + H}`)
  return (
    <svg
      viewBox={`${X0} ${Y0} ${W} ${H}`}
      className="absolute"
      style={{ left: `${(X0 / 1000) * 100}%`, top: `${(Y0 / 700) * 100}%`, width: `${(W / 1000) * 100}%`, height: `${(H / 700) * 100}%` }}
      aria-hidden="true"
    >
      <rect x={X0} y={Y0} width={W} height={H} fill="color-mix(in oklab, var(--dc-ink) 3%, var(--dc-surface))" />
      <g fill={PARK}>
        <path d="M60 90 l120 -18 l26 92 l-118 24 z" />
        <path d="M560 40 l140 10 l-12 80 l-136 -8 z" />
        <circle cx="300" cy="420" r="38" />
        <path d="M820 120 l110 20 l-20 90 l-104 -14 z" />
        <path d="M430 520 l90 -10 l18 60 l-96 14 z" />
        <path d="M-420 120 l160 -20 l30 110 l-170 30 z" />
        <path d="M1240 -160 l180 30 l-30 120 l-170 -26 z" />
        <path d="M-200 -420 l240 10 l-20 140 l-230 -12 z" />
        <circle cx="1380" cy="160" r="60" />
      </g>
      <g stroke={STREET} strokeWidth="2" fill="none">
        {streets.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke={ROAD} strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M-1500 330 C -700 310, -200 290, 0 300 C 220 270, 420 280, 560 240 S 820 160, 1000 150 C 1300 120, 1800 60, 2500 40" />
        <path d="M380 -1000 C 400 -400, 410 -150, 420 0 C 440 160, 470 300, 520 420 S 620 560, 700 620" />
        <path d="M60 -1000 C 90 -500, 110 -200, 120 0 C 150 200, 170 400, 230 560" />
        <path d="M1500 -1000 C 1400 -500, 1250 -100, 1000 150" />
      </g>
      {/* The bay and the open sea to the south and east, and the sea off the Westshore */}
      <path
        d="M380 1700 C 420 1000, 440 760, 470 700 C 520 640, 600 612, 660 600 C 730 588, 770 560, 810 520 C 860 470, 910 436, 1000 414 C 1400 330, 1900 250, 2500 200 L2500 1700 Z"
        fill={WATER}
        stroke={SHORE}
        strokeWidth="2"
      />
      <path d="M-1500 560 C -800 600, -200 640, 0 640 C 80 618, 170 636, 252 700 C 300 900, 350 1300, 380 1700 L-1500 1700 Z" fill={WATER} stroke={SHORE} strokeWidth="2" />
      <g fill={ROAD}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={690 + i * 26} y={586 - i * 20} width="8" height="36" rx="2" transform={`rotate(-38 ${694 + i * 26} ${600 - i * 20})`} />
        ))}
      </g>
      <text x="850" y="640" textAnchor="middle" fontSize="26" fontStyle="italic" letterSpacing="3" fill={SHORE}>
        Port Avery Bay
      </text>
      {labels ? (
        <g fontSize="22" fontWeight="500" fill="var(--dc-muted)" textAnchor="middle">
          {HOODS.map((h) => (
            <text key={h.slug} x={h.at[0] * 10} y={h.at[1] * 7}>
              {h.name}
            </text>
          ))}
        </g>
      ) : null}
    </svg>
  )
}

type Props = {
  base: string
  listings: Listing[]
  /** The listing whose card is hovered in the list. */
  active?: string | null
  onActive?: (slug: string | null) => void
  area?: Area | null
  onArea?: (a: Area | null) => void
  /** A small, still map with one pin (the listing page). */
  still?: boolean
  className?: string
}

export function CityMap({ base, listings, active, onActive, area = null, onArea, still = false, className }: Props) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [open, setOpen] = useState<string | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [draft, setDraft] = useState<Area | null>(null)
  const [moving, setMoving] = useState(false)
  const layer = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null)

  const pct = (e: { clientX: number; clientY: number }) => {
    const r = layer.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
  }
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (still || (e.target as HTMLElement).closest("button,a")) return
    e.currentTarget.setPointerCapture(e.pointerId)
    if (drawing) {
      const p = pct(e)
      setDraft({ x1: p.x, y1: p.y, x2: p.x, y2: p.y })
      return
    }
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false }
    setMoving(true)
  }
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drawing && draft) {
      const p = pct(e)
      setDraft({ ...draft, x2: p.x, y2: p.y })
      return
    }
    const d = drag.current
    if (!d) return
    if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 3) d.moved = true
    setPan({ x: d.px + (e.clientX - d.x), y: d.py + (e.clientY - d.y) })
  }
  const onUp = () => {
    if (drawing && draft) {
      const big = Math.abs(draft.x2 - draft.x1) > 3 && Math.abs(draft.y2 - draft.y1) > 3
      onArea?.(big ? draft : null)
      setDraft(null)
      setDrawing(false)
    } else if (drag.current && !drag.current.moved) setOpen(null)
    drag.current = null
    setMoving(false)
  }
  const zoomBy = (k: number) => {
    const z = Math.min(2.5, Math.max(1, zoom * k))
    setZoom(z)
    if (z === 1) setPan({ x: 0, y: 0 })
  }
  const shown = area ?? draft

  return (
    <div className={cn("relative isolate overflow-hidden bg-card [container-type:size]", className)}>
      <div
        className={cn("absolute inset-0", !still && (drawing ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"), "touch-none")}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          ref={layer}
          className={cn("absolute top-1/2 left-1/2 aspect-[10/7] w-[min(92cqw,calc(92cqh*10/7))]", !moving && "transition-transform duration-300 ease-out")}
          style={{ transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <MapArt labels={!still} />
          {shown ? (
            <div
              className="absolute border-2 border-dashed border-[color:var(--dc-accent)] bg-[color:color-mix(in_oklab,var(--dc-accent)_10%,transparent)]"
              style={{ left: `${Math.min(shown.x1, shown.x2)}%`, top: `${Math.min(shown.y1, shown.y2)}%`, width: `${Math.abs(shown.x2 - shown.x1)}%`, height: `${Math.abs(shown.y2 - shown.y1)}%` }}
              aria-hidden="true"
            />
          ) : null}
          {listings.map((l) => {
            const on = active === l.slug || open === l.slug
            const top = l.at[1] < 30
            return (
              <div key={l.slug} className={cn("absolute", on ? "z-20" : "z-10")} style={{ left: `${l.at[0]}%`, top: `${l.at[1]}%`, transform: `translate(-50%, -100%) scale(${1 / zoom})`, transformOrigin: "50% 100%" }}>
                {still ? (
                  <span className="block size-5 -translate-y-1 rounded-full border-[3px] border-white bg-[color:var(--dc-primary)] shadow-md" aria-hidden="true" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpen(open === l.slug ? null : l.slug)}
                    onPointerEnter={() => onActive?.(l.slug)}
                    onPointerLeave={() => onActive?.(null)}
                    onFocus={() => onActive?.(l.slug)}
                    onBlur={() => onActive?.(null)}
                    aria-label={`${fullAddress(l)}, ${money(l.price, l.status)}`}
                    aria-expanded={open === l.slug}
                    className={cn(
                      "relative mb-2 block cursor-pointer rounded-full px-2.5 py-1 text-[13px] font-bold whitespace-nowrap shadow-[0_2px_8px_rgb(0_0_0/0.18)] transition-[background-color,color,scale] duration-200",
                      "after:absolute after:top-full after:left-1/2 after:size-2 after:-translate-x-1/2 after:-translate-y-1 after:rotate-45 after:bg-inherit",
                      on ? "scale-110 bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "bg-card text-foreground hover:bg-[color:var(--dc-accent)] hover:text-[color:var(--background)]",
                    )}
                  >
                    {short(l.price, l.status)}
                  </button>
                )}
                {open === l.slug && !still ? (
                  <Link
                    href={to(base, "homes", l.slug)}
                    className={cn("dc-card absolute left-1/2 z-30 flex w-64 -translate-x-1/2 items-center gap-3 p-2 text-left shadow-[0_14px_30px_-12px_rgb(0_0_0/0.4)]", top ? "top-full mt-2" : "bottom-full mb-3")}
                  >
                    <span className="size-16 shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo(l.photos[0])} alt="" className="size-full object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-bold tabular-nums">{money(l.price, l.status)}</span>
                      <span className="block truncate text-[13px]">{fullAddress(l)}</span>
                      <span className="block truncate text-[13px] text-muted-foreground">{hoodOf(l.hood).name}</span>
                    </span>
                  </Link>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      {still ? null : (
        <div className="absolute top-3 right-3 z-30 flex items-start gap-2">
          {area ? (
            <button type="button" onClick={() => onArea?.(null)} className="dc-card inline-flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-semibold shadow-md">
              <X className="size-4" aria-hidden="true" /> Clear area
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDrawing(!drawing)}
              aria-pressed={drawing}
              className="dc-card inline-flex h-10 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-semibold shadow-md aria-pressed:border-[color:var(--dc-accent)] aria-pressed:text-[color:var(--dc-accent)]"
            >
              <PenLine className="size-4" aria-hidden="true" /> {drawing ? "Drag on the map" : "Draw area"}
            </button>
          )}
          <div className="dc-card grid overflow-hidden p-0 shadow-md">
            <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in" className="grid size-10 cursor-pointer place-items-center hover:bg-muted">
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => zoomBy(1 / 1.4)} aria-label="Zoom out" className="grid size-10 cursor-pointer place-items-center border-t border-border hover:bg-muted">
              <Minus className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
