"use client"

// A dismissible announcement bar above a sticky navbar. The navbar starts transparent over the hero
// and turns solid with a border and a soft shadow once it sticks to the top of the window.
// Dismissing the bar moves focus to the logo, so keyboard users are not left on a removed button.
import * as React from "react"
import { ArrowRight, BellRing, FileText, Menu, Orbit, Sparkles, Wallet, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
  { label: "Changelog", href: "#changelog" },
]

const FEATURES = [
  { icon: FileText, title: "Invoices in a minute", body: "Your logo, your words and 30 currencies. Duplicate last month's invoice and change two numbers." },
  { icon: BellRing, title: "Reminders that sound like you", body: "Orbit drafts each follow-up in your tone and waits for your approval before it goes." },
  { icon: Wallet, title: "Paid the way clients like", body: "Cards, bank transfer and payment links, with the money in your account in two days." },
]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function Logo() {
  return (
    <span className="flex items-center gap-2 text-base font-semibold tracking-tight">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Orbit className="size-4" aria-hidden="true" />
      </span>
      Orbit
    </span>
  )
}

export function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <section aria-label="Announcement" className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-10 max-w-6xl items-center justify-center gap-2.5 py-2 pr-12 pl-4 text-sm sm:px-12">
        <Sparkles className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />
        <p className="text-pretty sm:text-center">
          <span className="font-semibold">New:</span> reminders now write in your own tone.{" "}
          <a
            href="#update"
            className="inline-flex items-center gap-1 rounded-sm font-semibold whitespace-nowrap underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-3 focus-visible:ring-primary-foreground/60"
          >
            Read the update <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss announcement"
        onClick={onDismiss}
        className="absolute top-1/2 right-2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/50"
      >
        <X />
      </Button>
    </section>
  )
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">Pages on the Orbit site</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("flex h-11 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-muted", focusRing)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="border-t border-border">
          <Button variant="outline" size="lg" nativeButton={false} render={<a href="#sign-in" onClick={() => setOpen(false)} />}>
            Sign in
          </Button>
          <Button size="lg" nativeButton={false} render={<a href="#start" onClick={() => setOpen(false)} />}>
            Start free trial
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AnnouncementNavbar() {
  const [showBar, setShowBar] = React.useState(true)
  const [stuck, setStuck] = React.useState(false)
  const sentinel = React.useRef<HTMLDivElement>(null)
  const logo = React.useRef<HTMLAnchorElement>(null)

  // The sentinel sits right above the header: once it scrolls out of view, the header is stuck.
  React.useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {showBar ? (
        <AnnouncementBar
          onDismiss={() => {
            // Keep it closed across visits by storing the announcement's id in a cookie or localStorage.
            setShowBar(false)
            logo.current?.focus()
          }}
        />
      ) : null}
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <header
        data-stuck={stuck || undefined}
        className={cn(
          "sticky top-0 z-40 -mt-px border-b border-transparent transition-[background-color,border-color,box-shadow] duration-200",
          "data-stuck:border-border data-stuck:bg-background/95 data-stuck:shadow-sm data-stuck:backdrop-blur-md",
        )}
      >
        <a
          href="#content"
          className={cn(
            "sr-only rounded-md bg-background px-3 py-2 text-sm font-medium shadow-md ring-1 ring-border focus:not-sr-only focus:absolute focus:px-3 focus:py-2 focus:top-3 focus:left-3 focus:z-50",
            focusRing,
          )}
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <a ref={logo} href="#top" aria-label="Orbit home" className={cn("justify-self-start rounded-md", focusRing)}>
            <Logo />
          </a>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn("inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", focusRing)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-self-end">
            <Button variant="ghost" size="lg" className="hidden px-3 lg:inline-flex" nativeButton={false} render={<a href="#sign-in" />}>
              Sign in
            </Button>
            <Button size="lg" className="px-3.5" nativeButton={false} render={<a href="#start" />}>
              Start free trial
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  )
}

export default function NavbarAnnouncement() {
  return (
    <div className="w-full bg-background text-foreground">
      <AnnouncementNavbar />
      <div id="content" tabIndex={-1} className="outline-none">
        {/* The hero runs up behind the transparent header. */}
        <section className="-mt-16 bg-muted/60 pt-16">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Get paid without chasing anyone</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Orbit sends the invoice, follows up when it is late and tells you the moment it is paid. Scroll down and watch the navbar settle in.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="px-4" nativeButton={false} render={<a href="#start" />}>
                Start free trial
              </Button>
              <Button size="lg" variant="outline" className="px-4" nativeButton={false} render={<a href="#tour" />}>
                Take the tour
              </Button>
            </div>
          </div>
        </section>
        <section aria-labelledby="announcement-features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h3 id="announcement-features" className="font-heading text-xl font-semibold tracking-tight">
            Made for studios of one to twenty
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-xl border border-border bg-card p-5 text-card-foreground">
                <span className="flex size-9 items-center justify-center rounded-md border border-border bg-muted">
                  <f.icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <figure className="rounded-xl bg-muted/60 p-6 sm:p-8">
            <blockquote className="max-w-2xl text-lg leading-relaxed text-balance">
              &ldquo;We used to spend Friday afternoons chasing invoices. Now Orbit does it, politely, and we spend Fridays on the work.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">Ada Lin, founder of Halden Studio</figcaption>
          </figure>
        </section>
      </div>
    </div>
  )
}
