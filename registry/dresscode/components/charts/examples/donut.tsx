"use client"

// Payments by method: a donut with the month's total in the centre and a legend list with each method's
// amount and share. Pointing at a slice or a row (or focusing a row) puts that method in the centre.
import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// One hue in four strengths, mixed toward the card, so the slices read in any theme and either mode.
const chartConfig = {
  cards: { label: "Card", color: "var(--chart-1)" },
  transfer: { label: "Bank transfer", color: "color-mix(in oklab, var(--chart-1) 72%, var(--card))" },
  debit: { label: "Direct debit", color: "color-mix(in oklab, var(--chart-1) 47%, var(--card))" },
  other: { label: "Cheque and cash", color: "color-mix(in oklab, var(--chart-1) 25%, var(--card))" },
} satisfies ChartConfig
type Method = keyof typeof chartConfig

// Sample data: payments received in November 2026.
const DATA: { method: Method; amount: number; payments: number; fill: string }[] = [
  { method: "cards", amount: 58940, payments: 214, fill: "var(--color-cards)" },
  { method: "transfer", amount: 39310, payments: 61, fill: "var(--color-transfer)" },
  { method: "debit", amount: 19870, payments: 48, fill: "var(--color-debit)" },
  { method: "other", amount: 10330, payments: 9, fill: "var(--color-other)" },
]
const TOTAL = DATA.reduce((n, d) => n + d.amount, 0)
const COUNT = DATA.reduce((n, d) => n + d.payments, 0)

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const pct = (n: number) => `${((n / TOTAL) * 100).toFixed(1)}%`

export default function ChartsDonut() {
  const [active, setActive] = React.useState<number | null>(null)
  const focus = active == null ? null : DATA[active]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Payments by method</CardTitle>
        <CardDescription>How clients paid in November 2026</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-8">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[240px] [&_g[tabindex]]:outline-hidden" aria-hidden>
          <PieChart accessibilityLayer={false}>
            <Pie
              data={DATA}
              dataKey="amount"
              nameKey="method"
              startAngle={90}
              endAngle={-270}
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={1.5}
              cornerRadius={3}
              stroke="var(--card)"
              strokeWidth={2}
              rootTabIndex={-1}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
              shape={(props, i) => (
                <Sector
                  {...props}
                  outerRadius={i === active ? props.outerRadius + 8 : props.outerRadius}
                />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null
                  const { cx = 0, cy = 0 } = viewBox
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={cx} y={cy - 10} className="fill-foreground text-xl font-semibold tabular-nums">
                        {usd.format(focus ? focus.amount : TOTAL)}
                      </tspan>
                      <tspan x={cx} y={cy + 14} className="fill-muted-foreground text-xs">
                        {focus ? chartConfig[focus.method].label : "Collected"}
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="min-w-0">
          <p className="sr-only" aria-live="polite">
            {focus ? `${chartConfig[focus.method].label}: ${usd.format(focus.amount)}, ${pct(focus.amount)} of payments` : ""}
          </p>
          <ul className="grid gap-0.5" aria-label={`Payments by method, ${usd.format(TOTAL)} in total`}>
            {DATA.map((d, i) => (
              <li key={d.method}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-0.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    active === i ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  <span className="size-3 rounded-[3px] ring-1 ring-foreground/10 ring-inset" style={{ background: chartConfig[d.method].color }} aria-hidden />
                  <span className="min-w-0 truncate font-medium">{chartConfig[d.method].label}</span>
                  <span className="font-medium tabular-nums">{usd.format(d.amount)}</span>
                  <span aria-hidden />
                  <span className="text-xs text-muted-foreground">
                    {d.payments} {d.payments === 1 ? "payment" : "payments"}
                  </span>
                  <span className="text-right text-xs text-muted-foreground tabular-nums">{pct(d.amount)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">
          {COUNT} payments, {usd.format(Math.round(TOTAL / COUNT))} on average
        </p>
        <p className="text-muted-foreground">Card payouts land in 2 days, transfers in 1 to 3</p>
      </CardFooter>
    </Card>
  )
}
