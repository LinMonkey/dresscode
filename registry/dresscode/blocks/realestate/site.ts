// The Real estate site's map: every page and its URL, the navigation, page titles and the small
// helpers every page shares (prices, specs, the monthly payment). Plain data and functions, shared by
// the server pages and the client parts. `to(base, "homes", slug)` builds a link inside the site.
import { AGENTS, BRAND, HOODS, LISTINGS, MORTGAGE, POSTS, type Listing, type Status, type Variant } from "./data"

export type Route =
  | { page: "home" }
  | { page: "search"; status: Status }
  | { page: "listing"; slug: string }
  | { page: "agents" }
  | { page: "agent"; slug: string }
  | { page: "hoods" }
  | { page: "hood"; slug: string }
  | { page: "sell" }
  | { page: "mortgage" }
  | { page: "compare" }
  | { page: "saved" }
  | { page: "journal" }
  | { page: "post"; slug: string }
  | { page: "about" }
  | { page: "contact" }
  | { page: "not-found" }

export type PageId = Route["page"]

export type SiteProps = { base: string; variant: Variant }

export const to = (base: string, ...parts: string[]) => [base.replace(/\/$/, ""), ...parts].join("/") || "/"

const STATUS_PATH: Record<Status, string> = { sale: "buy", rent: "rent", sold: "sold" }
export const searchPath = (status: Status) => STATUS_PATH[status]

/** The page for a path under the base ([] is home), or null for a 404. */
export function resolve(path: string[] = []): Route | null {
  const [a, b, ...rest] = path
  if (rest.length) return null
  if (a === undefined) return { page: "home" }
  if (b === undefined) {
    const status = (Object.keys(STATUS_PATH) as Status[]).find((s) => STATUS_PATH[s] === a)
    if (status) return { page: "search", status }
    const single: Record<string, PageId> = { agents: "agents", neighborhoods: "hoods", sell: "sell", mortgage: "mortgage", compare: "compare", saved: "saved", journal: "journal", about: "about", contact: "contact" }
    return single[a] ? ({ page: single[a] } as Route) : null
  }
  if (a === "homes" && LISTINGS.some((l) => l.slug === b)) return { page: "listing", slug: b }
  if (a === "agents" && AGENTS.some((x) => x.slug === b)) return { page: "agent", slug: b }
  if (a === "neighborhoods" && HOODS.some((x) => x.slug === b)) return { page: "hood", slug: b }
  if (a === "journal" && POSTS.some((x) => x.slug === b)) return { page: "post", slug: b }
  return null
}

/** Every path the site has, home ([]) first: for generateStaticParams. */
export function allPaths(): string[][] {
  return [
    [],
    ["buy"],
    ["rent"],
    ["sold"],
    ...["agents", "neighborhoods", "sell", "mortgage", "compare", "saved", "journal", "about", "contact"].map((p) => [p]),
    ...LISTINGS.map((l) => ["homes", l.slug]),
    ...AGENTS.map((x) => ["agents", x.slug]),
    ...HOODS.map((x) => ["neighborhoods", x.slug]),
    ...POSTS.map((x) => ["journal", x.slug]),
  ]
}

/* Numbers ------------------------------------------------------------------------------------ */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const num = new Intl.NumberFormat("en-US")

/** $940,000 (or $3,200/mo for a rental). */
export const money = (n: number, status?: Status) => usd.format(n) + (status === "rent" ? "/mo" : "")
export const plain = (n: number) => num.format(n)

/** $940K, $1.24M, $3.2K/mo: map pins and tight spots. */
export function short(n: number, status?: Status) {
  const s = n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(/\.?0+$/, "")}M` : `$${Math.round(n / 1000)}K`
  return status === "rent" ? `$${(n / 1000).toFixed(1).replace(/\.0$/, "")}K/mo` : s
}

/** "4 bd · 3 ba · 2,650 sq ft" */
export const specs = (l: Pick<Listing, "beds" | "baths" | "sqft">) => `${l.beds} bd · ${l.baths} ba · ${plain(l.sqft)} sq ft`

/** "12 Pierline Avenue #5B" */
export const fullAddress = (l: Pick<Listing, "address" | "unit">) => (l.unit ? `${l.address} ${l.unit}` : l.address)

export const hoodOf = (slug: string) => HOODS.find((h) => h.slug === slug) ?? HOODS[0]
export const agentOf = (slug: string) => AGENTS.find((a) => a.slug === slug) ?? AGENTS[0]
export const listingOf = (slug: string) => LISTINGS.find((l) => l.slug === slug)

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`))
export const formatMonth = (iso: string) => monthFmt.format(new Date(`${iso}T00:00:00Z`))

