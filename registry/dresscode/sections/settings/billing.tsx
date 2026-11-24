"use client"

// Settings, plan and billing: the current plan with its renewal date and a dialog to change it (a plan
// that can't hold your team says so and can't be picked), what this month has used, the card on file,
// where bills go, and every bill with a link to its PDF. Card details never touch this page: "Update"
// should open your payment provider's own secure form. Wire the plan change to your billing API.
import { Check, CreditCard, Download, FileText, Hash, MapPin, ShieldCheck, TriangleAlert } from "lucide-react"
import { type FormEvent, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const MEMBERS = 4

const PLANS = [
  { id: "pro", name: "Pro", price: 12, seats: 1, note: "One person, unlimited invoices and reminders." },
  { id: "team", name: "Team", price: 39, seats: 5, note: "Up to 5 seats, roles and multi-currency." },
  { id: "studio", name: "Studio", price: 79, seats: 15, note: "Up to 15 seats, approvals and priority support." },
] as const
type PlanId = (typeof PLANS)[number]["id"]

const FEATURES: Record<PlanId, string[]> = {
  pro: ["1 seat", "Unlimited invoices", "Reminders and late fees", "Your logo and colors"],
  team: ["5 seats and roles", "Unlimited invoices", "Reminders and late fees", "Multi-currency"],
  studio: ["15 seats and roles", "Approvals before sending", "Multi-currency", "Priority support"],
}

const usage = (seats: number) => [
  { label: "Seats", used: MEMBERS, of: seats, figure: `${MEMBERS} of ${seats}`, note: seats - MEMBERS === 1 ? "1 seat left" : `${seats - MEMBERS} seats left` },
  { label: "Text reminders", used: 38, of: 100, figure: "38 of 100", note: "Resets on Dec 1" },
  { label: "File storage", used: 1.2, of: 10, figure: "1.2 of 10 GB", note: "Receipts and attachments" },
]

const BILLS = [
  // The upcoming bill follows the plan (see below).
  { number: "ORB-1240", date: "Dec 1, 2026", item: "Team plan, monthly", amount: "$39.00", status: "Upcoming" },
  { number: "ORB-1182", date: "Nov 1, 2026", item: "Team plan, monthly", amount: "$39.00", status: "Paid" },
  { number: "ORB-1094", date: "Oct 1, 2026", item: "Team plan, monthly", amount: "$39.00", status: "Paid" },
  { number: "ORB-1031", date: "Sep 14, 2026", item: "Upgrade to Team, rest of September", amount: "$17.40", status: "Paid" },
  { number: "ORB-0987", date: "Sep 1, 2026", item: "Pro plan, monthly", amount: "$12.00", status: "Paid" },
  { number: "ORB-0912", date: "Aug 1, 2026", item: "Pro plan, monthly", amount: "$12.00", status: "Paid" },
] as const

const money = (n: number) => `$${n.toFixed(2)}`

export default function SettingsBilling() {
  const id = useId()
  const [plan, setPlan] = useState<PlanId>("team")
  const [next, setNext] = useState<PlanId | null>(null)
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState<PlanId>("team")
  const [announce, setAnnounce] = useState("")

  const current = PLANS.find((p) => p.id === plan)!
  const scheduled = next ? PLANS.find((p) => p.id === next)! : null
  const picked = PLANS.find((p) => p.id === choice)!
  const tooSmall = picked.seats < MEMBERS
  // Upgrades start now (the rest of November is charged pro rata: 7 of 30 days); downgrades on Dec 1.
  const upgrade = picked.price > current.price
  const prorated = ((picked.price - current.price) * 7) / 30

  const confirm = (e: FormEvent) => {
    e.preventDefault()
    if (tooSmall || choice === plan) return
    // Send the change to your billing API here.
    if (upgrade) {
      setPlan(choice)
      setNext(null)
      setAnnounce(`You're on ${picked.name} now. ${money(prorated)} is charged today.`)
    } else {
      setNext(choice)
      setAnnounce(`${picked.name} starts on Dec 1. You keep ${current.name} until then.`)
    }
    setOpen(false)
  }

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-8">
      <h2 id={`${id}-title`} className="dc-h text-[24px] leading-tight sm:text-[28px]">
        Plan and billing
      </h2>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Your plan, what this month has used and every bill so far.</p>
      <p className="sr-only" role="status">
        {announce}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <article aria-labelledby={`${id}-plan`} className="dc-card flex flex-col p-5 sm:p-6">
          <p className="text-[13px] text-muted-foreground">Current plan</p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 id={`${id}-plan`} className="dc-h text-[26px] leading-tight">
              {current.name}
            </h3>
            <p>
              <span className="dc-num text-[26px] font-semibold tracking-tight">${current.price}</span>
              <span className="text-[14px] text-muted-foreground"> / month</span>
            </p>
          </div>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {scheduled ? (
              <>
                Changes to <span className="font-medium text-foreground">{scheduled.name}</span> on Dec 1, 2026, then ${scheduled.price} a month.
              </>
            ) : (
              <>
                Renews on <span className="font-medium text-foreground">Dec 1, 2026</span>. Member since March 2025.
              </>
            )}
          </p>
          <ul className="mt-5 grid gap-x-4 gap-y-2 text-[14px] sm:grid-cols-2">
            {FEATURES[plan].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-3 gap-3 rounded-[calc(var(--radius)+2px)] bg-[color:color-mix(in_oklab,var(--foreground)_4%,transparent)] px-4 py-3">
            <div className="min-w-0">
              <dt className="text-[12px] text-muted-foreground">Billed</dt>
              <dd className="mt-0.5 text-[14px] font-medium">Monthly</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[12px] text-muted-foreground">Next bill</dt>
              <dd className="dc-num mt-0.5 text-[14px] font-medium">{money(scheduled ? scheduled.price : current.price)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[12px] text-muted-foreground">Paid with</dt>
              <dd className="mt-0.5 truncate text-[14px] font-medium">
                Visa <span className="dc-num">4242</span>
              </dd>
            </div>
          </dl>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <Button
              className="font-semibold"
              onClick={() => {
                setChoice(next ?? plan)
                setOpen(true)
              }}
            >
              Change plan
            </Button>
            {scheduled ? (
              <Button
                variant="ghost"
                className="dc-flat text-muted-foreground"
                onClick={() => {
                  setNext(null)
                  setAnnounce(`Change cancelled. You stay on ${current.name}.`)
                }}
              >
                Keep {current.name}
              </Button>
            ) : (
              <Button variant="ghost" className="dc-flat text-muted-foreground" nativeButton={false} render={<a href="#cancel-plan" />}>
                Cancel plan
              </Button>
            )}
          </div>
        </article>

        <article aria-labelledby={`${id}-usage`} className="dc-card flex flex-col p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 id={`${id}-usage`} className="text-[15px] font-semibold">
              Usage this month
            </h3>
            <p className="text-[13px] text-muted-foreground">Nov 1 to 30</p>
          </div>
          <ul className="mt-4 grid flex-1 content-between gap-5">
            {usage(current.seats).map((u) => (
              <li key={u.label}>
                <Progress
                  value={(u.used / u.of) * 100}
                  aria-valuetext={`${u.figure} used`}
                  className="gap-x-3 gap-y-2 [&_[data-slot=progress-indicator]]:rounded-full [&_[data-slot=progress-indicator]]:bg-[color:var(--chart-1)] [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]"
                >
                  <ProgressLabel className="text-[14px] font-medium">{u.label}</ProgressLabel>
                  <span className="dc-num ml-auto text-[13px] font-medium">{u.figure}</span>
                </Progress>
                <p className="mt-1.5 text-[12px] text-muted-foreground">{u.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border pt-3 text-[13px] text-muted-foreground">
            <span className="dc-num font-medium text-foreground">23</span> invoices sent. Unlimited on every paid plan.
          </p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <article aria-labelledby={`${id}-card`} className="dc-card flex flex-col p-5 sm:p-6">
          <h3 id={`${id}-card`} className="text-[15px] font-semibold">
            Payment method
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-10 w-14 shrink-0 place-items-center rounded-[calc(var(--radius)-1px)] border border-border bg-[color:color-mix(in_oklab,var(--foreground)_4%,transparent)]" aria-hidden="true">
              <CreditCard className="size-5 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium">
                Visa ending <span className="dc-num">4242</span>
              </p>
              <p className="text-[13px] text-muted-foreground">
                Expires <span className="dc-num">08/2028</span>
              </p>
            </div>
            {/* Open your payment provider's hosted card form here. */}
            <Button variant="outline" nativeButton={false} render={<a href="#update-card" />}>
              Update
            </Button>
          </div>
          <p className="mt-auto flex items-start gap-1.5 pt-4 text-[12px] text-muted-foreground">
            <ShieldCheck className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            Card details are kept by our payment provider, never on Orbit.
          </p>
        </article>

        <article aria-labelledby={`${id}-details`} className="dc-card flex flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 id={`${id}-details`} className="text-[15px] font-semibold">
              Billing details
            </h3>
            <Button variant="ghost" size="sm" className="dc-flat -mr-2 text-[color:var(--dc-accent)]" nativeButton={false} render={<a href="#billing-details" />}>
              Edit
            </Button>
          </div>
          <dl className="mt-3 grid gap-2.5 text-[14px]">
            <div className="flex items-start gap-2.5">
              <dt className="mt-0.5">
                <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Bills go to</span>
              </dt>
              <dd className="min-w-0 break-words">ada@ruizstudio.co</dd>
            </div>
            <div className="flex items-start gap-2.5">
              <dt className="mt-0.5">
                <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Address</span>
              </dt>
              <dd className="min-w-0">Ruiz Studio, 418 SE Ash St, Portland, OR 97214</dd>
            </div>
            <div className="flex items-start gap-2.5">
              <dt className="mt-0.5">
                <Hash className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Tax ID</span>
              </dt>
              <dd className="min-w-0 text-muted-foreground">No tax ID on bills</dd>
            </div>
          </dl>
        </article>
      </div>

      <article aria-labelledby={`${id}-history`} className="dc-card mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3 sm:px-6">
          <div>
            <h3 id={`${id}-history`} className="text-[15px] font-semibold">
              Billing history
            </h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground">Every bill, as a PDF for your records.</p>
          </div>
          <Button variant="outline" size="sm" nativeButton={false} render={<a href="#bills-2026.zip" />}>
            <Download aria-hidden="true" /> Download all
          </Button>
        </div>
        <Table className="text-[14px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 pl-5 text-[12px] text-muted-foreground sm:pl-6">Date</TableHead>
              <TableHead className="hidden h-9 text-[12px] text-muted-foreground sm:table-cell">Description</TableHead>
              <TableHead className="h-9 text-right text-[12px] text-muted-foreground">Amount</TableHead>
              <TableHead className="hidden h-9 text-[12px] text-muted-foreground min-[420px]:table-cell">Status</TableHead>
              <TableHead className="h-9 pr-5 text-right text-[12px] text-muted-foreground sm:pr-6">
                <span className="sr-only">Download</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[{ ...BILLS[0], item: `${(scheduled ?? current).name} plan, monthly`, amount: money((scheduled ?? current).price) }, ...BILLS.slice(1)].map((b) => (
              <TableRow key={b.number} className="hover:bg-muted/40">
                <TableCell className="py-3 pl-5 whitespace-normal sm:pl-6">
                  <span className="block font-medium">{b.date}</span>
                  <span className="dc-num block text-[12px] text-muted-foreground">
                    {b.number}
                    <span className="sm:hidden"> · {b.item}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden py-3 whitespace-normal text-muted-foreground sm:table-cell">{b.item}</TableCell>
                <TableCell className="dc-num py-3 text-right font-medium">{b.amount}</TableCell>
                <TableCell className="hidden py-3 min-[420px]:table-cell">
                  <span className={cn("dc-pill", b.status === "Paid" ? "dc-pill-hl" : "dc-pill-line")}>{b.status}</span>
                </TableCell>
                <TableCell className="py-3 pr-5 text-right sm:pr-6">
                  {b.status === "Paid" ? (
                    // Point href at the bill's PDF (and add `download`).
                    <a
                      href={`#${b.number}.pdf`}
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius)] px-1.5 py-1 text-[13px] font-medium text-[color:var(--dc-accent)] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Download className="size-3.5" aria-hidden="true" /> PDF
                      <span className="sr-only">, bill {b.number} from {b.date}</span>
                    </a>
                  ) : (
                    <span className="px-1.5 text-[13px] text-muted-foreground">Not yet</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dc-card gap-5 p-5 ring-0 sm:max-w-[480px]">
          <form onSubmit={confirm} className="grid gap-5" noValidate>
            <DialogHeader>
              <DialogTitle className="dc-h text-[19px]">Change plan</DialogTitle>
              <DialogDescription>
                Your team has {MEMBERS} members. Upgrades start today; a smaller plan starts when this month ends.
              </DialogDescription>
            </DialogHeader>
            <fieldset className="min-w-0">
              <legend className="sr-only">Plan</legend>
              <RadioGroup value={choice} onValueChange={(v) => setChoice(v as PlanId)} className="gap-2">
                {PLANS.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-start gap-3 rounded-[calc(var(--radius)+2px)] border border-border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-[color:var(--dc-accent)] has-data-checked:bg-[color:color-mix(in_oklab,var(--dc-accent)_6%,transparent)]"
                  >
                    <RadioGroupItem value={p.id} className="mt-0.5" aria-describedby={`${id}-${p.id}-note`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[14px] font-medium">
                        {p.name}
                        {p.id === plan ? <span className="dc-pill dc-pill-muted">Current</span> : null}
                      </span>
                      <span id={`${id}-${p.id}-note`} className="block text-[13px] text-muted-foreground">
                        {p.note}
                      </span>
                    </span>
                    <span className="dc-num shrink-0 text-[14px] font-semibold">
                      ${p.price}
                      <span className="font-sans text-[12px] font-normal text-muted-foreground">/mo</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
            <div aria-live="polite" className="min-h-[44px]">
              {tooSmall ? (
                <p className="flex items-start gap-2 rounded-[calc(var(--radius)+2px)] bg-[color:color-mix(in_oklab,var(--dc-danger)_10%,var(--card))] px-3 py-2.5 text-[13px] leading-snug">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-danger)]" aria-hidden="true" />
                  {picked.name} has {picked.seats} seat. Remove {MEMBERS - picked.seats} members from your team first.
                </p>
              ) : choice === plan ? (
                <p className="px-0.5 py-2.5 text-[13px] text-muted-foreground">This is your plan now.</p>
              ) : upgrade ? (
                <p className="px-0.5 py-2.5 text-[13px] text-muted-foreground">
                  <span className="dc-num font-medium text-foreground">{money(prorated)}</span> today for the rest of November, then ${picked.price} a month from Dec 1.
                </p>
              ) : (
                <p className="px-0.5 py-2.5 text-[13px] text-muted-foreground">
                  {picked.name} starts on Dec 1 at ${picked.price} a month. You keep {current.name} until then.
                </p>
              )}
            </div>
            <DialogFooter className="-mx-5 -mb-5 rounded-b-[var(--dc-radius-card)] border-border px-5 py-4">
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit" className="font-semibold" disabled={tooSmall || choice === plan}>
                {choice === plan ? "Choose a plan" : upgrade ? `Upgrade to ${picked.name}` : `Switch to ${picked.name}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
