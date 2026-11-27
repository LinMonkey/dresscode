import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { POSTS } from "../portfolio/data"

import { EDITIONS, type GardenBlock } from "./garden-data"
import { GardenHeader, GardenLeaf, GardenNewsletter } from "./garden-frame"
import { GARDEN_IMAGES } from "./assets"
import { GardenContents } from "./garden-contents"
import { GARDEN_NOTES } from "./garden-notes-data"
import { to } from "../portfolio/site"
import { Prose } from "../portfolio/writing"

const serif = "font-[family-name:var(--dc-font-heading)]"
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const shortDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

function dateLabel(iso: string, formatter = dateFormat) {
  return formatter.format(new Date(`${iso}T00:00:00Z`))
}

function GardenText({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
      <code key={index} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[.83em]">
        {part.slice(1, -1)}
      </code>
    ) : part,
  )
}

function ArticleBlock({
  block,
  headingId,
  noteNumber,
  opening,
}: {
  block: GardenBlock
  headingId?: string
  noteNumber?: number
  opening: boolean
}) {
  switch (block.type) {
    case "p": {
      const aside = "sidenote" in block && noteNumber ? { number: noteNumber, text: block.sidenote } : null
      return (
        <div className={cn(aside && "lg:grid lg:grid-cols-[minmax(0,1fr)_0] lg:items-start", !opening && "mt-1.5")}>
          <p className={cn(
            opening && "first-letter:float-left first-letter:mt-0.5 first-letter:mr-4 first-letter:font-[family-name:var(--dc-font-heading)] first-letter:text-[4.4em] first-letter:leading-[.78] first-letter:font-semibold first-letter:italic sm:first-letter:mr-6 lg:first-letter:mb-[.2em]",
          )}>
            <GardenText text={block.text} />
            {aside ? (
              <sup>
                <a
                  id={`note-ref-${aside.number}`}
                  href={`#sidenote-${aside.number}`}
                  aria-label={`Read note ${aside.number}`}
                  className="scroll-mt-8 px-0.5 font-semibold underline-offset-2 hover:underline focus-visible:outline-2"
                >
                  {aside.number}
                </a>
              </sup>
            ) : null}
          </p>
          {aside ? (
            <aside
              id={`sidenote-${aside.number}`}
              tabIndex={-1}
              aria-label={`Note ${aside.number}`}
              className={cn(
                serif,
                "relative mt-3 scroll-mt-8 pl-4 text-sm leading-snug text-muted-foreground italic lg:mt-1 lg:ml-[var(--garden-article-gap)] lg:w-[clamp(7rem,13vw,11rem)] lg:text-[clamp(1rem,1.4vw,1.25rem)]",
              )}
            >
              <a
                href={`#note-ref-${aside.number}`}
                aria-label={`Return to note ${aside.number} in the essay`}
                className="absolute top-0 left-0 text-[.7em] underline-offset-2 hover:underline focus-visible:outline-2"
              >
                {aside.number}
              </a>
              <GardenText text={aside.text} />
            </aside>
          ) : null}
        </div>
      )
    }
    case "h2":
      return (
        <h2
          id={headingId}
          tabIndex={-1}
          className={cn(serif, "mt-[clamp(1.5rem,2.35vw,2.125rem)] scroll-mt-8 text-[clamp(1.625rem,2.9vw,2.625rem)] leading-[1.06] font-semibold tracking-tight italic")}
        >
          {block.text}
        </h2>
      )
    case "figure":
      return (
        <figure className="mt-[clamp(1.875rem,5vw,4.75rem)]">
          <div className="relative aspect-[1.88] bg-[color:var(--dc-surface)]">
            <Image src={GARDEN_IMAGES[block.image]} alt={block.alt} fill unoptimized sizes="(min-width: 1024px) 58vw, 94vw" className="object-cover" />
          </div>
          <figcaption className={cn(serif, "mt-2 text-[clamp(.95rem,1.55vw,1.375rem)] leading-snug italic")}>
            {block.caption}
          </figcaption>
        </figure>
      )
    case "quote":
      return (
        <blockquote className={cn(serif, "mt-[clamp(1.5rem,2.5vw,2.375rem)] border-l-4 border-[color:var(--dc-highlight)] py-1 pl-5 text-[clamp(1.625rem,3.05vw,2.75rem)] leading-[1.12] font-medium tracking-tight italic sm:pl-7")}>
          <GardenText text={block.text} />
        </blockquote>
      )
    case "list":
      return (
        <ul className="mt-4 grid list-disc gap-2 pl-6 marker:text-muted-foreground">
          {block.items.map((item, index) => <li key={index}><GardenText text={item} /></li>)}
        </ul>
      )
    case "note":
      return (
        <aside className="mt-5 border-l-2 border-[color:var(--dc-highlight)] pl-4 text-[.9em] text-muted-foreground">
          <span className="font-medium text-foreground">Note. </span><GardenText text={block.text} />
        </aside>
      )
    case "code":
      return <Prose blocks={[block]} className="mt-5" />
  }
}

