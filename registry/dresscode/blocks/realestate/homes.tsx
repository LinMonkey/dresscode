// The two home pages.
// PlatformHome: search first, then what is new, the neighborhoods, what the brokerage does, a valuation
// band with the market's numbers, what you can afford, reviews, the agents, the journal, questions and
// popular searches; for a brokerage or a local portal.
// BoutiqueHome: a full-bleed photograph, one featured residence, the press, the current few, collections,
// the director's note, how the office sells, recent sales, clients' words, the neighborhoods as an
// editorial list and the journal; for a private office or a single agent.
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Affordability } from "./afford"
import { AgentCard, Badge, ListingCard, Photo, Section } from "./cards"
import { AGENTS, BRAND, HOODS, LISTINGS, MARKET, POSTS, PRIVATE_OFFICE } from "./data"
import { HeroSearch, NoteForm, ValuationStart } from "./forms"
import { BoutiqueJournal, ClientWords, Collections, HowWeSell, PopularSearches, Press, Questions, Reviews, Services } from "./home-sections"
import { BoutiqueFooter, BoutiqueHeader, PlatformFooter, PlatformHeader, WRAP } from "./shell"
import { agentOf, formatDate, fullAddress, hoodOf, money, plain, searchPath, to } from "./site"

export function PlatformHome({ base }: { base: string }) {
  const forSale = LISTINGS.filter((l) => l.status === "sale")
  const fresh = forSale.filter((l) => !l.private).sort((a, b) => b.listed.localeCompare(a.listed)).slice(0, 4)
  const hero = LISTINGS[0]
  return (
    <>
      <PlatformHeader base={base} current="home" />
      <main id="main" className="flex-1">
        <section aria-labelledby="re-hero" className={cn(WRAP, "pt-4 sm:pt-6")}>
          <div className="relative overflow-hidden rounded-[calc(var(--dc-radius-card)+8px)]">
            <div className="absolute inset-0">
              <Photo src={hero.photos[0]} alt={`${fullAddress(hero)} at dusk`} priority className="re-zoom" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(8_14_26/0.72)_0%,rgb(8_14_26/0.5)_38%,rgb(8_14_26/0.14)_62%,transparent_78%)]" aria-hidden="true" />
            <div className="relative px-5 pt-10 pb-6 sm:px-10 sm:pt-16 lg:px-14 lg:pt-20">
              <h1 id="re-hero" className="re-rise dc-h max-w-[11em] text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.98] text-white">
                {BRAND.tagline}
              </h1>
              <p className="re-rise mt-4 max-w-[30em] text-[clamp(1rem,1.4vw,1.25rem)] text-white/90" style={{ animationDelay: "80ms" }}>
                {BRAND.intro}
              </p>
              <div className="re-rise mt-8 max-w-[880px] sm:mt-12" style={{ animationDelay: "160ms" }}>
                <HeroSearch base={base} />
              </div>
            </div>
          </div>
          <nav aria-label="Popular neighborhoods" className="-mt-5 flex flex-wrap justify-center gap-2 px-4">
            {HOODS.filter((h) => ["harbor-point", "old-mill", "cedar-heights", "westshore"].includes(h.slug)).map((h) => (
              <Link key={h.slug} href={`${to(base, "buy")}?hood=${h.slug}`} className="dc-card relative rounded-full px-4 py-2 text-[14px] font-semibold text-[color:var(--dc-accent)] shadow-md hover:bg-muted">
                {h.name}
              </Link>
            ))}
          </nav>
        </section>

        <Section id="re-new" title="New this week" link={{ href: to(base, "buy"), label: `See all ${forSale.length} homes` }} className={cn(WRAP, "mt-14 sm:mt-20")}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fresh.map((l) => (
              <li key={l.slug}>
                <ListingCard base={base} l={l} onHover />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="re-hoods" title="Browse by neighborhood" link={{ href: to(base, "neighborhoods"), label: "All neighborhoods" }} className={cn(WRAP, "mt-16 sm:mt-24")}>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {HOODS.map((h) => (
              <li key={h.slug}>
                <Link href={to(base, "neighborhoods", h.slug)} className="group relative block aspect-[16/7] overflow-hidden rounded-[var(--dc-radius-card)] max-sm:aspect-[4/3]">
                  <Photo src={h.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.05]" />
                  <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.62),transparent_60%)]" aria-hidden="true" />
                  <span className="absolute bottom-3 left-4 text-white">
                    <span className="dc-h block text-[clamp(1.2rem,2vw,1.6rem)] leading-tight">{h.name}</span>
                    <span className="text-[14px] font-medium text-white/85">{h.homes} homes</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="re-services" title="However you're moving, we can help" className={cn(WRAP, "mt-16 sm:mt-24")}>
          <Services base={base} />
        </Section>

        <section aria-labelledby="re-worth" className="dc-band mt-16 sm:mt-24">
          <div className={cn(WRAP, "grid gap-10 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14")}>
            <div>
              <h2 id="re-worth" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-tight">
                What&apos;s your home worth?
              </h2>
              <p className="mt-3 max-w-[34em] text-[17px] opacity-90">Get a free valuation from an agent who has sold on your street, within two days.</p>
              <ValuationStart base={base} />
            </div>
            <div className="lg:border-l lg:border-[color:var(--dc-band-line)] lg:pl-12">
              <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                {(
                  [
                    [money(MARKET.median), "Median sale price"],
                    [`${MARKET.days} days`, "Average time on market"],
                    [`${MARKET.aboveAsking}%`, "Sold above asking"],
                  ] as const
                ).map(([v, k]) => (
                  <div key={k}>
                    <dt className="sr-only">{k}</dt>
                    <dd>
                      <span className="dc-h block text-[clamp(1.3rem,2vw,1.9rem)] leading-none whitespace-nowrap tabular-nums">{v}</span>
                      <span className="mt-2 block text-[14px] opacity-85">{k}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[13px] opacity-70">
                {BRAND.city}, {MARKET.period}
              </p>
            </div>
          </div>
        </section>

        <Section id="re-afford" title="What can you afford?" link={{ href: to(base, "mortgage"), label: "Mortgage calculator" }} className={cn(WRAP, "mt-16 sm:mt-24")}>
          <Affordability base={base} />
        </Section>

        <Section id="re-reviews" title="Moves we've helped with" className={cn(WRAP, "mt-16 sm:mt-24")}>
          <Reviews base={base} />
        </Section>

        <Section id="re-agents" title="Meet our agents" link={{ href: to(base, "agents"), label: "All agents" }} className={cn(WRAP, "mt-16 sm:mt-24")}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS.filter((a) => !a.private).map((a) => (
              <li key={a.slug}>
                <AgentCard base={base} a={a} />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="re-journal" title="From the journal" link={{ href: to(base, "journal"), label: "All articles" }} className={cn(WRAP, "mt-16 sm:mt-24")}>
          <ul className="grid gap-3 lg:grid-cols-3">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <article className="dc-card group relative flex h-full gap-4 p-3">
                  <div className="w-32 shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
                    <Photo src={p.photo} alt="" className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="py-1">
                    <Badge>{p.category}</Badge>
                    <h3 className="mt-2 text-[16px] leading-snug font-semibold">
                      <Link href={to(base, "journal", p.slug)} className="after:absolute after:inset-0">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">{formatDate(p.date)}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <section aria-labelledby="re-faq" className={cn(WRAP, "mt-16 sm:mt-24")}>
          <Questions base={base} />
        </section>

        <section aria-labelledby="re-popular" className={cn(WRAP, "mt-16 mb-16 border-t border-border pt-10 sm:mt-24 sm:mb-20")}>
          <h2 id="re-popular" className="dc-h mb-6 text-[clamp(1.4rem,2.2vw,1.8rem)] leading-tight">
            Popular searches
          </h2>
          <PopularSearches base={base} />
        </section>
      </main>
      <PlatformFooter base={base} />
    </>
  )
}

export function BoutiqueHome({ base }: { base: string }) {
  const featured = LISTINGS.find((l) => l.private && l.status === "sale" && l.price === Math.max(...LISTINGS.filter((x) => x.private).map((x) => x.price))) ?? LISTINGS[0]
  const current = LISTINGS.filter((l) => l.status === "sale" && l.slug !== featured.slug)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3)
  const director = agentOf(PRIVATE_OFFICE.agent)
  const hoods = ["westshore", "bellmont", "harbor-point", "old-mill"].map(hoodOf)
  return (
    <>
      <section aria-labelledby="re-b-hero" className="relative h-[min(100svh,880px)] min-h-[560px] overflow-hidden text-white">
        <Photo src={featured.photos[0]} alt={`${fullAddress(featured)} at dusk`} priority className="re-zoom absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_10_30/0.45),transparent_28%,transparent_55%,rgb(10_10_30/0.65))]" aria-hidden="true" />
        <BoutiqueHeader base={base} current="home" overlay />
        <div className={cn(WRAP, "absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 pb-10 sm:pb-14")}>
          <div>
            <h1 id="re-b-hero" className="re-rise dc-h max-w-[12em] text-[clamp(2.8rem,7vw,6rem)] leading-[0.95]">
              {BRAND.privateTagline}
            </h1>
            <p className="re-rise mt-4 text-[clamp(1rem,1.4vw,1.2rem)] text-white/90" style={{ animationDelay: "90ms" }}>
              {BRAND.privateIntro}
            </p>
          </div>
          <Link href={to(base, "homes", featured.slug)} className="group inline-flex items-center gap-2 text-[15px] text-white/95 hover:text-white">
            Featured · {fullAddress(featured)} · {money(featured.price)}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <main id="main" className="flex-1">
        <section aria-labelledby="re-b-featured" className={cn(WRAP, "grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-14")}>
          <div className="aspect-[16/10] overflow-hidden">
            <Photo src={featured.photos[1] ?? featured.photos[0]} alt={`Inside ${fullAddress(featured)}`} />
          </div>
          <div>
            <p className="text-[15px] text-muted-foreground">Featured residence</p>
            <h2 id="re-b-featured" className="dc-h mt-2 text-[clamp(2.4rem,4.4vw,3.8rem)] leading-none">
              {fullAddress(featured)}
            </h2>
            <p className="mt-3 text-[18px]">
              {hoodOf(featured.hood).name} · {money(featured.price)}
            </p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {featured.beds} bedrooms · {featured.baths} baths · {plain(featured.sqft)} sq ft{featured.lot ? ` · ${featured.lot} acres` : ""}
            </p>
            <p className="mt-5 max-w-[34em] text-[16px] leading-relaxed text-muted-foreground">{featured.description[0]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<Link href={to(base, "homes", featured.slug)} />}>
                View the residence
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<Link href={to(base, "contact")} />}>
                Request the brochure
              </Button>
            </div>
          </div>
        </section>

        <Press />

        <section aria-labelledby="re-b-current" className={cn(WRAP, "pb-16 sm:pb-24")}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="re-b-current" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-none">
              Current residences
            </h2>
            <Link href={to(base, "buy")} className="inline-flex items-center gap-1.5 text-[15px] text-[color:var(--dc-accent)] hover:underline">
              View all residences <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-3">
            {current.map((l) => (
              <li key={l.slug}>
                <Link href={to(base, "homes", l.slug)} className="group block">
                  <span className="block aspect-[4/5] overflow-hidden">
                    <Photo src={l.photos[0]} alt={`${fullAddress(l)}, ${hoodOf(l.hood).name}`} className="transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]" />
                  </span>
                  <span className="dc-h mt-4 block text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight underline-offset-[6px] group-hover:underline">{fullAddress(l)}</span>
                  <span className="mt-1 block text-[15px] text-muted-foreground">
                    {hoodOf(l.hood).name} · {money(l.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Collections base={base} />

        <section aria-labelledby="re-b-director" className="dc-band">
          <div className={cn(WRAP, "grid gap-8 py-12 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center sm:gap-12 sm:py-16")}>
            <div className="aspect-[3/4] w-40 overflow-hidden sm:w-full">
              <Photo src={director.photo} alt={`Portrait of ${director.name}`} />
            </div>
            <div>
              <blockquote id="re-b-director" className="dc-h text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.08] italic">
                “{PRIVATE_OFFICE.quote}”
              </blockquote>
              <p className="mt-4 text-[16px]">
                {director.name}, {director.role}
              </p>
              <dl className="mt-6 flex flex-wrap divide-x divide-[color:var(--dc-band-line)]">
                {PRIVATE_OFFICE.stats.map(([v, k]) => (
                  <div key={k} className="pr-5 not-first:pl-5 sm:pr-8 sm:not-first:pl-8">
                    <dt className="sr-only">{k}</dt>
                    <dd>
                      <span className="dc-h block text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{v}</span>
                      <span className="text-[14px] opacity-80">{k}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <HowWeSell base={base} />

        <section aria-labelledby="re-b-sold" className={cn(WRAP, "py-14 sm:py-20")}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="re-b-sold" className="dc-h text-[clamp(2rem,3.6vw,3rem)] leading-none">
              Recently sold
            </h2>
            <Link href={to(base, searchPath("sold"))} className="inline-flex items-center gap-1.5 text-[15px] text-[color:var(--dc-accent)] hover:underline">
              View more sold homes <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {LISTINGS.filter((l) => l.status === "sold")
              .slice(0, 4)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={to(base, "homes", s.slug)} className="group block">
                    <span className="relative block aspect-[3/2] overflow-hidden">
                      <Photo src={s.photos[0]} alt={`${fullAddress(s)}, sold`} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                      <Badge className="absolute top-2.5 left-2.5 bg-[color:var(--dc-surface)] text-[color:var(--dc-ink)]">Sold</Badge>
                    </span>
                    <span className="mt-2 block text-[15px]">
                      {hoodOf(s.hood).name} · {money(s.price)}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <ClientWords />

        <section aria-labelledby="re-b-hoods" className={cn(WRAP, "py-14 sm:py-20")}>
          <h2 id="re-b-hoods" className="dc-h mb-4 text-[clamp(2rem,3.6vw,3rem)] leading-none">
            Neighborhoods
          </h2>
          <ul className="border-t border-border">
            {hoods.map((h) => (
              <li key={h.slug} className="border-b border-border">
                <Link href={to(base, "neighborhoods", h.slug)} className="group relative grid items-center gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:gap-8">
                  <span className="dc-h text-[clamp(1.8rem,3.2vw,2.8rem)] leading-none transition-transform duration-500 group-hover:translate-x-2">{h.name}</span>
                  <span className="text-[15px] text-muted-foreground sm:pr-[260px]">{h.blurb}</span>
                  <span className="pointer-events-none absolute top-1/2 right-0 hidden h-[120%] w-[240px] -translate-y-1/2 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block" aria-hidden="true">
                    <Photo src={h.photo} alt="" />
                  </span>
                  <ArrowUpRight className="absolute top-1/2 right-2 size-5 -translate-y-1/2 transition-opacity group-hover:opacity-0 max-sm:hidden" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <BoutiqueJournal base={base} />

        <section aria-labelledby="re-b-quiet" className="border-t border-border">
          <div className={cn(WRAP, "grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16")}>
            <div>
              <h2 id="re-b-quiet" className="dc-h text-[clamp(2.2rem,4vw,3.4rem)] leading-none">
                Planning a quiet sale?
              </h2>
              <p className="mt-4 max-w-[28em] text-[16px] text-muted-foreground">Tell us about your property, and we&apos;ll be in touch for a confidential conversation. Many of our homes sell before they are ever listed.</p>
            </div>
            <NoteForm id="re-quiet" />
          </div>
        </section>
      </main>
      <BoutiqueFooter base={base} />
    </>
  )
}
