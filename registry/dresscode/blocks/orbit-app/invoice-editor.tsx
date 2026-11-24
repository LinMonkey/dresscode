"use client"

// New invoice: client, dates and terms, line items, discount, tax, live totals, notes, how the client
// can pay, then a preview of exactly what the client gets (payment page and email) and a send dialog.
import { ArrowLeft, BookmarkPlus, Eye, Pencil, Plus, Send, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { useOrbit } from "./context"
import { CheckRow, FormField, SimpleSelect, opts } from "./controls"
import { dialogCard, dialogFooter } from "./dialogs"
import { CLIENTS, clientById, money } from "./data"
import { InvoiceDocument, InvoiceEmail, STUDIO, totals, type Discount } from "./invoice-doc"
import { PageHeader, Panel, StatusPill, flat } from "./ui"

type Item = { key: number; description: string; qty: string; rate: string }

const SAVED = [
  { description: "Monthly design retainer", rate: 1800 },
  { description: "Design review call (hour)", rate: 85 },
  { description: "Illustration, editorial", rate: 450 },
  { description: "Brand guidelines document", rate: 1200 },
]
const TERMS: Record<string, { due: string; days: number }> = {
  "Due on receipt": { due: "Nov 24, 2026", days: 0 },
  "Net 7": { due: "Dec 1, 2026", days: 7 },
  "Net 14": { due: "Dec 8, 2026", days: 14 },
  "Net 30": { due: "Dec 24, 2026", days: 30 },
}
const TAXES: Record<string, { rate: number; label: string }> = {
  "No tax": { rate: 0, label: "" },
  "Sales tax 5%": { rate: 5, label: "Sales tax" },
  "Sales tax 8.25%": { rate: 8.25, label: "Sales tax" },
  "VAT 20%": { rate: 20, label: "VAT" },
  "GST 13%": { rate: 13, label: "HST" },
}
const CLIENT_OPTIONS = CLIENTS.slice(0, 14).map((c) => ({ value: c.id, label: c.name }))
const NUMBER = "INV-1043"

export function InvoiceEditorScreen() {
  const { href } = useOrbit()
  const router = useRouter()
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [previewOf, setPreviewOf] = useState<"page" | "email">("page")
  const [clientId, setClientId] = useState("fernwood-studio")
  const [issued, setIssued] = useState("Nov 24, 2026")
  const [term, setTerm] = useState("Net 14")
  const [currency, setCurrency] = useState("USD")
  const [reference, setReference] = useState("PO-2291")
  const [items, setItems] = useState<Item[]>([
    { key: 1, description: "Brand retainer, December", qty: "1", rate: "1800" },
    { key: 2, description: "Social templates, set of 12", qty: "1", rate: "650" },
    { key: 3, description: "Extra design hours", qty: "6", rate: "85" },
  ])
  const [discountType, setDiscountType] = useState<Discount["type"]>("%")
  const [discountValue, setDiscountValue] = useState("0")
  const [tax, setTax] = useState("Sales tax 5%")
  const [notes, setNotes] = useState("Thanks for another good month, Mara. The template files are in the shared folder.")
  const [terms, setTerms] = useState("Payment is due within 14 days. Late invoices are charged 1.5% a month after 30 days.")
  const [card, setCard] = useState(true)
  const [bank, setBank] = useState(true)
  const [passFee, setPassFee] = useState(false)
  const [reminders, setReminders] = useState(true)
  const [tried, setTried] = useState(false)
  const [sending, setSending] = useState(false)

  const client = clientById(clientId)
  const lineItems = useMemo(() => items.map((i) => ({ description: i.description, qty: Number(i.qty) || 0, rate: Number(i.rate) || 0 })), [items])
  const discount: Discount = { type: discountType, value: Math.max(0, Number(discountValue) || 0) }
  const taxInfo = TAXES[tax]
  const t = totals(lineItems, discount, taxInfo.rate)
  const due = TERMS[term].due
  const invalid = items.filter((i) => !i.description.trim() || !(Number(i.qty) > 0)).map((i) => i.key)
  const m = (n: number) => money(n, currency)

  const update = (key: number, patch: Partial<Item>) => setItems((all) => all.map((i) => (i.key === key ? { ...i, ...patch } : i)))
  const add = (description = "", rate = "") => setItems((all) => [...all, { key: Math.max(0, ...all.map((i) => i.key)) + 1, description, qty: "1", rate }])

  const trySend = () => {
    setTried(true)
    if (invalid.length || t.total <= 0) {
      setMode("edit")
      toast.error("Some line items need a description and a quantity.")
      return
    }
    setSending(true)
  }

  const doc = (
    <InvoiceDocument
      number={NUMBER}
      client={client}
      issued={issued}
      due={due}
      items={lineItems}
      discount={discount}
      taxRate={taxInfo.rate}
      taxLabel={taxInfo.label}
      currency={currency}
      notes={notes}
      terms={terms}
    />
  )

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow={
          <Link href={href("invoices")} className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Invoices
          </Link>
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            New invoice <StatusPill status="Draft" />
          </span>
        }
        description={`${NUMBER} for ${client.name} · saved a moment ago`}
        actions={
          <>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview")}>
              <TabsList className="h-8">
                <TabsTrigger value="edit" className="px-3">
                  <Pencil /> Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="px-3">
                  <Eye /> Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" onClick={() => toast.success("Draft saved", { description: `${NUMBER} · ${m(t.total)}` })}>
              Save draft
            </Button>
            <Button className="font-semibold" onClick={trySend}>
              <Send /> Send invoice
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {mode === "preview" ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] text-muted-foreground">
                What <span className="font-semibold text-foreground">{client.contact}</span> at {client.name} gets
              </p>
              <Tabs value={previewOf} onValueChange={(v) => setPreviewOf(v as "page" | "email")}>
                <TabsList className="h-8">
                  <TabsTrigger value="page" className="px-3">
                    Payment page
                  </TabsTrigger>
                  <TabsTrigger value="email" className="px-3">
                    Email
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="dc-card overflow-hidden p-0">
              {previewOf === "page" ? (
                doc
              ) : (
                <InvoiceEmail
                  number={NUMBER}
                  client={client}
                  due={due}
                  total={t.total}
                  subject={`Invoice ${NUMBER} from ${STUDIO.name}`}
                  message={`Hi ${client.contact.split(" ")[0]},\n\nHere is the invoice for December. You can pay online by card or bank transfer from the link below.\n\nThank you,\nAda`}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            <Panel title="Bill to" action={<Button variant="ghost" size="sm" className={cn(flat, "-mr-2")} onClick={() => toast("Opens Add client with this name filled in.")}><UserPlus /> New client</Button>}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Client" htmlFor="ie-client">
                  <SimpleSelect id="ie-client" value={clientId} onChange={setClientId} options={CLIENT_OPTIONS} className="w-full" />
                </FormField>
                <div className="rounded-[calc(var(--radius)+2px)] bg-muted/60 px-3 py-2 text-[13px] leading-relaxed">
                  <p className="font-medium">{client.contact}</p>
                  <p className="text-muted-foreground">{client.email}</p>
                  <p className="text-muted-foreground">{client.city}</p>
                </div>
              </div>
            </Panel>

            <Panel title="Details">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Invoice number" htmlFor="ie-number">
                  <Input id="ie-number" value={NUMBER} readOnly className="dc-num bg-muted/60" />
                </FormField>
                <FormField label="Issue date" htmlFor="ie-issued">
                  <Input id="ie-issued" value={issued} onChange={(e) => setIssued(e.target.value)} />
                </FormField>
                <FormField label="Payment terms" htmlFor="ie-terms" hint={`Due ${due}`}>
                  <SimpleSelect id="ie-terms" value={term} onChange={setTerm} options={opts(...Object.keys(TERMS))} className="w-full" />
                </FormField>
                <FormField label="Currency" htmlFor="ie-cur">
                  <SimpleSelect id="ie-cur" value={currency} onChange={setCurrency} options={opts("USD", "EUR", "GBP", "CAD")} className="w-full" />
                </FormField>
                <FormField label="PO or reference" htmlFor="ie-ref" hint="Shows on the invoice, if your client asked for one." className="sm:col-span-2">
                  <Input id="ie-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
                </FormField>
              </div>
            </Panel>

            <Panel title="Line items" description="Amounts and totals update as you type." flush>
              <div className="hidden grid-cols-[minmax(0,1fr)_72px_120px_110px_32px] gap-3 border-y border-border bg-muted/40 px-5 py-2 text-[12px] font-medium text-muted-foreground md:grid">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Amount</span>
                <span />
              </div>
              <ul className="divide-y divide-border">
                {items.map((it, n) => {
                  const bad = tried && invalid.includes(it.key)
                  return (
                    <li key={it.key} className="grid grid-cols-[minmax(0,1fr)_32px] gap-x-3 gap-y-2 px-5 py-3 md:grid-cols-[minmax(0,1fr)_72px_120px_110px_32px] md:items-center">
                      <Input
                        aria-label={`Item ${n + 1} description`}
                        value={it.description}
                        onChange={(e) => update(it.key, { description: e.target.value })}
                        placeholder="What you did"
                        aria-invalid={bad && !it.description.trim()}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className={cn(flat, "text-muted-foreground md:order-last")}
                        aria-label={`Remove item ${n + 1}`}
                        disabled={items.length === 1}
                        onClick={() => setItems((all) => all.filter((x) => x.key !== it.key))}
                      >
                        <Trash2 />
                      </Button>
                      <div className="col-span-2 grid grid-cols-3 gap-3 md:contents">
                        <Input
                          aria-label={`Item ${n + 1} quantity`}
                          inputMode="decimal"
                          value={it.qty}
                          onChange={(e) => update(it.key, { qty: e.target.value })}
                          className="dc-num text-right"
                          aria-invalid={bad && !(Number(it.qty) > 0)}
                        />
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[13px] text-muted-foreground">{currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"}</span>
                          <Input aria-label={`Item ${n + 1} rate`} inputMode="decimal" value={it.rate} onChange={(e) => update(it.key, { rate: e.target.value })} className="dc-num pl-6 text-right" />
                        </div>
                        <p className="dc-num self-center text-right font-medium">{m((Number(it.qty) || 0) * (Number(it.rate) || 0))}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
                <Button variant="outline" size="sm" onClick={() => add()}>
                  <Plus /> Add item
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className={flat} />}>
                    <BookmarkPlus /> Saved items
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Add a saved item</DropdownMenuLabel>
                      {SAVED.map((s) => (
                        <DropdownMenuItem key={s.description} onClick={() => add(s.description, String(s.rate))}>
                          {s.description}
                          <DropdownMenuShortcut className="dc-num tracking-normal">{money(s.rate)}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-5 border-t border-border px-5 py-4 md:grid-cols-[1fr_300px]">
                <div className="grid content-start gap-4 sm:grid-cols-2">
                  <FormField label="Discount" htmlFor="ie-discount">
                    <div className="flex gap-2">
                      <SimpleSelect label="Discount type" value={discountType} onChange={(v) => setDiscountType(v as Discount["type"])} options={[{ value: "%", label: "%" }, { value: "$", label: "$" }]} className="w-[68px]" />
                      <Input id="ie-discount" inputMode="decimal" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="dc-num" />
                    </div>
                  </FormField>
                  <FormField label="Tax" htmlFor="ie-tax">
                    <SimpleSelect id="ie-tax" value={tax} onChange={setTax} options={opts(...Object.keys(TAXES))} className="w-full" />
                  </FormField>
                </div>
                <dl className="dc-num grid content-start gap-2 text-[14px]">
                  <SumRow label="Subtotal" value={m(t.subtotal)} />
                  <SumRow label={discountType === "%" ? `Discount (${discount.value}%)` : "Discount"} value={t.discount ? `−${m(t.discount)}` : m(0)} />
                  <SumRow label={taxInfo.rate ? `${taxInfo.label} (${taxInfo.rate}%)` : "Tax"} value={m(t.tax)} />
                  <div className="flex items-baseline justify-between gap-4 border-t border-border pt-2">
                    <dt className="font-sans font-semibold">Total</dt>
                    <dd className="text-[22px] font-semibold tracking-tight">{m(t.total)}</dd>
                  </div>
                </dl>
              </div>
            </Panel>

            <Panel title="Notes and terms" description="Both show at the bottom of the invoice.">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Note to client" htmlFor="ie-notes">
                  <Textarea id="ie-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                </FormField>
                <FormField label="Terms" htmlFor="ie-terms-text">
                  <Textarea id="ie-terms-text" value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} />
                </FormField>
              </div>
            </Panel>
          </div>
        )}

        <aside className="grid gap-4 lg:sticky lg:top-20">
          <Panel title="Summary">
            <dl className="grid gap-1 text-[14px]">
              <div className="flex justify-between gap-3 py-1">
                <dt className="text-muted-foreground">Client</dt>
                <dd className="truncate font-medium">{client.name}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1">
                <dt className="text-muted-foreground">Due</dt>
                <dd className="font-medium">
                  {due.replace(", 2026", "")} <span className="text-muted-foreground">({term.toLowerCase()})</span>
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1">
                <dt className="text-muted-foreground">Items</dt>
                <dd className="dc-num font-medium">{items.length}</dd>
              </div>
            </dl>
            <div className="mt-3 rounded-[calc(var(--radius)+2px)] bg-[color:var(--dc-highlight)] p-4 text-[color:var(--dc-highlight-fg)]">
              <p className="text-[13px] opacity-80">Total due</p>
              <p className="dc-num text-[28px] leading-tight font-semibold tracking-tight">{m(t.total)}</p>
            </div>
            <div className="mt-4 grid gap-2">
              <Button className="h-9 w-full font-semibold" onClick={trySend}>
                <Send /> Send invoice
              </Button>
              <Button variant="outline" className="h-9 w-full" onClick={() => setMode(mode === "edit" ? "preview" : "edit")}>
                {mode === "edit" ? <Eye /> : <Pencil />} {mode === "edit" ? "Preview as client" : "Back to editing"}
              </Button>
            </div>
          </Panel>
          <Panel title="Getting paid">
            <div className="grid gap-3 text-[14px]">
              <ToggleRow label="Card, Apple Pay, Google Pay" note="2.9% + 30¢ per payment" checked={card} onChange={setCard} />
              <ToggleRow label="Bank transfer (ACH)" note="0.8%, capped at $5" checked={bank} onChange={setBank} />
              <ToggleRow label="Pass the card fee on" note="Adds it to the client's total" checked={passFee} onChange={setPassFee} disabled={!card} />
              <ToggleRow
                label="Automatic reminders"
                note={
                  <>
                    3 before and after the due date.{" "}
                    <Link href={href("settings", { tab: "reminders" })} className="font-medium text-[color:var(--dc-accent)] hover:underline">
                      Edit plan
                    </Link>
                  </>
                }
                checked={reminders}
                onChange={setReminders}
              />
            </div>
          </Panel>
        </aside>
      </div>

      <SendDialog
        open={sending}
        onOpenChange={setSending}
        to={client.email}
        contact={client.contact}
        total={m(t.total)}
        due={due}
        onSent={(when) => {
          setSending(false)
          toast.success(when === "now" ? `${NUMBER} sent to ${client.email}` : `${NUMBER} scheduled for tomorrow at 9:00`, {
            description: `${m(t.total)}, due ${due}.`,
            action: { label: "View invoices", onClick: () => router.push(href("invoices")) },
          })
        }}
      />
    </div>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-sans text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ToggleRow({
  label,
  note,
  checked,
  onChange,
  disabled,
}: {
  label: string
  note: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", disabled && "opacity-50")}>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-[12px] text-muted-foreground">{note}</p>
      </div>
      <Switch checked={checked && !disabled} onCheckedChange={onChange} disabled={disabled} aria-label={label} className="mt-0.5" />
    </div>
  )
}

function SendDialog({
  open,
  onOpenChange,
  to,
  contact,
  total,
  due,
  onSent,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  to: string
  contact: string
  total: string
  due: string
  onSent: (when: "now" | "later") => void
}) {
  const [cc, setCc] = useState("")
  const [subject, setSubject] = useState(`Invoice ${NUMBER} from ${STUDIO.name}`)
  const [message, setMessage] = useState(
    `Hi ${contact.split(" ")[0]},\n\nHere is the invoice for December. You can pay online by card or bank transfer from the link below.\n\nThank you,\nAda`,
  )
  const [pdf, setPdf] = useState(true)
  const [copy, setCopy] = useState(false)
  const [when, setWhen] = useState("Send now")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(dialogCard, "sm:max-w-[560px]")}>
        <DialogHeader>
          <DialogTitle className="dc-h text-[19px]">Send {NUMBER}</DialogTitle>
          <DialogDescription>
            {total}, due {due}. {contact} gets an email with a link to pay.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField label="To" htmlFor="sd-to">
            <div className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-[var(--radius)] border border-input px-2 py-1">
              <span className="dc-pill dc-pill-muted">{to}</span>
              <input id="sd-to" className="min-w-24 flex-1 bg-transparent text-[14px] outline-none" placeholder="Add another…" />
            </div>
          </FormField>
          <FormField label="Cc" htmlFor="sd-cc">
            <Input id="sd-cc" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="accounts@fernwood.studio" />
          </FormField>
          <FormField label="Subject" htmlFor="sd-subject">
            <Input id="sd-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </FormField>
          <FormField label="Message" htmlFor="sd-message">
            <Textarea id="sd-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          </FormField>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <CheckRow>
              <Checkbox checked={pdf} onCheckedChange={setPdf} /> Attach the PDF
            </CheckRow>
            <CheckRow>
              <Checkbox checked={copy} onCheckedChange={setCopy} /> Send me a copy
            </CheckRow>
          </div>
        </div>
        <DialogFooter className={cn(dialogFooter, "sm:items-center")}>
          <SimpleSelect label="When to send" value={when} onChange={setWhen} options={opts("Send now", "Tomorrow at 9:00")} className="sm:mr-auto" />
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button className="font-semibold" onClick={() => onSent(when === "Send now" ? "now" : "later")}>
            <Send /> {when === "Send now" ? "Send invoice" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
