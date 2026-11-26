"use client"

// A shop page (all products, a department or a collection): department chips with counts, filters on
// the left (department, price, color, material, availability), sort, 3 or 4 columns and "Load more".
// Every filter goes into the address bar, so a filtered page can be shared. On a phone the filters
// open in a sheet.
import { ChevronDown, LayoutGrid, Grid3x3, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { Photo, ProductCard } from "./cards"
import { CATEGORIES, FAMILIES, MATERIALS, PRODUCTS, type CategoryId, type Material, type Product, type Variant } from "./data"
import { bestSelling, categoryOf, familyOf, inCollection, inStock, productOf, shopPath, to, type ShopId } from "./site"
import { useRecent } from "./store"
import { OUTLINE } from "./styles"

const SORTS = { best: "Best selling", new: "Newest", "price-asc": "Price, low to high", "price-desc": "Price, high to low" } as const
type Sort = keyof typeof SORTS
const PAGE = 12
const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 50) * 50

type Filters = { cats: CategoryId[]; min: number; max: number; colors: string[]; materials: Material[]; stock: boolean; sale: boolean; sort: Sort; cols: 3 | 4 }

function parse(search: string): Filters {
  const q = new URLSearchParams(search)
  const list = <T extends string>(k: string, all: readonly T[]) => (q.get(k)?.split(",").filter((x): x is T => (all as readonly string[]).includes(x)) ?? [])
  return {
    cats: list("cat", CATEGORIES.map((c) => c.id)),
    min: Math.max(0, Number(q.get("min")) || 0),
    max: Math.max(0, Number(q.get("max")) || 0),
    colors: list("color", FAMILIES.map((f) => f.name)),
    materials: list("material", MATERIALS),
    stock: q.get("stock") === "1",
    sale: q.get("sale") === "1",
    sort: (q.get("sort") ?? "") in SORTS ? (q.get("sort") as Sort) : "best",
    cols: q.get("cols") === "4" ? 4 : 3,
  }
}

function query(f: Filters, drop: (keyof Filters)[] = []) {
  const q = new URLSearchParams()
  const on = (k: keyof Filters) => !drop.includes(k)
  if (on("cats") && f.cats.length) q.set("cat", f.cats.join(","))
  if (on("min") && f.min) q.set("min", String(f.min))
  if (on("max") && f.max) q.set("max", String(f.max))
  if (on("colors") && f.colors.length) q.set("color", f.colors.join(","))
  if (on("materials") && f.materials.length) q.set("material", f.materials.join(","))
  if (on("stock") && f.stock) q.set("stock", "1")
  if (on("sale") && f.sale) q.set("sale", "1")
  if (on("sort") && f.sort !== "best") q.set("sort", f.sort)
  if (on("cols") && f.cols === 4) q.set("cols", "4")
  const s = q.toString()
  return s ? `?${s}` : ""
}

const priceOk = (p: Product, f: Filters) => (!f.min || p.price >= f.min) && (!f.max || p.price <= f.max)

/** Everything but the department: the chips count with this. */
function matchesRest(p: Product, f: Filters) {
  return (
    priceOk(p, f) &&
    (!f.colors.length || p.colors.some((c) => f.colors.includes(familyOf(c)))) &&
    (!f.materials.length || (p.material && f.materials.includes(p.material))) &&
    (!f.stock || inStock(p)) &&
    (!f.sale || !!p.compareAt)
  )
}

function sortList(list: Product[], sort: Sort) {
  if (sort === "new") return [...list].sort((a, b) => b.added.localeCompare(a.added) || a.rank - b.rank)
  if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price || a.rank - b.rank)
  if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price || a.rank - b.rank)
  return bestSelling(list)
}

const noop = () => () => {}

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (on: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-[15px]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-[18px] shrink-0 cursor-pointer rounded accent-[color:var(--dc-primary)]" />
      {children}
    </label>
  )
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-[15px]">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-[color:var(--input)] transition-colors aria-checked:bg-primary"
      >
        <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
      </button>
    </label>
  )
}

