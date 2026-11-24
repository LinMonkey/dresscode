// Steps, timeline: four steps on a vertical line with numbered dots. Each step has a title, a line of
// text and a small picture of the product at that step, drawn in markup so it wears the theme (the
// pictures are hidden from screen readers; the copy says what they show). On wide screens the line runs
// down the middle and the steps alternate sides; on narrower ones it runs down the left.
import { ArrowRight, Check, CircleCheck, Mail, Send, Upload } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CLIENTS = [
  { initials: "FS", name: "Fernwood Studio", currency: "USD" },
  { initials: "NL", name: "Northlight", currency: "EUR" },
  { initials: "KL", name: "Kato & Lee", currency: "GBP" },
]

function ClientsPicture() {
  return (
    <div className="dc-card p-4 text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">Clients</p>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius)] border border-input px-2.5 font-medium">
          <Upload className="size-3.5" /> Import CSV
        </span>
      </div>
      <ul className="mt-3 divide-y divide-border border-t border-border">
        {CLIENTS.map((c) => (
          <li key={c.name} className="flex items-center gap-2.5 py-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] text-[10px] font-bold text-[color:var(--dc-accent)]">{c.initials}</span>
            <span className="min-w-0 flex-1 truncate">{c.name}</span>
            <span className="dc-num text-muted-foreground">{c.currency}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InvoicePicture() {
  return (
    <div className="dc-card p-4 text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground">Invoice INV-1042</p>
          <p className="truncate font-semibold">Fernwood Studio</p>
        </div>
        <span className="dc-pill dc-pill-line">Due Nov 28</span>
      </div>
      <ul className="mt-3 border-t border-border">
        {[
          ["Brand identity", "$3,200.00"],
          ["Website copy", "$1,000.00"],
        ].map(([item, amount]) => (
          <li key={item} className="flex justify-between gap-3 border-b border-border py-2">
            <span className="truncate">{item}</span>
            <span className="dc-num">{amount}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="dc-num text-[16px] font-semibold">$4,200.00</span>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-2.5 font-semibold text-primary-foreground">
          <Send className="size-3.5" /> Send invoice
        </span>
      </div>
    </div>
  )
}

const PLAN = [
  { when: "3 days before", what: "Friendly heads-up", done: true },
  { when: "On the due date", what: "Payment link again", done: true },
  { when: "7 days after", what: "A firmer nudge", done: false },
]

function RemindersPicture() {
  return (
    <div className="dc-card p-4 text-[13px]">
      <p className="flex items-center gap-2 font-semibold">
        <Mail className="size-3.5 text-[color:var(--dc-accent)]" /> Reminder plan for INV-1042
      </p>
      <ol className="mt-3 space-y-2.5 border-t border-border pt-3">
        {PLAN.map((p) => (
          <li key={p.when} className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border-2",
                p.done ? "border-[color:var(--dc-accent)] bg-[color:var(--dc-accent)] text-[color:var(--card)]" : "border-input",
              )}
            >
              {p.done ? <Check className="size-3" strokeWidth={3} /> : null}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{p.when}</span>
            <span className="truncate text-muted-foreground">{p.what}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function PaidPicture() {
  return (
    <div className="dc-card p-4 text-[13px]">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
          <CircleCheck className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Payment received</p>
          <p className="truncate text-muted-foreground">From Fernwood Studio</p>
        </div>
        <span className="dc-num text-[16px] font-semibold">$4,200</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3 text-muted-foreground">
        <span className="min-w-0 truncate">Receipt sent for INV-1042</span>
        <span className="dc-pill dc-pill-hl">Paid</span>
      </div>
    </div>
  )
}

const STEPS: { title: string; body: string; picture: ReactNode }[] = [
  { title: "Add your clients", body: "Import a CSV from your old tool or type them in. Orbit keeps their addresses, currencies and tax.", picture: <ClientsPicture /> },
  { title: "Send the first invoice", body: "Your logo, terms and payment link are filled in. Add the lines, check the total, send.", picture: <InvoicePicture /> },
  { title: "Let Orbit follow up", body: "Pick a reminder plan once. Orbit nudges before and after the due date, in your words.", picture: <RemindersPicture /> },
  { title: "Get paid", body: "The client pays from the email. Orbit records it, sends the receipt and stops the reminders.", picture: <PaidPicture /> },
]

export default function StepsTimeline() {
  return (
    <section aria-labelledby="steps-timeline-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">How it works</p>
          <h2 id="steps-timeline-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            From a list of clients to money in the bank
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Four steps, and you only do the first two once. Here is each one, as it looks in Orbit.
          </p>
        </div>

        <ol className="mx-auto mt-14 max-w-[1040px] sm:mt-16">
          {STEPS.map((s, i) => {
            const flip = i % 2 === 1
            const last = i === STEPS.length - 1
            return (
              <li
                key={s.title}
                className={cn(
                  "relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-5 sm:gap-x-8 lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] lg:gap-x-12",
                  !last && "pb-12 lg:pb-14",
                )}
              >
                {/* The line from this dot to the next one; the dots sit on top of it. */}
                {!last ? <span aria-hidden="true" className="absolute top-5 -bottom-5 left-5 w-0.5 -translate-x-1/2 bg-border lg:left-1/2" /> : null}
                <span className="dc-num relative z-10 row-span-2 grid size-10 place-items-center rounded-full border-2 border-[color:var(--dc-accent)] bg-background text-[15px] font-semibold text-[color:var(--dc-accent)] lg:col-start-2 lg:row-span-1 lg:row-start-1">
                  <span className="sr-only">Step </span>
                  {i + 1}
                </span>
                <div className={cn("pt-1.5 lg:row-start-1", flip ? "lg:col-start-3" : "lg:col-start-1 lg:text-right")}>
                  <div className={cn("lg:max-w-[400px]", !flip && "lg:ml-auto")}>
                    <h3 className="dc-h text-[20px] leading-snug sm:text-[22px]">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </div>
                <div aria-hidden="true" className={cn("mt-5 lg:row-start-1 lg:mt-0", flip ? "lg:col-start-1" : "lg:col-start-3")}>
                  <div className={cn("max-w-[400px]", flip && "lg:ml-auto")}>{s.picture}</div>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-14 flex justify-center">
          <Button size="lg" className="h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Start with step one <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
