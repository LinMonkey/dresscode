// The home pages' further sections, as real estate home pages have them.
// Platform: services (buy, rent, sell, finance), reviews, questions and popular searches.
// Boutique: press, collections, how the office sells, clients' words and the journal.
import { ArrowRight, ArrowUpRight, KeyRound, Landmark, Search, Star, Tag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Photo } from "./cards"
import { BRAND, COLLECTIONS, FAQ, FEATURES, HOODS, LISTINGS, POSTS, PRESS, PRIVATE_SERVICES, PRIVATE_WORDS, REVIEWS, SERVICES, type Feature, type HomeType, type Status } from "./data"
import { WRAP } from "./shell"
import { agentOf, formatDate, hoodOf, searchPath, short, to } from "./site"

const ICONS = { search: Search, key: KeyRound, tag: Tag, landmark: Landmark }

const forSale = () => LISTINGS.filter((l) => l.status === "sale")

/* Platform ------------------------------------------------------------------------------------- */

export function Services({ base }: { base: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map((s) => {
        const Icon = ICONS[s.icon]
        return (
          <li key={s.title}>
            <article className="dc-card group relative flex h-full flex-col p-6 transition-shadow hover:shadow-md">
              <span className="grid size-11 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,transparent)] text-[color:var(--dc-accent)]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="dc-h mt-5 text-[22px] leading-tight">{s.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
              <Link href={to(base, s.path)} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] after:absolute after:inset-0">
                {s.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-[color:var(--dc-accent)]", className)} aria-label={`${n} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("size-4", i < Math.round(n) ? "fill-current" : "opacity-30")} aria-hidden="true" />
      ))}
    </span>
  )
}

