"use client"

// Quarter goals as radial progress rings: one ring per goal on a faint track, the days left in the
// centre, and a list that names each ring with its figure, its target and whether it is on pace.
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

// One hue in three strengths, mixed toward the card, so the rings read in any theme and either mode.
const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  recurring: { label: "Monthly recurring", color: "color-mix(in oklab, var(--chart-1) 68%, var(--card))" },
  clients: { label: "New clients", color: "color-mix(in oklab, var(--chart-1) 42%, var(--card))" },
} satisfies ChartConfig
type Goal = keyof typeof chartConfig

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

// Sample data: Q4 2026 (Oct 1 to Dec 31) on Nov 24, day 55 of 92.
const DAYS_GONE = 55
const DAYS_IN_QUARTER = 92
const PACE = (DAYS_GONE / DAYS_IN_QUARTER) * 100

const GOALS: { goal: Goal; value: number; target: number; format: (n: number) => string }[] = [
  { goal: "revenue", value: 142600, target: 180000, format: usd.format },
  { goal: "recurring", value: 26400, target: 30000, format: (n) => `${usd.format(n)}/mo` },
  { goal: "clients", value: 8, target: 15, format: String },
]
const rows = GOALS.map((g) => {
  const progress = Math.min(100, (g.value / g.target) * 100)
  return { ...g, progress, onPace: progress >= PACE, fill: `var(--color-${g.goal})` }
})
const onPace = rows.filter((r) => r.onPace).length
const behind = rows.find((r) => !r.onPace)

export default function ChartsRadial() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Quarter goals</CardTitle>
        <CardDescription>Q4 2026, October 1 to December 31</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-6 sm:grid-cols-[minmax(0,230px)_1fr] sm:gap-8">
        <div className="relative mx-auto aspect-square w-full max-w-[230px]">
          <ChartContainer
            config={chartConfig}
            className="aspect-square w-full [&_.recharts-radial-bar-background-sector]:fill-foreground/8 [&_g[tabindex]]:outline-hidden"
            aria-hidden
          >
            {/* The first ring in the data is the innermost, so the list's first goal goes last. */}
            <RadialBarChart
              data={rows.map(({ goal, progress, fill }) => ({ goal, progress, fill })).reverse()}
              startAngle={90}
              endAngle={-270}
              innerRadius="40%"
              outerRadius="100%"
              barSize={15}
              accessibilityLayer={false}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
              <RadialBar dataKey="progress" background cornerRadius={8} />
            </RadialBarChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{DAYS_IN_QUARTER - DAYS_GONE}</span>
            <span className="text-xs text-muted-foreground">days left</span>
          </div>
        </div>
        <ul className="grid gap-4" aria-label="Goals">
          {rows.map((r) => (
            <li key={r.goal} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-1">
              <span className="mt-1 size-3 rounded-full ring-1 ring-foreground/10 ring-inset" style={{ background: chartConfig[r.goal].color }} aria-hidden />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                  {chartConfig[r.goal].label}
                  <Badge variant={r.onPace ? "secondary" : "outline"}>{r.onPace ? "On pace" : "Behind pace"}</Badge>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                  {r.format(r.value)} of {r.format(r.target)}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums">
                {Math.round(r.progress)}%<span className="sr-only"> of the target</span>
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">
          {onPace} of {rows.length} goals on pace, {Math.round(PACE)}% of the quarter gone
        </p>
        {behind ? (
          <p className="text-muted-foreground">
            {chartConfig[behind.goal].label} needs {behind.format(behind.target - behind.value)} more by December 31
          </p>
        ) : null}
      </CardFooter>
    </Card>
  )
}
