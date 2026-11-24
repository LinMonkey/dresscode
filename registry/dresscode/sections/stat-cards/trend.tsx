// Stat cards with trend badges: four figures for the month so far, in one card split by hairlines. Each
// badge shows the change against the same days of last month; its color says whether the move is good
// for that figure (outstanding going up is bad news), and its arrow says which way it went. Screen
// readers get the change as a sentence.
import { ArrowDownRight, ArrowRight, ArrowUpRight, CircleDollarSign, Clock3, FileText, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STATS = [
  {
    label: "Revenue",
    value: "$48,210",
    change: "12.4%",
    up: true,
    good: true,
    icon: CircleDollarSign,
    context: "Up from $42,880 in October",
  },
  {
    label: "Outstanding",
    value: "$9,860",
    change: "17.1%",
    up: true,
    good: false,
    icon: FileText,
    context: "5 open invoices, 2 of them late",
  },
  {
    label: "Clients",
    value: "64",
    change: "6",
    up: true,
    good: true,
    icon: Users,
    context: "6 new this month, none lost",
  },
  {
    label: "Days to get paid",
    value: "11",
    change: "3 days",
    up: false,
    good: true,
    icon: Clock3,
    context: "Your terms are 14 days",
  },
]

// One card split into four: stacked on phones, two by two on tablets, a row on desktops.
const DIVIDERS = ["", "border-t sm:border-t-0 sm:border-l", "border-t lg:border-t-0 lg:border-l", "border-t sm:border-l lg:border-t-0"]

export default function StatCardsTrend() {
  return (
    <section aria-labelledby="stat-cards-trend-title" className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="stat-cards-trend-title" className="dc-h text-[24px] leading-tight sm:text-[28px]">
            November so far
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-foreground">Nov 1 to 24, against the same days of October.</p>
        </div>
        <Button variant="outline" className="self-start sm:self-auto" nativeButton={false} render={<a href="#reports" />}>
          Full report <ArrowRight aria-hidden="true" />
        </Button>
      </div>

      <dl className="dc-card mt-6 grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const Arrow = s.up ? ArrowUpRight : ArrowDownRight
          return (
            <div key={s.label} className={cn("flex flex-col border-border p-5 sm:p-6", DIVIDERS[i])}>
              <dt className="flex items-center justify-between gap-3 text-[14px] font-medium text-muted-foreground">
                {s.label}
                <span className="dc-icon size-8" aria-hidden="true">
                  <s.icon className="size-4" />
                </span>
              </dt>
              <dd className="mt-3 mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <span className="dc-num text-[32px] leading-none font-semibold tracking-tight">{s.value}</span>
                <span className={cn("dc-pill", s.good ? "dc-pill-hl" : "dc-pill-danger")} aria-hidden="true">
                  <Arrow className="size-3.5" />
                  <span className="dc-num">
                    {s.up ? "+" : "−"}
                    {s.change}
                  </span>
                </span>
                <span className="sr-only">
                  , {s.up ? "up" : "down"} {s.change} on October, {s.good ? "a good change" : "a change for the worse"}.
                </span>
              </dd>
              <dd className="mt-auto text-[13px] leading-snug text-muted-foreground">{s.context}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
