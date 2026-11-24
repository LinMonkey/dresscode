"use client"

// Settings, profile: the photo (initials until one is chosen), name, email, business name, time zone and a
// short bio. Each field is checked when it loses focus and again on save; errors sit under the field and
// are tied to it. The save bar only appears once something differs from what was saved, with a way to
// discard. Wire onSubmit to your own endpoint (and the photo to your upload); nothing is sent here.
import { Check, CircleAlert, Upload } from "lucide-react"
import { type ChangeEvent, type FormEvent, type ReactNode, useId, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const KEYFRAMES = `@keyframes dc-save-bar-in { from { opacity: 0; transform: translateY(8px) } }`

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time, Los Angeles (GMT−8)" },
  { value: "America/Denver", label: "Mountain Time, Denver (GMT−7)" },
  { value: "America/Chicago", label: "Central Time, Chicago (GMT−6)" },
  { value: "America/New_York", label: "Eastern Time, New York (GMT−5)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+1)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+11)" },
]

const BIO_MAX = 160

type Values = { name: string; email: string; business: string; timezone: string; bio: string }
type Field = keyof Values

const INITIAL: Values = {
  name: "Ada Ruiz",
  email: "ada@ruizstudio.co",
  business: "Ruiz Studio",
  timezone: "America/Los_Angeles",
  bio: "Brand and web designer in Portland, working with small food and hospitality businesses.",
}

const ORDER: Field[] = ["name", "email", "business", "timezone", "bio"]

