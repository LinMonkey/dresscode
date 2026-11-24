"use client"

// Integrations, grouped list with search: every integration, grouped by kind (payments, accounting,
// communication, developer), with a search field that filters them as you type. It matches names,
// descriptions and the group's name; groups with nothing left are hidden, the count is announced
// politely, and when nothing matches an empty state offers to clear the search. The integrations are
// kinds of tool, not real brands; put your partners' names and logos in their place.
import {
  ArrowRight,
  Banknote,
  Bell,
  Braces,
  Calculator,
  CalendarDays,
  CreditCard,
  FileInput,
  Landmark,
  Link2,
  Mail,
  MessageSquare,
  Receipt,
  Search,
  SearchX,
  ScanLine,
  Sheet,
  Webhook,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Integration = { icon: LucideIcon; name: string; body: string; status?: "Built in" | "New" }

const GROUPS: { name: string; blurb: string; items: Integration[] }[] = [
  {
    name: "Payments",
    blurb: "How your clients pay you",
    items: [
      { icon: CreditCard, name: "Card payments", body: "Cards and digital wallets on every invoice, with the fee shown first.", status: "Built in" },
      { icon: Landmark, name: "Bank transfer", body: "Local transfer details in 30 currencies, matched to the invoice when they land.", status: "Built in" },
      { icon: Link2, name: "Payment links", body: "A link you can send in a chat or a text, for jobs without an invoice." },
      { icon: Banknote, name: "Direct debit", body: "Collect retainers on the same day each month, with the client's say-so.", status: "New" },
    ],
  },
  {
    name: "Accounting",
    blurb: "Where the numbers go next",
    items: [
      { icon: Calculator, name: "Accounting software", body: "Invoices, payments and fees sync to your books every hour." },
      { icon: Sheet, name: "Spreadsheets", body: "A live copy of every invoice in a sheet you already use." },
      { icon: Receipt, name: "Tax reports", body: "Sales tax and VAT by quarter, ready to file or to hand over.", status: "Built in" },
      { icon: ScanLine, name: "Expenses", body: "Receipts from your inbox, matched to the job so you can bill them back." },
    ],
  },
  {
    name: "Communication",
    blurb: "Who hears about it, and where",
    items: [
      { icon: Mail, name: "Email", body: "Invoices and reminders go out from your own address." },
      { icon: MessageSquare, name: "Team chat", body: "A message in your channel when an invoice is paid or goes late." },
      { icon: CalendarDays, name: "Calendar", body: "Due dates and payment days on the calendar you check anyway." },
      { icon: Bell, name: "Text reminders", body: "A short text to the client on the due date, if they ask for one.", status: "New" },
    ],
  },
  {
    name: "Developer",
    blurb: "For everything else",
    items: [
      { icon: Webhook, name: "Webhooks", body: "An event for every invoice, payment, reminder and refund." },
      { icon: Braces, name: "REST API", body: "Create, send and chase invoices from your own code." },
      { icon: Workflow, name: "Automation tools", body: "Connect Orbit to thousands of apps without writing code." },
      { icon: FileInput, name: "CSV import", body: "Bring clients and old invoices from any tool, numbering intact.", status: "Built in" },
    ],
  },
]

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0)

export default function IntegrationsList() {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const groups = useMemo(() => {
    if (!q) return GROUPS
    return GROUPS.map((g) => ({
      ...g,
      items: g.name.toLowerCase().includes(q) ? g.items : g.items.filter((i) => `${i.name} ${i.body}`.toLowerCase().includes(q)),
    })).filter((g) => g.items.length)
  }, [q])
  const shown = groups.reduce((n, g) => n + g.items.length, 0)

  const clear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[600px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Integrations</p>
            <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              Connect Orbit to the rest of your studio
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              Grouped by what they do. Each one connects in a couple of clicks.
            </p>
          </div>
          <div className="w-full lg:max-w-[360px]">
            <Label htmlFor={`${id}-search`} className="text-[14px] font-semibold">
              Search integrations
            </Label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                ref={inputRef}
                id={`${id}-search`}
                type="search"
                autoComplete="off"
                placeholder="Payments, email, webhooks…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && query) {
                    e.preventDefault()
                    setQuery("")
                  }
                }}
                aria-describedby={`${id}-count`}
                className="h-11 bg-card pr-11 pl-10 text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query ? (
                <Button variant="ghost" size="icon-sm" className="dc-flat absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground" aria-label="Clear search" onClick={clear}>
                  <X aria-hidden="true" />
                </Button>
              ) : null}
            </div>
            <p id={`${id}-count`} aria-live="polite" className="mt-2 text-[13px] text-muted-foreground">
              {q ? (shown === 1 ? "1 integration matches" : `${shown} integrations match`) : `Showing all ${TOTAL} integrations`}
            </p>
          </div>
        </div>

        {groups.length ? (
          <div className="mt-12 space-y-12 sm:mt-14">
            {groups.map((g) => (
              <div key={g.name} role="group" aria-labelledby={`${id}-${g.name}`} className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
                <div className="lg:border-t lg:border-border lg:pt-5">
                  <h3 id={`${id}-${g.name}`} className="dc-h text-[20px]">
                    {g.name} <span className="dc-num text-[15px] font-normal text-muted-foreground">{g.items.length}</span>
                  </h3>
                  <p className="mt-1 text-[14px] text-muted-foreground">{g.blurb}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {g.items.map(({ icon: Icon, name, body, status }) => (
                    <li key={name} className="dc-card flex items-start gap-3.5 p-4">
                      <span className="dc-icon shrink-0">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-semibold">{name}</span>
                          {status ? <span className={cn("dc-pill", status === "New" ? "dc-pill-hl" : "dc-pill-muted")}>{status}</span> : null}
                        </p>
                        <p className="mt-1 text-[14px] leading-snug text-pretty text-muted-foreground">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center rounded-[var(--dc-radius-card)] border border-dashed border-input px-6 py-14 text-center sm:mt-14">
            <span className="dc-icon size-11">
              <SearchX className="size-5" aria-hidden="true" />
            </span>
            <p className="dc-h mt-4 text-[20px]">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="mt-2 max-w-[420px] text-[15px] text-muted-foreground">
              Try a kind of tool, like &ldquo;payments&rdquo; or &ldquo;calendar&rdquo;. If it is not here, the API probably covers it, or tell us what you need.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold" onClick={clear}>
                Clear search
              </Button>
              {/* Point this at your own request form. */}
              <Button variant="link" className="dc-flat h-10 px-2 font-semibold text-foreground" nativeButton={false} render={<a href="#request-integration" />}>
                Ask for an integration <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
