// The store's map: every page and its URL, the navigation, page titles and the helpers every page
// shares (prices, variants, stock, the cart's totals, delivery dates). Plain data and functions, shared
// by the server pages and the client parts. `to(base, "products", slug)` builds a link inside the store.
import {
  BRAND,
  CATEGORIES,
  COLLECTIONS,
  DEFAULT_TAX,
  DISCOUNTS,
  FAMILIES,
  ORDERS,
  POSTS,
  PRODUCTS,
  STORE,
  TAX_RATES,
  type Category,
  type CategoryId,
  type CollectionId,
  type Color,
  type Product,
  type Variant,
} from "./data"

export type ShopId = "all" | CategoryId | CollectionId

export type Route =
  | { page: "home" }
  | { page: "shop"; id: ShopId }
  | { page: "product"; slug: string }
  | { page: "search" }
  | { page: "cart" }
  | { page: "checkout" }
  | { page: "confirmation" }
  | { page: "saved" }
  | { page: "account" }
  | { page: "sign-in" }
  | { page: "order"; number: number }
  | { page: "track" }
  | { page: "gift-cards" }
  | { page: "journal" }
  | { page: "post"; slug: string }
  | { page: "about" }
  | { page: "help" }
  | { page: "contact" }
  | { page: "not-found" }

export type PageId = Route["page"]

export type SiteProps = { base: string; variant: Variant }

export const to = (base: string, ...parts: string[]) => [base.replace(/\/$/, ""), ...parts].join("/") || "/"

const SHOP_IDS: ShopId[] = ["all", ...CATEGORIES.map((c) => c.id), ...(Object.keys(COLLECTIONS) as CollectionId[])]

/** The page for a path under the base ([] is home), or null for a 404. */
export function resolve(path: string[] = []): Route | null {
  const [a, b, c, ...rest] = path
  if (rest.length) return null
  if (a === undefined) return { page: "home" }
  if (a === "account" && b === "orders" && c !== undefined) {
    const n = Number(c)
    return ORDERS.some((o) => o.number === n) ? { page: "order", number: n } : null
  }
  if (c !== undefined) return null
  if (b === undefined) {
    if (a === "shop") return { page: "shop", id: "all" }
    const single: Record<string, PageId> = { search: "search", cart: "cart", checkout: "checkout", saved: "saved", account: "account", track: "track", "gift-cards": "gift-cards", journal: "journal", about: "about", help: "help", contact: "contact" }
    return single[a] ? ({ page: single[a] } as Route) : null
  }
  if (a === "shop" && SHOP_IDS.includes(b as ShopId) && b !== "all") return { page: "shop", id: b as ShopId }
  if (a === "products" && PRODUCTS.some((p) => p.slug === b)) return { page: "product", slug: b }
  if (a === "journal" && POSTS.some((p) => p.slug === b)) return { page: "post", slug: b }
  if (a === "checkout" && b === "confirmation") return { page: "confirmation" }
  if (a === "account" && b === "sign-in") return { page: "sign-in" }
  return null
}

/** Every path the store has, home ([]) first: for generateStaticParams. */
export function allPaths(): string[][] {
  return [
    [],
    ["shop"],
    ...SHOP_IDS.filter((id) => id !== "all").map((id) => ["shop", id]),
    ...PRODUCTS.map((p) => ["products", p.slug]),
    ...["search", "cart", "checkout", "saved", "account", "track", "gift-cards", "journal", "about", "help", "contact"].map((p) => [p]),
    ["checkout", "confirmation"],
    ["account", "sign-in"],
    ...ORDERS.map((o) => ["account", "orders", String(o.number)]),
    ...POSTS.map((p) => ["journal", p.slug]),
  ]
}

export const shopPath = (id: ShopId) => (id === "all" ? "shop" : `shop/${id}`)

/* Money ----------------------------------------------------------------------------------------- */

const whole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })

/** $64 on cards; $64.00 in the cart and at checkout. Whole dollars keep their cents when they have any. */
export const money = (n: number, exact = false) => (exact || Math.round(n) !== n ? cents.format(n) : whole.format(n))
export const round2 = (n: number) => Math.round(n * 100) / 100

/* Products ------------------------------------------------------------------------------------ */

export const productOf = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
export const categoryOf = (id: CategoryId): Category => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]

