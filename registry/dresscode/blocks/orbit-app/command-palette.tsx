"use client"

// Ctrl K / ⌘K: jump to any page, invoice or client, or run an action. With an empty query it shows a
// few of each; typing searches all of them.
import { ArrowRight, BellRing, ChartColumn, Download, FilePlus2, FileText, LayoutDashboard, Repeat, Settings, UserPlus, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

import { useOrbit } from "./context"
import { CLIENTS, INVOICES, OVERDUE, clientById, money } from "./data"
import type { Screen } from "./screens"
import { ClientMark, StatusPill } from "./ui"

const PAGES: { screen: Screen; label: string; icon: typeof FileText }[] = [
  { screen: "overview", label: "Overview", icon: LayoutDashboard },
  { screen: "invoices", label: "Invoices", icon: FileText },
  { screen: "recurring", label: "Recurring invoices", icon: Repeat },
  { screen: "clients", label: "Clients", icon: Users },
  { screen: "payments", label: "Payments", icon: Wallet },
  { screen: "reports", label: "Reports", icon: ChartColumn },
  { screen: "settings", label: "Settings", icon: Settings },
]

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { href, openDialog } = useOrbit()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const searching = query.trim().length > 0

  const close = (o: boolean) => {
    onOpenChange(o)
    if (!o) setQuery("")
  }
  const run = (fn: () => void) => {
    close(false)
    fn()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={close}
      title="Search Orbit"
      description="Jump to a page, an invoice or a client, or run an action."
      className="dc-card top-[18%] ring-0 sm:max-w-[580px]"
    >
      <Command loop className="rounded-none! bg-transparent p-1.5">
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search invoices, clients, pages and actions…" className="h-9 text-[14px]" />
        <CommandList className="mt-1 max-h-[min(440px,62vh)]">
          <CommandEmpty>Nothing matches “{query}”.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="new invoice create bill" onSelect={() => run(() => router.push(href("invoice-new")))}>
              <FilePlus2 /> New invoice
            </CommandItem>
            <CommandItem value="add client new customer" onSelect={() => run(() => openDialog("client"))}>
              <UserPlus /> Add a client
            </CommandItem>
            <CommandItem value="record payment received" onSelect={() => run(() => openDialog("payment"))}>
              <Wallet /> Record a payment
            </CommandItem>
            <CommandItem
              value="send reminders overdue late"
              onSelect={() => run(() => toast.success(`${OVERDUE.length} reminders sent`, { description: OVERDUE.map((i) => clientById(i.clientId).name).join(" and ") }))}
            >
              <BellRing /> Remind {OVERDUE.length} late clients
            </CommandItem>
            {searching ? (
              <>
                <CommandItem value="invite teammate team member" onSelect={() => run(() => openDialog("invite"))}>
                  <UserPlus /> Invite a teammate
                </CommandItem>
                <CommandItem value="export csv download invoices" onSelect={() => run(() => toast("Exporting 42 invoices to CSV…"))}>
                  <Download /> Export invoices to CSV
                </CommandItem>
              </>
            ) : null}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Go to">
            {PAGES.map(({ screen, label, icon: Icon }) => (
              <CommandItem key={screen} value={`go ${label}`} onSelect={() => run(() => router.push(href(screen)))}>
                <Icon /> {label}
                <ArrowRight className="ml-auto size-3.5 text-muted-foreground opacity-0 group-data-selected/command-item:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Invoices">
            {(searching ? INVOICES : INVOICES.slice(0, 4)).map((inv) => {
              const c = clientById(inv.clientId)
              return (
                <CommandItem key={inv.id} value={`${inv.id} ${c.name} ${inv.status}`} onSelect={() => run(() => router.push(href("invoice", { id: inv.id })))}>
                  <FileText />
                  <span className="dc-num font-medium">{inv.id}</span>
                  <span className="truncate text-muted-foreground">{c.name}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <StatusPill status={inv.status} />
                    <span className="dc-num w-[84px] text-right">{money(inv.amount)}</span>
                  </span>
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Clients">
            {(searching ? CLIENTS : CLIENTS.slice(0, 4)).map((c) => (
              <CommandItem key={c.id} value={`${c.name} ${c.contact} ${c.email}`} onSelect={() => run(() => router.push(href("client", { id: c.id })))}>
                <ClientMark name={c.name} className="size-6 text-[9px]" />
                <span className="font-medium">{c.name}</span>
                <span className="truncate text-muted-foreground">{c.contact}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="mt-1 flex items-center gap-4 border-t border-border px-3 pt-2 pb-1 text-[12px] text-muted-foreground">
          <span>↑↓ to move</span>
          <span>Enter to open</span>
          <span className="ml-auto">Esc to close</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
