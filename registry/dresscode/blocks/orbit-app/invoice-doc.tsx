// The invoice as the client sees it: the payment page Orbit hosts (the PDF has the same layout), and
// the email that links to it. The editor's preview and the invoice page both render these, so what
// you check is what they get.
import { CreditCard, Landmark, Lock } from "lucide-react"

import { cn } from "@/lib/utils"

import { ME, money, type Client, type LineItem } from "./data"
import { LogoMark } from "./ui"

export type Discount = { type: "%" | "$"; value: number }

export function totals(items: LineItem[], discount: Discount, taxRate: number) {
  const subtotal = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0)
  const off = Math.min(subtotal, discount.type === "%" ? (subtotal * discount.value) / 100 : discount.value)
  const tax = ((subtotal - off) * taxRate) / 100
  return { subtotal, discount: off, tax, total: subtotal - off + tax }
}

export const STUDIO = {
  name: "Ruiz Studio",
  initials: "RS",
  address: ["214 Alder Street, Suite 3", "Portland, OR 97204"],
  email: ME.email,
  taxId: "EIN 84-2219034",
}

export type InvoiceDocProps = {
  number: string
  client: Client
  issued: string
  due: string
  items: LineItem[]
  discount: Discount
  taxRate: number
  taxLabel?: string
  currency?: string
  notes?: string
  terms?: string
  /** Money already received on the invoice. */
  paid?: number
  status?: "Draft" | "Due" | "Overdue" | "Paid"
  className?: string
}

