"use client"

// An app sidebar that folds to a rail of icons (the trigger, the rail on its edge, or Ctrl/⌘ B), with a
// tooltip on each icon while folded, grouped links with counts, and the signed-in user at the foot.
// On phones it opens as a sheet. It sits in a 640px frame here: in your app, drop the frame classes on
// SidebarProvider and "absolute h-full" on Sidebar so it fills the window.
import * as React from "react"
import {
  BadgeCheck,
  Bell,
  ChartColumn,
  ChevronsUpDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Orbit,
  Package,
  Plus,
  Repeat,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type NavItem = { title: string; icon: typeof FileText; count?: number; active?: boolean }

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Billing",
    items: [
      { title: "Overview", icon: LayoutDashboard },
      { title: "Invoices", icon: FileText, count: 5, active: true },
      { title: "Payments", icon: Wallet, count: 3 },
      { title: "Recurring", icon: Repeat },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Clients", icon: Users, count: 28 },
      { title: "Products", icon: Package },
      { title: "Reports", icon: ChartColumn },
    ],
  },
]

const SECONDARY: NavItem[] = [
  { title: "Settings", icon: Settings },
  { title: "Help and support", icon: LifeBuoy },
]

type Status = "Draft" | "Sent" | "Viewed" | "Overdue" | "Paid"

const INVOICES: { id: string; client: string; issued: string; due: string; amount: number; status: Status }[] = [
  { id: "INV-1048", client: "Fernwood Studio", issued: "Nov 22", due: "Dec 6", amount: 4200, status: "Draft" },
  { id: "INV-1047", client: "Kato & Lee", issued: "Nov 20", due: "Dec 4", amount: 1860, status: "Sent" },
  { id: "INV-1046", client: "Pellucid Health", issued: "Nov 14", due: "Nov 28", amount: 3150, status: "Viewed" },
  { id: "INV-1045", client: "Northfield Co.", issued: "Nov 3", due: "Nov 17", amount: 2400, status: "Overdue" },
  { id: "INV-1044", client: "Marlow & Finch", issued: "Oct 30", due: "Nov 13", amount: 960, status: "Overdue" },
  { id: "INV-1043", client: "Juniper Bakery", issued: "Oct 28", due: "Nov 11", amount: 1500, status: "Overdue" },
  { id: "INV-1042", client: "Tessellate Labs", issued: "Oct 24", due: "Nov 7", amount: 5680, status: "Paid" },
  { id: "INV-1041", client: "Kato & Lee", issued: "Oct 21", due: "Nov 4", amount: 1860, status: "Paid" },
]

const FILTERS = ["All", "Open", "Overdue", "Draft", "Paid"] as const
type Filter = (typeof FILTERS)[number]

const isOpen = (s: Status) => s === "Sent" || s === "Viewed" || s === "Overdue"
const matches = (f: Filter, s: Status) => f === "All" || (f === "Open" ? isOpen(s) : s === f)
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

const STATUS_BADGE: Record<Status, React.ComponentProps<typeof Badge>["variant"]> = {
  Draft: "outline",
  Sent: "secondary",
  Viewed: "secondary",
  Overdue: "destructive",
  Paid: "default",
}

const noop = () => () => {}
/** "⌘" on Apple keyboards, "Ctrl" everywhere else (and on the server). */
function useModKey() {
  return React.useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  )
}

export default function SidebarIconCollapse() {
  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border bg-background">
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <InvoicesPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Orbit" render={<a href="#" />}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Orbit />
              </span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Orbit</span>
                <span className="truncate text-xs text-muted-foreground">Ruiz Studio</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavLink key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY.map((item) => (
                <NavLink key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.active}
        // Folded, the count moves into the tooltip.
        tooltip={{
          children: (
            <>
              {item.title}
              {item.count ? <span className="tabular-nums opacity-70">{item.count}</span> : null}
            </>
          ),
        }}
        render={<a href="#" aria-current={item.active ? "page" : undefined} />}
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
      {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function UserMenu() {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" tooltip="Ada Lin" className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground" />}
          >
            <Avatar className="rounded-lg">
              <AvatarFallback className="rounded-lg text-xs">AL</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">Ada Lin</span>
              <span className="truncate text-xs text-muted-foreground">ada@ruiz.studio</span>
            </span>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" sideOffset={8} className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 px-1.5 py-1.5 font-normal text-foreground">
                <Avatar className="rounded-lg">
                  <AvatarFallback className="rounded-lg text-xs">AL</AvatarFallback>
                </Avatar>
                <span className="grid min-w-0 leading-tight">
                  <span className="truncate text-sm font-medium">Ada Lin</span>
                  <span className="truncate text-xs text-muted-foreground">ada@ruiz.studio</span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck /> Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard /> Plan and billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell /> Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function TopBar() {
  const mod = useModKey()
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <Tooltip>
        <TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
        <TooltipContent side="bottom">
          Toggle sidebar
          <KbdGroup>
            <Kbd>{mod}</Kbd>
            <Kbd>B</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden sm:inline-flex">
            <BreadcrumbLink href="#">Billing</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:list-item" />
          <BreadcrumbItem>
            <BreadcrumbPage>Invoices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon-sm" aria-label="Search invoices">
          <Search />
        </Button>
        <Button size="sm" aria-label="New invoice">
          <Plus />
          <span className="hidden sm:inline">New invoice</span>
        </Button>
      </div>
    </header>
  )
}

function InvoicesPage() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const rows = INVOICES.filter((i) => matches(filter, i.status))
  const open = INVOICES.filter((i) => isOpen(i.status))
  const overdue = INVOICES.filter((i) => i.status === "Overdue")
  const paid = INVOICES.filter((i) => i.status === "Paid")
  const sum = (list: typeof INVOICES) => money(list.reduce((s, i) => s + i.amount, 0))

  const stats = [
    { label: "Outstanding", value: sum(open), note: `${open.length} open invoices` },
    { label: "Overdue", value: sum(overdue), note: `${overdue.length} past their due date`, alert: true },
    { label: "Paid in November", value: sum(paid), note: "12% more than October" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Invoices</h2>
        <p className="mt-1 text-sm text-muted-foreground">Everything you have billed this quarter, newest first.</p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-card-foreground">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className={cn("mt-1 text-2xl font-semibold tracking-tight tabular-nums", s.alert && "text-destructive")}>{s.value}</dd>
            <dd className="mt-0.5 text-xs text-muted-foreground">{s.note}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border bg-card text-card-foreground">
        <div role="group" aria-label="Filter by status" className="flex gap-1 overflow-x-auto border-b p-2">
          {FILTERS.map((f) => {
            const count = INVOICES.filter((i) => matches(f, i.status)).length
            return (
              <Button key={f} variant={filter === f ? "secondary" : "ghost"} size="sm" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
                <span className="text-muted-foreground tabular-nums">{count}</span>
              </Button>
            )
          })}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pr-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="pl-4 font-medium">
                  <a href="#" className="hover:underline">
                    {i.id}
                  </a>
                </TableCell>
                <TableCell>{i.client}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{i.issued}</TableCell>
                <TableCell className={cn(i.status === "Overdue" ? "text-destructive" : "text-muted-foreground")}>{i.due}</TableCell>
                <TableCell className="text-right tabular-nums">{money(i.amount)}</TableCell>
                <TableCell className="pr-4">
                  <Badge variant={STATUS_BADGE[i.status]}>{i.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
