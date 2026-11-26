"use client"

// The listing page's moving parts: the photo mosaic and its full-screen viewer, the tour card (pick a
// day and a time, then leave your details), the payment calculator, the floor plan tabs, the section
// tabs that follow your reading, and Share.
import { Check, ChevronLeft, ChevronRight, LayoutPanelTop, Share2, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

import { photo } from "./assets"
import { BRAND, MORTGAGE } from "./data"
import { money, payment } from "./site"

/* Photos ------------------------------------------------------------------------------------- */

export function PhotoMosaic({ photos, alt, floorPlanHref }: { photos: string[]; alt: string; floorPlanHref: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const count = photos.length
  const shown = photos.slice(0, 5)
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count))
  return (
    <>
      <div className="grid h-[clamp(260px,42vw,540px)] grid-cols-1 gap-1.5 overflow-hidden rounded-[var(--dc-radius-card)] sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-2">
        {shown.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${count}`}
            className={cn("group relative cursor-zoom-in overflow-hidden bg-muted", i === 0 ? "sm:row-span-2" : "max-sm:hidden")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(p)} alt={i === 0 ? alt : ""} loading={i === 0 ? "eager" : "lazy"} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute -top-14 right-3 left-3 flex items-end justify-between gap-2">
          <div className="flex gap-2">
            <a href={floorPlanHref} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-[13px] font-semibold text-[#0f1a2e] shadow-sm hover:bg-white">
              <LayoutPanelTop className="size-4" aria-hidden="true" /> Floor plan
            </a>
          </div>
          <button type="button" onClick={() => setOpen(0)} className="inline-flex h-9 cursor-pointer items-center rounded-full bg-white/95 px-3.5 text-[13px] font-semibold text-[#0f1a2e] shadow-sm hover:bg-white">
            View all {count} photos
          </button>
        </div>
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] w-[min(1200px,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden bg-black p-0 text-white ring-0 sm:max-w-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
          }}
        >
          <DialogTitle className="sr-only">Photos of {alt}</DialogTitle>
          {open !== null ? (
            <figure className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(photos[open])} alt={`${alt}, photo ${open + 1}`} className="max-h-[calc(100dvh-6rem)] w-full object-contain" />
              <figcaption aria-live="polite" className="flex items-center justify-between px-4 py-3 text-[14px]">
                <span>
                  {open + 1} / {count}
                </span>
                <span className="flex gap-1">
                  <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/15">
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/15">
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/15">
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </span>
              </figcaption>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href
        try {
          if (navigator.share) await navigator.share({ title, url })
          else await navigator.clipboard.writeText(url)
          setDone(true)
          window.setTimeout(() => setDone(false), 1800)
        } catch {}
      }}
      className={cn("inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[var(--radius)] border border-[color:var(--input)] bg-card px-3 text-[14px] font-medium hover:bg-muted", className)}
    >
      {done ? <Check className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{done ? "Link copied" : "Share"}</span>
    </button>
  )
}

/* Section tabs ------------------------------------------------------------------------------- */

export function SectionTabs({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0]?.[0])
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      let current = items[0]?.[0]
      for (const [id] of items) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 160) current = id
      }
      setActive(current)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", on, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", on)
    }
  }, [items])
  return (
    <nav aria-label="On this page" className="sticky top-16 z-20 -mx-1 overflow-x-auto border-b border-border bg-background/95 backdrop-blur">
      <ol className="flex gap-1 px-1">
        {items.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className="relative block px-3 py-3 text-[15px] whitespace-nowrap text-muted-foreground hover:text-foreground aria-[current=location]:font-semibold aria-[current=location]:text-[color:var(--dc-accent)] aria-[current=location]:after:absolute aria-[current=location]:after:inset-x-3 aria-[current=location]:after:bottom-0 aria-[current=location]:after:h-0.5 aria-[current=location]:after:bg-[color:var(--dc-accent)]"
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* Tour --------------------------------------------------------------------------------------- */

const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" })
const dateFmt = new Intl.DateTimeFormat("en-US", { day: "numeric" })
const longFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })

export function TourCard({ address, agentName, agentPhone, agentPhoto, agentRole }: { address: string; agentName: string; agentPhone: string; agentPhoto: string; agentRole: string }) {
  // The next four days, from the visitor's today (after the first paint, so the server's day doesn't stick).
  const [days, setDays] = useState<Date[]>([])
  useEffect(() => {
    const id = window.setTimeout(() => {
      const today = new Date()
      setDays(Array.from({ length: 4 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1)))
    }, 0)
    return () => window.clearTimeout(id)
  }, [])
  const [day, setDay] = useState(0)
  const [time, setTime] = useState("11:30")
  const [step, setStep] = useState<"pick" | "details" | "done">("pick")
  const [error, setError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const times = ["10:00", "11:30", "1:00", "2:30"]

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!String(data.get("name")).trim() || !/^\S+@\S+\.\S+$/.test(String(data.get("email")))) {
      setError("Add your name and an email address we can reply to.")
      nameRef.current?.focus()
      return
    }
    // Send the request to your CRM or inbox here.
    setError("")
    setStep("done")
  }

  return (
    <section aria-labelledby="re-tour" className="dc-card p-5">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="size-14 shrink-0 overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo(agentPhoto)} alt={`Portrait of ${agentName}`} className="size-full object-cover" />
        </div>
        <div>
          <p className="text-[16px] font-semibold">{agentName}</p>
          <p className="text-[14px] text-muted-foreground">{agentRole}</p>
        </div>
      </div>
      <h2 id="re-tour" className="dc-h mt-4 text-[22px]">
        Tour this home
      </h2>
      {step === "done" ? (
        <div role="status" className="mt-3 rounded-[var(--radius)] bg-[color:var(--dc-highlight)] p-4 text-[15px] text-[color:var(--dc-highlight-fg)]">
          <p className="flex items-center gap-2 font-semibold">
            <Check className="size-4" aria-hidden="true" /> Tour requested
          </p>
          <p className="mt-1">
            {days[day] ? longFmt.format(days[day]) : "Your day"} at {time}, {address}. {agentName.split(" ")[0]} will confirm by email within the hour.
          </p>
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label="Day" className="mt-3 grid grid-cols-4 gap-2">
            {(days.length ? days : Array.from({ length: 4 }, () => null)).map((d, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={day === i}
                onClick={() => setDay(i)}
                className="grid h-16 cursor-pointer place-items-center rounded-[var(--radius)] border border-[color:var(--input)] text-center hover:bg-muted aria-checked:border-[color:var(--dc-accent)] aria-checked:bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,transparent)] aria-checked:ring-1 aria-checked:ring-[color:var(--dc-accent)]"
              >
                <span className="text-[13px] text-muted-foreground">{d ? dayFmt.format(d) : " "}</span>
                <span className="dc-h -mt-1 text-[22px] leading-none tabular-nums">{d ? dateFmt.format(d) : " "}</span>
              </button>
            ))}
          </div>
          <div role="radiogroup" aria-label="Time" className="mt-2 grid grid-cols-4 gap-2">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={time === t}
                onClick={() => setTime(t)}
                className="h-10 cursor-pointer rounded-[var(--radius)] border border-[color:var(--input)] text-[14px] tabular-nums hover:bg-muted aria-checked:border-[color:var(--dc-accent)] aria-checked:font-semibold aria-checked:text-[color:var(--dc-accent)]"
              >
                {t}
              </button>
            ))}
          </div>
          {step === "pick" ? (
            <Button size="lg" className="mt-4 h-12 w-full text-[16px] font-semibold" onClick={() => setStep("details")}>
              Request a tour
            </Button>
          ) : (
            <form onSubmit={submit} noValidate className="mt-4 grid gap-2.5">
              <label className="sr-only" htmlFor="re-tour-name">
                Your name
              </label>
              <Input id="re-tour-name" ref={nameRef} name="name" placeholder="Your name" autoComplete="name" className="h-11" />
              <label className="sr-only" htmlFor="re-tour-email">
                Email
              </label>
              <Input id="re-tour-email" name="email" type="email" placeholder="Email" autoComplete="email" className="h-11" />
              {error ? (
                <p role="alert" className="text-[14px] text-[color:var(--dc-danger)]">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="h-12 w-full text-[16px] font-semibold">
                Send request
              </Button>
            </form>
          )}
          <Button variant="outline" size="lg" className="mt-2.5 h-11 w-full text-[15px]" nativeButton={false} render={<a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(address)}`} />}>
            Ask a question
          </Button>
        </>
      )}
      <p className="mt-4 text-center text-[15px]">
        Call{" "}
        <a href={`tel:${agentPhone.replace(/\D/g, "")}`} className="font-semibold underline-offset-4 hover:underline">
          {agentPhone}
        </a>
      </p>
    </section>
  )
}

