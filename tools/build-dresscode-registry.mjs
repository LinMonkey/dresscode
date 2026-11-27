#!/usr/bin/env node
// Builds the DressCode shadcn registry from the sources, so `shadcn add` installs exactly what the demos
// render. Runs before `next dev` and `next build` (package.json predev / prebuild), after build-docs.
//
//   public/r/dresscode/<theme-id>.json        a theme: both modes' colors, fonts, corners and the dc-* CSS
//       npx shadcn@latest add https://dresscodeui.com/r/dresscode/cobalt.json
//   public/r/dresscode/font-<role>-<family>.json  the next/font families a theme pulls in (registry:font)
//   public/r/dresscode/orbit-landing.json     the Orbit landing template's blocks and an /orbit page
//       npx shadcn@latest add https://dresscodeui.com/r/dresscode/orbit-landing.json
//   public/r/dresscode/orbit-app.json         the Orbit app dashboard: its screens and /orbit-app/<screen> pages
//       npx shadcn@latest add https://dresscodeui.com/r/dresscode/orbit-app.json
//   public/r/dresscode/portfolio.json         the Portfolio site: its pages and /portfolio/<page> routes
//       npx shadcn@latest add https://dresscodeui.com/r/dresscode/portfolio.json
//   public/r/dresscode/<component>[-<example>].json  a component and its examples (registry/dresscode/components)
//   public/r/dresscode/<category>-<block>.json  a block, one file (registry/dresscode/sections)
//   public/r/dresscode/registry.json          the index
//   private/registry/<name>.json              the paid templates (tools/paid-templates.mjs), NOT public: served to a
//       license key by app/r/pro/[name], never as static files (tools/check-paid-boundary.mjs checks)
//
// Every theme must pass tools/dresscode-contrast.mjs in both modes, and every item must parse with
// shadcn's own registry-item schema, or nothing is written.
//
// Usage: node tools/build-dresscode-registry.mjs [--base https://dresscodeui.com]
//   --base sets the host written into URLs (http://localhost:3700 to test installs locally).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { registryItemSchema, registrySchema } from "shadcn/schema"

import { FONT_SPECS, MODELESS_VARS, THEMES, themeVars } from "../registry/dresscode/themes.ts"
import { check } from "./dresscode-contrast.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const argv = process.argv.slice(2)
const BASE = (argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : process.env.REGISTRY_BASE) || "https://dresscodeui.com"
const OUT = "public/r/dresscode"
const AUTHOR = "DressCode UI <https://dresscodeui.com>"
const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const url = (name) => `${BASE}/r/dresscode/${name}.json`

const read = (p) => readFileSync(join(root, p), "utf8").replace(/\r\n/g, "\n")
// Only touch files whose content changed (the dev server reloads on every write), and remember what
// this run produced so stale files can be removed at the end.
const written = new Set()
const outputs = []
const write = (p, s) => {
  const full = join(root, p)
  written.add(full)
  if (existsSync(full) && readFileSync(full, "utf8") === s) return
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, s)
}
const json = (o) => JSON.stringify(o, null, 2) + "\n"
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase()

// ---------------------------------------------------------------------------------------------
// Contrast: refuse to publish a theme with a failing pair (template-side warnings are printed only).

const rows = check()
const failing = rows.filter((r) => r.ratio < r.min && !r.template)
if (failing.length) {
  for (const r of failing) console.error(`[dresscode] contrast ${r.theme} ${r.mode} ${r.what}: ${r.ratio.toFixed(2)} < ${r.min} (${r.fg} on ${r.bg})`)
  throw new Error(`${failing.length} theme color pairs fail contrast; run node tools/dresscode-contrast.mjs`)
}

// ---------------------------------------------------------------------------------------------
// dresscode.css as the registry's `css` object: { "@layer components": { ".dc-card": { ... } }, ... }.

