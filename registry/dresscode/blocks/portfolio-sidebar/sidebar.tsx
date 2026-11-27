// Sidebar: a portfolio laid out like a résumé you can scroll. Your name, what you do, the section list
// and the ways to reach you stay put on the left; experience, projects and writing scroll on the right.
// The section list lights up the section you are reading. Every inner page keeps the same left column.
// The content is the Portfolio template's (components/portfolio/data.ts).
import { ArrowRight, ArrowUpRight, Camera, CodeXml, FileUser, Mail } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AboutPage, ResumePage } from "../portfolio/about"
import { ProjectCover } from "../portfolio/covers"
import { EXPERIENCE, NOW, PERSON, POSTS, PROJECTS, type Variant } from "../portfolio/data"
import { NotFoundPage, NowPage, UsesPage } from "../portfolio/extras"
import { ProjectPage, WorkPage } from "../portfolio/project"
import { ContactPage, ServicesPage } from "../portfolio/services"
import { PortfolioRoot, registerFrame } from "../portfolio/shell"
import { formatDate, pageMeta, resolve, to, type PageId, type Route } from "../portfolio/site"
import { LocalTime, ModeToggle, StatusDot } from "../portfolio/ui"
import { PostPage, WritingPage } from "../portfolio/writing"

import { PageList, SectionSpy, Spotlight } from "./sidebar-client"

export const SIDEBAR: Variant = "sidebar" as Variant

/** The tags under each job on the home page, in the same order as EXPERIENCE in data.ts. */
const JOB_TAGS = [
  ["Product design", "React", "Swift"],
  ["Maps", "Data visualisation", "Design systems"],
  ["Field research", "Offline-first", "iPad"],
  ["Front-end", "Variable fonts", "Museums"],
]

const CSS = `
.sb-card { position: relative; isolation: isolate; }
.sb-card::before {
  content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; opacity: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--dc-accent) 16%, transparent), transparent 62%);
  transition: opacity 0.35s ease;
}
.sb-card:hover::before, .sb-card:focus-within::before { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .sb-rise { animation: sb-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
}
@keyframes sb-rise { from { opacity: 0; transform: translateY(16px); } }
`

const ICONS = [CodeXml, FileUser, Camera]

function Elsewhere({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <a href={`mailto:${PERSON.email}`} aria-label="Email" className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Mail className="size-5" aria-hidden="true" />
      </a>
      {PERSON.links.map((l, i) => {
        const Icon = ICONS[i % ICONS.length]
        return (
          <a
            key={l.href}
            href={l.href}
            aria-label={l.label}
            title={l.label}
            className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-5" aria-hidden="true" />
          </a>
        )
      })}
      <ModeToggle className="ml-1" />
    </div>
  )
}

/** The left column: who, what, where you are in the site, how to reach you. */
function Side({ base, current, home }: { base: string; current: PageId; home: boolean }) {
  const Name = home ? "h1" : "p"
  const pages = [
    { label: "Home", path: "", page: "home" },
    { label: "Work", path: "work", page: "work" },
    { label: "About", path: "about", page: "about" },
    { label: "Writing", path: "writing", page: "writing" },
    { label: "Résumé", path: "resume", page: "resume" },
    { label: "Contact", path: "contact", page: "contact" },
  ].map((p) => ({
    href: p.path ? to(base, p.path) : to(base),
    label: p.label,
    current: p.page === current || (current === "project" && p.page === "work") || (current === "post" && p.page === "writing"),
  }))
  return (
    <div className="flex flex-col gap-10 py-10 lg:sticky lg:top-0 lg:h-dvh lg:justify-between lg:overflow-y-auto lg:py-16">
      <div>
        <Name className="sb-rise dc-h text-[clamp(2.6rem,4.4vw,4.2rem)] leading-[0.98]">
          <Link href={to(base)}>{PERSON.name}</Link>
        </Name>
        <p className="sb-rise mt-3 text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium" style={{ animationDelay: "60ms" }}>
          {PERSON.role}
        </p>
        <p className="sb-rise mt-4 max-w-[26em] text-[17px] leading-relaxed text-muted-foreground" style={{ animationDelay: "120ms" }}>
          {PERSON.intro.split(":")[0].replace(/\.?$/, ".")}
        </p>
        <p className="sb-rise mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]" style={{ animationDelay: "180ms" }}>
          <span className="flex items-center gap-2.5">
            <StatusDot /> {PERSON.available}
          </span>
          <span className="dc-num text-muted-foreground">
            {PERSON.city} <LocalTime />
          </span>
        </p>

        <nav aria-label={home ? "Sections" : "Pages"} className="mt-10 hidden lg:block">
          {home ? (
            <SectionSpy
              items={[
                { id: "about", label: "About" },
                {
                  id: "experience",
                  label: "Experience",
                  count: EXPERIENCE.length,
                },
                { id: "projects", label: "Projects", count: PROJECTS.length },
                { id: "writing", label: "Writing", count: POSTS.length },
              ]}
            />
          ) : (
            <PageList items={pages} />
          )}
        </nav>
      </div>

      <div className="grid gap-6">
        <div className="dc-card max-w-[380px] px-5 py-4">
          <p className="text-[15px] font-semibold">Now</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
            {NOW.items
              .slice(0, 2)
              .map((n) => n.body.split(/[.:]/)[0])
              .join(". ")}
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<a href={`mailto:${PERSON.email}`} />}>
            Email me
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-6 text-[15px]" nativeButton={false} render={<Link href={to(base, "resume")} />}>
            Résumé (PDF)
          </Button>
        </div>
        <Elsewhere className="-ml-2.5" />
      </div>
    </div>
  )
}

