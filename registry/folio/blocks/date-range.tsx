"use client"

// The date range control for app pages (design image D5): a top-bar button that opens presets beside a
// two-month range calendar, with Cancel / Apply. A provider shares the range with the page's charts:
//
//   <DateRangeProvider defaultValue={{ from: "2026-01-01", to: "2026-01-31" }} today="2026-01-31" min="2025-02-01">
//     <DashboardShell dateRange={<DateRangePicker />}>
//       <YourPage />   ← reads it with useDateRange()
//     </DashboardShell>
//   </DateRangeProvider>
//
// Ranges are ISO dates ("2026-01-31"), inclusive on both ends.
import { CalendarDays, ChevronDown } from "lucide-react"
import { createContext, type ReactNode, useContext, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/folio/ui/button"
import { Calendar } from "@/registry/folio/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/folio/ui/popover"

export type DateRange = { from: string; to: string }
export type Preset = { label: string; range: DateRange }

type Ctx = { range: DateRange; setRange: (r: DateRange) => void; today: string; min?: string }
const RangeContext = createContext<Ctx | null>(null)

export function DateRangeProvider({
  defaultValue,
  value,
  onChange,
  today,
  min,
  children,
}: {
  defaultValue?: DateRange
  value?: DateRange
  onChange?: (r: DateRange) => void
  /** The last selectable day (usually today). */
  today: string
  /** The first day with data. */
  min?: string
  children: ReactNode
}) {
  const [inner, setInner] = useState<DateRange>(defaultValue ?? { from: addDays(today, -29), to: today })
  const range = value ?? inner
  const setRange = (r: DateRange) => {
    setInner(r)
    onChange?.(r)
  }
  return <RangeContext.Provider value={{ range, setRange, today, min }}>{children}</RangeContext.Provider>
}

export function useDateRange() {
  const ctx = useContext(RangeContext)
  if (!ctx) throw new Error("useDateRange needs a <DateRangeProvider> above it")
  return ctx
}

// ---------------------------------------------------------------------------------------------
// Date helpers (UTC, so a range never shifts with the reader's time zone)

const DAY = 864e5
export const toTime = (d: string) => Date.parse(`${d}T00:00:00Z`)
export const toIso = (t: number) => new Date(t).toISOString().slice(0, 10)
export const addDays = (d: string, n: number) => toIso(toTime(d) + n * DAY)
export const daysIn = (r: DateRange) => Math.round((toTime(r.to) - toTime(r.from)) / DAY) + 1
/** The range of the same length just before this one (for "vs. previous period"). */
export const previousRange = (r: DateRange): DateRange => ({ from: addDays(r.from, -daysIn(r)), to: addDays(r.from, -1) })
const local = (d: string) => new Date(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10)))
const fromLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const long = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
/** "Jan 1, 2026 – Jan 31, 2026" (or "Jan 1–31, 2026" with `compact`). */
export function formatRange(r: DateRange, compact = false) {
  const f = new Date(toTime(r.from))
  const t = new Date(toTime(r.to))
  if (!compact) return `${long.format(f)} – ${long.format(t)}`
  const sameYear = f.getUTCFullYear() === t.getUTCFullYear()
  if (sameYear && f.getUTCMonth() === t.getUTCMonth()) return `${short.format(f)}–${t.getUTCDate()}, ${t.getUTCFullYear()}`
  return sameYear ? `${short.format(f)} – ${short.format(t)}, ${t.getUTCFullYear()}` : `${long.format(f)} – ${long.format(t)}`
}

