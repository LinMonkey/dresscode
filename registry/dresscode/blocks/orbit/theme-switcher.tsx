"use client"

// A floating picker for the demo pages: a light/dark toggle and every DressCode theme, one click away.
// Not part of the template itself. Hidden when the URL has ?bare (for screenshots).
// The mode lives on <html class="dark"> (set before paint by the page from ?mode=, else the theme's
// own mode). Flipping it writes ?mode= into the URL, and the theme links carry it from then on.
import { Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"

import { type Mode, THEMES } from "@/registry/dresscode/themes"

const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  window.addEventListener("popstate", listener)
  return () => {
    listeners.delete(listener)
    observer.disconnect()
    window.removeEventListener("popstate", listener)
  }
}
const getSearch = () => window.location.search
const getMode = (): Mode => (document.documentElement.classList.contains("dark") ? "dark" : "light")

function setMode(mode: Mode) {
  const html = document.documentElement
  html.classList.toggle("dark", mode === "dark")
  html.dataset.dcMode = mode
  const url = new URL(window.location.href)
  url.searchParams.set("mode", mode)
  window.history.replaceState(null, "", url)
  listeners.forEach((l) => l())
}

export function ThemeSwitcher({ current, base, defaultMode = "light" }: { current: string; base: string; defaultMode?: Mode }) {
  // On the server (and while hydrating) the switcher renders nothing, so ?bare never flashes it.
  const search = useSyncExternalStore(subscribe, getSearch, () => "?bare")
  const mode = useSyncExternalStore(subscribe, getMode, () => defaultMode)
  const params = new URLSearchParams(search)
  if (params.has("bare")) return null
  const picked = params.get("mode")
  const query = picked === "light" || picked === "dark" ? `?mode=${picked}` : ""
  const next: Mode = mode === "dark" ? "light" : "dark"

  return (
    <nav
      aria-label="Themes"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-max max-w-[calc(100vw-1.5rem)] gap-1 overflow-x-auto rounded-full border border-black/10 bg-white/90 p-1.5 font-[system-ui] text-[13px] text-neutral-900 shadow-[0_8px_30px_rgb(0_0_0/0.18)] backdrop-blur"
    >
      <button
        type="button"
        onClick={() => setMode(next)}
        aria-label={`Switch to ${next} mode`}
        title={`Switch to ${next} mode`}
        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-medium hover:bg-black/5"
      >
        {mode === "dark" ? <Moon className="size-3.5" aria-hidden="true" /> : <Sun className="size-3.5" aria-hidden="true" />}
        {mode === "dark" ? "Dark" : "Light"}
      </button>
      <span aria-hidden="true" className="my-1 w-px shrink-0 bg-black/10" />
      {THEMES.map((t) => {
        const c = t.modes[mode]
        return (
          <a
            key={t.id}
            href={`${base}/${t.id}${query}`}
            aria-current={t.id === current ? "page" : undefined}
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-medium hover:bg-black/5 aria-[current=page]:bg-neutral-900 aria-[current=page]:text-white"
          >
            <span className="flex">
              {[c.page, c.band, c.primary].map((color, i) => (
                <i key={i} className="-ml-1 size-3 rounded-full ring-1 ring-black/15 first:ml-0" style={{ background: color }} />
              ))}
            </span>
            {t.name}
          </a>
        )
      })}
    </nav>
  )
}
