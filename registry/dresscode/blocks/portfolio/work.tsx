"use client"

// The work, three ways. WorkIndex: big titles in a list, the cover following the cursor over the row you
// point at (inline covers on touch screens). CoverGrid: the covers in a grid, opening into a viewer with
// arrow keys and Esc. WorkBrowser: the Work page, with the tag filter and a list/grid switch.
// Filtering reflows with a view transition where the browser has them.
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutGrid, List, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { flushSync } from "react-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ProjectCover } from "./covers"
import { PROJECTS, TAGS, type Project, type Tag, type Variant } from "./data"
import { to } from "./site"
import { useReducedMotion } from "./ui"

type Filter = Tag | "All"

const noop = () => () => {}

/** Runs a state change inside a view transition (when the browser has them and motion is welcome). */
function useTransition() {
  const reduced = useReducedMotion()
  return useCallback(
    (fn: () => void) => {
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
      if (doc.startViewTransition && !reduced) doc.startViewTransition(() => flushSync(fn))
      else fn()
    },
    [reduced],
  )
}

const shownFor = (filter: Filter) => PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter))

export function FilterChips({ value, onChange, className }: { value: Filter; onChange: (f: Filter) => void; className?: string }) {
  return (
    <div role="group" aria-label="Filter work" className={cn("flex flex-wrap gap-1.5", className)}>
      {(["All", ...TAGS] as Filter[]).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === t}
          onClick={() => onChange(t)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 text-[14px] transition-colors hover:bg-muted aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
        >
          {t} <span className="dc-num text-[12px] opacity-60">{shownFor(t).length}</span>
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------- */

/** The list of work as big titles. With a fine pointer the cover follows the cursor, eased, and leans with its speed. */
export function WorkIndex({ base, projects = PROJECTS }: { base: string; projects?: Project[] }) {
  const [active, setActive] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0, r: 0 })
  const raf = useRef(0)
  const order = projects.map((p) => p.slug)

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
      p.x += dx * 0.16
      p.y += (t.y - p.y) * 0.16
      p.r += (Math.max(-7, Math.min(7, dx * 0.05)) - p.r) * 0.18
      place()
      raf.current = Math.abs(dx) + Math.abs(t.y - p.y) + Math.abs(p.r) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (reduced) {
        pos.current = { x: e.clientX, y: e.clientY, r: 0 }
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
      // Start where the pointer is, not where the cover last left off.
      target.current = { x: e.clientX, y: e.clientY }
      pos.current = { x: e.clientX, y: e.clientY, r: 0 }
      if (box.current) box.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }
    setHovering(true)
    setActive(slug)
  }
  const activeAt = active ? order.indexOf(active) : -1

  return (
    <>
      <ol className="group/list border-t border-border" onPointerLeave={() => setHovering(false)}>
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-border" style={{ viewTransitionName: `pf-row-${p.slug}` }}>
            <Link
              href={to(base, "work", p.slug)}
              onPointerEnter={(e) => enter(p.slug, e)}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-4 py-6 transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100 sm:grid-cols-[48px_1fr_auto] md:grid-cols-[56px_minmax(0,1fr)_200px_170px_48px] md:py-7"
            >
              <span className="dc-num hidden text-[13px] text-muted-foreground sm:block">{String(PROJECTS.indexOf(p) + 1).padStart(2, "0")}</span>
              <span className="dc-h text-[30px] leading-none transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-[40px]">{p.title}</span>
              <span className="hidden text-[14px] text-muted-foreground md:block">{p.role}</span>
              <span className="hidden text-[14px] text-muted-foreground md:block">{p.client}</span>
              <span className="dc-num text-right text-[13px] text-muted-foreground">{p.year}</span>
              <span className="col-span-full block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)] md:hidden [@media(hover:none)]:block">
                <ProjectCover project={p} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={box} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)_and_(pointer:fine)]:md:block">
        <div
          className={cn(
            "relative -mt-[130px] ml-8 aspect-[4/3] w-[360px] overflow-hidden rounded-[var(--dc-radius-card)] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] transition-[opacity,scale] duration-300 ease-out",
            hovering ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
        >
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className="absolute inset-0 transition-[clip-path] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              // The cover you point at wipes in from below; the ones above it have wiped out the top.
              style={{ clipPath: activeAt === i ? "inset(0 0 0 0)" : activeAt >= 0 && i < activeAt ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)", zIndex: activeAt === i ? 2 : 1 }}
            >
              <ProjectCover project={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------------------------- */

/** One cover card: a link to the project, or a button that opens the viewer. */
function CoverCard({ p, base, onOpen, hidden, ratio }: { p: Project; base: string; onOpen?: () => void; hidden?: boolean; ratio: string }) {
  const body = (
    <>
      <span className="relative block overflow-hidden rounded-[var(--dc-radius-card)]" style={{ aspectRatio: ratio, viewTransitionName: hidden ? undefined : `pf-cover-${p.slug}` }}>
        <span className="block size-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]">
          <ProjectCover project={p} />
        </span>
        <span className="absolute right-3 bottom-3 grid size-10 translate-y-2 place-items-center rounded-full bg-background text-foreground opacity-0 shadow-md transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </span>
      <span className="mt-3.5 flex items-baseline justify-between gap-4">
        <span className="flex min-w-0 items-baseline gap-3">
          <span className="dc-num text-[12px] text-muted-foreground">{String(PROJECTS.indexOf(p) + 1).padStart(2, "0")}</span>
          <span className="truncate text-[16px] font-medium">{p.title}</span>
        </span>
        <span className="shrink-0 text-[13px] text-muted-foreground">
          {p.tags[0]} · {p.year}
        </span>
      </span>
    </>
  )
  const cls = "group block w-full cursor-pointer text-left outline-none"
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cls} aria-label={`Open ${p.title}`}>
      {body}
    </button>
  ) : (
    <Link href={to(base, "work", p.slug)} className={cls}>
      {body}
    </Link>
  )
}

/** The covers in a grid. With `viewer`, a cover opens the viewer instead of the project page. */
export function CoverGrid({ base, projects, viewer = false, ratio = "4/5", className }: { base: string; projects: Project[]; viewer?: boolean; ratio?: string; className?: string }) {
  const [open, setOpen] = useState<string | null>(null)
  const transition = useTransition()
  const at = open ? projects.findIndex((p) => p.slug === open) : -1
  return (
    <>
      <ul className={cn("grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {projects.map((p, n) => (
          <li key={p.slug} className="pf-rise" style={{ viewTransitionName: open === p.slug ? undefined : `pf-card-${p.slug}`, animationDelay: `${120 + n * 70}ms` }}>
            <CoverCard p={p} base={base} ratio={ratio} hidden={open === p.slug} onOpen={viewer ? () => transition(() => setOpen(p.slug)) : undefined} />
          </li>
        ))}
      </ul>
      {viewer && at >= 0 ? (
        <Viewer base={base} projects={projects} index={at} onIndex={(i) => setOpen(projects[i].slug)} onClose={() => transition(() => setOpen(null))} />
      ) : null}
    </>
  )
}

function Viewer({ base, projects, index, onIndex, onClose }: { base: string; projects: Project[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const p = projects[index]
  const close = useRef<HTMLButtonElement>(null)
  const prev = (index + projects.length - 1) % projects.length
  const next = (index + 1) % projects.length

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    close.current?.focus({ preventScroll: true })
    const before = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = before
      opener?.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onIndex(prev)
      if (e.key === "ArrowRight") onIndex(next)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onIndex, prev, next])

  return (
    <div role="dialog" aria-modal="true" aria-label={p.title} className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md">
      <div className="mx-auto grid min-h-full max-w-[1200px] items-center gap-8 px-5 py-20 sm:px-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14">
        <div className="mx-auto aspect-[4/5] w-full max-w-[min(100%,calc(min(84vh,860px)*0.8))] overflow-hidden rounded-[var(--dc-radius-card)]" style={{ viewTransitionName: `pf-cover-${p.slug}` }}>
          <ProjectCover project={p} />
        </div>
        <div>
          <p className="dc-num text-[13px] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <h2 className="dc-h mt-3 text-[40px] leading-[1.02] sm:text-[56px]">{p.title}</h2>
          <p className="mt-3 text-[15px] font-medium">
            {p.role} <span className="text-muted-foreground">· {p.client}</span>
          </p>
          <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground">{p.summary}</p>
          <dl className="mt-8 grid max-w-[480px] grid-cols-3 gap-4 border-t border-border pt-5">
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-[14px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" className="h-10 px-4" nativeButton={false} render={<Link href={to(base, "work", p.slug)} />}>
              {p.layout === "gallery" ? "See the project" : "Read the case study"} <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            {projects.length > 1 ? (
              <>
                <Button variant="outline" size="icon-lg" className="size-10" aria-label="Previous project" onClick={() => onIndex(prev)}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="icon-lg" className="size-10" aria-label="Next project" onClick={() => onIndex(next)}>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <Button ref={close} variant="outline" size="icon-lg" className="fixed top-5 right-5 size-10 bg-background" aria-label="Close" onClick={onClose}>
        <X className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------- */

/** The grid home's cover grid: the filter above, the viewer on click. */
export function FilteredGrid({ base, children }: { base: string; children?: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("All")
  const transition = useTransition()
  return (
    <>
      <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
        {children}
        <FilterChips value={filter} onChange={(f) => transition(() => setFilter(f))} className="pf-rise" />
      </div>
      <CoverGrid base={base} projects={shownFor(filter)} viewer />
    </>
  )
}

/** The Work page: filter by tag, switch between the list and the grid. Both are kept in the URL (?tag=, ?view=). */
export function WorkBrowser({ base, variant }: { base: string; variant: Variant }) {
  // A shared link opens on its filter and view; until the visitor picks, the URL decides.
  const search = useSyncExternalStore(noop, () => window.location.search, () => "")
  const q = new URLSearchParams(search)
  const urlTag = q.get("tag") as Tag | null
  const urlView = q.get("view")
  const [picked, setPicked] = useState<{ filter: Filter; view: Variant } | null>(null)
  const filter: Filter = picked?.filter ?? (urlTag && TAGS.includes(urlTag) ? urlTag : "All")
  const view: Variant = picked?.view ?? (urlView === "index" || urlView === "grid" ? urlView : variant)
  const transition = useTransition()

  const update = (f: Filter, v: Variant) => {
    transition(() => setPicked({ filter: f, view: v }))
    const url = new URL(window.location.href)
    if (f === "All") url.searchParams.delete("tag")
    else url.searchParams.set("tag", f)
    if (v === variant) url.searchParams.delete("view")
    else url.searchParams.set("view", v)
    window.history.replaceState(window.history.state, "", url)
  }
  const shown = shownFor(filter)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <FilterChips value={filter} onChange={(f) => update(f, view)} />
        <div role="group" aria-label="View" className="flex rounded-full border border-border p-0.5">
          {(
            [
              ["index", "List", List],
              ["grid", "Grid", LayoutGrid],
            ] as const
          ).map(([v, label, Icon]) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => update(filter, v)}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              <Icon className="size-3.5" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </div>
      {view === "index" ? <WorkIndex base={base} projects={shown} /> : <CoverGrid base={base} projects={shown} />}
      <p className="sr-only" role="status">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
    </>
  )
}
