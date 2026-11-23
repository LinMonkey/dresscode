// Integrations as an editorial two-column list with hairline rows (design image L8,
// changed per review fix #3: no boxed, identical icon cards).
import { BarChart3, CreditCard, FileText, Globe, Podcast, Rss, Webhook, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Container, DoubleRule, SectionHeader } from "./shared"

export type IntegrationItem = { icon: LucideIcon; name: string; body: string }

const defaultItems: IntegrationItem[] = [
  { icon: CreditCard, name: "Payments", body: "Accept subscriptions and one-time payments with built-in checkout." },
  { icon: Globe, name: "Custom domain", body: "Use your own domain to publish and grow your newsletter." },
  { icon: Webhook, name: "Webhooks", body: "Send event data to other tools in real time." },
  { icon: FileText, name: "CSV import", body: "Bring in your existing audience from a CSV file in a few steps." },
  { icon: BarChart3, name: "Analytics export", body: "Download your performance data as a CSV for deeper analysis." },
  { icon: Rss, name: "RSS", body: "Publish an RSS feed so readers can follow your updates anywhere." },
  { icon: Podcast, name: "Podcast feed", body: "Generate a podcast-ready feed for your audio content." },
  { icon: Zap, name: "Automations", body: "Set up simple rules to save time and keep your publication running." },
]

export function IntegrationsList({
  title = "Works with the tools you already use",
  subtitle = "Connect your publication to the services in your workflow, so you can publish, grow, and get paid with less effort.",
  items = defaultItems,
}: {
  title?: string
  subtitle?: string
  items?: IntegrationItem[]
}) {
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[54px]" title={title} subtitle={subtitle} />
      <ul className="mt-[56px] grid border-t border-ink md:grid-cols-2 md:gap-x-[64px]">
        {items.map(({ icon: Icon, name, body }) => (
          <li key={name} className="flex gap-[22px] border-b border-divider py-[24px]">
            <Icon className="mt-[4px] size-[30px] shrink-0 text-ink" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-[26px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">{name}</p>
              <p className="mt-[6px] text-[18px] leading-[1.4] text-ink-2">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}
