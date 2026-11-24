// Logo cloud, row: one line of copy and the studios that use the product, each wordmark in its own type
// treatment. The wordmarks are made up and drawn in text and small SVG marks, so they take the theme's
// muted ink; screen readers get each studio's plain name.
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Logo = { name: string; mark?: ReactNode; word: ReactNode; className: string }

const LOGOS: Logo[] = [
  {
    name: "Fernwood Studio",
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
    mark: (
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
        <path d="M10 1l2.2 6.8L19 10l-6.8 2.2L10 19l-2.2-6.8L1 10l6.8-2.2Z" fill="currentColor" />
      </svg>
    ),
    word: "NORTHLIGHT",
    className: "text-[13px] font-semibold tracking-[0.16em] sm:text-[14px] sm:tracking-[0.2em]",
  },
  { name: "Kato & Lee", word: "kato&lee", className: "text-[22px] font-bold tracking-[-0.04em]" },
  {
    name: "Juniper Labs",
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
    name: "Brightedge",
    mark: (
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <path d="M6.5 3h4L5.5 17h-4Zm7 0h4l-5 14h-4Z" fill="currentColor" />
      </svg>
    ),
    word: "Brightedge",
    className: "text-[19px] font-extrabold tracking-[-0.03em]",
  },
]

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

export default function LogoCloudRow() {
  return (
    <section aria-labelledby="logo-cloud-row-title" className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <p id="logo-cloud-row-title" className="text-center text-[15px] text-muted-foreground">
          Studios and freelancers who get paid with Orbit
        </p>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="flex h-8 items-center justify-center">
              <Wordmark logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
