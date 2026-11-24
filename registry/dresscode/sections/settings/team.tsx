"use client"

// Settings, team: invite by email with a role, the members with their roles (the owner's is fixed),
// removal behind a confirm dialog, and pending invites to resend or revoke. Invites hold a seat, so the
// seat count includes them and the form says when every seat is taken. The address is checked on blur
// and on send (format, already a member, already invited). Wire the actions to your own API.
import { Check, CircleAlert, Mail, RefreshCw, Send, Trash2 } from "lucide-react"
import { type FormEvent, useId, useState } from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Role = "Admin" | "Accountant" | "Viewer"
type Member = { name: string; email: string; role: Role | "Owner"; active: string; you?: boolean }
type Invite = { email: string; role: Role; sent: string; resent?: boolean }

const SEATS = 6
const ROLES: { value: Role; label: string; note: string }[] = [
  { value: "Admin", label: "Admin", note: "Sends invoices, refunds payments and manages the team." },
  { value: "Accountant", label: "Accountant", note: "Sees every payment and exports for taxes. Can't send invoices." },
  { value: "Viewer", label: "Viewer", note: "Can look at invoices and reports. Can't change anything." },
]

const MEMBERS: Member[] = [
  { name: "Ada Ruiz", email: "ada@ruizstudio.co", role: "Owner", active: "Now", you: true },
  { name: "Marco Bell", email: "marco@ruizstudio.co", role: "Admin", active: "2 hours ago" },
  { name: "Priya Nair", email: "priya@nairbooks.com", role: "Accountant", active: "Yesterday" },
  { name: "Sam Okafor", email: "sam@ruizstudio.co", role: "Viewer", active: "Nov 12" },
]
const INVITES: Invite[] = [{ email: "jo@ruizstudio.co", role: "Admin", sent: "Nov 22" }]

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function SettingsTeam() {
  const id = useId()
  const [members, setMembers] = useState(MEMBERS)
  const [invites, setInvites] = useState(INVITES)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Viewer")
  const [error, setError] = useState("")
  const [sentTo, setSentTo] = useState("")
  // The member being removed stays set while the dialog closes, so its title doesn't flicker.
  const [removing, setRemoving] = useState<Member | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [announce, setAnnounce] = useState("")

  const used = members.length + invites.length
  const full = used >= SEATS

  const check = (v: string) => {
    const t = v.trim().toLowerCase()
    if (!t) return "Enter an email address."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "That doesn't look like an email address."
    const m = members.find((x) => x.email === t)
    if (m) return `${m.name} is already on the team.`
    if (invites.some((x) => x.email === t)) return `${t} already has an invite. You can resend it below.`
    return ""
  }

  const invite = (e: FormEvent) => {
    e.preventDefault()
    if (full) return
    const msg = check(email)
    setError(msg)
    if (msg) {
      document.getElementById(`${id}-email`)?.focus()
      return
    }
    // Send the invite from your API here.
    const t = email.trim().toLowerCase()
    setInvites((all) => [{ email: t, role, sent: "Just now" }, ...all])
    setEmail("")
    setSentTo(t)
    setAnnounce(`Invite sent to ${t} as ${role}.`)
  }

  const roleNote = ROLES.find((r) => r.value === role)!.note

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`${id}-title`} className="dc-h text-[24px] leading-tight sm:text-[28px]">
            Team
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-foreground">Who can see and send invoices for Ruiz Studio.</p>
        </div>
        <div className="w-full sm:w-[220px]">
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <p id={`${id}-seats`}>
              <span className="dc-num font-semibold">
                {used} of {SEATS}
              </span>{" "}
              <span className="text-muted-foreground">seats used</span>
            </p>
            <a href="#seats" className="rounded-[4px] font-medium text-[color:var(--dc-accent)] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
              Add seats
            </a>
          </div>
          <Progress
            value={(used / SEATS) * 100}
            aria-labelledby={`${id}-seats`}
            aria-valuetext={`${used} of ${SEATS} seats used, invites included`}
            className="mt-2 [&_[data-slot=progress-indicator]]:rounded-full [&_[data-slot=progress-indicator]]:bg-[color:var(--chart-1)] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]"
          />
        </div>
      </div>

      <p className="sr-only" role="status">
        {announce}
      </p>

      <form noValidate onSubmit={invite} aria-labelledby={`${id}-invite`} className="dc-card mt-6 p-5 sm:p-6">
        <h3 id={`${id}-invite`} className="text-[15px] font-semibold">
          Invite someone
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px_auto] sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-email`} className="text-[13px]">
              Email address
            </Label>
            <Input
              id={`${id}-email`}
              type="email"
              autoComplete="off"
              placeholder="name@studio.com"
              value={email}
              disabled={full}
              onChange={(e) => {
                setEmail(e.target.value)
                setSentTo("")
                if (error && !check(e.target.value)) setError("")
              }}
              onBlur={() => email && setError(check(email))}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-email-error` : full ? `${id}-full` : undefined}
              className="h-9"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-role`} className="text-[13px]">
              Role
            </Label>
            <Select items={ROLES} value={role} onValueChange={(v) => v != null && setRole(v as Role)} disabled={full}>
              <SelectTrigger id={`${id}-role`} aria-describedby={`${id}-role-note`} className="w-full bg-[color:var(--card)] data-[size=default]:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="h-9 px-4 font-semibold" disabled={full}>
            <Send aria-hidden="true" /> Send invite
          </Button>
        </div>
        <div className="mt-2.5 min-h-5 text-[13px]">
          {error ? (
            <p id={`${id}-email-error`} className="flex items-start gap-1.5 text-destructive">
              <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : sentTo ? (
            <p className="flex items-start gap-1.5">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
              <span>
                Invite sent to <span className="font-medium break-all">{sentTo}</span>. The link works for 7 days.
                {full ? <span className="text-muted-foreground"> That was your last free seat.</span> : null}
              </span>
            </p>
          ) : full ? (
            <p id={`${id}-full`} className="text-muted-foreground">
              All {SEATS} seats are in use. Revoke an invite or{" "}
              <a href="#seats" className="rounded-[4px] font-medium text-[color:var(--dc-accent)] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                add a seat
              </a>{" "}
              to invite someone new.
            </p>
          ) : (
            <p id={`${id}-role-note`} className="text-muted-foreground">
              {role}: {roleNote}
            </p>
          )}
        </div>
      </form>

      <article aria-labelledby={`${id}-members`} className="dc-card mt-4 overflow-hidden">
        <div className="flex items-baseline justify-between gap-3 px-5 pt-5 pb-2 sm:px-6">
          <h3 id={`${id}-members`} className="text-[15px] font-semibold">
            Members
          </h3>
          <p className="text-[13px] text-muted-foreground">{members.length} people</p>
        </div>
        <ul className="divide-y divide-border">
          {members.map((m) => (
            <li
              key={m.email}
              className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-5 py-3.5 sm:grid-cols-[36px_minmax(0,1fr)_100px_150px_32px] sm:px-6"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 place-items-center rounded-full text-[12px] font-bold",
                  m.you ? "bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]" : "bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] text-foreground",
                )}
              >
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[14px] font-medium">
                  <span className="truncate">{m.name}</span>
                  {m.you ? <span className="dc-pill dc-pill-muted shrink-0">You</span> : null}
                </p>
                <p className="truncate text-[13px] text-muted-foreground">{m.email}</p>
              </div>
              <p className="hidden text-[13px] text-muted-foreground sm:block">
                <span className="sr-only">Last active: </span>
                {m.active}
              </p>
              <div className="col-start-2 sm:col-start-auto">
                {m.role === "Owner" ? (
                  <span className="dc-pill dc-pill-hl">Owner</span>
                ) : (
                  <Select
                    items={ROLES}
                    value={m.role}
                    onValueChange={(v) => {
                      if (v == null) return
                      setMembers((all) => all.map((x) => (x.email === m.email ? { ...x, role: v as Role } : x)))
                      setAnnounce(`${m.name} is now ${v === "Admin" || v === "Accountant" ? "an" : "a"} ${v}.`)
                    }}
                  >
                    <SelectTrigger size="sm" aria-label={`Role for ${m.name}`} className="w-full min-w-[130px] bg-[color:var(--card)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="col-start-3 row-start-1 flex justify-end sm:col-start-auto sm:row-start-auto">
                {m.role !== "Owner" ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="dc-flat text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => {
                      setRemoving(m)
                      setConfirming(true)
                    }}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article aria-labelledby={`${id}-pending`} className="dc-card mt-4 overflow-hidden">
        <div className="flex flex-col gap-0.5 px-5 pt-5 pb-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3 sm:px-6">
          <h3 id={`${id}-pending`} className="text-[15px] font-semibold">
            Pending invites
          </h3>
          <p className="text-[13px] text-muted-foreground">Each holds a seat until it is accepted</p>
        </div>
        {invites.length ? (
          <ul className="divide-y divide-border">
            {invites.map((inv) => (
              <li key={inv.email} className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 px-5 py-3.5 sm:grid-cols-[36px_minmax(0,1fr)_auto] sm:px-6">
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border border-dashed border-input text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{inv.email}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {inv.role} · {inv.resent ? "sent again just now" : `invited ${inv.sent === "Just now" ? "just now" : inv.sent}`}
                  </p>
                </div>
                <div className="col-start-2 -ml-2.5 flex gap-1 sm:col-start-auto sm:ml-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="dc-flat"
                    disabled={inv.resent}
                    onClick={() => {
                      setInvites((all) => all.map((x) => (x.email === inv.email ? { ...x, resent: true } : x)))
                      setAnnounce(`Invite sent again to ${inv.email}.`)
                    }}
                  >
                    {inv.resent ? <Check aria-hidden="true" /> : <RefreshCw aria-hidden="true" />}
                    {inv.resent ? "Sent" : "Resend"}
                    <span className="sr-only"> invite to {inv.email}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="dc-flat text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setInvites((all) => all.filter((x) => x.email !== inv.email))
                      setSentTo("")
                      setAnnounce(`Invite to ${inv.email} revoked. ${used - 1} of ${SEATS} seats used.`)
                    }}
                  >
                    Revoke<span className="sr-only"> invite to {inv.email}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 pt-1 pb-5 text-[14px] text-muted-foreground sm:px-6">No pending invites. New ones show here until they are accepted.</p>
        )}
      </article>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">Remove {removing?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They lose access to Ruiz Studio right away. Invoices they sent stay, with their name in the history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rounded-b-[var(--dc-radius-card)] border-border">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!removing) return
                setMembers((all) => all.filter((x) => x.email !== removing.email))
                setSentTo("")
                setAnnounce(`${removing.name} removed. ${used - 1} of ${SEATS} seats used.`)
                setConfirming(false)
              }}
            >
              <Trash2 aria-hidden="true" /> Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
