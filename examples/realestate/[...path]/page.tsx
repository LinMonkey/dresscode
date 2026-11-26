// Every other page: /realestate/buy, /realestate/homes/<listing>, /realestate/agents/<agent> and so on,
// built at build time; anything else is the site's own 404 (not-found.tsx).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { allPaths, RealEstateSite, realEstateMetadata, resolve } from "@/components/realestate/realestate"
import { dresscode } from "@/lib/dresscode-theme"

export function generateStaticParams() {
  return allPaths()
    .filter((path) => path.length)
    .map((path) => ({ path }))
}

type Params = { params: Promise<{ path: string[] }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { path } = await params
  return realEstateMetadata(path)
}

export default async function RealEstatePage({ params }: Params) {
  const { path } = await params
  if (!resolve(path)) notFound()
  return <RealEstateSite path={path} base="/realestate" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
