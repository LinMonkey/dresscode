"use client"

// Features, tabs: one tab per job (send, follow up, get paid, plan), each swapping in a picture of the
// product doing that job. The tabs are shadcn Tabs (Base UI): the panel follows focus. The stock Tabs
// wrapper uses orientation for styling only (Base UI's list stays horizontal, so Left and Right move
// between tabs), so the block adds Up and Down for the list it draws as a column. The pictures are drawn
// in markup so they wear the theme; they are hidden from screen readers, and each tab's own text says
// what its picture shows. On phones the tabs sit two by two above the panel, and the panel repeats the
// line the tab shows on desktop.
import { BellRing, ChartColumn, Check, CreditCard, Landmark, Mail, Send, type LucideIcon } from "lucide-react"
import type { ComponentType, KeyboardEvent } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const field = "flex h-9 items-center rounded-[var(--radius)] border border-input px-3"
const box = "rounded-[calc(var(--radius)+2px)] border border-border"

function SendPicture() {
  return (
    <div aria-hidden="true" className="grid gap-3 text-[13px] sm:grid-cols-[1.25fr_1fr]">
      <div className="dc-card p-5">
        <div className="flex items-center justify-between">
          <p className="dc-h text-[17px]">New invoice</p>
          <span className="dc-num text-muted-foreground">INV-1043</span>
        </div>
        <p className="mt-4 text-[12px] font-semibold">Client</p>
        <p className={cn(field, "mt-1 justify-between")}>
          Fernwood Studio <span className="text-[12px] text-muted-foreground">USD</span>
        </p>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {[
            ["Brand identity, phase 2", "$3,200.00"],
            ["Website copy, 8 h", "$800.00"],
            ["Stock licences", "$200.00"],
          ].map(([line, amount]) => (
            <li key={line} className="flex justify-between gap-3 py-2.5">
              <span className="truncate">{line}</span>
              <span className="dc-num">{amount}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="dc-num text-[20px] font-semibold tracking-tight">$4,200.00</span>
        </div>
        <span className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">
          <Send className="size-3.5" /> Send invoice
        </span>
      </div>
      <div className="dc-card flex flex-col p-5">
        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Mail className="size-3.5" /> What Maya sees
        </p>
        <p className="mt-3 font-semibold">Ada sent you an invoice</p>
        <p className="mt-1 text-muted-foreground">Brand identity and website copy.</p>
        <div className="mt-4 rounded-[calc(var(--radius)+2px)] bg-muted p-4 text-center">
          <p className="text-[12px] text-muted-foreground">Amount due</p>
          <p className="dc-num mt-1 text-[24px] font-semibold tracking-tight">$4,200.00</p>
        </div>
        <dl className="mt-3 divide-y divide-border">
          {[
            ["Due", "Dec 8, 2026"],
            ["Pay by", "Card or bank"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-1 items-end">
          <span className="flex h-9 w-full items-center justify-center rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">Pay invoice</span>
        </div>
      </div>
    </div>
  )
}

const PLAN = [
  { date: "Nov 17", what: "Friendly heads-up", note: "Opened by Tom", done: true },
  { date: "Nov 20", what: "Due today, with the link", note: "Opened by Tom", done: true },
  { date: "Nov 27", what: "A firmer nudge", note: "Goes out at 9:00", done: false },
]

function RemindPicture() {
  return (
    <div aria-hidden="true" className="dc-card overflow-hidden text-[13px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
        <div>
          <p className="font-semibold">INV-1041 · Kato &amp; Lee</p>
          <p className="text-muted-foreground">$1,860.00, due Nov 20</p>
        </div>
        <span className="dc-pill dc-pill-danger">7 days late</span>
      </div>
      <div className="grid sm:grid-cols-[1fr_1.15fr]">
        <div className="p-4 sm:p-5">
          <p className="text-[12px] font-semibold">Tone</p>
          <div className="mt-2 grid grid-cols-3 rounded-[var(--radius)] bg-muted p-[3px]">
            {["Friendly", "Neutral", "Firm"].map((t, i) => (
              <span key={t} className={cn("rounded-[calc(var(--radius)-2px)] py-1 text-center", i === 0 ? "bg-card font-semibold shadow-sm" : "text-muted-foreground")}>
                {t}
              </span>
            ))}
          </div>
          <ol className="mt-5 space-y-4">
            {PLAN.map((s) => (
              <li key={s.date} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2",
                    s.done ? "border-[color:var(--dc-accent)] bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "border-border",
                  )}
                >
                  {s.done ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">
                    <span className="dc-num">{s.date}</span> · {s.what}
                  </span>
                  <span className="text-muted-foreground">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_2.5%,var(--card))] p-4 sm:border-t-0 sm:border-l sm:p-5">
          <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Mail className="size-3.5" /> Next, on Nov 27
          </p>
          <p className="mt-3 font-semibold">Following up on INV-1041</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Hi Tom, invoice INV-1041 for $1,860 is now a week past due. If it has slipped through, you can pay it here in a minute. Thanks, Ada
          </p>
          <span className="mt-4 inline-flex h-8 items-center rounded-[var(--radius)] bg-primary px-3 font-semibold text-primary-foreground">Pay invoice</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
        <span className="text-muted-foreground">Add a 2% late fee after 14 days</span>
        <span className="flex h-5 w-9 shrink-0 items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-ink)_22%,transparent)] p-0.5">
          <span className="size-4 rounded-full bg-card shadow-sm" />
        </span>
      </div>
    </div>
  )
}

function PaidPicture() {
  return (
    <div aria-hidden="true" className="grid gap-3 text-[13px] sm:grid-cols-[1.1fr_1fr]">
      <div className="dc-card flex flex-col p-5">
        <p className="text-muted-foreground">Pay Fernwood Studio</p>
        <p className="dc-num mt-1 text-[28px] font-semibold tracking-tight">$4,200.00</p>
        <p className="mt-4 text-[12px] font-semibold">Pay with</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <span className="flex h-10 items-center gap-2 rounded-[var(--radius)] border-2 border-[color:var(--dc-accent)] px-3 font-semibold">
            <CreditCard className="size-4 text-[color:var(--dc-accent)]" /> Card
          </span>
          <span className="flex h-10 items-center gap-2 rounded-[var(--radius)] border border-input px-3 text-muted-foreground">
            <Landmark className="size-4" /> Bank
          </span>
        </div>
        <p className={cn(field, "dc-num mt-3 justify-between")}>
          •••• •••• •••• 4242 <span className="text-muted-foreground">12/28</span>
        </p>
        <div className="mt-auto pt-4">
          <span className="flex h-9 items-center justify-center rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground">Pay $4,200.00</span>
          <p className="mt-2 text-center text-[12px] text-muted-foreground">A receipt goes to Maya by email</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="dc-card flex items-center gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Payment received</p>
            <p className="truncate text-muted-foreground">Fernwood Studio, INV-1043</p>
          </div>
          <span className="dc-num font-semibold">$4,200</span>
        </div>
        <div className="dc-card flex-1 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Payout</p>
            <span className="dc-pill dc-pill-line">Arrives Thursday</span>
          </div>
          <p className="mt-1 text-muted-foreground">To your account ending 42</p>
          <ol className="mt-4 grid grid-cols-3 gap-1.5">
            {["Paid", "On its way", "In your bank"].map((s, i) => (
              <li key={s}>
                <span className={cn("block h-1.5 rounded-full", i < 2 ? "bg-[color:var(--dc-accent)]" : "bg-muted")} />
                <span className={cn("mt-2 block text-[12px]", i < 2 ? "font-semibold" : "text-muted-foreground")}>{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[12px] font-semibold text-muted-foreground">Earlier this month</p>
          <ul className="mt-1 divide-y divide-border">
            {[
              ["Nov 18", "Northlight", "$7,450.00"],
              ["Nov 12", "Juniper Labs", "$2,300.00"],
            ].map(([date, who, amount]) => (
              <li key={date} className="flex items-center gap-3 py-2">
                <span className="dc-num w-12 shrink-0 text-muted-foreground">{date}</span>
                <span className="min-w-0 flex-1 truncate">{who}</span>
                <span className="dc-num">{amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CASH = [18, 22, 19, 26, 24, 30, 28, 33, 31, 38, 42, 46]

function PlanPicture() {
  return (
    <div aria-hidden="true" className="dc-card p-5 text-[13px] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted-foreground">Expected in December</p>
          <p className="dc-num text-[30px] font-semibold tracking-tight">$18,450</p>
        </div>
        <span className="dc-pill dc-pill-hl">+$2,300 on November</span>
      </div>
      <div className="mt-5 flex h-[180px] items-end gap-[2%] border-b border-border">
        {CASH.map((v, i) => (
          <span
            key={MONTHS[i]}
            className={cn("flex-1 rounded-t-[3px]", i === 11 ? "bg-[color:var(--chart-1)] opacity-45" : "bg-[color:var(--chart-1)]")}
            style={{ height: `${(v / 48) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex gap-[2%] text-center text-[11px] text-muted-foreground">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1">
            {m.slice(0, 1)}
          </span>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Paid", value: "$9,860", tone: "var(--chart-1)" },
          { label: "Due", value: "$6,290", tone: "var(--chart-2)" },
          { label: "At risk", value: "$2,300", tone: "var(--dc-danger)" },
        ].map((s) => (
          <div key={s.label} className={cn(box, "p-3")}>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <i className="size-2 rounded-full" style={{ background: s.tone }} /> {s.label}
            </dt>
            <dd className="dc-num mt-1 text-[17px] font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Up and Down move through the tabs too (the list is drawn as a column), wrapping at the ends. */
function moveWithUpDown(e: KeyboardEvent<HTMLDivElement>) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'))
  const i = tabs.findIndex((tab) => tab === document.activeElement)
  if (i < 0) return
  e.preventDefault()
  const next = tabs[(i + (e.key === "ArrowDown" ? 1 : tabs.length - 1)) % tabs.length]
  next.focus()
  next.click()
}

const JOBS: { id: string; icon: LucideIcon; label: string; body: string; Picture: ComponentType }[] = [
  {
    id: "send",
    icon: Send,
    label: "Send",
    body: "Saved clients and terms. Out the door with a payment link in a minute.",
    Picture: SendPicture,
  },
  {
    id: "remind",
    icon: BellRing,
    label: "Follow up",
    body: "Reminders in your tone, before and after the due date, until they pay.",
    Picture: RemindPicture,
  },
  {
    id: "paid",
    icon: CreditCard,
    label: "Get paid",
    body: "Card or bank transfer, in your account two working days later.",
    Picture: PaidPicture,
  },
  {
    id: "plan",
    icon: ChartColumn,
    label: "Plan",
    body: "What should land this month, what is paid and what is at risk.",
    Picture: PlanPicture,
  },
]

export default function FeaturesTabs() {
  return (
    <section aria-labelledby="features-tabs-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Tabs defaultValue="send" orientation="vertical" className="grid gap-8 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">How it works</p>
            <h2 id="features-tabs-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              Four jobs, one calm app
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">Pick a job to see how Orbit does it for you.</p>
            <TabsList
              activateOnFocus
              onKeyDown={moveWithUpDown}
              aria-label="Jobs Orbit does"
              className="mt-8 grid h-auto w-full grid-cols-2 items-stretch gap-2 bg-transparent p-0 lg:grid-cols-1"
            >
              {JOBS.map(({ id, icon: Icon, label, body }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="h-auto items-center justify-start gap-3 rounded-[calc(var(--radius)+4px)] border-border px-3 py-2.5 text-left whitespace-normal text-foreground hover:bg-muted/70 data-active:border-[color:var(--dc-accent)] data-active:bg-card data-active:shadow-sm lg:items-start lg:p-4 dark:text-foreground dark:data-active:border-[color:var(--dc-accent)] dark:data-active:bg-card"
                >
                  <span className="dc-icon size-8 shrink-0 lg:size-9">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold lg:mt-0.5">{label}</span>
                    <span className="mt-1 hidden text-[14px] leading-snug font-normal text-muted-foreground lg:block">{body}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {JOBS.map(({ id, body, Picture }) => (
            <TabsContent
              key={id}
              value={id}
              className="min-w-0 rounded-[var(--dc-radius-card)] bg-[color:color-mix(in_oklab,var(--dc-accent)_7%,var(--background))] p-4 focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-8 lg:flex lg:min-h-[540px] lg:items-center"
            >
              <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground lg:hidden">{body}</p>
              <div className="w-full">
                <Picture />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
