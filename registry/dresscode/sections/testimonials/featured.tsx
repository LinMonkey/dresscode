// Testimonials, featured story: one large quote with the company's wordmark above it and the person
// (initials, name, role) below, and beside it a card with what changed for them in big figures and a
// link to the full story. The wordmark is drawn in type, so swap it for your customer's logo. The names,
// quote and figures are sample content; replace them with your own.
import { ArrowRight } from "lucide-react"

const RESULTS = [
  { value: "58", unit: "%", label: "fewer invoices paid late in the first six months" },
  { value: "11", unit: "days", label: "on average to get paid, down from 26" },
]

export default function TestimonialsFeatured() {
  return (
    <section aria-labelledby="testimonials-featured-title" className="py-16 sm:py-24">
      <h2 id="testimonials-featured-title" className="sr-only">
        What Fernwood Studio says about Orbit
      </h2>
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <figure>
          <p aria-hidden="true" className="font-serif text-[26px] leading-none tracking-[-0.01em] italic">
            Fernwood<span className="text-[color:var(--dc-accent)]">.</span>
          </p>
          <blockquote className="dc-h mt-8 text-[26px] leading-[1.25] sm:text-[34px] lg:text-[38px]">
            “We were losing a day a month to chasing invoices. Now the reminders go out on their own, in our voice, and late payments have nearly stopped.”
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[15px] font-bold text-[color:var(--dc-highlight-fg)]">
              ML
            </span>
            <span>
              <span className="block text-[17px] font-semibold">Maya Lindqvist</span>
              <span className="block text-muted-foreground">Founder, Fernwood Studio</span>
            </span>
          </figcaption>
        </figure>

        <div className="dc-card flex flex-col p-7 sm:p-8">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">With Orbit</p>
          <dl className="mt-2 divide-y divide-border">
            {RESULTS.map((r) => (
              <div key={r.label} className="flex flex-col-reverse justify-end py-6">
                <dt className="mt-3 text-[15px] leading-snug text-pretty text-muted-foreground">{r.label}</dt>
                <dd className="dc-h dc-num text-[56px] leading-none sm:text-[64px]">
                  {r.value}
                  <span className={r.unit.length > 1 ? "ml-1.5 text-[0.42em]" : "text-[0.6em]"}>{r.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="#fernwood-story"
            className="mt-2 inline-flex items-center gap-1.5 self-start rounded-[var(--radius)] text-[15px] font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Read Fernwood&apos;s story <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
