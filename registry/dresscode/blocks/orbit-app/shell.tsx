"use client"

// The Orbit app shell: a grouped sidebar (workspace switcher, nav with counts, the Pro trial box) that
// folds to icons on desktop and becomes a sheet on phones; a top bar with the breadcrumb, search
// (Ctrl K / ⌘K opens the command palette), notifications and the user menu.
import {
  Bell,
  BellRing,
  ChartColumn,
  Check,
  ChevronsUpDown,
  CircleDollarSign,
  CreditCard,
  Eye,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Moon,
  Plus,
  Repeat,
  Search,
  Settings,
  Sun,
  TriangleAlert,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

import { CommandPalette } from "./command-palette"
import { OrbitProvider, useOrbit, useParam, type SharedDialog } from "./context"
import { CLIENTS, ME, NOTIFICATIONS, STATUS_COUNTS, WORKSPACES, clientById, type Notice } from "./data"
import { SharedDialogs } from "./dialogs"
import { setMode, useMode, type Mode } from "./mode"
import type { Screen } from "./screens"
import { Kbd, LogoMark, flat } from "./ui"

type NavItem = { screen: Screen; label: string; icon: typeof FileText; count?: number; also?: Screen[] }
const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Billing",
    items: [
      { screen: "overview", label: "Overview", icon: LayoutDashboard },
      { screen: "invoices", label: "Invoices", icon: FileText, count: STATUS_COUNTS.Draft + STATUS_COUNTS.Due + STATUS_COUNTS.Overdue, also: ["invoice", "invoice-new"] },
      { screen: "recurring", label: "Recurring", icon: Repeat },
      { screen: "payments", label: "Payments", icon: Wallet },
    ],
  },
  {
    label: "Business",
    items: [
      { screen: "clients", label: "Clients", icon: Users, count: CLIENTS.length, also: ["client"] },
      { screen: "reports", label: "Reports", icon: ChartColumn },
    ],
  },
  { label: "Workspace", items: [{ screen: "settings", label: "Settings", icon: Settings }] },
]

const activeItem =
  "data-active:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] data-active:font-semibold data-active:text-[color:var(--dc-accent)] data-active:hover:text-[color:var(--dc-accent)]"

const noop = () => () => {}
const useIsMac = () => useSyncExternalStore(noop, () => /Mac|iPhone|iPad/.test(navigator.platform), () => false)

