// Every field of every invoice: 21 columns in a box that scrolls both ways. The header row sticks to
// the top, the invoice number stays pinned on the left and the actions on the right; the switches
// unpin them. Totals sit in the footer.
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CircleAlertIcon, CircleCheckIcon, ClockIcon, DownloadIcon, EyeIcon, FilePenLineIcon, MoreHorizontalIcon, SendIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DataTable } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"

type Status = "Paid" | "Due" | "Overdue" | "Draft"

type Invoice = {
  id: string
  client: string
  contact: string
  email: string
  project: string
  owner: string
  issued: string
  due: string
  terms: string
  status: Status
  subtotal: number
  discount: number
  tax: number
  total: number
  paid: number
  balance: number
  daysLate: number
  method: string
  reminders: number
  lastReminder?: string
}

const CLIENTS = [
  ["Fernwood Studio", "Mara Lind", "mara@fernwood.studio"],
  ["Kato & Lee", "Ken Kato", "ken@katolee.com"],
  ["Juniper Labs", "Theo Grant", "theo@juniperlabs.dev"],
  ["Ola Bakery", "Ola Bergstrom", "hello@olabakery.com"],
  ["Pellucid Health", "Ravi Shah", "accounts@pellucid.health"],
  ["Alder Coffee", "Sam Alder", "sam@aldercoffee.com"],
  ["Mossgrove Architects", "Paul Moss", "paul@mossgrove.co.uk"],
  ["Saltmarsh Films", "Nadia Cole", "nadia@saltmarsh.film"],
  ["Tidewater Co.", "Hana Ito", "hana@tidewater.co"],
  ["Quill & Ink", "Bea Marsh", "bea@quillandink.co"],
] as const
const PROJECTS = ["Website refresh", "Spring campaign", "Packaging redesign", "Product shoot", "Monthly retainer", "Annual report", "App onboarding", "Brand guidelines"]
const OWNERS = ["Ada Ruiz", "Tom Okafor", "Maya Lindqvist", "Leo Brandt"]
const METHODS = ["Bank transfer", "Card", "ACH debit", "Bank transfer", "Card"]

const DAY = 86_400_000
const TODAY = Date.UTC(2026, 10, 24)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const formatDate = (d?: string) => (d ? `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}, ${d.slice(0, 4)}` : "—")
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const INVOICES: Invoice[] = Array.from({ length: 40 }, (_, i) => {
  const [client, contact, email] = CLIENTS[(i * 7 + 3) % CLIENTS.length]
  const issuedAt = TODAY - (i * 4 + (i % 3)) * DAY
  const termDays = [14, 30, 30, 7][i % 4]
  const dueAt = issuedAt + termDays * DAY
  const status: Status = i < 3 ? "Draft" : dueAt >= TODAY ? "Due" : i % 6 === 1 && i < 34 ? "Overdue" : "Paid"
  const subtotal = 480 + ((i * 37) % 23) * 185 + (i % 4) * 25
  const discount = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0
  const tax = Math.round((subtotal - discount) * 8) / 100
  const total = subtotal - discount + tax
  const paid = status === "Paid" ? total : status === "Overdue" && i % 4 === 1 ? Math.round(total / 2) : 0
  const daysLate = status === "Overdue" ? Math.round((TODAY - dueAt) / DAY) : 0
  const reminders = status === "Overdue" ? 1 + (daysLate > 20 ? 1 : 0) : status === "Due" && i % 3 === 0 ? 1 : 0
  return {
    id: `INV-${1040 - i}`,
    client,
    contact,
    email,
    project: PROJECTS[(i * 5) % PROJECTS.length],
    owner: OWNERS[i % OWNERS.length],
    issued: iso(issuedAt),
    due: iso(dueAt),
    terms: termDays === 7 ? "Net 7" : `Net ${termDays}`,
    status,
    subtotal,
    discount,
    tax,
    total,
    paid,
    balance: total - paid,
    daysLate,
    method: status === "Draft" ? "—" : METHODS[i % METHODS.length],
    reminders,
    lastReminder: reminders ? iso(TODAY - ((i % 5) + 1) * DAY) : undefined,
  }
})

const STATUS: Record<Status, { icon: React.ComponentType<{ className?: string }>; variant: "secondary" | "outline" | "destructive" }> = {
  Overdue: { icon: CircleAlertIcon, variant: "destructive" },
  Due: { icon: ClockIcon, variant: "outline" },
  Draft: { icon: FilePenLineIcon, variant: "outline" },
  Paid: { icon: CircleCheckIcon, variant: "secondary" },
}

