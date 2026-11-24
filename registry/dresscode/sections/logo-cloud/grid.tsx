// Logo cloud, grid: a short heading and line of copy beside a bordered grid of equal cells, one made-up
// wordmark in each (three across on desktop, two on phones). The hairlines between the cells are the
// grid's own gap showing the border color through. Screen readers get each studio's plain name.
import { ArrowRight } from "lucide-react"
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
    name: "Ola Bakery",
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

export default function LogoCloudGrid() {
  return (
    <section aria-labelledby="logo-cloud-grid-title" className="py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-16">
        <div className="max-w-[460px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Customers</p>
          <h2 id="logo-cloud-grid-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Trusted by studios that bill for their time
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            From one-person studios to agencies with sixty clients, 4,000 teams send their invoices with Orbit.
          </p>
          <a
            href="#customer-stories"
            className="mt-6 inline-flex items-center gap-1.5 rounded-[var(--radius)] text-[15px] font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Read their stories <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--dc-radius-card)] border border-border bg-border text-muted-foreground sm:grid-cols-3">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="flex h-28 items-center justify-center bg-background px-3 sm:h-36">
              <Wordmark logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
