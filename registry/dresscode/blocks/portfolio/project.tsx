// The Work page and a project's own page. A project reads as a case study (the brief, the numbers,
// the story with figures between its parts, the client's words) or as a gallery (the pictures first),
// whichever its `layout` in data.ts says. Both end with the credits and the next project.
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { PlateImage, ProjectCover } from "./covers"
import { PROJECTS, type Project, type Variant } from "./data"
import { Gallery } from "./gallery"
import { PageFrame, PageIntro, WRAP } from "./shell"
import { nextProject, to } from "./site"
import { WorkBrowser } from "./work"

export function WorkPage({ base, variant }: { base: string; variant: Variant }) {
  const years = `${PROJECTS.at(-1)?.year} to ${PROJECTS[0]?.year}`
  return (
    <PageFrame base={base} variant={variant} current="work">
      <PageIntro title="Work" lead={`${PROJECTS.length} projects from ${years}: products, brands, type and print. Filter by what you came for.`} />
      <div className={WRAP}>
        <WorkBrowser base={base} variant={variant} />
      </div>
    </PageFrame>
  )
}

function ProjectHeader({ base, p }: { base: string; p: Project }) {
  const facts: [string, string][] = [["Client", p.client], ["Year", p.year], ...p.facts]
  return (
    <header className={cn(WRAP, "pt-8 sm:pt-12")}>
      <nav aria-label="Breadcrumb" className="pf-rise text-[14px] text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href={to(base, "work")} className="hover:text-foreground">
              Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {p.title}
          </li>
        </ol>
      </nav>
      <h1 className="dc-h pf-rise mt-6 text-[48px] leading-[0.98] sm:text-[88px]">{p.title}</h1>
      <div className="mt-8 grid gap-10 sm:mt-12 md:grid-cols-12 md:gap-8">
        <div className="pf-rise md:col-span-7" style={{ animationDelay: "90ms" }}>
          <p className="text-[19px] leading-relaxed sm:text-[22px]">{p.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <li key={t}>
                <Link href={`${to(base, "work")}?tag=${t}`} className="inline-flex h-7 items-center rounded-full border border-border px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <dl className="pf-rise grid grid-cols-2 content-start gap-x-6 gap-y-5 text-[14px] md:col-span-4 md:col-start-9" style={{ animationDelay: "160ms" }}>
          {facts.map(([k, v]) => (
            <div key={k} className="border-t border-border pt-3">
              <dt className="text-[12px] text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}

function Figure({ p, i, className }: { p: Project; i: number; className?: string }) {
  const plate = p.plates[i]
  if (!plate) return null
  return (
    <figure className={cn("pf-grow", className)}>
      <div className="overflow-hidden rounded-[var(--dc-radius-card)]" style={{ aspectRatio: plate.ratio }}>
        <PlateImage project={p} plate={plate} />
      </div>
      <figcaption className="mt-3 text-[14px] text-muted-foreground">{plate.caption}</figcaption>
    </figure>
  )
}

/** A heading on the left, the text on the right: the case study's rhythm. */
function Part({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("grid gap-5 md:grid-cols-12 md:gap-8", className)}>
      <h2 className="dc-h text-[26px] leading-tight sm:text-[32px] md:col-span-4">{title}</h2>
      <div className="grid gap-5 text-[17px] leading-relaxed text-muted-foreground md:col-span-7 md:col-start-6 [&>p:first-child]:text-foreground">{children}</div>
    </section>
  )
}

function Credits({ p }: { p: Project }) {
  return (
    <section aria-labelledby="credits-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
      <div className="grid gap-5 border-t border-border pt-8 md:grid-cols-12 md:gap-8">
        <h2 id="credits-h" className="text-[15px] font-medium md:col-span-4">
          Credits
        </h2>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 md:col-span-7 md:col-start-6">
          {p.credits.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 text-[15px]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function NextProject({ base, p }: { base: string; p: Project }) {
  const n = nextProject(p.slug)
  return (
    <div className={cn(WRAP, "mt-16 sm:mt-24")}>
      <Link href={to(base, "work", n.slug)} className="group block border-t border-border pt-8">
        <span className="flex items-baseline justify-between text-[14px] text-muted-foreground">
          Next project <span className="dc-num">{n.year}</span>
        </span>
        <span className="mt-5 grid items-end gap-6 md:grid-cols-2 md:gap-8">
          <span className="dc-h flex items-center gap-4 text-[44px] leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-[72px]">
            {n.title} <ArrowRight className="size-[0.6em] shrink-0" aria-hidden="true" />
          </span>
          <span className="block aspect-[16/10] overflow-hidden rounded-[var(--dc-radius-card)]">
            <span className="block size-full transition-transform duration-700 group-hover:scale-[1.03]">
              <ProjectCover project={n} />
            </span>
          </span>
        </span>
      </Link>
    </div>
  )
}

export function ProjectPage({ base, variant, slug }: { base: string; variant: Variant; slug: string }) {
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) return null
  return (
    <PageFrame base={base} variant={variant} current="project">
      <article>
        <ProjectHeader base={base} p={p} />
        {p.layout === "gallery" ? <GalleryBody p={p} /> : <CaseStudyBody p={p} />}
        <Credits p={p} />
      </article>
      <NextProject base={base} p={p} />
    </PageFrame>
  )
}

function CaseStudyBody({ p }: { p: Project }) {
  // A figure after each part of the story; any left over go at the end, two to a row.
  const rest = p.plates.slice(p.sections.length)
  return (
    <>
      <div className={cn(WRAP, "mt-14 sm:mt-20")}>
        <div className="pf-grow aspect-[4/3] overflow-hidden rounded-[var(--dc-radius-card)] md:aspect-[16/9]">
          <ProjectCover project={p} />
        </div>
      </div>
      <div className={cn(WRAP, "mt-20 grid gap-20 sm:mt-28 sm:gap-28")}>
        <Part title="The brief">
          <p className="text-[20px] sm:text-[24px]">{p.brief}</p>
        </Part>
        {p.metrics ? (
          <dl className="grid gap-8 border-y border-border py-10 sm:grid-cols-3">
            {p.metrics.map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="dc-h dc-num block text-[52px] leading-none sm:text-[64px]">{n}</span>
                  <span className="mt-3 block text-[15px] text-muted-foreground">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {p.sections.map((s, i) => (
          <div key={s.title} className="grid gap-14 sm:gap-20">
            <Part title={s.title}>
              {s.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </Part>
            <Figure p={p} i={i} className={p.plates[i]?.ratio === "16/9" ? "" : "md:mx-auto md:w-[78%]"} />
          </div>
        ))}
        {rest.length ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {rest.map((_, k) => (
              <Figure key={k} p={p} i={p.sections.length + k} />
            ))}
          </div>
        ) : null}
        {p.quote ? (
          <figure className="mx-auto max-w-[900px] text-center">
            <blockquote className="dc-h text-[28px] leading-[1.22] sm:text-[40px]">“{p.quote.text}”</blockquote>
            <figcaption className="mt-6 text-[14px] text-muted-foreground">
              <span className="font-medium text-foreground">{p.quote.name}</span>, {p.quote.role}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </>
  )
}

function GalleryBody({ p }: { p: Project }) {
  return (
    <>
      <div className={cn(WRAP, "mt-14 sm:mt-20")}>
        <Gallery project={p} />
      </div>
      <div className={cn(WRAP, "mt-16 grid gap-16 sm:mt-24")}>
        <Part title="The brief">
          <p className="text-[20px] sm:text-[24px]">{p.brief}</p>
        </Part>
        {p.sections.map((s) => (
          <Part key={s.title} title={s.title}>
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </Part>
        ))}
      </div>
    </>
  )
}
