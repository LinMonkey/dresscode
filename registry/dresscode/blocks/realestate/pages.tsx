// The other pages: search, agents and an agent, neighborhoods and one neighborhood, sell (the valuation),
// the mortgage calculator, compare, saved homes, the journal and a post, about, contact and the 404.
import { ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AgentCard, Badge, ListingCard, Photo } from "./cards"
import { AGENTS, BRAND, HOODS, LISTINGS, MARKET, POSTS, TESTIMONIALS, type Status, type Variant } from "./data"
import { NoteForm, ValuationSteps } from "./forms"
import { PaymentCalculator } from "./listing-client"
import { CityMap } from "./map"
import { PlatformHeader, PageFrame, PageIntro, WRAP, BoutiqueHeader } from "./shell"
import { SearchView } from "./search"
import { agentOf, formatDate, hoodOf, money, to } from "./site"
import { CompareHomes, SavedHomes } from "./tools"

type P = { base: string; variant: Variant }

export function SearchPage({ base, variant, status }: P & { status: Status }) {
  return (
    <>
      {variant === "boutique" ? <BoutiqueHeader base={base} current="search" /> : <PlatformHeader base={base} current="search" />}
      <main id="main" className="flex-1">
        <SearchView base={base} status={status} />
      </main>
    </>
  )
}

export function AgentsPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="agents">
      <PageIntro title="Agents who live where they sell" lead={`${BRAND.agents} agents across ${BRAND.city}. Every one of them lives in the neighborhoods they cover.`} />
      <ul className={cn(WRAP, "grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3")}>
        {AGENTS.map((a) => (
          <li key={a.slug}>
            <AgentCard base={base} a={a} className="h-full" />
          </li>
        ))}
      </ul>
    </PageFrame>
  )
}

