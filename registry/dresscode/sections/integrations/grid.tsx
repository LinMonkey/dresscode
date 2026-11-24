// Integrations, grid beside the pitch: the heading and a line of copy on the left, eight integration
// tiles on the right. The tiles are kinds of tool (card payments, accounting, team chat) with an icon,
// not real brands; put your partners' names and logos in their place. From the Orbit landing template.
import { ArrowRight, Calculator, CalendarDays, CreditCard, Landmark, Mail, MessageSquare, Sheet, Webhook } from "lucide-react"

import { Button } from "@/components/ui/button"

const INTEGRATIONS = [
  { icon: CreditCard, name: "Card payments", body: "Cards and digital wallets" },
  { icon: Landmark, name: "Bank transfer", body: "Local transfers in 30 currencies" },
  { icon: Calculator, name: "Accounting", body: "Sync invoices and payments" },
  { icon: Sheet, name: "Spreadsheets", body: "Export or live-sync to a sheet" },
  { icon: Mail, name: "Email", body: "Send from your own address" },
  { icon: MessageSquare, name: "Team chat", body: "A ping when an invoice is paid" },
  { icon: CalendarDays, name: "Calendar", body: "Due dates on your calendar" },
  { icon: Webhook, name: "Webhooks and API", body: "Build anything on top of Orbit" },
]

export default function IntegrationsGrid() {
  return (
    <section aria-labelledby="integrations-grid-title" className="py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <div className="max-w-[560px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Integrations</p>
          <h2 id="integrations-grid-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Works with the tools you already pay for
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Connect payments, accounting and your inbox in a couple of clicks. Everything else talks to Orbit through webhooks and a tidy API.
          </p>
          <Button variant="link" className="dc-flat mt-5 h-auto px-0 text-[15px] font-semibold text-foreground" nativeButton={false} render={<a href="#integrations" />}>
            See every integration <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INTEGRATIONS.map(({ icon: Icon, name, body }) => (
            <li key={name} className="dc-card p-4">
              <span className="dc-icon size-9">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[15px] font-semibold">{name}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
