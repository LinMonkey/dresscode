// The frame every page sits in. The platform site has a white bar with the search links and an orange
// "List your home"; the boutique site (the private office) has a quiet serif masthead that lies over
// the photograph on its home page. Server components; the interactive bits come from ui.tsx.
import { Heart, Menu } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { BRAND, type Variant } from "./data"
import { NAV, PRIVATE_NAV, to, type PageId } from "./site"
import { ModeToggle } from "./ui"

export const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"

const CSS = `
@media (prefers-reduced-motion: no-preference) {
  .re-rise { animation: re-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  .re-zoom { animation: re-zoom 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
}
@keyframes re-rise { from { opacity: 0; transform: translateY(16px); } }
@keyframes re-zoom { from { transform: scale(1.06); } }
.re-root .dc-h { text-wrap: balance; }
@media print {
  .re-root { --background: #fff; --foreground: #111; --muted-foreground: #555; --border: #d4d4d4; background: #fff; color: #111; }
  .re-root *, .re-root *::before { animation: none !important; transition: none !important; }
}
`

export function RealEstateRoot({ theme, brutal, children }: { theme?: string; brutal?: boolean; children: ReactNode }) {
  return (
    <div data-re-theme={theme} className={cn("re-root dc-theme flex min-h-svh flex-col bg-background text-foreground", brutal && "dc-brutal")}>
      <style>{CSS}</style>
      {children}
    </div>
  )
}

