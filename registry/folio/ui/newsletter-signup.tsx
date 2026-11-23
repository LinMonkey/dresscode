"use client"

// An email signup for a newsletter or a blog: "inline" is just the field and button, "card" a ruled
// panel with a serif title, "band" a newsprint strip between double rules for the end of a page.
// Pass onSubscribe to send the address somewhere; it can throw to show an error. The layout follows
// the width it's given (container queries), so it fits a sidebar as well as a full-width footer.
import * as React from "react"
import { cn } from "cn"
import { Check } from "lucide-react"

import { Button } from "@/registry/folio/ui/button"
import { Input } from "@/registry/folio/ui/input"
import { Spinner } from "@/registry/folio/ui/spinner"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function NewsletterSignup({
  variant = "card",
  title = "Get the next issue",
  description,
  placeholder = "you@example.com",
  buttonLabel = "Subscribe",
  note,
  successMessage = "Check your inbox to confirm your subscription.",
  onSubscribe,
  className,
}: {
  variant?: "inline" | "card" | "band"
  title?: React.ReactNode
  description?: React.ReactNode
  placeholder?: string
  buttonLabel?: string
  /** A small line under the form: "One email a week. Unsubscribe any time." */
  note?: React.ReactNode
  successMessage?: React.ReactNode
  onSubscribe?: (email: string) => void | Promise<void>
  className?: string
}) {
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = React.useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setError("Enter a valid email address.")
      return
    }
    setError(null)
    setState("sending")
    try {
      await onSubscribe?.(email.trim())
      setState("done")
    } catch (err) {
      setState("idle")
      setError(err instanceof Error && err.message ? err.message : "Something went wrong. Try again in a minute.")
    }
  }

  const form =
    state === "done" ? (
      <p role="status" className="flex items-center gap-[10px] text-[16px] text-ink">
        <span className="flex size-[22px] items-center justify-center rounded-full bg-success-tint text-success">
          <Check className="size-[14px]" aria-hidden />
        </span>
        {successMessage}
      </p>
    ) : (
      <form onSubmit={submit} noValidate>
        <div className="flex flex-col gap-[8px] @sm:flex-row">
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-[40px] bg-paper @sm:flex-1"
          />
          <Button type="submit" disabled={state === "sending"} className="h-[40px] px-[20px]">
            {state === "sending" && <Spinner />}
            {buttonLabel}
          </Button>
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-[6px] text-[14px] text-press">
            {error}
          </p>
        )}
        {note && <p className="mt-[8px] text-[14px] text-ink-2">{note}</p>}
      </form>
    )

  if (variant === "inline")
    return (
      <div data-slot="newsletter-signup" className={cn("not-prose @container w-full max-w-[480px]", className)}>
        {form}
      </div>
    )

  const heading = (
    <>
      <p className="font-serif text-[26px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">{title}</p>
      {description && <p className="mt-[6px] text-[16px] leading-[1.5] text-ink-2">{description}</p>}
    </>
  )

  if (variant === "band") {
    return (
      <section data-slot="newsletter-signup" className={cn("not-prose @container w-full", className)}>
        <div className="folio-double-rule" aria-hidden />
        <div className="grid items-center gap-[20px] bg-newsprint px-[20px] py-[28px] @2xl:grid-cols-[minmax(0,1fr)_min(460px,50%)] @2xl:gap-[40px] @2xl:px-[32px]">
          <div>{heading}</div>
          {form}
        </div>
        <div className="folio-double-rule" aria-hidden />
      </section>
    )
  }

  return (
    <section
      data-slot="newsletter-signup"
      className={cn("not-prose @container w-full max-w-[520px] rounded-(--radius) border border-divider bg-paper p-[24px]", className)}
    >
      {heading}
      <div className="mt-[16px]">{form}</div>
    </section>
  )
}

export { NewsletterSignup }
