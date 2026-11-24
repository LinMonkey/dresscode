"use client"

// Footer with a large wordmark: a line and a call to action beside three columns of links, a bar with the
// copyright and the legal links, then the Orbit mark and name set very large, running off the bottom edge. The
// wordmark is sized to the exact width of the content above it (measured once the theme's font has
// loaded, and again when the width changes), so its edges line up with the columns in every theme. It is
// decoration, hidden from screen readers; the copyright names the company.
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

const COLUMNS = [
  { title: "Product", links: ["Invoices", "Reminders", "Payments", "Pricing"] },
  { title: "Resources", links: ["Blog", "Invoice templates", "Help center", "API docs"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
]

const LEGAL = ["Terms", "Privacy", "Cookies"]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
const link = "rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

function Wordmark() {
  const box = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const b = box.current
    const m = mark.current
    if (!b || !m) return
    const fit = () => {
      m.style.fontSize = "100px"
      const natural = m.getBoundingClientRect().width
      if (natural) m.style.fontSize = `${(b.clientWidth / natural) * 99.5}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} aria-hidden="true" className="@container mt-10 flex select-none sm:mt-14">
      <span
        ref={mark}
        className="dc-h -mb-[0.14em] inline-flex items-end gap-[0.06em] text-[24cqw] leading-[0.74] whitespace-nowrap text-[color:color-mix(in_oklab,var(--foreground)_12%,var(--background))]"
      >
        <svg viewBox="0 0 22 22" className="h-[0.74em] w-[0.74em] shrink-0">
          <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
        </svg>
        Orbit
      </span>
    </div>
  )
}

export default function FooterWordmark() {
  return (
    <footer className="overflow-hidden border-t border-border pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="max-w-[400px]">
            <p className="dc-h text-[26px] leading-[1.15] sm:text-[30px]">Get paid on time, without the awkward emails.</p>
            <Button size="lg" className="mt-6 h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#start" />}>
              Start free <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p id={`footer-wordmark-${slug(c.title)}`} className="text-[14px] font-semibold">
                  {c.title}
                </p>
                <ul aria-labelledby={`footer-wordmark-${slug(c.title)}`} className="mt-3 space-y-2.5 text-[14px] text-muted-foreground">
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
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Orbit Labs. All rights reserved.</p>
          <ul aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l}>
                <a href={`#${slug(l)}`} className={link}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Wordmark />
      </div>
    </footer>
  )
}
