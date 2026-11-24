// Blog, featured post: one large post with a big-number cover on the left, three more as a list on the
// right whose top and bottom lines meet the card's edges. Every post is one link. The covers are
// typographic panels in the theme's colors, hidden from screen readers; the titles say what they are.
import { ArrowRight, Globe, Mail } from "lucide-react"
import type { ReactNode } from "react"

const MORE: { tag: string; title: string; date: string; iso: string; time: string; tile: ReactNode }[] = [
  {
    tag: "Pricing",
    title: "How to raise your rates without losing your best clients",
    date: "Nov 12, 2026",
    iso: "2026-11-12",
    time: "7 min read",
    tile: (
      <span className="grid size-full place-items-center bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))]">
        <span className="dc-h dc-num text-[22px] text-[color:var(--dc-accent)]">+15%</span>
      </span>
    ),
  },
  {
    tag: "Template",
    title: "A late-payment email you can send today",
    date: "Nov 6, 2026",
    iso: "2026-11-06",
    time: "3 min read",
    tile: (
      <span className="grid size-full place-items-center bg-muted">
        <Mail className="size-8 text-muted-foreground" strokeWidth={1.5} />
      </span>
    ),
  },
  {
    tag: "Story",
    title: "How Kato & Lee bill clients in four time zones",
    date: "Oct 30, 2026",
    iso: "2026-10-30",
    time: "5 min read",
    tile: (
      <span className="grid size-full place-items-center bg-[color:color-mix(in_oklab,var(--chart-2)_24%,var(--card))]">
        <Globe className="size-8" strokeWidth={1.5} />
      </span>
    ),
  },
]

export default function BlogFeatured() {
  return (
    <section aria-labelledby="blog-featured-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-[560px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">The Orbit journal</p>
            <h2 id="blog-featured-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              Notes on getting paid
            </h2>
          </div>
          <a
            href="#blog"
            className="inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            All articles <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <article className="min-w-0">
            <a href="#post" className="dc-card group flex h-full flex-col overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <div
                aria-hidden="true"
                className="flex h-64 flex-col justify-between border-b border-border bg-[color:var(--dc-highlight)] p-6 text-[color:var(--dc-highlight-fg)] sm:h-72 sm:p-8"
              >
                <span className="text-[14px] font-semibold opacity-80">The Orbit payment report, 2026</span>
                <div className="flex items-end gap-x-4">
                  <span className="dc-h dc-num shrink-0 text-[88px] leading-[0.8] sm:text-[128px]">11</span>
                  <span className="pb-1">
                    <span className="dc-h block text-[28px] leading-none">days</span>
                    <span className="mt-1.5 block max-w-[240px] text-[14px] leading-snug text-balance opacity-80">on average to get paid, down from 23</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-[13px] text-muted-foreground">
                  <span className="font-semibold text-[color:var(--dc-accent)]">Report</span> · 9 min read
                </p>
                <h3 className="dc-h mt-2 text-[26px] leading-[1.15] group-hover:underline group-hover:underline-offset-4 sm:text-[30px]">
                  We read 40,000 invoices. Here is what gets them paid on time.
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                  Short terms, a clear due date and one reminder before it falls due cut the wait from 23 days to 11. The numbers, by trade and by invoice size.
                </p>
                <div className="mt-auto flex items-center gap-3 pt-6 text-[14px]">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold">
                    MO
                  </span>
                  <span>
                    <span className="block font-semibold">Maya Okafor</span>
                    <time dateTime="2026-11-20" className="block text-muted-foreground">
                      Nov 20, 2026
                    </time>
                  </span>
                </div>
              </div>
            </a>
          </article>

          <div className="flex min-w-0 flex-col">
            <h3 className="sr-only">More posts</h3>
            <ul className="grid flex-1 border-y border-border lg:grid-rows-3">
              {MORE.map((p, i) => (
                <li key={p.title} className={i ? "border-t border-border" : undefined}>
                  <a
                    href="#post"
                    className="group flex h-full items-center gap-4 rounded-[var(--radius)] py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-5"
                  >
                    <span aria-hidden="true" className="size-20 shrink-0 overflow-hidden rounded-[calc(var(--radius)+4px)] border border-border sm:size-24">
                      {p.tile}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] text-muted-foreground">
                        <span className="font-semibold text-[color:var(--dc-accent)]">{p.tag}</span> · {p.time}
                      </span>
                      <span className="dc-h mt-1 block text-[18px] leading-snug group-hover:underline group-hover:underline-offset-4">{p.title}</span>
                      <time dateTime={p.iso} className="mt-1.5 block text-[13px] text-muted-foreground">
                        {p.date}
                      </time>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
