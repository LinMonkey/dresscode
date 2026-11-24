"use client"

// Two screens for when there is nothing to show: Recurring invoices before the first retainer (an
// empty state that suggests where to start, from the clients you already bill the same each month),
// and the 404 page, with a search that finds the invoice or client you were after.
import { ArrowLeft, ArrowRight, CalendarSync, FileText, LifeBuoy, Repeat, Search, Upload, Users, Wallet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { useOrbit } from "./context"
import { FormField, SimpleSelect, opts } from "./controls"
import { dialogCard, dialogFooter } from "./dialogs"
import { CLIENTS, INVOICES, clientById, money } from "./data"
import { ClientMark, EmptyState, LogoMark, PageHeader, Panel, StatusPill, inner } from "./ui"

const SUGGESTED = [
  { id: "fernwood-studio", amount: 4200, pattern: "8 of the last 9 months" },
  { id: "halcyon", amount: 1500, pattern: "Every month since Nov 2024" },
  { id: "alder-coffee", amount: 1050, pattern: "Every month since Dec 2024" },
]

export function RecurringScreen() {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState(SUGGESTED[0])
  const start = (s = SUGGESTED[0]) => {
    setPreset(s)
    setOpen(true)
  }
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Recurring invoices"
        description="Retainers that bill themselves, on the day you choose."
        actions={
          <Button className="font-semibold" onClick={() => start()}>
            <Repeat /> New retainer
          </Button>
        }
      />
      <Panel>
        <EmptyState
          icon={CalendarSync}
          title="No retainers yet"
          body="Bill a client the same amount on a schedule. Orbit creates the invoice, sends it, reminds them and records the payment, every time."
          actions={
            <>
              <Button className="font-semibold" onClick={() => start()}>
                Set up a retainer
              </Button>
              <Button variant="outline" onClick={() => toast("Upload a CSV from your old tool.", { description: "We match clients, amounts and schedules." })}>
                <Upload /> Import from another tool
              </Button>
            </>
          }
        />
      </Panel>

      <Panel title="You already bill these clients every month" description="Turn them into retainers and stop writing the same invoice by hand." flush>
        <ul className="divide-y divide-border border-t border-border">
          {SUGGESTED.map((s) => {
            const c = clientById(s.id)
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <ClientMark name={c.name} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{c.name}</span>
                  <span className="block text-[12px] text-muted-foreground">{s.pattern}</span>
                </span>
                <span className="dc-num text-[14px] font-semibold">
                  {money(s.amount)}
                  <span className="font-sans text-[12px] font-normal text-muted-foreground"> /month</span>
                </span>
                <Button variant="outline" size="sm" onClick={() => start(s)}>
                  Set up
                </Button>
              </li>
            )
          })}
        </ul>
      </Panel>

      <section aria-labelledby="how-recurring" className="grid gap-3">
        <h2 id="how-recurring" className="text-[15px] font-semibold">
          How it works
        </h2>
        <ol className="grid gap-3 md:grid-cols-3">
          {[
            { t: "Pick a client and an amount", b: "Line items, tax and notes, like any invoice. Change them later and the next one follows." },
            { t: "Choose when it goes out", b: "Monthly on the 1st, every two weeks, or each quarter. Pause it any time." },
            { t: "Orbit does the rest", b: "Sends it, runs your reminder plan, and charges the card on file if the client allowed it." },
          ].map((s, i) => (
            <li key={s.t} className={cn(inner, "bg-[color:var(--card)] p-4")}>
              <span className="dc-num grid size-7 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] text-[13px] font-semibold text-[color:var(--dc-accent)]">{i + 1}</span>
              <p className="mt-3 text-[14px] font-semibold">{s.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <RetainerDialog key={preset.id + String(open)} open={open} onOpenChange={setOpen} preset={preset} />
    </div>
  )
}

function RetainerDialog({ open, onOpenChange, preset }: { open: boolean; onOpenChange: (o: boolean) => void; preset: (typeof SUGGESTED)[number] }) {
  const [clientId, setClientId] = useState(preset.id)
  const [amount, setAmount] = useState(preset.amount.toFixed(2))
  const [every, setEvery] = useState("Month")
  const [day, setDay] = useState("1st")
  const [first, setFirst] = useState("Dec 1, 2026")
  const [mode, setMode] = useState<"send" | "draft">("send")
  const valid = Number(amount) > 0
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogCard}>
        <DialogHeader>
          <DialogTitle className="dc-h text-[19px]">Set up a retainer</DialogTitle>
          <DialogDescription>Orbit creates this invoice on schedule until you stop it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField label="Client" htmlFor="rt-client">
            <SimpleSelect id="rt-client" value={clientId} onChange={setClientId} options={CLIENTS.slice(0, 14).map((c) => ({ value: c.id, label: c.name }))} className="w-full" />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Amount" htmlFor="rt-amount" error={valid ? null : "Enter an amount above zero."}>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="rt-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="dc-num pl-6" aria-invalid={!valid} />
              </div>
            </FormField>
            <FormField label="First invoice" htmlFor="rt-first">
              <Input id="rt-first" value={first} onChange={(e) => setFirst(e.target.value)} />
            </FormField>
            <FormField label="Every" htmlFor="rt-every">
              <SimpleSelect id="rt-every" value={every} onChange={setEvery} options={opts("Week", "Two weeks", "Month", "Quarter")} className="w-full" />
            </FormField>
            <FormField label="On the" htmlFor="rt-day">
              <SimpleSelect id="rt-day" value={day} onChange={setDay} options={opts("1st", "15th", "Last day")} className="w-full" />
            </FormField>
          </div>
          <fieldset className="grid gap-2">
            <legend className="mb-1.5 text-[13px] font-medium">Each time</legend>
            {(
              [
                ["send", "Send it automatically", "Best when the amount never changes."],
                ["draft", "Create a draft for me to check", "You get an email to review and send."],
              ] as const
            ).map(([v, t, b]) => (
              <label
                key={v}
                className="flex cursor-pointer items-start gap-3 rounded-[calc(var(--radius)+2px)] border border-border px-3 py-2.5 has-[:checked]:border-[color:var(--dc-accent)] has-[:checked]:bg-[color:color-mix(in_oklab,var(--dc-accent)_6%,transparent)]"
              >
                <input type="radio" name="retainer-mode" checked={mode === v} onChange={() => setMode(v)} className="mt-1 accent-[color:var(--dc-accent)]" />
                <span>
                  <span className="block text-[14px] font-medium">{t}</span>
                  <span className="block text-[12px] text-muted-foreground">{b}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
        <DialogFooter className={dialogFooter}>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            className="font-semibold"
            disabled={!valid}
            onClick={() => {
              onOpenChange(false)
              toast.success(`Retainer for ${clientById(clientId).name} set up`, {
                description: `${money(Number(amount))} every ${every.toLowerCase()} on the ${day}, starting ${first}.`,
              })
            }}
          >
            Start retainer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NotFoundScreen() {
  const { href } = useOrbit()
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()
  const invoices = query ? INVOICES.filter((i) => `${i.id} ${clientById(i.clientId).name}`.toLowerCase().includes(query)).slice(0, 4) : []
  const clients = query ? CLIENTS.filter((c) => `${c.name} ${c.contact}`.toLowerCase().includes(query)).slice(0, 3) : []
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 items-center justify-between px-5 sm:px-8">
        <Link href={href("overview")} className="flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">
          <LogoMark /> <span className="dc-h">Orbit</span>
        </Link>
        <Button variant="outline" nativeButton={false} render={<Link href={href("overview")} />}>
          <ArrowLeft /> Back to Orbit
        </Button>
      </header>
      <main className="mx-auto grid w-full max-w-[560px] flex-1 content-center px-5 py-14 text-center">
        <p className="dc-num text-[14px] font-semibold text-[color:var(--dc-accent)]">404</p>
        <h1 className="dc-h mt-3 text-[38px] leading-[1.1] sm:text-[46px]">We couldn’t find that page</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">The link may be old, or the invoice it pointed to was deleted. Search for it, or start from your overview.</p>
        <div className="relative mx-auto mt-7 w-full max-w-[420px] text-left">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search invoices and clients" placeholder="Invoice number or client name" className="h-10 bg-[color:var(--card)] pl-9 text-[15px]" />
        </div>
        {query ? (
          <div className="dc-card mx-auto mt-2 w-full max-w-[420px] p-1.5 text-left">
            {invoices.length + clients.length === 0 ? (
              <p className="px-3 py-3 text-[14px] text-muted-foreground">Nothing for “{q}”.</p>
            ) : (
              <ul>
                {invoices.map((i) => (
                  <li key={i.id}>
                    <Link href={href("invoice", { id: i.id })} className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-[14px] hover:bg-muted">
                      <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                      <span className="dc-num font-medium">{i.id}</span>
                      <span className="min-w-0 flex-1 truncate text-muted-foreground">{clientById(i.clientId).name}</span>
                      <StatusPill status={i.status} />
                    </Link>
                  </li>
                ))}
                {clients.map((c) => (
                  <li key={c.id}>
                    <Link href={href("client", { id: c.id })} className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-[14px] hover:bg-muted">
                      <ClientMark name={c.name} className="size-6 text-[9px]" />
                      <span className="font-medium">{c.name}</span>
                      <span className="truncate text-muted-foreground">{c.contact}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button className="h-10 px-4 font-semibold" nativeButton={false} render={<Link href={href("overview")} />}>
            Go to overview
          </Button>
          <Button variant="outline" className="h-10 px-4" nativeButton={false} render={<Link href={href("invoices")} />}>
            See all invoices
          </Button>
        </div>
        <ul className="mx-auto mt-12 grid w-full max-w-[460px] gap-2 text-left sm:grid-cols-2">
          {[
            { icon: FileText, label: "Invoices", body: "Every invoice, by status", to: href("invoices") },
            { icon: Users, label: "Clients", body: "Who you bill", to: href("clients") },
            { icon: Wallet, label: "Payments", body: "Money in and payouts", to: href("payments") },
            { icon: LifeBuoy, label: "Help center", body: "Guides and answers", to: href("overview") },
          ].map((l) => (
            <li key={l.label}>
              <Link href={l.to} className={cn(inner, "group flex items-center gap-3 bg-[color:var(--card)] p-3 transition-colors hover:bg-muted")}>
                <span className="dc-icon size-8">
                  <l.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">{l.label}</span>
                  <span className="block text-[12px] text-muted-foreground">{l.body}</span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
