// Testimonials, wall of quotes: a heading with the overall rating, then twelve short quotes of different
// lengths in a masonry wall (CSS columns: one on phones, two on tablets, three on desktop). Every card
// keeps to one column. People are shown by their initials. The names and quotes are sample content;
// replace them with your own.
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const QUOTES = [
  { quote: "Clients pay faster. That is the whole review.", name: "Ana Duarte", role: "Illustrator", initials: "AD" },
  {
    quote: "I used to spend Friday afternoons chasing invoices. Now Orbit does it in a tone I would actually use, and most clients pay before the second reminder.",
    name: "Maya Lindqvist",
    role: "Founder, Fernwood Studio",
    initials: "ML",
    lead: true,
  },
  { quote: "The forecast tells me in the first week whether the month is fine. I did not know how much I needed that.", name: "Tom Okafor", role: "Partner, Kato & Lee", initials: "TO" },
  { quote: "Setting it up took one coffee.", name: "Priya Raman", role: "Freelance product designer", initials: "PR" },
  { quote: "We bill in four currencies. Orbit is the first tool that does not leave me doing sums at the end of the month.", name: "Jonas Weber", role: "Studio manager, Northlight", initials: "JW" },
  { quote: "My accountant asked what I had changed. The export, that is what.", name: "Lea Moreau", role: "Copywriter", initials: "LM" },
  {
    quote: "Retainers used to slip through the cracks every quarter. Recurring invoices start and stop on their own now, and the client portal means nobody emails me for a receipt any more.",
    name: "Sam Achebe",
    role: "Director, Juniper Labs",
    initials: "SA",
    lead: true,
  },
  { quote: "Polite, persistent and never awkward. Like a good studio manager.", name: "Rosa Lind", role: "Owner, Ola Bakery", initials: "RL" },
  { quote: "I send the invoice from my phone in the car park after a shoot. It is paid before I am home.", name: "Kenji Ito", role: "Photographer", initials: "KI" },
  { quote: "We went from 26 days to get paid to 11. I checked the number twice.", name: "Hana Kim", role: "Finance, Halcyon", initials: "HK" },
  { quote: "The reminders sound like me on a good day.", name: "Dev Patel", role: "Motion designer", initials: "DP" },
  {
    quote: "Switching took an afternoon. Orbit kept our invoice numbers going from where the old tool left off, which our accountant cared about more than anything.",
    name: "Claire Dubois",
    role: "Operations, Brightedge",
    initials: "CD",
    lead: true,
  },
]

export default function TestimonialsWall() {
  return (
    <section aria-labelledby="testimonials-wall-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Customers</p>
          <h2 id="testimonials-wall-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Studios that stopped chasing invoices
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            4,000 freelancers and small studios send their invoices with Orbit.
          </p>
          <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[15px]">
            <span className="flex gap-0.5 text-[color:var(--dc-accent)]" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span>
              <span className="font-semibold">4.9 out of 5</span> <span className="text-muted-foreground">from 1,200 reviews</span>
            </span>
          </p>
        </div>

        <ul className="mt-12 gap-4 sm:mt-14 sm:columns-2 lg:columns-3">
          {QUOTES.map((q) => (
            <li key={q.name} className="mb-4 break-inside-avoid">
              <figure className="dc-card p-6">
                <blockquote className={cn("leading-relaxed", q.lead ? "dc-h text-[19px] leading-snug text-pretty" : "text-[16px]")}>“{q.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span aria-hidden="true" className="inline-grid size-9 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))] text-xs font-bold text-[color:var(--dc-accent)]">
                    {q.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{q.name}</span>
                    <span className="block text-sm text-muted-foreground">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
