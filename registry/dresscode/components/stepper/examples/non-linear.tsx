"use client"

// Steps you can do in any order: each section is checked when you save it or move on from it, and is
// marked done or with the number of things to fix. Publish turns on once every section is done.
import * as React from "react"
import { CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/dresscode/components/stepper/ui/stepper"

const SECTIONS = [
  { title: "Business profile", heading: "Business profile", intro: "Shown at the top of every invoice and receipt." },
  { title: "Branding", heading: "Branding", intro: "How the portal greets your clients." },
  { title: "Payment methods", heading: "Payment methods", intro: "The ways clients can pay from the portal." },
  { title: "Reminders", heading: "Reminders", intro: "Polite nudges for invoices that are due or late." },
]

const ACCENTS: Record<string, string> = {
  "1": "bg-(--chart-1)",
  "2": "bg-(--chart-2)",
  "3": "bg-(--chart-3)",
  "4": "bg-(--chart-4)",
  "5": "bg-(--chart-5)",
}
const FIRST_REMINDER = [
  { value: "due", label: "On the due date" },
  { value: "3", label: "3 days after" },
  { value: "7", label: "7 days after" },
]
const REPEAT = [
  { value: "3", label: "Every 3 days" },
  { value: "7", label: "Every week" },
  { value: "never", label: "Don't repeat" },
]
const PAYMENT_METHODS = [
  { id: "card", label: "Card payments", note: "Clients pay by card, with a 2.9% fee per payment." },
  { id: "transfer", label: "Bank transfer", note: "Your bank details show on every invoice." },
  { id: "debit", label: "Direct debit", note: "Collect recurring invoices automatically." },
] as const

type Errors = Record<string, string>

export default function StepperNonLinear() {
  const [section, setSection] = React.useState(3)
  // A section is "checked" once it was saved or left after an edit; from then on it shows done or errors.
  const [checked, setChecked] = React.useState([true, false, true, false])
  const [touched, setTouched] = React.useState([false, false, false, false])
  const [profile, setProfile] = React.useState({ name: "Fernwood Studio LLC", tax: "84-2193706", address: "88 Mill Road, Suite 3\nPortland, OR 97209" })
  const [accent, setAccent] = React.useState("1")
  const [welcome, setWelcome] = React.useState("")
  const [methods, setMethods] = React.useState<Record<string, boolean>>({ card: false, transfer: false, debit: false })
  const [replyTo, setReplyTo] = React.useState("")
  const [first, setFirst] = React.useState("3")
  const [repeat, setRepeat] = React.useState("7")
  const [publishing, setPublishing] = React.useState(false)
  const [published, setPublished] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const liveHeading = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  React.useEffect(() => {
    if (published) liveHeading.current?.focus()
  }, [published])

  function errorsFor(s: number): Errors {
    const e: Errors = {}
    if (s === 1) {
      if (!profile.name.trim()) e.name = "Enter the legal name of the business."
      if (!/^\d{2}-\d{7}$/.test(profile.tax.trim())) e.tax = "Use the format 12-3456789."
      if (!profile.address.trim()) e.address = "Enter the address clients should see."
    }
    if (s === 2 && !welcome.trim()) e.welcome = "Write a line to greet clients."
    if (s === 3 && !Object.values(methods).some(Boolean)) e.methods = "Turn on at least one way to pay."
    if (s === 4) {
      if (!replyTo.trim()) e.replyTo = "Enter the address replies should go to."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo.trim())) e.replyTo = "Enter an email like name@company.com."
    }
    return e
  }

  const problems = SECTIONS.map((_, i) => Object.keys(errorsFor(i + 1)).length)
  const isDone = (s: number) => checked[s - 1] && problems[s - 1] === 0
  const isInvalid = (s: number) => checked[s - 1] && problems[s - 1] > 0
  const doneCount = SECTIONS.filter((_, i) => isDone(i + 1)).length
  const allDone = doneCount === SECTIONS.length
  const errors = checked[section - 1] ? errorsFor(section) : {}

  const touch = () => setTouched((t) => t.map((x, i) => x || i === section - 1))
  const check = (s: number) => setChecked((c) => c.map((x, i) => x || i === s - 1))

  function status(s: number) {
    if (isDone(s)) return "Done"
    if (isInvalid(s)) return problems[s - 1] === 1 ? "1 thing to fix" : `${problems[s - 1]} things to fix`
    return touched[s - 1] ? "In progress" : "Not started"
  }

  function open(to: number) {
    if (touched[section - 1]) check(section)
    setSection(to)
  }

  function save() {
    check(section)
    const keys = Object.keys(errorsFor(section))
    if (keys.length) {
      requestAnimationFrame(() => document.getElementById(`portal-${keys[0]}`)?.focus())
      return
    }
    // Move on to the next section that still needs work, if there is one.
    const order = [...SECTIONS.keys()].map((i) => ((section + i) % SECTIONS.length) + 1)
    const nextUp = order.find((s) => s !== section && !isDone(s))
    if (nextUp) setSection(nextUp)
  }

  function publish() {
    setPublishing(true)
    timer.current = setTimeout(() => {
      setPublishing(false)
      setPublished(true)
    }, 1400)
  }

  const describedBy = (key: string) => (errors[key] ? `portal-${key}-error` : undefined)
  const current = SECTIONS[section - 1]

  if (published) {
    return (
      <Card className="w-full max-w-4xl items-center px-6 py-12 text-center">
        <CircleCheck className="size-10 text-primary" aria-hidden="true" />
        <h2 ref={liveHeading} tabIndex={-1} className="text-lg font-semibold outline-none">
          Your client portal is live
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">Clients see it from the pay button on every invoice you send from now on.</p>
        <Button variant="outline" className="mt-2" onClick={() => setPublished(false)}>
          Back to setup
        </Button>
      </Card>
    )
  }

  return (
    <div className="@container w-full max-w-4xl">
      <Card className="gap-0 py-0">
        <div className="grid @3xl:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label="Portal setup" className="border-b border-border p-4 @3xl:border-e @3xl:border-b-0 @3xl:p-5">
            <p className="mb-4 text-sm font-semibold">Client portal setup</p>
            <Stepper aria-label="Sections" orientation="vertical" value={section} onValueChange={open}>
              {SECTIONS.map((s, i) => (
                <StepperItem key={s.title} step={i + 1} completed={isDone(i + 1)} invalid={isInvalid(i + 1)} className="pb-4">
                  <StepperSeparator className="top-9 bottom-1" />
                  <StepperTrigger disabled={publishing}>
                    <StepperIndicator />
                    <StepperTitle>{s.title}</StepperTitle>
                    <StepperDescription className={cn("text-xs", isInvalid(i + 1) && "text-destructive")}>{status(i + 1)}</StepperDescription>
                  </StepperTrigger>
                </StepperItem>
              ))}
            </Stepper>
          </nav>

          <form
            noValidate
            className="flex min-w-0 flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
            onChange={touch}
          >
            <fieldset className="min-w-0 flex-1 p-4 @3xl:p-6" disabled={publishing} aria-labelledby="portal-section">
              <h2 id="portal-section" className="text-base font-semibold">
                {current.heading}
              </h2>
              <p className="text-sm text-muted-foreground">{current.intro}</p>

              <div className="mt-5 grid gap-4">
                {section === 1 ? (
                  <>
                    <div className="grid gap-4 @xl:grid-cols-2">
                      <Field id="portal-name" label="Legal name" error={errors.name}>
                        <Input
                          id="portal-name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          aria-invalid={!!errors.name}
                          aria-describedby={describedBy("name")}
                        />
                      </Field>
                      <Field id="portal-tax" label="Tax ID (EIN)" error={errors.tax}>
                        <Input
                          id="portal-tax"
                          inputMode="numeric"
                          value={profile.tax}
                          onChange={(e) => setProfile({ ...profile, tax: e.target.value })}
                          aria-invalid={!!errors.tax}
                          aria-describedby={describedBy("tax")}
                        />
                      </Field>
                    </div>
                    <Field id="portal-address" label="Address" error={errors.address}>
                      <Textarea
                        id="portal-address"
                        rows={2}
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        aria-invalid={!!errors.address}
                        aria-describedby={describedBy("address")}
                      />
                    </Field>
                  </>
                ) : null}

                {section === 2 ? (
                  <>
                    <fieldset>
                      <legend className="mb-2 text-sm font-medium">Accent color</legend>
                      <div className="flex gap-2.5">
                        {Object.keys(ACCENTS).map((a) => (
                          <label key={a} className="cursor-pointer">
                            <input
                              type="radio"
                              name="portal-accent"
                              value={a}
                              checked={accent === a}
                              onChange={() => setAccent(a)}
                              className="peer sr-only"
                            />
                            <span className="sr-only">Accent {a}</span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "block size-7 rounded-full ring-offset-2 ring-offset-card transition-shadow peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                                ACCENTS[a],
                              )}
                            />
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <Field id="portal-welcome" label="Welcome line" error={errors.welcome} hint="The first thing clients read on the portal.">
                      <Input
                        id="portal-welcome"
                        placeholder="Thanks for working with us. Pay any open invoice below."
                        value={welcome}
                        onChange={(e) => setWelcome(e.target.value)}
                        maxLength={90}
                        aria-invalid={!!errors.welcome}
                        aria-describedby={describedBy("welcome") ?? "portal-welcome-hint"}
                      />
                    </Field>
                    <div className="overflow-hidden rounded-lg border border-border" aria-hidden="true">
                      <div className={cn("h-1.5", ACCENTS[accent])} />
                      <div className="flex items-center justify-between gap-3 bg-muted/40 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{profile.name || "Your business"}</p>
                          <p className="truncate text-xs text-muted-foreground">{welcome || "Your welcome line shows here."}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">Pay $1,860.00</span>
                      </div>
                    </div>
                  </>
                ) : null}

                {section === 3 ? (
                  <div role="group" aria-labelledby="portal-methods-label" aria-describedby={describedBy("methods")}>
                    <p id="portal-methods-label" className="sr-only">
                      Payment methods
                    </p>
                    <div className={cn("divide-y divide-border rounded-lg border border-border", errors.methods && "border-destructive")}>
                      {PAYMENT_METHODS.map((m, i) => (
                        <div key={m.id} className="flex items-start justify-between gap-4 p-3">
                          <div className="grid gap-0.5">
                            <Label htmlFor={i === 0 ? "portal-methods" : `portal-method-${m.id}`}>{m.label}</Label>
                            <p className="text-xs text-muted-foreground">{m.note}</p>
                          </div>
                          <Switch
                            id={i === 0 ? "portal-methods" : `portal-method-${m.id}`}
                            checked={methods[m.id]}
                            onCheckedChange={(on) => {
                              touch()
                              setMethods((prev) => ({ ...prev, [m.id]: on }))
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {errors.methods ? (
                      <p id="portal-methods-error" className="mt-2 text-xs text-destructive">
                        {errors.methods}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {section === 4 ? (
                  <>
                    <Field id="portal-replyTo" label="Reply-to email" error={errors.replyTo} hint="Client replies to reminders land here.">
                      <Input
                        id="portal-replyTo"
                        type="email"
                        placeholder="billing@yourcompany.com"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        aria-invalid={!!errors.replyTo}
                        aria-describedby={describedBy("replyTo") ?? "portal-replyTo-hint"}
                      />
                    </Field>
                    <div className="grid gap-4 @xl:grid-cols-2">
                      <Field id="portal-first" label="First reminder">
                        <Select
                          items={FIRST_REMINDER}
                          value={first}
                          onValueChange={(v) => {
                            touch()
                            if (v != null) setFirst(String(v))
                          }}
                        >
                          <SelectTrigger id="portal-first" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIRST_REMINDER.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="portal-repeat" label="Then">
                        <Select
                          items={REPEAT}
                          value={repeat}
                          onValueChange={(v) => {
                            touch()
                            if (v != null) setRepeat(String(v))
                          }}
                        >
                          <SelectTrigger id="portal-repeat" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {REPEAT.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </>
                ) : null}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 border-t border-border bg-muted/50 px-4 py-3 @xl:flex-row @xl:items-center @xl:justify-between @3xl:px-6">
              <p id="portal-progress" className="text-sm text-muted-foreground" aria-live="polite">
                {allDone ? "Every section is done. Ready to publish." : `${doneCount} of ${SECTIONS.length} sections done`}
              </p>
              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="flex-1 @xl:flex-none" disabled={publishing}>
                  Save section
                </Button>
                <Button type="button" className="flex-1 @xl:flex-none" disabled={!allDone || publishing} aria-describedby="portal-progress" onClick={publish}>
                  {publishing ? <Spinner data-icon="inline-start" aria-hidden="true" /> : null}
                  {publishing ? "Publishing…" : "Publish portal"}
                </Button>
              </div>
            </div>
          </form>
        </div>
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
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
