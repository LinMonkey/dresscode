// Invoices you can narrow down: search across invoice numbers, clients and emails, faceted filters
// for status and client with live counts, a reset button, and a menu to show or hide columns.
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CircleAlertIcon, CircleCheckIcon, ClockIcon, FilePenLineIcon, SearchIcon, SearchXIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { DataTable } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"
import { DataTableFacetedFilter, facetedFilterFn } from "@/registry/dresscode/components/data-table/ui/data-table-faceted-filter"
import { DataTableViewOptions } from "@/registry/dresscode/components/data-table/ui/data-table-view-options"

type Status = "Paid" | "Due" | "Overdue" | "Draft"

type Invoice = {
  id: string
  client: string
  email: string
  issued: string
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

const INVOICES: Invoice[] = Array.from({ length: 52 }, (_, i) => {
  const [client, email] = CLIENTS[(i * 7 + 3) % CLIENTS.length]
  const issuedAt = TODAY - (i * 4 + (i % 3)) * DAY
  const dueAt = issuedAt + [14, 30, 30, 7][i % 4] * DAY
  const amount = 480 + ((i * 37) % 23) * 185 + (i % 4) * 25
  const status: Status = i < 3 ? "Draft" : dueAt >= TODAY ? "Due" : i % 6 === 1 && i < 34 ? "Overdue" : "Paid"
  return { id: `INV-${1052 - i}`, client, email, issued: iso(issuedAt), due: iso(dueAt), status, amount }
})

const STATUS_OPTIONS = [
  { value: "Draft", label: "Draft", icon: FilePenLineIcon },
  { value: "Due", label: "Due", icon: ClockIcon },
  { value: "Overdue", label: "Overdue", icon: CircleAlertIcon },
  { value: "Paid", label: "Paid", icon: CircleCheckIcon },
]
const CLIENT_OPTIONS = CLIENTS.map(([name]) => ({ value: name, label: name })).sort((a, b) => a.label.localeCompare(b.label))

const BADGE: Record<Status, "secondary" | "outline" | "destructive"> = { Paid: "secondary", Due: "outline", Overdue: "destructive", Draft: "outline" }

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    meta: { label: "Invoice" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
  },
  {
    accessorKey: "client",
    meta: { label: "Client" },
    filterFn: facetedFilterFn,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" sortLabels={{ asc: "A to Z", desc: "Z to A" }} />,
    cell: ({ row }) => <span className="font-medium">{row.original.client}</span>,
  },
  {
    accessorKey: "email",
    meta: { label: "Billing email" },
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Billing email" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "issued",
    meta: { label: "Issued" },
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Issued" sortLabels={{ asc: "Oldest first", desc: "Newest first" }} />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatDate(row.original.issued)}</span>,
  },
  {
    accessorKey: "due",
    meta: { label: "Due" },
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due" sortLabels={{ asc: "Soonest first", desc: "Latest first" }} />,
    cell: ({ row }) => <span className="tabular-nums">{formatDate(row.original.due)}</span>,
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    filterFn: facetedFilterFn,
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const option = STATUS_OPTIONS.find((o) => o.value === row.original.status)!
      return (
        <Badge variant={BADGE[row.original.status]} className={row.original.status === "Draft" ? "text-muted-foreground" : undefined}>
          <option.icon aria-hidden="true" />
          {option.label}
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
]

export default function DataTableFilters() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <DataTable
        caption="Invoices"
        columns={columns}
        data={INVOICES}
        getRowId={(row) => row.id}
        initialState={{ sorting: [{ id: "issued", desc: true }], columnFilters: [{ id: "status", value: ["Draft", "Due", "Overdue"] }] }}
        rowLabel={{ singular: "invoice", plural: "invoices" }}
        empty={(table) => (
          <div className="flex flex-col items-center gap-1.5 py-4">
            <SearchXIcon aria-hidden="true" className="mb-1 size-6 text-muted-foreground" />
            <p className="font-medium text-foreground">No invoices match</p>
            <p>Try another search, or clear the filters to see all {INVOICES.length} invoices.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                table.resetColumnFilters(true)
                table.setGlobalFilter("")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        toolbar={(table) => {
          const query = (table.getState().globalFilter as string | undefined) ?? ""
          const filtered = query !== "" || table.getState().columnFilters.length > 0
          return (
            <div className="flex flex-wrap items-center gap-2">
              <InputGroup className="w-full sm:w-72">
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  value={query}
                  onChange={(e) => table.setGlobalFilter(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && table.setGlobalFilter("")}
                  placeholder="Search invoices, clients, emails"
                  aria-label="Search invoices"
                  className="[&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" onClick={() => table.setGlobalFilter("")} aria-label="Clear search">
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
              <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={STATUS_OPTIONS} />
              <DataTableFacetedFilter column={table.getColumn("client")} title="Client" options={CLIENT_OPTIONS} />
              {filtered ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    table.resetColumnFilters(true)
                    table.setGlobalFilter("")
                  }}
                >
                  Reset
                  <XIcon />
                </Button>
              ) : null}
              <DataTableViewOptions table={table} className="ml-auto" />
            </div>
          )
        }}
      />
    </div>
  )
}