function cssToObject(src) {
  src = src.replace(/\/\*[\s\S]*?\*\//g, "")
  let i = 0
  const block = () => {
    const out = {}
    while (i < src.length) {
      while (/\s/.test(src[i] ?? "")) i++
      if (i >= src.length) break
      if (src[i] === "}") {
        i++
        break
      }
      let j = i
      while (j < src.length && !";{}".includes(src[j])) j++
      const head = src.slice(i, j).replace(/\s+/g, " ").trim()
      if (src[j] === "{") {
        i = j + 1
        const inner = block()
        out[head] = { ...(out[head] ?? {}), ...inner }
      } else {
        const colon = head.indexOf(":")
        if (colon > 0) out[head.slice(0, colon).trim()] = head.slice(colon + 1).trim()
        i = src[j] === ";" ? j + 1 : j
      }
    }
    return out
  }
  return block()
}
const dcCss = cssToObject(read("registry/dresscode/dresscode.css"))
if (!dcCss["@layer components"]?.[".dc-card"]) throw new Error("dresscode.css: could not read .dc-card")

// ---------------------------------------------------------------------------------------------
// Fonts: one registry:font item per family and role. The CLI adds the next/font call to
// app/layout.tsx and the variable to <html>; the theme's variables read --font-sans, --font-heading
// and --font-mono.

const fontItems = new Map()
function fontItem(key, variable) {
  const spec = FONT_SPECS[key]
  const role = variable.replace("--font-", "")
  const name = `font-${role}-${kebab(key)}`
  if (fontItems.has(name)) return name
  const weight = spec.options?.weight
  const isStatic = Boolean(weight)
  const slug = kebab(spec.name.replace(/ /g, "-"))
  fontItems.set(name, {
    $schema: SCHEMA,
    name,
    type: "registry:font",
    title: `${spec.name} (${role})`,
    author: AUTHOR,
    font: {
      family: `'${spec.name}${isStatic ? "" : " Variable"}', ${spec.fallback}`,
      provider: "google",
      import: spec.loader,
      variable,
      subsets: ["latin"],
      ...(weight ? { weight: Array.isArray(weight) ? weight : [weight] } : {}),
      // The number face is not the page's code font: it goes on .dc-num only, not on <html>.
      ...(variable === "--font-mono" ? { selector: ".dc-num" } : {}),
      // Outside Next.js the CLI installs the family from Fontsource instead.
      dependency: `${isStatic ? "@fontsource" : "@fontsource-variable"}/${slug}`,
    },
  })
  return name
}

/** next/font options the CLI's font items cannot carry (italic styles, optical-size axes), as a docs note. */
function extraFontOptions(roles) {
  const notes = [...roles.keys()].flatMap((k) => {
    const { weight, ...rest } = FONT_SPECS[k].options ?? {}
    if (!Object.keys(rest).length) return []
    const opts = Object.entries(rest).map(([o, v]) => `${o}: ${JSON.stringify(v)}`).join(", ")
    return [`add ${opts} to the ${FONT_SPECS[k].loader}(...) call`]
  })
  return notes.length ? ` For an exact match with the demo (true italics, optical sizes), ${notes.join(" and ")} in app/layout.tsx.` : ""
}

/** Which CSS variable carries each of a theme's families: text, then headings, then figures. */
function fontRoles(t) {
  const roles = new Map([[t.fonts.body, "--font-sans"]])
  if (!roles.has(t.fonts.heading)) roles.set(t.fonts.heading, "--font-heading")
  if (t.fonts.num && !roles.has(t.fonts.num)) roles.set(t.fonts.num, "--font-mono")
  return roles
}

// ---------------------------------------------------------------------------------------------
// Themes.

const TS = (o, indent = "  ") =>
  "{\n" + Object.entries(o).map(([k, v]) => `${indent}  ${k}: ${typeof v === "object" ? TS(v, indent + "  ") : JSON.stringify(v)},`).join("\n") + `\n${indent}}`

function themeItem(t) {
  const roles = fontRoles(t)
  const font = (k) => `var(${roles.get(k)}), ${FONT_SPECS[k].fallback}`
  const strip = (vars) => Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]))
  // --font-sans is the next/font variable itself (set on <html>), so it never goes in :root.
  const light = strip(Object.fromEntries(Object.entries(themeVars(t, font, "light")).filter(([k]) => k !== "--font-sans")))
  const dark = strip(Object.fromEntries(Object.entries(themeVars(t, font, "dark")).filter(([k]) => !MODELESS_VARS.includes(k))))
  const fontDeps = [...roles].map(([key, variable]) => fontItem(key, variable))
  const fontNames = [...roles].map(([key, variable]) => `${FONT_SPECS[key].name} (${variable})`).join(", ")
  const other = t.mode === "dark" ? "light" : "dark"
  const themeFile = [
    `// The DressCode theme this project wears: ${t.name}. Written by`,
    `//   npx shadcn@latest add ${url(t.id)}`,
    "// Its colors (light in :root, dark in .dark), fonts and corners are CSS variables in your globals.css.",
    "// These are the layout choices that come with it; the templates read them.",
    `// ${t.name} was designed ${t.mode} (mode). ${t.mode === "dark" ? 'Put className="dark" on <html> for it, or use next-themes with defaultTheme="dark".' : 'Put className="dark" on <html> (or use next-themes) for its dark version.'}`,
    `export const dresscode = ${TS({
      theme: t.id,
      name: t.name,
      mode: t.mode,
      layout: { bandAt: t.bandAt, mark: t.mark, glow: Boolean(t.glow), brutal: Boolean(t.brutal) },
    }, "")} as const`,
    "",
  ].join("\n")

  return {
    $schema: SCHEMA,
    name: t.id,
    type: "registry:theme",
    title: `DressCode ${t.name}`,
    description: `${t.blurb} Light and dark, ${roles.size === 1 ? FONT_SPECS[t.fonts.body].name : [...roles.keys()].map((k) => FONT_SPECS[k].name).join(" and ")}, ${t.radius.control}px controls and ${t.radius.card}px cards.`,
    author: AUTHOR,
    registryDependencies: fontDeps.map(url),
    cssVars: {
      theme: {
        ...Object.fromEntries([...roles.values()].map((v) => [v.slice(2), `var(${v})`])),
        "radius-card": "var(--dc-radius-card)",
      },
      light,
      dark,
    },
    css: {
      "@layer base": { ":root": { "color-scheme": "light" }, ".dark": { "color-scheme": "dark" } },
      ...dcCss,
    },
    files: [{ path: "registry/dresscode/lib/dresscode-theme.ts", type: "registry:lib", content: themeFile }],
    docs: [
      `DressCode ${t.name} is installed: both modes' colors in globals.css (:root is light, .dark is dark), the dc-* classes, and lib/dresscode-theme.ts.`,
      `Fonts: ${fontNames}. The CLI added the next/font calls to app/layout.tsx and their variables to <html>; outside Next.js it installs them from Fontsource.${extraFontOptions(roles)}`,
      `${t.name} was designed ${t.mode}: ${t.mode === "dark" ? 'put className="dark" on <html> for it' : `add className="dark" on <html> for its ${other} version`} (or use next-themes).`,
      `Templates: npx shadcn@latest add ${url("orbit-landing")} (landing page), ${url("orbit-app")} (app dashboard) and ${url("portfolio")} (personal site)`,
      "Components and blocks that wear it: https://dresscodeui.com/components and https://dresscodeui.com/blocks",
    ].join("\n"),
  }
}

// ---------------------------------------------------------------------------------------------
// Blocks: a template's files from registry/dresscode/blocks/<dir>, the shadcn/ui components and npm
// packages they import, and a page that renders it.

const ORBIT_APP_LAYOUT = [
  "// The Orbit app in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).",
  "// Pop's ink outlines come from the dc-brutal class; light or dark follows <html class=\"dark\">.",
  'import type { Metadata } from "next"',
  'import type { ReactNode } from "react"',
  "",
  'import { dresscode } from "@/lib/dresscode-theme"',
  "",
  'export const metadata: Metadata = { title: "Orbit" }',
  "",
  "export default function OrbitAppLayout({ children }: { children: ReactNode }) {",
  '  return <div className={dresscode.layout.brutal ? "dc-theme dc-brutal min-h-svh" : "dc-theme min-h-svh"}>{children}</div>',
  "}",
  "",
].join("\n")

const ORBIT_APP_INDEX = [
  'import { redirect } from "next/navigation"',
  "",
  "export default function OrbitAppIndex() {",
  '  redirect("/orbit-app/overview")',
  "}",
  "",
].join("\n")

