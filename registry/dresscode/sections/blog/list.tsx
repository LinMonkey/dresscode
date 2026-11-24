"use client"

// Blog, list with a topic filter: a compact list of posts, newest first, each with a small date tile (its
// cover, tinted by topic), the author, the topic and the reading time. Buttons above filter by topic
// (the chosen one is pressed) and a polite live region says how many posts are showing.
import { ArrowRight } from "lucide-react"
import { useId, useState } from "react"

import { cn } from "@/lib/utils"

type Topic = "Guide" | "Template" | "Story" | "Product"

const FILTERS: { value: Topic | "All"; label: string }[] = [
  { value: "All", label: "All posts" },
  { value: "Guide", label: "Guides" },
  { value: "Template", label: "Templates" },
  { value: "Story", label: "Stories" },
  { value: "Product", label: "Product news" },
]

const POSTS: { topic: Topic; title: string; iso: string; time: number; by: string }[] = [
  { topic: "Guide", title: "How to write a reminder that gets paid, not ignored", iso: "2026-11-18", time: 6, by: "Maya Okafor" },
  { topic: "Product", title: "Orbit 3.0: reports your accountant will like", iso: "2026-11-12", time: 3, by: "Jun Sato" },
  { topic: "Template", title: "A freelance invoice template your accountant will like", iso: "2026-11-06", time: 4, by: "Ada Lindqvist" },
  { topic: "Story", title: "How Fernwood Studio cut late payments in half", iso: "2026-10-28", time: 5, by: "Kofi Mensah" },
  { topic: "Guide", title: "Deposits, milestones or monthly: how to bill a long project", iso: "2026-10-21", time: 8, by: "Maya Okafor" },
  { topic: "Template", title: "A late-payment email you can send today", iso: "2026-10-14", time: 3, by: "Ada Lindqvist" },
  { topic: "Story", title: "Ola Bakery's catering side now bills itself", iso: "2026-10-07", time: 4, by: "Kofi Mensah" },
  { topic: "Product", title: "Payment plans: let clients pay in parts", iso: "2026-09-30", time: 2, by: "Jun Sato" },
  { topic: "Guide", title: "What to put in your payment terms, line by line", iso: "2026-09-23", time: 7, by: "Maya Okafor" },
]

// Each topic tints its date tiles differently, so the list reads at a glance.
const TILE: Record<Topic, string> = {
  Guide: "bg-[color:color-mix(in_oklab,var(--dc-accent)_13%,var(--card))] text-[color:var(--dc-accent)]",
  Template: "bg-muted text-foreground",
  Story: "bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]",
  Product: "border border-border bg-card text-foreground",
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return { day: d, month: MONTHS[m - 1], long: `${MONTHS[m - 1]} ${d}, ${y}` }
}

export default function BlogList() {
  const id = useId()
  const [topic, setTopic] = useState<Topic | "All">("All")
  const shown = topic === "All" ? POSTS : POSTS.filter((p) => p.topic === topic)
  const label = FILTERS.find((f) => f.value === topic)?.label

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[880px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Blog</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Everything we have written
          </h2>
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground">Guides, templates and stories from people who bill for a living, plus what is new in Orbit.</p>

          <div role="group" aria-label="Filter by topic" className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = topic === f.value
              const n = f.value === "All" ? POSTS.length : POSTS.filter((p) => p.topic === f.value).length
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTopic(f.value)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-[14px] font-semibold text-muted-foreground outline-none transition-colors hover:border-input hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    on && "border-transparent bg-primary text-primary-foreground hover:border-transparent hover:text-primary-foreground",
                  )}
                >
                  {f.label}
                  <span aria-hidden="true" className="dc-num text-[12px] opacity-70">
                    {n}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            {topic === "All" ? `Showing all ${shown.length} posts.` : `Showing ${shown.length} posts in ${label}.`}
          </p>

          <ul className="mt-8 border-t border-border">
            {shown.map((p) => {
              const d = parts(p.iso)
              return (
                <li key={p.title} className="border-b border-border">
                  <a
                    href="#post"
                    className="group grid grid-cols-[52px_1fr] items-center gap-x-4 rounded-[var(--radius)] py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:grid-cols-[52px_1fr_100px_88px_20px] sm:gap-x-5"
                  >
                    <span aria-hidden="true" className={cn("flex size-[52px] flex-col items-center justify-center rounded-[calc(var(--radius)+2px)] leading-none", TILE[p.topic])}>
                      <span className="dc-h dc-num text-[20px]">{d.day}</span>
                      <span className="mt-1 text-[11px] font-semibold opacity-80">{d.month}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4 sm:text-[17px]">{p.title}</span>
                      <span className="mt-1 block text-[13px] text-muted-foreground">
                        <time dateTime={p.iso} className="sr-only">
                          {d.long},{" "}
                        </time>
                        <span className="hidden sm:inline">By {p.by}</span>
                        <span className="sm:hidden">
                          {p.topic} · {p.time} min read
                        </span>
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      <span className="dc-pill dc-pill-line">{p.topic}</span>
                    </span>
                    <span className="hidden text-right text-[13px] text-muted-foreground sm:block">{p.time} min read</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="hidden size-4 text-muted-foreground transition-transform group-hover:text-foreground motion-safe:group-hover:translate-x-0.5 sm:block"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex justify-center">
            <a
              href="#archive"
              className="inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Older posts <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
