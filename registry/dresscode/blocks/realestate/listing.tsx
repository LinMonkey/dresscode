// One home: the photos, the price and the numbers, the description and facts, the floor plan, the
// neighborhood and its schools, what it costs each month, its price history and similar homes, with
// the tour card beside it all the way down.
import { ArrowLeft, Bath, BedDouble, Calendar, Car, Flame, Home, Snowflake, Wallet } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Badge, badgeText, ListingCard } from "./cards"
import { BRAND, LISTINGS, type Variant } from "./data"
import { FloorPlan, PaymentCalculator, PhotoMosaic, SectionTabs, ShareButton, TourCard } from "./listing-client"
import { CityMap } from "./map"
import { PageFrame, WRAP } from "./shell"
import { agentOf, formatMonth, fullAddress, hoodOf, listingOf, money, payment, plain, searchPath, to } from "./site"
import { SaveButton } from "./ui"

function Block({ id, title, children, className }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={cn("scroll-mt-32 border-t border-border pt-8", className)}>
      <h2 id={`${id}-h`} className="dc-h mb-5 text-[24px] leading-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ListingPage({ base, variant, slug }: { base: string; variant: Variant; slug: string }) {
  const l = listingOf(slug)
  if (!l) return null
  const hood = hoodOf(l.hood)
  const agent = agentOf(l.agent)
  const badge = badgeText(l)
  const monthly = l.status === "sale" ? payment(l.price).total : null
  const similar = LISTINGS.filter((x) => x.slug !== l.slug && x.status === l.status)
    .sort((a, b) => Math.abs(a.price - l.price) - Math.abs(b.price - l.price))
    .slice(0, 3)
  const facts: [typeof Home, string, string][] = [
    [Home, "Home type", l.type === "House" ? "Single family" : l.type],
    [Calendar, "Year built", `Built ${l.year}`],
    [Car, "Parking", l.parking],
    [Flame, "Heating", l.heating],
    [Snowflake, "Cooling", l.cooling],
    [Wallet, "HOA", l.hoa ? `${money(l.hoa)}/mo` : "No HOA"],
  ]
  const tabs: [string, string][] = [
    ["overview", "Overview"],
    ["facts", "Facts"],
    ["floor-plan", "Floor plan"],
    ["neighborhood", "Neighborhood"],
    ...(l.status === "sale" ? ([["payment", "Payment"]] as [string, string][]) : []),
    ["history", "History"],
  ]

  return (
    <PageFrame base={base} variant={variant} current="listing">
      <div className={cn(WRAP, "pt-5")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href={to(base, searchPath(l.status))} className="inline-flex items-center gap-1.5 text-[15px] font-medium hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to search
          </Link>
          <div className="flex items-center gap-2">
            <SaveButton slug={l.slug} label={fullAddress(l)} className="size-9 rounded-[var(--radius)] border border-[color:var(--input)] bg-card text-foreground shadow-none" />
            <ShareButton title={`${fullAddress(l)}, ${BRAND.city}`} />
          </div>
        </div>
        <PhotoMosaic photos={l.photos} alt={`${fullAddress(l)}, ${hood.name}`} floorPlanHref="#floor-plan" />
      </div>

      <div className={cn(WRAP, "mt-8 grid gap-10 pb-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12")}>
        <article className="min-w-0">
          <header id="overview" className="scroll-mt-32">
            <div className="flex flex-wrap gap-2">
              {badge ? <Badge>{badge}</Badge> : null}
              <Badge className="bg-muted text-foreground">{{ sale: "For sale", rent: "For rent", sold: "Sold" }[l.status]}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="dc-h text-[clamp(2.2rem,4vw,3rem)] leading-none tabular-nums">{money(l.price, l.status)}</p>
              {monthly ? (
                <a href="#payment" className="text-[15px] text-muted-foreground underline-offset-4 hover:underline">
                  Est. {money(monthly)}/mo
                </a>
              ) : null}
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[18px] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="size-5 text-muted-foreground" aria-hidden="true" /> {l.beds} bd
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bath className="size-5 text-muted-foreground" aria-hidden="true" /> {l.baths} ba
              </span>
              <span>{plain(l.sqft)} sq ft</span>
              {l.lot ? <span>{l.lot} acre lot</span> : null}
            </p>
            <h1 className="mt-2 text-[17px] text-muted-foreground">
              {fullAddress(l)}, {hood.name}, {BRAND.city}
            </h1>
            {l.openHouse ? <p className="mt-3 text-[15px] font-semibold text-[color:var(--dc-accent)]">Open house {l.openHouse}</p> : null}
          </header>

          <div className="mt-6">
            <SectionTabs items={tabs} />
          </div>

          <section aria-labelledby="about-h" className="mt-6">
            <h2 id="about-h" className="dc-h mb-3 text-[24px]">
              About this home
            </h2>
            <div className="grid max-w-[46em] gap-3 text-[16px] leading-relaxed text-muted-foreground">
              {l.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-5 grid gap-2 text-[15px] sm:grid-cols-2">
              {l.features.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--dc-primary)]" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </section>

          <Block id="facts" title="Facts" className="mt-10">
            <dl className="grid overflow-hidden rounded-[var(--dc-radius-card)] border border-border sm:grid-cols-3">
              {facts.map(([Icon, label, value]) => (
                <div key={label} className="flex items-center gap-3 border-border p-4 not-last:border-b sm:border-r sm:[&:nth-child(3n)]:border-r-0 sm:[&:nth-child(-n+3)]:border-b">
                  <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <dt className="text-[13px] text-muted-foreground">{label}</dt>
                    <dd className="text-[15px] font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="floor-plan" title="Floor plan" className="mt-10">
            <FloorPlan floors={l.floors} beds={l.beds} />
            <p className="mt-3 text-[13px] text-muted-foreground">Drawn for marketing; rooms and sizes are approximate.</p>
          </Block>

          <Block id="neighborhood" title={`Neighborhood: ${hood.name}`} className="mt-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-[var(--dc-radius-card)] border border-border">
                <CityMap base={base} listings={[l]} still className="size-full" />
              </div>
              <div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{hood.description}</p>
                <h3 className="mt-4 text-[15px] font-semibold">Schools</h3>
                <table className="mt-2 w-full text-[14px]">
                  <tbody>
                    {hood.schools.map(([name, rating, miles]) => (
                      <tr key={name} className="border-b border-border last:border-0">
                        <td className="py-2">{name}</td>
                        <td className="py-2 text-right font-semibold tabular-nums">{rating}/10</td>
                        <td className="py-2 pl-3 text-right text-muted-foreground tabular-nums">{miles} mi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <dl className="mt-4 grid grid-cols-3 divide-x divide-border text-center">
                  {(
                    [
                      ["Walk", hood.scores.walk],
                      ["Transit", hood.scores.transit],
                      ["Bike", hood.scores.bike],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[13px] text-muted-foreground">{k}</dt>
                      <dd className="dc-h text-[26px] leading-tight tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={to(base, "neighborhoods", hood.slug)} className="mt-4 inline-block text-[15px] font-semibold text-[color:var(--dc-accent)] hover:underline">
                  More about {hood.name} →
                </Link>
              </div>
            </div>
          </Block>

          {l.status === "sale" ? (
            <Block id="payment" title="Payment calculator" className="mt-10">
              <PaymentCalculator price={l.price} />
              <p className="mt-4 text-[13px] text-muted-foreground">An estimate, not an offer of credit. Property tax and insurance are typical for {BRAND.city}.</p>
            </Block>
          ) : null}

          <Block id="history" title="Price history" className="mt-10">
            <div className="overflow-x-auto rounded-[var(--dc-radius-card)] border border-border">
              <table className="w-full min-w-[420px] text-[15px]">
                <thead className="bg-muted/60 text-left text-[13px] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Event</th>
                    <th className="px-4 py-2.5 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {l.history.map(([date, event, price]) => (
                    <tr key={date + event} className="border-t border-border">
                      <td className="px-4 py-2.5">{formatMonth(date)}</td>
                      <td className="px-4 py-2.5">{event}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{money(price, event.includes("rent") ? "rent" : undefined)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TourCard address={fullAddress(l)} agentName={agent.name} agentRole={`${l.agent === "elena-marsh" ? "Fieldhouse Private" : "Listing agent · " + BRAND.name}`} agentPhone={agent.phone} agentPhoto={agent.photo} />
          <p className="mt-3 px-1 text-[13px] text-muted-foreground">
            Listed {formatMonth(l.listed)} by{" "}
            <Link href={to(base, "agents", agent.slug)} className="underline-offset-4 hover:underline">
              {agent.name}
            </Link>
            . Information is believed accurate but not guaranteed.
          </p>
        </aside>
      </div>

      {similar.length ? (
        <section aria-labelledby="similar-h" className="border-t border-border bg-card/60 py-12">
          <div className={WRAP}>
            <h2 id="similar-h" className="dc-h mb-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
              Similar homes nearby
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((x) => (
                <li key={x.slug}>
                  <ListingCard base={base} l={x} onHover />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PageFrame>
  )
}
