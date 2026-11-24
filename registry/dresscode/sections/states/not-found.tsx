"use client"

// 404: a big 404 in the theme's display face, one line on what happened, a search that finds the page
// you were after as you type, the way back home and a few useful places. Replace PAGES with your own
// routes (or point the search at your site search).
import { ArrowLeft, ArrowRight, BookOpen, FileText, LifeBuoy, Search, Users, Wallet } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PAGES = [
  { title: "Invoices", body: "Every invoice, by status", href: "#invoices" },
  { title: "New invoice", body: "Bill a client in a minute", href: "#new-invoice" },
  { title: "Clients", body: "Who you bill, with their history", href: "#clients" },
  { title: "Payments", body: "Money in and payouts to your bank", href: "#payments" },
  { title: "Reminder plans", body: "When and how Orbit nudges late payers", href: "#reminders" },
  { title: "Reports", body: "Revenue, tax and what is still out", href: "#reports" },
  { title: "Settings", body: "Your business details, logo and bank", href: "#settings" },
  { title: "Export for your accountant", body: "Help article", href: "#help-export" },
  { title: "Refund a payment", body: "Help article", href: "#help-refunds" },
]

const LINKS = [
  { icon: FileText, title: "Invoices", body: "Every invoice, by status", href: "#invoices" },
  { icon: Users, title: "Clients", body: "Who you bill", href: "#clients" },
  { icon: Wallet, title: "Payments", body: "Money in and payouts", href: "#payments" },
  { icon: BookOpen, title: "Help center", body: "Guides and answers", href: "#help" },
]

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

export default function StatesNotFound() {
  const id = useId()
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()
  const found = query ? PAGES.filter((p) => `${p.title} ${p.body}`.toLowerCase().includes(query)).slice(0, 5) : []

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[780px] flex-col bg-background">
      <header className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#home" className={`rounded-[2px] ${focus}`} aria-label="Orbit home">
          <Logo />
        </a>
        <a href="#support" className={`inline-flex items-center gap-1.5 rounded-[2px] text-[14px] font-medium text-muted-foreground hover:text-foreground ${focus}`}>
          <LifeBuoy className="size-4" aria-hidden="true" /> Contact support
        </a>
      </header>

      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:px-8">
        <h1 id={`${id}-title`}>
          <span aria-hidden="true" className="dc-h block text-[112px] leading-[0.9] tracking-tight sm:text-[168px]">
            4<span className="text-[color:var(--dc-accent)]">0</span>4
          </span>
          <span className="sr-only">Error 404: </span>
          <span className="dc-h mt-6 block text-[28px] leading-[1.15] sm:text-[34px]">We can&rsquo;t find that page</span>
        </h1>
        <p className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-muted-foreground">
          The link may be old, or the page was moved. Search for it, or head back to your overview.
        </p>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-8 w-full max-w-[440px] text-left">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search Orbit"
            aria-controls={`${id}-results`}
            placeholder="Search pages and help, like “payments”"
            className="h-11 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
        </form>
        <div id={`${id}-results`} aria-live="polite" className="w-full max-w-[440px]">
          {query ? (
            <div className="dc-card mt-2 p-1.5 text-left">
              {found.length ? (
                <ul>
                  {found.map((p) => (
                    <li key={p.href}>
                      <a href={p.href} className={`flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 hover:bg-muted ${focus}`}>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-medium">{p.title}</span>
                          <span className="block truncate text-[12px] text-muted-foreground">{p.body}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2.5 text-[14px] text-muted-foreground">
                  Nothing for &ldquo;{q.trim()}&rdquo;. Try a page name, like invoices or reports.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button className="h-10 px-5 font-semibold" nativeButton={false} render={<a href="#home" />}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Back home
          </Button>
          <Button variant="outline" className="h-10 px-4" nativeButton={false} render={<a href="#report-link" />}>
            Report a broken link
          </Button>
        </div>

        <nav aria-label="Useful places" className="mt-12 w-full max-w-[520px]">
          <ul className="grid gap-2 text-left sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.title} className="flex">
                <a
                  href={l.href}
                  className={`group flex w-full items-center gap-3 rounded-[calc(var(--radius)+2px)] border border-border p-3 transition-colors hover:bg-muted motion-reduce:transition-none ${focus}`}
                >
                  <span className="dc-icon size-9 shrink-0">
                    <l.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold">{l.title}</span>
                    <span className="block text-[12px] text-muted-foreground">{l.body}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
