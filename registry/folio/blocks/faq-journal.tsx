// FAQ in two columns and the "From the journal" article row (design image L11).
// Article kickers are sentence-case italic serif, not small all-caps labels (review fix #2).
import { ArrowRight, Minus, Plus } from "lucide-react"
import Image from "next/image"

import { Container, DoubleRule, SectionHeader } from "./shared"

export type QA = { q: string; a: string }

const faqs: QA[] = [
  { q: "What is Sundial?", a: "Sundial is a newsletter platform for independent writers. It helps you write, send, and grow a paid publication, with simple tools and a focus on long-term, reader-supported work." },
  { q: "How much does it cost?", a: "Sundial is free for your first 1,000 subscribers. Paid plans start at $12 a month." },
  { q: "Do you take a cut of my revenue?", a: "No platform fee on the Free plan. Standard payment processing fees apply to paid subscriptions." },
  { q: "Can I bring my existing subscribers?", a: "Yes. Import a CSV from any other newsletter tool in a few minutes." },
  { q: "Can I try it before I pay?", a: "Yes. Every paid plan starts with a 14-day free trial." },
  { q: "What tools are included?", a: "The editor, scheduling, analytics, paid subscriptions and a custom domain." },
  { q: "Can I change or cancel my plan?", a: "Anytime, from your billing settings. Changes take effect at the next billing date." },
  { q: "Does Sundial support multiple writers or a team?", a: "Yes. The Publication plan adds team members, roles and permissions." },
]

function Question({ item, open }: { item: QA; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-divider">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[18px] text-[19px] font-semibold text-ink md:text-[21px]">
        {item.q}
        <Plus className="size-[20px] shrink-0 group-open:hidden" />
        <Minus className="hidden size-[20px] shrink-0 text-press group-open:block" />
      </summary>
      <p className="pb-[20px] text-[17px] leading-[1.45] text-ink-2">{item.a}</p>
    </details>
  )
}

export function FAQ({ title = "Questions, answered", items = faqs }: { title?: string; items?: QA[] }) {
  const half = Math.ceil(items.length / 2)
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[32px]" title={title} />
      <div className="mt-[34px] grid gap-x-[34px] md:grid-cols-2">
        {[items.slice(0, half), items.slice(half)].map((col, c) => (
          <div key={c} className="border-t border-divider">
            {col.map((it, i) => (
              <Question key={it.q} item={it} open={c === 0 && i === 0} />
            ))}
          </div>
        ))}
      </div>
    </Container>
  )
}

export type JournalPost = { kicker: string; title: string; date: string; author: string; img: string }

const posts: JournalPost[] = [
  { kicker: "Craft", title: "A simpler workflow for a steadier writing practice", date: "Jan 8, 2026", author: "Mara Ellis", img: "/folio/placeholder/blog-building.png" },
  { kicker: "Growth", title: "How to grow a paid newsletter in 2026", date: "Jan 15, 2026", author: "David Rourke", img: "/folio/placeholder/blog-desk.png" },
  { kicker: "Sustainability", title: "The long game: building a durable publication", date: "Jan 22, 2026", author: "Elena Park", img: "/folio/placeholder/blog-skyline.png" },
]

export function Journal({ title = "From the Sundial journal", items = posts }: { title?: string; items?: JournalPost[] }) {
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[32px]" title={title} />
      <div className="mt-[40px] grid gap-10 md:grid-cols-3 md:gap-[20px]">
        {items.map((p, i) => (
          <a key={p.title} href="#" className={i > 0 ? "group md:border-l md:border-hairline md:pl-[20px]" : "group"}>
            <Image src={p.img} alt="" width={300} height={208} className="aspect-[300/208] w-full object-cover grayscale" />
            <p className="mt-[20px] font-serif text-[17px] italic text-ink-2">{p.kicker}</p>
            <p className="mt-[6px] font-serif text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-ink group-hover:text-press">{p.title}</p>
            <p className="mt-[14px] border-b border-divider pb-[18px] text-[16px] text-ink-2">
              {p.date} — {p.author}
            </p>
          </a>
        ))}
      </div>
      <a href="#journal" className="mt-[34px] inline-flex items-center gap-[8px] font-serif text-[22px] text-press">
        Read the journal <ArrowRight className="size-[20px]" />
      </a>
    </Container>
  )
}
