"use client"

// The store's small forms: newsletter, contact, track an order, sign in and the gift card. Each one
// checks what it needs and says what happened; the places to call your own service are marked HOOK.
import { Check, Gift, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { BRAND, CUSTOMER, GIFT_CARD, ORDERS } from "./data"
import { formatDate, money, to } from "./site"
import { cart } from "./store"
import { FIELD, LABEL, OUTLINE, PRIMARY } from "./styles"

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

export function Field({ label, id, error, hint, children, className }: { label: string; id: string; error?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-[color:var(--dc-danger)]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function NewsletterForm({ cta, onBand }: { cta: string; onBand?: boolean }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "error" | "done">("idle")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!emailOk(email)) return setState("error")
    // HOOK: add the address to your email list here.
    setState("done")
  }
  if (state === "done")
    return (
      <p className="flex items-center gap-2 text-[15px] font-medium" role="status">
        <Check className="size-5" aria-hidden="true" /> You&apos;re on the list. Your code is on its way to {email}.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate className="flex gap-2">
      <label htmlFor="ec-news-email" className="sr-only">
        Email address
      </label>
      <input
        id="ec-news-email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setState("idle")
        }}
        placeholder="Email address"
        autoComplete="email"
        aria-invalid={state === "error"}
        className={cn(FIELD, "min-w-0 flex-1", onBand && "border-transparent bg-[color:var(--dc-surface)] text-[color:var(--dc-ink)] placeholder:text-[color:var(--dc-muted)]")}
      />
      <button type="submit" className={cn(PRIMARY, "h-11 px-5 text-[15px]")}>
        {cta}
      </button>
      {state === "error" ? (
        <span className="sr-only" role="alert">
          Enter an email address like name@example.com.
        </span>
      ) : null}
    </form>
  )
}

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (!String(f.get("name")).trim()) next.name = "Tell us your name."
    if (!emailOk(String(f.get("email")))) next.email = "Enter an email address like name@example.com."
    if (String(f.get("message")).trim().length < 10) next.message = "A sentence or two helps us help you."
    setErrors(next)
    // HOOK: send the message to your inbox or help desk here.
    if (!Object.keys(next).length) setSent(true)
  }
  if (sent)
    return (
      <div className="dc-card p-8" role="status">
        <p className="dc-h text-[24px]">Thanks, we&apos;ve got it.</p>
        <p className="mt-2 text-[15px] text-muted-foreground">We answer within one business day, usually sooner. A copy is in your inbox.</p>
      </div>
    )
  return (
    <form onSubmit={submit} noValidate className="dc-card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <Field label="Name" id="ec-c-name" error={errors.name}>
        <input id="ec-c-name" name="name" autoComplete="name" aria-invalid={!!errors.name} className={FIELD} />
      </Field>
      <Field label="Email" id="ec-c-email" error={errors.email}>
        <input id="ec-c-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={FIELD} />
      </Field>
      <Field label="Order number (optional)" id="ec-c-order" className="sm:col-span-2">
        <input id="ec-c-order" name="order" inputMode="numeric" placeholder="1041" className={FIELD} />
      </Field>
      <Field label="How can we help?" id="ec-c-message" error={errors.message} className="sm:col-span-2">
        <textarea id="ec-c-message" name="message" rows={5} aria-invalid={!!errors.message} className={cn(FIELD, "h-auto py-2.5")} />
      </Field>
      <div className="sm:col-span-2">
        <button type="submit" className={cn(PRIMARY, "h-11 px-6 text-[15px]")}>
          Send message
        </button>
      </div>
    </form>
  )
}

export function TrackForm({ base }: { base: string }) {
  const [number, setNumber] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [found, setFound] = useState<(typeof ORDERS)[number] | null>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // HOOK: look the order up on your server. The sample finds the orders in data.ts.
    const o = ORDERS.find((x) => String(x.number) === number.replace(/\D/g, "") && x.email.toLowerCase() === email.trim().toLowerCase())
    setFound(o ?? null)
    setError(o ? "" : "We couldn't find that order. Check the number in your confirmation email, and use the email you ordered with.")
  }
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-start">
      <form onSubmit={submit} noValidate className="dc-card grid gap-4 p-6">
        <Field label="Order number" id="ec-t-number" hint="It's in your confirmation email, like 1041.">
          <input id="ec-t-number" value={number} onChange={(e) => setNumber(e.target.value)} inputMode="numeric" placeholder="1041" className={FIELD} />
        </Field>
        <Field label="Email" id="ec-t-email">
          <input id="ec-t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder={CUSTOMER.email} className={FIELD} />
        </Field>
        {error ? (
          <p className="text-[14px] text-[color:var(--dc-danger)]" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={cn(PRIMARY, "h-11 text-[15px]")}>
          Track order
        </button>
        <p className="text-[13px] text-muted-foreground">
          Try order 1041 with {CUSTOMER.email}.
        </p>
      </form>
      {found ? (
        <div className="dc-card p-6" role="status">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="dc-h text-[22px]">Order #{found.number}</p>
            <span className="dc-pill dc-pill-hl h-7 px-3 text-[13px]">{found.status}</span>
          </div>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Placed {formatDate(found.date)} · {found.delivery}
          </p>
          <StatusSteps status={found.status} className="mt-6" />
          {found.tracking ? <p className="mt-6 text-[14px]">Tracking number: <span className="dc-num">{found.tracking}</span></p> : null}
          <Link href={to(base, "account", "orders", String(found.number))} className={cn(OUTLINE, "mt-5 h-10 px-4 text-[14px]")}>
            See the order
          </Link>
        </div>
      ) : (
        <div className="hidden items-center gap-4 rounded-[var(--dc-radius-card)] border border-dashed border-border p-8 text-muted-foreground lg:flex">
          <Package className="size-8 shrink-0" aria-hidden="true" />
          <p className="text-[15px]">Every order gets a tracking link by email when it ships. Orders placed before 1 PM Pacific ship the same day.</p>
        </div>
      )}
    </div>
  )
}

