// The frame every page sits in. The department look has a wide search, Sign in / Saved / Cart and a
// row of departments; the brand look has a centered serif name with a few links on each side.
// Checkout gets a quiet header of its own. Server components; the moving parts come from nav.tsx.
import { Heart, User } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { CartDrawer } from "./cart"
import { BRAND, NOTICE, type Variant } from "./data"
import { NewsletterForm } from "./forms"
import { CartButton, DepartmentsMenu, PhoneMenu, SearchBox, SearchButton } from "./nav"
import { BRAND_NAV, DEPARTMENT_NAV, FOOTER_LINKS, to, type PageId } from "./site"
import { WRAP } from "./styles"
import { ModeToggle } from "./ui"

const CSS = `
.ec-well { background: color-mix(in oklab, var(--foreground) 3.5%, var(--card)); }
.dark .ec-well { background: color-mix(in oklab, var(--foreground) 86%, var(--card)); }
@media (prefers-reduced-motion: no-preference) {
  .ec-rise { animation: ec-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  .ec-zoom { animation: ec-zoom 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  .ec-flash { animation: ec-flash 1.6s ease-out; }
}
@keyframes ec-rise { from { opacity: 0; transform: translateY(14px); } }
@keyframes ec-zoom { from { transform: scale(1.05); } }
@keyframes ec-flash { from { background: color-mix(in oklab, var(--dc-highlight) 45%, transparent); } }
.ec-root .dc-h { text-wrap: balance; }
.ec-scroll { scrollbar-width: none; }
.ec-scroll::-webkit-scrollbar { display: none; }
`

export function EcommerceRoot({ theme, brutal, children }: { theme?: string; brutal?: boolean; children: ReactNode }) {
  return (
    <div data-ec-theme={theme} className={cn("ec-root dc-theme flex min-h-svh flex-col bg-background text-foreground", brutal && "dc-brutal")}>
      <style>{CSS}</style>
      {children}
    </div>
  )
}

function SkipLink() {
  return (
    <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      Skip to content
    </a>
  )
}

function Notice({ base, look }: { base: string; look: Variant }) {
  return (
    <div className="bg-foreground text-background print:hidden">
      <div className={cn(WRAP, "grid h-9 items-center text-[13px] font-medium sm:grid-cols-[1fr_auto_1fr]")}>
        <span className="max-sm:hidden" />
        <p className="truncate text-center">{NOTICE[look]}</p>
        {look === "department" ? (
          <nav aria-label="Help" className="hidden gap-5 justify-self-end sm:flex">
            <Link href={to(base, "track")} className="underline underline-offset-4 hover:no-underline">
              Track order
            </Link>
            <Link href={to(base, "help")} className="underline underline-offset-4 hover:no-underline">
              Help
            </Link>
          </nav>
        ) : null}
      </div>
    </div>
  )
}

function Wordmark({ base, className }: { base: string; className?: string }) {
  return (
    <Link href={to(base)} className={cn("dc-h shrink-0 leading-none", className)}>
      {BRAND.name}
    </Link>
  )
}

