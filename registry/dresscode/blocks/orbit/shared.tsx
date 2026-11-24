// Shared pieces of the Orbit landing template: page width, section headings, the logo and the
// headline mark. Everything reads the theme's CSS variables, so one template wears every theme.
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** An outline button that sits on the band: see-through with band-colored text and border. */
export const onBandOutline =
  "in-[.dc-band]:border-[color:var(--dc-band-line)] in-[.dc-band]:bg-transparent in-[.dc-band]:text-[color:var(--dc-band-fg)] in-[.dc-band]:hover:bg-[color:color-mix(in_oklab,var(--dc-band-fg)_12%,transparent)]"

export type Mark = "highlighter" | "accent" | "muted" | "italic" | "none"

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>
}

/** A landing section with the template's vertical rhythm. */
export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-14 sm:py-20", className)}>
      {children}
    </section>
  )
}

/** A short label above a section title, in sentence case (no tracked capitals). */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm font-semibold text-[color:var(--dc-accent)]", className)}>{children}</p>
}

export function SectionHeading({
  id,
  kicker,
  title,
  body,
  align = "center",
  className,
}: {
  id: string
  kicker?: string
  title: ReactNode
  body?: ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-[640px] text-center" : "max-w-[560px]", className)}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2 id={id} className={cn("dc-h text-[32px] leading-[1.1] sm:text-[42px]", kicker && "mt-3")}>
        {title}
      </h2>
      {body ? <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{body}</p> : null}
    </div>
  )
}

/** The Orbit mark: a ring with a moon. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[19px] font-bold tracking-[-0.02em]", className)}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

/** Wraps the key words of a headline in the theme's mark. */
export function Marked({ mark, children }: { mark: Mark; children: ReactNode }) {
  if (mark === "none") return <>{children}</>
  return <span className={`dc-mark-${mark}`}>{children}</span>
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-foreground ring-2 ring-[color:var(--card)]",
        className,
      )}
    >
      {initials}
    </span>
  )
}

export type Status = "Paid" | "Due" | "Overdue" | "Draft"

export function StatusPill({ status }: { status: Status }) {
  const cls = status === "Paid" ? "dc-pill-hl" : status === "Overdue" ? "dc-pill-danger" : status === "Draft" ? "dc-pill-muted" : "dc-pill-line"
  return <span className={cn("dc-pill", cls)}>{status}</span>
}
