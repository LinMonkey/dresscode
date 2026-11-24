"use client"

// Revenue this year against last year and the plan: two solid lines and a dashed target, with dots on
// hover. The target is drawn last so its dashes stay visible where it meets this year's line. A toggle
// switches between monthly figures and the running year-to-date total.
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const chartConfig = {
  thisYear: { label: "2026", color: "var(--chart-1)" },
  lastYear: { label: "2025", color: "var(--chart-4)" },
  target: { label: "Target", color: "var(--foreground)" },
} satisfies ChartConfig
type Series = keyof typeof chartConfig
const SERIES_ORDER: Series[] = ["thisYear", "lastYear", "target"]

// Sample data: monthly revenue in dollars. December 2026 is still open, so it has no figure yet.
const MONTHLY = [
  { month: "Jan", thisYear: 35800, lastYear: 31200, target: 36000 },
  { month: "Feb", thisYear: 34100, lastYear: 29400, target: 36500 },
  { month: "Mar", thisYear: 39700, lastYear: 34100, target: 38000 },
  { month: "Apr", thisYear: 38200, lastYear: 33300, target: 39500 },
  { month: "May", thisYear: 42900, lastYear: 36200, target: 41000 },
  { month: "Jun", thisYear: 44800, lastYear: 38400, target: 42500 },
  { month: "Jul", thisYear: 40600, lastYear: 35100, target: 44000 },
  { month: "Aug", thisYear: 43500, lastYear: 37300, target: 45500 },
  { month: "Sep", thisYear: 47900, lastYear: 40800, target: 47000 },
  { month: "Oct", thisYear: 50400, lastYear: 43200, target: 48500 },
  { month: "Nov", thisYear: 52300, lastYear: 45100, target: 50000 },
  { month: "Dec", thisYear: null, lastYear: 51600, target: 54000 },
]
type Row = { month: string; thisYear: number | null; lastYear: number; target: number }

const RUNNING: Row[] = MONTHLY.reduce<Row[]>((rows, m, i) => {
  const prev = rows[i - 1]
  rows.push({
    month: m.month,
    thisYear: m.thisYear == null ? null : (prev?.thisYear ?? 0) + m.thisYear,
    lastYear: (prev?.lastYear ?? 0) + m.lastYear,
    target: (prev?.target ?? 0) + m.target,
  })
  return rows
}, [])

// Monthly view: start the axis just under the lowest month so the gaps between the lines show.
const MONTHLY_DOMAIN: [number, number] = [
  Math.floor(Math.min(...MONTHLY.flatMap((m) => [m.lastYear, m.target, m.thisYear ?? Infinity])) / 5000) * 5000,
  Math.ceil(Math.max(...MONTHLY.flatMap((m) => [m.lastYear, m.target, m.thisYear ?? 0])) / 5000) * 5000,
]

const closed = MONTHLY.filter((m) => m.thisYear != null)
const ytd = (key: Series) => closed.reduce((n, m) => n + (m[key] ?? 0), 0)
const YTD = { thisYear: ytd("thisYear"), lastYear: ytd("lastYear"), target: ytd("target") }
const growth = ((YTD.thisYear - YTD.lastYear) / YTD.lastYear) * 100
const ofTarget = (YTD.thisYear / YTD.target) * 100
const monthsAhead = closed.filter((m) => (m.thisYear ?? 0) >= m.target).length

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 0 })
const MONTH_NAMES: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
}

function LineKey({ series, dashed }: { series: Series; dashed?: boolean }) {
  return (
    <li className="flex items-center gap-1.5">
      <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden className="shrink-0 overflow-visible">
        <line
          x1="1"
          y1="4"
          x2="17"
          y2="4"
          stroke={chartConfig[series].color}
          strokeWidth={series === "thisYear" ? 2.5 : 2}
          strokeDasharray={dashed ? "4 3" : undefined}
          strokeOpacity={series === "target" ? 0.7 : 1}
          strokeLinecap="round"
        />
      </svg>
      {chartConfig[series].label}
    </li>
  )
}

export default function ChartsLineComparison() {
  const [view, setView] = React.useState<"monthly" | "running">("monthly")
  const data = view === "monthly" ? MONTHLY : RUNNING

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Revenue against last year</CardTitle>
        <CardDescription>2026 so far, with the 2025 figures and this year&apos;s target</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Revenue, January to November</p>
            <p className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{usd.format(YTD.thisYear)}</span>
              <Badge variant="secondary">
                <TrendingUp aria-hidden />+{growth.toFixed(1)}% on 2025
              </Badge>
            </p>
          </div>
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={[view]}
            onValueChange={(v) => v[0] && setView(v[0] as typeof view)}
            aria-label="Figures shown"
          >
            <ToggleGroupItem value="monthly" className="px-2.5">
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem value="running" className="px-2.5">
              Year to date
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ul className="-mb-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Lines">
          <LineKey series="thisYear" />
          <LineKey series="lastYear" />
          <LineKey series="target" dashed />
        </ul>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground rounded-md has-[.recharts-surface:focus-visible]:ring-3 has-[.recharts-surface:focus-visible]:ring-ring/50 [&_g[tabindex]]:outline-hidden">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickMargin={4}
              tickCount={4}
              domain={view === "monthly" ? MONTHLY_DOMAIN : [0, "auto"]}
              tickFormatter={(v: number) => usdShort.format(v)}
            />
            <ChartTooltip
              itemSorter={(item) => SERIES_ORDER.indexOf(item.dataKey as Series)}
              content={
                <ChartTooltipContent
                  className="min-w-52"
                  labelFormatter={(m) => `${MONTH_NAMES[String(m)] ?? m}${view === "running" ? ", year to date" : ""}`}
                  formatter={(value, name, item) => {
                    const key = name as Series
                    const row = item.payload as Row
                    const vsLast = key === "thisYear" && row.thisYear != null ? ((row.thisYear - row.lastYear) / row.lastYear) * 100 : null
                    return (
                      <div className="flex w-full items-center gap-2">
                        <span
                          className={cn("w-3 shrink-0 border-t-2", key === "target" && "border-dashed opacity-70")}
                          style={{ borderColor: `var(--color-${key})` }}
                        />
                        <span className="text-muted-foreground">{chartConfig[key]?.label}</span>
                        {vsLast != null ? <span className="text-muted-foreground tabular-nums">+{vsLast.toFixed(0)}%</span> : null}
                        <span className="ml-auto font-medium text-foreground tabular-nums">
                          {value == null ? "Not closed yet" : usd.format(Number(value))}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Line
              dataKey="lastYear"
              type="monotone"
              stroke="var(--color-lastYear)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-lastYear)", stroke: "var(--card)", strokeWidth: 2 }}
            />
            <Line
              dataKey="thisYear"
              type="monotone"
              stroke="var(--color-thisYear)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-thisYear)", stroke: "var(--card)", strokeWidth: 2 }}
            />
            <Line
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 3.5, fill: "var(--color-target)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">
          {ofTarget.toFixed(1)}% of the year-to-date target, {usd.format(Math.abs(YTD.thisYear - YTD.target))}{" "}
          {YTD.thisYear >= YTD.target ? "ahead" : "behind"}
        </p>
        <p className="text-muted-foreground">
          At or above target in {monthsAhead} of {closed.length} months
        </p>
      </CardFooter>
    </Card>
  )
}
