// The small pages: /uses (your desk, software and kit), /now (what you are doing this month) and the
// page-not-found page.
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { NOW, PERSON, USES, type Variant } from "./data"
import { PageFrame, PageIntro, WRAP } from "./shell"
import { formatDate, NAV, to } from "./site"

export function UsesPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="uses">
      <PageIntro title="Uses" lead="The desk, the software and the field kit I work with, for anyone who asked. Nothing here is sponsored." />
      <div className={cn(WRAP, "grid gap-16 sm:gap-20")}>
        {USES.map((g) => (
          <section key={g.group} aria-labelledby={`uses-${g.group}`} className="grid gap-5 md:grid-cols-12 md:gap-8">
            <h2 id={`uses-${g.group}`} className="dc-h text-[26px] md:col-span-3">
              {g.group}
            </h2>
            <dl className="border-t border-border md:col-span-9">
              {g.items.map((it) => (
                <div key={it.name} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8">
                  <dt className="text-[16px] font-medium">{it.name}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted-foreground">{it.note}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </PageFrame>
  )
}

export function NowPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="now">
      <PageIntro
        title="Now"
        lead={
          <>
            What I&apos;m doing this month, updated{" "}
            <time dateTime={NOW.updated} className="text-foreground">
              {formatDate(NOW.updated)}
            </time>{" "}
            from {PERSON.city}.
          </>
        }
      />
      <div className={WRAP}>
        <ol className="grid gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border md:grid-cols-2">
          {NOW.items.map((it) => (
            <li key={it.title} className="bg-background p-6 sm:p-10">
              <h2 className="text-[14px] font-medium text-muted-foreground">{it.title}</h2>
              <p className="dc-h mt-4 text-[24px] leading-[1.3] sm:text-[28px]">{it.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-[14px] text-muted-foreground">
          A now page says what you are focused on at this point in your life. The idea comes from{" "}
          <a href="https://nownownow.com/about" className="text-foreground underline underline-offset-4">
            nownownow.com
          </a>
          .
        </p>
      </div>
    </PageFrame>
  )
}

export function NotFoundPage({ base, variant }: { base: string; variant: Variant }) {
  return (
    <PageFrame base={base} variant={variant} current="not-found" cta={false}>
      <section className={cn(WRAP, "grid gap-10 py-16 sm:py-28 md:grid-cols-12 md:gap-8")}>
        <p className="dc-h dc-num pf-rise text-[120px] leading-[0.85] text-muted-foreground sm:text-[200px] md:col-span-5" aria-hidden="true">
          404
        </p>
        <div className="md:col-span-6 md:col-start-7">
          <h1 className="dc-h pf-rise text-[40px] leading-[1.05] sm:text-[56px]">This page took a different ferry.</h1>
          <p className="pf-rise mt-5 max-w-[480px] text-[18px] leading-relaxed text-muted-foreground" style={{ animationDelay: "90ms" }}>
            The link may be old, or the page has moved. These are still here:
          </p>
          <ul className="pf-rise mt-8 border-t border-border" style={{ animationDelay: "140ms" }}>
            {NAV.map((n) => (
              <li key={n.path}>
                <Link href={to(base, n.path)} className="group flex items-center justify-between border-b border-border py-3.5 text-[17px]">
                  {n.label} <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 h-10 px-4" nativeButton={false} render={<Link href={to(base)} />}>
            Back to the home page
          </Button>
        </div>
      </section>
    </PageFrame>
  )
}
