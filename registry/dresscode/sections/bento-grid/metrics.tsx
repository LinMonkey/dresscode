// Bento grid, metrics: five cells built around one big number each and a tiny chart that backs it up
// (monthly bars, a progress ring, a sparkline, a split bar and weekday bars). The numbers and the sentence
// under each are the content; the charts are drawn in divs and SVG in the theme's chart colors and are
// hidden from screen readers. Two rows on desktop (the first cell spans two columns), two across on
// tablets, one on phones.
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function Cell({ className, label, value, note, children, tone = "card" }: { className?: string; label: string; value: string; note: ReactNode; children: ReactNode; tone?: "card" | "highlight" }) {
  const hl = tone === "highlight"
  return (
    <div className={cn("dc-card flex flex-col p-6 sm:p-7", hl && "border-transparent bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]", className)}>
      <h3 className={cn("text-[15px] font-semibold", hl ? "opacity-85" : "text-muted-foreground")}>{label}</h3>
      <p className="dc-h dc-num mt-3 text-[40px] leading-none sm:text-[46px]">{value}</p>
      <p className={cn("mt-3 max-w-[340px] text-[15px] leading-snug", hl ? "opacity-85" : "text-muted-foreground")}>{note}</p>
      <div aria-hidden="true" className="mt-auto pt-7">
        {children}
      </div>
    </div>
  )
}

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
const COLLECTED = [11.2, 12.8, 12.1, 14.6, 13.9, 16.2, 15.4, 17.8, 16.9, 19.6, 21.4, 23]

function MonthBars() {
  return (
    <div>
      <div className="flex h-[150px] items-end gap-[2.5%] border-b border-border">
        {COLLECTED.map((v, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-t-[4px]",
              i === 10 ? "bg-[color:var(--chart-1)]" : i === 11 ? "border-2 border-b-0 border-dashed border-[color:var(--chart-1)]" : "bg-[color:color-mix(in_oklab,var(--chart-1)_45%,transparent)]",
            )}
            style={{ height: `${(v / 24) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-[2.5%] text-center text-[11px] text-muted-foreground">
        {MONTHS.map((m, i) => (
          <span key={i} className={cn("flex-1", i === 10 && "font-semibold text-foreground")}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}

function Ring({ value }: { value: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-[140px]">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="dc-num text-[20px] font-semibold">412</span>
        <span className="text-[12px] opacity-80">invoices</span>
      </span>
    </div>
  )
}

// Days to get paid, Jan to Nov, drawn into a 220 x 64 box (the last point stops short of the right edge so
// its dot stays inside the cell); fewer days sit lower, so the line falls.
const DAYS = [26, 24, 23, 21, 19, 18, 16, 15, 13, 12, 11]
const pts = DAYS.map((d, i) => [(i / (DAYS.length - 1)) * 214, 6 + ((28 - d) / 19) * 52] as const)
const LINE = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
const AREA = `${LINE} L214 64 L0 64 Z`

function Sparkline() {
  const [x, y] = pts[pts.length - 1]
  return (
    <div className="relative h-24">
      <svg viewBox="0 0 220 64" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <path d={AREA} fill="var(--chart-1)" fillOpacity="0.14" />
        <path d={LINE} fill="none" stroke="var(--chart-1)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--card)] bg-[color:var(--chart-1)]"
        style={{ left: `${(x / 220) * 100}%`, top: `${(y / 64) * 100}%` }}
      />
    </div>
  )
}

const SOURCES = [
  { label: "Retainers", share: 46, color: "var(--chart-1)" },
  { label: "Projects", share: 38, color: "var(--chart-2)" },
  { label: "Rush jobs", share: 16, color: "var(--chart-3)" },
]

function SplitBar() {
  return (
    <div>
      <div className="flex h-3 gap-1">
        {SOURCES.map((s) => (
          <span key={s.label} className="rounded-full" style={{ width: `${s.share}%`, background: s.color }} />
        ))}
      </div>
      <ul className="mt-4 space-y-2 text-[13px]">
        {SOURCES.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <i className="size-2.5 rounded-full" style={{ background: s.color }} />
            <span className="flex-1">{s.label}</span>
            <span className="dc-num text-muted-foreground">{s.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const WEEK = [
  { d: "Mon", v: 62 },
  { d: "Tue", v: 100 },
  { d: "Wed", v: 74 },
  { d: "Thu", v: 58 },
  { d: "Fri", v: 41 },
  { d: "Sat", v: 12 },
  { d: "Sun", v: 9 },
]

function WeekBars() {
  return (
    <div>
      <div className="flex h-[88px] items-end gap-2">
        {WEEK.map((w) => (
          <span
            key={w.d}
            className={cn("flex-1 rounded-[4px]", w.d === "Tue" ? "bg-[color:var(--chart-1)]" : "bg-[color:color-mix(in_oklab,var(--chart-1)_30%,transparent)]")}
            style={{ height: `${w.v}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-center text-[11px] text-muted-foreground">
        {WEEK.map((w) => (
          <span key={w.d} className={cn("flex-1", w.d === "Tue" && "font-semibold text-foreground")}>
            {w.d.slice(0, 1)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function BentoGridMetrics() {
  return (
    <section aria-labelledby="bento-grid-metrics-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Orbit in numbers</p>
            <h2 id="bento-grid-metrics-title" className="dc-h mt-3 max-w-[620px] text-[32px] leading-[1.1] sm:text-[42px]">
              What a year of Orbit looks like for a small studio
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              The median studio on Orbit, a year after its first invoice. Your own numbers are on your dashboard from day one.
            </p>
            <a
              href="#customer-stories"
              className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius)] text-[15px] font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Read the customer stories <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Cell
            className="md:col-span-2"
            label="Collected this year"
            value="$184,320"
            note={
              <>
                Up 18% on last year, with <span className="font-semibold text-foreground">$23,000</span> expected in December.
              </>
            }
          >
            <MonthBars />
          </Cell>
          <Cell tone="highlight" label="Paid on time" value="92%" note="of invoices are paid by the due date, up from 64% before reminders.">
            <Ring value={92} />
          </Cell>
          <Cell label="Days to get paid" value="11 days" note="on average, down from 26 in January.">
            <Sparkline />
          </Cell>
          <Cell label="From retainers" value="46%" note="of the money now comes from recurring invoices.">
            <SplitBar />
          </Cell>
          <Cell label="Reminders sent" value="1,240" note="Most clients pay on a Tuesday, a day after the nudge.">
            <WeekBars />
          </Cell>
        </div>
      </div>
    </section>
  )
}
