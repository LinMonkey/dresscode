// Stats, row: four results in a hairline grid, each a big figure in the accent color and one line on
// what it means. It sits well under a hero or a logo cloud; the heading is there for screen readers.
// From the Orbit landing template. The numbers are sample content; replace them with your own.
const STATS = [
  { value: "11 days", label: "average time to get paid, down from 26" },
  { value: "3×", label: "fewer invoices paid late after the first month" },
  { value: "2 hours", label: "saved every week on chasing and bookkeeping" },
  { value: "30", label: "currencies, with payouts in your own" },
]

export default function StatsRow() {
  return (
    <section aria-labelledby="stats-row-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <h2 id="stats-row-title" className="sr-only">
          Orbit in numbers
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="flex flex-col-reverse justify-end bg-background p-7">
              <dt className="mt-3 text-[15px] leading-snug text-muted-foreground">{s.label}</dt>
              <dd className="dc-h dc-num text-[44px] leading-none text-[color:var(--dc-accent)]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
