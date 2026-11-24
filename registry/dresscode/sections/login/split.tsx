"use client"

// Login, split: the form on the left, open on the page; on the right the theme's band (dc-band switches
// the text to the band's own pair) with what Orbit does, two figures and a customer's words. On phones
// the band steps aside and the form is the page. Fields are checked when they lose focus and on
// submit. Wire onSubmit and the Google button to your own auth.
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react"
import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

type Field = "email" | "password"
const check = (f: Field, v: string) =>
  f === "email"
    ? !v.trim()
      ? "Enter the email you signed up with."
      : EMAIL.test(v.trim())
        ? ""
        : "That doesn't look like an email address."
    : v
      ? ""
      : "Enter your password."

function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
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

function FieldRow({ id, label, error, aside, children }: { id: string; label: string; error: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-3">
        <Label htmlFor={id} className="text-[13px]">
          {label}
        </Label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function BandPanel() {
  return (
    <aside aria-label="Why studios use Orbit" className="dc-band m-3 hidden flex-col justify-between gap-10 overflow-hidden rounded-[var(--dc-radius-card)] p-10 lg:flex xl:p-12">
      <div className="max-w-[480px]">
        <p className="text-sm font-semibold opacity-80">Invoicing for freelancers and small studios</p>
        <p className="dc-h mt-4 text-[34px] leading-[1.1] xl:text-[40px]">Send the invoice. Orbit chases it, politely, until it is paid.</p>
        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <dt className="text-[14px] text-muted-foreground">Average time to get paid</dt>
            <dd className="dc-num mt-1 text-[32px] font-semibold tracking-tight">11 days</dd>
          </div>
          <div>
            <dt className="text-[14px] text-muted-foreground">Studios and freelancers</dt>
            <dd className="dc-num mt-1 text-[32px] font-semibold tracking-tight">12,000</dd>
          </div>
        </dl>
      </div>
      <figure className="max-w-[480px] rounded-[calc(var(--radius)+4px)] border border-border bg-[color:color-mix(in_oklab,var(--dc-band-fg)_6%,transparent)] p-6">
        <blockquote className="text-[17px] leading-relaxed">
          &ldquo;We stopped writing awkward follow-up emails. Orbit sends them in our tone, and clients just pay.&rdquo;
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3 text-[14px]">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-band-fg)_14%,transparent)] text-[12px] font-bold">
            MO
          </span>
          <span>
            <span className="block font-semibold">Maya Okafor</span>
            <span className="block text-muted-foreground">Founder, Fernwood Studio</span>
          </span>
        </figcaption>
      </figure>
    </aside>
  )
}

export default function LoginSplit() {
  const id = useId()
  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState<"" | "email" | "google">("")
  const [done, setDone] = useState<"" | "email" | "google">("")
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
  const finish = (how: "email" | "google") => {
    setBusy(how)
    // Replace the timeout with your sign-in call (or the redirect to Google).
    timer.current = setTimeout(() => {
      setBusy("")
      setDone(how)
    }, 1200)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = { email: check("email", values.email), password: check("password", values.password) }
    setErrors(next)
    const first = (["email", "password"] as const).find((f) => next[f])
    if (first) document.getElementById(`${id}-${first}`)?.focus()
    else finish("email")
  }

  return (
    <section aria-labelledby={`${id}-title`} className="grid min-h-[680px] bg-background lg:min-h-[760px] lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-5 py-6 sm:px-10">
        <a href="#home" className={`w-fit ${focus}`} aria-label="Orbit home">
          <Logo />
        </a>
        <div className="mx-auto my-auto w-full max-w-[380px] py-14">
          {done ? (
            <div role="status">
              <span className="grid size-12 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
                <Check className="size-5" aria-hidden="true" />
              </span>
              <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-6 text-[32px] leading-[1.1] outline-none">
                Good to see you again
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {done === "google" ? "You signed in with Google." : "You're signed in."} Northlight paid INV-1040 while you were away.
              </p>
              <Button className="mt-7 h-10 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#overview" />}>
                Open your overview <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <>
              <h1 id={`${id}-title`} className="dc-h text-[32px] leading-[1.1]">
                Welcome back
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-pretty text-muted-foreground">Sign in to see who has paid and who needs a nudge.</p>
              <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-4">
                <FieldRow id={`${id}-email`} label="Email" error={errors.email}>
                  <Input
                    id={`${id}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={(e) => blur("email", e)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? `${id}-email-error` : undefined}
                    className="h-10"
                  />
                </FieldRow>
                <FieldRow
                  id={`${id}-password`}
                  label="Password"
                  error={errors.password}
                  aside={
                    <a href="#forgot-password" className={`text-[13px] font-medium text-[color:var(--dc-accent)] hover:underline ${focus}`}>
                      Forgot it?
                    </a>
                  }
                >
                  <div className="relative">
                    <Input
                      id={`${id}-password`}
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      value={values.password}
                      onChange={(e) => set("password", e.target.value)}
                      onBlur={(e) => blur("password", e)}
                      aria-invalid={errors.password ? true : undefined}
                      aria-describedby={errors.password ? `${id}-password-error` : undefined}
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
                  {busy === "email" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                  {busy === "email" ? "Signing in…" : "Sign in"}
                </Button>
                <Button type="button" variant="outline" className="h-10 w-full text-[14px] font-medium" disabled={!!busy} onClick={() => finish("google")}>
                  {busy === "google" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <GoogleMark />}
                  Sign in with Google
                </Button>
                <p className="sr-only" aria-live="polite">
                  {busy ? "Signing in…" : ""}
                </p>
              </form>
              <p className="mt-8 text-[14px] text-muted-foreground">
                No account yet?{" "}
                <a href="#sign-up" className={`font-semibold text-foreground hover:underline ${focus}`}>
                  Start free
                </a>
              </p>
            </>
          )}
        </div>
        <footer className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
          <span>© 2026 Orbit Labs</span>
          {["Privacy", "Terms", "Help"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className={`hover:text-foreground ${focus}`}>
              {l}
            </a>
          ))}
        </footer>
      </div>
      <BandPanel />
    </section>
  )
}
