"use client"

// Book a demo: one card in two panes. The pitch, three benefits and a customer's words sit on the theme's
// band color; the form beside it asks for a work email, the company, the team size (radio cards) and a
// preferred time. A field you have typed in is checked when it loses focus (the time when its menu
// closes) and every field on send, which moves focus to the first one that needs fixing. A sent form
// says what happens next and takes focus. Wire onSubmit to your CRM or scheduling tool.
import { ArrowRight, CalendarCheck, FileUp, Gift, Video } from "lucide-react"
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const BENEFITS = [
  { icon: Video, title: "Thirty minutes, on your schedule", body: "We walk through your own setup, not a script." },
  { icon: FileUp, title: "Your clients, imported on the call", body: "Bring a spreadsheet and leave with Orbit ready to send." },
  { icon: Gift, title: "The Studio plan free for 30 days", body: "Try team seats and reminders with real invoices." },
]

const SIZES = [
  { value: "1", label: "Just me" },
  { value: "2-10", label: "2 to 10" },
  { value: "11-50", label: "11 to 50" },
  { value: "51+", label: "51 or more" },
]

const TIMES = [
  { value: "morning", label: "Weekday mornings, 9 to 12", phrase: "on a weekday morning" },
  { value: "afternoon", label: "Weekday afternoons, 12 to 17", phrase: "on a weekday afternoon" },
  { value: "evening", label: "Early evenings, 17 to 19", phrase: "in the early evening" },
  { value: "any", label: "Any time that suits you", phrase: "that suit you" },
]

type Values = { email: string; company: string; size: string | null; time: string | null }
type FieldName = keyof Values
const FIELDS: FieldName[] = ["email", "company", "size", "time"]
const EMPTY: Values = { email: "", company: "", size: null, time: null }

function validate(v: Values): Partial<Record<FieldName, string>> {
  const e: Partial<Record<FieldName, string>> = {}
  if (!v.email.trim()) e.email = "Enter your work email."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter an email like name@studio.com."
  if (!v.company.trim()) e.company = "Enter your company or studio name."
  if (!v.size) e.size = "Choose the size of your team."
  if (!v.time) e.time = "Choose when a call suits you."
  return e
}

function ErrorText({ id, children }: { id: string; children?: ReactNode }) {
  return children ? (
    <p id={id} className="text-[13px] text-destructive">
      {children}
    </p>
  ) : null
}

