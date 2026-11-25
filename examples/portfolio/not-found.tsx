// A missing page under /portfolio, in the site's own frame.
import { PortfolioSite } from "@/components/portfolio/portfolio"
import { dresscode } from "@/lib/dresscode-theme"

export default function PortfolioNotFound() {
  return <PortfolioSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
