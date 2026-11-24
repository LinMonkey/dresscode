"use client"

// Settings: profile and security, business details and how invoices look, the reminder plan, team
// and roles, and plan and billing. Each section has its own URL (?tab=) so other screens can link in.
import { Building2, Check, CreditCard, Laptop, Minus, ShieldCheck, Smartphone, Trash2, Upload, UserRound, Users, BellRing, Receipt, MoreHorizontal, Mail, RefreshCw } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Suspense, useState, type ReactNode } from "react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { useOrbit, useParam } from "./context"
import { FormField, Head, SimpleSelect, opts } from "./controls"
import { ME, PENDING_INVITES, TEAM, clientById, type Role } from "./data"
import { InvoiceDocument, STUDIO } from "./invoice-doc"
import { EmptyState, PageHeader, Panel, Pill, flat } from "./ui"

const TABS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "business", label: "Business and branding", icon: Building2 },
  { id: "reminders", label: "Reminders", icon: BellRing },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Plan and billing", icon: CreditCard },
] as const
type TabId = (typeof TABS)[number]["id"]

export function SettingsScreen() {
  return (
    <Suspense fallback={<Settings tab="profile" />}>
      <SettingsFromQuery />
    </Suspense>
  )
}

function SettingsFromQuery() {
  const t = useParam("tab")
  return <Settings tab={TABS.some((x) => x.id === t) ? (t as TabId) : "profile"} />
}

function Settings({ tab }: { tab: TabId }) {
  const router = useRouter()
  const pathname = usePathname()
  // Keep the rest of the query (the mode, say) when moving between sections.
  const go = (id: TabId) => {
    const q = new URLSearchParams(window.location.search)
    q.set("tab", id)
    router.replace(`${pathname}?${q}`, { scroll: false })
  }
  return (
    <div className="grid gap-6">
      <PageHeader title="Settings" description="Your profile, how invoices look and remind, who can see what, and your plan." />
      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings" className="-mx-4 overflow-x-auto px-4 lg:sticky lg:top-20 lg:mx-0 lg:px-0">
          <ul className="flex gap-1 lg:flex-col">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className="flex h-9 w-full items-center gap-2.5 rounded-[var(--radius)] px-3 text-[14px] whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] aria-[current=page]:font-semibold aria-[current=page]:text-[color:var(--dc-accent)]"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0">
          {tab === "profile" ? <ProfileTab /> : null}
          {tab === "business" ? <BusinessTab /> : null}
          {tab === "reminders" ? <RemindersTab /> : null}
          {tab === "team" ? <TeamTab /> : null}
          {tab === "billing" ? <BillingTab /> : null}
        </div>
      </div>
    </div>
  )
}

function SaveBar({ label = "Save changes", note, onSave }: { label?: string; note?: string; onSave: () => void }) {
  return (
    <div className="-mx-5 mt-5 -mb-5 flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-5 py-3">
      {note ? <p className="mr-auto text-[13px] text-muted-foreground">{note}</p> : null}
      <Button className="font-semibold" onClick={onSave}>
        {label}
      </Button>
    </div>
  )
}

function SwitchRow({
  title,
  body,
  checked,
  onChange,
  disabled,
  children,
}: {
  title: ReactNode
  body?: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  children?: ReactNode
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3.5", disabled && "opacity-55")}>
      <div className="min-w-0">
        <p className="text-[14px] font-medium">{title}</p>
        {body ? <p className="mt-0.5 text-[13px] text-muted-foreground">{body}</p> : null}
        {children}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={typeof title === "string" ? title : undefined} className="mt-0.5" />
    </div>
  )
}

/* Profile ---------------------------------------------------------------------------------------- */

