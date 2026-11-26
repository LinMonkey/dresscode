"use client"

// The small interactive pieces every page shares: the local clock, the status dot, copy-email, the
// light/dark switch, the print button and the newsletter form.
import { Check, Copy, Moon, Printer, Sun } from "lucide-react"
import { useState, useSyncExternalStore, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { PERSON } from "./data"

const subscribeClock = (on: () => void) => {
  const id = window.setInterval(on, 15_000)
  return () => window.clearInterval(id)
}
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: PERSON.timeZone })

/** Your local time ("14:32"), ticking. Empty on the server, so the first paint matches. */
export function LocalTime({ className }: { className?: string }) {
  const now = useSyncExternalStore(
    subscribeClock,
    () => timeFmt.format(Math.floor(Date.now() / 60_000) * 60_000),
    () => "",
  )
  // Until the clock is known, an invisible 00:00 holds its width, so nothing moves when it appears.
  return <span className={cn("dc-num tabular-nums", !now && "invisible", className)}>{now || "00:00"}</span>
}

export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-2 shrink-0", className)} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[color:var(--dc-accent)] opacity-40 motion-safe:animate-ping" />
      <span className="relative size-2 rounded-full bg-[color:var(--dc-accent)]" />
    </span>
  )
}

export function CopyEmail({ className, variant = "outline" }: { className?: string; variant?: "outline" | "ghost" | "secondary" }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant={variant}
      size="lg"
      className={cn("h-10 px-3.5", className)}
      onClick={() => {
        void navigator.clipboard?.writeText(PERSON.email)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }}
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </Button>
  )
}

// Light or dark lives on <html class="dark">, like shadcn/ui and next-themes. The switch flips it and
// remembers the choice under the same key next-themes uses ("theme").
const subscribeMode = (on: () => void) => {
  const observer = new MutationObserver(on)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}
const isDark = () => document.documentElement.classList.contains("dark")

export function useDarkMode() {
  return useSyncExternalStore(subscribeMode, isDark, () => false)
}

export function setDarkMode(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
  } catch {}
}

export function ModeToggle({ className }: { className?: string }) {
  const dark = useDarkMode()
  return (
    <Button variant="ghost" size="icon" className={cn("size-9", className)} aria-label="Dark mode" aria-pressed={dark} onClick={() => setDarkMode(!dark)}>
      {/* Both icons render and CSS shows one, so the first paint is right before React knows the mode. */}
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
    </Button>
  )
}

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button size="lg" className={cn("h-10 px-4", className)} onClick={() => window.print()}>
      <Printer className="size-4" aria-hidden="true" /> Save as PDF
    </Button>
  )
}

/** Email sign-up. Wire `onSubmit` to your newsletter service (Buttondown, Kit, Resend) where marked. */
export function NewsletterForm({
  className,
  placeholder = "you@example.com",
  confirmation = "Thanks. Check your inbox to confirm.",
}: { className?: string; placeholder?: string; confirmation?: string }) {
  const [state, setState] = useState<"idle" | "done">("idle")
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Send new FormData(e.currentTarget).get("email") to your newsletter service here.
    setState("done")
  }
  return state === "done" ? (
    <p role="status" className={cn("flex items-center gap-2 text-[15px]", className)}>
      <Check className="size-4" aria-hidden="true" /> {confirmation}
    </p>
  ) : (
    <form onSubmit={submit} className={cn("flex max-w-[420px] gap-2", className)}>
      <label htmlFor="pf-newsletter" className="sr-only">
        Email address
      </label>
      <Input id="pf-newsletter" name="email" type="email" required autoComplete="email" placeholder={placeholder} className="h-10 flex-1" />
      <Button type="submit" size="lg" className="h-10 px-4">
        Subscribe
      </Button>
    </form>
  )
}

const motionQuery = "(prefers-reduced-motion: reduce)"
export function useReducedMotion() {
  return useSyncExternalStore(
    (on) => {
      const m = window.matchMedia(motionQuery)
      m.addEventListener("change", on)
      return () => m.removeEventListener("change", on)
    },
    () => window.matchMedia(motionQuery).matches,
    () => true,
  )
}

export function CopyCode({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-7 gap-1.5 px-2 text-[12px] text-muted-foreground", className)}
      onClick={() => {
        void navigator.clipboard?.writeText(code)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}
