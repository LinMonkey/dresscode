// A missing page under /portfolio, in the site's own frame.
import { SidebarSite } from "@/components/portfolio-sidebar/sidebar"
import { dresscode } from "@/lib/dresscode-theme"

export default function PortfolioNotFound() {
  return <SidebarSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
