// The Sidebar portfolio's home page.
import type { Metadata } from "next"

import { SidebarSite, sidebarMetadata } from "@/components/portfolio-sidebar/sidebar"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = sidebarMetadata([])

export default function PortfolioHome() {
  return <SidebarSite path={[]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
