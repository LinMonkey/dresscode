// The Poster portfolio's home page.
import type { Metadata } from "next"

import { PosterSite, posterMetadata } from "@/components/portfolio-poster/poster"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = posterMetadata([])

export default function PortfolioHome() {
  return <PosterSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
