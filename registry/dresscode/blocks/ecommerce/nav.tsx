"use client"

// The header's moving parts: the search with suggestions as you type, the departments menu, the cart
// button (it opens the drawer) and the phone menu.
import { ArrowRight, ChevronDown, LayoutGrid, Menu, Search, ShoppingBag, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useId, useMemo, useRef, useState } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { Photo, Price } from "./cards"
import { BRAND, CATEGORIES, PRODUCTS, type Variant } from "./data"
import { bestSelling, POPULAR_SEARCHES, search, shopPath, to } from "./site"
import { drawer, useCart } from "./store"

export function CartButton({ look }: { look: Variant }) {
  const { lines } = useCart()
  const count = lines.reduce((n, l) => n + l.qty, 0)
  if (look === "brand")
    return (
      <button type="button" onClick={() => drawer.open()} className="h-9 cursor-pointer rounded-[var(--radius)] px-2 text-[15px] hover:bg-muted" aria-label={`Cart, ${count} items`}>
        Cart ({count})
      </button>
    )
  return (
    <button type="button" onClick={() => drawer.open()} className="relative flex cursor-pointer flex-col items-center gap-0.5 rounded-[var(--radius)] px-2 py-1 text-[12px] hover:bg-muted" aria-label={`Cart, ${count} items`}>
      <ShoppingBag className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />
      <span className="max-sm:sr-only">Cart</span>
      {count ? (
        <span className="dc-num absolute -top-0.5 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground" aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  )
}

/* Search ----------------------------------------------------------------------------------------- */

function useSearch(q: string) {
  return useMemo(() => {
    const words = q.trim()
    if (!words) return { products: [], departments: [] }
    const products = search(words).slice(0, 5)
    const departments = CATEGORIES.filter((c) => c.name.toLowerCase().includes(words.toLowerCase()) || c.short.toLowerCase().startsWith(words.toLowerCase()))
    return { products, departments }
  }, [q])
}

/** Results under the search field: departments, then products with their price. */
function Suggestions({ base, q, active, onPick, id }: { base: string; q: string; active: number; onPick: () => void; id: string }) {
  const { products, departments } = useSearch(q)
  if (!q.trim())
    return (
      <div className="p-3">
        <p className="px-1 text-[13px] font-semibold text-muted-foreground">Popular searches</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map((s) => (
            <Link key={s} href={`${to(base, "search")}?q=${encodeURIComponent(s)}`} onClick={onPick} className="rounded-full border border-border px-3 py-1 text-[14px] hover:bg-muted">
              {s}
            </Link>
          ))}
        </div>
        <p className="mt-4 px-1 text-[13px] font-semibold text-muted-foreground">Best sellers</p>
        <ul className="mt-1">
          {bestSelling().slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link href={to(base, "products", p.slug)} onClick={onPick} className="flex items-center gap-3 rounded-[var(--radius)] p-1.5 hover:bg-muted">
                <span className="size-10 shrink-0 overflow-hidden rounded-[calc(var(--radius)-2px)]">
                  <Photo src={p.photos[0]} alt="" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px]">{p.name}</span>
                <Price p={p} className="text-[14px] font-medium" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  if (!products.length && !departments.length)
    return (
      <p className="p-4 text-[14px] text-muted-foreground">
        Nothing matches &ldquo;{q}&rdquo;. Try <q>linen</q> or <q>stoneware</q>.
      </p>
    )
  return (
    <ul id={id} role="listbox" aria-label="Suggestions" className="p-1.5">
      {departments.map((c) => (
        <li key={c.id} role="option" aria-selected={false}>
          <Link href={to(base, shopPath(c.id))} onClick={onPick} className="flex items-center justify-between rounded-[var(--radius)] px-2.5 py-2 text-[14px] hover:bg-muted">
            <span>
              <span className="text-muted-foreground">Department · </span>
              {c.name}
            </span>
            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </li>
      ))}
      {products.map((p, i) => (
        <li key={p.slug} role="option" aria-selected={active === i}>
          <Link href={to(base, "products", p.slug)} onClick={onPick} className={cn("flex items-center gap-3 rounded-[var(--radius)] p-1.5 hover:bg-muted", active === i && "bg-muted")}>
            <span className="size-11 shrink-0 overflow-hidden rounded-[calc(var(--radius)-2px)]">
              <Photo src={p.photos[0]} alt="" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium">{p.name}</span>
              <span className="block truncate text-[13px] text-muted-foreground">{CATEGORIES.find((c) => c.id === p.category)?.name}</span>
            </span>
            <Price p={p} className="text-[14px] font-medium" />
          </Link>
        </li>
      ))}
      <li>
        <Link href={`${to(base, "search")}?q=${encodeURIComponent(q.trim())}`} onClick={onPick} className="mt-1 flex items-center gap-2 rounded-[var(--radius)] border-t border-border px-2.5 pt-2.5 pb-2 text-[14px] font-medium text-[color:var(--dc-accent)] hover:underline">
          See all results for &ldquo;{q.trim()}&rdquo; <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </li>
    </ul>
  )
}

/** The department look's wide search field. */
export function SearchBox({ base, className }: { base: string; className?: string }) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const box = useRef<HTMLDivElement>(null)
  const id = useId()
  const { products } = useSearch(q)
  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }
  return (
    <div
      ref={box}
      className={cn("relative", className)}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (active >= 0 && products[active]) go(to(base, "products", products[active].slug))
          else go(`${to(base, "search")}?q=${encodeURIComponent(q.trim())}`)
        }}
      >
        <label htmlFor={`${id}-q`} className="sr-only">
          Search
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id={`${id}-q`}
          type="search"
          value={q}
          autoComplete="off"
          placeholder="Search plates, linen, towels…"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setActive((a) => Math.min(products.length - 1, a + 1))
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              setActive((a) => Math.max(-1, a - 1))
            } else if (e.key === "Escape") setOpen(false)
          }}
          className="h-11 w-full rounded-full border border-[color:var(--input)] bg-card pr-4 pl-10 text-[15px] placeholder:text-muted-foreground focus:border-[color:var(--ring)] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </form>
      {open ? (
        <div className="dc-card absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-auto shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)]">
          <Suggestions base={base} q={q} active={active} onPick={() => setOpen(false)} id={`${id}-list`} />
        </div>
      ) : null}
    </div>
  )
}

