"use client"

// A floating picker for the demo: the same screen in every DressCode theme, one click away. Not part
// of the template itself. Hidden when the URL has ?bare (for screenshots). The moon or sun flips light
// and dark; theme links keep the query, so the mode and the open record carry over.
import { Moon, Sun } from "lucide-react"
import { useEffect, useSyncExternalStore } from "react"

import { THEMES, type Mode } from "@/registry/dresscode/themes"

import { initialMode, setMode, useMode } from "./mode"

const subscribe = () => () => {}
const isBare = () => new URLSearchParams(window.location.search).has("bare")

export function AppThemeSwitcher({ current, screen, root, defaultMode }: { current: string; screen: string; root: string; defaultMode: Mode }) {
  const bare = useSyncExternalStore(subscribe, isBare, () => true)
  const mode = useMode(defaultMode)
  if (bare) return null
  return (
    <nav
      aria-label="Themes"
      className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-max max-w-[calc(100vw-1.5rem)] gap-1 overflow-x-auto rounded-full border border-black/10 bg-white/90 p-1.5 font-[system-ui] text-[13px] text-neutral-900 shadow-[0_8px_30px_rgb(0_0_0/0.18)] backdrop-blur"
    >
      <button
        type="button"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-black/5"
      >
        {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
      <span className="my-1 w-px shrink-0 bg-black/10" aria-hidden="true" />
      {THEMES.map((t) => (
        <a
          key={t.id}
          href={`${root}/${t.id}/${screen}`}
          // Keep the query (an invoice id, a settings tab) when switching themes.
          onClick={(e) => {
            e.currentTarget.search = window.location.search
          }}
          aria-current={t.id === current ? "page" : undefined}
          className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-medium hover:bg-black/5 aria-[current=page]:bg-neutral-900 aria-[current=page]:text-white"
        >
          <span className="flex">
            {[t.colors.page, t.colors.band, t.colors.primary].map((c, i) => (
              <i key={i} className="-ml-1 size-3 rounded-full ring-1 ring-black/15 first:ml-0" style={{ background: c }} />
            ))}
          </span>
          {t.name}
        </a>
      ))}
    </nav>
  )
}

/** Keeps <html> in step with the theme (mode, Pop's outlines) and hands it back to the site on the way out. */
export function ThemeClasses({ defaultMode, brutal }: { defaultMode: Mode; brutal: boolean }) {
  useEffect(() => {
    const html = document.documentElement
    const mode = initialMode(defaultMode)
    html.classList.toggle("dark", mode === "dark")
    html.dataset.dcMode = mode
    html.classList.toggle("dc-brutal", brutal)
    return () => {
      html.classList.remove("dc-brutal")
      delete html.dataset.dcMode
      html.classList.toggle("dark", html.dataset.siteTheme === "dark")
    }
  }, [defaultMode, brutal])
  return null
}
