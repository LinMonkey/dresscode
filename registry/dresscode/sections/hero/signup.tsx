"use client"

// Hero, email sign-up: the promise and the form in one place. The address is checked when the field
// loses focus and on submit; the error is tied to the field, and a sent form says what happens next.
// Wire onSubmit to your own sign-up endpoint.
import { ArrowRight, Check, MailCheck } from "lucide-react"
import { type FormEvent, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PEOPLE = ["MO", "JT", "SA", "LK", "DP"]
const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function HeroSignup() {
  const id = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")

  const check = () => {
    const msg = !email.trim() ? "Enter your work email." : valid(email) ? "" : "That doesn't look like an email address."
    setError(msg)
    return !msg
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (check()) setSent(email.trim())
  }

  return (
    <section aria-labelledby={`${id}-title`} className="py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
        <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Invoicing for freelancers and small studios</p>
        <h1 id={`${id}-title`} className="dc-h mt-4 max-w-[820px] text-[40px] leading-[1.05] sm:text-[60px]">
          Spend Friday on the work, not on chasing payments.
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
          Send your first invoice in a minute. Orbit follows up on the late ones for you.
        </p>

        <div className="mt-9 w-full max-w-[480px]">
          {sent ? (
            <div role="status" className="dc-card flex items-start gap-3 p-4 text-left">
              <span className="dc-icon shrink-0">
                <MailCheck className="size-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-0.5 text-[14px] text-muted-foreground">
                  We sent a sign-in link to <span className="font-medium wrap-anywhere text-foreground">{sent}</span>. It works for 30 minutes.
                </p>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="text-left">
              <Label htmlFor={`${id}-email`} className="sr-only">
                Work email
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error && valid(e.target.value)) setError("")
                  }}
                  onBlur={() => email && check()}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : `${id}-hint`}
                  className="h-12 px-4 text-[16px] sm:flex-1"
                />
                <Button type="submit" size="lg" className="h-12 px-6 text-[16px] font-semibold">
                  Start free <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
              {error ? (
                <p id={`${id}-error`} className="mt-2 text-[14px] text-destructive">
                  {error}
                </p>
              ) : (
                <p id={`${id}-hint`} className="mt-2 text-[13px] text-muted-foreground">
                  Free for your first three clients. No card needed.
                </p>
              )}
            </form>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex -space-x-2" aria-hidden="true">
            {PEOPLE.map((p) => (
              <span key={p} className="grid size-8 place-items-center rounded-full bg-muted text-[11px] font-bold ring-2 ring-background">
                {p}
              </span>
            ))}
          </div>
          <p className="text-[14px] text-muted-foreground">
            <span className="font-semibold text-foreground">4,000 freelancers</span> sent an invoice with Orbit last month
          </p>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-2 text-[14px] text-muted-foreground sm:grid-cols-3">
          {["Reminders in your tone", "Cards and bank transfer", "Export for your accountant"].map((t) => (
            <li key={t} className="inline-flex items-center justify-center gap-1.5">
              <Check className="size-4 text-[color:var(--dc-accent)]" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
