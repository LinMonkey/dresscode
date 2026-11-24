"use client"

// Sign-up, split: on the left, on a soft surface, what the free plan includes and a customer's words;
// on the right the form (Google, or name, email and password). On phones the form comes first and the
// plan follows it. Fields are checked when they lose focus and on submit, and a finished sign-up says
// what to do next. Wire onSubmit and the Google button to your own sign-up.
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, Sparkles } from "lucide-react"
import { type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

const INCLUDED = [
  "Unlimited invoices for up to three clients",
  "Reminders before and after the due date",
  "Card and bank transfer payments",
  "Your logo and colors on every invoice",
  "A year-end export for your accountant",
]

type Field = "name" | "email" | "password"
const check = (f: Field, v: string) => {
  if (f === "name") return v.trim() ? "" : "Tell us what to call you."
  if (f === "email") return !v.trim() ? "Enter your work email." : EMAIL.test(v.trim()) ? "" : "That doesn't look like an email address."
  return v.length >= 8 && /\d/.test(v) ? "" : "Use at least 8 characters, with a number."
}

function Logo({ className }: { className?: string }) {
  return (
    <a href="#home" className={cn("w-fit", focus, className)} aria-label="Orbit home">
      <span className="inline-flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
        </svg>
        <span className="dc-h">Orbit</span>
      </span>
    </a>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function FieldRow({ id, label, error, hint, children }: { id: string; label: string; error: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[13px]">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function PlanPanel() {
  return (
    <aside aria-labelledby="signup-split-plan" className="order-2 flex flex-col gap-10 border-t border-border bg-muted px-5 py-12 sm:px-10 lg:order-1 lg:border-t-0 lg:border-r lg:py-8 xl:px-14">
      <Logo className="hidden lg:block" />
      <div className="max-w-[460px] lg:my-auto">
        <p className="text-sm font-semibold text-[color:var(--dc-accent)]">The free plan</p>
        <h2 id="signup-split-plan" className="dc-h mt-3 text-[30px] leading-[1.1] sm:text-[36px]">
          Everything you need for your first three clients
        </h2>
        <p className="mt-5 flex items-baseline gap-2">
          <span className="dc-num dc-h text-[44px] leading-none">$0</span>
          <span className="text-[15px] text-muted-foreground">a month, for as long as you like</span>
        </p>
        <ul className="mt-7 grid gap-3 text-[15px]">
          {INCLUDED.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,transparent)] text-[color:var(--dc-accent)]">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">Take on a fourth client and Pro is $12 a month. You only pay from that month on.</p>
      </div>
      <figure className="dc-card max-w-[460px] p-5">
        <blockquote className="text-[15px] leading-relaxed">&ldquo;I signed up on a Sunday and had every client billed by Monday lunch.&rdquo;</blockquote>
        <figcaption className="mt-4 flex items-center gap-3 text-[13px]">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-muted text-[11px] font-bold">
            KK
          </span>
          <span>
            <span className="block font-semibold">Kenji Kato</span>
            <span className="block text-muted-foreground">Partner, Kato &amp; Lee</span>
          </span>
        </figcaption>
      </figure>
    </aside>
  )
}

export default function SignupSplit() {
  const id = useId()
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState<Record<Field, string>>({ name: "", email: "", password: "" })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState<"" | "form" | "google">("")
  const [done, setDone] = useState<"" | "form" | "google">("")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const doneTitle = useRef<HTMLHeadingElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (done) doneTitle.current?.focus()
  }, [done])

  const set = (f: Field, v: string) => {
    setValues((s) => ({ ...s, [f]: v }))
    if (errors[f]) setErrors((s) => ({ ...s, [f]: check(f, v) }))
  }
  const blur = (f: Field, e: FocusEvent<HTMLInputElement>) => {
    if (toButton(e)) return
    if (values[f]) setErrors((s) => ({ ...s, [f]: check(f, values[f]) }))
  }
  const finish = (how: "form" | "google") => {
    setBusy(how)
    // Replace the timeout with your sign-up call (or the redirect to Google).
    timer.current = setTimeout(() => {
      setBusy("")
      setDone(how)
    }, 1300)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const fields: Field[] = ["name", "email", "password"]
    const next = Object.fromEntries(fields.map((f) => [f, check(f, values[f])])) as Record<Field, string>
    setErrors(next)
    const first = fields.find((f) => next[f])
    if (first) document.getElementById(`${id}-${first}`)?.focus()
    else finish("form")
  }
  const field = (f: Field) => ({
    id: `${id}-${f}`,
    value: values[f],
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(f, e.target.value),
    onBlur: (e: FocusEvent<HTMLInputElement>) => blur(f, e),
    "aria-invalid": errors[f] ? true : undefined,
    className: "h-10",
  })

  return (
    <section aria-labelledby={`${id}-title`} className="grid min-h-[820px] bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <PlanPanel />
      <div className="order-1 flex min-w-0 flex-col px-5 py-6 sm:px-10 lg:order-2">
        <Logo className="lg:hidden" />
        <div className="mx-auto my-auto w-full max-w-[400px] py-12 lg:py-16">
          {done ? (
            <div role="status">
              <span className="dc-icon size-12">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-6 text-[32px] leading-[1.1] outline-none">
                Your workspace is ready
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {done === "google" ? "You signed up with Google." : `Welcome, ${values.name.trim().split(/\s+/)[0]}.`} Add your first client and send an invoice; it takes about a minute.
              </p>
              <Button className="mt-7 h-10 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#new-invoice" />}>
                Send your first invoice <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <>
              <h1 id={`${id}-title`} className="dc-h text-[32px] leading-[1.1]">
                Start free
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">Set up in two minutes. No card, no trial clock.</p>
              <Button type="button" variant="outline" className="mt-7 h-10 w-full text-[14px] font-medium" disabled={!!busy} onClick={() => finish("google")}>
                {busy === "google" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <GoogleMark />}
                Sign up with Google
              </Button>
              <div className="my-6 flex items-center gap-3 text-[13px] text-muted-foreground">
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                or with your email
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <form noValidate onSubmit={onSubmit} className="grid gap-4">
                <FieldRow id={`${id}-name`} label="Your name" error={errors.name}>
                  <Input {...field("name")} autoComplete="name" placeholder="Ada Ruiz" aria-describedby={errors.name ? `${id}-name-error` : undefined} />
                </FieldRow>
                <FieldRow id={`${id}-email`} label="Work email" error={errors.email}>
                  <Input {...field("email")} type="email" autoComplete="email" placeholder="you@studio.com" aria-describedby={errors.email ? `${id}-email-error` : undefined} />
                </FieldRow>
                <FieldRow id={`${id}-password`} label="Password" error={errors.password} hint="At least 8 characters, with a number.">
                  <div className="relative">
                    <Input
                      {...field("password")}
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      aria-describedby={errors.password ? `${id}-password-error` : `${id}-password-hint`}
                      className="h-10 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label="Show password"
                      aria-pressed={show}
                      className="absolute inset-y-0 right-1 my-auto grid size-8 place-items-center rounded-[calc(var(--radius)-2px)] text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                    </button>
                  </div>
                </FieldRow>
                <Button type="submit" className="mt-2 h-10 w-full text-[15px] font-semibold" disabled={!!busy}>
                  {busy === "form" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                  {busy === "form" ? "Setting up your workspace…" : "Create free account"}
                </Button>
                <p className="sr-only" aria-live="polite">
                  {busy ? "Setting up your workspace…" : ""}
                </p>
                <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">
                  By creating an account you agree to the{" "}
                  <a href="#terms" className={`underline underline-offset-2 hover:text-foreground ${focus}`}>
                    Terms
                  </a>{" "}
                  and the{" "}
                  <a href="#privacy" className={`underline underline-offset-2 hover:text-foreground ${focus}`}>
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
              <p className="mt-8 text-[14px] text-muted-foreground">
                Already have an account?{" "}
                <a href="#sign-in" className={`font-semibold text-foreground hover:underline ${focus}`}>
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
