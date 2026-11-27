import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { POSTS, PROJECTS, type Post } from "../portfolio/data"
import { GardenFooter, GardenHeader, GardenNewsletter } from "./garden-frame"
import { CAPTIONS, EDITIONS } from "./garden-data"
import { GARDEN_IMAGES } from "./assets"
import { GardenNotes } from "./garden-notes"
import { GARDEN_NOTES } from "./garden-notes-data"
import { to } from "../portfolio/site"

const FEATURED_SLUG = "a-map-that-breathes"

const SAMPLE_WORK = [
  {
    slug: "small-rooms",
    src: GARDEN_IMAGES.rooms,
    alt: "An open photo book with photographs and a floor plan of a small flat",
  },
  {
    slug: "kiln",
    src: GARDEN_IMAGES.kiln,
    alt: "The pottery studio's booking website next to a wall of ceramic glaze samples",
  },
  {
    slug: "fieldnotes",
    src: GARDEN_IMAGES.fieldnotes,
    alt: "A species record with a photo, name and map in the Fieldnotes app",
  },
]

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function issueImage(post: Post) {
  return EDITIONS[post.slug]?.figure ?? EDITIONS[post.slug]?.body?.find((block) => block.type === "figure")
}

function IssueDate({ post }: { post: Post }) {
  return <time dateTime={post.date}>{dateFormat.format(new Date(`${post.date}T00:00:00Z`))}</time>
}

function GardenIssue({ base, featured, otherPosts }: { base: string; featured: Post; otherPosts: Post[] }) {
  const artwork = issueImage(featured)
  const intro = EDITIONS[featured.slug]?.summary ?? featured.summary

  return (
    <section id="essays" aria-label="Essays" className={cn(
      "grid scroll-mt-6 gap-7 py-6 sm:py-8",
      otherPosts.length > 0 && "lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-5",
    )}>
      <article className="min-w-0">
        <Link href={to(base, "writing", featured.slug)} aria-labelledby="garden-feature-title" className={cn("group block", focus)}>
          {artwork && (
            <div className="relative aspect-[2.06] bg-card">
              <Image src={GARDEN_IMAGES[artwork.image]} alt={artwork.alt} fill unoptimized loading="eager" fetchPriority="high" className="object-cover" />
            </div>
          )}
          <p className="mt-3 text-sm font-medium text-[color:var(--dc-accent)] underline underline-offset-4 sm:text-base">Essay</p>
          <h2 id="garden-feature-title" className="dc-h mt-1 text-[clamp(2rem,3.45vw,3.3rem)] leading-[1.03] text-wrap-pretty italic group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {featured.title}
          </h2>
          <p className="mt-2 max-w-[68ch] text-[clamp(1.13rem,1.75vw,1.55rem)] leading-tight text-pretty text-muted-foreground italic [font-family:var(--dc-font-heading)]">
            {intro}
          </p>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {featured.minutes} min read · <IssueDate post={featured} />
          </p>
        </Link>
      </article>
      {otherPosts.length > 0 && (
        <aside aria-labelledby="garden-issue-title" className="min-w-0 lg:border-l lg:border-border lg:pl-6">
          <h2 id="garden-issue-title" className="dc-h border-b border-border pb-3 text-[clamp(1.9rem,3.1vw,2.8rem)] leading-none italic">
            In this issue
          </h2>
          <ul className="grid divide-y divide-border md:grid-cols-3 md:divide-y-0 md:gap-4 lg:grid-cols-1 lg:divide-y lg:gap-0">
            {otherPosts.map((post) => {
              const image = issueImage(post)
              return (
                <li key={post.slug} className="min-w-0 py-4 first:pt-5 last:pb-0 md:first:pt-4 lg:first:pt-5">
                  <Link href={to(base, "writing", post.slug)} className={cn(
                    "group flex items-start gap-4 md:flex-col lg:flex-row lg:gap-5",
                    focus,
                  )}>
                    {image && (
                      <div className="relative aspect-[1.35] w-[36%] max-w-48 shrink-0 bg-card md:w-full md:max-w-none lg:w-[39%]">
                        <Image src={GARDEN_IMAGES[image.image]} alt="" fill unoptimized className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="dc-h text-[clamp(1.22rem,1.83vw,1.75rem)] leading-[1.06] text-wrap-pretty group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        <IssueDate post={post} />
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>
      )}
    </section>
  )
}

function GardenWork({ base }: { base: string }) {
  const selected = SAMPLE_WORK.flatMap((sample) => PROJECTS.filter(({ slug }) => slug === sample.slug))
  const remaining = PROJECTS.filter((project) => !selected.includes(project))
  const work = [...selected, ...remaining].slice(0, 3)

  if (work.length === 0) return null

  return (
    <section id="work" aria-labelledby="garden-work-title" className="scroll-mt-6 border-t border-border pt-5 pb-7">
      <h2 id="garden-work-title" className="dc-h mb-4 text-4xl leading-tight italic sm:text-5xl">Selected work</h2>
      <div className={cn("grid items-start gap-5 md:gap-x-7 md:gap-y-4", work.length > 1 && "md:grid-cols-[minmax(0,1.36fr)_minmax(0,1fr)]")}>
        {work.map((project, index) => {
          const { slug, title, summary, image } = project
          const sample = SAMPLE_WORK.find((item) => item.slug === slug)
          const src = image || sample?.src
          const label = `${title} — ${CAPTIONS[slug] ?? summary}`
          const labelId = `garden-work-${slug}`
          const captionStyle = "text-base leading-snug text-pretty italic [font-family:var(--dc-font-heading)] group-hover:underline group-hover:underline-offset-4 sm:text-lg"

          return (
            <Link
              key={slug}
              href={to(base, "work", slug)}
              aria-labelledby={labelId}
              className={cn("group block min-w-0", focus, index === 0 && work.length === 3 && "md:row-span-2")}
            >
              {src ? (
                <figure>
                  <div className={cn("relative bg-card", index === 0 ? "aspect-[1.83]" : "aspect-[3.05]")}>
                    <Image src={src} alt={image ? title : sample?.alt ?? title} fill unoptimized className="object-cover" />
                  </div>
                  <figcaption id={labelId} className={cn("mt-2", captionStyle)}>
                    {label}
                  </figcaption>
                </figure>
              ) : (
                <p id={labelId} className={cn("border-t border-border py-3", captionStyle)}>{label}</p>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function GardenHome({ base }: { base: string }) {
  const featured = POSTS.find(({ slug }) => slug === FEATURED_SLUG) ?? POSTS[0]
  const otherPosts = POSTS.filter(({ slug }) => slug !== featured?.slug).slice(0, 3)
  const notes = GARDEN_NOTES.map((note) => ({
    ...note,
    essays: POSTS
      .filter(({ slug }) => note.links.includes(slug))
      .map(({ slug, title }) => ({ href: to(base, "writing", slug), title })),
  }))

  return (
    <>
      <GardenHeader base={base} home />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
          {featured && <GardenIssue base={base} featured={featured} otherPosts={otherPosts} />}
          <GardenNotes notes={notes} />
          <GardenWork base={base} />
        </div>
        <GardenNewsletter />
      </main>
      <GardenFooter base={base} />
    </>
  )
}