/** On a phone the left column stacks on top; the sections (or pages) become a row of tabs that stays at the top. */
function PhoneTabs({ base, home, current }: { base: string; home: boolean; current: PageId }) {
  const items = home
    ? [
        ["About", "#about"],
        ["Experience", "#experience"],
        ["Projects", "#projects"],
        ["Writing", "#writing"],
      ]
    : [
        ["Work", to(base, "work")],
        ["About", to(base, "about")],
        ["Writing", to(base, "writing")],
        ["Résumé", to(base, "resume")],
        ["Contact", to(base, "contact")],
      ]
  return (
    <nav
      aria-label={home ? "Sections" : "Pages"}
      className="sticky top-0 z-30 -mx-5 flex gap-1 overflow-x-auto border-b border-border bg-background/90 px-4 py-2 backdrop-blur sm:-mx-8 sm:px-7 lg:hidden print:hidden"
    >
      {items.map(([label, href]) => (
        <a
          key={href}
          href={href}
          aria-current={!home && href.endsWith(current) ? "page" : undefined}
          className="shrink-0 rounded-full px-3 py-1.5 text-[15px] font-medium text-muted-foreground hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

/** The two columns every Sidebar page sits in. */
export function SidebarFrame({ base, current, children }: { base: string; current: PageId; cta?: boolean; children: ReactNode }) {
  const home = current === "home"
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16 lg:px-16 xl:gap-24 print:block print:max-w-none print:p-0">
      <style>{CSS}</style>
      <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <header className="print:hidden">
        <Side base={base} current={current} home={home} />
      </header>
      <PhoneTabs base={base} home={home} current={current} />
      <main id="main" className="min-w-0 pt-6 pb-16 lg:pt-16 print:p-0">
        {children}
        <footer className="mt-24 border-t border-border pt-6 text-[14px] text-muted-foreground print:hidden">
          © {new Date().getFullYear()} {PERSON.name}. Made in {PERSON.city}.{" "}
          <Link href={to(base, "uses")} className="underline-offset-4 hover:underline">
            Uses
          </Link>{" "}
          ·{" "}
          <Link href={to(base, "now")} className="underline-offset-4 hover:underline">
            Now
          </Link>
        </footer>
      </main>
    </div>
  )
}

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="dc-h scroll-mt-20 text-[clamp(2rem,3vw,2.6rem)] leading-tight lg:scroll-mt-16">
      {children}
    </h2>
  )
}

export function SidebarHome({ base }: { base: string }) {
  return (
    <SidebarFrame base={base} current="home">
      <section aria-labelledby="about-h" id="about" className="scroll-mt-20 lg:scroll-mt-16">
        <h2 id="about-h" className="sr-only">
          About
        </h2>
        <div className="grid gap-5 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-relaxed">
          {PERSON.bio.map((b, i) => (
            <p key={b} className={i ? "text-muted-foreground" : undefined}>
              {b}
            </p>
          ))}
          <p className="text-muted-foreground">
            More{" "}
            <Link href={to(base, "about")} className="text-[color:var(--dc-accent)] underline underline-offset-4">
              about me
            </Link>
            , or see{" "}
            <Link href={to(base, "work")} className="text-[color:var(--dc-accent)] underline underline-offset-4">
              all my work
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="experience-h" id="experience" className="mt-20 scroll-mt-20 lg:mt-28 lg:scroll-mt-16">
        <Heading id="experience-h">Experience</Heading>
        <Spotlight className="relative mt-8">
          <span className="absolute top-3 bottom-3 left-[7px] w-px bg-border" aria-hidden="true" />
          <ol className="grid gap-3">
            {EXPERIENCE.map((e, i) => (
              <li key={e.org} className="relative pl-9">
                <span
                  className={cn("absolute top-7 left-0 size-[15px] rounded-full border-2 border-background", i === 0 ? "bg-[color:var(--dc-accent)]" : "bg-[color:var(--dc-line)]")}
                  aria-hidden="true"
                />
                <article data-spot className="sb-card rounded-[var(--dc-radius-card)] border border-transparent px-5 py-5 transition-colors hover:border-border hover:bg-card">
                  <p className="dc-num text-[14px] text-muted-foreground">{e.years}</p>
                  <h3 className="mt-1.5 text-[19px] font-semibold">
                    {e.role} · {e.org}
                  </h3>
                  <p className="mt-2 max-w-[38em] text-[16px] leading-relaxed text-muted-foreground">{e.note}</p>
                  {JOB_TAGS[i]?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
                      {JOB_TAGS[i].map((t) => (
                        <li key={t} className="dc-pill dc-pill-hl h-7 px-3 text-[13px] font-medium">
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </Spotlight>
        <Link href={to(base, "resume")} className="mt-6 inline-flex items-center gap-1.5 pl-9 text-[16px] font-semibold text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
          Full résumé <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="projects-h" id="projects" className="mt-20 scroll-mt-20 lg:mt-28 lg:scroll-mt-16">
        <Heading id="projects-h">Projects</Heading>
        <Spotlight className="mt-8">
          <ol className="grid gap-3">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={to(base, "work", p.slug)}
                  data-spot
                  className="sb-card group grid gap-5 rounded-[var(--dc-radius-card)] border border-transparent p-4 transition-colors hover:border-border hover:bg-card sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center"
                >
                  <span className="block aspect-[4/3] overflow-hidden rounded-[calc(var(--dc-radius-card)-2px)] border border-border">
                    <ProjectCover project={p} />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-[20px] font-semibold group-hover:text-[color:var(--dc-accent)]">
                      {p.title}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                    <span className="mt-1.5 block text-[16px] leading-relaxed text-muted-foreground">{p.summary.split(". ")[0].replace(/\.?$/, ".")}</span>
                    <span className="dc-num mt-2 block text-[13px] text-muted-foreground">
                      {p.year} · {p.role}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Spotlight>
      </section>

      <section aria-labelledby="writing-h" id="writing" className="mt-20 scroll-mt-20 lg:mt-28 lg:scroll-mt-16">
        <Heading id="writing-h">Writing</Heading>
        <ol className="mt-6 border-t border-border">
          {POSTS.map((p) => (
            <li key={p.slug} className="border-b border-border">
              <Link href={to(base, "writing", p.slug)} className="group grid gap-1 py-4 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-5">
                <time dateTime={p.date} className="dc-num text-[14px] text-muted-foreground">
                  {formatDate(p.date)}
                </time>
                <span className="text-[17px] font-medium underline-offset-4 group-hover:underline">{p.title}</span>
                <span className="text-[14px] text-muted-foreground">{p.minutes} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SidebarFrame>
  )
}

// Every inner page of the Portfolio template wears this style's frame.
registerFrame(SIDEBAR, SidebarFrame)

function page(route: Route, base: string) {
  const p = { base, variant: SIDEBAR }
  switch (route.page) {
    case "home":
      return <SidebarHome base={base} />
    case "work":
      return <WorkPage {...p} />
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

export function SidebarSite({ path, base, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {page(route, base)}
    </PortfolioRoot>
  )
}

export function sidebarMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