export function AgentPage({ base, variant, slug }: P & { slug: string }) {
  const a = agentOf(slug)
  const homes = LISTINGS.filter((l) => l.agent === a.slug)
  return (
    <PageFrame base={base} variant={variant} current="agent">
      <section className={cn(WRAP, "grid gap-10 pt-10 pb-12 sm:pt-14 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14")}>
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-[var(--dc-radius-card)]">
            <Photo src={a.photo} alt={`Portrait of ${a.name}`} priority />
          </div>
          <div className="mt-4 grid gap-2 text-[15px]">
            <a href={`tel:${a.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 hover:underline">
              <Phone className="size-4 text-muted-foreground" aria-hidden="true" /> {a.phone}
            </a>
            <a href={`mailto:${a.email}`} className="inline-flex items-center gap-2 hover:underline">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" /> {a.email}
            </a>
          </div>
          <Button size="lg" className="mt-5 h-11 w-full text-[15px] font-semibold" nativeButton={false} render={<a href={`mailto:${a.email}?subject=A call`} />}>
            Book a call
          </Button>
        </div>
        <div>
          <h1 className="re-rise dc-h text-[clamp(2.4rem,4.6vw,3.6rem)] leading-none">{a.name}</h1>
          <p className="mt-2 text-[18px] text-muted-foreground">{a.role}</p>
          <p className="mt-6 max-w-[40em] text-[17px] leading-relaxed">{a.bio}</p>
          <dl className="mt-8 grid max-w-[560px] grid-cols-3 gap-4 border-y border-border py-6">
            {(
              [
                [String(a.sold), "Homes sold"],
                [`${a.days}`, "Median days on market"],
                [`${a.years}`, `Years in ${BRAND.city}`],
              ] as const
            ).map(([v, k]) => (
              <div key={k}>
                <dt className="sr-only">{k}</dt>
                <dd>
                  <span className="dc-h block text-[clamp(1.8rem,3vw,2.6rem)] leading-none tabular-nums">{v}</span>
                  <span className="mt-1.5 block text-[14px] text-muted-foreground">{k}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] text-muted-foreground">
            Covers{" "}
            {a.hoods.map((h, i) => (
              <span key={h}>
                {i ? " and " : ""}
                <Link href={to(base, "neighborhoods", h)} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {hoodOf(h).name}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </section>
      {homes.length ? (
        <section aria-labelledby="agent-homes" className={cn(WRAP, "pb-12")}>
          <h2 id="agent-homes" className="dc-h mb-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
            Active listings
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((l) => (
              <li key={l.slug}>
                <ListingCard base={base} l={l} onHover />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section aria-labelledby="agent-words" className={cn(WRAP, "pb-20")}>
        <h2 id="agent-words" className="dc-h mb-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
          What clients say
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.who} className="dc-card p-6">
              <blockquote className="text-[17px] leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-3 text-[14px] text-muted-foreground">{t.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}

export function HoodsPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="hoods">
      <PageIntro title={`The neighborhoods of ${BRAND.city}`} lead="What each part of the city is like, what homes cost there and what is for sale right now." />
      <div className={cn(WRAP, "pb-20")}>
        <div className="relative mb-10 h-[clamp(280px,40vw,460px)] overflow-hidden rounded-[var(--dc-radius-card)] border border-border">
          <CityMap base={base} listings={LISTINGS.filter((l) => l.status !== "sold")} className="size-full" />
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOODS.map((h) => (
            <li key={h.slug}>
              <Link href={to(base, "neighborhoods", h.slug)} className="group block">
                <span className="block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)]">
                  <Photo src={h.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.05]" />
                </span>
                <span className="dc-h mt-3 block text-[24px] leading-tight group-hover:underline">{h.name}</span>
                <span className="mt-1 block text-[15px] text-muted-foreground">{h.blurb}</span>
                <span className="mt-2 block text-[14px]">
                  {h.homes} homes · median {money(h.median)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  )
}

export function HoodPage({ base, variant, slug }: P & { slug: string }) {
  const h = hoodOf(slug)
  const homes = LISTINGS.filter((l) => l.hood === h.slug)
  return (
    <PageFrame base={base} variant={variant} current="hood">
      <section className="relative h-[clamp(320px,44vw,520px)] overflow-hidden text-white">
        <Photo src={h.photo} alt={`${h.name}, ${BRAND.city}`} priority className="re-zoom" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.6),transparent_55%)]" aria-hidden="true" />
        <div className={cn(WRAP, "absolute inset-x-0 bottom-0 pb-8")}>
          <p className="text-[15px] text-white/85">
            <Link href={to(base, "neighborhoods")} className="hover:underline">
              Neighborhoods
            </Link>{" "}
            / {BRAND.city}
          </p>
          <h1 className="re-rise dc-h mt-2 text-[clamp(2.6rem,6vw,4.6rem)] leading-none">{h.name}</h1>
        </div>
      </section>
      <section className={cn(WRAP, "grid gap-10 py-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14")}>
        <div>
          <p className="text-[clamp(1.2rem,1.8vw,1.5rem)] leading-relaxed">{h.description}</p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
            {(
              [
                [money(h.median), "Median price"],
                [String(h.homes), "Homes"],
                [String(h.scores.walk), "Walk score"],
              ] as const
            ).map(([v, k]) => (
              <div key={k}>
                <dt className="sr-only">{k}</dt>
                <dd>
                  <span className="dc-h block text-[clamp(1.5rem,2.6vw,2.2rem)] leading-none tabular-nums">{v}</span>
                  <span className="mt-1.5 block text-[14px] text-muted-foreground">{k}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-[17px] font-semibold">Schools</h2>
          <table className="mt-3 w-full text-[15px]">
            <tbody>
              {h.schools.map(([name, rating, miles]) => (
                <tr key={name} className="border-b border-border">
                  <td className="py-2.5">{name}</td>
                  <td className="py-2.5 text-right font-semibold tabular-nums">{rating}/10</td>
                  <td className="py-2.5 pl-3 text-right text-muted-foreground tabular-nums">{miles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[14px] text-muted-foreground">
            Transit {h.scores.transit} · Bike {h.scores.bike}
          </p>
        </div>
      </section>
      <section aria-labelledby="hood-homes" className={cn(WRAP, "pb-20")}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="hood-homes" className="dc-h text-[clamp(1.6rem,2.6vw,2.1rem)]">
            Homes in {h.name}
          </h2>
          <Link href={`${to(base, "buy")}?hood=${h.slug}`} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] hover:underline">
            Search {h.name} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {homes.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((l) => (
              <li key={l.slug}>
                <ListingCard base={base} l={l} onHover />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-muted-foreground">Nothing listed here this week. Save a search and we will tell you when something is.</p>
        )}
      </section>
    </PageFrame>
  )
}

export function SellPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="sell">
      <section className={cn(WRAP, "grid gap-10 pt-10 pb-20 sm:pt-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14")}>
        <div>
          <h1 className="re-rise dc-h text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.02]">What&apos;s your home worth?</h1>
          <p className="mt-4 max-w-[34em] text-[18px] text-muted-foreground">A free valuation from an agent who has sold on your street, with the three nearest sales it is based on. Within two working days.</p>
          <div className="mt-8">
            <ValuationSteps />
          </div>
        </div>
        <aside className="dc-card h-fit p-6">
          <h2 className="dc-h text-[22px]">What happens next</h2>
          <ol className="mt-4 grid gap-4 text-[15px]">
            {["We look at the last sales on your street and the homes for sale now.", "An agent who works your neighborhood writes a valuation and a price range.", "If you like, we visit and talk through how and when to sell. No pressure, no fee."].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[13px] font-bold text-[color:var(--dc-highlight-fg)]">{i + 1}</span>
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ol>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
            <div>
              <dt className="text-[13px] text-muted-foreground">Median days to sell</dt>
              <dd className="dc-h text-[26px] tabular-nums">{MARKET.days}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted-foreground">Sold above asking</dt>
              <dd className="dc-h text-[26px] tabular-nums">{MARKET.aboveAsking}%</dd>
            </div>
          </dl>
        </aside>
      </section>
    </PageFrame>
  )
}

export function MortgagePage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="mortgage">
      <PageIntro title="Mortgage calculator" lead="What a home costs each month: principal and interest, property tax and insurance. Move the sliders, or type a price." />
      <div className={cn(WRAP, "pb-20")}>
        <div className="dc-card p-6 sm:p-8">
          <PaymentCalculator price={MARKET.median} editablePrice />
        </div>
        <p className="mt-4 max-w-[48em] text-[13px] text-muted-foreground">An estimate, not an offer of credit. Property tax uses {BRAND.city}&apos;s average rate; your lender will give you the real numbers.</p>
      </div>
    </PageFrame>
  )
}

export function ComparePage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="compare">
      <PageIntro title="Compare homes" lead="Up to three homes side by side. Add one from the list, or compare the homes you saved." />
      <div className={cn(WRAP, "pb-20")}>
        <CompareHomes base={base} />
      </div>
    </PageFrame>
  )
}

export function SavedPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="saved">
      <PageIntro title="Saved homes" lead="Kept on this device. Sign in to keep them everywhere." />
      <div className={cn(WRAP, "pb-20")}>
        <SavedHomes base={base} />
      </div>
    </PageFrame>
  )
}

export function JournalPage({ base, variant }: P) {
  const [lead, ...rest] = POSTS
  return (
    <PageFrame base={base} variant={variant} current="journal">
      <PageIntro title="Journal" lead={`Guides to buying, selling and living in ${BRAND.city}.`} />
      <div className={cn(WRAP, "grid gap-10 pb-20")}>
        <Link href={to(base, "journal", lead.slug)} className="group grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <span className="block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)]">
            <Photo src={lead.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.04]" />
          </span>
          <span>
            <Badge>{lead.category}</Badge>
            <span className="dc-h mt-3 block text-[clamp(1.8rem,3vw,2.6rem)] leading-tight group-hover:underline">{lead.title}</span>
            <span className="mt-3 block text-[16px] text-muted-foreground">{lead.summary}</span>
            <span className="mt-3 block text-[14px] text-muted-foreground">{formatDate(lead.date)}</span>
          </span>
        </Link>
        <ul className="grid gap-6 sm:grid-cols-2">
          {rest.map((p) => (
            <li key={p.slug}>
              <Link href={to(base, "journal", p.slug)} className="group block">
                <span className="block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)]">
                  <Photo src={p.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.04]" />
                </span>
                <span className="mt-3 block">
                  <Badge>{p.category}</Badge>
                </span>
                <span className="dc-h mt-2 block text-[24px] leading-tight group-hover:underline">{p.title}</span>
                <span className="mt-2 block text-[15px] text-muted-foreground">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  )
}

export function PostPage({ base, variant, slug }: P & { slug: string }) {
  const p = POSTS.find((x) => x.slug === slug)
  if (!p) return null
  const next = POSTS[(POSTS.indexOf(p) + 1) % POSTS.length]
  return (
    <PageFrame base={base} variant={variant} current="post">
      <article className="pb-16">
        <header className={cn(WRAP, "max-w-[860px] pt-10 sm:pt-14")}>
          <p className="text-[15px]">
            <Link href={to(base, "journal")} className="text-muted-foreground hover:underline">
              Journal
            </Link>{" "}
            · <Badge>{p.category}</Badge>
          </p>
          <h1 className="re-rise dc-h mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">{p.title}</h1>
          <p className="mt-4 text-[19px] text-muted-foreground">{p.summary}</p>
          <p className="mt-3 text-[14px] text-muted-foreground">{formatDate(p.date)}</p>
        </header>
        <div className={cn(WRAP, "mt-8 max-w-[1040px]")}>
          <div className="aspect-[16/8] overflow-hidden rounded-[var(--dc-radius-card)]">
            <Photo src={p.photo} alt="" priority />
          </div>
        </div>
        <div className={cn(WRAP, "mt-10 grid max-w-[720px] gap-5 text-[18px] leading-[1.7]")}>
          {p.body.map((b, i) => (
            <div key={i} className="grid gap-4">
              {b.h ? <h2 className="dc-h mt-4 text-[26px] leading-tight">{b.h}</h2> : null}
              {b.p.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          ))}
        </div>
      </article>
      <nav aria-label="Next article" className={cn(WRAP, "max-w-[720px] border-t border-border pt-6 pb-20")}>
        <p className="text-[14px] text-muted-foreground">Next</p>
        <Link href={to(base, "journal", next.slug)} className="dc-h mt-1 inline-flex items-center gap-2 text-[24px] hover:underline">
          {next.title} <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </nav>
    </PageFrame>
  )
}

export function AboutPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="about">
      <PageIntro title={`A local brokerage, on Quay Street since ${BRAND.since}`} lead={`${BRAND.name} started with one desk and one agent. Today ${BRAND.agents} agents sell and let homes across ${BRAND.city}, and each of them lives in the neighborhoods they cover.`} />
      <div className={cn(WRAP, "grid gap-10 pb-12 md:grid-cols-3")}>
        {[
          ["Local first", "We only sell in Port Avery. We know which streets flood, which schools are full and which kitchen gets the morning sun."],
          ["Straight numbers", "Every valuation comes with the three sales it is based on. If a home is overpriced, we say so before it is listed."],
          ["One agent, start to finish", "The agent who values your home is the one who shows it, negotiates it and hands over the keys."],
        ].map(([t, b]) => (
          <div key={t} className="border-t border-border pt-5">
            <h2 className="dc-h text-[22px]">{t}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>
      <div className={cn(WRAP, "pb-20")}>
        <h2 className="dc-h mb-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">The team</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a) => (
            <li key={a.slug}>
              <AgentCard base={base} a={a} />
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  )
}

export function ContactPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="contact">
      <section className={cn(WRAP, "grid gap-10 pt-10 pb-20 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16")}>
        <div>
          <h1 className="re-rise dc-h text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.02]">Talk to us</h1>
          <p className="mt-4 max-w-[30em] text-[18px] text-muted-foreground">Buying, selling or just wondering what your street is worth: write, call or come by the office.</p>
          <dl className="mt-8 grid gap-4 text-[16px]">
            <div>
              <dt className="text-[13px] text-muted-foreground">Office</dt>
              <dd>{BRAND.address}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="hover:underline">
                  {BRAND.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${BRAND.email}`} className="hover:underline">
                  {BRAND.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted-foreground">Hours</dt>
              <dd>{BRAND.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="dc-card p-6 sm:p-8">
          <NoteForm id="re-contact" cta="Send message" />
        </div>
      </section>
    </PageFrame>
  )
}

export function NotFoundPage({ base, variant }: P) {
  return (
    <PageFrame base={base} variant={variant} current="not-found">
      <section className={cn(WRAP, "grid min-h-[56vh] place-items-center py-20 text-center")}>
        <div>
          <p className="dc-h text-[clamp(4rem,12vw,8rem)] leading-none text-[color:var(--dc-primary)]">404</p>
          <h1 className="dc-h mt-4 text-[clamp(1.8rem,3vw,2.4rem)]">This address isn&apos;t on our map.</h1>
          <p className="mt-3 text-[16px] text-muted-foreground">The home may have sold, or the link has a typo.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="h-11 px-5" nativeButton={false} render={<Link href={to(base, "buy")} />}>
              Search homes
            </Button>
            <Button variant="outline" size="lg" className="h-11 px-5" nativeButton={false} render={<Link href={to(base)} />}>
              Home
            </Button>
          </div>
        </div>
      </section>
    </PageFrame>
  )
}