/** The brokerage's mark: a roofline. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={cn("h-5 w-8 shrink-0 text-[color:var(--dc-primary)]", className)} aria-hidden="true">
      <path d="M2 17 L16 4 L30 17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SkipLink() {
  return (
    <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      Skip to content
    </a>
  )
}

function PhoneMenu({ base, items, className }: { base: string; items: { label: string; path: string; page?: string }[]; className?: string }) {
  return (
    <details className={cn("group relative lg:hidden", className)}>
      <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-[var(--radius)] border border-current/20 [&::-webkit-details-marker]:hidden" aria-label="Menu">
        <Menu className="size-4" aria-hidden="true" />
      </summary>
      <nav aria-label="Main" className="dc-card absolute top-11 right-0 z-50 grid w-56 p-2 text-[15px] text-foreground">
        {items.map((n) => (
          <Link key={n.path} href={to(base, n.path)} className="rounded-md px-3 py-2 hover:bg-muted">
            {n.label}
          </Link>
        ))}
      </nav>
    </details>
  )
}

function SavedLink({ base }: { base: string }) {
  return (
    <Link href={to(base, "saved")} className="hidden items-center gap-1.5 rounded-[var(--radius)] px-2 py-1.5 text-[15px] font-semibold text-[color:var(--dc-accent)] hover:bg-muted sm:inline-flex">
      <Heart className="size-4" aria-hidden="true" /> Saved
    </Link>
  )
}

export function PlatformHeader({ base, current }: { base: string; current: PageId; search?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur print:hidden">
      <SkipLink />
      <div className={cn(WRAP, "flex h-16 items-center gap-6")}>
        <Link href={to(base)} className="flex items-center gap-2" aria-current={current === "home" ? "page" : undefined}>
          <Logo />
          <span className="dc-h text-[22px] leading-none">{BRAND.name}</span>
        </Link>
        <nav aria-label="Main" className="mx-auto hidden items-center gap-1 text-[15px] font-medium lg:flex">
          {NAV.map((n) => (
            <Link key={n.path} href={to(base, n.path)} className="rounded-[var(--radius)] px-3 py-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <SavedLink base={base} />
          <ModeToggle />
          <Button size="lg" className="hidden h-10 px-4 text-[15px] font-semibold sm:inline-flex" nativeButton={false} render={<Link href={to(base, "sell")} />}>
            List your home
          </Button>
          <PhoneMenu base={base} items={[...NAV, { label: "Saved homes", path: "saved", page: "saved" }, { label: "Contact", path: "contact", page: "contact" }]} />
        </div>
      </div>
    </header>
  )
}

export function PlatformFooter({ base }: { base: string }) {
  const cols: [string, [string, string][]][] = [
    ["Buy", [["Homes for sale", "buy"], ["Homes for rent", "rent"], ["Recently sold", "sold"], ["Mortgage calculator", "mortgage"]]],
    ["Sell", [["List your home", "sell"], ["Home valuation", "sell"], ["Compare homes", "compare"]]],
    ["Company", [["About", "about"], ["Our agents", "agents"], ["Contact", "contact"]]],
    ["Resources", [["Journal", "journal"], ["Neighborhoods", "neighborhoods"], ["Saved homes", "saved"]]],
  ]
  return (
    <footer className="mt-auto border-t border-border bg-card print:hidden">
      <div className={cn(WRAP, "grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(4,1fr)]")}>
        <div>
          <Link href={to(base)} className="flex items-center gap-2">
            <Logo />
            <span className="dc-h text-[22px] leading-none">{BRAND.name}</span>
          </Link>
          <p className="mt-3 text-[15px] text-muted-foreground">A local brokerage since {BRAND.since}.</p>
          <p className="mt-4 text-[14px] text-muted-foreground">
            {BRAND.address}
            <br />
            {BRAND.phone}
          </p>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <p className="text-[15px] font-semibold">{title}</p>
            <ul className="mt-3 grid gap-2 text-[15px] text-muted-foreground">
              {links.map(([label, path]) => (
                <li key={label}>
                  <Link href={to(base, path)} className="hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={cn(WRAP, "flex flex-wrap justify-between gap-3 border-t border-border py-5 text-[13px] text-muted-foreground")}>
        <span>
          © {new Date().getFullYear()} {BRAND.legal} · {BRAND.city}
        </span>
        <span>
          {BRAND.license} · Equal housing opportunity
        </span>
      </div>
    </footer>
  )
}

/** The private office's masthead. Over the home page's photograph it is transparent with white type. */
export function BoutiqueHeader({ base, current, overlay = false }: { base: string; current: PageId; overlay?: boolean }) {
  return (
    <header className={cn("z-40 print:hidden", overlay ? "absolute inset-x-0 top-0 text-white" : "sticky top-0 border-b border-border bg-background/95 backdrop-blur")}>
      <SkipLink />
      <div className={cn(WRAP, "flex h-[72px] items-center gap-6")}>
        <Link href={to(base)} className="dc-h text-[26px] leading-none italic sm:text-[30px]" aria-current={current === "home" ? "page" : undefined}>
          {BRAND.private}
        </Link>
        <nav aria-label="Main" className="mx-auto hidden items-center gap-7 text-[15px] lg:flex">
          {PRIVATE_NAV.map((n) => (
            <Link key={n.label} href={to(base, n.path)} className="underline-offset-[6px] opacity-90 hover:underline hover:opacity-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ModeToggle />
          <Link
            href={to(base, "contact")}
            className={cn(
              "hidden h-10 items-center rounded-[var(--radius)] border px-4 text-[15px] transition-colors sm:inline-flex",
              overlay ? "border-white/70 hover:bg-white hover:text-[#15163f]" : "border-foreground/30 hover:bg-foreground hover:text-background",
            )}
          >
            Book a private viewing
          </Link>
          <PhoneMenu base={base} items={[...PRIVATE_NAV, { label: "Contact", path: "contact", page: "contact" }]} />
        </div>
      </div>
    </header>
  )
}

export function BoutiqueFooter({ base }: { base: string }) {
  const cols: [string, string][][] = [
    [["Residences", "buy"], ["Sold", "sold"], ["Neighborhoods", "neighborhoods"]],
    [["About", "about"], ["Our team", "agents"], ["Journal", "journal"]],
    [["Contact", "contact"], ["Sell privately", "sell"], ["Mortgage calculator", "mortgage"]],
  ]
  return (
    <footer className="mt-auto border-t border-border print:hidden">
      <div className={cn(WRAP, "grid gap-8 py-10 md:grid-cols-[1.4fr_1.2fr_repeat(3,1fr)] md:items-start")}>
        <Link href={to(base)} className="dc-h text-[28px] leading-none italic">
          {BRAND.private}
        </Link>
        <p className="text-[14px] text-muted-foreground">
          {BRAND.address}
          <br />
          {BRAND.phone}
        </p>
        {cols.map((links, i) => (
          <ul key={i} className="grid gap-1.5 text-[14px]">
            {links.map(([label, path]) => (
              <li key={label}>
                <Link href={to(base, path)} className="text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <p className={cn(WRAP, "pb-8 text-[13px] text-muted-foreground")}>
        © {new Date().getFullYear()} {BRAND.private} · {BRAND.license}
      </p>
    </footer>
  )
}

/** Header, page, footer, in the variant's look. */
export function PageFrame({ base, variant, current, children }: { base: string; variant: Variant; current: PageId; children: ReactNode }) {
  return (
    <>
      {variant === "boutique" ? <BoutiqueHeader base={base} current={current} /> : <PlatformHeader base={base} current={current} />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {variant === "boutique" ? <BoutiqueFooter base={base} /> : <PlatformFooter base={base} />}
    </>
  )
}

/** The heading an inner page opens with. */
export function PageIntro({ title, lead, children, className }: { title: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn(WRAP, "pt-10 pb-8 sm:pt-14 sm:pb-10", className)}>
      <h1 className="re-rise dc-h max-w-[18em] text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">{title}</h1>
      {lead ? <p className="re-rise mt-4 max-w-[40em] text-[18px] leading-relaxed text-muted-foreground">{lead}</p> : null}
      {children}
    </section>
  )
}
