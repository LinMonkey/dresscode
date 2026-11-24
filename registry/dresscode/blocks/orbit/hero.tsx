// Hero: one promise, two actions, three reassurances, then the product itself.
// On a band theme (Sorbet, Hi-Vis) the copy sits on the band and the product shot overlaps its edge.
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ProductPreview } from "./product-preview"
import { Container, Marked, onBandOutline, type Mark } from "./shared"

export function Hero({ mark = "none", band = false, glow = false }: { mark?: Mark; band?: boolean; glow?: boolean }) {
  const copy = (
    <Container className="relative z-10 flex flex-col items-center pt-16 text-center sm:pt-24">
      <a
        href="#reminders"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] py-1 pr-3 pl-1 text-[13px] font-medium"
      >
        <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-semibold text-primary-foreground">New</span>
        Reminders in your own words
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </a>
      <h1 id="top" className="dc-h mt-6 max-w-[900px] text-[42px] leading-[1.04] sm:text-[64px] lg:text-[76px]">
        Get paid <Marked mark={mark}>on time</Marked>, without the awkward emails.
      </h1>
      <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
        Orbit sends the invoice, nudges the late ones and tells you what is left for the month.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" className="h-12 px-6 text-[16px] font-semibold">
          Start free <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <Button size="lg" variant="outline" className={`h-12 px-6 text-[16px] font-semibold ${onBandOutline}`}>
          Book a demo
        </Button>
      </div>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground">
        {["Free for your first three clients", "No card needed", "Cancel any time"].map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-[color:var(--dc-accent)] in-[.dc-band]:text-current" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </Container>
  )

  const shot = (
    <Container className={cn("relative", band ? "-mt-40 sm:-mt-56" : "mt-14 sm:mt-20")}>
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[10%] -top-16 h-[70%] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--dc-primary) 70%, transparent), transparent)" }}
        />
      ) : null}
      <ProductPreview className="relative" />
    </Container>
  )

  return (
    <section aria-labelledby="top" className="pb-20 sm:pb-28">
      {band ? <div className="dc-band pb-52 sm:pb-72">{copy}</div> : copy}
      {shot}
    </section>
  )
}
