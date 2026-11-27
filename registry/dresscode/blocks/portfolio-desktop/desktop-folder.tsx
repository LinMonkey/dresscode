"use client"

// The Projects folder: a side list of kinds and the projects as large thumbnails, like a file browser.
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"

import { ProjectCover } from "../portfolio/covers"
import { PROJECTS, type Tag } from "../portfolio/data"
import { to } from "../portfolio/site"

export function ProjectsFolder({ base }: { base: string }) {
  const [kind, setKind] = useState<"All work" | Tag>("All work")
  const kinds = ["All work", ...new Set(PROJECTS.flatMap((p) => p.tags))] as ("All work" | Tag)[]
  const shown = PROJECTS.filter((p) => kind === "All work" || p.tags.includes(kind))
  const years = `${PROJECTS.at(-1)?.year} — ${PROJECTS[0]?.year}`
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex min-h-0 flex-1 max-sm:flex-col">
        <nav aria-label="Kinds" className="shrink-0 border-border bg-card p-2 max-sm:flex max-sm:gap-1 max-sm:overflow-x-auto max-sm:border-b sm:w-40 sm:border-r sm:p-3">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className="block w-full shrink-0 cursor-pointer rounded-md px-3 py-2 text-left text-[15px] whitespace-nowrap text-muted-foreground hover:bg-muted aria-pressed:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] aria-pressed:font-semibold aria-pressed:text-[color:var(--dc-accent)] max-sm:w-auto"
            >
              {k}
            </button>
          ))}
        </nav>
        <ul className="grid flex-1 content-start gap-x-4 gap-y-5 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={to(base, "work", p.slug)} className="group block">
                <span className="block aspect-[4/3] overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)] border border-border">
                  <span className="block size-full transition-transform duration-500 group-hover:scale-[1.04]">
                    <ProjectCover project={p} />
                  </span>
                </span>
                <span className={cn("mt-2 block truncate text-[15px] font-semibold underline-offset-4 group-hover:underline")}>{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-border bg-card px-4 py-2 text-[13px] text-muted-foreground">
        {shown.length} {shown.length === 1 ? "project" : "projects"} · {years}
      </p>
    </div>
  )
}
