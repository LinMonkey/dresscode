// Pricing, two plans: Free and Pro as the two halves of one card, each with its price, its action and
// what you get in plain sentences rather than ticks, and a footer that says switching is safe. Pro sits
// on a faint tint instead of a loud ring, to keep the section calm.
import { ArrowRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    body: "For getting started and for the odd side project.",
    lead: "What you get",
    points: [
      "Up to three clients, with as many invoices as you like.",
      "Clients pay by card or bank transfer from the invoice.",
      "One polite reminder when an invoice is late.",
      "A small Orbit line at the bottom of each invoice.",
    ],
    cta: "Start free",
    href: "#start",
  },
  {
    name: "Pro",
    price: "$12",
    per: "a month",
    body: "For when invoicing is how you pay the rent.",
    lead: "Everything in Free, and",
    points: [
      "No limit on clients, so there is room to grow.",
      "Reminders before and after due dates, in your voice.",
      "Your logo and colors on invoices, and none of ours.",
      "Recurring invoices, late fees and a forecast.",
    ],
    cta: "Try Pro free for 14 days",
    href: "#trial",
    pro: true,
  },
]

export default function PricingTwoPlans() {
  return (
    <section aria-labelledby="pricing-two-plans-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Pricing</p>
          <h2 id="pricing-two-plans-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Free to start, Pro when it pays
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">Two plans and no small print. Most people stay on Free until their fourth client.</p>
        </div>

        <div className="dc-card mx-auto mt-12 max-w-[960px] overflow-hidden">
          <ul className="grid md:grid-cols-2">
            {PLANS.map((p) => (
              <li
                key={p.name}
                className={cn(
                  "flex flex-col p-7 sm:p-10",
                  p.pro && "border-t border-border bg-[color:color-mix(in_oklab,var(--dc-accent)_5%,var(--card))] md:border-t-0 md:border-l",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="dc-h text-[26px] leading-tight">{p.name}</h3>
                  {p.pro ? <span className="dc-pill dc-pill-hl">14 days free</span> : null}
                </div>
                <p className="mt-2 text-muted-foreground">{p.body}</p>
                <p className="mt-7 flex items-baseline gap-1.5">
                  <span className="dc-h dc-num text-[48px] leading-none">{p.price}</span>
                  <span className="text-muted-foreground">{p.per}</span>
                </p>
                <Button
                  size="lg"
                  variant={p.pro ? "default" : "outline"}
                  className="mt-7 h-11 w-full text-[15px] font-semibold"
                  nativeButton={false}
                  render={<a href={p.href} />}
                >
                  {p.cta}
                  {p.pro ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
                </Button>
                <p className="mt-8 text-[14px] font-semibold">{p.lead}</p>
                <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                  {p.points.map((t) => (
                    <li key={t} className="flex gap-3 text-pretty">
                      <span aria-hidden="true" className={cn("mt-[0.6em] size-1.5 shrink-0 rounded-full", p.pro ? "bg-[color:var(--dc-accent)]" : "bg-muted-foreground/50")} />
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-3 border-t border-border px-7 py-5 text-[14px] sm:items-center sm:px-10">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)] sm:mt-0" aria-hidden="true" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Change your mind any time.</span> Going back to Free keeps every client and invoice you have; only the Pro extras switch off.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
