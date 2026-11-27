// Bento: a portfolio whose home page is one screen of tiles, like the boxes of a bento: you and your
// photo, where you are and your local time, a number you are proud of, the latest project, what you
// write, what you are doing now and a newsletter. The work below is a wall of covers in two sizes.
// The content is the Portfolio template's (components/portfolio/data.ts); the few lines only this home
// shows are at the top of this file.
import { ArrowRight, ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AboutPage, ResumePage } from "../portfolio/about"
import { ProjectCover } from "../portfolio/covers"
import { NOW, PERSON, POSTS, PROJECTS, type Variant } from "../portfolio/data"
import { NotFoundPage, NowPage, UsesPage } from "../portfolio/extras"
import { ProjectPage } from "../portfolio/project"
import { ContactPage, ServicesPage } from "../portfolio/services"
import { PortfolioRoot, registerFrame } from "../portfolio/shell"
import { formatDate, pageMeta, resolve, to, type PageId, type Route } from "../portfolio/site"
import { LocalTime, ModeToggle, NewsletterForm, StatusDot } from "../portfolio/ui"
import { PostPage, WritingPage } from "../portfolio/writing"

import { BENTO_PORTRAIT } from "./assets"
import { BentoMap } from "./bento-map"
import { BentoWork } from "./bento-work"

export const BENTO: Variant = "bento" as Variant

/** The words of your intro that get the highlighter (leave empty for none). */
const HIGHLIGHT = "calm software"
/** The big number tile. */
const STAT = { value: "6", label: "Years building tools for field work" }

const WRAP = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8"

const CSS = `
.pb-tile { transition: translate 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.3s ease; }
a.pb-tile:hover, a.pb-tile:focus-visible { translate: -2px -3px; box-shadow: var(--dc-shadow), 0 18px 36px -20px rgb(0 0 0 / 0.35); }
.dc-brutal a.pb-tile:hover, .dc-brutal a.pb-tile:focus-visible { box-shadow: 7px 7px 0 var(--dc-outline); }
@media (prefers-reduced-motion: no-preference) {
  .pb-in { animation: pb-in 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; animation-delay: calc(var(--i, 0) * 70ms); }
  .pb-cell { animation: pb-cell 0.5s ease both; animation-delay: calc(400ms + var(--c, 0) * 18ms); }
  .pb-ping { animation: pb-ping 2.4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
}
@keyframes pb-in { from { opacity: 0; transform: translateY(14px) scale(0.98); } }
@keyframes pb-cell { from { opacity: 0; } }
@keyframes pb-ping { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2.2); opacity: 0; } }
`

const NAV: { label: string; path: string; page: PageId }[] = [
  { label: "Work", path: "work", page: "work" },
  { label: "Writing", path: "writing", page: "writing" },
  { label: "About", path: "about", page: "about" },
]

function Tile({ i = 0, className, style, children, ...rest }: { i?: number; className?: string; style?: CSSProperties; children: ReactNode; "aria-labelledby"?: string }) {
  return (
    <section {...rest} className={cn("pb-in dc-card relative overflow-hidden", className)} style={{ ...style, ["--i" as string]: i }}>
      {children}
    </section>
  )
}

