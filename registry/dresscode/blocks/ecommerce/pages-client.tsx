"use client"

// The pages that read this device's state or the address bar: search results, saved things and the
// account (orders placed here and the sample customer's).
import { Heart, LogOut, MapPin, Package, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import { Photo, ProductCard } from "./cards"
import { CATEGORIES, CUSTOMER, ORDERS, type Product, type Variant } from "./data"
import { bestSelling, formatDate, money, POPULAR_SEARCHES, productOf, round2, search, shopPath, to } from "./site"
import { useOrders, useSaved } from "./store"
import { OUTLINE, PRIMARY } from "./styles"

const noop = () => () => {}
const useQuery = (key: string) => new URLSearchParams(useSyncExternalStore(noop, () => window.location.search, () => "")).get(key) ?? ""

export function SearchView({ base, look }: { base: string; look: Variant }) {
  const router = useRouter()
  const q = useQuery("q")
  const [draft, setDraft] = useState<string | null>(null)
  const results = search(q)
  const value = draft ?? q
  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          setDraft(null)
          router.push(`${to(base, "search")}?q=${encodeURIComponent(value.trim())}`)
        }}
        className="relative max-w-[640px]"
      >
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input value={value} onChange={(e) => setDraft(e.target.value)} placeholder="Search everything" aria-label="Search" className="h-13 w-full rounded-full border border-[color:var(--input)] bg-card pr-28 pl-12 text-[17px] outline-none focus:border-[color:var(--ring)]" />
        <button type="submit" className={cn(PRIMARY, "absolute top-1.5 right-1.5 h-10 rounded-full px-5 text-[15px]")}>
          Search
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
        <span className="text-muted-foreground">Popular:</span>
        {POPULAR_SEARCHES.map((s) => (
          <Link key={s} href={`${to(base, "search")}?q=${encodeURIComponent(s)}`} onClick={() => setDraft(null)} className="rounded-full border border-border px-3 py-1 hover:bg-muted">
            {s}
          </Link>
        ))}
      </div>
      {q ? (
        <p className="mt-8 text-[15px] text-muted-foreground" role="status">
          {results.length ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”` : `Nothing matches “${q}”.`}
        </p>
      ) : null}
      {results.length ? (
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <li key={p.slug}>
              <ProductCard base={base} p={p} look={look} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <h2 className="dc-h text-[22px]">{q ? "Try a department instead" : "Shop by department"}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={to(base, shopPath(c.id))} className="group block overflow-hidden rounded-[var(--dc-radius-card)] bg-card">
                  <span className="block aspect-[4/3] overflow-hidden">
                    <Photo src={c.photo} alt="" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="block px-3 py-2.5 text-[15px] font-medium">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="dc-h mt-12 text-[22px]">Best sellers</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {bestSelling().slice(0, 4).map((p) => (
              <li key={p.slug}>
                <ProductCard base={base} p={p} look={look} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export function SavedView({ base, look }: { base: string; look: Variant }) {
  const saved = useSaved()
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const list = saved.map(productOf).filter((p): p is Product => !!p)
  if (!hydrated) return <div className="min-h-[40vh]" />
  if (!list.length)
    return (
      <div className="rounded-[var(--dc-radius-card)] border border-dashed border-border px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-muted">
          <Heart className="size-6" aria-hidden="true" />
        </span>
        <p className="dc-h mt-4 text-[22px]">Nothing saved yet</p>
        <p className="mt-1 text-[15px] text-muted-foreground">Tap the heart on anything you like. It stays here on this device.</p>
        <Link href={to(base, "shop")} className={cn(PRIMARY, "mt-6 h-11 px-6 text-[15px]")}>
          Shop all
        </Link>
      </div>
    )
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => (
        <li key={p.slug}>
          <ProductCard base={base} p={p} look={look} />
        </li>
      ))}
    </ul>
  )
}

export function AccountView({ base }: { base: string }) {
  const placed = useOrders()
  const saved = useSaved()
  const all = [
    ...placed.map((o) => ({ number: o.number, date: o.date, status: o.status, items: o.lines.reduce((n, l) => n + l.qty, 0), total: o.total, cover: o.lines[0], local: true })),
    ...ORDERS.map((o) => ({ number: o.number, date: o.date, status: o.status, items: o.lines.reduce((n, l) => n + l.qty, 0), total: round2(o.lines.reduce((n, l) => n + l.price * l.qty, 0) - o.discount + o.shipping + o.tax), cover: o.lines[0], local: false })),
  ].sort((a, b) => b.number - a.number)
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section aria-labelledby="ec-orders">
        <h2 id="ec-orders" className="dc-h text-[24px]">
          Orders
        </h2>
        <ul className="mt-4 grid gap-3">
          {all.map((o) => {
            const p = productOf(o.cover.slug)
            const href = o.local ? `${to(base, "checkout", "confirmation")}?order=${o.number}` : to(base, "account", "orders", String(o.number))
            return (
              <li key={o.number}>
                <Link href={href} className="dc-card flex items-center gap-4 p-4 transition-colors hover:border-foreground/30">
                  <span className="size-16 shrink-0 overflow-hidden rounded-[var(--radius)]">{p ? <Photo src={p.photos[0]} alt="" /> : null}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold">Order #{o.number}</span>
                    <span className="block text-[14px] text-muted-foreground">
                      {formatDate(o.date)} · {o.items} {o.items === 1 ? "item" : "items"} · <span className="dc-num">{money(o.total, true)}</span>
                    </span>
                  </span>
                  <span className={cn("dc-pill h-7 px-3 text-[13px]", o.status === "Delivered" ? "dc-pill-muted" : "dc-pill-hl")}>{o.status === "Shipped" ? "On its way" : o.status}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
      <aside className="grid gap-4">
        <section className="dc-card p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold">
            <MapPin className="size-4" aria-hidden="true" /> Default address
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {CUSTOMER.first} {CUSTOMER.last}
            <br />
            {CUSTOMER.address.line1}, {CUSTOMER.address.line2}
            <br />
            {CUSTOMER.address.city}, {CUSTOMER.address.state} {CUSTOMER.address.zip}
          </p>
        </section>
        <Link href={to(base, "saved")} className="dc-card flex items-center gap-3 p-5 text-[16px] font-semibold hover:border-foreground/30">
          <Heart className="size-4" aria-hidden="true" /> Saved <span className="ml-auto font-normal text-muted-foreground">{saved.length}</span>
        </Link>
        <Link href={to(base, "track")} className="dc-card flex items-center gap-3 p-5 text-[16px] font-semibold hover:border-foreground/30">
          <Package className="size-4" aria-hidden="true" /> Track an order
        </Link>
        <Link href={to(base, "account", "sign-in")} className={cn(OUTLINE, "h-11 text-[15px]")}>
          <LogOut className="size-4" aria-hidden="true" /> Sign out
        </Link>
      </aside>
    </div>
  )
}
