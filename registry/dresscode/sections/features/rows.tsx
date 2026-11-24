// Features, rows: three features, each with a kicker, a heading, a line of copy and three points on one
// side and a small picture of the product on the other, alternating sides down the page. The pictures
// are drawn in markup so they wear the theme; they are hidden from screen readers and the copy beside
// them says what they show. On phones the picture follows its copy.
import { ArrowRight, Check, Mail, Send } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
const THIS_YEAR = [18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42]
const LAST_YEAR = [15, 16, 18, 17, 20, 21, 22, 21, 25, 24, 27]

function InvoiceBuilder() {
  return (
    <div aria-hidden="true" className="dc-card p-5 text-[14px] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="dc-h text-[18px]">New invoice</p>
        <span className="dc-num text-muted-foreground">INV-1043</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold">Client</p>
          <p className="mt-1 flex h-9 items-center rounded-[var(--radius)] border border-input px-3">Fernwood Studio</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold">Due</p>
          <p className="mt-1 flex h-9 items-center rounded-[var(--radius)] border border-ring px-3 ring-3 ring-ring/20">Dec 8, 2026</p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {[
          ["Brand identity", "$3,000.00"],
          ["Website copy", "$1,200.00"],
        ].map(([line, amount]) => (
          <li key={line} className="flex justify-between py-2.5">
            <span>{line}</span>
            <span className="dc-num">{amount}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-muted-foreground">Total</span>
        <span className="dc-num text-[22px] font-semibold">$4,200.00</span>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <span className="inline-flex h-9 items-center rounded-[var(--radius)] border border-input px-3 font-medium">Preview</span>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">
          <Send className="size-3.5" /> Send invoice
        </span>
      </div>
    </div>
  )
}

function ReminderPreview() {
  return (
    <div aria-hidden="true" className="grid gap-3 text-[14px] sm:grid-cols-[1.2fr_1fr]">
      <div className="dc-card p-5">
        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Mail className="size-3.5" /> To: tom@katolee.studio
        </p>
        <p className="mt-3 font-semibold">A quick nudge about INV-1041</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Hi Tom, hope the launch went well. Invoice INV-1041 for $1,860 was due on Nov 20. You can pay it here in a minute.
        </p>
        <span className="mt-4 inline-flex h-9 items-center rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">Pay invoice</span>
      </div>
      <div className="dc-card p-5">
        <p className="font-semibold">Reminder plan</p>
        <ol className="mt-3 space-y-3">
          {[
            { when: "3 days before", what: "Friendly heads-up", done: true },
            { when: "On the due date", what: "Payment link again", done: true },
            { when: "7 days after", what: "A firmer nudge", done: false },
          ].map((step) => (
            <li key={step.when} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2",
                  step.done ? "border-[color:var(--dc-accent)] bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "border-border",
                )}
              >
                {step.done ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              <span>
                <span className="block font-semibold">{step.when}</span>
                <span className="text-muted-foreground">{step.what}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ForecastCard() {
  return (
    <div aria-hidden="true" className="dc-card p-5 text-[14px] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted-foreground">Expected in December</p>
          <p className="dc-num text-[30px] font-semibold tracking-tight">$18,450</p>
        </div>
        <span className="dc-pill dc-pill-hl">+$2,300 vs November</span>
      </div>
      <div className="mt-5 flex items-end gap-[3%]">
        {THIS_YEAR.map((v, i) => (
          <div key={MONTHS[i]} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-[150px] w-full items-end justify-center gap-[12%]">
              <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-2)]" style={{ height: `${(LAST_YEAR[i] / 45) * 100}%` }} />
              <span className="w-[38%] rounded-t-[3px] bg-[color:var(--chart-1)]" style={{ height: `${(v / 45) * 100}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-5 text-[13px] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-full bg-[color:var(--chart-1)]" /> 2026
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-full bg-[color:var(--chart-2)]" /> 2025
        </span>
      </div>
    </div>
  )
}

function Row({
  id,
  kicker,
  title,
  body,
  points,
  visual,
  more,
  flip = false,
}: {
  id: string
  more: string
  kicker: string
  title: string
  body: string
  points: string[]
  visual: ReactNode
  flip?: boolean
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className={cn("max-w-[540px]", flip && "lg:order-2")}>
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">{kicker}</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[30px] leading-[1.1] sm:text-[40px]">
            {title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{body}</p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <Button variant="link" className="dc-flat mt-5 h-auto px-0 text-[15px] font-semibold text-foreground" nativeButton={false} render={<a href={`#${more}`} />}>
            Learn more<span className="sr-only"> about {more.replace("-", " ")}</span> <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className={cn("min-w-0", flip && "lg:order-1")}>{visual}</div>
      </div>
    </section>
  )
}

export default function FeaturesRows() {
  return (
    <div className="py-4 sm:py-8">
      <Row
        id="features-rows-send"
        more="invoices"
        kicker="Invoices"
        title="Send an invoice before your coffee cools"
        body="Your logo, terms, tax and payment details are already there. Add the lines, check the total, send."
        points={["Saved clients and line items", "Tax and discounts worked out for you", "A payment link on every invoice"]}
        visual={<InvoiceBuilder />}
      />
      <Row
        id="features-rows-remind"
        more="reminders"
        kicker="Reminders"
        title="Reminders that sound like you"
        body="Orbit follows up on unpaid invoices on a plan you set, in your tone, so you never have to write the awkward email."
        points={["Before, on and after the due date", "Stops the moment the client pays", "Optional late fees, applied politely"]}
        visual={<ReminderPreview />}
        flip
      />
      <Row
        id="features-rows-forecast"
        more="cash-flow"
        kicker="Cash flow"
        title="See the month before it happens"
        body="Every invoice has a due date, so Orbit knows what should land and when. Plan the month on real numbers."
        points={["Expected, received and at risk", "Compare with the same month last year", "A weekly summary in your inbox"]}
        visual={<ForecastCard />}
      />
    </div>
  )
}
