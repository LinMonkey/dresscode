// The store's home page: the department store or the brand one, whichever HOME in components/ecommerce/data.ts says.
import type { Metadata } from "next"

import { EcommerceSite, ecommerceMetadata } from "@/components/ecommerce/ecommerce"
import { dresscode } from "@/lib/dresscode-theme"

export const metadata: Metadata = ecommerceMetadata([])

export default function StoreHome() {
  return <EcommerceSite path={[]} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
