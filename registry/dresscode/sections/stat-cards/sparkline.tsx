"use client"

// Stat cards with small charts: four wide cards, the figure on the left and its own chart on the right,
// each chart the shape that suits the number: a running total against last month, weekly bars, a line
// against your payment terms and a stepped balance. The charts are pictures for sighted readers (with a
// tooltip on hover); each card says what its chart shows in a sentence for screen readers. The charts don't
// animate in: a draw-in that starts before the card has its real width can stop part way.
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"
import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`

// Money in each day of November so far, and on the same days of October.
const NOV_DAILY = [0, 1200, 3400, 0, 860, 2300, 0, 0, 4200, 1860, 640, 7450, 0, 2100, 0, 980, 3900, 2300, 0, 1500, 6200, 1250, 3570, 4500]
const OCT_DAILY = [800, 0, 2600, 1900, 0, 0, 3200, 1500, 0, 4100, 2250, 0, 0, 1800, 3600, 900, 0, 5200, 0, 0, 2750, 3900, 1480, 6900]
const running = (xs: number[]) => xs.map((_, i) => xs.slice(0, i + 1).reduce((a, b) => a + b, 0))
const NOV_RUN = running(NOV_DAILY)
const OCT_RUN = running(OCT_DAILY)
const REVENUE = NOV_RUN.map((nov, i) => ({ day: i + 1, nov, oct: OCT_RUN[i] }))

// Invoices sent each week (weeks start on Sunday); the last four are November's.
const WEEKS = ["Sep 6", "Sep 13", "Sep 20", "Sep 27", "Oct 4", "Oct 11", "Oct 18", "Oct 25", "Nov 1", "Nov 8", "Nov 15", "Nov 22"]
const SENT = [5, 4, 6, 5, 4, 5, 6, 4, 6, 7, 6, 4].map((count, i) => ({ week: WEEKS[i], count, now: i >= 8 }))

// Average days from sending an invoice to the money arriving, by month.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
const DAYS = [19, 18, 18, 17, 16, 16, 15, 15, 14, 14, 11].map((days, i) => ({ month: MONTHS[i], days }))

// What clients owe you at the end of each day: invoices sent push it up, payments bring it down.
const OWED = [8420, 8420, 11820, 11820, 10960, 10960, 10960, 10960, 6760, 6760, 6120, 6120, 9520, 9520, 9520, 8540, 12440, 10140, 10140, 8640, 11950, 10700, 10700, 9860].map(
  (owed, i) => ({ day: i + 1, owed }),
)

const revenueConfig = { nov: { label: "November", color: "var(--chart-1)" }, oct: { label: "October", color: "var(--muted-foreground)" } } satisfies ChartConfig
const sentConfig = { count: { label: "Invoices", color: "var(--chart-1)" } } satisfies ChartConfig
const daysConfig = { days: { label: "Days", color: "var(--chart-1)" } } satisfies ChartConfig
const owedConfig = { owed: { label: "Outstanding", color: "var(--chart-1)" } } satisfies ChartConfig

type TipProps = {
  active?: boolean
  label?: string | number
  payload?: ReadonlyArray<{ name?: string | number; value?: unknown; color?: string; payload?: { fill?: string } }>
  title: (label: string | number | undefined) => ReactNode
  format: (v: number) => string
}

/** A small themed tooltip: the day, week or month, then one line per series. */
function Tip({ active, label, payload, title, format }: Partial<TipProps> & Pick<TipProps, "title" | "format">) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-32 rounded-[var(--radius)] border border-border bg-popover px-2.5 py-1.5 text-[12px] text-popover-foreground shadow-md">
      <p className="mb-0.5 font-semibold">{title(label)}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-[2px]" style={{ background: p.color ?? p.payload?.fill }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="dc-num ml-auto pl-3 font-semibold">{format(Number(p.value))}</span>
        </p>
      ))}
    </div>
  )
}

function Legend({ items }: { items: { label: string; swatch: "solid" | "dashed" | "faint" }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3.5 gap-y-1 text-[12px] text-muted-foreground" aria-hidden="true">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          {it.swatch === "dashed" ? (
            <span className="w-3.5 border-t-2 border-dashed border-[color:var(--muted-foreground)]" />
          ) : (
            <span className={cn("size-2.5 rounded-[3px] bg-[color:var(--chart-1)]", it.swatch === "faint" && "opacity-35")} />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  )
}

function StatChartCard({
  title,
  value,
  change,
  up,
  good,
  against,
  legend,
  summary,
  axis,
  children,
}: {
  title: string
  value: string
  change: string
  up: boolean
  good: boolean
  against: string
  legend: ReactNode
  summary: string
  axis: [string, string]
  children: ReactNode
}) {
  const Arrow = up ? ArrowUpRight : ArrowDownRight
  return (
    <article className="dc-card grid gap-5 p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
      <div className="flex flex-col">
        <h3 className="text-[14px] font-medium text-muted-foreground">{title}</h3>
        <p className="dc-num mt-2 text-[30px] leading-none font-semibold tracking-tight">{value}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
          <span className={cn("dc-pill", good ? "dc-pill-hl" : "dc-pill-danger")}>
            <Arrow className="size-3.5" aria-hidden="true" />
            <span className="dc-num">{change}</span>
          </span>
          {against}
          <span className="sr-only">{good ? ", a good change." : ", a change for the worse."}</span>
        </p>
        <div className="mt-auto pt-5">{legend}</div>
      </div>
      <div className="flex min-w-0 flex-col justify-end">
        <p className="sr-only">{summary}</p>
        <div aria-hidden="true">
          {children}
          <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
            <span>{axis[0]}</span>
            <span>{axis[1]}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

const chartBox = "aspect-auto h-[128px] w-full [&_g[tabindex]]:outline-hidden"

export default function StatCardsSparkline() {
  return (
    <section aria-labelledby="stat-cards-sparkline-title" className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8">
      <div>
        <h2 id="stat-cards-sparkline-title" className="dc-h text-[24px] leading-tight sm:text-[28px]">
          Cash flow
        </h2>
        <p className="mt-1.5 text-[15px] text-muted-foreground">How money moved in November, with the weeks and months behind it.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <StatChartCard
          title="Revenue, month to date"
          value={usd(NOV_RUN[NOV_RUN.length - 1])}
          change="+12.4%"
          up
          good
          against="on October"
          legend={<Legend items={[{ label: "November", swatch: "solid" }, { label: "October", swatch: "dashed" }]} />}
          summary={`A running total from Nov 1 to Nov 24, reaching ${usd(NOV_RUN[23])}; October had reached ${usd(OCT_RUN[23])} by the same day.`}
          axis={["Nov 1", "Nov 24"]}
        >
          <ChartContainer config={revenueConfig} className={chartBox}>
            <AreaChart data={REVENUE} margin={{ top: 6, right: 2, bottom: 0, left: 2 }} accessibilityLayer={false}>
              <defs>
                <linearGradient id="stat-cards-sparkline-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-nov)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-nov)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[0, "dataMax"]} />
              <ChartTooltip cursor={{ stroke: "var(--border)" }} content={<Tip title={(d) => `Nov ${d}`} format={usd} />} />
              <Area dataKey="oct" name="October" type="monotone" stroke="var(--color-oct)" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" dot={false} isAnimationActive={false} />
              <Area dataKey="nov" name="November" type="monotone" stroke="var(--color-nov)" strokeWidth={2.25} fill="url(#stat-cards-sparkline-rev)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </StatChartCard>

        <StatChartCard
          title="Invoices sent"
          value="23"
          change="+4"
          up
          good
          against="on October so far"
          legend={<Legend items={[{ label: "November weeks", swatch: "solid" }, { label: "Earlier", swatch: "faint" }]} />}
          summary="Invoices sent each week for the last 12 weeks, between 4 and 7 a week; 23 in November's four weeks."
          axis={["Week of Sep 6", "Nov 22"]}
        >
          <ChartContainer config={sentConfig} className={chartBox}>
            <BarChart data={SENT} margin={{ top: 6, right: 0, bottom: 0, left: 0 }} barCategoryGap="22%" accessibilityLayer={false}>
              <XAxis dataKey="week" hide />
              <YAxis hide domain={[0, "dataMax"]} />
              <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<Tip title={(w) => `Week of ${w}`} format={(v) => `${v} sent`} />} />
              <Bar dataKey="count" name="Invoices" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {SENT.map((w) => (
                  <Cell key={w.week} fill="var(--color-count)" fillOpacity={w.now ? 1 : 0.35} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </StatChartCard>

        <StatChartCard
          title="Days to get paid"
          value="11 days"
          change="−3 days"
          up={false}
          good
          against="on October"
          legend={<Legend items={[{ label: "Monthly average", swatch: "solid" }, { label: "Your terms, 14 days", swatch: "dashed" }]} />}
          summary="The average days to get paid each month this year, falling from 19 in January to 11 in November, now under your 14-day terms."
          axis={["Jan", "Nov"]}
        >
          <ChartContainer config={daysConfig} className={chartBox}>
            <LineChart data={DAYS} margin={{ top: 8, right: 6, bottom: 4, left: 6 }} accessibilityLayer={false}>
              <XAxis dataKey="month" hide />
              <YAxis hide domain={[8, 21]} />
              <ReferenceLine y={14} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeOpacity={0.8} />
              <ChartTooltip cursor={{ stroke: "var(--border)" }} content={<Tip title={(m) => String(m)} format={(v) => `${v} days`} />} />
              <Line
                dataKey="days"
                name="Average"
                type="monotone"
                stroke="var(--color-days)"
                strokeWidth={2.25}
                dot={{ r: 2.5, fill: "var(--card)", strokeWidth: 2 }}
                activeDot={{ r: 4, fill: "var(--color-days)", stroke: "var(--card)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </StatChartCard>

        <StatChartCard
          title="Outstanding"
          value={usd(OWED[OWED.length - 1].owed)}
          change="+17.1%"
          up
          good={false}
          against="on Nov 1"
          legend={<p className="text-[12px] text-muted-foreground">2 invoices are late: $3,110</p>}
          summary="What clients owed at the end of each day of November: it rose as invoices went out and fell as they were paid, from $8,420 on Nov 1 to $9,860 today."
          axis={["Nov 1", "Nov 24"]}
        >
          <ChartContainer config={owedConfig} className={chartBox}>
            <AreaChart data={OWED} margin={{ top: 6, right: 2, bottom: 0, left: 2 }} accessibilityLayer={false}>
              <defs>
                <linearGradient id="stat-cards-sparkline-owed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-owed)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-owed)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[0, "dataMax"]} />
              <ChartTooltip cursor={{ stroke: "var(--border)" }} content={<Tip title={(d) => `End of Nov ${d}`} format={usd} />} />
              <Area dataKey="owed" name="Owed" type="stepAfter" stroke="var(--color-owed)" strokeWidth={2} fill="url(#stat-cards-sparkline-owed)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </StatChartCard>
      </div>
    </section>
  )
}
