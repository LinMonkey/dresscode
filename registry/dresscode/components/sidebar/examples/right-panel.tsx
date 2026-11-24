"use client"

// Two sidebars: the app's nav on the left (folds to icons) and a details panel on the right
// (side="right") for a support inbox. Folders and labels filter the list; picking a conversation fills
// the panel, where its status, priority and owner can be changed. Arrow keys move through the list.
// On phones the panel opens as a sheet from the right. The details panel has its own SidebarProvider,
// controlled from the header button, so Ctrl/⌘ B still folds only the nav.
// It sits in a 640px frame here: in your app, drop the frame classes on the outer SidebarProvider and
// "absolute h-full" on both sidebars so they fill the window.
import * as React from "react"
import { AlarmClock, AtSign, CheckCheck, Inbox, LifeBuoy, PanelRight, Reply, Settings, UserRound, X } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Status = "Open" | "Pending" | "Closed"
type Priority = "Low" | "Normal" | "High"
type LabelId = "billing" | "bug" | "feature"
type Conversation = {
  id: string
  name: string
  email: string
  company: string
  plan: string
  since: string
  invoices: number
  subject: string
  body: string[]
  time: string
  unread: boolean
  mentioned?: boolean
  snoozed?: string
  labels: LabelId[]
  assignee: string
  priority: Priority
  status: Status
}

const ME = "Ada Lin"
const TEAM = ["Unassigned", "Ada Lin", "Sam Reid", "Mei Chen"]

const LABELS: { id: LabelId; title: string; dot: string }[] = [
  { id: "billing", title: "Billing", dot: "bg-(--chart-1)" },
  { id: "bug", title: "Bug", dot: "bg-(--chart-5)" },
  { id: "feature", title: "Feature request", dot: "bg-(--chart-4)" },
]

const INITIAL: Conversation[] = [
  {
    id: "c1",
    name: "Priya Nair",
    email: "priya@fernwood.studio",
    company: "Fernwood Studio",
    plan: "Pro, yearly",
    since: "March 2024",
    invoices: 312,
    subject: "Card declined on our renewal",
    body: [
      "Hi, our card was declined this morning when the Pro plan renewed. We've added a new card since.",
      "Can you retry the charge? Our reminders are paused and two clients are already late.",
    ],
    time: "9:41",
    unread: true,
    labels: ["billing"],
    assignee: "Ada Lin",
    priority: "High",
    status: "Open",
  },
  {
    id: "c2",
    name: "Tom Okafor",
    email: "tom@katolee.co",
    company: "Kato & Lee",
    plan: "Team, monthly",
    since: "June 2025",
    invoices: 87,
    subject: "Can clients pay in two installments?",
    body: ["A few of our bigger clients asked to split payments. Is there a way to send one invoice with two due dates?"],
    time: "8:15",
    unread: true,
    labels: ["feature"],
    assignee: "Unassigned",
    priority: "Normal",
    status: "Open",
  },
  {
    id: "c3",
    name: "Grace Huang",
    email: "grace@pellucid.health",
    company: "Pellucid Health",
    plan: "Pro, monthly",
    since: "January 2025",
    invoices: 154,
    subject: "Reminder emails landing in spam",
    body: ["Three clients told us this week that our reminders went to their spam folder. Nothing changed on our side as far as I know."],
    time: "Yesterday",
    unread: false,
    labels: ["bug"],
    assignee: "Ada Lin",
    priority: "High",
    status: "Open",
  },
  {
    id: "c4",
    name: "Leo Martins",
    email: "leo@juniperbakery.com",
    company: "Juniper Bakery",
    plan: "Free",
    since: "October 2026",
    invoices: 6,
    subject: "How do I add VAT to an invoice?",
    body: ["We just registered for VAT. @Ada Lin said there's a setting for it but I can't find where to turn it on."],
    time: "Yesterday",
    unread: false,
    mentioned: true,
    labels: ["billing"],
    assignee: "Sam Reid",
    priority: "Low",
    status: "Pending",
  },
  {
    id: "c5",
    name: "Hana Sato",
    email: "hana@northfield.co",
    company: "Northfield Co.",
    plan: "Pro, yearly",
    since: "August 2023",
    invoices: 506,
    subject: "Export every invoice for our accountant",
    body: ["Our accountant needs all invoices from this tax year as PDFs, ideally in one file. No rush, the deadline is in January."],
    time: "Mon",
    unread: false,
    snoozed: "Thursday",
    labels: [],
    assignee: "Ada Lin",
    priority: "Normal",
    status: "Pending",
  },
  {
    id: "c6",
    name: "Oliver Brandt",
    email: "oliver@tessellate.dev",
    company: "Tessellate Labs",
    plan: "Team, yearly",
    since: "May 2024",
    invoices: 221,
    subject: "Thanks, the payout arrived",
    body: ["All good now, the payout landed this morning. Thanks for chasing the bank."],
    time: "Nov 20",
    unread: false,
    labels: ["billing"],
    assignee: "Mei Chen",
    priority: "Normal",
    status: "Closed",
  },
]

