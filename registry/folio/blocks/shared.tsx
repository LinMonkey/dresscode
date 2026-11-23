// Shared Folio layout pieces. Breakpoints: base = phone, md = tablet / narrow desktop
// (design images drawn at ~853px), xl = desktop (design images drawn at 1280px).
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1360px] px-5 md:px-[25px] xl:px-gutter", className)}>{children}</div>
}

/** The broadsheet double rule that opens every section. */
export function DoubleRule({ className }: { className?: string }) {
  return <div className={cn("folio-double-rule", className)} aria-hidden />
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className,
}: {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <h2 className="font-serif text-[40px] leading-[1.02] font-bold tracking-[-0.03em] text-ink md:text-[60px] md:leading-[0.95] xl:text-h2 xl:leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-[18px] leading-[1.4] text-ink-2 md:text-[22px]", align === "center" && "mx-auto max-w-[720px]")}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

/** Folio button rule: primary actions are always ink; press red is reserved for highlights and danger. */
export function buttonClass(variant: "primary" | "secondary" | "danger" = "primary", size: "md" | "lg" = "md") {
  return cn(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors",
    size === "lg" ? "h-[46px] px-7 text-[17px] md:h-[54px] md:text-[20px]" : "h-[42px] px-5 text-[16px]",
    variant === "primary" && "bg-ink text-paper hover:bg-ink-2",
    variant === "secondary" && "border border-divider bg-paper text-ink hover:border-ink",
    variant === "danger" && "bg-press text-paper hover:bg-ink",
  )
}
