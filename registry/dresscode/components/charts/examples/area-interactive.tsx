"use client"

// Payments over time: what was invoiced and what was collected each day, as two gradient areas. The
// range select (7 days, 30 days, 3 months) swaps the data, the totals and the change against the
// period before.
import * as React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartConfig = {
  invoiced: { label: "Invoiced", color: "var(--chart-2)" },
  collected: { label: "Collected", color: "var(--chart-1)" },
} satisfies ChartConfig

const RANGES = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 3 months", days: 90 },
] as const
type Range = (typeof RANGES)[number]["value"]

// Sample data: 180 days ending Nov 24, 2026, so every range has a period before it to compare with.
// Replace it with your own rows of { date, invoiced, collected }.
const DATA = (() => {
  let seed = 11
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const end = Date.UTC(2026, 10, 24)
  return Array.from({ length: 180 }, (_, i) => {
    const t = end - (179 - i) * 86_400_000
    const day = new Date(t).getUTCDay()
    const weekend = day === 0 || day === 6
    const growth = (1 + i / 420) * (1 + 0.12 * Math.sin(i / 7))
    const round = (n: number) => Math.round(n / 10) * 10
    return {
      date: new Date(t).toISOString().slice(0, 10),
      invoiced: round((weekend ? 1120 : 1720) * growth * (0.88 + rand() * 0.24)),
      collected: round((weekend ? 980 : 1530) * growth * (0.86 + rand() * 0.28)),
    }
  })
})()

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 })
const dayShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const dayLong = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })
const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

const sum = (rows: typeof DATA, key: "invoiced" | "collected") => rows.reduce((n, r) => n + r[key], 0)

export default function ChartsAreaInteractive() {
  const [range, setRange] = React.useState<Range>("30d")
  const id = React.useId().replace(/:/g, "")
  const days = RANGES.find((r) => r.value === range)!.days

  const rows = DATA.slice(-days)
  const before = DATA.slice(-2 * days, -days)
  const collected = sum(rows, "collected")
  const invoiced = sum(rows, "invoiced")
  const change = ((collected - sum(before, "collected")) / sum(before, "collected")) * 100
  const invoicedChange = ((invoiced - sum(before, "invoiced")) / sum(before, "invoiced")) * 100
  const rate = Math.round((collected / invoiced) * 100)
  const up = change >= 0
  const period = days === 90 ? "3 months" : `${days} days`

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>What you invoiced and what came in, day by day</CardDescription>
        <CardAction>
          <Select items={RANGES.map(({ value, label }) => ({ value, label }))} value={range} onValueChange={(v) => v && setRange(v as Range)}>
            <SelectTrigger size="sm" aria-label="Time range" className="w-[136px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <dl className="flex flex-wrap gap-x-10 gap-y-3" aria-live="polite">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-[2px] bg-(--chart-1)" aria-hidden />
              Collected
            </dt>
            <dd className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{usd.format(collected)}</span>
              <Badge variant={up ? "secondary" : "destructive"}>
                {up ? <TrendingUp aria-hidden /> : <TrendingDown aria-hidden />}
                <span className="sr-only">{up ? "Up" : "Down"}</span>
                {Math.abs(change).toFixed(1)}%
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-[2px] bg-(--chart-2)" aria-hidden />
              Invoiced
            </dt>
            <dd className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{usd.format(invoiced)}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {invoicedChange >= 0 ? "+" : "−"}
                {Math.abs(invoicedChange).toFixed(1)}%
              </span>
            </dd>
          </div>
        </dl>
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground rounded-md has-[.recharts-surface:focus-visible]:ring-3 has-[.recharts-surface:focus-visible]:ring-ring/50 [&_g[tabindex]]:outline-hidden">
          <AreaChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {(["invoiced", "collected"] as const).map((key) => (
                <linearGradient key={key} id={`${id}-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={key === "collected" ? 0.42 : 0.55} />
                  <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0.03} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(v: string) => dayShort.format(asDate(v))}
            />
            <YAxis tickLine={false} axisLine={false} width={44} tickMargin={4} tickCount={4} tickFormatter={(v: number) => usdShort.format(v)} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-44"
                  labelFormatter={(v) => dayLong.format(asDate(String(v)))}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center gap-2">
                      <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: `var(--color-${name})` }} />
                      <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span>
                      <span className="ml-auto font-medium text-foreground tabular-nums">{usd.format(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="invoiced"
              type="monotone"
              stroke="var(--color-invoiced)"
              strokeWidth={2}
              fill={`url(#${id}-invoiced)`}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
            <Area
              dataKey="collected"
              type="monotone"
              stroke="var(--color-collected)"
              strokeWidth={2}
              fill={`url(#${id}-collected)`}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 font-medium">
          Collected {Math.abs(change).toFixed(1)}% {up ? "more" : "less"} than the {period} before
          {up ? <TrendingUp className="size-4" aria-hidden /> : <TrendingDown className="size-4" aria-hidden />}
        </p>
        <p className="text-muted-foreground">
          {rate}% of the invoiced amount came in · {dayShort.format(asDate(rows[0].date))} to {dayShort.format(asDate(rows[rows.length - 1].date))}
        </p>
      </CardFooter>
    </Card>
  )
}
