// Features, comparison: Orbit against spreadsheets and email, as two columns of the same six jobs. Each
// row says how the job gets done each way, with a cross on the left and a check on the right, and the
// rows line up across the columns (the columns share the grid's rows through subgrid). The Orbit column
// is the raised card with the accent edge. On phones the columns stack, the old way first.
import { ArrowRight, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROWS = [
  { job: "Sending an invoice", before: "Copy last month's file, fix the numbers, export a PDF", orbit: "Pick a client, add the lines and send in a minute" },
  { job: "Following up", before: "Remember who is late and write the awkward email", orbit: "Reminders before and after the due date, in your tone" },
  { job: "Getting paid", before: "Send bank details and keep checking your account", orbit: "Card or bank transfer, matched to the invoice" },
  { job: "Knowing where you stand", before: "A formula you hope still adds up", orbit: "Paid, due and at risk this month, at a glance" },
  { job: "Retainers", before: "A calendar note to bill the same client again", orbit: "Recurring invoices that stop when the contract ends" },
  { job: "Tax time", before: "A weekend matching payments to invoices", orbit: "One tidy export for your accountant" },
]

function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-[19px] font-bold tracking-[-0.02em]">
      <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

// The columns share seven rows (a header and six jobs) through subgrid on tablets and up.
const column = "md:row-span-7 md:grid md:grid-rows-subgrid"
const list = "md:row-span-6 md:grid md:grid-rows-subgrid"

export default function FeaturesComparison() {
  return (
    <section aria-labelledby="features-comparison-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Why switch</p>
          <h2 id="features-comparison-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Orbit, or the spreadsheet you have now
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            The same six jobs, done two ways. One of them leaves you Friday afternoon.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1000px] gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <div
            aria-labelledby="features-comparison-before"
            role="group"
            className={cn(column, "rounded-[var(--dc-radius-card)] border border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_3%,var(--background))]")}
          >
            <div className="px-5 pt-6 pb-5 sm:px-6">
              <h3 id="features-comparison-before" className="dc-h flex h-7 items-center text-[19px] text-muted-foreground">
                Spreadsheets and email
              </h3>
              <p className="mt-1 text-[14px] text-muted-foreground">How most of us start</p>
            </div>
            <ul className={list}>
              {ROWS.map((r) => (
                <li key={r.job} className="flex gap-3 border-t border-border px-5 py-4 sm:px-6">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-muted-foreground">{r.job}</span>
                    <span className="mt-0.5 block text-[15px] leading-snug text-pretty text-muted-foreground">{r.before}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            aria-labelledby="features-comparison-orbit"
            role="group"
            className={cn(column, "dc-card overflow-hidden shadow-[var(--dc-shadow)] ring-2 ring-[color:var(--dc-accent)]")}
          >
            <div className="bg-[color:color-mix(in_oklab,var(--dc-accent)_9%,var(--card))] px-5 pt-6 pb-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <h3 id="features-comparison-orbit" className="flex h-7 items-center">
                  <Logo />
                </h3>
                <span className="dc-pill dc-pill-hl">Saves 2 h a week</span>
              </div>
              <p className="mt-1 text-[14px] text-muted-foreground">Free for your first three clients</p>
            </div>
            <ul className={list}>
              {ROWS.map((r) => (
                <li key={r.job} className="flex gap-3 border-t border-border px-5 py-4 sm:px-6">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--dc-accent)] text-[color:var(--background)]">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[color:var(--dc-accent)]">{r.job}</span>
                    <span className="mt-0.5 block text-[15px] leading-snug font-medium text-pretty">{r.orbit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Switch in ten minutes <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <p className="text-[14px] text-muted-foreground">Bring your clients over from a CSV. No card needed.</p>
        </div>
      </div>
    </section>
  )
}