/* Payment calculator --------------------------------------------------------------------------- */

export function PaymentCalculator({ price, editablePrice = false }: { price: number; editablePrice?: boolean }) {
  const [home, setHome] = useState(price)
  const [down, setDown] = useState(MORTGAGE.down)
  const [rate, setRate] = useState(MORTGAGE.rate)
  const [years, setYears] = useState(MORTGAGE.years)
  const p = payment(home, { down, rate, years })
  const parts: [string, number, string][] = [
    ["Principal & interest", p.pi, "var(--dc-accent)"],
    ["Property tax", p.tax, "var(--dc-primary)"],
    ["Insurance", p.insurance, "color-mix(in oklab, var(--dc-primary) 35%, var(--dc-surface))"],
  ]
  // The ring: each part's share of the circle, drawn as stroke dashes.
  const C = 2 * Math.PI * 52
  let offset = 0
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="grid gap-5">
        {editablePrice ? (
          <label className="grid gap-1.5 text-[14px] font-medium">
            Home price
            <Input type="number" min={50000} step={5000} value={home} onChange={(e) => setHome(Math.max(0, Number(e.target.value)))} className="h-11 text-[16px]" />
          </label>
        ) : null}
        {(
          [
            ["Down payment", `${down}% · ${money((home * down) / 100)}`, down, setDown, 3, 50, 1],
            ["Interest rate", `${rate.toFixed(1)}%`, rate, setRate, 3, 9, 0.1],
            ["Loan term", `${years} years`, years, setYears, 10, 30, 5],
          ] as const
        ).map(([label, value, v, setV, min, max, step]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between text-[14px]">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground tabular-nums">{value}</span>
            </div>
            <Slider value={[v]} min={min} max={max} step={step} onValueChange={(x) => setV(Array.isArray(x) ? x[0] : x)} aria-label={label} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div className="relative size-36 shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--muted)" strokeWidth="14" />
            {parts.map(([label, value, color]) => {
              const len = (value / p.total) * C
              const el = <circle key={label} cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} className="transition-[stroke-dasharray,stroke-dashoffset] duration-500" />
              offset += len
              return el
            })}
          </svg>
          <p className="absolute inset-0 grid place-items-center text-center">
            <span>
              <span className="dc-h block text-[22px] leading-none tabular-nums">{money(p.total)}</span>
              <span className="text-[13px] text-muted-foreground">/ mo</span>
            </span>
          </p>
        </div>
        <ul className="grid gap-2 text-[14px]">
          {parts.map(([label, value, color]) => (
            <li key={label} className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: color }} aria-hidden="true" />
              <span className="w-36 text-muted-foreground">{label}</span>
              <span className="font-semibold tabular-nums">{money(value)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" className="sr-only">
        About {money(p.total)} a month.
      </p>
    </div>
  )
}

/* Floor plan ----------------------------------------------------------------------------------- */

type Room = [string, number, number, number, number, string?]
const GROUND: Room[] = [
  ["Living room", 0, 0, 46, 50, "16' × 15'"],
  ["Kitchen", 46, 0, 30, 40, "14' × 12'"],
  ["Dining", 76, 0, 24, 40, "12' × 12'"],
  ["Foyer", 46, 40, 20, 24],
  ["Office", 0, 50, 30, 50, "11' × 11'"],
  ["Laundry", 66, 40, 34, 24],
  ["Garden room", 30, 64, 70, 36, "18' × 10'"],
]
function upper(beds: number): Room[] {
  const rooms: Room[] = [["Primary bedroom", 0, 0, 44, 55, "16' × 14'"], ["Bath", 44, 0, 18, 30], ["Walk-in", 44, 30, 18, 25]]
  const rest = Math.max(1, beds - 1)
  const w = 38 / Math.min(rest, 2)
  for (let i = 0; i < Math.min(rest, 2); i++) rooms.push([`Bedroom ${i + 2}`, 62 + i * w, 0, w, 55, "12' × 11'"])
  if (rest > 2) rooms.push([`Bedroom ${4}`, 62, 55, 38, 45, "12' × 11'"])
  rooms.push(["Bath", 0, 55, 30, 45], ["Landing", 30, 55, rest > 2 ? 32 : 70, 45])
  return rooms
}
function flat(beds: number): Room[] {
  const rooms: Room[] = [["Living room", 0, 0, 46, 55, "18' × 15'"], ["Kitchen", 46, 0, 26, 55, "12' × 10'"], ["Bath", 72, 0, 28, 27], ["Entry", 72, 27, 28, 28]]
  // The primary bedroom keeps a third of the row once there are three bedrooms or more; the rest share the remainder.
  const n = Math.max(1, beds)
  const first = n >= 3 ? 36 : 100 / n
  const w = n > 1 ? (100 - first) / (n - 1) : 0
  rooms.push(["Primary bedroom", 0, 55, first, 45, "16' × 13'"])
  for (let i = 1; i < n; i++) rooms.push([`Bedroom ${i + 1}`, first + (i - 1) * w, 55, w, 45, "12' × 11'"])
  return rooms
}

function Plan({ rooms }: { rooms: Room[] }) {
  return (
    <svg viewBox="-2 -2 104 104" className="h-auto w-full max-w-[420px] text-foreground" role="img" aria-label={`Floor plan: ${rooms.map((r) => r[0]).join(", ")}`}>
      {rooms.map(([name, x, y, w, h, size], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="var(--dc-surface)" stroke="currentColor" strokeWidth="1.2" />
          <text x={x + w / 2} y={y + h / 2 - (size ? 1.5 : -1)} textAnchor="middle" fontSize={Math.min(3.6, (w - 3) / (name.length * 0.56))} fontWeight="600" fill="currentColor">
            {name}
          </text>
          {size ? (
            <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontSize="3" fill="var(--dc-muted)">
              {size}
            </text>
          ) : null}
        </g>
      ))}
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

export function FloorPlan({ floors, beds }: { floors: 1 | 2; beds: number }) {
  const [tab, setTab] = useState(0)
  if (floors === 1) return <Plan rooms={flat(beds)} />
  return (
    <div>
      <div role="tablist" aria-label="Floor" className="mb-4 flex gap-4 border-b border-border">
        {["Ground floor", "Upper floor"].map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className="-mb-px cursor-pointer border-b-2 border-transparent pb-2 text-[15px] text-muted-foreground aria-selected:border-[color:var(--dc-accent)] aria-selected:font-semibold aria-selected:text-[color:var(--dc-accent)]"
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tab === 0 ? <Plan rooms={GROUND} /> : <Plan rooms={upper(beds)} />}</div>
    </div>
  )
}
