// Invoices that open in place: the chevron shows an invoice's line items, totals and payment details
// under its row, without leaving the list. The header chevron (or Expand all) opens every row on the page.
"use client"

import type { ColumnDef, Row } from "@tanstack/react-table"
import { ChevronsDownUpIcon, ChevronsUpDownIcon, CircleAlertIcon, CircleCheckIcon, ClockIcon, DownloadIcon, ExternalLinkIcon, FilePenLineIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTable, expandColumn } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"

type Status = "Paid" | "Due" | "Overdue" | "Draft"
type LineItem = { description: string; qty: number; unit: string; rate: number }

type Invoice = {
  id: string
  client: string
  email: string
  issued: string
  due: string
  status: Status
  items: LineItem[]
  subtotal: number
  tax: number
  total: number
  paidOn?: string
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

// What the studio sells: [description, unit, rate, how many of the unit an invoice usually has].
const SERVICES: [string, string, number, number[]][] = [
  ["Brand strategy workshop", "day", 1200, [1, 2]],
  ["Logo and identity system", "project", 3800, [1]],
  ["Website design", "hour", 110, [12, 18, 24]],
  ["Front-end build", "hour", 95, [16, 20, 32]],
  ["Copywriting", "hour", 85, [4, 6, 10]],
  ["Product photography", "half day", 650, [1, 2]],
  ["Monthly design retainer", "month", 1500, [1]],
  ["Hosting and maintenance", "month", 120, [1, 3]],
  ["Illustration set", "set", 480, [1, 2]],
  ["Print production", "batch", 340, [1, 2]],
]

const DAY = 86_400_000
const TODAY = Date.UTC(2026, 10, 24)
const TAX_RATE = 0.08
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const formatDate = (d: string) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}, ${d.slice(0, 4)}`
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const INVOICES: Invoice[] = Array.from({ length: 30 }, (_, i) => {
  const [client, email] = CLIENTS[(i * 7 + 3) % CLIENTS.length]
  const issuedAt = TODAY - (i * 4 + (i % 3)) * DAY
  const dueAt = issuedAt + [14, 30, 30, 7][i % 4] * DAY
  const status: Status = i < 2 ? "Draft" : dueAt >= TODAY ? "Due" : i % 6 === 1 ? "Overdue" : "Paid"
  const items = Array.from({ length: 1 + ((i * 5 + 1) % 4) }, (_, k): LineItem => {
    const [description, unit, rate, qtys] = SERVICES[(i * 3 + k * 7) % SERVICES.length]
    return { description, unit, rate, qty: qtys[(i + k) % qtys.length] }
  })
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0)
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const paidOn = status === "Paid" ? iso(dueAt - ((i * 3) % 9) * DAY) : undefined
  return { id: `INV-${1030 - i}`, client, email, issued: iso(issuedAt), due: iso(dueAt), status, items, subtotal, tax, total: subtotal + tax, paidOn }
})

const quantity = (item: LineItem) =>
  `${item.qty} ${item.qty === 1 ? item.unit : item.unit === "half day" ? "half days" : `${item.unit}s`}`

const STATUS: Record<Status, { icon: React.ComponentType<{ className?: string }>; variant: "secondary" | "outline" | "destructive" }> = {
  Overdue: { icon: CircleAlertIcon, variant: "destructive" },
  Due: { icon: ClockIcon, variant: "outline" },
  Draft: { icon: FilePenLineIcon, variant: "outline" },
  Paid: { icon: CircleCheckIcon, variant: "secondary" },
}

const columns: ColumnDef<Invoice>[] = [
  expandColumn<Invoice>({ label: (row) => row.original.id }),
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
    cell: ({ row }) => <span className="font-medium">{row.original.client}</span>,
  },
  {
    accessorKey: "issued",
    meta: { label: "Issued" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Issued" sortLabels={{ asc: "Oldest first", desc: "Newest first" }} />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatDate(row.original.issued)}</span>,
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
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
    id: "items",
    accessorFn: (row) => row.items.length,
    meta: { label: "Line items", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" sortLabels={{ asc: "Fewest first", desc: "Most first" }} />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.items.length}</span>,
  },
  {
    accessorKey: "total",
    meta: { label: "Total", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{usd.format(row.original.total)}</span>,
  },
]

function InvoiceDetails({ row }: { row: Row<Invoice> }) {
  const invoice = row.original
  const payment =
    invoice.status === "Paid"
      ? `Paid ${formatDate(invoice.paidOn!)} by bank transfer`
      : invoice.status === "Overdue"
        ? `${Math.round((TODAY - Date.parse(invoice.due)) / DAY)} days late, reminder sent Nov 20`
        : invoice.status === "Draft"
          ? "Not sent yet"
          : `Due ${formatDate(invoice.due)}`

  // A size container: the details take the table's width instead of stretching it.
  return (
    <div className="@container">
      <div className="grid gap-x-8 gap-y-5 px-4 py-4 @2xl:grid-cols-[minmax(0,1fr)_15rem] @2xl:pl-14">
        <div className="min-w-0 overflow-hidden rounded-lg border bg-background">
          <Table aria-label={`Line items on ${invoice.id}`} className="text-[13px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-3 text-muted-foreground">Description</TableHead>
                <TableHead className="hidden h-9 px-3 text-right text-muted-foreground @lg:table-cell">Qty</TableHead>
                <TableHead className="hidden h-9 px-3 text-right text-muted-foreground @lg:table-cell">Rate</TableHead>
                <TableHead className="h-9 px-3 text-right text-muted-foreground">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.description} className="hover:bg-transparent">
                  <TableCell className="px-3">
                    {item.description}
                    {/* Narrow details: quantity and rate under the description instead of in columns. */}
                    <span className="block text-xs text-muted-foreground tabular-nums @lg:hidden">
                      {quantity(item)} × {usd.format(item.rate)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden px-3 text-right text-muted-foreground tabular-nums @lg:table-cell">{quantity(item)}</TableCell>
                  <TableCell className="hidden px-3 text-right text-muted-foreground tabular-nums @lg:table-cell">{usd.format(item.rate)}</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{usd.format(item.qty * item.rate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent font-normal">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={2} className="hidden pt-2.5 pb-0 @lg:table-cell" />
                <TableCell className="px-3 pt-2.5 pb-0 text-right text-muted-foreground">
                  Subtotal
                </TableCell>
                <TableCell className="px-3 pt-2.5 pb-0 text-right tabular-nums">{usd.format(invoice.subtotal)}</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={2} className="hidden py-1 @lg:table-cell" />
                <TableCell className="px-3 py-1 text-right text-muted-foreground">
                  Sales tax ({TAX_RATE * 100}%)
                </TableCell>
                <TableCell className="px-3 py-1 text-right tabular-nums">{usd.format(invoice.tax)}</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={2} className="hidden pt-0 pb-2.5 @lg:table-cell" />
                <TableCell className="px-3 pt-0 pb-2.5 text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="px-3 pt-0 pb-2.5 text-right font-semibold tabular-nums">{usd.format(invoice.total)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="text-muted-foreground">Billed to</dt>
            <dd className="min-w-0">
              <span className="block font-medium">{invoice.client}</span>
              <span className="block truncate text-muted-foreground">{invoice.email}</span>
            </dd>
            <dt className="text-muted-foreground">Issued</dt>
            <dd className="tabular-nums">{formatDate(invoice.issued)}</dd>
            <dt className="text-muted-foreground">Payment</dt>
            <dd className={invoice.status === "Overdue" ? "text-destructive" : undefined}>{payment}</dd>
          </dl>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <ExternalLinkIcon />
              Open invoice
            </Button>
            <Button variant="ghost" size="sm">
              <DownloadIcon />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DataTableExpandableRows() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <DataTable
        caption="Invoices with their line items"
        columns={columns}
        data={INVOICES}
        getRowId={(row) => row.id}
        renderSubRow={(row) => <InvoiceDetails row={row} />}
        initialState={{ expanded: { "INV-1028": true } }}
        pageSizeOptions={[8, 16, 30]}
        rowLabel={{ singular: "invoice", plural: "invoices" }}
        toolbar={(table) => {
          const all = table.getIsAllRowsExpanded()
          return (
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Invoices</h2>
                <p className="text-sm text-muted-foreground">Open a row to see what was billed.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => table.toggleAllRowsExpanded(!all)}>
                {all ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
                {all ? "Collapse all" : "Expand all"}
              </Button>
            </div>
          )
        }}
      />
    </div>
  )
}
