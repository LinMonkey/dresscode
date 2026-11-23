// The top of an article: an italic section kicker, the serif headline, a dek (the line under it),
// then the byline with avatars, the date and the reading time over a double rule.
import * as React from "react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/registry/folio/ui/avatar"

type ArticleAuthor = { name: string; role?: string; avatar?: string; href?: string }

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

function names(authors: ArticleAuthor[]) {
  const linked = authors.map((a) =>
    a.href ? (
      <a key={a.name} href={a.href} className="font-semibold text-ink underline decoration-hairline decoration-1 underline-offset-[3px] hover:decoration-ink">
        {a.name}
      </a>
    ) : (
      <span key={a.name} className="font-semibold text-ink">
        {a.name}
      </span>
    ),
  )
  return linked.flatMap((node, i) => (i === 0 ? [node] : [i === linked.length - 1 ? " and " : ", ", node]))
}

function ArticleHeader({
  kicker,
  kickerHref,
  title,
  dek,
  authors = [],
  date,
  dateTime,
  readingTime,
  align = "left",
  size = "default",
  as: Heading = "h1",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  /** The section, in sentence case: "Essays", "Field notes". */
  kicker?: React.ReactNode
  kickerHref?: string
  title: React.ReactNode
  /** One or two sentences under the headline. */
  dek?: React.ReactNode
  authors?: ArticleAuthor[]
  /** Already formatted, e.g. "February 3, 2026". */
  date?: string
  /** The same date for machines, e.g. "2026-02-03". */
  dateTime?: string
  /** e.g. "6 min read". */
  readingTime?: string
  align?: "left" | "center"
  /** "sm" for a story further down a page, or an h2 in a list. */
  size?: "default" | "sm"
  as?: "h1" | "h2"
}) {
  const center = align === "center"
  const small = size === "sm"
  return (
    <header data-slot="article-header" data-size={size}
      className={cn("not-prose w-full max-w-[760px]", center && "mx-auto text-center", className)} {...props}>
      {kicker &&
        (kickerHref ? (
          <a href={kickerHref} className="font-serif text-[18px] font-semibold text-press italic hover:text-ink">
            {kicker}
          </a>
        ) : (
          <p className="font-serif text-[18px] font-semibold text-press italic">{kicker}</p>
        ))}
      <Heading
        className={cn(
          "mt-[8px] font-serif font-bold tracking-[-0.03em] text-balance text-ink",
          // Size and leading together: tailwind-merge drops a leading-* that comes before a text-[size].
          small ? "text-[26px] leading-[1.1] sm:text-[30px] sm:leading-[1.08]" : "text-[38px] leading-[1.04] sm:text-[52px] sm:leading-[1.02]",
        )}
      >
        {title}
      </Heading>
      {dek && (
        <p className={cn("font-serif text-pretty text-ink-2", small ? "mt-[12px] text-[18px] leading-[1.4] sm:text-[20px]" : "mt-[16px] text-[20px] leading-[1.4] sm:text-[23px]")}>
          {dek}
        </p>
      )}
      {(authors.length > 0 || date || readingTime) && (
        <div className={cn("folio-double-rule mt-[24px]", center && "mx-auto")} aria-hidden />
      )}
      {(authors.length > 0 || date || readingTime) && (
        <div className={cn("mt-[14px] flex flex-wrap items-center gap-x-[14px] gap-y-[8px] text-[15px] text-ink-2", center && "justify-center")}>
          {authors.length > 0 && (
            <div className="flex items-center gap-[10px]">
              <AvatarGroup>
                {authors.slice(0, 3).map((a) => (
                  <Avatar key={a.name} size="sm">
                    {a.avatar && <AvatarImage src={a.avatar} alt="" />}
                    <AvatarFallback>{initials(a.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <p>
                By {names(authors)}
                {authors.length === 1 && authors[0].role && <span>, {authors[0].role}</span>}
              </p>
            </div>
          )}
          {(date || readingTime) && (
            <p className="flex items-center gap-[10px]">
              {date && <time dateTime={dateTime}>{date}</time>}
              {date && readingTime && <span aria-hidden className="text-divider">·</span>}
              {readingTime && <span>{readingTime}</span>}
            </p>
          )}
        </div>
      )}
      {children}
    </header>
  )
}

export { ArticleHeader, type ArticleAuthor }
