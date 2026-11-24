"use client"

// No results: an invoice search that finds nothing. It says what was searched and with which filters,
// shows the filters as chips you can remove one by one, offers to clear them all, and suggests what to
// try, including which single filter is hiding the matches. Remove enough and the matches come back.
// Replace INVOICES and the filter tests with your own query.
import { RotateCcw, Search, SearchX, X } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Invoice = { id: string; client: string; status: "Paid" | "Due" | "Overdue"; sent: string; month: "Nov" | "Oct"; amount: number }

const INVOICES: Invoice[] = [
  { id: "INV-1042", client: "Fernwood Studio", status: "Due", sent: "Nov 14", month: "Nov", amount: 4200 },
  { id: "INV-1041", client: "Kato & Lee", status: "Overdue", sent: "Nov 6", month: "Nov", amount: 1860 },
  { id: "INV-1040", client: "Northlight", status: "Paid", sent: "Nov 4", month: "Nov", amount: 7450 },
  { id: "INV-1039", client: "Juniper Labs", status: "Paid", sent: "Oct 29", month: "Oct", amount: 2300 },
  { id: "INV-1037", client: "Kato & Lee", status: "Paid", sent: "Oct 21", month: "Oct", amount: 2400 },
  { id: "INV-1036", client: "Halcyon", status: "Paid", sent: "Oct 18", month: "Oct", amount: 1500 },
  { id: "INV-1035", client: "Brightedge", status: "Overdue", sent: "Oct 12", month: "Oct", amount: 980 },
  { id: "INV-1034", client: "Ola Bakery", status: "Paid", sent: "Oct 3", month: "Oct", amount: 640 },
]

const FILTERS = [
  { key: "paid", label: "Status: Paid", test: (i: Invoice) => i.status === "Paid" },
  { key: "month", label: "Sent: This month", test: (i: Invoice) => i.month === "Nov" },
  { key: "amount", label: "Amount: Over $1,000", test: (i: Invoice) => i.amount > 1000 },
] as const
type FilterKey = (typeof FILTERS)[number]["key"]

const CLIENTS = ["Fernwood Studio", "Northlight", "Kato & Lee"]
const PILL = { Paid: "dc-pill-hl", Due: "dc-pill-line", Overdue: "dc-pill-danger" } as const
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function matches(query: string, active: FilterKey[]) {
  const q = query.trim().toLowerCase()
  return INVOICES.filter(
    (i) => (!q || `${i.id} ${i.client}`.toLowerCase().includes(q)) && FILTERS.filter((f) => active.includes(f.key)).every((f) => f.test(i)),
  )
}

