"use client"

// Reports: revenue against last year, invoiced against collected, days to get paid, payment methods,
// top clients and the age of what is still owed. The period select reshapes every chart and figure.
import { Download, Mail } from "lucide-react"
import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { SimpleSelect, opts } from "./controls"
import { CLIENTS, LAST_YEAR, MONTHS, PAYMENTS, THIS_YEAR, money, moneyShort } from "./data"
import { ChartTip, PageHeader, Panel, StatCard, Swatch } from "./ui"

const PERIODS = { "Year to date": 11, "Last 6 months": 6, "Last 3 months": 3 } as const
type Period = keyof typeof PERIODS

// Invoiced runs a little ahead of cash in; days to get paid has come down all year.
const INVOICED = [19, 24, 21, 27, 26, 31, 30, 35, 33, 40, 48.2]
const DAYS = [19, 18, 18, 17, 16, 16, 15, 14, 14, 13, 11]

const revenueConfig = {
  thisYear: { label: "2026", color: "var(--chart-1)" },
  lastYear: { label: "2025", color: "var(--chart-4)" },
} satisfies ChartConfig
const flowConfig = {
  invoiced: { label: "Invoiced", color: "var(--chart-2)" },
  collected: { label: "Collected", color: "var(--chart-1)" },
} satisfies ChartConfig
const daysConfig = { days: { label: "Days to get paid", color: "var(--chart-1)" } } satisfies ChartConfig
const METHOD_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)", "var(--chart-4)"]
const AGING = [
  { bucket: "Not due yet", amount: 6750, invoices: 3, color: "var(--chart-1)" },
  { bucket: "1 to 15 days late", amount: 1860, invoices: 1, color: "var(--chart-2)" },
  { bucket: "16 to 30 days late", amount: 1250, invoices: 1, color: "var(--dc-danger)" },
  { bucket: "Over 30 days late", amount: 0, invoices: 0, color: "var(--chart-4)" },
]

