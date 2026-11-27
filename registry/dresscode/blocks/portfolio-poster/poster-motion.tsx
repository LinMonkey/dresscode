"use client"

// The Poster style's moving parts: the work list whose cover follows the cursor, and the call to
// action that leans toward the pointer. Both sit still for visitors who ask for less motion, and on
// touch screens the list shows each cover under its title instead.
import Link from "next/link"
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { ProjectCover } from "../portfolio/covers"
import type { Project } from "../portfolio/data"
import { to } from "../portfolio/site"
import { useReducedMotion } from "../portfolio/ui"

export function PosterWorkList({ base, projects }: { base: string; projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0, r: -4 })
  const raf = useRef(0)

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const place = () => {
      const p = pos.current
      if (box.current) box.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.r}deg)`
    }
    const tick = () => {
      const p = pos.current
      const t = target.current
      const dx = t.x - p.x
      p.x += dx * 0.14
      p.y += (t.y - p.y) * 0.14
      p.r += (-4 + Math.max(-6, Math.min(6, dx * 0.04)) - p.r) * 0.16
      place()
      raf.current = Math.abs(dx) + Math.abs(t.y - p.y) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (reduced) {
        pos.current = { x: e.clientX, y: e.clientY, r: -4 }
        place()
      } else if (!raf.current) raf.current = requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf.current)
      raf.current = 0
      window.removeEventListener("pointermove", onMove)
    }
  }, [reduced])

  const enter = (slug: string, e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return
    if (!hovering) {
      target.current = { x: e.clientX, y: e.clientY }
      pos.current = { x: e.clientX, y: e.clientY, r: -4 }
      if (box.current) box.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) rotate(-4deg)`
    }
    setHovering(true)
    setActive(slug)
  }

  return (
    <>
      <ol className="border-t border-border" onPointerLeave={() => setHovering(false)}>
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-border">
            <Link
              href={to(base, "work", p.slug)}
              onPointerEnter={(e) => enter(p.slug, e)}
              onFocus={() => setActive(p.slug)}
              className="group grid grid-cols-1 items-end gap-x-6 gap-y-3 py-4 outline-none sm:grid-cols-[1fr_auto] sm:py-5"
            >
              <span
                className={cn(
                  "dc-h block text-[clamp(2.6rem,7.4vw,7rem)] leading-[0.86] uppercase transition-[translate,color] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-3 group-hover:text-[color:var(--dc-accent)] group-focus-visible:translate-x-3 group-focus-visible:text-[color:var(--dc-accent)]",
                )}
              >
                {p.title}
              </span>
              <span className="pb-1 text-[15px] text-muted-foreground sm:text-right">
                <span className="dc-num">{p.year}</span> · {p.role}
              </span>
              <span className="block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)] [@media(hover:hover)_and_(pointer:fine)]:hidden">
                <ProjectCover project={p} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={box} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)_and_(pointer:fine)]:block">
        <div
          className={cn(
            "relative -mt-[150px] -ml-[200px] aspect-[16/10] w-[400px] overflow-hidden rounded-[var(--dc-radius-card)] shadow-[0_28px_70px_-24px_rgb(0_0_0/0.5)] transition-[opacity,scale] duration-300 ease-out",
            hovering ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
        >
          {projects.map((p) => (
            <div key={p.slug} className={cn("absolute inset-0 transition-opacity duration-300", active === p.slug ? "opacity-100" : "opacity-0")}>
              <ProjectCover project={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/** A link that leans a little toward the pointer while it is near, then settles back. */
export function Magnetic({ children, className, strength = 0.22 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  return (
    <span
      ref={ref}
      className={cn("inline-block transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]", className)}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) * strength
        const y = (e.clientY - (r.top + r.height / 2)) * strength
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = ""
      }}
    >
      {children}
    </span>
  )
}
