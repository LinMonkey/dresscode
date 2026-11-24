"use client"

// Invoices: the data table. Status tabs with counts, search, filters (client, date issued), sortable
// columns, pages, bulk select with actions (remind, download, mark paid, delete) and a row menu.
// On phones the table becomes a list.
import {
  BellRing,
  Copy,
  Download,
  Eye,
  FileText,
  FilePlus2,
  ListFilter,
  MoreHorizontal,
  Pencil,
  SearchX,
  Trash2,
  Wallet,
  X,
  CircleCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { useOrbit, useParam } from "./context"
import { Head, Pager, SearchBox, SortHead, type Sort } from "./controls"
import { CLIENTS, INVOICES, TODAY_DAY, clientById, money, type Invoice, type InvoiceStatus } from "./data"
import { ClientMark, EmptyState, PageHeader, Panel, StatusPill, flat } from "./ui"

type Tab = "All" | InvoiceStatus
const TABS: { id: Tab; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Draft", label: "Drafts" },
  { id: "Due", label: "Due" },
  { id: "Overdue", label: "Overdue" },
  { id: "Paid", label: "Paid" },
]
const ISSUED = ["Any time", "Last 30 days", "Last 90 days", "This year"] as const
type Issued = (typeof ISSUED)[number]
type Col = "number" | "client" | "issued" | "due" | "amount"

const BILLED_CLIENTS = CLIENTS.filter((c) => INVOICES.some((i) => i.clientId === c.id))

export function InvoicesScreen() {
  return (
    <Suspense fallback={<Invoices initial="All" />}>
      <InvoicesFromQuery />
    </Suspense>
  )
}

function InvoicesFromQuery() {
  const s = useParam("status")
  const client = useParam("client")
  const initial = TABS.some((t) => t.id === s) ? (s as Tab) : "All"
  const clientIds = client && BILLED_CLIENTS.some((c) => c.id === client) ? [client] : []
  return <Invoices key={`${initial}-${client}`} initial={initial} initialClients={clientIds} />
}

const compare: Record<Col, (a: Invoice, b: Invoice) => number> = {
  number: (a, b) => a.id.localeCompare(b.id),
  client: (a, b) => clientById(a.clientId).name.localeCompare(clientById(b.clientId).name),
  issued: (a, b) => a.issuedDay - b.issuedDay,
  due: (a, b) => a.dueDay - b.dueDay,
  amount: (a, b) => a.amount - b.amount,
}

function Invoices({ initial, initialClients = [] }: { initial: Tab; initialClients?: string[] }) {
  const { href, openDialog } = useOrbit()
  const router = useRouter()
  const [rows, setRows] = useState(INVOICES)
  const [tab, setTab] = useState<Tab>(initial)
  const [query, setQuery] = useState("")
  const [clients, setClients] = useState<string[]>(initialClients)
  const [issued, setIssued] = useState<Issued>("Any time")
  const [sort, setSort] = useState<Sort<Col>>({ key: "number", dir: "desc" })
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState<string[] | null>(null)

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { All: rows.length, Draft: 0, Due: 0, Overdue: 0, Paid: 0 }
    rows.forEach((r) => c[r.status]++)
    return c
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const since = issued === "Last 30 days" ? TODAY_DAY - 30 : issued === "Last 90 days" ? TODAY_DAY - 90 : issued === "This year" ? 0 : -1
    const list = rows.filter((r) => {
      if (tab !== "All" && r.status !== tab) return false
      if (clients.length && !clients.includes(r.clientId)) return false
      if (since >= 0 && r.issuedDay < since) return false
      if (!q) return true
      const c = clientById(r.clientId)
      return `${r.id} ${c.name} ${c.contact} ${r.amount}`.toLowerCase().includes(q)
    })
    const dir = sort.dir === "asc" ? 1 : -1
    return list.sort((a, b) => compare[sort.key](a, b) * dir)
  }, [rows, tab, clients, issued, query, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages - 1)
  const shown = filtered.slice(current * pageSize, (current + 1) * pageSize)
  const pageIds = shown.map((r) => r.id)
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.includes(id))
  const someOnPage = pageIds.some((id) => selected.includes(id))
  const selectedRows = rows.filter((r) => selected.includes(r.id))
  const selectedTotal = selectedRows.reduce((s, r) => s + r.amount, 0)
  const filtersOn = clients.length > 0 || issued !== "Any time"

  const reset = () => setPage(0)
  const toggle = (id: string, on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)))

  const markPaid = (ids: string[]) => {
    const before = rows
    const open = rows.filter((r) => ids.includes(r.id) && r.status !== "Paid")
    if (!open.length) return toast("Those invoices are already paid.")
    setRows((all) => all.map((r) => (ids.includes(r.id) && r.status !== "Paid" ? { ...r, status: "Paid", note: "Paid Nov 24", paidOn: "Nov 24" } : r)))
    setSelected([])
    toast.success(open.length === 1 ? `${open[0].id} marked as paid` : `${open.length} invoices marked as paid`, {
      description: money(open.reduce((s, r) => s + r.amount, 0)),
      action: { label: "Undo", onClick: () => setRows(before) },
    })
  }
  const remind = (ids: string[]) => {
    const open = rows.filter((r) => ids.includes(r.id) && (r.status === "Due" || r.status === "Overdue"))
    if (!open.length) return toast("Only open invoices get reminders.", { description: "Drafts and paid invoices were skipped." })
    setSelected([])
    toast.success(open.length === 1 ? `Reminder sent to ${clientById(open[0].clientId).name}` : `${open.length} reminders sent`, {
      description: open.length < ids.length ? `${ids.length - open.length} skipped: not open.` : "With a payment link and the PDF.",
    })
  }
  const remove = (ids: string[]) => {
    const before = rows
    setRows((all) => all.filter((r) => !ids.includes(r.id)))
    setSelected((s) => s.filter((x) => !ids.includes(x)))
    toast(ids.length === 1 ? `${ids[0]} deleted` : `${ids.length} invoices deleted`, { action: { label: "Undo", onClick: () => setRows(before) } })
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Invoices"
        description={`${counts.All} invoices · ${money(rows.filter((r) => r.status === "Due" || r.status === "Overdue").reduce((s, r) => s + r.amount, 0))} outstanding`}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <Download /> Export
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => toast(`Exporting ${filtered.length} invoices to CSV…`)}>CSV for spreadsheets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast(`Bundling ${filtered.length} PDFs into a zip…`)}>PDFs in a zip</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Exporting in QuickBooks format…")}>QuickBooks or Xero file</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="font-semibold" nativeButton={false} render={<Link href={href("invoice-new")} />}>
              <FilePlus2 /> New invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            { tab: "Overdue", label: "Overdue", tone: "danger" },
            { tab: "Due", label: "Due soon" },
            { tab: "Draft", label: "Drafts" },
            { tab: "Paid", label: "Paid" },
          ] as { tab: InvoiceStatus; label: string; tone?: "danger" }[]
        ).map((s) => {
          const list = rows.filter((r) => r.status === s.tab)
          const active = tab === s.tab
          return (
            <button
              key={s.tab}
              type="button"
              onClick={() => {
                setTab(active ? "All" : s.tab)
                reset()
              }}
              aria-pressed={active}
              className={cn(
                "dc-card p-4 text-left transition-[box-shadow,transform] outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-ring/40",
                active && "ring-2 ring-[color:var(--dc-accent)]",
              )}
            >
              <span className="flex items-center justify-between text-[13px] text-muted-foreground">
                {s.label}
                <span className={cn("dc-pill", s.tone ? "dc-pill-danger" : "dc-pill-muted")}>{list.length}</span>
              </span>
              <span className={cn("dc-num mt-1.5 block text-[22px] font-semibold tracking-tight", s.tone && list.length && "text-[color:var(--dc-danger)]")}>
                {money(list.reduce((t, r) => t + r.amount, 0))}
              </span>
            </button>
          )
        })}
      </div>

      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 xl:flex-row xl:flex-wrap xl:items-center">
          <div className="-mx-1 shrink-0 overflow-x-auto px-1">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as Tab)
                reset()
              }}
            >
              <TabsList className="h-9">
                {TABS.map((t) => (
                  <TabsTrigger key={t.id} value={t.id} className="h-full px-3 text-[13px]">
                    {t.label}
                    <span className="dc-num rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] px-1.5 text-[11px] leading-4 text-muted-foreground">
                      {counts[t.id]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {selected.length ? (
            <div className="flex flex-1 flex-wrap items-center gap-2 rounded-[var(--radius)] bg-[color:color-mix(in_oklab,var(--dc-accent)_8%,transparent)] px-3 py-1.5" role="region" aria-label="Bulk actions">
              <p className="mr-auto text-[13px]">
                <span className="font-semibold">{selected.length} selected</span>
                <span className="text-muted-foreground"> · </span>
                <span className="dc-num">{money(selectedTotal)}</span>
              </p>
              <Button variant="outline" size="sm" onClick={() => remind(selected)}>
                <BellRing /> Remind
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast(`Downloading ${selected.length} PDFs…`)}>
                <Download /> PDFs
              </Button>
              <Button variant="outline" size="sm" onClick={() => markPaid(selected)}>
                <CircleCheck /> Mark paid
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setConfirm(selected)}>
                <Trash2 /> Delete
              </Button>
              <Button variant="ghost" size="icon-sm" className={flat} aria-label="Clear selection" onClick={() => setSelected([])}>
                <X />
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end">
              <SearchBox
                value={query}
                onChange={(v) => {
                  setQuery(v)
                  reset()
                }}
                placeholder="Search number, client or amount"
                label="Search invoices"
                className="w-full sm:w-72"
              />
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="h-8" />}>
                  <ListFilter /> Filters
                  {filtersOn ? <span className="dc-num rounded-full bg-primary px-1.5 text-[11px] leading-4 text-primary-foreground">{clients.length + (issued !== "Any time" ? 1 : 0)}</span> : null}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[min(420px,var(--available-height))] w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Issued</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={issued}
                      onValueChange={(v) => {
                        setIssued(v as Issued)
                        reset()
                      }}
                    >
                      {ISSUED.map((i) => (
                        <DropdownMenuRadioItem key={i} value={i}>
                          {i}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Client</DropdownMenuLabel>
                    {BILLED_CLIENTS.map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        checked={clients.includes(c.id)}
                        onCheckedChange={(on) => {
                          setClients((all) => (on ? [...all, c.id] : all.filter((x) => x !== c.id)))
                          reset()
                        }}
                      >
                        {c.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {issued !== "Any time" ? (
                <FilterChip label={`Issued: ${issued.toLowerCase()}`} onClear={() => setIssued("Any time")} />
              ) : null}
              {clients.map((id) => (
                <FilterChip key={id} label={clientById(id).name} onClear={() => setClients((all) => all.filter((x) => x !== id))} />
              ))}
              {filtersOn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(flat, "text-muted-foreground")}
                  onClick={() => {
                    setClients([])
                    setIssued("Any time")
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          )}
          {allOnPage && filtered.length > pageIds.length && selected.length < filtered.length ? (
            <p className="basis-full text-[13px] text-muted-foreground">
              All {pageIds.length} on this page are selected.{" "}
              <button type="button" className="font-semibold text-[color:var(--dc-accent)] hover:underline" onClick={() => setSelected(filtered.map((r) => r.id))}>
                Select all {filtered.length} {tab === "All" ? "" : `${tab.toLowerCase()} `}invoices
              </button>
            </p>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No invoices match"
            body={query ? `Nothing for “${query}” with these filters. Check the spelling or widen the filters.` : "Nothing with these filters. Try another status or clear them."}
            actions={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("")
                  setClients([])
                  setIssued("Any time")
                  setTab("All")
                }}
              >
                Clear search and filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="hidden sm:block">
              <Table className="text-[14px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <Head className="w-10 pl-4">
                      <Checkbox
                        aria-label="Select all on this page"
                        checked={allOnPage}
                        indeterminate={someOnPage && !allOnPage}
                        onCheckedChange={(on) => setSelected((s) => (on ? [...new Set([...s, ...pageIds])] : s.filter((x) => !pageIds.includes(x))))}
                      />
                    </Head>
                    <SortHead label="Invoice" column="number" sort={sort} onSort={setSort} />
                    <SortHead label="Client" column="client" sort={sort} onSort={setSort} />
                    <SortHead label="Issued" column="issued" sort={sort} onSort={setSort} className="hidden lg:table-cell" />
                    <SortHead label="Due" column="due" sort={sort} onSort={setSort} />
                    <Head>Status</Head>
                    <SortHead label="Amount" column="amount" sort={sort} onSort={setSort} align="right" />
                    <Head className="w-12 pr-4">
                      <span className="sr-only">Actions</span>
                    </Head>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((inv) => {
                    const c = clientById(inv.clientId)
                    const on = selected.includes(inv.id)
                    return (
                      <TableRow key={inv.id} data-state={on ? "selected" : undefined} className="cursor-pointer" onClick={() => router.push(href("invoice", { id: inv.id }))}>
                        <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox aria-label={`Select ${inv.id}`} checked={on} onCheckedChange={(v) => toggle(inv.id, v)} />
                        </TableCell>
                        <TableCell>
                          <Link href={href("invoice", { id: inv.id })} onClick={(e) => e.stopPropagation()} className="dc-num font-medium hover:underline">
                            {inv.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2.5">
                            <ClientMark name={c.name} className="size-7 text-[10px]" />
                            <span className="min-w-0">
                              <span className="block max-w-[200px] truncate font-medium">{c.name}</span>
                              <span className="block max-w-[200px] truncate text-[12px] text-muted-foreground">{c.email}</span>
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">{inv.issued}</TableCell>
                        <TableCell>
                          <span className="block">{inv.due}</span>
                          <span className={cn("block text-[12px]", inv.status === "Overdue" ? "font-medium text-[color:var(--dc-danger)]" : "text-muted-foreground")}>{inv.note}</span>
                        </TableCell>
                        <TableCell>
                          <StatusPill status={inv.status} />
                        </TableCell>
                        <TableCell className="dc-num text-right font-medium">{money(inv.amount)}</TableCell>
                        <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <RowMenu
                            inv={inv}
                            onView={() => router.push(href("invoice", { id: inv.id }))}
                            onEdit={() => router.push(href("invoice-new"))}
                            onRemind={() => remind([inv.id])}
                            onPaid={() => markPaid([inv.id])}
                            onRecord={() => openDialog("payment")}
                            onDelete={() => setConfirm([inv.id])}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <ul className="divide-y divide-border sm:hidden">
              {shown.map((inv) => {
                const c = clientById(inv.clientId)
                return (
                  <li key={inv.id}>
                    <Link href={href("invoice", { id: inv.id })} className="flex items-center gap-3 px-4 py-3 active:bg-muted">
                      <ClientMark name={c.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{c.name}</span>
                        <span className={cn("block truncate text-[12px]", inv.status === "Overdue" ? "text-[color:var(--dc-danger)]" : "text-muted-foreground")}>
                          {inv.id} · {inv.note}
                        </span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="dc-num text-[15px] font-semibold">{money(inv.amount)}</span>
                        <StatusPill status={inv.status} />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Pager
              page={current}
              pageSize={pageSize}
              total={filtered.length}
              onPage={setPage}
              onPageSize={(n) => {
                setPageSize(n)
                reset()
              }}
              noun="invoices"
            />
          </>
        )}
      </Panel>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">
              {confirm && confirm.length > 1 ? `Delete ${confirm.length} invoices?` : `Delete ${confirm?.[0] ?? "this invoice"}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.some((id) => rows.find((r) => r.id === id)?.status === "Paid")
                ? "Paid invoices stay in your reports as payments, but the invoice itself is gone. Clients keep the copy they were sent."
                : "Clients keep the copy they were sent, and the payment link stops working."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirm) remove(confirm)
                setConfirm(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-muted/60 pr-1 pl-2.5 text-[12px] font-medium">
      {label}
      <button type="button" aria-label={`Remove filter ${label}`} onClick={onClear} className="grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
        <X className="size-3" />
      </button>
    </span>
  )
}

function RowMenu({
  inv,
  onView,
  onEdit,
  onRemind,
  onPaid,
  onRecord,
  onDelete,
}: {
  inv: Invoice
  onView: () => void
  onEdit: () => void
  onRemind: () => void
  onPaid: () => void
  onRecord: () => void
  onDelete: () => void
}) {
  const open = inv.status === "Due" || inv.status === "Overdue"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className={cn(flat, "text-muted-foreground")} aria-label={`Actions for ${inv.id}`} />}>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onView}>
          <Eye /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil /> {inv.status === "Draft" ? "Edit draft" : "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success(`${inv.id} duplicated`, { description: "The copy is a draft dated today." })}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        {open ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemind}>
              <BellRing /> Send reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRecord}>
              <Wallet /> Record payment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPaid}>
              <CircleCheck /> Mark as paid
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast(`Downloading ${inv.id}.pdf`)}>
          <FileText /> Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

