// Integrations, hub: the Orbit mark in the middle with eight integration tiles around it, four a side,
// joined to it by dashed lines (an SVG stretched over the hub; the tiles sit at fixed heights so the
// lines meet them). The lines and the ring are decoration; the tiles are a real list. On phones the hub
// becomes a plain two-column grid. The tiles are kinds of tool, not real brands; put your partners' names
// and logos in their place. The dashes drift slowly, and stand still for people who turn motion off.
import { ArrowRight, Calculator, CalendarDays, CreditCard, Landmark, Mail, MessageSquare, Sheet, Webhook } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LEFT = [
  { icon: CreditCard, name: "Card payments", body: "Cards and digital wallets" },
  { icon: Landmark, name: "Bank transfer", body: "Local transfers in 30 currencies" },
  { icon: Calculator, name: "Accounting", body: "Invoices and payments in sync" },
  { icon: Sheet, name: "Spreadsheets", body: "A live copy of every invoice" },
]
const RIGHT = [
  { icon: Mail, name: "Email", body: "Send from your own address" },
  { icon: MessageSquare, name: "Team chat", body: "A ping when an invoice is paid" },
  { icon: CalendarDays, name: "Calendar", body: "Due dates on your calendar" },
  { icon: Webhook, name: "Webhooks and API", body: "Build on top of Orbit" },
]

// The hub is 440px tall and the tiles 64px, spaced evenly: their centers, in % of the height.
const H = 440
const TILE = 64
const ROWS = [0, 1, 2, 3].map((k) => ((TILE / 2 + (k * (H - TILE)) / 3) / H) * 100)
// Columns: 32% | 36% | 32%. Left tiles end at 32%, right tiles start at 68%, the mark is at 50%.
const PATHS = [...ROWS.map((y) => `M50 50 C41 50 41 ${y} 32 ${y}`), ...ROWS.map((y) => `M50 50 C59 50 59 ${y} 68 ${y}`)]

const KEYFRAMES = `@keyframes dc-hub-flow { to { stroke-dashoffset: -18 } }`

type Item = (typeof LEFT)[number]

function Tile({ item, className }: { item: Item; className?: string }) {
  const Icon = item.icon
  return (
    <li className={cn("dc-card flex h-16 items-center gap-3 px-3.5", className)}>
      <span className="dc-icon size-9 shrink-0">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-semibold">{item.name}</span>
        <span className="block truncate text-[12px] text-muted-foreground">{item.body}</span>
      </span>
    </li>
  )
}

function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col items-center gap-2", className)}>
      <svg width="52" height="52" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h text-[17px] font-bold tracking-[-0.02em]">Orbit</span>
    </span>
  )
}

export default function IntegrationsHub() {
  return (
    <section aria-labelledby="integrations-hub-title" className="overflow-hidden py-16 sm:py-24">
      <style href="dc-hub-flow" precedence="default">
        {KEYFRAMES}
      </style>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Integrations</p>
          <h2 id="integrations-hub-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Orbit in the middle of your money
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Payments come in, invoices go out to your books and your team hears about it. Each one connects in a couple of clicks.
          </p>
        </div>

        {/* Phones: a plain grid. */}
        <ul className="mt-12 grid grid-cols-2 gap-3 md:hidden">
          {[...LEFT, ...RIGHT].map(({ icon: Icon, name, body }) => (
            <li key={name} className="dc-card p-4">
              <span className="dc-icon size-9">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[15px] font-semibold">{name}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>

        {/* Tablets and up: the hub. */}
        <div className="relative mx-auto mt-16 hidden h-[440px] max-w-[1080px] grid-cols-[32%_36%_32%] md:grid">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full text-[color:color-mix(in_oklab,var(--dc-accent)_45%,var(--border))]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            {PATHS.map((d) => (
              <path
                key={d}
                d={d}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 5"
                vectorEffect="non-scaling-stroke"
                className="animate-[dc-hub-flow_2.4s_linear_infinite] motion-reduce:animate-none"
              />
            ))}
          </svg>
          <ul className="relative flex flex-col justify-between">
            {LEFT.map((item) => (
              <Tile key={item.name} item={item} className="ml-auto w-full max-w-[270px]" />
            ))}
          </ul>
          <div className="relative grid place-items-center">
            <span aria-hidden="true" className="absolute size-[230px] rounded-full border border-dashed border-border lg:size-[260px]" />
            <span aria-hidden="true" className="absolute size-[170px] rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_7%,transparent)] lg:size-[190px]" />
            <div className="dc-card relative grid size-[136px] place-items-center">
              <Mark />
            </div>
          </div>
          <ul className="relative flex flex-col justify-between">
            {RIGHT.map((item) => (
              <Tile key={item.name} item={item} className="mr-auto w-full max-w-[270px]" />
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 text-center sm:mt-16">
          <p className="text-[15px] text-muted-foreground">And 40 more, with webhooks and an API for the rest.</p>
          <Button variant="link" className="dc-flat h-auto px-0 text-[15px] font-semibold text-foreground" nativeButton={false} render={<a href="#integrations" />}>
            Browse every integration <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
