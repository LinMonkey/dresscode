// Services and Contact. Services: what you do, three ways to hire you with prices, how a project runs,
// what clients say and the questions people ask first. Contact: the project form, and every other way
// to reach you next to it.
import { ArrowUpRight, CalendarDays, Check, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ContactForm } from "./contact-form"
import { FAQ, PACKAGES, PERSON, PROCESS, SERVICES, TESTIMONIALS, type Variant } from "./data"
import { PageFrame, PageIntro, SectionHead, WRAP } from "./shell"
import { to } from "./site"
import { CopyEmail, LocalTime, StatusDot } from "./ui"

export function ServicesPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="services">
      <PageIntro title="Services" lead="One product at a time, from the first interview to the front-end that ships. Here is what that can look like, and what it costs." />

      <section aria-label="What I do" className={WRAP}>
        <ol className="border-t border-border">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <span className="dc-num text-[13px] text-muted-foreground md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="dc-h text-[28px] leading-tight sm:text-[34px] md:col-span-4">{s.title}</h2>
              <p className="text-[16px] leading-relaxed text-muted-foreground md:col-span-4">{s.body}</p>
              <ul className="grid gap-1.5 text-[14px] md:col-span-3">
                {s.gets.map((g) => (
                  <li key={g} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="prices-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="prices-h" title="Ways to work together" />
        <ul className="grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li key={p.name} className={cn("dc-card relative flex flex-col p-6 sm:p-8", p.featured && "ring-2 ring-[color:var(--dc-accent)]")}>
              {p.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--dc-accent)] px-2.5 py-0.5 text-[12px] font-medium text-[color:var(--dc-page)]">Most booked</span>
              ) : null}
              <h3 className="text-[17px] font-medium">{p.name}</h3>
              <p className="mt-1 text-[14px] text-muted-foreground">{p.length}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="dc-h dc-num text-[38px] leading-none whitespace-nowrap">{p.price}</span>
                <span className="text-[14px] text-muted-foreground">{p.per}</span>
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
              <ul className="mt-6 mb-8 grid gap-2 border-t border-border pt-6 text-[14px]">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant={p.featured ? "default" : "outline"} className="mt-auto h-10" nativeButton={false} render={<Link href={to(base, "contact")} />}>
                Start a conversation
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[14px] text-muted-foreground">Prices exclude VAT. Not-for-profits and studios of under five people get a quarter off.</p>
      </section>

      <section aria-labelledby="process-h" className={cn(WRAP, "mt-24 sm:mt-32")}>
        <SectionHead id="process-h" title="How a project runs" />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-foreground pt-5">
              <span className="dc-num text-[13px] text-muted-foreground">Step {i + 1}</span>
              <h3 className="dc-h mt-2 text-[22px] leading-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="What clients say" className={cn(WRAP, "mt-24 grid gap-10 sm:mt-32 md:grid-cols-2 md:gap-8")}>
        {TESTIMONIALS.slice(0, 2).map((t) => (
          <figure key={t.name} className="border-l-2 border-[color:var(--dc-accent)] pl-6">
            <blockquote className="dc-h text-[22px] leading-[1.3] sm:text-[26px]">“{t.text}”</blockquote>
            <figcaption className="mt-4 text-[14px] text-muted-foreground">
              <span className="font-medium text-foreground">{t.name}</span>, {t.role}
            </figcaption>
          </figure>
        ))}
      </section>

      <section aria-labelledby="faq-h" className={cn(WRAP, "mt-24 grid gap-8 sm:mt-32 md:grid-cols-12")}>
        <h2 id="faq-h" className="dc-h text-[28px] leading-tight sm:text-[34px] md:col-span-4">
          Questions
        </h2>
        <div className="border-t border-border md:col-span-8">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-[620px] pb-6 text-[16px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}

export function ContactPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="contact" cta={false}>
      <PageIntro title="Let's make something." lead={`Tell me about the project, or just say hello. ${PERSON.replies}`} />
      <div className={cn(WRAP, "grid gap-16 md:grid-cols-12 md:gap-8")}>
        <ContactForm className="md:col-span-7" />
        <aside aria-label="Other ways to reach me" className="grid content-start gap-8 md:col-span-4 md:col-start-9">
          <div className="dc-card p-6">
            <p className="flex items-center gap-2.5 text-[15px] font-medium">
              <StatusDot /> {PERSON.available}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">I take one new client a quarter. If the timing is off, I will say so and suggest someone good.</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Email</p>
            <a href={`mailto:${PERSON.email}`} className="mt-1 block text-[19px] font-medium underline-offset-4 hover:underline">
              {PERSON.email}
            </a>
            <CopyEmail className="mt-3" />
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Prefer to talk?</p>
            <Button variant="outline" size="lg" className="mt-2 h-10 px-4" nativeButton={false} render={<a href={PERSON.calendar} />}>
              <CalendarDays className="size-4" aria-hidden="true" /> Book a 20-minute call
            </Button>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Where</p>
            <p className="mt-1 text-[16px]">
              {PERSON.city}, {PERSON.country} · <LocalTime /> now
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Elsewhere</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
              {PERSON.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    {l.label} <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </PageFrame>
  )
}