const ORBIT_APP_SCREEN = [
  "// Every screen of the Orbit app: /orbit-app/overview, /orbit-app/invoices, /orbit-app/settings and so on.",
  "// Swap the sample data in components/orbit-app/data.ts for your own as you wire it up.",
  'import type { Metadata } from "next"',
  'import { notFound } from "next/navigation"',
  'import type { ReactNode } from "react"',
  "",
  'import { SignInScreen, SignUpScreen } from "@/components/orbit-app/auth"',
  'import { ClientDetailScreen, ClientsScreen } from "@/components/orbit-app/clients"',
  'import { InvoiceDetailScreen } from "@/components/orbit-app/invoice-detail"',
  'import { InvoiceEditorScreen } from "@/components/orbit-app/invoice-editor"',
  'import { InvoicesScreen } from "@/components/orbit-app/invoices"',
  'import { OverviewScreen } from "@/components/orbit-app/overview"',
  'import { PaymentsScreen } from "@/components/orbit-app/payments"',
  'import { ReportsScreen } from "@/components/orbit-app/reports"',
  'import { SCREENS, SCREEN_IDS, isScreen, type Screen } from "@/components/orbit-app/screens"',
  'import { SettingsScreen } from "@/components/orbit-app/settings"',
  'import { AppShell, StandaloneShell } from "@/components/orbit-app/shell"',
  'import { NotFoundScreen, RecurringScreen } from "@/components/orbit-app/states"',
  'import { dresscode } from "@/lib/dresscode-theme"',
  "",
  "export const dynamicParams = false",
  "",
  "export function generateStaticParams() {",
  "  return SCREEN_IDS.map((screen) => ({ screen }))",
  "}",
  "",
  "type Params = { params: Promise<{ screen: string }> }",
  "",
  "export async function generateMetadata({ params }: Params): Promise<Metadata> {",
  "  const { screen } = await params",
  '  return { title: isScreen(screen) ? `${SCREENS[screen].label} · Orbit` : "Orbit" }',
  "}",
  "",
  "const VIEWS: Record<Screen, () => ReactNode> = {",
  "  overview: () => <OverviewScreen />,",
  "  invoices: () => <InvoicesScreen />,",
  "  invoice: () => <InvoiceDetailScreen />,",
  '  "invoice-new": () => <InvoiceEditorScreen />,',
  "  recurring: () => <RecurringScreen />,",
  "  clients: () => <ClientsScreen />,",
  "  client: () => <ClientDetailScreen />,",
  "  payments: () => <PaymentsScreen />,",
  "  reports: () => <ReportsScreen />,",
  "  settings: () => <SettingsScreen />,",
  '  "sign-in": () => <SignInScreen />,',
  '  "sign-up": () => <SignUpScreen />,',
  '  "not-found": () => <NotFoundScreen />,',
  "}",
  "",
  "export default async function OrbitAppScreen({ params }: Params) {",
  "  const { screen } = await params",
  "  if (!isScreen(screen)) notFound()",
  '  const base = "/orbit-app"',
  "  const view = VIEWS[screen]()",
  "  return SCREENS[screen].inShell ? (",
  "    <AppShell base={base} screen={screen} defaultMode={dresscode.mode}>",
  "      {view}",
  "    </AppShell>",
  "  ) : (",
  "    <StandaloneShell base={base} screen={screen} defaultMode={dresscode.mode}>",
  "      {view}",
  "    </StandaloneShell>",
  "  )",
  "}",
  "",
].join("\n")

const PORTFOLIO_LAYOUT = [
  "// The Portfolio site in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).",
  "// Light or dark is <html class=\"dark\">, as in shadcn/ui: until a visitor picks, the site follows your root",
  "// layout (a theme designed dark wants className=\"dark\" there, or next-themes). The site's switch remembers",
  '// the pick under localStorage "theme", the key next-themes uses; this applies it before the first paint.',
  'import type { ReactNode } from "react"',
  "",
  'const MODE = `try{var m=localStorage.getItem("theme"),h=document.documentElement;if(m==="light"||m==="dark"){h.classList.toggle("dark",m==="dark");h.style.colorScheme=m}}catch(e){}`',
  "",
  "export default function PortfolioLayout({ children }: { children: ReactNode }) {",
  "  return (",
  "    <>",
  "      <script dangerouslySetInnerHTML={{ __html: MODE }} />",
  "      {children}",
  "    </>",
  "  )",
  "}",
  "",
].join("\n")

const PORTFOLIO_HOME = [
  "// The Portfolio site's home page: the index or the grid home, whichever HOME in components/portfolio/data.ts says.",
  'import type { Metadata } from "next"',
  "",
  'import { PortfolioSite, portfolioMetadata } from "@/components/portfolio/portfolio"',
  'import { dresscode } from "@/lib/dresscode-theme"',
  "",
  "export const metadata: Metadata = portfolioMetadata([])",
  "",
  "export default function PortfolioHome() {",
  '  return <PortfolioSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
  "}",
  "",
].join("\n")

const PORTFOLIO_PAGE = [
  "// Every other page of the Portfolio site: /portfolio/work, /portfolio/work/<project>, /portfolio/about,",
  "// /portfolio/writing/<post> and so on. All of them are built at build time; anything else is the",
  "// site's own 404 (not-found.tsx).",
  'import type { Metadata } from "next"',
  'import { notFound } from "next/navigation"',
  "",
  'import { allPaths, PortfolioSite, portfolioMetadata, resolve } from "@/components/portfolio/portfolio"',
  'import { dresscode } from "@/lib/dresscode-theme"',
  "",
  "export function generateStaticParams() {",
  "  return allPaths()",
  "    .filter((path) => path.length)",
  "    .map((path) => ({ path }))",
  "}",
  "",
  "type Params = { params: Promise<{ path: string[] }> }",
  "",
  "export async function generateMetadata({ params }: Params): Promise<Metadata> {",
  "  const { path } = await params",
  "  return portfolioMetadata(path)",
  "}",
  "",
  "export default async function PortfolioPage({ params }: Params) {",
  "  const { path } = await params",
  "  if (!resolve(path)) notFound()",
  '  return <PortfolioSite path={path} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
  "}",
  "",
].join("\n")

const PORTFOLIO_NOT_FOUND = [
  "// A missing page under /portfolio, in the site's own frame.",
  'import { PortfolioSite } from "@/components/portfolio/portfolio"',
  'import { dresscode } from "@/lib/dresscode-theme"',
  "",
  "export default function PortfolioNotFound() {",
  '  return <PortfolioSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
  "}",
  "",
].join("\n")

