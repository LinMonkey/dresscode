"use client"

// A simple navbar: logo, four links, sign in and the main call to action. On phones the links,
// sign in and the call to action move into a sheet. The current page is marked with aria-current.
import * as React from "react"
import { ArrowRight, Menu, Orbit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
  { label: "Changelog", href: "#changelog" },
]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-base font-semibold tracking-tight", className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Orbit className="size-4" aria-hidden="true" />
      </span>
      Orbit
    </span>
  )
}

export function SimpleNavbar({ current = "#features" }: { current?: string }) {
  const [open, setOpen] = React.useState(false)

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
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="Orbit home" className={cn("rounded-md", focusRing)}>
          <Logo />
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground",
                    focusRing,
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="lg" className="hidden px-3 md:inline-flex" nativeButton={false} render={<a href="#sign-in" />}>
            Sign in
          </Button>
          <Button size="lg" className="px-3.5" nativeButton={false} render={<a href="#start" />}>
            Start free trial
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Open menu" />}>
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
                        aria-current={link.href === current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex h-11 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-muted aria-[current=page]:bg-muted",
                          focusRing,
                        )}
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
        </div>
      </div>
    </header>
  )
}

export default function NavbarSimple() {
  return (
    <div className="w-full bg-background text-foreground">
      <SimpleNavbar />
      <div id="content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 outline-none sm:px-6 sm:py-20">
        <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Invoices that get paid on time</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Send a branded invoice in a minute, let Orbit follow up politely, and get paid by card or bank transfer. Made for studios of one to twenty.
        </p>
        <a href="#features" className={cn("mt-6 inline-flex items-center gap-1 rounded-md text-sm font-medium underline-offset-4 hover:underline", focusRing)}>
          See every feature <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
