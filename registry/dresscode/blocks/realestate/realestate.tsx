// The whole Real estate site behind one component: give it the path under its base and it renders that
// page. app/realestate/[[...path]] (written by the install) passes the URL in. Unknown paths render the
// page-not-found page.
import type { Metadata } from "next"

import { HOME, type Variant } from "./data"
import { BoutiqueHome, PlatformHome } from "./homes"
import { ListingPage } from "./listing"
import { AboutPage, AgentPage, AgentsPage, ComparePage, ContactPage, HoodPage, HoodsPage, JournalPage, MortgagePage, NotFoundPage, PostPage, SavedPage, SearchPage, SellPage } from "./pages"
import { RealEstateRoot } from "./shell"
import { pageMeta, resolve, type Route } from "./site"

export { allPaths, resolve } from "./site"

type Props = {
  /** The path under the base: [] is the home page, ["homes", "908-cedar-heights-road"] a listing. */
  path?: string[]
  /** Where the site lives, e.g. "/realestate". */
  base: string
  /** Which home it opens on, and the look of every page; HOME in data.ts by default. */
  variant?: Variant
  /** The installed DressCode theme's id. */
  theme?: string
  /** Pop's ink outlines (dresscode.layout.brutal). */
  brutal?: boolean
}

function view(route: Route, base: string, variant: Variant) {
  const p = { base, variant }
  switch (route.page) {
    case "home":
      return variant === "boutique" ? <BoutiqueHome base={base} /> : <PlatformHome base={base} />
    case "search":
      return <SearchPage {...p} status={route.status} />
    case "listing":
      return <ListingPage {...p} slug={route.slug} />
    case "agents":
      return <AgentsPage {...p} />
    case "agent":
      return <AgentPage {...p} slug={route.slug} />
    case "hoods":
      return <HoodsPage {...p} />
    case "hood":
      return <HoodPage {...p} slug={route.slug} />
    case "sell":
      return <SellPage {...p} />
    case "mortgage":
      return <MortgagePage {...p} />
    case "compare":
      return <ComparePage {...p} />
    case "saved":
      return <SavedPage {...p} />
    case "journal":
      return <JournalPage {...p} />
    case "post":
      return <PostPage {...p} slug={route.slug} />
    case "about":
      return <AboutPage {...p} />
    case "contact":
      return <ContactPage {...p} />
    case "not-found":
      return <NotFoundPage {...p} />
  }
}

export function RealEstateSite({ path, base, variant = HOME, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <RealEstateRoot theme={theme} brutal={brutal}>
      {view(route, base, variant)}
    </RealEstateRoot>
  )
}

/** The page's <title> and description, for generateMetadata. */
export function realEstateMetadata(path?: string[], variant: Variant = HOME): Metadata {
  const { title, description } = pageMeta(resolve(path), variant)
  return { title, description }
}
