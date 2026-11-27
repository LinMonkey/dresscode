// Desktop: a portfolio that is a computer. The work is in a Projects folder, the writing in Notes,
// you in an About window; there is a dock, a terminal that answers a few questions and a note on the
// wallpaper. Every inner page (a project, a post, the résumé) opens as a window on the same desktop,
// so links still work and every page has its own address. On a phone it is a home screen of apps.
// The content is the Portfolio template's (components/portfolio/data.ts).
import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

import { AboutPage, ResumePage } from "../portfolio/about"
import { PlateImage } from "../portfolio/covers"
import { NOW, PERSON, POSTS, PROJECTS, type Variant } from "../portfolio/data"
import { NotFoundPage, NowPage, UsesPage } from "../portfolio/extras"
import { ProjectPage, WorkPage } from "../portfolio/project"
import { ContactPage, ServicesPage } from "../portfolio/services"
import { PortfolioRoot, registerFrame } from "../portfolio/shell"
import { formatDate, pageMeta, resolve, to, type PageId, type Route } from "../portfolio/site"
import { LocalTime, StatusDot } from "../portfolio/ui"
import { PostPage, WritingPage } from "../portfolio/writing"

import { DESKTOP_PORTRAIT } from "./assets"
import { ProjectsFolder } from "./desktop-folder"
import { DesktopOS, Terminal, type Launcher, type Win } from "./desktop-os"

export const DESKTOP: Variant = "desktop" as Variant

/** The note stuck to the wallpaper. */
const NOTE = "Hi! Double-click a folder to look inside. Everything else is in the dock."

const CSS = `
.dk-grid {
  background-image: linear-gradient(color-mix(in oklab, var(--dc-band-fg) 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--dc-band-fg) 9%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
}
.dk-win { box-shadow: 0 2px 6px rgb(0 0 0 / 0.08), 0 24px 48px -18px rgb(0 0 0 / 0.42); }
.dk-win.dk-top { box-shadow: 0 2px 6px rgb(0 0 0 / 0.1), 0 34px 70px -18px rgb(0 0 0 / 0.55); }
.dc-brutal .dk-win { box-shadow: 4px 4px 0 var(--dc-ink); }
.dc-brutal .dk-win.dk-top { box-shadow: 7px 7px 0 var(--dc-ink); }
.dk-note { font-family: var(--dc-font-heading); }
@media (prefers-reduced-motion: no-preference) {
  .dk-pop { animation: dk-pop 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
}
@keyframes dk-pop { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
@media print {
  .dk-root { height: auto; overflow: visible; display: block; }
  .dk-desk { overflow: visible; background: none; }
  .dk-chrome, .dk-grid, .dk-win:not(:has(> main)), .dk-win > header { display: none !important; }
  .dk-win { position: static !important; display: block !important; width: auto !important; height: auto !important; max-height: none !important; border: 0 !important; box-shadow: none !important; }
  .dk-body { overflow: visible; }
}
`

const PAGE_TITLES: Record<PageId, string> = {
  home: "Desktop",
  work: "Projects",
  project: "Project",
  about: `About ${PERSON.first}`,
  resume: "Résumé.pdf",
  services: "Services",
  writing: "Notes",
  post: "Note",
  contact: "Contact",
  uses: "Uses",
  now: "Now",
  "not-found": "File not found",
}

