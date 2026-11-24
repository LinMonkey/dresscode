"use client"

// Sign-up, card: name, work email and a password with a strength meter and the rules it still misses,
// then the terms and a submit button that shows a spinner and a "confirm your email" state. Each field
// is checked when it loses focus and again on submit. Wire onSubmit to your own sign-up endpoint.
import { Check, Circle, Eye, EyeOff, LoaderCircle, MailCheck } from "lucide-react"
import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

const RULES = [
  { label: "At least 8 characters", miss: "8 characters", test: (p: string) => p.length >= 8 },
  { label: "Upper and lower case", miss: "upper and lower case", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "A number", miss: "a number", test: (p: string) => /\d/.test(p) },
  { label: "A symbol, like ! or #", miss: "a symbol", test: (p: string) => /[^A-Za-z0-9\s]/.test(p) },
]
const LEVEL = ["", "Weak", "Fair", "Good", "Strong"]

type Field = "name" | "email" | "password" | "terms"
type Values = { name: string; email: string; password: string; terms: boolean }

const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`)
function check(f: Field, v: Values) {
  if (f === "name") return v.name.trim() ? "" : "Tell us what to call you."
  if (f === "email") return !v.email.trim() ? "Enter your work email." : EMAIL.test(v.email.trim()) ? "" : "That doesn't look like an email address."
  if (f === "password") {
    if (!v.password) return "Choose a password."
    const missing = RULES.filter((r) => !r.test(v.password)).map((r) => r.miss)
    return missing.length ? `Your password still needs ${list(missing)}.` : ""
  }
  return v.terms ? "" : "Please accept the terms to continue."
}

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

export default function SignupCard() {
  const id = useId()
  const [v, setV] = useState<Values>({ name: "", email: "", password: "", terms: false })
  const [errors, setErrors] = useState<Record<Field, string>>({ name: "", email: "", password: "", terms: "" })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const doneTitle = useRef<HTMLHeadingElement>(null)
  const termsBox = useRef<HTMLElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (done) doneTitle.current?.focus()
  }, [done])

  const met = RULES.map((r) => r.test(v.password))
  const score = met.filter(Boolean).length
  const set = <K extends keyof Values>(f: K, value: Values[K]) => {
    const next = { ...v, [f]: value }
    setV(next)
    if (errors[f]) setErrors((s) => ({ ...s, [f]: check(f, next) }))
  }
  const blur = (f: "name" | "email" | "password", e: FocusEvent<HTMLInputElement>) => {
    if (toButton(e)) return
    if (v[f]) setErrors((s) => ({ ...s, [f]: check(f, v) }))
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const fields: Field[] = ["name", "email", "password", "terms"]
    const next = Object.fromEntries(fields.map((f) => [f, check(f, v)])) as Record<Field, string>
    setErrors(next)
    const first = fields.find((f) => next[f])
    if (first) return first === "terms" ? termsBox.current?.focus() : document.getElementById(`${id}-${first}`)?.focus()
    setBusy(true)
    // Replace the timeout with your call that creates the account and emails the confirmation.
    timer.current = setTimeout(() => {
      setBusy(false)
      setDone(true)
    }, 1300)
  }

  const describe = (f: Field, extra?: string) => [errors[f] ? `${id}-${f}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[860px] flex-col items-center justify-center bg-muted px-5 py-16 sm:px-8">
      <a href="#home" className={focus} aria-label="Orbit home">
        <Logo />
      </a>
      <div className="dc-card mt-8 w-full max-w-[440px] p-6 sm:p-8">
        {done ? (
          <div role="status" className="py-4 text-center">
            <span className="dc-icon size-12">
              <MailCheck className="size-5" aria-hidden="true" />
            </span>
            <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-5 text-[24px] leading-tight outline-none">
              Confirm your email
            </h1>
            <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
              Thanks, {v.name.trim().split(/\s+/)[0]}. We sent a link to <span className="font-medium [overflow-wrap:anywhere] text-foreground">{v.email.trim()}</span>. Open it to finish setting up your workspace.
            </p>
            <p className="mt-6 text-[14px] text-muted-foreground">
              Wrong address?{" "}
              <button type="button" onClick={() => setDone(false)} className={`font-semibold text-foreground hover:underline ${focus}`}>
                Change it
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1 id={`${id}-title`} className="dc-h text-[26px] leading-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-[15px] text-muted-foreground">Free for your first three clients. No card needed.</p>
            <form noValidate onSubmit={onSubmit} className="mt-7 grid gap-4">
              <FieldRow id={`${id}-name`} label="Your name" error={errors.name}>
                <Input
                  id={`${id}-name`}
                  autoComplete="name"
                  placeholder="Ada Ruiz"
                  value={v.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={(e) => blur("name", e)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describe("name")}
                  className="h-10"
                />
              </FieldRow>
              <FieldRow id={`${id}-email`} label="Work email" error={errors.email}>
                <Input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  value={v.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={(e) => blur("email", e)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describe("email")}
                  className="h-10"
                />
              </FieldRow>
              <FieldRow
                id={`${id}-password`}
                label="Password"
                error={errors.password}
                aside={
                  <span className="text-[12px] font-medium text-muted-foreground" aria-live="polite">
                    {v.password ? `Strength: ${LEVEL[score] || "Weak"}` : ""}
                  </span>
                }
              >
                <div className="relative">
                  <Input
                    id={`${id}-password`}
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    value={v.password}
                    onChange={(e) => set("password", e.target.value)}
                    onBlur={(e) => blur("password", e)}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={describe("password", `${id}-rules`)}
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
                <div className="mt-1 grid grid-cols-4 gap-1" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={cn(
                        "h-1.5 rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)] transition-colors motion-reduce:transition-none",
                        n <= score && (score <= 1 ? "bg-destructive" : score === 2 ? "bg-[color:var(--chart-2)]" : "bg-[color:var(--chart-1)]"),
                      )}
                    />
                  ))}
                </div>
                <ul id={`${id}-rules`} aria-label="Password rules" className="mt-1 grid gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-2">
                  {RULES.map((r, i) => (
                    <li key={r.label} className={cn("flex items-center gap-2", met[i] ? "text-muted-foreground" : "text-foreground")}>
                      {met[i] ? (
                        <Check className="size-3.5 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                      ) : (
                        <Circle className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span>
                        {r.label}
                        <span className="sr-only">{met[i] ? ", done" : ", still needed"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </FieldRow>
              <div className="grid gap-1.5 pt-1">
                <label className="flex items-start gap-2.5 text-[14px] leading-snug">
                  <Checkbox
                    ref={termsBox}
                    className="mt-0.5"
                    checked={v.terms}
                    onCheckedChange={(c) => {
                      const next = { ...v, terms: c === true }
                      setV(next)
                      if (errors.terms) setErrors((s) => ({ ...s, terms: check("terms", next) }))
                    }}
                    aria-invalid={errors.terms ? true : undefined}
                    aria-describedby={describe("terms")}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#terms" className={`font-medium underline underline-offset-2 ${focus}`}>
                      Terms
                    </a>{" "}
                    and the{" "}
                    <a href="#privacy" className={`font-medium underline underline-offset-2 ${focus}`}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms ? (
                  <p id={`${id}-terms-error`} className="text-[13px] text-destructive">
                    {errors.terms}
                  </p>
                ) : null}
              </div>
              <Button type="submit" className="mt-1 h-10 w-full text-[15px] font-semibold" disabled={busy}>
                {busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                {busy ? "Creating your account…" : "Create account"}
              </Button>
              <p className="sr-only" aria-live="polite">
                {busy ? "Creating your account…" : ""}
              </p>
            </form>
          </>
        )}
      </div>
      <p className="mt-6 text-[14px] text-muted-foreground">
        Already on Orbit?{" "}
        <a href="#sign-in" className={`font-semibold text-foreground hover:underline ${focus}`}>
          Sign in
        </a>
      </p>
    </section>
  )
}
