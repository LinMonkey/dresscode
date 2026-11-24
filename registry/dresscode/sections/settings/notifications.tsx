"use client"

// Settings, notifications: what Orbit tells you about and where, as email and push switches per event,
// in four groups (each a fieldset with its legend). Pause everything for an hour, until the morning or a
// week; failed payments still reach you by email. Changes save as you go (the status line says so) and
// "Reset to defaults" puts the starting choices back. Wire `save` to your own endpoint.
import { BellOff, BellRing, Check, Mail, Minus, RotateCcw, Smartphone } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Channel = "email" | "push"
type Event = {
  id: string
  label: string
  body: string
  email: boolean
  /** null: this event has no push notification. */
  push: boolean | null
  /** Email can't be turned off for this one. */
  lockedEmail?: boolean
}

const GROUPS: { id: string; title: string; body: string; events: Event[] }[] = [
  {
    id: "invoices",
    title: "Invoices",
    body: "What happens to the invoices you send.",
    events: [
      { id: "viewed", label: "Invoice viewed", body: "The first time a client opens an invoice.", email: false, push: true },
      { id: "overdue", label: "Invoice overdue", body: "The morning after the due date passes.", email: true, push: true },
      { id: "reminder", label: "Reminder sent", body: "Each time Orbit sends a reminder for you.", email: false, push: false },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    body: "Money coming in and going out to your bank.",
    events: [
      { id: "received", label: "Payment received", body: "By card, bank transfer or a payment you record.", email: true, push: true },
      { id: "failed", label: "Payment failed", body: "A card is declined or a transfer bounces. Email is always on.", email: true, push: true, lockedEmail: true },
      { id: "payout", label: "Payout sent", body: "When money leaves for your bank account.", email: true, push: false },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    body: "Replies and changes from the people you bill.",
    events: [
      { id: "replied", label: "Client replied", body: "An answer to an invoice or a reminder.", email: true, push: true },
      { id: "details", label: "Billing details changed", body: "A client updates their billing email or address.", email: true, push: false },
      { id: "added", label: "Client added by a teammate", body: "Someone on your team adds a new client.", email: false, push: false },
    ],
  },
  {
    id: "news",
    title: "Product news",
    body: "From the Orbit team, by email only.",
    events: [
      { id: "features", label: "New features", body: "A short note when something ships, about once a month.", email: true, push: null },
      { id: "tips", label: "Tips for getting paid faster", body: "A few ideas a quarter, from studios like yours.", email: false, push: null },
    ],
  },
]

type Prefs = Record<string, { email: boolean; push: boolean | null }>
const DEFAULTS: Prefs = Object.fromEntries(GROUPS.flatMap((g) => g.events.map((e) => [e.id, { email: e.email, push: e.push }])))

const PAUSES = [
  { value: "hour", label: "For 1 hour", until: "until 10:41" },
  { value: "morning", label: "Until tomorrow", until: "until tomorrow at 9:00" },
  { value: "week", label: "For a week", until: "until Tuesday, Dec 1" },
]

const cols = "grid grid-cols-[minmax(0,1fr)_52px_52px] items-center gap-x-2 sm:grid-cols-[minmax(0,1fr)_72px_72px] sm:gap-x-3"

export default function SettingsNotifications() {
  const id = useId()
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  const [pauseFor, setPauseFor] = useState("morning")
  const [paused, setPaused] = useState<string | null>(null)
  const [status, setStatus] = useState("Changes save as you go.")

  // Send the change to your API here; the status line confirms it.
  const save = (next: Prefs, message: string) => {
    setPrefs(next)
    setStatus(message)
  }
  const toggle = (e: Event, channel: Channel, on: boolean) =>
    save({ ...prefs, [e.id]: { ...prefs[e.id], [channel]: on } }, `Saved: ${e.label.toLowerCase()} by ${channel} ${on ? "on" : "off"}.`)
  const isDefault = Object.keys(DEFAULTS).every((k) => prefs[k].email === DEFAULTS[k].email && prefs[k].push === DEFAULTS[k].push)
  const pause = PAUSES.find((p) => p.value === (paused ?? pauseFor))!

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`${id}-title`} className="dc-h text-[24px] leading-tight sm:text-[28px]">
            Notifications
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-foreground">Choose what Orbit tells you about, and where.</p>
        </div>
        <p role="status" className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          {status.startsWith("Changes") ? null : <Check className="size-3.5 text-[color:var(--dc-accent)]" aria-hidden="true" />}
          {status.startsWith("Saved") ? "All changes saved" : status}
          <span className="sr-only">{status.startsWith("Saved") ? status : ""}</span>
        </p>
      </div>

      <div
        className={cn(
          "dc-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6",
          paused && "bg-[color:color-mix(in_oklab,var(--dc-accent)_7%,var(--card))]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="dc-icon shrink-0" aria-hidden="true">
            {paused ? <BellOff className="size-[18px]" /> : <BellRing className="size-[18px]" />}
          </span>
          <div className="min-w-0">
            <p id={`${id}-pause`} className="text-[15px] font-semibold">
              {paused ? `Paused ${pause.until}` : "Pause all notifications"}
            </p>
            <p id={`${id}-pause-hint`} className="mt-0.5 text-[13px] text-pretty text-muted-foreground">
              {paused
                ? "Nothing is sent until then, except failed payments by email. Your choices below stay as they are."
                : "Take a break from every email and push. Failed payments still reach you by email."}
            </p>
          </div>
        </div>
        {paused ? (
          <Button
            variant="outline"
            className="shrink-0 self-start sm:self-auto"
            onClick={() => {
              setPaused(null)
              setStatus("Saved: notifications resumed.")
            }}
          >
            Resume now
          </Button>
        ) : (
          <div className="flex shrink-0 flex-wrap gap-2" role="group" aria-labelledby={`${id}-pause`} aria-describedby={`${id}-pause-hint`}>
            <Select items={PAUSES} value={pauseFor} onValueChange={(v) => v != null && setPauseFor(String(v))}>
              <SelectTrigger aria-label="How long to pause" className="w-[150px] bg-[color:var(--card)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAUSES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="font-semibold"
              onClick={() => {
                setPaused(pauseFor)
                setStatus(`Saved: notifications paused ${pause.until}.`)
              }}
            >
              <BellOff aria-hidden="true" /> Pause all
            </Button>
          </div>
        )}
      </div>

      <div className="dc-card mt-4 overflow-hidden">
        {GROUPS.map((g) => (
          <div key={g.id} className="relative border-t border-border px-5 pt-5 pb-2 first:border-t-0 sm:px-6">
            <fieldset aria-describedby={`${id}-${g.id}-body`} className="min-w-0">
              <legend className="pr-[120px] text-[15px] font-semibold sm:pr-[160px]">{g.title}</legend>
              <p id={`${id}-${g.id}-body`} className="mt-0.5 pr-[120px] text-[13px] text-muted-foreground sm:pr-[160px]">
                {g.body}
              </p>
              <ul className="mt-2 divide-y divide-border">
                {g.events.map((e) => {
                  const p = prefs[e.id]
                  const labelId = `${id}-${e.id}`
                  return (
                    <li key={e.id} className={cn(cols, "py-3", paused && "[&>div:first-child]:opacity-70")}>
                      <div className="min-w-0">
                        <p id={labelId} className="text-[14px] font-medium">
                          {e.label}
                        </p>
                        <p id={`${labelId}-body`} className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                          {e.body}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={p.email}
                          disabled={paused != null || e.lockedEmail}
                          onCheckedChange={(on) => toggle(e, "email", on)}
                          aria-label={`${e.label} by email`}
                          aria-describedby={`${labelId}-body`}
                        />
                      </div>
                      <div className="flex justify-center">
                        {p.push === null ? (
                          <span className="grid size-[18px] place-items-center text-muted-foreground/60">
                            <Minus className="size-4" aria-hidden="true" />
                            <span className="sr-only">{e.label}: no push notification</span>
                          </span>
                        ) : (
                          <Switch
                            checked={p.push}
                            disabled={paused != null}
                            onCheckedChange={(on) => toggle(e, "push", on)}
                            aria-label={`${e.label} by push`}
                            aria-describedby={`${labelId}-body`}
                          />
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
            <div aria-hidden="true" className={cn(cols, "absolute top-5 right-5 grid-cols-[52px_52px] text-[12px] font-medium text-muted-foreground sm:right-6 sm:grid-cols-[72px_72px]")}>
              <span className="flex items-center justify-center gap-1">
                <Mail className="hidden size-3.5 sm:block" /> Email
              </span>
              <span className="flex items-center justify-center gap-1">
                <Smartphone className="hidden size-3.5 sm:block" /> Push
              </span>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-3 border-t border-border bg-[color:color-mix(in_oklab,var(--foreground)_3%,transparent)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[13px] text-muted-foreground">
            Email goes to <span className="font-medium text-foreground">ada@ruizstudio.co</span>. Push goes to the Orbit app on your phone.
          </p>
          <Button
            variant="ghost"
            className="dc-flat -ml-2.5 shrink-0 self-start sm:-mr-2.5 sm:ml-0 sm:self-auto"
            disabled={isDefault}
            onClick={() => save(DEFAULTS, "Saved: back to the default choices.")}
          >
            <RotateCcw aria-hidden="true" /> Reset to defaults
          </Button>
        </div>
      </div>
    </section>
  )
}