export function BentoHeader({ base, current }: { base: string; current: PageId }) {
  return (
    <header className={cn(WRAP, "print:hidden")}>
      <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <div className="flex h-16 items-center gap-4 sm:h-20">
        <Link href={to(base)} className="dc-h text-[22px] leading-none sm:text-[28px]" aria-current={current === "home" ? "page" : undefined}>
          {PERSON.name}
        </Link>
        <nav aria-label="Main" className="ml-auto flex items-center gap-1 text-[15px] font-semibold sm:gap-3 sm:text-[16px]">
          {NAV.map((n) => (
            <Link
              key={n.path}
              href={to(base, n.path)}
              aria-current={current === n.page ? "page" : undefined}
              className="rounded-full px-2.5 py-1.5 hover:bg-muted aria-[current=page]:bg-foreground aria-[current=page]:text-background"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <ModeToggle />
      </div>
    </header>
  )
}

export function BentoFooter({ base }: { base: string }) {
  return (
    <footer className={cn(WRAP, "mt-auto pt-16 pb-6 print:hidden")}>
      <div className="dc-card flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-5 sm:px-7">
        <div>
          <p className="dc-h text-[22px]">Say hello</p>
          <a href={`mailto:${PERSON.email}`} className="mt-1 inline-flex items-center gap-1 text-[15px] text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
            {PERSON.email} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <nav aria-label="More" className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium">
          {[
            ["Work", "work"],
            ["Writing", "writing"],
            ["Résumé", "resume"],
            ["Services", "services"],
            ["Uses", "uses"],
            ["Now", "now"],
          ].map(([label, path]) => (
            <Link key={path} href={to(base, path)} className="underline-offset-4 hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-5 flex flex-wrap justify-between gap-2 px-1 text-[13px] text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {PERSON.name}
        </span>
        <span>
          {PERSON.city} · <LocalTime />
        </span>
      </p>
    </footer>
  )
}

/** Header, page, footer: what every Bento page sits in. */
export function BentoFrame({ base, current, children }: { base: string; current: PageId; cta?: boolean; children: ReactNode }) {
  return (
    <>
      <style>{CSS}</style>
      <BentoHeader base={base} current={current} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <BentoFooter base={base} />
    </>
  )
}

function Intro() {
  const sentence = PERSON.intro.split(":")[0].replace(/\.?$/, ".")
  const at = HIGHLIGHT ? sentence.indexOf(HIGHLIGHT) : -1
  if (at < 0) return <>{sentence}</>
  return (
    <>
      {sentence.slice(0, at)}
      <span className="dc-mark-highlighter">{HIGHLIGHT}</span>
      {sentence.slice(at + HIGHLIGHT.length)}
    </>
  )
}

/** A year of work as a 52 × 7 grid, darker where more shipped. The levels are made up for the sample: feed it your own. */
function ShippingGrid() {
  const levels = Array.from({ length: 52 * 7 }, (_, k) => {
    const x = Math.sin(k * 12.9898 + 78.233) * 43758.5453
    const r = x - Math.floor(x)
    return r < 0.32 ? 0 : r < 0.6 ? 1 : r < 0.82 ? 2 : r < 0.94 ? 3 : 4
  })
  const mix = [8, 30, 52, 76, 100]
  return (
    <div className="grid grid-flow-col grid-cols-[repeat(52,minmax(0,1fr))] grid-rows-7 gap-[3px]" role="img" aria-label="A year of shipping, one square per day">
      {levels.map((l, k) => (
        <span
          key={k}
          className="pb-cell aspect-square rounded-[2px]"
          style={{
            background: `color-mix(in oklab, var(--dc-accent) ${mix[l]}%, var(--dc-surface))`,
            ["--c" as string]: Math.floor(k / 7),
          }}
        />
      ))}
    </div>
  )
}

export function BentoHome({ base }: { base: string }) {
  const latest = PROJECTS[0]
  return (
    <BentoFrame base={base} current="home">
      <h1 className="sr-only">
        {PERSON.name}, {PERSON.role}
      </h1>
      <div className={cn(WRAP, "grid grid-cols-2 gap-4 lg:grid-cols-4 lg:[grid-template-areas:'hero_hero_map_writing''hero_hero_stat_writing''latest_latest_now_letter''year_year_now_letter']")}>
        <Tile i={0} className="col-span-2 grid gap-5 p-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:p-3.5 lg:[grid-area:hero]" aria-labelledby="pb-hi">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BENTO_PORTRAIT.src}
            alt={BENTO_PORTRAIT.alt}
            width={BENTO_PORTRAIT.width}
            height={BENTO_PORTRAIT.height}
            className="aspect-[4/3] w-full rounded-[calc(var(--dc-radius-card)-4px)] object-cover sm:aspect-auto sm:h-full"
          />
          <div className="flex flex-col justify-center px-2 pt-1 pb-4 sm:px-1 sm:py-6 sm:pr-4">
            <h2 id="pb-hi" className="dc-h text-[clamp(2.4rem,4.2vw,4rem)] leading-[0.95]">
              Hi, I&rsquo;m {PERSON.first}.
            </h2>
            <p className="mt-4 text-[clamp(1.15rem,1.6vw,1.5rem)] leading-snug text-muted-foreground">
              <Intro />
            </p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-[length:var(--dc-bw)] border-[color:var(--dc-card-border)] px-3.5 py-1.5 text-[14px] font-medium">
              <StatusDot /> {PERSON.available}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<a href={`mailto:${PERSON.email}`} />}>
                Email me
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<Link href={to(base, "resume")} />}>
                Résumé
              </Button>
            </div>
          </div>
        </Tile>

        <Tile i={1} className="min-h-[170px] sm:min-h-[220px] lg:[grid-area:map]" aria-labelledby="pb-where">
          <BentoMap className="absolute inset-0 size-full" />
          <p id="pb-where" className="dc-card absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[14px] font-semibold shadow-none">
            {PERSON.city} · <LocalTime />
          </p>
        </Tile>

        <Tile i={2} className="dc-band flex flex-col items-start justify-center gap-2 p-5 sm:flex-row sm:items-center sm:gap-5 lg:[grid-area:stat]" aria-labelledby="pb-stat">
          <p className="dc-h text-[clamp(4.5rem,7vw,6.5rem)] leading-[0.8] tabular-nums" aria-hidden="true">
            {STAT.value}
          </p>
          <h2 id="pb-stat" className="dc-h text-[clamp(1.2rem,1.6vw,1.5rem)] leading-tight">
            <span className="sr-only">{STAT.value} </span>
            {STAT.label}
          </h2>
        </Tile>

        <Tile i={3} className="col-span-2 flex flex-col p-5 sm:p-6 lg:[grid-area:writing]" aria-labelledby="pb-writing">
          <h2 id="pb-writing" className="dc-h text-[clamp(2rem,2.8vw,2.6rem)] leading-none">
            Writing
          </h2>
          <ol className="mt-4 flex-1">
            {POSTS.slice(0, 3).map((p) => (
              <li key={p.slug} className="border-b border-border last:border-0">
                <Link href={to(base, "writing", p.slug)} className="group block py-3">
                  <span className="block text-[16px] leading-snug font-semibold underline-offset-4 group-hover:underline">{p.title}</span>
                  <time dateTime={p.date} className="mt-1 block text-[14px] text-muted-foreground">
                    {formatDate(p.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ol>
          <Link href={to(base, "writing")} className="mt-3 inline-flex items-center gap-1.5 text-[16px] font-semibold text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
            All posts <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Tile>

        <Link
          href={to(base, "work", latest.slug)}
          className="pb-in pb-tile dc-card group col-span-2 grid overflow-hidden p-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:gap-5 lg:[grid-area:latest]"
          style={{ ["--i" as string]: 4 }}
        >
          <span className="block aspect-[16/10] overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)] sm:aspect-auto sm:min-h-[200px]">
            <span className="block size-full transition-transform duration-700 group-hover:scale-[1.04]">
              <ProjectCover project={latest} />
            </span>
          </span>
          <span className="flex flex-col justify-center px-2 py-4 sm:px-0 sm:pr-3">
            <span className="text-[14px] font-semibold text-muted-foreground">Latest project</span>
            <span className="dc-h mt-1 text-[clamp(1.8rem,2.6vw,2.5rem)] leading-none">{latest.title}</span>
            <span className="mt-3 text-[16px] leading-snug text-muted-foreground">{latest.summary.split(". ")[0].replace(/\.?$/, ".")}</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[16px] font-semibold text-[color:var(--dc-accent)]">
              Case study <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </Link>

        <Tile i={5} className="col-span-2 p-5 sm:p-6 lg:[grid-area:year]" aria-labelledby="pb-year">
          <h2 id="pb-year" className="dc-h mb-4 text-[clamp(1.5rem,2vw,2rem)] leading-none">
            A year of shipping
          </h2>
          <ShippingGrid />
        </Tile>

        <Tile i={6} className="col-span-2 flex flex-col p-5 sm:p-6 lg:[grid-area:now]" aria-labelledby="pb-now">
          <h2 id="pb-now" className="dc-h text-[clamp(2rem,2.8vw,2.6rem)] leading-none">
            Now
          </h2>
          <ul className="mt-4 flex-1">
            {NOW.items.slice(0, 3).map((n) => (
              <li key={n.title} className="border-b border-border py-3 last:border-0">
                <span className="block text-[13px] font-semibold text-muted-foreground">{n.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-[16px] leading-snug">{n.body.split(/[.:]/)[0]}</span>
              </li>
            ))}
          </ul>
          <Link href={to(base, "now")} className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
            More on /now <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Tile>

        <Tile i={7} className="col-span-2 flex flex-col p-5 sm:p-6 lg:[grid-area:letter]" aria-labelledby="pb-letter">
          <h2 id="pb-letter" className="dc-h text-[clamp(2rem,2.8vw,2.6rem)] leading-[0.95]">
            A letter every month
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">What I made, read and learned. No more than once a month.</p>
          <NewsletterForm placeholder="Email address" className="mt-auto flex-col pt-6 [&_button]:h-11 [&_button]:w-full [&_input]:h-11 [&_input]:flex-none" />
        </Tile>
      </div>

      <section aria-labelledby="pb-work" className={cn(WRAP, "mt-16 sm:mt-24")}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 id="pb-work" className="dc-h text-[clamp(2.2rem,4vw,3.6rem)] leading-none">
            Selected work
          </h2>
          <Link href={to(base, "work")} className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
            All work <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <BentoWork base={base} />
      </section>
    </BentoFrame>
  )
}

/** /work: the same wall with the filter, under a title. */
export function BentoWorkPage({ base }: { base: string }) {
  return (
    <BentoFrame base={base} current="work">
      <div className={cn(WRAP, "pt-6 sm:pt-10")}>
        <h1 className="dc-h text-[clamp(2.6rem,6vw,5rem)] leading-none">Selected work</h1>
        <p className="mt-4 max-w-[34em] text-[18px] text-muted-foreground">
          {PROJECTS.length} projects, {PROJECTS.at(-1)?.year} to {PROJECTS[0]?.year}: products, maps, type and a book.
        </p>
        <div className="mt-8">
          <BentoWork base={base} />
        </div>
      </div>
    </BentoFrame>
  )
}

// Every inner page of the Portfolio template wears this style's frame.
registerFrame(BENTO, BentoFrame)

function page(route: Route, base: string) {
  const p = { base, variant: BENTO }
  switch (route.page) {
    case "home":
      return <BentoHome base={base} />
    case "work":
      return <BentoWorkPage base={base} />
    case "project":
      return <ProjectPage {...p} slug={route.slug} />
    case "about":
      return <AboutPage {...p} />
    case "resume":
      return <ResumePage {...p} />
    case "services":
      return <ServicesPage {...p} />
    case "writing":
      return <WritingPage {...p} />
    case "post":
      return <PostPage {...p} slug={route.slug} />
    case "contact":
      return <ContactPage {...p} />
    case "uses":
      return <UsesPage {...p} />
    case "now":
      return <NowPage {...p} />
    case "not-found":
      return <NotFoundPage {...p} />
  }
}

type Props = {
  path?: string[]
  base: string
  theme?: string
  brutal?: boolean
}

export function BentoSite({ path, base, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {page(route, base)}
    </PortfolioRoot>
  )
}

export function bentoMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
