"use client"

// The small interactive pieces the pages share: the light/dark switch, saved homes (kept on this device)
// and the heart that saves one.
import { Heart, Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

// Light or dark lives on <html class="dark">, like shadcn/ui and next-themes. The switch flips it and
// remembers the choice under the key next-themes uses ("theme").
const subscribeTheme = (on: () => void) => {
  const o = new MutationObserver(on)
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => o.disconnect()
}
export function useDarkMode() {
  return useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains("dark"), () => false)
}
export function setDarkMode(dark: boolean) {
  const h = document.documentElement
  h.classList.toggle("dark", dark)
  h.style.colorScheme = dark ? "dark" : "light"
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
  } catch {}
}

export function ModeToggle({ className }: { className?: string }) {
  const dark = useDarkMode()
  return (
    <button
      type="button"
      onClick={() => setDarkMode(!dark)}
      aria-label="Dark mode"
      aria-pressed={dark}
      className={cn("grid size-9 shrink-0 cursor-pointer place-items-center rounded-[var(--radius)] text-current transition-colors hover:bg-foreground/5", className)}
    >
      <Moon className="size-[18px] dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-[18px] dark:block" aria-hidden="true" />
    </button>
  )
}

// Saved homes: a list of listing slugs in localStorage, shared by every heart on the page.
const KEY = "re-saved"
const listeners = new Set<() => void>()
const readSaved = () => {
  try {
    return localStorage.getItem(KEY) ?? "[]"
  } catch {
    return "[]"
  }
}
const subscribeSaved = (on: () => void) => {
  listeners.add(on)
  const onStorage = (e: StorageEvent) => e.key === KEY && on()
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(on)
    window.removeEventListener("storage", onStorage)
  }
}

/** The saved slugs, and a toggle. Empty on the server, so the first paint matches. */
export function useSaved() {
  const raw = useSyncExternalStore(subscribeSaved, readSaved, () => "[]")
  const saved: string[] = JSON.parse(raw)
  const toggle = (slug: string) => {
    const next = saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug]
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
    listeners.forEach((l) => l())
  }
  return { saved, toggle }
}

export function SaveButton({ slug, label, className }: { slug: string; label: string; className?: string }) {
  const { saved, toggle } = useSaved()
  const on = saved.includes(slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(slug)
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from saved homes` : `Save ${label}`}
      className={cn(
        "grid size-9 cursor-pointer place-items-center rounded-full bg-white/95 text-[#0f1a2e] shadow-sm transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-colors", on && "fill-[color:var(--dc-primary)] text-[color:var(--dc-primary)]")} aria-hidden="true" />
    </button>
  )
}

const motionQuery = "(prefers-reduced-motion: reduce)"
export function useReducedMotion() {
  return useSyncExternalStore(
    (on) => {
      const m = window.matchMedia(motionQuery)
      m.addEventListener("change", on)
      return () => m.removeEventListener("change", on)
    },
    () => window.matchMedia(motionQuery).matches,
    () => true,
  )
}
