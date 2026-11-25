"use client"

// The project form: who, what, budget, when and a message, checked in the browser, then a thank-you
// that repeats what was sent. Send it where you like (a route handler, Formspree, Resend) where marked.
import { Check } from "lucide-react"
import { useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { PERSON, SERVICES } from "./data"

const BUDGETS = ["Under €10k", "€10k – 25k", "€25k – 50k", "€50k or more"]
const WHEN = ["As soon as possible", "Next quarter", "Just exploring"]

type Errors = Partial<Record<"name" | "email" | "message", string>>

function Chip({ type, name, value, children }: { type: "checkbox" | "radio"; name: string; value: string; children: ReactNode }) {
  return (
    <label className="inline-flex h-9 cursor-pointer items-center rounded-full border border-border px-3.5 text-[14px] transition-colors select-none hover:bg-muted has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background">
      <input type={type} name={name} value={value} className="sr-only" />
      {children}
    </label>
  )
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-[14px]">
        {label}
        {hint ? <span className="font-normal text-muted-foreground">{hint}</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ContactForm({ className }: { className?: string }) {
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()
    const next: Errors = {}
    if (!name) next.name = "Your name, so I know who to answer."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "An email address I can reply to."
    if (message.length < 20) next.message = "A sentence or two about the project (20 characters or more)."
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.name ? "pf-name" : next.email ? "pf-email" : "pf-message")?.focus()
      return
    }
    // Send `data` to your form service or a route handler here.
    setSent({ name, email })
  }

  if (sent)
    return (
      <div role="status" className={cn("dc-card p-8 sm:p-10", className)}>
        <span className="grid size-11 place-items-center rounded-full bg-[color:var(--dc-accent)] text-[color:var(--dc-page)]">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <p className="dc-h mt-6 text-[30px] leading-tight">Thanks, {sent.name.split(" ")[0]}.</p>
        <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-muted-foreground">
          Your note is in. I&apos;ll reply to {sent.email} soon; {PERSON.replies.charAt(0).toLowerCase() + PERSON.replies.slice(1)}
        </p>
        <Button variant="outline" size="lg" className="mt-8 h-10 px-4" onClick={() => setSent(null)}>
          Send another
        </Button>
      </div>
    )

  return (
    <form noValidate onSubmit={submit} className={cn("grid gap-7", className)}>
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
        <Field id="pf-name" label="Name" error={errors.name}>
          <Input id="pf-name" name="name" autoComplete="name" className="h-11" aria-invalid={!!errors.name} aria-describedby={errors.name ? "pf-name-error" : undefined} />
        </Field>
        <Field id="pf-email" label="Email" error={errors.email}>
          <Input id="pf-email" name="email" type="email" autoComplete="email" className="h-11" aria-invalid={!!errors.email} aria-describedby={errors.email ? "pf-email-error" : undefined} />
        </Field>
      </div>
      <Field id="pf-company" label="Company" hint=" (optional)">
        <Input id="pf-company" name="company" autoComplete="organization" className="h-11" />
      </Field>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-[14px] font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <Chip key={s.title} type="checkbox" name="needs" value={s.title}>
              {s.title}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-[14px] font-medium">Budget</legend>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <Chip key={b} type="radio" name="budget" value={b}>
              {b}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-[14px] font-medium">When</legend>
        <div className="flex flex-wrap gap-2">
          {WHEN.map((w) => (
            <Chip key={w} type="radio" name="when" value={w}>
              {w}
            </Chip>
          ))}
        </div>
      </fieldset>
      <Field id="pf-message" label="About the project" error={errors.message}>
        <Textarea
          id="pf-message"
          name="message"
          rows={6}
          placeholder="What are you making, who is it for, and what would a good outcome look like?"
          className="min-h-36"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "pf-message-error" : undefined}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" className="h-11 px-5">
          Send
        </Button>
        <p className="text-[14px] text-muted-foreground">{PERSON.replies}</p>
      </div>
    </form>
  )
}
