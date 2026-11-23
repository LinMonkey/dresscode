"use client"

// Charts in Folio: the stock shadcn chart (recharts) with Folio's tokens. Press red is the first
// series and ink the second; the grid is a hairline, axes are the rule color, and fills are flat.
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts"

import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const axis = {
  tickLine: false,
  axisLine: { stroke: "var(--color-rule)" },
  tickMargin: 8,
  tick: { fill: "var(--color-ink-2)" },
} as const

const rates = [
  { month: "Feb", now: 48.2, before: 45.1 },
  { month: "Mar", now: 49.0, before: 46.0 },
  { month: "Apr", now: 50.4, before: 45.4 },
  { month: "May", now: 49.6, before: 46.8 },
  { month: "Jun", now: 51.2, before: 47.2 },
  { month: "Jul", now: 52.0, before: 46.5 },
  { month: "Aug", now: 51.4, before: 47.9 },
  { month: "Sep", now: 52.8, before: 48.3 },
  { month: "Oct", now: 53.1, before: 47.6 },
  { month: "Nov", now: 52.4, before: 48.8 },
  { month: "Dec", now: 53.6, before: 49.1 },
  { month: "Jan", now: 54.8, before: 49.6 },
]

const ratesConfig = {
  now: { label: "This year", color: "var(--chart-1)" },
  before: { label: "Last year", color: "var(--chart-2)" },
} satisfies ChartConfig

export function LineChartExample() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>Open rate, this year and last</h3>
        </CardTitle>
        <CardDescription>Average per issue, February to January</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ratesConfig} className="aspect-auto h-[240px] w-full">
          <LineChart data={rates} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} width={40} domain={[40, 60]} ticks={[40, 45, 50, 55, 60]} tickFormatter={(v: number) => `${v}%`} />
            <ChartTooltip cursor={{ stroke: "var(--color-divider)" }} content={<ChartTooltipContent indicator="line" formatter={(v, name) => `${ratesConfig[name as keyof typeof ratesConfig].label} ${v}%`} />} />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            <Line dataKey="now" type="linear" stroke="var(--color-now)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-now)", stroke: "none" }} />
            <Line dataKey="before" type="linear" stroke="var(--color-before)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const readers = [
  { week: "Dec 1", email: 6120, web: 2040, app: 980 },
  { week: "Dec 8", email: 6260, web: 2190, app: 1010 },
  { week: "Dec 15", email: 6180, web: 2420, app: 1080 },
  { week: "Dec 22", email: 5740, web: 2010, app: 940 },
  { week: "Dec 29", email: 5920, web: 2280, app: 1020 },
  { week: "Jan 5", email: 6480, web: 2510, app: 1130 },
  { week: "Jan 12", email: 6610, web: 2620, app: 1190 },
  { week: "Jan 19", email: 6720, web: 2580, app: 1240 },
  { week: "Jan 26", email: 6890, web: 2760, app: 1310 },
]

const readersConfig = {
  email: { label: "Email", color: "var(--chart-1)" },
  web: { label: "Web", color: "var(--chart-2)" },
  app: { label: "App", color: "var(--chart-3)" },
} satisfies ChartConfig

