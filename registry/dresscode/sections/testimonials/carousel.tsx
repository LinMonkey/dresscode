"use client"

// Testimonials, carousel: one quote at a time in a large card, with previous and next buttons and a dot
// for each quote between them. It never moves on its own. The buttons are real buttons (Tab, Enter and
// Space work), the left and right arrow keys step through the quotes while focus is on the controls, and
// the new quote is announced politely (aria-live). Every quote is laid out invisibly in the same spot, so
// the card keeps the height of the longest one and the controls never jump. The names and quotes are
// sample content; replace them with your own.
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type KeyboardEvent, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Item = { quote: string; name: string; role: string; initials: string; company: string; mark: string }

const QUOTES: Item[] = [
  {
    quote: "I used to spend Friday afternoons chasing invoices. Now Orbit does it in a tone I would actually use, and clients pay faster.",
    name: "Maya Lindqvist",
    role: "Founder, Fernwood Studio",
    initials: "ML",
    company: "Fernwood",
    mark: "font-serif italic",
  },
  {
    quote: "We bill in four currencies. Orbit is the first tool that does not leave me doing sums at the end of the month.",
    name: "Jonas Weber",
    role: "Studio manager, Northlight",
    initials: "JW",
    company: "Northlight",
    mark: "font-semibold tracking-[0.08em]",
  },
  {
    quote: "The forecast alone is worth it. I know in the first week whether the month is fine, and so does my partner.",
    name: "Tom Okafor",
    role: "Partner, Kato & Lee",
    initials: "TO",
    company: "kato&lee",
    mark: "font-bold lowercase",
  },
  {
    quote: "Retainers used to slip through the cracks every quarter. Recurring invoices start and stop on their own now.",
    name: "Sam Achebe",
    role: "Director, Juniper Labs",
    initials: "SA",
    company: "Juniper Labs",
    mark: "font-semibold",
  },
  {
    quote: "We went from 26 days to get paid to 11. I checked the number twice before I told the team.",
    name: "Hana Kim",
    role: "Finance, Halcyon",
    initials: "HK",
    company: "Halcyon",
    mark: "font-serif",
  },
]

const KEYFRAMES = `@keyframes dc-quote-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }`

function Slide({ q }: { q: Item }) {
  return (
    <>
      <p aria-hidden="true" className={cn("text-[22px] leading-none text-muted-foreground", q.mark)}>
        {q.company}
      </p>
      <blockquote className="dc-h mt-7 text-[24px] leading-[1.3] sm:text-[30px]">“{q.quote}”</blockquote>
      <p className="mt-8 flex items-center justify-center gap-3 text-left">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))] text-[13px] font-bold text-[color:var(--dc-accent)]">
          {q.initials}
        </span>
        <span>
          <span className="block font-semibold">{q.name}</span>
          <span className="block text-sm text-muted-foreground">{q.role}</span>
        </span>
      </p>
    </>
  )
}

export default function TestimonialsCarousel() {
  const id = useId()
  const [index, setIndex] = useState(0)
  const count = QUOTES.length
  const go = (i: number) => setIndex((i + count) % count)
  const current = QUOTES[index]

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      go(index + 1)
    }
  }

  return (
    <section aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <style href="dc-quote-in" precedence="default">
        {KEYFRAMES}
      </style>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Customers</p>
          <h2 id={`${id}-title`} className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Heard from studios after their first month
          </h2>
        </div>

        <div role="region" aria-roledescription="carousel" aria-label="Customer quotes" className="mx-auto mt-12 max-w-[920px] sm:mt-14">
          <div className="dc-card grid px-6 py-10 text-center sm:px-14 sm:py-14">
            {/* Every quote, invisible, in the same grid cell: the card is as tall as the longest. */}
            {QUOTES.map((q) => (
              <div key={q.name} aria-hidden="true" className="invisible [grid-area:1/1]">
                <Slide q={q} />
              </div>
            ))}
            <div aria-live="polite" className="flex flex-col justify-center [grid-area:1/1]">
              <figure
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className="animate-[dc-quote-in_300ms_ease-out] motion-reduce:animate-none"
              >
                <Slide q={current} />
              </figure>
            </div>
          </div>

          <div onKeyDown={onKeyDown} className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Previous quote" onClick={() => go(index - 1)}>
              <ChevronLeft aria-hidden="true" />
            </Button>
            <ul className="flex items-center">
              {QUOTES.map((q, i) => (
                <li key={q.name}>
                  <button
                    type="button"
                    aria-label={`Quote ${i + 1} of ${count}, from ${q.name}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => go(i)}
                    className="group grid size-7 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-2 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                        i === index ? "w-5 bg-[color:var(--dc-accent)]" : "w-2 bg-[color:var(--input)] group-hover:bg-muted-foreground",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Next quote" onClick={() => go(index + 1)}>
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
