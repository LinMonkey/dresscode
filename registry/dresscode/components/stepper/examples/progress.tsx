"use client"

// A compact progress bar: one segment per step with its label under it, the current one half full.
// Here it leads a four-question setup survey; answered steps stay clickable so you can change an answer.
import * as React from "react"
import { ArrowLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Stepper, StepperItem, StepperTitle, StepperTrigger } from "@/registry/dresscode/components/stepper/ui/stepper"

const STEPS = ["Business", "Volume", "Payments", "Currency"]

const WORK = [
  { id: "services", label: "Services and time", note: "Hourly, daily or project work" },
  { id: "products", label: "Products", note: "Goods you ship or hand over" },
  { id: "both", label: "A bit of both", note: "Services with materials or parts" },
]
const VOLUME = [
  { id: "few", label: "Fewer than 10", note: "A handful of regular clients" },
  { id: "some", label: "10 to 50", note: "A steady stream every week" },
  { id: "many", label: "More than 50", note: "Batches, recurring plans or a team" },
]
const METHODS = [
  { id: "card", label: "Card" },
  { id: "transfer", label: "Bank transfer" },
  { id: "debit", label: "Direct debit" },
  { id: "cash", label: "Cash or cheque" },
]
const CURRENCIES = [
  { value: "USD", label: "US dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British pound (GBP)" },
  { value: "CAD", label: "Canadian dollar (CAD)" },
  { value: "AUD", label: "Australian dollar (AUD)" },
]
const QUESTIONS = [
  "What do you invoice for?",
  "How many invoices do you send a month?",
  "How do your clients usually pay?",
  "Which currency do you invoice in?",
]

export default function StepperProgress() {
  const [step, setStep] = React.useState(2)
  const [furthest, setFurthest] = React.useState(2)
  const [work, setWork] = React.useState<string | null>("services")
  const [volume, setVolume] = React.useState<string | null>(null)
  const [methods, setMethods] = React.useState<string[]>([])
  const [currency, setCurrency] = React.useState<string | null>("USD")
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [finished, setFinished] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const answered = [!!work, !!volume, methods.length > 0, !!currency]
  /** Answered and moved past at least once. */
  const isDone = (n: number) => finished || (n < furthest && answered[n - 1])
  const doneCount = STEPS.filter((_, i) => isDone(i + 1)).length
  const percent = Math.round((doneCount / STEPS.length) * 100)

  function open(to: number) {
    setError(null)
    setStep(to)
  }

  function next() {
    if (!answered[step - 1]) {
      setError(step === 3 ? "Pick at least one way to continue." : "Pick an answer to continue.")
      return
    }
    setError(null)
    if (step < 4) {
      setStep(step + 1)
      setFurthest((f) => Math.max(f, step + 1))
      return
    }
    setSaving(true)
    timer.current = setTimeout(() => {
      setSaving(false)
      setFinished(true)
    }, 1400)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
          <span>{finished ? "All done" : `Step ${step} of ${STEPS.length}`}</span>
          <span className="tabular-nums">{percent}% complete</span>
        </div>
        <Stepper aria-label="Workspace setup" value={finished ? 0 : step} onValueChange={open} linear className="mt-2 items-start gap-1.5">
          {STEPS.map((title, i) => {
            const n = i + 1
            const completed = isDone(n)
            const fill = completed ? "w-full" : n === step && !finished ? "w-1/2" : "w-0"
            return (
              <StepperItem key={title} step={n} completed={completed} loading={saving && n === 4} className="flex-1 last:flex-1">
                <StepperTrigger disabled={saving || finished} className="flex w-full flex-col items-stretch gap-2">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-primary/15">
                    <span className={cn("block h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none", fill)} />
                  </span>
                  <StepperTitle className="flex items-center gap-1 self-start text-xs font-medium">
                    {saving && n === 4 ? <Spinner className="size-3" aria-hidden="true" /> : completed ? <Check className="size-3 text-primary" aria-hidden="true" /> : null}
                    <span className="truncate">{title}</span>
                  </StepperTitle>
                </StepperTrigger>
              </StepperItem>
            )
          })}
        </Stepper>
      </CardHeader>

      {finished ? (
        <CardContent className="py-6 text-center">
          <p className="text-base font-semibold">Your workspace is ready</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            We set up invoice templates for {WORK.find((w) => w.id === work)?.label.toLowerCase()}, priced in {currency}, with{" "}
            {methods.map((m) => METHODS.find((x) => x.id === m)?.label.toLowerCase()).join(", ")} turned on.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => {
              setFinished(false)
              setStep(1)
            }}
          >
            Review answers
          </Button>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <fieldset aria-describedby={error ? "survey-error" : undefined} disabled={saving}>
              <legend className="text-base font-semibold">{QUESTIONS[step - 1]}</legend>
              <div className="mt-3">
                {step === 1 ? <Choices value={work} onChange={setWork} options={WORK} onPick={() => setError(null)} /> : null}
                {step === 2 ? <Choices value={volume} onChange={setVolume} options={VOLUME} onPick={() => setError(null)} /> : null}
                {step === 3 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {METHODS.map((m) => (
                      <label
                        key={m.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
                      >
                        <Checkbox
                          checked={methods.includes(m.id)}
                          onCheckedChange={(on) => {
                            setError(null)
                            setMethods((list) => (on ? [...list, m.id] : list.filter((x) => x !== m.id)))
                          }}
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                ) : null}
                {step === 4 ? (
                  <div className="grid gap-1.5">
                    <Label htmlFor="survey-currency" className="sr-only">
                      Currency
                    </Label>
                    <Select items={CURRENCIES} value={currency} onValueChange={(v) => setCurrency(v == null ? null : String(v))}>
                      <SelectTrigger id="survey-currency" className="w-full">
                        <SelectValue placeholder="Choose a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">You can bill single clients in other currencies later.</p>
                  </div>
                ) : null}
              </div>
              {error ? (
                <p id="survey-error" role="alert" className="mt-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </fieldset>
          </CardContent>
          <CardFooter className="justify-between gap-2">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => open(step - 1)} disabled={saving}>
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={next} disabled={saving}>
              {saving ? <Spinner data-icon="inline-start" aria-hidden="true" /> : null}
              {step < 4 ? "Continue" : saving ? "Setting up…" : "Finish setup"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

function Choices({
  value,
  onChange,
  onPick,
  options,
}: {
  value: string | null
  onChange: (id: string) => void
  onPick: () => void
  options: { id: string; label: string; note: string }[]
}) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={(v) => {
        onPick()
        onChange(String(v))
      }}
      className="gap-2"
    >
      {options.map((o) => (
        <label
          key={o.id}
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
        >
          <RadioGroupItem value={o.id} className="mt-0.5" />
          <span>
            <span className="block text-sm font-medium">{o.label}</span>
            <span className="block text-xs text-muted-foreground">{o.note}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}