/** The monthly cost of a home: principal and interest on the loan, property tax and insurance. */
export function payment(price: number, { down = MORTGAGE.down, rate = MORTGAGE.rate, years = MORTGAGE.years } = {}) {
  const loan = price * (1 - down / 100)
  const r = rate / 100 / 12
  const n = years * 12
  const pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
  const tax = (price * MORTGAGE.tax) / 100 / 12
  const insurance = MORTGAGE.insurance
  return { loan, pi, tax, insurance, total: pi + tax + insurance }
}

/* Navigation and titles ----------------------------------------------------------------------- */

export const NAV: { label: string; path: string; page: PageId }[] = [
  { label: "Buy", path: "buy", page: "search" },
  { label: "Rent", path: "rent", page: "search" },
  { label: "Sell", path: "sell", page: "sell" },
  { label: "Agents", path: "agents", page: "agents" },
  { label: "Neighborhoods", path: "neighborhoods", page: "hoods" },
  { label: "Journal", path: "journal", page: "journal" },
]

export const PRIVATE_NAV: { label: string; path: string; page: PageId }[] = [
  { label: "Residences", path: "buy", page: "search" },
  { label: "Sold", path: "sold", page: "search" },
  { label: "Neighborhoods", path: "neighborhoods", page: "hoods" },
  { label: "About", path: "about", page: "about" },
  { label: "Journal", path: "journal", page: "journal" },
]

export function pageMeta(route: Route | null, variant: Variant = "platform"): { title: string; description: string } {
  const name = variant === "boutique" ? BRAND.private : BRAND.legal
  const simple: Partial<Record<PageId, [string, string]>> = {
    home: [`${name} · Homes for sale and rent in ${BRAND.city}`, variant === "boutique" ? BRAND.privateIntro : BRAND.intro],
    agents: [`Agents · ${name}`, `${BRAND.agents} agents who live where they sell, across ${BRAND.city}.`],
    hoods: [`Neighborhoods · ${name}`, `Six neighborhoods of ${BRAND.city}: what they are like, what homes cost and what is for sale.`],
    sell: [`What's your home worth? · ${name}`, "A free valuation from an agent who has sold on your street, within two days."],
    mortgage: [`Mortgage calculator · ${name}`, "What a home costs each month: principal and interest, property tax and insurance."],
    compare: [`Compare homes · ${name}`, "Up to three homes side by side."],
    saved: [`Saved homes · ${name}`, "The homes you saved on this device."],
    journal: [`Journal · ${name}`, `Guides to buying, selling and living in ${BRAND.city}.`],
    about: [`About · ${name}`, `A local brokerage in ${BRAND.city} since ${BRAND.since}.`],
    contact: [`Contact · ${name}`, `${BRAND.address} · ${BRAND.phone}`],
    "not-found": [`Page not found · ${name}`, "This page does not exist."],
  }
  if (!route) return { title: simple["not-found"]![0], description: simple["not-found"]![1] }
  if (route.page === "search") {
    const what = { sale: "Homes for sale", rent: "Homes for rent", sold: "Recently sold homes" }[route.status]
    return { title: `${what} in ${BRAND.city} · ${name}`, description: `${what} in ${BRAND.city}, on a map and in a list.` }
  }
  if (route.page === "listing") {
    const l = listingOf(route.slug)!
    return { title: `${fullAddress(l)}, ${BRAND.city} · ${money(l.price, l.status)}`, description: `${specs(l)}. ${l.summary}` }
  }
  if (route.page === "agent") {
    const a = agentOf(route.slug)
    return { title: `${a.name} · ${name}`, description: a.bio }
  }
  if (route.page === "hood") {
    const h = hoodOf(route.slug)
    return { title: `${h.name}, ${BRAND.city} · ${name}`, description: h.description }
  }
  if (route.page === "post") {
    const p = POSTS.find((x) => x.slug === route.slug)!
    return { title: `${p.title} · ${name}`, description: p.summary }
  }
  const [title, description] = simple[route.page] ?? simple["not-found"]!
  return { title, description }
}
