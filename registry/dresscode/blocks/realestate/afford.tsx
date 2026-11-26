"use client"

// What can you afford? Income, monthly debts and the down payment give a price, using the common
// 28% / 36% rule (housing at most 28% of gross income, all debts at most 36%) and the rate, tax and
// insurance in MORTGAGE (data.ts). It links to the homes for sale under that price.
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

import { LISTINGS, MORTGAGE } from "./data"
import { money, payment, searchPath, to } from "./site"

/** The highest price whose monthly cost (principal, interest, tax, insurance) fits the budget. */
function priceFor(monthly: number, down: number) {
  const r = MORTGAGE.rate / 100 / 12
  const n = MORTGAGE.years * 12
  const k = r / (1 - Math.pow(1 + r, -n))
  const perDollar = (1 - down / 100) * k + MORTGAGE.tax / 100 / 12
  return Math.max(0, (monthly - MORTGAGE.insurance) / perDollar)
}

export function Affordability({ base }: { base: string }) {
  const [income, setIncome] = useState(200_000)
  const [debts, setDebts] = useState(500)
  const [down, setDown] = useState(MORTGAGE.down)
  const monthly = Math.max(0, Math.min((income / 12) * 0.28, (income / 12) * 0.36 - debts))
  // Round down to the nearest $5,000, as a price people search by.
  const price = Math.floor(priceFor(monthly, down) / 5000) * 5000
  const cost = payment(price, { down }).total
  const within = LISTINGS.filter((l) => l.status === "sale" && l.price <= price).length
  const rows = [
    ["Household income", `${money(income)} a year`, income, setIncome, 40_000, 500_000, 5_000],
    ["Monthly debts", `${money(debts)} a month`, debts, setDebts, 0, 5_000, 50],
    ["Down payment", `${down}%`, down, setDown, 3, 50, 1],
  ] as const
  return (
    <div className="dc-card grid overflow-hidden md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="grid gap-6 p-6 sm:p-8">
        {rows.map(([label, value, v, setV, min, max, step]) => (
          <div key={label}>
            <div className="mb-2.5 flex justify-between gap-3 text-[15px]">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground tabular-nums">{value}</span>
            </div>
            <Slider value={[v]} min={min} max={max} step={step} onValueChange={(x) => setV(Array.isArray(x) ? x[0] : x)} aria-label={label} />
          </div>
        ))}
        <p className="text-[13px] text-muted-foreground">
          At {MORTGAGE.rate}% over {MORTGAGE.years} years, with Port Avery&apos;s property tax and insurance. An estimate, not an offer of credit.
        </p>
      </div>
      <div className="flex flex-col justify-center gap-1 border-t border-border bg-muted/50 p-6 sm:p-8 md:border-t-0 md:border-l">
        <p className="text-[15px] text-muted-foreground">You could afford a home of about</p>
        <p className="dc-h dc-num text-[clamp(2.4rem,4.6vw,3.6rem)] leading-none tabular-nums" aria-live="polite">
          {money(price)}
        </p>
        <p className="mt-2 text-[15px]">
          About <span className="font-semibold tabular-nums">{money(cost)}</span> a month, with {money((price * down) / 100)} down.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" className="h-11 px-5 text-[15px]" nativeButton={false} render={<Link href={`${to(base, searchPath("sale"))}${price ? `?max=${price}` : ""}`} />}>
            {within === 1 ? "See 1 home" : `See ${within} homes`} in budget <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-5 text-[15px]" nativeButton={false} render={<Link href={to(base, "mortgage")} />}>
            Full calculator
          </Button>
        </div>
      </div>
    </div>
  )
}
