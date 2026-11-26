// A missing page under /store, in the store's own frame.
import { EcommerceSite } from "@/components/ecommerce/ecommerce"
import { dresscode } from "@/lib/dresscode-theme"

export default function StoreNotFound() {
  return <EcommerceSite path={["not-found"]} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