export function StatusSteps({ status, className }: { status: "Confirmed" | "Shipped" | "Delivered"; className?: string }) {
  const steps = ["Confirmed", "Shipped", "Out for delivery", "Delivered"]
  const at = status === "Confirmed" ? 0 : status === "Shipped" ? 1 : 3
  return (
    <ol className={cn("grid grid-cols-4 gap-2", className)}>
      {steps.map((s, i) => (
        <li key={s} className="text-[13px]">
          <span className={cn("block h-1.5 rounded-full", i <= at ? "bg-primary" : "bg-muted")} />
          <span className={cn("mt-2 block", i <= at ? "font-medium" : "text-muted-foreground")}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

export function SignInForm({ base }: { base: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<"in" | "up">("in")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (mode === "up" && !String(f.get("name")).trim()) next.name = "Tell us your name."
    if (!emailOk(String(f.get("email")))) next.email = "Enter an email address like name@example.com."
    if (String(f.get("password")).length < 8) next.password = "Use at least 8 characters."
    setErrors(next)
    if (Object.keys(next).length) return
    // HOOK: sign in or create the account with your auth provider here.
    setBusy(true)
    setTimeout(() => router.push(to(base, "account")), 500)
  }
  return (
    <div className="dc-card mx-auto w-full max-w-[440px] p-6 sm:p-8">
      <div className="grid grid-cols-2 rounded-[var(--radius)] bg-muted p-1 text-[14px] font-medium" role="tablist">
        {(
          [
            ["in", "Sign in"],
            ["up", "Create account"],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className="h-9 cursor-pointer rounded-[calc(var(--radius)-2px)] aria-selected:bg-card aria-selected:shadow-sm">
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
        {mode === "up" ? (
          <Field label="Name" id="ec-s-name" error={errors.name}>
            <input id="ec-s-name" name="name" autoComplete="name" aria-invalid={!!errors.name} className={FIELD} />
          </Field>
        ) : null}
        <Field label="Email" id="ec-s-email" error={errors.email}>
          <input id="ec-s-email" name="email" type="email" autoComplete="email" defaultValue={CUSTOMER.email} aria-invalid={!!errors.email} className={FIELD} />
        </Field>
        <Field label="Password" id="ec-s-password" error={errors.password} hint={mode === "up" ? "At least 8 characters." : undefined}>
          <input id="ec-s-password" name="password" type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} aria-invalid={!!errors.password} className={FIELD} />
        </Field>
        {mode === "in" ? (
          <a href={`mailto:${BRAND.email}?subject=Password%20reset`} className="-mt-1 justify-self-end text-[14px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Forgot your password?
          </a>
        ) : null}
        <button type="submit" disabled={busy} className={cn(PRIMARY, "h-11 text-[15px]")}>
          {busy ? "One moment…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-[13px] text-muted-foreground">Accounts keep your orders, addresses and saved things in one place.</p>
    </div>
  )
}

/** The gift card: pick an amount, say who it's for and when, add to cart. */
export function GiftCardForm() {
  const [amount, setAmount] = useState(GIFT_CARD.amounts[1])
  const [to_, setTo] = useState("")
  const [from, setFrom] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!emailOk(to_)) return setError("Enter the recipient's email address.")
    setError("")
    cart.add({ slug: "gift-card", size: String(amount), to: to_.trim(), from: from.trim(), message: message.trim() })
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <fieldset>
        <legend className={LABEL}>Amount</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {GIFT_CARD.amounts.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={amount === a}
              onClick={() => setAmount(a)}
              className="dc-num h-11 min-w-20 cursor-pointer rounded-[var(--radius)] border border-[color:var(--input)] px-4 text-[15px] font-medium hover:border-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              {money(a)}
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Recipient's email" id="ec-g-to" error={error}>
        <input id="ec-g-to" type="email" value={to_} onChange={(e) => setTo(e.target.value)} placeholder="alex@example.com" aria-invalid={!!error} className={FIELD} />
      </Field>
      <Field label="From" id="ec-g-from">
        <input id="ec-g-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your name" autoComplete="name" className={FIELD} />
      </Field>
      <Field label="Message (optional)" id="ec-g-msg" hint={`${240 - message.length} characters left`}>
        <textarea id="ec-g-msg" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 240))} rows={3} placeholder="For the new kitchen. Love, Sam" className={cn(FIELD, "h-auto py-2.5")} />
      </Field>
      <button type="submit" className={cn(PRIMARY, "h-12 text-[16px]")}>
        <Gift className="size-4" aria-hidden="true" /> Add to cart — {money(amount)}
      </button>
    </form>
  )
}
