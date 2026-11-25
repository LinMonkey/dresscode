// About and Resume. About: who you are, how you work, where you have worked, who you have worked
// with and what they say. Resume: one sheet that prints to A4 as it looks (the header, footer and
// buttons stay off the paper), so "Save as PDF" is the download.
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { CLIENTS, EDUCATION, EXPERIENCE, LANGUAGES, PERSON, PRINCIPLES, PROJECTS, RESUME_UPDATED, SKILLS, TALKS, TESTIMONIALS, type Variant } from "./data"
import { PageFrame, SectionHead, WRAP } from "./shell"
import { formatDate, to } from "./site"
import { PrintButton } from "./ui"

function Portrait() {
  if (PERSON.portrait)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={PERSON.portrait} alt={PERSON.name} className="aspect-[4/5] w-full rounded-[var(--dc-radius-card)] object-cover" />
  return (
    <div className="dc-band relative aspect-[4/5] w-full overflow-hidden rounded-[var(--dc-radius-card)]" role="img" aria-label={PERSON.name}>
      <span className="absolute top-5 right-5 text-[13px] text-[color:var(--dc-band-muted)]">
        {PERSON.city}, {PERSON.country}
      </span>
      <span className="dc-h absolute bottom-3 left-5 text-[clamp(96px,16vw,180px)] leading-none">{PERSON.initials}</span>
    </div>
  )
}

