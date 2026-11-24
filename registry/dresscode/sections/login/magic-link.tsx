"use client"

// Login, magic link: email only, no password. After the email is sent the page says where it went, with
// a resend button that counts down before it can be used again and a way to change the address (the
// form comes back with the address in it). Wire send() to your own magic-link endpoint.
import { ArrowLeft, LoaderCircle, Mail, MailCheck, RotateCw } from "lucide-react"
import { type FocusEvent, type FormEvent, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WAIT = 30
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form
const check = (v: string) => (!v.trim() ? "Enter your email." : EMAIL.test(v.trim()) ? "" : "That doesn't look like an email address.")
const clock = (s: number) => `0:${String(s).padStart(2, "0")}`

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

export default function LoginMagicLink() {
  const id = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState("")
  const [left, setLeft] = useState(0)
  const [resent, setResent] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const input = useRef<HTMLInputElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const back = useRef(false)

  useEffect(() => () => clearTimeout(timer.current), [])
  // The resend countdown: one tick a second until it reaches zero.
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  useEffect(() => {
    if (sent) title.current?.focus()
    else if (back.current) input.current?.focus()
  }, [sent])

  const send = (address: string, again = false) => {
    setBusy(true)
    // Replace the timeout with your call that emails the link.
    timer.current = setTimeout(() => {
      setBusy(false)
      setSent(address)
      setLeft(WAIT)
      if (again) setResent((n) => n + 1)
    }, 900)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const msg = check(email)
    setError(msg)
    if (msg) input.current?.focus()
    else send(email.trim())
  }
  const change = () => {
    back.current = true
    setSent("")
    setResent(0)
    setLeft(0)
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[680px] flex-col bg-background">
      <header className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#home" className={focus} aria-label="Orbit home">
          <Logo />
        </a>
        <a href="#help" className={`text-[14px] font-medium text-muted-foreground hover:text-foreground ${focus}`}>
          Need help?
        </a>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-14 sm:px-8">
        <div className="w-full max-w-[400px] text-center">
          {sent ? (
            <>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
                <MailCheck className="size-6" aria-hidden="true" />
              </span>
              <h1 id={`${id}-title`} ref={title} tabIndex={-1} className="dc-h mt-6 text-[32px] leading-[1.1] outline-none sm:text-[36px]">
                Check your inbox
              </h1>
              <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                We sent a sign-in link to <span className="font-semibold [overflow-wrap:anywhere] text-foreground">{sent}</span>. It works once, for the next 15 minutes.
              </p>
              <div className="dc-card mt-8 grid gap-3 p-4 text-left sm:p-5">
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Can&rsquo;t find it? Look in spam, or search your mail for &ldquo;Orbit sign-in&rdquo;.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" className="h-10 px-4" disabled={left > 0 || busy} onClick={() => send(sent, true)}>
                    {busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <RotateCw className="size-4" aria-hidden="true" />}
                    {busy ? (
                      "Sending…"
                    ) : left > 0 ? (
                      <span>
                        Resend in <span className="dc-num">{clock(left)}</span>
                      </span>
                    ) : (
                      "Resend link"
                    )}
                  </Button>
                  <Button variant="ghost" className="h-10 px-3" onClick={change}>
                    <ArrowLeft className="size-4" aria-hidden="true" /> Use a different email
                  </Button>
                </div>
              </div>
              <p className="mt-4 min-h-5 text-[13px] text-muted-foreground" aria-live="polite">
                {resent ? "We sent a new link. Use the newest email; older links stop working." : ""}
              </p>
            </>
          ) : (
            <>
              <span className="dc-icon mx-auto size-14">
                <Mail className="size-6" aria-hidden="true" />
              </span>
              <h1 id={`${id}-title`} className="dc-h mt-6 text-[32px] leading-[1.1] sm:text-[36px]">
                Sign in with a link
              </h1>
              <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">Enter your email and we&rsquo;ll send you a link that signs you in. Nothing to remember.</p>
              <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-3 text-left">
                <div className="grid gap-1.5">
                  <Label htmlFor={`${id}-email`} className="text-[13px]">
                    Email
                  </Label>
                  <Input
                    ref={input}
                    id={`${id}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(check(e.target.value))
                    }}
                    onBlur={(e) => email && !toButton(e) && setError(check(email))}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className="h-11"
                  />
                  {error ? (
                    <p id={`${id}-error`} className="text-[13px] text-destructive">
                      {error}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="h-11 w-full text-[15px] font-semibold" disabled={busy}>
                  {busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                  {busy ? "Sending your link…" : "Email me a sign-in link"}
                </Button>
              </form>
              <p className="mt-6 text-[14px] text-muted-foreground">
                Prefer a password?{" "}
                <a href="#password" className={`font-semibold text-foreground hover:underline ${focus}`}>
                  Sign in with password
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      <footer className="flex flex-wrap justify-center gap-x-5 gap-y-1 px-5 pb-6 text-[13px] text-muted-foreground">
        <span>© 2026 Orbit Labs</span>
        {["Privacy", "Terms", "Status"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className={`hover:text-foreground ${focus}`}>
            {l}
          </a>
        ))}
      </footer>
    </section>
  )
}
