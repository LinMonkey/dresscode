"use client"

// Checkout on one page (contact, delivery, shipping method, payment) beside the order summary, and the
// confirmation page after it. The money is worked out by `totals` in site.ts, the same as the cart.
// Payment is a hook: `placeOrder` below stores the order on this device; replace it with your payment
// provider (a Stripe PaymentIntent, a Shopify checkout, your own API). Card numbers are never stored.
import { Check, ChevronDown, Lock, MessageCircle, Package, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { CodeBox, LineThumb } from "./cart"
import { BRAND, GIFT_CARDS, ORDERS, STATES, STORE } from "./data"
import { StatusSteps } from "./forms"
import { arrives, arrivesBy, formatLong, lineName, linePrice, lineVariant, money, productOf, round2, to, totals, type Line } from "./site"
import { addOrder, cart, nextOrderNumber, setDetails, useCart, useDetails, useOrders, useToday, type CheckoutDetails, type PlacedOrder } from "./store"
import { FIELD, LINK, OUTLINE, PRIMARY } from "./styles"

/** HOOK: take the payment and create the order on your server. The sample keeps it on this device. */
async function placeOrder(order: PlacedOrder): Promise<{ number: number }> {
  await new Promise((r) => setTimeout(r, 900))
  addOrder(order)
  return { number: order.number }
}

const noop = () => () => {}

/* Fields ------------------------------------------------------------------------------------------------------- */

/** A field with its label inside the box, like the design: small grey label over the value. */
function Boxed({ label, id, error, children, className }: { label: string; id: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className={cn("relative rounded-[var(--radius)] border border-[color:var(--input)] bg-card transition-shadow focus-within:border-[color:var(--ring)] focus-within:ring-2 focus-within:ring-[color:var(--ring)]/20", error && "border-[color:var(--dc-danger)]")}>
        <label htmlFor={id} className="pointer-events-none absolute top-2 left-3 text-[12px] text-muted-foreground">
          {label}
        </label>
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-[color:var(--dc-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const BOXED_INPUT = "h-[52px] w-full rounded-[var(--radius)] bg-transparent px-3 pt-5 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70"

function Text({ label, id, value, onChange, error, className, ...rest }: { label: string; id: string; value: string; onChange: (v: string) => void; error?: string; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <Boxed label={label} id={id} error={error} className={className}>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={BOXED_INPUT} {...rest} />
    </Boxed>
  )
}

function Heading({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="dc-h text-[22px]">{children}</h2>
      {right}
    </div>
  )
}

/* Validation ---------------------------------------------------------------------------------------------- */

const luhn = (digits: string) => {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2) d = d * 2 > 9 ? d * 2 - 9 : d * 2
    sum += d
  }
  return sum % 10 === 0
}

type Card = { number: string; expiry: string; cvc: string; name: string }
type Pay = "card" | "later" | "gift"

function validate(d: CheckoutDetails, pay: Pay, card: Card, due: number, today: string) {
  const e: Record<string, string> = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Enter an email address like name@example.com."
  if (!d.first.trim()) e.first = "Enter a first name."
  if (!d.last.trim()) e.last = "Enter a last name."
  if (!d.line1.trim()) e.line1 = "Enter a street address."
  if (!d.city.trim()) e.city = "Enter a city."
  if (!d.state) e.state = "Choose a state."
  if (!/^\d{5}(-\d{4})?$/.test(d.zip.trim())) e.zip = "Enter a 5-digit ZIP code."
  if (pay === "card" && due > 0) {
    const digits = card.number.replace(/\D/g, "")
    if (digits.length < 13 || digits.length > 19 || !luhn(digits)) e.number = "Check the card number."
    const [mm, yy] = card.expiry.split("/").map((s) => Number(s.trim()))
    const [ty, tm] = [Number(today.slice(2, 4)), Number(today.slice(5, 7))]
    if (!mm || mm > 12 || yy === undefined || Number.isNaN(yy) || yy < ty || (yy === ty && mm < tm)) e.expiry = "Check the expiry date."
    if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "3 or 4 digits."
    if (!card.name.trim()) e.cardName = "Enter the name on the card."
  }
  if (pay === "gift" && due > 0) e.gift = `The gift card doesn't cover the order. Pay the other ${money(due, true)} by card.`
  return e
}

/* The summary ---------------------------------------------------------------------------------------------- */

function Summary({ lines, t, code, state, gift, onGift, className }: { lines: Line[]; t: ReturnType<typeof totals>; code: string; state: string; gift?: string; onGift?: () => void; className?: string }) {
  return (
    <div className={className}>
      <ul className="grid gap-4">
        {lines.map((l) => (
          <li key={l.id} className="flex items-center gap-4">
            <span className="relative">
              <LineThumb line={l} className="size-[68px] border border-border" />
              <span className="dc-num absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-muted-foreground text-[12px] font-semibold text-background">{l.qty}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-snug font-medium">{lineName(l)}</span>
              {lineVariant(l) ? <span className="block text-[14px] text-muted-foreground">{lineVariant(l)}</span> : null}
            </span>
            <span className="dc-num text-[15px] font-medium">{money(linePrice(l) * l.qty, true)}</span>
          </li>
        ))}
      </ul>
      <CodeBox className="mt-6 border-t border-border pt-6" />
      <dl className="mt-6 grid gap-2.5 border-t border-border pt-6 text-[15px]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="dc-num">{money(t.subtotal, true)}</dd>
        </div>
        {t.discount ? (
          <div className="flex justify-between">
            <dt>Discount ({code})</dt>
            <dd className="dc-num">−{money(t.discount, true)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="dc-num">{t.shipping ? money(t.shipping, true) : "Free"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Estimated tax</dt>
          <dd className="dc-num">{state ? money(t.tax, true) : <span className="text-muted-foreground">Enter your address</span>}</dd>
        </div>
        {t.giftCard ? (
          <div className="flex justify-between">
            <dt className="flex items-center gap-2">
              Gift card {gift}
              {onGift ? (
                <button type="button" onClick={onGift} className="cursor-pointer text-[13px] text-muted-foreground underline underline-offset-4">
                  Remove
                </button>
              ) : null}
            </dt>
            <dd className="dc-num">−{money(t.giftCard, true)}</dd>
          </div>
        ) : null}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-5">
          <dt className="text-[18px] font-semibold">Total</dt>
          <dd className="flex items-baseline gap-2">
            <span className="text-[13px] text-muted-foreground">USD</span>
            <span className="dc-num text-[28px] font-semibold tracking-tight">{money(t.total, true)}</span>
          </dd>
        </div>
      </dl>
      <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-[15px] text-muted-foreground">
        <li className="flex items-center gap-3">
          <Package className="size-5" aria-hidden="true" /> Free returns within {STORE.returnDays} days
        </li>
        <li className="flex items-center gap-3">
          <MessageCircle className="size-5" aria-hidden="true" /> Questions? Chat with us, {BRAND.hours}
        </li>
      </ul>
    </div>
  )
}

/* Checkout ---------------------------------------------------------------------------------------------------- */

export function CheckoutHeader({ base }: { base: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <Link href={to(base)} className="dc-h text-[28px] leading-none">
          {BRAND.name}
        </Link>
        <span className="ml-auto flex items-center gap-2 text-[15px] text-muted-foreground">
          <Lock className="size-4" aria-hidden="true" /> <span className="max-sm:sr-only">Secure checkout</span>
        </span>
        <span className="h-5 w-px bg-border" aria-hidden="true" />
        <Link href={to(base, "cart")} className="text-[15px] underline underline-offset-4 hover:no-underline">
          Back to cart
        </Link>
      </div>
    </header>
  )
}

export function CheckoutView({ base }: { base: string }) {
  const router = useRouter()
  const today = useToday()
  const state = useCart()
  const d = useDetails()
  const [pay, setPay] = useState<Pay>("card")
  const [card, setCard] = useState<Card>({ number: "", expiry: "", cvc: "", name: "" })
  const [billingSame, setBillingSame] = useState(true)
  const [giftDraft, setGiftDraft] = useState("")
  const [gift, setGift] = useState<string>("")
  const [giftError, setGiftError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const hydrated = useSyncExternalStore(noop, () => true, () => false)

  const giftBalance = gift ? (GIFT_CARDS[gift] ?? 0) : 0
  const t = totals(state.lines, { code: state.code, shipping: d.shipping, state: d.state, giftCard: giftBalance })
  const set = (patch: Partial<CheckoutDetails>) => {
    setDetails(patch)
    if (Object.keys(errors).length) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !(k in patch))))
  }

  if (hydrated && !state.lines.length)
    return (
      <div className="mx-auto flex max-w-[520px] flex-col items-center px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-muted">
          <ShoppingBag className="size-6" aria-hidden="true" />
        </span>
        <h1 className="dc-h mt-4 text-[28px]">Your cart is empty</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">Add something first, then come back here to check out.</p>
        <Link href={to(base, "shop")} className={cn(PRIMARY, "mt-6 h-11 px-6 text-[15px]")}>
          Shop all
        </Link>
      </div>
    )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(d, pay, card, t.total, today)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      const el = formRef.current?.querySelector<HTMLElement>(`#ec-co-${first}`)
      el?.focus()
      return
    }
    setBusy(true)
    const number = nextOrderNumber()
    const shippingLabel = d.shipping === "express" ? `Express · Arrives ${arrivesBy(today, STORE.expressDays)}` : `Standard · Arrives ${arrives(today, STORE.standardDays)}`
    const digits = card.number.replace(/\D/g, "")
    const order: PlacedOrder = {
      number,
      date: today,
      status: "Confirmed",
      lines: state.lines.map((l) => ({ slug: l.slug, color: l.color, size: l.size, qty: l.qty, price: linePrice(l) })),
      discount: t.discount,
      shipping: t.shipping,
      tax: t.tax,
      delivery: shippingLabel,
      payment: t.total === 0 ? `Gift card ${gift}` : pay === "later" ? `Pay later, ${STORE.installments} payments` : `Card ending ${digits.slice(-4)}`,
      email: d.email.trim(),
      address: { line1: d.line1, line2: d.line2, city: d.city, state: d.state, zip: d.zip, country: d.country },
      name: `${d.first} ${d.last}`.trim(),
      subtotal: t.subtotal,
      total: t.total,
      giftCard: t.giftCard,
      shippingMethod: d.shipping,
      note: state.giftNote ? state.note : undefined,
    }
    await placeOrder(order)
    cart.clear()
    router.push(`${to(base, "checkout", "confirmation")}?order=${number}`)
  }

  const later = STORE.installments ? round2(t.total / STORE.installments) : 0
  const err = (k: string) => errors[k]

  return (
    <div className="overflow-x-clip">
    <div className="mx-auto grid w-full max-w-[1240px] lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
      {/* Phones: the summary folds away at the top. */}
      <div className="border-b border-border bg-muted/60 lg:hidden">
        <button type="button" onClick={() => setSummaryOpen(!summaryOpen)} aria-expanded={summaryOpen} className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-[15px] sm:px-6">
          <span className="flex items-center gap-2 font-medium text-[color:var(--dc-accent)]">
            {summaryOpen ? "Hide" : "Show"} order summary <ChevronDown className={cn("size-4 transition-transform", summaryOpen && "rotate-180")} aria-hidden="true" />
          </span>
          <span className="dc-num text-[17px] font-semibold">{money(t.total, true)}</span>
        </button>
        {summaryOpen ? <Summary lines={state.lines} t={t} code={state.code} state={d.state} gift={gift} onGift={() => setGift("")} className="px-4 pb-6 sm:px-6" /> : null}
      </div>

      <form ref={formRef} onSubmit={submit} noValidate className="grid gap-9 px-4 py-8 sm:px-6 lg:border-r lg:border-border lg:py-10 lg:pr-12">
        {Object.keys(errors).length ? (
          <p className="rounded-[var(--radius)] border border-[color:var(--dc-danger)] bg-[color:var(--dc-danger)]/5 px-4 py-3 text-[14px] text-[color:var(--dc-danger)]" role="alert">
            Check the {Object.keys(errors).length === 1 ? "highlighted field" : `${Object.keys(errors).length} highlighted fields`} below.
          </p>
        ) : null}

        <section aria-labelledby="ec-co-contact">
          <Heading
            right={
              <Link href={to(base, "account", "sign-in")} className="text-[15px] underline underline-offset-4 hover:no-underline">
                Sign in
              </Link>
            }
          >
            <span id="ec-co-contact">Contact</span>
          </Heading>
          <Text label="Email" id="ec-co-email" type="email" autoComplete="email" value={d.email} onChange={(email) => set({ email })} error={err("email")} />
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-[15px]">
            <input type="checkbox" checked={d.news} onChange={(e) => set({ news: e.target.checked })} className="size-5 accent-[color:var(--dc-primary)]" />
            Email me about new products and restocks
          </label>
        </section>

        <section aria-labelledby="ec-co-delivery" className="grid gap-3">
          <Heading>
            <span id="ec-co-delivery">Delivery</span>
          </Heading>
          <Boxed label="Country / Region" id="ec-co-country">
            <select id="ec-co-country" value={d.country} onChange={(e) => set({ country: e.target.value })} className={cn(BOXED_INPUT, "cursor-pointer appearance-none")}>
              <option>United States</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden="true" />
          </Boxed>
          <div className="grid gap-3 sm:grid-cols-2">
            <Text label="First name" id="ec-co-first" autoComplete="given-name" value={d.first} onChange={(first) => set({ first })} error={err("first")} />
            <Text label="Last name" id="ec-co-last" autoComplete="family-name" value={d.last} onChange={(last) => set({ last })} error={err("last")} />
          </div>
          <Text label="Address" id="ec-co-line1" autoComplete="address-line1" value={d.line1} onChange={(line1) => set({ line1 })} error={err("line1")} />
          <Text label="Apartment, suite, etc. (optional)" id="ec-co-line2" autoComplete="address-line2" value={d.line2} onChange={(line2) => set({ line2 })} />
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr]">
            <Text label="City" id="ec-co-city" autoComplete="address-level2" value={d.city} onChange={(city) => set({ city })} error={err("city")} />
            <Boxed label="State" id="ec-co-state" error={err("state")}>
              <select id="ec-co-state" value={d.state} onChange={(e) => set({ state: e.target.value })} autoComplete="address-level1" aria-invalid={!!err("state")} className={cn(BOXED_INPUT, "cursor-pointer appearance-none pr-8")}>
                <option value="">Choose…</option>
                {STATES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden="true" />
            </Boxed>
            <Text label="ZIP code" id="ec-co-zip" inputMode="numeric" autoComplete="postal-code" value={d.zip} onChange={(zip) => set({ zip })} error={err("zip")} />
          </div>
          <Text label="Phone (optional)" id="ec-co-phone" type="tel" autoComplete="tel" value={d.phone} onChange={(phone) => set({ phone })} />
        </section>

        <section aria-labelledby="ec-co-ship">
          <Heading>
            <span id="ec-co-ship">Shipping method</span>
          </Heading>
          <div className="grid gap-2" role="radiogroup" aria-labelledby="ec-co-ship">
            {(
              [
                ["standard", `Standard · ${STORE.standardDays[0]}–${STORE.standardDays[1]} business days`, `Arrives ${arrives(today, STORE.standardDays)}`, t.toFree > 0 ? money(STORE.standardShipping, true) : "Free"],
                ["express", `Express · ${STORE.expressDays[0]}–${STORE.expressDays[1]} business days`, `Arrives ${arrivesBy(today, STORE.expressDays)}`, money(STORE.expressShipping, true)],
              ] as const
            ).map(([id, label, when, price]) => (
              <label key={id} className={cn("flex cursor-pointer items-center gap-3 rounded-[var(--radius)] border px-4 py-3.5 text-[15px] transition-colors", d.shipping === id ? "border-foreground shadow-[inset_0_0_0_1px_var(--foreground)]" : "border-[color:var(--input)] hover:border-foreground/50")}>
                <input type="radio" name="shipping" value={id} checked={d.shipping === id} onChange={() => set({ shipping: id })} className="size-[18px] accent-[color:var(--dc-primary)]" />
                <span className="flex-1">
                  {label} <span className="text-muted-foreground">· {when}</span>
                </span>
                <span className="dc-num font-medium">{price}</span>
              </label>
            ))}
          </div>
        </section>

        <section aria-labelledby="ec-co-pay">
          <Heading>
            <span id="ec-co-pay">Payment</span>
          </Heading>
          <div className="grid grid-cols-3 rounded-[var(--radius)] border border-[color:var(--input)] p-1" role="tablist" aria-label="Payment method">
            {(
              [
                ["card", "Card"],
                ["later", "Pay later"],
                ["gift", "Gift card"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={pay === id} onClick={() => setPay(id)} className="h-10 cursor-pointer rounded-[calc(var(--radius)-3px)] text-[15px] font-medium aria-selected:bg-primary aria-selected:text-primary-foreground">
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-[var(--radius)] border border-[color:var(--input)] p-3" role="tabpanel">
            {pay === "card" ? (
              <div className="grid gap-3">
                <Text
                  label="Card number"
                  id="ec-co-number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={card.number}
                  onChange={(v) => setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ") })}
                  error={err("number")}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Text
                    label="Expiry"
                    id="ec-co-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={card.expiry}
                    onChange={(v) => {
                      const x = v.replace(/\D/g, "").slice(0, 4)
                      setCard({ ...card, expiry: x.length > 2 ? `${x.slice(0, 2)} / ${x.slice(2)}` : x })
                    }}
                    error={err("expiry")}
                  />
                  <Text label="CVC" id="ec-co-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={(v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })} error={err("cvc")} />
                </div>
                <Text label="Name on card" id="ec-co-cardName" autoComplete="cc-name" value={card.name} onChange={(name) => setCard({ ...card, name })} error={err("cardName")} />
                <label className="mt-1 flex cursor-pointer items-center gap-3 text-[15px]">
                  <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="size-5 accent-[color:var(--dc-primary)]" />
                  Billing address same as delivery
                </label>
                {!billingSame ? (
                  <div className="grid gap-3 rounded-[var(--radius)] bg-muted p-3">
                    <Text label="Billing address" id="ec-co-bill1" autoComplete="billing address-line1" value="" onChange={() => {}} readOnly placeholder="Your payment provider collects this" />
                    <p className="text-[13px] text-muted-foreground">Your payment form collects the billing address when it differs.</p>
                  </div>
                ) : null}
              </div>
            ) : pay === "later" ? (
              <div className="p-2 text-[15px]">
                <p className="font-medium">
                  {STORE.installments} interest-free payments of <span className="dc-num">{money(later, true)}</span>
                </p>
                <p className="mt-1 text-muted-foreground">The first is due today. You&apos;ll finish with our pay-later partner after you place the order. No fees if you pay on time.</p>
              </div>
            ) : (
              <div className="grid gap-2 p-1">
                <div className="flex gap-2">
                  <input value={giftDraft} onChange={(e) => setGiftDraft(e.target.value.toUpperCase())} placeholder="Gift card code" aria-label="Gift card code" aria-invalid={!!giftError} className={cn(FIELD, "dc-num")} />
                  <button
                    type="button"
                    onClick={() => {
                      const c = giftDraft.trim()
                      if (GIFT_CARDS[c]) {
                        setGift(c)
                        setGiftError("")
                        setGiftDraft("")
                      } else setGiftError("We couldn't find that gift card.")
                    }}
                    className={cn(OUTLINE, "h-11 bg-card px-4 text-[15px]")}
                  >
                    Apply
                  </button>
                </div>
                {giftError ? <p className="text-[13px] text-[color:var(--dc-danger)]">{giftError}</p> : null}
                {gift ? (
                  <p className="text-[14px]">
                    <Check className="mr-1 inline size-4" aria-hidden="true" />
                    {gift}: {money(giftBalance, true)} applied. {t.total > 0 ? <>Pay the other {money(t.total, true)} by card.</> : "It covers the whole order."}
                  </p>
                ) : (
                  <p className="text-[13px] text-muted-foreground">Try {Object.keys(GIFT_CARDS)[0]}.</p>
                )}
                {err("gift") ? <p className="text-[13px] text-[color:var(--dc-danger)]">{err("gift")}</p> : null}
              </div>
            )}
          </div>
        </section>

        <div>
          <button type="submit" disabled={busy} className={cn(PRIMARY, "h-14 w-full text-[18px]")}>
            {busy ? "Placing your order…" : pay === "later" && t.total > 0 ? <>Continue to pay later · {money(t.total, true)}</> : <>Pay {money(t.total, true)}</>}
          </button>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            By placing your order you agree to our{" "}
            <Link href={to(base, "help")} className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href={to(base, "help")} className="underline underline-offset-2">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </form>

      <aside aria-label="Order summary" className="relative hidden bg-muted/60 px-8 py-10 before:absolute before:inset-y-0 before:left-full before:w-[50vw] before:bg-inherit lg:block">
        <div className="sticky top-8">
          <h2 className="dc-h mb-6 text-[24px]">Order summary</h2>
          <Summary lines={state.lines} t={t} code={state.code} state={d.state} gift={gift} onGift={() => setGift("")} />
        </div>
      </aside>
    </div>
    </div>
  )
}

/* Confirmation ---------------------------------------------------------------------------------------------- */

export function ConfirmationView({ base }: { base: string }) {
  const orders = useOrders()
  const search = useSyncExternalStore(noop, () => window.location.search, () => "")
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const wanted = Number(new URLSearchParams(search).get("order"))
  const o = orders.find((x) => x.number === wanted) ?? orders[0]
  // Block body: newer browsers return a promise from scrollTo, and an effect may only return a cleanup.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  if (!hydrated) return <div className="min-h-[60vh]" />
  if (!o)
    return (
      <div className="mx-auto max-w-[560px] px-6 py-20 text-center">
        <h1 className="dc-h text-[30px]">No recent order on this device</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">Orders you place here show up on this page. Past orders are in your account.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={to(base, "account")} className={cn(OUTLINE, "h-11 px-5 text-[15px]")}>
            Your account
          </Link>
          <Link href={to(base, "shop")} className={cn(PRIMARY, "h-11 px-5 text-[15px]")}>
            Shop all
          </Link>
        </div>
      </div>
    )
  return <OrderDetail base={base} o={o} placed />
}

/** An order's page: used by the confirmation and by the account's order pages. */
export function OrderDetail({ base, o, placed }: { base: string; o: PlacedOrder | (typeof ORDERS)[number]; placed?: boolean }) {
  const subtotal = "subtotal" in o ? o.subtotal : round2(o.lines.reduce((n, l) => n + l.price * l.qty, 0))
  const total = "total" in o ? o.total : round2(subtotal - o.discount + o.shipping + o.tax)
  const giftCard = "giftCard" in o ? o.giftCard : 0
  const first = o.name.split(" ")[0]
  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-10 sm:px-6">
      {placed ? (
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] text-muted-foreground">Order #{o.number}</p>
            <h1 className="dc-h text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight">Thank you, {first}!</h1>
            <p className="mt-1 text-[16px] text-muted-foreground">
              We&apos;ve emailed a receipt to {o.email}. You&apos;ll get a tracking link when it ships.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <Link href={to(base, "account")} className={cn(LINK, "text-[14px]")}>
            ← Your account
          </Link>
          <h1 className="dc-h mt-3 text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight">Order #{o.number}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Placed {formatLong(o.date)}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="grid gap-6">
          <section className="dc-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[17px] font-semibold">{o.status === "Delivered" ? "Delivered" : o.status === "Shipped" ? "On its way" : "Confirmed"}</h2>
              <span className="text-[14px] text-muted-foreground">{o.delivery}</span>
            </div>
            <StatusSteps status={o.status} className="mt-5" />
            {o.tracking ? (
              <p className="mt-5 text-[14px] text-muted-foreground">
                Tracking number <span className="dc-num text-foreground">{o.tracking}</span>
              </p>
            ) : (
              <p className="mt-5 text-[14px] text-muted-foreground">Orders placed before 1 PM Pacific ship the same day.</p>
            )}
          </section>
          <section className="dc-card p-6">
            <h2 className="text-[17px] font-semibold">Items</h2>
            <ul className="mt-4 divide-y divide-border">
              {o.lines.map((l, i) => {
                const line = { id: String(i), ...l } as Line
                const p = productOf(l.slug)
                return (
                  <li key={i} className="flex items-center gap-4 py-3">
                    <LineThumb line={line} className="size-16 border border-border" />
                    <span className="min-w-0 flex-1">
                      {p ? (
                        <Link href={to(base, "products", p.slug)} className="block text-[15px] font-medium hover:underline">
                          {lineName(line)}
                        </Link>
                      ) : (
                        <span className="block text-[15px] font-medium">{lineName(line)}</span>
                      )}
                      <span className="block text-[14px] text-muted-foreground">
                        {[lineVariant(line), l.qty > 1 ? `Qty ${l.qty}` : ""].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="dc-num text-[15px]">{money(l.price * l.qty, true)}</span>
                  </li>
                )
              })}
            </ul>
            <dl className="mt-3 grid gap-2 border-t border-border pt-4 text-[15px]">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="dc-num">{money(subtotal, true)}</dd>
              </div>
              {o.discount ? (
                <div className="flex justify-between">
                  <dt>Discount</dt>
                  <dd className="dc-num">−{money(o.discount, true)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="dc-num">{o.shipping ? money(o.shipping, true) : "Free"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd className="dc-num">{money(o.tax, true)}</dd>
              </div>
              {giftCard ? (
                <div className="flex justify-between">
                  <dt>Gift card</dt>
                  <dd className="dc-num">−{money(giftCard, true)}</dd>
                </div>
              ) : null}
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-[17px] font-semibold">
                <dt>Total</dt>
                <dd className="dc-num">{money(total, true)}</dd>
              </div>
            </dl>
          </section>
        </div>
        <div className="grid gap-6">
          <section className="dc-card grid gap-5 p-6 text-[15px]">
            <div>
              <h2 className="text-[14px] font-semibold text-muted-foreground">Delivery to</h2>
              <p className="mt-1">
                {o.name}
                <br />
                {o.address.line1}
                {o.address.line2 ? `, ${o.address.line2}` : ""}
                <br />
                {o.address.city}, {o.address.state} {o.address.zip}
              </p>
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-muted-foreground">Shipping</h2>
              <p className="mt-1">{o.delivery}</p>
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-muted-foreground">Payment</h2>
              <p className="mt-1">{o.payment}</p>
            </div>
            {"note" in o && o.note ? (
              <div>
                <h2 className="text-[14px] font-semibold text-muted-foreground">Gift note</h2>
                <p className="mt-1">&ldquo;{o.note}&rdquo;</p>
              </div>
            ) : null}
          </section>
          <section className="dc-card p-6 text-[15px]">
            <h2 className="text-[17px] font-semibold">Need something?</h2>
            <p className="mt-1 text-muted-foreground">Changes are possible within an hour of ordering. Returns are free for {STORE.returnDays} days.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={to(base, "contact")} className={cn(OUTLINE, "h-10 px-4 text-[14px]")}>
                Contact us
              </Link>
              {o.status === "Delivered" ? (
                <Link href={to(base, "help") + "#returns"} className={cn(OUTLINE, "h-10 px-4 text-[14px]")}>
                  Start a return
                </Link>
              ) : null}
              {placed ? (
                <Link href={to(base, "shop")} className={cn(PRIMARY, "h-10 px-4 text-[14px]")}>
                  Continue shopping
                </Link>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
