"use client"

// Empty, no-results and error states (design images E1 and E2). The 404 page (X1) is in not-found.tsx.
// EmptyState is one centered column: a line icon, a Newsreader title, one or two lines of help, the actions.
// size="lg" fills a page (no posts yet); size="md" sits inside a panel or a table. tone="danger" turns the icon
// press red for "couldn't load" (keep the buttons calm: Try again is an outline button, not a red one).
// DataTable takes `empty` and `error` and shows its own "No results for …" with Clear search.
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function EmptyState({
  icon,
  title,
  description,
  actions,
  footnote,
  tone = "default",
  size = "lg",
  as: Heading = "h2",
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Buttons. Lay out one ink button and at most one outline button; a third option belongs in `footnote`. */
  actions?: ReactNode
  /** A link or a small line under the actions ("Error 503 · 10:42 AM"). */
  footnote?: ReactNode
  tone?: "default" | "danger"
  size?: "lg" | "md"
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  const lg = size === "lg"
  return (
    <div role={tone === "danger" ? "alert" : undefined} className={cn("mx-auto flex flex-col items-center text-center", lg ? "max-w-[640px]" : "max-w-[340px]", className)}>
      {icon && (
        <span
          aria-hidden
          className={cn(
            "[&_svg]:stroke-[1.25]",
            lg ? "[&_svg]:size-[84px]" : "[&_svg]:size-[68px]",
            tone === "danger" ? "text-press" : "text-foreground",
          )}
        >
          {icon}
        </span>
      )}
      <Heading
        className={cn(
          "font-serif leading-[1.08] font-bold tracking-[-0.03em] text-balance",
          lg ? "mt-[30px] text-[34px] sm:text-[46px]" : "mt-[34px] text-[28px] sm:text-[33px]",
        )}
      >
        {title}
      </Heading>
      {description && <p className={cn("mt-[12px] text-ink-2", lg ? "text-[17px] leading-[1.5] sm:text-[19.5px]" : "text-[17px] leading-[1.5] text-foreground/85 sm:text-[18px]")}>{description}</p>}
      {actions && <div className={cn("flex flex-wrap items-center justify-center", lg ? "mt-[44px] gap-[24px]" : "mt-[46px] flex-col gap-[16px]")}>{actions}</div>}
      {footnote && <div className={cn("text-ink-2", lg ? "mt-[54px] text-[17px] sm:text-[19.5px]" : "mt-[24px] text-[16px] sm:text-[17px]")}>{footnote}</div>}
    </div>
  )
}

/** A press link for an EmptyState footnote: "How other writers plan their first month". */
export function EmptyStateLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-press underline decoration-1 underline-offset-[4px] outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </a>
  )
}
