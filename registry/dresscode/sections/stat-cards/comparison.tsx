"use client"

// Stat cards with a period switch: this month, last month or this quarter, each against the period
// before it. Switching changes every figure, every change badge and the pair of bars under each figure
// (this period against the last, on one scale). The line under the heading says what is being compared
// and is announced when it changes.
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type Metric = "revenue" | "paid" | "average" | "days"

const METRICS: { id: Metric; label: string; better: "up" | "down"; change: "percent" | "count" | "days"; format: (n: number) => string }[] = [
  { id: "revenue", label: "Revenue", better: "up", change: "percent", format: (n) => `$${n.toLocaleString("en-US")}` },
  { id: "paid", label: "Invoices paid", better: "up", change: "count", format: String },
  { id: "average", label: "Average invoice", better: "up", change: "percent", format: (n) => `$${n.toLocaleString("en-US")}` },
  { id: "days", label: "Days to get paid", better: "down", change: "days", format: (n) => `${n} ${n === 1 ? "day" : "days"}` },
]

const PERIODS = {
  month: {
    label: "This month",
    now: "Nov",
    before: "Oct",
    summary: "Nov 1 to 24, against October",
    against: "on October",
    values: { revenue: [48210, 42880], paid: [17, 15], average: [2836, 2859], days: [11, 14] },
  },
  last: {
    label: "Last month",
    now: "Oct",
    before: "Sep",
    summary: "October, against September",
    against: "on September",
    values: { revenue: [42880, 41590], paid: [15, 16], average: [2859, 2599], days: [14, 15] },
  },
  quarter: {
    label: "This quarter",
    now: "Q4",
    before: "Q3",
    summary: "Oct 1 to Nov 24, against July to September",
    against: "on Q3",
    values: { revenue: [91090, 76810], paid: [32, 29], average: [2847, 2649], days: [12, 16] },
  },
} satisfies Record<string, { label: string; now: string; before: string; summary: string; against: string; values: Record<Metric, [number, number]> }>
type Period = keyof typeof PERIODS

function change(now: number, before: number, kind: "percent" | "count" | "days") {
  const d = now - before
  const sign = d > 0 ? "+" : d < 0 ? "−" : ""
  const abs = Math.abs(d)
  if (kind === "percent") return `${sign}${((abs / before) * 100).toFixed(1)}%`
  if (kind === "days") return `${sign}${abs} ${abs === 1 ? "day" : "days"}`
  return `${sign}${abs}`
}

export default function StatCardsComparison() {
  const [period, setPeriod] = useState<Period>("month")
  const p = PERIODS[period]

  return (
    <section aria-labelledby="stat-cards-comparison-title" className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="stat-cards-comparison-title" className="dc-h text-[24px] leading-tight sm:text-[28px]">
            How the studio is doing
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-foreground" aria-live="polite">
            {p.summary}
          </p>
        </div>
        <ToggleGroup
          aria-label="Period"
          value={[period]}
          onValueChange={(v) => v[0] && setPeriod(v[0] as Period)}
          spacing={1}
          className="max-w-full self-start rounded-[calc(var(--radius)+2px)] border border-border bg-[color:color-mix(in_oklab,var(--foreground)_5%,transparent)] p-[3px] md:self-auto"
        >
          {(Object.keys(PERIODS) as Period[]).map((k) => (
            <ToggleGroupItem
              key={k}
              value={k}
              className="h-8 rounded-[var(--radius)] px-3 text-[13px] text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-[color:var(--card)] aria-pressed:font-semibold aria-pressed:text-foreground aria-pressed:shadow-sm aria-pressed:ring-1 aria-pressed:ring-[color:var(--input)]"
            >
              {PERIODS[k].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => {
          const [now, before] = p.values[m.id]
          const d = now - before
          const good = d === 0 || (m.better === "up" ? d > 0 : d < 0)
          const text = change(now, before, m.change)
          const Arrow = d === 0 ? Minus : d > 0 ? ArrowUpRight : ArrowDownRight
          const max = Math.max(now, before)
          return (
            <div key={m.id} className="dc-card flex flex-col p-5">
              <dt className="text-[14px] font-medium text-muted-foreground">{m.label}</dt>
              <dd className="dc-num mt-2 text-[30px] leading-none font-semibold tracking-tight">{m.format(now)}</dd>
              <dd className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
                <span className={cn("dc-pill", good ? "dc-pill-hl" : "dc-pill-danger")}>
                  <Arrow className="size-3.5" aria-hidden="true" />
                  <span className="dc-num">{text}</span>
                </span>
                {p.against}
                <span className="sr-only">{good ? ", a good change" : ", a change for the worse"}</span>
              </dd>
              <dd className="mt-auto pt-5">
                <span className="sr-only">
                  {p.now}: {m.format(now)}. {p.before}: {m.format(before)}.
                </span>
                <span className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-2 text-[12px]" aria-hidden="true">
                  <span className="font-semibold">{p.now}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)]">
                    <span
                      className="block h-full rounded-full bg-[color:var(--chart-1)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ width: `${(now / max) * 100}%` }}
                    />
                  </span>
                  <span className="dc-num text-right font-medium">{m.format(now)}</span>
                  <span className="text-muted-foreground">{p.before}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)]">
                    <span
                      className="block h-full rounded-full bg-[color:var(--muted-foreground)] opacity-45 transition-[width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ width: `${(before / max) * 100}%` }}
                    />
                  </span>
                  <span className="dc-num text-right text-muted-foreground">{m.format(before)}</span>
                </span>
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
