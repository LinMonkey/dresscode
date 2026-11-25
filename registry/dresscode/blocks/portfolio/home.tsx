// The two home pages. IndexHome: who you are in one sentence, the work as a list of big titles (the
// cover follows the cursor), about, experience and writing; for developers and product people.
// GridHome: the covers first, with a filter and a viewer; for visual work.
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { CLIENTS, EXPERIENCE, PERSON, POSTS, PROJECTS, SERVICES, TESTIMONIALS } from "./data"
import { PageFrame, SectionHead, WRAP } from "./shell"
import { formatDate, to } from "./site"
import { StatusDot } from "./ui"
import { FilteredGrid, WorkIndex } from "./work"

function Words({ text, from = 0 }: { text: string; from?: number }) {
  return text.split(" ").map((w, i) => (
    <span key={i}>
      <span className="pf-word" style={{ animationDelay: `${(from + i) * 45}ms` }}>
        {w}
      </span>{" "}
    </span>
  ))
}

export function PostList({ base, posts, className }: { base: string; posts: typeof POSTS; className?: string }) {
  return (
    <ol className={cn("border-t border-border", className)}>
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={to(base, "writing", p.slug)} className="group grid gap-1 border-b border-border py-5 sm:grid-cols-[150px_1fr_auto] sm:items-baseline sm:gap-6">
            <time dateTime={p.date} className="dc-num text-[13px] text-muted-foreground">
              {formatDate(p.date)}
            </time>
            <span>
              <span className="block text-[17px] font-medium underline-offset-4 group-hover:underline">{p.title}</span>
              <span className="mt-1 block text-[14px] text-muted-foreground">{p.summary}</span>
            </span>
            <span className="text-[13px] text-muted-foreground">{p.minutes} min read</span>
          </Link>
        </li>
      ))}
    </ol>
  )
}

export function IndexHome({ base }: { base: string }) {
  const years = `${PROJECTS.at(-1)?.year} – ${PROJECTS[0]?.year}`
  return (
    <PageFrame base={base} variant="index" current="home">
      <section className={cn(WRAP, "pt-12 pb-20 sm:pt-24 sm:pb-28")}>
        <h1 className="dc-h max-w-[1040px] text-[40px] leading-[1.04] sm:text-[60px] lg:text-[72px]">
          <Words text={PERSON.name} />
          <span className="text-muted-foreground">
            <Words text={PERSON.headline} from={2} />
          </span>
        </h1>
        <div className="pf-rise mt-10 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: "650ms" }}>
          <div className="grid gap-2 text-[15px]">
            <p className="flex items-center gap-2.5">
              <StatusDot /> {PERSON.available}
            </p>
            <p className="text-muted-foreground">Previously at {PERSON.previously.join(", ")}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-10 px-4" nativeButton={false} render={<a href="#work" />}>
              Selected work <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-10 px-4" nativeButton={false} render={<a href={`mailto:${PERSON.email}`} />}>
              Email me
            </Button>
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="work-h" className={cn(WRAP, "scroll-mt-6")}>
        <div className="flex items-end justify-between gap-4 pb-5">
          <h2 id="work-h" className="dc-h text-[28px] leading-tight sm:text-[34px]">
            Selected work
          </h2>
          <span className="dc-num text-[13px] text-muted-foreground">
            {PROJECTS.length} projects, {years}
          </span>
        </div>
        <WorkIndex base={base} />
      </section>

      <section aria-label="About" className={cn(WRAP, "grid gap-14 py-24 sm:py-32 md:grid-cols-12 md:gap-8")}>
        <div className="md:col-span-5">
          <SectionHead title="About" link={{ href: to(base, "about"), label: "More about me" }} />
          <div className="grid gap-4 text-[16px] leading-relaxed text-muted-foreground">
            {PERSON.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link href={to(base, "now")} className="group mt-7 block rounded-[var(--dc-radius-card)] border border-border p-4 transition-colors hover:bg-muted/60">
            <span className="flex items-center justify-between text-[13px] font-medium">
              Now <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
            <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{PERSON.now}</span>
          </Link>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <SectionHead title="Experience" link={{ href: to(base, "resume"), label: "Resume" }} />
          <ol className="border-t border-border">
            {EXPERIENCE.map((e) => (
              <li key={e.org} className="grid grid-cols-[110px_1fr] gap-4 border-b border-border py-4 sm:grid-cols-[130px_1fr]">
                <span className="dc-num pt-0.5 text-[13px] text-muted-foreground">{e.years}</span>
                <span>
                  <span className="block text-[15px] font-medium">{e.role}</span>
                  <span className="block text-[14px] text-muted-foreground">
                    {e.org}, {e.place}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="writing-h" className={WRAP}>
        <SectionHead id="writing-h" title="Writing" link={{ href: to(base, "writing"), label: "All posts" }} />
        <PostList base={base} posts={POSTS.slice(0, 3)} />
      </section>
    </PageFrame>
  )
}

export function GridHome({ base }: { base: string }) {
  const quote = TESTIMONIALS[0]
  return (
    <PageFrame base={base} variant="grid" current="home">
      <div className={cn(WRAP, "pt-8 sm:pt-14")}>
        <FilteredGrid base={base}>
          <div>
            <h1 className="dc-h pf-rise max-w-[760px] text-[38px] leading-[1.04] sm:text-[56px]">{PERSON.tagline}</h1>
            <p className="pf-rise mt-4 flex items-center gap-2.5 text-[15px] text-muted-foreground" style={{ animationDelay: "90ms" }}>
              <StatusDot /> {PERSON.available}
            </p>
          </div>
        </FilteredGrid>

        <figure className="mx-auto mt-28 max-w-[860px] text-center sm:mt-36">
          <blockquote className="dc-h text-[26px] leading-[1.25] sm:text-[36px]">“{quote.text}”</blockquote>
          <figcaption className="mt-5 text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">{quote.name}</span>, {quote.role}
          </figcaption>
        </figure>

        <section aria-label="About, services and clients" className="mt-28 grid gap-12 border-t border-border pt-14 sm:mt-36 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="dc-h text-[26px]">About</h2>
            <div className="mt-4 grid gap-3 text-[15px] leading-relaxed text-muted-foreground">
              {PERSON.bio.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
            <Link href={to(base, "about")} className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline">
              More about me <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="dc-h text-[26px]">Services</h2>
            <ul className="mt-4 grid gap-4">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <p className="text-[15px] font-medium">{s.title}</p>
                  <p className="mt-0.5 text-[14px] text-muted-foreground">{s.note}</p>
                </li>
              ))}
            </ul>
            <Link href={to(base, "services")} className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline">
              Services and prices <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="dc-h text-[26px]">Clients</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[15px] text-muted-foreground md:grid-cols-1">
              {CLIENTS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageFrame>
  )
}
