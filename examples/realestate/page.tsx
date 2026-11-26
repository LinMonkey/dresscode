// The Real estate site's home page: the platform or the boutique one, whichever HOME in components/realestate/data.ts says.
import type { Metadata } from "next"

import { RealEstateSite, realEstateMetadata } from "@/components/realestate/realestate"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = realEstateMetadata([])

export default function RealEstateHome() {
  return <RealEstateSite path={[]} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
