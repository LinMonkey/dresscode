// Footnotes: a superscript reference in the text and a ruled list of notes at the end, each with a
// link back to where it was cited. Numbers are explicit, so server-rendered pages need no state.
// Two lists on one page? Give each pair the same idPrefix so their links don't cross.
import * as React from "react"
import { cn } from "cn"
import { CornerLeftUp } from "lucide-react"

const ids = (prefix: string, id?: string | number) => ({
  title: `${prefix}footnotes-title`,
  note: `${prefix}fn-${id}`,
  ref: `${prefix}fnref-${id}`,
})

function FootnoteRef({
  id,
  label,
  idPrefix = "",
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "href" | "id"> & {
  id: string | number
  label?: React.ReactNode
  /** Match the idPrefix of the Footnotes list this points to. */
  idPrefix?: string
}) {
  const at = ids(idPrefix, id)
  return (
    <sup data-slot="footnote-ref" id={at.ref} className="not-prose leading-none">
      <a
        href={`#${at.note}`}
        aria-describedby={at.title}
        className={cn("ml-[1px] px-[1px] font-sans text-[0.7em] font-semibold text-press no-underline hover:text-ink", className)}
        {...props}
      >
        {label ?? id}
      </a>
    </sup>
  )
}

type FootnoteItem = { id: string | number; content: React.ReactNode }

function Footnotes({
  items,
  title = "Notes",
  idPrefix = "",
  className,
  ...props
}: React.ComponentProps<"section"> & {
  items: FootnoteItem[]
  title?: React.ReactNode
  /** Prefix for the ids, when a page has more than one list. */
  idPrefix?: string
}) {
  const titleId = ids(idPrefix).title
  return (
    <section
      data-slot="footnotes"
      aria-labelledby={titleId}
      className={cn("not-prose mt-[48px] max-w-[68ch] border-t-2 border-rule pt-[16px] font-sans", className)}
      {...props}
    >
      <h2 id={titleId} className="text-[15px] font-semibold text-ink">
        {title}
      </h2>
      <ol className="mt-[10px] space-y-[8px] text-[15px] leading-[1.5] text-ink-2">
        {items.map((item) => {
          const at = ids(idPrefix, item.id)
          return (
            <li key={item.id} id={at.note} className="grid grid-cols-[24px_1fr] gap-x-[4px] scroll-mt-[96px] target:text-ink">
              <span className="font-semibold text-ink tabular-nums">{item.id}.</span>
              <span>
                {item.content}{" "}
                <a href={`#${at.ref}`} aria-label={`Back to note ${item.id} in the text`} className="inline-flex translate-y-[2px] text-press hover:text-ink">
                  <CornerLeftUp className="size-[14px]" aria-hidden />
                </a>
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export { FootnoteRef, Footnotes, type FootnoteItem }
