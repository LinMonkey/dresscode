// Garden: a portfolio laid out like a quiet magazine that is also a digital garden. The home page is an
// issue (a lead essay, what else is in it, notes you can filter by how finished they are, the work as a
// photo spread and a newsletter band); essays get a drop cap, margin notes and a table of contents.
// The content is the Portfolio template's (components/portfolio/data.ts); what only this layout shows
// (the editorial versions of posts, captions and the notes) is in garden-data.ts and garden-notes-data.ts.
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { AboutPage, ResumePage } from "../portfolio/about"
import type { Variant } from "../portfolio/data"
import { NotFoundPage, NowPage, UsesPage } from "../portfolio/extras"
import { ProjectPage, WorkPage } from "../portfolio/project"
import { ContactPage, ServicesPage } from "../portfolio/services"
import { PortfolioRoot, registerFrame } from "../portfolio/shell"
import { pageMeta, resolve, type PageId, type Route } from "../portfolio/site"
import { WritingPage } from "../portfolio/writing"

import { GardenArticle } from "./garden-article"
import { GardenFooter, GardenHeader } from "./garden-frame"
import { GardenHome } from "./garden-home"

export const GARDEN: Variant = "garden" as Variant

/** The slim masthead, the page and the footer: what every inner page sits in. */
export function GardenFrame({ base, children }: { base: string; current: PageId; cta?: boolean; children: ReactNode }) {
  return (
    <>
      <GardenHeader base={base} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <GardenFooter base={base} />
    </>
  )
}

// Every inner page of the Portfolio template wears this style's frame.
registerFrame(GARDEN, GardenFrame)

function page(route: Route, base: string) {
  const p = { base, variant: GARDEN }
  switch (route.page) {
    case "home":
      return <GardenHome base={base} />
    case "post":
      return <GardenArticle base={base} slug={route.slug} />
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

type Props = { path?: string[]; base: string; theme?: string; brutal?: boolean }

export function GardenSite({ path, base, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {page(route, base)}
    </PortfolioRoot>
  )
}

export function gardenMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
