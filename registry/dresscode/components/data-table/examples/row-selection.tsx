// Pick invoices with checkboxes (the header picks the page, shift-click picks a range) and act on
// them at once: send reminders for the unpaid ones, export a CSV, or delete after a confirm. Each
// row also has its own actions menu. What happened shows above the table, with an undo for deletes.
"use client"

import * as React from "react"
import type { ColumnDef, Table } from "@tanstack/react-table"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FilePenLineIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { DataTable, selectColumn } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"

type Status = "Paid" | "Due" | "Overdue" | "Draft"

type Invoice = {
  id: string
  client: string
  email: string
  due: string
  status: Status
  amount: number
}

const CLIENTS = [
  ["Fernwood Studio", "mara@fernwood.studio"],
  ["Kato & Lee", "ken@katolee.com"],
  ["Juniper Labs", "theo@juniperlabs.dev"],
  ["Ola Bakery", "hello@olabakery.com"],
  ["Pellucid Health", "accounts@pellucid.health"],
  ["Alder Coffee", "sam@aldercoffee.com"],
  ["Mossgrove Architects", "paul@mossgrove.co.uk"],
  ["Saltmarsh Films", "nadia@saltmarsh.film"],
  ["Tidewater Co.", "hana@tidewater.co"],
  ["Quill & Ink", "bea@quillandink.co"],
] as const

