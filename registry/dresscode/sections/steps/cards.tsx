// Steps, cards with connectors: four step cards in a row, joined by small arrows that sit in the gaps
// between them; on phones and tablets the cards stack and the arrows point down. Each card has an icon,
// its step number, a title, one line of help and how long the step takes.
import { ArrowRight, BellRing, Clock, FileUp, Palette, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STEPS = [
  { icon: FileUp, title: "Import your clients", body: "Bring a CSV from your old tool or spreadsheet. Addresses, currencies and tax come with it.", time: "About 2 minutes" },
  { icon: Palette, title: "Make it yours", body: "Add your logo, payment terms and bank details once. Every invoice uses them.", time: "About 3 minutes" },
  { icon: Send, title: "Send an invoice", body: "Pick a client, add the lines and press send. A payment link goes with it.", time: "About a minute" },
  { icon: BellRing, title: "Let Orbit follow up", body: "Reminders go out on your plan until the client pays, then the receipt does.", time: "Runs on its own" },
]

export default function StepsCards() {
  return (
    <section aria-labelledby="steps-cards-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[600px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Getting started</p>
            <h2 id="steps-cards-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              From sign-up to paid in four steps
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              Most studios send their first invoice on the day they sign up.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#start" />}>
              Start free <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#tour" />}>
              Take the tour
            </Button>
          </div>
        </div>

        <ol className="mx-auto mt-12 grid max-w-[560px] gap-6 sm:mt-14 lg:max-w-none lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body, time }, i) => (
            <li key={title} className="relative flex">
              <div className="dc-card flex w-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="dc-icon">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="dc-pill dc-pill-muted dc-num">Step {i + 1}</span>
                </div>
                <h3 className="dc-h mt-5 text-[20px] leading-snug">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
                <div className="mt-auto pt-5">
                  <p className="flex items-center gap-2 border-t border-border pt-4 text-[14px] text-muted-foreground">
                    <Clock className="size-4 shrink-0" aria-hidden="true" />
                    {time}
                  </p>
                </div>
              </div>
              {/* The connector to the next card: it sits in the 24px gap and overlaps each card's padding by 4px. */}
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-[calc(100%-4px)] left-1/2 z-10 -ml-4 grid size-8 place-items-center rounded-full border border-input bg-background text-[color:var(--dc-accent)]",
                    "lg:top-[26px] lg:left-[calc(100%-4px)] lg:ml-0",
                  )}
                >
                  <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
