// A pull quote: a line lifted from the article and set large in Newsreader. "rule" sits between two
// rules; "mark" leads with a press-red quotation mark. Float it beside the text on wide screens.
import * as React from "react"
import { cn } from "cn"

function PullQuote({
  className,
  variant = "rule",
  float,
  cite,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  variant?: "rule" | "mark"
  /** Beside the text from 768px; the body text wraps around it. */
  float?: "left" | "right"
  /** Who said it, or where it's from. */
  cite?: React.ReactNode
}) {
  return (
    <figure
      data-slot="pull-quote"
      data-variant={variant}
      className={cn(
        // not-prose: inside <Prose>, the quote keeps this look instead of Prose's block quote.
        "not-prose my-[1.6em] font-serif text-ink",
        variant === "rule" && "border-y-2 border-rule py-[20px]",
        float === "right" && "md:float-right md:my-[0.4em] md:ml-[32px] md:w-[42%]",
        float === "left" && "md:float-left md:my-[0.4em] md:mr-[32px] md:w-[42%]",
        className,
      )}
      {...props}
    >
      {variant === "mark" && (
        <span aria-hidden className="block h-[0.62em] font-serif text-[64px] leading-none font-bold text-press">
          “
        </span>
      )}
      <blockquote className={cn("text-[26px] leading-[1.22] font-semibold tracking-[-0.015em] text-pretty sm:text-[30px]", float && "md:text-[24px]")}>
        {children}
      </blockquote>
      {cite && <figcaption className="mt-[12px] font-sans text-[15px] text-ink-2">— {cite}</figcaption>}
    </figure>
  )
}

export { PullQuote }
