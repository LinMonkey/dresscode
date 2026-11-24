// Every screen of the Orbit app template, by URL slug. The demo routes them as /<theme>/<slug>;
// in your own app, map them to whatever routes you use (OrbitProvider takes the base path).
export const SCREENS = {
  overview: { label: "Overview", inShell: true },
  invoices: { label: "Invoices", inShell: true },
  invoice: { label: "Invoice", inShell: true },
  "invoice-new": { label: "New invoice", inShell: true },
  recurring: { label: "Recurring", inShell: true },
  clients: { label: "Clients", inShell: true },
  client: { label: "Client", inShell: true },
  payments: { label: "Payments", inShell: true },
  reports: { label: "Reports", inShell: true },
  settings: { label: "Settings", inShell: true },
  "sign-in": { label: "Sign in", inShell: false },
  "sign-up": { label: "Create account", inShell: false },
  "not-found": { label: "Page not found", inShell: false },
} as const

export type Screen = keyof typeof SCREENS

export const SCREEN_IDS = Object.keys(SCREENS) as Screen[]

export const isScreen = (s: string): s is Screen => s in SCREENS