export default function ContactSales() {
  const id = useId()
  const fid = (f: FieldName) => `${id}-${f}`
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [sent, setSent] = useState(false)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const returning = useRef(false)

  useEffect(() => {
    if (sent) doneRef.current?.focus()
    else if (returning.current) document.getElementById(`${id}-email`)?.focus()
  }, [sent, id])

  const errors = validate(values)
  const shown = (f: FieldName) => (touched[f] ? errors[f] : undefined)
  const touch = (f: FieldName) => setTouched((t) => ({ ...t, [f]: true }))
  const set = <K extends FieldName>(f: K, v: Values[K]) => setValues((s) => ({ ...s, [f]: v }))
  const aria = (f: FieldName) => ({
    "aria-invalid": shown(f) ? true : undefined,
    "aria-describedby": shown(f) ? `${fid(f)}-error` : undefined,
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, company: true, size: true, time: true })
    const first = FIELDS.find((f) => errors[f])
    if (first) {
      const el = document.getElementById(fid(first))
      ;(first === "size" ? el?.querySelector<HTMLElement>("[role=radio]") : el)?.focus()
      return
    }
    // Send `values` to your CRM or scheduling tool here.
    setSent(true)
  }

  const timePhrase = TIMES.find((t) => t.value === values.time)?.phrase ?? ""

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="dc-card grid overflow-hidden lg:grid-cols-[1fr_1.1fr]">
          <div className="dc-band flex flex-col p-6 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold opacity-80">Book a demo</p>
            <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[40px]">
              See Orbit with your own invoices.
            </h2>
            <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-muted-foreground">
              A short call with someone who has set up hundreds of studios. Ask anything, see everything.
            </p>
            <ul className="mt-8 grid gap-5">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-band-fg)_13%,transparent)]">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[16px] font-semibold">{title}</p>
                    <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <figure className="border-t border-border pt-6">
                <blockquote className="text-[16px] leading-relaxed">
                  &ldquo;The call took 25 minutes and we sent our first batch of invoices that afternoon.&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-[14px]">
                  <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-band-fg)_13%,transparent)] text-[12px] font-bold">
                    MO
                  </span>
                  <span>
                    <span className="block font-semibold">Maya Okafor</span>
                    <span className="block text-muted-foreground">Studio lead, Fernwood Studio</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            {sent ? (
              <div role="status" className="flex h-full min-h-[440px] flex-col items-center justify-center text-center">
                <span className="dc-icon size-12">
                  <CalendarCheck className="size-6" aria-hidden="true" />
                </span>
                <h3 ref={doneRef} tabIndex={-1} className="dc-h mt-5 text-[24px] outline-none">
                  Thanks, we will be in touch
                </h3>
                <p className="mt-2 max-w-[400px] text-[15px] leading-relaxed text-pretty text-muted-foreground">
                  Within one business day we will email <span className="font-medium wrap-anywhere text-foreground">{values.email.trim()}</span> two
                  times {timePhrase}. Bring an invoice or two and we will set up {values.company.trim()} on the call.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-6 h-10 px-4 font-semibold"
                  onClick={() => {
                    returning.current = true
                    setSent(false)
                  }}
                >
                  Change the details
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} aria-labelledby={`${id}-form-title`}>
                <h3 id={`${id}-form-title`} className="dc-h text-[22px]">
                  Tell us about your team
                </h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">We will email you two times that fit. It takes a minute.</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="grid content-start gap-2">
                    <Label htmlFor={fid("email")}>Work email</Label>
                    <Input
                      id={fid("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="you@studio.com"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      onBlur={() => values.email.trim() && touch("email")}
                      className="h-11 px-3"
                      {...aria("email")}
                    />
                    <ErrorText id={`${fid("email")}-error`}>{shown("email")}</ErrorText>
                  </div>
                  <div className="grid content-start gap-2">
                    <Label htmlFor={fid("company")}>Company</Label>
                    <Input
                      id={fid("company")}
                      autoComplete="organization"
                      placeholder="Fernwood Studio"
                      value={values.company}
                      onChange={(e) => set("company", e.target.value)}
                      onBlur={() => values.company.trim() && touch("company")}
                      className="h-11 px-3"
                      {...aria("company")}
                    />
                    <ErrorText id={`${fid("company")}-error`}>{shown("company")}</ErrorText>
                  </div>
                </div>

                <fieldset className="mt-7 min-w-0">
                  <legend id={`${fid("size")}-legend`} className="text-sm font-medium">
                    Team size
                  </legend>
                  <RadioGroup
                    id={fid("size")}
                    value={values.size}
                    onValueChange={(v) => {
                      set("size", String(v))
                      touch("size")
                    }}
                    aria-labelledby={`${fid("size")}-legend`}
                    {...aria("size")}
                    className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {SIZES.map((s) => (
                      <label
                        key={s.value}
                        className={cn(
                          "flex h-12 cursor-pointer items-center gap-2.5 rounded-[var(--radius)] border border-input px-3 text-[14px] font-medium transition-colors hover:bg-muted/60",
                          "has-data-checked:border-primary has-data-checked:bg-[color:color-mix(in_oklab,var(--primary)_8%,transparent)]",
                          shown("size") && "border-destructive",
                        )}
                      >
                        <RadioGroupItem value={s.value} />
                        <span className="whitespace-nowrap">{s.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {shown("size") ? (
                    <div className="mt-2">
                      <ErrorText id={`${fid("size")}-error`}>{shown("size")}</ErrorText>
                    </div>
                  ) : null}
                </fieldset>

                <div className="mt-7 grid gap-2">
                  <Label htmlFor={fid("time")}>Preferred time</Label>
                  <Select
                    items={TIMES}
                    value={values.time}
                    onValueChange={(v) => set("time", (v as string | null) ?? null)}
                    onOpenChange={(open) => {
                      if (!open) touch("time")
                    }}
                  >
                    <SelectTrigger
                      id={fid("time")}
                      className="w-full px-3 text-base data-[size=default]:h-11 md:text-sm"
                      {...aria("time")}
                      aria-describedby={shown("time") ? `${fid("time")}-error` : `${fid("time")}-hint`}
                    >
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {shown("time") ? (
                    <ErrorText id={`${fid("time")}-error`}>{shown("time")}</ErrorText>
                  ) : (
                    <p id={`${fid("time")}-hint`} className="text-[13px] text-muted-foreground">
                      In your own time zone. We will confirm the exact slot by email.
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="mt-9 h-12 w-full text-[16px] font-semibold">
                  Book my demo <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <p className="mt-3 text-center text-[13px] text-muted-foreground">No sales emails after the call unless you ask for them.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
