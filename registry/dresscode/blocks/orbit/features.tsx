// What Orbit does: a six-feature grid, three alternating feature rows (the reminders row can wear
// the band), a bento of everything else, and how it works in three steps.
import {
  ArrowRight,
  BellRing,
  ChartColumn,
  Check,
  CreditCard,
  FileSpreadsheet,
  Fingerprint,
  Globe,
  Landmark,
  Lock,
  Mail,
  Repeat,
  Send,
  Smartphone,
  UserRoundCheck,
} from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { BarChart } from "./product-preview"
import { Container, Kicker, Section, SectionHeading, StatusPill } from "./shared"

const GRID = [
  { icon: Send, title: "Send in a minute", body: "Pick a client, add the lines, press send. Orbit fills in your details, terms and payment link." },
  { icon: BellRing, title: "Reminders that sound like you", body: "Friendly follow-ups go out before and after the due date, written in your tone." },
  { icon: ChartColumn, title: "Know what is coming in", body: "See what is paid, what is due and what is at risk this month, at a glance." },
  { icon: CreditCard, title: "Get paid your way", body: "Cards, bank transfer and payment links, with the fees shown up front." },
  { icon: Repeat, title: "Retainers on autopilot", body: "Recurring invoices bill every month and stop when the contract ends." },
  { icon: FileSpreadsheet, title: "Ready for tax time", body: "Export every invoice and payment to a tidy CSV your accountant will like." },
]

