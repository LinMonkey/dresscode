// Features, grid: a centered heading and six features in three columns, each an icon in the theme's soft
// accent square, a short title and a line or two of text. Two columns on tablets, one on phones.
import { BellRing, ChartColumn, CreditCard, FileSpreadsheet, Repeat, Send } from "lucide-react"

const FEATURES = [
  { icon: Send, title: "Send in a minute", body: "Pick a client, add the lines, press send. Orbit fills in your details, terms and payment link." },
  { icon: BellRing, title: "Reminders that sound like you", body: "Friendly follow-ups go out before and after the due date, written in your tone." },
  { icon: ChartColumn, title: "Know what is coming in", body: "See what is paid, what is due and what is at risk this month, at a glance." },
  { icon: CreditCard, title: "Get paid your way", body: "Cards, bank transfer and payment links, with the fees shown up front." },
  { icon: Repeat, title: "Retainers on autopilot", body: "Recurring invoices bill every month and stop when the contract ends." },
  { icon: FileSpreadsheet, title: "Ready for tax time", body: "Export every invoice and payment to a tidy CSV your accountant will like." },
]

export default function FeaturesGrid() {
  return (
    <section aria-labelledby="features-grid-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Features</p>
          <h2 id="features-grid-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Everything between the job and the payment
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Orbit covers the boring middle: the invoice, the chasing and the bookkeeping that follows.
          </p>
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <span className="dc-icon">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <h3 className="dc-h mt-4 text-[20px] leading-snug">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
