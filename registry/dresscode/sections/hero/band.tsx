// Hero on the colored band: the copy sits on the theme's band color (dc-band switches the text and the
// primary button to the band's own pair) and the product overlaps the band's lower edge. The product is
// drawn in markup and hidden from screen readers; the copy says what it shows.
import { ArrowRight, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROWS = [
  { id: "INV-1042", client: "Fernwood Studio", sent: "Nov 14", due: "Nov 28", status: "Due", amount: "$4,200.00" },
  { id: "INV-1041", client: "Kato & Lee", sent: "Nov 6", due: "Nov 20", status: "Overdue", amount: "$1,860.00" },
  { id: "INV-1040", client: "Northlight", sent: "Nov 4", due: "Nov 18", status: "Paid", amount: "$7,450.00" },
  { id: "INV-1039", client: "Juniper Labs", sent: "Oct 29", due: "Nov 12", status: "Paid", amount: "$2,300.00" },
  { id: "INV-1038", client: "Ola Bakery", sent: "—", due: "—", status: "Draft", amount: "$640.00" },
] as const

const PILL = { Paid: "dc-pill-hl", Due: "dc-pill-line", Overdue: "dc-pill-danger", Draft: "dc-pill-muted" } as const
const TABS = ["All", "Due", "Overdue", "Paid", "Drafts"]

function InvoiceList() {
  return (
    <div aria-hidden="true" className="dc-card overflow-hidden text-left text-[13px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
        <div>
          <p className="dc-h text-[18px]">Invoices</p>
          <p className="text-muted-foreground">$16,450 outstanding across 12 invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden h-8 w-52 items-center gap-2 rounded-[var(--radius)] border border-input px-2.5 text-muted-foreground md:flex">
            <Search className="size-3.5" /> Search
          </span>
          <span className="hidden h-8 items-center gap-1.5 rounded-[var(--radius)] border border-input px-2.5 sm:inline-flex">
            <Filter className="size-3.5" /> Filter
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">
            <Plus className="size-3.5" /> New invoice
          </span>
        </div>
      </div>
      <div className="flex gap-1 border-b border-border px-3 py-2 sm:px-4">
        {TABS.map((t, i) => (
          <span key={t} className={cn("rounded-[var(--radius)] px-2.5 py-1", i === 0 ? "bg-muted font-semibold" : "text-muted-foreground")}>
            {t}
          </span>
        ))}
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[12px] text-muted-foreground">
            <th className="px-4 py-2.5 font-medium sm:px-5">Invoice</th>
            <th className="px-3 py-2.5 font-medium">Client</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Sent</th>
            <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Due</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 text-right font-medium sm:px-5">Amount</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="dc-num px-4 py-3 text-muted-foreground sm:px-5">{r.id}</td>
              <td className="px-3 py-3 font-medium">{r.client}</td>
              <td className="hidden px-3 py-3 text-muted-foreground md:table-cell">{r.sent}</td>
              <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell">{r.due}</td>
              <td className="px-3 py-3">
                <span className={cn("dc-pill", PILL[r.status])}>{r.status}</span>
              </td>
              <td className="dc-num px-4 py-3 text-right sm:px-5">{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HeroBand() {
  return (
    <section aria-labelledby="hero-band-title" className="pb-20 sm:pb-28">
      <div className="dc-band pt-16 pb-48 sm:pt-24 sm:pb-64">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
          <p className="text-sm font-semibold opacity-80">For freelancers, studios and small agencies</p>
          <h1 id="hero-band-title" className="dc-h mt-4 max-w-[880px] text-[40px] leading-[1.04] sm:text-[60px] lg:text-[72px]">
            Every invoice, every client, one calm list.
          </h1>
          <p className="mt-6 max-w-[580px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
            See what is paid, what is due and who needs a nudge, then let Orbit send it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
              Start free <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-[color:var(--dc-band-edge)] bg-transparent px-6 text-[16px] font-semibold text-[color:var(--dc-band-fg)] hover:bg-[color:color-mix(in_oklab,var(--dc-band-fg)_12%,transparent)] hover:text-[color:var(--dc-band-fg)] dark:bg-transparent"
              nativeButton={false}
              render={<a href="#demo" />}
            >
              Book a demo
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto -mt-36 w-full max-w-[1100px] px-5 sm:-mt-48 sm:px-8">
        <InvoiceList />
      </div>
    </section>
  )
}
