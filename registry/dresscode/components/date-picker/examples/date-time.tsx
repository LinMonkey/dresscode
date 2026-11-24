"use client"

// Schedule a reminder: a day, a time in 15-minute steps, quick picks, and the result in words.
// Times that have already passed today are disabled, and the summary keeps counting down.
import * as React from "react"
import { addDays, differenceInCalendarDays, format, formatDistanceStrict, nextMonday, setHours, setMinutes, startOfToday } from "date-fns"
import { BellRing, CircleCheck, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker, useToday } from "@/registry/dresscode/components/date-picker/ui/date-picker"

const TIMES = Array.from({ length: 96 }, (_, i) => {
  const at = setMinutes(setHours(new Date(2000, 0, 1), Math.floor(i / 4)), (i % 4) * 15)
  return { value: format(at, "HH:mm"), label: format(at, "h:mm a") }
})

const subscribeToClock = (onTick: () => void) => {
  const timer = window.setInterval(onTick, 15_000)
  return () => window.clearInterval(timer)
}

/** The current minute, or undefined while prerendering, so the page hydrates cleanly. */
function useNow() {
  const minute = React.useSyncExternalStore(subscribeToClock, () => Math.floor(Date.now() / 60_000), () => 0)
  return React.useMemo(() => (minute ? new Date(minute * 60_000) : undefined), [minute])
}

function atTime(day: Date, time: string) {
  const [h, m] = time.split(":").map(Number)
  return setMinutes(setHours(day, h), m)
}

/** "PST", "GMT+8": the viewer's own time zone at that moment. */
function zoneName(at: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(at).find((p) => p.type === "timeZoneName")?.value ?? ""
}

function inWords(at: Date, now: Date) {
  const days = differenceInCalendarDays(at, now)
  const day = days === 0 ? "today" : days === 1 ? "tomorrow" : days < 7 ? `on ${format(at, "EEEE")}` : `on ${format(at, "EEEE, MMMM d")}`
  return `${day} at ${format(at, "h:mm a")}`
}

const QUICK = [
  { label: "Tomorrow morning", day: (today: Date) => addDays(today, 1), time: "09:00" },
  { label: "Monday morning", day: (today: Date) => nextMonday(today), time: "09:00" },
  { label: "In a week", day: (today: Date) => addDays(today, 7), time: "10:00" },
]

export default function DatePickerDateTime() {
  const id = React.useId()
  const today = useToday()
  const now = useNow()
  const [picked, setPicked] = React.useState<Date | undefined>()
  const [time, setTime] = React.useState("09:00")
  const [scheduled, setScheduled] = React.useState(false)

  // Tomorrow until someone picks a day.
  const day = picked ?? (today ? addDays(today, 1) : undefined)
  const at = day ? atTime(day, time) : undefined
  const isToday = !!day && !!today && differenceInCalendarDays(day, today) === 0
  const passed = !!at && !!now && at <= now
  const ready = !!at && !!now && !passed

  // Picking today when the time has already gone moves the time to the next free quarter hour.
  const pickDay = (next: Date | undefined) => {
    setPicked(next)
    if (next && now && atTime(next, time) <= now) {
      const free = TIMES.find((t) => atTime(next, t.value) > now)
      if (free) setTime(free.value)
    }
  }

  if (scheduled && at && now) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="grid justify-items-center gap-3 py-4 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CircleCheck aria-hidden="true" className="size-5" />
          </span>
          <div role="status" className="grid gap-1">
            <p className="font-medium">Reminder scheduled</p>
            <p className="text-sm text-muted-foreground">
              Pellucid Health gets it {inWords(at, now)}, {formatDistanceStrict(at, now, { addSuffix: true })}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setScheduled(false)}>
              Change time
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setScheduled(false)
                setPicked(undefined)
                setTime("09:00")
              }}
            >
              Cancel reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Schedule a reminder</CardTitle>
        <CardDescription>Orbit emails Pellucid Health about INV-1036, $2,450.00 and 15 days late.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div role="group" aria-label="Quick picks" className="flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <Button
              key={q.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setPicked(q.day(today ?? startOfToday()))
                setTime(q.time)
              }}
            >
              {q.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-3">
          <div className="grid gap-2">
            <Label id={`${id}-day-label`} htmlFor={`${id}-day`}>
              Day
            </Label>
            <DatePicker
              id={`${id}-day`}
              aria-labelledby={`${id}-day-label`}
              value={day}
              onValueChange={pickDay}
              min={today}
              clearable={false}
              placeholder="Pick a day"
              displayFormat="EEE, MMM d, yyyy"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-time`}>Time</Label>
            <Select items={TIMES} value={time} onValueChange={(v) => v && setTime(v)}>
              <SelectTrigger id={`${id}-time`} aria-invalid={passed || undefined} className="w-full">
                <Clock aria-hidden="true" className="text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="max-h-64">
                {TIMES.map((t) => (
                  <SelectItem key={t.value} value={t.value} disabled={isToday && !!now && !!day && atTime(day, t.value) <= now}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div aria-live="polite" className="flex gap-3 rounded-lg bg-muted p-3 text-sm">
          <BellRing aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          {at && now ? (
            passed ? (
              <p className="text-destructive">{format(at, "h:mm a")} has already passed today. Pick a later time.</p>
            ) : (
              <div className="grid gap-0.5">
                <p className="font-medium">Sends {inWords(at, now)}</p>
                <p className="text-muted-foreground">
                  {formatDistanceStrict(at, now, { addSuffix: true })} · {format(at, "MMM d, yyyy, h:mm a")}
                  {` · ${zoneName(at)}`}
                </p>
              </div>
            )
          ) : (
            <p className="text-muted-foreground">Pick a day and a time.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Not now</Button>
        <Button disabled={!ready} onClick={() => setScheduled(true)}>
          Schedule reminder
        </Button>
      </CardFooter>
    </Card>
  )
}
