"use client"

// A navbar with a mega menu: Product opens a wide panel of features in two columns beside a
// highlighted card, Resources opens a shorter list. Each opens on hover, click, Enter or Space, only
// one at a time, and Escape closes it with focus back on its trigger. On phones they fold into an
// accordion in a sheet.
import * as React from "react"
import {
  ArrowRight,
  BellRing,
  BookOpen,
  ChartColumn,
  ChevronDown,
  Clock,
  FileText,
  LayoutTemplate,
  LifeBuoy,
  Menu,
  Newspaper,
  Orbit,
  Plug,
  Repeat,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type Feature = { icon: LucideIcon; title: string; line: string; href: string }

const PRODUCT: { heading: string; items: Feature[] }[] = [
  {
    heading: "Get paid",
    items: [
      { icon: FileText, title: "Invoices", line: "Branded invoices in a minute, in 30 currencies.", href: "#invoices" },
      { icon: Wallet, title: "Payments", line: "Cards, bank transfer and payment links.", href: "#payments" },
      { icon: BellRing, title: "Reminders", line: "Polite follow-ups that go out on time.", href: "#reminders" },
    ],
  },
  {
    heading: "Run your studio",
    items: [
      { icon: Repeat, title: "Recurring billing", line: "Retainers that bill themselves each month.", href: "#recurring" },
      { icon: Clock, title: "Time tracking", line: "Log hours, then turn them into an invoice.", href: "#time" },
      { icon: ChartColumn, title: "Reports", line: "Cash flow, late payers and tax totals.", href: "#reports" },
    ],
  },
]

const RESOURCES: Feature[] = [
  { icon: BookOpen, title: "Guides", line: "Step-by-step help for your first month.", href: "#guides" },
  { icon: LayoutTemplate, title: "Invoice templates", line: "Twelve layouts to make your own.", href: "#templates" },
  { icon: Newspaper, title: "Journal", line: "Notes on pricing and getting paid.", href: "#journal" },
  { icon: LifeBuoy, title: "Help center", line: "Answers, or a person within a day.", href: "#help" },
]

const LINKS = [
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
const topLink = cn(
  "inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground",
  focusRing,
)

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

function FeatureLink({ item, onNavigate }: { item: Feature; onNavigate?: () => void }) {
  return (
    <a href={item.href} onClick={onNavigate} className={cn("group/feature flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted focus-visible:bg-muted", focusRing)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors group-hover/feature:text-foreground">
        <item.icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{item.title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{item.line}</span>
      </span>
    </a>
  )
}

/** One top-level menu: a trigger that opens a panel on hover, click, Enter or Space. */
function NavMenu({
  label,
  open,
  onOpenChange,
  className,
  children,
}: {
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  children: (close: () => void) => React.ReactNode
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger openOnHover delay={60} closeDelay={120} className={topLink}>
        {label}
        <ChevronDown className="size-3.5 transition-transform duration-200 in-data-popup-open:rotate-180" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={14} aria-label={label} className={cn("gap-0 overflow-hidden p-0", className)}>
        {children(() => onOpenChange(false))}
      </PopoverContent>
    </Popover>
  )
}

function ProductPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="grid gap-2 p-3 md:grid-cols-[1fr_1fr_15rem]">
        {PRODUCT.map((col) => (
          <div key={col.heading}>
            <p className="px-2.5 pt-1 pb-1.5 text-xs font-medium text-muted-foreground">{col.heading}</p>
            <ul className="grid">
              {col.items.map((item) => (
                <li key={item.href}>
                  <FeatureLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <a
          href="#reminders"
          onClick={onNavigate}
          className={cn("group/card flex flex-col gap-3 rounded-lg bg-muted p-4 transition-colors hover:bg-accent", focusRing)}
        >
          <Badge>New</Badge>
          <span>
            <span className="block text-sm font-semibold text-foreground">Reminders that sound like you</span>
            <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">Orbit drafts each follow-up in your tone. You approve it before it goes.</span>
          </span>
          <span aria-hidden="true" className="rounded-md border border-border bg-background p-3 text-xs leading-relaxed text-muted-foreground shadow-sm">
            <span className="block font-medium text-foreground">To Tom Okafor</span>
            Hi Tom, a quick nudge on <span className="whitespace-nowrap">INV-1042</span> for $1,860.00, due Friday. Thanks again for the project!
          </span>
          <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-foreground">
            See how it works <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5" aria-hidden="true" />
          </span>
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border bg-muted/50 px-5 py-3 text-[13px]">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Plug className="size-4 shrink-0" aria-hidden="true" />
          Connects to your bank and your accountant&apos;s software.
        </span>
        <span className="flex gap-4">
          <a href="#integrations" onClick={onNavigate} className={cn("rounded-sm font-medium underline-offset-4 hover:underline", focusRing)}>
            Browse integrations
          </a>
          <a href="#features" onClick={onNavigate} className={cn("inline-flex items-center gap-1 rounded-sm font-medium underline-offset-4 hover:underline", focusRing)}>
            All features <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </span>
      </div>
    </>
  )
}

function ResourcesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <ul className="grid gap-0.5 p-3">
        {RESOURCES.map((item) => (
          <li key={item.href}>
            <FeatureLink item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
      <div className="border-t border-border bg-muted/50 px-5 py-3 text-[13px] text-muted-foreground">
        Stuck?{" "}
        <a href="#contact" onClick={onNavigate} className={cn("rounded-sm font-medium text-foreground underline-offset-4 hover:underline", focusRing)}>
          Write to a person
        </a>
        , we reply within a day.
      </div>
    </>
  )
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)
  const sections = [
    { value: "product", label: "Product", items: PRODUCT.flatMap((c) => c.items) },
    { value: "resources", label: "Resources", items: RESOURCES },
  ]
  return (
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
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-2">
          <Accordion>
            {sections.map((s) => (
              <AccordionItem key={s.value} value={s.value}>
                <AccordionTrigger className="py-3 text-base hover:no-underline">{s.label}</AccordionTrigger>
                <AccordionContent className="[&_a]:no-underline">
                  <ul className="grid gap-0.5 pb-1">
                    {s.items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} onClick={close} className={cn("flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted", focusRing)}>
                          <item.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <ul className="border-t border-border pt-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close} className={cn("flex h-12 items-center rounded-md text-base font-medium hover:underline", focusRing)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="border-t border-border">
          <Button variant="outline" size="lg" nativeButton={false} render={<a href="#sign-in" onClick={close} />}>
            Sign in
          </Button>
          <Button size="lg" nativeButton={false} render={<a href="#start" onClick={close} />}>
            Start free trial
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function MegaMenuNavbar() {
  // One menu open at a time, so moving between Product and Resources swaps the panels.
  const [menu, setMenu] = React.useState<"product" | "resources" | null>(null)
  const control = (id: "product" | "resources") => ({
    open: menu === id,
    onOpenChange: (next: boolean) => setMenu((m) => (next ? id : m === id ? null : m)),
  })

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
            <li>
              <NavMenu label="Product" {...control("product")} className="w-[min(50rem,calc(100vw-2rem))]">
                {(close) => <ProductPanel onNavigate={close} />}
              </NavMenu>
            </li>
            <li>
              <NavMenu label="Resources" {...control("resources")} className="w-[min(23rem,calc(100vw-2rem))]">
                {(close) => <ResourcesPanel onNavigate={close} />}
              </NavMenu>
            </li>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={topLink}>
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
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default function NavbarMegaMenu() {
  return (
    <div className="w-full bg-background text-foreground">
      <MegaMenuNavbar />
      <div id="content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 outline-none sm:px-6 sm:py-20">
        <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Everything a small studio needs to get paid</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Invoices, reminders, payments and the reports your accountant asks for, in one calm place. Open the Product menu to see it all.
        </p>
      </div>
    </div>
  )
}
