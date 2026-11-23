"use client"

// A table of contents for a long page: the section headings, with the one you're reading marked by a
// press-red rule. Give it the ids of the headings on the page; it follows the scroll by itself.
import * as React from "react"
import { cn } from "cn"

type TocEntry = { id: string; title: React.ReactNode; depth?: 2 | 3 }

function useActiveId(ids: string[], offset: number) {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null)
  React.useEffect(() => {
    if (!ids.length) return
    const onScroll = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1]
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [ids, offset])
  return active
}

function TableOfContents({
  items,
  title = "Contents",
  offset = 120,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: TocEntry[]
  title?: React.ReactNode
  /** How far below the top of the window a heading counts as being read (px). */
  offset?: number
}) {
  const ids = React.useMemo(() => items.map((i) => i.id), [items])
  const active = useActiveId(ids, offset)
  const titleId = React.useId()
  return (
    <nav data-slot="table-of-contents" aria-labelledby={titleId} className={cn("not-prose text-[15px]", className)} {...props}>
      <p id={titleId} className="font-semibold text-ink">
        {title}
      </p>
      <ol className="mt-[10px] border-l border-hairline">
        {items.map((item) => {
          const on = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "-ml-px flex min-h-[32px] items-center border-l-2 border-transparent py-[4px] pl-[14px] leading-[1.35] text-ink-2 transition-colors hover:text-ink",
                  item.depth === 3 && "pl-[28px] text-[14px]",
                  on && "border-press font-semibold text-ink",
                )}
              >
                {item.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { TableOfContents, type TocEntry }
