"use client"

// 500: something broke on our side. It says so plainly and that nothing was lost, offers a retry that
// shows a spinner while it tries, links to the status page, and gives an error reference to copy for
// support. In this demo the first retry fails and the second works; wire retry() to router.refresh()
// or your own reload.
import { ArrowRight, Check, Copy, ExternalLink, LoaderCircle, RotateCw } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const REF = "ERR-7F3K-92QD"
const DETAILS = [
  { label: "When", value: "Nov 24, 2026, 14:02 UTC" },
  { label: "Page", value: "/invoices/INV-1042" },
  { label: "Status", value: "500 Internal server error" },
]
const SERVICES = [
  { name: "Dashboard", state: "Degraded" },
  { name: "Payments", state: "Working" },
  { name: "Reminders", state: "Working" },
] as const

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

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

export default function StatesError() {
  const id = useId()
  const [phase, setPhase] = useState<"idle" | "trying" | "failed" | "ok">("idle")
  const [tries, setTries] = useState(0)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(
    () => () => {
      clearTimeout(timer.current)
      clearTimeout(copyTimer.current)
    },
    [],
  )

  const retry = () => {
    setPhase("trying")
    // Replace the timeout with router.refresh() or a refetch of what failed.
    timer.current = setTimeout(() => {
      setTries((n) => n + 1)
      setPhase(tries === 0 ? "failed" : "ok")
    }, 1400)
  }
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(REF)
    } catch {
      // The reference is on screen to copy by hand if the clipboard is blocked.
    }
    setCopied(true)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[660px] flex-col bg-background">
      <header className="mx-auto flex h-16 w-full max-w-[1100px] items-center px-5 sm:px-8">
        <a href="#home" className={cn("rounded-[2px]", focus)} aria-label="Orbit home">
          <Logo />
        </a>
      </header>

      <div className="mx-auto grid w-full max-w-[1100px] flex-1 items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="max-w-[540px]">
          <span className="dc-pill dc-pill-danger">Error 500</span>
          <h1 id={`${id}-title`} className="dc-h mt-5 text-[36px] leading-[1.08] sm:text-[48px]">
            Something went wrong on our side
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            It&rsquo;s not you. This page didn&rsquo;t load, but your invoices and payments are safe and nothing was lost. We&rsquo;ve been told and are on it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {phase === "ok" ? (
              <Button className="h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#invoices" />}>
                Back to your invoices <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button className="h-11 px-5 text-[15px] font-semibold" disabled={phase === "trying"} onClick={retry}>
                {phase === "trying" ? (
                  <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                ) : (
                  <RotateCw className="size-4" aria-hidden="true" />
                )}
                {phase === "trying" ? "Trying again…" : "Try again"}
              </Button>
            )}
            <Button variant="outline" className="h-11 px-5 text-[15px]" nativeButton={false} render={<a href="#status" />}>
              Status page <ExternalLink className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <p role="status" className="mt-4 min-h-6 text-[14px] text-muted-foreground">
            {phase === "failed" ? (
              <>Still not loading. Give it a minute, or check the status page for updates.</>
            ) : phase === "ok" ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Check className="size-4 text-[color:var(--dc-accent)]" aria-hidden="true" /> It&rsquo;s working again.
              </span>
            ) : phase === "trying" ? (
              `Trying again${tries ? ` (attempt ${tries + 1})` : ""}…`
            ) : null}
          </p>
        </div>

        <div className="dc-card w-full max-w-[520px] lg:justify-self-end">
          <div className="p-5 sm:p-6">
            <h2 className="text-[15px] font-semibold">Writing to support?</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">Include this reference and we can see exactly what happened.</p>
            <div className="mt-4 flex items-center gap-2 rounded-[calc(var(--radius)+2px)] border border-border bg-muted py-1.5 pr-1.5 pl-3.5">
              <code className="dc-num min-w-0 flex-1 truncate text-[15px] font-semibold tracking-wide" aria-label="Error reference">
                {REF}
              </code>
              <Button variant="outline" size="sm" className="h-8 bg-[color:var(--card)] px-3" onClick={copy}>
                {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Error reference copied" : ""}
              </span>
            </div>
            <dl className="mt-4 grid gap-2 text-[13px]">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{d.label}</dt>
                  <dd className="dc-num min-w-0 truncate text-right">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border-t border-border p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold">Right now</h2>
              <a href="#status" className={cn("rounded-[2px] text-[13px] font-medium text-[color:var(--dc-accent)] hover:underline", focus)}>
                Full status
              </a>
            </div>
            <ul className="mt-3 grid gap-2.5 text-[14px]">
              {SERVICES.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3">
                  <span>{s.name}</span>
                  <span className={cn("dc-pill", s.state === "Working" ? "dc-pill-muted" : "dc-pill-danger")}>{s.state}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
