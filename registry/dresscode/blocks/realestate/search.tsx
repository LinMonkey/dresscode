"use client"

// Search: the homes as cards on the left and as pins on the map on the right. Filters (price, beds and
// baths, home type, features, a neighborhood, a drawn area) narrow both; hovering a card lights its pin.
// Everything you pick goes into the address bar, so a search can be shared or saved.
import { Check, ChevronDown, List, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { ListingCard } from "./cards"
import { BRAND, FEATURES, HOODS, LISTINGS, type Feature, type HomeType, type Status } from "./data"
import { CityMap, inArea, type Area } from "./map"
import { searchPath, short, to } from "./site"

const TYPES: HomeType[] = ["House", "Condo", "Townhouse", "Loft"]
const SORTS = { newest: "Newest", "price-desc": "Price (high to low)", "price-asc": "Price (low to high)", size: "Largest" } as const
type Sort = keyof typeof SORTS
const PAGE = 6

type Filters = {
  q: string
  hood: string
  min: number
  max: number
  beds: number
  baths: number
  types: HomeType[]
  tags: Feature[]
  open: boolean
  sort: Sort
  view: "list" | "map"
  page: number
  area: Area | null
}

const DEFAULTS: Filters = { q: "", hood: "", min: 0, max: 0, beds: 0, baths: 0, types: [], tags: [], open: false, sort: "newest", view: "list", page: 1, area: null }

function parse(search: string): Filters {
  const q = new URLSearchParams(search)
  const n = (k: string) => Number(q.get(k)) || 0
  const list = <T extends string>(k: string, all: readonly T[]) => (q.get(k)?.split(",").filter((x): x is T => (all as readonly string[]).includes(x)) ?? [])
  const area = q.get("area")?.split(",").map(Number)
  return {
    q: q.get("q") ?? "",
    hood: HOODS.some((h) => h.slug === q.get("hood")) ? q.get("hood")! : "",
    min: n("min"),
    max: n("max"),
    beds: n("beds"),
    baths: n("baths"),
    types: list("type", TYPES),
    tags: list("tags", FEATURES),
    open: q.get("open") === "1",
    sort: (q.get("sort") as Sort) in SORTS ? (q.get("sort") as Sort) : "newest",
    view: q.get("view") === "map" ? "map" : "list",
    page: Math.max(1, n("page")),
    area: area?.length === 4 && area.every(Number.isFinite) ? { x1: area[0], y1: area[1], x2: area[2], y2: area[3] } : null,
  }
}

function query(f: Filters) {
  const q = new URLSearchParams()
  if (f.q) q.set("q", f.q)
  if (f.hood) q.set("hood", f.hood)
  if (f.min) q.set("min", String(f.min))
  if (f.max) q.set("max", String(f.max))
  if (f.beds) q.set("beds", String(f.beds))
  if (f.baths) q.set("baths", String(f.baths))
  if (f.types.length) q.set("type", f.types.join(","))
  if (f.tags.length) q.set("tags", f.tags.join(","))
  if (f.open) q.set("open", "1")
  if (f.sort !== "newest") q.set("sort", f.sort)
  if (f.view === "map") q.set("view", "map")
  if (f.page > 1) q.set("page", String(f.page))
  if (f.area) q.set("area", [f.area.x1, f.area.y1, f.area.x2, f.area.y2].map((x) => x.toFixed(1)).join(","))
  const s = q.toString()
  return s ? `?${s}` : ""
}

const noop = () => () => {}

const PRICES: Record<Status, number[]> = {
  sale: [400_000, 600_000, 800_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000],
  sold: [400_000, 600_000, 800_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000],
  rent: [1_500, 2_000, 2_500, 3_000, 4_000, 5_000],
}

const chip = "inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-[var(--radius)] border border-[color:var(--input)] bg-card px-3.5 text-[14px] font-medium transition-colors hover:bg-muted data-[on=true]:border-[color:var(--dc-accent)] data-[on=true]:text-[color:var(--dc-accent)] data-popup-open:bg-muted"

function Steps({ label, value, options, onChange }: { label: string; value: number; options: number[]; onChange: (n: number) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold text-muted-foreground">{label}</legend>
      <div className="flex overflow-hidden rounded-[var(--radius)] border border-[color:var(--input)]">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className="h-9 flex-1 cursor-pointer border-l border-[color:var(--input)] text-[14px] first:border-l-0 hover:bg-muted aria-pressed:bg-[color:var(--dc-accent)] aria-pressed:font-semibold aria-pressed:text-[color:var(--background)]"
          >
            {o ? `${o}+` : "Any"}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function SearchView({ base, status }: { base: string; status: Status }) {
  const router = useRouter()
  const search = useSyncExternalStore(noop, () => window.location.search, () => "")
  const [picked, setPicked] = useState<Filters | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [savedSearch, setSavedSearch] = useState(false)
  const f = picked ?? parse(search)

  const set = (patch: Partial<Filters>) => {
    const next = { ...f, page: 1, ...patch }
    setPicked(next)
    setSavedSearch(false)
    window.history.replaceState(window.history.state, "", window.location.pathname + query(next))
  }

  // Everything but the drawn area narrows the pins; the area narrows the list too.
  const matching = useMemo(() => {
    const words = f.q.trim().toLowerCase()
    return LISTINGS.filter(
      (l) =>
        l.status === status &&
        (!words || `${l.address} ${l.unit ?? ""} ${HOODS.find((h) => h.slug === l.hood)?.name}`.toLowerCase().includes(words)) &&
        (!f.hood || l.hood === f.hood) &&
        (!f.min || l.price >= f.min) &&
        (!f.max || l.price <= f.max) &&
        l.beds >= f.beds &&
        l.baths >= f.baths &&
        (!f.types.length || f.types.includes(l.type)) &&
        f.tags.every((t) => l.tags.includes(t)) &&
        (!f.open || !!l.openHouse),
    )
  }, [f.q, f.hood, f.min, f.max, f.beds, f.baths, f.types, f.tags, f.open, status])

  const results = useMemo(() => {
    const r = matching.filter((l) => inArea(l, f.area))
    const by: Record<Sort, (a: (typeof r)[number], b: (typeof r)[number]) => number> = {
      newest: (a, b) => b.listed.localeCompare(a.listed),
      "price-desc": (a, b) => b.price - a.price,
      "price-asc": (a, b) => a.price - b.price,
      size: (a, b) => b.sqft - a.sqft,
    }
    return [...r].sort(by[f.sort])
  }, [matching, f.area, f.sort])

  const pages = Math.max(1, Math.ceil(results.length / PAGE))
  const page = Math.min(f.page, pages)
  const shown = results.slice((page - 1) * PAGE, page * PAGE)
  const hood = HOODS.find((h) => h.slug === f.hood)
  const what = { sale: "for sale", rent: "for rent", sold: "recently sold" }[status]
  const more = f.tags.length + (f.open ? 1 : 0)
  const priceLabel = f.min || f.max ? `${f.min ? short(f.min) : "Any"} – ${f.max ? short(f.max) : "Any"}` : "Price"
  const bedLabel = f.beds || f.baths ? [f.beds ? `${f.beds}+ bd` : "", f.baths ? `${f.baths}+ ba` : ""].filter(Boolean).join(" · ") : "Beds & baths"
  const dirty = JSON.stringify({ ...f, sort: "newest", view: "list", page: 1 }) !== JSON.stringify({ ...DEFAULTS })

  const saveSearch = () => {
    try {
      const all = JSON.parse(localStorage.getItem("re-searches") ?? "[]") as string[]
      const here = window.location.pathname + query(f)
      if (!all.includes(here)) localStorage.setItem("re-searches", JSON.stringify([here, ...all].slice(0, 10)))
    } catch {}
    setSavedSearch(true)
  }

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <label className="flex h-10 min-w-[220px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-[color:var(--input)] bg-background px-3 lg:max-w-[360px]">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {hood ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--dc-highlight)] py-0.5 pr-1 pl-2.5 text-[13px] font-semibold text-[color:var(--dc-highlight-fg)]">
                {hood.name}
                <button type="button" onClick={() => set({ hood: "" })} aria-label={`Remove ${hood.name}`} className="grid size-5 cursor-pointer place-items-center rounded-full hover:bg-black/10">
                  <X className="size-3" aria-hidden="true" />
                </button>
              </span>
            ) : null}
            <span className="sr-only">Search by address or neighborhood</span>
            <input value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder={hood ? "Address" : `${BRAND.city}: address or neighborhood`} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground" />
          </label>

          <Popover>
            <PopoverTrigger className={chip}>
              {{ sale: "For sale", rent: "For rent", sold: "Sold" }[status]} <ChevronDown className="size-4" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" className="dc-card w-48 p-1.5">
              {(["sale", "rent", "sold"] as Status[]).map((s) => (
                <button key={s} type="button" onClick={() => router.push(to(base, searchPath(s)))} className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-[15px] hover:bg-muted">
                  {{ sale: "For sale", rent: "For rent", sold: "Sold" }[s]}
                  {s === status ? <Check className="size-4" aria-hidden="true" /> : null}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className={chip} data-on={!!(f.min || f.max)}>
              {priceLabel} <ChevronDown className="size-4" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" className="dc-card w-72 gap-3 p-4">
              <div className="grid grid-cols-2 gap-3">
                {(["min", "max"] as const).map((k) => (
                  <label key={k} className="grid gap-1.5 text-[13px] font-semibold text-muted-foreground">
                    {k === "min" ? "Minimum" : "Maximum"}
                    <select value={f[k]} onChange={(e) => set(k === "min" ? { min: Number(e.target.value) } : { max: Number(e.target.value) })} className="h-10 rounded-[var(--radius)] border border-[color:var(--input)] bg-background px-2 text-[15px] font-normal text-foreground">
                      <option value={0}>{k === "min" ? "No min" : "No max"}</option>
                      {PRICES[status].map((p) => (
                        <option key={p} value={p}>
                          {short(p, status)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className={chip} data-on={!!(f.beds || f.baths)}>
              {bedLabel} <ChevronDown className="size-4" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" className="dc-card w-80 gap-4 p-4">
              <Steps label="Bedrooms" value={f.beds} options={[0, 1, 2, 3, 4, 5]} onChange={(beds) => set({ beds })} />
              <Steps label="Bathrooms" value={f.baths} options={[0, 1, 2, 3]} onChange={(baths) => set({ baths })} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className={chip} data-on={f.types.length > 0}>
              {f.types.length === 1 ? f.types[0] : f.types.length ? `${f.types.length} home types` : "Home type"} <ChevronDown className="size-4" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" className="dc-card w-56 gap-1 p-2">
              {TYPES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-[15px] hover:bg-muted">
                  <Checkbox checked={f.types.includes(t)} onCheckedChange={(on) => set({ types: on ? [...f.types, t] : f.types.filter((x) => x !== t) })} />
                  {t}
                </label>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className={chip} data-on={more > 0}>
              <SlidersHorizontal className="size-4" aria-hidden="true" /> More filters
              {more ? <span className="grid size-5 place-items-center rounded-full bg-[color:var(--dc-accent)] text-[11px] font-bold text-[color:var(--background)]">{more}</span> : null}
            </PopoverTrigger>
            <PopoverContent align="start" className="dc-card w-64 gap-1 p-2">
              {FEATURES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-[15px] hover:bg-muted">
                  <Checkbox checked={f.tags.includes(t)} onCheckedChange={(on) => set({ tags: on ? [...f.tags, t] : f.tags.filter((x) => x !== t) })} />
                  {t}
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border-t border-border px-2 py-2 text-[15px] hover:bg-muted">
                <Checkbox checked={f.open} onCheckedChange={(on) => set({ open: !!on })} />
                Has an open house
              </label>
            </PopoverContent>
          </Popover>

          {dirty ? (
            <button type="button" onClick={() => set({ ...DEFAULTS, sort: f.sort, view: f.view })} className="h-10 shrink-0 cursor-pointer px-2 text-[14px] font-semibold text-[color:var(--dc-accent)] hover:underline">
              Clear
            </button>
          ) : null}

          <Button size="lg" onClick={saveSearch} className="ml-auto h-10 shrink-0 px-4 text-[15px] font-semibold">
            {savedSearch ? (
              <>
                <Check className="size-4" aria-hidden="true" /> Saved
              </>
            ) : (
              "Save search"
            )}
          </Button>
          <span role="status" className="sr-only">
            {savedSearch ? "Search saved on this device." : ""}
          </span>
        </div>
      </div>

      {/* Results and map */}
      <div className={cn("grid lg:min-h-[calc(100dvh-8.5rem)]", f.view === "list" ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" : "")}>
        <section aria-labelledby="re-results" className={cn("px-4 pt-6 pb-10 sm:px-6 lg:px-8", f.view === "map" && "max-lg:hidden lg:hidden")}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 id="re-results" className="dc-h text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">
              {results.length} {results.length === 1 ? "home" : "homes"} {what} in {hood?.name ?? BRAND.city}
            </h1>
            <div className="flex items-center gap-2">
              <label className="flex h-10 items-center gap-1 rounded-[var(--radius)] border border-[color:var(--input)] bg-card pl-3 text-[14px]">
                <span className="text-muted-foreground">Sort:</span>
                <select value={f.sort} onChange={(e) => set({ sort: e.target.value as Sort })} className="h-full cursor-pointer bg-transparent pr-2 font-semibold outline-none">
                  {(Object.keys(SORTS) as Sort[]).map((s) => (
                    <option key={s} value={s}>
                      {SORTS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <ViewToggle view={f.view} onChange={(view) => set({ view, page: page })} />
            </div>
          </div>

          {shown.length ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {shown.map((l) => (
                <li key={l.slug} onPointerEnter={() => setActive(l.slug)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(l.slug)} onBlur={() => setActive(null)}>
                  <ListingCard base={base} l={l} active={active === l.slug} onHover />
                </li>
              ))}
            </ul>
          ) : (
            <div className="dc-card grid place-items-center px-6 py-16 text-center">
              <p className="dc-h text-[22px]">No homes match these filters</p>
              <p className="mt-2 max-w-[28em] text-[15px] text-muted-foreground">Try a wider price range or fewer features, or clear the area you drew on the map.</p>
              <Button variant="outline" size="lg" className="mt-5 h-10 px-4" onClick={() => set({ ...DEFAULTS, sort: f.sort })}>
                Clear filters
              </Button>
            </div>
          )}

          {pages > 1 ? (
            <nav aria-label="Pages" className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] text-muted-foreground">
                Showing {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, results.length)} of {results.length}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-current={p === page ? "page" : undefined}
                    onClick={() => {
                      set({ page: p })
                      document.getElementById("re-results")?.scrollIntoView({ block: "start" })
                    }}
                    className="grid size-10 cursor-pointer place-items-center rounded-[var(--radius)] text-[15px] font-semibold hover:bg-muted aria-[current=page]:bg-[color:var(--dc-accent)] aria-[current=page]:text-[color:var(--background)]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </nav>
          ) : null}
        </section>

        <section aria-label="Map" className={cn("relative", f.view === "list" ? "max-lg:hidden" : "")}>
          <div className={cn("lg:sticky lg:top-16", f.view === "list" ? "h-[calc(100dvh-8.5rem)]" : "h-[calc(100dvh-8.5rem)] min-h-[520px]")}>
            <CityMap base={base} listings={matching} active={active} onActive={setActive} area={f.area} onArea={(area) => set({ area })} className="size-full" />
            {f.view === "map" ? (
              <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
                <div className="flex items-center gap-2">
                  <span className="dc-card px-3 py-2 text-[14px] font-semibold shadow-md">
                    {results.length} {results.length === 1 ? "home" : "homes"} {what}
                  </span>
                  <ViewToggle view={f.view} onChange={(view) => set({ view, page })} />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Phones: switch between the list and the map */}
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center lg:hidden">
        <button
          type="button"
          onClick={() => set({ view: f.view === "list" ? "map" : "list", page })}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[color:var(--dc-accent)] px-5 text-[15px] font-semibold text-[color:var(--background)] shadow-lg"
        >
          {f.view === "list" ? <MapIcon className="size-4" aria-hidden="true" /> : <List className="size-4" aria-hidden="true" />}
          {f.view === "list" ? "Map" : "List"}
        </button>
      </div>
    </div>
  )
}

function ViewToggle({ view, onChange }: { view: "list" | "map"; onChange: (v: "list" | "map") => void }) {
  return (
    <div role="group" aria-label="View" className="hidden h-10 overflow-hidden rounded-[var(--radius)] border border-[color:var(--input)] bg-card lg:flex">
      {(["list", "map"] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => onChange(v)}
          className="cursor-pointer px-3.5 text-[14px] font-medium hover:bg-muted aria-pressed:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] aria-pressed:font-semibold aria-pressed:text-[color:var(--dc-accent)]"
        >
          {v === "list" ? "List" : "Map"}
        </button>
      ))}
    </div>
  )
}