export function AppShell({ base, screen, defaultMode = "light", children }: { base: string; screen: Screen; defaultMode?: Mode; children: ReactNode }) {
  const [palette, setPalette] = useState(false)
  const [dialog, setDialog] = useState<SharedDialog | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPalette((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const mode = useMode(defaultMode)
  const value = useMemo(() => ({ base, screen, openPalette: () => setPalette(true), openDialog: (d: SharedDialog) => setDialog(d) }), [base, screen])

  return (
    <OrbitProvider value={value}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <TopBar />
          <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pt-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette open={palette} onOpenChange={setPalette} />
      <SharedDialogs open={dialog} onOpenChange={(o) => !o && setDialog(null)} />
      <Toaster theme={mode} position="bottom-right" />
    </OrbitProvider>
  )
}

/** For the screens outside the app frame (sign in, sign up, 404): links and toasts, no sidebar. */
export function StandaloneShell({ base, screen, defaultMode = "light", children }: { base: string; screen: Screen; defaultMode?: Mode; children: ReactNode }) {
  const mode = useMode(defaultMode)
  const value = useMemo(() => ({ base, screen, openPalette: () => {}, openDialog: () => {} }), [base, screen])
  return (
    <OrbitProvider value={value}>
      {children}
      <Toaster theme={mode} position="bottom-right" />
    </OrbitProvider>
  )
}

function AppSidebar() {
  const { screen, href } = useOrbit()
  const { setOpenMobile } = useSidebar()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pt-4">
        <Link href={href("overview")} aria-label="Orbit overview" className="flex h-8 items-center gap-2 px-1.5 text-[17px] font-bold tracking-[-0.02em] group-data-[collapsible=icon]:px-1">
          <LogoMark />
          <span className="dc-h group-data-[collapsible=icon]:hidden">Orbit</span>
        </Link>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label} className="px-3 py-1.5">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const active = item.screen === screen || !!item.also?.includes(screen)
                return (
                  <SidebarMenuItem key={item.screen}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      className={cn("h-9 text-[14px] text-muted-foreground hover:text-foreground", activeItem)}
                      render={<Link href={href(item.screen)} onClick={() => setOpenMobile(false)} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.count ? <SidebarMenuBadge className="top-2 text-[12px] text-muted-foreground">{item.count}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <PlanBox />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function WorkspaceSwitcher() {
  const [current, setCurrent] = useState(WORKSPACES[0].id)
  const ws = WORKSPACES.find((w) => w.id === current) ?? WORKSPACES[0]
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="h-11 border border-sidebar-border bg-[color:var(--card)] data-popup-open:bg-sidebar-accent group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent"
              />
            }
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-[calc(var(--radius)-2px)] bg-primary text-[11px] font-bold text-primary-foreground">
              {ws.initials}
            </span>
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-[13px] font-semibold">{ws.name}</span>
              <span className="truncate text-[12px] text-muted-foreground">{ws.plan}</span>
            </span>
            <ChevronsUpDown className="ml-auto text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={current} onValueChange={(v) => setCurrent(String(v))}>
                {WORKSPACES.map((w) => (
                  <DropdownMenuRadioItem key={w.id} value={w.id} className="py-1.5">
                    <span className="grid size-6 place-items-center rounded-[calc(var(--radius)-3px)] bg-muted text-[10px] font-bold">{w.initials}</span>
                    <span className="grid leading-tight">
                      <span className="font-medium">{w.name}</span>
                      <span className="text-[12px] text-muted-foreground">{w.plan}</span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("New workspaces start on the Free plan.", { description: "Name it on the next screen." })}>
              <Plus /> Create a workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function PlanBox() {
  const { href } = useOrbit()
  return (
    <div className="rounded-[calc(var(--radius)+2px)] border border-sidebar-border bg-[color:var(--card)] p-3 text-[13px] group-data-[collapsible=icon]:hidden">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">Pro trial</p>
        <p className="text-[12px] text-muted-foreground">3 days left</p>
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">Keep reminders and payment links after Nov 27.</p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Trial used" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full w-[78%] rounded-full bg-primary" />
      </div>
      <Button size="sm" className="mt-3 h-8 w-full font-semibold" nativeButton={false} render={<Link href={href("settings", { tab: "billing" })} />}>
        Upgrade to Pro
      </Button>
    </div>
  )
}

function TopBar() {
  const { href, openPalette } = useOrbit()
  const isMac = useIsMac()
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-[color:color-mix(in_oklab,var(--background)_88%,transparent)] px-3 backdrop-blur-md sm:px-4 lg:px-6">
      <SidebarTrigger className={cn(flat, "-ml-1 text-muted-foreground")} />
      <Separator orientation="vertical" className="mr-1 h-5 data-vertical:self-center" />
      <Suspense fallback={<Crumbs />}>
        <CrumbsWithParams />
      </Suspense>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={openPalette}
          className="hidden h-8 w-60 items-center gap-2 rounded-[var(--radius)] border border-input bg-[color:var(--card)] pr-1.5 pl-2.5 text-[13px] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 md:flex"
        >
          <Search className="size-3.5" aria-hidden="true" />
          Search or jump to…
          <span className="ml-auto flex gap-0.5">
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <Button variant="ghost" size="icon" className={cn(flat, "text-muted-foreground md:hidden")} onClick={openPalette} aria-label="Search">
          <Search />
        </Button>
        <Notifications />
        <Button className="hidden h-8 px-3 font-semibold sm:inline-flex" nativeButton={false} render={<Link href={href("invoice-new")} />}>
          <Plus /> New invoice
        </Button>
        <Button size="icon" className="sm:hidden" nativeButton={false} render={<Link href={href("invoice-new")} aria-label="New invoice" />}>
          <Plus />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}

function CrumbsWithParams() {
  const { screen } = useOrbit()
  const id = useParam("id")
  const tab = useParam("tab")
  let last: string | undefined
  if (screen === "invoice") last = id ?? "INV-1042"
  if (screen === "client") last = clientById(id ?? "fernwood-studio").name
  if (screen === "settings" && tab) last = SETTINGS_TABS[tab]
  return <Crumbs last={last} />
}

const SETTINGS_TABS: Record<string, string> = { profile: "Profile", business: "Business and branding", reminders: "Reminders", team: "Team", billing: "Plan and billing" }

function Crumbs({ last }: { last?: string }) {
  const { screen, href } = useOrbit()
  const trail: { label: string; to?: Screen }[] = []
  if (screen === "invoice" || screen === "invoice-new") trail.push({ label: "Invoices", to: "invoices" }, { label: screen === "invoice" ? (last ?? "INV-1042") : "New invoice" })
  else if (screen === "client") trail.push({ label: "Clients", to: "clients" }, { label: last ?? "Fernwood Studio" })
  else if (screen === "settings" && last) trail.push({ label: "Settings", to: "settings" }, { label: last })
  else trail.push({ label: { overview: "Overview", invoices: "Invoices", recurring: "Recurring", clients: "Clients", payments: "Payments", reports: "Reports", settings: "Settings" }[screen as string] ?? "Overview" })
  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-[14px]">
        <BreadcrumbItem className="hidden lg:inline-flex">
          <BreadcrumbLink render={<Link href={href("overview")} />}>Ruiz Studio</BreadcrumbLink>
        </BreadcrumbItem>
        {trail.map((c, i) => (
          <CrumbPart key={c.label} first={i === 0} last={i === trail.length - 1}>
            {c.to && i < trail.length - 1 ? (
              <BreadcrumbLink render={<Link href={href(c.to)} />}>{c.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="truncate font-medium">{c.label}</BreadcrumbPage>
            )}
          </CrumbPart>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function CrumbPart({ first, last, children }: { first: boolean; last: boolean; children: ReactNode }) {
  // On phones only the current page shows; the trail comes back from md up.
  return (
    <>
      <BreadcrumbSeparator className={first ? "hidden lg:list-item" : "hidden md:list-item"} />
      <BreadcrumbItem className={cn("min-w-0", !last && "hidden md:inline-flex")}>{children}</BreadcrumbItem>
    </>
  )
}

const NOTICE_ICON: Record<Notice["kind"], typeof Bell> = {
  paid: CircleDollarSign,
  viewed: Eye,
  reminder: BellRing,
  payout: CreditCard,
  overdue: TriangleAlert,
}

function Notifications() {
  const { href } = useOrbit()
  const router = useRouter()
  const [items, setItems] = useState(NOTIFICATIONS)
  const unread = items.filter((n) => n.unread).length
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" className={cn(flat, "relative text-muted-foreground")} aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} />}
      >
        <Bell />
        {unread ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[color:var(--dc-accent)] ring-2 ring-[color:var(--background)]" /> : null}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="dc-card w-[min(380px,calc(100vw-1.5rem))] gap-0 p-0 ring-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-[14px] font-semibold">
            Notifications {unread ? <span className="ml-1 text-muted-foreground">{unread} new</span> : null}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className={cn(flat, "h-7 text-[13px] text-[color:var(--dc-accent)]")}
            disabled={!unread}
            onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
          >
            <Check /> Mark all read
          </Button>
        </div>
        <ul className="max-h-[360px] overflow-y-auto py-1">
          {items.map((n) => {
            const Icon = NOTICE_ICON[n.kind]
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    setItems((all) => all.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
                    const inv = /INV-\d+/.exec(n.text + n.detail)?.[0]
                    router.push(inv ? href("invoice", { id: inv }) : href("payments"))
                  }}
                  className="flex w-full gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <span className={cn("dc-icon size-8 shrink-0", n.kind === "overdue" && "bg-[color:color-mix(in_oklab,var(--dc-danger)_12%,transparent)] text-[color:var(--dc-danger)]")}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px] leading-snug", n.unread && "font-semibold")}>{n.text}</span>
                    <span className="block text-[12px] text-muted-foreground">{n.detail}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    {n.unread ? <span className="size-2 rounded-full bg-[color:var(--dc-accent)]" aria-label="Unread" /> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-border px-4 py-2.5">
          <Link href={href("settings", { tab: "reminders" })} className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
            Notification and reminder settings
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function UserMenu() {
  const { href, openPalette } = useOrbit()
  const router = useRouter()
  const isMac = useIsMac()
  const mode = useMode()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Account menu"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[12px] font-bold text-[color:var(--dc-highlight-fg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/40 in-[.dc-brutal]:ring-[1.5px] in-[.dc-brutal]:ring-[color:var(--dc-ink)]"
          />
        }
      >
        {ME.initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <span className="block text-[14px] font-semibold text-foreground">{ME.name}</span>
            <span className="block text-[12px] font-normal">{ME.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(href("settings", { tab: "profile" }))}>
          <UserRound /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(href("settings", { tab: "billing" }))}>
          <CreditCard /> Plan and billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openPalette}>
          <Search /> Command menu
          <DropdownMenuShortcut>{isMac ? "⌘K" : "Ctrl K"}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {mode === "dark" ? <Moon /> : <Sun />} Appearance
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <DropdownMenuRadioItem value="light">
                <Sun /> Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon /> Dark
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => toast("Help center opens in a new tab in your app.")}>
          <LifeBuoy /> Help and docs
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(href("sign-in"))}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
