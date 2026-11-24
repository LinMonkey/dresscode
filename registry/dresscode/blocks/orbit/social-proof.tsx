// Proof: the studios that use Orbit, results in numbers, and what customers say.
// The names, numbers and quotes are sample content for the template; replace them with your own.
import { Quote, Star } from "lucide-react"

import { Avatar, Container, Section, SectionHeading } from "./shared"

const LOGOS = [
  { name: "Fernwood", style: "font-serif italic" },
  { name: "NORTHLIGHT", style: "tracking-[0.18em] text-[15px] font-semibold" },
  { name: "kato&lee", style: "font-bold lowercase" },
  { name: "Juniper Labs", style: "font-semibold" },
  { name: "Halcyon", style: "font-serif" },
  { name: "Brightedge", style: "font-extrabold tracking-tight" },
]

export function LogoCloud() {
  return (
    <section aria-label="Studios that use Orbit" className="py-12">
      <Container>
        <p className="text-center text-[15px] text-muted-foreground">Studios and freelancers who get paid with Orbit</p>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 text-center text-[20px] text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((l) => (
            <li key={l.name} className={l.style}>
              {l.name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

const STATS = [
  { value: "11 days", label: "average time to get paid, down from 26" },
  { value: "3×", label: "fewer invoices paid late after the first month" },
  { value: "2 hours", label: "saved every week on chasing and bookkeeping" },
  { value: "30", label: "currencies, with payouts in your own" },
]

export function Stats() {
  return (
    <section aria-labelledby="stats-title" className="py-16 sm:py-20">
      <Container>
        <h2 id="stats-title" className="sr-only">
          Orbit in numbers
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="bg-background p-7">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="dc-h dc-num block text-[44px] leading-none text-[color:var(--dc-accent)]">{s.value}</span>
                <span className="mt-3 block text-[15px] leading-snug text-muted-foreground">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}

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

export function Testimonials() {
  const [lead, ...rest] = QUOTES
  return (
    <Section id="customers" labelledBy="quotes-title">
      <Container>
        <SectionHeading id="quotes-title" kicker="Customers" title="Fewer awkward emails, more paid invoices" />
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <figure className="dc-card flex flex-col justify-between p-8">
            <div>
              <Quote className="size-8 text-[color:var(--dc-accent)]" aria-hidden="true" />
              <blockquote className="dc-h mt-5 text-[24px] leading-snug sm:text-[28px]">“{lead.quote}”</blockquote>
            </div>
            <figcaption className="mt-8 flex items-center gap-3">
              <Avatar initials={lead.initials} />
              <span>
                <span className="block font-semibold">{lead.name}</span>
                <span className="block text-sm text-muted-foreground">{lead.role}</span>
              </span>
            </figcaption>
          </figure>
          <div className="grid gap-4">
            {rest.map((q) => (
              <figure key={q.name} className="dc-card p-6">
                <div className="flex gap-0.5 text-[color:var(--dc-accent)]" aria-label="5 out of 5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-3 text-[16px] leading-relaxed">“{q.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar initials={q.initials} />
                  <span>
                    <span className="block font-semibold">{q.name}</span>
                    <span className="block text-sm text-muted-foreground">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
