// Logo cloud, marquee: the studios that use the product scroll sideways forever, fading out at both
// edges. The list is drawn twice and slides by exactly one copy, so the loop has no seam; the second copy
// is aria-hidden and inert, so screen readers and the Tab key meet each studio once. It pauses under the
// pointer. When a wordmark takes keyboard focus, or when someone asks for reduced motion, it stands still
// as a grid, so every wordmark is in view. The keyframes ship with the block (React hoists the <style>).
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const KEYFRAMES = `
@keyframes dc-logo-marquee { from { transform: translate3d(0, 0, 0) } to { transform: translate3d(-50%, 0, 0) } }
`

type Logo = { name: string; href: string; mark?: ReactNode; word: ReactNode; className: string }

const LOGOS: Logo[] = [
  {
    name: "Fernwood Studio",
    href: "#story-fernwood",
    mark: (
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <path d="M3.5 16.5C3.5 9 9 3.5 16.5 3.5c0 7.5-5.5 13-13 13Zm0 0L10.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    word: "Fernwood",
    className: "font-serif text-[22px] italic",
  },
  {
    name: "Northlight",
    href: "#story-northlight",
    mark: (
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
        <path d="M10 1l2.2 6.8L19 10l-6.8 2.2L10 19l-2.2-6.8L1 10l6.8-2.2Z" fill="currentColor" />
      </svg>
    ),
    word: "NORTHLIGHT",
    className: "text-[13px] font-semibold tracking-[0.16em] sm:text-[14px] sm:tracking-[0.2em]",
  },
  { name: "Kato & Lee", href: "#story-kato-lee", word: "kato&lee", className: "text-[22px] font-bold tracking-[-0.04em]" },
  {
    name: "Juniper Labs",
    href: "#story-juniper",
    mark: (
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <circle cx="6" cy="6.5" r="3.4" fill="currentColor" />
        <circle cx="14" cy="6.5" r="3.4" fill="currentColor" />
        <circle cx="10" cy="14" r="3.4" fill="currentColor" />
      </svg>
    ),
    word: "Juniper Labs",
    className: "text-[18px] font-semibold tracking-[-0.01em]",
  },
  {
    name: "Halcyon",
    href: "#story-halcyon",
    mark: (
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <path d="M3 12.5a7 7 0 0 1 14 0Z" fill="currentColor" />
        <rect x="2" y="14.5" width="16" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
    word: "Halcyon",
    className: "font-serif text-[21px] tracking-[0.02em]",
  },
  {
    name: "Ola Bakery",
    href: "#story-ola",
    word: (
      <>
        <span className="font-black tracking-[-0.05em]">ola</span>
        <span className="font-light">bakery</span>
      </>
    ),
    className: "text-[21px]",
  },
  {
    name: "Brightedge",
    href: "#story-brightedge",
    mark: (
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <path d="M6.5 3h4L5.5 17h-4Zm7 0h4l-5 14h-4Z" fill="currentColor" />
      </svg>
    ),
    word: "Brightedge",
    className: "text-[19px] font-extrabold tracking-[-0.03em]",
  },
]

// Classes shared by both copies of the list. In the still state (keyboard focus inside, or reduced
// motion) the list becomes a tidy grid, four across (two on phones), and the gap at its end, which only
// joins the two copies, goes away.
const LIST = [
  "flex shrink-0 items-center gap-x-14 pr-14",
  "motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:justify-items-center motion-reduce:gap-x-6 motion-reduce:gap-y-3 motion-reduce:pr-0 sm:motion-reduce:grid-cols-4 lg:motion-reduce:justify-items-start",
  "group-has-[a:focus-visible]:grid group-has-[a:focus-visible]:grid-cols-2 group-has-[a:focus-visible]:justify-items-center group-has-[a:focus-visible]:gap-x-6 group-has-[a:focus-visible]:gap-y-3 group-has-[a:focus-visible]:pr-0 sm:group-has-[a:focus-visible]:grid-cols-4 lg:group-has-[a:focus-visible]:justify-items-start",
].join(" ")

function Wordmark({ logo }: { logo: Logo }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {logo.mark}
      <span aria-hidden="true" className={cn("leading-none", logo.className)}>
        {logo.word}
      </span>
      <span className="sr-only">{logo.name}</span>
    </span>
  )
}

export default function LogoCloudMarquee() {
  return (
    <section aria-labelledby="logo-cloud-marquee-title" className="py-12 sm:py-16">
      <style href="dc-logo-marquee" precedence="default">
        {KEYFRAMES}
      </style>
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <p id="logo-cloud-marquee-title" className="text-center text-[15px] leading-snug text-balance text-muted-foreground lg:text-left">
          <span className="font-semibold text-foreground">4,000 studios and freelancers</span> get paid with Orbit
        </p>
        <div className="group overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] has-[a:focus-visible]:[mask-image:none] motion-reduce:[mask-image:none]">
          <div className="flex w-max animate-[dc-logo-marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] group-has-[a:focus-visible]:block group-has-[a:focus-visible]:w-auto group-has-[a:focus-visible]:animate-none motion-reduce:block motion-reduce:w-auto motion-reduce:animate-none">
            <ul className={LIST}>
              {LOGOS.map((logo) => (
                <li key={logo.name}>
                  <a
                    href={logo.href}
                    className="flex h-10 items-center rounded-[var(--radius)] px-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Wordmark logo={logo} />
                  </a>
                </li>
              ))}
            </ul>
            <ul aria-hidden="true" inert className={cn(LIST, "group-has-[a:focus-visible]:hidden motion-reduce:hidden")}>
              {LOGOS.map((logo) => (
                <li key={logo.name}>
                  <a href={logo.href} tabIndex={-1} className="flex h-10 items-center px-1 text-muted-foreground transition-colors hover:text-foreground">
                    <Wordmark logo={logo} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
