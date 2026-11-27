"use client"

// The Bento work wall: the covers as tiles of two sizes, filtered by tag. A filter change rearranges
// the tiles with a view transition where the browser has them (and motion is welcome).
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

import { ProjectCover } from "../portfolio/covers"
import { PROJECTS, type Tag } from "../portfolio/data"
import { to } from "../portfolio/site"
import { useReducedMotion } from "../portfolio/ui"

type Filter = "All" | Tag

// Which tiles are wide, in order: a wide one, two squares, then two squares and a wide one.
const WIDE = [true, false, false, false, false, true]

export function BentoWork({ base, limit }: { base: string; limit?: number }) {
  const [filter, setFilter] = useState<Filter>("All")
  const reduced = useReducedMotion()
  const tags = ["All", ...new Set(PROJECTS.flatMap((p) => p.tags))] as Filter[]
  const shown = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter)).slice(0, limit)

  const pick = (f: Filter) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    if (reduced || !doc.startViewTransition) return setFilter(f)
    doc.startViewTransition(() => flushSync(() => setFilter(f)))
  }

  return (
    <>
      <div role="group" aria-label="Filter work" className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={() => pick(t)}
            className="dc-flat inline-flex h-9 cursor-pointer items-center rounded-full border-[length:var(--dc-bw)] border-[color:var(--dc-card-border)] bg-card px-4 text-[14px] font-medium transition-colors hover:bg-muted aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {t}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((p, i) => (
          <li key={p.slug} className={cn(WIDE[i % WIDE.length] && "sm:col-span-2")} style={{ viewTransitionName: `pb-work-${p.slug}` }}>
            <Link href={to(base, "work", p.slug)} className="pb-tile dc-card group relative block h-full overflow-hidden">
              <span className={cn("block overflow-hidden", WIDE[i % WIDE.length] ? "aspect-[16/9] sm:aspect-auto sm:h-full sm:min-h-[280px]" : "aspect-square")}>
                <span className="block size-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]">
                  <ProjectCover project={p} />
                </span>
              </span>
              <span className="dc-card absolute bottom-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-semibold shadow-none">
                {p.title} <span className="dc-num font-normal text-muted-foreground">{p.year}</span>
              </span>
              <span className="dc-card absolute top-3 right-3 grid size-9 place-items-center rounded-full opacity-0 shadow-none transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