export function DepartmentHeader({ base }: { base: string }) {
  const icon = "flex flex-col items-center gap-0.5 rounded-[var(--radius)] px-2 py-1 text-[12px] hover:bg-muted"
  return (
    <header className="border-b border-border bg-background print:hidden">
      <SkipLink />
      <Notice base={base} look="department" />
      <div className={cn(WRAP, "flex h-[72px] items-center gap-4 lg:gap-10")}>
        <PhoneMenu base={base} className="-ml-2" />
        <Wordmark base={base} className="text-[30px] font-extrabold tracking-[-0.04em] sm:text-[34px]" />
        <SearchBox base={base} className="hidden max-w-[640px] flex-1 md:block" />
        <nav aria-label="Account" className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link href={to(base, "account")} className={cn(icon, "max-sm:hidden")}>
            <User className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />
            Sign in
          </Link>
          <Link href={to(base, "saved")} className={cn(icon, "max-sm:hidden")}>
            <Heart className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />
            Saved
          </Link>
          <CartButton look="department" />
        </nav>
      </div>
      <div className={cn(WRAP, "pb-3 md:hidden")}>
        <SearchBox base={base} />
      </div>
      <div className="hidden border-t border-border lg:block">
        <nav aria-label="Departments" className={cn(WRAP, "flex h-12 items-center gap-1 text-[15px]")}>
          <DepartmentsMenu base={base} />
          <div className="ml-4 flex items-center gap-1 xl:ml-8 xl:gap-4">
            {DEPARTMENT_NAV.map((n) => (
              <Link key={n.path} href={to(base, n.path)} className={cn("rounded-[var(--radius)] px-2.5 py-1.5 hover:bg-muted", n.sale && "font-semibold text-[color:var(--dc-danger)]")}>
                {n.label}
              </Link>
            ))}
          </div>
          <Link href={to(base, "shop/new")} className="ml-auto rounded-[var(--radius)] px-2.5 py-1.5 font-semibold text-[color:var(--dc-accent)] hover:bg-muted">
            New arrivals
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function BrandHeader({ base }: { base: string }) {
  return (
    <header className="border-b border-border bg-background print:hidden">
      <SkipLink />
      <Notice base={base} look="brand" />
      <div className={cn(WRAP, "grid h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-4")}>
        <nav aria-label="Main" className="flex items-center gap-1 text-[15px]">
          <PhoneMenu base={base} className="-ml-2" />
          {BRAND_NAV.map((n) => (
            <Link key={n.path} href={to(base, n.path)} className="hidden rounded-[var(--radius)] px-2.5 py-1.5 hover:bg-muted lg:block">
              {n.label}
            </Link>
          ))}
        </nav>
        <Wordmark base={base} className="text-[32px] sm:text-[36px]" />
        <div className="flex items-center justify-end gap-1 text-[15px] sm:gap-2">
          <SearchButton base={base} />
          <Link href={to(base, "account")} className="hidden rounded-[var(--radius)] px-2 py-1.5 hover:bg-muted sm:block">
            Account
          </Link>
          <CartButton look="brand" />
        </div>
      </div>
    </header>
  )
}

export function Footer({ base, look }: { base: string; look: Variant }) {
  return (
    <footer className="mt-auto border-t border-border print:hidden">
      <div className={cn(WRAP, "grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]")}>
        <div>
          <Wordmark base={base} className={cn(look === "department" ? "text-[30px] font-extrabold tracking-[-0.04em]" : "text-[32px]")} />
          <p className="mt-3 max-w-[22em] text-[15px] text-muted-foreground">
            {BRAND.tagline}
            <br />
            {BRAND.city}.
          </p>
        </div>
        {FOOTER_LINKS.map(([title, links]) => (
          <div key={title}>
            <p className="text-[15px] font-semibold">{title}</p>
            <ul className="mt-3 grid gap-2 text-[14px] text-muted-foreground">
              {links.map(([label, path]) => (
                <li key={label}>
                  <Link href={to(base, path)} className="hover:text-foreground hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={cn(WRAP, "flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border py-5 text-[13px] text-muted-foreground")}>
        <span>
          © {new Date().getFullYear()} {BRAND.legal}
        </span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto">
          <span>United States (USD $)</span>
          <ModeToggle className="-mx-2 text-[13px]" />
          <Link href={to(base, "help")} className="hover:text-foreground">
            Privacy
          </Link>
          <Link href={to(base, "help")} className="hover:text-foreground">
            Terms
          </Link>
          <Link href={to(base, "help")} className="hover:text-foreground">
            Accessibility
          </Link>
        </span>
      </div>
    </footer>
  )
}

/** The newsletter: a full-width band in the department look, a quiet card in the brand look. */
export function Newsletter({ look, className }: { look: Variant; className?: string }) {
  if (look === "department")
    return (
      <section aria-labelledby="ec-news" className={cn("dc-band", className)}>
        <div className={cn(WRAP, "grid gap-6 py-8 md:grid-cols-[1fr_minmax(0,460px)] md:items-center")}>
          <div>
            <h2 id="ec-news" className="dc-h text-[clamp(1.6rem,2.8vw,2.2rem)] leading-tight">
              Get 10% off your first order
            </h2>
            <p className="mt-1 text-[15px] opacity-90">One email a week: new things, restocks and care guides. Unsubscribe anytime.</p>
          </div>
          <div>
            <NewsletterForm cta="Subscribe" onBand />
            <p className="mt-2 text-[13px] opacity-85">Use code WELCOME10 at checkout.</p>
          </div>
        </div>
      </section>
    )
  return (
    <section aria-labelledby="ec-news" className={cn(WRAP, className)}>
      <div className="dc-card grid gap-5 px-6 py-7 md:grid-cols-[1fr_minmax(0,440px)] md:items-center md:px-10">
        <div>
          <h2 id="ec-news" className="dc-h text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight">
            Letters from {BRAND.name}
          </h2>
          <p className="mt-1 text-[15px] text-muted-foreground">New colors, restocks and care guides, once a month.</p>
        </div>
        <NewsletterForm cta="Sign up" />
      </div>
    </section>
  )
}

/** Header, page, footer and the cart drawer, in the look's style. */
export function PageFrame({ base, look, children, newsletter = true }: { base: string; look: Variant; current?: PageId; children: ReactNode; newsletter?: boolean }) {
  return (
    <>
      {look === "brand" ? <BrandHeader base={base} /> : <DepartmentHeader base={base} />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {newsletter ? <Newsletter look={look} className={look === "brand" ? "mt-16 mb-12" : "mt-16"} /> : null}
      <Footer base={base} look={look} />
      <CartDrawer base={base} />
    </>
  )
}

export function Crumbs({ base, items, className }: { base: string; items: [string, string?][]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px] text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {[["Home", ""] as [string, string?], ...items].map(([label, path], i, all) => (
          <li key={label} className="flex items-center gap-1.5">
            {i ? <span aria-hidden="true">/</span> : null}
            {i < all.length - 1 && path !== undefined ? (
              <Link href={to(base, ...(path ? [path] : []))} className="hover:text-foreground hover:underline">
                {label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className={i === all.length - 1 ? "text-foreground" : undefined}>
                {label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** The heading an inner page opens with. */
export function PageIntro({ title, lead, children, className }: { title: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn("pt-8 pb-6 sm:pt-10", className)}>
      <h1 className="ec-rise dc-h text-[clamp(2rem,4vw,3rem)] leading-[1.05]">{title}</h1>
      {lead ? <p className="ec-rise mt-3 max-w-[42em] text-[17px] leading-relaxed text-muted-foreground">{lead}</p> : null}
      {children}
    </section>
  )
}
