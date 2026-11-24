// Bento grid, product: six cells of mixed sizes, each a feature with a small working picture of it. On
// desktop the portal spans two columns, the phone cell runs down two rows and the export spans two
// columns at the bottom; on tablets the grid is two across (the phone cell still runs down two rows) and
// on phones one. Cells in a row share a
// height, and each picture sits at the bottom of its cell so the bottoms line up. The pictures are drawn
// in markup so they wear the theme; they are hidden from screen readers and each cell's copy says what
// its picture shows.
import { CalendarCheck, Check, CreditCard, Download, Fingerprint, Landmark, Link2, Send } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const inset = "rounded-[calc(var(--radius)+4px)] border border-border bg-background"

function Cell({ className, title, body, children, visualClassName }: { className?: string; title: string; body: string; children: ReactNode; visualClassName?: string }) {
  return (
    <div className={cn("dc-card flex flex-col overflow-hidden", className)}>
      <div className="p-6 pb-0 sm:p-7 sm:pb-0">
        <h3 className="dc-h text-[20px] leading-snug sm:text-[22px]">{title}</h3>
        <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-pretty text-muted-foreground">{body}</p>
      </div>
      <div aria-hidden="true" className={cn("mt-auto p-6 pt-7 text-[13px] sm:p-7", visualClassName)}>
        {children}
      </div>
    </div>
  )
}

/** A switch drawn in the on position. */
function SwitchOn() {
  return (
    <span className="flex h-5 w-9 shrink-0 items-center justify-end rounded-full bg-primary p-0.5">
      <span className="size-4 rounded-full bg-primary-foreground shadow-sm" />
    </span>
  )
}

const PORTAL = [
  { id: "INV-1040", what: "Website retainer, October", amount: "$1,200.00", status: "Paid" },
  { id: "INV-1042", what: "Brand identity", amount: "$4,200.00", status: "Due" },
  { id: "INV-1041", what: "Launch campaign", amount: "$1,860.00", status: "Overdue" },
] as const
const PILL = { Paid: "dc-pill-hl", Due: "dc-pill-line", Overdue: "dc-pill-danger" } as const