export function AreaChartExample() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>Where people read</h3>
        </CardTitle>
        <CardDescription>Weekly readers, stacked by where they opened the issue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={readersConfig} className="aspect-auto h-[240px] w-full">
          <AreaChart data={readers} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
            <XAxis dataKey="week" {...axis} minTickGap={16} />
            <YAxis {...axis} width={44} tickFormatter={(v: number) => `${v / 1000}k`} />
            <ChartTooltip cursor={{ stroke: "var(--color-divider)" }} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            {(["email", "web", "app"] as const).map((k) => (
              <Area key={k} dataKey={k} stackId="readers" type="linear" stroke={`var(--color-${k})`} strokeWidth={1.5} fill={`var(--color-${k})`} fillOpacity={0.14} />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const issues = [
  { issue: "Dec 7", opens: 6120, clicks: 812 },
  { issue: "Dec 14", opens: 6380, clicks: 904 },
  { issue: "Dec 21", opens: 5910, clicks: 760 },
  { issue: "Jan 4", opens: 6640, clicks: 1010 },
  { issue: "Jan 11", opens: 6810, clicks: 968 },
  { issue: "Jan 18", opens: 7020, clicks: 1124 },
]

const issuesConfig = {
  opens: { label: "Opens", color: "var(--chart-1)" },
  clicks: { label: "Clicks", color: "var(--chart-2)" },
} satisfies ChartConfig

export function BarChartExample() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>Opens and clicks by issue</h3>
        </CardTitle>
        <CardDescription>The last six issues</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={issuesConfig} className="aspect-auto h-[240px] w-full">
          <BarChart data={issues} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
            <XAxis dataKey="issue" {...axis} />
            <YAxis {...axis} width={44} tickFormatter={(v: number) => `${v / 1000}k`} />
            <ChartTooltip cursor={{ fill: "var(--color-secondary)" }} content={<ChartTooltipContent />} />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            <Bar dataKey="opens" fill="var(--color-opens)" maxBarSize={22} />
            <Bar dataKey="clicks" fill="var(--color-clicks)" maxBarSize={22} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const plans = [
  { month: "Aug", monthly: 14, yearly: 9, founding: 2 },
  { month: "Sep", monthly: 12, yearly: 11, founding: 1 },
  { month: "Oct", monthly: 16, yearly: 8, founding: 3 },
  { month: "Nov", monthly: 11, yearly: 6, founding: 1 },
  { month: "Dec", monthly: 9, yearly: 14, founding: 4 },
  { month: "Jan", monthly: 18, yearly: 12, founding: 2 },
]

const plansConfig = {
  monthly: { label: "Monthly", color: "var(--chart-1)" },
  yearly: { label: "Yearly", color: "var(--chart-2)" },
  founding: { label: "Founding", color: "var(--chart-4)" },
} satisfies ChartConfig

export function StackedBarChartExample() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>New paid subscribers by plan</h3>
        </CardTitle>
        <CardDescription>Upgrades each month, August to January</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={plansConfig} className="aspect-auto h-[240px] w-full">
          <BarChart data={plans} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} width={32} allowDecimals={false} />
            <ChartTooltip cursor={{ fill: "var(--color-secondary)" }} content={<ChartTooltipContent />} />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            <Bar dataKey="monthly" stackId="plan" fill="var(--color-monthly)" maxBarSize={36} />
            <Bar dataKey="yearly" stackId="plan" fill="var(--color-yearly)" maxBarSize={36} />
            <Bar dataKey="founding" stackId="plan" fill="var(--color-founding)" maxBarSize={36} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const sources = [
  { source: "Direct", readers: 412 },
  { source: "Search", readers: 268 },
  { source: "Recommendations", readers: 221 },
  { source: "Social", readers: 133 },
  { source: "Referrals", readers: 96 },
]

const sourcesConfig = { readers: { label: "New readers", color: "var(--chart-1)" } } satisfies ChartConfig

export function HorizontalBarChartExample() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>Where new readers came from</h3>
        </CardTitle>
        <CardDescription>1,130 sign-ups in January</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={sourcesConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={sources} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
            <XAxis type="number" dataKey="readers" hide />
            <YAxis type="category" dataKey="source" {...axis} axisLine={false} width={128} tick={{ fill: "var(--color-ink)" }} />
            <ChartTooltip cursor={{ fill: "var(--color-secondary)" }} content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="readers" fill="var(--color-readers)" barSize={18} background={{ fill: "var(--color-newsprint)" }}>
              <LabelList dataKey="readers" position="right" offset={8} className="fill-foreground tabular-nums" fontSize={13} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const revenue = [
  { plan: "monthly", amount: 3120, fill: "var(--color-monthly)" },
  { plan: "yearly", amount: 2980, fill: "var(--color-yearly)" },
  { plan: "founding", amount: 840, fill: "var(--color-founding)" },
] as const

const revenueConfig = {
  amount: { label: "Revenue" },
  monthly: { label: "Monthly", color: "var(--chart-1)" },
  yearly: { label: "Yearly", color: "var(--chart-2)" },
  founding: { label: "Founding", color: "var(--chart-4)" },
} satisfies ChartConfig

const money = (v: number) => `$${v.toLocaleString("en-US")}`

export function DonutChartExample() {
  const total = revenue.reduce((s, r) => s + r.amount, 0)
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h3>Revenue by plan</h3>
        </CardTitle>
        <CardDescription>January 2026</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-6 sm:grid-cols-[220px_1fr]">
        <ChartContainer config={revenueConfig} className="mx-auto aspect-square h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="plan" hideLabel formatter={(v, name) => `${revenueConfig[name as keyof typeof revenueConfig].label} ${money(Number(v))}`} />} />
            <Pie data={revenue} dataKey="amount" nameKey="plan" innerRadius={66} outerRadius={96} strokeWidth={2} stroke="var(--color-paper)">
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan x={viewBox.cx} dy="-2" className="fill-foreground font-serif text-[26px] font-bold">
                        {money(total)}
                      </tspan>
                      <tspan x={viewBox.cx} dy="22" className="fill-muted-foreground text-[13px]">
                        this month
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="divide-y divide-hairline text-[15px]">
          {revenue.map((r) => (
            <li key={r.plan} className="flex items-center gap-3 py-2">
              <span className="size-[10px] rounded-full" style={{ background: revenueConfig[r.plan].color }} aria-hidden />
              {revenueConfig[r.plan].label}
              <span className="ml-auto tabular-nums">{money(r.amount)}</span>
              <span className="w-12 text-right text-ink-2 tabular-nums">{Math.round((r.amount / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const goal = { paid: 618, target: 700 }
const goalConfig = { paid: { label: "Paid subscribers", color: "var(--chart-1)" } } satisfies ChartConfig

export function RadialChartExample() {
  return (
    <Card className="w-full max-w-[360px]">
      <CardHeader>
        <CardTitle>
          <h3>Goal: 700 paid subscribers</h3>
        </CardTitle>
        <CardDescription>By the end of March</CardDescription>
      </CardHeader>
      <CardContent className="pb-[12px]">
        <ChartContainer config={goalConfig} className="mx-auto aspect-[2/1] h-[150px]">
          <RadialBarChart data={[goal]} startAngle={180} endAngle={0} cy="100%" innerRadius={104} outerRadius={136}>
            <PolarAngleAxis type="number" domain={[0, goal.target]} tick={false} axisLine={false} />
            <RadialBar dataKey="paid" fill="var(--color-paid)" background={{ fill: "var(--color-newsprint)" }} isAnimationActive={false}>
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox ? (
                    <text x={viewBox.cx} y={(viewBox.cy ?? 0) - 30} textAnchor="middle">
                      <tspan x={viewBox.cx} className="fill-foreground font-serif text-[32px] font-bold">
                        {goal.paid}
                      </tspan>
                      <tspan x={viewBox.cx} dy="24" className="fill-muted-foreground text-[13px]">
                        of {goal.target}, {Math.round((goal.paid / goal.target) * 100)}%
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-[14px] text-ink-2">82 to go, about 14 a week at the current pace</CardFooter>
    </Card>
  )
}

const kpis = [
  { label: "Subscribers", value: "12,480", change: "+4.2% in 30 days", trend: [11820, 11910, 11880, 12010, 12090, 12160, 12230, 12290, 12380, 12480] },
  { label: "Open rate", value: "52.3%", change: "+2.1 points", trend: [49.8, 50.6, 50.1, 51.4, 50.9, 51.8, 52.6, 51.9, 52.8, 52.3] },
  { label: "Revenue", value: "$6,940", change: "+7.3% in 30 days", trend: [6120, 6180, 6260, 6240, 6410, 6520, 6580, 6710, 6820, 6940] },
]

const sparkConfig = { value: { label: "Value", color: "var(--chart-1)" } } satisfies ChartConfig

export function SparklineExample() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {kpis.map((k) => (
        <Card key={k.label} className="gap-1 py-4">
          <CardContent className="px-4">
            <p className="text-[14px] text-ink-2">{k.label}</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="font-serif text-[28px] leading-none font-bold tracking-[-0.02em] tabular-nums">{k.value}</p>
              <ChartContainer config={sparkConfig} className="aspect-auto h-[32px] w-[88px]">
                <LineChart data={k.trend.map((value) => ({ value }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Line dataKey="value" type="linear" stroke="var(--color-value)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ChartContainer>
            </div>
            <p className="mt-2 text-[13px] text-ink-2">{k.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
