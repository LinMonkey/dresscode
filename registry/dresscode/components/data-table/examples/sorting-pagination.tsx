// Invoices with sortable columns: each header opens a sort menu, money is right-aligned, the footer
// totals every invoice, and the pagination picks the page size. Refresh shows the loading rows.
"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CircleAlertIcon, CircleCheckIcon, ClockIcon, FilePenLineIcon, PlusIcon, RefreshCwIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"

type Status = "Paid" | "Due" | "Overdue" | "Draft"

type Invoice = {
  id: string
  client: string
  email: string
  /** ISO dates sort as text; the cells format them. */
  issued: string
  due: string
  status: Status
  amount: number
  balance: number
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

// 48 invoices over the last six months: drafts this week, a few late, the rest paid or not due yet.
const INVOICES: Invoice[] = Array.from({ length: 48 }, (_, i) => {
  const [client, email] = CLIENTS[(i * 7 + 3) % CLIENTS.length]
  const issuedAt = TODAY - (i * 4 + (i % 3)) * DAY
  const dueAt = issuedAt + [14, 30, 30, 7][i % 4] * DAY
  const amount = 480 + ((i * 37) % 23) * 185 + (i % 4) * 25
  const status: Status = i < 3 ? "Draft" : dueAt >= TODAY ? "Due" : i % 6 === 1 && i < 34 ? "Overdue" : "Paid"
  const balance = status === "Paid" ? 0 : status === "Overdue" && i % 4 === 1 ? Math.round(amount / 2) : amount
  return { id: `INV-${1048 - i}`, client, email, issued: iso(issuedAt), due: iso(dueAt), status, amount, balance }
})

const STATUS: Record<Status, { icon: React.ComponentType<{ className?: string }>; variant: "secondary" | "outline" | "destructive"; rank: number }> = {
  Overdue: { icon: CircleAlertIcon, variant: "destructive", rank: 0 },
  Due: { icon: ClockIcon, variant: "outline", rank: 1 },
  Draft: { icon: FilePenLineIcon, variant: "outline", rank: 2 },
  Paid: { icon: CircleCheckIcon, variant: "secondary", rank: 3 },
}

function StatusBadge({ status }: { status: Status }) {
  const { icon: Icon, variant } = STATUS[status]
  return (
    <Badge variant={variant} className={status === "Draft" ? "text-muted-foreground" : undefined}>
      <Icon aria-hidden="true" />
      {status}
    </Badge>
  )
}

const sumOf = (rows: { original: Invoice }[], key: "amount" | "balance") => rows.reduce((s, r) => s + r.original[key], 0)

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    meta: { label: "Invoice" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    footer: "Total",
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
    accessorKey: "issued",
    meta: { label: "Issued" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Issued" sortLabels={{ asc: "Oldest first", desc: "Newest first" }} />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatDate(row.original.issued)}</span>,
  },
  {
    accessorKey: "due",
    meta: { label: "Due" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due" sortLabels={{ asc: "Soonest first", desc: "Latest first" }} />,
    cell: ({ row }) => {
      const { due, status } = row.original
      const days = Math.round((TODAY - Date.parse(due)) / DAY)
      return (
        <div className="flex flex-col tabular-nums">
          <span>{formatDate(due)}</span>
          {status === "Overdue" ? (
            <span className="text-xs text-destructive">{days} days late</span>
          ) : status === "Due" ? (
            <span className="text-xs text-muted-foreground">{-days === 0 ? "Due today" : `In ${-days} ${-days === 1 ? "day" : "days"}`}</span>
          ) : null}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" sortLabels={{ asc: "Overdue first", desc: "Paid first" }} />,
    sortingFn: (a, b) => STATUS[a.original.status].rank - STATUS[b.original.status].rank,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "amount",
    meta: { label: "Amount", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{usd.format(row.original.amount)}</span>,
    footer: ({ table }) => <span className="tabular-nums">{usd.format(sumOf(table.getFilteredRowModel().rows, "amount"))}</span>,
  },
  {
    accessorKey: "balance",
    meta: { label: "Balance due", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Balance due" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) => (
      <span className={row.original.balance ? "tabular-nums" : "text-muted-foreground tabular-nums"}>{usd.format(row.original.balance)}</span>
    ),
    footer: ({ table }) => <span className="tabular-nums">{usd.format(sumOf(table.getFilteredRowModel().rows, "balance"))}</span>,
  },
]

export default function DataTableSortingPagination() {
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const outstanding = INVOICES.reduce((s, i) => s + i.balance, 0)
  const refresh = () => {
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Invoices</h2>
          <p className="text-sm text-muted-foreground">
            {INVOICES.length} invoices, <span className="tabular-nums">{usd.format(outstanding)}</span> outstanding
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCwIcon className={loading ? "motion-safe:animate-spin" : undefined} />
            {loading ? "Refreshing" : "Refresh"}
          </Button>
          <Button>
            <PlusIcon />
            New invoice
          </Button>
        </div>
      </div>
      <DataTable
        caption="Invoices"
        columns={columns}
        data={INVOICES}
        getRowId={(row) => row.id}
        loading={loading}
        initialState={{ sorting: [{ id: "issued", desc: true }] }}
        rowLabel={{ singular: "invoice", plural: "invoices" }}
      />
    </div>
  )
}