/** The variant's key in `stock`: "Oat / XL", "Clay", "King" or "". */
export const variantKey = (color?: string, size?: string) => [color, size].filter(Boolean).join(" / ")

export function stockOf(p: Product, color?: string, size?: string) {
  const s = p.stock ?? {}
  const key = variantKey(color, size)
  if (key in s) return s[key]
  if (color && color in s) return s[color]
  if (size && size in s) return s[size]
  return s[""] ?? 24
}

export const priceOf = (p: Product, size?: string) => p.sizes?.find((s) => s.name === size)?.price ?? p.price

/** The price a card shows: "From $248" when the sizes cost different amounts. */
export function fromPrice(p: Product) {
  const prices = (p.sizes ?? []).map((s) => s.price ?? p.price)
  return prices.some((x) => x !== p.price) ? `From ${money(Math.min(p.price, ...prices))}` : money(p.price)
}

export const salePercent = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0)

/** In stock in some color and size. */
export function inStock(p: Product) {
  const colors = p.colors.length ? p.colors.map((c) => c.name) : [undefined]
  const sizes = p.sizes?.length ? p.sizes.map((s) => s.name) : [undefined]
  return colors.some((c) => sizes.some((s) => stockOf(p, c, s) > 0))
}

/** The first color and size that are in stock. */
export function firstAvailable(p: Product, color?: string): { color?: string; size?: string } {
  const colors = color ? [color] : p.colors.length ? p.colors.map((c) => c.name) : [undefined]
  for (const c of colors) {
    const sizes = p.sizes?.length ? p.sizes.map((s) => s.name) : [undefined]
    const s = sizes.find((x) => stockOf(p, c, x) > 0)
    if (s !== undefined || !p.sizes?.length) return { color: c, size: s }
  }
  return { color: colors[0], size: p.sizes?.[0]?.name }
}

export const colorOf = (p: Product, name?: string): Color | undefined => p.colors.find((c) => c.name === name)

/** The photos for a color, cover first. */
export function photosOf(p: Product, color?: string) {
  const own = colorOf(p, color)?.photos
  if (own?.length) return own
  return p.gallery ?? p.photos.slice(0, 1)
}

/** The card's cover for a color. */
export const coverOf = (p: Product, color?: string) => (color && colorOf(p, color)?.photos?.[0] && color !== p.colors[0]?.name ? colorOf(p, color)!.photos![0] : p.photos[0])

export const familyOf = (c: Color) => c.family ?? c.name
export const familyHex = (name: string) => FAMILIES.find((f) => f.name === name)?.hex ?? "#999"

export function inCollection(p: Product, id: ShopId) {
  if (id === "all") return true
  if (id === "gifts") return !!p.gift
  if (id === "sale") return !!p.compareAt
  if (id === "new") return p.badge === "New"
  return p.category === id
}

export function shopTitle(id: ShopId) {
  if (id === "all") return { name: "Shop all", blurb: "Everything we make, from the kitchen to the bedroom." }
  if (id in COLLECTIONS) return COLLECTIONS[id as CollectionId]
  const c = categoryOf(id as CategoryId)
  return { name: c.name, blurb: c.blurb }
}

export const bestSelling = (list: Product[] = PRODUCTS) => [...list].sort((a, b) => a.rank - b.rank)

const haystack = (p: Product) =>
  [p.name, categoryOf(p.category).name, p.material ?? "", p.colors.map((c) => `${c.name} ${familyOf(c)}`).join(" "), p.keywords ?? "", p.summary].join(" ").toLowerCase()

/** Products whose name, department, material, colors or keywords hold every word, best match first. */
export function search(q: string, list: Product[] = PRODUCTS) {
  const words = q.toLowerCase().split(/[^a-z0-9&]+/).filter(Boolean)
  if (!words.length) return []
  const scored = list
    .map((p) => {
      const h = haystack(p)
      const name = p.name.toLowerCase()
      if (!words.every((w) => h.includes(w) || (w.endsWith("s") && h.includes(w.slice(0, -1))))) return null
      const score = words.reduce((s, w) => s + (name.includes(w) ? 3 : 1), 0) - p.rank / 100
      return { p, score }
    })
    .filter((x): x is { p: Product; score: number } => !!x)
  return scored.sort((a, b) => b.score - a.score).map((x) => x.p)
}

