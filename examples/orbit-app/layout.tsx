// The Orbit app in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).
// Pop's ink outlines come from the dc-brutal class; light or dark follows <html class="dark">.
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = { title: "Orbit" }

export default function OrbitAppLayout({ children }: { children: ReactNode }) {
  return <div className={dresscode.layout.brutal ? "dc-theme dc-brutal min-h-svh" : "dc-theme min-h-svh"}>{children}</div>
}
