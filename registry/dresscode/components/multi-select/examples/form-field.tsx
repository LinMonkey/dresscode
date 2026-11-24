"use client"

// A multi select in a form: label, hint, required validation on submit (the error is linked to the
// field and focus moves there), and the picks submitted as ordinary form values under one name.
// Uncontrolled: the form reads the picks with FormData, the way it reads the other fields.
import * as React from "react"
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { MultiSelect, type MultiSelectOptionGroup } from "@/registry/dresscode/components/multi-select/ui/multi-select"

const RECIPIENTS: MultiSelectOptionGroup[] = [
  {
    label: "Teams",
    options: [
      { value: "team-finance", label: "Finance", description: "4 people" },
      { value: "team-leadership", label: "Leadership", description: "3 people" },
      { value: "team-sales", label: "Sales", description: "6 people" },
      { value: "team-operations", label: "Operations", description: "2 people" },
    ],
  },
  {
    label: "People",
    options: [
      { value: "ada", label: "Ada Lin", description: "Finance lead" },
      { value: "grace", label: "Grace Mensah", description: "Founder" },
      { value: "tom", label: "Tom Okafor", description: "Account manager" },
      { value: "sofia", label: "Sofía Reyes", description: "Bookkeeper" },
      { value: "kato-lee", label: "Kato & Lee", description: "External accountants, read only" },
    ],
  },
]

type Errors = { report?: string; recipients?: string }

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} className="flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlertIcon aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  )
}

export default function MultiSelectFormField() {
  const [errors, setErrors] = React.useState<Errors>({})
  // "idle", "saving", or how many recipients the saved schedule goes to.
  const [status, setStatus] = React.useState<"idle" | "saving" | number>("idle")
  const [formKey, setFormKey] = React.useState(0)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const report = String(data.get("report") ?? "").trim()
    const recipients = data.getAll("recipients").map(String)
    const next: Errors = {
      report: report ? undefined : "Give the report a name.",
      recipients: recipients.length ? undefined : "Pick at least one team or person.",
    }
    setErrors(next)
    if (next.report || next.recipients) {
      document.getElementById(next.report ? "report-name" : "report-recipients")?.focus()
      return
    }
    setStatus("saving")
    // Stands in for the request that saves the schedule.
    timer.current = setTimeout(() => setStatus(recipients.length), 800)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setErrors({})
    setStatus("idle")
    setFormKey((k) => k + 1)
  }

  const saving = status === "saving"
  const done = typeof status === "number"
  // Any edit after saving needs a new save.
  const edited = () => done && setStatus("idle")

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Schedule a report</CardTitle>
        <CardDescription>Orbit sends it as a PDF on the 1st of every month.</CardDescription>
      </CardHeader>
      <form key={formKey} noValidate onSubmit={submit} onChange={edited} className="contents">
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="report-name">Report</Label>
            <Input
              id="report-name"
              name="report"
              defaultValue="Monthly revenue"
              required
              aria-invalid={errors.report ? true : undefined}
              aria-describedby={errors.report ? "report-name-error" : undefined}
              onChange={() => errors.report && setErrors((e) => ({ ...e, report: undefined }))}
            />
            <FieldError id="report-name-error">{errors.report}</FieldError>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="report-recipients" className="gap-1">
              Send to <span className="font-normal text-muted-foreground">(required)</span>
            </Label>
            <MultiSelect
              id="report-recipients"
              name="recipients"
              required
              options={RECIPIENTS}
              defaultValue={["team-finance"]}
              maxChips={4}
              placeholder="Pick teams or people…"
              aria-invalid={errors.recipients ? true : undefined}
              aria-describedby={errors.recipients ? "report-recipients-hint report-recipients-error" : "report-recipients-hint"}
              onValueChange={(value) => {
                edited()
                if (value.length && errors.recipients) setErrors((e) => ({ ...e, recipients: undefined }))
              }}
              emptyMessage={(query) => `No team or person called “${query}”.`}
            />
            <p id="report-recipients-hint" className="text-xs text-muted-foreground">
              Teams include everyone in them now and anyone who joins later.
            </p>
            <FieldError id="report-recipients-error">{errors.recipients}</FieldError>
          </div>

          <Label className="w-fit font-normal">
            <Checkbox name="csv" defaultChecked />
            Attach the numbers as a CSV file too
          </Label>
        </CardContent>

        <CardFooter className="flex-wrap justify-end gap-2">
          <p aria-live="polite" className="mr-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            {done ? (
              <>
                <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                Sends Dec 1 to {status} {status === 1 ? "recipient" : "recipients"}.
              </>
            ) : null}
          </p>
          <Button type="button" variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button type="submit" disabled={saving || done}>
            {saving ? <Spinner data-icon="inline-start" aria-hidden="true" /> : null}
            {saving ? "Scheduling…" : done ? "Scheduled" : "Schedule report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
