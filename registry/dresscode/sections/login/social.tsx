"use client"

// Login, social first: one wide card with the sign-in providers on the left (Google, GitHub, Apple and
// single sign-on) and, after an "or", email on the right; on phones the two stack. Single sign-on turns
// the email side into "find my company's sign-in". A provider button shows a spinner while it would
// redirect, then a signed-in state. Wire each provider to your own OAuth or SAML route.
import { Apple, ArrowLeft, ArrowRight, Check, KeyRound, LoaderCircle, MailCheck } from "lucide-react"
import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form

type Provider = "Google" | "GitHub" | "Apple"

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
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

// Apple's own mark is not drawn here; a plain apple glyph stands in. Swap in the mark from Apple's
// sign-in guidelines when you ship.
const PROVIDERS: { name: Provider; mark: ReactNode }[] = [
  { name: "Google", mark: <GoogleMark /> },
  { name: "GitHub", mark: <GitHubMark /> },
  { name: "Apple", mark: <Apple className="size-[18px]" aria-hidden="true" /> },
]

export default function LoginSocial() {
  const id = useId()
  const [mode, setMode] = useState<"email" | "sso">("email")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState<"" | Provider | "email" | "sso">("")
  const [done, setDone] = useState<"" | Provider | "email" | "sso">("")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const emailRef = useRef<HTMLInputElement>(null)
  const result = useRef<HTMLDivElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (done) result.current?.focus()
  }, [done])

  const check = (v: string) =>
    !v.trim() ? (mode === "sso" ? "Enter your work email." : "Enter your email.") : EMAIL.test(v.trim()) ? "" : "That doesn't look like an email address."
  const go = (how: Provider | "email" | "sso") => {
    setBusy(how)
    // Replace the timeout with the redirect to the provider, your SSO lookup or your magic-link call.
    timer.current = setTimeout(() => {
      setBusy("")
      setDone(how)
    }, 1300)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const msg = check(email)
    setError(msg)
    if (msg) emailRef.current?.focus()
    else go(mode)
  }
  const pickSso = () => {
    setMode("sso")
    setError("")
    emailRef.current?.focus()
  }

  const providerButton = "h-11 w-full justify-start gap-3 px-4 text-[15px] font-medium"

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[720px] flex-col items-center justify-center bg-background px-5 py-16 sm:px-8">
      <a href="#home" className={focus} aria-label="Orbit home">
        <Logo />
      </a>
      <h1 id={`${id}-title`} className="dc-h mt-7 text-center text-[30px] leading-[1.1] sm:text-[36px]">
        Sign in to Orbit
      </h1>
      <p className="mt-3 max-w-[460px] text-center text-[15px] leading-relaxed text-balance text-muted-foreground sm:text-[16px]">
        Use the account you already have. You can link more ways to sign in later, in Settings.
      </p>

      <div className="dc-card mt-9 w-full max-w-[860px]">
        {done ? (
          <div ref={result} tabIndex={-1} role="status" className="flex flex-col items-center px-6 py-14 text-center outline-none">
            <span className="dc-icon size-12">
              {done === "email" ? (
                <MailCheck className="size-5" aria-hidden="true" />
              ) : done === "sso" ? (
                <KeyRound className="size-5" aria-hidden="true" />
              ) : (
                <Check className="size-5" aria-hidden="true" />
              )}
            </span>
            <p className="dc-h mt-5 text-[22px]">
              {done === "email" ? "Check your inbox" : done === "sso" ? "Opening your company's sign-in" : `Signed in with ${done}`}
            </p>
            <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-muted-foreground">
              {done === "email" ? (
                <>
                  We sent a sign-in link to <span className="font-medium [overflow-wrap:anywhere] text-foreground">{email.trim()}</span>. It works for 15 minutes.
                </>
              ) : done === "sso" ? (
                <>
                  <span className="font-medium text-foreground">{email.trim().split("@")[1]}</span> signs in with single sign-on. Finish there and you&rsquo;ll come straight back.
                </>
              ) : (
                "Your invoices are ready where you left them."
              )}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {done === "email" || done === "sso" ? null : (
                <Button className="h-10 px-5 font-semibold" nativeButton={false} render={<a href="#invoices" />}>
                  Go to your invoices <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              )}
              <Button variant="outline" className="h-10 px-4" onClick={() => setDone("")}>
                <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign-in options
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_auto_1fr]">
            <div className="p-6 sm:p-8">
              <h2 className="text-[15px] font-semibold">With an account you have</h2>
              <ul className="mt-4 grid gap-2.5">
                {PROVIDERS.map((p) => (
                  <li key={p.name}>
                    <Button type="button" variant="outline" className={providerButton} disabled={!!busy} onClick={() => go(p.name)}>
                      {busy === p.name ? <LoaderCircle className="size-[18px] animate-spin motion-reduce:animate-none" aria-hidden="true" /> : p.mark}
                      Continue with {p.name}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button
                    type="button"
                    variant="outline"
                    className={`${providerButton} aria-pressed:border-[color:var(--dc-accent)] aria-pressed:bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,transparent)]`}
                    disabled={!!busy}
                    aria-pressed={mode === "sso"}
                    onClick={pickSso}
                  >
                    <KeyRound className="size-[18px]" aria-hidden="true" />
                    Single sign-on (SSO)
                  </Button>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3 px-6 text-[13px] text-muted-foreground sm:px-8 md:flex-col md:px-0 md:py-8">
              <span className="h-px flex-1 bg-border md:h-auto md:w-px" aria-hidden="true" />
              or
              <span className="h-px flex-1 bg-border md:h-auto md:w-px" aria-hidden="true" />
            </div>

            <form noValidate onSubmit={onSubmit} className="flex flex-col p-6 sm:p-8">
              <h2 className="text-[15px] font-semibold">{mode === "sso" ? "Find your company's sign-in" : "Continue with email"}</h2>
              <p className="mt-1 text-[14px] leading-relaxed text-pretty text-muted-foreground">
                {mode === "sso" ? "Enter your work email. We'll send you to the sign-in page your company set up." : "We'll email you a link that signs you in. No password needed."}
              </p>
              <div className="mt-4 grid gap-1.5">
                <Label htmlFor={`${id}-email`} className="text-[13px]">
                  {mode === "sso" ? "Work email" : "Email"}
                </Label>
                <Input
                  ref={emailRef}
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder={mode === "sso" ? "you@company.com" : "you@studio.com"}
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
              <Button type="submit" className="mt-4 h-11 w-full text-[15px] font-semibold" disabled={!!busy}>
                {busy === "email" || busy === "sso" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                {mode === "sso" ? "Continue with SSO" : "Email me a link"}
              </Button>
              {mode === "sso" ? (
                <button type="button" onClick={() => setMode("email")} className={`mt-4 self-start text-[14px] font-medium text-[color:var(--dc-accent)] hover:underline ${focus}`}>
                  Use email without SSO
                </button>
              ) : (
                <a href="#password" className={`mt-4 self-start text-[14px] font-medium text-[color:var(--dc-accent)] hover:underline ${focus}`}>
                  Sign in with a password instead
                </a>
              )}
              <p className="sr-only" aria-live="polite">
                {busy ? (busy === "email" ? "Sending your link…" : busy === "sso" ? "Looking up your company…" : `Connecting to ${busy}…`) : ""}
              </p>
            </form>
          </div>
        )}
      </div>

      <p className="mt-6 max-w-[560px] text-center text-[13px] leading-relaxed text-balance text-muted-foreground">
        New to Orbit?{" "}
        <a href="#sign-up" className={`font-semibold text-foreground hover:underline ${focus}`}>
          Create an account
        </a>
        . By continuing you agree to the{" "}
        <a href="#terms" className={`underline underline-offset-2 hover:text-foreground ${focus}`}>
          Terms
        </a>{" "}
        and{" "}
        <a href="#privacy" className={`underline underline-offset-2 hover:text-foreground ${focus}`}>
          Privacy Policy
        </a>
        .
      </p>
    </section>
  )
}