export function Reviews({ base }: { base: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-8">
      <div className="flex flex-col justify-between gap-6">
        <div>
          <p className="dc-h dc-num text-[clamp(3rem,5vw,4.2rem)] leading-none tabular-nums">{REVIEWS.score.toFixed(1)}</p>
          <Stars n={REVIEWS.score} className="mt-3" />
          <p className="mt-3 text-[15px] text-muted-foreground">
            From {REVIEWS.count.toLocaleString("en-US")} reviews by people who bought, sold and rented with {BRAND.name} since {BRAND.since}.
          </p>
        </div>
        <Link href={to(base, "agents")} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] hover:underline">
          Find your agent <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid gap-3 md:grid-cols-3">
        {REVIEWS.items.map((r) => {
          const agent = agentOf(r.agent)
          return (
            <li key={r.name}>
              <figure className="dc-card flex h-full flex-col p-5">
                <Stars n={r.stars} />
                <blockquote className="mt-3 flex-1 text-[16px] leading-relaxed">“{r.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-[14px] font-semibold" aria-hidden="true">
                    {r.name.charAt(0)}
                  </span>
                  <span className="min-w-0 text-[14px]">
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-muted-foreground">
                      {r.kind} in {hoodOf(r.hood).name} with{" "}
                      <Link href={to(base, "agents", agent.slug)} className="underline-offset-2 hover:underline">
                        {agent.name.split(" ")[0]}
                      </Link>
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Questions({ base }: { base: string }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-14">
      <div>
        <h2 id="re-faq" className="dc-h text-[clamp(1.7rem,2.8vw,2.3rem)] leading-tight">
          Questions we&apos;re asked most
        </h2>
        <p className="mt-3 max-w-[26em] text-[16px] text-muted-foreground">Buying, selling or renting in {BRAND.city} for the first time? Start here, or ask an agent.</p>
        <Button size="lg" variant="outline" className="mt-6 h-11 px-5 text-[15px]" nativeButton={false} render={<Link href={to(base, "contact")} />}>
          Ask a question
        </Button>
      </div>
      <div className="border-t border-border">
        {FAQ.map(([q, a], i) => (
          <details key={q} className="group border-b border-border" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-[18px] leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="max-w-[44em] pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

type Popular = { label: string; status?: Status; hood?: string; type?: HomeType; tag?: Feature; min?: number; max?: number; open?: boolean }

/** Links to common searches, by neighborhood, home type, price and rentals; each opens the search, filtered,
 *  and a link with no homes behind it is left out, so the list follows your listings. */
export function PopularSearches({ base }: { base: string }) {
  const types: [HomeType, string][] = [
    ["House", "Houses"],
    ["Condo", "Condos"],
    ["Townhouse", "Townhouses"],
    ["Loft", "Lofts"],
  ]
  const columns: [string, Popular[]][] = [
    ["Homes for sale", HOODS.map((h) => ({ label: `Homes for sale in ${h.name}`, hood: h.slug }))],
    [
      "By home type",
      [...types.map(([type, label]) => ({ label: `${label} for sale in ${BRAND.city}`, type })), ...FEATURES.slice(0, 2).map((tag) => ({ label: `Homes with a ${tag.toLowerCase()}`, tag }))],
    ],
    [
      "By price",
      [
        { label: `Homes under ${short(500_000)}`, max: 500_000 },
        { label: `Homes under ${short(750_000)}`, max: 750_000 },
        { label: `Homes from ${short(750_000)} to ${short(1_000_000)}`, min: 750_000, max: 1_000_000 },
        { label: `Homes from ${short(1_000_000)} to ${short(2_000_000)}`, min: 1_000_000, max: 2_000_000 },
        { label: `Homes over ${short(2_000_000)}`, min: 2_000_000 },
        { label: "Open houses this weekend", open: true },
      ],
    ],
    [
      "Rent and sold",
      [
        { label: `Homes for rent in ${BRAND.city}`, status: "rent" },
        ...HOODS.map((h): Popular => ({ label: `Apartments for rent in ${h.name}`, status: "rent", hood: h.slug })),
        { label: "Pet-friendly rentals", status: "rent", tag: "Pets allowed" },
        ...HOODS.map((h): Popular => ({ label: `Recently sold in ${h.name}`, status: "sold", hood: h.slug })),
      ],
    ],
  ]
  const count = (p: Popular) =>
    LISTINGS.filter(
      (l) =>
        l.status === (p.status ?? "sale") &&
        (!p.hood || l.hood === p.hood) &&
        (!p.type || l.type === p.type) &&
        (!p.tag || l.tags.includes(p.tag)) &&
        (!p.min || l.price >= p.min) &&
        (!p.max || l.price <= p.max) &&
        (!p.open || !!l.openHouse),
    ).length
  const href = (p: Popular) => {
    const q = new URLSearchParams()
    if (p.hood) q.set("hood", p.hood)
    if (p.type) q.set("type", p.type)
    if (p.tag) q.set("tags", p.tag)
    if (p.min) q.set("min", String(p.min))
    if (p.max) q.set("max", String(p.max))
    if (p.open) q.set("open", "1")
    const s = q.toString()
    return to(base, searchPath(p.status ?? "sale")) + (s ? `?${s}` : "")
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map(([title, links]) => (
        <div key={title}>
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <ul className="mt-3 grid gap-2">
            {links
              .filter((p) => count(p) > 0)
              .slice(0, 7)
              .map((p) => (
                <li key={p.label}>
                  <Link href={href(p)} className="text-[14px] text-muted-foreground hover:text-foreground hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* Boutique ------------------------------------------------------------------------------------- */

const PRESS_LOOK = [
  "font-serif italic text-[22px]",
  "uppercase tracking-[0.32em] text-[15px] font-semibold",
  "font-serif text-[21px]",
  "uppercase tracking-[0.18em] text-[13px] font-medium",
  "font-serif italic text-[20px] font-semibold",
]

export function Press() {
  return (
    <section aria-labelledby="re-b-press" className={cn(WRAP, "pb-14 sm:pb-20")}>
      <div className="flex flex-col items-center gap-6 border-y border-border py-8 lg:flex-row lg:justify-between">
        <h2 id="re-b-press" className="shrink-0 text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
          As featured in
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground lg:justify-end">
          {PRESS.map((p, i) => (
            <li key={p} className={cn("leading-none whitespace-nowrap opacity-80", PRESS_LOOK[i % PRESS_LOOK.length])}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Collections({ base }: { base: string }) {
  const buy = to(base, searchPath("sale"))
  return (
    <section aria-labelledby="re-b-collections" className={cn(WRAP, "pb-16 sm:pb-24")}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="re-b-collections" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-none">
          Collections
        </h2>
        <p className="max-w-[30em] text-[15px] text-muted-foreground">Homes grouped the way our clients ask for them.</p>
      </div>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {COLLECTIONS.map((c) => {
          const homes = forSale().filter((l) => (!c.hood || l.hood === c.hood) && (!c.type || l.type === c.type) && (!c.tag || l.tags.includes(c.tag)))
          const q = new URLSearchParams()
          if (c.hood) q.set("hood", c.hood)
          if (c.type) q.set("type", c.type)
          if (c.tag) q.set("tags", c.tag)
          return (
            <li key={c.title}>
              <Link href={`${buy}?${q}`} className="group relative block aspect-[3/4] overflow-hidden text-white">
                <Photo src={c.photo} alt="" className="transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_30/0.6),transparent_55%)]" aria-hidden="true" />
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                  <span>
                    <span className="dc-h block text-[clamp(1.5rem,2.4vw,2rem)] leading-none">{c.title}</span>
                    <span className="mt-1.5 block text-[14px] text-white/85">{homes.length === 1 ? "1 residence" : `${homes.length} residences`}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function HowWeSell({ base }: { base: string }) {
  return (
    <section aria-labelledby="re-b-how" className={cn(WRAP, "grid gap-10 pt-16 sm:pt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-16")}>
      <div>
        <h2 id="re-b-how" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-none">
          How we sell
        </h2>
        <p className="mt-4 max-w-[24em] text-[16px] text-muted-foreground">A small office, on purpose: one director, a handful of homes at a time and no listing we would not buy ourselves.</p>
        <Link href={to(base, "about")} className="mt-6 inline-flex items-center gap-1.5 text-[15px] text-[color:var(--dc-accent)] hover:underline">
          About the office <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ol className="grid gap-x-10 sm:grid-cols-2">
        {PRIVATE_SERVICES.map(([title, text], i) => (
          <li key={title} className="border-t border-border py-6">
            <span className="text-[13px] text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="dc-h mt-2 text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ClientWords() {
  const [lead, ...rest] = PRIVATE_WORDS
  return (
    <section aria-labelledby="re-b-words" className="border-y border-border bg-[color:var(--dc-surface)]">
      <div className={cn(WRAP, "py-16 sm:py-24")}>
        <h2 id="re-b-words" className="text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
          In our clients&apos; words
        </h2>
        <figure className="mt-6 max-w-[52rem]">
          <blockquote className="dc-h text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.1] italic">“{lead.quote}”</blockquote>
          <figcaption className="mt-4 text-[15px] text-muted-foreground">{lead.who}</figcaption>
        </figure>
        <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
          {rest.map((w) => (
            <figure key={w.who}>
              <blockquote className="dc-h text-[clamp(1.25rem,1.8vw,1.55rem)] leading-snug italic">“{w.quote}”</blockquote>
              <figcaption className="mt-3 text-[14px] text-muted-foreground">{w.who}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BoutiqueJournal({ base }: { base: string }) {
  return (
    <section aria-labelledby="re-b-journal" className={cn(WRAP, "pb-16 sm:pb-24")}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="re-b-journal" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-none">
          Journal
        </h2>
        <Link href={to(base, "journal")} className="inline-flex items-center gap-1.5 text-[15px] text-[color:var(--dc-accent)] hover:underline">
          All stories <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid gap-8 md:grid-cols-3">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link href={to(base, "journal", p.slug)} className="group block">
              <span className="block aspect-[3/2] overflow-hidden">
                <Photo src={p.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.04]" />
              </span>
              <span className="mt-4 block text-[13px] tracking-[0.14em] text-muted-foreground uppercase">
                {p.category} · {formatDate(p.date)}
              </span>
              <span className="dc-h mt-2 block text-[clamp(1.4rem,2vw,1.75rem)] leading-tight underline-offset-[6px] group-hover:underline">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
