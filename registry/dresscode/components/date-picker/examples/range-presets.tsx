"use client"

// A payments report: a date range with presets beside the calendar, future days disabled,
// and totals that follow the range, compared with the period just before it.
import * as React from "react"
import { differenceInCalendarDays, eachDayOfInterval, subDays } from "date-fns"
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DateRangePicker,
  dateRangePresets,
  formatDateRange,
  useToday,
  type DateRange,
} from "@/registry/dresscode/components/date-picker/ui/date-picker"

/** The day the workspace was created: nothing to report before it. */
const ACCOUNT_OPENED = new Date(2024, 0, 8)
const EPOCH = new Date(2020, 0, 1)

/** Sample payments for one day, the same every time for the same date. */
function paymentsOn(day: Date) {
  const n = differenceInCalendarDays(day, EPOCH)
  const r = Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1
  const weekend = day.getDay() === 0 || day.getDay() === 6
  const count = weekend ? (r > 0.75 ? 1 : 0) : 1 + Math.floor(r * 4)
  return { count, amount: count * (640 + Math.round(r * 2200)), daysToPay: count * (6 + Math.floor(r * 19)) }
}

function totals(range: { from: Date; to: Date }) {
  const days = eachDayOfInterval({ start: range.from, end: range.to }).map(paymentsOn)
  const count = days.reduce((s, d) => s + d.count, 0)
  return {
    amount: days.reduce((s, d) => s + d.amount, 0),
    count,
    avgDays: count ? days.reduce((s, d) => s + d.daysToPay, 0) / count : 0,
  }
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function Delta({ now, before, lowerIsBetter = false }: { now: number; before: number; lowerIsBetter?: boolean }) {
  if (!before) return <span className="text-xs text-muted-foreground">No earlier data</span>
  const change = (now - before) / before
  const up = change >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  const good = up !== lowerIsBetter
  return (
    <span className={good ? "inline-flex items-center gap-0.5 text-xs text-foreground" : "inline-flex items-center gap-0.5 text-xs text-destructive"}>
      <Icon aria-hidden="true" className="size-3.5" />
      {Math.abs(change * 100).toFixed(1)}%<span className="sr-only">{up ? " up" : " down"}</span>
    </span>
  )
}

export default function DatePickerRangePresets() {
  const id = React.useId()
  const today = useToday()
  const [picked, setPicked] = React.useState<DateRange | undefined>()
  // Last 30 days until someone picks: read through useToday so the prerendered page hydrates cleanly.
  const range = picked ?? (today ? dateRangePresets[2].getRange(today) : undefined)
  const full = range?.from ? { from: range.from, to: range.to ?? range.from } : undefined
  const length = full ? differenceInCalendarDays(full.to, full.from) + 1 : 0
  const previous = full ? { from: subDays(full.from, length), to: subDays(full.from, 1) } : undefined
  const now = full ? totals(full) : undefined
  const before = previous ? totals(previous) : undefined

  const stats = now && before
    ? [
        { label: "Received", value: money.format(now.amount), delta: <Delta now={now.amount} before={before.amount} /> },
        { label: "Invoices paid", value: now.count.toLocaleString("en-US"), delta: <Delta now={now.count} before={before.count} /> },
        {
          label: "Average time to pay",
          value: `${now.avgDays.toFixed(1)} days`,
          delta: <Delta now={now.avgDays} before={before.avgDays} lowerIsBetter />,
        },
      ]
    : undefined

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid gap-1">
          <CardTitle id={`${id}-title`}>Payments</CardTitle>
          <CardDescription>Money received from all clients</CardDescription>
        </div>
        <span id={`${id}-period`} className="sr-only">
          Report period
        </span>
        <DateRangePicker
          aria-labelledby={`${id}-period`}
          value={range}
          onValueChange={setPicked}
          presets={dateRangePresets}
          min={ACCOUNT_OPENED}
          max={today}
          clearable={false}
          align="end"
          className="sm:w-auto"
          triggerClassName="sm:min-w-64"
        />
      </CardHeader>
      <CardContent>
        <dl aria-labelledby={`${id}-title`} className="grid gap-3 sm:grid-cols-3">
          {stats
            ? stats.map((s) => (
                <div key={s.label} className="grid gap-1 rounded-lg border p-4">
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{s.value}</dd>
                  <dd>{s.delta}</dd>
                </div>
              ))
            : [0, 1, 2].map((i) => (
                <div key={i} className="grid gap-2 rounded-lg border p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
        </dl>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {full && previous ? (
            <>
              {length} {length === 1 ? "day" : "days"}, compared with {formatDateRange(previous)}
            </>
          ) : (
            "Loading the period"
          )}
        </p>
        <Button variant="outline" size="sm" disabled={!full}>
          <Download aria-hidden="true" />
          Export CSV
        </Button>
      </CardFooter>
    </Card>
  )
}
