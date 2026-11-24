"use client"

// Announcement bar and the top navigation: a Product menu with features and a highlight card,
// plain links, sign in and the main call to action; a sheet menu on phones.
import { ArrowRight, BellRing, ChevronDown, FileText, Globe, Menu, Receipt, Repeat, Sparkles, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { Container, Logo } from "./shared"

const PRODUCT = [
  { icon: FileText, title: "Invoices", body: "Send a branded invoice in a minute." },
  { icon: BellRing, title: "Reminders", body: "Polite follow-ups that go out on time." },
  { icon: Wallet, title: "Payments", body: "Cards, bank transfer and payment links." },
  { icon: Repeat, title: "Recurring billing", body: "Retainers that bill themselves." },
  { icon: Receipt, title: "Expenses", body: "Snap receipts and rebill clients." },
  { icon: Globe, title: "Multi-currency", body: "Bill in 30 currencies, get paid in yours." },
]
const LINKS = ["Pricing", "Customers", "Docs"]

export function AnnouncementBar({ onBand = false }: { onBand?: boolean }) {
  return (
    <div className={cn("border-b border-border text-sm", onBand ? "dc-band" : "bg-[color:color-mix(in_oklab,var(--dc-ink)_3%,var(--background))]")}>
      <Container className="flex h-10 items-center justify-center gap-2">
        <Sparkles className="size-3.5 shrink-0 text-[color:var(--dc-accent)] in-[.dc-band]:text-current" aria-hidden="true" />
        <span className="truncate">
          <span className="font-semibold">New:</span> reminders now write in your own tone.
        </span>
        <a href="#features" className="hidden shrink-0 items-center gap-1 font-semibold underline-offset-4 hover:underline sm:inline-flex">
          Read the update <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </Container>
    </div>
  )
}

function ProductMenu() {
  return (
    <Popover>
      <PopoverTrigger
        render={<button type="button" />}
        className="inline-flex h-9 items-center gap-1 rounded-[var(--radius)] px-3 text-[15px] text-foreground/80 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 data-popup-open:text-foreground"
      >
        Product <ChevronDown className="size-3.5 transition-transform in-data-popup-open:rotate-180" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={10} className="dc-card w-[640px] max-w-[calc(100vw-2rem)] p-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <ul className="grid gap-1 sm:grid-cols-2">
            {PRODUCT.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <a href="#features" className="flex gap-3 rounded-[var(--radius)] p-2.5 transition-colors hover:bg-muted">
                  <span className="dc-icon size-8 shrink-0">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="block text-[13px] leading-snug text-muted-foreground">{body}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#reminders" className="dc-band flex flex-col justify-between rounded-[calc(var(--radius)+2px)] p-4">
            <span className="dc-pill w-fit bg-[color:var(--background)] text-[color:var(--dc-ink)]">New</span>
            <span>
              <span className="dc-h block text-[17px] leading-snug">Reminders in your own words</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold">
                See how it works <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function Navbar({ onBand = false }: { onBand?: boolean }) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-border backdrop-blur-md", onBand ? "dc-band bg-[color:color-mix(in_oklab,var(--dc-band)_92%,transparent)]" : "bg-[color:color-mix(in_oklab,var(--background)_88%,transparent)]")}>
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <a href="#top" aria-label="Orbit home">
            <Logo />
          </a>
          <nav aria-label="Main" className="hidden items-center md:flex">
            <ProductMenu />
            {LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="inline-flex h-9 items-center rounded-[var(--radius)] px-3 text-[15px] text-foreground/80 transition-colors hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a href="#signin" className="hidden px-2 text-[15px] font-medium sm:inline">
            Sign in
          </a>
          <Button size="lg" className="h-9 px-4 text-[14px] font-semibold">
            Start free
          </Button>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="dc-flat md:hidden" aria-label="Open menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <nav aria-label="Mobile" className="mt-6 grid gap-1 text-[16px]">
                {["Product", ...LINKS, "Sign in"].map((l) => (
                  <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="rounded-[var(--radius)] px-3 py-2.5 hover:bg-muted">
                    {l}
                  </a>
                ))}
              </nav>
              <Button size="lg" className="mt-4 h-11 w-full text-[15px] font-semibold">
                Start free
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
