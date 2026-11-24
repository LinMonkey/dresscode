"use client"

// An app header: logo, breadcrumb to the current page, a search field that suggests invoices and
// clients as you type ("/" focuses it), a notifications popover with unread counts, tabs and
// mark-as-read, and a user menu. A row of section tabs sits below. On phones the sections and the
// search move into a sheet and the breadcrumb keeps its last two steps.
import * as React from "react"
import {
  Bell,
  BellOff,
  ChartColumn,
  CheckCheck,
  ClockAlert,
  CreditCard,
  FileText,
  History,
  Keyboard,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Orbit,
  Receipt,
  Search,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const SECTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Invoices", href: "#invoices", icon: FileText },
  { label: "Clients", href: "#clients", icon: Users },
  { label: "Expenses", href: "#expenses", icon: Receipt },
  { label: "Reports", href: "#reports", icon: ChartColumn },
  { label: "Settings", href: "#settings", icon: Settings },
]
const CURRENT = "#invoices"

type Hit = { title: string; meta: string; href: string; status?: "Sent" | "Paid" | "Draft" | "Overdue" }

const SEARCH: { heading: string; items: Hit[] }[] = [
  {
    heading: "Invoices",
    items: [
      { title: "INV-1043", meta: "Fernwood Studio · $4,200.00", status: "Sent", href: "#inv-1043" },
      { title: "INV-1042", meta: "Kato & Lee · $1,860.00", status: "Paid", href: "#inv-1042" },
      { title: "INV-1041", meta: "Marlow & Daughters · $640.00", status: "Draft", href: "#inv-1041" },
      { title: "INV-1036", meta: "Pellucid Health · $2,400.00", status: "Overdue", href: "#inv-1036" },
    ],
  },
  {
    heading: "Clients",
    items: [
      { title: "Fernwood Studio", meta: "2 open invoices", href: "#client-fernwood" },
      { title: "Kato & Lee", meta: "Paid up", href: "#client-kato-lee" },
      { title: "Marlow & Daughters", meta: "1 draft", href: "#client-marlow" },
      { title: "Pellucid Health", meta: "1 overdue", href: "#client-pellucid" },
    ],
  },
]
const RECENT = SEARCH[0].items.slice(0, 1).concat(SEARCH[1].items.slice(0, 1))

type Notification = {
  id: string
  who: string
  what: string
  detail: string
  time: string
  unread: boolean
  icon?: LucideIcon
  initials?: string
}

const NOTIFICATIONS: Notification[] = [
  { id: "n1", icon: CreditCard, who: "Kato & Lee", what: "paid INV-1042", detail: "$1,860.00 by card, 4 days after the reminder.", time: "10 min ago", unread: true },
  { id: "n2", initials: "TO", who: "Tom Okafor", what: "commented on INV-1043", detail: "“Can we split this into two payments?”", time: "1 hour ago", unread: true },
  { id: "n3", icon: ClockAlert, who: "INV-1036", what: "is 15 days overdue", detail: "The next reminder goes to Pellucid Health on Friday.", time: "3 hours ago", unread: true },
  { id: "n4", initials: "ML", who: "Maya Lindqvist", what: "joined Halden Studio", detail: "She can create and send invoices.", time: "Yesterday", unread: false },
  { id: "n5", icon: Landmark, who: "Your November payout", what: "is on its way", detail: "$12,480.00 to the account ending 4410.", time: "Nov 21", unread: false },
]

const focusRing = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
const go = (href: string) => {
  window.location.hash = href
}

function LogoMark() {
  return (
    <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <Orbit className="size-4.5" aria-hidden="true" />
    </span>
  )
}

