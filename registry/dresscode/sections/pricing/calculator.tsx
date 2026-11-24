"use client"

// Pricing, usage calculator: graduated pricing per invoice, worked out live from a slider. The price, the
// plan the volume falls in and the cost per invoice follow the slider, and the rate card shows how the
// total is made up. A polite live region reads the result once the slider settles, not on every step.
import { ArrowRight } from "lucide-react"
import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const MAX = 1000

const TIERS = [
  { plan: "Free", from: 0, to: 10, rate: 0, range: "First 10 invoices" },
  { plan: "Studio", from: 10, to: 100, rate: 0.5, range: "11 to 100" },
  { plan: "Agency", from: 100, to: 500, rate: 0.3, range: "101 to 500" },
  { plan: "Scale", from: 500, to: Infinity, rate: 0.2, range: "501 and up" },
]

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n)
const count = (n: number) => new Intl.NumberFormat("en-US").format(n)

function quote(n: number) {
  const lines = TIERS.map((t) => {
    const used = Math.max(0, Math.min(n, t.to) - t.from)
    return { ...t, used, subtotal: used * t.rate }
  })
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  const tier = TIERS.find((t) => n <= t.to) ?? TIERS[TIERS.length - 1]
  return { lines, total, plan: tier.plan, each: n ? total / n : 0 }
}

export default function PricingCalculator() {
  const id = useId()
  const [invoices, setInvoices] = useState(120)
  const q = quote(invoices)
  const summary = `${count(invoices)} invoices a month: ${money(q.total)} a month on the ${q.plan} plan${q.total ? `, ${money(q.each)} an invoice` : ""}.`

  // Announce once the value has been still for a moment, so dragging doesn't read out every step.
  const [announced, setAnnounced] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(summary), 700)
    return () => clearTimeout(t)
  }, [summary])

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Usage pricing</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Pay for the invoices you send
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">The first ten each month are free, and every invoice costs less as you send more. Drafts and reminders never count.</p>
        </div>

        <div className="dc-card mx-auto mt-12 grid max-w-[1040px] overflow-hidden lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-9">
            <div className="flex items-end justify-between gap-4">
              <p id={`${id}-label`} className="font-semibold">
                Invoices a month
              </p>
              <p className="dc-h dc-num text-[32px] leading-none" aria-hidden="true">
                {count(invoices)}
              </p>
            </div>
            <Slider
              aria-labelledby={`${id}-label`}
              value={[invoices]}
              onValueChange={(v) => setInvoices(Array.isArray(v) ? v[0] : (v as number))}
              min={0}
              max={MAX}
              step={5}
              largeStep={50}
              className="mt-6 py-2 **:data-[slot=slider-thumb]:size-5 **:data-[slot=slider-thumb]:border-2 **:data-[slot=slider-thumb]:border-primary **:data-[slot=slider-thumb]:bg-card **:data-[slot=slider-track]:h-2"
            />
            <div aria-hidden="true" className="mt-2 flex justify-between text-[12px] text-muted-foreground">
              {[0, 250, 500, 750, 1000].map((n) => (
                <span key={n} className="dc-num">
                  {count(n)}
                </span>
              ))}
            </div>

            <table className="mt-8 w-full text-[14px]">
              <caption className="sr-only">How the price is made up</caption>
              <thead>
                <tr className="text-left text-[12px] text-muted-foreground">
                  <th scope="col" className="pb-2 font-medium">
                    Invoices
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Each
                  </th>
                  <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">
                    Sent
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {q.lines.map((l) => {
                  const current = l.plan === q.plan
                  return (
                    <tr key={l.plan} className={cn("border-t border-border", !l.used && "text-muted-foreground")}>
                      <th scope="row" className="py-3 pr-3 text-left font-normal">
                        <span className={cn("font-semibold", l.used && "text-foreground", current && "text-[color:var(--dc-accent)]")}>{l.plan}</span>
                        <span className="ml-2 text-muted-foreground">{l.range}</span>
                        {current ? <span className="sr-only"> (your plan)</span> : null}
                      </th>
                      <td className="dc-num py-3 text-right">{l.rate ? `$${l.rate.toFixed(2)}` : "Free"}</td>
                      <td className="dc-num hidden py-3 text-right sm:table-cell">{count(l.used)}</td>
                      <td className="dc-num py-3 pl-3 text-right">{money(l.subtotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2 pt-0 lg:pt-2 lg:pl-0">
            <div className="flex h-full flex-col rounded-[calc(var(--dc-radius-card)-4px)] bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,var(--card))] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">Your plan</p>
                <span className="dc-pill dc-pill-hl">{q.plan}</span>
              </div>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="dc-h dc-num text-[56px] leading-none">{money(q.total)}</span>
                <span className="text-[15px] text-muted-foreground">/ month</span>
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-[14px]">
                <div>
                  <dt className="text-muted-foreground">Per invoice</dt>
                  <dd className="dc-num mt-0.5 text-[18px] font-semibold">{q.total ? money(q.each) : "Free"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Per year</dt>
                  <dd className="dc-num mt-0.5 text-[18px] font-semibold">{money(q.total * 12)}</dd>
                </div>
              </dl>
              <p className="sr-only" aria-live="polite">
                {announced}
              </p>
              <div className="mt-auto pt-8">
                <Button size="lg" className="h-12 w-full text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
                  {q.total ? `Start on ${q.plan}` : "Start free"} <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <p className="mt-3 text-center text-[13px] text-muted-foreground">Billed monthly on what you send.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-[14px] text-muted-foreground">
          Sending more than 1,000 a month?{" "}
          <a href="#sales" className="rounded-sm font-semibold text-foreground underline underline-offset-4 outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50">
            Talk to us about volume pricing
          </a>
        </p>
      </div>
    </section>
  )
}
