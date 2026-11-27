// The Desktop portfolio's home page.
import type { Metadata } from "next"

import { DesktopSite, desktopMetadata } from "@/components/portfolio-desktop/desktop"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = desktopMetadata([])

export default function PortfolioHome() {
  return <DesktopSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
