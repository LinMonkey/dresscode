"use client"

// The cart: the drawer that slides in from the right whenever something is added, and the full cart
// page. Both read the same store (store.ts) and the same totals (site.ts).
import { ArrowRight, Gift, Lock, ShoppingBag, Truck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { Photo } from "./cards"
import { DISCOUNTS, STORE, type Product } from "./data"
import { bestSelling, firstAvailable, isGiftCard, lineCover, lineName, linePrice, lineVariant, money, productOf, stockOf, to, totals, type Line } from "./site"
import { cart, drawer, useCart, useDrawer } from "./store"
import { FIELD, LINK, OUTLINE, PRIMARY } from "./styles"
import { Stepper } from "./ui"

/** "Your order ships free." or "You're $12.00 away from free shipping.", with a bar from $0 to $75. */
export function FreeShipping({ toFree, className }: { toFree: number; className?: string }) {
  const done = toFree <= 0
  const pct = Math.max(4, Math.min(100, ((STORE.freeShippingOver - toFree) / STORE.freeShippingOver) * 100))
  return (
    <div className={className}>
      <p className="text-[15px] font-medium">{done ? "Your order ships free." : <>You&apos;re {money(toFree, true)} away from free shipping.</>}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={STORE.freeShippingOver} aria-valuenow={STORE.freeShippingOver - toFree} aria-label="Toward free shipping">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${done ? 100 : pct}%` }} />
      </div>
      <div className="dc-num mt-1.5 flex justify-between text-[13px] text-muted-foreground">
        <span>$0</span>
        <span>{money(STORE.freeShippingOver)}</span>
      </div>
    </div>
  )
}

function GiftCardThumb({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-full place-items-center bg-primary text-primary-foreground", className)}>
      <Gift className="size-6" aria-hidden="true" />
    </span>
  )
}

export function LineThumb({ line, className }: { line: Line; className?: string }) {
  return <span className={cn("block shrink-0 overflow-hidden rounded-[calc(var(--dc-radius-card)-4px)]", className)}>{isGiftCard(line) ? <GiftCardThumb /> : <Photo src={lineCover(line)} alt="" />}</span>
}

/** One line of the cart: photo, name, variant, quantity, remove, price. */
export function CartLine({ base, line, onNavigate, highlight }: { base: string; line: Line; onNavigate?: () => void; highlight?: boolean }) {
  const name = lineName(line)
  const href = isGiftCard(line) ? to(base, "gift-cards") : to(base, "products", line.slug)
  return (
    <li className={cn("flex gap-4 py-5 transition-colors", highlight && "ec-flash")}>
      <Link href={href} onClick={onNavigate} className="size-[84px]" tabIndex={-1} aria-hidden="true">
        <LineThumb line={line} className="size-[84px]" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} onClick={onNavigate} className="text-[16px] leading-snug font-semibold hover:underline">
            {name}
          </Link>
          <span className="dc-num shrink-0 text-[16px] font-semibold">{money(linePrice(line) * line.qty, true)}</span>
        </div>
        {lineVariant(line) ? <p className="mt-1 text-[14px] text-muted-foreground">{lineVariant(line)}</p> : null}
        <div className="mt-3 flex items-center gap-4">
          <Stepper value={line.qty} onChange={(n) => cart.setQty(line.id, n)} label={name} size="sm" />
          <button type="button" onClick={() => cart.remove(line.id)} className="cursor-pointer text-[14px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

/** Something that goes with what's in the cart and isn't in it yet: a small add-on that needs no size
 *  first (one click adds it), then anything that pairs, then a best seller. */
function upsellFor(lines: Line[]): Product | undefined {
  const inCart = new Set(lines.map((l) => l.slug))
  const pairs = lines.flatMap((l) => productOf(l.slug)?.pairs ?? []).map(productOf).filter((x): x is Product => !!x && !inCart.has(x.slug))
  return pairs.find((x) => !x.sizes?.length && x.price <= 60) ?? pairs[0] ?? bestSelling().find((p) => !inCart.has(p.slug))
}

function Upsell({ base, p, onNavigate }: { base: string; p: Product; onNavigate?: () => void }) {
  const first = firstAvailable(p)
  const color = first.color
  // Clothes start at M when there is one; everything else at its first size in stock.
  const size = p.sizes?.some((s) => s.name === "M") && stockOf(p, color, "M") > 0 ? "M" : first.size
  return (
    <div className="rounded-[var(--dc-radius-card)] bg-muted p-4">
      <p className="text-[15px] font-semibold">Pairs well with</p>
      <div className="mt-3 flex items-center gap-3">
        <Link href={to(base, "products", p.slug)} onClick={onNavigate} className="size-16 shrink-0 overflow-hidden rounded-[calc(var(--radius))]" tabIndex={-1} aria-hidden="true">
          <Photo src={p.photos[0]} alt="" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={to(base, "products", p.slug)} onClick={onNavigate} className="block truncate text-[15px] font-medium hover:underline">
            {p.name}
          </Link>
          <p className="text-[13px] text-muted-foreground">{[color, size].filter(Boolean).join(" / ")}</p>
          <p className="dc-num text-[14px] font-semibold">{money(linePrice({ slug: p.slug, size }), true)}</p>
        </div>
        <button type="button" onClick={() => cart.add({ slug: p.slug, color, size }, { open: false })} className={cn(OUTLINE, "h-9 bg-card px-3 text-[14px]")}>
          + Add
        </button>
      </div>
    </div>
  )
}

function GiftNote() {
  const { giftNote, note } = useCart()
  return (
    <div>
      <label className="flex cursor-pointer items-center gap-3 text-[15px]">
        <input type="checkbox" checked={giftNote} onChange={(e) => cart.setGiftNote(e.target.checked)} className="size-5 accent-[color:var(--dc-primary)]" />
        Add a gift note
      </label>
      {giftNote ? (
        <textarea
          value={note}
          onChange={(e) => cart.setGiftNote(true, e.target.value)}
          maxLength={240}
          rows={3}
          placeholder="Happy birthday! Love, Sam"
          aria-label="Gift note"
          className={cn(FIELD, "mt-2 h-auto py-2")}
        />
      ) : null}
      {giftNote ? <p className="mt-1 text-[13px] text-muted-foreground">We&apos;ll print it on a card and leave out the receipt.</p> : null}
    </div>
  )
}

function EmptyCart({ base, onNavigate }: { base: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted">
        <ShoppingBag className="size-6" aria-hidden="true" />
      </span>
      <p className="dc-h mt-4 text-[22px]">Your cart is empty</p>
      <p className="mt-1 max-w-[26em] text-[15px] text-muted-foreground">Free shipping on orders over {money(STORE.freeShippingOver)}, and free returns for {STORE.returnDays} days.</p>
      <Link href={to(base, "shop")} onClick={onNavigate} className={cn(PRIMARY, "mt-6 h-11 px-5 text-[15px]")}>
        Shop best sellers
      </Link>
    </div>
  )
}

/** The drawer. Mounted once per page by the frame; `drawer.open()` slides it in. */
export function CartDrawer({ base }: { base: string }) {
  const { open, added } = useDrawer()
  const state = useCart()
  const t = totals(state.lines, { code: state.code })
  const upsell = state.lines.length ? upsellFor(state.lines) : undefined
  const close = () => drawer.close()
  return (
    <Sheet open={open} onOpenChange={(o) => (o ? drawer.open() : drawer.close())}>
      <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-[460px]" showCloseButton={false}>
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <SheetTitle className="dc-h text-[26px] leading-none">Your cart</SheetTitle>
          {t.count ? <span className="dc-num grid h-7 min-w-7 place-items-center rounded-full bg-muted px-2 text-[14px] font-semibold">{t.count}</span> : null}
          <button type="button" onClick={close} className="ml-auto grid size-9 cursor-pointer place-items-center rounded-full hover:bg-muted" aria-label="Close cart">
            <span aria-hidden="true" className="text-[22px] leading-none">
              ×
            </span>
          </button>
        </div>
        {!state.lines.length ? (
          <EmptyCart base={base} onNavigate={close} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <FreeShipping toFree={t.toFree} className="border-b border-border pb-4" />
              <ul className="divide-y divide-border">
                {state.lines.map((l) => (
                  <CartLine key={l.id} base={base} line={l} onNavigate={close} highlight={l.id === added} />
                ))}
              </ul>
              <div className="grid gap-5 pb-6">
                {upsell ? <Upsell base={base} p={upsell} onNavigate={close} /> : null}
                <GiftNote />
              </div>
            </div>
            <div className="border-t border-border px-6 pt-4 pb-5">
              <div className="flex items-baseline justify-between text-[18px] font-semibold">
                <span>Subtotal</span>
                <span className="dc-num">{money(t.subtotal, true)}</span>
              </div>
              {t.discount ? (
                <p className="mt-1 flex justify-between text-[14px] text-muted-foreground">
                  <span>{state.code.toUpperCase()} applied at checkout</span>
                  <span className="dc-num">−{money(t.discount, true)}</span>
                </p>
              ) : null}
              <p className="mt-1 text-[14px] text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Link href={to(base, "checkout")} onClick={close} className={cn(PRIMARY, "mt-4 h-[52px] w-full text-[17px]")}>
                Checkout · <span className="dc-num">{money(t.subtotal, true)}</span>
              </Link>
              <Link href={to(base, "cart")} onClick={close} className="mt-3 block text-center text-[14px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
                View cart
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/** The code box: apply a discount code, or remove the one that's on. */
export function CodeBox({ className }: { className?: string }) {
  const { code } = useCart()
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")
  const apply = () => {
    const c = draft.trim().toUpperCase()
    if (!c) return
    if (DISCOUNTS[c]) {
      cart.setCode(c)
      setDraft("")
      setError("")
    } else setError("That code isn't valid. Check for typos, or try another.")
  }
  return (
    <div className={className}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Discount code or gift card" aria-label="Discount code" aria-invalid={!!error} aria-describedby={error ? "ec-code-error" : undefined} className={cn(FIELD, "uppercase placeholder:normal-case")} />
        <button type="submit" className={cn(OUTLINE, "h-11 bg-card px-4 text-[15px]")}>
          Apply
        </button>
      </form>
      {error ? (
        <p id="ec-code-error" className="mt-1.5 text-[13px] text-[color:var(--dc-danger)]">
          {error}
        </p>
      ) : null}
      {code && DISCOUNTS[code] ? (
        <p className="mt-2.5 flex items-center gap-2 text-[14px]">
          <span className="inline-flex h-8 items-center gap-2 rounded-[var(--radius)] bg-muted pr-1.5 pl-3 font-medium">
            {code}
            <button type="button" onClick={() => cart.setCode("")} className="grid size-5 cursor-pointer place-items-center rounded-full hover:bg-foreground/10" aria-label={`Remove ${code}`}>
              ×
            </button>
          </span>
          <span className="text-muted-foreground">{DISCOUNTS[code].label}</span>
        </p>
      ) : null}
    </div>
  )
}

/** The cart page: the lines on the left, the summary on the right. */
export function CartPageView({ base }: { base: string }) {
  const state = useCart()
  const t = totals(state.lines, { code: state.code })
  const upsell = state.lines.length ? upsellFor(state.lines) : undefined
  // The drawer is for other pages; here it stays shut.
  useEffect(() => {
    drawer.close()
  }, [])
  if (!state.lines.length)
    return (
      <div className="dc-card mx-auto flex max-w-[640px] flex-col">
        <EmptyCart base={base} />
      </div>
    )
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div>
        <FreeShipping toFree={t.toFree} className="max-w-[520px]" />
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {state.lines.map((l) => (
            <CartLine key={l.id} base={base} line={l} />
          ))}
        </ul>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {upsell ? <Upsell base={base} p={upsell} /> : null}
          <GiftNote />
        </div>
      </div>
      <aside className="dc-card p-6 lg:sticky lg:top-6">
        <h2 className="dc-h text-[22px]">Order summary</h2>
        <CodeBox className="mt-4" />
        <dl className="mt-5 grid gap-2.5 text-[15px]">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="dc-num">{money(t.subtotal, true)}</dd>
          </div>
          {t.discount ? (
            <div className="flex justify-between">
              <dt>Discount ({state.code})</dt>
              <dd className="dc-num">−{money(t.discount, true)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="dc-num">{t.shipping ? money(t.shipping, true) : "Free"}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Estimated tax</dt>
            <dd>At checkout</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4 text-[18px] font-semibold">
            <dt>Total</dt>
            <dd className="dc-num">{money(t.subtotal - t.discount + t.shipping, true)}</dd>
          </div>
        </dl>
        <Link href={to(base, "checkout")} className={cn(PRIMARY, "mt-5 h-12 w-full text-[16px]")}>
          <Lock className="size-4" aria-hidden="true" /> Checkout
        </Link>
        <ul className="mt-5 grid gap-2 text-[14px] text-muted-foreground">
          <li className="flex items-center gap-2">
            <Truck className="size-4" aria-hidden="true" /> Free shipping over {money(STORE.freeShippingOver)}
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="size-4" aria-hidden="true" /> Free returns within {STORE.returnDays} days
          </li>
        </ul>
        <Link href={to(base, "shop")} className={cn(LINK, "mt-5 inline-block text-[14px]")}>
          Continue shopping
        </Link>
      </aside>
    </div>
  )
}
