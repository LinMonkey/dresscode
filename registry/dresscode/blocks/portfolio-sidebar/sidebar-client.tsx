"use client"

// The Sidebar style's moving parts: the section list that lights up the section you are reading (with
// a bar for how far through it you are), and the soft light that follows the pointer over a card.
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export type SpyItem = { id: string; label: string; count?: number }

/** The home page's section list. The current section is bright, with a dot and a reading bar. */
export function SectionSpy({ items }: { items: SpyItem[] }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      // The current section is the last one whose top has passed a third of the way down the screen.
      const line = window.innerHeight / 3
      let current: string | undefined = items[0]?.id
      for (const it of items) {
        const el = document.getElementById(it.id)
        if (el && el.getBoundingClientRect().top <= line) current = it.id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items.at(-1)?.id
      setActive(current)
      const el = current ? document.getElementById(current) : null
      if (el && bar.current) {
        const r = el.getBoundingClientRect()
        const done = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)))
        bar.current.style.transform = `scaleX(${done})`
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [items])

  return (
    <ol className="grid gap-1">
      {items.map((it) => {
        const on = it.id === active
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={on ? "location" : undefined}
              className={cn(
                "group relative flex w-fit items-baseline gap-3 py-2 pl-5 text-[17px] transition-colors",
                on ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-[color:var(--dc-accent)] transition-[opacity,scale] duration-300",
                  on ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                aria-hidden="true"
              />
              {it.label}
              {it.count !== undefined ? <span className="dc-num text-[13px] font-normal text-muted-foreground">{it.count}</span> : null}
              {on ? (
                <span className="absolute right-0 -bottom-1 left-5 h-[3px] overflow-hidden rounded-full bg-border" aria-hidden="true">
                  <span ref={bar} className="block h-full origin-left scale-x-0 rounded-full bg-[color:var(--dc-accent)] transition-transform duration-150" />
                </span>
              ) : null}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

/** A list whose cards catch a soft light under the pointer. Mark each card with data-spot. */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]")
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty("--mx", `${e.clientX - r.left}px`)
        card.style.setProperty("--my", `${e.clientY - r.top}px`)
      }}
    >
      {children}
    </div>
  )
}

/** The page list on inner pages, with the current page marked. */
export function PageList({ items, current }: { items: { href: string; label: string; current: boolean }[]; current?: string }) {
  return (
    <ol className="grid gap-1" data-current={current}>
      {items.map((it) => (
        <li key={it.href}>
          <Link
            href={it.href}
            aria-current={it.current ? "page" : undefined}
            className={cn("relative flex w-fit items-baseline py-2 pl-5 text-[17px] transition-colors", it.current ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <span className={cn("absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-[color:var(--dc-accent)]", it.current ? "opacity-100" : "opacity-0")} aria-hidden="true" />
            {it.label}
          </Link>
        </li>
      ))}
    </ol>
  )
}
