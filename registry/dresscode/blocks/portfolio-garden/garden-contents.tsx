"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Heading = { id: string; label: string }

export function GardenContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id)
  const jump = useRef<{ id: string; reached: boolean } | null>(null)

  useEffect(() => {
    const targets = headings.flatMap(({ id }) => {
      const element = document.getElementById(id)
      return element ? [element] : []
    })
    if (targets.length === 0) return

    let frame: number | undefined
    function update() {
      frame = undefined
      const scrollY = window.scrollY
      const scrollEnd = document.documentElement.scrollHeight - window.innerHeight
      const selected = jump.current
      if (selected) {
        const anchor = targets.find((target) => target.id === selected.id)
        if (anchor) {
          const margin = Number.parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0
          const destination = Math.min(scrollEnd, Math.max(0, scrollY + anchor.getBoundingClientRect().top - margin))
          // Multiple nearby headings can land at the same scroll position at the end of a page.
          if (Math.abs(scrollY - destination) < 2) {
            selected.reached = true
            setActiveId(selected.id)
            return
          }
        }
        if (selected.reached) jump.current = null
      }

      const readingLine = Math.min(180, window.innerHeight * 0.28)
      const atEnd = scrollY > 0 && scrollY >= scrollEnd - 2
      const current = atEnd ? targets.at(-1) : targets.findLast((target) => target.getBoundingClientRect().top <= readingLine)
      setActiveId((current ?? targets[0]).id)
    }

    function scheduleUpdate() {
      frame ??= window.requestAnimationFrame(update)
    }

    function onHashChange() {
      const target = targets.find(({ id }) => window.location.hash === `#${encodeURIComponent(id)}`)
      jump.current = target ? { id: target.id, reached: false } : null
      scheduleUpdate()
    }

    onHashChange()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", onHashChange)
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="Contents"
      className="mb-6 min-w-0 border-y border-border py-3 text-sm lg:sticky lg:top-8 lg:col-start-1 lg:row-start-2 lg:mb-0 lg:self-start lg:border-0 lg:py-1 lg:text-[clamp(.95rem,1.55vw,1.25rem)]"
    >
      <p className="font-[family-name:var(--dc-font-heading)] text-base font-semibold italic lg:text-[1.08em]">Contents</p>
      <ol className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 lg:mt-4 lg:grid lg:gap-2.5">
        {headings.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === activeId ? "location" : undefined}
              onClick={() => {
                jump.current = { id, reached: false }
                setActiveId(id)
              }}
              className={cn(
                "leading-snug underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-3",
                id === activeId ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
