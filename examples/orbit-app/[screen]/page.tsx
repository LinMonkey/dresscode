// Every screen of the Orbit app: /orbit-app/overview, /orbit-app/invoices, /orbit-app/settings and so on.
// Swap the sample data in components/orbit-app/data.ts for your own as you wire it up.
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { SignInScreen, SignUpScreen } from "@/components/orbit-app/auth"
import { ClientDetailScreen, ClientsScreen } from "@/components/orbit-app/clients"
import { InvoiceDetailScreen } from "@/components/orbit-app/invoice-detail"
import { InvoiceEditorScreen } from "@/components/orbit-app/invoice-editor"
import { InvoicesScreen } from "@/components/orbit-app/invoices"
import { OverviewScreen } from "@/components/orbit-app/overview"
import { PaymentsScreen } from "@/components/orbit-app/payments"
import { ReportsScreen } from "@/components/orbit-app/reports"
import { SCREENS, SCREEN_IDS, isScreen, type Screen } from "@/components/orbit-app/screens"
import { SettingsScreen } from "@/components/orbit-app/settings"
import { AppShell, StandaloneShell } from "@/components/orbit-app/shell"
import { NotFoundScreen, RecurringScreen } from "@/components/orbit-app/states"
import { dresscode } from "@/lib/dresscode-theme"

export const dynamicParams = false

export function generateStaticParams() {
  return SCREEN_IDS.map((screen) => ({ screen }))
}

type Params = { params: Promise<{ screen: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { screen } = await params
  return { title: isScreen(screen) ? `${SCREENS[screen].label} · Orbit` : "Orbit" }
}

const VIEWS: Record<Screen, () => ReactNode> = {
  overview: () => <OverviewScreen />,
  invoices: () => <InvoicesScreen />,
  invoice: () => <InvoiceDetailScreen />,
  "invoice-new": () => <InvoiceEditorScreen />,
  recurring: () => <RecurringScreen />,
  clients: () => <ClientsScreen />,
  client: () => <ClientDetailScreen />,
  payments: () => <PaymentsScreen />,
  reports: () => <ReportsScreen />,
  settings: () => <SettingsScreen />,
  "sign-in": () => <SignInScreen />,
  "sign-up": () => <SignUpScreen />,
  "not-found": () => <NotFoundScreen />,
}

export default async function OrbitAppScreen({ params }: Params) {
  const { screen } = await params
  if (!isScreen(screen)) notFound()
  const base = "/orbit-app"
  const view = VIEWS[screen]()
  return SCREENS[screen].inShell ? (
    <AppShell base={base} screen={screen} defaultMode={dresscode.mode}>
      {view}
    </AppShell>
  ) : (
    <StandaloneShell base={base} screen={screen} defaultMode={dresscode.mode}>
      {view}
    </StandaloneShell>
  )
}
