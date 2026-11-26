// The whole E-commerce store behind one component: give it the path under its base and it renders that
// page. app/shop/[[...path]] (written by the install) passes the URL in. Unknown paths render the
// page-not-found page.
import type { Metadata } from "next"

import { HOME, type Variant } from "./data"
import { BrandHome, DepartmentHome } from "./homes"
import {
  AboutPage,
  AccountPage,
  CartPage,
  CheckoutPage,
  ConfirmationPage,
  ContactPage,
  GiftCardsPage,
  HelpPage,
  JournalPage,
  NotFoundPage,
  OrderPage,
  PostPage,
  SavedPage,
  SearchPage,
  ShopPage,
  SignInPage,
  TrackPage,
} from "./pages"
import { ProductPage } from "./product"
import { EcommerceRoot } from "./shell"
import { pageMeta, resolve, type Route } from "./site"

export { allPaths, resolve } from "./site"

type Props = {
  /** The path under the base: [] is the home page, ["products", "merino-crew-sweater"] a product. */
  path?: string[]
  /** Where the store lives, e.g. "/store". */
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
      return variant === "brand" ? <BrandHome base={base} /> : <DepartmentHome base={base} />
    case "shop":
      return <ShopPage {...p} id={route.id} />
    case "product":
      return <ProductPage {...p} slug={route.slug} />
    case "search":
      return <SearchPage {...p} />
    case "cart":
      return <CartPage {...p} />
    case "checkout":
      return <CheckoutPage {...p} />
    case "confirmation":
      return <ConfirmationPage {...p} />
    case "saved":
      return <SavedPage {...p} />
    case "account":
      return <AccountPage {...p} />
    case "sign-in":
      return <SignInPage {...p} />
    case "order":
      return <OrderPage {...p} number={route.number} />
    case "track":
      return <TrackPage {...p} />
    case "gift-cards":
      return <GiftCardsPage {...p} />
    case "journal":
      return <JournalPage {...p} />
    case "post":
      return <PostPage {...p} slug={route.slug} />
    case "about":
      return <AboutPage {...p} />
    case "help":
      return <HelpPage {...p} />
    case "contact":
      return <ContactPage {...p} />
    case "not-found":
      return <NotFoundPage {...p} />
  }
}

export function EcommerceSite({ path, base, variant = HOME, theme, brutal }: Props) {
  const route = resolve(path) ?? { page: "not-found" }
  return (
    <EcommerceRoot theme={theme} brutal={brutal}>
      {view(route, base, variant)}
    </EcommerceRoot>
  )
}

/** The page's <title> and description, for generateMetadata. */
export function ecommerceMetadata(path?: string[]): Metadata {
  const { title, description } = pageMeta(resolve(path))
  return { title, description }
}