const DAY = 86_400_000
const TODAY = Date.UTC(2026, 10, 24)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const formatDate = (d: string) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}, ${d.slice(0, 4)}`
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const INVOICES: Invoice[] = Array.from({ length: 40 }, (_, i) => {
  const [client, email] = CLIENTS[(i * 7 + 3) % CLIENTS.length]
  const issuedAt = TODAY - (i * 4 + (i % 3)) * DAY
  const dueAt = issuedAt + [14, 30, 30, 7][i % 4] * DAY
  const amount = 480 + ((i * 37) % 23) * 185 + (i % 4) * 25
  const status: Status = i < 3 ? "Draft" : dueAt >= TODAY ? "Due" : i % 6 === 1 && i < 34 ? "Overdue" : "Paid"
  return { id: `INV-${1040 - i}`, client, email, due: iso(dueAt), status, amount }
})

const STATUS: Record<Status, { icon: React.ComponentType<{ className?: string }>; variant: "secondary" | "outline" | "destructive" }> = {
  Overdue: { icon: CircleAlertIcon, variant: "destructive" },
  Due: { icon: ClockIcon, variant: "outline" },
  Draft: { icon: FilePenLineIcon, variant: "outline" },
  Paid: { icon: CircleCheckIcon, variant: "secondary" },
}

const unpaid = (i: Invoice) => i.status === "Due" || i.status === "Overdue"
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

function toCsv(rows: Invoice[]) {
  const quote = (v: string | number) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))
  const head = ["Invoice", "Client", "Email", "Due", "Status", "Amount"]
  return [head, ...rows.map((r) => [r.id, r.client, r.email, r.due, r.status, r.amount.toFixed(2)])].map((line) => line.map(quote).join(",")).join("\n")
}

type Notice = { text: string; undo?: Invoice[] }

export default function DataTableRowSelection() {
  const [data, setData] = React.useState(INVOICES)
  const [notice, setNotice] = React.useState<Notice | null>(null)
  // Ids waiting for the delete confirm, and the table whose selection to clear afterwards.
  const [confirm, setConfirm] = React.useState<{ ids: string[]; table?: Table<Invoice> } | null>(null)

  const remind = React.useCallback((rows: Invoice[]) => {
    const due = rows.filter(unpaid)
    const clients = new Set(due.map((r) => r.client))
    setNotice({ text: `Sent ${plural(due.length, "reminder")} to ${clients.size === 1 ? [...clients][0] : plural(clients.size, "client")}.` })
  }, [])

  const markPaid = React.useCallback((id: string) => {
    setData((rows) => rows.map((r) => (r.id === id ? { ...r, status: "Paid" } : r)))
    setNotice({ text: `${id} marked as paid.` })
  }, [])

  const duplicate = React.useCallback((invoice: Invoice) => {
    setData((rows) => {
      const next = Math.max(...rows.map((r) => Number(r.id.slice(4)))) + 1
      return [{ ...invoice, id: `INV-${next}`, status: "Draft" }, ...rows]
    })
    setNotice({ text: `Copied ${invoice.id} to a new draft.` })
  }, [])

  const exportCsv = (rows: Invoice[]) => {
    const name = "invoices-2026-11-24.csv"
    const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv" }))
    const a = Object.assign(document.createElement("a"), { href: url, download: name })
    a.click()
    URL.revokeObjectURL(url)
    setNotice({ text: `Exported ${plural(rows.length, "invoice")} to ${name}.` })
  }

  const remove = () => {
    if (!confirm) return
    const gone = data.filter((r) => confirm.ids.includes(r.id))
    setData((rows) => rows.filter((r) => !confirm.ids.includes(r.id)))
    confirm.table?.setRowSelection((selected) => Object.fromEntries(Object.entries(selected).filter(([id]) => !confirm.ids.includes(id))))
    setNotice({ text: `Deleted ${gone.length === 1 ? gone[0].id : plural(gone.length, "invoice")}.`, undo: gone })
    setConfirm(null)
  }

  const undo = (rows: Invoice[]) => {
    setData((current) => [...current, ...rows].sort((a, b) => Number(b.id.slice(4)) - Number(a.id.slice(4))))
    setNotice({ text: `Restored ${rows.length === 1 ? rows[0].id : plural(rows.length, "invoice")}.` })
  }

  const columns = React.useMemo<ColumnDef<Invoice>[]>(
    () => [
      selectColumn<Invoice>({ label: (row) => row.original.id }),
      {
        accessorKey: "id",
        meta: { label: "Invoice" },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
        cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
      },
      {
        accessorKey: "client",
        meta: { label: "Client" },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Client" sortLabels={{ asc: "A to Z", desc: "Z to A" }} />,
        cell: ({ row }) => (
          <div className="flex min-w-40 flex-col">
            <span className="font-medium">{row.original.client}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "due",
        meta: { label: "Due" },
        enableGlobalFilter: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Due" sortLabels={{ asc: "Soonest first", desc: "Latest first" }} />,
        cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatDate(row.original.due)}</span>,
      },
      {
        accessorKey: "status",
        meta: { label: "Status" },
        enableGlobalFilter: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const { icon: Icon, variant } = STATUS[row.original.status]
          return (
            <Badge variant={variant} className={row.original.status === "Draft" ? "text-muted-foreground" : undefined}>
              <Icon aria-hidden="true" />
              {row.original.status}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amount",
        meta: { label: "Amount", align: "right" },
        enableGlobalFilter: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
        cell: ({ row }) => <span className="font-medium tabular-nums">{usd.format(row.original.amount)}</span>,
      },
      {
        id: "actions",
        enableHiding: false,
        meta: { headerClassName: "w-14", cellClassName: "w-14 text-right" },
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row, table }) => {
          const invoice = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="-mr-1.5 data-popup-open:bg-muted" aria-label={`Actions for ${invoice.id}`} />}>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setNotice({ text: `Opening ${invoice.id}…` })}>
                    <EyeIcon />
                    View invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicate(invoice)}>
                    <CopyIcon />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!unpaid(invoice)} onClick={() => remind([invoice])}>
                    <SendIcon />
                    Send reminder
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={invoice.status === "Paid"} onClick={() => markPaid(invoice.id)}>
                    <CircleCheckIcon />
                    Mark as paid
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setConfirm({ ids: [invoice.id], table })}>
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [duplicate, markPaid, remind],
  )

  return (
    <div className="mx-auto w-full max-w-5xl">
      <DataTable
        caption="Invoices"
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        initialState={{ rowSelection: { "INV-1035": true, "INV-1034": true, "INV-1033": true } }}
        rowLabel={{ singular: "invoice", plural: "invoices" }}
        toolbar={(table) => {
          const selected = table.getSelectedRowModel().rows.map((r) => r.original)
          const total = table.getFilteredRowModel().rows.length
          const toRemind = selected.filter(unpaid).length
          return (
            <div className="flex flex-col gap-3">
              {selected.length ? (
                <div role="toolbar" aria-label="Selected invoices" className="flex min-h-10 flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border bg-muted/50 py-1 pr-1 pl-3">
                  <span className="text-sm font-medium tabular-nums">{selected.length} selected</span>
                  {table.getIsAllPageRowsSelected() && selected.length < total ? (
                    <Button variant="link" size="sm" className="h-7 px-1" onClick={() => table.toggleAllRowsSelected(true)}>
                      Select all {total}
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" className="h-7 text-muted-foreground" onClick={() => table.resetRowSelection(true)}>
                    Clear
                  </Button>
                  <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                    <Button variant="outline" size="sm" disabled={!toRemind} onClick={() => remind(selected)}>
                      <SendIcon />
                      {toRemind ? `Send ${plural(toRemind, "reminder")}` : "Nothing to remind"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportCsv(selected)}>
                      <DownloadIcon />
                      Export CSV
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setConfirm({ ids: selected.map((r) => r.id), table })}>
                      <Trash2Icon />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-10 flex-wrap items-center gap-2">
                  <InputGroup className="w-full sm:w-72">
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="search"
                      value={(table.getState().globalFilter as string | undefined) ?? ""}
                      onChange={(e) => table.setGlobalFilter(e.target.value)}
                      placeholder="Search invoices or clients"
                      aria-label="Search invoices"
                    />
                  </InputGroup>
                  <p className="text-sm text-muted-foreground sm:ml-auto">Tip: shift-click a checkbox to select a range.</p>
                </div>
              )}
              <div aria-live="polite" className="empty:hidden">
                {notice ? (
                  <div className="flex items-center gap-2 rounded-lg border bg-card py-1 pr-1 pl-3 text-sm text-card-foreground">
                    <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">{notice.text}</span>
                    {notice.undo ? (
                      <Button variant="ghost" size="sm" onClick={() => undo(notice.undo!)}>
                        Undo
                      </Button>
                    ) : null}
                    <Button variant="ghost" size="icon-sm" onClick={() => setNotice(null)} aria-label="Dismiss">
                      <XIcon />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )
        }}
      />
      <AlertDialog open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {confirm?.ids.length === 1 ? confirm.ids[0] : plural(confirm?.ids.length ?? 0, "invoice")}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.ids.length === 1 ? "It leaves" : "They leave"} your invoice list and reports. Clients keep the copies already sent to them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
