"use client"

// A multi-step "create invoice" form: client, line items, schedule, then a review with edit links.
// Continue checks the step's fields and moves focus to the first one that needs fixing. A step gets
// its check mark only once it passes, and the stepper will not jump past a step that is not done.
import * as React from "react"
import { ArrowLeft, ArrowRight, CalendarIcon, CircleCheck, Plus, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/registry/dresscode/components/stepper/ui/stepper"

const STEPS = ["Client", "Line items", "Schedule", "Review"]

const CLIENTS = [
  { value: "fernwood", label: "Fernwood Studio", email: "accounts@fernwood.studio" },
  { value: "kato-lee", label: "Kato & Lee", email: "finance@katolee.co" },
  { value: "pellucid", label: "Pellucid Health", email: "payables@pellucidhealth.com" },
  { value: "halden", label: "Halden Logistics", email: "invoices@halden.io" },
  { value: "bramble", label: "Bramble & Oak", email: "billing@brambleoak.com" },
]
const TERMS = [
  { value: "0", label: "Due on receipt" },
  { value: "7", label: "Net 7" },
  { value: "15", label: "Net 15" },
  { value: "30", label: "Net 30" },
  { value: "60", label: "Net 60" },
]
const TAXES = [
  { value: "0", label: "No tax" },
  { value: "5", label: "Tax 5%" },
  { value: "10", label: "Tax 10%" },
  { value: "20", label: "Tax 20%" },
]
const REPEAT = [
  { value: "none", label: "Doesn't repeat" },
  { value: "monthly", label: "Every month" },
  { value: "quarterly", label: "Every 3 months" },
]

const TODAY = new Date(2026, 10, 24)
const INVOICE = "INV-1044"

type Line = { id: number; description: string; qty: string; rate: string }
type Errors = Record<string, string>

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })
const day = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const amount = (l: Line) => (Number(l.qty) > 0 && Number(l.rate) > 0 ? Number(l.qty) * Number(l.rate) : 0)
const labelOf = (list: { value: string; label: string }[], value: string) => list.find((x) => x.value === value)?.label ?? ""

const START_LINES: Line[] = [
  { id: 1, description: "Brand strategy workshop", qty: "1", rate: "1800" },
  { id: 2, description: "Logo and identity design", qty: "1", rate: "2400" },
]

