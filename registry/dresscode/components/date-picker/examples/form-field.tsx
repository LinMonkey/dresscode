"use client"

// Date pickers in a form: a recurring-invoice schedule with validation messages (required, not in the
// past, end after start), errors shown once a field has been touched, and Start disabled until valid.
import * as React from "react"
import { addDays, addMonths, addWeeks, format } from "date-fns"
import { CircleCheck } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker, useToday } from "@/registry/dresscode/components/date-picker/ui/date-picker"

const REPEAT = [
  { value: "weekly", label: "Every week", step: (d: Date, n: number) => addWeeks(d, n) },
  { value: "fortnightly", label: "Every 2 weeks", step: (d: Date, n: number) => addWeeks(d, n * 2) },
  { value: "monthly", label: "Every month", step: (d: Date, n: number) => addMonths(d, n) },
]
const AMOUNT = 1200
/** The draft was saved a while ago, so its first date may have passed since. */
const DRAFT_START = new Date(2026, 10, 2)

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

type Errors = { start?: string; end?: string }

function validate(start: Date | undefined, end: Date | undefined, today: Date | undefined): Errors {
  const errors: Errors = {}
  if (!start) errors.start = "Pick the date of the first invoice."
  else if (today && start < today) errors.start = "This date has passed. Pick today or a later day."
  if (!end) errors.end = "Pick the date of the last invoice."
  else if (start && end <= start) errors.end = "The last invoice has to come after the first one."
  return errors
}

export default function DatePickerFormField() {
  const id = React.useId()
  const today = useToday()
  const [repeat, setRepeat] = React.useState("monthly")
  const [start, setStart] = React.useState<Date | undefined>(DRAFT_START)
  const [end, setEnd] = React.useState<Date | undefined>()
  // The saved start date counts as touched; the empty end date shows its error once it has been opened.
  const [touched, setTouched] = React.useState({ start: true, end: false })
  const [done, setDone] = React.useState(false)

  const errors = validate(start, end, today)
  const valid = !!today && !errors.start && !errors.end
  const rule = REPEAT.find((r) => r.value === repeat) ?? REPEAT[2]
  let count = 0
  if (valid && start && end) while (count < 520 && rule.step(start, count) <= end) count++
  const last = valid && start ? rule.step(start, count - 1) : undefined
  const blocker = errors.start && errors.end ? "Fix both dates to start." : errors.start ? "Fix the first date to start." : errors.end ? "Fix the last date to start." : ""
  const blocked = !valid && !!blocker

  if (done && start && last) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent>
          <Alert>
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Schedule started</AlertTitle>
            <AlertDescription>
              {count === 1 ? "1 invoice" : `${count} invoices`} to Fernwood Studio, the first on {format(start, "MMM d, yyyy")} and the last on {format(last, "MMM d, yyyy")}.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" onClick={() => setDone(false)}>
            Edit schedule
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTouched({ start: true, end: true })
          if (valid) setDone(true)
        }}
        className="contents"
      >
        <CardHeader>
          <CardTitle>Recurring invoice</CardTitle>
          <CardDescription>Fernwood Studio · {money.format(AMOUNT)} each · draft saved Nov 2</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-repeat`}>Repeat</Label>
            <Select items={REPEAT} value={repeat} onValueChange={(v) => v && setRepeat(v)}>
              <SelectTrigger id={`${id}-repeat`} className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPEAT.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
            <div className="grid content-start gap-2">
              <Label id={`${id}-start-label`} htmlFor={`${id}-start`}>
                First invoice
              </Label>
              <DatePicker
                id={`${id}-start`}
                name="startDate"
                aria-labelledby={`${id}-start-label`}
                aria-describedby={`${id}-start-msg`}
                aria-invalid={touched.start && !!errors.start}
                value={start}
                onValueChange={setStart}
                onOpenChange={(open) => !open && setTouched((t) => ({ ...t, start: true }))}
                min={today}
                placeholder="Pick a date"
              />
              <p id={`${id}-start-msg`} className={touched.start && errors.start ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
                {touched.start && errors.start ? errors.start : "Sent at 9:00 AM on the day."}
              </p>
            </div>
            <div className="grid content-start gap-2">
              <Label id={`${id}-end-label`} htmlFor={`${id}-end`}>
                Last invoice
              </Label>
              <DatePicker
                id={`${id}-end`}
                name="endDate"
                aria-labelledby={`${id}-end-label`}
                aria-describedby={`${id}-end-msg`}
                aria-invalid={touched.end && !!errors.end}
                value={end}
                onValueChange={(d) => {
                  setEnd(d)
                  if (!d) setTouched((t) => ({ ...t, end: true }))
                }}
                onOpenChange={(open) => !open && setTouched((t) => ({ ...t, end: true }))}
                min={start && today && start >= today ? addDays(start, 1) : today}
                placeholder="Pick a date"
              />
              <p id={`${id}-end-msg`} className={touched.end && errors.end ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
                {touched.end && errors.end ? errors.end : "No invoices go out after this day."}
              </p>
            </div>
          </div>
          <p aria-live="polite" className="rounded-lg bg-muted px-3 py-2 text-sm">
            {valid && start && last ? (
              <>
                <span className="font-medium">{count === 1 ? "1 invoice" : `${count} invoices`}</span>, {rule.label.toLowerCase()} from{" "}
                {format(start, "MMM d, yyyy")} to {format(last, "MMM d, yyyy")}:{" "}
                <span className="font-medium">{money.format(count * AMOUNT)}</span> in total.
              </>
            ) : (
              <span className="text-muted-foreground">Pick both dates to see how many invoices go out.</span>
            )}
          </p>
        </CardContent>
        <CardFooter className="flex-wrap justify-end gap-x-3 gap-y-2">
          {blocked ? (
            <p id={`${id}-blockers`} className="mr-auto text-sm text-muted-foreground">
              {blocker}
            </p>
          ) : null}
          <Button type="button" variant="outline">
            Save draft
          </Button>
          <Button type="submit" disabled={!valid} aria-describedby={blocked ? `${id}-blockers` : undefined}>
            Start schedule
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
