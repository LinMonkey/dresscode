"use client"

// Pricing: monthly or yearly, three plans with the middle one recommended, then the full comparison.
import { Check, Minus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Container, Section, SectionHeading } from "./shared"

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    body: "For your first few clients.",
    features: ["Up to 3 clients", "Unlimited invoices", "Card and bank payments", "Basic reminders"],
    cta: "Start free",
  },
  {
    name: "Studio",
    monthly: 12,
    yearly: 10,
    body: "For freelancers and small studios.",
    features: ["Unlimited clients", "Reminders in your tone", "Recurring invoices", "Cash-flow forecast", "Your own branding"],
    cta: "Start a 14-day trial",
    featured: true,
  },
  {
    name: "Agency",
    monthly: 39,
    yearly: 32,
    body: "For teams billing many clients.",
    features: ["Everything in Studio", "5 seats, roles and approvals", "Multiple brands", "30 currencies", "Priority support"],
    cta: "Talk to us",
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)
  return (
    <Section id="pricing" labelledBy="pricing-title">
      <Container>
        <SectionHeading id="pricing-title" kicker="Pricing" title="Simple pricing that grows with you" body="Start free. Upgrade when Orbit is saving you more than it costs." />
        <div className="mt-10 flex justify-center">
          <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border border-border bg-muted p-1 text-[14px]">
            {[
              [false, "Monthly"],
              [true, "Yearly"],
            ].map(([v, label]) => (
              <button
                key={String(label)}
                type="button"
                role="radio"
                aria-checked={yearly === v}
                onClick={() => setYearly(v as boolean)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full px-4 font-semibold text-muted-foreground transition-colors",
                  yearly === v && "bg-card text-foreground shadow-sm",
                )}
              >
                {label}
                {v ? <span className="dc-pill dc-pill-hl h-5 px-1.5 text-[11px]">2 months free</span> : null}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? p.yearly : p.monthly
            return (
              <div key={p.name} className={cn("dc-card relative flex flex-col p-7", p.featured && "ring-2 ring-[color:var(--dc-accent)]")}>
                {p.featured ? <span className="dc-pill dc-pill-hl absolute top-6 right-6">Most popular</span> : null}
                <h3 className="dc-h text-[22px]">{p.name}</h3>
                <p className="mt-1 text-muted-foreground">{p.body}</p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="dc-h dc-num text-[48px] leading-none">${price}</span>
                  <span className="text-muted-foreground">{price ? (yearly ? "/ month, billed yearly" : "/ month") : "forever"}</span>
                </p>
                <Button size="lg" variant={p.featured ? "default" : "outline"} className="mt-6 h-11 w-full text-[15px] font-semibold">
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
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

type Cell = boolean | string
const GROUPS: { title: string; rows: [string, Cell, Cell, Cell][] }[] = [
  {
    title: "Invoicing",
    rows: [
      ["Clients", "3", "Unlimited", "Unlimited"],
      ["Invoices", "Unlimited", "Unlimited", "Unlimited"],
      ["Your own branding", false, true, true],
      ["Recurring invoices", false, true, true],
      ["Multiple brands", false, false, true],
    ],
  },
  {
    title: "Getting paid",
    rows: [
      ["Card and bank payments", true, true, true],
      ["Currencies", "1", "5", "30"],
      ["Client portal", true, true, true],
    ],
  },
  {
    title: "Reminders and reports",
    rows: [
      ["Automatic reminders", "Basic", "Your tone", "Your tone"],
      ["Late fees", false, true, true],
      ["Cash-flow forecast", false, true, true],
    ],
  },
  {
    title: "Team",
    rows: [
      ["Seats", "1", "2", "5"],
      ["Roles and approvals", false, false, true],
      ["Support", "Email", "Email", "Priority"],
    ],
  },
]

function Value({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto size-5 text-[color:var(--dc-accent)]" aria-label="Included" />
  if (v === false) return <Minus className="mx-auto size-5 text-muted-foreground" aria-label="Not included" />
  return <span>{v}</span>
}

export function ComparePlans() {
  return (
    <Section labelledBy="compare-title" className="pt-0 sm:pt-0">
      <Container>
        <h2 id="compare-title" className="dc-h text-center text-[28px] sm:text-[32px]">
          Compare plans
        </h2>
        <div className="dc-card mt-8 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] border-collapse text-[15px]">
            <thead>
              <tr className="text-left">
                <th className="w-[40%] px-6 py-4 font-semibold">Features</th>
                {PLANS.map((p) => (
                  <th key={p.name} className="px-6 py-4 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            {GROUPS.map((g) => (
              <tbody key={g.title}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-muted px-6 py-2.5 text-left text-[13px] font-semibold text-muted-foreground">
                    {g.title}
                  </th>
                </tr>
                {g.rows.map(([label, ...vals]) => (
                  <tr key={label} className="border-t border-border">
                    <th scope="row" className="px-6 py-3.5 text-left font-normal">
                      {label}
                    </th>
                    {vals.map((v, i) => (
                      <td key={i} className="px-6 py-3.5 text-center">
                        <Value v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Container>
    </Section>
  )
}