function AboutCard({ base }: { base: string }) {
  return (
    <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DESKTOP_PORTRAIT.src}
        alt={DESKTOP_PORTRAIT.alt}
        width={DESKTOP_PORTRAIT.width}
        height={DESKTOP_PORTRAIT.height}
        className="aspect-square w-full rounded-[calc(var(--dc-radius-card)-2px)] object-cover sm:aspect-[5/6]"
      />
      <div>
        <p className="dc-h text-[clamp(1.8rem,2.4vw,2.4rem)] leading-none">{PERSON.name}</p>
        <p className="mt-2 text-[16px] text-muted-foreground">{PERSON.role}</p>
        <p className="mt-4 text-[16px] leading-relaxed">{PERSON.intro.split(":")[0].replace(/\.?$/, ".")}</p>
        <p className="mt-4 flex items-center gap-2.5 text-[15px] font-semibold">
          <StatusDot /> {PERSON.available}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="lg" className="h-10 px-5" nativeButton={false} render={<a href={`mailto:${PERSON.email}`} />}>
            Email me
          </Button>
          <Button variant="outline" size="lg" className="h-10 px-5" nativeButton={false} render={<Link href={to(base, "resume")} />}>
            Open résumé
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotesList({ base }: { base: string }) {
  return (
    <ol className="p-2">
      {POSTS.map((p) => (
        <li key={p.slug}>
          <Link href={to(base, "writing", p.slug)} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 rounded-md px-3 py-2.5 hover:bg-muted">
            <span className="truncate text-[15px] font-semibold">{p.title}</span>
            <span className="text-[13px] text-muted-foreground">
              <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.minutes} min
            </span>
          </Link>
        </li>
      ))}
      <li className="px-3 pt-2 pb-1">
        <Link href={to(base, "writing")} className="text-[14px] font-medium text-[color:var(--dc-accent)] underline-offset-4 hover:underline">
          All notes →
        </Link>
      </li>
    </ol>
  )
}