function ProfileTab() {
  const [name, setName] = useState(ME.name)
  const [title, setTitle] = useState("Founder and designer")
  const [tz, setTz] = useState("Pacific Time (Los Angeles)")
  const [fmt, setFmt] = useState("Nov 24, 2026")
  const [twoStep, setTwoStep] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [sessions, setSessions] = useState([
    { icon: Laptop, device: "MacBook Pro · Safari", where: "Portland, OR", when: "This device" },
    { icon: Smartphone, device: "iPhone · Orbit app", where: "Portland, OR", when: "2 hours ago" },
    { icon: Laptop, device: "Windows · Chrome", where: "Seattle, WA", when: "Nov 19" },
  ])
  return (
    <div className="grid gap-5">
      <Panel title="Your profile" description="How you show up to clients and your team.">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[20px] font-bold text-[color:var(--dc-highlight-fg)]">{ME.initials}</span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast("Choose a square photo, at least 256 px.")}>
              <Upload /> Upload photo
            </Button>
            <Button variant="ghost" size="sm" className={cn(flat, "text-muted-foreground")}>
              Remove
            </Button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="sp-name">
            <Input id="sp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="Job title" htmlFor="sp-title">
            <Input id="sp-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField label="Email" htmlFor="sp-email" hint="Verified. Changing it sends a new confirmation link.">
            <Input id="sp-email" value={ME.email} readOnly className="bg-muted/60" />
          </FormField>
          <FormField label="Time zone" htmlFor="sp-tz" hint="Reminders go out at 9:00 in this zone.">
            <SimpleSelect id="sp-tz" value={tz} onChange={setTz} options={opts("Pacific Time (Los Angeles)", "Mountain Time (Denver)", "Central Time (Chicago)", "Eastern Time (New York)", "London", "Berlin")} className="w-full" />
          </FormField>
          <FormField label="Date format" htmlFor="sp-fmt">
            <SimpleSelect id="sp-fmt" value={fmt} onChange={setFmt} options={opts("Nov 24, 2026", "24 Nov 2026", "11/24/2026", "24/11/2026", "2026-11-24")} className="w-full" />
          </FormField>
        </div>
        <SaveBar onSave={() => toast.success("Profile saved")} />
      </Panel>

      <Panel title="Sign-in and security">
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-4 pb-3.5">
            <div>
              <p className="text-[14px] font-medium">Password</p>
              <p className="text-[13px] text-muted-foreground">Last changed in August</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast("We sent a reset link to " + ME.email)}>
              Change
            </Button>
          </div>
          <SwitchRow
            title="Two-step verification"
            body={twoStep ? "On, with an authenticator app. You'll need a code on new devices." : "Off. Anyone with your password can sign in."}
            checked={twoStep}
            onChange={(v) => {
              setTwoStep(v)
              toast(v ? "Two-step verification on" : "Two-step verification off")
            }}
          />
          <div className="pt-3.5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] font-medium">Where you’re signed in</p>
              <Button
                variant="ghost"
                size="sm"
                className={cn(flat, "text-[color:var(--dc-accent)]")}
                disabled={sessions.length === 1}
                onClick={() => {
                  setSessions((s) => s.slice(0, 1))
                  toast.success("Signed out of other devices")
                }}
              >
                Sign out others
              </Button>
            </div>
            <ul className="mt-2 grid gap-2">
              {sessions.map((s) => (
                <li key={s.device} className="flex items-center gap-3 text-[14px]">
                  <s.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    {s.device} <span className="text-muted-foreground">· {s.where}</span>
                  </span>
                  <span className={cn("text-[13px]", s.when === "This device" ? "font-medium text-[color:var(--dc-accent)]" : "text-muted-foreground")}>{s.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel title="Delete account" className="border-[color:color-mix(in_oklab,var(--dc-danger)_30%,var(--border))] in-[.dc-brutal]:border-[color:var(--dc-ink)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-muted-foreground">Deletes Ruiz Studio, its 42 invoices and 64 clients. Export first if you need records for taxes.</p>
          <Button variant="destructive" onClick={() => setDeleting(true)}>
            <Trash2 /> Delete account
          </Button>
        </div>
      </Panel>
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">Delete your Orbit account?</AlertDialogTitle>
            <AlertDialogDescription>Everything goes after 30 days: invoices, clients, payment history. Open payment links stop working today.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleting(false)
                toast("We emailed you a link to confirm.")
              }}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* Business and branding -------------------------------------------------------------------------- */

const ACCENTS = [
  { name: "Theme accent", value: "var(--dc-accent)" },
  { name: "Ink", value: "var(--dc-ink)" },
  { name: "Forest", value: "#2F6B3F" },
  { name: "Ocean", value: "#1D5FA8" },
  { name: "Clay", value: "#B5532C" },
  { name: "Plum", value: "#7A3D7A" },
]
const LAYOUTS = ["Classic", "Modern", "Compact"] as const

function BusinessTab() {
  const [name, setName] = useState(STUDIO.name)
  const [address, setAddress] = useState(STUDIO.address.join("\n"))
  const [taxId, setTaxId] = useState(STUDIO.taxId)
  const [accent, setAccent] = useState(ACCENTS[0].value)
  const [layout, setLayout] = useState<(typeof LAYOUTS)[number]>("Modern")
  const [prefix, setPrefix] = useState("INV-")
  const [next, setNext] = useState("1043")
  const [footer, setFooter] = useState("Thank you for your business.")
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-5">
        <Panel title="Business details" description="Printed on every invoice and receipt.">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Business name" htmlFor="sb-name">
              <Input id="sb-name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="Tax ID" htmlFor="sb-tax">
              <Input id="sb-tax" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            </FormField>
            <FormField label="Address" htmlFor="sb-address" className="sm:col-span-2">
              <Textarea id="sb-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
            </FormField>
          </div>
        </Panel>
        <Panel title="How invoices look" description="Your logo, one color and a layout. The preview updates as you choose.">
          <div className="grid gap-5">
            <div>
              <p className="mb-1.5 text-[13px] font-medium">Logo</p>
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[calc(var(--radius)+2px)] border border-dashed border-input px-4 py-6 text-center transition-colors hover:bg-muted/50">
                <Upload className="size-5 text-muted-foreground" aria-hidden="true" />
                <span className="text-[14px] font-medium">Drop a PNG or SVG, or browse</span>
                <span className="text-[12px] text-muted-foreground">At least 400 px wide, on a transparent background</span>
                <input type="file" accept="image/png,image/svg+xml" className="sr-only" onChange={() => toast.success("Logo uploaded")} />
              </label>
            </div>
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium">Color</legend>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <label key={a.name} className="cursor-pointer">
                    <input type="radio" name="accent" className="peer sr-only" checked={accent === a.value} onChange={() => setAccent(a.value)} />
                    <span className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 text-[13px] transition-colors peer-checked:border-[color:var(--dc-ink)] peer-checked:font-semibold peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40">
                      <span className="size-5 rounded-full ring-1 ring-black/10" style={{ background: a.value }} />
                      {a.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium">Layout</legend>
              <div className="grid grid-cols-3 gap-3">
                {LAYOUTS.map((l) => (
                  <label key={l} className="cursor-pointer">
                    <input type="radio" name="layout" className="peer sr-only" checked={layout === l} onChange={() => setLayout(l)} />
                    <span className="block rounded-[calc(var(--radius)+2px)] border border-border p-2.5 transition-colors peer-checked:border-[color:var(--dc-accent)] peer-checked:ring-1 peer-checked:ring-[color:var(--dc-accent)] peer-focus-visible:ring-3">
                      <LayoutSketch layout={l} accent={accent} />
                      <span className="mt-2 block text-center text-[13px] font-medium">{l}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Number prefix" htmlFor="sb-prefix">
                <Input id="sb-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
              </FormField>
              <FormField label="Next number" htmlFor="sb-next" hint={`Next invoice: ${prefix}${next}`}>
                <Input id="sb-next" value={next} onChange={(e) => setNext(e.target.value)} className="dc-num" />
              </FormField>
              <FormField label="Footer line" htmlFor="sb-footer">
                <Input id="sb-footer" value={footer} onChange={(e) => setFooter(e.target.value)} />
              </FormField>
            </div>
          </div>
          <SaveBar note="Applies to new invoices. Sent ones keep their look." onSave={() => toast.success("Invoice look saved")} />
        </Panel>
      </div>
      <div className="grid gap-2 xl:sticky xl:top-20">
        <p className="text-[13px] text-muted-foreground">Preview</p>
        <div
          className="dc-card overflow-hidden p-0"
          style={
            accent === ACCENTS[0].value
              ? undefined
              : { ["--dc-accent" as string]: accent, ["--primary" as string]: accent, ["--primary-foreground" as string]: accent === "var(--dc-ink)" ? "var(--dc-page)" : "#fff" }
          }
        >
          <div style={{ zoom: 0.62 }}>
            <InvoiceDocument
              number={`${prefix}${next}`}
              client={clientById("fernwood-studio")}
              issued="Nov 24, 2026"
              due="Dec 8, 2026"
              items={[
                { description: "Brand retainer, December", qty: 1, rate: 1800 },
                { description: "Extra design hours", qty: 6, rate: 85 },
              ]}
              discount={{ type: "%", value: 0 }}
              taxRate={layout === "Compact" ? 0 : 5}
              notes={layout === "Classic" ? footer : undefined}
              terms={layout !== "Compact" ? "Payment is due within 14 days." : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LayoutSketch({ layout, accent }: { layout: (typeof LAYOUTS)[number]; accent: string }) {
  const bar = <span className="block h-1 rounded-full bg-muted-foreground/25" />
  return (
    <span aria-hidden="true" className="grid h-20 content-start gap-1.5 overflow-hidden rounded-[calc(var(--radius)-2px)] bg-[color:var(--card)] p-2 ring-1 ring-border">
      {layout === "Modern" ? <span className="-mx-2 -mt-2 mb-0.5 block h-1.5" style={{ background: accent }} /> : null}
      <span className={cn("flex items-center gap-1", layout === "Classic" && "justify-center")}>
        <span className="size-2.5 rounded-[2px]" style={{ background: accent }} />
        <span className="block h-1.5 w-8 rounded-full bg-muted-foreground/40" />
      </span>
      {layout === "Classic" ? <span className="block h-px bg-border" /> : null}
      {bar}
      <span className="block h-1 w-3/4 rounded-full bg-muted-foreground/25" />
      {layout !== "Compact" ? bar : null}
      <span className="mt-auto ml-auto block h-1.5 w-10 rounded-full" style={{ background: accent }} />
    </span>
  )
}

/* Reminders -------------------------------------------------------------------------------------- */

const STEPS = [
  { id: "before", title: "3 days before the due date", when: -3 },
  { id: "due", title: "On the due date", when: 0 },
  { id: "after3", title: "3 days late", when: 3 },
  { id: "after7", title: "7 days late", when: 7 },
  { id: "after14", title: "14 days late: final notice", when: 14 },
] as const
type StepId = (typeof STEPS)[number]["id"]
const TONES = ["Friendly", "Neutral", "Firm"] as const
type Tone = (typeof TONES)[number]

function reminderCopy(step: StepId, tone: Tone) {
  const open = { Friendly: "Hi Mara, hope the week is going well!", Neutral: "Hi Mara,", Firm: "Hello Mara," }[tone]
  const body: Record<StepId, string> = {
    before: "A quick heads-up that invoice INV-1042 for $4,200.00 is due on Friday, Nov 28.",
    due: "Invoice INV-1042 for $4,200.00 is due today.",
    after3: "Invoice INV-1042 for $4,200.00 was due on Nov 28 and is now 3 days late.",
    after7: "Invoice INV-1042 for $4,200.00 is now a week past its due date.",
    after14: "Invoice INV-1042 for $4,200.00 is 14 days late. This is the last automatic reminder before a 1.5% late fee is added.",
  }
  const close = {
    Friendly: "You can pay in a minute from the link below. Thanks so much!",
    Neutral: "You can pay from the link below.",
    Firm: "Please pay from the link below, or reply if something is holding it up.",
  }[tone]
  return `${open}\n\n${body[step]} ${close}\n\nAda, Ruiz Studio`
}

function RemindersTab() {
  const [on, setOn] = useState(true)
  const [steps, setSteps] = useState<Record<StepId, boolean>>({ before: true, due: true, after3: true, after7: true, after14: false })
  const [preview, setPreview] = useState<StepId>("before")
  const [tone, setTone] = useState<Tone>("Friendly")
  const [lateFee, setLateFee] = useState(false)
  const [fee, setFee] = useState("1.5")
  const [thanks, setThanks] = useState(true)
  const [copyMe, setCopyMe] = useState(false)
  const active = STEPS.filter((s) => steps[s.id]).length
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel
        title="Automatic reminders"
        description={on ? `${active} reminders per invoice, sent at 9:00 your time. Stops the moment a client pays.` : "Off. Clients only hear from you when you write."}
        action={<Switch checked={on} onCheckedChange={setOn} aria-label="Automatic reminders" />}
      >
        <ol className="divide-y divide-border rounded-[calc(var(--radius)+2px)] border border-border">
          {STEPS.map((s, i) => (
            <li key={s.id} className={cn("flex items-center gap-3 px-3 py-3 transition-colors", preview === s.id && "bg-muted/60", !on && "opacity-55")}>
              <span className="dc-num grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[12px] font-semibold">{i + 1}</span>
              <button type="button" onClick={() => setPreview(s.id)} className="min-w-0 flex-1 text-left" disabled={!on}>
                <span className="block text-[14px] font-medium">{s.title}</span>
                <span className="block text-[12px] text-muted-foreground">
                  Email · {s.when < 0 ? "a nudge" : s.when === 0 ? "due today" : s.id === "after14" ? "mentions the late fee" : "with the PDF again"}
                </span>
              </button>
              <Button variant="ghost" size="sm" className={cn(flat, "hidden text-[13px] sm:inline-flex")} onClick={() => setPreview(s.id)} disabled={!on}>
                Preview
              </Button>
              <Switch
                checked={on && steps[s.id]}
                disabled={!on}
                onCheckedChange={(v) => setSteps((all) => ({ ...all, [s.id]: v }))}
                aria-label={`Reminder ${s.title}`}
              />
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Tone" htmlFor="sr-tone" hint="Changes the wording of every reminder.">
            <SimpleSelect id="sr-tone" value={tone} onChange={(v) => setTone(v as Tone)} options={opts(...TONES)} className="w-full" />
          </FormField>
        </div>
        <div className="mt-2 divide-y divide-border">
          <SwitchRow title="Late fee" body="Added to the invoice after the final notice, and mentioned in it." checked={lateFee} onChange={setLateFee} disabled={!on}>
            {lateFee && on ? (
              <div className="mt-2 flex items-center gap-2 text-[13px]">
                <Input aria-label="Late fee percent" value={fee} onChange={(e) => setFee(e.target.value)} className="dc-num h-8 w-16 text-right" />
                <span className="text-muted-foreground">% a month, from 30 days late</span>
              </div>
            ) : null}
          </SwitchRow>
          <SwitchRow title="Thank-you note" body="A short thanks with the receipt when an invoice is paid." checked={thanks} onChange={setThanks} />
          <SwitchRow title="Copy me on reminders" body={`Sends a copy to ${ME.email}.`} checked={copyMe} onChange={setCopyMe} disabled={!on} />
        </div>
        <SaveBar label="Save reminder plan" onSave={() => toast.success("Reminder plan saved", { description: on ? `${active} reminders, ${tone.toLowerCase()} tone.` : "Reminders are off." })} />
      </Panel>
      <div className="grid gap-2 xl:sticky xl:top-20">
        <p className="text-[13px] text-muted-foreground">Preview: {STEPS.find((s) => s.id === preview)?.title.toLowerCase()}</p>
        <div className="dc-card overflow-hidden p-0 text-[14px]">
          <dl className="grid gap-1 border-b border-border px-5 py-3 text-[13px]">
            <div className="flex gap-2">
              <dt className="w-14 text-muted-foreground">To</dt>
              <dd>Mara Lind</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 text-muted-foreground">Subject</dt>
              <dd className="font-semibold">{preview === "after14" ? "Final reminder: INV-1042" : preview === "before" ? "INV-1042 is due Friday" : "Reminder: INV-1042"}</dd>
            </div>
          </dl>
          <p className="px-5 py-5 leading-relaxed whitespace-pre-line">{reminderCopy(preview, tone)}</p>
          <div className="px-5 pb-5">
            <span aria-hidden="true" className="inline-flex h-9 items-center rounded-[var(--radius)] bg-primary px-4 text-[13px] font-semibold text-primary-foreground">
              Pay $4,200.00
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Team ------------------------------------------------------------------------------------------- */

const PERMS: { label: string; roles: Role[] }[] = [
  { label: "Create and send invoices", roles: ["Owner", "Admin"] },
  { label: "See payments and reports", roles: ["Owner", "Admin", "Accountant", "Viewer"] },
  { label: "Export for taxes", roles: ["Owner", "Admin", "Accountant"] },
  { label: "Refund payments", roles: ["Owner", "Admin"] },
  { label: "Manage team", roles: ["Owner", "Admin"] },
  { label: "Plan and billing", roles: ["Owner"] },
]
const ROLES: Role[] = ["Owner", "Admin", "Accountant", "Viewer"]

function TeamTab() {
  const { openDialog } = useOrbit()
  const [members, setMembers] = useState(TEAM)
  const [invites, setInvites] = useState(PENDING_INVITES)
  const [removing, setRemoving] = useState<string | null>(null)
  return (
    <div className="grid gap-5">
      <Panel
        title="Members"
        description={`${members.length + invites.length} of 5 seats used on Pro`}
        action={
          <Button size="sm" className="font-semibold" onClick={() => openDialog("invite")}>
            <Mail /> Invite
          </Button>
        }
        flush
      >
        <div className="px-5 pb-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[color:var(--chart-1)]" style={{ width: `${((members.length + invites.length) / 5) * 100}%` }} />
          </div>
        </div>
        <Table className="text-[14px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <Head className="pl-5">Member</Head>
              <Head>Role</Head>
              <Head className="hidden md:table-cell">Last active</Head>
              <Head className="w-12 pr-4">
                <span className="sr-only">Actions</span>
              </Head>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.email}>
                <TableCell className="pl-5">
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold">{m.initials}</span>
                    <span className="min-w-0">
                      <span className="block font-medium">
                        {m.name} {m.email === ME.email ? <span className="text-[12px] font-normal text-muted-foreground">(you)</span> : null}
                      </span>
                      <span className="block max-w-[200px] truncate text-[12px] text-muted-foreground">{m.email}</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  {m.role === "Owner" ? (
                    <Pill tone="hl">Owner</Pill>
                  ) : (
                    <SimpleSelect
                      size="sm"
                      label={`Role for ${m.name}`}
                      value={m.role}
                      onChange={(v) => {
                        setMembers((all) => all.map((x) => (x.email === m.email ? { ...x, role: v as Role } : x)))
                        toast.success(`${m.name} is now ${v}`)
                      }}
                      options={opts("Admin", "Accountant", "Viewer")}
                      className="w-[124px]"
                    />
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{m.lastSeen}</TableCell>
                <TableCell className="pr-4 text-right">
                  {m.role !== "Owner" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className={cn(flat, "text-muted-foreground")} aria-label={`Actions for ${m.name}`} />}>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem variant="destructive" onClick={() => setRemoving(m.email)}>
                          <Trash2 /> Remove from team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
            {invites.map((inv) => (
              <TableRow key={inv.email}>
                <TableCell className="pl-5">
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-input text-muted-foreground">
                      <Mail className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{inv.email}</span>
                      <span className="block text-[12px] text-muted-foreground">Invited {inv.sent}, not accepted yet</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <Pill tone="line">{inv.role}</Pill>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button variant="ghost" size="sm" className={cn(flat, "-ml-2 text-[13px]")} onClick={() => toast.success(`Invite sent again to ${inv.email}`)}>
                    <RefreshCw /> Resend
                  </Button>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(flat, "text-[13px] text-muted-foreground")}
                    onClick={() => {
                      setInvites((all) => all.filter((x) => x.email !== inv.email))
                      toast(`Invite to ${inv.email} revoked`)
                    }}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="What each role can do" flush>
        <Table className="text-[14px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <Head className="pl-5">Permission</Head>
              {ROLES.map((r) => (
                <Head key={r} className="text-center last:pr-5">
                  {r}
                </Head>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMS.map((p) => (
              <TableRow key={p.label} className="hover:bg-transparent">
                <TableCell className="pl-5">{p.label}</TableCell>
                {ROLES.map((r) => (
                  <TableCell key={r} className="text-center last:pr-5">
                    {p.roles.includes(r) ? (
                      <Check className="mx-auto size-4 text-[color:var(--dc-accent)]" aria-label="Yes" />
                    ) : (
                      <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="No" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">Remove {members.find((m) => m.email === removing)?.name}?</AlertDialogTitle>
            <AlertDialogDescription>They lose access right away. Invoices they sent stay, with their name on the history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                const m = members.find((x) => x.email === removing)
                setMembers((all) => all.filter((x) => x.email !== removing))
                setRemoving(null)
                if (m) toast(`${m.name} removed`)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* Plan and billing ------------------------------------------------------------------------------- */

const PLANS = [
  { id: "Starter", monthly: 0, yearly: 0, blurb: "For your first few clients.", features: ["5 invoices a month", "Card payments", "1 reminder per invoice"] },
  { id: "Pro", monthly: 12, yearly: 10, blurb: "Everything a freelancer needs.", features: ["Unlimited invoices", "Reminder plans and late fees", "Recurring invoices", "Your logo and colors"] },
  { id: "Team", monthly: 39, yearly: 32, blurb: "For studios that bill together.", features: ["Everything in Pro", "5 seats, roles and approvals", "Multi-currency", "Priority support"] },
]

function BillingTab() {
  const [yearly, setYearly] = useState("yearly")
  const [chosen, setChosen] = useState<string | null>(null)
  return (
    <div className="grid gap-5">
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[15px] font-semibold">
              Pro trial <Pill tone="hl">3 days left</Pill>
            </p>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {chosen ? `You chose ${chosen}. It starts when the trial ends on Nov 27.` : "Ends Nov 27. Pick a plan to keep reminders, recurring invoices and your branding."}
            </p>
          </div>
          <div className="w-full max-w-[220px]">
            <div className="flex justify-between text-[12px] text-muted-foreground">
              <span>Day 11 of 14</span>
              <span>78%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="dc-h text-[20px]">Plans</h2>
        <Tabs value={yearly} onValueChange={(v) => setYearly(String(v))}>
          <TabsList className="h-8">
            <TabsTrigger value="monthly" className="px-3">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="px-3">
              Yearly <span className="text-[11px] font-semibold text-[color:var(--dc-accent)]">−20%</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const price = yearly === "yearly" ? p.yearly : p.monthly
          const current = chosen ? chosen === p.id : p.id === "Pro"
          return (
            <div key={p.id} className={cn("dc-card flex flex-col p-5", current && "ring-2 ring-[color:var(--dc-accent)]")}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">{p.id}</p>
                {current ? <Pill tone="hl">{chosen ? "Chosen" : "On trial"}</Pill> : null}
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">{p.blurb}</p>
              <p className="mt-4">
                <span className="dc-num text-[30px] font-semibold tracking-tight">${price}</span>
                <span className="text-[13px] text-muted-foreground"> /month{price && yearly === "yearly" ? ", billed yearly" : ""}</span>
              </p>
              <ul className="mt-4 grid gap-2 text-[14px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={p.id === "Pro" ? "default" : "outline"}
                className="mt-5 h-9 w-full font-semibold"
                disabled={chosen === p.id}
                onClick={() => {
                  setChosen(p.id)
                  toast.success(`${p.id} chosen`, { description: price ? `$${price}/month from Nov 27. Cancel any time.` : "Free from Nov 27." })
                }}
              >
                {chosen === p.id ? "Chosen" : p.id === "Starter" ? "Switch to Starter" : `Choose ${p.id}`}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Payment method">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-12 place-items-center rounded-[calc(var(--radius)-2px)] border border-border text-[11px] font-bold">VISA</span>
            <span className="min-w-0 flex-1">
              <span className="dc-num block text-[14px] font-medium">Visa ending 4242</span>
              <span className="block text-[12px] text-muted-foreground">Expires 08/28 · bills to {ME.email}</span>
            </span>
            <Button variant="outline" size="sm" onClick={() => toast("Opens a secure card form.")}>
              Update
            </Button>
          </div>
        </Panel>
        <Panel title="Usage this month">
          <div className="grid gap-3 text-[13px]">
            {[
              { label: "Invoices sent", value: "23", of: "Unlimited on Pro", pct: 0 },
              { label: "Team seats", value: "5 of 5", of: "", pct: 100 },
              { label: "File storage", value: "1.2 GB of 10 GB", of: "", pct: 12 },
            ].map((u) => (
              <div key={u.label}>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="dc-num font-medium">{u.value}</span>
                </div>
                {u.pct ? (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", u.pct >= 100 ? "bg-[color:var(--dc-danger)]" : "bg-[color:var(--chart-1)]")} style={{ width: `${u.pct}%` }} />
                  </div>
                ) : (
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{u.of}</p>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Billing history" flush>
        <EmptyState icon={Receipt} title="No bills yet" body="You're on the free trial. Your first bill comes on Nov 27 if you choose a paid plan, and every bill lands here as a PDF." className="py-10" />
      </Panel>
      <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" /> Card details are stored by our payment provider, never on Orbit’s servers.
      </p>
    </div>
  )
}