type Filter = { kind: "folder"; id: "inbox" | "mine" | "mentions" | "snoozed" | "done" } | { kind: "label"; id: LabelId }

const FOLDERS = [
  { id: "inbox" as const, title: "Inbox", icon: Inbox },
  { id: "mine" as const, title: "Assigned to me", icon: UserRound },
  { id: "mentions" as const, title: "Mentions", icon: AtSign },
  { id: "snoozed" as const, title: "Snoozed", icon: AlarmClock },
  { id: "done" as const, title: "Done", icon: CheckCheck },
]

const ignore = () => {}
const isOpen = (c: Conversation) => c.status !== "Closed" && !c.snoozed
function inFilter(c: Conversation, f: Filter) {
  if (f.kind === "label") return c.labels.includes(f.id) && c.status !== "Closed"
  if (f.id === "inbox") return isOpen(c)
  if (f.id === "mine") return isOpen(c) && c.assignee === ME
  if (f.id === "mentions") return !!c.mentioned && c.status !== "Closed"
  if (f.id === "snoozed") return !!c.snoozed && c.status !== "Closed"
  return c.status === "Closed"
}
const filterTitle = (f: Filter) => (f.kind === "folder" ? FOLDERS.find((x) => x.id === f.id)!.title : LABELS.find((x) => x.id === f.id)!.title)
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

