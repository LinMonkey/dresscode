// Hero, aurora background: three soft glows in the theme's accent, highlight and primary colors drift
// slowly behind a large headline and fade into the page (in dark mode they add light, mix-blend-mode
// screen, instead of muddying the page). The motion is CSS only and stops for people who ask for reduced
// motion. The keyframes ship with the block (React hoists the <style> once).
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const KEYFRAMES = `
@keyframes dc-aurora-a { from { transform: translate3d(-8%, -6%, 0) scale(1) } to { transform: translate3d(12%, 10%, 0) scale(1.2) } }
@keyframes dc-aurora-b { from { transform: translate3d(10%, 4%, 0) scale(1.1) } to { transform: translate3d(-12%, -8%, 0) scale(0.9) } }
@keyframes dc-aurora-c { from { transform: translate3d(0, 8%, 0) scale(0.9) } to { transform: translate3d(6%, -10%, 0) scale(1.15) } }
`

const glow = (color: string, strength: number) => ({
  background: `radial-gradient(closest-side, color-mix(in oklab, ${color} ${strength}%, transparent), transparent)`,
})

export default function HeroAurora() {
  return (
    <section aria-labelledby="hero-aurora-title" className="relative isolate overflow-hidden bg-background py-24 sm:py-32">
      <style href="dc-aurora" precedence="default">
        {KEYFRAMES}
      </style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] [mask-image:linear-gradient(to_bottom,black_45%,transparent)] dark:mix-blend-screen">
        <div
          className="absolute top-[-180px] left-[2%] size-[560px] animate-[dc-aurora-a_19s_ease-in-out_infinite_alternate] rounded-full blur-2xl motion-reduce:animate-none"
          style={glow("var(--dc-accent)", 55)}
        />
        <div
          className="absolute top-[-120px] right-[0%] size-[520px] animate-[dc-aurora-b_23s_ease-in-out_infinite_alternate] rounded-full blur-2xl motion-reduce:animate-none"
          style={glow("var(--dc-highlight)", 70)}
        />
        <div
          className="absolute top-[40px] left-[30%] size-[480px] animate-[dc-aurora-c_17s_ease-in-out_infinite_alternate] rounded-full blur-3xl motion-reduce:animate-none"
          style={glow("var(--primary)", 35)}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
        <a
          href="#whats-new"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[13px] font-medium backdrop-blur outline-none transition-colors hover:border-input focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Sparkles className="size-3.5 text-[color:var(--dc-accent)]" aria-hidden="true" />
          Orbit 3.0: reports your accountant will like
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
        <h1 id="hero-aurora-title" className="dc-h mt-7 max-w-[960px] text-[44px] leading-[1.02] sm:text-[68px] lg:text-[84px]">
          The calm way to run the money side of your studio.
        </h1>
        <p className="mt-7 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
          Invoices, reminders, payments and the numbers that follow them, in one quiet place.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 bg-background/70 px-6 text-[16px] font-semibold backdrop-blur" nativeButton={false} render={<a href="#pricing" />}>
            See pricing
          </Button>
        </div>
        <p className="mt-6 text-[14px] text-muted-foreground">Free for your first three clients. No card needed.</p>
      </div>
    </section>
  )
}
