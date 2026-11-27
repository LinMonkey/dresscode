// Poster: a portfolio in very big type. Your name runs across the top of the home page, the work is a
// list of huge titles (the cover follows the cursor), one colored band says how you work, and the
// footer is one big "Let's talk". Project pages open with the title at poster size.
// The content (projects, posts, prices) is the Portfolio template's, in components/portfolio/data.ts.
import { ArrowDown, ArrowUpRight, Menu } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AboutPage, ResumePage } from "../portfolio/about"
import { PlateImage, ProjectCover } from "../portfolio/covers"
import { PERSON, PRINCIPLES, PROJECTS, SERVICES, type Project, type Variant } from "../portfolio/data"
import { NotFoundPage, NowPage, UsesPage } from "../portfolio/extras"
import { Gallery } from "../portfolio/gallery"
import { WorkPage } from "../portfolio/project"
import { ContactPage, ServicesPage } from "../portfolio/services"
import { PortfolioRoot, registerFrame } from "../portfolio/shell"
import { nextProject, pageMeta, resolve, to, type PageId, type Route } from "../portfolio/site"
import { LocalTime, ModeToggle, StatusDot } from "../portfolio/ui"
import { PostPage, WritingPage } from "../portfolio/writing"

import { POSTER_PORTRAIT } from "./assets"
import { Magnetic, PosterWorkList } from "./poster-motion"

export const POSTER: Variant = "poster" as Variant

const EDGE = "px-5 sm:px-8 lg:px-10"

const CSS = `
.pp-marquee { display: flex; width: max-content; }
@media (prefers-reduced-motion: no-preference) {
  .pp-marquee { animation: pp-marquee 42s linear infinite; }
  .pp-rise { animation: pp-rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
}
@keyframes pp-marquee { to { transform: translate3d(-50%, 0, 0); } }
@keyframes pp-rise { from { opacity: 0; transform: translateY(24px); } }
`

const NAV: { label: string; path: string; page: PageId }[] = [
  { label: "Work", path: "work", page: "work" },
  { label: "About", path: "about", page: "about" },
  { label: "Writing", path: "writing", page: "writing" },
]

