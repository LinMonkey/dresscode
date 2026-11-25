// Writing: the list of posts and a post. Posts are plain data in data.ts (paragraphs, headings, lists,
// quotes, notes and code); swap them for MDX or a CMS by rendering your content inside <Prose>.
// Code is highlighted here, with no extra package, in the theme's own colors.
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { PERSON, POSTS, type Block, type Post, type Variant } from "./data"
import { PostList } from "./home"
import { PageFrame, PageIntro, WRAP } from "./shell"
import { formatDate, to } from "./site"
import { CopyCode, NewsletterForm } from "./ui"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** Text with `backticks` set as inline code. */
function Inline({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? (
      <code key={i} className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[0.86em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}

// A small highlighter: comments, strings, numbers, keywords and CSS names. Enough for the snippets a
// portfolio shows; reach for Shiki if you need every language.
const TOKENS =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?(?:px|ms|s|%|deg|vh|rem|em)?\b)|(\b(?:const|let|var|function|return|if|else|for|of|in|await|async|export|import|from|new|type|interface|true|false|null|undefined|void)\b)|(--[\w-]+|@[\w-]+|:root\b)/g
const TOKEN_CLASS = [
  "",
  "italic text-muted-foreground",
  "text-[color:var(--dc-accent)]",
  "text-[color:color-mix(in_oklab,var(--dc-accent)_65%,var(--dc-ink))]",
  "font-semibold",
  "text-[color:var(--dc-accent)] font-medium",
]

function highlight(code: string) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of code.matchAll(TOKENS)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const kind = m.slice(1).findIndex(Boolean) + 1
    out.push(
      <span key={m.index} className={TOKEN_CLASS[kind]}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  out.push(code.slice(last))
  return out
}

function CodeBlock({ block }: { block: Extract<Block, { type: "code" }> }) {
  return (
    <figure className="overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-[color:color-mix(in_oklab,var(--dc-ink)_3%,var(--dc-surface))]">
      <figcaption className="flex h-10 items-center justify-between gap-4 border-b border-border pr-1.5 pl-4 text-[13px] text-muted-foreground">
        <span className="font-mono">{block.file ?? block.lang}</span>
        <CopyCode code={block.code} />
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13.5px] leading-[1.7]">
        <code>{highlight(block.code)}</code>
      </pre>
    </figure>
  )
}

/** A post's body: the blocks in data.ts, set for reading. */
export function Prose({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={cn("grid min-w-0 gap-6 text-[18px] leading-[1.75]", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            )
          case "h2":
            return (
              <h2 key={i} id={slugify(b.text)} className="dc-h scroll-mt-8 pt-6 text-[26px] leading-tight sm:text-[30px]">
                {b.text}
              </h2>
            )
          case "list":
            return (
              <ul key={i} className="grid list-disc gap-2 pl-6 marker:text-muted-foreground">
                {b.items.map((it) => (
                  <li key={it} className="pl-1">
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            )
          case "quote":
            return (
              <blockquote key={i} className="dc-h my-2 border-l-2 border-[color:var(--dc-accent)] pl-6 text-[24px] leading-[1.35] sm:text-[28px]">
                {b.text}
              </blockquote>
            )
          case "note":
            return (
              <aside key={i} className="rounded-[var(--dc-radius-card)] bg-muted px-5 py-4 text-[16px] leading-relaxed">
                <span className="font-medium">Note. </span>
                <Inline text={b.text} />
              </aside>
            )
          case "code":
            return <CodeBlock key={i} block={b} />
        }
      })}
    </div>
  )
}

export function WritingPage({ base, variant }: { base: string; variant: Variant }) {
  const [first, ...rest] = POSTS
  const years = [...new Set(rest.map((p) => p.date.slice(0, 4)))]
  return (
    <PageFrame base={base} variant={variant} current="writing">
      <PageIntro title="Writing" lead="Notes on design, maps, type and running a one-person studio. A new one about once a month.">
        <NewsletterForm className="pf-rise mt-8" />
      </PageIntro>
      <div className={WRAP}>
        {first ? (
          <Link href={to(base, "writing", first.slug)} className="dc-card group grid gap-6 p-6 sm:p-10 md:grid-cols-12 md:gap-8">
            <span className="text-[14px] text-muted-foreground md:col-span-3">
              Latest
              <time dateTime={first.date} className="dc-num mt-1 block text-foreground">
                {formatDate(first.date)}
              </time>
            </span>
            <span className="md:col-span-9">
              <span className="dc-h block text-[32px] leading-[1.08] underline-offset-[6px] group-hover:underline sm:text-[44px]">{first.title}</span>
              <span className="mt-4 block max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">{first.summary}</span>
              <span className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
                <span className="inline-flex items-center gap-1 font-medium">
                  Read the post <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground">
                  {first.minutes} min · {first.tags.join(", ")}
                </span>
              </span>
            </span>
          </Link>
        ) : null}
        {years.map((y) => (
          <section key={y} aria-labelledby={`y-${y}`} className="mt-16 grid gap-4 md:grid-cols-12 md:gap-8">
            <h2 id={`y-${y}`} className="dc-h dc-num text-[26px] md:col-span-3">
              {y}
            </h2>
            <PostList base={base} posts={rest.filter((p) => p.date.startsWith(y))} className="md:col-span-9" />
          </section>
        ))}
      </div>
    </PageFrame>
  )
}

function Neighbour({ base, post, dir }: { base: string; post?: Post; dir: "newer" | "older" }) {
  if (!post) return <span />
  return (
    <Link href={to(base, "writing", post.slug)} className={cn("group grid gap-1 rounded-[var(--dc-radius-card)] border border-border p-5 transition-colors hover:bg-muted/60", dir === "older" && "text-right")}>
      <span className={cn("inline-flex items-center gap-1 text-[13px] text-muted-foreground", dir === "older" && "justify-end")}>
        {dir === "newer" ? <ArrowLeft className="size-3.5" aria-hidden="true" /> : null}
        {dir === "newer" ? "Newer" : "Older"}
        {dir === "older" ? <ArrowRight className="size-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="text-[16px] font-medium">{post.title}</span>
    </Link>
  )
}

export function PostPage({ base, variant, slug }: { base: string; variant: Variant; slug: string }) {
  const i = POSTS.findIndex((p) => p.slug === slug)
  const post = POSTS[i]
  if (!post) return null
  const headings = post.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
  return (
    <PageFrame base={base} variant={variant} current="post">
      <div className="pf-progress pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-[color:var(--dc-accent)]" aria-hidden="true" />
      <article className={WRAP}>
        <header className="mx-auto max-w-[760px] pt-8 sm:pt-12">
          <nav aria-label="Breadcrumb" className="pf-rise text-[14px] text-muted-foreground">
            <Link href={to(base, "writing")} className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" aria-hidden="true" /> Writing
            </Link>
          </nav>
          <h1 className="dc-h pf-rise mt-6 text-[38px] leading-[1.06] sm:text-[56px]">{post.title}</h1>
          <p className="pf-rise mt-5 text-[19px] leading-relaxed text-muted-foreground sm:text-[21px]" style={{ animationDelay: "90ms" }}>
            {post.summary}
          </p>
          <p className="pf-rise mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-5 text-[14px] text-muted-foreground" style={{ animationDelay: "140ms" }}>
            <time dateTime={post.date} className="dc-num text-foreground">
              {formatDate(post.date)}
            </time>
            <span>{post.minutes} min read</span>
            <span>{post.tags.join(", ")}</span>
          </p>
        </header>
        <div className="mx-auto mt-12 grid max-w-[1040px] gap-10 sm:mt-16 lg:grid-cols-[200px_minmax(0,720px)] lg:justify-between">
          {headings.length ? (
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-8">
                <p className="text-[13px] font-medium">On this page</p>
                <ol className="mt-3 grid gap-2 border-l border-border text-[14px] text-muted-foreground">
                  {headings.map((h) => (
                    <li key={h.text}>
                      <a href={`#${slugify(h.text)}`} className="-ml-px block border-l border-transparent pl-4 leading-snug hover:border-foreground hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : (
            <span className="hidden lg:block" />
          )}
          <div className="min-w-0">
            <Prose blocks={post.body} />
            <footer className="mt-16 grid gap-10">
              <div className="flex items-start gap-4 border-y border-border py-8">
                <span className="dc-band grid size-12 shrink-0 place-items-center rounded-full text-[15px] font-medium">{PERSON.initials}</span>
                <span>
                  <span className="block text-[16px] font-medium">{PERSON.name}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{PERSON.intro}</span>
                  <Link href={to(base, "about")} className="mt-2 inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline">
                    More about me <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Neighbour base={base} post={POSTS[i - 1]} dir="newer" />
                <Neighbour base={base} post={POSTS[i + 1]} dir="older" />
              </div>
              <div className="dc-card p-6 sm:p-8">
                <p className="dc-h text-[22px]">Get the next one by email</p>
                <p className="mt-1 text-[15px] text-muted-foreground">About once a month. No tracking, unsubscribe in one click.</p>
                <NewsletterForm className="mt-5" />
              </div>
            </footer>
          </div>
        </div>
      </article>
    </PageFrame>
  )
}