export function AboutPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="about">
      <section className={cn(WRAP, "grid gap-12 pt-10 sm:pt-16 md:grid-cols-12 md:gap-8")}>
        <div className="md:col-span-7">
          <h1 className="dc-h pf-rise text-[44px] leading-[1.02] sm:text-[72px]">Hi, I&apos;m {PERSON.first}.</h1>
          <div className="pf-rise mt-8 grid gap-5 text-[19px] leading-relaxed sm:text-[22px]" style={{ animationDelay: "90ms" }}>
            <p>{PERSON.intro}</p>
            {PERSON.bio.map((b) => (
              <p key={b} className="text-muted-foreground">
                {b}
              </p>
            ))}
          </div>
        </div>
        <div className="pf-rise md:col-span-4 md:col-start-9" style={{ animationDelay: "160ms" }}>
          <Portrait />
          <p className="mt-4 text-[14px] text-muted-foreground">
            {PERSON.role}, based in {PERSON.city}. Previously at {PERSON.previously.join(", ")}.
          </p>
        </div>
      </section>

      <section aria-labelledby="how-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="how-h" title="How I work" />
        <ol className="grid gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="bg-background p-6 sm:p-8">
              <span className="dc-num text-[13px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="dc-h mt-4 text-[22px] leading-tight">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="exp-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="exp-h" title="Experience" link={{ href: to(base, "resume"), label: "Full resume" }} />
        <ol className="border-t border-border">
          {EXPERIENCE.map((e) => (
            <li key={e.org} className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-8">
              <span className="dc-num text-[13px] text-muted-foreground md:col-span-2 md:pt-1">{e.years}</span>
              <span className="md:col-span-4">
                <span className="block text-[17px] font-medium">{e.role}</span>
                <span className="block text-[15px] text-muted-foreground">
                  {e.org}, {e.place}
                </span>
              </span>
              <span className="text-[15px] leading-relaxed text-muted-foreground md:col-span-6">{e.note}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="clients-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="clients-h" title="Clients" />
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border md:grid-cols-4">
          {CLIENTS.map((c) => (
            <li key={c} className="grid h-24 place-items-center bg-background px-4 text-center text-[15px] font-medium sm:h-28 sm:text-[16px]">
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="kind-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="kind-h" title="Kind words" />
        <ul className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name}>
              <figure className="dc-card flex h-full flex-col justify-between gap-8 p-6">
                <blockquote className="text-[16px] leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="text-[14px]">
                  <span className="block font-medium">{t.name}</span>
                  <span className="text-muted-foreground">{t.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn(WRAP, "mt-24 grid gap-12 sm:mt-32 md:grid-cols-2 md:gap-8")}>
        <div>
          <h2 className="dc-h text-[26px]">Elsewhere</h2>
          <ul className="mt-4 border-t border-border">
            {PERSON.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="group flex items-center justify-between border-b border-border py-4 text-[16px]">
                  {l.label} <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Link href={to(base, "now")} className="dc-card group flex flex-col justify-between gap-6 p-6 sm:p-8">
          <span>
            <span className="text-[13px] text-muted-foreground">Now</span>
            <span className="mt-2 block text-[19px] leading-relaxed">{PERSON.now}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[14px] font-medium">
            What I&apos;m up to <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      </section>
    </PageFrame>
  )
}

function ResumePart({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-border py-7 break-inside-avoid sm:grid-cols-[150px_1fr] sm:gap-8 print:grid-cols-[120px_1fr] print:gap-6 print:py-4">
      <h2 className="text-[13px] font-medium text-muted-foreground sm:pt-0.5">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

export function ResumePage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="resume" cta={false}>
      <div className={cn(WRAP, "pt-6 sm:pt-10 print:max-w-none print:p-0")}>
        <div className="mx-auto flex max-w-[880px] flex-wrap items-center justify-between gap-4 pb-6 print:hidden">
          <p className="text-[14px] text-muted-foreground">Updated {formatDate(RESUME_UPDATED)}. Prints on one A4 page.</p>
          <PrintButton />
        </div>
        <article className="dc-card pf-rise mx-auto max-w-[880px] p-6 sm:p-12 print:max-w-none print:rounded-none print:border-0 print:bg-transparent print:p-0 print:shadow-none">
          <header className="flex flex-wrap items-end justify-between gap-6 pb-8 print:pb-5">
            <div>
              <h1 className="dc-h text-[38px] leading-none sm:text-[48px] print:text-[30px]">{PERSON.name}</h1>
              <p className="mt-2 text-[16px] text-muted-foreground">{PERSON.role}</p>
            </div>
            <ul className="grid gap-0.5 text-[14px] sm:text-right print:text-right print:text-[12px]">
              <li>
                <a href={`mailto:${PERSON.email}`} className="underline-offset-4 hover:underline">
                  {PERSON.email}
                </a>
              </li>
              <li>{PERSON.site}</li>
              <li className="text-muted-foreground">
                {PERSON.city}, {PERSON.country}
              </li>
            </ul>
          </header>
          <div className="text-[15px] leading-relaxed print:text-[11.5px] print:leading-snug">
            <ResumePart title="Profile">
              <p>
                {PERSON.intro} {PERSON.bio[0]}
              </p>
            </ResumePart>
            <ResumePart title="Experience">
              <ol className="grid gap-6 print:gap-3">
                {EXPERIENCE.map((e) => (
                  <li key={e.org}>
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span>
                        <span className="font-medium">{e.role}</span>, {e.org}
                      </span>
                      <span className="dc-num text-[13px] text-muted-foreground print:text-[11px]">
                        {e.years} · {e.place}
                      </span>
                    </p>
                    <ul className="mt-1.5 grid list-disc gap-0.5 pl-5 text-muted-foreground marker:text-border">
                      {e.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </ResumePart>
            <ResumePart title="Selected work">
              <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-8 print:grid-cols-2 print:gap-x-6">
                {PROJECTS.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <span className="font-medium">{p.title}</span> <span className="text-muted-foreground">· {p.year}</span>
                    <span className="block text-muted-foreground">{p.role}</span>
                  </li>
                ))}
              </ul>
            </ResumePart>
            <ResumePart title="Skills">
              <dl className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
                {SKILLS.map((s) => (
                  <div key={s.group}>
                    <dt className="font-medium">{s.group}</dt>
                    <dd className="text-muted-foreground">{s.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </ResumePart>
            <ResumePart title="Education">
              {EDUCATION.map((e) => (
                <p key={e.title}>
                  <span className="font-medium">{e.title}</span>, {e.org} <span className="dc-num text-[13px] text-muted-foreground print:text-[11px]">· {e.years}</span>
                </p>
              ))}
            </ResumePart>
            <ResumePart title="Talks">
              <ul className="grid gap-1">
                {TALKS.map((t) => (
                  <li key={t.title}>
                    <span className="dc-num text-muted-foreground">{t.year}</span> · {t.title}, <span className="text-muted-foreground">{t.where}</span>
                  </li>
                ))}
              </ul>
            </ResumePart>
            <ResumePart title="Languages">
              <p>{LANGUAGES.join(", ")}</p>
            </ResumePart>
          </div>
        </article>
      </div>
    </PageFrame>
  )
}