function PriceRange({ f, set }: { f: Filters; set: (p: Partial<Filters>) => void }) {
  const max = f.max || PRICE_MAX
  const pct = (n: number) => (n / PRICE_MAX) * 100
  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[color:var(--dc-primary)] [&::-moz-range-thumb]:bg-card [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[color:var(--dc-primary)] [&::-webkit-slider-thumb]:bg-card"
  return (
    <div>
      <div className="relative mx-2.5 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${pct(f.min)}%`, right: `${100 - pct(max)}%` }} />
        <input type="range" min={0} max={PRICE_MAX} step={5} value={f.min} onChange={(e) => set({ min: Math.min(Number(e.target.value), max - 5) })} aria-label="Lowest price" className={cn(thumb, "-mx-2.5 w-[calc(100%+1.25rem)]")} />
        <input type="range" min={0} max={PRICE_MAX} step={5} value={max} onChange={(e) => set({ max: Math.max(Number(e.target.value), f.min + 5) >= PRICE_MAX ? 0 : Math.max(Number(e.target.value), f.min + 5) })} aria-label="Highest price" className={cn(thumb, "-mx-2.5 w-[calc(100%+1.25rem)]")} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        {(
          [
            ["min", f.min, "Lowest price"],
            ["max", max, "Highest price"],
          ] as const
        ).map(([k, v, label], i) => (
          <span key={k} className="contents">
            {i ? <span className="text-muted-foreground">–</span> : null}
            <label className="flex h-10 min-w-0 flex-1 items-center gap-1 rounded-[var(--radius)] border border-[color:var(--input)] bg-card px-3 text-[15px]">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={PRICE_MAX}
                value={v}
                aria-label={label}
                onChange={(e) => {
                  const n = Math.max(0, Math.min(PRICE_MAX, Number(e.target.value) || 0))
                  set(k === "min" ? { min: n } : { max: n >= PRICE_MAX ? 0 : n })
                }}
                className="dc-num w-full min-w-0 bg-transparent outline-none"
              />
            </label>
          </span>
        ))}
      </div>
    </div>
  )
}

function FilterPanel({ f, set, base, showCats, counts }: { f: Filters; set: (p: Partial<Filters>) => void; base: Product[]; showCats: boolean; counts: Record<string, number> }) {
  const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x])
  const families = FAMILIES.filter((fam) => base.some((p) => p.colors.some((c) => familyOf(c) === fam.name)))
  const materials = MATERIALS.filter((m) => base.some((p) => p.material === m))
  return (
    <div>
      {showCats ? (
        <Group title="Category">
          {CATEGORIES.filter((c) => base.some((p) => p.category === c.id)).map((c) => (
            <Check key={c.id} checked={f.cats.includes(c.id)} onChange={() => set({ cats: toggle(f.cats, c.id) })}>
              {c.name} <span className="text-muted-foreground">({counts[c.id] ?? 0})</span>
            </Check>
          ))}
        </Group>
      ) : null}
      <Group title="Price">
        <PriceRange f={f} set={set} />
      </Group>
      {families.length ? (
        <Group title="Color">
          <div className="grid grid-cols-5 gap-x-1 gap-y-3">
            {families.map((fam) => {
              const on = f.colors.includes(fam.name)
              return (
                <button key={fam.name} type="button" aria-pressed={on} onClick={() => set({ colors: toggle(f.colors, fam.name) })} className="group flex cursor-pointer flex-col items-center gap-1 text-[12px]">
                  <span className={cn("grid size-9 place-items-center rounded-full transition-shadow", on ? "shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--dc-primary)]" : "group-hover:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--border)]")}>
                    <span className="size-8 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.14)]" style={{ background: fam.hex }} />
                  </span>
                  <span className={cn("text-muted-foreground", on && "font-semibold text-foreground")}>{fam.name}</span>
                </button>
              )
            })}
          </div>
        </Group>
      ) : null}
      {materials.length > 1 ? (
        <Group title="Material">
          {materials.slice(0, 7).map((m) => (
            <Check key={m} checked={f.materials.includes(m)} onChange={() => set({ materials: toggle(f.materials, m) })}>
              {m}
            </Check>
          ))}
          {materials.length > 7 ? (
            <details className="group/more">
              <summary className="mt-1 cursor-pointer list-none text-[14px] font-medium text-[color:var(--dc-accent)] underline-offset-4 hover:underline group-open/more:hidden [&::-webkit-details-marker]:hidden">+ {materials.length - 7} more</summary>
              {materials.slice(7).map((m) => (
                <Check key={m} checked={f.materials.includes(m)} onChange={() => set({ materials: toggle(f.materials, m) })}>
                  {m}
                </Check>
              ))}
            </details>
          ) : null}
        </Group>
      ) : null}
      <Group title="Availability">
        <Switch label="In stock only" checked={f.stock} onChange={(stock) => set({ stock })} />
        <Switch label="On sale" checked={f.sale} onChange={(sale) => set({ sale })} />
      </Group>
    </div>
  )
}

