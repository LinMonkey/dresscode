// The frame every page sits in: the root (theme hooks, shared motion), the header, the footer with its
// call to action, and the title block inner pages open with. Server components; the interactive
// pieces come from header.tsx and ui.tsx.
import { ArrowUpRight, CalendarDays } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { Variant } from "./data"
import { PERSON } from "./data"
import { SiteHeader } from "./header"
import { coverCss, MORE, NAV, to, type PageId } from "./site"
import { CopyEmail, LocalTime, StatusDot } from "./ui"

export const WRAP = "mx-auto w-full max-w-[1200px] px-5 sm:px-8"

// Motion the pages share. Everything moves only when the visitor has not asked for less motion, and
// the scroll-linked pieces only where the browser has scroll timelines.
const CSS = `
.pf-progress { display: none; }
@media (prefers-reduced-motion: no-preference) {
  .pf-rise { animation: pf-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  .pf-word { display: inline-block; animation: pf-word 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  @supports (animation-timeline: view()) {
    .pf-grow { animation: pf-grow linear both; animation-timeline: view(); animation-range: entry 0% cover 38%; }
    .pf-progress { display: block; transform-origin: 0 50%; animation: pf-progress linear both; animation-timeline: scroll(root); }
  }
}
@keyframes pf-rise { from { opacity: 0; transform: translateY(18px); } }
@keyframes pf-word { from { opacity: 0; transform: translateY(0.4em); } }
@keyframes pf-grow { from { transform: scale(0.9); opacity: 0.4; } }
@keyframes pf-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
::view-transition-group(*) { animation-duration: 0.45s; animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1); }
@media print {
  @page { size: A4; margin: 14mm; }
  .pf-root { --background: #fff; --foreground: #111; --muted-foreground: #555; --border: #d4d4d4; --dc-surface: #fff; --dc-ink: #111; --dc-muted: #555; --dc-line: #d4d4d4; min-height: 0; background: #fff; color: #111; }
  .pf-root *, .pf-root *::before { animation: none !important; transition: none !important; box-shadow: none !important; }
}
`

/** The site's root: the theme's own tweaks (Pop's outlines, the sample covers' colors) and the motion. */
export function PortfolioRoot({ theme, brutal, children }: { theme?: string; brutal?: boolean; children: ReactNode }) {
  return (
    <div className={cn("pf-root dc-theme flex min-h-svh flex-col bg-background text-foreground", brutal && "dc-brutal")}>
      <style>{CSS + coverCss(theme)}</style>
      {children}
    </div>
  )
}

/** Header, page, footer. `cta={false}` drops the footer's call to action (the contact page has its own). */
export function PageFrame({ base, variant, current, cta = true, children }: { base: string; variant: Variant; current: PageId; cta?: boolean; children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <SiteHeader base={base} current={current} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter base={base} variant={variant} cta={cta} />
    </>
  )
}

/** The title block an inner page opens with. */
export function PageIntro({ title, lead, children, className }: { title: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn(WRAP, "pt-10 pb-14 sm:pt-16 sm:pb-20", className)}>
      <h1 className="dc-h pf-rise max-w-[960px] text-[44px] leading-[1.02] sm:text-[72px]">{title}</h1>
      {lead ? (
        <p className="pf-rise mt-6 max-w-[640px] text-[18px] leading-relaxed text-muted-foreground sm:text-[20px]" style={{ animationDelay: "90ms" }}>
          {lead}
        </p>
      ) : null}
      {children}
    </section>
  )
}

/** A section heading with an optional link on the right ("All posts →"). */
export function SectionHead({ id, title, link, className }: { id?: string; title: string; link?: { href: string; label: string }; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-4 pb-5", className)}>
      <h2 id={id} className="dc-h text-[28px] leading-tight sm:text-[34px]">
        {title}
      </h2>
      {link ? (
        <Link href={link.href} className="inline-flex shrink-0 items-center gap-1 text-[14px] text-muted-foreground transition-colors hover:text-foreground">
          {link.label} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  )
}

function EmailCta() {
  return (
    <div className={WRAP}>
      <div className="border-t border-border pt-16 pb-16 sm:pt-24 sm:pb-20">
        <p className="flex items-center gap-2.5 text-[15px] text-muted-foreground">
          <StatusDot /> {PERSON.available}. {PERSON.replies}
        </p>
        <a
          href={`mailto:${PERSON.email}`}
          className="dc-h mt-5 inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 text-[34px] leading-tight break-all transition-[background-size] duration-500 hover:bg-[length:100%_2px] sm:text-[64px] sm:break-normal"
        >
          {PERSON.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CopyEmail />
          <Button variant="ghost" size="lg" className="h-10 px-3.5" nativeButton={false} render={<a href={PERSON.calendar} />}>
            <CalendarDays className="size-4" aria-hidden="true" /> Book a call
          </Button>
        </div>
      </div>
    </div>
  )
}

function BandCta() {
  return (
    <div className={WRAP}>
      <div className="dc-band overflow-hidden rounded-[var(--dc-radius-card)] px-6 py-14 sm:px-12 sm:py-20">
        <p className="flex items-center gap-2.5 text-[15px] text-[color:var(--dc-band-muted)]">
          <StatusDot /> {PERSON.available}
        </p>
        <p className="dc-h mt-4 max-w-[760px] text-[36px] leading-[1.04] sm:text-[56px]">Send me the brief, or just the idea.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button size="lg" className="h-10 px-4" nativeButton={false} render={<a href={`mailto:${PERSON.email}`} />}>
            {PERSON.email}
          </Button>
          <CopyEmail className="bg-transparent" />
        </div>
      </div>
    </div>
  )
}

function FooterLinks({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[13px] text-muted-foreground">{title}</p>
      <ul className="mt-3 grid gap-2 text-[15px]">{children}</ul>
    </div>
  )
}

export function SiteFooter({ base, variant, cta = true }: { base: string; variant: Variant; cta?: boolean }) {
  return (
    <footer className="mt-24 sm:mt-32 print:hidden">
      {cta ? variant === "grid" ? <BandCta /> : <EmailCta /> : null}
      <div className={WRAP}>
        <div className={cn("grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]", (!cta || variant === "index") && "border-t border-border", variant === "grid" && cta && "mt-12")}>
          <div className="col-span-2 lg:col-span-1">
            <Link href={to(base)} className="dc-h text-[18px]">
              {PERSON.name}
            </Link>
            <p className="mt-1 max-w-[280px] text-[14px] leading-relaxed text-muted-foreground">
              {PERSON.role}, {PERSON.city}.
            </p>
          </div>
          <FooterLinks title="Pages">
            {NAV.map((n) => (
              <li key={n.path}>
                <Link href={to(base, n.path)} className="hover:underline hover:underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </FooterLinks>
          <FooterLinks title="More">
            {MORE.map((n) => (
              <li key={n.path}>
                <Link href={to(base, n.path)} className="hover:underline hover:underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </FooterLinks>
          <FooterLinks title="Elsewhere">
            {PERSON.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4">
                  {l.label} <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </a>
              </li>
            ))}
          </FooterLinks>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-[13px] text-muted-foreground">
          <span>© 2026 {PERSON.name}</span>
          <span>
            {PERSON.city}, <LocalTime /> local time
          </span>
        </div>
      </div>
    </footer>
  )
}
