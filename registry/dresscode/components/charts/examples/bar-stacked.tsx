"use client"

// Billing by month, stacked by kind of work. The legend doubles as a filter (click a kind to hide it),
// and the tooltip lists each kind with the month's total under it.
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// One hue in three strengths, mixed toward the card, so the stack reads in any theme and either mode.
const chartConfig = {
  retainers: { label: "Retainers", color: "var(--chart-1)" },
  projects: { label: "Projects", color: "color-mix(in oklab, var(--chart-1) 62%, var(--card))" },
  expenses: { label: "Rebilled expenses", color: "color-mix(in oklab, var(--chart-1) 34%, var(--card))" },
} satisfies ChartConfig
type Kind = keyof typeof chartConfig
const KINDS = Object.keys(chartConfig) as Kind[]

// Sample data: the last 12 months, in dollars.
const DATA = [
  { month: "2025-12", retainers: 18400, projects: 9200, expenses: 1650 },
  { month: "2026-01", retainers: 18400, projects: 6800, expenses: 1240 },
  { month: "2026-02", retainers: 19600, projects: 8900, expenses: 1580 },
  { month: "2026-03", retainers: 19600, projects: 12300, expenses: 2210 },
  { month: "2026-04", retainers: 20800, projects: 10700, expenses: 1930 },
  { month: "2026-05", retainers: 20800, projects: 13900, expenses: 2480 },
  { month: "2026-06", retainers: 22000, projects: 11600, expenses: 1870 },
  { month: "2026-07", retainers: 22000, projects: 9400, expenses: 1520 },
  { month: "2026-08", retainers: 22000, projects: 10200, expenses: 1760 },
  { month: "2026-09", retainers: 23400, projects: 14800, expenses: 2640 },
  { month: "2026-10", retainers: 23400, projects: 16200, expenses: 2910 },
  { month: "2026-11", retainers: 24600, projects: 15100, expenses: 2380 },
]
const PRIOR_YEAR_TOTAL = 336_900

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 0 })
const monthShort = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
const monthLong = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
const asDate = (ym: string) => new Date(`${ym}-01T00:00:00Z`)

export default function ChartsBarStacked() {
  const [shown, setShown] = React.useState<Record<Kind, boolean>>({ retainers: true, projects: true, expenses: true })
  const visible = KINDS.filter((k) => shown[k])
  const top = visible[visible.length - 1]

  const total = DATA.reduce((n, row) => n + visible.reduce((m, k) => m + row[k], 0), 0)
  const all = DATA.reduce((n, row) => n + KINDS.reduce((m, k) => m + row[k], 0), 0)
  const growth = ((all - PRIOR_YEAR_TOTAL) / PRIOR_YEAR_TOTAL) * 100
  const share = (k: Kind) => Math.round((DATA.reduce((n, r) => n + r[k], 0) / all) * 100)

  const toggle = (k: Kind) =>
    setShown((s) => (s[k] && visible.length === 1 ? s : { ...s, [k]: !s[k] }))

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Billed by kind of work</CardTitle>
        <CardDescription>December 2025 to November 2026</CardDescription>
        <CardAction className="text-right">
          <p className="text-2xl font-semibold tracking-tight tabular-nums" aria-live="polite">
            {usd.format(total)}
          </p>
          <p className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            {visible.length === KINDS.length ? "All work" : visible.map((k) => chartConfig[k].label).join(" and ")}
          </p>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div role="group" aria-label="Kinds of work shown" className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={shown[k]}
              onClick={() => toggle(k)}
              className={cn(
                "inline-flex h-7 items-center gap-2 rounded-md border border-border px-2.5 text-xs font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                !shown[k] && "text-muted-foreground"
              )}
            >
              <span
                className={cn("size-2.5 rounded-[3px] ring-1 ring-foreground/15 ring-inset", !shown[k] && "opacity-30")}
                style={{ background: chartConfig[k].color }}
                aria-hidden
              />
              <span className={cn(!shown[k] && "line-through")}>{chartConfig[k].label}</span>
              <span className="text-muted-foreground tabular-nums">{share(k)}%</span>
            </button>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground rounded-md has-[.recharts-surface:focus-visible]:ring-3 has-[.recharts-surface:focus-visible]:ring-ring/50 [&_g[tabindex]]:outline-hidden">
          <BarChart data={DATA} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="22%">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: string) => monthShort.format(asDate(v))} />
            <YAxis tickLine={false} axisLine={false} width={44} tickMargin={4} tickCount={4} tickFormatter={(v: number) => usdShort.format(v)} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              content={
                <ChartTooltipContent
                  className="min-w-48"
                  labelFormatter={(_, payload) => monthLong.format(asDate(String(payload?.[0]?.payload?.month)))}
                  formatter={(value, name, item, index) => {
                    const key = name as Kind
                    const last = index === visible.length - 1
                    const row = item.payload as (typeof DATA)[number]
                    const monthTotal = visible.reduce((n, k) => n + row[k], 0)
                    return (
                      <>
                        <div className="flex w-full items-center gap-2">
                          <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: `var(--color-${key})` }} />
                          <span className="text-muted-foreground">{chartConfig[key]?.label}</span>
                          <span className="ml-auto font-medium text-foreground tabular-nums">{usd.format(Number(value))}</span>
                        </div>
                        {last ? (
                          <div className="mt-0.5 flex w-full items-center border-t border-border pt-1.5 font-medium text-foreground">
                            Total
                            <span className="ml-auto tabular-nums">{usd.format(monthTotal)}</span>
                          </div>
                        ) : null}
                      </>
                    )
                  }}
                />
              }
            />
            {KINDS.map((k) => (
              <Bar
                key={k}
                dataKey={k}
                stackId="billed"
                hide={!shown[k]}
                fill={`var(--color-${k})`}
                radius={k === top ? [4, 4, 0, 0] : 0}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ChartContainer>
        <table className="sr-only">
          <caption>Billed by kind of work, per month</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              {KINDS.map((k) => (
                <th key={k} scope="col">
                  {chartConfig[k].label}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => (
              <tr key={row.month}>
                <th scope="row">{monthLong.format(asDate(row.month))}</th>
                {KINDS.map((k) => (
                  <td key={k}>{usd.format(row[k])}</td>
                ))}
                <td>{usd.format(KINDS.reduce((n, k) => n + row[k], 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-medium">
          <Badge variant="secondary">
            <TrendingUp aria-hidden />+{growth.toFixed(1)}%
          </Badge>
          on the 12 months before, {usd.format(PRIOR_YEAR_TOTAL)}
        </p>
        <p className="text-muted-foreground">Retainers cover {share("retainers")}% of what you bill</p>
      </CardFooter>
    </Card>
  )
}