type MoneyKey = "subtotal" | "discount" | "tax" | "total" | "paid" | "balance"
const money = (key: MoneyKey, title: string): ColumnDef<Invoice> => ({
  accessorKey: key,
  meta: { label: title, align: "right" },
  header: ({ column }) => <DataTableColumnHeader column={column} title={title} sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
  cell: ({ row }) => {
    const v = row.original[key]
    return <span className={v ? "tabular-nums" : "text-muted-foreground tabular-nums"}>{usd.format(key === "discount" && v ? -v : v)}</span>
  },
  footer: ({ table }) => {
    const sum = table.getFilteredRowModel().rows.reduce((s, r) => s + r.original[key], 0)
    return <span className="tabular-nums">{usd.format(key === "discount" && sum ? -sum : sum)}</span>
  },
})
const text = (key: "client" | "contact" | "email" | "project" | "owner" | "terms" | "method", title: string, muted = false): ColumnDef<Invoice> => ({
  accessorKey: key,
  meta: { label: title },
  header: ({ column }) => <DataTableColumnHeader column={column} title={title} sortLabels={{ asc: "A to Z", desc: "Z to A" }} />,
  cell: ({ row }) => <span className={muted ? "text-muted-foreground" : key === "client" ? "font-medium" : undefined}>{row.original[key]}</span>,
})
const date = (key: "issued" | "due" | "lastReminder", title: string): ColumnDef<Invoice> => ({
  id: key,
  accessorFn: (row) => row[key] ?? "",
  meta: { label: title },
  header: ({ column }) => <DataTableColumnHeader column={column} title={title} sortLabels={{ asc: "Oldest first", desc: "Newest first" }} />,
  cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatDate(row.original[key])}</span>,
})

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    size: 128,
    enableHiding: false,
    meta: { label: "Invoice" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    footer: "Total",
  },
  text("client", "Client"),
  text("contact", "Contact"),
  text("email", "Email", true),
  text("project", "Project"),
  text("owner", "Owner"),
  date("issued", "Issued"),
  date("due", "Due"),
  text("terms", "Terms", true),
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
  money("subtotal", "Subtotal"),
  money("discount", "Discount"),
  money("tax", "Tax"),
  money("total", "Total"),
  money("paid", "Paid"),
  money("balance", "Balance"),
  {
    accessorKey: "daysLate",
    meta: { label: "Days late", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Days late" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) =>
      row.original.daysLate ? <span className="text-destructive tabular-nums">{row.original.daysLate}</span> : <span className="text-muted-foreground">—</span>,
  },
  text("method", "Paid by", true),
  {
    accessorKey: "reminders",
    meta: { label: "Reminders", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reminders" sortLabels={{ asc: "Fewest first", desc: "Most first" }} />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.reminders}</span>,
  },
  date("lastReminder", "Last reminder"),
  {
    id: "actions",
    size: 56,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="data-popup-open:bg-muted" aria-label={`Actions for ${row.original.id}`} />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>
            <EyeIcon />
            View invoice
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem disabled={row.original.status === "Paid" || row.original.status === "Draft"}>
            <SendIcon />
            Send reminder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function DataTableStickyColumns() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <DataTable
        caption="Invoices, every field"
        columns={columns}
        data={INVOICES}
        getRowId={(row) => row.id}
        pagination={false}
        maxHeight={440}
        initialState={{ columnPinning: { left: ["id"], right: ["actions"] }, sorting: [{ id: "issued", desc: true }] }}
        toolbar={(table) => {
          const invoice = table.getColumn("id")
          const actions = table.getColumn("actions")
          return (
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 className="text-lg font-semibold">All invoices</h2>
                <p className="text-sm text-muted-foreground">
                  {INVOICES.length} invoices, {table.getVisibleLeafColumns().length - 1} fields. Scroll inside the table.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <Label className="font-normal">
                  <Switch size="sm" checked={invoice?.getIsPinned() === "left"} onCheckedChange={(on) => invoice?.pin(on ? "left" : false)} />
                  Pin invoice number
                </Label>
                <Label className="font-normal">
                  <Switch size="sm" checked={actions?.getIsPinned() === "right"} onCheckedChange={(on) => actions?.pin(on ? "right" : false)} />
                  Pin actions
                </Label>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
