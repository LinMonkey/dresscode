"use client"

// Sign in and sign up: the form on one side and the theme's band on the other, carrying a quote and
// a few pieces of the product (a paid invoice, the revenue card) so the first screen already looks
// like Orbit. On phones the band steps aside and the form is the page.
import { Check, CircleDollarSign, Eye, EyeOff, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { useOrbit } from "./context"
import { CheckRow, FormField, SimpleSelect, opts } from "./controls"
import { LogoMark, StatusPill } from "./ui"

const EMAIL = /^\S+@\S+\.\S+$/

function AuthFrame({ children, side }: { children: ReactNode; side: ReactNode }) {
  const { href } = useOrbit()
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col px-5 py-6 sm:px-10">
        <Link href={href("overview")} className="flex w-fit items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">
          <LogoMark /> <span className="dc-h">Orbit</span>
        </Link>
        <main className="mx-auto my-auto w-full max-w-[380px] py-12">{children}</main>
        <footer className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          <span>© 2026 Orbit Labs</span>
          <a href="#privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#terms" className="hover:text-foreground">
            Terms
          </a>
          <a href="#status" className="hover:text-foreground">
            Status
          </a>
        </footer>
      </div>
      <aside className="dc-band m-3 hidden flex-col justify-between overflow-hidden rounded-[var(--dc-radius-card)] p-10 lg:flex xl:p-14">{side}</aside>
    </div>
  )
}

function GoogleButton({ label }: { label: string }) {
  return (
    <Button type="button" variant="outline" className="h-10 w-full text-[14px] font-medium">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
      {label}
    </Button>
  )
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-[12px] text-muted-foreground">
      <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function PasswordInput({ id, value, onChange, invalid, autoComplete }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} aria-invalid={invalid} className="h-10 pr-10" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-[calc(var(--radius)-2px)] text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function useSubmit() {
  const { href } = useOrbit()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return {
    busy,
    go: () => {
      setBusy(true)
      window.setTimeout(() => router.push(href("overview")), 700)
    },
  }
}

export function SignInScreen() {
  const { href } = useOrbit()
  const [email, setEmail] = useState("ada@ruizstudio.co")
  const [password, setPassword] = useState("")
  const [keep, setKeep] = useState(true)
  const [tried, setTried] = useState(false)
  const { busy, go } = useSubmit()
  const emailErr = tried && !EMAIL.test(email) ? "Enter the email you signed up with." : null
  const passErr = tried && !password ? "Enter your password." : null
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (EMAIL.test(email) && password) go()
  }
  return (
    <AuthFrame side={<SignInSide />}>
      <h1 className="dc-h text-[30px] leading-tight">Welcome back</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">Sign in to see who has paid and who needs a nudge.</p>
      <div className="mt-7">
        <GoogleButton label="Continue with Google" />
      </div>
      <Divider />
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <FormField label="Email" htmlFor="si-email" error={emailErr}>
          <Input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!emailErr} className="h-10" />
        </FormField>
        <FormField
          label={
            <span className="flex w-full items-center justify-between">
              Password
              <a href="#reset" className="text-[13px] font-medium text-[color:var(--dc-accent)] hover:underline">
                Forgot it?
              </a>
            </span>
          }
          htmlFor="si-password"
          error={passErr}
        >
          <PasswordInput id="si-password" value={password} onChange={setPassword} invalid={!!passErr} autoComplete="current-password" />
        </FormField>
        <CheckRow>
          <Checkbox checked={keep} onCheckedChange={setKeep} /> Keep me signed in for 30 days
        </CheckRow>
        <Button type="submit" className="mt-1 h-10 w-full text-[15px] font-semibold" disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" /> : null}
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-muted-foreground">
        New to Orbit?{" "}
        <Link href={href("sign-up")} className="font-semibold text-foreground hover:underline">
          Start a free trial
        </Link>
      </p>
    </AuthFrame>
  )
}

function SignInSide() {
  return (
    <>
      <figure className="max-w-[460px]">
        <blockquote className="dc-h text-[26px] leading-snug xl:text-[30px]">“Orbit sends the reminders I used to put off. Clients pay in 11 days now, not 30.”</blockquote>
        <figcaption className="mt-5 text-[14px] text-[color:var(--dc-band-muted)]">Ada Ruiz, founder of Ruiz Studio</figcaption>
      </figure>
      <div className="relative my-10 grid w-full max-w-[420px] gap-3 self-center">
        <div className="dc-card flex items-center gap-3 p-4 text-[14px]">
          <span className="grid size-9 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
            <CircleDollarSign className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Northlight paid INV-1040</span>
            <span className="block text-[12px] text-muted-foreground">By card, 2 hours ago</span>
          </span>
          <span className="dc-num font-semibold">$7,450.00</span>
        </div>
        <div className="dc-card ml-10 p-4">
          <p className="text-[12px] text-muted-foreground">Revenue this month</p>
          <p className="dc-num mt-1 text-[24px] font-semibold tracking-tight">$48,210</p>
          <div className="mt-3 flex h-12 items-end gap-1.5" aria-hidden="true">
            {[18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42].map((v, i) => (
              <span key={i} className="flex-1 rounded-t-[2px] bg-[color:var(--chart-1)]" style={{ height: `${(v / 42) * 100}%`, opacity: i === 10 ? 1 : 0.45 }} />
            ))}
          </div>
        </div>
        <div className="dc-card flex items-center justify-between gap-3 p-4 text-[14px]">
          <span>
            <span className="block font-semibold">Kato &amp; Lee</span>
            <span className="block text-[12px] text-muted-foreground">Reminder 2 of 3 sent</span>
          </span>
          <StatusPill status="Overdue" />
        </div>
      </div>
      <p className="text-[13px] text-[color:var(--dc-band-muted)]">Used by 12,000 freelancers and studios in 40 countries.</p>
    </>
  )
}

