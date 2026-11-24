// Bento grid, three-up: three cells in one row, one wide and two narrow. Each cell holds an inset panel
// with a small picture of the product (the narrow ones run off the panel's lower edge on purpose) above
// a short title and a line. The cells share one height on desktop. Tablets: the wide cell on top, the narrow
// ones side by side. Phones: one column. The pictures are drawn in markup so they wear the theme; they
// are hidden from screen readers and each cell's copy says what its picture shows.
import { CalendarCheck, Check, CreditCard, Landmark } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function Cell({ className, title, body, children }: { className?: string; title: string; body: string; children: ReactNode }) {
  return (
    <div className={cn("dc-card flex flex-col p-2", className)}>
      <div
        aria-hidden="true"
        className="relative h-[300px] overflow-hidden rounded-[max(0px,calc(var(--dc-radius-card)-6px))] bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,var(--card))] text-[13px]"
      >
        {children}
      </div>
      <div className="px-4 pt-5 pb-4 sm:px-5">
        <h3 className="dc-h text-[20px] leading-snug">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

const STEPS = [
  { label: "Sent", when: "Nov 14" },
  { label: "Opened", when: "Nov 14" },
  { label: "Nudged", when: "Nov 25" },
  { label: "Paid", when: "Nov 27" },
]

function Journey() {
  return (
    <div className="px-5 pt-7 sm:px-8">
      <div className="dc-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-muted-foreground">INV-1042 · Fernwood Studio</p>
            <p className="dc-num mt-0.5 text-[22px] font-semibold tracking-tight">$4,200.00</p>
          </div>
          <span className="dc-pill dc-pill-hl">Paid</span>
        </div>
        <ol className="relative mt-6 grid grid-cols-4 before:absolute before:top-[11px] before:right-[12.5%] before:left-[12.5%] before:h-0.5 before:bg-[color:var(--dc-accent)]">
          {STEPS.map((s, i) => (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full",
                  i === 3 ? "bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)] ring-4 ring-[color:var(--card)]" : "bg-[color:var(--dc-accent)] text-[color:var(--background)]",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="mt-2 text-[12px] font-semibold sm:text-[13px]">{s.label}</span>
              <span className="dc-num text-[11px] text-muted-foreground sm:text-[12px]">{s.when}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="dc-card relative z-10 -mt-3 mr-4 ml-auto flex w-[250px] max-w-[calc(100%-1rem)] items-center gap-3 p-3">
        <span className="dc-icon size-8 shrink-0">
          <CalendarCheck className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">Paid in 13 days</p>
          <p className="text-muted-foreground">Two days before it was due</p>
        </div>
      </div>
    </div>
  )
}

function PaySheet() {
  return (
    <div className="dc-card absolute top-7 right-5 left-5 p-4 sm:right-6 sm:left-6">
      <p className="text-muted-foreground">Pay Ada for INV-1044</p>
      <p className="dc-num mt-0.5 text-[22px] font-semibold tracking-tight">$640.00</p>
      <div className="mt-4 space-y-2">
        <span className="flex h-10 items-center gap-2.5 rounded-[var(--radius)] border-2 border-[color:var(--dc-accent)] px-3 font-semibold">
          <CreditCard className="size-4 text-[color:var(--dc-accent)]" /> Card
          <span className="ml-auto grid size-4 place-items-center rounded-full bg-[color:var(--dc-accent)]">
            <span className="size-1.5 rounded-full bg-[color:var(--card)]" />
          </span>
        </span>
        <span className="flex h-10 items-center gap-2.5 rounded-[var(--radius)] border border-input px-3 text-muted-foreground">
          <Landmark className="size-4" /> Bank transfer
          <span className="ml-auto size-4 rounded-full border-2 border-input" />
        </span>
      </div>
      <span className="mt-4 flex h-9 items-center justify-center rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">Pay $640.00</span>
    </div>
  )
}

const LATE = [
  { client: "Kato & Lee", days: 7 },
  { client: "Halcyon", days: 3 },
  { client: "Brightedge", days: 1 },
]

function LateList() {
  return (
    <div className="dc-card absolute top-7 right-5 left-5 overflow-hidden sm:right-6 sm:left-6">
      <p className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="font-semibold">Late this week</span>
        <span className="dc-num text-muted-foreground">$4,990</span>
      </p>
      <ul>
        {LATE.map((r) => (
          <li key={r.client} className="flex items-center gap-3 border-t border-border px-4 py-2.5">
            <span className="min-w-0 flex-1 truncate font-semibold">{r.client}</span>
            <span className="dc-pill dc-pill-danger">
              {r.days} {r.days === 1 ? "day" : "days"} late
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border p-3">
        <span className="flex h-9 items-center justify-center rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">Nudge all three</span>
      </div>
    </div>
  )
}

export default function BentoGridThreeUp() {
  return (
    <section aria-labelledby="bento-grid-three-up-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Every week</p>
          <h2 id="bento-grid-three-up-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Three screens you will open every Monday
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Where each invoice stands, how clients pay you and who needs a nudge, without opening a spreadsheet.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Cell className="md:col-span-2" title="Every invoice, start to paid" body="See when it was sent, opened and chased, and the moment the money lands.">
            <Journey />
          </Cell>
          <Cell title="Clients pay their way" body="Card or bank transfer from one link, with no account to make.">
            <PaySheet />
          </Cell>
          <Cell title="Know who is late" body="Late invoices rise to the top, with a nudge one click away.">
            <LateList />
          </Cell>
        </div>
      </div>
    </section>
  )
}
