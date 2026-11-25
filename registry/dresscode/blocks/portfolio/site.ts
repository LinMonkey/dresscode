// The Portfolio site's map: every page and its URL, the navigation, the page titles. Plain data and
// functions, shared by the server pages and the client parts. Pages live under one base path
// (/portfolio when installed); `to(base, "work", "kiln")` builds a link inside it.
import { HOME, PERSON, POSTS, PROJECTS, type Variant } from "./data"

export type Route =
  | { page: "home" }
  | { page: "work" }
  | { page: "project"; slug: string }
  | { page: "about" }
  | { page: "resume" }
  | { page: "services" }
  | { page: "writing" }
  | { page: "post"; slug: string }
  | { page: "contact" }
  | { page: "uses" }
  | { page: "now" }
  | { page: "not-found" }

export type PageId = Route["page"]

/** What every page gets: where the site lives, which home it opens on and the installed theme's id. */
export type SiteProps = { base: string; variant?: Variant; theme?: string }

export const DEFAULT_VARIANT: Variant = HOME

/** A link inside the site: to(base) is the home page, to(base, "work", "kiln") a project. */
export const to = (base: string, ...parts: string[]) => [base.replace(/\/$/, ""), ...parts].join("/") || "/"

export const NAV: { label: string; path: string; page: PageId }[] = [
  { label: "Work", path: "work", page: "work" },
  { label: "About", path: "about", page: "about" },
  { label: "Writing", path: "writing", page: "writing" },
  { label: "Services", path: "services", page: "services" },
  { label: "Contact", path: "contact", page: "contact" },
]

export const MORE: { label: string; path: string; page: PageId }[] = [
  { label: "Resume", path: "resume", page: "resume" },
  { label: "Uses", path: "uses", page: "uses" },
  { label: "Now", path: "now", page: "now" },
]

const SINGLE = ["work", "about", "resume", "services", "writing", "contact", "uses", "now"] as const

/** The page for a path under the base ([] is home), or null for a 404. */
export function resolve(path: string[] = []): Route | null {
  const [a, b, ...rest] = path
  if (rest.length) return null
  if (a === undefined) return { page: "home" }
  if (b === undefined) return (SINGLE as readonly string[]).includes(a) ? ({ page: a } as Route) : null
  if (a === "work" && PROJECTS.some((p) => p.slug === b)) return { page: "project", slug: b }
  if (a === "writing" && POSTS.some((p) => p.slug === b)) return { page: "post", slug: b }
  return null
}

/** Every path the site has, home ([]) first: for generateStaticParams. */
export function allPaths(): string[][] {
  return [[], ...SINGLE.map((p) => [p]), ...PROJECTS.map((p) => ["work", p.slug]), ...POSTS.map((p) => ["writing", p.slug])]
}

/** The page's title and description, for its <head>. */
export function pageMeta(route: Route | null): { title: string; description: string } {
  const name = PERSON.name
  const simple: Partial<Record<PageId, [string, string]>> = {
    home: [`${name} · ${PERSON.role}`, PERSON.intro],
    work: [`Work · ${name}`, `Selected projects by ${name}, ${PROJECTS.at(-1)?.year} to ${PROJECTS[0]?.year}.`],
    about: [`About · ${name}`, PERSON.bio[0]],
    resume: [`Resume · ${name}`, `${name}, ${PERSON.role}. Experience, skills and education.`],
    services: [`Services · ${name}`, `Product design, design engineering, brand and maps: how ${PERSON.first} works and what it costs.`],
    writing: [`Writing · ${name}`, `Notes on design, maps, type and running a one-person studio.`],
    contact: [`Contact · ${name}`, `${PERSON.available}. ${PERSON.replies}`],
    uses: [`Uses · ${name}`, `The desk, software and field kit ${PERSON.first} works with.`],
    now: [`Now · ${name}`, `What ${PERSON.first} is working on, learning and reading right now.`],
    "not-found": [`Page not found · ${name}`, "This page does not exist."],
  }
  if (!route) return { title: simple["not-found"]![0], description: simple["not-found"]![1] }
  if (route.page === "project") {
    const p = PROJECTS.find((x) => x.slug === route.slug)!
    return { title: `${p.title} · ${name}`, description: p.summary }
  }
  if (route.page === "post") {
    const p = POSTS.find((x) => x.slug === route.slug)!
    return { title: `${p.title} · ${name}`, description: p.summary }
  }
  const [title, description] = simple[route.page]!
  return { title, description }
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
/** "14 Oct 2026", the same on the server and in every browser. */
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`))

/** The project after this one, round the list: for "Next project" links. */
export const nextProject = (slug: string) => PROJECTS[(PROJECTS.findIndex((p) => p.slug === slug) + 1) % PROJECTS.length]

/**
 * The sample covers' grounds, per theme. By default each cover takes one of the theme's colors, but in
 * some themes two of those are the same color (Pop's main color is also its band), so two covers would
 * match. These swap one of them for another color of the same theme. `all` holds in both modes, `dark`
 * on top of it in dark mode (where a theme's colors pair up differently). Only the sample covers read them.
 */
type Grounds = Record<string, [string, string]>
const mix = (a: string, pct: number, b: string) => `color-mix(in oklab, var(--dc-${a}) ${pct}%, var(--dc-${b}))`
const COVER_GROUNDS: Record<string, { all?: Grounds; dark?: Grounds }> = {
  mono: {
    all: {
      "lumen-type": [mix("ink", 62, "page"), "var(--dc-page)"],
      kiln: [mix("ink", 40, "page"), "var(--dc-ink)"],
      "small-rooms": [mix("ink", 24, "page"), "var(--dc-ink)"],
      northbound: ["var(--dc-surface)", "var(--dc-ink)"],
    },
  },
  cobalt: { all: { "small-rooms": [mix("primary", 42, "page"), "var(--dc-ink)"] } },
  matcha: {
    all: { "lumen-type": ["var(--dc-accent)", "var(--dc-page)"], "small-rooms": [mix("highlight", 45, "page"), "var(--dc-ink)"] },
    dark: { "lumen-type": [mix("accent", 55, "page"), "var(--dc-ink)"], "small-rooms": [mix("ink", 16, "page"), "var(--dc-ink)"] },
  },
  harbor: { all: { "small-rooms": ["var(--dc-accent)", "var(--dc-page)"] }, dark: { "small-rooms": ["var(--dc-band)", "var(--dc-band-fg)"] } },
  pop: { all: { "small-rooms": ["var(--dc-accent)", "var(--dc-page)"] } },
  midnight: { all: { "small-rooms": [mix("primary", 55, "ink"), "var(--dc-page)"] } },
  sorbet: { all: { "small-rooms": ["var(--dc-band-primary)", "var(--dc-ink)"] } },
  hivis: { all: { "lumen-type": ["var(--dc-accent)", "var(--dc-page)"], "small-rooms": [mix("highlight", 40, "page"), "var(--dc-ink)"] } },
}

const declare = (g: Grounds) =>
  Object.entries(g)
    .map(([slug, [bg, fg]]) => `--pf-${slug}-bg:${bg};--pf-${slug}-fg:${fg}`)
    .join(";")

/** CSS for the site's root: the cover grounds for this theme (if it needs any), light and dark. */
export function coverCss(theme?: string) {
  const g = theme ? COVER_GROUNDS[theme] : undefined
  if (!g) return ""
  return (g.all ? `.pf-root{${declare(g.all)}}` : "") + (g.dark ? `.dark .pf-root{${declare(g.dark)}}` : "")
}
