"use client"

// Pricing, three plans: a monthly or yearly switch (a radio group: arrow keys move between the two) and
// three plans with the middle one recommended. The switch changes every price, each plan says what yearly
// billing saves, and a polite live region tells screen-reader users the prices changed.
import { Check } from "lucide-react"
import { type KeyboardEvent, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"

const PERIODS: { value: Period; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    body: "For your first few clients.",
    features: ["Up to 3 clients", "Unlimited invoices", "Card and bank payments", "Basic reminders"],
    cta: "Start free",
    href: "#start",
  },
  {
    name: "Studio",
    monthly: 12,
    yearly: 10,
    body: "For freelancers and small studios.",
    features: ["Unlimited clients", "Reminders in your tone", "Recurring invoices", "Cash-flow forecast", "Your own branding"],
    cta: "Start a 14-day trial",
    href: "#trial",
    featured: true,
  },
  {
    name: "Agency",
    monthly: 39,
    yearly: 32,
    body: "For teams billing many clients.",
    features: ["Everything in Studio", "5 seats, roles and approvals", "Multiple brands", "30 currencies", "Priority support"],
    cta: "Talk to us",
    href: "#sales",
  },
]

function note(p: (typeof PLANS)[number], period: Period) {
  if (!p.monthly) return "No card needed."
  const saving = (p.monthly - p.yearly) * 12
  return period === "yearly" ? `$${p.yearly * 12} a year. You save $${saving}.` : `Or $${p.yearly} a month billed yearly, saving $${saving}.`
}

function BillingSwitch({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + PERIODS.length) % PERIODS.length
    onChange(PERIODS[next].value)
    refs.current[next]?.focus()
  }
  return (
    <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border border-border bg-muted p-1 text-[14px]">
      {PERIODS.map((p, i) => {
        const on = value === p.value
        return (
          <button
            key={p.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(p.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-4 font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
              on && "bg-card text-foreground shadow-sm",
            )}
          >
            {p.label}
            {p.value === "yearly" ? <span className="dc-pill dc-pill-hl h-5 px-1.5 text-[11px]">Save up to 18%</span> : null}
          </button>
        )
      })}
    </div>
  )
}

export default function PricingTiers() {
  const id = useId()
  const [period, setPeriod] = useState<Period>("yearly")
  const yearly = period === "yearly"
  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Pricing</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Simple pricing that grows with you
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">Start free. Upgrade when Orbit is saving you more than it costs.</p>
        </div>

        <div className="mt-10 flex justify-center">
          <BillingSwitch value={period} onChange={setPeriod} />
        </div>
        <p className="sr-only" aria-live="polite">
          {yearly ? "Showing yearly prices: Studio $10 and Agency $32 a month, billed once a year." : "Showing monthly prices: Studio $12 and Agency $39 a month."}
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? p.yearly : p.monthly
            return (
              <li key={p.name} className={cn("dc-card relative flex flex-col p-7", p.featured && "ring-2 ring-[color:var(--dc-accent)]")}>
                {p.featured ? <span className="dc-pill dc-pill-hl absolute top-7 right-7">Most popular</span> : null}
                <h3 className="dc-h text-[22px] leading-tight">{p.name}</h3>
                <p className="mt-1 text-muted-foreground">{p.body}</p>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5">
                  <span className="dc-h dc-num text-[48px] leading-none">${price}</span>
                  <span className="text-muted-foreground">{price ? (yearly ? "/ month, billed yearly" : "/ month") : "forever"}</span>
                </p>
                <p className="mt-2 text-[14px] text-muted-foreground">{note(p, period)}</p>
                <Button
                  size="lg"
                  variant={p.featured ? "default" : "outline"}
                  className="mt-6 h-11 w-full text-[15px] font-semibold"
                  nativeButton={false}
                  render={<a href={p.href} />}
                >
                  {p.cta}
                </Button>
                <ul className="mt-7 space-y-3 border-t border-border pt-6 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="mt-0.5 size-[18px] shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-center text-[14px] text-muted-foreground">Prices in US dollars, before tax. Every plan sends unlimited invoices.</p>
      </div>
    </section>
  )
}
