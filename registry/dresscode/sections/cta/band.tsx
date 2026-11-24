// Call to action on the colored band: the closing promise of a landing page and its two actions on the
// theme's band color (dc-band switches the text and the primary button to the band's own pair; the
// outline button takes the band's colors too). Ported from the Orbit template's closing section.
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CtaBand() {
  return (
    <section aria-labelledby="cta-band-title" className="dc-band py-24 sm:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
        <h2 id="cta-band-title" className="dc-h max-w-[720px] text-[36px] leading-[1.06] sm:text-[56px]">
          Start sending invoices today.
        </h2>
        <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-pretty text-muted-foreground">
          Set up in ten minutes. Free for your first three clients, no card needed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-[color:var(--dc-band-edge)] bg-transparent px-6 text-[16px] font-semibold text-[color:var(--dc-band-fg)] hover:bg-[color:color-mix(in_oklab,var(--dc-band-fg)_12%,transparent)] hover:text-[color:var(--dc-band-fg)] dark:bg-transparent"
            nativeButton={false}
            render={<a href="#demo" />}
          >
            Book a demo
          </Button>
        </div>
      </div>
    </section>
  )
}
