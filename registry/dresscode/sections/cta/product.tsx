// Call to action with a product picture: copy, actions and two figures on one side; on the other, the
// month's cash-in card from the product, running off the bottom edge of one large rounded panel tinted
// with the theme's accent. The card is drawn in markup, so it wears the theme; it is a picture, hidden
// from screen readers, and the copy says what it shows. On phones the picture sits under the copy.
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PAYMENTS = [
  { who: "NL", client: "Northlight", note: "Paid Nov 21 · card", amount: "$7,450.00" },
  { who: "JL", client: "Juniper Labs", note: "Paid Nov 19 · bank transfer", amount: "$2,300.00" },
  { who: "FS", client: "Fernwood Studio", note: "Due Nov 28 · reminder sent", amount: "$4,200.00", due: true },
  { who: "OB", client: "Ola Bakery", note: "Paid Nov 14 · card", amount: "$640.00", wide: true },
  { who: "KL", client: "Kato & Lee", note: "Due Dec 2 · sent Nov 18", amount: "$1,860.00", due: true, wide: true },
]

const WEEKS = [38, 52, 44, 70, 58, 82, 64, 90]

function CashCard() {
  return (
    <div aria-hidden="true" className="dc-card w-full p-5 pb-9 text-left text-[13px] sm:p-6 sm:pb-10">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">Cash in · November</p>
        <span className="dc-pill dc-pill-hl">On track</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="dc-num text-[30px] leading-none font-semibold tracking-tight">$18,240</p>
          <p className="mt-1.5 text-muted-foreground">paid of $24,600 invoiced</p>
        </div>
        <div className="flex h-12 items-end gap-1">
          {WEEKS.map((v, i) => (
            <span
              key={i}
              className={cn("w-2 rounded-t-[2px]", i === WEEKS.length - 1 ? "bg-[color:var(--chart-1)]" : "bg-[color:color-mix(in_oklab,var(--chart-1)_35%,transparent)]")}
              style={{ height: `${v}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[74%] rounded-full bg-[color:var(--chart-1)]" />
      </div>
      <ul className="mt-5 divide-y divide-border border-t border-border">
        {PAYMENTS.map((p) => (
          <li key={p.client} className={cn("items-center gap-3 py-3", p.wide ? "hidden lg:flex" : "flex")}>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold">{p.who}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{p.client}</span>
              <span className="block truncate text-[12px] text-muted-foreground">{p.note}</span>
            </span>
            <span className={cn("dc-num shrink-0", p.due ? "text-muted-foreground" : "font-semibold")}>{p.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CtaProduct() {
  return (
    <section aria-labelledby="cta-product-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid overflow-hidden rounded-[calc(var(--dc-radius-card)*1.6)] border border-border bg-[color:color-mix(in_oklab,var(--dc-accent)_9%,var(--background))] lg:grid-cols-2">
          <div className="px-6 pt-12 pb-10 sm:px-12 sm:pt-16 lg:py-16 lg:pr-6 lg:pl-14">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">One calm list</p>
            <h2 id="cta-product-title" className="dc-h mt-3 max-w-[520px] text-[32px] leading-[1.1] sm:text-[42px]">
              Know what is paid and what is still out there.
            </h2>
            <p className="mt-4 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground">
              Orbit adds up the month as payments land and nudges the clients who are late, so you can stop checking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
                Start free <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#tour" />}>
                Take the tour
              </Button>
            </div>
            <dl className="mt-10 grid max-w-[440px] grid-cols-2 gap-6 border-t border-border pt-6">
              <div>
                <dt className="sr-only">Paid sooner</dt>
                <dd className="dc-num text-[26px] leading-none font-semibold tracking-tight">11 days</dd>
                <dd className="mt-1.5 text-[14px] leading-snug text-muted-foreground">sooner to get paid, on average</dd>
              </div>
              <div>
                <dt className="sr-only">Freelancers</dt>
                <dd className="dc-num text-[26px] leading-none font-semibold tracking-tight">4,000+</dd>
                <dd className="mt-1.5 text-[14px] leading-snug text-muted-foreground">freelancers sent an invoice last month</dd>
              </div>
            </dl>
          </div>
          <div className="flex items-end px-6 sm:px-12 lg:items-stretch lg:pt-16 lg:pr-14 lg:pl-6">
            <div className="-mb-5 flex w-full max-w-[460px] lg:ml-auto">
              <CashCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
