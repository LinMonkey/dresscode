"use client"

// Login, card: a centered sign-in card on a soft surface. Email and a password with a show/hide toggle,
// remember me, a forgot-password link, Google and GitHub, and a way to sign up. Each field is checked
// when it loses focus and again on submit; errors are tied to their field. Submitting shows a spinner,
// then a signed-in state. Wire onSubmit and the two provider buttons to your own auth.
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react"
import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const link = "rounded-[2px] font-medium text-[color:var(--dc-accent)] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

type Field = "email" | "password"
const check = (f: Field, v: string) =>
  f === "email" ? (!v.trim() ? "Enter your email." : EMAIL.test(v.trim()) ? "" : "That doesn't look like an email address.") : v ? "" : "Enter your password."

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

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
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

export default function LoginCard() {
  const id = useId()
  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [busy, setBusy] = useState<"" | "email" | "Google" | "GitHub">("")
  const [done, setDone] = useState<"" | "email" | "Google" | "GitHub">("")
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
  const finish = (how: "email" | "Google" | "GitHub") => {
    setBusy(how)
    // Replace the timeout with your sign-in call (or the redirect to the provider).
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
    <section aria-labelledby={`${id}-title`} className="flex min-h-[760px] flex-col items-center justify-center bg-muted px-5 py-16 sm:px-8">
      <a href="#home" className="rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Orbit home">
        <Logo />
      </a>
      <div className="dc-card mt-8 w-full max-w-[420px] p-6 sm:p-8">
        {done ? (
          <div role="status" className="py-4 text-center">
            <span className="dc-icon size-12">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-5 text-[24px] leading-tight outline-none">
              You&rsquo;re signed in
            </h1>
            <p className="mx-auto mt-2 max-w-[300px] text-[15px] leading-relaxed text-muted-foreground">
              {done === "email" ? (
                <>
                  Welcome back, <span className="font-medium [overflow-wrap:anywhere] text-foreground">{values.email.trim()}</span>.
                </>
              ) : (
                <>Welcome back. You signed in with {done}.</>
              )}{" "}
              {remember || done !== "email" ? "This device stays signed in for 30 days." : "We'll sign you out when you close the browser."}
            </p>
            <Button className="mt-6 h-10 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#invoices" />}>
              Go to your invoices <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <>
            <h1 id={`${id}-title`} className="dc-h text-[26px] leading-tight">
              Sign in to Orbit
            </h1>
            <p className="mt-1.5 text-[15px] text-pretty text-muted-foreground">Welcome back. See who has paid this week.</p>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {(["Google", "GitHub"] as const).map((p) => (
                <Button key={p} type="button" variant="outline" className="h-10 text-[14px] font-medium" disabled={!!busy} onClick={() => finish(p)}>
                  {busy === p ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : p === "Google" ? <GoogleMark /> : <GitHubMark />}
                  {p}
                </Button>
              ))}
            </div>
            <div className="my-6 flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              or with your email
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>

            <form noValidate onSubmit={onSubmit} className="grid gap-4">
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
                  <a href="#forgot-password" className={`${link} text-[13px]`}>
                    Forgot password?
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
              <label className="flex w-fit items-center gap-2.5 text-[14px]">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                Remember me for 30 days
              </label>
              <Button type="submit" className="mt-1 h-10 w-full text-[15px] font-semibold" disabled={!!busy}>
                {busy === "email" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                {busy === "email" ? "Signing in…" : "Sign in"}
              </Button>
              <p className="sr-only" aria-live="polite">
                {busy ? `Signing in${busy === "email" ? "" : ` with ${busy}`}…` : ""}
              </p>
            </form>
          </>
        )}
      </div>
      <p className="mt-6 text-[14px] text-muted-foreground">
        New to Orbit?{" "}
        <a href="#sign-up" className="rounded-[2px] font-semibold text-foreground outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
          Create an account
        </a>
      </p>
    </section>
  )
}
