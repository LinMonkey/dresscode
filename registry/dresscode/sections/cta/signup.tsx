"use client"

// Call to action, split with an email sign-up: the promise on the left, the form on the right, on a
// faintly tinted strip. The address is checked when the field loses focus and on submit; the error is
// tied to the field. A sent form says what happens next and takes focus, so a screen reader hears it.
// Wire onSubmit to your own sign-up endpoint.
import { ArrowRight, MailCheck } from "lucide-react"
import { type FormEvent, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function CtaSignup() {
  const id = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")
  const doneRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const returning = useRef(false)

  useEffect(() => {
    if (sent) doneRef.current?.focus()
    else if (returning.current) inputRef.current?.focus()
  }, [sent])

  const check = () => {
    const msg = !email.trim() ? "Enter your work email." : valid(email) ? "" : "Enter an email like name@studio.com."
    setError(msg)
    return !msg
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Send the address to your sign-up endpoint here.
    if (check()) setSent(email.trim())
    else inputRef.current?.focus()
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="border-y border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_3%,var(--background))] py-16 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,500px)] lg:gap-16">
        <div className="max-w-[560px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Free for your first three clients</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Send your first invoice this afternoon.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Enter your work email and we will send you a link to sign in. No password to make up, no card to type in.
          </p>
        </div>

        <div className="w-full">
          {sent ? (
            <div ref={doneRef} tabIndex={-1} role="status" className="dc-card flex items-start gap-4 p-5 outline-none sm:p-6">
              <span className="dc-icon size-10 shrink-0">
                <MailCheck className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="dc-h text-[19px]">Thanks, check your inbox</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                  We sent a sign-in link to <span className="font-medium wrap-anywhere text-foreground">{sent}</span>. It works for 30 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    returning.current = true
                    setSent("")
                  }}
                  className="mt-3 rounded-sm text-[14px] font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <Label htmlFor={`${id}-email`} className="text-[15px] font-semibold">
                Work email
              </Label>
              <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                <Input
                  ref={inputRef}
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
                  className="h-12 bg-card px-4 text-[16px] sm:flex-1"
                />
                <Button type="submit" size="lg" className="h-12 px-6 text-[16px] font-semibold">
                  Get started <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
              {error ? (
                <p id={`${id}-error`} className="mt-2 text-[14px] text-destructive">
                  {error}
                </p>
              ) : (
                <p id={`${id}-hint`} className="mt-2 text-[14px] text-muted-foreground">
                  We only email you about your account. No newsletters unless you ask.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