function check(field: Field, v: string): string {
  const t = v.trim()
  if (field === "name") return !t ? "Enter your name." : t.length > 60 ? "Keep your name under 60 characters." : ""
  if (field === "email") return !t ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? "" : "That doesn't look like an email address."
  if (field === "business") return !t ? "Enter the business name clients see on invoices." : ""
  if (field === "bio") return v.length > BIO_MAX ? `Keep it to ${BIO_MAX} characters. You are ${v.length - BIO_MAX} over.` : ""
  return ""
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join("")
    .toUpperCase() || "?"

function Row({ label, htmlFor, labelId, hint, hintId, children }: { label: string; htmlFor?: string; labelId?: string; hint?: ReactNode; hintId?: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-2.5 px-5 py-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:px-6">
      <div className="sm:pt-[9px]">
        {htmlFor ? (
          <Label htmlFor={htmlFor} className="text-[14px]">
            {label}
          </Label>
        ) : (
          <p id={labelId} className="text-[14px] leading-none font-medium">
            {label}
          </p>
        )}
        {hint ? (
          <p id={hintId} className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: string }) {
  return children ? (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[13px] text-destructive">
      <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  ) : null
}

export default function SettingsProfile() {
  const id = useId()
  const fid = (f: Field | "photo" | "file") => `${id}-${f}`
  const fileRef = useRef<HTMLInputElement>(null)

  const [saved, setSaved] = useState<Values>(INITIAL)
  const [values, setValues] = useState<Values>(INITIAL)
  const [photo, setPhoto] = useState<string | null>(null)
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [announce, setAnnounce] = useState("")
  const [justSaved, setJustSaved] = useState(false)

  const dirty = ORDER.some((f) => values[f] !== saved[f]) || photo !== savedPhoto
  const errorCount = Object.values(errors).filter(Boolean).length

  const set = (f: Field, v: string) => {
    setValues((all) => ({ ...all, [f]: v }))
    setJustSaved(false)
    // Clear an error as soon as the field is fixed; new errors wait for blur or save.
    if (errors[f] && !check(f, v)) setErrors((all) => ({ ...all, [f]: "" }))
    if (f === "bio" && v.length > BIO_MAX) setErrors((all) => ({ ...all, bio: check("bio", v) }))
  }
  const blur = (f: Field) => setErrors((all) => ({ ...all, [f]: check(f, values[f]) }))
  const describedBy = (f: Field, ...extra: string[]) => [...extra, errors[f] ? `${fid(f)}-error` : ""].filter(Boolean).join(" ") || undefined

  const pickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (photo && photo !== savedPhoto) URL.revokeObjectURL(photo)
    setPhoto(URL.createObjectURL(file))
    setJustSaved(false)
  }
  const removePhoto = () => {
    if (photo && photo !== savedPhoto) URL.revokeObjectURL(photo)
    setPhoto(null)
    setJustSaved(false)
  }

  const discard = () => {
    if (photo && photo !== savedPhoto) URL.revokeObjectURL(photo)
    setValues(saved)
    setPhoto(savedPhoto)
    setErrors({})
    setAnnounce("Changes discarded.")
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = Object.fromEntries(ORDER.map((f) => [f, check(f, values[f])])) as Record<Field, string>
    setErrors(next)
    const bad = ORDER.filter((f) => next[f])
    if (bad.length) {
      setAnnounce(`${bad.length} ${bad.length === 1 ? "field needs" : "fields need"} a fix before saving.`)
      document.getElementById(fid(bad[0]))?.focus()
      return
    }
    // Send `values` (and the photo) to your API here.
    if (savedPhoto && savedPhoto !== photo) URL.revokeObjectURL(savedPhoto)
    const clean = { ...values, name: values.name.trim(), email: values.email.trim(), business: values.business.trim() }
    setValues(clean)
    setSaved(clean)
    setSavedPhoto(photo)
    setJustSaved(true)
    setAnnounce("Profile saved.")
  }

  const emailChanged = values.email.trim() !== saved.email && !check("email", values.email)
  const bioLeft = BIO_MAX - values.bio.length

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-8">
      <style href="dc-save-bar" precedence="default">
        {KEYFRAMES}
      </style>
      <h2 id={`${id}-title`} className="dc-h text-[24px] leading-tight sm:text-[28px]">
        Profile
      </h2>
      <p className="mt-1.5 text-[15px] text-muted-foreground">How you show up on invoices, in reminders and to your team.</p>

      <form noValidate onSubmit={onSubmit} className="mt-6">
        <div className="dc-card divide-y divide-border">
          <Row label="Photo" labelId={fid("photo")} hint="On invoices and reminders. A square image, at least 256 px." hintId={`${fid("photo")}-hint`}>
            <div role="group" aria-labelledby={fid("photo")} aria-describedby={`${fid("photo")}-hint`} className="flex flex-wrap items-center gap-4">
              <Avatar className="size-16 after:hidden" aria-hidden="true">
                {photo ? <AvatarImage src={photo} alt="" /> : null}
                <AvatarFallback className="bg-[color:var(--dc-highlight)] text-[20px] font-bold text-[color:var(--dc-highlight-fg)]">{initialsOf(values.name)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">{photo ? "A new photo is chosen." : `No photo; your initials, ${initialsOf(values.name)}, show instead.`}</span>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                  <Upload aria-hidden="true" /> {photo ? "Change photo" : "Upload photo"}
                </Button>
                <Button type="button" variant="ghost" className="dc-flat text-muted-foreground" onClick={removePhoto} disabled={!photo}>
                  Remove
                </Button>
              </div>
              <input ref={fileRef} id={fid("file")} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pickPhoto} />
            </div>
          </Row>

          <Row label="Full name" htmlFor={fid("name")}>
            <Input
              id={fid("name")}
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => blur("name")}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              className="h-9"
            />
            <ErrorText id={`${fid("name")}-error`}>{errors.name ?? ""}</ErrorText>
          </Row>

          <Row label="Email" htmlFor={fid("email")} hint="Where reminders, receipts and sign-in links go." hintId={`${fid("email")}-hint`}>
            <Input
              id={fid("email")}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email", `${fid("email")}-hint`, emailChanged ? `${fid("email")}-note` : "")}
              className="h-9"
            />
            <ErrorText id={`${fid("email")}-error`}>{errors.email ?? ""}</ErrorText>
            {emailChanged && !errors.email ? (
              <p id={`${fid("email")}-note`} className="mt-1.5 text-[13px] text-muted-foreground">
                We will send a link to confirm the new address. Until then, mail goes to {saved.email}.
              </p>
            ) : null}
          </Row>

          <Row label="Business name" htmlFor={fid("business")} hint="Printed at the top of every invoice." hintId={`${fid("business")}-hint`}>
            <Input
              id={fid("business")}
              autoComplete="organization"
              value={values.business}
              onChange={(e) => set("business", e.target.value)}
              onBlur={() => blur("business")}
              aria-invalid={errors.business ? true : undefined}
              aria-describedby={describedBy("business", `${fid("business")}-hint`)}
              className="h-9"
            />
            <ErrorText id={`${fid("business")}-error`}>{errors.business ?? ""}</ErrorText>
          </Row>

          <Row label="Time zone" htmlFor={fid("timezone")} hint="Reminders go out at 9:00 in this zone." hintId={`${fid("timezone")}-hint`}>
            <Select items={TIMEZONES} value={values.timezone} onValueChange={(v) => v != null && set("timezone", String(v))}>
              <SelectTrigger id={fid("timezone")} aria-describedby={`${fid("timezone")}-hint`} className="w-full bg-[color:var(--card)] data-[size=default]:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          <Row label="Bio" htmlFor={fid("bio")} hint="A line or two for the footer of your invoices and your client portal." hintId={`${fid("bio")}-hint`}>
            <Textarea
              id={fid("bio")}
              rows={3}
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
              onBlur={() => blur("bio")}
              aria-invalid={errors.bio ? true : undefined}
              aria-describedby={describedBy("bio", `${fid("bio")}-hint`, `${fid("bio")}-count`)}
              className="min-h-[88px] resize-none"
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <ErrorText id={`${fid("bio")}-error`}>{errors.bio ?? ""}</ErrorText>
              <p id={`${fid("bio")}-count`} className={cn("dc-num ml-auto shrink-0 text-[12px] text-muted-foreground", bioLeft < 0 && "font-semibold text-destructive")}>
                {values.bio.length} / {BIO_MAX}
                <span className="sr-only"> characters</span>
              </p>
            </div>
            <p className="sr-only" aria-live="polite">
              {bioLeft <= 20 && bioLeft >= 0 ? `${bioLeft} characters left.` : ""}
            </p>
          </Row>
        </div>

        <p className="sr-only" role="status">
          {announce}
        </p>
        {dirty ? (
          <div className="sticky bottom-4 z-10 mt-4">
            <div className="dc-card flex animate-[dc-save-bar-in_200ms_ease-out] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 motion-reduce:animate-none sm:px-5">
              <p className="flex min-w-0 items-center gap-2 text-[14px] font-medium">
                {errorCount ? (
                  <>
                    <CircleAlert className="size-4 shrink-0 text-destructive" aria-hidden="true" />
                    {errorCount === 1 ? "1 field needs a fix" : `${errorCount} fields need a fix`}
                  </>
                ) : (
                  <>
                    <span className="size-2 shrink-0 rounded-full bg-[color:var(--dc-accent)]" aria-hidden="true" />
                    Unsaved changes
                  </>
                )}
              </p>
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="ghost" className="dc-flat" onClick={discard}>
                  Discard
                </Button>
                <Button type="submit" className="font-semibold">
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        ) : justSaved ? (
          <p className="mt-4 flex animate-[dc-save-bar-in_200ms_ease-out] items-center gap-2 px-1 text-[14px] text-muted-foreground motion-reduce:animate-none">
            <span className="grid size-6 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            Saved. New invoices use these details.
          </p>
        ) : null}
      </form>
    </section>
  )
}
