// Small pieces every Orbit app screen uses: page header, panels, stat cards, client marks, a chart
// tooltip and an empty state. They read the theme's CSS variables only, so one template wears every
// theme. Panels are the outer cards (they get Pop's hard shadow); what sits inside them stays flat.
import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { StatusPill } from "@/registry/dresscode/blocks/orbit/shared"

import { initialsOf } from "./data"

export { StatusPill }

/** Ghost and link buttons stay flat in Pop: only filled and outlined buttons wear the hard shadow. */
export const flat = "dc-flat"

/** An inner card: a hairline box inside a panel, never a shadow. */
export const inner = "rounded-[calc(var(--radius)+2px)] border border-border"

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  eyebrow?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
        <h1 className="dc-h text-[26px] leading-tight sm:text-[30px]">{title}</h1>
        {description ? <p className="mt-1.5 text-[15px] text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  flush = false,
  children,
  id,
}: {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
  bodyClassName?: string
  /** No body padding: for tables and lists that run edge to edge. */
  flush?: boolean
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={cn("dc-card min-w-0 overflow-hidden", className)}>
      {title ? (
        <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
          <div className="min-w-0">
            <h2 id={id ? `${id}-title` : undefined} className="text-[15px] leading-snug font-semibold">
              {title}
            </h2>
            {description ? <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </header>
      ) : null}
      <div className={cn(!flush && "px-5 pb-5", !flush && !title && "pt-5", bodyClassName)}>{children}</div>
    </section>
  )
}

export function StatCard({
  label,
  value,
  note,
  trend,
  highlight = false,
  icon: Icon,
  className,
}: {
  label: string
  value: string
  note?: string
  trend?: "up" | "down"
  highlight?: boolean
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "dc-card p-4",
        highlight && "bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)] border-transparent in-[.dc-brutal]:border-[color:var(--dc-ink)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-[13px]", highlight ? "opacity-80" : "text-muted-foreground")}>{label}</p>
        {Icon ? <Icon className={cn("size-4", highlight ? "opacity-70" : "text-muted-foreground")} aria-hidden="true" /> : null}
      </div>
      <p className="dc-num mt-1.5 text-[24px] leading-tight font-semibold tracking-tight">{value}</p>
      {note ? (
        <p className={cn("mt-1 flex items-center gap-1 text-[12px]", highlight ? "opacity-80" : "text-muted-foreground")}>
          {trend === "up" ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : null}
          {trend === "down" ? <ArrowDownRight className="size-3.5" aria-hidden="true" /> : null}
          {note}
        </p>
      ) : null}
    </div>
  )
}

/** The Orbit ring and moon on their own (the landing page's Logo without the word). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className={cn("shrink-0", className)}>
      <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
    </svg>
  )
}

/** A client's initials in a round mark. */
export function ClientMark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-grid size-8 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold text-foreground", className)}
    >
      {initialsOf(name)}
    </span>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border bg-muted px-1 font-sans text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  )
}

/** A colored dot for chart legends. */
export function Swatch({ color, className }: { color: string; className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block size-2.5 shrink-0 rounded-[3px]", className)} style={{ background: color }} />
}

/** The tooltip every chart uses: a small themed card with the label and one line per series. */
export function ChartTip({
  active,
  payload,
  label,
  format = (v: number) => String(v),
}: {
  active?: boolean
  payload?: ReadonlyArray<{ name?: string | number; value?: unknown; color?: string; dataKey?: unknown; payload?: { fill?: string } }>
  label?: ReactNode
  format?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-36 rounded-[var(--radius)] border border-border bg-popover px-3 py-2 text-[12px] text-popover-foreground shadow-md">
      {label !== undefined && label !== "" ? <p className="mb-1 font-semibold">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <Swatch color={p.color ?? p.payload?.fill ?? "currentColor"} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="dc-num ml-auto pl-3 font-semibold">{format(Number(p.value))}</span>
        </p>
      ))}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  actions,
  className,
}: {
  icon: LucideIcon
  title: string
  body: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span className="dc-icon size-12">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="dc-h mt-4 text-[20px]">{title}</h2>
      <p className="mt-1.5 max-w-[440px] text-[14px] leading-relaxed text-pretty text-muted-foreground">{body}</p>
      {actions ? <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** A label-and-value row for detail panels. */
export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2 text-[14px]", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{children}</dd>
    </div>
  )
}

/** A pill for a payment's or a member's state, in the same family as the invoice status pill. */
export function Pill({ tone, children }: { tone: "hl" | "danger" | "muted" | "line"; children: ReactNode }) {
  return <span className={cn("dc-pill", `dc-pill-${tone}`)}>{children}</span>
}
