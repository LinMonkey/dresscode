// Hero, split: the promise and the actions on the left; on the right, what the product does for you in
// three cards (the invoice it sends, the reminder it writes, the payment that comes in). The cards are a
// picture, hidden from screen readers; the copy says what they show. On phones they stack under the copy.
import { ArrowRight, BellRing, CircleCheck, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LINES = [
  { item: "Brand identity, phase 2", qty: "1", amount: "$3,200.00" },
  { item: "Website copy", qty: "8 h", amount: "$800.00" },
  { item: "Stock licences", qty: "4", amount: "$200.00" },
]

const PEOPLE = ["AL", "KM", "JS", "RT"]

function InvoiceCard({ className }: { className?: string }) {
  return (
    <div className={cn("dc-card p-5 text-left text-[13px] sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Invoice INV-1042</p>
          <p className="dc-h mt-1 text-[20px]">Fernwood Studio</p>
        </div>
        <span className="dc-pill dc-pill-line">Due Nov 28</span>
      </div>
      <table className="mt-5 w-full">
        <thead>
          <tr className="text-left text-[12px] text-muted-foreground">
            <th className="pb-2 font-medium">Item</th>
            <th className="pb-2 text-right font-medium">Qty</th>
            <th className="pb-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {LINES.map((l) => (
            <tr key={l.item} className="border-t border-border">
              <td className="py-2.5 pr-3">{l.item}</td>
              <td className="dc-num py-2.5 text-right text-muted-foreground">{l.qty}</td>
              <td className="dc-num py-2.5 pl-3 text-right">{l.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
        <span className="font-semibold">Total</span>
        <span className="dc-num text-[22px] font-semibold tracking-tight">$4,200.00</span>
      </div>
      <span className="mt-4 flex h-10 items-center justify-center rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">Pay $4,200.00</span>
    </div>
  )
}

function Visual() {
  // A cascade: the reminder overlaps the invoice's top padding, the payment its bottom padding, so
  // neither covers what the invoice says.
  return (
    <div aria-hidden="true" className="mx-auto flex w-full max-w-[520px] flex-col gap-3 lg:mr-0 lg:gap-0">
      <div className="dc-card relative z-10 flex items-start gap-3 p-4 text-left text-[13px] lg:-mb-5 lg:w-[310px]">
        <span className="dc-icon size-8 shrink-0">
          <BellRing className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">Reminder sent</p>
          <p className="mt-0.5 leading-snug text-muted-foreground">&ldquo;Hi Maya, a friendly nudge that INV-1042 is due on Friday.&rdquo;</p>
        </div>
      </div>
      <InvoiceCard className="lg:ml-12 lg:py-10" />
      <div className="dc-card relative z-10 flex items-center gap-3 p-4 text-left text-[13px] lg:-mt-5 lg:ml-auto lg:w-[290px] lg:translate-x-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
          <CircleCheck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Payment received</p>
          <p className="text-muted-foreground">Northlight paid INV-1040</p>
        </div>
        <span className="dc-num font-semibold">$7,450</span>
      </div>
    </div>
  )
}

export default function HeroSplit() {
  return (
    <section aria-labelledby="hero-split-title" className="overflow-hidden py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="max-w-[560px]">
          <span className="dc-pill dc-pill-hl">Free for your first three clients</span>
          <h1 id="hero-split-title" className="dc-h mt-5 text-[40px] leading-[1.05] sm:text-[56px]">
            Invoices that chase themselves.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
            Send a clear invoice in a minute. Orbit reminds the client before and after the due date, in your words, and tells you the moment the money lands.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
              Start free <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#tour" />}>
              Take the tour
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2" aria-hidden="true">
              {PEOPLE.map((p) => (
                <span key={p} className="grid size-9 place-items-center rounded-full bg-muted text-[11px] font-bold ring-2 ring-background">
                  {p}
                </span>
              ))}
            </div>
            <div className="text-[14px]">
              <p className="flex items-center gap-0.5 text-[color:var(--dc-accent)]" aria-label="Rated 4.9 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
                ))}
                <span className="ml-1.5 font-semibold text-foreground">4.9</span>
              </p>
              <p className="text-muted-foreground">from 1,200 freelancers and studios</p>
            </div>
          </div>
        </div>
        <Visual />
      </div>
    </section>
  )
}
