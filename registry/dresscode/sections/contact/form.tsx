"use client"

// Contact form with the ways to reach the team beside it. A field you have typed in is checked when it
// loses focus (the topic when its menu closes) and every field on send; an error is tied to its field and send moves
// focus to the first field that needs fixing. A sent form says who will reply and when, and takes focus.
// Wire onSubmit to your own endpoint or inbox.
import { CircleCheck, Mail, MessageCircle, Phone, Send } from "lucide-react"
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const TOPICS = [
  { value: "billing", label: "Billing and plans" },
  { value: "setup", label: "Setting up Orbit" },
  { value: "payments", label: "Payments and payouts" },
  { value: "bug", label: "Something is not working" },
  { value: "other", label: "Something else" },
]

const WAYS = [
  { icon: Mail, title: "Email", link: { label: "help@orbit.app", href: "mailto:help@orbit.app" }, note: "Replies within 4 hours on weekdays" },
  { icon: MessageCircle, title: "Live chat", link: { label: "Start a chat", href: "#chat" }, note: "Weekdays, 8:00 to 20:00 CET" },
  { icon: Phone, title: "Phone", link: { label: "+1 (555) 014-2290", href: "tel:+15550142290" }, note: "For Studio plans, weekdays 9:00 to 17:00 ET" },
]

type Values = { name: string; email: string; topic: string | null; message: string }
type FieldName = keyof Values
const FIELDS: FieldName[] = ["name", "email", "topic", "message"]
const EMPTY: Values = { name: "", email: "", topic: null, message: "" }

function validate(v: Values): Partial<Record<FieldName, string>> {
  const e: Partial<Record<FieldName, string>> = {}
  if (!v.name.trim()) e.name = "Enter your name."
  if (!v.email.trim()) e.email = "Enter your email so we can reply."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter an email like name@studio.com."
  if (!v.topic) e.topic = "Choose what your message is about."
  if (!v.message.trim()) e.message = "Write your message."
  else if (v.message.trim().length < 10) e.message = "Add a little more detail, at least 10 characters."
  return e
}

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function ContactForm() {
  const id = useId()
  const fid = (f: FieldName) => `${id}-${f}`
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [sent, setSent] = useState<Values | null>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) doneRef.current?.focus()
  }, [sent])

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
    setTouched({ name: true, email: true, topic: true, message: true })
    const first = FIELDS.find((f) => errors[f])
    if (first) {
      document.getElementById(fid(first))?.focus()
      return
    }
    // Send `values` to your endpoint or inbox here.
    setSent(values)
  }

  const reset = () => {
    setValues(EMPTY)
    setTouched({})
    setSent(null)
    requestAnimationFrame(() => document.getElementById(fid("name"))?.focus())
  }

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="max-w-[520px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Talk to a person</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            We read every message.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Questions about billing, a bug or how to set Orbit up for your studio. Someone on the team replies, not a bot.
          </p>
          <ul className="mt-10 grid gap-6">
            {WAYS.map(({ icon: Icon, title, link, note }) => (
              <li key={title} className="flex gap-4">
                <span className="dc-icon size-10 shrink-0">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">{title}</p>
                  <a
                    href={link.href}
                    className="mt-0.5 inline-block rounded-sm text-[15px] font-medium text-[color:var(--dc-accent)] underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {link.label}
                  </a>
                  <p className="mt-0.5 text-[14px] text-muted-foreground">{note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dc-card p-6 sm:p-8">
          {sent ? (
            <div role="status" className="flex min-h-[420px] flex-col items-center justify-center text-center lg:min-h-[528px]">
              <span className="dc-icon size-12">
                <CircleCheck className="size-6" aria-hidden="true" />
              </span>
              <h3 ref={doneRef} tabIndex={-1} className="dc-h mt-5 text-[24px] outline-none">
                Message sent
              </h3>
              <p className="mt-2 max-w-[380px] text-[15px] leading-relaxed text-pretty text-muted-foreground">
                Thanks, {sent.name.trim().split(/\s+/)[0]}. We will reply to <span className="font-medium wrap-anywhere text-foreground">{sent.email.trim()}</span> within a few hours on weekdays.
              </p>
              <Button variant="outline" size="lg" className="mt-6 h-10 px-4 font-semibold" onClick={reset}>
                Send another message
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} aria-labelledby={`${id}-form-title`}>
              <h3 id={`${id}-form-title`} className="dc-h text-[20px]">
                Send us a message
              </h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id={fid("name")} label="Name" error={shown("name")}>
                  <Input
                    id={fid("name")}
                    autoComplete="name"
                    placeholder="Ada Ruiz"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => values.name.trim() && touch("name")}
                    className="h-10 px-3"
                    {...aria("name")}
                  />
                </Field>
                <Field id={fid("email")} label="Email" error={shown("email")}>
                  <Input
                    id={fid("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => values.email.trim() && touch("email")}
                    className="h-10 px-3"
                    {...aria("email")}
                  />
                </Field>
                <Field id={fid("topic")} label="Topic" error={shown("topic")} className="sm:col-span-2">
                  <Select
                    items={TOPICS}
                    value={values.topic}
                    onValueChange={(v) => set("topic", (v as string | null) ?? null)}
                    onOpenChange={(open) => {
                      if (!open) touch("topic")
                    }}
                  >
                    <SelectTrigger
                      id={fid("topic")}
                      className="w-full px-3 text-base data-[size=default]:h-10 md:text-sm"
                      {...aria("topic")}
                    >
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id={fid("message")} label="Message" error={shown("message")} className="sm:col-span-2">
                  <Textarea
                    id={fid("message")}
                    placeholder="Tell us what is going on, and include an invoice number if it is about one."
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => values.message.trim() && touch("message")}
                    className="min-h-36 px-3 py-2.5"
                    {...aria("message")}
                  />
                </Field>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-muted-foreground">We only use your details to reply.</p>
                <Button type="submit" size="lg" className="h-11 px-5 text-[15px] font-semibold">
                  Send message <Send className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