export default function StepperFormWizard() {
  const [step, setStep] = React.useState(2)
  const [furthest, setFurthest] = React.useState(2)
  const [shown, setShown] = React.useState<Record<number, boolean>>({})
  const [client, setClient] = React.useState<string | null>("fernwood")
  const [email, setEmail] = React.useState("accounts@fernwood.studio")
  const [reference, setReference] = React.useState("PO-7781")
  const [lines, setLines] = React.useState<Line[]>(START_LINES)
  const nextId = React.useRef(3)
  const [tax, setTax] = React.useState("10")
  const [issued, setIssued] = React.useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [terms, setTerms] = React.useState("30")
  const [repeat, setRepeat] = React.useState("none")
  const [reminders, setReminders] = React.useState(true)
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const sentHeading = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  React.useEffect(() => {
    if (sent) sentHeading.current?.focus()
  }, [sent])

  const subtotal = lines.reduce((n, l) => n + amount(l), 0)
  const taxAmount = Math.round(subtotal * Number(tax)) / 100
  const total = subtotal + taxAmount
  const due = issued ? addDays(issued, Number(terms)) : undefined
  const clientInfo = CLIENTS.find((c) => c.value === client)

  function errorsFor(s: number): Errors {
    const e: Errors = {}
    if (s === 1) {
      if (!client) e.client = "Choose who this invoice is for."
      if (!email.trim()) e.email = "Enter the email the invoice goes to."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter an email like name@company.com."
    }
    if (s === 2) {
      for (const l of lines) {
        if (!l.description.trim()) e[`desc-${l.id}`] = "Describe the work."
        if (!(Number(l.qty) > 0)) e[`qty-${l.id}`] = "At least 1."
        if (!(Number(l.rate) > 0)) e[`rate-${l.id}`] = "Enter a rate."
      }
    }
    if (s === 3 && !issued) e.issue = "Pick the date the invoice is issued."
    return e
  }

  const errors = errorsFor(step)
  const visible: Errors = shown[step] ? errors : {}
  const isDone = (s: number) => (s === 4 ? sent : s < furthest && Object.keys(errorsFor(s)).length === 0)

  function focusField(key: string) {
    requestAnimationFrame(() => document.getElementById(`inv-${key}`)?.focus())
  }

  function next() {
    const keys = Object.keys(errors)
    if (keys.length) {
      setShown((prev) => ({ ...prev, [step]: true }))
      focusField(keys[0])
      return
    }
    setStep(step + 1)
    setFurthest((f) => Math.max(f, step + 1))
  }

  function updateLine(id: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function addLine() {
    const id = nextId.current++
    setLines((ls) => [...ls, { id, description: "", qty: "1", rate: "" }])
    focusField(`desc-${id}`)
  }

  function send() {
    setSending(true)
    timer.current = setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1400)
  }

  function startOver() {
    setSent(false)
    setStep(1)
    setFurthest(1)
    setShown({})
    setClient(null)
    setEmail("")
    setReference("")
    setLines([{ id: nextId.current++, description: "", qty: "1", rate: "" }])
    setIssued(undefined)
  }

  const describedBy = (key: string) => (visible[key] ? `inv-${key}-error` : undefined)

  return (
    <div className="@container mx-auto w-full max-w-2xl">
      <Card className="gap-0 py-0">
        <div className="border-b border-border px-4 pt-5 pb-4 @md:px-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold">New invoice</h2>
            <span className="text-xs text-muted-foreground tabular-nums">{INVOICE}</span>
          </div>
          <Stepper aria-label="Invoice steps" value={step} onValueChange={setStep} linear className="mt-4">
            {STEPS.map((title, i) => (
              <StepperItem key={title} step={i + 1} completed={isDone(i + 1)} invalid={shown[i + 1] && Object.keys(errorsFor(i + 1)).length > 0} loading={sending && i === 3}>
                <StepperTrigger disabled={sending || sent}>
                  <StepperIndicator />
                  <StepperTitle className="@max-2xl:sr-only">{title}</StepperTitle>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
            ))}
          </Stepper>
        </div>

        {sent ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <CircleCheck className="size-10 text-primary" aria-hidden="true" />
            <h3 ref={sentHeading} tabIndex={-1} className="mt-4 text-lg font-semibold outline-none">
              {INVOICE} is on its way
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Sent to {email} for {money(total)}, due {due ? day(due) : "on receipt"}.
              {reminders ? " Orbit will remind them 3 days before it's due." : ""}
            </p>
            <Button variant="outline" className="mt-6" onClick={startOver}>
              Create another invoice
            </Button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (step < 4) next()
              else send()
            }}
          >
            <fieldset className="min-w-0 px-4 py-5 @md:px-6" disabled={sending}>
              <legend className="sr-only">
                Step {step} of 4: {STEPS[step - 1]}
              </legend>
              <p className="text-xs text-muted-foreground" aria-hidden="true">
                Step {step} of 4 · {STEPS[step - 1]}
              </p>
              <h3 className="text-base font-semibold">{["Who is it for?", "What are you billing?", "When is it due?", "Check and send"][step - 1]}</h3>

              {step === 1 ? (
                <div className="mt-4 grid gap-4 @lg:grid-cols-2">
                  <Field id="inv-client" label="Client" error={visible.client}>
                    <Select
                      items={CLIENTS}
                      value={client}
                      onValueChange={(v) => {
                        const c = CLIENTS.find((x) => x.value === v)
                        setClient(c?.value ?? null)
                        if (c) setEmail(c.email)
                      }}
                    >
                      <SelectTrigger id="inv-client" className="w-full" aria-invalid={!!visible.client} aria-describedby={describedBy("client")}>
                        <SelectValue placeholder="Choose a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENTS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field id="inv-email" label="Billing email" error={visible.email}>
                    <Input
                      id="inv-email"
                      type="email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!visible.email}
                      aria-describedby={describedBy("email")}
                    />
                  </Field>
                  <Field id="inv-reference" label="PO or reference" hint="Optional. Shown under the invoice number.">
                    <Input id="inv-reference" value={reference} onChange={(e) => setReference(e.target.value)} aria-describedby="inv-reference-hint" />
                  </Field>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="mt-4">
                  <div className="hidden grid-cols-[minmax(0,1fr)_4.5rem_7rem_6rem_2rem] gap-2 pb-1.5 text-xs font-medium text-muted-foreground @lg:grid" aria-hidden="true">
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span className="text-right">Amount</span>
                  </div>
                  <ul className="grid gap-3 @lg:gap-2">
                    {lines.map((l, i) => (
                      <li
                        key={l.id}
                        className="grid grid-cols-[4rem_minmax(0,1fr)_auto_auto] items-start gap-2 border-b border-border pb-3 last:border-0 last:pb-0 @lg:grid-cols-[minmax(0,1fr)_4.5rem_7rem_6rem_2rem] @lg:border-0 @lg:pb-0"
                      >
                        <div className="col-span-4 @lg:col-span-1">
                          <Input
                            id={`inv-desc-${l.id}`}
                            placeholder="Description"
                            aria-label={`Description, line ${i + 1}`}
                            value={l.description}
                            onChange={(e) => updateLine(l.id, { description: e.target.value })}
                            aria-invalid={!!visible[`desc-${l.id}`]}
                            aria-describedby={describedBy(`desc-${l.id}`)}
                          />
                          <FieldError id={`inv-desc-${l.id}-error`} message={visible[`desc-${l.id}`]} />
                        </div>
                        <div>
                          <Input
                            id={`inv-qty-${l.id}`}
                            inputMode="numeric"
                            aria-label={`Quantity, line ${i + 1}`}
                            value={l.qty}
                            onChange={(e) => updateLine(l.id, { qty: e.target.value.replace(/[^\d.]/g, "") })}
                            aria-invalid={!!visible[`qty-${l.id}`]}
                            aria-describedby={describedBy(`qty-${l.id}`)}
                          />
                          <FieldError id={`inv-qty-${l.id}-error`} message={visible[`qty-${l.id}`]} />
                        </div>
                        <div>
                          <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputGroupInput
                              id={`inv-rate-${l.id}`}
                              inputMode="decimal"
                              placeholder="0.00"
                              aria-label={`Rate, line ${i + 1}`}
                              value={l.rate}
                              onChange={(e) => updateLine(l.id, { rate: e.target.value.replace(/[^\d.]/g, "") })}
                              aria-invalid={!!visible[`rate-${l.id}`]}
                              aria-describedby={describedBy(`rate-${l.id}`)}
                            />
                          </InputGroup>
                          <FieldError id={`inv-rate-${l.id}-error`} message={visible[`rate-${l.id}`]} />
                        </div>
                        <p className="flex h-8 items-center justify-end text-sm font-medium tabular-nums">{amount(l) ? money(amount(l)) : "—"}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove line ${i + 1}`}
                          disabled={lines.length === 1}
                          onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
                        >
                          <Trash2 />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-col gap-4 @lg:flex-row @lg:items-start @lg:justify-between">
                    <Button type="button" variant="outline" size="sm" className="self-start" onClick={addLine}>
                      <Plus data-icon="inline-start" />
                      Add line
                    </Button>
                    <dl className="grid w-full gap-1.5 text-sm @lg:w-64">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd className="tabular-nums">{money(subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt>
                          <Select items={TAXES} value={tax} onValueChange={(v) => v != null && setTax(String(v))}>
                            <SelectTrigger size="sm" aria-label="Tax rate">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TAXES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </dt>
                        <dd className="tabular-nums">{money(taxAmount)}</dd>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-1.5 font-semibold">
                        <dt>Total</dt>
                        <dd className="tabular-nums">{money(total)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="mt-4 grid gap-4 @lg:grid-cols-2">
                  <Field id="inv-issue" label="Issue date" error={visible.issue}>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            id="inv-issue"
                            className={cn("w-full justify-start font-normal", !issued && "text-muted-foreground")}
                            aria-invalid={!!visible.issue}
                            aria-describedby={describedBy("issue")}
                          />
                        }
                      >
                        <CalendarIcon data-icon="inline-start" />
                        {issued ? day(issued) : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={issued}
                          defaultMonth={issued ?? TODAY}
                          onSelect={(d) => {
                            setIssued(d)
                            setCalendarOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field id="inv-terms" label="Payment terms" hint={due ? `Due ${day(due)}` : "Pick an issue date to see the due date."}>
                    <Select items={TERMS} value={terms} onValueChange={(v) => v != null && setTerms(String(v))}>
                      <SelectTrigger id="inv-terms" className="w-full" aria-describedby="inv-terms-hint">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TERMS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field id="inv-repeat" label="Repeat">
                    <Select items={REPEAT} value={repeat} onValueChange={(v) => v != null && setRepeat(String(v))}>
                      <SelectTrigger id="inv-repeat" className="w-full">
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
                  </Field>
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 @lg:self-end">
                    <div className="grid gap-1">
                      <Label htmlFor="inv-reminders">Payment reminders</Label>
                      <p id="inv-reminders-hint" className="text-xs text-muted-foreground">
                        3 days before and on the due date
                      </p>
                    </div>
                    <Switch id="inv-reminders" checked={reminders} onCheckedChange={setReminders} aria-describedby="inv-reminders-hint" />
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="mt-4 grid gap-3 @lg:grid-cols-2">
                  <ReviewSection title="Client" onEdit={() => setStep(1)}>
                    <p className="font-medium">{clientInfo?.label}</p>
                    <p className="truncate text-muted-foreground">{email}</p>
                    {reference ? <p className="text-muted-foreground">Reference {reference}</p> : null}
                  </ReviewSection>
                  <ReviewSection title="Schedule" onEdit={() => setStep(3)}>
                    <p>Issued {issued ? day(issued) : "—"}</p>
                    <p>
                      {labelOf(TERMS, terms)}, due {due ? day(due) : "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {labelOf(REPEAT, repeat)} · Reminders {reminders ? "on" : "off"}
                    </p>
                  </ReviewSection>
                  <ReviewSection title="Line items" onEdit={() => setStep(2)} className="@lg:col-span-2">
                    <table className="w-full text-sm">
                      <caption className="sr-only">Line items</caption>
                      <thead className="sr-only">
                        <tr>
                          <th scope="col">Description</th>
                          <th scope="col">Quantity and rate</th>
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((l) => (
                          <tr key={l.id}>
                            <td className="py-0.5 pr-3">{l.description}</td>
                            <td className="py-0.5 pr-3 text-muted-foreground tabular-nums whitespace-nowrap">
                              {l.qty} × {money(Number(l.rate))}
                            </td>
                            <td className="py-0.5 text-right tabular-nums">{money(amount(l))}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2} className="pt-2 text-muted-foreground">
                            Subtotal
                          </td>
                          <td className="pt-2 text-right tabular-nums">{money(subtotal)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-muted-foreground">
                            {labelOf(TAXES, tax)}
                          </td>
                          <td className="text-right tabular-nums">{money(taxAmount)}</td>
                        </tr>
                        <tr className="font-semibold">
                          <td colSpan={2}>Total</td>
                          <td className="text-right tabular-nums">{money(total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </ReviewSection>
                </div>
              ) : null}
            </fieldset>

            <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/50 px-4 py-3 @md:px-6">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={sending}>
                  <ArrowLeft data-icon="inline-start" />
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <Button type="submit">
                  Continue
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : (
                <Button type="submit" disabled={sending}>
                  {sending ? <Spinner data-icon="inline-start" aria-hidden="true" /> : <Send data-icon="inline-start" />}
                  {sending ? "Sending…" : `Send ${money(total)}`}
                </Button>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <FieldError id={`${id}-error`} message={error} className="mt-0" />
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function FieldError({ id, message, className }: { id: string; message?: string; className?: string }) {
  if (!message) return null
  return (
    <p id={id} className={cn("mt-1 text-xs text-destructive", className)}>
      {message}
    </p>
  )
}

function ReviewSection({ title, onEdit, className, children }: { title: string; onEdit: () => void; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-border p-3 text-sm", className)} aria-label={title}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        <Button type="button" variant="link" size="sm" className="h-5 px-0" onClick={onEdit}>
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </Button>
      </div>
      {children}
    </section>
  )
}
