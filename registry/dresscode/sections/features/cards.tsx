// Features, cards: three large cards in a row under a left-aligned heading. Each card has a small picture
// of the feature on top (drawn in markup so it wears the theme, hidden from screen readers), then a
// title, a line of copy and a link. The cards share one height and their links line up along the bottom.
// They stack on phones.
import { ArrowRight, Check, Landmark, Repeat } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

const BILLED = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function RetainerVignette() {
  return (
    <div className="dc-card w-full max-w-[300px] p-4 text-[13px]">
      <div className="flex items-center gap-3">
        <span className="dc-icon size-8 shrink-0">
          <Repeat className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">Website retainer</p>
          <p className="truncate text-muted-foreground">Northlight, every month</p>
        </div>
        <span className="dc-num font-semibold">$1,200</span>
      </div>
      <ol className="mt-4 grid grid-cols-6 gap-1.5 text-center">
        {BILLED.map((m, i) => (
          <li key={m}>
            <span
              className={cn(
                "mx-auto grid size-7 place-items-center rounded-full",
                i < 5 ? "bg-[color:var(--dc-accent)] text-[color:var(--background)]" : "border-2 border-dashed border-[color:var(--dc-accent)]",
              )}
            >
              {i < 5 ? <Check className="size-3.5" strokeWidth={3} /> : null}
            </span>
            <span className={cn("mt-1.5 block text-[11px]", i < 5 ? "text-muted-foreground" : "font-semibold")}>{m}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ToneVignette() {
  return (
    <div className="w-full max-w-[300px] text-[13px]">
      <div className="dc-card rounded-br-[6px] p-4">
        <p className="leading-relaxed">
          Hi Tom, a friendly nudge that <span className="font-semibold">INV-1041</span> is due on Friday. Thanks, Ada
        </p>
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-1.5">
        {["Friendly", "Neutral", "Firm"].map((t, i) => (
          <span key={t} className={cn("dc-pill", i === 0 ? "dc-pill-hl" : "dc-pill-line text-muted-foreground")}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function PayoutVignette() {
  return (
    <div className="dc-card w-full max-w-[300px] p-4 text-[13px]">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Payout</p>
        <span className="dc-pill dc-pill-hl">Thursday</span>
      </div>
      <p className="dc-num mt-1 text-[24px] font-semibold tracking-tight">$7,450.00</p>
      <div className="mt-3 flex items-center gap-2 rounded-[var(--radius)] bg-muted px-3 py-2">
        <Landmark className="size-4 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate">Account ending 42</span>
        <span className="text-muted-foreground">2 days</span>
      </div>
    </div>
  )
}

const CARDS: { title: string; body: string; link: string; href: string; Vignette: ComponentType }[] = [
  {
    title: "Retainers that bill themselves",
    body: "Set the amount and the day once. Orbit sends the invoice every month and stops when the contract ends.",
    link: "How retainers work",
    href: "#retainers",
    Vignette: RetainerVignette,
  },
  {
    title: "Reminders in your own words",
    body: "Pick a tone and Orbit writes the follow-ups. Edit any of them before they go, or let them run.",
    link: "See the reminder plans",
    href: "#reminders",
    Vignette: ToneVignette,
  },
  {
    title: "Paid out in two days",
    body: "Card and bank payments land in your account two working days later, in your own currency.",
    link: "Read about payouts",
    href: "#payouts",
    Vignette: PayoutVignette,
  },
]

export default function FeaturesCards() {
  return (
    <section aria-labelledby="features-cards-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-[620px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Less admin</p>
            <h2 id="features-cards-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              The busywork, handled
            </h2>
          </div>
          <p className="max-w-[440px] text-[17px] leading-relaxed text-muted-foreground lg:pb-1">
            Three jobs that used to eat a Friday afternoon, now done while you work on something else.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {CARDS.map(({ title, body, link, href, Vignette }) => (
            <li key={title} className="dc-card flex flex-col overflow-hidden">
              <div
                aria-hidden="true"
                className="grid h-[220px] place-items-center border-b border-border bg-[color:color-mix(in_oklab,var(--dc-accent)_7%,var(--card))] px-5"
              >
                <Vignette />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="dc-h text-[21px] leading-snug">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
                <div className="mt-auto pt-5">
                  <a
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius)] text-[15px] font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {link} <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