export default function StatesNoResults() {
  const id = useId()
  const [query, setQuery] = useState("kato")
  const [active, setActive] = useState<FilterKey[]>(["paid", "month", "amount"])
  const results = matches(query, active)
  const q = query.trim()
  const withoutAll = active.length ? matches(query, []).length : 0
  const hiding = FILTERS.filter((f) => active.includes(f.key))
    .map((f) => ({ ...f, count: matches(query, active.filter((k) => k !== f.key)).length }))
    .filter((f) => f.count > 0)
  const remove = (k: FilterKey) => setActive((a) => a.filter((x) => x !== k))

  return (
    <section aria-labelledby={`${id}-title`} className="min-h-[700px] bg-background py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <h1 id={`${id}-title`} className="dc-h text-[28px] leading-tight sm:text-[32px]">
          Invoices
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">Search by invoice number or client.</p>

        <div className="dc-card mt-6 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:px-5">
            <div role="search" className="relative w-full sm:max-w-[360px]">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                aria-label="Search invoices"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Invoice number or client"
                className="h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className={cn("absolute inset-y-0 right-1.5 my-auto grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground", focus)}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <p className="text-[14px] text-muted-foreground sm:ml-auto" aria-live="polite">
              <span className="dc-num font-semibold text-foreground">{results.length}</span> {results.length === 1 ? "invoice" : "invoices"}
            </p>
          </div>

          {active.length ? (
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-5">
              <span className="mr-1 text-[13px] text-muted-foreground">Filters</span>
              <ul className="contents">
                {FILTERS.filter((f) => active.includes(f.key)).map((f) => (
                  <li key={f.key}>
                    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-muted pr-1 pl-3 text-[13px] font-medium">
                      {f.label}
                      <button
                        type="button"
                        onClick={() => remove(f.key)}
                        aria-label={`Remove filter ${f.label}`}
                        className={cn("grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-[color:var(--card)] hover:text-foreground", focus)}
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setActive([])} className={cn("ml-1 rounded-[2px] text-[13px] font-medium text-[color:var(--dc-accent)] hover:underline", focus)}>
                Clear all
              </button>
            </div>
          ) : null}

          {results.length ? (
            <table className="w-full text-[14px]">
              <caption className="sr-only">Matching invoices</caption>
              <thead>
                <tr className="text-left text-[12px] text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium sm:px-5">Invoice</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Sent</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium sm:px-5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="dc-num px-4 py-3 text-muted-foreground sm:px-5">{r.id}</td>
                    <td className="px-3 py-3 font-medium">{r.client}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell">{r.sent}</td>
                    <td className="hidden px-3 py-3 sm:table-cell">
                      <span className={cn("dc-pill", PILL[r.status])}>{r.status}</span>
                    </td>
                    <td className="dc-num px-4 py-3 text-right sm:px-5">{money(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12 lg:p-10">
              <div>
                <span className="dc-icon size-12">
                  <SearchX className="size-5" aria-hidden="true" />
                </span>
                <h2 className="dc-h mt-5 text-[22px] leading-tight sm:text-[24px]">
                  {q ? (
                    <>
                      No invoices match <span className="[overflow-wrap:anywhere]">&ldquo;{q}&rdquo;</span>
                    </>
                  ) : (
                    "No invoices match these filters"
                  )}
                </h2>
                <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">
                  {active.length
                    ? `You ${q ? "searched" : "filtered"} with ${active.length} ${active.length === 1 ? "filter" : "filters"} on. ${
                        withoutAll ? `Without them, ${withoutAll} ${withoutAll === 1 ? "invoice matches" : "invoices match"}.` : "Nothing matches without them either."
                      }`
                    : "Nothing in your invoices has that number or client name."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {/* The button that will bring matches back goes first. */}
                  {active.length && (withoutAll || !q) ? (
                    <>
                      <Button className="h-10 px-4 font-semibold" onClick={() => setActive([])}>
                        <RotateCcw className="size-4" aria-hidden="true" /> Clear filters
                      </Button>
                      {q ? (
                        <Button variant="outline" className="h-10 px-4" onClick={() => setQuery("")}>
                          Clear search
                        </Button>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Button className="h-10 px-4 font-semibold" onClick={() => setQuery("")}>
                        <X className="size-4" aria-hidden="true" /> Clear search
                      </Button>
                      {active.length ? (
                        <Button variant="outline" className="h-10 px-4" onClick={() => setActive([])}>
                          Clear filters
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              <div className="self-start rounded-[calc(var(--radius)+2px)] border border-border p-5">
                <h3 className="text-[14px] font-semibold">Things to try</h3>
                <ul className="mt-3 grid gap-3 text-[14px]">
                  {hiding.map((f) => (
                    <li key={f.key} className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block font-medium">{f.label}</span>
                        <span className="block text-[13px] text-muted-foreground">
                          Hides <span className="dc-num">{f.count}</span> {f.count === 1 ? "match" : "matches"}
                        </span>
                      </span>
                      <Button variant="outline" size="sm" onClick={() => remove(f.key)} aria-label={`Remove filter ${f.label}`}>
                        Remove
                      </Button>
                    </li>
                  ))}
                  <li className="text-muted-foreground">Check the spelling, or try part of a client name or an invoice number, like <span className="dc-num">INV-1041</span>.</li>
                  <li>
                    <span className="text-muted-foreground">Or search for a client:</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {CLIENTS.map((c) => (
                        <Button key={c} variant="outline" size="sm" onClick={() => setQuery(c)}>
                          {c}
                        </Button>
                      ))}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
