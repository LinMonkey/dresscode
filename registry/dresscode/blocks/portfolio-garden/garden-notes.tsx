"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import { GardenLeaf } from "./garden-leaf"
import { GARDEN_STAGES, type GardenNote } from "./garden-notes-data"

const FILTERS = ["All", ...GARDEN_STAGES] as const
type Filter = (typeof FILTERS)[number]
type Note = GardenNote & { essays: { href: string; title: string }[] }

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

const getHash = () => window.location.hash
const getServerHash = () => ""

export function GardenNotes({ notes }: { notes: Note[] }) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash)
  const [selected, setSelected] = useState<{ hash: string; filter: Filter }>({ hash: "", filter: "All" })
  const filter = selected.hash === hash ? selected.filter : "All"

  useEffect(() => {
    if (!hash.startsWith("#note-")) return
    const target = document.getElementById(hash.slice(1))
    if (target instanceof HTMLDetailsElement) {
      target.open = true
      target.scrollIntoView()
    }
  }, [hash])

  const count = filter === "All" ? notes.length : notes.filter((note) => note.stage === filter).length

  return (
    <section id="garden" aria-labelledby="garden-heading" className="scroll-mt-6 border-t border-border py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id="garden-heading" className="dc-h text-4xl leading-tight italic sm:text-5xl">The garden</h2>
          <p className="mt-1 text-base text-muted-foreground sm:text-xl">Notes grow here. Seedlings are rough, evergreens are finished.</p>
        </div>
        <div role="group" aria-label="Filter notes by maturity" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              aria-controls="garden-notes"
              onClick={() => setSelected({ hash, filter: option })}
              className={cn(
                "min-h-11 cursor-pointer rounded-md px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4 sm:text-base",
                filter === option
                  ? "bg-[var(--dc-highlight)] font-medium text-[var(--dc-highlight-fg)]"
                  : "hover:bg-card",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="sr-only">Showing {count} {count === 1 ? "note" : "notes"}.</p>
      <ul id="garden-notes" className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <li key={note.slug} hidden={filter !== "All" && note.stage !== filter} className="min-w-0">
            <details id={`note-${note.slug}`} className="group scroll-mt-6 rounded-[10px] border border-border bg-card text-card-foreground">
              <summary className="relative flex min-h-[10rem] cursor-pointer list-none flex-col items-start rounded-[inherit] px-5 py-4 hover:bg-background/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <GardenLeaf stage={note.stage} />
                <span className="dc-h mt-1.5 text-[clamp(1.25rem,1.88vw,1.75rem)] leading-[1.05] text-wrap-pretty">{note.title}</span>
                <span className="mt-2 max-w-[37ch] text-[15px] leading-snug text-muted-foreground sm:text-[17px]">{note.summary}</span>
                <span className="mt-auto pt-3 text-sm text-muted-foreground">Tended 3 days ago</span>
                <ChevronDown aria-hidden="true" className="absolute right-4 bottom-4 size-4 text-muted-foreground group-open:rotate-180" />
              </summary>
              <div className="grid gap-3 border-t border-border px-5 pt-4 pb-5 text-base leading-relaxed text-muted-foreground">
                <p>{note.body}</p>
                {note.essays.length > 0 && (
                  <ul className="grid gap-1.5">
                    {note.essays.map(({ href, title }) => (
                      <li key={href}>
                        <Link href={href} className="text-[color:var(--dc-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}
