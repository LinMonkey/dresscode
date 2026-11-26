"use client"

// The home pages' moving parts: the best sellers with department tabs and arrows, and "Shop the
// room" with hotspots on the photo and one button for the whole bed.
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { Photo, Price, ProductCard } from "./cards"
import { CATEGORIES, HOME_DEPARTMENT, PRODUCTS, type CategoryId } from "./data"
import { bestSelling, linePrice, money, productOf, to } from "./site"
import { cart } from "./store"
import { OUTLINE, PRIMARY } from "./styles"

const TABS: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORIES.filter((c) => ["kitchen-dining", "bedding", "bath-body"].includes(c.id)).map((c) => ({ id: c.id, label: c.short })),
]

export function BestSellers({ base }: { base: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all")
  const row = useRef<HTMLUListElement>(null)
  // New things have their own row further down.
  const list = bestSelling(PRODUCTS.filter((p) => p.badge !== "New" && (tab === "all" || p.category === tab))).slice(0, 8)
  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" })
  return (
    <section aria-labelledby="ec-best">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id="ec-best" className="dc-h text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight">
          Best sellers
        </h2>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Department" className="flex gap-1 text-[15px]">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id)
                  row.current?.scrollTo({ left: 0 })
                }}
                className="relative h-9 cursor-pointer px-3 text-muted-foreground hover:text-foreground aria-selected:font-semibold aria-selected:text-[color:var(--dc-accent)] aria-selected:after:absolute aria-selected:after:inset-x-2 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-[color:var(--dc-accent)]"
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="ml-2 hidden gap-1.5 sm:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label="Scroll back" className="grid size-9 cursor-pointer place-items-center rounded-full border border-[color:var(--input)] hover:bg-muted">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Scroll forward" className="grid size-9 cursor-pointer place-items-center rounded-full border border-[color:var(--input)] hover:bg-muted">
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
      <ul ref={row} className="ec-scroll -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2" role="tabpanel" aria-labelledby="ec-best">
        {list.map((p, i) => (
          <li key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]">
            <ProductCard base={base} p={p} priority={i < 5} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ShopTheRoom({ base }: { base: string }) {
  const room = HOME_DEPARTMENT.room
  const items = room.items.map((it) => ({ ...it, p: productOf(it.slug)! }))
  const [open, setOpen] = useState<number | null>(1)
  const [added, setAdded] = useState<string | null>(null)
  const total = items.reduce((n, it) => n + linePrice({ slug: it.slug, size: it.size }), 0)
  const add = (list: typeof items, key: string) => {
    cart.add(list.map((it) => ({ slug: it.slug, color: it.color, size: it.size })))
    setAdded(key)
    setTimeout(() => setAdded(null), 1600)
  }
  return (
    <section aria-labelledby="ec-room" className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
      <div className="relative z-[1] aspect-[3/2] lg:aspect-[16/9]">
        {/* The photo clips to its corners; the hotspots' cards may hang over the edge. */}
        <Photo src={room.photo} alt="A bed made with an oat linen duvet cover, a rust check wool throw and a lit candle on the nightstand" className="absolute inset-0 rounded-[var(--dc-radius-card)]" />
        {items.map((it, i) => (
          <div key={it.slug} className="absolute" style={{ left: `${it.at[0]}%`, top: `${it.at[1]}%` }}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-label={`${it.p.name}${it.color ? `, ${it.color}` : ""}`}
              className="grid size-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white text-[#141414] shadow-[0_0_0_6px_rgb(255_255_255/0.35)] transition-transform hover:scale-110"
            >
              {open === i ? <X className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
            </button>
            {open === i ? (
              <div className={cn("absolute top-5 z-10 flex w-[248px] gap-3 rounded-[var(--dc-radius-card)] bg-white p-2.5 text-[#141414] shadow-[0_14px_34px_-14px_rgb(0_0_0/0.5)]", it.at[0] > 55 ? "right-0" : "left-0")}>
                <span className="size-16 shrink-0 overflow-hidden rounded-[var(--radius)] bg-[#f4f3f0]">
                  <Photo src={it.p.photos[0]} alt="" className="bg-transparent" />
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={`${to(base, "products", it.slug)}${it.color ? `?color=${encodeURIComponent(it.color)}` : ""}`} className="block text-[13px] leading-snug font-medium hover:underline">
                    {it.p.name.replace(/, \d+ oz$/, "")}
                    {it.color ? ` · ${it.color}` : ""}
                  </Link>
                  <Price p={it.p} size={it.size} className="text-[13px] font-semibold [&_s]:text-black/50" />
                  <button type="button" onClick={() => add([it], it.slug)} className="mt-1.5 block h-7 w-full cursor-pointer rounded-[calc(var(--radius)-2px)] bg-[color:var(--dc-primary)] text-[12px] font-semibold text-[color:var(--dc-primary-fg)] dark:bg-[#141414] dark:text-white">
                    {added === it.slug ? "Added" : "Add to cart"}
                  </button>
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div>
        <h2 id="ec-room" className="dc-h text-[clamp(1.6rem,2.6vw,2.1rem)] leading-tight">
          {room.title}
        </h2>
        <p className="mt-1 text-[15px] text-muted-foreground">{room.text}</p>
        <ul className="mt-4 divide-y divide-border rounded-[var(--dc-radius-card)] border border-border bg-card">
          {items.map((it) => (
            <li key={it.slug} className="flex items-center gap-3 p-3">
              <span className="size-14 shrink-0 overflow-hidden rounded-[var(--radius)]">
                <Photo src={it.p.photos[0]} alt="" />
              </span>
              <span className="min-w-0 flex-1">
                <Link href={to(base, "products", it.slug)} className="block text-[15px] leading-snug font-medium hover:underline">
                  {it.p.name.replace(/, \d+ oz$/, "")}
                </Link>
                <span className="block text-[13px] text-muted-foreground">{[it.color, it.size?.replace("Full/Queen", "Queen")].filter(Boolean).join(" · ") || "8 oz"}</span>
                <Price p={it.p} size={it.size} className="text-[14px] font-semibold" />
              </span>
              <button type="button" onClick={() => add([it], it.slug)} className={cn(OUTLINE, "h-9 border-[color:var(--dc-accent)] px-4 text-[14px] text-[color:var(--dc-accent)]")}>
                {added === it.slug ? "Added" : "Add"}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => add(items, "all")} className={cn(PRIMARY, "mt-4 h-12 w-full text-[16px]")}>
          {added === "all" ? "Added all 3" : <>Add all {items.length} to cart · {money(total)}</>}
        </button>
      </div>
    </section>
  )
}