export function FeatureGrid() {
  return (
    <Section id="features" labelledBy="features-title">
      <Container>
        <SectionHeading
          id="features-title"
          kicker="Features"
          title="Everything between the job and the payment"
          body="Orbit covers the boring middle: the invoice, the chasing and the bookkeeping that follows."
        />
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {GRID.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <span className="dc-icon">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <h3 className="dc-h mt-4 text-[20px] leading-snug">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

// ---------- feature rows ----------

function InvoiceBuilder() {
  return (
    <div className="dc-card p-5 text-[14px]">
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
        ].map(([l, a]) => (
          <li key={l} className="flex justify-between py-2.5">
            <span>{l}</span>
            <span className="dc-num">{a}</span>
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
          <Send className="size-3.5" aria-hidden="true" /> Send invoice
        </span>
      </div>
    </div>
  )
}

function ReminderPreview() {
  return (
    <div className="grid gap-3 text-[14px] sm:grid-cols-[1.2fr_1fr]">
      <div className="dc-card p-5">
        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Mail className="size-3.5" aria-hidden="true" /> To: tom@katolee.studio
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
            ["3 days before", "Friendly heads-up", true],
            ["On the due date", "Payment link again", true],
            ["7 days after", "A firmer nudge", false],
          ].map(([when, what, done]) => (
            <li key={String(when)} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2",
                  done ? "border-[color:var(--dc-accent)] bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "border-border",
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}
              </span>
              <span>
                <span className="block font-semibold">{when}</span>
                <span className="text-muted-foreground">{what}</span>
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
    <div className="dc-card p-5 text-[14px]">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted-foreground">Expected in December</p>
          <p className="dc-num text-[30px] font-semibold tracking-tight">$18,450</p>
        </div>
        <span className="dc-pill dc-pill-hl">+$2,300 vs November</span>
      </div>
      <BarChart className="mt-5" />
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
  flip = false,
  band = false,
}: {
  id: string
  kicker: string
  title: string
  body: string
  points: string[]
  visual: ReactNode
  flip?: boolean
  band?: boolean
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn(band ? "dc-band py-20 sm:py-28" : "py-14 sm:py-20")}>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn(flip && "lg:order-2")}>
          <Kicker className="in-[.dc-band]:text-current">{kicker}</Kicker>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[30px] leading-[1.1] sm:text-[40px]">
            {title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{body}</p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-[color:var(--dc-accent)] in-[.dc-band]:text-current" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <Button variant="link" className="dc-flat mt-5 h-auto px-0 text-[15px] font-semibold text-foreground">
            Learn more <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className={cn(flip && "lg:order-1")}>{visual}</div>
      </Container>
    </section>
  )
}

export function FeatureRows({ band = false }: { band?: boolean }) {
  return (
    <div>
      <Row
        id="send"
        kicker="Invoices"
        title="Send an invoice before your coffee cools"
        body="Your logo, terms, tax and payment details are already there. Add the lines, check the total, send."
        points={["Saved clients and line items", "Tax and discounts worked out for you", "A payment link on every invoice"]}
        visual={<InvoiceBuilder />}
      />
      <Row
        id="reminders"
        kicker="Reminders"
        title="Reminders that sound like you"
        body="Orbit follows up on unpaid invoices on a plan you set, in your tone, so you never have to write the awkward email."
        points={["Before, on and after the due date", "Stops the moment the client pays", "Optional late fees, applied politely"]}
        visual={<ReminderPreview />}
        flip
        band={band}
      />
      <Row
        id="forecast"
        kicker="Cash flow"
        title="See the month before it happens"
        body="Every invoice has a due date, so Orbit knows what should land and when. Plan the month on real numbers."
        points={["Expected, received and at risk", "Compare with the same month last year", "A weekly summary in your inbox"]}
        visual={<ForecastCard />}
      />
    </div>
  )
}

// ---------- bento ----------

export function Bento() {
  return (
    <Section labelledBy="bento-title">
      <Container>
        <SectionHeading id="bento-title" kicker="And the rest" title="Small things that save whole afternoons" />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <div className="dc-card p-6 md:col-span-2">
            <UserRoundCheck className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
            <h3 className="dc-h mt-4 text-[22px]">A portal for every client</h3>
            <p className="mt-2 max-w-[440px] text-muted-foreground">Clients see every invoice you sent them, download receipts and pay, without an account.</p>
            <ul aria-hidden="true" className="mt-6 divide-y divide-border rounded-[var(--radius)] border border-border text-[14px]">
              {[
                ["INV-1040", "Website retainer, October", "Paid"],
                ["INV-1042", "Brand identity", "Due"],
              ].map(([id, what, st]) => (
                <li key={id} className="flex items-center gap-3 px-4 py-3">
                  <span className="dc-num text-muted-foreground">{id}</span>
                  <span className="min-w-0 flex-1 truncate">{what}</span>
                  <StatusPill status={st as "Paid" | "Due"} />
                </li>
              ))}
            </ul>
          </div>
          <div className="dc-card p-6">
            <Landmark className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
            <h3 className="dc-h mt-4 text-[22px]">Cards and bank transfer</h3>
            <p className="mt-2 text-muted-foreground">Money lands in your account in two working days. Fees are shown before you send.</p>
          </div>
          <div className="dc-card p-6">
            <Globe className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
            <h3 className="dc-h mt-4 text-[22px]">30 currencies</h3>
            <p className="mt-2 text-muted-foreground">Bill in your client&apos;s currency and get paid in yours.</p>
            <div aria-hidden="true" className="mt-5 flex flex-wrap gap-2">
              {["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((c) => (
                <span key={c} className="dc-pill dc-pill-line dc-num">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="dc-card p-6">
            <Lock className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
            <h3 className="dc-h mt-4 text-[22px]">Locked down</h3>
            <p className="mt-2 text-muted-foreground">Two-step sign-in, roles for your team and a log of every change.</p>
            <p aria-hidden="true" className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold">
              <Fingerprint className="size-4 text-[color:var(--dc-accent)]" /> Two-step sign-in is on
            </p>
          </div>
          <div className="dc-card p-6">
            <Smartphone className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
            <h3 className="dc-h mt-4 text-[22px]">Send from your phone</h3>
            <p className="mt-2 text-muted-foreground">Finish the job on site and send the invoice before you leave.</p>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ---------- how it works ----------

const STEPS = [
  { title: "Add your clients", body: "Import a CSV or type them in. Orbit remembers addresses, currencies and tax." },
  { title: "Send the first invoice", body: "Use your logo and terms once; every invoice after that takes a minute." },
  { title: "Let Orbit follow up", body: "Pick a reminder plan. Orbit chases, records the payment and sends the receipt." },
]

export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <Container>
        <SectionHeading id="how-title" kicker="How it works" title="Set up in ten minutes, paid sooner every month" />
        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="dc-card p-6">
              <span className="dc-num grid size-9 place-items-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground">{i + 1}</span>
              <h3 className="dc-h mt-5 text-[21px]">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
