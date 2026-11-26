"use client"

// Small interactive pieces the pages share: the light/dark switch, the heart that saves a product,
// the quantity stepper and the add-to-cart buttons on cards.
import { Heart, Minus, Moon, Plus, Sun } from "lucide-react"
import { useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import type { Product } from "./data"
import { cart, toggleSaved, useSaved } from "./store"
import { firstAvailable, stockOf } from "./site"

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
      className={cn("inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[var(--radius)] px-2 text-current transition-colors hover:bg-foreground/5", className)}
    >
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  )
}

export function SaveButton({ slug, label, className, variant = "float" }: { slug: string; label: string; className?: string; variant?: "float" | "square" }) {
  const saved = useSaved()
  const on = saved.includes(slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSaved(slug)
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from saved` : `Save ${label}`}
      className={cn(
        "grid shrink-0 cursor-pointer place-items-center transition-transform active:scale-95",
        variant === "float"
          ? "size-8 rounded-full bg-white text-[#1a1a1a] shadow-[0_1px_3px_rgb(0_0_0/0.12)] hover:scale-105"
          : "size-12 rounded-[var(--radius)] border border-[color:var(--input)] bg-card hover:bg-muted",
        className,
      )}
    >
      <Heart className={cn("size-[17px] transition-colors", on && "fill-[color:var(--dc-danger)] text-[color:var(--dc-danger)]")} aria-hidden="true" />
    </button>
  )
}

export function Stepper({ value, onChange, label, size = "md", max = 99, className }: { value: number; onChange: (n: number) => void; label: string; size?: "sm" | "md" | "lg"; max?: number; className?: string }) {
  const h = size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10"
  const w = size === "sm" ? "w-8" : size === "lg" ? "w-11" : "w-9"
  return (
    <div className={cn("inline-flex items-center rounded-[var(--radius)] border border-[color:var(--input)] bg-card", h, className)} role="group" aria-label={`Quantity of ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="One fewer" className={cn("grid h-full cursor-pointer place-items-center rounded-l-[var(--radius)] hover:bg-muted", w)}>
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="dc-num min-w-7 text-center text-[15px] tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="One more" className={cn("grid h-full cursor-pointer place-items-center rounded-r-[var(--radius)] hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40", w)}>
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

/** The panel that rises over a card's photo on hover: sizes to pick, or one button. */
export function QuickAdd({ p, look }: { p: Product; look: "department" | "brand" }) {
  const [done, setDone] = useState(false)
  const { color } = firstAvailable(p)
  const add = (size?: string) => {
    cart.add({ slug: p.slug, color, size })
    setDone(true)
    setTimeout(() => setDone(false), 1400)
  }
  const shell =
    "pointer-events-none absolute inset-x-2 bottom-2 z-10 translate-y-2 opacity-0 transition-[opacity,translate] duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:hidden"
  if (!p.sizes?.length) {
    return (
      <div className={shell}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            add()
          }}
          className={cn(
            "h-9 w-full cursor-pointer rounded-[var(--radius)] text-[14px] font-semibold shadow-sm",
            look === "department" ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-white text-[#141414] hover:bg-white/90",
          )}
        >
          {done ? "Added" : "Quick add"}
        </button>
      </div>
    )
  }
  return (
    <div className={shell}>
      <div className={cn("rounded-[calc(var(--radius)+2px)] bg-white p-2 text-[#141414] shadow-[0_6px_20px_-8px_rgb(0_0_0/0.35)]", look === "brand" && "flex items-center gap-2")}>
        <p className={cn("text-[13px] font-semibold", look === "department" ? "mb-1.5 text-center" : "mr-auto pl-1")}>{done ? "Added" : "Quick add"}</p>
        <div className={cn("flex flex-wrap gap-1", look === "department" && "justify-center")}>
          {p.sizes.map((s) => {
            const out = stockOf(p, color, s.name) <= 0
            return (
              <button
                key={s.name}
                type="button"
                disabled={out}
                onClick={(e) => {
                  e.preventDefault()
                  add(s.name)
                }}
                aria-label={out ? `${s.name}, sold out` : `Add ${s.name}`}
                className="h-7 min-w-9 cursor-pointer rounded-[calc(var(--radius)-2px)] border border-black/20 px-2 text-[12px] font-medium hover:border-black disabled:cursor-not-allowed disabled:text-black/35 disabled:line-through"
              >
                {s.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
