"use client"

// Light or dark: the mode lives on <html class="dark"> (set before paint from ?mode=, else the
// theme's own mode). useMode() follows it; setMode() flips it and writes ?mode= into the URL, so a
// reload or a shared link keeps it. The user menu and the demo's theme switcher both use these.
import { useSyncExternalStore } from "react"

import type { Mode } from "@/registry/dresscode/themes"

export type { Mode }

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => {
    listeners.delete(listener)
    observer.disconnect()
  }
}

const read = (): Mode => (document.documentElement.classList.contains("dark") ? "dark" : "light")

export function useMode(fallback: Mode = "light"): Mode {
  return useSyncExternalStore(subscribe, read, () => fallback)
}

export function setMode(mode: Mode) {
  const html = document.documentElement
  html.classList.toggle("dark", mode === "dark")
  html.dataset.dcMode = mode
  const url = new URL(window.location.href)
  url.searchParams.set("mode", mode)
  window.history.replaceState(window.history.state, "", url)
  listeners.forEach((l) => l())
}

/** The mode a page should open in: ?mode=light|dark, else the theme's own. */
export function initialMode(fallback: Mode): Mode {
  const m = new URLSearchParams(window.location.search).get("mode")
  return m === "light" || m === "dark" ? m : fallback
}
