// A magazine front page: a masthead over a double rule, the lead story beside a "Most read" list,
// the latest pieces in three columns, a signup band and the short field notes. Made only from Folio
// components, so `shadcn add` gives you everything it uses.
import { ArticleHeader } from "@/components/ui/article-header"
import { Button } from "@/components/ui/button"
import { NewsletterSignup } from "@/components/ui/newsletter-signup"

const sections = ["Essays", "Field notes", "Reading lists", "Letters", "Archive"]

const lead = {
  kicker: "Essays",
  title: "The case for slower work",
  dek: "Most of what we call productivity is speed. A year of writing every other week instead of every week changed what got written, and who read it.",
  author: { name: "Maya Chen", role: "editor" },
  date: "February 1, 2026",
  dateTime: "2026-02-01",
  readingTime: "9 min read",
  img: "/folio/placeholder/editor-morning.jpg",
  alt: "A closed book and a mug on a wooden table beside a window",
}

const latest = [
  {
    kicker: "Field notes",
    title: "What a month without a phone at breakfast did",
    dek: "Two hundred readers tried it with us. Most kept going.",
    date: "January 25, 2026",
    img: "/folio/placeholder/blog-desk.png",
    alt: "A notebook and a pen beside a cup of coffee",
  },
  {
    kicker: "Reading lists",
    title: "Twelve long books for short winter days",
    dek: "One chapter a morning, and none of them for work.",
    date: "January 18, 2026",
    img: "/folio/placeholder/blog-skyline.png",
    alt: "A city seen from a hill, under a branch",
  },
  {
    kicker: "Letters",
    title: "Readers on the hour before email",
    dek: "The best replies to last month's essay, lightly edited.",
    date: "January 11, 2026",
    img: "/folio/placeholder/blog-building.png",
    alt: "The corner of an old stone building",
  },
]

const mostRead = [
  "The hour before email",
  "Why we stopped counting opens",
  "A reading list for people who say they have no time",
  "Notes from a long winter",
  "On attention and ambition",
]

const notes = [
  { date: "Jan 30", text: "The archive now has search. Try “drafts”, which turns up 212 of them." },
  { date: "Jan 27", text: "Thank you to the 61 readers who became paid subscribers this month." },
  { date: "Jan 22", text: "The next issue is a week late, on purpose. It needs the time." },
  { date: "Jan 16", text: "Letters are open again: reply to any issue and it reaches the editor." },
]

export default function MagazineFrontPage() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 py-3 text-[14px] text-ink-2">
          <p>Sunday, February 1, 2026</p>
          <div className="flex items-center gap-4">
            <a href="#sign-in" className="hover:text-ink">
              Sign in
            </a>
            <Button size="sm">Subscribe</Button>
          </div>
        </div>
        <div className="border-t-2 border-rule pt-6 pb-5 text-center">
          <h1 className="font-serif text-[44px] leading-none font-bold tracking-[-0.035em] sm:text-[60px] lg:text-masthead">The Long Letter</h1>
          <p className="mt-3 font-serif text-[18px] text-ink-2 italic">Essays on work, reading and attention, every other Sunday</p>
        </div>
        <nav aria-label="Sections">
          <div className="folio-double-rule" aria-hidden />
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-3 text-[15px]">
            {sections.map((s) => (
              <li key={s}>
                <a href={`#${s.toLowerCase().replaceAll(" ", "-")}`} className="text-ink-2 hover:text-ink">
                  {s}
                </a>
              </li>
            ))}
          </ul>
          <div className="folio-double-rule" aria-hidden />
        </nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 pb-20 md:px-8">
        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <article>
            <img src={lead.img} alt={lead.alt} className="aspect-[21/9] w-full rounded-(--radius) object-cover" />
            <ArticleHeader
              as="h2"
              className="mt-6"
              kicker={lead.kicker}
              title={
                <a href="#the-case-for-slower-work" className="hover:underline hover:decoration-2 hover:underline-offset-4">
                  {lead.title}
                </a>
              }
              dek={lead.dek}
              authors={[lead.author]}
              date={lead.date}
              dateTime={lead.dateTime}
              readingTime={lead.readingTime}
            />
          </article>

          <aside aria-labelledby="most-read" className="lg:border-l lg:border-hairline lg:pl-10">
            <h2 id="most-read" className="font-serif text-[22px] font-bold tracking-[-0.01em]">
              Most read this month
            </h2>
            <ol className="mt-4 divide-y divide-hairline border-t-2 border-rule">
              {mostRead.map((title, i) => (
                <li key={title} className="flex gap-4 py-4">
                  <span className="font-serif text-[28px] leading-none font-bold text-press tabular-nums">{i + 1}</span>
                  <a href="#most-read" className="font-serif text-[18px] leading-[1.3] font-semibold hover:underline hover:underline-offset-4">
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section aria-labelledby="latest" className="border-t-2 border-rule pt-6">
          <h2 id="latest" className="font-serif text-[28px] font-bold tracking-[-0.02em]">
            Latest
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {latest.map((p) => (
              <article key={p.title}>
                <img src={p.img} alt={p.alt} className="aspect-[3/2] w-full rounded-(--radius) object-cover" />
                <ArticleHeader
                  as="h2"
                  size="sm"
                  className="mt-4"
                  kicker={p.kicker}
                  title={
                    <a href="#latest" className="hover:underline hover:underline-offset-4">
                      {p.title}
                    </a>
                  }
                  dek={p.dek}
                  date={p.date}
                />
              </article>
            ))}
          </div>
        </section>

        <NewsletterSignup
          variant="band"
          className="mt-16"
          title="Get the next letter"
          description="One essay every other Sunday. Nothing else, and never a sale."
          note="Free. Unsubscribe from any issue."
        />

        <section aria-labelledby="field-notes" className="mt-16">
          <h2 id="field-notes" className="font-serif text-[28px] font-bold tracking-[-0.02em]">
            Field notes
          </h2>
          <ul className="mt-4 grid grid-cols-1 border-t-2 border-rule md:grid-cols-2 md:gap-x-10">
            {notes.map((n) => (
              <li key={n.date} className="flex gap-4 border-b border-hairline py-4 text-[16px] leading-[1.5]">
                <span className="w-14 shrink-0 font-semibold text-ink tabular-nums">{n.date}</span>
                <span className="text-ink-2">{n.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t-2 border-rule bg-newsprint">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 text-[14px] text-ink-2 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            <span className="font-serif text-[18px] font-bold text-ink">The Long Letter</span> · Written in Lisbon, sent every other Sunday
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {["About", "Archive", "Letters", "Privacy"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-ink">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
