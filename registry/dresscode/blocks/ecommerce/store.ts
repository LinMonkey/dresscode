"use client"

// What the store remembers on this device: the cart (with its code and gift note), saved things,
// recently viewed, placed orders and the checkout's contact and delivery details. Each is a small
// store over localStorage that every component on the page shares; on the server they are empty, so
// the first paint matches. Card numbers are never stored.
// To keep the cart on your server instead, replace `cart` below with calls to your API; the
// components only use the hooks and the `cart` functions.
import { useSyncExternalStore } from "react"

import { SAMPLE_CART, STORE, type Order } from "./data"
import { isoDay, lineId, type Line } from "./site"

function localStore<T>(key: string, fallback: T) {
  const empty = JSON.stringify(fallback)
  const listeners = new Set<() => void>()
  const read = () => {
    try {
      return localStorage.getItem(key) ?? empty
    } catch {
      return empty
    }
  }
  const subscribe = (on: () => void) => {
    listeners.add(on)
    const onStorage = (e: StorageEvent) => e.key === key && on()
    window.addEventListener("storage", onStorage)
    return () => {
      listeners.delete(on)
      window.removeEventListener("storage", onStorage)
    }
  }
  const parse = (raw: string): T => {
    try {
      return { ...(fallback as object), ...JSON.parse(raw) } as T
    } catch {
      return fallback
    }
  }
  const parseList = (raw: string): T => {
    try {
      const v = JSON.parse(raw)
      return (Array.isArray(v) ? v : fallback) as T
    } catch {
      return fallback
    }
  }
  const decode = Array.isArray(fallback) ? parseList : parse
  const get = () => decode(read())
  const set = (next: T | ((prev: T) => T)) => {
    const value = typeof next === "function" ? (next as (prev: T) => T)(get()) : next
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
    listeners.forEach((l) => l())
  }
  // The snapshot is the raw string, so React compares by value and re-renders only on a change.
  const use = (): T => decode(useSyncExternalStore(subscribe, read, () => empty))
  return { use, get, set }
}

/* The cart ---------------------------------------------------------------------------------------- */

export type CartState = { lines: Line[]; code: string; giftNote: boolean; note: string }

const cartStore = localStore<CartState>("ec-cart", { lines: [], code: "", giftNote: false, note: "" })

export const useCart = cartStore.use

export type AddItem = { slug: string; color?: string; size?: string; qty?: number; to?: string; from?: string; message?: string }

export const cart = {
  add(items: AddItem | AddItem[], { open = true } = {}) {
    const list = Array.isArray(items) ? items : [items]
    cartStore.set((s) => {
      const lines = [...s.lines]
      for (const it of list) {
        const id = it.slug === "gift-card" ? `gift-card|${Date.now()}|${Math.random().toString(36).slice(2, 7)}` : lineId(it.slug, it.color, it.size)
        const i = lines.findIndex((l) => l.id === id)
        if (i >= 0) lines[i] = { ...lines[i], qty: Math.min(99, lines[i].qty + (it.qty ?? 1)) }
        else lines.push({ id, slug: it.slug, color: it.color, size: it.size, qty: it.qty ?? 1, to: it.to, from: it.from, message: it.message })
      }
      return { ...s, lines }
    })
    if (open) drawer.open(list.length === 1 ? lineId(list[0].slug, list[0].color, list[0].size) : null)
  },
  setQty(id: string, qty: number) {
    cartStore.set((s) => ({ ...s, lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)) }))
  },
  remove(id: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== id) }))
  },
  setCode(code: string) {
    cartStore.set((s) => ({ ...s, code }))
  },
  setGiftNote(giftNote: boolean, note?: string) {
    cartStore.set((s) => ({ ...s, giftNote, note: note ?? s.note }))
  },
  clear() {
    cartStore.set({ lines: [], code: "", giftNote: false, note: "" })
  },
  /** The design's order: a sweater, plates and a candle. For the demo. */
  sample() {
    cartStore.set({ lines: SAMPLE_CART.map((l) => ({ ...l, id: lineId(l.slug, l.color, l.size) })), code: "WELCOME10", giftNote: false, note: "" })
  },
}

/* The drawer (this page only) --------------------------------------------------------------------- */

let drawerState = { open: false, added: null as string | null }
const drawerListeners = new Set<() => void>()
const emitDrawer = () => drawerListeners.forEach((l) => l())

export const drawer = {
  open(added: string | null = null) {
    drawerState = { open: true, added }
    emitDrawer()
  },
  close() {
    drawerState = { ...drawerState, open: false }
    emitDrawer()
  },
}

export function useDrawer() {
  return useSyncExternalStore(
    (on) => {
      drawerListeners.add(on)
      return () => drawerListeners.delete(on)
    },
    () => drawerState,
    () => drawerState,
  )
}

/* Saved, recently viewed ------------------------------------------------------------------------- */

const savedStore = localStore<string[]>("ec-saved", [])
export const useSaved = savedStore.use
export const toggleSaved = (slug: string) => savedStore.set((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [slug, ...s]))

const recentStore = localStore<string[]>("ec-recent", [])
export const useRecent = recentStore.use
export const markViewed = (slug: string) => recentStore.set((s) => [slug, ...s.filter((x) => x !== slug)].slice(0, 8))

/* Orders and checkout details -------------------------------------------------------------------- */

/** Orders placed on this device (newest first), with the totals they were placed at. */
export type PlacedOrder = Order & { subtotal: number; total: number; giftCard: number; shippingMethod: "standard" | "express"; note?: string }

const ordersStore = localStore<PlacedOrder[]>("ec-orders", [])
export const useOrders = ordersStore.use
export const addOrder = (o: PlacedOrder) => ordersStore.set((s) => [o, ...s.filter((x) => x.number !== o.number)])
export const nextOrderNumber = () => Math.max(STORE.nextOrder - 1, ...ordersStore.get().map((o) => o.number)) + 1

export type CheckoutDetails = {
  email: string
  news: boolean
  country: string
  first: string
  last: string
  line1: string
  line2: string
  city: string
  state: string
  zip: string
  phone: string
  shipping: "standard" | "express"
}

export const EMPTY_DETAILS: CheckoutDetails = { email: "", news: true, country: "United States", first: "", last: "", line1: "", line2: "", city: "", state: "", zip: "", phone: "", shipping: "standard" }

const detailsStore = localStore<CheckoutDetails>("ec-checkout", EMPTY_DETAILS)
export const useDetails = detailsStore.use
export const setDetails = (patch: Partial<CheckoutDetails>) => detailsStore.set((d) => ({ ...d, ...patch }))
export const clearDetails = () => detailsStore.set(EMPTY_DETAILS)

/* Today --------------------------------------------------------------------------------------------- */

const noop = () => () => {}
/** The visitor's today, for delivery estimates; the sample's date on the server and in the first paint. */
export function useToday() {
  return useSyncExternalStore(noop, () => isoDay(new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)), () => STORE.today)
}