export function ReportsScreen() {
  const [period, setPeriod] = useState<Period>("Year to date")
  const n = PERIODS[period]
  const from = MONTHS.length - n
  const months = MONTHS.slice(from)
  const revenue = months.map((m, i) => ({ month: m, thisYear: THIS_YEAR[from + i] * 1000, lastYear: LAST_YEAR[from + i] * 1000 }))
  const flow = months.map((m, i) => ({ month: m, invoiced: INVOICED[from + i] * 1000, collected: THIS_YEAR[from + i] * 1000 }))
  const days = months.map((m, i) => ({ month: m, days: DAYS[from + i] }))
  const collected = revenue.reduce((s, r) => s + r.thisYear, 0)
  const before = revenue.reduce((s, r) => s + r.lastYear, 0)
  const invoiced = flow.reduce((s, r) => s + r.invoiced, 0)
  const methods = ["Card", "Bank transfer", "ACH debit", "PayPal"].map((m) => ({
    name: m,
    value: PAYMENTS.filter((p) => p.method === m && p.status === "Succeeded").reduce((s, p) => s + p.amount, 0),
  }))
  const methodTotal = methods.reduce((s, m) => s + m.value, 0)
  const top = [...CLIENTS].sort((a, b) => b.billed - a.billed).slice(0, 6)
  const owed = AGING.reduce((s, a) => s + a.amount, 0)

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Reports"
        description={`${period}: ${months[0]} 1 to Nov 24, 2026`}
        actions={
          <>
            <SimpleSelect label="Period" value={period} onChange={(v) => setPeriod(v as Period)} options={opts(...Object.keys(PERIODS))} className="w-[160px]" />
            <Button variant="outline" onClick={() => toast.success("Monthly report scheduled", { description: "Arrives on the 1st, to ada@ruizstudio.co." })}>
              <Mail /> Email monthly
            </Button>
            <Button variant="outline" onClick={() => toast(`Exporting ${period.toLowerCase()} as PDF…`)}>
              <Download /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Collected" value={moneyShort(collected)} note={`+${Math.round((collected / before - 1) * 100)}% on the same months of 2025`} trend="up" highlight />
        <StatCard label="Invoiced" value={moneyShort(invoiced)} note={`${Math.round((collected / invoiced) * 100)}% of it collected`} />
        <StatCard label="Average invoice" value={money(2870)} note="Up from $2,410" trend="up" />
        <StatCard label="Days to get paid" value={String(days[days.length - 1].days)} note={`Down from ${days[0].days} in ${months[0]}`} trend="down" />
      </div>

      <Panel
        title="Revenue"
        description="Cash collected each month, against the same month last year"
        action={<Legend items={[["2026", "var(--chart-1)"], ["2025", "var(--chart-4)"]]} />}
      >
        <ChartContainer config={revenueConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart data={revenue} margin={{ left: -8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="oa-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-thisYear)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-thisYear)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => `$${v / 1000}k`} />
            <ChartTooltip content={<ChartTip format={moneyShort} />} />
            <Area dataKey="lastYear" name="2025" type="monotone" stroke="var(--color-lastYear)" strokeDasharray="5 4" strokeWidth={1.5} fill="transparent" animationDuration={500} />
            <Area dataKey="thisYear" name="2026" type="monotone" stroke="var(--color-thisYear)" strokeWidth={2.25} fill="url(#oa-rev)" animationDuration={500} />
          </AreaChart>
        </ChartContainer>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Invoiced and collected" description="What you billed against what came in" action={<Legend items={[["Invoiced", "var(--chart-2)"], ["Collected", "var(--chart-1)"]]} />}>
          <ChartContainer config={flowConfig} className="aspect-auto h-[220px] w-full">
            <BarChart data={flow} barGap={2} margin={{ left: -8, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => `$${v / 1000}k`} />
              <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTip format={moneyShort} />} />
              <Bar dataKey="invoiced" name="Invoiced" fill="var(--color-invoiced)" radius={[3, 3, 0, 0]} maxBarSize={16} animationDuration={500} />
              <Bar dataKey="collected" name="Collected" fill="var(--color-collected)" radius={[3, 3, 0, 0]} maxBarSize={16} animationDuration={500} />
            </BarChart>
          </ChartContainer>
        </Panel>
        <Panel title="Days to get paid" description="From sending an invoice to the money arriving. Your terms are 14 days.">
          <ChartContainer config={daysConfig} className="aspect-auto h-[220px] w-full">
            <LineChart data={days} margin={{ left: -16, right: 12, top: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} domain={[0, 21]} ticks={[0, 7, 14, 21]} />
              <ReferenceLine y={14} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "Terms", position: "insideTopRight", fontSize: 11, fill: "var(--muted-foreground)" }} />
              <ChartTooltip content={<ChartTip format={(v) => `${v} days`} />} />
              <Line dataKey="days" name="Days" type="monotone" stroke="var(--color-days)" strokeWidth={2.25} dot={{ r: 3, fill: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 4 }} animationDuration={500} />
            </LineChart>
          </ChartContainer>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Payment methods" description="Share of money collected">
          <div className="relative">
            <ChartContainer config={{}} className="mx-auto aspect-square h-[190px]">
              <PieChart>
                <ChartTooltip content={<ChartTip format={moneyShort} />} />
                <Pie data={methods} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={2} strokeWidth={0} animationDuration={500}>
                  {methods.map((m, i) => (
                    <Cell key={m.name} fill={METHOD_COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <p className="dc-num text-[18px] font-semibold">{Math.round((methods[0].value / methodTotal) * 100)}%</p>
              <p className="text-[11px] text-muted-foreground">by card</p>
            </div>
          </div>
          <ul className="mt-3 grid gap-1.5 text-[13px]">
            {methods.map((m, i) => (
              <li key={m.name} className="flex items-center gap-2">
                <Swatch color={METHOD_COLORS[i]} />
                {m.name}
                <span className="dc-num ml-auto text-muted-foreground">{Math.round((m.value / methodTotal) * 100)}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top clients" description="Billed in total">
          <ul className="grid gap-3">
            {top.map((c, i) => (
              <li key={c.id} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="dc-num shrink-0 text-muted-foreground">{moneyShort(c.billed)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", i === 0 ? "bg-[color:var(--chart-1)]" : "bg-[color:var(--chart-2)]")} style={{ width: `${(c.billed / top[0].billed) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Still owed, by age" description={`${money(owed)} across 5 invoices`}>
          <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Owed by age">
            {AGING.filter((a) => a.amount).map((a) => (
              <span key={a.bucket} className="h-full border-r-2 border-[color:var(--card)] last:border-r-0" style={{ width: `${(a.amount / owed) * 100}%`, background: a.color }} />
            ))}
          </div>
          <table className="mt-4 w-full text-[13px]">
            <thead className="sr-only">
              <tr>
                <th>Age</th>
                <th>Invoices</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {AGING.map((a) => (
                <tr key={a.bucket} className="border-b border-border last:border-0">
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      <Swatch color={a.color} />
                      {a.bucket}
                    </span>
                  </td>
                  <td className="dc-num py-2 text-right text-muted-foreground">{a.invoices}</td>
                  <td className={cn("dc-num w-24 py-2 text-right font-medium", !a.amount && "text-muted-foreground")}>{moneyShort(a.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 rounded-[calc(var(--radius)+2px)] bg-muted/60 px-3 py-2.5 text-[13px] leading-snug">
            <span className="font-semibold">Oldest:</span> INV-1036, Pellucid Health, 15 days late. Its next reminder mentions the late fee.
          </p>
        </Panel>
      </div>
    </div>
  )
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="hidden items-center gap-3 text-[12px] text-muted-foreground sm:flex">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <Swatch color={color} /> {label}
        </span>
      ))}
    </div>
  )
}