/** The first day of the month `n` months before year y, month m (1–12). */
const monthsBack = (y: number, m: number, n: number) => {
  const i = y * 12 + (m - 1) - n
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}-01`
}

/** The usual presets, counted back from `today`. */
export function defaultPresets(today: string): Preset[] {
  const y = Number(today.slice(0, 4))
  const m = Number(today.slice(5, 7))
  const monthStart = `${today.slice(0, 7)}-01`
  const lastMonthEnd = addDays(monthStart, -1)
  return [
    { label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
    { label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
    { label: "This month", range: { from: monthStart, to: today } },
    { label: "Last month", range: { from: `${lastMonthEnd.slice(0, 7)}-01`, to: lastMonthEnd } },
    { label: "This year", range: { from: `${y}-01-01`, to: today } },
    { label: "Last 12 months", range: { from: monthsBack(y, m, 11), to: today } },
  ]
}

const same = (a?: DateRange, b?: DateRange) => !!a && !!b && a.from === b.from && a.to === b.to

// ---------------------------------------------------------------------------------------------

/** The top-bar button and its popover. Uses the nearest DateRangeProvider. */
export function DateRangePicker({ presets, className }: { presets?: Preset[]; className?: string }) {
  const { range, setRange, today, min } = useDateRange()
  const list = presets ?? defaultPresets(today)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<{ from?: string; to?: string }>(range)
  const complete = !!draft.from && !!draft.to
  const activePreset = list.find((p) => same(p.range, draft as DateRange))
  const reset = () => setDraft(range)

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) reset()
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={`Date range: ${formatRange(range)}`}
            className={cn("h-[31px] gap-[8px] rounded-[4px] px-[10px] text-[13.5px] font-normal lg:w-[232px] aria-expanded:border-foreground", className)}
          />
        }
      >
        <CalendarDays className="size-[15px]" />
        <span className="sm:hidden">{formatRange(range, true)}</span>
        <span className="hidden truncate sm:inline">{formatRange(range)}</span>
        <ChevronDown className="ml-auto size-[14px] transition-transform in-aria-expanded:rotate-180" strokeWidth={2.25} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-[calc(100vw-24px)] gap-0 p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Presets: a column on wider screens, a scrolling row on phones */}
          <ul aria-label="Presets" className="flex gap-[6px] overflow-x-auto border-b border-hairline p-[10px] sm:w-[150px] sm:flex-col sm:gap-[2px] sm:overflow-visible sm:border-r sm:border-b-0 sm:py-[12px]">
            {[...list, { label: "Custom range", range: null as unknown as DateRange }].map((p) => {
              const on = p.range ? same(p.range, draft as DateRange) : !activePreset
              return (
                <li key={p.label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => p.range && setDraft(p.range)}
                    aria-pressed={on}
                    className={cn(
                      "w-full rounded-[2px] px-[10px] py-[6px] text-left text-[14px] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/25 sm:border-l-[3px] sm:border-transparent sm:pl-[9px]",
                      on ? "bg-press-tint font-semibold text-foreground sm:border-press" : "hover:bg-secondary",
                      !p.range && !on && "text-ink-2",
                    )}
                  >
                    {p.label}
                  </button>
                </li>
              )
            })}
          </ul>
          <div>
            <Calendar
              mode="range"
              numberOfMonths={2}
              className="p-[10px]"
              defaultMonth={local(addDays(draft.to ?? range.to, -28))}
              selected={{ from: draft.from ? local(draft.from) : undefined, to: draft.to ? local(draft.to) : undefined }}
              // One click starts a new range, the next one ends it (earlier than the start: it becomes the start).
              onSelect={(_, day) => {
                const d = fromLocal(day)
                if (!draft.from || draft.to) setDraft({ from: d, to: undefined })
                else if (d < draft.from) setDraft({ from: d, to: undefined })
                else setDraft({ from: draft.from, to: d })
              }}
              disabled={[{ after: local(today) }, ...(min ? [{ before: local(min) }] : [])]}
              excludeDisabled
            />
            <div className="flex flex-wrap items-center gap-[10px] border-t border-hairline px-[12px] py-[10px]">
              <p className="mr-auto text-[14px] tabular-nums" aria-live="polite">
                {complete ? formatRange(draft as DateRange) : draft.from ? `${long.format(new Date(toTime(draft.from)))} – pick an end date` : "Pick a start date"}
              </p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!complete}
                onClick={() => {
                  setRange(draft as DateRange)
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
