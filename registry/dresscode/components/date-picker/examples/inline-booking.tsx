"use client"

// Booking a call: an inline calendar (no popover) beside the free time slots for the picked day.
// Weekends, fully booked days and anything past six weeks out are disabled.
import * as React from "react"
import { addDays, differenceInCalendarDays, format, isWeekend, setHours, setMinutes } from "date-fns"
import { CalendarCheck, CircleCheck, Clock, Video } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DatePickerCalendar, useToday } from "@/registry/dresscode/components/date-picker/ui/date-picker"

const BOOK_AHEAD_DAYS = 42
const EPOCH = new Date(2020, 0, 1)
/** 9:00 to 16:30, every half hour. */
const DAY_SLOTS = Array.from({ length: 16 }, (_, i) => ({ h: 9 + Math.floor(i / 2), m: (i % 2) * 30 }))

/** Sample availability: the same free slots every time for the same day. */
function freeSlots(day: Date) {
  if (isWeekend(day)) return []
  const n = differenceInCalendarDays(day, EPOCH)
  if (Math.abs(Math.sin(n * 1.7) * 1e4) % 1 < 0.18) return [] // fully booked
  return DAY_SLOTS.filter((_, i) => Math.abs(Math.sin(n * 7.13 + i * 3.7) * 1e4) % 1 > 0.55).map(({ h, m }) => setMinutes(setHours(day, h), m))
}

function firstFreeDay(today: Date) {
  for (let i = 1; i <= BOOK_AHEAD_DAYS; i++) if (freeSlots(addDays(today, i)).length) return addDays(today, i)
}

export default function DatePickerInlineBooking() {
  const id = React.useId()
  const today = useToday()
  const [picked, setPicked] = React.useState<Date | undefined>()
  const [slot, setSlot] = React.useState<string>()
  const [booked, setBooked] = React.useState(false)

  // Tomorrow or the first day after it with a free slot, until someone picks.
  const day = picked ?? (today ? firstFreeDay(today) : undefined)
  const slots = day ? freeSlots(day) : []
  const chosen = slots.find((s) => format(s, "HH:mm") === slot)

  if (booked && chosen) {
    return (
      <Card className="w-full max-w-md items-center gap-3 px-6 py-8 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CircleCheck aria-hidden="true" className="size-5" />
        </span>
        <div role="status" className="grid gap-1">
          <p className="text-base font-medium">You are booked</p>
          <p className="text-sm text-muted-foreground">
            {format(chosen, "EEEE, MMMM d")} at {format(chosen, "h:mm a")} with Ada Lin, 30 minutes. A calendar invite with the video link is on its way.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setBooked(false)}>
          Pick another time
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl gap-0 py-0 md:flex-row">
      <div className="grid content-start gap-4 border-b p-5 md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="grid">
            <span className="text-sm font-medium">Ada Lin</span>
            <span className="text-xs text-muted-foreground">Customer success, Orbit</span>
          </div>
        </div>
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Onboarding call</h2>
          <p className="text-sm text-muted-foreground">Set up your first invoice, payment reminders and the client portal together.</p>
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4" />
            30 minutes
          </li>
          <li className="flex items-center gap-2">
            <Video aria-hidden="true" className="size-4" />
            Video call, link by email
          </li>
          <li className="flex items-center gap-2">
            <CalendarCheck aria-hidden="true" className="size-4" />
            Times in your time zone
          </li>
        </ul>
      </div>

      <div className="flex justify-center border-b p-3 md:border-r md:border-b-0">
        {today && day ? (
          <DatePickerCalendar
            mode="single"
            required
            selected={day}
            onSelect={(d) => {
              setPicked(d)
              setSlot(undefined)
            }}
            defaultMonth={day}
            startMonth={today}
            endMonth={addDays(today, BOOK_AHEAD_DAYS)}
            disabled={[{ before: addDays(today, 1) }, { after: addDays(today, BOOK_AHEAD_DAYS) }, (d) => freeSlots(d).length === 0]}
            aria-label="Pick a day"
            className="bg-transparent p-2 sm:[--cell-size:--spacing(9)]"
          />
        ) : (
          <div className="grid w-[268px] gap-3 p-2" aria-hidden="true">
            <Skeleton className="mx-auto h-5 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        {day ? (
          <>
            <h3 className="text-sm font-medium" id={`${id}-slots`}>
              {format(day, "EEEE, MMM d")}
              <span className="block text-xs font-normal text-muted-foreground">
                {slots.length} {slots.length === 1 ? "time" : "times"} free
              </span>
            </h3>
            <ToggleGroup
              aria-labelledby={`${id}-slots`}
              orientation="vertical"
              variant="outline"
              spacing={1.5}
              value={slot ? [slot] : []}
              onValueChange={(values: string[]) => setSlot(values[0])}
              className="grid w-full grid-cols-3 sm:grid-cols-4 md:flex md:max-h-72 md:overflow-y-auto md:p-0.5"
            >
              {slots.map((s) => (
                <ToggleGroupItem
                  key={s.getTime()}
                  value={format(s, "HH:mm")}
                  className="w-full tabular-nums aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary"
                >
                  {format(s, "h:mm a")}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button className="mt-auto w-full" disabled={!chosen} onClick={() => setBooked(true)}>
              {chosen ? `Book ${format(chosen, "h:mm a")}` : "Pick a time"}
            </Button>
          </>
        ) : (
          <div className="grid gap-2" aria-hidden="true">
            <Skeleton className="h-4 w-32" />
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
