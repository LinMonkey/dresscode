// Stat cards as goals: the month's revenue target as a ring with what is left, the pace and what is still
// coming in, then the other goals as bars with the figure and what is left. The ring and bars are real
// progress bars for screen readers (role, value and a value text); the drawing itself is hidden.
// The fill grows in once on load (CSS only, and not for people who turn motion off).
import { Check, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const KEYFRAMES = `
@keyframes dc-stat-ring { from { stroke-dashoffset: 100 } }
@keyframes dc-stat-grow { from { transform: scaleX(0) } }
`

const usd = (n: number) => `$${n.toLocaleString("en-US")}`

const PAID = 48210
const TARGET = 55000
const DUE = 9860
const DAY = 24
const DAYS_IN_MONTH = 30
const pct = Math.round((PAID / TARGET) * 100)
const left = TARGET - PAID
const daysLeft = DAYS_IN_MONTH - DAY
const pace = Math.round(((PAID / DAY) * DAYS_IN_MONTH) / 10) * 10
const SCALE = 60000

const GOALS = [
  { label: "New clients", value: 6, goal: 8, figure: "6 of 8", note: "Fernwood and Halcyon came by referral", left: "2 to go" },
  { label: "Hours billed", value: 112, goal: 140, figure: "112 of 140 h", note: "About 5 h a day to the end of the month", left: "28 h to go" },
  { label: "Paid on time", value: 34, goal: 36, figure: "34 of 36", note: "Goal: 90% of this month's 40 invoices", left: "2 to go" },
  // Lower is better here, so the bar is full once the figure is under the goal.
  { label: "Days to get paid", value: 1, goal: 1, figure: "11 days", note: "Goal: 12 days or fewer", left: "Reached" },
]

function Ring({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
      <circle cx="80" cy="80" r="68" fill="none" strokeWidth="14" className="stroke-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
      <circle
        cx="80"
        cy="80"
        r="68"
        fill="none"
        strokeWidth="14"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset={100 - value}
        className="animate-[dc-stat-ring_900ms_ease-out] stroke-[color:var(--chart-1)] motion-reduce:animate-none"
      />
    </svg>
  )
}

export default function StatCardsProgress() {
  return (
    <section aria-labelledby="stat-cards-progress-title" className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8">
      <style href="dc-stat-progress" precedence="default">
        {KEYFRAMES}
      </style>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="stat-cards-progress-title" className="dc-h text-[24px] leading-tight sm:text-[28px]">
            November goals
          </h2>
          <p className="mt-1.5 text-[15px] text-pretty text-muted-foreground">
            {daysLeft} days left in the month. Goals start again on Dec 1.
          </p>
        </div>
        <Button variant="outline" className="self-start sm:self-auto" nativeButton={false} render={<a href="#goals" />}>
          <Pencil aria-hidden="true" /> Edit goals
        </Button>
      </div>

      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <article className="dc-card flex flex-col p-5 sm:p-6" aria-labelledby="stat-cards-progress-revenue">
          <div className="flex items-center justify-between gap-3">
            <h3 id="stat-cards-progress-revenue" className="text-[15px] font-semibold">
              Monthly revenue
            </h3>
            <span className="dc-pill dc-pill-hl">On pace</span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <div
              role="progressbar"
              aria-labelledby="stat-cards-progress-revenue"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-valuetext={`${usd(PAID)} of ${usd(TARGET)}, ${pct}%`}
              className="relative size-[176px] shrink-0"
            >
              <Ring value={pct} />
              <div className="absolute inset-0 grid place-content-center text-center" aria-hidden="true">
                <p className="dc-num text-[36px] leading-none font-semibold tracking-tight">{pct}%</p>
                <p className="mt-1 text-[12px] text-muted-foreground">of target</p>
              </div>
            </div>

            <div className="w-full min-w-0">
              <p className="dc-num text-[34px] leading-none font-semibold tracking-tight">{usd(PAID)}</p>
              <p className="mt-2 text-[14px] text-muted-foreground">
                paid of a <span className="dc-num font-medium text-foreground">{usd(TARGET)}</span> target
              </p>
              <p className="mt-4 text-[14px] leading-snug text-pretty">
                <span className="dc-num font-semibold">{usd(left)}</span> to go in {daysLeft} days. At this month&apos;s pace you finish at{" "}
                <span className="dc-num font-semibold">{usd(pace)}</span>.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div>
              <dt className="text-[12px] text-muted-foreground">Needed a day</dt>
              <dd className="dc-num mt-0.5 text-[16px] font-semibold">{usd(Math.ceil(left / daysLeft))}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">Paid a day so far</dt>
              <dd className="dc-num mt-0.5 text-[16px] font-semibold">{usd(Math.round(PAID / DAY))}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">October, all month</dt>
              <dd className="dc-num mt-0.5 text-[16px] font-semibold">$42,880</dd>
            </div>
          </dl>

          <div className="mt-auto pt-5">
            <div className="rounded-[calc(var(--radius)+2px)] bg-[color:color-mix(in_oklab,var(--foreground)_4%,transparent)] p-4">
              <p className="text-[13px] leading-snug">
                <span className="font-semibold">{usd(DUE)} is due before Nov 30.</span>{" "}
                <span className="text-muted-foreground">If those five invoices are paid, you pass the target by {usd(PAID + DUE - TARGET)}.</span>
              </p>
              <div className="relative mt-3" aria-hidden="true">
                <div className="flex h-2.5 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]">
                  <span className="h-full bg-[color:var(--chart-1)]" style={{ width: `${(PAID / SCALE) * 100}%` }} />
                  <span className="h-full border-l-2 border-[color:var(--card)] bg-[color:color-mix(in_oklab,var(--chart-1)_40%,transparent)]" style={{ width: `${(DUE / SCALE) * 100}%` }} />
                </div>
                <span className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground" style={{ left: `${(TARGET / SCALE) * 100}%` }} />
              </div>
              <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground" aria-hidden="true">
                <li className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-[3px] bg-[color:var(--chart-1)]" /> Paid
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-[3px] bg-[color:color-mix(in_oklab,var(--chart-1)_40%,transparent)]" /> Due by Nov 30
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-3 w-0.5 rounded-full bg-foreground" /> Target
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article className="dc-card flex flex-col p-5 sm:p-6" aria-labelledby="stat-cards-progress-other">
          <div className="flex items-center justify-between gap-3">
            <h3 id="stat-cards-progress-other" className="text-[15px] font-semibold">
              Other goals
            </h3>
            <span className="text-[13px] text-muted-foreground">1 of 4 reached</span>
          </div>
          <ul className="mt-2 flex flex-1 flex-col divide-y divide-border">
            {GOALS.map((g) => {
              const done = g.value >= g.goal
              const value = Math.round((g.value / g.goal) * 100)
              return (
                <li key={g.label} className="flex flex-1 flex-col justify-center py-4 last:pb-0">
                  <Progress
                    value={value}
                    aria-valuetext={`${g.figure}, ${done ? "goal reached" : g.left}`}
                    className={cn(
                      "gap-x-3 gap-y-2.5 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)] [&_[data-slot=progress-indicator]]:origin-left [&_[data-slot=progress-indicator]]:animate-[dc-stat-grow_800ms_ease-out] [&_[data-slot=progress-indicator]]:rounded-full motion-reduce:[&_[data-slot=progress-indicator]]:animate-none",
                      "[&_[data-slot=progress-indicator]]:bg-[color:var(--chart-1)]",
                    )}
                  >
                    <ProgressLabel className="text-[14px] font-medium">{g.label}</ProgressLabel>
                    <span className="dc-num ml-auto text-[14px] font-semibold">{g.figure}</span>
                  </Progress>
                  <p className="mt-2 flex items-center justify-between gap-3 text-[12px] text-muted-foreground">
                    <span className="min-w-0">{g.note}</span>
                    {done ? (
                      <span className="dc-pill dc-pill-hl shrink-0">
                        <Check className="size-3" aria-hidden="true" /> Reached
                      </span>
                    ) : (
                      <span className="shrink-0 font-medium text-foreground">{g.left}</span>
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
        </article>
      </div>
    </section>
  )
}