export function InvoiceDocument({
  number,
  client,
  issued,
  due,
  items,
  discount,
  taxRate,
  taxLabel = "Sales tax",
  currency = "USD",
  notes,
  terms,
  paid = 0,
  status,
  className,
}: InvoiceDocProps) {
  const t = totals(items, discount, taxRate)
  const owed = Math.max(0, t.total - paid)
  const m = (n: number) => money(n, currency)
  return (
    <article aria-label={`Invoice ${number}`} className={cn("relative overflow-hidden bg-[color:var(--card)] text-[14px] text-foreground", className)}>
      <div className="h-1.5 bg-[color:var(--dc-accent)]" aria-hidden="true" />
      <div className="p-6 sm:p-9">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-[calc(var(--radius)+2px)] bg-primary text-[14px] font-bold text-primary-foreground">{STUDIO.initials}</span>
            <div className="text-[13px] leading-relaxed text-muted-foreground">
              <p className="text-[15px] font-semibold text-foreground">{STUDIO.name}</p>
              {STUDIO.address.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p>{STUDIO.email}</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="dc-h text-[30px] leading-none">Invoice</p>
            <p className="dc-num mt-2 text-[14px] text-muted-foreground">{number}</p>
            {status === "Paid" ? <p className="dc-pill dc-pill-hl mt-2">Paid in full</p> : null}
            {status === "Overdue" ? <p className="dc-pill dc-pill-danger mt-2">Past due</p> : null}
          </div>
        </header>

        <dl className="mt-8 grid gap-5 rounded-[calc(var(--radius)+2px)] bg-muted/60 p-4 sm:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <dt className="text-[12px] text-muted-foreground">Billed to</dt>
            <dd className="mt-1 leading-snug">
              <span className="block font-semibold">{client.name}</span>
              <span className="block text-[13px] text-muted-foreground">{client.contact}</span>
              <span className="block text-[13px] text-muted-foreground">{client.city}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted-foreground">Issued</dt>
            <dd className="mt-1 font-medium">{issued}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted-foreground">Due</dt>
            <dd className="mt-1 font-medium">{due}</dd>
          </div>
          <div className="sm:text-right">
            <dt className="text-[12px] text-muted-foreground">Amount due</dt>
            <dd className="dc-num mt-1 text-[22px] leading-tight font-semibold tracking-tight">{m(owed)}</dd>
          </div>
        </dl>

        <table className="mt-8 w-full text-left">
          <thead>
            <tr className="border-b border-border text-[12px] text-muted-foreground">
              <th className="pb-2 font-medium">Description</th>
              <th className="hidden w-16 pb-2 text-right font-medium sm:table-cell">Qty</th>
              <th className="hidden w-28 pb-2 text-right font-medium sm:table-cell">Rate</th>
              <th className="w-28 pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-border align-top">
                <td className="py-3 pr-3">
                  <span className="block font-medium">{it.description || "Untitled item"}</span>
                  <span className="dc-num block text-[12px] text-muted-foreground sm:hidden">
                    {it.qty} × {m(Number(it.rate) || 0)}
                  </span>
                </td>
                <td className="dc-num hidden py-3 text-right text-muted-foreground sm:table-cell">{it.qty}</td>
                <td className="dc-num hidden py-3 text-right text-muted-foreground sm:table-cell">{m(Number(it.rate) || 0)}</td>
                <td className="dc-num py-3 text-right font-medium">{m((Number(it.qty) || 0) * (Number(it.rate) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="dc-num grid w-full max-w-[300px] gap-2 text-[14px]">
            <Row label="Subtotal" value={m(t.subtotal)} />
            {t.discount > 0 ? <Row label={discount.type === "%" ? `Discount (${discount.value}%)` : "Discount"} value={`−${m(t.discount)}`} /> : null}
            {taxRate > 0 ? <Row label={`${taxLabel} (${taxRate}%)`} value={m(t.tax)} /> : null}
            <Row label="Total" value={m(t.total)} strong />
            {paid > 0 ? <Row label="Paid" value={`−${m(paid)}`} /> : null}
            {paid > 0 ? <Row label="Amount due" value={m(owed)} strong /> : null}
          </dl>
        </div>

        {notes || terms ? (
          <div className="mt-8 grid gap-5 border-t border-border pt-6 text-[13px] leading-relaxed sm:grid-cols-2">
            {notes ? (
              <div>
                <p className="font-semibold">Notes</p>
                <p className="mt-1 whitespace-pre-line text-muted-foreground">{notes}</p>
              </div>
            ) : null}
            {terms ? (
              <div>
                <p className="font-semibold">Terms</p>
                <p className="mt-1 whitespace-pre-line text-muted-foreground">{terms}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="border-t border-border bg-muted/40 px-6 py-5 sm:px-9">
        {status === "Paid" ? (
          <p className="text-[14px] font-medium">Thanks, this invoice is paid. A receipt went to {client.email}.</p>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
              <span className="dc-pill dc-pill-line">
                <CreditCard className="size-3" aria-hidden="true" /> Card
              </span>
              <span className="dc-pill dc-pill-line">
                <Landmark className="size-3" aria-hidden="true" /> Bank transfer
              </span>
              <span className="flex items-center gap-1">
                <Lock className="size-3" aria-hidden="true" /> Secure payment
              </span>
            </div>
            <span
              aria-hidden="true"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[14px] font-semibold text-primary-foreground in-[.dc-brutal]:border-[1.5px] in-[.dc-brutal]:border-[color:var(--dc-ink)] in-[.dc-brutal]:shadow-[2px_2px_0_var(--dc-ink)]"
            >
              Pay {m(owed)}
            </span>
          </div>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <LogoMark className="size-3.5" /> Sent with Orbit · {STUDIO.taxId}
        </p>
      </footer>
    </article>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", strong && "border-t border-border pt-2 text-[16px] font-semibold")}>
      <dt className={cn(!strong && "font-sans text-muted-foreground")}>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** The email the client gets, with the button that opens the payment page. */
export function InvoiceEmail({
  number,
  client,
  due,
  total,
  message,
  subject,
  className,
}: {
  number: string
  client: Client
  due: string
  total: number
  message: string
  subject: string
  className?: string
}) {
  return (
    <article aria-label="Invoice email" className={cn("bg-[color:var(--card)] text-[14px]", className)}>
      <dl className="grid gap-1.5 border-b border-border px-6 py-4 text-[13px] sm:px-8">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted-foreground">From</dt>
          <dd>
            {STUDIO.name} via Orbit <span className="text-muted-foreground">&lt;invoices@orbit.app&gt;</span>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted-foreground">To</dt>
          <dd>
            {client.contact} <span className="text-muted-foreground">&lt;{client.email}&gt;</span>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted-foreground">Subject</dt>
          <dd className="font-semibold">{subject}</dd>
        </div>
      </dl>
      <div className="px-6 py-7 sm:px-8">
        <p className="whitespace-pre-line leading-relaxed">{message}</p>
        <div className="mt-6 rounded-[calc(var(--radius)+2px)] border border-border p-5 text-center">
          <p className="text-[13px] text-muted-foreground">
            {number} from {STUDIO.name}
          </p>
          <p className="dc-num mt-1 text-[28px] font-semibold tracking-tight">{money(total)}</p>
          <p className="text-[13px] text-muted-foreground">Due {due}</p>
          <span
            aria-hidden="true"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[14px] font-semibold text-primary-foreground in-[.dc-brutal]:border-[1.5px] in-[.dc-brutal]:border-[color:var(--dc-ink)] in-[.dc-brutal]:shadow-[2px_2px_0_var(--dc-ink)]"
          >
            View and pay invoice
          </span>
          <p className="mt-3 text-[12px] text-muted-foreground">The PDF is attached.</p>
        </div>
      </div>
    </article>
  )
}
