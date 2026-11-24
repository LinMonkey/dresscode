// The Orbit landing page in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).
import type { Metadata } from "next"

import { OrbitLanding } from "@/components/orbit/landing"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = { title: "Orbit" }

export default function OrbitPage() {
  return <OrbitLanding {...dresscode.layout} />
}