// The portfolio styles (Sidebar, Poster, Bento, Desktop, Garden): one home each, the Portfolio template's
// pages in the style's own frame, at the same /portfolio routes. Each installs the Portfolio template's
// files too (components/portfolio), so it stands alone. A style may bring its own layout (opts.layout).
const styleRoutes = (style, Site, meta, layout = PORTFOLIO_LAYOUT) => [
  { name: "layout.tsx", target: "app/portfolio/layout.tsx", content: layout },
  {
    name: "page.tsx",
    target: "app/portfolio/page.tsx",
    content: [
      `// The ${style[0].toUpperCase() + style.slice(1)} portfolio's home page.`,
      'import type { Metadata } from "next"',
      "",
      `import { ${Site}, ${meta} } from "@/components/portfolio-${style}/${style}"`,
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      `export const metadata: Metadata = ${meta}([])`,
      "",
      "export default function PortfolioHome() {",
      `  return <${Site} path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />`,
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "path-page.tsx",
    target: "app/portfolio/[...path]/page.tsx",
    content: [
      "// Every other page: /portfolio/work, /portfolio/work/<project>, /portfolio/about, /portfolio/writing/<post>",
      "// and so on, built at build time; anything else is the site's own 404 (not-found.tsx).",
      'import type { Metadata } from "next"',
      'import { notFound } from "next/navigation"',
      "",
      'import { allPaths, resolve } from "@/components/portfolio/site"',
      `import { ${Site}, ${meta} } from "@/components/portfolio-${style}/${style}"`,
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export function generateStaticParams() {",
      "  return allPaths()",
      "    .filter((path) => path.length)",
      "    .map((path) => ({ path }))",
      "}",
      "",
      "type Params = { params: Promise<{ path: string[] }> }",
      "",
      "export async function generateMetadata({ params }: Params): Promise<Metadata> {",
      "  const { path } = await params",
      `  return ${meta}(path)`,
      "}",
      "",
      "export default async function PortfolioPage({ params }: Params) {",
      "  const { path } = await params",
      "  if (!resolve(path)) notFound()",
      `  return <${Site} path={path} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />`,
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "not-found.tsx",
    target: "app/portfolio/not-found.tsx",
    content: [
      "// A missing page under /portfolio, in the site's own frame.",
      `import { ${Site} } from "@/components/portfolio-${style}/${style}"`,
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export default function PortfolioNotFound() {",
      `  return <${Site} path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />`,
      "}",
      "",
    ].join("\n"),
  },
]

const portfolioFiles = () =>
  readdirSync(join(root, "registry/dresscode/blocks/portfolio"))
    .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    .sort()
    .map((f) => ({ path: `registry/dresscode/blocks/portfolio/${f}`, target: `components/portfolio/${f}` }))

const portfolioStyle = (style, title, description, pages = [], docs = null, opts = {}) => {
  const Name = style[0].toUpperCase() + style.slice(1)
  return {
    name: `portfolio-${style}`,
    title,
    description,
    dir: `registry/dresscode/blocks/portfolio-${style}`,
    target: `components/portfolio-${style}`,
    exts: [".tsx", ".ts"],
    exclude: [],
    extra: portfolioFiles(),
    pages: [...styleRoutes(style, `${Name}Site`, `${style}Metadata`, opts.layout), ...pages],
    docs: docs ?? [
      `${title}: the style is in components/portfolio-${style}/ and the pages it shares with the Portfolio template are in components/portfolio/; the routes are /portfolio, /portfolio/work, /portfolio/about and so on.`,
      "Make it yours in components/portfolio/data.ts: your name, photo (PERSON.portrait), projects, posts and prices.",
      "Give each project an image (and its plates a src) to replace the drawn sample covers.",
    ],
  }
}

// The Real estate site: its pages at /realestate, /realestate/buy, /realestate/homes/<listing> and so on.
const REALESTATE_PAGES = [
  { name: "layout.tsx", target: "app/realestate/layout.tsx", content: PORTFOLIO_LAYOUT.replace("The Portfolio site", "The Real estate site").replace("PortfolioLayout", "RealEstateLayout") },
  {
    name: "page.tsx",
    target: "app/realestate/page.tsx",
    content: [
      "// The Real estate site's home page: the platform or the boutique one, whichever HOME in components/realestate/data.ts says.",
      'import type { Metadata } from "next"',
      "",
      'import { RealEstateSite, realEstateMetadata } from "@/components/realestate/realestate"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export const metadata: Metadata = realEstateMetadata([])",
      "",
      "export default function RealEstateHome() {",
      '  return <RealEstateSite path={[]} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "path-page.tsx",
    target: "app/realestate/[...path]/page.tsx",
    content: [
      "// Every other page: /realestate/buy, /realestate/homes/<listing>, /realestate/agents/<agent> and so on,",
      "// built at build time; anything else is the site's own 404 (not-found.tsx).",
      'import type { Metadata } from "next"',
      'import { notFound } from "next/navigation"',
      "",
      'import { allPaths, RealEstateSite, realEstateMetadata, resolve } from "@/components/realestate/realestate"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export function generateStaticParams() {",
      "  return allPaths()",
      "    .filter((path) => path.length)",
      "    .map((path) => ({ path }))",
      "}",
      "",
      "type Params = { params: Promise<{ path: string[] }> }",
      "",
      "export async function generateMetadata({ params }: Params): Promise<Metadata> {",
      "  const { path } = await params",
      "  return realEstateMetadata(path)",
      "}",
      "",
      "export default async function RealEstatePage({ params }: Params) {",
      "  const { path } = await params",
      "  if (!resolve(path)) notFound()",
      '  return <RealEstateSite path={path} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "not-found.tsx",
    target: "app/realestate/not-found.tsx",
    content: [
      "// A missing page under /realestate, in the site's own frame.",
      'import { RealEstateSite } from "@/components/realestate/realestate"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export default function RealEstateNotFound() {",
      '  return <RealEstateSite path={["not-found"]} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
]

// The E-commerce store: its pages at /store, /store/shop, /store/products/<product>, /store/checkout and so on.
const ECOMMERCE_PAGES = [
  { name: "layout.tsx", target: "app/store/layout.tsx", content: PORTFOLIO_LAYOUT.replace("The Portfolio site", "The E-commerce store").replace("PortfolioLayout", "StoreLayout") },
  {
    name: "page.tsx",
    target: "app/store/page.tsx",
    content: [
      "// The store's home page: the department store or the brand one, whichever HOME in components/ecommerce/data.ts says.",
      'import type { Metadata } from "next"',
      "",
      'import { EcommerceSite, ecommerceMetadata } from "@/components/ecommerce/ecommerce"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export const metadata: Metadata = ecommerceMetadata([])",
      "",
      "export default function StoreHome() {",
      '  return <EcommerceSite path={[]} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "path-page.tsx",
    target: "app/store/[...path]/page.tsx",
    content: [
      "// Every other page: /store/shop, /store/shop/<department>, /store/products/<product>, /store/cart,",
      "// /store/checkout and so on, built at build time; anything else is the store's own 404 (not-found.tsx).",
      'import type { Metadata } from "next"',
      'import { notFound } from "next/navigation"',
      "",
      'import { allPaths, EcommerceSite, ecommerceMetadata, resolve } from "@/components/ecommerce/ecommerce"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export function generateStaticParams() {",
      "  return allPaths()",
      "    .filter((path) => path.length)",
      "    .map((path) => ({ path }))",
      "}",
      "",
      "type Params = { params: Promise<{ path: string[] }> }",
      "",
      "export async function generateMetadata({ params }: Params): Promise<Metadata> {",
      "  const { path } = await params",
      "  return ecommerceMetadata(path)",
      "}",
      "",
      "export default async function StorePage({ params }: Params) {",
      "  const { path } = await params",
      "  if (!resolve(path)) notFound()",
      '  return <EcommerceSite path={path} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
  {
    name: "not-found.tsx",
    target: "app/store/not-found.tsx",
    content: [
      "// A missing page under /store, in the store's own frame.",
      'import { EcommerceSite } from "@/components/ecommerce/ecommerce"',
      'import { dresscode } from "@/lib/dresscode-theme"',
      "",
      "export default function StoreNotFound() {",
      '  return <EcommerceSite path={["not-found"]} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />',
      "}",
      "",
    ].join("\n"),
  },
]

const BLOCKS = [
  {
    name: "orbit-landing",
    title: "Orbit landing page",
    description: "A SaaS landing page in 18 modules (navbar, hero with product shot, logos, features, use cases, bento, steps, stats, testimonials, integrations, pricing, plan comparison, FAQ, blog, closing call, footer) for a made-up invoicing product. Wears whichever DressCode theme is installed.",
    dir: "registry/dresscode/blocks/orbit",
    target: "components/orbit",
    exclude: ["theme-switcher.tsx"], // the demo's floating picker, not part of the template
    page: {
      target: "app/orbit/page.tsx",
      content: [
        "// The Orbit landing page in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).",
        'import type { Metadata } from "next"',
        "",
        'import { OrbitLanding } from "@/components/orbit/landing"',
        'import { dresscode } from "@/lib/dresscode-theme"',
        "",
        'export const metadata: Metadata = { title: "Orbit" }',
        "",
        "export default function OrbitPage() {",
        "  return <OrbitLanding {...dresscode.layout} />",
        "}",
        "",
      ].join("\n"),
    },
  },
  {
    name: "orbit-app",
    title: "Orbit app dashboard",
    description:
      "The app behind the Orbit landing page: a shell with sidebar, command palette, notifications and user menu, and 13 screens (overview, invoices, invoice detail and editor, recurring, clients and client detail, payments, reports, settings, sign in, sign up, not found). Wears whichever DressCode theme is installed, in light and dark.",
    dir: "registry/dresscode/blocks/orbit-app",
    target: "components/orbit-app",
    exts: [".tsx", ".ts"],
    exclude: ["theme-switcher.tsx"], // the demo's floating picker, not part of the template
    // The two landing-page pieces the app reuses (its logo, status pills and product chart).
    extra: [
      { path: "registry/dresscode/blocks/orbit/shared.tsx", target: "components/orbit/shared.tsx" },
      { path: "registry/dresscode/blocks/orbit/product-preview.tsx", target: "components/orbit/product-preview.tsx" },
    ],
    // The demo takes the mode type from the theme data; in a project it is just light or dark.
    rewrite: [['import type { Mode } from "@/registry/dresscode/themes"\n\nexport type { Mode }', 'export type Mode = "light" | "dark"']],
    pages: [
      { name: "layout.tsx", target: "app/orbit-app/layout.tsx", content: ORBIT_APP_LAYOUT },
      { name: "page.tsx", target: "app/orbit-app/page.tsx", content: ORBIT_APP_INDEX },
      { name: "screen-page.tsx", target: "app/orbit-app/[screen]/page.tsx", content: ORBIT_APP_SCREEN },
    ],
    docs: [
      "Orbit app dashboard: the screens are in components/orbit-app/ and the routes are /orbit-app/<screen> (start at /orbit-app/overview).",
      "Sample data lives in components/orbit-app/data.ts; replace it with your own as you wire the screens to your backend.",
    ],
  },
  {
    name: "portfolio",
    title: "Portfolio site",
    description:
      "A personal site for a designer or developer, in 14 kinds of page: two home pages (a text-first index or a grid of covers), work with a tag filter, case-study and gallery project pages, about, a résumé that prints to one A4 page, services with prices, writing with code highlighting, contact form, uses, now and a 404. Wears whichever DressCode theme is installed, in light and dark.",
    dir: "registry/dresscode/blocks/portfolio",
    target: "components/portfolio",
    exts: [".tsx", ".ts"],
    exclude: [],
    pages: [
      { name: "layout.tsx", target: "app/portfolio/layout.tsx", content: PORTFOLIO_LAYOUT },
      { name: "page.tsx", target: "app/portfolio/page.tsx", content: PORTFOLIO_HOME },
      { name: "path-page.tsx", target: "app/portfolio/[...path]/page.tsx", content: PORTFOLIO_PAGE },
      { name: "not-found.tsx", target: "app/portfolio/not-found.tsx", content: PORTFOLIO_NOT_FOUND },
    ],
    docs: [
      "Portfolio site: the pages are in components/portfolio/ and the routes are /portfolio, /portfolio/work, /portfolio/about and so on.",
      "Make it yours in components/portfolio/data.ts: your name, projects, posts and prices, and HOME (\"index\" or \"grid\") for the home page.",
      "Give each project an image (and its plates a src) to replace the drawn sample covers.",
    ],
  },
  {
    name: "realestate",
    title: "Real estate site",
    description:
      "A real estate site for a brokerage or a private office: two home pages (search first, or a full-bleed photograph), search with a list and a drawn map (filters, a drawn area, saved searches), listing pages with a photo viewer, tour booking, floor plan, schools and a payment calculator, agents, neighborhoods, a three-step valuation, a mortgage calculator, compare, saved homes, a journal, about and contact. Wears the installed DressCode theme in light and dark.",
    dir: "registry/dresscode/blocks/realestate",
    target: "components/realestate",
    exts: [".tsx", ".ts"],
    exclude: [],
    pages: REALESTATE_PAGES,
    docs: [
      "Real estate site: the pages are in components/realestate/ and the routes are /realestate, /realestate/buy, /realestate/homes/<listing> and so on.",
      'Make it yours in components/realestate/data.ts: the brokerage, its city and neighborhoods, the listings, agents and journal, and HOME ("platform" or "boutique").',
      "The sample photographs load from dresscodeui.com; point the keys in components/realestate/assets.ts at your own photos.",
    ],
  },
  {
    name: "ecommerce",
    title: "E-commerce store",
    description:
      "An online store for a brand or a shop with many departments: two home pages (a department store with a big search, or a brand with a full-bleed photograph), shop pages with filters in the address bar, product pages with colors, sizes, sold-out sizes, a size guide, reviews and pairs-well-with, a cart drawer with free-shipping progress, one-page checkout with discount codes, taxes and gift cards, order confirmation, account and orders, track an order, gift cards, saved items, search with suggestions, a journal, about, help and contact. Runs on local data with hooks for your payment provider. Wears the installed DressCode theme in light and dark.",
    dir: "registry/dresscode/blocks/ecommerce",
    target: "components/ecommerce",
    exts: [".tsx", ".ts"],
    exclude: [],
    pages: ECOMMERCE_PAGES,
    docs: [
      "E-commerce store: the pages are in components/ecommerce/ and the routes are /store, /store/shop, /store/products/<product>, /store/checkout and so on.",
      'Make it yours in components/ecommerce/data.ts: the brand, the store\'s rules (shipping, returns, codes, taxes), departments, products, reviews and journal, and HOME ("department" or "brand").',
      "The cart, saved items and orders live in the browser (store.ts); payment is a hook (placeOrder in checkout.tsx) for Stripe, Shopify or your own API.",
      "The sample photographs load from dresscodeui.com; point the keys in components/ecommerce/assets.ts at your own photos.",
    ],
  },
  portfolioStyle("sidebar", "Sidebar portfolio", "A personal site laid out like a résumé you can scroll: name, sections and contact stay on the left while experience, projects and writing scroll on the right, with the section you are reading lit up. Every page of the Portfolio template, in the same frame. Wears the installed DressCode theme in light and dark."),
  portfolioStyle("poster", "Poster portfolio", "A personal site in very big type: the name runs across the home page, the work is a list of huge titles with the cover following the cursor, one colored band and a giant \"Let's talk\". Project pages open with the title at poster size. Every page of the Portfolio template, in the same frame."),
  portfolioStyle("bento", "Bento portfolio", "A personal site whose home page is one screen of tiles: you and your photo, a drawn map with your local time, a big number, the latest project, writing, now and a newsletter, then a wall of covers with a filter. Every page of the Portfolio template, in the same frame."),
  portfolioStyle("desktop", "Desktop portfolio", "A personal site that is a computer: a menu bar, icons, windows you can drag, stack and close, a dock and a terminal. Every page (a project, a post, the résumé) opens as a window with its own address; on a phone it is a home screen of apps."),
  portfolioStyle(
    "garden",
    "Garden portfolio",
    "A personal site laid out like a quiet magazine that is also a digital garden: the home page is an issue with a lead essay, notes you can filter by how finished they are, the work as a photo spread and a newsletter band; essays get a drop cap, numbered margin notes and contents. Ships sample photographs and an RSS feed. Every page of the Portfolio template, in the same frame.",
    [{ name: "feed-route.ts", target: "app/portfolio/feed.xml/route.ts", content: 'export { portfolioFeed as GET } from "@/components/portfolio-garden/feed"\n' }],
  ),
]

// The paid templates (Stage, Ring and Spec, 11-27) are listed in tools/paid-templates.mjs, which stays out of the
// open-source export. They are built into PAID_OUT below, never into OUT or registry.json; app/r/pro serves them to
// a license key. Without that file (the public repo) there are none.
const PAID_FILE = join(root, "tools/paid-templates.mjs")
const PAID_BLOCKS = existsSync(PAID_FILE) ? (await import(pathToFileURL(PAID_FILE).href)).paidBlocks({ portfolioStyle, PORTFOLIO_LAYOUT }) : []
const PAID_OUT = "private/registry"
const ALL_BLOCKS = [...BLOCKS, ...PAID_BLOCKS]

const IGNORED_PACKAGES = new Set(["react", "react-dom", "next"])
// npm packages install at the major version the code was written against (an unpinned name gets the
// latest, and a new major, like @tanstack/react-table 9, breaks the types).
const SITE_DEPS = JSON.parse(read("package.json")).dependencies
const pinned = (name) => {
  if (!SITE_DEPS[name]) throw new Error(`${name} is imported by a registry file but is not in package.json`)
  return `${name}@${SITE_DEPS[name]}`
}
function importsOf(src) {
  const npm = new Set()
  const ui = new Set()
  for (const [, spec] of src.matchAll(/from "([^"]+)"/g)) {
    let m
    if ((m = /^@\/components\/ui\/([\w-]+)$/.exec(spec))) ui.add(m[1])
    else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const parts = spec.split("/")
      const name = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
      if (!IGNORED_PACKAGES.has(name)) npm.add(name)
    }
    if (spec.startsWith("@/") && !/^@\/(components\/ui|lib\/utils)\b/.test(spec) && !spec.startsWith("@/registry/dresscode/blocks/"))
      throw new Error(`block import ${spec} would not resolve in a user's project`)
  }
  return { npm, ui }
}

// Imports between template folders become imports between the installed folders.
const toProject = (src) => ALL_BLOCKS.reduce((s, x) => s.replaceAll(`@/${x.dir}/`, `@/${x.target}/`), src)

function blockItem(b) {
  const exts = b.exts ?? [".tsx"]
  const files = readdirSync(join(root, b.dir))
    .filter((f) => exts.some((e) => f.endsWith(e)) && !b.exclude.includes(f))
    .sort()
  const sources = [...files.map((f) => ({ path: `${b.dir}/${f}`, target: `${b.target}/${f}` })), ...(b.extra ?? [])]
  const npm = new Set()
  const ui = new Set()
  const out = sources.map(({ path, target }) => {
    let src = read(path)
    if (/^registry\/dresscode\/blocks\/portfolio-[\w-]+\/assets\.ts$/.test(path)) {
      src = src.replace(/"(\/portfolio\/styles\/[\w-]+\.webp)"/g, (_, asset) =>
        JSON.stringify("data:image/webp;base64," + readFileSync(join(root, "public", asset)).toString("base64")),
      )
    }
    // The real estate photos are too many to pack: the installed site loads the samples from the site.
    if (path === "registry/dresscode/blocks/realestate/assets.ts") src = src.replaceAll('"/realestate/', `"${BASE}/realestate/`)
    if (path === "registry/dresscode/blocks/ecommerce/assets.ts") src = src.replaceAll("`/ecommerce/", `\`${BASE}/ecommerce/`)
    // A portfolio style's large sample photographs (public/portfolio/<set>/) load from the site too.
    if (/^registry\/dresscode\/blocks\/portfolio-[\w-]+\/assets\.ts$/.test(path)) src = src.replace(/"\/portfolio\/(?!styles\/)([\w-]+)\//g, `"${BASE}/portfolio/$1/`)
    for (const [from, to] of b.rewrite ?? []) if (src.includes(from)) src = src.replace(from, to)
    const deps = importsOf(src)
    deps.npm.forEach((x) => npm.add(x))
    deps.ui.forEach((x) => ui.add(x))
    return { path, type: "registry:component", target, content: toProject(src) }
  })
  const pages = b.pages
    ? b.pages.map((p) => ({ path: `${b.dir}/pages/${p.name}`, type: "registry:page", target: p.target, content: p.content }))
    : [{ path: `${b.dir}/page.tsx`, type: "registry:page", target: b.page.target, content: b.page.content }]
  return {
    $schema: SCHEMA,
    name: b.name,
    type: "registry:block",
    title: b.title,
    description: b.description,
    author: AUTHOR,
    dependencies: [...npm].sort().map(pinned),
    registryDependencies: [...ui].sort(),
    files: [...out, ...pages],
    docs: [
      ...(b.docs ?? [`${b.title}: the blocks are in ${b.target}/ and the page is at /${b.page.target.replace(/^app\//, "").replace(/\/page\.tsx$/, "")}.`]),
      `It reads lib/dresscode-theme.ts, so install a DressCode theme first (any of the nine), e.g. npx shadcn@latest add ${url("mono")}`,
      "Built on shadcn/ui with Base UI (components.json style base-*): the menus and sheet use Base UI's render prop.",
    ].join("\n"),
  }
}

// ---------------------------------------------------------------------------------------------

const index = []
for (const t of THEMES) {
  const item = themeItem(t)
  outputs.push(item)
  index.push({ name: item.name, type: item.type, title: item.title, description: item.description })
}
for (const b of BLOCKS) {
  if (b.draft && !process.env.DC_DRAFTS) continue
  const item = blockItem(b)
  outputs.push(item)
  index.push({ name: item.name, type: item.type, title: item.title, description: item.description })
}
// ---------------------------------------------------------------------------------------------
// Components: every folder in registry/dresscode/components with a meta.ts (see types.ts there).
// A component's own files (ui/) become a registry:ui item named after the folder; each example
// becomes a registry:block "<name>-<variant>" that installs to components/dresscode/. The site gets
// an index of them (components/generated.ts) and their code as installed (generated-code.json).

const COMPONENTS_DIR = "registry/dresscode/components"
const componentDirs = readdirSync(join(root, COMPONENTS_DIR), { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(root, COMPONENTS_DIR, e.name, "meta.ts")))
  .map((e) => e.name)
  .sort()

const BASE_IMPORT = /^@\/registry\/dresscode\/components\/([\w-]+)\/ui\/([\w-]+)$/
/** What a component file imports: stock shadcn/ui, other DressCode components, npm packages. */
function componentImports(src, where) {
  const npm = new Set()
  const ui = new Set()
  const bases = new Set()
  for (const [, spec] of src.matchAll(/from "([^"]+)"/g)) {
    let m
    if ((m = /^@\/components\/ui\/([\w-]+)$/.exec(spec))) ui.add(m[1])
    else if ((m = BASE_IMPORT.exec(spec))) bases.add(m[1])
    else if (spec === "@/lib/utils") continue
    else if (spec.startsWith(".") || spec.startsWith("@/")) throw new Error(`${where}: import ${spec} would not resolve in a user's project`)
    else {
      const parts = spec.split("/")
      const name = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
      if (!IGNORED_PACKAGES.has(name)) npm.add(name)
    }
  }
  return { npm, ui, bases }
}
const installedComponent = (src) => src.replace(/@\/registry\/dresscode\/components\/[\w-]+\/ui\//g, "@/components/ui/")

const componentDocs = []
const componentCode = {}
for (const name of componentDirs) {
  const dirPath = `${COMPONENTS_DIR}/${name}`
  const meta = (await import(pathToFileURL(join(root, dirPath, "meta.ts")).href)).default
  if (meta.name !== name) throw new Error(`${dirPath}/meta.ts: name "${meta.name}" should be "${name}"`)
  const uiDir = join(root, dirPath, "ui")
  const uiFiles = existsSync(uiDir) ? readdirSync(uiDir).filter((f) => /\.tsx?$/.test(f)).sort() : []
  componentCode[name] = { base: [], variants: {} }

  if (uiFiles.length) {
    const npm = new Set()
    const ui = new Set()
    const deps = new Set()
    const files = uiFiles.map((f) => {
      const path = `${dirPath}/ui/${f}`
      const src = read(path)
      const im = componentImports(src, path)
      im.npm.forEach((x) => npm.add(x))
      im.ui.forEach((x) => ui.add(x))
      im.bases.forEach((x) => x !== name && deps.add(x))
      const content = installedComponent(src)
      componentCode[name].base.push({ file: `components/ui/${f}`, code: content })
      return { path, type: "registry:ui", content }
    })
    const item = {
      $schema: SCHEMA,
      name,
      type: "registry:ui",
      title: meta.title,
      description: meta.description,
      author: AUTHOR,
      dependencies: [...npm].sort().map(pinned),
      registryDependencies: [...[...ui].sort(), ...[...deps].sort().map(url)],
      files,
      docs: `${meta.title} is in components/ui. Examples: https://dresscodeui.com/components/${name}`,
    }
    outputs.push(item)
    index.push({ name: item.name, type: item.type, title: item.title, description: item.description })
  }

  const load = []
  for (const v of meta.variants) {
    const path = `${dirPath}/examples/${v.id}.tsx`
    if (!existsSync(join(root, path))) throw new Error(`${path} is missing (variant "${v.id}" in meta.ts)`)
    const src = read(path)
    if (!/export default function/.test(src)) throw new Error(`${path}: needs an \`export default function\``)
    const im = componentImports(src, path)
    const target = `components/dresscode/${name}-${v.id}.tsx`
    const content = installedComponent(src)
    componentCode[name].variants[v.id] = { file: target, code: content }
    const item = {
      $schema: SCHEMA,
      name: `${name}-${v.id}`,
      type: "registry:block",
      title: `${meta.title}: ${v.title}`,
      description: v.description,
      author: AUTHOR,
      dependencies: [...im.npm].sort().map(pinned),
      registryDependencies: [...[...im.ui].sort(), ...[...im.bases].sort().map(url)],
      files: [{ path, type: "registry:component", target, content }],
      docs: `The example is in ${target}. Install a DressCode theme for its colors, fonts and corners: https://dresscodeui.com/themes`,
    }
    outputs.push(item)
    index.push({ name: item.name, type: item.type, title: item.title, description: item.description })
    load.push(`    ${JSON.stringify(v.id)}: () => import("./${name}/examples/${v.id}"),`)
  }
  componentDocs.push({ name, load })
}

// The site's index of components: metadata and a lazy import per example (for the demo routes).
write(
  `${COMPONENTS_DIR}/generated.ts`,
  [
    "// Generated by tools/build-dresscode-registry.mjs from the component folders. Do not edit.",
    'import type { ComponentType } from "react"',
    "",
    'import type { ComponentMeta } from "./types"',
    ...componentDocs.map((c, i) => `import meta${i} from "./${c.name}/meta"`),
    "",
    "export type ComponentDoc = { meta: ComponentMeta; load: Record<string, () => Promise<{ default: ComponentType }>> }",
    "",
    "export const COMPONENT_DOCS: ComponentDoc[] = [",
    ...componentDocs.map((c, i) => [`  {`, `    meta: meta${i},`, `    load: {`, ...c.load.map((l) => `  ${l}`), `    },`, `  },`].join("\n")),
    "]",
    "",
  ].join("\n"),
)
write(`${COMPONENTS_DIR}/generated-code.json`, json(componentCode))

// ---------------------------------------------------------------------------------------------
// Blocks: every folder in registry/dresscode/sections with a meta.ts (see types.ts there). Each block is
// one file and becomes a registry:block "<category>-<id>" that installs to components/dresscode/. The
// site gets an index of them (sections/generated.ts) and their code as installed (generated-code.json).

const SECTIONS_DIR = "registry/dresscode/sections"
const sectionDirs = existsSync(join(root, SECTIONS_DIR))
  ? readdirSync(join(root, SECTIONS_DIR), { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(root, SECTIONS_DIR, e.name, "meta.ts")))
      .map((e) => e.name)
      .sort()
  : []
const blockDocs = []
const blockCode = {}
let blockCount = 0
for (const name of sectionDirs) {
  const dirPath = `${SECTIONS_DIR}/${name}`
  const meta = (await import(pathToFileURL(join(root, dirPath, "meta.ts")).href)).default
  if (meta.name !== name) throw new Error(`${dirPath}/meta.ts: name "${meta.name}" should be "${name}"`)
  blockCode[name] = {}
  const load = []
  for (const b of meta.blocks) {
    const path = `${dirPath}/${b.id}.tsx`
    if (!existsSync(join(root, path))) throw new Error(`${path} is missing (block "${b.id}" in meta.ts)`)
    const src = read(path)
    if (!/export default function/.test(src)) throw new Error(`${path}: needs an \`export default function\``)
    if (/\d(svh|dvh|lvh|vh)\b|-(svh|dvh|lvh)\b|\bh-screen\b/.test(src.replace(/\/\/.*$/gm, ""))) throw new Error(`${path}: no viewport heights (the preview frame grows to the block's height)`)
    const im = componentImports(src, path)
    const itemName = `${name}-${b.id}`
    if (outputs.some((o) => o.name === itemName)) throw new Error(`${path}: the registry already has an item named ${itemName}`)
    const target = `components/dresscode/${itemName}.tsx`
    const content = installedComponent(src)
    blockCode[name][b.id] = { file: target, code: content }
    const item = {
      $schema: SCHEMA,
      name: itemName,
      type: "registry:block",
      title: `${meta.short}: ${b.title}`,
      description: b.description,
      author: AUTHOR,
      categories: [name],
      dependencies: [...im.npm].sort().map(pinned),
      registryDependencies: [...[...im.ui].sort(), ...[...im.bases].sort().map(url)],
      files: [{ path, type: "registry:component", target, content }],
      docs: [
        `The block is in ${target}; render it in any page.`,
        `It wears your DressCode theme (its colors, fonts and corners, and the dc-* classes the theme adds). Pick one at https://dresscodeui.com/themes, e.g. npx shadcn@latest add ${url("mono")}`,
      ].join("\n"),
    }
    outputs.push(item)
    index.push({ name: item.name, type: item.type, title: item.title, description: item.description, categories: item.categories })
    load.push(`    ${JSON.stringify(b.id)}: () => import("./${name}/${b.id}"),`)
    blockCount++
  }
  blockDocs.push({ name, load })
}
write(
  `${SECTIONS_DIR}/generated.ts`,
  [
    "// Generated by tools/build-dresscode-registry.mjs from the block folders. Do not edit.",
    'import type { ComponentType } from "react"',
    "",
    'import type { BlockCategoryMeta } from "./types"',
    ...blockDocs.map((c, i) => `import meta${i} from "./${c.name}/meta"`),
    "",
    "export type BlockDoc = { meta: BlockCategoryMeta; load: Record<string, () => Promise<{ default: ComponentType }>> }",
    "",
    "const DOCS: BlockDoc[] = [",
    ...blockDocs.map((c, i) => [`  {`, `    meta: meta${i},`, `    load: {`, ...c.load.map((l) => `  ${l}`), `    },`, `  },`].join("\n")),
    "]",
    "",
    "/** Marketing first, then application; each group in its own order. */",
    'export const BLOCK_DOCS: BlockDoc[] = DOCS.sort((a, b) => (a.meta.group === b.meta.group ? a.meta.order - b.meta.order : a.meta.group === "marketing" ? -1 : 1))',
    "",
  ].join("\n"),
)
write(`${SECTIONS_DIR}/generated-code.json`, json(blockCode))

for (const item of fontItems.values()) {
  outputs.push(item)
  index.push({ name: item.name, type: item.type, title: item.title, font: item.font })
}

// shadcn's own schema, so a CLI upgrade that tightens it shows up here first.
for (const item of outputs) {
  const r = registryItemSchema.safeParse(item)
  if (!r.success) throw new Error(`${item.name}: ${r.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`)
}
const registry = { $schema: "https://ui.shadcn.com/schema/registry.json", name: "dresscode", homepage: "https://dresscodeui.com", items: index }
const reg = registrySchema.safeParse(registry)
if (!reg.success) throw new Error(`registry.json: ${reg.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`)

for (const item of outputs) write(`${OUT}/${item.name}.json`, json(item))
write(`${OUT}/registry.json`, json(registry))

const dir = join(root, OUT)
for (const f of readdirSync(dir)) if (!written.has(join(dir, f))) rmSync(join(dir, f))

// The paid items: the same shape, in a folder the site never serves as files. index.ts lets app/r/pro load one
// on demand (bundled into the Worker, not into its static assets).
const paidItems = PAID_BLOCKS.map(blockItem)
for (const item of paidItems) {
  const r = registryItemSchema.safeParse(item)
  if (!r.success) throw new Error(`${item.name}: ${r.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`)
  if (index.some((i) => i.name === item.name)) throw new Error(`${item.name} is paid and must not be in the public registry`)
  write(`${PAID_OUT}/${item.name}.json`, json(item))
}
if (paidItems.length) {
  write(
    `${PAID_OUT}/index.ts`,
    [
      "// Generated by tools/build-dresscode-registry.mjs from tools/paid-templates.mjs. Do not edit, do not serve as files.",
      "// The paid registry items, each loaded only when app/r/pro or the zip download needs it.",
      "export const PAID_ITEMS: Record<string, () => Promise<unknown>> = {",
      ...paidItems.map((i) => `  ${JSON.stringify(i.name)}: () => import("./${i.name}.json").then((m) => m.default),`),
      "}",
      "",
    ].join("\n"),
  )
  const paidDir = join(root, PAID_OUT)
  for (const f of readdirSync(paidDir)) if (!written.has(join(paidDir, f))) rmSync(join(paidDir, f))
}

const warns = rows.filter((r) => r.ratio < r.min && r.template).length
console.log(
  `[dresscode] ${THEMES.length} themes (light + dark, ${rows.length} contrast pairs ok${warns ? `, ${warns} template warnings` : ""}), ${BLOCKS.filter((b) => !b.draft || process.env.DC_DRAFTS).length} templates, ${componentDirs.length} components (${outputs.filter((o) => o.type === "registry:block" && !o.categories && !BLOCKS.some((b) => b.name === o.name)).length} examples), ${blockCount} blocks in ${sectionDirs.length} categories, ${fontItems.size} fonts -> ${OUT}; ${paidItems.length} paid templates -> ${PAID_OUT} (base ${BASE})`,
)
