"use client"

// A centered navbar: the logo sits in the middle with links split to its left and right, and the
// call to action at the far right. On phones the menu button moves to the left and opens a sheet
// from that side; the logo stays centered.
import * as React from "react"
import { ArrowRight, Menu, Orbit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const LEFT = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
]
const RIGHT = [
  { label: "Journal", href: "#journal" },
  { label: "Help", href: "#help" },
]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
const linkClass = cn(
  "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground decoration-primary decoration-2 underline-offset-[10px] transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline",
  focusRing,
)

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-lg font-semibold tracking-tight", className)}>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Orbit className="size-4.5" aria-hidden="true" />
      </span>
      Orbit
    </span>
  )
}

function NavLinks({ links, current }: { links: typeof LEFT; current: string }) {
  return (
    <ul className="flex items-center gap-1">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} aria-current={link.href === current ? "page" : undefined} className={linkClass}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function MobileMenu({ current }: { current: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="-ml-2 md:hidden" aria-label="Open menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <Logo className="text-base" />
          </SheetTitle>
          <SheetDescription className="sr-only">Pages on the Orbit site</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          {[LEFT, RIGHT].map((group, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <Separator className="my-2" /> : null}
              <ul className="grid gap-1">
                {group.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={link.href === current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex h-11 items-center justify-between rounded-md px-3 text-base font-medium transition-colors hover:bg-muted aria-[current=page]:bg-muted",
                        focusRing,
                      )}
                    >
                      {link.label}
                      {link.href === current ? <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" /> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </nav>
        <SheetFooter className="border-t border-border">
          <Button variant="outline" size="lg" nativeButton={false} render={<a href="#sign-in" onClick={() => setOpen(false)} />}>
            Sign in
          </Button>
          <Button size="lg" nativeButton={false} render={<a href="#demo" onClick={() => setOpen(false)} />}>
            Book a demo
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function CenteredNavbar({ current = "#features" }: { current?: string }) {
  return (
    <header className="relative border-b border-border bg-background">
      <a
        href="#content"
        className={cn(
          "sr-only rounded-md bg-background px-3 py-2 text-sm font-medium shadow-md ring-1 ring-border focus:not-sr-only focus:absolute focus:px-3 focus:py-2 focus:top-3 focus:left-3 focus:z-50",
          focusRing,
        )}
      >
        Skip to content
      </a>
      {/* One nav landmark for both halves, so screen readers hear the links as one list of places. */}
      <nav aria-label="Main" className="mx-auto grid h-18 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center">
          <MobileMenu current={current} />
          <div className="hidden md:block">
            <NavLinks links={LEFT} current={current} />
          </div>
        </div>

        <a href="#top" aria-label="Orbit home" className={cn("rounded-full", focusRing)}>
          <Logo />
        </a>

        <div className="flex items-center justify-end gap-1">
          <div className="hidden md:block">
            <NavLinks links={RIGHT.slice(0, 1)} current={current} />
          </div>
          <div className="hidden lg:block">
            <NavLinks links={RIGHT.slice(1)} current={current} />
          </div>
          <a href="#sign-in" className={cn(linkClass, "-mr-2 md:mr-0")}>
            Sign in
          </a>
          <Button size="lg" variant="outline" className="ml-2 hidden px-3.5 md:inline-flex" nativeButton={false} render={<a href="#demo" />}>
            Book a demo
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default function NavbarCentered() {
  return (
    <div className="w-full bg-background text-foreground">
      <CenteredNavbar />
      <div id="content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-14 text-center outline-none sm:px-6 sm:py-20">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Invoicing that feels like part of the studio</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Your logo, your words, your currency. Orbit sends the invoice, follows up when it is late and tells you the moment it is paid.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="px-4" nativeButton={false} render={<a href="#start" />}>
            Start free trial
          </Button>
          <Button size="lg" variant="ghost" className="px-4" nativeButton={false} render={<a href="#tour" />}>
            Take the tour <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
