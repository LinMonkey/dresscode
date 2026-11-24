// Clients with cells you can edit in place: billing email, payment terms and hourly rate. Click a
// cell (or focus it and press Enter), change it, then save with Enter or the check, or cancel with
// Escape. Values are checked before saving and the error is read out; each save can be undone.
"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, CircleCheckIcon, PencilIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { DataTable } from "@/registry/dresscode/components/data-table/ui/data-table"
import { DataTableColumnHeader } from "@/registry/dresscode/components/data-table/ui/data-table-column-header"

const TERMS = ["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60"] as const

type Client = {
  id: string
  name: string
  city: string
  email: string
  terms: (typeof TERMS)[number]
  rate: number
  open: number
  outstanding: number
}
type Field = "email" | "terms" | "rate"

const NAMES = [
  "Fernwood Studio", "Kato & Lee", "Juniper Labs", "Ola Bakery", "Pellucid Health", "Alder Coffee",
  "Mossgrove Architects", "Saltmarsh Films", "Tidewater Co.", "Quill & Ink", "Verity Legal", "Arbor Supply",
  "Beacon Media", "Cinder Works", "Harbor & Pine", "Ember Goods", "Fable Collective", "Granite Dental",
  "Hollow Labs", "Indigo Studio", "Jasper & Co.", "Kestrel Media", "Lumen Partners", "Meridian Goods",
  "Nimbus Works", "Orchard Collective", "Pine Street Books", "Rook Studio", "Sable Labs", "Thistle Health",
]
const CITIES = ["Portland, OR", "Vancouver, BC", "Denver, CO", "Brooklyn, NY", "Boston, MA", "Oakland, CA", "London, UK", "Los Angeles, CA", "Charleston, SC", "Berlin, DE"]
const domain = (name: string) => name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "") + ".com"

const CLIENTS: Client[] = NAMES.map((name, i) => {
  const open = (i * 7) % 5
  return {
    id: domain(name),
    name,
    city: CITIES[i % CITIES.length],
    email: `${["billing", "accounts", "finance", "ap", "hello"][i % 5]}@${domain(name)}`,
    terms: TERMS[[3, 2, 3, 1, 4, 3, 0, 2][i % 8]],
    rate: [95, 110, 120, 135, 150, 85, 175, 140][i % 8] + (i % 3) * 5,
    open,
    outstanding: open * (420 + ((i * 53) % 17) * 95),
  }
})

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const FIELD_NAME: Record<Field, string> = { email: "billing email", terms: "payment terms", rate: "hourly rate" }
const show = (field: Field, value: string | number) => (field === "rate" ? `${usd.format(Number(value))}/h` : String(value))

/** Returns an error message, or null when the value can be saved. */
function validate(field: Field, raw: string, client: Client, all: Client[]): string | null {
  const value = raw.trim()
  if (field === "email") {
    if (!value) return "Enter a billing email."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter an email like name@company.com."
    const taken = all.find((c) => c.id !== client.id && c.email.toLowerCase() === value.toLowerCase())
    if (taken) return `${taken.name} already uses this email.`
  }
  if (field === "rate") {
    if (!value) return "Enter an hourly rate."
    const n = Number(value.replace(/[$,]/g, ""))
    if (Number.isNaN(n)) return "Use numbers only, like 120."
    if (!/^\d+(\.\d{1,2})?$/.test(value.replace(/[$,]/g, ""))) return "Use at most two decimals."
    if (n < 25 || n > 1000) return "Rates go from $25 to $1,000 an hour."
  }
  return null
}

type Editing = {
  /** "<client id>:<field>" of the open editor, if any. */
  cell: string | null
  /** Focus the editor when it opens (not for the one the demo opens on load). */
  focus: boolean
  /** A starting draft for the open editor instead of the saved value. */
  draft?: string
  open: (cell: string | null) => void
  save: (client: Client, field: Field, value: string) => Promise<void>
  clients: Client[]
}
const EditingContext = React.createContext<Editing | null>(null)

function EditableCell({ client, field }: { client: Client; field: Field }) {
  const editing = React.useContext(EditingContext)!
  const key = `${client.id}:${field}`
  const isOpen = editing.cell === key
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const refocus = React.useRef(false)
  React.useEffect(() => {
    if (!isOpen && refocus.current) {
      refocus.current = false
      buttonRef.current?.focus()
    }
  }, [isOpen])
  const close = () => {
    refocus.current = true
    editing.open(null)
  }
  const value = client[field]
  const align = field === "rate" ? "right" : "left"

  if (isOpen) return <CellEditor client={client} field={field} onClose={close} />
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => editing.open(key)}
      aria-label={`Edit ${FIELD_NAME[field]} for ${client.name}: ${show(field, value)}`}
      className={cn(
        "group/edit -mx-2 flex h-8 w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <span className={cn("truncate", field === "rate" && "tabular-nums")}>{show(field, value)}</span>
      <PencilIcon aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover/edit:opacity-100 group-focus-visible/edit:opacity-100" />
    </button>
  )
}