/** Search as you type: suggestions open under the field, arrows move, Enter opens, Escape closes. */
function HeaderSearch({
  className,
  listClassName,
  openOnFocus = true,
  onNavigate,
}: {
  className?: string
  listClassName?: string
  /** Show recent items as soon as the field is focused. Off in the phone sheet, where focus can land there on open. */
  openOnFocus?: boolean
  onNavigate?: () => void
}) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const choose = (href: string) => {
    setOpen(false)
    setQuery("")
    inputRef.current?.blur()
    onNavigate?.()
    go(href)
  }

  return (
    <Command
      loop
      label="Search invoices and clients"
      className={cn("group/search relative h-auto overflow-visible rounded-none! bg-transparent p-0 **:data-[slot=command-input-wrapper]:p-0", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault()
          setOpen(false)
        } else if (!open && (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault()
          setOpen(true)
        }
      }}
    >
      <CommandInput
        ref={inputRef}
        data-header-search=""
        value={query}
        onValueChange={(v) => {
          setQuery(v)
          setOpen(true)
        }}
        onFocus={() => openOnFocus && setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Search invoices and clients"
        className="pr-7"
      />
      <Kbd aria-hidden="true" className="absolute top-1/2 right-1.5 -translate-y-1/2 bg-background group-focus-within/search:hidden">
        /
      </Kbd>
      <CommandList
        // Keep focus in the field while clicking a suggestion.
        onMouseDown={(e) => e.preventDefault()}
        className={cn(
          "absolute top-full z-50 mt-2 max-h-80 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
          !open && "hidden",
          listClassName,
        )}
      >
        {query ? null : (
          <CommandGroup heading="Recent">
            {RECENT.map((r) => (
              <CommandItem key={r.href} value={`recent ${r.title}`} onSelect={() => choose(r.href)}>
                <History className="text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{r.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.meta}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {query
          ? SEARCH.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem key={item.href} value={`${item.title} ${item.meta}`} onSelect={() => choose(item.href)}>
                    {group.heading === "Invoices" ? <FileText className="text-muted-foreground" aria-hidden="true" /> : <Users className="text-muted-foreground" aria-hidden="true" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{item.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
                    </span>
                    {item.status ? (
                      <CommandShortcut className="tracking-normal">
                        <Badge variant={item.status === "Overdue" ? "destructive" : item.status === "Paid" ? "secondary" : "outline"}>{item.status}</Badge>
                      </CommandShortcut>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          : null}
        {query ? (
          <CommandGroup forceMount>
            <CommandItem forceMount value="search-everywhere" onSelect={() => choose(`#search?q=${encodeURIComponent(query)}`)}>
              <Search className="text-muted-foreground" aria-hidden="true" />
              <span className="truncate">
                Search everything for <span className="font-medium">&ldquo;{query}&rdquo;</span>
              </span>
              <CommandShortcut className="tracking-normal">Enter</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        ) : null}
      </CommandList>
    </Command>
  )
}

function NotificationList({ items, onRead }: { items: Notification[]; onRead: (id: string) => void }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <BellOff className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-medium">You&apos;re all caught up</p>
        <p className="mt-1 text-[13px] text-balance text-muted-foreground">New payments, comments and late invoices show up here.</p>
      </div>
    )
  }
  return (
    <ul className="max-h-[min(20rem,calc(100svh-14rem))] divide-y divide-border overflow-y-auto">
      {items.map((n) => (
        <li key={n.id}>
          <button
            type="button"
            onClick={() => onRead(n.id)}
            className={cn("flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:bg-muted", "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset")}
          >
            {n.initials ? (
              <Avatar>
                <AvatarFallback className="text-xs">{n.initials}</AvatarFallback>
              </Avatar>
            ) : n.icon ? (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <n.icon className="size-4" aria-hidden="true" />
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block text-sm leading-snug">
                <span className="font-medium">{n.who}</span> <span className="text-muted-foreground">{n.what}</span>
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{n.detail}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{n.time}</span>
            </span>
            {n.unread ? (
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary">
                <span className="sr-only">Unread</span>
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}

function NotificationsMenu() {
  const [items, setItems] = React.useState(NOTIFICATIONS)
  const [tab, setTab] = React.useState<string>("all")
  const unread = items.filter((n) => n.unread).length
  const read = (id: string) => setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  const readAll = () => setItems((list) => list.map((n) => ({ ...n, unread: false })))

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="icon-lg" className="relative" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} />}>
        <Bell className="size-5" />
        {unread ? (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground ring-2 ring-background"
          >
            {unread}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[min(24rem,calc(100vw-1rem))] gap-0 p-0">
        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
          <PopoverTitle className="text-sm font-semibold">Notifications</PopoverTitle>
          <Button variant="ghost" size="xs" onClick={readAll} disabled={!unread}>
            <CheckCheck aria-hidden="true" /> Mark all as read
          </Button>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="gap-0">
          <TabsList variant="line" className="h-9 w-full justify-start rounded-none border-b border-border px-3">
            <TabsTrigger value="all" className="flex-none px-2">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-none px-2">
              Unread
              {unread ? (
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  {unread}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <NotificationList items={items} onRead={read} />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList items={items.filter((n) => n.unread)} onRead={read} />
          </TabsContent>
        </Tabs>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[13px]">
          <a href="#notification-settings" className={cn("rounded-sm text-muted-foreground hover:text-foreground", focusRing)}>
            Notification settings
          </a>
          <a href="#notifications" className={cn("rounded-sm font-medium underline-offset-4 hover:underline", focusRing)}>
            View all
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="Account menu for Ada Lin" />}>
        <Avatar>
          <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">AL</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2.5 px-2 py-2 text-foreground">
            <Avatar>
              <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">AL</AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">Ada Lin</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">ada@halden.studio</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => go("#profile")}>
            <User aria-hidden="true" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go("#settings")}>
            <Settings aria-hidden="true" /> Studio settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go("#billing")}>
            <CreditCard aria-hidden="true" /> Plan and billing
            <Badge variant="secondary" className="ml-auto">
              Studio
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => go("#shortcuts")}>
            <Keyboard aria-hidden="true" /> Keyboard shortcuts
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go("#help")}>
            <LifeBuoy aria-hidden="true" /> Help and support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => go("#sign-out")}>
          <LogOut aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false)
  // Focus the current section when the sheet opens, not the search field (that would pop up the keyboard).
  const currentLink = React.useRef<HTMLAnchorElement>(null)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="-ml-2 md:hidden" aria-label="Open navigation" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="gap-0" initialFocus={currentLink}>
        <SheetHeader className="flex-row items-center gap-3 border-b border-border">
          <span className="flex size-9 items-center justify-center rounded-md bg-muted text-sm font-semibold">H</span>
          <span>
            <SheetTitle>Halden Studio</SheetTitle>
            <SheetDescription className="text-xs">Studio plan · 4 members</SheetDescription>
          </span>
        </SheetHeader>
        <div className="p-3 pb-1">
          <HeaderSearch className="w-full" listClassName="inset-x-0" openOnFocus={false} onNavigate={() => setOpen(false)} />
        </div>
        <nav aria-label="Sections" className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-0.5">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a
                  ref={s.href === CURRENT ? currentLink : undefined}
                  href={s.href}
                  aria-current={s.href === CURRENT ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground",
                    focusRing,
                  )}
                >
                  <s.icon className="size-4" aria-hidden="true" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="flex-row items-center gap-3 border-t border-border">
          <Avatar>
            <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">AL</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">Ada Lin</span>
            <span className="block truncate text-xs text-muted-foreground">ada@halden.studio</span>
          </span>
          <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => go("#sign-out")}>
            <LogOut />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AppHeader() {
  // "/" jumps to the search field unless you are already typing somewhere.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
      if (e.key !== "/" || typing || e.metaKey || e.ctrlKey || e.altKey) return
      const field = [...document.querySelectorAll<HTMLInputElement>("[data-header-search]")].find((f) => f.getClientRects().length)
      if (!field) return
      e.preventDefault()
      field.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

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
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <MobileMenu />
        <a href="#overview" aria-label="Orbit dashboard" className={cn("shrink-0 rounded-md", focusRing)}>
          <LogoMark />
        </a>
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="#studio" className={cn("flex items-center gap-2 rounded-sm font-medium text-foreground", focusRing)}>
                <span className="flex size-5 items-center justify-center rounded bg-muted text-[11px] font-semibold" aria-hidden="true">
                  H
                </span>
                Halden Studio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="#invoices" className={cn("rounded-sm", focusRing)}>
                Invoices
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate font-medium">INV-1043</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-1">
          <HeaderSearch className="mr-2 hidden w-64 md:block lg:w-72" listClassName="right-0 w-[min(26rem,calc(100vw-2rem))]" />
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
      <nav aria-label="Sections" className="hidden px-4 sm:px-6 md:block">
        <ul className="-mb-px flex gap-1">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                aria-current={s.href === CURRENT ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full aria-[current=page]:after:bg-primary",
                  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default function NavbarAppHeader() {
  return (
    <div className="w-full bg-background text-foreground">
      <AppHeader />
      <div id="content" tabIndex={-1} className="px-4 py-8 outline-none sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">INV-1043</h2>
          <Badge variant="outline">Sent</Badge>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          $4,200.00 to Fernwood Studio, due December 8. Tom opened it twice, most recently yesterday at 4:12 PM.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => go("#remind")}>
            Send a reminder
          </Button>
          <Button onClick={() => go("#record-payment")}>Record a payment</Button>
        </div>
      </div>
    </div>
  )
}