export const POPULAR_SEARCHES = ["linen", "cast iron", "merino", "towels", "candle"]

/* The cart -------------------------------------------------------------------------------------- */

/** A cart line: a product in one color and size, or a gift card (slug "gift-card", size the amount). */
export type Line = {
  id: string
  slug: string
  color?: string
  size?: string
  qty: number
  /** Gift cards: who it's for. */
  to?: string
  from?: string
  message?: string
}

export const lineId = (slug: string, color?: string, size?: string) => [slug, color ?? "", size ?? ""].join("|")

export const isGiftCard = (l: Pick<Line, "slug">) => l.slug === "gift-card"

export function linePrice(l: Pick<Line, "slug" | "size">) {
  if (isGiftCard(l)) return Number(l.size) || 0
  const p = productOf(l.slug)
  return p ? priceOf(p, l.size) : 0
}

export function lineName(l: Pick<Line, "slug">) {
  if (isGiftCard(l)) return "Hollis Gift Card"
  return productOf(l.slug)?.name ?? l.slug
}

/** "Oat / M", "Sage", "Emailed to alex@example.com". */
export function lineVariant(l: Line) {
  if (isGiftCard(l)) return l.to ? `Emailed to ${l.to}` : "Emailed gift card"
  const p = productOf(l.slug)
  const size = p?.sizes?.find((s) => s.name === l.size)
  return [l.color, size?.label ?? l.size].filter(Boolean).join(" / ")
}

export function lineCover(l: Line) {
  const p = productOf(l.slug)
  return p ? coverOf(p, l.color) : ""
}

export type Totals = {
  count: number
  subtotal: number
  /** Merchandise that ships (gift cards are emailed). */
  shippable: number
  discount: number
  shipping: number
  tax: number
  total: number
  /** How much more for free shipping; 0 once it ships free. */
  toFree: number
  /** Gift card balance used. */
  giftCard: number
}

/** state: the two-letter code tax is worked out for; without one there is no tax yet. */
export type TotalsInput = { code?: string; shipping?: "standard" | "express"; state?: string; giftCard?: number }

/** The cart's money, worked out the same way everywhere. Shipping is free once the shippable
 *  subtotal after the discount reaches STORE.freeShippingOver; tax is on the merchandise after the
 *  discount, at the state's rate; a gift card pays last. */
export function totals(lines: Line[], { code, shipping = "standard", state, giftCard = 0 }: TotalsInput = {}): Totals {
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = round2(lines.reduce((n, l) => n + linePrice(l) * l.qty, 0))
  const shippableRaw = round2(lines.filter((l) => !isGiftCard(l)).reduce((n, l) => n + linePrice(l) * l.qty, 0))
  const d = code ? DISCOUNTS[code.toUpperCase()] : undefined
  const discount = d ? round2((shippableRaw * d.percent) / 100) : 0
  const shippable = round2(shippableRaw - discount)
  const free = shippable >= STORE.freeShippingOver
  const ship = shippableRaw === 0 ? 0 : shipping === "express" ? STORE.expressShipping : free ? 0 : STORE.standardShipping
  const rate = state ? (TAX_RATES[state] ?? DEFAULT_TAX) : 0
  const tax = round2((shippable * rate) / 100)
  const before = round2(subtotal - discount + ship + tax)
  const gc = Math.min(giftCard, before)
  return { count, subtotal, shippable, discount, shipping: ship, tax, total: round2(before - gc), toFree: free || shippableRaw === 0 ? 0 : round2(STORE.freeShippingOver - shippable), giftCard: gc }
}

/* Dates ---------------------------------------------------------------------------------------- */

const dayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const longFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`)
export const isoDay = (d: Date) => d.toISOString().slice(0, 10)
export const formatDate = (iso: string) => dateFmt.format(utc(iso))
export const formatLong = (iso: string) => longFmt.format(utc(iso))

/** The business day `n` days after `iso` (weekends skipped). */
export function addBusinessDays(iso: string, n: number) {
  const d = utc(iso)
  let left = n
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1)
    const w = d.getUTCDay()
    if (w !== 0 && w !== 6) left--
  }
  return isoDay(d)
}

/** "Dec 1–3" or "Nov 30" for an order placed on `today`. */
export function arrives(today: string, [a, b]: readonly [number, number]) {
  const from = utc(addBusinessDays(today, a))
  const to_ = utc(addBusinessDays(today, b))
  if (a === b) return dayFmt.format(from)
  const sameMonth = from.getUTCMonth() === to_.getUTCMonth()
  return sameMonth ? `${dayFmt.format(from)}–${to_.getUTCDate()}` : `${dayFmt.format(from)}–${dayFmt.format(to_)}`
}

/** Express arrives on its last day, as one date. */
export const arrivesBy = (today: string, days: readonly [number, number]) => dayFmt.format(utc(addBusinessDays(today, days[1])))

/* Navigation and titles ------------------------------------------------------------------------- */

export const DEPARTMENT_NAV: { label: string; path: string; sale?: boolean }[] = [
  ...CATEGORIES.map((c) => ({ label: c.name, path: shopPath(c.id) })),
  { label: "Gifts", path: "shop/gifts" },
  { label: "Sale", path: "shop/sale", sale: true },
]

export const BRAND_NAV: { label: string; path: string }[] = [
  { label: "Bedding", path: "shop/bedding" },
  { label: "Bath", path: "shop/bath-body" },
  { label: "Kitchen", path: "shop/kitchen-dining" },
  { label: "Apparel", path: "shop/apparel" },
  { label: "Journal", path: "journal" },
]

export const FOOTER_LINKS: [string, [string, string][]][] = [
  ["Shop", [...CATEGORIES.map((c) => [c.name, shopPath(c.id)] as [string, string]), ["Gift cards", "gift-cards"]]],
  ["Help", [["Shipping", "help#shipping"], ["Returns & exchanges", "help#returns"], ["Order status", "track"], ["FAQ", "help"], ["Contact us", "contact"]]],
  ["About", [["Our story", "about"], ["Journal", "journal"], ["Materials", "about#materials"], ["Makers", "about#makers"]]],
]

export function pageMeta(route: Route | null): { title: string; description: string } {
  const name = BRAND.name
  const simple: Partial<Record<PageId, [string, string]>> = {
    home: [`${name} · ${BRAND.tagline}`, "Linen bedding, stoneware, cast iron, waffle towels and merino, made in small workshops in Portugal and France. Free shipping over $75."],
    search: [`Search · ${name}`, "Search everything we make."],
    cart: [`Your cart · ${name}`, "Your cart, with free shipping over $75."],
    checkout: [`Checkout · ${name}`, "Contact, delivery, shipping and payment, on one page."],
    confirmation: [`Order confirmed · ${name}`, "Thank you for your order."],
    saved: [`Saved · ${name}`, "The things you saved on this device."],
    account: [`Your account · ${name}`, "Orders, addresses and saved things."],
    "sign-in": [`Sign in · ${name}`, "Sign in to see your orders."],
    track: [`Track an order · ${name}`, "Look up an order with its number and email."],
    "gift-cards": [`Gift cards · ${name}`, "An emailed gift card from $25, with your note, on the day you choose."],
    journal: [`Journal · ${name}`, "Care guides, kitchen notes and how things are made."],
    about: [`Our story · ${name}`, "Why Hollis started, and the people who make what we sell."],
    help: [`Help & FAQ · ${name}`, "Shipping, returns, orders and care."],
    contact: [`Contact us · ${name}`, `${BRAND.email} · ${BRAND.phone} · ${BRAND.hours}`],
    "not-found": [`Page not found · ${name}`, "This page does not exist."],
  }
  if (!route) return { title: simple["not-found"]![0], description: simple["not-found"]![1] }
  if (route.page === "shop") {
    const t = shopTitle(route.id)
    return { title: `${t.name} · ${name}`, description: t.blurb }
  }
  if (route.page === "product") {
    const p = productOf(route.slug)!
    return { title: `${p.name} · ${name}`, description: `${fromPrice(p)}. ${p.summary}` }
  }
  if (route.page === "post") {
    const p = POSTS.find((x) => x.slug === route.slug)!
    return { title: `${p.title} · ${name}`, description: p.summary }
  }
  if (route.page === "order") return { title: `Order #${route.number} · ${name}`, description: "Status, delivery and the things in this order." }
  const [title, description] = simple[route.page] ?? simple["not-found"]!
  return { title, description }
}
