"use client"

// Sign-up, team invite: who invited you to which workspace (initials, no photos), the role you will
// have and who is already there, then your name and a password and one button to join. "Not you?" is
// for the wrong person opening the link. Fields are checked when they lose focus and on submit. Wire
// onSubmit to your own accept-invite endpoint (the token usually comes from the link).
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react"
import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const INVITE = {
  from: { name: "Maya Okafor", initials: "MO" },
  workspace: { name: "Fernwood Studio", initials: "FS" },
  email: "jonas@fernwood.studio",
  role: "Editor",
  expires: "Dec 1",
  members: ["MO", "TL", "SA", "RB"],
  more: 3,
}
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

type Field = "name" | "password"
const check = (f: Field, v: string) => (f === "name" ? (v.trim() ? "" : "Tell your team what to call you.") : v.length >= 8 ? "" : "Use at least 8 characters.")

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

function Who() {
  // The inviter and the workspace, side by side, joined by a short dashed line.
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <span className="grid size-14 place-items-center rounded-full bg-[color:var(--card)] text-[16px] font-bold ring-1 ring-border">{INVITE.from.initials}</span>
      <span className="w-10 border-t-2 border-dashed border-[color:var(--input)]" />
      <span className="dc-h grid size-14 place-items-center rounded-[calc(var(--radius)+6px)] bg-[color:var(--dc-highlight)] text-[18px] text-[color:var(--dc-highlight-fg)]">
        {INVITE.workspace.initials}
      </span>
    </div>
  )
}

export default function SignupInvite() {
  const id = useId()
  const [values, setValues] = useState<Record<Field, string>>({ name: "", password: "" })
  const [errors, setErrors] = useState<Record<Field, string>>({ name: "", password: "" })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
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
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = { name: check("name", values.name), password: check("password", values.password) }
    setErrors(next)
    const first = (["name", "password"] as const).find((f) => next[f])
    if (first) return document.getElementById(`${id}-${first}`)?.focus()
    setBusy(true)
    // Replace the timeout with your call that accepts the invite and creates the account.
    timer.current = setTimeout(() => {
      setBusy(false)
      setDone(true)
    }, 1300)
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[880px] flex-col items-center justify-center bg-muted px-5 py-16 sm:px-8">
      <a href="#home" className={focus} aria-label="Orbit home">
        <Logo />
      </a>
      <div className="dc-card mt-8 w-full max-w-[460px] overflow-hidden">
        <div className="border-b border-border bg-[color:color-mix(in_oklab,var(--dc-accent)_6%,var(--card))] px-6 pt-8 pb-7 text-center sm:px-8">
          <Who />
          {done ? (
            <>
              <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-5 text-[26px] leading-tight outline-none">
                Welcome to {INVITE.workspace.name}
              </h1>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                You joined as {INVITE.role.toLowerCase()}. {INVITE.from.name.split(" ")[0]} will see you in the team list.
              </p>
            </>
          ) : (
            <>
              <p className="mt-5 text-[14px] text-muted-foreground">
                <span className="font-semibold text-foreground">{INVITE.from.name}</span> invited you to join
              </p>
              <h1 id={`${id}-title`} className="dc-h mt-1 text-[28px] leading-tight">
                {INVITE.workspace.name}
              </h1>
            </>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px]">
            <span className="dc-pill dc-pill-line">Role: {INVITE.role}</span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="flex -space-x-1" aria-hidden="true">
                {INVITE.members.map((m) => (
                  <span key={m} className="grid size-8 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_9%,var(--card))] text-[10px] font-bold text-foreground ring-2 ring-[color:color-mix(in_oklab,var(--dc-accent)_6%,var(--card))]">
                    {m}
                  </span>
                ))}
              </span>
              <span>
                <span className="dc-num">{INVITE.members.length + INVITE.more}</span> people already here
              </span>
            </span>
          </div>
        </div>

        {done ? (
          <div role="status" className="grid gap-3 p-6 sm:p-8">
            <p className="text-[13px] font-medium text-muted-foreground">You can now see</p>
            <ul className="grid gap-2 text-[14px]">
              {["The studio's 24 open invoices", "The reminder plans your team uses", "Client notes and payment history"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--dc-accent)]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <Button className="mt-2 h-10 w-full text-[15px] font-semibold" nativeButton={false} render={<a href="#workspace" />}>
              Open the workspace <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="grid gap-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-[calc(var(--radius)+2px)] bg-[color:color-mix(in_oklab,var(--foreground)_5%,transparent)] px-3 py-2.5 text-[14px]">
              <span className="min-w-0">
                <span className="text-muted-foreground">Joining as </span>
                <span className="font-medium [overflow-wrap:anywhere]">{INVITE.email}</span>
              </span>
              <a href="#sign-out" className={`text-[13px] font-medium text-[color:var(--dc-accent)] hover:underline ${focus}`}>
                Not you?
              </a>
            </div>
            <FieldRow id={`${id}-name`} label="Your name" error={errors.name}>
              <Input
                id={`${id}-name`}
                autoComplete="name"
                placeholder="Jonas Weber"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={(e) => blur("name", e)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
                className="h-10"
              />
            </FieldRow>
            <FieldRow id={`${id}-password`} label="Choose a password" error={errors.password} hint="At least 8 characters.">
              <div className="relative">
                <Input
                  id={`${id}-password`}
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={(e) => set("password", e.target.value)}
                  onBlur={(e) => blur("password", e)}
                  aria-invalid={errors.password ? true : undefined}
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
            <Button type="submit" className="mt-2 h-10 w-full text-[15px] font-semibold" disabled={busy}>
              {busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
              {busy ? "Joining…" : `Join ${INVITE.workspace.name}`}
            </Button>
            <p className="sr-only" aria-live="polite">
              {busy ? `Joining ${INVITE.workspace.name}…` : ""}
            </p>
            <p className="text-center text-[13px] text-balance text-muted-foreground">
              This invite works until <span className="dc-num">{INVITE.expires}</span>. Joining means you agree to the{" "}
              <a href="#terms" className={`underline underline-offset-2 hover:text-foreground ${focus}`}>
                Terms
              </a>
              .
            </p>
          </form>
        )}
      </div>
      {done ? null : (
        <p className="mt-6 text-center text-[14px] text-muted-foreground">
          Already use Orbit?{" "}
          <a href="#sign-in" className={`font-semibold text-foreground hover:underline ${focus}`}>
            Sign in to accept
          </a>
        </p>
      )}
    </section>
  )
}