/** The brand look's search: an icon that opens a search panel. */
export function SearchButton({ base, className }: { base: string; className?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search" className={cn("grid size-9 cursor-pointer place-items-center rounded-[var(--radius)] hover:bg-muted", className)}>
        <Search className="size-[19px]" aria-hidden="true" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12vh] max-w-[min(640px,calc(100%-2rem))] translate-y-0 gap-0 p-0 sm:max-w-[640px]" showCloseButton={false}>
          <DialogTitle className="sr-only">Search {BRAND.name}</DialogTitle>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              setOpen(false)
              router.push(`${to(base, "search")}?q=${encodeURIComponent(q.trim())}`)
            }}
            className="flex items-center gap-2 border-b border-border px-4"
          >
            <Search className="size-5 text-muted-foreground" aria-hidden="true" />
            <input autoFocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search linen, stoneware, merino…" aria-label="Search" className="h-14 flex-1 bg-transparent text-[17px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden" />
            <button type="button" onClick={() => setOpen(false)} className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-muted" aria-label="Close search">
              <X className="size-4" aria-hidden="true" />
            </button>
          </form>
          <div className="max-h-[60vh] overflow-auto">
            <Suggestions base={base} q={q} active={-1} onPick={() => setOpen(false)} id="ec-search-dialog" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* Departments ------------------------------------------------------------------------------------ */

export function DepartmentsMenu({ base }: { base: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-[color:var(--dc-accent)] px-3 text-[14px] font-semibold text-[color:var(--dc-accent)] hover:bg-muted data-popup-open:bg-muted">
        <LayoutGrid className="size-4" aria-hidden="true" />
        All departments
        <ChevronDown className="size-4 transition-transform in-data-popup-open:rotate-180" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-[min(920px,calc(100vw-2rem))] gap-0 rounded-[var(--dc-radius-card)] p-0">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_1fr_1fr_240px]">
          {CATEGORIES.slice(0, 3).map((c) => (
            <MenuColumn key={c.id} base={base} id={c.id} onPick={() => setOpen(false)} />
          ))}
          <Link href={to(base, "shop/sale")} onClick={() => setOpen(false)} className="group relative row-span-2 hidden overflow-hidden rounded-[var(--dc-radius-card)] md:block">
            <Photo src="throw-rust" alt="" className="absolute inset-0" imgClassName="transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-3 bottom-3 rounded-[var(--radius)] bg-card/95 p-3 text-foreground">
              <span className="block text-[13px] text-muted-foreground">Winter sale</span>
              <span className="dc-h block text-[18px]">20% off the Wool Throw</span>
            </span>
          </Link>
          {CATEGORIES.slice(3).map((c) => (
            <MenuColumn key={c.id} base={base} id={c.id} onPick={() => setOpen(false)} />
          ))}
          <div>
            <p className="text-[14px] font-semibold">Collections</p>
            <ul className="mt-2 grid gap-1.5 text-[14px] text-muted-foreground">
              {(
                [
                  ["New arrivals", "shop/new"],
                  ["Gifts", "shop/gifts"],
                  ["Gift cards", "gift-cards"],
                  ["Sale", "shop/sale"],
                  ["Shop all", "shop"],
                ] as const
              ).map(([label, path]) => (
                <li key={label}>
                  <Link href={to(base, path)} onClick={() => setOpen(false)} className="hover:text-foreground hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MenuColumn({ base, id, onPick }: { base: string; id: (typeof CATEGORIES)[number]["id"]; onPick: () => void }) {
  const c = CATEGORIES.find((x) => x.id === id)!
  const items = PRODUCTS.filter((p) => p.category === id).slice(0, 5)
  return (
    <div>
      <Link href={to(base, shopPath(id))} onClick={onPick} className="text-[14px] font-semibold hover:underline">
        {c.name}
      </Link>
      <ul className="mt-2 grid gap-1.5 text-[14px] text-muted-foreground">
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={to(base, "products", p.slug)} onClick={onPick} className="hover:text-foreground hover:underline">
              {p.name.replace(/, (Set of \d|\d+ (in|oz|L))$/, "")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Phone menu ------------------------------------------------------------------------------------- */

export function PhoneMenu({ base, className }: { base: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn("grid size-10 cursor-pointer place-items-center rounded-[var(--radius)] hover:bg-muted lg:hidden", className)} aria-label="Menu">
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] gap-0 overflow-y-auto p-0 sm:max-w-sm">
        <SheetTitle className="dc-h px-5 pt-5 text-[24px]">{BRAND.name}</SheetTitle>
        <div className="p-4">
          <SearchBox base={base} />
        </div>
        <nav aria-label="Departments" className="grid border-t border-border px-2 py-2 text-[16px]">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={to(base, shopPath(c.id))} onClick={close} className="flex items-center justify-between rounded-[var(--radius)] px-3 py-2.5 hover:bg-muted">
              {c.name} <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
          <Link href={to(base, "shop/new")} onClick={close} className="rounded-[var(--radius)] px-3 py-2.5 hover:bg-muted">
            New arrivals
          </Link>
          <Link href={to(base, "shop/gifts")} onClick={close} className="rounded-[var(--radius)] px-3 py-2.5 hover:bg-muted">
            Gifts
          </Link>
          <Link href={to(base, "shop/sale")} onClick={close} className="rounded-[var(--radius)] px-3 py-2.5 font-medium text-[color:var(--dc-danger)] hover:bg-muted">
            Sale
          </Link>
        </nav>
        <nav aria-label="More" className="grid border-t border-border px-2 py-2 text-[15px] text-muted-foreground">
          {(
            [
              ["Account", "account"],
              ["Saved", "saved"],
              ["Track order", "track"],
              ["Journal", "journal"],
              ["Help", "help"],
            ] as const
          ).map(([label, path]) => (
            <Link key={label} href={to(base, path)} onClick={close} className="rounded-[var(--radius)] px-3 py-2 hover:bg-muted hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
