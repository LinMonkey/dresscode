// Pricing, single plan: one card with everything the plan includes as a two-column checklist on the left
// and the price, the one action and a line of reassurance on a tinted panel on the right. On phones the
// price panel comes first, so the price and the action are on the first screen.
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

const INCLUDED = [
  "Unlimited clients and invoices",
  "Reminders in your own tone",
  "Card, bank and wallet payments",
  "Recurring invoices",
  "Quotes that turn into invoices",
  "Your logo, colors and domain",
  "Cash-flow forecast",
  "Late fees, if you want them",
  "30 currencies",
  "Export for your accountant",
  "Two-step sign-in",
  "Email support from a person",
]

export default function PricingSingle() {
  return (
    <section aria-labelledby="pricing-single-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Pricing</p>
          <h2 id="pricing-single-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            One plan, with everything in it
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">No tiers to compare and no features held back. One price for all of Orbit, however many clients you bill.</p>
        </div>

        <div className="dc-card mx-auto mt-12 grid max-w-[1040px] overflow-hidden lg:grid-cols-[1.55fr_1fr]">
          <div className="order-2 p-7 sm:p-10 lg:order-1">
            <h3 className="dc-h text-[24px] leading-tight">Orbit Studio</h3>
            <p className="mt-2 max-w-[460px] text-muted-foreground">For freelancers and small studios who want invoices out the door and money in, without the follow-up emails.</p>
            <div className="mt-8 flex items-center gap-4">
              <p className="shrink-0 text-[14px] font-semibold text-[color:var(--dc-accent)]">Everything included</p>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <ul className="mt-6 grid gap-x-8 gap-y-3.5 text-[15px] sm:grid-cols-2">
              {INCLUDED.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="mt-0.5 size-[18px] shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 p-2 lg:order-2">
            <div className="flex h-full flex-col items-center justify-center rounded-[calc(var(--dc-radius-card)-4px)] bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,var(--card))] px-6 py-10 text-center sm:px-10">
              <p className="font-semibold">Pay monthly, cancel any time</p>
              <p className="mt-5 flex items-baseline justify-center gap-1.5">
                <span className="dc-h dc-num text-[64px] leading-none">$12</span>
                <span className="text-[15px] text-muted-foreground">/ month</span>
              </p>
              <p className="mt-3 text-[14px] text-muted-foreground">Or $120 a year, two months free</p>
              <Button size="lg" className="mt-8 h-12 w-full max-w-[300px] text-[16px] font-semibold" nativeButton={false} render={<a href="#trial" />}>
                Start a 14-day trial <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                No card needed for the trial
              </p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-[14px] text-muted-foreground">
          Billing a team of five or more?{" "}
          <a href="#sales" className="rounded-sm font-semibold text-foreground underline underline-offset-4 outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50">
            Ask about Agency
          </a>
        </p>
      </div>
    </section>
  )
}
