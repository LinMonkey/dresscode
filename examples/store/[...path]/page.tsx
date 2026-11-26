// Every other page: /store/shop, /store/shop/<department>, /store/products/<product>, /store/cart,
// /store/checkout and so on, built at build time; anything else is the store's own 404 (not-found.tsx).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { allPaths, EcommerceSite, ecommerceMetadata, resolve } from "@/components/ecommerce/ecommerce"
import { dresscode } from "@/lib/dresscode-theme"

export function generateStaticParams() {
  return allPaths()
    .filter((path) => path.length)
    .map((path) => ({ path }))
}

type Params = { params: Promise<{ path: string[] }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { path } = await params
  return ecommerceMetadata(path)
}

export default async function StorePage({ params }: Params) {
  const { path } = await params
  if (!resolve(path)) notFound()
  return <EcommerceSite path={path} base="/store" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
