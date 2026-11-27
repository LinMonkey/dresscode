// A missing page under /portfolio, in the site's own frame.
import { DesktopSite } from "@/components/portfolio-desktop/desktop"
import { dresscode } from "@/lib/dresscode-theme"

export default function PortfolioNotFound() {
  return <DesktopSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
