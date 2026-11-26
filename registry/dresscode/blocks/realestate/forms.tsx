"use client"

// The forms: the home page's search, the valuation box, the private office's note, the contact form
// and the three-step valuation. Wire each submit to your CRM or inbox where marked.
import { ArrowRight, Check, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { HOODS, type HomeType, type Status } from "./data"
import { searchPath, short, to } from "./site"

const field = "h-12 rounded-[var(--radius)] border border-[color:var(--input)] bg-background px-3 text-[15px] text-foreground"

export function HeroSearch({ base }: { base: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("sale")
  const [where, setWhere] = useState("")
  const [type, setType] = useState<"" | HomeType>("")
  const [max, setMax] = useState(0)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = new URLSearchParams()
    const hood = HOODS.find((h) => h.name.toLowerCase() === where.trim().toLowerCase())
    if (hood) q.set("hood", hood.slug)
    else if (where.trim()) q.set("q", where.trim())
    if (type) q.set("type", type)
    if (max) q.set("max", String(max))
    const s = q.toString()
    router.push(to(base, searchPath(status)) + (s ? `?${s}` : ""))
  }
  const prices = status === "rent" ? [2_000, 3_000, 4_000, 5_000] : [600_000, 800_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000]
  return (
    <form onSubmit={submit} className="dc-card w-full p-4 shadow-[0_24px_50px_-24px_rgb(0_0_0/0.45)] sm:p-5" role="search" aria-label="Find a home">
      <div role="tablist" aria-label="What you want" className="mb-4 flex gap-6 border-b border-border">
        {(["sale", "rent", "sold"] as Status[]).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={status === s}
            onClick={() => {
              setStatus(s)
              setMax(0)
            }}
            className="-mb-px cursor-pointer border-b-[3px] border-transparent pb-2.5 text-[15px] font-medium text-muted-foreground aria-selected:border-[color:var(--dc-primary)] aria-selected:font-bold aria-selected:text-foreground"
          >
            {{ sale: "Buy", rent: "Rent", sold: "Sold" }[s]}
          </button>
        ))}
      </div>
      <div className="grid gap-2.5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className={cn(field, "flex items-center gap-2")}>
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">City, neighborhood or address</span>
          <input list="re-hoods" value={where} onChange={(e) => setWhere(e.target.value)} placeholder="City, neighborhood or address" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          <datalist id="re-hoods">
            {HOODS.map((h) => (
              <option key={h.slug} value={h.name} />
            ))}
          </datalist>
        </label>
        <label className="sr-only" htmlFor="re-type">
          Home type
        </label>
        <select id="re-type" value={type} onChange={(e) => setType(e.target.value as HomeType | "")} className={cn(field, "cursor-pointer")}>
          <option value="">Home type</option>
          {(["House", "Condo", "Townhouse", "Loft"] as HomeType[]).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="re-price">
          Maximum price
        </label>
        <select id="re-price" value={max} onChange={(e) => setMax(Number(e.target.value))} className={cn(field, "cursor-pointer")}>
          <option value={0}>Price</option>
          {prices.map((p) => (
            <option key={p} value={p}>
              Up to {short(p, status === "rent" ? "rent" : undefined)}
            </option>
          ))}
        </select>
        <Button type="submit" size="lg" className="h-12 px-7 text-[16px] font-bold">
          Search
        </Button>
      </div>
    </form>
  )
}

/** The address box in the valuation band; it carries the address on to the valuation page. */
export function ValuationStart({ base }: { base: string }) {
  const router = useRouter()
  const [address, setAddress] = useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        router.push(to(base, "sell") + (address.trim() ? `?address=${encodeURIComponent(address.trim())}` : ""))
      }}
      className="mt-6 flex max-w-[560px] flex-col gap-2.5 sm:flex-row"
    >
      <label className="flex h-12 flex-1 items-center gap-2 rounded-[var(--radius)] bg-[color:var(--dc-surface)] px-3 text-[color:var(--dc-ink)]">
        <MapPin className="size-4 shrink-0 opacity-60" aria-hidden="true" />
        <span className="sr-only">Your address</span>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[color:var(--dc-muted)]" />
      </label>
      <Button type="submit" size="lg" className="h-12 px-5 text-[15px] font-bold">
        Get my valuation
      </Button>
    </form>
  )
}

function Done({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="rounded-[var(--dc-radius-card)] border border-border bg-card p-6">
      <p className="flex items-center gap-2 text-[17px] font-semibold">
        <Check className="size-5 text-[color:var(--dc-accent)]" aria-hidden="true" /> {title}
      </p>
      <p className="mt-2 text-[15px] text-muted-foreground">{body}</p>
    </div>
  )
}

