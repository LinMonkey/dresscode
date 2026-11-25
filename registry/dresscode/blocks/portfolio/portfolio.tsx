// The whole site behind one component: give it the path under its base and it renders that page.
// app/portfolio/[[...path]]/page.tsx (written by the install) passes the URL in; any other route
// setup works the same way. Unknown paths render the page-not-found page.
import type { Metadata } from "next"

import { AboutPage, ResumePage } from "./about"
import type { Variant } from "./data"
import { NotFoundPage, NowPage, UsesPage } from "./extras"
import { GridHome, IndexHome } from "./home"
import { ProjectPage, WorkPage } from "./project"
import { ContactPage, ServicesPage } from "./services"
import { PortfolioRoot } from "./shell"
import { DEFAULT_VARIANT, pageMeta, resolve, type Route } from "./site"
import { PostPage, WritingPage } from "./writing"

export { allPaths, resolve } from "./site"

type Props = {
  /** The path under the base: [] is the home page, ["work", "kiln"] a project. */
  path?: string[]
  /** Where the site lives, e.g. "/portfolio" (links are built from it). */
  base: string
  /** Which home it opens on; HOME in data.ts by default. */
  variant?: Variant
  /** The installed DressCode theme's id (lib/dresscode-theme.ts), so the sample covers pick distinct colors. */
  theme?: string
  /** Pop's ink outlines (dresscode.layout.brutal). */
  brutal?: boolean
}

function view(route: Route, base: string, variant: Variant) {
  const p = { base, variant }
  switch (route.page) {
    case "home":
      return variant === "grid" ? <GridHome base={base} /> : <IndexHome base={base} />
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

export function PortfolioSite({ path, base, variant = DEFAULT_VARIANT, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <PortfolioRoot theme={theme} brutal={brutal}>
      {view(route, base, variant)}
    </PortfolioRoot>
  )
}

/** The page's <title> and description, for generateMetadata. */
export function portfolioMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
