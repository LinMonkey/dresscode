"use client"

// An inset sidebar: the page sits in a rounded panel on the sidebar's color, the layout of most
// dashboards. Folding it (trigger, Ctrl/⌘ B) slides the nav away and the panel takes the full width;
// the cards reflow on the panel's own width, not the window's.
// It sits in a 640px frame here: in your app, drop the frame classes on SidebarProvider and
// "absolute h-full" on Sidebar so it fills the window.
import * as React from "react"
import {
  ChartColumn,
  ChevronsUpDown,
  CreditCard,
  Download,
  FileSignature,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MoreHorizontal,
  Orbit,
  Plus,
  Receipt,
  Settings,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const MAIN = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Invoices", icon: FileText, count: 5 },
  { title: "Clients", icon: Users },
  { title: "Payments", icon: Wallet },
  { title: "Reports", icon: ChartColumn },
]
const DOCUMENTS = [
  { title: "Contracts", icon: FileSignature },
  { title: "Estimates", icon: Receipt },
  { title: "Tax forms", icon: FileText },
]
const SECONDARY = [
  { title: "Settings", icon: Settings },
  { title: "Get help", icon: LifeBuoy },
]

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits })

// 13 weeks of payments received, ending today (Nov 24). Quieter on weekends, rising slowly.
const DAYS = Array.from({ length: 91 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 7, 26 + i))
  const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6
  const revenue = Math.round((1150 + i * 6 + 420 * Math.sin(i / 5.5) + 180 * Math.sin(i / 1.7)) * (weekend ? 0.55 : 1))
  return { label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }), revenue }
})

const WEEKS = Array.from({ length: Math.ceil(DAYS.length / 7) }, (_, w) => {
  const week = DAYS.slice(w * 7, w * 7 + 7)
  return { label: week[0].label, tip: `Week of ${week[0].label}`, revenue: week.reduce((s, d) => s + d.revenue, 0) }
})

const RANGES = [
  { value: "90", label: "3 months" },
  { value: "30", label: "30 days" },
  { value: "7", label: "7 days" },
]

const chartConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig

const STATS = [
  { label: "Revenue", value: money(48210), change: "+12.4%", up: true, note: "This month, up from $42,890" },
  { label: "Outstanding", value: money(9870), change: "+$1,240", up: true, note: "5 open invoices, 3 overdue" },
  { label: "New clients", value: "6", change: "+2", up: true, note: "Two came from referrals" },
  { label: "Days to pay", value: "11.2", change: "-1.8", up: false, note: "On average, faster since reminders" },
]

const PAYMENTS = [
  { client: "Tessellate Labs", invoice: "INV-1042", method: "Bank transfer", date: "Nov 24", amount: 5680 },
  { client: "Kato & Lee", invoice: "INV-1041", method: "Card", date: "Nov 23", amount: 1860 },
  { client: "Fernwood Studio", invoice: "INV-1039", method: "Card", date: "Nov 21", amount: 4200 },
  { client: "Juniper Bakery", invoice: "INV-1037", method: "Payment link", date: "Nov 19", amount: 640 },
  { client: "Northfield Co.", invoice: "INV-1035", method: "Bank transfer", date: "Nov 17", amount: 2400 },
]

export default function SidebarInsetExample() {
  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border">
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" aria-label="Export">
              <Download />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" aria-label="New invoice">
              <Plus />
              <span className="hidden sm:inline">New invoice</span>
            </Button>
          </div>
        </header>
        <div className="@container/main flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar variant="inset" className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active} render={<a href="#" aria-current={item.active ? "page" : undefined} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DOCUMENTS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href="#" />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton size="sm" render={<a href="#" />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

function UserMenu() {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground" />}>
            <Avatar className="rounded-lg">
              <AvatarFallback className="rounded-lg text-xs">AL</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">Ada Lin</span>
              <span className="truncate text-xs text-muted-foreground">ada@ruiz.studio</span>
            </span>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" sideOffset={8} className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>ada@ruiz.studio</DropdownMenuLabel>
              <DropdownMenuItem>
                <UserRound /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard /> Plan and billing
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

function Dashboard() {
  const [range, setRange] = React.useState("90")
  // Three months reads better week by week; 30 and 7 days stay daily.
  const data = range === "90" ? WEEKS : DAYS.slice(-Number(range)).map((d) => ({ ...d, tip: d.label }))
  const total = data.reduce((s, d) => s + d.revenue, 0)
  const rangeLabel = RANGES.find((r) => r.value === range)?.label.toLowerCase()

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="grid gap-3 @md/main:grid-cols-2 @3xl/main:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <Badge variant="outline" className="shrink-0">
                {s.up ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
                {s.change}
              </Badge>
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="sidebar-inset-revenue" className="rounded-xl border bg-card p-4 text-card-foreground sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="sidebar-inset-revenue" className="font-semibold">
              Payments received
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {money(total, 0)} in the last {rangeLabel}
            </p>
          </div>
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={[range]}
            onValueChange={(v: string[]) => v[0] && setRange(v[0])}
            aria-label="Date range"
          >
            {RANGES.map((r) => (
              <ToggleGroupItem key={r.value} value={r.value} className="px-3">
                {r.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-[220px] w-full">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="sidebar-inset-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => (v ? `$${+(v / 1000).toFixed(1)}k` : "$0")} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.tip ?? label}
                  formatter={(value) => (
                    <div className="flex w-full items-center gap-2">
                      <span className="size-2.5 shrink-0 rounded-[2px] bg-(--color-revenue)" />
                      <span className="text-muted-foreground">Received</span>
                      <span className="ml-auto font-medium text-foreground tabular-nums">{money(Number(value), 0)}</span>
                    </div>
                  )}
                />
              }
            />
            <Area dataKey="revenue" type="monotone" fill="url(#sidebar-inset-fill)" stroke="var(--color-revenue)" strokeWidth={2} animationDuration={400} />
          </AreaChart>
        </ChartContainer>
      </section>

      <section aria-labelledby="sidebar-inset-payments" className="rounded-xl border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2 sm:px-5">
          <h2 id="sidebar-inset-payments" className="font-semibold">
            Recent payments
          </h2>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#" />}>
            View all
          </Button>
        </div>
        <ul className="divide-y">
          {PAYMENTS.map((p) => (
            <li key={p.invoice} className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <Avatar size="sm">
                <AvatarFallback>{initials(p.client)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.client}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.invoice} · {p.method}
                </p>
              </div>
              <span className="hidden text-xs text-muted-foreground @md/main:inline">{p.date}</span>
              <span className="w-24 text-right text-sm font-medium tabular-nums">{money(p.amount)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
