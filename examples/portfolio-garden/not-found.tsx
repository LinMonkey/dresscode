// A missing page under /portfolio, in the site's own frame.
import { GardenSite } from "@/components/portfolio-garden/garden"
import { dresscode } from "@/lib/dresscode-theme"

export default function PortfolioNotFound() {
  return <GardenSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
