// Pieces the pages share: photos (product shots blend into the card color), badges, prices, color
// dots, the product card in both looks and section headings.
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { ON_WHITE, photo } from "./assets"
import { STORE, type Color, type Product, type Variant } from "./data"
import { coverOf, fromPrice, money, salePercent, stockOf, to } from "./site"
import { QuickAdd, SaveButton } from "./ui"

/** A photo that fills its box. Product shots on white sit in a "well" tinted to the theme and are
 *  blended into it (multiply), so the white disappears; scenes fill the box. */
export function Photo({ src, alt, className, imgClassName, priority, contain }: { src: string; alt: string; className?: string; imgClassName?: string; priority?: boolean; contain?: boolean }) {
  const white = ON_WHITE.has(src)
  return (
    <span className={cn("block size-full overflow-hidden", white && "ec-well", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("size-full", white ? cn("mix-blend-multiply", contain ? "object-contain" : "object-cover") : "object-cover", src.startsWith("model") && "object-[50%_18%]", imgClassName)}
      />
    </span>
  )
}

export function Badge({ children, tone = "hl", className }: { children: ReactNode; tone?: "hl" | "sale" | "line"; className?: string }) {
  return (
    <span
      className={cn(
        "dc-pill h-6 px-2 text-[12px] font-semibold",
        tone === "hl" && "dc-pill-hl",
        tone === "sale" && "bg-[color:var(--dc-danger)] text-white",
        tone === "line" && "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ProductBadge({ p, className }: { p: Product; className?: string }) {
  if (p.compareAt) return <Badge tone="sale" className={className}>{`Sale −${salePercent(p)}%`}</Badge>
  if (p.badge) return <Badge className={className}>{p.badge}</Badge>
  return null
}

export function Price({ p, size, className, exact }: { p: Product; size?: string; className?: string; exact?: boolean }) {
  const price = size ? (p.sizes?.find((s) => s.name === size)?.price ?? p.price) : undefined
  if (p.compareAt)
    return (
      <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
        <span className="text-[color:var(--dc-danger)]">{money(price ?? p.price, exact)}</span>
        <s className="text-[0.88em] font-normal text-muted-foreground">{money(p.compareAt, exact)}</s>
        <span className="sr-only">, was {money(p.compareAt)}</span>
      </span>
    )
  return <span className={cn("tabular-nums", className)}>{price !== undefined ? money(price, exact) : fromPrice(p)}</span>
}

/** A color dot; checks are drawn as a small check. */
export function Dot({ color, className, style }: { color: Pick<Color, "hex" | "check" | "name">; className?: string; style?: CSSProperties }) {
  const check = color.check
    ? { backgroundImage: `linear-gradient(90deg, rgb(255 255 255 / 0.55) 50%, transparent 50%), linear-gradient(rgb(255 255 255 / 0.55) 50%, transparent 50%)`, backgroundSize: "50% 50%" }
    : undefined
  return <span className={cn("inline-block shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.14)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28)]", className)} style={{ background: color.hex, ...check, ...style }} />
}

export function Dots({ colors, max = 4, className }: { colors: Color[]; max?: number; className?: string }) {
  if (!colors.length) return null
  const shown = colors.slice(0, max)
  return (
    <span className={cn("flex items-center gap-1.5", className)} aria-label={`${colors.length} colors: ${colors.map((c) => c.name).join(", ")}`} role="img">
      {shown.map((c) => (
        <Dot key={c.name} color={c} className="size-3.5" />
      ))}
      {colors.length > max ? <span className="text-[12px] text-muted-foreground">+{colors.length - max}</span> : null}
    </span>
  )
}

function lowStock(p: Product) {
  if (p.colors.length || p.sizes?.length) return null
  const n = stockOf(p)
  return n > 0 && n <= STORE.lowStock ? n : null
}

/** A product card. department: square-ish photo on the card color, bold name, dots and price; on
 *  hover a quick add rises. brand: a larger serif name and the color under it. */
export function ProductCard({ base, p, look = "department", className, priority, sizes = "md", hoverPhoto = true }: { base: string; p: Product; look?: Variant; className?: string; priority?: boolean; sizes?: "sm" | "md"; hoverPhoto?: boolean }) {
  const second = hoverPhoto ? p.photos[1] : undefined
  const low = lowStock(p)
  const brand = look === "brand"
  return (
    <article className={cn("group relative flex flex-col", brand && "h-full rounded-[var(--dc-radius-card)] border-[length:var(--dc-bw)] border-[color:var(--dc-card-border)] bg-card p-2 pb-3", className)}>
      <div
        className={cn(
          "ec-card-photo relative aspect-[4/3] overflow-hidden transition-shadow",
          brand ? "rounded-[calc(var(--dc-radius-card)-6px)]" : "rounded-[var(--dc-radius-card)] group-hover:shadow-[0_0_0_1.5px_var(--dc-primary)]",
        )}
      >
        <Photo src={coverOf(p)} alt={p.name} priority={priority} className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]" />
        {second ? <Photo src={second} alt="" className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden" /> : null}
        <ProductBadge p={p} className="absolute top-2.5 left-2.5 z-[1]" />
        <SaveButton slug={p.slug} label={p.name} className="absolute top-2 right-2 z-[2]" />
        <QuickAdd p={p} look={look} />
      </div>
      <div className={cn("flex flex-1 flex-col pt-3", brand && "px-2")}>
        <h3 className={cn(brand ? "dc-h text-[18px] leading-snug" : "text-[15px] leading-snug font-medium", sizes === "sm" && "text-[14px]")}>
          <Link href={to(base, "products", p.slug)} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        {brand && p.colors[0] ? <p className="mt-0.5 text-[13px] text-muted-foreground">{p.colors[0].name}</p> : null}
        <Dots colors={p.colors} className="mt-2" />
        <p className={cn("mt-auto flex items-baseline gap-2 pt-2 text-[15px]", !brand && "font-semibold")}>
          <Price p={p} />
          {low ? <span className="text-[13px] font-medium text-[color:var(--dc-danger)]">Only {low} left</span> : null}
        </p>
      </div>
    </article>
  )
}

/** A row card: photo left; name, price and colors right. For "You may also like". */
export function CompactCard({ base, p, className }: { base: string; p: Product; className?: string }) {
  return (
    <article className={cn("dc-card group relative flex items-center gap-4 p-2.5 transition-colors hover:border-foreground/30", className)}>
      <div className="aspect-square w-[42%] max-w-[132px] shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
        <Photo src={p.photos[0]} alt="" imgClassName="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1 py-1 pr-1">
        <h3 className="text-[15px] leading-snug font-semibold">
          <Link href={to(base, "products", p.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[15px]">
          <Price p={p} />
        </p>
        <Dots colors={p.colors} className="mt-3" />
      </div>
    </article>
  )
}

/** A small horizontal card: photo left, name and price right. */
export function MiniCard({ base, p, className, children }: { base: string; p: Product; className?: string; children?: ReactNode }) {
  return (
    <article className={cn("dc-card relative flex items-center gap-3 p-2.5", className)}>
      <div className="size-20 shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
        <Photo src={p.photos[0]} alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] leading-snug font-medium">
          <Link href={to(base, "products", p.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 text-[14px] font-semibold">
          <Price p={p} />
        </p>
        {children}
      </div>
    </article>
  )
}

/** Section heading with an optional link (or anything) on the right. */
export function Section({ title, link, id, children, className, right, headingClassName }: { title: string; link?: { href: string; label: string }; id?: string; children: ReactNode; className?: string; right?: ReactNode; headingClassName?: string }) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id={id} className={cn("dc-h text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight", headingClassName)}>
          {title}
        </h2>
        {right}
        {link ? (
          <Link href={link.href} className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
            {link.label} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
