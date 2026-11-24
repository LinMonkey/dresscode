"use client"

// A docs sidebar four levels deep: sections that fold, pages that open into sub-pages, and sub-pages
// with their own children, built from Collapsible. Badges mark what is new, updated or in beta; the path
// to the open page starts unfolded, a button folds everything, and a menu switches the docs version.
// It sits in a 640px frame here: in your app, drop the frame classes on SidebarProvider and
// "absolute h-full" on Sidebar so it fills the window.
import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Braces,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  FileText,
  Gauge,
  Info,
  KeyRound,
  ListOrdered,
  Rocket,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  Users,
  Wallet,
  Webhook,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Page = { id: string; title: string; badge?: string; pages?: Page[] }
type Item = { id: string; title: string; icon: typeof FileText; badge?: string; pages?: Page[] }
type Section = { id: string; title: string; items: Item[] }

const ACTIVE = "schedules"

const SECTIONS: Section[] = [
  {
    id: "start",
    title: "Get started",
    items: [
      { id: "intro", title: "Introduction", icon: BookOpen },
      { id: "quickstart", title: "Quickstart", icon: Rocket },
      { id: "auth", title: "Authentication", icon: KeyRound, badge: "Updated" },
    ],
  },
  {
    id: "guides",
    title: "Guides",
    items: [
      {
        id: "invoices",
        title: "Invoices",
        icon: FileText,
        pages: [
          { id: "create", title: "Create an invoice" },
          { id: "taxes", title: "Taxes and discounts" },
          {
            id: "reminders",
            title: "Reminders",
            pages: [
              { id: "schedules", title: "Schedules" },
              { id: "templates", title: "Email templates" },
              { id: "quiet-hours", title: "Quiet hours", badge: "New" },
            ],
          },
          { id: "partial", title: "Partial payments", badge: "New" },
          { id: "credit-notes", title: "Credit notes" },
        ],
      },
      {
        id: "payments",
        title: "Payments",
        icon: Wallet,
        pages: [
          { id: "links", title: "Payment links" },
          { id: "refunds", title: "Refunds" },
          { id: "payouts", title: "Payouts" },
        ],
      },
      {
        id: "clients",
        title: "Clients",
        icon: Users,
        pages: [
          { id: "import", title: "Import clients" },
          { id: "portal", title: "Client portal" },
        ],
      },
      {
        id: "webhooks",
        title: "Webhooks",
        icon: Webhook,
        badge: "Beta",
        pages: [
          { id: "events", title: "Events" },
          { id: "secrets", title: "Signing secrets" },
          { id: "retries", title: "Retries and failures" },
        ],
      },
    ],
  },
  {
    id: "api",
    title: "API reference",
    items: [
      { id: "api-overview", title: "Overview", icon: Braces },
      { id: "errors", title: "Errors", icon: TriangleAlert },
      { id: "pagination", title: "Pagination", icon: ListOrdered },
      { id: "rate-limits", title: "Rate limits", icon: Gauge },
    ],
  },
]

// Everything that can fold, and the path to the open page, which starts unfolded.
const ALL_IDS = SECTIONS.flatMap((s) => [s.id, ...s.items.flatMap((i) => (i.pages ? [i.id, ...i.pages.filter((p) => p.pages).map((p) => p.id)] : []))])
const START_OPEN = ["start", "guides", "invoices", "reminders"]

const VERSIONS = [
  { value: "3.2", label: "Version 3.2", note: "Latest" },
  { value: "3.1", label: "Version 3.1", note: "Supported until March 2027" },
  { value: "2.9", label: "Version 2.9", note: "Legacy" },
]

// Height animation for every folding panel; skipped when the visitor prefers less motion.
const PANEL = "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"

const SCHEDULE = [
  { when: "3 days before", email: "A friendly heads-up", on: true },
  { when: "On the due date", email: "Payment is due today", on: true },
  { when: "7 days after", email: "First reminder", on: true },
  { when: "14 days after", email: "Second reminder, with the late fee", on: false },
]

