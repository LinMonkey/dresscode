// The Portfolio site's home page: the index or the grid home, whichever HOME in components/portfolio/data.ts says.
import type { Metadata } from "next"

import { PortfolioSite, portfolioMetadata } from "@/components/portfolio/portfolio"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = portfolioMetadata([])

export default function PortfolioHome() {
  return <PortfolioSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