export function GardenArticle({ base, slug }: { base: string; slug: string }) {
  const post = POSTS.find((item) => item.slug === slug)
  if (!post) return null

  const { body, figure, summary, updated } = EDITIONS[post.slug] ?? {}
  const blocks = body ?? (figure ? [...post.body.slice(0, 1), figure, ...post.body.slice(1)] : post.body)
  const openingParagraph = blocks.findIndex((block) => block.type === "p")
  const linkedNotes = GARDEN_NOTES.filter((note) => note.links.includes(slug))
  const headings: { id: string; label: string }[] = []
  const headingIds = new Set<string>()
  let noteCount = 0
  const articleBlocks = blocks.map((block, index) => {
    let headingId: string | undefined
    if (block.type === "h2") {
      const headingBase = block.text.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-|-$/g, "") || "section"
      headingId = headingBase
      for (let suffix = 2; headingIds.has(headingId); suffix += 1) {
        headingId = `${headingBase}-${suffix}`
      }
      headingIds.add(headingId)
      headings.push({ id: headingId, label: block.text })
    }
    const noteNumber = "sidenote" in block ? ++noteCount : undefined
    return <ArticleBlock key={index} block={block} headingId={headingId} noteNumber={noteNumber} opening={index === openingParagraph} />
  })

  return (
    <>
      <GardenHeader base={base} />
      <main id="main">
        <article className="mx-auto grid w-full max-w-[1440px] px-5 pt-[clamp(1.625rem,2.65vw,2.5rem)] pb-[clamp(2rem,3.2vw,3rem)] sm:px-[min(3vw,2.75rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,61%)_minmax(0,1fr)] lg:gap-x-[var(--garden-article-gap)] lg:[--garden-article-gap:clamp(1.75rem,5.2vw,4.75rem)]">
          <header className="mb-[clamp(1.625rem,2.8vw,2.625rem)] min-w-0 lg:col-start-2">
            <p className="flex flex-wrap items-center gap-x-2.5 text-[clamp(1rem,1.75vw,1.5rem)] leading-snug">
              <span>Essay</span>
              <span aria-hidden="true">·</span>
              <GardenLeaf stage="Evergreen" />
            </p>
            <h1 className={cn(serif, "mt-2 max-w-[9.35em] text-[clamp(2.625rem,5.2vw,4.625rem)] leading-[.99] font-semibold tracking-[-.035em] italic")}>
              {post.title}
            </h1>
            <p className={cn(serif, "mt-3 text-[clamp(1.25rem,1.77vw,1.625rem)] leading-snug italic lg:-mr-10")}>
              {summary ?? post.summary}
            </p>
            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[clamp(.875rem,1.48vw,1.25rem)] leading-snug">
              <span>{post.minutes} min read</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{dateLabel(post.date)}</time>
              {updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated <time dateTime={updated}>{dateLabel(updated, updated.slice(0, 4) === post.date.slice(0, 4) ? shortDateFormat : dateFormat)}</time></span>
                </>
              ) : null}
            </p>
          </header>
          <GardenContents key={post.slug} headings={headings} />
          <div className="min-w-0 text-[clamp(1.125rem,1.86vw,1.625rem)] leading-[1.3] tracking-[-.01em] lg:col-start-2 lg:row-start-2">
            {articleBlocks}
          </div>
          {linkedNotes.length ? (
            <section aria-labelledby="linked-notes-title" className="mt-[clamp(1.625rem,2.4vw,2.25rem)] border-t border-border pt-3 lg:col-start-2 lg:-mx-[clamp(1.25rem,3.2vw,3rem)]">
              <h2 id="linked-notes-title" className={cn(serif, "text-[clamp(1.375rem,2.05vw,1.875rem)] leading-tight font-semibold italic")}>Linked from</h2>
              <ul className="mt-2.5 grid gap-3 sm:grid-cols-2 sm:gap-5">
                {linkedNotes.map((note) => (
                  <li key={note.slug}>
                    <Link
                      href={`${to(base)}#note-${note.slug}`}
                      className="group block h-full rounded-xl border border-border px-4 py-3 transition-colors hover:bg-[color:var(--dc-surface)] focus-visible:outline-2 focus-visible:outline-offset-3 sm:px-5"
                    >
                      <div className="text-[clamp(.875rem,1.4vw,1.25rem)]"><GardenLeaf stage={note.stage} /></div>
                      <p className={cn(serif, "mt-1 text-[clamp(1.35rem,2.05vw,1.875rem)] leading-tight font-semibold tracking-tight underline-offset-4 group-hover:underline")}>
                        {note.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
        <GardenNewsletter />
      </main>
    </>
  )
}
