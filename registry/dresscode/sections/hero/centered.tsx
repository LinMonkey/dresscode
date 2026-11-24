// Hero, centered: a link to what is new, one promise, two actions and three reassurances, then the
// product itself. The product is drawn in markup, so it wears the theme; it is a picture, hidden from
// screen readers, and the copy around it says what it shows.
import { ArrowRight, Bell, ChartColumn, Check, FileText, LayoutDashboard, Plus, Search, Settings, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FileText, label: "Invoices", count: 12 },
  { icon: Users, label: "Clients" },
  { icon: Wallet, label: "Payments" },
  { icon: ChartColumn, label: "Reports" },
  { icon: Settings, label: "Settings" },
]

const STATS = [
  { label: "Revenue", value: "$48,210", note: "+12.4% on October" },
  { label: "Outstanding", value: "$9,860", note: "5 invoices" },
  { label: "Clients", value: "64", note: "+6 this month" },
  { label: "Days to get paid", value: "11", note: "3 days faster" },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
const THIS_YEAR = [18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42]
const LAST_YEAR = [15, 16, 18, 17, 20, 21, 22, 21, 25, 24, 27]

const INVOICES = [
  { client: "Fernwood Studio", status: "Due", amount: "$4,200.00" },
  { client: "Kato & Lee", status: "Overdue", amount: "$1,860.00" },
  { client: "Northlight", status: "Paid", amount: "$7,450.00" },
  { client: "Juniper Labs", status: "Paid", amount: "$2,300.00" },
] as const

const PILL = { Paid: "dc-pill-hl", Due: "dc-pill-line", Overdue: "dc-pill-danger" } as const

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-[-0.02em]", className)}>
      <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

function ProductShot({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("dc-card overflow-hidden text-left text-[13px]", className)}>
      <div className="grid md:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_2.5%,var(--card))] p-3 md:block">
          <Logo className="px-2 pt-1 pb-4 text-[15px]" />
          <ul className="space-y-0.5">
            {NAV.map(({ icon: Icon, label, active, count }) => (
              <li
                key={label}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-[var(--radius)] px-2.5 text-muted-foreground",
                  active && "bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] font-semibold text-[color:var(--dc-accent)]",
                )}
              >
                <Icon className="size-4" />
                {label}
                {count ? <span className="ml-auto text-xs">{count}</span> : null}
              </li>
            ))}
          </ul>
        </aside>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="dc-h text-[18px]">Good morning, Ada</p>
            <div className="flex items-center gap-2">
              <span className="hidden h-8 w-48 items-center gap-2 rounded-[var(--radius)] border border-input px-2.5 text-muted-foreground lg:flex">
                <Search className="size-3.5" /> Search invoices…
              </span>
              <span className="hidden size-8 place-items-center rounded-[var(--radius)] border border-input text-muted-foreground sm:grid">
                <Bell className="size-3.5" />
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">
                <Plus className="size-3.5" /> New invoice
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "rounded-[calc(var(--radius)+2px)] border border-border p-3",
                  i === 0 && "border-transparent bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]",
                )}
              >
                <p className={cn("text-xs", i === 0 ? "opacity-80" : "text-muted-foreground")}>{s.label}</p>
                <p className="dc-num mt-1 text-[20px] font-semibold tracking-tight">{s.value}</p>
                <p className={cn("mt-0.5 text-[11px]", i === 0 ? "opacity-80" : "text-muted-foreground")}>{s.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-2.5 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-[calc(var(--radius)+2px)] border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Cash in</p>
                <p className="text-[11px] text-muted-foreground">2026 against 2025</p>
              </div>
              <div className="mt-3 flex items-end gap-[3%]">
                {THIS_YEAR.map((v, i) => (
                  <div key={MONTHS[i]} className="flex h-24 flex-1 items-end justify-center gap-[12%]">
                    <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-2)]" style={{ height: `${(LAST_YEAR[i] / 45) * 100}%` }} />
                    <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-1)]" style={{ height: `${(v / 45) * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden rounded-[calc(var(--radius)+2px)] border border-border sm:block">
              <p className="px-3 pt-3 font-semibold">Recent invoices</p>
              <ul className="mt-2">
                {INVOICES.map((inv) => (
                  <li key={inv.client} className="flex items-center gap-2 border-t border-border px-3 py-2">
                    <span className="min-w-0 flex-1 truncate">{inv.client}</span>
                    <span className={cn("dc-pill", PILL[inv.status])}>{inv.status}</span>
                    <span className="dc-num w-[72px] text-right">{inv.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroCentered() {
  return (
    <section aria-labelledby="hero-centered-title" className="overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
        <a
          href="#whats-new"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:color-mix(in_oklab,var(--foreground)_5%,transparent)] py-1 pr-3 pl-1 text-[13px] font-medium outline-none transition-colors hover:border-input focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-semibold text-primary-foreground">New</span>
          Reminders in your own words
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
        <h1 id="hero-centered-title" className="dc-h mt-6 max-w-[900px] text-[40px] leading-[1.04] sm:text-[60px] lg:text-[72px]">
          Get paid on time, without the awkward emails.
        </h1>
        <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
          Orbit sends the invoice, nudges the late ones and tells you what is left for the month.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#demo" />}>
            Book a demo
          </Button>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground">
          {["Free for your first three clients", "No card needed", "Cancel any time"].map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-[color:var(--dc-accent)]" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-14 w-full max-w-[1200px] px-5 sm:mt-20 sm:px-8">
        <ProductShot />
      </div>
    </section>
  )
}
