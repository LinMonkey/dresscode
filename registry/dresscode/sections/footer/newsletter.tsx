"use client"

// Footer with a newsletter: a tinted row across the top with an email sign-up, then five columns of
// links across the full width, then the logo, the copyright and a few small links. The address is
// checked when the field loses focus and on submit; the error is tied to the field, and a sent form is
// replaced by a thank-you that is announced and takes focus. Wire onSubmit to your mailing list.
import { ArrowRight, MailCheck } from "lucide-react"
import { type FormEvent, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const COLUMNS = [
  { title: "Product", links: ["Invoices", "Reminders", "Payments", "Recurring billing", "Expenses"] },
  { title: "Use cases", links: ["Freelancers", "Design studios", "Agencies", "Consultants"] },
  { title: "Resources", links: ["Blog", "Invoice templates", "Help center", "API docs"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
]

const SMALL = ["Status", "Accessibility", "Sitemap"]

const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
const link = "rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em]", className)}>
      <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

export default function FooterNewsletter() {
  const id = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")
  const doneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sent) doneRef.current?.focus()
  }, [sent])

  const check = () => {
    const msg = !email.trim() ? "Enter your email to subscribe." : valid(email) ? "" : "Enter an email like name@studio.com."
    setError(msg)
    return !msg
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Add the address to your mailing list here.
    if (check()) setSent(email.trim())
    else document.getElementById(`${id}-email`)?.focus()
  }

  return (
    <footer className="border-t border-border pt-12 pb-10 sm:pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <section
          aria-labelledby={`${id}-title`}
          className="grid gap-6 rounded-[calc(var(--dc-radius-card)*1.25)] bg-[color:color-mix(in_oklab,var(--dc-ink)_4%,var(--background))] p-6 sm:p-8 lg:grid-cols-[1fr_minmax(0,480px)] lg:items-center lg:gap-12 lg:px-10"
        >
          <div>
            <h2 id={`${id}-title`} className="dc-h text-[24px] leading-tight sm:text-[28px]">
              A short email each month on getting paid
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">One tip, one template and what is new in Orbit. Unsubscribe in one click.</p>
          </div>
          <div aria-live="polite">
            {sent ? (
              <div ref={doneRef} tabIndex={-1} className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-3 pr-4 outline-none">
                <span className="dc-icon shrink-0">
                  <MailCheck className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-[14px] leading-snug">
                  <span className="font-semibold">You are on the list.</span>{" "}
                  <span className="text-muted-foreground">
                    Check <span className="wrap-anywhere text-foreground">{sent}</span> to confirm.
                  </span>
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit}>
                <Label htmlFor={`${id}-email`} className="sr-only">
                  Email address
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
                    aria-describedby={error ? `${id}-error` : undefined}
                    className="h-11 bg-card px-3.5 text-[15px] sm:flex-1"
                  />
                  <Button type="submit" size="lg" className="h-11 px-5 text-[15px] font-semibold">
                    Subscribe <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                {error ? (
                  <p id={`${id}-error`} className="mt-2 text-[13px] text-destructive">
                    {error}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </section>

        <nav aria-label="Footer" className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p id={`${id}-${slug(c.title)}`} className="text-[14px] font-semibold">
                {c.title}
              </p>
              <ul aria-labelledby={`${id}-${slug(c.title)}`} className="mt-3 space-y-2.5 text-[14px] text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href={`#${slug(l)}`} className={link}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="#top" aria-label="Orbit home" className={cn(link, "inline-flex text-foreground")}>
              <Logo />
            </a>
            <p>© 2026 Orbit Labs. All rights reserved.</p>
          </div>
          <ul aria-label="More links" className="flex flex-wrap gap-x-5 gap-y-2">
            {SMALL.map((s) => (
              <li key={s}>
                <a href={`#${slug(s)}`} className={link}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