/** Name, email, message: the contact page and the private office's note. */
export function NoteForm({ cta = "Send a note", id = "re-note", className }: { cta?: string; id?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "done">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [name, setName] = useState("")
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (!String(data.get("name")).trim()) next.name = "Add your name."
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) next.email = "Add an email address we can reply to."
    if (String(data.get("message")).trim().length < 10) next.message = "Tell us a little about the home or what you are looking for."
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) return document.getElementById(`${id}-${first}`)?.focus()
    setName(String(data.get("name")).trim().split(" ")[0])
    // Send new FormData(e.currentTarget) to your CRM or inbox here.
    setState("done")
  }
  if (state === "done") return <Done title={`Thank you, ${name}.`} body="We will reply within one working day, usually sooner." />
  const row = (key: string, label: string, input: ReactNode) => (
    <div className="grid gap-1.5">
      <label htmlFor={`${id}-${key}`} className="text-[14px] font-medium">
        {label}
      </label>
      {input}
      {errors[key] ? (
        <p id={`${id}-${key}-error`} className="text-[13px] text-[color:var(--dc-danger)]">
          {errors[key]}
        </p>
      ) : null}
    </div>
  )
  const invalid = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${id}-${k}-error` } : {})
  return (
    <form onSubmit={submit} noValidate className={cn("grid gap-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        {row("name", "Name", <Input id={`${id}-name`} name="name" autoComplete="name" className="h-11" {...invalid("name")} />)}
        {row("email", "Email", <Input id={`${id}-email`} name="email" type="email" autoComplete="email" className="h-11" {...invalid("email")} />)}
      </div>
      {row("message", "Message", <Textarea id={`${id}-message`} name="message" rows={4} {...invalid("message")} />)}
      <Button type="submit" size="lg" className="h-11 w-full text-[15px] font-semibold sm:w-fit sm:px-6">
        {cta}
      </Button>
    </form>
  )
}

/** The valuation, in three steps: the address, the home, how to reach you. */
export function ValuationSteps() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState("")
  // An address typed on the home page arrives in the URL (after the first paint, so it matches the server's).
  useEffect(() => {
    const given = new URLSearchParams(window.location.search).get("address")
    if (!given) return
    const id = window.setTimeout(() => setAddress(given), 0)
    return () => window.clearTimeout(id)
  }, [])
  const [beds, setBeds] = useState(3)
  const [baths, setBaths] = useState(2)
  const [sqft, setSqft] = useState("")
  const [condition, setCondition] = useState("Good")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const first = useRef<HTMLInputElement>(null)
  const steps = ["Address", "Details", "Contact"]

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (step === 0 && address.trim().length < 5) return (setError("Add the street address of the home."), first.current?.focus())
    if (step === 2 && !/^\S+@\S+\.\S+$/.test(email)) return (setError("Add an email address for the valuation."), first.current?.focus())
    setError("")
    // On the last step, send the answers to your CRM here.
    setStep(step + 1)
  }

  if (step === 3) return <Done title="Your valuation is on its way" body={`An agent who has sold near ${address} will email you a valuation within two working days, with the three nearest sales it is based on.`} />

  const choice = (label: string, value: number | string, set: (v: never) => void, options: (number | string)[]) => (
    <fieldset>
      <legend className="mb-2 text-[14px] font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => (set as (v: typeof o) => void)(o)}
            className="h-11 min-w-12 cursor-pointer rounded-[var(--radius)] border border-[color:var(--input)] px-4 text-[15px] hover:bg-muted aria-pressed:border-[color:var(--dc-accent)] aria-pressed:bg-[color:color-mix(in_oklab,var(--dc-accent)_10%,transparent)] aria-pressed:font-semibold aria-pressed:text-[color:var(--dc-accent)]"
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )

  return (
    <form onSubmit={next} noValidate className="dc-card p-6 sm:p-8">
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="text-[13px] font-medium text-muted-foreground aria-[current=step]:text-foreground">
            <span className={cn("mb-2 block h-1 rounded-full", i <= step ? "bg-[color:var(--dc-primary)]" : "bg-muted")} aria-hidden="true" />
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      {step === 0 ? (
        <div className="grid gap-1.5">
          <label htmlFor="re-val-address" className="text-[15px] font-medium">
            The home&apos;s address
          </label>
          <Input id="re-val-address" ref={first} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="908 Cedar Heights Road" autoComplete="street-address" className="h-12 text-[16px]" />
        </div>
      ) : step === 1 ? (
        <div className="grid gap-6">
          {choice("Bedrooms", beds, setBeds as (v: never) => void, [1, 2, 3, 4, 5])}
          {choice("Bathrooms", baths, setBaths as (v: never) => void, [1, 2, 3, 4])}
          <div className="grid gap-1.5">
            <label htmlFor="re-val-sqft" className="text-[14px] font-medium">
              Living area, sq ft <span className="font-normal text-muted-foreground">(a guess is fine)</span>
            </label>
            <Input id="re-val-sqft" inputMode="numeric" value={sqft} onChange={(e) => setSqft(e.target.value.replace(/\D/g, ""))} className="h-11 max-w-48" />
          </div>
          {choice("Condition", condition, setCondition as (v: never) => void, ["Needs work", "Good", "Renovated"])}
        </div>
      ) : (
        <div className="grid gap-1.5">
          <label htmlFor="re-val-email" className="text-[15px] font-medium">
            Where should we send it?
          </label>
          <Input id="re-val-email" ref={first} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="h-12 text-[16px]" />
          <p className="text-[13px] text-muted-foreground">No spam and no calls unless you ask for one.</p>
        </div>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-[14px] text-[color:var(--dc-danger)]">
          {error}
        </p>
      ) : null}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" size="lg" className="h-11 px-4" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" className="h-11 px-6 text-[15px] font-semibold">
          {step === 2 ? "Get my valuation" : "Continue"} <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
