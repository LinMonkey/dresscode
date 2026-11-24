"use client"

// A navbar with search: a search button that shows its shortcut (Ctrl K, or ⌘K on a Mac; / works
// too) and opens a command dialog. Results are grouped, filter as you type, move with the arrow
// keys and open with Enter; with an empty query it offers recent searches. On phones the search
// becomes an icon button and the links move into a sheet.
import * as React from "react"
import {
  BellRing,
  Code,
  CornerDownLeft,
  CreditCard,
  FileText,
  Globe,
  History,
  KeyRound,
  LifeBuoy,
  Menu,
  Orbit,
  Repeat,
  Search,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const LINKS = [
  { label: "Getting started", href: "#getting-started" },
  { label: "Guides", href: "#guides" },
  { label: "API", href: "#api" },
  { label: "Changelog", href: "#changelog" },
]

type Result = { icon: LucideIcon; title: string; where: string; href: string; keywords?: string[] }

const RESULTS: { heading: string; items: Result[] }[] = [
  {
    heading: "Guides",
    items: [
      { icon: FileText, title: "Send your first invoice", where: "Getting started", href: "#first-invoice", keywords: ["create", "new", "bill"] },
      { icon: BellRing, title: "Set up automatic reminders", where: "Getting paid", href: "#reminders", keywords: ["late", "overdue", "follow up"] },
      { icon: CreditCard, title: "Accept card payments", where: "Getting paid", href: "#card-payments", keywords: ["stripe", "pay", "checkout"] },
      { icon: Repeat, title: "Bill a retainer every month", where: "Recurring billing", href: "#retainers", keywords: ["subscription", "recurring"] },
      { icon: Globe, title: "Invoice in another currency", where: "Invoices", href: "#currencies", keywords: ["euro", "exchange", "fx"] },
    ],
  },
  {
    heading: "API reference",
    items: [
      { icon: Code, title: "Create an invoice", where: "POST /v1/invoices", href: "#api-create-invoice" },
      { icon: Webhook, title: "Webhooks for paid invoices", where: "invoice.paid", href: "#api-webhooks", keywords: ["events", "notify"] },
      { icon: KeyRound, title: "API keys and scopes", where: "Authentication", href: "#api-keys", keywords: ["token", "secret"] },
    ],
  },
  {
    heading: "Help",
    items: [
      { icon: Sparkles, title: "What's new in November", where: "Changelog", href: "#changelog" },
      { icon: LifeBuoy, title: "Contact support", where: "A person replies within a day", href: "#contact", keywords: ["help", "email", "chat"] },
    ],
  },
]
const RECENT = ["Reminders", "API keys"]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

// ⌘ on Apple keyboards, Ctrl everywhere else. Read on the client only, so the server render says Ctrl.
const subscribeNever = () => () => {}
function useIsMac() {
  return React.useSyncExternalStore(
    subscribeNever,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => false,
  )
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-base font-semibold tracking-tight">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Orbit className="size-4" aria-hidden="true" />
      </span>
      Orbit
      <span className="font-normal text-muted-foreground">Help</span>
    </span>
  )
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = React.useState("")
  const go = (href: string) => {
    onOpenChange(false)
    setQuery("")
    window.location.hash = href
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setQuery("")
      }}
      title="Search the help center"
      description="Find guides, API reference and answers."
      className="top-4 sm:top-[12vh] sm:max-w-xl"
    >
      <Command loop>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search guides, API and answers" aria-label="Search the help center" />
        <CommandList className="max-h-[min(22rem,calc(100svh-9rem))]">
          <CommandEmpty>
            <p>No results for &ldquo;{query}&rdquo;.</p>
            <button type="button" onClick={() => go("#contact")} className={cn("mt-2 rounded-sm font-medium underline underline-offset-4", focusRing)}>
              Ask a person instead
            </button>
          </CommandEmpty>
          {query ? null : (
            <>
              <CommandGroup heading="Recent searches">
                {RECENT.map((r) => (
                  <CommandItem key={r} value={`recent ${r}`} onSelect={() => setQuery(r)}>
                    <History className="text-muted-foreground" aria-hidden="true" />
                    {r}
                    <CommandShortcut className="tracking-normal">Search</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          {RESULTS.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.href} value={`${item.title} ${item.where}`} keywords={item.keywords} onSelect={() => go(item.href)} className="gap-3 py-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                    <item.icon aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.where}</span>
                  </span>
                  <CommandShortcut className="opacity-0 group-data-[selected=true]/command-item:opacity-100">
                    <CornerDownLeft className="size-3.5" aria-hidden="true" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex justify-end border-t border-border p-2 sm:hidden">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
        <div className="hidden items-center gap-4 border-t border-border px-3 py-2 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            to move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Enter</Kbd> to open
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Kbd>Esc</Kbd> to close
          </span>
        </div>
      </Command>
    </CommandDialog>
  )
}

function MobileMenu({ current }: { current: string }) {
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
          <SheetDescription className="sr-only">Sections of the help center</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn("flex h-11 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-muted aria-[current=page]:bg-muted", focusRing)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="border-t border-border">
          <Button variant="outline" size="lg" nativeButton={false} render={<a href="#contact" onClick={() => setOpen(false)} />}>
            Contact support
          </Button>
          <Button size="lg" nativeButton={false} render={<a href="#app" onClick={() => setOpen(false)} />}>
            Open Orbit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SearchNavbar({ current = "#guides" }: { current?: string }) {
  const [open, setOpen] = React.useState(false)
  const isMac = useIsMac()

  // Ctrl K / ⌘K toggles the dialog from anywhere; "/" opens it unless you are typing in a field.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      const el = e.target as HTMLElement | null
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
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
          <a href="#top" aria-label="Orbit help center home" className={cn("rounded-md", focusRing)}>
            <Logo />
          </a>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === current ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
                      // The current section gets a bar that sits on the header's bottom border.
                      "after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:rounded-full aria-[current=page]:after:bg-primary",
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
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-keyshortcuts={isMac ? "Meta+K /" : "Control+K /"}
              className={cn(
                "hidden h-9 w-56 items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex xl:w-64",
                focusRing,
              )}
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">Search help</span>
              <KbdGroup aria-hidden="true">
                <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
            <Button variant="ghost" size="icon-lg" className="sm:hidden" aria-label="Search help" onClick={() => setOpen(true)}>
              <Search className="size-5" />
            </Button>
            <Button size="lg" className="hidden px-3.5 sm:inline-flex" nativeButton={false} render={<a href="#app" />}>
              Open Orbit
            </Button>
            <MobileMenu current={current} />
          </div>
        </div>
      </header>
      {/* Outside the header, so the dialog's hidden title is not read as part of the banner. */}
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export default function NavbarSearch() {
  return (
    <div className="w-full bg-background text-foreground">
      <SearchNavbar />
      <div id="content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 outline-none sm:px-6 sm:py-20">
        <p className="text-sm font-medium text-muted-foreground">Guides</p>
        <h2 className="mt-2 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">How can we help?</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Step-by-step guides for invoices, reminders and payments, plus the full API reference. Press{" "}
          <Kbd className="align-middle">/</Kbd> to search from anywhere on this page.
        </p>
      </div>
    </div>
  )
}
