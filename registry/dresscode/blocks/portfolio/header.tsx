"use client"

// The site's top bar: your name home, the main pages, your local time, light/dark, and on a phone a
// menu that drops down under the bar (Esc or a link closes it).
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

import { PERSON } from "./data"
import { MORE, NAV, to, type PageId } from "./site"
import { LocalTime, ModeToggle, StatusDot } from "./ui"

const isCurrent = (page: PageId, current: PageId) => page === current || (page === "work" && current === "project") || (page === "writing" && current === "post")

export function SiteHeader({ base, current }: { base: string; current: PageId }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="relative z-30 print:hidden">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link href={to(base)} className="dc-h text-[16px] whitespace-nowrap" aria-current={current === "home" ? "page" : undefined}>
          {PERSON.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[14px] md:flex">
          {NAV.map((n) => (
            <Link
              key={n.path}
              href={to(base, n.path)}
              aria-current={isCurrent(n.page, current) ? "page" : undefined}
              className="text-muted-foreground decoration-[1.5px] underline-offset-[7px] transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="-mr-2 flex items-center gap-1">
          <span className="mr-2 hidden items-center gap-2 text-[13px] text-muted-foreground lg:flex">
            {PERSON.city} <LocalTime className="text-foreground" />
          </span>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="size-9 md:hidden" aria-expanded={open} aria-controls="pf-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div id="pf-menu" className="absolute inset-x-0 top-full border-y border-border bg-background shadow-[0_24px_40px_-24px_rgb(0_0_0/0.35)] md:hidden">
          <nav aria-label="Menu" className="mx-auto max-w-[1200px] px-5 pt-4 pb-7 sm:px-8">
            <ul>
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link href={to(base, n.path)} onClick={() => setOpen(false)} aria-current={isCurrent(n.page, current) ? "page" : undefined} className="dc-h block py-2 text-[30px] leading-tight aria-[current=page]:text-[color:var(--dc-accent)]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5 text-[15px] text-muted-foreground">
              {MORE.map((n) => (
                <li key={n.path}>
                  <Link href={to(base, n.path)} onClick={() => setOpen(false)} className="hover:text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-2.5 text-[14px]">
              <StatusDot /> {PERSON.available}
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