export default function SidebarNested() {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(START_OPEN))
  const [version, setVersion] = React.useState("3.2")

  const toggle = (id: string, isOpen: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (isOpen) next.add(id)
      else next.delete(id)
      return next
    })
  const anyOpen = open.size > 0

  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border bg-background">
      <Sidebar className="absolute h-full">
        <SidebarHeader>
          <VersionSwitcher version={version} onChange={setVersion} />
        </SidebarHeader>

        <SidebarContent>
          {SECTIONS.map((section) => (
            <Collapsible
              key={section.id}
              open={open.has(section.id)}
              onOpenChange={(o) => toggle(section.id, o)}
              className="group/section"
              render={<SidebarGroup />}
            >
              <SidebarGroupLabel
                render={<CollapsibleTrigger />}
                className="w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {section.title}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/section:rotate-90 motion-reduce:transition-none" />
              </SidebarGroupLabel>
              <CollapsibleContent className={PANEL}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) =>
                      item.pages ? (
                        <FoldingItem key={item.id} item={item} open={open} toggle={toggle} />
                      ) : (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton render={<a href="#" />}>
                            <item.icon />
                            <span className="truncate">{item.title}</span>
                            {item.badge ? (
                              <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[10px]">
                                {item.badge}
                              </Badge>
                            ) : null}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ),
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" className="text-muted-foreground" onClick={() => setOpen(anyOpen ? new Set() : new Set(ALL_IDS))}>
                {anyOpen ? <ChevronsDownUp /> : <ChevronsUpDown />}
                <span>{anyOpen ? "Collapse all" : "Expand all"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              {["Guides", "Invoices", "Reminders"].map((c, i) => (
                <React.Fragment key={c}>
                  <BreadcrumbItem className={cn("hidden", i === 2 ? "sm:inline-flex" : "md:inline-flex")}>
                    <BreadcrumbLink href="#">{c}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className={cn("hidden", i === 2 ? "sm:list-item" : "md:list-item")} />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>Schedules</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge variant="outline" className="ml-auto shrink-0">
            v{version}
          </Badge>
        </header>
        <div className="@container/main flex-1 overflow-y-auto">
          <Article version={version} onLatest={() => setVersion("3.2")} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function VersionSwitcher({ version, onChange }: { version: string; onChange: (v: string) => void }) {
  const current = VERSIONS.find((v) => v.value === version) ?? VERSIONS[0]
  return (
    <SidebarMenu className="min-w-0 flex-1">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-popup-open:bg-sidebar-accent" />}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen />
            </span>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-semibold">Orbit docs</span>
              <span className="truncate text-xs text-muted-foreground">{current.label}</span>
            </span>
            <ChevronsUpDown className="ml-auto text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Docs version</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={version} onValueChange={(v) => onChange(String(v))}>
                {VERSIONS.map((v) => (
                  <DropdownMenuRadioItem key={v.value} value={v.value} closeOnClick>
                    <span className="grid leading-tight">
                      <span>{v.label}</span>
                      <span className="text-xs text-muted-foreground">{v.note}</span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function FoldingItem({ item, open, toggle }: { item: Item; open: Set<string>; toggle: (id: string, open: boolean) => void }) {
  return (
    <Collapsible open={open.has(item.id)} onOpenChange={(o) => toggle(item.id, o)} className="group/item" render={<SidebarMenuItem />}>
      <CollapsibleTrigger render={<SidebarMenuButton />}>
        <item.icon />
        <span className="truncate">{item.title}</span>
        {item.badge ? (
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[10px]">
            {item.badge}
          </Badge>
        ) : null}
        <ChevronRight
          className={cn(
            "text-muted-foreground transition-transform duration-200 group-data-open/item:rotate-90 motion-reduce:transition-none",
            !item.badge && "ml-auto",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className={PANEL}>
        <SidebarMenuSub>
          {item.pages?.map((page) =>
            page.pages ? (
              <Collapsible
                key={page.id}
                open={open.has(page.id)}
                onOpenChange={(o) => toggle(page.id, o)}
                className="group/sub"
                render={<SidebarMenuSubItem />}
              >
                <CollapsibleTrigger render={<SidebarMenuSubButton render={<button type="button" />} className="w-full" />}>
                  <span className="truncate">{page.title}</span>
                  <ChevronRight className="ml-auto text-muted-foreground! transition-transform duration-200 group-data-open/sub:rotate-90 motion-reduce:transition-none" />
                </CollapsibleTrigger>
                <CollapsibleContent className={PANEL}>
                  <SidebarMenuSub className="mr-0 pr-0">
                    {page.pages.map((child) => (
                      <PageLink key={child.id} page={child} />
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <PageLink key={page.id} page={page} />
            ),
          )}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function PageLink({ page }: { page: Page }) {
  const active = page.id === ACTIVE
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton href="#" isActive={active} aria-current={active ? "page" : undefined} className="data-active:font-medium">
        <span className="truncate">{page.title}</span>
        {page.badge ? (
          <Badge variant="secondary" className="ml-auto h-4 shrink-0 px-1.5 text-[10px]">
            {page.badge}
          </Badge>
        ) : null}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

const TOC = [
  { id: "how", title: "How schedules work" },
  { id: "default", title: "The default schedule" },
  { id: "change", title: "Change the schedule" },
]

function Article({ version, onLatest }: { version: string; onLatest: () => void }) {
  const [helpful, setHelpful] = React.useState<null | boolean>(null)
  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-4 py-6 sm:px-8 sm:py-8 @3xl/main:grid-cols-[minmax(0,1fr)_11rem]">
      <article className="min-w-0 text-sm leading-relaxed">
        {version !== "3.2" ? (
          <Alert className="mb-6">
            <Info />
            <AlertTitle>You&apos;re reading the docs for version {version}</AlertTitle>
            <AlertDescription>
              Some settings moved in 3.2.{" "}
              <button type="button" onClick={onLatest} className="font-medium text-foreground underline underline-offset-4">
                Read the latest
              </button>
            </AlertDescription>
          </Alert>
        ) : null}
        <p className="text-xs text-muted-foreground">Guides · Updated Nov 18</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Reminder schedules</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Orbit emails your client when an invoice is about to fall due and keeps nudging, politely, until it&apos;s paid.
        </p>

        <h3 id="how" className="mt-8 scroll-mt-4 text-lg font-semibold">
          How schedules work
        </h3>
        <p className="mt-2">
          A schedule is a list of moments, counted from each invoice&apos;s due date. At each one, Orbit sends the matching email template. Reminders
          stop by themselves once the invoice is paid, voided or marked as sent by post.
        </p>

        <h3 id="default" className="mt-8 scroll-mt-4 text-lg font-semibold">
          The default schedule
        </h3>
        <div className="mt-3 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-3">When</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="pr-3 text-right">Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCHEDULE.map((r) => (
                <TableRow key={r.when}>
                  <TableCell className="pl-3">{r.when}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="pr-3 text-right">{r.on ? "On" : "Off"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 id="change" className="mt-8 scroll-mt-4 text-lg font-semibold">
          Change the schedule
        </h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>Open Settings, then Reminders.</li>
          <li>Pick a moment to edit, or add one with Add a reminder.</li>
          <li>Choose the template it sends, then save. Invoices already sent pick up the change.</li>
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t pt-6">
          {helpful === null ? (
            <>
              <span className="text-muted-foreground">Was this page helpful?</span>
              <Button variant="outline" size="sm" onClick={() => setHelpful(true)}>
                <ThumbsUp /> Yes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setHelpful(false)}>
                <ThumbsDown /> No
              </Button>
            </>
          ) : (
            <p role="status" className="text-muted-foreground">
              {helpful ? "Thanks, glad it helped." : "Thanks. We read every answer and use it to fix the docs."}
            </p>
          )}
        </div>

        <nav aria-label="Previous and next page" className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#" className="rounded-lg border p-3 transition-colors hover:bg-muted">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5" /> Previous
            </span>
            <span className="mt-0.5 block font-medium">Taxes and discounts</span>
          </a>
          <a href="#" className="rounded-lg border p-3 text-right transition-colors hover:bg-muted">
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Next <ArrowRight className="size-3.5" />
            </span>
            <span className="mt-0.5 block font-medium">Email templates</span>
          </a>
        </nav>
      </article>

      <nav aria-label="On this page" className="hidden @3xl/main:block">
        <div className="sticky top-0">
          <p className="text-xs font-medium text-muted-foreground">On this page</p>
          <ul className="mt-2 space-y-2 text-sm">
            {TOC.map((t, i) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={cn("transition-colors hover:text-foreground", i === 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
