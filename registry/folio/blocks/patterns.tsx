// Small Folio patterns that shadcn/ui doesn't ship: an app page header, a ruled settings section,
// a labelled form field, a stepper and a dated timeline (design image S1).
import { Check } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/folio/ui/label"

/** The top of an app page: Newsreader title, one line of context, actions on the right, a hairline under it. */
export function PageHeader({ title, description, actions, className }: { title: string; description?: string; actions?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-hairline pb-[16px]", className)}>
      <div className="min-w-0">
        <h1 className="font-serif text-[31px] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[36px]">{title}</h1>
        {description && <p className="mt-[4px] text-[15px] leading-[1.4] text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-[10px]">{actions}</div>}
    </header>
  )
}

/**
 * One block of a settings page: title and explanation on the left, the controls on the right,
 * a divider rule above. Stack several of them; put Save in `footer` when the section saves on its own.
 */
export function SettingsSection({
  title,
  description,
  footer,
  children,
  className,
}: {
  title: string
  description?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("grid gap-x-[48px] gap-y-[16px] border-t border-divider py-[28px] lg:grid-cols-[280px_minmax(0,1fr)]", className)}>
      <div>
        <h2 className="font-serif text-[23px] leading-[1.15] font-bold tracking-[-0.02em] sm:text-[26px]">{title}</h2>
        {description && <p className="mt-[6px] max-w-[280px] text-[14px] leading-[1.45] text-ink-2">{description}</p>}
      </div>
      <div className="min-w-0 max-w-[640px]">
        {children}
        {footer && <div className="mt-[20px] flex flex-wrap items-center gap-[10px] border-t border-hairline pt-[16px]">{footer}</div>}
      </div>
    </section>
  )
}

/**
 * A form field: label, control, then a hint or an error (the error replaces the hint and is press red).
 * `aside` sits at the right end of the label row: a "Forgot password?" link, or "Optional".
 * Point the control's aria-describedby at `${htmlFor}-msg` so the hint or error is read with it.
 */
export function Field({
  label,
  htmlFor,
  aside,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode
  htmlFor?: string
  aside?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-[8px]", className)}>
      {aside ? (
        <div className="flex items-baseline justify-between gap-[12px]">
          <Label htmlFor={htmlFor}>{label}</Label>
          <span className="text-[14px]">{aside}</span>
        </div>
      ) : (
        <Label htmlFor={htmlFor}>{label}</Label>
      )}
      {children}
      {error ? (
        <p id={htmlFor && `${htmlFor}-msg`} className="text-[13.5px] text-press">
          {error}
        </p>
      ) : hint ? (
        <p id={htmlFor && `${htmlFor}-msg`} className="text-[13.5px] text-ink-2">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Numbered steps joined by a rule. Done and current steps are press red; later steps are outlined. */
export function Stepper({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol className={cn("flex items-start", className)} aria-label="Progress">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo"
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-[8px] text-center" aria-current={state === "current" ? "step" : undefined}>
            {i > 0 && (
              <span
                className={cn("absolute top-[15px] right-[calc(50%+24px)] left-[calc(-50%+24px)] h-[1.5px]", i <= current ? "bg-press" : "bg-divider")}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "grid size-[31px] place-items-center rounded-full border-[1.5px] text-[15px] font-semibold tabular-nums",
                state === "todo" ? "border-ink-2 bg-paper text-ink" : "border-press bg-press text-paper",
              )}
            >
              {state === "done" ? <Check className="size-[16px]" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("text-[15px]", state === "current" ? "font-semibold text-ink" : "text-ink-2")}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export type TimelineEntry = { date: string; text: string; tone?: "new" | "default" | "muted" }

/** A dated log: a dot per entry on a thin rule. The newest entry is a filled press dot. */
export function Timeline({ entries, className }: { entries: TimelineEntry[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {entries.map((e, i) => (
        <li key={e.date + e.text} className="relative flex gap-[10px] pb-[10px] pl-[30px] text-[15px] last:pb-0">
          {i < entries.length - 1 && (
            <span className={cn("absolute top-[12px] bottom-[-8px] left-[5px] w-px", entries[i + 1].tone === "muted" ? "bg-divider" : "bg-press/40")} aria-hidden />
          )}
          <span
            className={cn(
              "absolute top-[6px] left-0 size-[11px] rounded-full border-[1.5px]",
              e.tone === "new" ? "border-press bg-press" : e.tone === "muted" ? "border-rule bg-paper" : "border-press bg-paper",
            )}
            aria-hidden
          />
          <time className="font-semibold whitespace-nowrap tabular-nums">{e.date}</time>
          <span className="text-ink-2" aria-hidden>
            —
          </span>
          <span>{e.text}</span>
        </li>
      ))}
    </ol>
  )
}
