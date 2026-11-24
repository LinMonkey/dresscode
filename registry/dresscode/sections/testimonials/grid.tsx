// Testimonials, lead quote and two more: one large quote in a card beside two smaller ones with a star
// rating. People are shown by their initials. From the Orbit landing template; the names and quotes are
// sample content, replace them with your own.
import { Quote, Star } from "lucide-react"

const QUOTES = [
  {
    quote: "I used to spend Friday afternoons chasing invoices. Now Orbit does it in a tone I would actually use, and clients pay faster.",
    name: "Maya Lindqvist",
    role: "Founder, Fernwood Studio",
    initials: "ML",
  },
  {
    quote: "The forecast alone is worth it. I know in the first week whether the month is fine.",
    name: "Tom Okafor",
    role: "Partner, Kato & Lee",
    initials: "TO",
  },
  {
    quote: "Setting it up took one coffee. Every invoice since has taken about a minute.",
    name: "Priya Raman",
    role: "Freelance product designer",
    initials: "PR",
  },
]

function Initials({ initials }: { initials: string }) {
  return (
    <span aria-hidden="true" className="inline-grid size-9 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))] text-xs font-bold text-[color:var(--dc-accent)] ring-2 ring-[color:var(--card)]">
      {initials}
    </span>
  )
}

export default function TestimonialsGrid() {
  const [lead, ...rest] = QUOTES
  return (
    <section aria-labelledby="testimonials-grid-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Customers</p>
          <h2 id="testimonials-grid-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Fewer awkward emails, more paid invoices
          </h2>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <figure className="dc-card flex flex-col justify-between p-6 sm:p-8">
            <div>
              <Quote className="size-8 text-[color:var(--dc-accent)]" aria-hidden="true" />
              <blockquote className="dc-h mt-5 text-[24px] leading-snug sm:text-[28px]">“{lead.quote}”</blockquote>
            </div>
            <figcaption className="mt-8 flex items-center gap-3">
              <Initials initials={lead.initials} />
              <span>
                <span className="block font-semibold">{lead.name}</span>
                <span className="block text-sm text-muted-foreground">{lead.role}</span>
              </span>
            </figcaption>
          </figure>
          <div className="grid gap-4">
            {rest.map((q) => (
              <figure key={q.name} className="dc-card p-6">
                <p className="flex gap-0.5 text-[color:var(--dc-accent)]">
                  <span className="sr-only">Rated 5 out of 5</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </p>
                <blockquote className="mt-3 text-[16px] leading-relaxed">“{q.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Initials initials={q.initials} />
                  <span>
                    <span className="block font-semibold">{q.name}</span>
                    <span className="block text-sm text-muted-foreground">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