function PortalPicture() {
  return (
    <div className={cn(inset, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-semibold">Fernwood Studio</p>
        <span className="text-muted-foreground">3 invoices from Ada</span>
      </div>
      <ul>
        {PORTAL.map((r) => (
          <li key={r.id} className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0">
            <span className="dc-num hidden text-muted-foreground sm:inline">{r.id}</span>
            <span className="min-w-0 flex-1 truncate">{r.what}</span>
            <span className="dc-num hidden sm:inline">{r.amount}</span>
            <span className={cn("dc-pill", PILL[r.status])}>{r.status}</span>
            <span
              className={cn(
                "inline-flex h-7 w-14 items-center justify-center rounded-[var(--radius)] font-semibold",
                r.status === "Paid" ? "border border-input text-muted-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              {r.status === "Paid" ? "PDF" : "Pay"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PhonePicture() {
  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="mb-3 flex items-center gap-2.5 rounded-[calc(var(--radius)+4px)] border border-dashed border-input px-3 py-2.5 text-muted-foreground">
        <CalendarCheck className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Cake shoot done</span>
        <span className="dc-num text-[12px]">2:05 pm</span>
      </div>
      <div className="rounded-[var(--dc-radius-card)] border border-border bg-background p-4 pb-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="dc-h text-[16px]">New invoice</p>
          <span className="dc-num text-[12px] text-muted-foreground">INV-1044</span>
        </div>
        <p className="mt-3 text-[11px] font-semibold text-muted-foreground">Client</p>
        <p className="mt-1 flex h-9 items-center gap-2 rounded-[var(--radius)] border border-input px-2.5">
          <span className="grid size-5 place-items-center rounded-full bg-muted text-[9px] font-bold">OB</span> Ola Bakery
        </p>
        <p className="mt-3 text-[11px] font-semibold text-muted-foreground">Work</p>
        <ul className="mt-1 divide-y divide-border rounded-[var(--radius)] border border-border">
          {[
            ["Cake shoot, half day", "$480.00"],
            ["Edited photos, 24", "$160.00"],
          ].map(([w, a]) => (
            <li key={w} className="flex justify-between gap-2 px-2.5 py-2">
              <span className="truncate">{w}</span>
              <span className="dc-num">{a}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between text-muted-foreground">
          <span>Due</span>
          <span className="text-foreground">In 14 days</span>
        </p>
        <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
          <span className="text-muted-foreground">Total</span>
          <span className="dc-num text-[20px] font-semibold tracking-tight">$640.00</span>
        </div>
        <span className="mt-4 flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">
          <Send className="size-3.5" /> Send now
        </span>
      </div>
      <div className="relative z-10 -mt-3 ml-6 flex items-center gap-2.5 rounded-[calc(var(--radius)+4px)] border border-border bg-card p-2.5 shadow-md">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Ola opened it</span>
          <span className="block text-[12px] text-muted-foreground">Two minutes after you sent it</span>
        </span>
      </div>
    </div>
  )
}

function MethodsPicture() {
  return (
    <ul className={cn(inset, "divide-y divide-border")}>
      {[
        { icon: CreditCard, label: "Card", note: "2 working days" },
        { icon: Landmark, label: "Bank transfer", note: "2 working days" },
        { icon: Link2, label: "Payment link", note: "Share anywhere" },
      ].map(({ icon: Icon, label, note }) => (
        <li key={label} className="flex items-center gap-3 px-4 py-2.5">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{label}</span>
            <span className="block text-[12px] text-muted-foreground">{note}</span>
          </span>
          <SwitchOn />
        </li>
      ))}
    </ul>
  )
}

function CurrencyPicture() {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "SEK"].map((c, i) => (
          <span key={c} className={cn("dc-pill dc-num", i === 1 ? "dc-pill-hl" : "dc-pill-line")}>
            {c}
          </span>
        ))}
        <span className="dc-pill dc-pill-muted">+23</span>
      </div>
      <div className={cn(inset, "mt-4 flex items-center justify-between gap-2 rounded-b-none px-4 py-3")}>
        <span>
          <span className="block text-[12px] text-muted-foreground">Northlight pays</span>
          <span className="dc-num font-semibold">€3,000.00</span>
        </span>
        <span className="h-px flex-1 border-t border-dashed border-input" />
        <span className="text-right">
          <span className="block text-[12px] text-muted-foreground">You get</span>
          <span className="dc-num font-semibold">$3,248.10</span>
        </span>
      </div>
      <p className="rounded-b-[calc(var(--radius)+4px)] border border-t-0 border-border bg-muted px-4 py-2 text-[12px] text-muted-foreground">
        Rate fixed the day the invoice goes out
      </p>
    </div>
  )
}

function SecurityPicture() {
  return (
    <div className={cn(inset, "overflow-hidden")}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Fingerprint className="size-4 shrink-0 text-[color:var(--dc-accent)]" />
        <span className="flex-1 font-semibold">Two-step sign-in</span>
        <SwitchOn />
      </div>
      <ul className="divide-y divide-border">
        {[
          ["AL", "Ada", "Owner"],
          ["SK", "Sam", "Bookkeeper"],
        ].map(([initials, name, role]) => (
          <li key={name} className="flex items-center gap-3 px-4 py-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-muted text-[10px] font-bold">{initials}</span>
            <span className="flex-1">{name}</span>
            <span className="text-muted-foreground">{role}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border bg-muted px-4 py-2 text-[12px] text-muted-foreground">
        Sam exported Q3 invoices, 2 hours ago
      </p>
    </div>
  )
}

const EXPORT = [
  ["Jul 4", "INV-1031", "Juniper Labs", "$2,300.00"],
  ["Aug 12", "INV-1034", "Northlight", "$7,450.00"],
  ["Sep 29", "INV-1038", "Halcyon", "$980.00"],
]

function ExportPicture() {
  return (
    <div className={cn(inset, "overflow-hidden")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1 rounded-[var(--radius)] bg-muted p-[3px]">
          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
            <span key={q} className={cn("rounded-[calc(var(--radius)-2px)] px-2.5 py-0.5", q === "Q3" ? "bg-card font-semibold shadow-sm" : "text-muted-foreground")}>
              {q}
            </span>
          ))}
        </div>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">
          <Download className="size-3.5" /> Download CSV
        </span>
      </div>
      <table className="w-full">
        <tbody>
          {EXPORT.map(([date, id, client, amount]) => (
            <tr key={id} className="border-b border-border last:border-b-0">
              <td className="dc-num py-2.5 pl-4 text-muted-foreground">{date}</td>
              <td className="dc-num hidden py-2.5 pl-3 text-muted-foreground lg:table-cell">{id}</td>
              <td className="py-2.5 pl-3">{client}</td>
              <td className="dc-num py-2.5 pr-4 pl-3 text-right">{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function BentoGridProduct() {
  return (
    <section aria-labelledby="bento-grid-product-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">And the rest</p>
          <h2 id="bento-grid-product-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Small things that save whole afternoons
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">The parts of Orbit nobody asks about until the day they need them.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Cell
            className="md:col-span-2"
            title="A portal for every client"
            body="Clients see every invoice you sent them, download receipts and pay, without making an account."
          >
            <PortalPicture />
          </Cell>
          <Cell
            className="md:row-span-2"
            title="Send it from the job"
            body="Finish the shoot, add the lines on your phone and send the invoice before you pack up."
            visualClassName="flex flex-1 items-end justify-center"
          >
            <PhonePicture />
          </Cell>
          <Cell title="Cards and bank transfer" body="Turn on the ways you want to be paid. Money lands in two working days.">
            <MethodsPicture />
          </Cell>
          <Cell title="30 currencies" body="Bill in your client's currency and get paid out in yours.">
            <CurrencyPicture />
          </Cell>
          <Cell title="Locked down" body="Two-step sign-in, roles for your team and a log of every change.">
            <SecurityPicture />
          </Cell>
          <Cell
            className="lg:col-span-2"
            title="Ready for tax time"
            body="Every invoice and payment for the quarter in one tidy CSV your accountant will like."
          >
            <ExportPicture />
          </Cell>
        </div>
      </div>
    </section>
  )
}
