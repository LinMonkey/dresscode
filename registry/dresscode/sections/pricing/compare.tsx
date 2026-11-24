// Pricing, comparison table: every feature of every plan, grouped, with each plan's price and action at
// the top of its column and the recommended plan's column tinted. On phones the table scrolls sideways
// inside its own box (the page never does) and the feature names stay pinned on the left. The box takes
// keyboard focus so it can be scrolled without a mouse.
import { Check, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLANS = [
  { name: "Free", price: "$0", per: "forever", cta: "Start free", href: "#start" },
  { name: "Studio", price: "$12", per: "/ month", cta: "Start trial", href: "#trial", featured: true },
  { name: "Agency", price: "$39", per: "/ month", cta: "Talk to us", href: "#sales" },
]

type Cell = boolean | string
const GROUPS: { title: string; rows: [string, Cell, Cell, Cell][] }[] = [
  {
    title: "Invoicing",
    rows: [
      ["Clients", "3", "Unlimited", "Unlimited"],
      ["Invoices", "Unlimited", "Unlimited", "Unlimited"],
      ["Quotes and estimates", false, true, true],
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
      ["Payment plans", false, true, true],
    ],
  },
  {
    title: "Reminders and reports",
    rows: [
      ["Automatic reminders", "Basic", "Your tone", "Your tone"],
      ["Late fees", false, true, true],
      ["Cash-flow forecast", false, true, true],
      ["Export for your accountant", true, true, true],
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

// The pinned feature column needs an opaque fill so the plan columns slide under it; on phones a hairline
// on its right edge shows where the scrolling starts.
const PIN = "sticky left-0 z-10 w-[148px] min-w-[148px] px-4 text-left sm:w-[34%] sm:px-6 max-sm:shadow-[inset_-1px_0_0_var(--border)]"
const TINT = "bg-[color:color-mix(in_oklab,var(--dc-accent)_6%,var(--card))]"

function Value({ v }: { v: Cell }) {
  if (v === true)
    return (
      <>
        <Check className="mx-auto size-5 text-[color:var(--dc-accent)]" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    )
  if (v === false)
    return (
      <>
        <Minus className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    )
  return <span>{v}</span>
}

export default function PricingCompare() {
  return (
    <section aria-labelledby="pricing-compare-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Compare plans</p>
          <h2 id="pricing-compare-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Every feature, side by side
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">All plans send unlimited invoices. The differences are in how many clients, people and currencies you work with.</p>
        </div>

        <p className="mt-10 text-center text-[13px] text-muted-foreground sm:hidden">Swipe the table sideways to see every plan.</p>
        <div
          role="region"
          aria-label="Plan comparison table"
          tabIndex={0}
          className="dc-card mt-3 overflow-x-auto outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:mt-12"
        >
          <table className="w-full min-w-[560px] border-separate border-spacing-0 text-[15px]">
            <caption className="sr-only">Orbit plans compared feature by feature</caption>
            <thead>
              <tr>
                <th scope="col" className={cn(PIN, "bg-card py-6 align-bottom text-[14px] font-medium text-muted-foreground")}>
                  Features
                </th>
                {PLANS.map((p) => (
                  <th key={p.name} scope="col" className={cn("w-[22%] min-w-[136px] px-3 pt-6 pb-6 align-bottom font-normal sm:px-6", p.featured && TINT)}>
                    <div className="flex flex-col items-center text-center">
                      <span className="flex min-h-[22px] items-center">
                        {p.featured ? <span className="dc-pill dc-pill-hl">Most popular</span> : null}
                      </span>
                      <span className="mt-2 text-[16px] font-semibold">{p.name}</span>
                      <span className="mt-1 flex items-baseline gap-1">
                        <span className="dc-h dc-num text-[30px] leading-none">{p.price}</span>
                        <span className="text-[13px] whitespace-nowrap text-muted-foreground">{p.per}</span>
                      </span>
                      <Button
                        variant={p.featured ? "default" : "outline"}
                        className="mt-4 h-9 w-full max-w-[160px] font-semibold"
                        nativeButton={false}
                        render={<a href={p.href} />}
                      >
                        {p.cta}
                        <span className="sr-only">: {p.name} plan</span>
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {GROUPS.map((g) => (
              <tbody key={g.title}>
                <tr>
                  <th scope="rowgroup" className={cn(PIN, "border-t border-border bg-muted py-2.5 text-[13px] font-semibold text-muted-foreground")}>
                    {g.title}
                  </th>
                  <td colSpan={PLANS.length} className="border-t border-border bg-muted" />
                </tr>
                {g.rows.map(([label, ...vals]) => (
                  <tr key={label}>
                    <th scope="row" className={cn(PIN, "border-t border-border bg-card py-3.5 font-normal")}>
                      {label}
                    </th>
                    {vals.map((v, i) => (
                      <td key={i} className={cn("border-t border-border px-3 py-3.5 text-center sm:px-6", PLANS[i].featured && TINT)}>
                        <Value v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}