function CellEditor({ client, field, onClose }: { client: Client; field: Field; onClose: () => void }) {
  const editing = React.useContext(EditingContext)!
  const [draft, setDraft] = React.useState(editing.draft ?? String(client[field]))
  const [tried, setTried] = React.useState(editing.draft !== undefined)
  const [saving, setSaving] = React.useState(false)
  const errorId = React.useId()
  const error = tried ? validate(field, draft, client, editing.clients) : null
  const label = `${FIELD_NAME[field][0].toUpperCase()}${FIELD_NAME[field].slice(1)} for ${client.name}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setTried(true)
    if (validate(field, draft, client, editing.clients)) return
    const clean = field === "rate" ? draft.replace(/[$,]/g, "").trim() : draft.trim()
    if (clean === String(client[field])) return onClose()
    setSaving(true)
    await editing.save(client, field, clean)
    onClose()
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      onKeyDown={(e) => {
        // Escape inside the select's own popup closes the popup, not the editor.
        if (e.key === "Escape" && e.currentTarget.contains(e.target as Node)) {
          e.preventDefault()
          onClose()
        }
      }}
      className="flex w-full items-start gap-1"
    >
      <div className="min-w-0 flex-1">
        {field === "terms" ? (
          <Select
            items={TERMS.map((t) => ({ label: t, value: t }))}
            value={draft}
            onValueChange={(v) => v != null && setDraft(v)}
            disabled={saving}
          >
            <SelectTrigger size="sm" autoFocus={editing.focus} aria-label={label} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TERMS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <InputGroup className="h-7">
            {field === "rate" ? <InputGroupAddon className="pr-0">$</InputGroupAddon> : null}
            <InputGroupInput
              autoFocus={editing.focus}
              onFocus={(e) => e.currentTarget.select()}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={saving}
              type={field === "email" ? "email" : "text"}
              inputMode={field === "rate" ? "decimal" : "email"}
              aria-label={label}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={cn("h-7 text-sm", field === "rate" && "text-right tabular-nums")}
            />
          </InputGroup>
        )}
        {error ? (
          <p id={errorId} role="alert" className="mt-1 text-left text-xs whitespace-normal text-destructive">
            {error}
          </p>
        ) : null}
      </div>
      <Button type="submit" size="icon-sm" className="size-7" disabled={saving} aria-label="Save">
        {saving ? <Spinner /> : <CheckIcon />}
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" className="size-7" disabled={saving} onClick={onClose} aria-label="Cancel">
        <XIcon />
      </Button>
    </form>
  )
}

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    meta: { label: "Client" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" sortLabels={{ asc: "A to Z", desc: "Z to A" }} />,
    cell: ({ row }) => (
      <div className="flex min-w-40 flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.city}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    meta: { label: "Billing email", cellClassName: "min-w-[17.5rem]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Billing email" sortLabels={{ asc: "A to Z", desc: "Z to A" }} />,
    cell: ({ row }) => <EditableCell client={row.original} field="email" />,
  },
  {
    accessorKey: "terms",
    meta: { label: "Payment terms", cellClassName: "min-w-[13.5rem]" },
    sortingFn: (a, b) => TERMS.indexOf(a.original.terms) - TERMS.indexOf(b.original.terms),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment terms" sortLabels={{ asc: "Shortest first", desc: "Longest first" }} />,
    cell: ({ row }) => <EditableCell client={row.original} field="terms" />,
  },
  {
    accessorKey: "rate",
    meta: { label: "Hourly rate", align: "right", cellClassName: "min-w-48" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hourly rate" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) => <EditableCell client={row.original} field="rate" />,
  },
  {
    accessorKey: "outstanding",
    meta: { label: "Outstanding", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Outstanding" sortLabels={{ asc: "Low to high", desc: "High to low" }} />,
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className={cn("tabular-nums", row.original.outstanding ? "font-medium" : "text-muted-foreground")}>{usd.format(row.original.outstanding)}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.open ? `${row.original.open} open ${row.original.open === 1 ? "invoice" : "invoices"}` : "All paid"}
        </span>
      </div>
    ),
  },
]

type Notice = { client: Client; field: Field; before: Client[Field]; after: Client[Field] }

export default function DataTableEditableCells() {
  const [data, setData] = React.useState(CLIENTS)
  // The demo opens Kato & Lee's rate with a draft that is too high, to show the error. Start with
  // { cell: null, focus: true } in your app.
  const [open, setOpen] = React.useState<{ cell: string | null; focus: boolean; draft?: string }>({ cell: "katoandlee.com:rate", focus: false, draft: "1,500" })
  const [notice, setNotice] = React.useState<Notice | null>(null)

  const apply = (id: string, field: Field, value: Client[Field]) => setData((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const editing: Editing = {
    ...open,
    open: (cell) => setOpen({ cell, focus: true }),
    clients: data,
    // Stands in for a request to your API.
    save: (client, field, raw) =>
      new Promise((resolve) =>
        setTimeout(() => {
          const value = field === "rate" ? Number(raw) : raw
          apply(client.id, field, value as Client[Field])
          setNotice({ client, field, before: client[field], after: value as Client[Field] })
          resolve()
        }, 500),
      ),
  }

  return (
    <EditingContext.Provider value={editing}>
      <div className="mx-auto w-full max-w-6xl">
        <DataTable
          caption="Clients"
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          rowLabel={{ singular: "client", plural: "clients" }}
          toolbar={() => (
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold">Clients</h2>
                <p className="text-sm text-muted-foreground">Click an email, terms or rate to change it. New invoices use the new values.</p>
              </div>
              <div aria-live="polite" className="empty:hidden">
                {notice ? (
                  <div className="flex items-center gap-2 rounded-lg border bg-card py-1 pr-1 pl-3 text-sm text-card-foreground">
                    <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      Saved {notice.client.name}&rsquo;s {FIELD_NAME[notice.field]}: <span className="font-medium">{show(notice.field, notice.after)}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        apply(notice.client.id, notice.field, notice.before)
                        setNotice(null)
                      }}
                    >
                      Undo
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setNotice(null)} aria-label="Dismiss">
                      <XIcon />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        />
      </div>
    </EditingContext.Provider>
  )
}
