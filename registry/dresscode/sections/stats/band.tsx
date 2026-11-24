// Stats on the colored band: a heading, a line of copy and a link to the report on the left, four big
// numbers on the right, all on the theme's band color (dc-band switches the text, the muted text, the
// lines and the buttons to the band's own pair). The numbers are sample content; replace them with your own.
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const STATS = [
  { value: "4,000", unit: "", label: "studios and freelancers send their invoices with Orbit" },
  { value: "$412", unit: "M", label: "paid to them through Orbit in 2025" },
  { value: "11", unit: "days", label: "to get paid on average, down from 26" },
  { value: "92", unit: "%", label: "of invoices paid on time with reminders on" },
]

export default function StatsBand() {
  return (
    <section aria-labelledby="stats-band-title" className="dc-band py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-20">
        <div className="max-w-[520px]">
          <p className="text-sm font-semibold opacity-80">Orbit in numbers</p>
          <h2 id="stats-band-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Small studios, paid two weeks sooner
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            We looked at every invoice sent with Orbit last year. With reminders on, they were paid in half the time.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-8 h-11 border-[color:var(--dc-band-edge)] bg-transparent px-5 text-[15px] font-semibold text-[color:var(--dc-band-fg)] hover:bg-[color:color-mix(in_oklab,var(--dc-band-fg)_12%,transparent)] hover:text-[color:var(--dc-band-fg)] dark:bg-transparent"
            nativeButton={false}
            render={<a href="#report" />}
          >
            Read the 2025 report <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end border-t border-border pt-5">
              <dt className="mt-3 text-[15px] leading-snug text-pretty text-muted-foreground">{s.label}</dt>
              <dd className="dc-h dc-num text-[44px] leading-none sm:text-[64px]">
                {s.value}
                {s.unit ? <span className={s.unit.length > 1 ? "ml-1.5 text-[0.45em]" : "text-[0.6em]"}>{s.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