function strength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 12) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++
  return Math.min(4, p ? Math.max(1, s) : 0)
}
const STRENGTH = ["", "Too weak", "Could be stronger", "Good", "Strong"]

export function SignUpScreen() {
  const { href } = useOrbit()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [work, setWork] = useState("Freelance work")
  const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false)
  const { busy, go } = useSubmit()
  const s = strength(password)
  const errs = {
    name: tried && !name.trim() ? "Tell us what to call you." : null,
    email: tried && !EMAIL.test(email) ? "Use an email you can open: we send a link." : null,
    password: tried && s < 2 ? "Use at least 8 characters, with a mix of letters and numbers." : null,
    agree: tried && !agree ? "Please accept the terms to continue." : null,
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (name.trim() && EMAIL.test(email) && s >= 2 && agree) go()
  }
  return (
    <AuthFrame side={<SignUpSide />}>
      <h1 className="dc-h text-[30px] leading-tight">Start your free trial</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">14 days of Pro. No card needed, cancel in two clicks.</p>
      <div className="mt-7">
        <GoogleButton label="Sign up with Google" />
      </div>
      <Divider />
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <FormField label="Your name" htmlFor="su-name" error={errs.name}>
          <Input id="su-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errs.name} className="h-10" placeholder="Ada Ruiz" />
        </FormField>
        <FormField label="Work email" htmlFor="su-email" error={errs.email}>
          <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errs.email} className="h-10" placeholder="you@studio.com" />
        </FormField>
        <FormField label="Password" htmlFor="su-password" error={errs.password}>
          <PasswordInput id="su-password" value={password} onChange={setPassword} invalid={!!errs.password} autoComplete="new-password" />
          <div className="mt-1 flex items-center gap-2" aria-live="polite">
            <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "h-1 rounded-full bg-muted",
                    n <= s && (s <= 1 ? "bg-[color:var(--dc-danger)]" : s === 2 ? "bg-[color:var(--chart-2)]" : "bg-[color:var(--chart-1)]"),
                  )}
                />
              ))}
            </div>
            <span className="w-28 text-right text-[12px] text-muted-foreground">{STRENGTH[s]}</span>
          </div>
        </FormField>
        <FormField label="What do you bill for?" htmlFor="su-work">
          <SimpleSelect id="su-work" value={work} onChange={setWork} options={opts("Freelance work", "A studio or agency", "A small business", "Something else")} className="h-10 w-full" />
        </FormField>
        <div className="grid gap-1">
          <CheckRow>
            <Checkbox checked={agree} onCheckedChange={setAgree} aria-invalid={!!errs.agree} />
            <span>
              I agree to the{" "}
              <a href="#terms" className="font-medium underline underline-offset-2">
                Terms
              </a>{" "}
              and{" "}
              <a href="#privacy" className="font-medium underline underline-offset-2">
                Privacy Policy
              </a>
            </span>
          </CheckRow>
          {errs.agree ? (
            <p className="text-[12px] font-medium text-[color:var(--dc-danger)]" role="alert">
              {errs.agree}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="mt-1 h-10 w-full text-[15px] font-semibold" disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" /> : null}
          {busy ? "Setting up your workspace…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-muted-foreground">
        Already have an account?{" "}
        <Link href={href("sign-in")} className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </AuthFrame>
  )
}

function SignUpSide() {
  return (
    <>
      <div className="max-w-[460px]">
        <h2 className="dc-h text-[30px] leading-tight xl:text-[34px]">Everything in Pro, free for 14 days</h2>
        <ul className="mt-7 grid gap-3.5 text-[15px]">
          {["Unlimited invoices with your logo and colors", "Reminder plans that chase late payers for you", "Card, Apple Pay and bank transfer, paid out daily", "Recurring invoices for every retainer"].map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-band-fg)_16%,transparent)]">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="dc-card mt-10 max-w-[420px] self-end p-5">
        <p className="text-[14px] leading-relaxed">“We moved 40 clients over in an afternoon. The first reminders went out that night.”</p>
        <p className="mt-3 text-[12px] text-muted-foreground">Jonas Weber, Weber &amp; Field</p>
      </div>
    </>
  )
}
