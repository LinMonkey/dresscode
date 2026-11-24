"use client"

// Far-away dates: month and year dropdowns in the calendar caption jump decades in two clicks.
// A date of birth (no future days, an age check) and a passport expiry (warns when it runs out soon).
import * as React from "react"
import { addYears, differenceInMonths, differenceInYears } from "date-fns"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DatePicker, useToday } from "@/registry/dresscode/components/date-picker/ui/date-picker"

const EARLIEST_BIRTH = new Date(1920, 0, 1)
const LATEST_EXPIRY = new Date(2046, 11, 31)
const MIN_AGE = 18
const WARN_MONTHS = 6

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

/** 112 -> "9 years and 4 months" */
function duration(months: number) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years ? plural(years, "year") : "", rest ? plural(rest, "month") : ""].filter(Boolean).join(" and ")
}

export default function DatePickerMonthYear() {
  const id = React.useId()
  const today = useToday()
  const [birth, setBirth] = React.useState<Date | undefined>()
  const [expiry, setExpiry] = React.useState<Date | undefined>()

  const age = birth && today ? differenceInYears(today, birth) : undefined
  const tooYoung = age !== undefined && age < MIN_AGE
  const monthsLeft = expiry && today ? differenceInMonths(expiry, today) : undefined
  const expiresSoon = monthsLeft !== undefined && monthsLeft < WARN_MONTHS

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>Needed for payouts over $600 a year. Only you and your accountant can see them.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label id={`${id}-birth-label`} htmlFor={`${id}-birth`}>
            Date of birth
          </Label>
          <DatePicker
            id={`${id}-birth`}
            name="birthDate"
            aria-labelledby={`${id}-birth-label`}
            aria-describedby={`${id}-birth-hint`}
            aria-invalid={tooYoung}
            value={birth}
            onValueChange={setBirth}
            captionLayout="dropdown"
            min={EARLIEST_BIRTH}
            max={today}
            calendarProps={{ defaultMonth: new Date(1990, 0) }}
            displayFormat="MMMM d, yyyy"
            placeholder="Pick your date of birth"
          />
          <p id={`${id}-birth-hint`} className={tooYoung ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
            {age === undefined
              ? "Use the month and year menus at the top of the calendar to get there fast."
              : tooYoung
                ? `You need to be ${MIN_AGE} or older to receive payouts.`
                : `Age ${age}.`}
          </p>
        </div>
        <div className="grid gap-2">
          <Label id={`${id}-expiry-label`} htmlFor={`${id}-expiry`}>
            Passport expires on
          </Label>
          <DatePicker
            id={`${id}-expiry`}
            name="passportExpiry"
            aria-labelledby={`${id}-expiry-label`}
            aria-describedby={`${id}-expiry-hint`}
            value={expiry}
            onValueChange={setExpiry}
            captionLayout="dropdown"
            min={today}
            max={LATEST_EXPIRY}
            calendarProps={{ defaultMonth: today ? addYears(today, 5) : undefined }}
            displayFormat="MMMM d, yyyy"
            placeholder="Pick the expiry date"
          />
          {expiresSoon ? (
            <p id={`${id}-expiry-hint`} className="flex gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span>
                Expires in {monthsLeft === 0 ? "less than a month" : plural(monthsLeft, "month")}. Renew it soon: many countries ask for {WARN_MONTHS} months left.
              </span>
            </p>
          ) : (
            <p id={`${id}-expiry-hint`} className="text-sm text-muted-foreground">
              {monthsLeft === undefined
                ? "The date printed on the photo page."
                : `Valid for ${duration(monthsLeft)}.`}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Skip for now</Button>
        <Button disabled={!birth || !expiry || tooYoung}>Save details</Button>
      </CardFooter>
    </Card>
  )
}
