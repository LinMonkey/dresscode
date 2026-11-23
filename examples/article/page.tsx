"use client"

// An article page: the header with byline, a lead photo, the essay in Prose with a drop cap, a pull
// quote and footnotes, a contents list that follows the scroll, a signup card, and more from the
// section. Made only from Folio components.
import { ArticleHeader } from "@/components/ui/article-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FootnoteRef, Footnotes } from "@/components/ui/footnotes"
import { NewsletterSignup } from "@/components/ui/newsletter-signup"
import { Prose } from "@/components/ui/prose"
import { PullQuote } from "@/components/ui/pull-quote"
import { TableOfContents, type TocEntry } from "@/components/ui/table-of-contents"

const contents: TocEntry[] = [
  { id: "a-year-of-fewer-issues", title: "A year of fewer issues" },
  { id: "what-we-measured", title: "What we measured" },
  { id: "the-replies", title: "The replies", depth: 3 },
  { id: "what-stays", title: "What stays" },
]

const notes = [
  { id: 1, content: "Our archive has 212 drafts that never went out. We counted them in December." },
  { id: 2, content: "Open rates are a rough measure since mail apps started loading images on their own. Replies are harder to fake." },
  { id: 3, content: "Quoted with the reader's permission." },
]

const more = [
  { kicker: "Essays", title: "The hour before email", date: "January 4, 2026" },
  { kicker: "Essays", title: "On attention and ambition", date: "December 14, 2025" },
  { kicker: "Essays", title: "Why we stopped counting opens", date: "November 30, 2025" },
]

export default function ArticlePage() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#home" className="font-serif text-[26px] leading-none font-bold tracking-[-0.03em]">
          The Long Letter
        </a>
        <nav aria-label="Main" className="flex items-center gap-6 text-[15px]">
          <a href="#essays" className="hidden text-ink-2 hover:text-ink sm:inline">
            Essays
          </a>
          <a href="#archive" className="hidden text-ink-2 hover:text-ink sm:inline">
            Archive
          </a>
          <Button size="sm">Subscribe</Button>
        </nav>
      </header>
      <div className="mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="folio-double-rule" aria-hidden />
      </div>

      <main className="mx-auto max-w-[1180px] px-5 pt-10 pb-20 md:px-8 lg:pt-14">
        <ArticleHeader
          kicker="Essays"
          kickerHref="#essays"
          title="The case for slower work"
          dek="Most of what we call productivity is speed. A year of writing every other week instead of every week changed what got written, and who read it."
          authors={[{ name: "Maya Chen", role: "editor" }]}
          date="February 1, 2026"
          dateTime="2026-02-01"
          readingTime="9 min read"
        />

        <figure className="mt-8">
          <img src="/folio/placeholder/editor-morning.jpg" alt="A closed book and a mug on a wooden table beside a window" className="aspect-[21/8] w-full rounded-(--radius) object-cover" />
          <figcaption className="mt-2 font-serif text-[15px] text-ink-2 italic">Fig. 1 — The desk where most issues start, at seven in the morning.</figcaption>
        </figure>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article>
            <Prose dropCap>
              <p>
                Every January the same advice comes back: do more, faster, with fewer meetings. It is good advice for a factory. For writing, it mostly
                produces more drafts that nobody needed.
                <FootnoteRef id={1} />
              </p>
              <p>
                So last February we tried the opposite. The letter went out every other Sunday instead of every Sunday, and the week in between went to
                reading, reporting and throwing things away.
              </p>

              <h2 id="a-year-of-fewer-issues">A year of fewer issues</h2>
              <p>
                Twenty-six issues instead of fifty-two. The first month felt like falling behind. By the third, the issues were longer, and the ones that
                took longest to start were the ones readers kept.
              </p>
              <PullQuote float="right" cite="A reader, in a letter last spring">
                The best issue I ever read took you three weeks.
              </PullQuote>
              <p>
                The pieces that last are usually the ones that took longest to start. Not because slowness is a virtue, but because the time went into
                deciding what was worth saying. That part does not show up in a dashboard.
              </p>

              <h2 id="what-we-measured">What we measured</h2>
              <p>
                We stopped looking at opens every morning.
                <FootnoteRef id={2} /> Instead we counted three things once a month:
              </p>
              <ul>
                <li>Replies, and how long they were.</li>
                <li>Readers who forwarded an issue to someone.</li>
                <li>Paid subscribers who stayed for a second year.</li>
              </ul>
              <p>All three went up. The open rate went up too, which nobody expected, from 48% to 55% over the year.</p>

              <h3 id="the-replies">The replies</h3>
              <blockquote>
                <p>
                  I used to save your letter for the train. Now I save the train for your letter.
                  <FootnoteRef id={3} />
                </p>
              </blockquote>
              <p>Replies doubled, and they got longer. Several turned into the next issue.</p>

              <h2 id="what-stays">What stays</h2>
              <p>
                The letter stays fortnightly. The week in between stays empty on purpose. And the drafts folder stays large, because most ideas should not
                go out, and the only way to find the ones that should is to have time to throw the rest away.
              </p>
            </Prose>

            <Footnotes items={notes} />

            <div className="mt-12 flex max-w-[68ch] items-start gap-4 border-t border-hairline pt-6">
              <Avatar>
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <p className="text-[15px] leading-[1.5] text-ink-2">
                <span className="font-semibold text-ink">Maya Chen</span> edits The Long Letter from Lisbon. She is writing a book about attention, slowly.
              </p>
            </div>

            <NewsletterSignup className="mt-10" description="One essay every other Sunday. Nothing else, and never a sale." note="Free. Unsubscribe from any issue." />
          </article>

          <aside className="hidden lg:block">
            <TableOfContents items={contents} className="sticky top-8" />
          </aside>
        </div>

        <section aria-labelledby="more" className="mt-20 border-t-2 border-rule pt-6">
          <h2 id="more" className="font-serif text-[28px] font-bold tracking-[-0.02em]">
            More essays
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            {more.map((p) => (
              <ArticleHeader
                key={p.title}
                as="h2"
                size="sm"
                kicker={p.kicker}
                title={
                  <a href="#more" className="hover:underline hover:underline-offset-4">
                    {p.title}
                  </a>
                }
                date={p.date}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
