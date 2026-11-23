// Newspaper pull-quote testimonials (design image L7).
// The quotes below are sample copy for the demo publication. Replace them with real readers' words.
import { Container, DoubleRule } from "./shared"

export type Quote = { quote: string; name: string; source: string }

const lead: Quote = {
  quote: "The best place I’ve found to read thoughtful, independent writing online. It’s essential to my week.",
  name: "Maya Lin",
  source: "The Long Letter",
}

const more: Quote[] = [
  { quote: "Consistently clear, original, and worth reading.", name: "Evan Park", source: "The Civic Review" },
  { quote: "A rare mix of depth, curiosity, and care.", name: "Clara Doyle", source: "River Journal" },
  { quote: "Thoughtful, independent, and refreshingly patient.", name: "Miles Grant", source: "The Public Note" },
]

function Byline({ name, source, size }: { name: string; source: string; size: "lg" | "sm" }) {
  return (
    <p className={size === "lg" ? "mt-[30px] font-serif text-[26px] md:text-[32px]" : "mt-[18px] font-serif text-[20px] md:text-[22px]"}>
      <span className="mr-[14px] inline-block h-[2px] w-[44px] translate-y-[-7px] bg-press align-middle" aria-hidden />
      <span className="font-bold text-ink">{name},</span> <span className="italic text-ink">{source}</span>
    </p>
  )
}

export function Testimonials({ featured = lead, quotes = more }: { featured?: Quote; quotes?: Quote[] }) {
  return (
    <Container>
      <figure className="mx-auto max-w-[980px] text-center">
        <blockquote className="font-serif text-[34px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink md:text-[52px] md:leading-[1.2] xl:text-[60px] xl:leading-[77px]">
          “{featured.quote}”
        </blockquote>
        <figcaption>
          <Byline name={featured.name} source={featured.source} size="lg" />
        </figcaption>
      </figure>
      <DoubleRule className="mt-[84px]" />
      <div className="mt-[56px] grid gap-10 md:grid-cols-3 md:gap-0">
        {quotes.map((q, i) => (
          <figure key={q.name} className={i > 0 ? "md:border-l md:border-divider md:pl-[40px]" : "md:pr-[40px]"}>
            <blockquote className="font-serif text-[24px] leading-[1.25] text-ink md:text-[29px]">“{q.quote}”</blockquote>
            <figcaption>
              <Byline name={q.name} source={q.source} size="sm" />
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  )
}
