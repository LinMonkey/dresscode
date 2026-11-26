"use client"

// The product page's moving parts: the photos (a two-column wall, a swipe row on phones, a viewer),
// the buy box (color, size, sold-out sizes, notify me, size guide, quantity, add to cart, delivery
// date), "Pairs well with" and the reviews (fit, size filter, sort, write one).
import { ChevronDown, ChevronLeft, ChevronRight, Expand, Package, Ruler, Truck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { Dot, Photo, Price, ProductBadge } from "./cards"
import { REVIEWS, STORE, type Product, type Review } from "./data"
import { Field } from "./forms"
import { arrives, firstAvailable, formatDate, linePrice, money, photosOf, priceOf, productOf, stockOf, to } from "./site"
import { cart, markViewed, useToday } from "./store"
import { FIELD, OUTLINE, PRIMARY } from "./styles"
import { SaveButton, Stepper } from "./ui"

const noop = () => () => {}

/* Photos -------------------------------------------------------------------------------------------- */

function Gallery({ photos, name, model }: { photos: string[]; name: string; model?: string }) {
  const [view, setView] = useState<number | null>(null)
  const [at, setAt] = useState(0)
  const odd = photos.length % 2 === 1
  return (
    <div>
      {/* Phones: a row to swipe. */}
      <div className="relative md:hidden">
        <ul
          className="ec-scroll -mx-4 flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          aria-label={`${name} photos`}
        >
          {photos.map((src, i) => (
            <li key={src + i} className="w-full shrink-0 snap-center px-4">
              <button type="button" onClick={() => setView(i)} className="block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[var(--dc-radius-card)]" aria-label={`Open photo ${i + 1} of ${photos.length}`}>
                <Photo src={src} alt={i ? "" : name} priority={i === 0} />
              </button>
            </li>
          ))}
        </ul>
        <span className="dc-num absolute right-6 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-[12px] text-white">
          {at + 1} / {photos.length}
        </span>
      </div>
      {/* Wider: a wall of two columns. */}
      <ul className="hidden grid-cols-2 gap-3 md:grid">
        {photos.map((src, i) => (
          <li key={src + i} className={cn("relative", odd && i === 0 && "col-span-2")}>
            <button type="button" onClick={() => setView(i)} className={cn("group block w-full cursor-zoom-in overflow-hidden rounded-[var(--dc-radius-card)]", odd && i === 0 ? "aspect-[5/4]" : "aspect-[4/5]")} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
              <Photo src={src} alt={i ? "" : name} priority={i < 2} imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 text-[#141414] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                <Expand className="size-4" />
              </span>
            </button>
            {i === 0 && model ? <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[12px] text-[#141414]">{model}</span> : null}
          </li>
        ))}
      </ul>
      <Dialog open={view !== null} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-[min(1000px,calc(100%-2rem))] gap-0 bg-card p-2 sm:max-w-[1000px]">
          <DialogTitle className="sr-only">
            {name}, photo {(view ?? 0) + 1} of {photos.length}
          </DialogTitle>
          {view !== null ? (
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]">
                <Photo src={photos[view]} alt={view ? "" : name} contain />
              </div>
              {photos.length > 1 ? (
                <>
                  <button type="button" onClick={() => setView((view + photos.length - 1) % photos.length)} className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#141414] shadow" aria-label="Previous photo">
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => setView((view + 1) % photos.length)} className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#141414] shadow" aria-label="Next photo">
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
              <p className="dc-num mt-2 text-center text-[13px] text-muted-foreground">
                {view + 1} / {photos.length}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* Size guide, notify me -------------------------------------------------------------------------- */

const SIZE_CHART: [string, string, string, string][] = [
  ["XS", "34–35", "25", "31"],
  ["S", "36–37", "26", "32"],
  ["M", "38–40", "27", "33"],
  ["L", "41–43", "28", "34"],
  ["XL", "44–46", "29", "35"],
  ["XXL", "47–49", "30", "36"],
]

function SizeGuide({ p, open, onOpenChange }: { p: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const rows = SIZE_CHART.filter(([s]) => p.sizes?.some((x) => x.name === s))
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(560px,calc(100%-2rem))] gap-4 bg-card p-6 sm:max-w-[560px]">
        <DialogTitle className="dc-h text-[24px]">Size guide</DialogTitle>
        <DialogDescription className="text-[15px]">{p.name}. Body measurements in inches; {p.fitNote?.toLowerCase() ?? "fits true to size."}</DialogDescription>
        <table className="w-full text-left text-[15px]">
          <thead className="text-[13px] text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Chest</th>
              <th className="py-2 font-medium">Body length</th>
              <th className="py-2 font-medium">Sleeve</th>
            </tr>
          </thead>
          <tbody className="dc-num">
            {rows.map(([s, ...cells]) => (
              <tr key={s} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 font-semibold">
                  {s}
                </th>
                {cells.map((c, i) => (
                  <td key={i} className="py-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[14px] text-muted-foreground">Between sizes? {p.model ? `${p.model}. ` : ""}Exchanges are free for {STORE.returnDays} days.</p>
      </DialogContent>
    </Dialog>
  )
}

function NotifyMe({ what, open, onOpenChange }: { what: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter an email address like name@example.com.")
    // HOOK: save the request for a back-in-stock email.
    setDone(true)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setTimeout(() => setDone(false), 200)
      }}
    >
      <DialogContent className="max-w-[min(440px,calc(100%-2rem))] gap-4 bg-card p-6 sm:max-w-[440px]">
        <DialogTitle className="dc-h text-[22px]">{done ? "We'll let you know" : "Notify me"}</DialogTitle>
        {done ? (
          <p className="text-[15px] text-muted-foreground" role="status">
            We&apos;ll email {email} as soon as {what} is back. One email, then we forget your address.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            <DialogDescription className="text-[15px]">{what} is sold out. Most sizes come back within three weeks.</DialogDescription>
            <Field label="Email" id="ec-notify-email" error={error}>
              <input id="ec-notify-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} className={FIELD} />
            </Field>
            <button type="submit" className={cn(PRIMARY, "h-11 text-[15px]")}>
              Email me when it&apos;s back
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* The buy box ---------------------------------------------------------------------------------------- */

function Accordion({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-4 text-[15px] text-muted-foreground">{children}</div>
    </details>
  )
}

export function ProductView({ p }: { p: Product }) {
  const pathname = usePathname()
  const search = useSyncExternalStore(noop, () => window.location.search, () => "")
  const today = useToday()
  const fromUrl = new URLSearchParams(search)
  const urlColor = p.colors.find((c) => c.name === fromUrl.get("color"))?.name
  const urlSize = p.sizes?.find((s) => s.name === fromUrl.get("size"))?.name
  const apparel = p.category === "apparel"
  const defaults = firstAvailable(p, urlColor)
  const [picked, setPicked] = useState<{ color?: string; size?: string } | null>(null)
  const color = picked?.color ?? urlColor ?? defaults.color
  const size = picked ? picked.size : (urlSize ?? (apparel ? undefined : defaults.size))
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [guide, setGuide] = useState(false)
  const [notify, setNotify] = useState<string | null>(null)

  useEffect(() => {
    markViewed(p.slug)
  }, [p.slug])

  const choose = (next: { color?: string; size?: string }) => {
    setPicked(next)
    setAdded(false)
    const q = new URLSearchParams()
    if (next.color && next.color !== p.colors[0]?.name) q.set("color", next.color)
    if (next.size) q.set("size", next.size)
    const s = q.toString()
    window.history.replaceState(window.history.state, "", pathname + (s ? `?${s}` : ""))
  }

  const photos = photosOf(p, color)
  const stock = size || !p.sizes?.length ? stockOf(p, color, size) : Infinity
  const out = stock <= 0
  const soldOutSizes = (p.sizes ?? []).filter((s) => stockOf(p, color, s.name) <= 0)
  const price = priceOf(p, size)
  const needsSize = !!p.sizes?.length && !size
  const add = () => {
    if (needsSize || out) return
    cart.add({ slug: p.slug, color, size, qty })
    setAdded(true)
  }
  const each = STORE.installments ? Math.round((price / STORE.installments) * 100) / 100 : 0
  const sizeLabel = p.sizeLabel ?? "Size"

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
      <Gallery key={color} photos={photos} name={`${p.name}${color ? ` in ${color}` : ""}`} model={color === p.colors[0]?.name ? p.model : undefined} />
      <div className="lg:sticky lg:top-6 lg:self-start">
        <ProductBadge p={p} />
        <h1 className="dc-h mt-2 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05]">{p.name}</h1>
        <p className="mt-2 text-[clamp(1.4rem,2vw,1.6rem)] font-semibold">
          <Price p={p} size={size} />
        </p>
        {each ? <p className="mt-1 text-[14px] text-muted-foreground">or {STORE.installments} interest-free payments of {money(each, Math.round(each) !== each)}</p> : null}
        <p className="mt-3 border-b border-border pb-5 text-[16px]">{p.summary}</p>

        {p.colors.length ? (
          <fieldset className="border-b border-border py-5">
            <legend className="float-left mb-3 w-full text-[15px] font-semibold">
              Color: <span className="font-normal">{color}</span>
            </legend>
            <div className="clear-both flex flex-wrap gap-3">
              {p.colors.map((c) => {
                const on = c.name === color
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-pressed={on}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => choose({ color: c.name, size: size && stockOf(p, c.name, size) > 0 ? size : undefined })}
                    className={cn("grid size-11 cursor-pointer place-items-center rounded-full transition-shadow", on ? "shadow-[0_0_0_2px_var(--foreground)]" : "hover:shadow-[0_0_0_1px_var(--border)]")}
                  >
                    <Dot color={c} className="size-[34px]" />
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {p.sizes?.length ? (
          <fieldset className="border-b border-border py-5">
            <legend className="float-left mb-3 flex w-full items-center justify-between text-[15px] font-semibold">
              <span>
                {sizeLabel}: <span className="font-normal">{size ?? "choose one"}</span>
              </span>
              {apparel ? (
                <button type="button" onClick={() => setGuide(true)} className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[color:var(--dc-accent)] underline underline-offset-4 hover:no-underline">
                  <Ruler className="size-4" aria-hidden="true" /> Size guide
                </button>
              ) : null}
            </legend>
            <div className="clear-both grid gap-2" style={{ gridTemplateColumns: `repeat(${p.sizes.length > 3 ? p.sizes.length : Math.max(2, p.sizes.length)}, minmax(0, 1fr))` }}>
              {p.sizes.map((s) => {
                const sold = stockOf(p, color, s.name) <= 0
                return (
                  <button
                    key={s.name}
                    type="button"
                    aria-pressed={s.name === size}
                    aria-label={sold ? `${s.name}, sold out` : s.name}
                    onClick={() => (sold ? setNotify(`${s.name}${color ? ` in ${color}` : ""}`) : choose({ color, size: s.name }))}
                    className={cn(
                      "relative h-11 cursor-pointer overflow-hidden rounded-[var(--radius)] border border-[color:var(--input)] px-2 text-[15px] transition-colors hover:border-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:font-semibold aria-pressed:text-primary-foreground",
                      sold && "bg-muted text-muted-foreground line-through decoration-1 hover:border-[color:var(--input)]",
                    )}
                  >
                    {s.name}
                    {s.price && s.price !== p.price ? <span className="ml-1 text-[12px] opacity-80">{money(s.price)}</span> : null}
                  </button>
                )
              })}
            </div>
            {soldOutSizes.length ? (
              <p className="mt-3 text-[14px] text-muted-foreground">
                {soldOutSizes.map((s) => s.name).join(", ")}
                {color ? ` in ${color}` : ""} {soldOutSizes.length > 1 ? "are" : "is"} sold out —{" "}
                <button type="button" onClick={() => setNotify(`${soldOutSizes[0].name}${color ? ` in ${color}` : ""}`)} className="cursor-pointer font-medium text-[color:var(--dc-accent)] underline underline-offset-4 hover:no-underline">
                  Notify me
                </button>
              </p>
            ) : null}
            {p.fitNote ? <p className="mt-2 text-[14px] text-muted-foreground">{p.fitNote}</p> : null}
          </fieldset>
        ) : null}

        <div className="flex gap-3 pt-5">
          <Stepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={p.name} size="lg" max={Math.max(1, Math.min(10, Number.isFinite(stock) ? stock : 10))} />
          <button type="button" onClick={add} disabled={out} className={cn(PRIMARY, "h-12 flex-1 text-[16px]", needsSize && "opacity-90")} aria-describedby={needsSize ? "ec-need-size" : undefined}>
            {out ? "Sold out" : needsSize ? `Choose a ${sizeLabel.toLowerCase()}` : added ? "Added — add another?" : <>Add to cart — {money(price * qty)}</>}
          </button>
          <SaveButton slug={p.slug} label={p.name} variant="square" />
        </div>
        {needsSize ? (
          <p id="ec-need-size" className="sr-only">
            Choose a {sizeLabel.toLowerCase()} first.
          </p>
        ) : null}
        {!out && Number.isFinite(stock) && stock <= STORE.lowStock ? (
          <p className="mt-2 text-[14px] font-medium text-[color:var(--dc-danger)]">
            Only {stock} left{[color, size].filter(Boolean).length ? ` in ${[color, size].filter(Boolean).join(" / ")}` : ""}
          </p>
        ) : null}

        <ul className="mt-5 divide-y divide-border rounded-[var(--dc-radius-card)] border border-border text-[15px]">
          <li className="flex items-center gap-3 px-4 py-3">
            <Truck className="size-5 shrink-0" aria-hidden="true" />
            <span>
              {price * qty >= STORE.freeShippingOver ? "Free shipping" : `Free shipping over ${money(STORE.freeShippingOver)}`} — order today, arrives {arrives(today, STORE.standardDays)}
            </span>
          </li>
          <li className="flex items-center gap-3 px-4 py-3">
            <Package className="size-5 shrink-0" aria-hidden="true" />
            <span>
              Free returns and exchanges within {STORE.returnDays} days{p.category === "bedding" ? `, or ${STORE.trialNights} nights on bedding` : ""}
            </span>
          </li>
        </ul>

        <div className="mt-5 border-t border-border">
          <Accordion title={p.category === "apparel" ? "Details & fit" : "Details"} open>
            <ul className="grid list-disc gap-1 pl-5 text-foreground marker:text-muted-foreground">
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Materials & care">
            <ul className="grid list-disc gap-1 pl-5 marker:text-muted-foreground">
              {p.care.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Shipping & returns">
            <p>
              Standard shipping is free over {money(STORE.freeShippingOver)} ({money(STORE.standardShipping)} below) and arrives in {STORE.standardDays[0]}–{STORE.standardDays[1]} business days. Express is {money(STORE.expressShipping)}, {STORE.expressDays[0]}–{STORE.expressDays[1]} days. Return anything unused within {STORE.returnDays} days for a full refund; we email you the label.
            </p>
          </Accordion>
        </div>
      </div>
      {apparel ? <SizeGuide p={p} open={guide} onOpenChange={setGuide} /> : null}
      <NotifyMe what={notify ?? ""} open={notify !== null} onOpenChange={(o) => !o && setNotify(null)} />
    </div>
  )
}

/* Pairs well with -------------------------------------------------------------------------------------- */

function PairCard({ base, p }: { base: string; p: Product }) {
  const first = firstAvailable(p)
  const [size, setSize] = useState(p.category === "apparel" ? (p.sizes?.find((s) => s.name === "M")?.name ?? first.size) : first.size)
  const [done, setDone] = useState(false)
  return (
    <li className="dc-card flex items-center gap-4 p-3">
      <Link href={to(base, "products", p.slug)} className="size-24 shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]" tabIndex={-1} aria-hidden="true">
        <Photo src={p.photos[0]} alt="" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={to(base, "products", p.slug)} className="block text-[15px] leading-snug font-semibold hover:underline">
          {p.name}
        </Link>
        <p className="text-[13px] text-muted-foreground">{first.color}</p>
        <p className="dc-num text-[15px] font-semibold">{money(linePrice({ slug: p.slug, size }))}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {p.sizes?.length ? (
            <span className="relative">
              <select value={size} onChange={(e) => setSize(e.target.value)} aria-label={`${p.sizeLabel ?? "Size"} for ${p.name}`} className="h-9 cursor-pointer appearance-none rounded-[var(--radius)] border border-[color:var(--input)] bg-card pr-8 pl-3 text-[14px]">
                {p.sizes.map((s) => (
                  <option key={s.name} value={s.name} disabled={stockOf(p, first.color, s.name) <= 0}>
                    {p.category === "apparel" ? `Size ${s.name}` : s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2" aria-hidden="true" />
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => {
              cart.add({ slug: p.slug, color: first.color, size }, { open: false })
              setDone(true)
            }}
            className={cn(OUTLINE, "h-9 px-4 text-[14px]")}
          >
            {done ? "Added" : "+ Add"}
          </button>
        </div>
      </div>
    </li>
  )
}

export function PairsWellWith({ base, p }: { base: string; p: Product }) {
  const list = p.pairs.map(productOf).filter((x): x is Product => !!x)
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {list.map((x) => (
        <PairCard key={x.slug} base={base} p={x} />
      ))}
    </ul>
  )
}

/* Reviews ------------------------------------------------------------------------------------------------- */

function Scale({ label, ends, at }: { label: string; ends: [string, string, string]; at: number }) {
  return (
    <div>
      <p className="text-[16px] font-semibold">{label}</p>
      <div className="relative mt-4 h-px bg-border">
        <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" style={{ left: `${50 + at * 45}%` }} aria-hidden="true" />
      </div>
      <div className="mt-3 flex justify-between text-[13px] text-muted-foreground">
        {ends.map((e) => (
          <span key={e}>{e}</span>
        ))}
      </div>
      <p className="sr-only">{at === 0 ? ends[1] : at < 0 ? `Between ${ends[0]} and ${ends[1]}` : `Between ${ends[1]} and ${ends[2]}`}</p>
    </div>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-[14px] tracking-[0.1em] text-[color:var(--dc-accent)]" aria-label={`${n} out of 5`}>
      {"★★★★★".slice(0, n)}
      <span className="text-muted-foreground/40">{"★★★★★".slice(n)}</span>
    </span>
  )
}

function WriteReview({ p, open, onOpenChange }: { p: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (!String(f.get("title")).trim()) next.title = "Give it a short title."
    if (String(f.get("body")).trim().length < 20) next.body = "A couple of sentences, please: what you like, and what you'd change."
    if (!String(f.get("name")).trim()) next.name = "How should we sign it?"
    setErrors(next)
    // HOOK: send the review to your reviews service; it appears once it's checked.
    if (!Object.keys(next).length) setDone(true)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setTimeout(() => setDone(false), 200)
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-[min(560px,calc(100%-2rem))] gap-4 overflow-y-auto bg-card p-6 sm:max-w-[560px]">
        <DialogTitle className="dc-h text-[24px]">{done ? "Thank you" : "Write a review"}</DialogTitle>
        {done ? (
          <p className="text-[15px] text-muted-foreground" role="status">
            Your review of the {p.name} will appear after a quick check, usually within a day.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            <DialogDescription className="text-[15px]">{p.name}. Reviews are from people who bought it; we post the good and the bad.</DialogDescription>
            {p.sizes?.length ? (
              <Field label={`${p.sizeLabel ?? "Size"} you bought`} id="ec-r-size">
                <select id="ec-r-size" name="size" className={FIELD}>
                  {p.sizes.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                </select>
              </Field>
            ) : null}
            {p.fit ? (
              <fieldset>
                <legend className="text-[14px] font-medium">How does it fit?</legend>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[14px]">
                  {["Runs small", "True to size", "Runs large"].map((x, i) => (
                    <label key={x} className="flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] border border-[color:var(--input)] px-2 py-2.5 has-checked:border-primary has-checked:bg-muted">
                      <input type="radio" name="fit" value={x} defaultChecked={i === 1} className="sr-only" />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            <Field label="Title" id="ec-r-title" error={errors.title}>
              <input id="ec-r-title" name="title" maxLength={80} aria-invalid={!!errors.title} className={FIELD} />
            </Field>
            <Field label="Review" id="ec-r-body" error={errors.body}>
              <textarea id="ec-r-body" name="body" rows={4} aria-invalid={!!errors.body} className={cn(FIELD, "h-auto py-2.5")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" id="ec-r-name" error={errors.name} hint="First name and last initial.">
                <input id="ec-r-name" name="name" placeholder="Sam R." aria-invalid={!!errors.name} className={FIELD} />
              </Field>
              <Field label="Email" id="ec-r-email" hint="To check your order. Never shown.">
                <input id="ec-r-email" name="email" type="email" autoComplete="email" className={FIELD} />
              </Field>
            </div>
            <button type="submit" className={cn(PRIMARY, "h-11 text-[15px]")}>
              Submit review
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function Reviews({ p }: { p: Product }) {
  const all = REVIEWS.filter((r) => r.product === p.slug)
  const sizes = [...new Set(all.map((r) => r.size).filter((s): s is string => !!s))].sort((a, b) => (p.sizes?.findIndex((x) => x.name === a) ?? 0) - (p.sizes?.findIndex((x) => x.name === b) ?? 0))
  const [size, setSize] = useState("")
  const [sort, setSort] = useState<"new" | "old">("new")
  const [write, setWrite] = useState(false)
  const list: Review[] = all.filter((r) => !size || r.size === size).sort((a, b) => (sort === "new" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
      <div className="lg:border-r lg:border-border lg:pr-12">
        {p.fit ? (
          <div className="grid gap-6">
            <Scale label="How it fits" ends={["Runs small", "True to size", "Runs large"]} at={p.fit.size} />
            <Scale label="Feels" ends={["Thin", "Just right", "Thick"]} at={p.fit.feel} />
          </div>
        ) : (
          <p className="text-[16px]">{all.length ? `${all.length} reviews from people who bought it.` : "No reviews yet."}</p>
        )}
        <p className="mt-6 text-[14px] text-muted-foreground">From verified buyers</p>
        <button type="button" onClick={() => setWrite(true)} className={cn(OUTLINE, "mt-2 h-10 px-5 text-[15px]")}>
          Write a review
        </button>
      </div>
      <div>
        {all.length ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {sizes.length > 1 ? (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Size">
                  {["", ...sizes].map((s) => (
                    <button key={s || "all"} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className="h-8 cursor-pointer rounded-full border border-[color:var(--input)] px-3.5 text-[14px] hover:border-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">
                      {s || "All sizes"}
                    </button>
                  ))}
                </div>
              ) : null}
              <span className="relative ml-auto">
                <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "old")} aria-label="Sort reviews" className="h-9 cursor-pointer appearance-none rounded-[var(--radius)] border border-[color:var(--input)] bg-card pr-8 pl-3 text-[14px]">
                  <option value="new">Most recent</option>
                  <option value="old">Oldest</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2" aria-hidden="true" />
              </span>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {list.map((r) => (
                <li key={r.name + r.date} className="py-4 first:pt-2">
                  {STORE.showRatings && r.rating ? <Stars n={r.rating} /> : null}
                  <p className="text-[16px] font-semibold">{r.title}</p>
                  <p className="mt-1 text-[15px]">{r.body}</p>
                  <p className="mt-1.5 text-[13px] text-muted-foreground">
                    {r.name} · Verified buyer · {r.variant} · {formatDate(r.date)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="rounded-[var(--dc-radius-card)] border border-dashed border-border p-8 text-center">
            <p className="dc-h text-[20px]">Be the first to review it</p>
            <p className="mt-1 text-[15px] text-muted-foreground">Bought one? Tell the next person what it&apos;s like.</p>
          </div>
        )}
      </div>
      <WriteReview p={p} open={write} onOpenChange={setWrite} />
    </div>
  )
}
