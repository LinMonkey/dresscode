"use client"

// Where the app lives and what the shell can do for a screen: build links, read the query string,
// open the command palette and the shared dialogs (new client, record payment, invite).
import { useSearchParams } from "next/navigation"
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react"

import type { Screen } from "./screens"

export type SharedDialog = "client" | "payment" | "invite"

type OrbitCtx = {
  base: string
  screen: Screen
  openPalette: () => void
  openDialog: (d: SharedDialog) => void
}

const Ctx = createContext<OrbitCtx>({
  base: "",
  screen: "overview",
  openPalette: () => {},
  openDialog: () => {},
})

export function OrbitProvider({ value, children }: { value: OrbitCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useOrbit() {
  const ctx = useContext(Ctx)
  const href = useCallback(
    (screen: Screen, query?: Record<string, string>) => `${ctx.base}/${screen}${query ? `?${new URLSearchParams(query)}` : ""}`,
    [ctx.base],
  )
  return useMemo(() => ({ ...ctx, href }), [ctx, href])
}

/** A query-string value. Call it inside a <Suspense> so the screen still prerenders. */
export function useParam(name: string): string | null {
  return useSearchParams().get(name)
}
