// Cards the pages share: a listing (photo, badge, heart, price, specs, address), an agent and a photo.
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { photo } from "./assets"
import type { Agent, Listing } from "./data"
import { fullAddress, hoodOf, money, specs, to } from "./site"
import { SaveButton } from "./ui"

/** A photo that fills its box. Give the box a size or an aspect ratio. */
export function Photo({ src, alt, className, priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo(src)} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={cn("size-full object-cover", className)} />
  )
}

export function Badge({ children, className }: { children: string; className?: string }) {
  return <span className={cn("dc-pill dc-pill-hl h-6 px-2.5 text-[12px] font-semibold shadow-sm", className)}>{children}</span>
}

export function badgeText(l: Listing) {
  if (l.status === "sold") return "Sold"
  if (l.status === "rent" && !l.badge) return "For rent"
  if (l.badge === "Open house" && l.openHouse) return `Open ${l.openHouse}`
  return l.badge
}

export function ListingCard({ base, l, className, onHover, active, ratio = "4/3" }: { base: string; l: Listing; className?: string; onHover?: boolean; active?: boolean; ratio?: string }) {
  const badge = badgeText(l)
  const hood = hoodOf(l.hood)
  return (
    <article className={cn("group relative overflow-hidden rounded-[var(--dc-radius-card)] border-[length:var(--dc-bw)] border-[color:var(--dc-card-border)] bg-card shadow-[var(--dc-shadow)] transition-[box-shadow,border-color,translate] duration-200", active && "border-[color:var(--dc-accent)] ring-1 ring-[color:var(--dc-accent)]", onHover && "hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgb(0_0_0/0.35)]", className)}>
      <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
        <Photo src={l.photos[0]} alt={`${fullAddress(l)}, ${hood.name}`} className="transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]" />
        {badge ? <Badge className="absolute top-3 left-3">{badge}</Badge> : null}
        <SaveButton slug={l.slug} label={fullAddress(l)} className="absolute top-2.5 right-2.5 z-10" />
      </div>
      <div className="p-4">
        <p className="dc-h text-[22px] leading-none tabular-nums">{money(l.price, l.status)}</p>
        <p className="mt-2 text-[14px] text-muted-foreground">{specs(l)}</p>
        <h3 className="mt-1 truncate text-[15px] font-medium">
          <Link href={to(base, "homes", l.slug)} className="after:absolute after:inset-0">
            {fullAddress(l)}
          </Link>
          <span className="text-muted-foreground"> · {hood.name}</span>
        </h3>
      </div>
    </article>
  )
}

export function AgentCard({ base, a, className }: { base: string; a: Agent; className?: string }) {
  return (
    <article className={cn("dc-card relative flex items-center gap-4 p-3", className)}>
      <div className="size-20 shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
        <Photo src={a.photo} alt={`Portrait of ${a.name}`} />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[16px] font-semibold">
          <Link href={to(base, "agents", a.slug)} className="after:absolute after:inset-0">
            {a.name}
          </Link>
        </h3>
        <p className="truncate text-[14px] text-muted-foreground">{a.role}</p>
        <p className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-[color:var(--dc-accent)]">
          View listings <ArrowRight className="size-3.5" aria-hidden="true" />
        </p>
      </div>
    </article>
  )
}

/** Section heading with an optional link on the right. */
export function Section({ title, link, id, children, className }: { title: string; link?: { href: string; label: string }; id?: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id={id} className="dc-h text-[clamp(1.7rem,2.8vw,2.3rem)] leading-tight">
          {title}
        </h2>
        {link ? (
          <Link href={link.href} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] hover:underline">
            {link.label} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