export default function SidebarRightPanel() {
  const [items, setItems] = React.useState(INITIAL)
  const [filter, setFilter] = React.useState<Filter>({ kind: "folder", id: "inbox" })
  const [selectedId, setSelectedId] = React.useState<string | null>("c1")
  const [detailsOpen, setDetailsOpen] = React.useState(true)

  const visible = items.filter((c) => inFilter(c, filter))
  // The open conversation stays in the panel even if a change moves it out of the list.
  const selected = items.find((c) => c.id === selectedId) ?? null

  const update = (id: string, patch: Partial<Conversation>) => setItems((all) => all.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  const select = (id: string) => {
    setSelectedId(id)
    update(id, { unread: false })
  }
  const pickFilter = (f: Filter) => {
    setFilter(f)
    setSelectedId(items.find((c) => inFilter(c, f))?.id ?? null)
  }
  const markDone = (id: string) => {
    const i = visible.findIndex((c) => c.id === id)
    const next = visible[i + 1] ?? visible[i - 1]
    update(id, { status: "Closed", snoozed: undefined })
    setSelectedId(next && next.id !== id ? next.id : null)
  }

  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border bg-background">
      <NavSidebar items={items} filter={filter} onFilter={pickFilter} />
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink href="#">Support</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:list-item" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">{filterTitle(filter)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-mr-1 ml-auto hidden md:inline-flex"
                  aria-pressed={detailsOpen}
                  aria-label={detailsOpen ? "Hide details" : "Show details"}
                  onClick={() => setDetailsOpen((o) => !o)}
                />
              }
            >
              <PanelRight />
            </TooltipTrigger>
            <TooltipContent side="bottom">{detailsOpen ? "Hide details" : "Show details"}</TooltipContent>
          </Tooltip>
        </header>

        {/* The details panel's own provider: open follows the header button only. */}
        <SidebarProvider open={detailsOpen} onOpenChange={ignore} className="relative min-h-0 flex-1" style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
          <ConversationList title={filterTitle(filter)} items={visible} selectedId={selected?.id ?? null} onSelect={select} />
          <DetailsSidebar conversation={selected} onChange={update} onDone={markDone} onClose={() => setDetailsOpen(false)} />
        </SidebarProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}

function NavSidebar({ items, filter, onFilter }: { items: Conversation[]; filter: Filter; onFilter: (f: Filter) => void }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [away, setAway] = React.useState(false)
  const go = (f: Filter) => {
    onFilter(f)
    if (isMobile) setOpenMobile(false)
  }
  const count = (f: Filter) => {
    const list = items.filter((c) => inFilter(c, f))
    return f.kind === "folder" && f.id === "inbox" ? list.filter((c) => c.unread).length : list.length
  }
  return (
    <Sidebar collapsible="icon" className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Orbit support" render={<a href="#" />}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LifeBuoy />
              </span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Orbit support</span>
                <span className="truncate text-xs text-muted-foreground">4 teammates online</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {FOLDERS.map((f) => {
                const target: Filter = { kind: "folder", id: f.id }
                const active = filter.kind === "folder" && filter.id === f.id
                const n = count(target)
                return (
                  <SidebarMenuItem key={f.id}>
                    <SidebarMenuButton isActive={active} aria-current={active ? "page" : undefined} tooltip={f.title} onClick={() => go(target)}>
                      <f.icon />
                      <span>{f.title}</span>
                    </SidebarMenuButton>
                    {n && f.id !== "done" ? <SidebarMenuBadge>{n}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Labels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {LABELS.map((l) => {
                const target: Filter = { kind: "label", id: l.id }
                const active = filter.kind === "label" && filter.id === l.id
                return (
                  <SidebarMenuItem key={l.id}>
                    <SidebarMenuButton isActive={active} aria-current={active ? "page" : undefined} tooltip={l.title} onClick={() => go(target)}>
                      <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className={cn("size-2.5 rounded-full ring-1 ring-foreground/15 ring-inset", l.dot)} />
                      </span>
                      <span>{l.title}</span>
                    </SidebarMenuButton>
                    {count(target) ? <SidebarMenuBadge>{count(target)}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" render={<a href="#" />}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Availability: new conversations are only assigned to people who are available. */}
            <SidebarMenuButton
              size="lg"
              tooltip={away ? "Ada Lin, away" : "Ada Lin, available"}
              aria-pressed={away}
              aria-label={`Ada Lin, ${away ? "away" : "available"}. Set yourself ${away ? "available" : "away"}`}
              onClick={() => setAway((a) => !a)}
            >
              <span className="relative shrink-0">
                <Avatar className="rounded-lg">
                  <AvatarFallback className="rounded-lg text-xs">AL</AvatarFallback>
                </Avatar>
                <span
                  className={cn("absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-sidebar", away ? "bg-muted-foreground" : "bg-primary")}
                  aria-hidden="true"
                />
              </span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-medium">Ada Lin</span>
                <span className="truncate text-xs text-muted-foreground">{away ? "Away" : "Available"}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function ConversationList({
  title,
  items,
  selectedId,
  onSelect,
}: {
  title: string
  items: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { isMobile, setOpenMobile } = useSidebar() // the details panel's
  const refs = React.useRef(new Map<string, HTMLButtonElement>())

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const i = items.findIndex((c) => c.id === selectedId)
    const next = items[Math.min(items.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))]
    if (!next) return
    onSelect(next.id)
    refs.current.get(next.id)?.focus()
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b px-4 text-sm">
        <h2 className="font-medium">{title}</h2>
        <span className="text-muted-foreground tabular-nums">
          {items.length} {items.length === 1 ? "conversation" : "conversations"}
        </span>
      </div>
      {items.length ? (
        <ul aria-label={title} onKeyDown={onKeyDown} className="flex-1 divide-y overflow-y-auto">
          {items.map((c) => {
            const selected = c.id === selectedId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) refs.current.set(c.id, el)
                    else refs.current.delete(c.id)
                  }}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => {
                    onSelect(c.id)
                    if (isMobile) setOpenMobile(true)
                  }}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    selected && "bg-muted hover:bg-muted",
                  )}
                >
                  <Avatar className="mt-0.5">
                    <AvatarFallback className="text-xs">{initials(c.name)}</AvatarFallback>
                  </Avatar>
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>{c.name}</span>
                      {c.unread ? (
                        <span className="size-2 shrink-0 rounded-full bg-primary">
                          <span className="sr-only">Unread</span>
                        </span>
                      ) : null}
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{c.snoozed ? `Until ${c.snoozed}` : c.time}</span>
                    </span>
                    <span className={cn("truncate text-sm", c.unread ? "text-foreground" : "text-muted-foreground")}>{c.subject}</span>
                    <span className="truncate text-xs text-muted-foreground">{c.body[0]}</span>
                    {c.labels.length ? (
                      <span className="mt-1 flex gap-1">
                        {c.labels.map((id) => {
                          const l = LABELS.find((x) => x.id === id)!
                          return (
                            <Badge key={id} variant="outline" className="gap-1.5">
                              <span className={cn("size-1.5 rounded-full ring-1 ring-foreground/15 ring-inset", l.dot)} aria-hidden="true" />
                              {l.title}
                            </Badge>
                          )
                        })}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="flex size-10 items-center justify-center rounded-full border text-muted-foreground">
            <CheckCheck className="size-5" />
          </span>
          <p className="mt-3 font-medium">Nothing in {title}</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">New conversations land here as customers write in.</p>
        </div>
      )}
    </div>
  )
}

function DetailsSidebar({
  conversation: c,
  onChange,
  onDone,
  onClose,
}: {
  conversation: Conversation | null
  onChange: (id: string, patch: Partial<Conversation>) => void
  onDone: (id: string) => void
  onClose: () => void
}) {
  const { isMobile, setOpenMobile } = useSidebar() // the details panel's
  const close = () => (isMobile ? setOpenMobile(false) : onClose())

  return (
    <Sidebar side="right" className="absolute h-full">
      <SidebarHeader className="flex-row items-start gap-2 border-b p-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Details</p>
          <h2 className="line-clamp-2 text-sm font-semibold">{c ? c.subject : "No conversation selected"}</h2>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={close} aria-label="Close details" className="-mt-0.5 -mr-1 shrink-0">
          <X />
        </Button>
      </SidebarHeader>

      {c ? (
        <>
          <SidebarContent>
            <SidebarGroup>
              <div className="flex items-center gap-3 px-2 pt-1">
                <Avatar size="lg">
                  <AvatarFallback>{initials(c.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-2 text-xs">
                <dt className="text-muted-foreground">Company</dt>
                <dd className="truncate text-right">{c.company}</dd>
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="truncate text-right">{c.plan}</dd>
                <dt className="text-muted-foreground">Customer since</dt>
                <dd className="truncate text-right">{c.since}</dd>
                <dt className="text-muted-foreground">Invoices sent</dt>
                <dd className="text-right tabular-nums">{c.invoices}</dd>
              </dl>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
            <SidebarGroup>
              <SidebarGroupLabel>Properties</SidebarGroupLabel>
              <div className="grid gap-2 px-2">
                <Field label="Status" value={c.status} options={["Open", "Pending", "Closed"]} onChange={(v) => onChange(c.id, { status: v as Status })} />
                <Field label="Priority" value={c.priority} options={["Low", "Normal", "High"]} onChange={(v) => onChange(c.id, { priority: v as Priority })} />
                <Field label="Owner" value={c.assignee} options={TEAM} onChange={(v) => onChange(c.id, { assignee: v })} />
              </div>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
            <SidebarGroup>
              <SidebarGroupLabel>Latest message</SidebarGroupLabel>
              <div className="space-y-2 px-2 text-sm leading-relaxed">
                {c.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="text-xs text-muted-foreground">
                  {c.name.split(" ")[0]}, {c.time}
                </p>
              </div>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="flex-row border-t p-3">
            <Button size="sm" className="flex-1">
              <Reply /> Reply
            </Button>
            <Button size="sm" variant="outline" className="flex-1" disabled={c.status === "Closed"} onClick={() => onDone(c.id)}>
              <CheckCheck /> Mark done
            </Button>
          </SidebarFooter>
        </>
      ) : (
        <SidebarContent className="items-center justify-center p-6 text-center">
          <p className="text-sm font-medium">Pick a conversation</p>
          <p className="mt-1 text-sm text-muted-foreground">Its customer, status and latest message show up here.</p>
        </SidebarContent>
      )}
    </Sidebar>
  )
}

function Field({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const id = React.useId()
  const items = options.map((o) => ({ value: o, label: o }))
  return (
    <div className="grid grid-cols-[5rem_1fr] items-center gap-2">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      <Select items={items} value={value} onValueChange={(v) => v != null && onChange(String(v))}>
        <SelectTrigger id={id} size="sm" className="w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