export function PosterHeader({ base, current }: { base: string; current: PageId }) {
  return (
    <header className={cn("sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur print:hidden", EDGE)}>
      <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <div className="flex h-14 items-center gap-6">
        <Link href={to(base)} className="dc-h shrink-0 text-[19px] leading-none" aria-current={current === "home" ? "page" : undefined}>
          {PERSON.name}
        </Link>
        <p className="hidden min-w-0 flex-1 truncate border-l border-border pl-6 text-[14px] text-muted-foreground lg:block">
          {PERSON.role} — {PERSON.city}, <LocalTime />
        </p>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-6 text-[15px] md:flex">
          {NAV.map((n) => (
            <Link key={n.path} href={to(base, n.path)} aria-current={current === n.page ? "page" : undefined} className="underline-offset-[6px] hover:underline aria-[current=page]:underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ModeToggle />
          <Button size="sm" className="h-9 px-4" nativeButton={false} render={<Link href={to(base, "contact")} />}>
            Let&apos;s talk
          </Button>
          <details className="group relative md:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-md border border-border [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <Menu className="size-4" aria-hidden="true" />
            </summary>
            <nav aria-label="Main" className="dc-card absolute top-11 right-0 z-40 grid w-48 p-2 text-[15px]">
              {[
                ...NAV,
                { label: "Résumé", path: "resume", page: "resume" as PageId },
                {
                  label: "Contact",
                  path: "contact",
                  page: "contact" as PageId,
                },
              ].map((n) => (
                <Link key={n.path} href={to(base, n.path)} className="rounded-md px-3 py-2 hover:bg-muted">
                  {n.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

export function PosterFooter({ base }: { base: string }) {
  return (
    <footer className={cn("mt-auto print:hidden", EDGE)}>
      <Magnetic className="mt-10 block w-fit max-w-full" strength={0.12}>
        <a href={`mailto:${PERSON.email}`} className="group dc-h flex items-center gap-[0.08em] text-[clamp(3.6rem,13.5vw,15rem)] leading-[0.84] uppercase">
          Let&rsquo;s talk
          <ArrowUpRight className="size-[0.72em] shrink-0 stroke-[2.6] transition-transform duration-500 group-hover:translate-x-[0.06em] group-hover:-translate-y-[0.06em]" aria-hidden="true" />
        </a>
      </Magnetic>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-border py-4">
        <a href={`mailto:${PERSON.email}`} className="text-[18px] underline-offset-4 hover:underline sm:text-[22px]">
          {PERSON.email}
        </a>
        <nav aria-label="More" className="flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
          {[
            ["Writing", "writing"],
            ["Résumé", "resume"],
            ["Now", "now"],
            ["Uses", "uses"],
          ].map(([label, path]) => (
            <Link key={path} href={to(base, path)} className="underline-offset-4 hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-wrap justify-between gap-3 py-5 text-[13px] text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {PERSON.name}
        </span>
        <span>
          {PERSON.city} <LocalTime />
        </span>
      </div>
    </footer>
  )
}

/** Header, page, footer: what every Poster page sits in. */
export function PosterFrame({ base, current, children }: { base: string; current: PageId; cta?: boolean; children: ReactNode }) {
  return (
    <>
      <style>{CSS}</style>
      <PosterHeader base={base} current={current} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <PosterFooter base={base} />
    </>
  )
}

export function PosterHome({ base }: { base: string }) {
  const name = `${PERSON.name} — `
  return (
    <PosterFrame base={base} current="home">
      <section aria-labelledby="pp-name" className="relative">
        <h1 id="pp-name" className="sr-only">
          {PERSON.name}, {PERSON.role}
        </h1>
        <div aria-hidden="true" className="overflow-hidden pt-4 sm:pt-6">
          <div className="pp-marquee dc-h text-[clamp(5rem,17vw,24rem)] leading-[0.8] whitespace-nowrap uppercase">
            <span className="pl-[0.04em]">{name}</span>
            <span>{name}</span>
          </div>
        </div>
        <div className={cn("relative z-10 -mt-[3.2vw] grid items-start gap-10 pb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:pb-24", EDGE)}>
          <figure className="pp-rise overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTER_PORTRAIT.src} alt={POSTER_PORTRAIT.alt} width={POSTER_PORTRAIT.width} height={POSTER_PORTRAIT.height} className="aspect-[5/4] w-full object-cover" />
          </figure>
          <div className="pp-rise md:pt-[7vw]" style={{ animationDelay: "120ms" }}>
            <p className="max-w-[18em] text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.16] font-medium tracking-[-0.01em] text-balance">{PERSON.intro}</p>
            <p className="mt-6 flex items-center gap-3 text-[17px]">
              <StatusDot /> {PERSON.available}
            </p>
            <a href="#work" className="mt-8 inline-grid size-11 place-items-center rounded-full border border-border transition-colors hover:bg-muted" aria-label="Selected work">
              <ArrowDown className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="work" className={cn("pb-20 sm:pb-28", EDGE)}>
        <h2 id="work" className="scroll-mt-20 border-t border-border pt-6 pb-4 text-[20px] font-medium">
          Selected work
        </h2>
        <PosterWorkList base={base} projects={PROJECTS.slice(0, 4)} />
        <Button size="lg" className="mt-6 h-11 px-5" nativeButton={false} render={<Link href={to(base, "work")} />}>
          All work ({PROJECTS.length})
        </Button>
      </section>

      <section aria-labelledby="how" className="dc-band">
        <div className={cn("grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.25fr_repeat(3,1fr)] lg:gap-0", EDGE)}>
          <h2 id="how" className="dc-h max-w-[8em] text-[clamp(2.8rem,5.4vw,5.4rem)] leading-[0.9] lg:pr-10">
            {PRINCIPLES[0].title}.
          </h2>
          {SERVICES.slice(0, 3).map((s) => (
            <div key={s.title} className="border-border lg:border-l lg:px-8">
              <h3 className="dc-h text-[26px] leading-tight">{s.title}</h3>
              <p className="mt-3 max-w-[22em] text-[16px] leading-relaxed text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>
    </PosterFrame>
  )
}

export function PosterProject({ base, slug }: { base: string; slug: string }) {
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) return null
  const next = nextProject(p.slug)
  const facts: [string, string][] = [
    ["Client", p.client],
    ["Year", p.year],
    ["Role", p.role],
  ]
  facts.push(p.facts.find(([k]) => !facts.some(([f]) => f === k)) ?? ["Tags", p.tags.join(", ")])
  return (
    <PosterFrame base={base} current="project">
      <article>
        <header className={cn("pt-8 sm:pt-12", EDGE)}>
          <p className="text-[15px] text-muted-foreground">
            <Link href={to(base, "work")} className="underline-offset-4 hover:underline">
              Work
            </Link>{" "}
            / {p.tags.join(", ")}
          </p>
          <h1 className="pp-rise dc-h mt-4 text-[clamp(3.6rem,15vw,16rem)] leading-[0.82] break-words uppercase">{p.title}</h1>
          <dl className="mt-8 grid grid-cols-2 border-y border-border md:grid-cols-4">
            {facts.map(([k, v], i) => (
              <div
                key={k}
                className={cn("py-4 pr-4", i % 2 === 1 && "border-l border-border pl-4", i >= 2 && "max-md:border-t max-md:border-border", i === 2 && "md:border-l md:border-border md:pl-4")}
              >
                <dt className="text-[13px] text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-[16px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className={cn("mt-8 sm:mt-10", EDGE)}>
          <div className="aspect-[4/3] overflow-hidden md:aspect-[21/9]">
            <ProjectCover project={p} />
          </div>
        </div>

        <div className={cn("mt-16 grid gap-6 sm:mt-24 md:grid-cols-[1fr_2fr] md:gap-16", EDGE)}>
          <h2 className="dc-h text-[28px] leading-tight uppercase">The brief</h2>
          <p className="text-[clamp(1.4rem,2.3vw,2.25rem)] leading-[1.25] text-balance">{p.brief}</p>
        </div>

        {p.metrics ? (
          <dl className={cn("mt-16 grid gap-y-8 sm:mt-24 sm:grid-cols-3", EDGE)}>
            {p.metrics.map(([n, label], i) => (
              <div key={label} className={cn("border-t border-border pt-5 sm:pr-6", i > 0 && "sm:border-l sm:pl-6")}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="dc-h block text-[clamp(4rem,9vw,9rem)] leading-[0.85] tabular-nums">{n}</span>
                  <span className="mt-3 block text-[16px] text-muted-foreground">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {p.layout === "gallery" ? (
          <div className={cn("mt-16 sm:mt-24", EDGE)}>
            <Gallery project={p} />
          </div>
        ) : (
          <PosterStory p={p} />
        )}

        {p.quote ? (
          <figure className={cn("mt-20 sm:mt-28", EDGE)}>
            <blockquote className="dc-h max-w-[18em] text-[clamp(2rem,4.2vw,4rem)] leading-[1.02]">“{p.quote.text}”</blockquote>
            <figcaption className="mt-5 text-[15px] text-muted-foreground">
              {p.quote.name}, {p.quote.role}
            </figcaption>
          </figure>
        ) : null}

        <dl className={cn("mt-20 grid gap-x-10 gap-y-4 border-t border-border pt-6 text-[15px] sm:grid-cols-3", EDGE)}>
          {p.credits.map(([k, v]) => (
            <div key={k}>
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </article>

      <nav aria-label="Next project" className={cn("mt-20 border-t border-border pt-6 sm:mt-28", EDGE)}>
        <p className="text-[15px] text-muted-foreground">Next project</p>
        <Link href={to(base, "work", next.slug)} className="group dc-h mt-2 flex items-center gap-[0.1em] text-[clamp(3.2rem,11vw,11rem)] leading-[0.86] uppercase">
          <span className="transition-colors duration-300 group-hover:text-[color:var(--dc-accent)]">{next.title}</span>
          <ArrowUpRight className="size-[0.7em] shrink-0 stroke-[2.4] transition-transform duration-500 group-hover:translate-x-[0.06em] group-hover:-translate-y-[0.06em]" aria-hidden="true" />
        </Link>
      </nav>
    </PosterFrame>
  )
}

/** A case study's parts, each beside its figure, alternating sides. */
function PosterStory({ p }: { p: Project }) {
  return (
    <div className={cn("mt-16 grid gap-16 sm:mt-24 sm:gap-24", EDGE)}>
      {p.sections.map((s, i) => {
        const plate = p.plates[i]
        return (
          <section key={s.title} className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
            <div className={cn(i % 2 === 1 && "md:order-2")}>
              <h2 className="dc-h text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.95] uppercase">{s.title}</h2>
              {s.body.map((b) => (
                <p key={b} className="mt-4 max-w-[34em] text-[17px] leading-relaxed text-muted-foreground">
                  {b}
                </p>
              ))}
            </div>
            {plate ? (
              <figure>
                <div className="overflow-hidden" style={{ aspectRatio: plate.ratio }}>
                  <PlateImage project={p} plate={plate} />
                </div>
                <figcaption className="mt-3 text-[14px] text-muted-foreground">{plate.caption}</figcaption>
              </figure>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}

/** Every other page: the Portfolio template's own, in the Poster frame. */
// Every inner page of the Portfolio template wears this style's frame.
registerFrame(POSTER, PosterFrame)

function page(route: Route, base: string) {
  const p = { base, variant: POSTER }
  switch (route.page) {
    case "home":
      return <PosterHome base={base} />
    case "project":
      return <PosterProject base={base} slug={route.slug} />
    case "work":
      return <WorkPage {...p} />
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
  /** The path under the base: [] is the home page, ["work", "kiln"] a project. */
  path?: string[]
  /** Where the site lives, e.g. "/portfolio". */
  base: string
  /** The installed DressCode theme's id, so the sample covers pick distinct colors. */
  theme?: string
  /** Pop's ink outlines (dresscode.layout.brutal). */
  brutal?: boolean
}

export function PosterSite({ path, base, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {page(route, base)}
    </PortfolioRoot>
  )
}

export function posterMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
