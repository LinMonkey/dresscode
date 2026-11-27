// The Garden portfolio's home page.
import type { Metadata } from "next"

import { GardenSite, gardenMetadata } from "@/components/portfolio-garden/garden"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = gardenMetadata([])

export default function PortfolioHome() {
  return <GardenSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
