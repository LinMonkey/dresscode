"use client"

// Dialogs more than one screen opens (from a button, a row menu or the command palette): add a client,
// record a payment, invite a teammate. Each checks its fields and confirms with a toast.
import { useState, type FormEvent, type ReactNode } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import type { SharedDialog } from "./context"
import { CheckRow, FormField, SimpleSelect, opts } from "./controls"
import { INVOICES, TODAY, clientById, money, type Role } from "./data"

export const dialogCard = "dc-card gap-5 p-5 ring-0 sm:max-w-[480px]"
export const dialogFooter = "-mx-5 -mb-5 rounded-b-[var(--dc-radius-card)] border-border px-5 py-4"

export function SharedDialogs({ open, onOpenChange }: { open: SharedDialog | null; onOpenChange: (o: boolean) => void }) {
  return (
    <>
      <AddClientDialog open={open === "client"} onOpenChange={onOpenChange} />
      <RecordPaymentDialog open={open === "payment"} onOpenChange={onOpenChange} />
      <InviteDialog open={open === "invite"} onOpenChange={onOpenChange} />
    </>
  )
}

function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  submit,
  children,
  wide = false,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  description: string
  onSubmit: () => boolean
  submit: string
  children: ReactNode
  wide?: boolean
}) {
  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit()) onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(dialogCard, wide && "sm:max-w-[560px]")}>
        <form onSubmit={handle} className="grid gap-5" noValidate>
          <DialogHeader>
            <DialogTitle className="dc-h text-[19px]">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">{children}</div>
          <DialogFooter className={dialogFooter}>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" className="font-semibold">
              {submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AddClientDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [contact, setContact] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [terms, setTerms] = useState("Net 14")
  const [remind, setRemind] = useState(true)
  const [tried, setTried] = useState(false)
  const nameErr = tried && !name.trim() ? "Add the business or person you bill." : null
  const emailErr = tried && !/^\S+@\S+\.\S+$/.test(email) ? "Invoices go to this address, so it needs to be a real one." : null
  return (
    <DialogShell
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setTried(false)
      }}
      title="Add a client"
      description="Who you bill, where invoices go, and how long they have to pay."
      submit="Add client"
      onSubmit={() => {
        setTried(true)
        if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false
        toast.success(`${name} added`, { description: `${terms}, billed in ${currency}${remind ? ", reminders on" : ""}.` })
        setName("")
        setEmail("")
        setContact("")
        setTried(false)
        return true
      }}
    >
      <FormField label="Business name" htmlFor="ac-name" error={nameErr}>
        <Input id="ac-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fernwood Studio" aria-invalid={!!nameErr} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Contact person" htmlFor="ac-contact">
          <Input id="ac-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Mara Lind" />
        </FormField>
        <FormField label="Billing email" htmlFor="ac-email" error={emailErr}>
          <Input id="ac-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="billing@fernwood.studio" aria-invalid={!!emailErr} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Currency" htmlFor="ac-cur">
          <SimpleSelect id="ac-cur" value={currency} onChange={setCurrency} options={opts("USD", "EUR", "GBP", "CAD", "AUD")} className="w-full" />
        </FormField>
        <FormField label="Payment terms" htmlFor="ac-terms">
          <SimpleSelect id="ac-terms" value={terms} onChange={setTerms} options={opts("Due on receipt", "Net 7", "Net 14", "Net 30")} className="w-full" />
        </FormField>
      </div>
      <label className="flex items-center justify-between gap-4 rounded-[calc(var(--radius)+2px)] border border-border px-3 py-2.5">
        <span>
          <span className="block text-[14px] font-medium">Send reminders automatically</span>
          <span className="block text-[12px] text-muted-foreground">Uses your reminder plan in Settings.</span>
        </span>
        <Switch checked={remind} onCheckedChange={setRemind} />
      </label>
    </DialogShell>
  )
}

const OPEN = INVOICES.filter((i) => i.status === "Due" || i.status === "Overdue")

