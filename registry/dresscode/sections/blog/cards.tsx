// Blog, post cards: three recent posts under a heading with a link to every article. Each card is one
// link. The covers are typographic panels in the theme's colors (an icon, a word, a big number), a
// different one per post, and hidden from screen readers since the title says what the post is.
import { ArrowRight, BellRing, FileText } from "lucide-react"
import type { ReactNode } from "react"

const POSTS: { tag: string; title: string; excerpt: string; date: string; iso: string; time: string; cover: ReactNode }[] = [
  {
    tag: "Guide",
    title: "How to write a reminder that gets paid, not ignored",
    excerpt: "Three short lines, sent at the right moment, do more than a stern paragraph.",
    date: "Nov 18, 2026",
    iso: "2026-11-18",
    time: "6 min read",
    cover: (
      <div className="flex h-full flex-col justify-between bg-[color:var(--dc-highlight)] p-5 text-[color:var(--dc-highlight-fg)]">
        <span className="flex items-center justify-between text-[13px] font-semibold">
          <span className="opacity-80">Reminders</span>
          <BellRing className="size-6" strokeWidth={1.75} />
        </span>
        <span className="dc-h max-w-[280px] text-[23px] leading-[1.15]">&ldquo;A friendly nudge that INV-1042 is due on Friday.&rdquo;</span>
      </div>
    ),
  },
  {
    tag: "Template",
    title: "A freelance invoice template your accountant will like",
    excerpt: "Every field an invoice needs, in the order your client reads them.",
    date: "Nov 6, 2026",
    iso: "2026-11-06",
    time: "4 min read",
    cover: (
      <div className="flex h-full flex-col justify-between bg-muted p-5">
        <FileText className="size-7 self-end text-muted-foreground" strokeWidth={1.5} />
        <span className="dc-h text-[44px] leading-none">Invoice</span>
      </div>
    ),
  },
  {
    tag: "Story",
    title: "How Fernwood Studio cut late payments in half",
    excerpt: "A six-person studio, one change to their terms and a lot fewer awkward calls.",
    date: "Oct 28, 2026",
    iso: "2026-10-28",
    time: "5 min read",
    cover: (
      <div className="flex h-full flex-col justify-end bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))] p-5">
        <span className="dc-h dc-num text-[64px] leading-none text-[color:var(--dc-accent)]">50%</span>
        <span className="mt-2 text-[13px] font-semibold text-muted-foreground">fewer late payments</span>
      </div>
    ),
  },
]

export default function BlogCards() {
  return (
    <section aria-labelledby="blog-cards-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-[560px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">From the blog</p>
            <h2 id="blog-cards-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              Get paid, and get paid sooner
            </h2>
          </div>
          <a
            href="#blog"
            className="inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            All articles <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <li key={p.title}>
              <a
                href="#post"
                className="dc-card group flex h-full flex-col overflow-hidden outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:hover:-translate-y-0.5"
              >
                <div aria-hidden="true" className="h-44 border-b border-border">
                  {p.cover}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[13px] font-semibold text-[color:var(--dc-accent)]">{p.tag}</span>
                  <h3 className="dc-h mt-2 text-[20px] leading-snug group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-auto pt-5 text-[13px] text-muted-foreground">
                    <time dateTime={p.iso}>{p.date}</time> · {p.time}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
