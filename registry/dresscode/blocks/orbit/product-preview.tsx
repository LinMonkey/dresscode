// The Orbit dashboard drawn with plain markup, for the hero and the feature rows. It is a picture of
// the product, so it is hidden from screen readers; the copy around it says what it shows.
import { Bell, ChartColumn, FileText, LayoutDashboard, Plus, Search, Settings, Users, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"

import { Logo, StatusPill, type Status } from "./shared"

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FileText, label: "Invoices", count: 12 },
  { icon: Users, label: "Clients" },
  { icon: Wallet, label: "Payments" },
  { icon: ChartColumn, label: "Reports" },
  { icon: Settings, label: "Settings" },
]

const STATS = [
  { label: "Revenue", value: "$48,210", note: "+12.4% on October", up: true },
  { label: "Outstanding", value: "$9,860", note: "5 invoices" },
  { label: "Clients", value: "64", note: "+6 this month" },
  { label: "Days to get paid", value: "11", note: "3 days faster" },
]

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
export const THIS_YEAR = [18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42]
export const LAST_YEAR = [15, 16, 18, 17, 20, 21, 22, 21, 25, 24, 27]

export const INVOICES: { id: string; client: string; due: string; status: Status; amount: string }[] = [
  { id: "INV-1042", client: "Fernwood Studio", due: "Nov 28", status: "Due", amount: "$4,200.00" },
  { id: "INV-1041", client: "Kato & Lee", due: "Nov 20", status: "Overdue", amount: "$1,860.00" },
  { id: "INV-1040", client: "Northlight", due: "Nov 18", status: "Paid", amount: "$7,450.00" },
  { id: "INV-1039", client: "Juniper Labs", due: "Nov 12", status: "Paid", amount: "$2,300.00" },
  { id: "INV-1038", client: "Ola Bakery", due: "—", status: "Draft", amount: "$640.00" },
]

export function BarChart({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-end gap-[3%]", className)}>
      {THIS_YEAR.map((v, i) => (
        <div key={MONTHS[i]} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-full w-full items-end justify-center gap-[12%]" style={{ height: compact ? 96 : 150 }}>
            <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-2)]" style={{ height: `${(LAST_YEAR[i] / 45) * 100}%` }} />
            <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-1)]" style={{ height: `${(v / 45) * 100}%` }} />
          </div>
          {compact ? null : <span className="text-[11px] text-muted-foreground">{MONTHS[i]}</span>}
        </div>
      ))}
    </div>
  )
}

export function ProductPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("dc-card overflow-hidden text-left text-[13px]", className)}>
      <div className="grid md:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_2.5%,var(--card))] p-3 md:block">
          <div className="flex items-center justify-between px-2 pt-1 pb-4">
            <Logo className="text-[15px]" />
          </div>
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
          <div className="mt-6 rounded-[var(--radius)] border border-border p-3">
            <p className="font-semibold text-foreground">Pro trial</p>
            <p className="text-xs text-muted-foreground">3 days left</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-primary" />
            </div>
          </div>
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
              <BarChart className="mt-3" compact />
            </div>
            <div className="hidden rounded-[calc(var(--radius)+2px)] border border-border sm:block">
              <p className="px-3 pt-3 font-semibold">Recent invoices</p>
              <ul className="mt-2">
                {INVOICES.slice(0, 4).map((inv) => (
                  <li key={inv.id} className="flex items-center gap-2 border-t border-border px-3 py-2">
                    <span className="min-w-0 flex-1 truncate">{inv.client}</span>
                    <StatusPill status={inv.status} />
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
