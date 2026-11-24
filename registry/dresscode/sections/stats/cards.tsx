// Stats, cards with trends: a heading and four stat cards. Each card has its figure, the change on last
// year (a pill that says whether the change is good) and a strip of twelve bars for the months behind
// it, the latest in full color. The bars are a picture, hidden from screen readers; the caption and the
// change say what they show. The numbers are sample content; replace them with your own.
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string
  caption: string
  change: string
  /** Which way the figure moved; whether that is good is the pill's color, not the arrow. */
  direction: "up" | "down"
  good: boolean
  bars: number[]
}

const STATS: Stat[] = [
  {
    label: "Paid through Orbit",
    value: "$412M",
    caption: "to 4,000 studios and freelancers",
    change: "+34% on 2024",
    direction: "up",
    good: true,
    bars: [22, 24, 23, 27, 29, 28, 31, 33, 32, 36, 38, 41],
  },
  {
    label: "Days to get paid",
    value: "11",
    caption: "on average, down from 26",
    change: "15 days faster",
    direction: "down",
    good: true,
    bars: [26, 24, 21, 19, 18, 16, 15, 14, 13, 12, 12, 11],
  },
  {
    label: "Paid on time",
    value: "92%",
    caption: "of invoices, with reminders on",
    change: "+27 points",
    direction: "up",
    good: true,
    bars: [65, 68, 70, 74, 77, 80, 82, 85, 87, 89, 90, 92],
  },
  {
    label: "Invoices disputed",
    value: "0.4%",
    caption: "because every line is spelled out",
    change: "−0.3 points",
    direction: "down",
    good: true,
    bars: [0.7, 0.7, 0.6, 0.65, 0.6, 0.55, 0.5, 0.5, 0.45, 0.45, 0.42, 0.4],
  },
]

function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values)
  return (
    <div aria-hidden="true" className="flex h-12 items-end gap-1">
      {values.map((v, i) => (
        <span
          key={i}
          className={cn(
            "flex-1 rounded-t-[2px]",
            i === values.length - 1 ? "bg-[color:var(--chart-1)]" : "bg-[color:color-mix(in_oklab,var(--chart-1)_28%,transparent)]",
          )}
          style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export default function StatsCards() {
  return (
    <section aria-labelledby="stats-cards-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[600px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Orbit in 2025</p>
            <h2 id="stats-cards-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              What changes in the first year
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              Medians across every studio and freelancer that sent at least ten invoices with Orbit last year.
            </p>
          </div>
          <Button variant="link" className="dc-flat h-auto self-start px-0 text-[15px] font-semibold text-foreground md:self-auto" nativeButton={false} render={<a href="#report" />}>
            Read the full report <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <dl className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => {
            const Arrow = s.direction === "up" ? ArrowUpRight : ArrowDownRight
            return (
              <div key={s.label} className="dc-card flex flex-col p-6">
                <dt className="text-[14px] font-medium text-muted-foreground">{s.label}</dt>
                <dd className="mt-3 flex flex-1 flex-col">
                  <span className="dc-h dc-num block text-[40px] leading-none">{s.value}</span>
                  <span className="mt-4 block">
                    <span className={cn("dc-pill", s.good ? "dc-pill-hl" : "dc-pill-danger")}>
                      <Arrow className="size-3.5" aria-hidden="true" />
                      {s.change}
                    </span>
                  </span>
                  <span className="mt-3 block text-[14px] leading-snug text-pretty text-muted-foreground">{s.caption}</span>
                  <div className="mt-auto pt-6">
                    <Bars values={s.bars} />
                    <div aria-hidden="true" className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
