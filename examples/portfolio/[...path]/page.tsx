// Every other page of the Portfolio site: /portfolio/work, /portfolio/work/<project>, /portfolio/about,
// /portfolio/writing/<post> and so on. All of them are built at build time; anything else is the
// site's own 404 (not-found.tsx).
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { allPaths, PortfolioSite, portfolioMetadata, resolve } from "@/components/portfolio/portfolio"
import { dresscode } from "@/lib/dresscode-theme"

export function generateStaticParams() {
  return allPaths()
    .filter((path) => path.length)
    .map((path) => ({ path }))
}

type Params = { params: Promise<{ path: string[] }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { path } = await params
  return portfolioMetadata(path)
}

export default async function PortfolioPage({ params }: Params) {
  const { path } = await params
  if (!resolve(path)) notFound()
  return <PortfolioSite path={path} base="/portfolio" theme={dresscode.theme} brutal={dresscode.layout.brutal} />
}
