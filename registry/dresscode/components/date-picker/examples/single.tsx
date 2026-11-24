"use client"

// A due-date field on an invoice: label, hint, payment-term shortcuts, past days disabled,
// and a note when the date falls on a weekend.
import * as React from "react"
import { addDays, differenceInCalendarDays, format, isWeekend, startOfToday, subDays } from "date-fns"
import { Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DatePicker, useToday } from "@/registry/dresscode/components/date-picker/ui/date-picker"

const TERMS = [7, 14, 30]
const REMIND_BEFORE = 3

function dueHint(due: Date | undefined, today: Date | undefined) {
  if (!due || !today) return `Fernwood Studio sees this date on the invoice. Orbit sends a reminder ${REMIND_BEFORE} days before it.`
  const days = differenceInCalendarDays(due, today)
  if (days === 0) return "Due today, so no reminder goes out first."
  if (days <= REMIND_BEFORE) return `Due in ${days} ${days === 1 ? "day" : "days"}, too soon for a reminder.`
  return `Due in ${days} days. Orbit reminds Fernwood Studio on ${format(subDays(due, REMIND_BEFORE), "EEE, MMM d")}.`
}

export default function DatePickerSingle() {
  const id = React.useId()
  const today = useToday()
  const [due, setDue] = React.useState<Date | undefined>()
  const term = due && today ? TERMS.find((t) => differenceInCalendarDays(due, today) === t) : undefined
  const weekend = due && isWeekend(due)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Invoice INV-1043</CardTitle>
        <CardDescription>Fernwood Studio · $4,200.00 · issued today</CardDescription>
        <CardAction>
          <Badge variant="secondary">Draft</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label id={`${id}-label`} htmlFor={id}>
            Due date
          </Label>
          <ToggleGroup
            aria-label="Payment terms"
            variant="outline"
            size="sm"
            spacing={1}
            value={term ? [String(term)] : []}
            onValueChange={(values: string[]) => {
              if (values[0]) setDue(addDays(today ?? startOfToday(), Number(values[0])))
            }}
          >
            {TERMS.map((t) => (
              <ToggleGroupItem key={t} value={String(t)} className="px-2 text-xs">
                Net {t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <DatePicker
          id={id}
          aria-labelledby={`${id}-label`}
          aria-describedby={weekend ? `${id}-hint ${id}-weekend` : `${id}-hint`}
          value={due}
          onValueChange={setDue}
          min={today}
          placeholder="Pick a due date"
          displayFormat="EEE, MMM d, yyyy"
        />
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {dueHint(due, today)}
        </p>
        {weekend ? (
          <p id={`${id}-weekend`} className="flex gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>
              {format(due, "MMM d")} is a {format(due, "EEEE")}. Bank transfers sent that day usually land on Monday.
            </span>
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Save draft</Button>
        <Button disabled={!due}>Send invoice</Button>
      </CardFooter>
    </Card>
  )
}
