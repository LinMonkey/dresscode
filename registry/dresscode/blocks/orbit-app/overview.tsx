"use client"

// Overview: what came in, what is owed, what is late. Stat cards and the cash-in chart are the
// landing page's product shot made real; the late-invoice alert sits on top when there is one.
import { ArrowRight, BellRing, CalendarClock, Check, CircleDollarSign, Clock3, Eye, FileText, TriangleAlert, Users, Wallet, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { useOrbit } from "./context"
import { Head, SimpleSelect, opts } from "./controls"
import { INVOICES, LAST_YEAR, MONTHS, ME, OVERDUE, OVERDUE_TOTAL, PAYOUT, THIS_YEAR, clientById, money, moneyShort } from "./data"
import { ChartTip, ClientMark, PageHeader, Panel, StatCard, StatusPill, Swatch, flat } from "./ui"

const PERIODS = {
  "This month": [
    { label: "Revenue", value: "$48,210", note: "+12.4% on October", trend: "up" as const, icon: CircleDollarSign },
    { label: "Outstanding", value: "$9,860", note: "5 invoices", icon: FileText },
    { label: "Clients", value: "64", note: "+6 this month", trend: "up" as const, icon: Users },
    { label: "Days to get paid", value: "11", note: "3 days faster", trend: "down" as const, icon: Clock3 },
  ],
  "Last month": [
    { label: "Revenue", value: "$42,880", note: "+3.1% on September", trend: "up" as const, icon: CircleDollarSign },
    { label: "Outstanding", value: "$12,140", note: "7 invoices", icon: FileText },
    { label: "Clients", value: "58", note: "+4 that month", trend: "up" as const, icon: Users },
    { label: "Days to get paid", value: "14", note: "1 day faster", trend: "down" as const, icon: Clock3 },
  ],
  "This quarter": [
    { label: "Revenue", value: "$91,090", note: "+18.6% on Q3", trend: "up" as const, icon: CircleDollarSign },
    { label: "Outstanding", value: "$9,860", note: "5 invoices", icon: FileText },
    { label: "Clients", value: "64", note: "+10 this quarter", trend: "up" as const, icon: Users },
    { label: "Days to get paid", value: "12", note: "4 days faster", trend: "down" as const, icon: Clock3 },
  ],
  "This year": [
    { label: "Revenue", value: "$326,480", note: "+36% on 2025", trend: "up" as const, icon: CircleDollarSign },
    { label: "Outstanding", value: "$9,860", note: "5 invoices", icon: FileText },
    { label: "Clients", value: "64", note: "+29 this year", trend: "up" as const, icon: Users },
    { label: "Days to get paid", value: "13", note: "6 days faster", trend: "down" as const, icon: Clock3 },
  ],
}
type Period = keyof typeof PERIODS

export const CASH_DATA = MONTHS.map((m, i) => ({ month: m, thisYear: THIS_YEAR[i] * 1000, lastYear: LAST_YEAR[i] * 1000 }))
export const cashConfig = {
  thisYear: { label: "2026", color: "var(--chart-1)" },
  lastYear: { label: "2025", color: "var(--chart-2)" },
} satisfies ChartConfig

export function OverviewScreen() {
  const { href } = useOrbit()
  const [period, setPeriod] = useState<Period>("This month")
  return (
    <div className="grid gap-6">
      <PageHeader
        title={`Good morning, ${ME.first}`}
        description="Tuesday, November 24. Here is where your money is."
        actions={
          <>
            <SimpleSelect label="Period" value={period} onChange={(v) => setPeriod(v as Period)} options={opts(...Object.keys(PERIODS))} className="w-[150px]" />
            <Button variant="outline" nativeButton={false} render={<Link href={href("reports")} />}>
              Full report
            </Button>
          </>
        }
      />
      <OverdueAlert />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {PERIODS[period].map((s, i) => (
          <StatCard key={s.label} {...s} highlight={i === 0} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <CashIn />
        <ComingIn />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <RecentInvoices />
        <Activity />
      </div>
    </div>
  )
}

function OverdueAlert() {
  const { href } = useOrbit()
  const [state, setState] = useState<"late" | "sent" | "hidden">("late")
  if (state === "hidden") return null
  const names = OVERDUE.map((i) => clientById(i.clientId).name)
  return (
    <div
      role="status"
      className="dc-card flex flex-col gap-3 bg-[color:color-mix(in_oklab,var(--dc-danger)_7%,var(--card))] p-4 sm:flex-row sm:items-center border-[color:color-mix(in_oklab,var(--dc-danger)_28%,var(--border))] in-[.dc-brutal]:border-[color:var(--dc-ink)]"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-danger)_14%,transparent)] text-[color:var(--dc-danger)]">
        {state === "sent" ? <Check className="size-4" aria-hidden="true" /> : <TriangleAlert className="size-4" aria-hidden="true" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold">
          {state === "sent" ? "Reminders sent just now" : `${OVERDUE.length} invoices are late: `}
          {state === "late" ? <span className="dc-num">{money(OVERDUE_TOTAL)}</span> : null}
        </p>
        <p className="text-[13px] text-muted-foreground">
          {state === "sent"
            ? `${names.join(" and ")} got a polite nudge with a payment link. We'll tell you when they open it.`
            : `${names[0]} is 4 days late and ${names[1]} 15. Their next automatic reminder goes out tomorrow at 9:00.`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" nativeButton={false} render={<Link href={href("invoices", { status: "Overdue" })} />}>
          Review
        </Button>
        {state === "late" ? (
          <Button
            className="font-semibold"
            onClick={() => {
              setState("sent")
              toast.success("2 reminders sent", { description: names.join(" and ") })
            }}
          >
            <BellRing /> Remind now
          </Button>
        ) : null}
        <Button variant="ghost" size="icon-sm" className={cn(flat, "text-muted-foreground")} aria-label="Dismiss" onClick={() => setState("hidden")}>
          <X />
        </Button>
      </div>
    </div>
  )
}

function CashIn() {
  const total = THIS_YEAR.reduce((a, b) => a + b, 0) * 1000
  const last = LAST_YEAR.reduce((a, b) => a + b, 0) * 1000
  return (
    <Panel
      title="Cash in"
      description="Payments received each month, 2026 against 2025"
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col"
      action={
        <div className="hidden items-center gap-3 text-[12px] text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <Swatch color="var(--chart-1)" /> 2026
          </span>
          <span className="flex items-center gap-1.5">
            <Swatch color="var(--chart-2)" /> 2025
          </span>
        </div>
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="dc-num text-[28px] leading-none font-semibold tracking-tight">{moneyShort(total)}</p>
        <p className="text-[13px] text-muted-foreground">
          so far this year, <span className="font-semibold text-foreground">+{Math.round((total / last - 1) * 100)}%</span> on 2025
        </p>
      </div>
      <ChartContainer config={cashConfig} className="mt-4 aspect-auto h-[240px] w-full flex-1 lg:h-auto lg:min-h-[240px]">
        <BarChart data={CASH_DATA} barGap={3} margin={{ left: -8, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => `$${v / 1000}k`} />
          <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTip format={moneyShort} />} />
          <Bar dataKey="lastYear" name="2025" fill="var(--color-lastYear)" radius={[3, 3, 0, 0]} maxBarSize={18} animationDuration={500} />
          <Bar dataKey="thisYear" name="2026" fill="var(--color-thisYear)" radius={[3, 3, 0, 0]} maxBarSize={18} animationDuration={500} />
        </BarChart>
      </ChartContainer>
    </Panel>
  )
}

function ComingIn() {
  const { href } = useOrbit()
  const open = INVOICES.filter((i) => i.status === "Due" || i.status === "Overdue").sort((a, b) => a.dueDay - b.dueDay)
  const total = open.reduce((s, i) => s + i.amount, 0)
  const max = Math.max(...open.map((i) => i.amount))
  return (
    <Panel
      title="Coming in"
      description="Open invoices by due date"
      action={
        <Button variant="ghost" size="sm" className={cn(flat, "-mr-2 text-[13px]")} nativeButton={false} render={<Link href={href("invoices", { status: "Due" })} />}>
          All open <ArrowRight />
        </Button>
      }
      bodyClassName="flex flex-col"
    >
      <p className="dc-num text-[28px] leading-none font-semibold tracking-tight">{money(total)}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">from {open.length} invoices in the next 30 days</p>
      <ul className="mt-4 grid gap-1">
        {open.map((inv) => {
          const late = inv.status === "Overdue"
          return (
            <li key={inv.id}>
              <Link href={href("invoice", { id: inv.id })} className="-mx-2 grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-[var(--radius)] px-2 py-2 transition-colors hover:bg-muted">
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium">{clientById(inv.clientId).name}</span>
                  <span className={cn("block text-[12px]", late ? "font-medium text-[color:var(--dc-danger)]" : "text-muted-foreground")}>
                    {late ? inv.note : `Due ${inv.due}`} · {inv.id}
                  </span>
                </span>
                <span className="dc-num text-right text-[14px] font-semibold">{money(inv.amount)}</span>
                <span className="col-span-2 mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn("block h-full rounded-full", late ? "bg-[color:var(--dc-danger)]" : "bg-[color:var(--chart-1)]")}
                    style={{ width: `${(inv.amount / max) * 100}%` }}
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-[13px]">
        <CalendarClock className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">
          Payout of <span className="dc-num font-semibold text-foreground">{money(PAYOUT.amount)}</span> arrives {PAYOUT.date}
        </span>
      </div>
    </Panel>
  )
}

function RecentInvoices() {
  const { href } = useOrbit()
  const router = useRouter()
  const recent = [...INVOICES].sort((a, b) => b.issuedDay - a.issuedDay || b.id.localeCompare(a.id)).slice(0, 6)
  return (
    <Panel
      title="Recent invoices"
      description="The last six you created"
      flush
      action={
        <Button variant="ghost" size="sm" className={cn(flat, "-mr-2 text-[13px]")} nativeButton={false} render={<Link href={href("invoices")} />}>
          View all <ArrowRight />
        </Button>
      }
    >
      <Table className="text-[14px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <Head className="pl-5">Invoice</Head>
            <Head>Client</Head>
            <Head className="hidden sm:table-cell">Due</Head>
            <Head>Status</Head>
            <Head className="pr-5 text-right">Amount</Head>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((inv) => {
            const c = clientById(inv.clientId)
            return (
              <TableRow key={inv.id} className="cursor-pointer" onClick={() => router.push(href("invoice", { id: inv.id }))}>
                <TableCell className="pl-5">
                  <Link href={href("invoice", { id: inv.id })} className="dc-num font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                    {inv.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2.5">
                    <ClientMark name={c.name} className="size-7 text-[10px]" />
                    <span className="max-w-[160px] truncate">{c.name}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{inv.due}</TableCell>
                <TableCell>
                  <StatusPill status={inv.status} />
                </TableCell>
                <TableCell className="dc-num pr-5 text-right font-medium">{money(inv.amount)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Panel>
  )
}

const EVENTS = [
  { icon: CircleDollarSign, text: "Northlight paid INV-1040", meta: "$7,450.00 by card", time: "2h ago", tone: "paid" },
  { icon: Eye, text: "Kato & Lee opened INV-1041", meta: "Third time this week", time: "5h ago" },
  { icon: FileText, text: "You drafted INV-1033 for Mossgrove Architects", meta: "$3,900.00, not sent", time: "Nov 21" },
  { icon: BellRing, text: "Reminder sent to Halcyon", meta: "INV-1037, due Dec 2", time: "Nov 23" },
  { icon: Wallet, text: "Payout of $6,214.40 started", meta: `To ${PAYOUT.bank}`, time: "Nov 23" },
]

function Activity() {
  return (
    <Panel title="Activity" description="What happened on your invoices">
      <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-border">
        {EVENTS.map((e) => (
          <li key={e.text} className="relative flex gap-3">
            <span
              className={cn(
                "z-10 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-[color:var(--card)] text-muted-foreground",
                e.tone === "paid" && "border-transparent bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]",
              )}
            >
              <e.icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[14px] leading-snug font-medium">{e.text}</p>
              <p className="text-[12px] text-muted-foreground">
                {e.meta} · {e.time}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
