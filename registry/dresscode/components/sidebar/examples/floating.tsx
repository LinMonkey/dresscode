"use client"

// A floating sidebar (it hovers off the edge with its own border and shadow) for a projects app:
// a search field that filters the links ("/" jumps to it), projects with a menu each and an add button,
// and a plan card in the footer that counts against the free limit and can be dismissed.
// It sits in a 640px frame here: in your app, drop the frame classes on SidebarProvider and
// "absolute h-full" on Sidebar so it fills the window.
import * as React from "react"
import {
  Archive,
  CalendarDays,
  CircleCheck,
  House,
  Inbox,
  Link2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const WORKSPACE = [
  { title: "Home", icon: House },
  { title: "My tasks", icon: CircleCheck, count: 5 },
  { title: "Inbox", icon: Inbox, count: 2 },
  { title: "Calendar", icon: CalendarDays },
]

// chart-2 is the faintest in most themes, so it comes last.
const COLORS = ["bg-(--chart-1)", "bg-(--chart-5)", "bg-(--chart-3)", "bg-(--chart-4)", "bg-(--chart-2)"]
type Project = { id: string; title: string; color: string }

const INITIAL_PROJECTS: Project[] = [
  { id: "website", title: "Website refresh", color: COLORS[0] },
  { id: "mobile", title: "Mobile app v2", color: COLORS[1] },
  { id: "brand", title: "Brand guidelines", color: COLORS[2] },
  { id: "research", title: "Customer research", color: COLORS[3] },
]
const ACTIVE = "website"
const FREE_LIMIT = 5

type Task = { id: string; title: string; section: "In progress" | "To do" | "Done"; who: string; due: string; tag: string }

const TASKS: Task[] = [
  { id: "t1", title: "Write the homepage copy", section: "In progress", who: "AL", due: "Nov 26", tag: "Copy" },
  { id: "t2", title: "Design the pricing page", section: "In progress", who: "TO", due: "Nov 28", tag: "Design" },
  { id: "t3", title: "Redirect the old blog URLs", section: "In progress", who: "ML", due: "Dec 2", tag: "Build" },
  { id: "t4", title: "Pick photos for the case studies", section: "To do", who: "AL", due: "Dec 3", tag: "Design" },
  { id: "t5", title: "Review the docs navigation", section: "To do", who: "TO", due: "Dec 5", tag: "Docs" },
  { id: "t6", title: "Test every form on a phone", section: "To do", who: "ML", due: "Dec 8", tag: "Testing" },
  { id: "t7", title: "Agree on the sitemap", section: "Done", who: "JR", due: "Nov 12", tag: "Planning" },
  { id: "t8", title: "Audit the current pages", section: "Done", who: "AL", due: "Nov 15", tag: "Planning" },
]

export default function SidebarFloating() {
  return (
    <SidebarProvider className="relative h-[640px] min-h-0 overflow-hidden rounded-xl border bg-background">
      <ProjectsSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4 data-vertical:self-center" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink href="#">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:list-item" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">Website refresh</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-3">
            <AvatarGroup role="group" className="hidden sm:flex" aria-label="5 people on this project">
              {["AL", "TO", "ML"].map((i) => (
                <Avatar key={i}>
                  <AvatarFallback className="text-xs">{i}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount className="text-xs">+2</AvatarGroupCount>
            </AvatarGroup>
            <Button variant="outline" size="sm">
              <Share2 /> Share
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ProjectPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ProjectsSidebar() {
  const { isMobile } = useSidebar()
  const [query, setQuery] = React.useState("")
  const [projects, setProjects] = React.useState(INITIAL_PROJECTS)
  const [planOpen, setPlanOpen] = React.useState(true)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // "/" jumps to the search field unless you are already typing somewhere.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable=true]")) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const q = query.trim().toLowerCase()
  const links = WORKSPACE.filter((l) => l.title.toLowerCase().includes(q))
  const found = projects.filter((p) => p.title.toLowerCase().includes(q))
  const atLimit = projects.length >= FREE_LIMIT

  const clearSearch = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const addProject = () => {
    if (atLimit) return
    const n = projects.filter((p) => p.title.startsWith("Untitled project")).length
    const used = new Set(projects.map((p) => p.color))
    setProjects([
      ...projects,
      { id: `p${Date.now()}`, title: n ? `Untitled project ${n + 1}` : "Untitled project", color: COLORS.find((c) => !used.has(c)) ?? COLORS[4] },
    ])
  }

  return (
    <Sidebar variant="floating" className="absolute h-full">
      <SidebarHeader className="gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">RS</span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Ruiz Studio</span>
                <span className="truncate text-xs text-muted-foreground">Team workspace</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="sidebar-floating-search" className="sr-only">
            Search pages and projects
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <SidebarInput
            ref={inputRef}
            id="sidebar-floating-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault()
                setQuery("")
              }
            }}
            placeholder="Search"
            autoComplete="off"
            className="pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-3.5"
            >
              <X />
            </button>
          ) : (
            <Kbd className="absolute top-1/2 right-1.5 -translate-y-1/2" aria-hidden="true">
              /
            </Kbd>
          )}
        </form>
      </SidebarHeader>

      <SidebarContent>
        {links.length ? (
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((l) => (
                  <SidebarMenuItem key={l.title}>
                    <SidebarMenuButton render={<a href="#" />}>
                      <l.icon />
                      <span>{l.title}</span>
                    </SidebarMenuButton>
                    {l.count ? <SidebarMenuBadge>{l.count}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {found.length || !q ? (
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction
              onClick={addProject}
              disabled={atLimit}
              aria-label={atLimit ? "New project (free plan limit reached)" : "New project"}
              title={atLimit ? "Free plan limit reached" : "New project"}
              className="disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {found.map((p) => (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton isActive={p.id === ACTIVE} render={<a href="#" aria-current={p.id === ACTIVE ? "page" : undefined} />}>
                      <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className={cn("size-2.5 rounded-[3px] ring-1 ring-foreground/15 ring-inset", p.color)} />
                      </span>
                      <span>{p.title}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<SidebarMenuAction showOnHover aria-label={`More for ${p.title}`} />}>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"} className="w-48">
                        <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${p.id}`).catch(() => {})}>
                          <Link2 /> Copy link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={p.id === ACTIVE}
                          onClick={() => setProjects((all) => all.filter((x) => x.id !== p.id))}
                        >
                          <Archive /> Archive project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
                {!projects.length ? <li className="px-2 py-1.5 text-xs text-muted-foreground">No projects yet.</li> : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {q && !links.length && !found.length ? (
          <div role="status" className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <Search className="size-5 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">No matches for “{query.trim()}”</p>
            <p className="text-xs text-muted-foreground">Try a project name, or a page like Inbox.</p>
            <Button variant="outline" size="sm" className="mt-1" onClick={clearSearch}>
              Clear search
            </Button>
          </div>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {planOpen ? (
          <section aria-labelledby="sidebar-floating-plan" className="relative rounded-lg border bg-background p-3 text-sm">
            <button
              type="button"
              onClick={() => setPlanOpen(false)}
              aria-label="Dismiss"
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-3.5"
            >
              <X />
            </button>
            <h3 id="sidebar-floating-plan" className="font-medium">
              Free plan
            </h3>
            <p className="mt-0.5 pr-6 text-xs text-muted-foreground">
              {atLimit ? "All 5 projects used. Upgrade for unlimited projects and guests." : `${projects.length} of ${FREE_LIMIT} projects used`}
            </p>
            <Progress value={(projects.length / FREE_LIMIT) * 100} aria-label="Projects used" className="mt-2.5" />
            <Button size="sm" className="mt-3 w-full">
              <Sparkles /> Upgrade to Pro
            </Button>
          </section>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#" />}>
                <Sparkles />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                {projects.length}/{FREE_LIMIT}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

function ProjectPage() {
  const [done, setDone] = React.useState<Set<string>>(() => new Set(TASKS.filter((t) => t.section === "Done").map((t) => t.id)))
  const pct = Math.round((done.size / TASKS.length) * 100)
  const toggle = (id: string, on: boolean) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  return (
    <div className="flex flex-col gap-6 px-4 pt-2 pb-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Website refresh</h2>
            <Badge variant="secondary">On track</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">New marketing site and docs. Launches on January 15.</p>
        </div>
        <div className="w-full sm:w-56">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {done.size} of {TASKS.length} tasks done
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} aria-label="Project progress" className="mt-2" />
        </div>
      </div>

      {(["In progress", "To do", "Done"] as const).map((section) => {
        const tasks = TASKS.filter((t) => t.section === section)
        return (
          <section key={section} aria-labelledby={`sidebar-floating-${section}`}>
            <h3 id={`sidebar-floating-${section}`} className="mb-2 flex items-center gap-2 text-sm font-medium">
              {section}
              <span className="text-muted-foreground tabular-nums">{tasks.length}</span>
            </h3>
            <ul className="divide-y rounded-xl border bg-card text-card-foreground">
              {tasks.map((t) => {
                const checked = done.has(t.id)
                return (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                    <Checkbox id={`sidebar-floating-${t.id}`} checked={checked} onCheckedChange={(v) => toggle(t.id, v)} />
                    <label
                      htmlFor={`sidebar-floating-${t.id}`}
                      className={cn("min-w-0 flex-1 truncate text-sm", checked && "text-muted-foreground line-through")}
                    >
                      {t.title}
                    </label>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {t.tag}
                    </Badge>
                    <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">{t.due}</span>
                    <Avatar size="sm">
                      <AvatarFallback>{t.who}</AvatarFallback>
                    </Avatar>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