function Photos({ base }: { base: string }) {
  const plates = PROJECTS.filter((p) => p.layout === "gallery").flatMap((p) => p.plates.map((plate) => ({ p, plate })))
  return (
    <ul className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
      {plates.map(({ p, plate }, i) => (
        <li key={i}>
          <Link href={to(base, "work", p.slug)} className="group block" title={plate.caption}>
            <span className="block aspect-square overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
              <span className="block size-full transition-transform duration-500 group-hover:scale-[1.05]">
                <PlateImage project={p} plate={plate} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NowNote() {
  return (
    <div className="p-5">
      <p className="text-[13px] text-muted-foreground">
        Updated <time dateTime={NOW.updated}>{formatDate(NOW.updated)}</time>
      </p>
      <dl className="mt-3 grid gap-3">
        {NOW.items.map((n) => (
          <div key={n.title}>
            <dt className="text-[14px] font-semibold">{n.title}</dt>
            <dd className="mt-0.5 text-[15px] leading-relaxed text-muted-foreground">{n.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Trash() {
  return (
    <div className="p-4">
      <ul className="grid gap-1 text-[14px]">
        {["logo-final-v7.png", "logo-final-FINAL.png", "pitch-deck-2019.key", "ideas-that-were-not.txt"].map((f) => (
          <li key={f} className="dc-num flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-3 px-2 text-[13px] text-muted-foreground">Four items. None of them are coming back.</p>
    </div>
  )
}

function Widget() {
  return (
    <div className="dc-card flex items-center gap-4 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DESKTOP_PORTRAIT.src} alt="" width={DESKTOP_PORTRAIT.width} height={DESKTOP_PORTRAIT.height} className="size-16 shrink-0 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="dc-h truncate text-[20px] leading-tight">{PERSON.name}</p>
        <p className="mt-0.5 text-[14px] text-muted-foreground">
          {PERSON.city} <LocalTime />
        </p>
        <p className="mt-1 flex items-center gap-2 text-[14px] font-semibold">
          <StatusDot /> {PERSON.available}
        </p>
      </div>
    </div>
  )
}

function shellCommands(base: string): Record<string, string | { go: string }> {
  const c: Record<string, string | { go: string }> = {
    help: "whoami · ls · open <project> · now · contact · resume · clear",
    whoami: `${PERSON.name}, ${PERSON.role.toLowerCase()} in ${PERSON.city}.\n${PERSON.available}.`,
    ls: PROJECTS.map((p) => p.slug).join("  "),
    now: NOW.items.map((n) => `${n.title}: ${n.body}`).join("\n"),
    contact: `${PERSON.email}\n${PERSON.replies}`,
    resume: { go: to(base, "resume") },
  }
  for (const p of PROJECTS) c[`open ${p.slug}`] = { go: to(base, "work", p.slug) }
  return c
}

/** The desktop with its windows. On an inner page, `children` is the page, in a window of its own in front. */
export function DesktopFrame({ base, current, children }: { base: string; current: PageId; cta?: boolean; children?: ReactNode }) {
  const home = current === "home"
  const windows: Win[] = [
    {
      id: "projects",
      title: `Projects — ${PROJECTS.length} items`,
      icon: "folder",
      content: <ProjectsFolder base={base} />,
      box: [3, 9, 53, 78],
      open: home,
    },
    {
      id: "notes",
      title: "Notes",
      icon: "notes",
      content: <NotesList base={base} />,
      box: [57, 4, 31, 40],
      open: home,
    },
    {
      id: "about",
      title: `About ${PERSON.first}`,
      icon: "about",
      content: <AboutCard base={base} />,
      box: [50, 40, 40, 56],
      open: home,
    },
    {
      id: "photos",
      title: "Photos",
      icon: "photos",
      content: <Photos base={base} />,
      box: [14, 7, 50, 74],
      scroll: true,
    },
    {
      id: "now",
      title: "Now",
      icon: "clock",
      content: <NowNote />,
      box: [32, 10, 34, 70],
    },
    {
      id: "trash",
      title: "Trash",
      icon: "trash",
      content: <Trash />,
      box: [40, 26, 28, 40],
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: "terminal",
      content: <Terminal lines={[`Last login: today on ${PERSON.site}`, 'Type "help" to see what this computer knows.']} commands={shellCommands(base)} />,
      box: [22, 30, 44, 48],
      scroll: true,
    },
  ]
  if (!home)
    windows.push({
      id: "page",
      title: PAGE_TITLES[current],
      icon: current === "resume" ? "file" : current === "post" || current === "writing" ? "notes" : "folder",
      content: children,
      box: [5, 4, 76, 80],
      open: true,
      scroll: true,
    })

  const icons: Launcher[] = [
    { label: "Projects", icon: "folder", open: "projects" },
    { label: "About", icon: "about", open: "about" },
    { label: "Résumé.pdf", icon: "file", href: to(base, "resume") },
    { label: "Photos", icon: "photos", open: "photos" },
    { label: "Notes", icon: "notes", open: "notes" },
    { label: "Contact", icon: "mail", href: to(base, "contact") },
    { label: "Trash", icon: "trash", open: "trash" },
  ]
  const dock: Launcher[] = [
    { label: "Projects", icon: "folder", open: "projects" },
    { label: "Notes", icon: "file", open: "notes" },
    { label: "Photos", icon: "photos", open: "photos" },
    { label: "Contact", icon: "mail", href: to(base, "contact") },
    { label: "Terminal", icon: "terminal", open: "terminal" },
    { label: "Now", icon: "clock", open: "now" },
  ]
  const menu: Launcher[] = [
    { label: "Work", icon: "folder", open: "projects" },
    { label: "Writing", icon: "notes", open: "notes" },
    { label: "About", icon: "about", open: "about" },
    { label: "Contact", icon: "mail", href: to(base, "contact") },
  ]

  return (
    <>
      <style>{CSS}</style>
      {home ? (
        <h1 className="sr-only">
          {PERSON.name}, {PERSON.role}
        </h1>
      ) : null}
      <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <DesktopOS
        base={base}
        name={PERSON.name}
        initials={PERSON.initials}
        city={PERSON.city}
        windows={windows}
        front={home ? undefined : "page"}
        icons={icons}
        dock={dock}
        menu={menu}
        note={home ? NOTE : undefined}
        widget={<Widget />}
      />
    </>
  )
}

export function DesktopHome({ base }: { base: string }) {
  return <DesktopFrame base={base} current="home" />
}

// Every inner page of the Portfolio template wears this style's frame.
registerFrame(DESKTOP, DesktopFrame)

function page(route: Route, base: string) {
  const p = { base, variant: DESKTOP }
  switch (route.page) {
    case "home":
      return <DesktopHome base={base} />
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

export function DesktopSite({ path, base, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {page(route, base)}
    </PortfolioRoot>
  )
}

export function desktopMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
