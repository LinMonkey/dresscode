"use client"

// A sidebar for an app with several workspaces: a switcher at the top (each workspace has its own
// numbers and activity, and you can create a new one), a quick-create menu ("C" opens it) whose forms
// land in the activity feed, and the user's menu at the foot. A new workspace starts empty.
// It sits in a 640px frame here: in your app, drop the frame classes on SidebarProvider and
// "absolute h-full" on Sidebar so it fills the window.
import * as React from "react"
import {
  BadgeCheck,
  BellRing,
  ChartColumn,
  ChevronsUpDown,
  CircleDollarSign,
  CirclePlus,
  CreditCard,
  FilePen,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Plus,
  Settings,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

type ActivityKind = "invoice" | "estimate" | "payment" | "client" | "reminder"
type Activity = { id: string; kind: ActivityKind; title: string; detail: string; when: string }
type Workspace = { id: string; name: string; plan: string; outstanding: number; overdue: number; clients: string[]; activity: Activity[]; next: number }
type Kind = "invoice" | "estimate" | "client" | "workspace"

const INITIAL: Workspace[] = [
  {
    id: "ruiz",
    name: "Ruiz Studio",
    plan: "Pro plan",
    outstanding: 9870,
    overdue: 3,
    clients: ["Fernwood Studio", "Kato & Lee", "Pellucid Health", "Northfield Co.", "Juniper Bakery", "Tessellate Labs"],
    next: 1049,
    activity: [
      { id: "a1", kind: "payment", title: "Kato & Lee paid INV-1041", detail: "$1,860.00 by card", when: "10 min ago" },
      { id: "a2", kind: "reminder", title: "Reminder sent to Pellucid Health", detail: "INV-1036 is 15 days late", when: "1 hour ago" },
      { id: "a3", kind: "invoice", title: "You created INV-1048", detail: "Fernwood Studio · $4,200.00", when: "Yesterday" },
      { id: "a4", kind: "estimate", title: "Northfield Co. accepted EST-0212", detail: "$2,400.00, now invoice INV-1045", when: "Nov 21" },
    ],
  },
  {
    id: "kato",
    name: "Kato & Lee",
    plan: "Team plan",
    outstanding: 24350,
    overdue: 1,
    clients: ["Marlow & Finch", "Harlow Dental", "Brightwater Inn"],
    next: 318,
    activity: [
      { id: "b1", kind: "invoice", title: "Ben Kato created INV-0317", detail: "Harlow Dental · $12,000.00", when: "2 hours ago" },
      { id: "b2", kind: "payment", title: "Brightwater Inn paid INV-0311", detail: "$3,480.00 by bank transfer", when: "Yesterday" },
    ],
  },
  {
    id: "side",
    name: "Ada's freelance",
    plan: "Free plan",
    outstanding: 600,
    overdue: 0,
    clients: ["Oakline Press"],
    next: 12,
    activity: [{ id: "c1", kind: "invoice", title: "You created INV-0011", detail: "Oakline Press · $600.00", when: "Nov 2" }],
  },
]

const ICONS: Record<ActivityKind, typeof FileText> = {
  invoice: FileText,
  estimate: FilePen,
  payment: CircleDollarSign,
  client: UserPlus,
  reminder: BellRing,
}

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")

export default function SidebarTeamSwitcher() {
  const [workspaces, setWorkspaces] = React.useState(INITIAL)
  const [currentId, setCurrentId] = React.useState(INITIAL[0].id)
  const [dialog, setDialog] = React.useState<{ kind: Kind; open: boolean }>({ kind: "invoice", open: false })
  const [announcement, setAnnouncement] = React.useState("")
  const ws = workspaces.find((w) => w.id === currentId) ?? workspaces[0]

  const openDialog = (kind: Kind) => setDialog({ kind, open: true })

  const save = (kind: Kind, v: Record<string, string>) => {
    if (kind === "workspace") {
      const id = `ws${Date.now()}`
      setWorkspaces((all) => [...all, { id, name: v.name, plan: "Free plan", outstanding: 0, overdue: 0, clients: [], activity: [], next: 1 }])
      setCurrentId(id)
      setAnnouncement(`Workspace ${v.name} created`)
      return
    }
    const amount = Number(v.amount)
    const update = (w: Workspace): Workspace => {
      if (kind === "client") {
        const row: Activity = { id: `n${Date.now()}`, kind: "client", title: `You added ${v.name}`, detail: v.email, when: "Just now" }
        return { ...w, clients: [...w.clients, v.name], activity: [row, ...w.activity] }
      }
      const num = `${kind === "invoice" ? "INV" : "EST"}-${String(w.next).padStart(4, "0")}`
      const row: Activity = {
        id: `n${Date.now()}`,
        kind,
        title: `You created ${kind === "invoice" ? "" : "estimate "}${num}`,
        detail: `${v.client} · ${money(amount)}${kind === "invoice" ? ` · due in ${v.terms} days` : ""}`,
        when: "Just now",
      }
      return { ...w, next: w.next + 1, outstanding: kind === "invoice" ? w.outstanding + amount : w.outstanding, activity: [row, ...w.activity] }
    }
    setWorkspaces((all) => all.map((w) => (w.id === ws.id ? update(w) : w)))
    setAnnouncement(kind === "client" ? `${v.name} added` : `Draft ${kind} created`)
  }

  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border bg-background">
      <Sidebar collapsible="icon" className="absolute h-full">
        <SidebarHeader>
          <WorkspaceSwitcher workspaces={workspaces} current={ws} onSwitch={setCurrentId} onNew={() => openDialog("workspace")} />
        </SidebarHeader>
        <SidebarContent>
          <QuickCreate onCreate={openDialog} />
          <SidebarGroup>
            <SidebarGroupLabel>Billing</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink title="Overview" icon={LayoutDashboard} active />
                <NavLink title="Invoices" icon={FileText} count={ws.overdue ? `${ws.overdue} late` : undefined} />
                <NavLink title="Payments" icon={Wallet} />
                <NavLink title="Clients" icon={Users} count={ws.clients.length || undefined} />
                <NavLink title="Reports" icon={ChartColumn} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink title="Settings" icon={Settings} />
                <NavLink title="Help and support" icon={LifeBuoy} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserMenu />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden min-w-0 sm:inline-flex">
                <BreadcrumbLink href="#" className="truncate">
                  {ws.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:list-item" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-y-auto">
          <Overview ws={ws} onCreate={openDialog} />
        </div>
      </SidebarInset>

      <CreateDialog
        kind={dialog.kind}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        onKindChange={(kind) => setDialog({ kind, open: true })}
        ws={ws}
        onSave={save}
      />
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </SidebarProvider>
  )
}

function WorkspaceSwitcher({
  workspaces,
  current,
  onSwitch,
  onNew,
}: {
  workspaces: Workspace[]
  current: Workspace
  onSwitch: (id: string) => void
  onNew: () => void
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={current.name}
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                aria-label={`Workspace: ${current.name}. Switch workspace`}
              />
            }
          >
            <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              {initials(current.name)}
            </span>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-semibold">{current.name}</span>
              <span className="truncate text-xs text-muted-foreground">{current.plan}</span>
            </span>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start" sideOffset={isMobile ? 4 : 8} className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={current.id} onValueChange={(v) => onSwitch(String(v))}>
                {workspaces.map((w) => (
                  <DropdownMenuRadioItem key={w.id} value={w.id} closeOnClick className="gap-2 py-1.5">
                    <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold">
                      {initials(w.name)}
                    </span>
                    <span className="grid min-w-0 leading-tight">
                      <span className="truncate">{w.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{w.plan}</span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onNew} className="gap-2 py-1.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-dashed">
                <Plus className="size-3.5" />
              </span>
              Create a workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function QuickCreate({ onCreate }: { onCreate: (kind: Kind) => void }) {
  const { isMobile, state } = useSidebar()
  const [open, setOpen] = React.useState(false)

  // "C" opens the menu from anywhere, unless you are typing or another menu or dialog is open.
  React.useEffect(() => {
    if (isMobile || state !== "expanded") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "c" || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable=true], [role=dialog], [role=menu]")) return
      e.preventDefault()
      setOpen(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isMobile, state])

  const items = [
    { kind: "invoice" as const, label: "Invoice", icon: FileText },
    { kind: "estimate" as const, label: "Estimate", icon: FilePen },
    { kind: "client" as const, label: "Client", icon: UserPlus },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    tooltip="Quick create"
                    className="bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground data-popup-open:bg-primary/90 data-popup-open:text-primary-foreground"
                  />
                }
              >
                <CirclePlus />
                <span>Quick create</span>
                <Kbd className="ml-auto bg-primary-foreground/15 text-primary-foreground group-data-[collapsible=icon]:hidden">C</Kbd>
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start" sideOffset={8} className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Create</DropdownMenuLabel>
                  {items.map((i) => (
                    <DropdownMenuItem key={i.kind} onClick={() => onCreate(i.kind)}>
                      <i.icon /> {i.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavLink({ title, icon: Icon, count, active }: { title: string; icon: typeof FileText; count?: number | string; active?: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} tooltip={title} render={<a href="#" aria-current={active ? "page" : undefined} />}>
        <Icon />
        <span>{title}</span>
      </SidebarMenuButton>
      {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function UserMenu() {
  const { isMobile } = useSidebar()
  const [summary, setSummary] = React.useState(true)
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
          <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" sideOffset={8} className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 py-1.5 font-normal text-foreground">
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
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Email me</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={summary} onCheckedChange={setSummary}>
                A weekly summary
              </DropdownMenuCheckboxItem>
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

function Overview({ ws, onCreate }: { ws: Workspace; onCreate: (kind: Kind) => void }) {
  const stats = [
    { label: "Outstanding", value: money(ws.outstanding) },
    { label: "Overdue invoices", value: String(ws.overdue) },
    { label: "Clients", value: String(ws.clients.length) },
  ]
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {ws.name} on the {ws.plan.replace(" plan", "")} plan.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-card-foreground">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="sidebar-team-activity" className="rounded-xl border bg-card text-card-foreground">
        <h3 id="sidebar-team-activity" className="border-b px-4 py-3 font-medium">
          Recent activity
        </h3>
        {ws.activity.length ? (
          <ul className="divide-y">
            {ws.activity.map((a) => {
              const Icon = ICONS[a.kind]
              return (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.when}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <p className="mt-3 font-medium">Nothing here yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">Add your first client, then send them an invoice. Everything that happens shows up here.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onCreate("client")}>
                <UserPlus /> Add a client
              </Button>
              <Button size="sm" onClick={() => onCreate("invoice")} disabled={!ws.clients.length}>
                <FileText /> New invoice
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const COPY: Record<Kind, { title: string; description: (ws: Workspace) => string; submit: string }> = {
  invoice: { title: "New invoice", description: (ws) => `Saved as a draft in ${ws.name}. Add line items before you send it.`, submit: "Create draft" },
  estimate: { title: "New estimate", description: () => "Your client can accept it online. It becomes an invoice when they do.", submit: "Create estimate" },
  client: { title: "Add a client", description: (ws) => `They get invoices and reminders from ${ws.name} at this address.`, submit: "Add client" },
  workspace: { title: "Create a workspace", description: () => "A separate set of clients, invoices and settings. It starts on the Free plan.", submit: "Create workspace" },
}

function CreateDialog({
  kind,
  open,
  onOpenChange,
  onKindChange,
  ws,
  onSave,
}: {
  kind: Kind
  open: boolean
  onOpenChange: (open: boolean) => void
  onKindChange: (kind: Kind) => void
  ws: Workspace
  onSave: (kind: Kind, values: Record<string, string>) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* The form remounts for each kind (and each time the dialog opens), so it always starts blank. */}
        <CreateForm
          key={kind}
          kind={kind}
          ws={ws}
          onKindChange={onKindChange}
          onSave={(values) => {
            onSave(kind, values)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function CreateForm({
  kind,
  ws,
  onKindChange,
  onSave,
}: {
  kind: Kind
  ws: Workspace
  onKindChange: (kind: Kind) => void
  onSave: (values: Record<string, string>) => void
}) {
  const copy = COPY[kind]
  const needsClient = (kind === "invoice" || kind === "estimate") && !ws.clients.length
  const [client, setClient] = React.useState(ws.clients[0] ?? "")
  const [terms, setTerms] = React.useState("14")
  const clientItems = ws.clients.map((c) => ({ value: c, label: c }))
  const termItems = [
    { value: "7", label: "In 7 days" },
    { value: "14", label: "In 14 days" },
    { value: "30", label: "In 30 days" },
  ]

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    onSave({ ...data, client, terms })
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{copy.title}</DialogTitle>
        <DialogDescription>{copy.description(ws)}</DialogDescription>
      </DialogHeader>

      {needsClient ? (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm">
          <p className="font-medium">{ws.name} has no clients yet</p>
          <p className="mt-1 text-muted-foreground">Add one first, then come back to bill them.</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => onKindChange("client")}>
            <UserPlus /> Add a client
          </Button>
        </div>
      ) : kind === "invoice" || kind === "estimate" ? (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sidebar-team-client">Client</Label>
            <Select items={clientItems} value={client} onValueChange={(v) => v != null && setClient(String(v))}>
              <SelectTrigger id="sidebar-team-client" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clientItems.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="sidebar-team-amount">Amount (USD)</Label>
              <Input id="sidebar-team-amount" name="amount" type="number" inputMode="decimal" min="1" step="0.01" placeholder="1200.00" required autoFocus />
            </div>
            {kind === "invoice" ? (
              <div className="grid gap-2">
                <Label htmlFor="sidebar-team-terms">Due</Label>
                <Select items={termItems} value={terms} onValueChange={(v) => v != null && setTerms(String(v))}>
                  <SelectTrigger id="sidebar-team-terms" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {termItems.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </div>
      ) : kind === "client" ? (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sidebar-team-name">Name or company</Label>
            <Input id="sidebar-team-name" name="name" placeholder="Linden Street Clinic" required autoFocus autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sidebar-team-email">Billing email</Label>
            <Input id="sidebar-team-email" name="email" type="email" placeholder="accounts@example.com" required autoComplete="off" />
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="sidebar-team-ws">Workspace name</Label>
          <Input id="sidebar-team-ws" name="name" placeholder="Side projects" required autoFocus autoComplete="off" />
        </div>
      )}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
        {needsClient ? null : <Button type="submit">{copy.submit}</Button>}
      </DialogFooter>
    </form>
  )
}
