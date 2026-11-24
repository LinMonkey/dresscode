"use client"

// A row of four KPI cards: the figure, how it moved against the four weeks before (green or red by
// whether the move is good for that figure, not by its direction), and a 12-week sparkline with a
// tooltip per week.
import * as React from "react"
import { Minus, TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, ReferenceDot, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const dayShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

// Sample data: 12 weeks, each starting on a Monday, the last one being the week of Nov 23, 2026.
const WEEKS = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2026, 8, 7 + i * 7)).toISOString().slice(0, 10))

type Kpi = {
  id: string
  label: string
  values: number[]
  /** How the card's figure is made from the weekly values. */
  figure: "last4" | "latest"
  format: (n: number) => string
  /** The tooltip figure for one week, when it needs more words than the card figure. */
  tip?: (n: number) => string
  /** Whether a rise is good news (revenue) or bad news (overdue invoices). */
  better: "up" | "down"
  change: "percent" | "days" | "count"
  note: string
}

const KPIS: Kpi[] = [
  {
    id: "revenue",
    label: "Revenue, last 4 weeks",
    values: [9840, 10420, 9310, 10960, 11240, 10580, 11870, 12150, 11460, 12690, 13020, 12480],
    figure: "last4",
    format: usd.format,
    better: "up",
    change: "percent",
    note: "Best four weeks since March",
  },
  {
    id: "outstanding",
    label: "Outstanding",
    values: [16800, 17400, 16100, 15900, 16700, 15200, 14800, 15600, 14100, 13700, 13300, 12940],
    figure: "latest",
    format: usd.format,
    better: "down",
    change: "percent",
    note: "Across 23 open invoices",
  },
  {
    id: "days",
    label: "Days to get paid",
    values: [24, 23, 23, 22, 22, 21, 21, 20, 20, 19, 19, 18],
    figure: "latest",
    format: (n) => `${n} days`,
    better: "down",
    change: "days",
    note: "Average over each week",
  },
  {
    id: "overdue",
    label: "Overdue invoices",
    values: [4, 5, 5, 4, 6, 5, 5, 6, 6, 6, 8, 7],
    figure: "latest",
    format: String,
    tip: (n) => `${n} overdue`,
    better: "down",
    change: "count",
    note: "3 of them over 30 days late",
  },
]

const chartConfig = { value: { label: "Value", color: "var(--chart-1)" } } satisfies ChartConfig

function summarize(k: Kpi) {
  const v = k.values
  const now = k.figure === "last4" ? v.slice(-4).reduce((a, b) => a + b, 0) : v[v.length - 1]
  const then = k.figure === "last4" ? v.slice(-8, -4).reduce((a, b) => a + b, 0) : v[v.length - 5]
  const delta = now - then
  const rose = delta > 0
  const good = delta === 0 || (k.better === "up" ? rose : !rose)
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : ""
  const text =
    k.change === "percent"
      ? `${sign}${Math.abs((delta / then) * 100).toFixed(1)}%`
      : k.change === "days"
        ? `${sign}${Math.abs(delta)} ${Math.abs(delta) === 1 ? "day" : "days"}`
        : `${sign}${Math.abs(delta)}`
  return { now, delta, rose, good, text }
}

function Sparkline({ kpi }: { kpi: Kpi }) {
  const data = kpi.values.map((value, i) => ({ week: WEEKS[i], value }))
  const last = data[data.length - 1]
  const gradient = `spark-${React.useId().replace(/:/g, "")}`
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-14 w-full [&_g[tabindex]]:outline-hidden" aria-hidden>
      <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 2, left: 6 }} accessibilityLayer={false}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="week" hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(w) => `Week of ${dayShort.format(new Date(`${w}T00:00:00Z`))}`}
              formatter={(value) => <span className="font-medium text-foreground tabular-nums">{(kpi.tip ?? kpi.format)(Number(value))}</span>}
            />
          }
        />
        <Area
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill={`url(#${gradient})`}
          dot={false}
          activeDot={{ r: 3, fill: "var(--color-value)", stroke: "var(--card)", strokeWidth: 2 }}
        />
        <ReferenceDot x={last.week} y={last.value} r={3} fill="var(--color-value)" stroke="var(--card)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  )
}

export default function ChartsKpiSparklines() {
  const headingId = React.useId()
  return (
    <section className="w-full max-w-6xl" aria-labelledby={headingId}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={headingId} className="text-base font-semibold">
          Overview
        </h2>
        <p className="text-sm text-muted-foreground">Changes compare with the 4 weeks before · Sparklines show 12 weeks</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => {
          const s = summarize(k)
          const first = k.values[0]
          return (
            <Card key={k.id}>
              <CardHeader>
                <CardDescription>{k.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">{k.format(s.now)}</CardTitle>
                <CardAction>
                  <Badge variant={s.good ? "secondary" : "destructive"}>
                    {s.delta === 0 ? <Minus aria-hidden /> : s.rose ? <TrendingUp aria-hidden /> : <TrendingDown aria-hidden />}
                    {s.text}
                    <span className="sr-only">{s.good ? ", a good change" : ", a change for the worse"}</span>
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Sparkline kpi={k} />
                <p className="sr-only">
                  Over 12 weeks: from {k.format(first)} to {k.format(k.values[k.values.length - 1])}.
                </p>
                <p className="text-xs text-muted-foreground">{k.note}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
