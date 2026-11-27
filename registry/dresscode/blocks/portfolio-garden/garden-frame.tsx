import Link from "next/link"

import { PERSON } from "../portfolio/data"
import { to } from "../portfolio/site"
import { ModeToggle, NewsletterForm } from "../portfolio/ui"

import { ISSUE } from "./garden-data"

export { GardenLeaf } from "./garden-leaf"

const wrap = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10"
const navLink = "rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-current"

export function GardenHeader({ base, home = false }: { base: string; home?: boolean }) {
  const links = [
    ["Essays", home ? "#essays" : to(base, "writing")],
    ["Notes", home ? "#garden" : to(base) + "#garden"],
    ["Work", home ? "#work" : to(base, "work")],
    ["About", to(base, "about")],
    ...(home ? [["Now", to(base, "now")], ["Subscribe", "#subscribe"]] : []),
  ]
  return (
    <header className={wrap + " print:hidden"}>
      <a href="#main" className="sr-only z-50 rounded-sm bg-background p-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">Skip to content</a>
      {home ? (
        <div className="relative py-4 text-center sm:pt-5 sm:pb-4">
          <h1 className="dc-h px-9 text-[clamp(2.4rem,6.8vw,6.2rem)] leading-none italic">{PERSON.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:text-xl">Essays, notes and work from {PERSON.city} · {ISSUE}</p>
          <ModeToggle className="absolute top-3 right-0" />
        </div>
      ) : null}
      <div className={home ? "border-y border-border" : "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border py-2 md:py-3"}>
        {home ? null : <Link href={to(base)} className="dc-h text-[clamp(1.75rem,3.2vw,3.2rem)] leading-none italic">{PERSON.name}</Link>}
        <nav aria-label="Portfolio" className={home ? "flex flex-wrap items-center justify-center gap-x-[clamp(1rem,5.4vw,5.3rem)] gap-y-2 py-3 text-sm sm:text-base lg:text-lg" : "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:gap-x-7 sm:text-base"}>
          {links.map(([label, href]) => <Link key={label} href={href} className={navLink}>{label}</Link>)}
          {home ? null : <ModeToggle />}
        </nav>
      </div>
    </header>
  )
}

export function GardenNewsletter() {
  return (
    <section id="subscribe" aria-labelledby="garden-newsletter" className="dc-band scroll-mt-3 print:hidden">
      <div className={wrap + " grid items-center gap-x-7 gap-y-3 py-6 lg:grid-cols-[auto_1fr_minmax(300px,0.95fr)]"}>
        <h2 id="garden-newsletter" className="dc-h text-[clamp(1.8rem,3.1vw,3rem)] leading-none italic">Get the next issue</h2>
        <p className="text-sm lg:border-l lg:border-[var(--dc-band-edge)] lg:pl-7">One letter a month. Essays first, notes after.</p>
        <NewsletterForm placeholder="Your email" confirmation="Thanks for trying the newsletter preview." className="w-full max-w-none [&_input]:min-w-0 [&_input]:bg-[var(--dc-surface)] [&_input]:text-[var(--dc-ink)] [&_input]:placeholder:text-[var(--dc-muted)]" />
      </div>
    </section>
  )
}

export function GardenFooter({ base }: { base: string }) {
  const columns = [
    [["Essays", to(base, "writing")], ["Notes", to(base) + "#garden"], ["Work", to(base, "work")]],
    [["About", to(base, "about")], ["Now", to(base, "now")], ["Uses", to(base, "uses")]],
    [["RSS", to(base, "feed.xml")], ["Email", "mailto:" + PERSON.email], ["Résumé", to(base, "resume")]],
  ]
  return (
    <footer className={wrap + " grid grid-cols-3 print:hidden gap-x-5 gap-y-4 py-6 text-sm sm:grid-cols-[1fr_repeat(3,minmax(4rem,0.18fr))]"}>
      <p className="col-span-3 text-muted-foreground sm:col-span-1"><span className="hidden [[data-pf-theme=matcha]_&]:inline">Set in Fraunces and Instrument Sans.<br /></span>Written and built in {PERSON.city}.</p>
      {columns.map((links) => <ul key={links[0][0]} className="space-y-1">{links.map(([label, href]) => (
        <li key={label}>{label === "RSS" || label === "Email"
          ? <a href={href} className="text-[var(--dc-accent)] underline underline-offset-2">{label}</a>
          : <Link href={href} className="text-[var(--dc-accent)] underline underline-offset-2">{label}</Link>}</li>
      ))}</ul>)}
    </footer>
  )
}
