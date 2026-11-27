// The Bento portfolio's home page.
import type { Metadata } from "next"

import { BentoSite, bentoMetadata } from "@/components/portfolio-bento/bento"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = bentoMetadata([])

export default function PortfolioHome() {
  return <BentoSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
