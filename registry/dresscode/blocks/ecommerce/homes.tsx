// The two home pages.
// DepartmentHome: a promo mosaic, departments, best sellers with tabs, the store's promises, "Shop the
// room", new arrivals and the journal; for a store with many lines.
// BrandHome: a full-bleed photograph, best sellers, rooms, one colored band about the material, a
// product story, customers' words and the makers; for a brand that makes its own things.
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Dot, Photo, ProductCard, Section } from "./cards"
import { CATEGORIES, COLLECTIONS, HOME_BRAND, HOME_DEPARTMENT, POSTS, PRODUCTS, REVIEWS, type Post } from "./data"
import { BestSellers, ShopTheRoom } from "./home-client"
import { PageFrame } from "./shell"
import { formatDate, fromPrice, productOf, shopPath, to } from "./site"
import { PRIMARY, WRAP } from "./styles"

export function JournalCard({ base, post, look = "department" }: { base: string; post: Post; look?: "department" | "brand" | "stack" }) {
  if (look === "stack")
    return (
      <article className="group relative">
        <div className="aspect-[3/2] overflow-hidden rounded-[var(--dc-radius-card)]">
          <Photo src={post.photo} alt="" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
        <p className="mt-3 text-[13px] font-medium text-[color:var(--dc-accent)]">{post.tag}</p>
        <h3 className="dc-h mt-1 text-[21px] leading-snug">
          <Link href={to(base, "journal", post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-[15px] text-muted-foreground">{post.summary}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {formatDate(post.date)} · {post.minutes} min read
        </p>
      </article>
    )
  return (
    <article className="dc-card group relative flex overflow-hidden">
      <div className="w-[42%] shrink-0 overflow-hidden">
        <Photo src={post.photo} alt="" className="aspect-[4/3] h-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="flex min-w-0 flex-col p-4">
        <span className="dc-pill dc-pill-hl self-start">{post.tag}</span>
        <h3 className="dc-h mt-2 text-[17px] leading-snug">
          <Link href={to(base, "journal", post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-auto pt-2 text-[12px] text-muted-foreground">
          {formatDate(post.date)} · {post.minutes} min read
        </p>
      </div>
    </article>
  )
}

export function DepartmentHome({ base }: { base: string }) {
  const h = HOME_DEPARTMENT
  const fresh = PRODUCTS.filter((p) => p.badge === "New").sort((a, b) => a.rank - b.rank)
  const order = ["gooseneck-kettle", "merino-crew-sweater", "linen-napkins", "canvas-weekender"]
  fresh.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
  return (
    <PageFrame base={base} look="department" current="home">
      <section aria-labelledby="ec-hero" className={cn(WRAP, "grid gap-4 pt-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]")}>
        <div className="relative min-h-[380px] overflow-hidden rounded-[var(--dc-radius-card)] lg:min-h-[460px]">
          <Photo src={h.hero.photo} alt="A table set with sage stoneware plates and bowls, linen napkins, glasses and bread" priority className="ec-zoom absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_12_20/0.72),rgb(10_12_20/0.25)_45%,transparent_70%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <h1 id="ec-hero" className="ec-rise dc-h text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1]">
              {h.hero.title}
            </h1>
            <p className="ec-rise mt-3 max-w-[34em] text-[16px] text-white/90 sm:text-[17px]" style={{ animationDelay: "80ms" }}>
              {h.hero.text}
            </p>
            <Link href={to(base, h.hero.href)} className="ec-rise mt-5 inline-flex h-11 items-center rounded-[var(--radius)] bg-white px-5 text-[15px] font-semibold text-[color:var(--dc-primary)] hover:bg-white/90 dark:text-[#141414]" style={{ animationDelay: "140ms" }}>
              {h.hero.cta}
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {h.promos.map((p, i) => (
            <Link key={p.title} href={to(base, p.href)} className="group relative grid grid-cols-[1fr_44%] items-center overflow-hidden rounded-[var(--dc-radius-card)] bg-card">
              <div className="p-5 sm:p-6">
                {p.kicker ? <p className="text-[14px] font-semibold">{p.kicker}</p> : null}
                <p className={cn("dc-h leading-[1.05]", i === 1 ? "mt-1 text-[clamp(2rem,3.4vw,2.6rem)]" : "text-[clamp(1.4rem,2.2vw,1.75rem)]")}>
                  {i === 1 ? <span className="dc-mark-highlighter">{p.title}</span> : p.title}
                </p>
                <p className="mt-2 text-[14px] text-muted-foreground">{p.text}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] group-hover:underline">
                  {p.cta} <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
              <Photo src={p.photo} alt="" className="h-full" imgClassName="transition-transform duration-500 group-hover:scale-105" contain />
            </Link>
          ))}
        </div>
      </section>

      <Section id="ec-depts" title="Shop by department" className={cn(WRAP, "mt-12")}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[...CATEGORIES.map((c) => ({ name: c.name, path: shopPath(c.id), photo: c.photo })), { name: COLLECTIONS.gifts.name, path: "shop/gifts", photo: COLLECTIONS.gifts.photo }].map((d) => (
            <li key={d.name}>
              <Link href={to(base, d.path)} className="group block overflow-hidden rounded-[var(--dc-radius-card)] bg-card">
                <span className="block aspect-[5/3] overflow-hidden">
                  <Photo src={d.photo} alt="" imgClassName="transition-transform duration-500 group-hover:scale-[1.06]" />
                </span>
                <span className="block px-3 py-2.5 text-center text-[15px] font-medium group-hover:underline">{d.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className={cn(WRAP, "mt-12")}>
        <BestSellers base={base} />
      </div>

      <div className={cn(WRAP, "mt-8")}>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-b border-border py-4 text-[15px]">
          {h.promises.map((p, i) => (
            <li key={p} className="flex items-center gap-6">
              {i ? <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" /> : null}
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className={cn(WRAP, "mt-12")}>
        <ShopTheRoom base={base} />
      </div>

      <Section id="ec-new" title="New arrivals" link={{ href: to(base, "shop/new"), label: "See all" }} className={cn(WRAP, "mt-14")}>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {fresh.map((p) => (
            <li key={p.slug}>
              <ProductCard base={base} p={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="ec-journal" title="From the journal" link={{ href: to(base, "journal"), label: "All stories" }} className={cn(WRAP, "mt-14")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <JournalCard base={base} post={p} />
            </li>
          ))}
        </ul>
      </Section>
    </PageFrame>
  )
}

export function BrandHome({ base }: { base: string }) {
  const h = HOME_BRAND
  const best = ["washed-linen-duvet-cover", "percale-sheet-set", "waffle-bath-towel", "merino-crew-sweater"].map((s) => productOf(s)!)
  const skillet = productOf(h.story.slug)!
  const words = REVIEWS.filter((r) => r.featured)
  return (
    <PageFrame base={base} look="brand" current="home">
      <section aria-labelledby="ec-hero" className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative min-h-[460px] overflow-hidden rounded-[var(--dc-radius-card)] sm:min-h-[560px]">
          <Photo src={h.hero.photo} alt="A bed made with an oat washed linen duvet cover in morning light" priority className="ec-zoom absolute inset-0" imgClassName="object-[70%_50%]" />
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgb(28_22_14/0.72)_0%,rgb(28_22_14/0.5)_34%,rgb(28_22_14/0.08)_62%,transparent_78%)]" aria-hidden="true" />
          <div className="relative flex min-h-[460px] flex-col justify-center px-6 py-12 text-white sm:min-h-[560px] sm:px-12 lg:px-16">
            <h1 id="ec-hero" className="ec-rise dc-h max-w-[9.5em] text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[0.98]">
              {h.hero.title}
            </h1>
            <p className="ec-rise mt-4 max-w-[27em] text-[17px] text-white/90 sm:text-[19px]" style={{ animationDelay: "80ms" }}>
              {h.hero.text}
            </p>
            <div className="ec-rise mt-7 flex flex-wrap items-center gap-6" style={{ animationDelay: "140ms" }}>
              <Link href={to(base, h.hero.href)} className="dc-h inline-flex h-12 items-center rounded-[var(--radius)] bg-[color:var(--dc-page)] px-6 text-[17px] text-[color:var(--dc-ink)] hover:opacity-90 dark:bg-[#F5F1E6] dark:text-[#141414]">
                {h.hero.cta}
              </Link>
              <Link href={to(base, h.hero.linkHref)} className="inline-flex items-center gap-1.5 text-[16px] underline underline-offset-4 hover:no-underline">
                {h.hero.link} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <Link href={to(base, h.hero.tagHref)} className="absolute right-4 bottom-4 hidden rounded-full bg-white/85 px-4 py-2 text-[13px] text-[#141414] backdrop-blur hover:bg-white sm:block">
            {h.hero.tag} →
          </Link>
        </div>
      </section>

      <Section id="ec-best" title="Our best sellers" link={{ href: to(base, "shop"), label: "Shop all" }} className={cn(WRAP, "mt-12")}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {best.map((p, i) => (
            <li key={p.slug}>
              <ProductCard base={base} p={p} look="brand" priority={i < 2} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="ec-rooms" title="Shop by room" className={cn(WRAP, "mt-14")}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {h.rooms.map((r) => (
            <li key={r.name}>
              <Link href={to(base, r.href)} className="group relative block aspect-[16/9] overflow-hidden rounded-[var(--dc-radius-card)]">
                <Photo src={r.photo} alt="" imgClassName="transition-transform duration-700 group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.55),transparent_55%)]" aria-hidden="true" />
                <span className="dc-h absolute bottom-4 left-5 flex items-center gap-2 text-[24px] text-white">
                  {r.name} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="ec-band" className="dc-band mt-14">
        <div className={cn(WRAP, "grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:gap-14")}>
          <div>
            <h2 id="ec-band" className="dc-h max-w-[12em] text-[clamp(2rem,3.6vw,3rem)] leading-[1.02]">
              {h.band.title}
            </h2>
            <p className="mt-4 max-w-[34em] text-[17px] opacity-90">{h.band.text}</p>
            <Link href={to(base, h.band.href)} className={cn(PRIMARY, "mt-6 h-11 px-5 text-[15px]")}>
              {h.band.cta}
            </Link>
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-8 lg:border-l lg:border-[color:var(--dc-band-line)] lg:pl-12">
            {h.band.facts.map(([v, k], i) => (
              <div key={k} className="contents">
                <dt className={cn("dc-h py-4 text-[clamp(1.8rem,3vw,2.5rem)] leading-none whitespace-nowrap", i ? "border-t border-[color:var(--dc-band-line)]" : "pt-0")}>{v}</dt>
                <dd className={cn("py-4 text-[16px] opacity-90", i ? "border-t border-[color:var(--dc-band-line)]" : "pt-0")}>{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="ec-story" className={cn(WRAP, "mt-14 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14")}>
        <div className="aspect-[3/2] overflow-hidden rounded-[var(--dc-radius-card)]">
          <Photo src={h.story.photo} alt="A clay enameled cast iron skillet on a gas stove with two fried eggs and kale" />
        </div>
        <div>
          <p className="dc-h text-[16px] italic">{h.story.kicker}</p>
          <h2 id="ec-story" className="dc-h mt-1 text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05]">
            {h.story.title}
          </h2>
          <p className="mt-3 max-w-[32em] text-[17px] text-muted-foreground">{h.story.text}</p>
          <div className="mt-5 flex items-center gap-2.5" aria-label="Colors">
            {skillet.colors.map((c, i) => (
              <Link key={c.name} href={`${to(base, "products", skillet.slug)}?color=${encodeURIComponent(c.name)}`} aria-label={c.name} title={c.name} className={cn("grid size-9 place-items-center rounded-full", i === 0 && "ring-2 ring-foreground ring-offset-2 ring-offset-background")}>
                <Dot color={c} className="size-8" />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-[16px]">{fromPrice(skillet)}</p>
          <Link href={to(base, "products", skillet.slug)} className={cn(PRIMARY, "mt-4 h-11 px-5 text-[15px]")}>
            Shop the skillet
          </Link>
        </div>
      </section>

      <Section id="ec-words" title="In their words" className={cn(WRAP, "mt-14")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {words.map((r) => {
            const p = productOf(r.product)!
            return (
              <li key={r.name} className="dc-card flex flex-col p-6">
                <blockquote className="dc-h text-[19px] leading-snug">&ldquo;{r.body}&rdquo;</blockquote>
                <p className="mt-auto pt-4 text-[14px] font-semibold">
                  {r.name}
                  {r.city ? `, ${r.city}` : ""}
                </p>
                <Link href={to(base, "products", p.slug)} className="text-[14px] text-muted-foreground hover:underline">
                  {p.name} in {r.variant.split(",")[0]}
                </Link>
              </li>
            )
          })}
        </ul>
      </Section>

      <section aria-labelledby="ec-maker" className={cn(WRAP, "mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-14")}>
        <div>
          <h2 id="ec-maker" className="dc-h text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05]">
            {h.maker.title}
          </h2>
          <p className="mt-3 max-w-[30em] text-[17px] text-muted-foreground">{h.maker.text}</p>
          <Link href={to(base, "about")} className="mt-4 inline-flex items-center gap-1.5 text-[16px] font-medium text-[color:var(--dc-accent)] underline underline-offset-4 hover:no-underline">
            Our story <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="aspect-[16/9] overflow-hidden rounded-[var(--dc-radius-card)]">
          <Photo src={h.maker.photo} alt="A seamstress sewing linen at a sewing machine in a small workshop" imgClassName="object-[50%_40%]" />
        </div>
      </section>
    </PageFrame>
  )
}
