// Bento grid, showcase: one large cell with a rich picture of the product, which runs off the cell's
// right and bottom edges on purpose, beside four smaller cells, each a small picture over a title and a
// line. Desktop: the large cell takes two columns and two rows, the small ones sit two by two. Tablets:
// the large cell runs across the top. Phones: one column. The pictures are drawn in markup so they wear
// the theme; they are hidden from screen readers and each cell's copy says what its picture shows.
import { ArrowRight, Check, Landmark, Plus, Receipt } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
const THIS_YEAR = [18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42]
const LAST_YEAR = [15, 16, 18, 17, 20, 21, 22, 21, 25, 24, 27]

const RECENT = [
  { client: "Fernwood Studio", status: "Due", amount: "$4,200.00" },
  { client: "Kato & Lee", status: "Overdue", amount: "$1,860.00" },
  { client: "Northlight", status: "Paid", amount: "$7,450.00" },
  { client: "Juniper Labs", status: "Paid", amount: "$2,300.00" },
  { client: "Ola Bakery", status: "Paid", amount: "$640.00" },
] as const
const PILL = { Paid: "dc-pill-hl", Due: "dc-pill-line", Overdue: "dc-pill-danger" } as const

function Dashboard() {
  return (
    <div className="dc-card w-[700px] p-5 text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="dc-h text-[18px]">November</p>
          <p className="text-muted-foreground">12 invoices out, 5 waiting</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex rounded-[var(--radius)] bg-muted p-[3px]">
            {["Month", "Quarter", "Year"].map((t, i) => (
              <span key={t} className={cn("rounded-[calc(var(--radius)-2px)] px-2.5 py-1", i === 0 ? "bg-card font-semibold shadow-sm" : "text-muted-foreground")}>
                {t}
              </span>
            ))}
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">
            <Plus className="size-3.5" /> New invoice
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { label: "Collected", value: "$18,450", note: "+$2,300 on October" },
          { label: "Outstanding", value: "$9,860", note: "5 invoices" },
          { label: "Overdue", value: "$1,860", note: "Kato & Lee, 7 days" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "rounded-[calc(var(--radius)+2px)] border border-border p-3",
              i === 0 && "border-transparent bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]",
            )}
          >
            <p className={cn("text-xs", i === 0 ? "opacity-80" : "text-muted-foreground")}>{s.label}</p>
            <p className="dc-num mt-1 text-[22px] font-semibold tracking-tight">{s.value}</p>
            <p className={cn("mt-0.5 text-[11px]", i === 0 ? "opacity-80" : "text-muted-foreground")}>{s.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1.1fr_1fr] gap-2.5">
        <div className="rounded-[calc(var(--radius)+2px)] border border-border p-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Cash in</p>
            <p className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <i className="size-2 rounded-full bg-[color:var(--chart-1)]" /> 2026
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="size-2 rounded-full bg-[color:var(--chart-2)]" /> 2025
              </span>
            </p>
          </div>
          <div className="mt-3 flex items-end gap-[3%]">
            {THIS_YEAR.map((v, i) => (
              <div key={MONTHS[i]} className="flex h-[120px] flex-1 items-end justify-center gap-[12%]">
                <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-2)]" style={{ height: `${(LAST_YEAR[i] / 45) * 100}%` }} />
                <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-1)]" style={{ height: `${(v / 45) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[calc(var(--radius)+2px)] border border-border">
          <p className="px-3 pt-3 font-semibold">Recent invoices</p>
          <ul className="mt-2">
            {RECENT.map((r) => (
              <li key={r.client} className="flex items-center gap-2 border-t border-border px-3 py-2">
                <span className="min-w-0 flex-1 truncate">{r.client}</span>
                <span className={cn("dc-pill", PILL[r.status])}>{r.status}</span>
                <span className="dc-num w-[68px] text-right">{r.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Small({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="dc-card flex flex-col p-6">
      <div aria-hidden="true" className="flex items-center text-[13px] sm:h-[112px]">
        {children}
      </div>
      <h3 className="dc-h mt-5 text-[19px] leading-snug">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

const box = "w-full rounded-[calc(var(--radius)+4px)] border border-border bg-background"

export default function BentoGridShowcase() {
  return (
    <section aria-labelledby="bento-grid-showcase-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Orbit at a glance</p>
          <h2 id="bento-grid-showcase-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            The money side of your studio, on one screen
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-balance text-muted-foreground">
            Open Orbit on a Monday and know what came in, what is due and who needs a nudge.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="dc-card flex flex-col overflow-hidden bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,var(--card))] md:col-span-2 lg:row-span-2">
            <div className="p-6 sm:p-8">
              <h3 className="dc-h text-[24px] leading-snug sm:text-[28px]">Your month, before it happens</h3>
              <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                What you collected, what is still out and who is late, next to the same month last year.
              </p>
              <a
                href="#dashboard"
                className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius)] text-[15px] font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Take the tour <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div aria-hidden="true" className="relative min-h-[300px] flex-1 sm:min-h-[330px]">
              <div className="absolute top-0 left-6 sm:left-8">
                <Dashboard />
              </div>
            </div>
          </div>

          <Small title="Reminders in your tone" body="Friendly, neutral or firm, written for you and sent on a plan.">
            <div className={cn(box, "p-3")}>
              <div className="grid grid-cols-3 rounded-[var(--radius)] bg-muted p-[3px] text-center">
                {["Friendly", "Neutral", "Firm"].map((t, i) => (
                  <span key={t} className={cn("rounded-[calc(var(--radius)-2px)] py-0.5", i === 0 ? "bg-card font-semibold shadow-sm" : "text-muted-foreground")}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 truncate text-muted-foreground">&ldquo;Hi Tom, a quick nudge&hellip;&rdquo;</p>
            </div>
          </Small>

          <Small title="Paid out in two days" body="Card and bank payments land in your account two working days later.">
            <div className={cn(box, "p-3")}>
              <div className="flex items-center gap-2">
                <Landmark className="size-4 text-muted-foreground" />
                <span className="flex-1 font-semibold">Payout</span>
                <span className="dc-num font-semibold">$7,450.00</span>
              </div>
              <ol className="mt-3 grid grid-cols-3 gap-1.5">
                {["Paid", "On its way", "Arrived"].map((s, i) => (
                  <li key={s}>
                    <span className={cn("block h-1.5 rounded-full", i < 2 ? "bg-[color:var(--dc-accent)]" : "bg-muted")} />
                    <span className={cn("mt-1.5 block text-[11px]", i < 2 ? "font-semibold" : "text-muted-foreground")}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Small>

          <Small title="Retainers on autopilot" body="Recurring invoices go out every month and stop when the contract ends.">
            <ol className={cn(box, "grid grid-cols-6 gap-1 p-3 text-center")}>
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <li key={m}>
                  <span
                    className={cn(
                      "mx-auto grid size-6 place-items-center rounded-full",
                      i < 5 ? "bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "border-2 border-dashed border-[color:var(--dc-accent)]",
                    )}
                  >
                    {i < 5 ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{m}</span>
                </li>
              ))}
            </ol>
          </Small>

          <Small title="Receipts, sent for you" body="The client gets a receipt the moment they pay, and so does your bookkeeper.">
            <div className={cn(box, "flex items-center gap-3 p-3")}>
              <span className="dc-icon size-9 shrink-0">
                <Receipt className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">Receipt sent</span>
                <span className="block truncate text-muted-foreground">To Ola Bakery</span>
              </span>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </div>
          </Small>
        </div>
      </div>
    </section>
  )
}
