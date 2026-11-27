// A missing page under /portfolio, in the site's own frame.
import { PosterSite } from "@/components/portfolio-poster/poster"
import { dresscode } from "@/lib/dresscode-theme"

export default function PortfolioNotFound() {
  return <PosterSite path={["not-found"]} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
