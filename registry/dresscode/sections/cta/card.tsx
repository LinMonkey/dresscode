// Call to action in a centered card: a raised card on the page background with a kicker, a heading, a
// line, two actions and three small reassurances. A faint glow in the theme's accent sits behind the top
// of the card; it is decoration only.
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"

const REASSURANCES = ["Free for your first three clients", "No card needed", "Cancel any time"]

export default function CtaCard() {
  return (
    <section aria-labelledby="cta-card-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="dc-card relative isolate mx-auto max-w-[880px] overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]"
            style={{ background: "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--dc-accent) 13%, transparent), transparent)" }}
          />
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Ready when you are</p>
          <h2 id="cta-card-title" className="dc-h mx-auto mt-3 max-w-[640px] text-[32px] leading-[1.1] sm:text-[44px]">
            Let your next invoice chase itself.
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[17px] leading-relaxed text-muted-foreground">
            Send it in a minute. Orbit writes the reminders in your tone and tells you the moment the money lands.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
              Start free <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#pricing" />}>
              See pricing
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground">
            {REASSURANCES.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-[color:var(--dc-accent)]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
