"use client"

// One invoice: the document as the client sees it, what is still owed, the payment link, a timeline
// of everything that happened to it, and the actions that fit its status.
import {
  ArrowLeft,
  BellRing,
  CircleCheck,
  CircleDollarSign,
  Copy,
  Download,
  Eye,
  FilePen,
  FileText,
  Mail,
  MoreHorizontal,
  Pencil,
  Send,
  TriangleAlert,
  Wallet,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { useOrbit, useParam } from "./context"
import { CopyField } from "./controls"
import { PAYMENTS, TODAY_DAY, clientById, invoiceById, lineItems, money, type Invoice } from "./data"
import { RecordPaymentDialog } from "./dialogs"
import { InvoiceDocument, totals } from "./invoice-doc"
import { ClientMark, PageHeader, Panel, StatusPill } from "./ui"

export function InvoiceDetailScreen() {
  return (
    <Suspense fallback={<InvoiceDetail inv={invoiceById("INV-1042")} />}>
      <FromQuery />
    </Suspense>
  )
}

function FromQuery() {
  const id = useParam("id")
  const inv = invoiceById(id ?? "INV-1042")
  return <InvoiceDetail key={inv.id} inv={inv} />
}

type Event = { icon: typeof Mail; title: string; detail: string; when: string; tone?: "good" | "bad" | "next" }

function timeline(inv: Invoice): Event[] {
  const c = clientById(inv.clientId)
  const first = c.contact.split(" ")[0]
  const created: Event = { icon: FilePen, title: "Created by Ada Ruiz", detail: `${money(inv.amount)}, ${inv.status === "Draft" ? "not sent yet" : "from a saved template"}`, when: inv.issued }
  if (inv.status === "Draft") return [created, { icon: Send, title: "Not sent", detail: "Send it, or schedule it for later.", when: "Next", tone: "next" }]
  const sent: Event = { icon: Mail, title: `Sent to ${c.email}`, detail: "With the PDF and a payment link", when: `${inv.issued}, 9:14` }
  const viewed: Event = { icon: Eye, title: `${first} opened it`, detail: inv.status === "Overdue" ? "3 times, last 5 hours ago" : "From the email, on desktop", when: inv.status === "Overdue" ? "Nov 24" : inv.issued }
  if (inv.status === "Paid") {
    const pay = PAYMENTS.find((p) => p.invoiceId === inv.id)
    return [
      created,
      sent,
      viewed,
      { icon: CircleDollarSign, title: `Paid in full by ${pay?.method.toLowerCase() ?? "card"}`, detail: `${money(inv.amount)}${pay ? `, ${money(pay.fee)} fee` : ""}`, when: inv.paidOn ?? inv.due, tone: "good" },
      { icon: Mail, title: "Receipt sent", detail: `To ${c.email}`, when: inv.paidOn ?? inv.due },
    ]
  }
  if (inv.status === "Overdue") {
    return [
      created,
      sent,
      { icon: BellRing, title: "Friendly reminder sent", detail: "3 days before the due date", when: "Automatic" },
      { icon: TriangleAlert, title: `Due date passed`, detail: inv.note, when: inv.due, tone: "bad" },
      viewed,
      { icon: BellRing, title: "Next reminder", detail: "A firmer note, with a late-fee warning", when: "Tomorrow, 9:00", tone: "next" },
    ]
  }
  return [created, sent, viewed, { icon: BellRing, title: "First reminder", detail: "3 days before the due date", when: "Scheduled", tone: "next" }]
}

function InvoiceDetail({ inv }: { inv: Invoice }) {
  const { href } = useOrbit()
  const router = useRouter()
  const [recording, setRecording] = useState(false)
  const [voiding, setVoiding] = useState(false)
  const c = clientById(inv.clientId)
  const detail = lineItems(inv)
  const pending = PAYMENTS.find((p) => p.invoiceId === inv.id && p.status === "Pending")
  const t = totals(detail.items, { type: "$", value: detail.discount }, detail.taxRate)
  const paid = inv.status === "Paid" ? t.total : 0
  const open = inv.status === "Due" || inv.status === "Overdue"
  const daysLeft = inv.dueDay - TODAY_DAY
  const link = `pay.orbit.app/ruiz/${inv.id.toLowerCase()}`

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
            <span className="dc-num">{inv.id}</span> <StatusPill status={inv.status} />
          </span>
        }
        description={
          <>
            <Link href={href("client", { id: c.id })} className="font-medium text-foreground hover:underline">
              {c.name}
            </Link>
            {inv.status === "Draft" ? " · Not sent yet" : ` · Issued ${inv.issued} · Due ${inv.due}`}
          </>
        }
        actions={
          <>
            {inv.status === "Draft" ? (
              <>
                <Button variant="outline" nativeButton={false} render={<Link href={href("invoice-new")} />}>
                  <Pencil /> Edit
                </Button>
                <Button className="font-semibold" nativeButton={false} render={<Link href={href("invoice-new")} />}>
                  <Send /> Review and send
                </Button>
              </>
            ) : open ? (
              <>
                <Button variant="outline" onClick={() => toast.success(`Reminder sent to ${c.contact}`, { description: `${inv.id}, ${money(inv.amount)}` })}>
                  <BellRing /> Send reminder
                </Button>
                <Button className="font-semibold" onClick={() => setRecording(true)}>
                  <Wallet /> Record payment
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => toast(`Downloading receipt for ${inv.id}`)}>
                <Download /> Receipt
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => router.push(href("invoice-new"))}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`${inv.id} duplicated`, { description: "The copy is a draft dated today." })}>
                  <Copy /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast(`Downloading ${inv.id}.pdf`)}>
                  <FileText /> Download PDF
                </DropdownMenuItem>
                {open ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setVoiding(true)}>
                      <XCircle /> Void invoice
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      {inv.status === "Overdue" ? (
        <div role="status" className="flex items-start gap-3 rounded-[var(--dc-radius-card)] border border-[color:color-mix(in_oklab,var(--dc-danger)_28%,var(--border))] bg-[color:color-mix(in_oklab,var(--dc-danger)_7%,var(--card))] px-4 py-3 text-[14px]">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-danger)]" aria-hidden="true" />
          <p>
            <span className="font-semibold">{inv.note}.</span> {c.contact.split(" ")[0]} has opened it 3 times. The next reminder goes out tomorrow at 9:00, or send one now.
          </p>
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid min-w-0 gap-3">
          <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Eye className="size-3.5" aria-hidden="true" /> What {c.name} sees
          </p>
          <div className="dc-card overflow-hidden p-0">
            <InvoiceDocument
              number={inv.id}
              client={c}
              issued={`${inv.issued}, 2026`}
              due={inv.status === "Draft" ? "On sending" : `${inv.due}, 2026`}
              items={detail.items}
              discount={{ type: "$", value: detail.discount }}
              taxRate={detail.taxRate}
              notes={`Thank you for working with ${"Ruiz Studio"}.`}
              terms="Payment is due within 14 days. Late invoices are charged 1.5% a month after 30 days."
              paid={paid}
              status={inv.status}
            />
          </div>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-20">
          <Panel>
            <p className="text-[13px] text-muted-foreground">{inv.status === "Paid" ? "Paid" : "Amount due"}</p>
            <p className="dc-num text-[30px] leading-tight font-semibold tracking-tight">{money(inv.status === "Paid" ? t.total : inv.amount)}</p>
            <p className={cn("mt-0.5 text-[13px]", inv.status === "Overdue" ? "font-medium text-[color:var(--dc-danger)]" : "text-muted-foreground")}>
              {inv.status === "Paid" ? `On ${inv.paidOn}, ${inv.note === `Paid ${inv.paidOn}` ? "in full" : ""}`.replace(/, $/, "") : inv.status === "Draft" ? "Not sent yet" : inv.status === "Overdue" ? inv.note : `Due ${inv.due}, in ${daysLeft} days`}
            </p>
            {pending ? (
              <div className="mt-4">
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>{money(pending.amount)} on its way</span>
                  <span>{Math.round((pending.amount / inv.amount) * 100)}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[color:var(--chart-1)]" style={{ width: `${(pending.amount / inv.amount) * 100}%` }} />
                </div>
                <p className="mt-1.5 text-[12px] text-muted-foreground">ACH debit started {pending.date}, clears in 2 to 3 days.</p>
              </div>
            ) : null}
            {open ? (
              <div className="mt-4 grid gap-1.5">
                <p className="text-[13px] font-medium">Payment link</p>
                <CopyField value={link} label="Payment link" />
              </div>
            ) : null}
          </Panel>

          <Panel title="Timeline">
            <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-[13px] before:w-px before:bg-border">
              {timeline(inv).map((e, i) => (
                <li key={i} className="relative flex gap-3">
                  <span
                    className={cn(
                      "z-10 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-[color:var(--card)] text-muted-foreground",
                      e.tone === "good" && "border-transparent bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]",
                      e.tone === "bad" && "border-transparent bg-[color:color-mix(in_oklab,var(--dc-danger)_14%,var(--card))] text-[color:var(--dc-danger)]",
                      e.tone === "next" && "border-dashed",
                    )}
                  >
                    <e.icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={cn("text-[13px] leading-snug font-medium", e.tone === "next" && "text-muted-foreground")}>{e.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {e.detail} · {e.when}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Client">
            <Link href={href("client", { id: c.id })} className="-m-2 flex items-center gap-3 rounded-[var(--radius)] p-2 transition-colors hover:bg-muted">
              <ClientMark name={c.name} className="size-10 text-[12px]" />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{c.name}</span>
                <span className="block truncate text-[13px] text-muted-foreground">
                  {c.contact} · {c.email}
                </span>
              </span>
            </Link>
            <p className="mt-3 text-[13px] text-muted-foreground">
              {c.invoices} invoices with Orbit. Pays in <span className="font-semibold text-foreground">{c.daysToPay} days</span> on average.
            </p>
          </Panel>
        </aside>
      </div>

      <RecordPaymentDialog open={recording} onOpenChange={setRecording} invoiceId={inv.id} />
      <AlertDialog open={voiding} onOpenChange={setVoiding}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">Void {inv.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              The payment link stops working and reminders stop. {c.contact} gets a short note that the invoice was cancelled. You can’t undo this, but you can duplicate it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setVoiding(false)
                toast(`${inv.id} voided`, { description: `${c.contact} was told by email.` })
              }}
            >
              <CircleCheck /> Void invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