export function ShopView({ base, id, look, title, lead }: { base: string; id: ShopId; look: Variant; title: string; lead: string }) {
  const pathname = usePathname()
  const search = useSyncExternalStore(noop, () => window.location.search, () => "")
  const [picked, setPicked] = useState<Filters | null>(null)
  const [shown, setShown] = useState(PAGE)
  const [hidden, setHidden] = useState(false)
  const f = picked ?? parse(search)
  const recent = useRecent()

  const set = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch }
    setPicked(next)
    setShown(PAGE)
    window.history.replaceState(window.history.state, "", pathname + query(next))
  }

  const isCategory = CATEGORIES.some((c) => c.id === id)
  const isCollection = !isCategory && id !== "all"
  // The products this page is about, before any filter.
  const base_ = useMemo(() => PRODUCTS.filter((p) => inCollection(p, id)), [id])
  const rest = base_.filter((p) => matchesRest(p, f))
  const counts: Record<string, number> = { all: rest.length }
  for (const c of CATEGORIES) counts[c.id] = rest.filter((p) => p.category === c.id).length
  const list = sortList(
    rest.filter((p) => !f.cats.length || f.cats.includes(p.category)),
    f.sort,
  )
  const visible = list.slice(0, shown)

  // On "Shop all" and a department page the chips go to the department pages; in a collection
  // (gifts, sale, new) they narrow the collection.
  const chipHref = (cat: CategoryId | "all") => {
    if (isCollection) return pathname + query({ ...f, cats: cat === "all" ? [] : [cat] })
    return to(base, cat === "all" ? "shop" : shopPath(cat)) + query(f, ["cats"])
  }
  const chipOn = (cat: CategoryId | "all") => (isCollection ? (cat === "all" ? !f.cats.length : f.cats.length === 1 && f.cats[0] === cat) : cat === "all" ? id === "all" : id === cat)
  const chips = [{ id: "all" as const, name: "All", photo: isCollection ? base_[0]?.photos[0] : "plates-sage" }, ...CATEGORIES.map((c) => ({ id: c.id, name: c.name, photo: PRODUCTS.find((p) => p.category === c.id && (!isCollection || inCollection(p, id)))?.photos[0] ?? c.photo }))].filter((c) => c.id === "all" || !isCollection || base_.some((p) => p.category === c.id))

  const active: { label: string; clear: Partial<Filters> }[] = [
    ...f.cats.map((c) => ({ label: categoryOf(c).name, clear: { cats: f.cats.filter((x) => x !== c) } })),
    ...(f.stock ? [{ label: "In stock", clear: { stock: false } }] : []),
    ...(f.sale ? [{ label: "On sale", clear: { sale: false } }] : []),
    ...(f.min || f.max ? [{ label: f.min && f.max ? `$${f.min}–$${f.max}` : f.max ? `Under $${f.max}` : `Over $${f.min}`, clear: { min: 0, max: 0 } }] : []),
    ...f.colors.map((c) => ({ label: c, clear: { colors: f.colors.filter((x) => x !== c) } })),
    ...f.materials.map((m) => ({ label: m, clear: { materials: f.materials.filter((x) => x !== m) } })),
  ]
  const clearAll = () => set({ cats: [], min: 0, max: 0, colors: [], materials: [], stock: false, sale: false })
  const recentList = recent.map(productOf).filter((p): p is Product => !!p).slice(0, 4)
  const panel = <FilterPanel f={f} set={set} base={base_} showCats={!isCategory} counts={counts} />

  return (
    <>
      <div className="pt-4 pb-5 sm:pt-5">
        <h1 className="ec-rise dc-h flex flex-wrap items-baseline gap-x-3 text-[clamp(2rem,4vw,3rem)] leading-[1.05]">
          {title}
          <span className="font-[family-name:var(--dc-font-body)] text-[17px] font-normal tracking-normal text-muted-foreground" aria-live="polite">
            {list.length} {list.length === 1 ? "result" : "results"}
          </span>
        </h1>
        <p className="ec-rise mt-2 max-w-[42em] text-[17px] text-muted-foreground">{lead}</p>
      </div>
      <ul className="ec-scroll -mx-1 flex gap-3 overflow-x-auto px-1 py-1" aria-label="Departments">
        {chips.map((c) => (
          <li key={c.id} className="shrink-0">
            <Link
              href={chipHref(c.id)}
              aria-current={chipOn(c.id) ? "page" : undefined}
              scroll={false}
              className="flex h-[68px] items-center gap-3 rounded-[var(--dc-radius-card)] border border-border bg-card pr-4 pl-2 text-[14px] whitespace-nowrap transition-colors hover:border-foreground/40 aria-[current=page]:border-[color:var(--dc-primary)] aria-[current=page]:shadow-[inset_0_0_0_1px_var(--dc-primary)]"
            >
              {c.photo ? (
                <span className="size-[52px] shrink-0 overflow-hidden rounded-full">
                  <Photo src={c.photo} alt="" />
                </span>
              ) : null}
              <span>
                {c.name} <span className="text-muted-foreground">({c.id === "all" ? counts.all : counts[c.id]})</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-border py-3">
        <button type="button" onClick={() => setHidden(!hidden)} className="hidden h-9 cursor-pointer items-center gap-2 rounded-[var(--radius)] px-2 text-[15px] font-medium hover:bg-muted lg:inline-flex" aria-expanded={!hidden} aria-controls="ec-filters">
          <SlidersHorizontal className="size-4" aria-hidden="true" /> {hidden ? "Show filters" : "Hide filters"}
        </button>
        <Sheet>
          <SheetTrigger className={cn(OUTLINE, "h-9 px-3 text-[14px] lg:hidden")}>
            <SlidersHorizontal className="size-4" aria-hidden="true" /> Filters{active.length ? ` (${active.length})` : ""}
          </SheetTrigger>
          <SheetContent side="left" className="w-[88%] gap-0 overflow-y-auto p-5 sm:max-w-sm">
            <SheetTitle className="dc-h mb-5 text-[24px]">Filters</SheetTitle>
            {panel}
            <p className="mt-5 text-[14px] text-muted-foreground">{list.length} results</p>
          </SheetContent>
        </Sheet>
        <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          {active.map((a) => (
            <li key={a.label}>
              <button type="button" onClick={() => set(a.clear)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[var(--radius)] bg-muted pr-2 pl-3 text-[14px] hover:bg-foreground/10" aria-label={`Remove filter ${a.label}`}>
                {a.label} <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          {active.length ? (
            <li>
              <button type="button" onClick={clearAll} className="cursor-pointer px-1 text-[14px] font-medium text-[color:var(--dc-accent)] underline underline-offset-4 hover:no-underline">
                Clear all
              </button>
            </li>
          ) : null}
        </ul>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[14px]">
            <span className="text-muted-foreground max-sm:sr-only">Sort by:</span>
            <span className="relative">
              <select value={f.sort} onChange={(e) => set({ sort: e.target.value as Sort })} className="h-9 cursor-pointer appearance-none rounded-[var(--radius)] bg-transparent pr-7 pl-1 font-semibold text-[color:var(--dc-accent)] hover:bg-muted">
                {(Object.keys(SORTS) as Sort[]).map((s) => (
                  <option key={s} value={s}>
                    {SORTS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-4 -translate-y-1/2 text-[color:var(--dc-accent)]" aria-hidden="true" />
            </span>
          </label>
          <div className="hidden gap-1 lg:flex" role="group" aria-label="Columns">
            {([3, 4] as const).map((n) => (
              <button key={n} type="button" aria-pressed={f.cols === n} aria-label={`${n} columns`} onClick={() => set({ cols: n })} className="grid size-9 cursor-pointer place-items-center rounded-[var(--radius)] text-muted-foreground hover:bg-muted aria-pressed:bg-primary aria-pressed:text-primary-foreground">
                {n === 3 ? <LayoutGrid className="size-[18px]" aria-hidden="true" /> : <Grid3x3 className="size-[18px]" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("mt-6 grid gap-8", !hidden && "lg:grid-cols-[250px_minmax(0,1fr)]")}>
        {!hidden ? (
          <aside id="ec-filters" aria-label="Filters" className="hidden lg:block">
            {panel}
          </aside>
        ) : null}
        <div>
          {visible.length ? (
            <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3", f.cols === 4 && "lg:grid-cols-4", hidden && f.cols === 3 && "xl:grid-cols-3")}>
              {visible.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard base={base} p={p} look={look} priority={i < 6} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--dc-radius-card)] border border-dashed border-border px-6 py-16 text-center">
              <p className="dc-h text-[22px]">Nothing matches all of that</p>
              <p className="mt-2 text-[15px] text-muted-foreground">Try fewer filters, or a wider price range.</p>
              <button type="button" onClick={clearAll} className={cn(OUTLINE, "mt-5 h-10 px-4 text-[14px]")}>
                Clear all filters
              </button>
            </div>
          )}
          {list.length ? (
            <div className="mx-auto mt-10 flex max-w-[360px] flex-col items-center text-center">
              <p className="text-[14px] text-muted-foreground">
                Showing {visible.length} of {list.length}
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(visible.length / list.length) * 100}%` }} />
              </div>
              {visible.length < list.length ? (
                <button type="button" onClick={() => setShown(shown + PAGE)} className={cn(OUTLINE, "mt-4 h-10 min-w-[160px] border-[color:var(--dc-accent)] px-5 text-[15px] text-[color:var(--dc-accent)]")}>
                  Load more
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {recentList.length ? (
        <section aria-labelledby="ec-recent" className="mt-14 border-t border-border pt-8">
          <h2 id="ec-recent" className="dc-h text-[clamp(1.4rem,2.2vw,1.75rem)]">
            Recently viewed
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentList.map((p) => (
              <li key={p.slug}>
                <Link href={to(base, "products", p.slug)} className="dc-card flex items-center gap-4 overflow-hidden pr-4 hover:border-foreground/30">
                  <span className="h-16 w-24 shrink-0 overflow-hidden">
                    <Photo src={p.photos[0]} alt="" />
                  </span>
                  <span className="text-[15px] leading-snug">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