export function RecordPaymentDialog({
  open,
  onOpenChange,
  invoiceId,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  invoiceId?: string
}) {
  const first = OPEN.find((i) => i.id === invoiceId) ?? OPEN[0]
  const [inv, setInv] = useState(first.id)
  const [amount, setAmount] = useState(first.amount.toFixed(2))
  const [method, setMethod] = useState("Bank transfer")
  const [date, setDate] = useState(TODAY)
  const [ref, setRef] = useState("")
  const [receipt, setReceipt] = useState(true)
  const [tried, setTried] = useState(false)
  const current = OPEN.find((i) => i.id === inv) ?? first
  const value = Number(amount)
  const amountErr = tried && (!(value > 0) || value > current.amount) ? `Enter an amount up to ${money(current.amount)}.` : null
  return (
    <DialogShell
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (o) {
          setInv(first.id)
          setAmount(first.amount.toFixed(2))
        }
        setTried(false)
      }}
      title="Record a payment"
      description="For money that reached you outside Orbit: a bank transfer, a check, cash."
      submit="Record payment"
      onSubmit={() => {
        setTried(true)
        if (!(value > 0) || value > current.amount) return false
        const part = value < current.amount
        toast.success(`${money(value)} recorded on ${current.id}`, {
          description: part ? `${money(current.amount - value)} still due.` : `${current.id} is now paid${receipt ? ", receipt sent" : ""}.`,
        })
        return true
      }}
    >
      <FormField label="Invoice" htmlFor="rp-inv">
        <SimpleSelect
          id="rp-inv"
          value={inv}
          onChange={(v) => {
            setInv(v)
            setAmount((OPEN.find((i) => i.id === v)?.amount ?? 0).toFixed(2))
          }}
          options={OPEN.map((i) => ({ value: i.id, label: `${i.id} · ${clientById(i.clientId).name} · ${money(i.amount)}` }))}
          className="w-full"
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Amount received" htmlFor="rp-amount" error={amountErr} hint={`Open balance ${money(current.amount)}`}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="rp-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="dc-num pl-6" aria-invalid={!!amountErr} />
          </div>
        </FormField>
        <FormField label="Date received" htmlFor="rp-date">
          <Input id="rp-date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Method" htmlFor="rp-method">
          <SimpleSelect id="rp-method" value={method} onChange={setMethod} options={opts("Bank transfer", "Check", "Cash", "Card in person", "Other")} className="w-full" />
        </FormField>
        <FormField label="Reference" htmlFor="rp-ref" hint="Optional: a check number or transfer ID.">
          <Input id="rp-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="TRF-88231" />
        </FormField>
      </div>
      <CheckRow>
        <Checkbox checked={receipt} onCheckedChange={setReceipt} />
        Email a receipt to {clientById(current.clientId).contact}
      </CheckRow>
    </DialogShell>
  )
}

const ROLE_NOTES: Record<Exclude<Role, "Owner">, string> = {
  Admin: "Everything except plan and billing.",
  Accountant: "Sees and exports all money. Can't send invoices.",
  Viewer: "Read-only. Good for a business partner.",
}

export function InviteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [emails, setEmails] = useState("")
  const [role, setRole] = useState<Exclude<Role, "Owner">>("Admin")
  const [note, setNote] = useState("")
  const [tried, setTried] = useState(false)
  const list = emails.split(/[\s,]+/).filter(Boolean)
  const bad = list.filter((e) => !/^\S+@\S+\.\S+$/.test(e))
  const err = tried && (!list.length || bad.length) ? (list.length ? `Check ${bad.join(", ")}.` : "Add at least one email address.") : null
  return (
    <DialogShell
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        setTried(false)
      }}
      title="Invite teammates"
      description="They get an email with a link that works for 7 days."
      submit={list.length > 1 ? `Send ${list.length} invites` : "Send invite"}
      onSubmit={() => {
        setTried(true)
        if (!list.length || bad.length) return false
        toast.success(list.length > 1 ? `${list.length} invites sent` : `Invite sent to ${list[0]}`, { description: `As ${role}.` })
        setEmails("")
        setNote("")
        return true
      }}
    >
      <FormField label="Email addresses" htmlFor="inv-emails" error={err} hint="Separate several with commas.">
        <Input id="inv-emails" value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="jo@ruizstudio.co, sam@ruizstudio.co" aria-invalid={!!err} />
      </FormField>
      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[13px] font-medium">Role</legend>
        {(Object.keys(ROLE_NOTES) as Exclude<Role, "Owner">[]).map((r) => (
          <label
            key={r}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[calc(var(--radius)+2px)] border border-border px-3 py-2.5 transition-colors has-[:checked]:border-[color:var(--dc-accent)] has-[:checked]:bg-[color:color-mix(in_oklab,var(--dc-accent)_6%,transparent)]",
            )}
          >
            <input type="radio" name="invite-role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-1 accent-[color:var(--dc-accent)]" />
            <span>
              <span className="block text-[14px] font-medium">{r}</span>
              <span className="block text-[12px] text-muted-foreground">{ROLE_NOTES[r]}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <FormField label="Personal note" htmlFor="inv-note" hint="Optional. Shows above the link in the email.">
        <Textarea id="inv-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Welcome aboard! This is where we send invoices." rows={2} />
      </FormField>
    </DialogShell>
  )
}
