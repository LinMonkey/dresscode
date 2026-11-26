// A missing page under /realestate, in the site's own frame.
import { RealEstateSite } from "@/components/realestate/realestate"
import { dresscode } from "@/lib/dresscode-theme"

export default function RealEstateNotFound() {
  return <RealEstateSite path={["not-found"]} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
