// "Built for the way writers work" (design image L5), laid out as a real bento:
// two tall tiles at the edges and four small tiles between them (review fix #4).
import { FileText } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Container, DoubleRule, SectionHeader } from "./shared"

function Tile({ title, body, className, children }: { title: string; body: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden border border-divider bg-paper", className)}>
      <div className="px-[24px] pt-[22px]">
        <h3 className="font-serif text-[30px] leading-[1.05] font-bold tracking-[-0.025em] text-ink md:text-[34px] xl:text-[30px]">{title}</h3>
        <p className="mt-[10px] max-w-[320px] text-[17px] leading-[1.35] text-ink-2">{body}</p>
      </div>
      {children}
    </div>
  )
}

const picks = [
  { name: "The City Desk", line: "Writing on cities, policy, and people", img: "/folio/placeholder/thumb-city.png" },
  { name: "Field Notes", line: "Ideas from the natural world", img: "/folio/placeholder/thumb-branches.png" },
  { name: "The Workshop", line: "Craft, process, and the working life", img: "/folio/placeholder/thumb-workshop.png" },
]

export function BentoGrid() {
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[40px]" title="Built for the way writers work" />
      <div className="mt-[34px] grid gap-[18px] md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-[300px_300px]">
        <Tile
          title="Custom domain"
          body="Publish under your own name, with a domain you control."
          className="min-h-[300px] bg-newsprint xl:col-span-2"
        >
          <p className="mx-[24px] mt-[22px] w-fit border border-ink-2 bg-paper px-[16px] py-[8px] font-serif text-[22px] font-bold">thelongletter.com</p>
          <Image
            src="/folio/placeholder/building-facade.png"
            alt=""
            width={340}
            height={148}
            className="mt-auto w-full object-cover grayscale xl:absolute xl:right-0 xl:bottom-0 xl:h-[210px] xl:w-[52%]"
          />
        </Tile>
        <Tile title="Import from anywhere" body="Bring your existing work with a simple CSV import.">
          <div className="mt-auto px-[24px] pb-[24px]">
            <div className="flex justify-between text-[16px]">
              <span>Importing posts…</span>
              <span>74%</span>
            </div>
            <div className="mt-[8px] h-[12px] bg-hairline">
              <div className="h-full w-[74%] bg-press" />
            </div>
            <p className="mt-[8px] text-[15px] text-ink-2">148 of 200 posts</p>
          </div>
        </Tile>
        <Tile title="Recommendations" body="Help readers discover other great newsletters.">
          <ul className="mt-auto px-[24px] pb-[16px]">
            {picks.slice(0, 2).map((p) => (
              <li key={p.name} className="flex items-center gap-[12px] border-t border-hairline py-[8px]">
                <Image src={p.img} alt="" width={64} height={44} className="h-[44px] w-[64px] object-cover grayscale" />
                <span>
                  <span className="block text-[16px] font-semibold">{p.name}</span>
                  <span className="block text-[14px] text-ink-2">{p.line}</span>
                </span>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile title="Mobile reading" body="A great reading experience on any device." className="bg-newsprint xl:col-start-4 xl:row-span-2 xl:row-start-1">
          <div className="mx-auto mt-auto w-[210px] rounded-t-[28px] border-x-[6px] border-t-[6px] border-ink bg-paper px-[14px] pt-[22px]">
            <p className="font-serif text-[13px] font-bold">The Long Letter</p>
            <div className="mt-[6px] h-[5px] border-y border-divider" />
            <p className="mt-[10px] font-serif text-[24px] leading-[1.05] font-bold tracking-[-0.02em]">The case for slower work</p>
            <p className="mt-[6px] text-[11.5px] leading-[1.35] text-ink-2">A few notes on attention, pace, and doing better work over the long term.</p>
            <Image src="/folio/placeholder/phone-article.png" alt="" width={194} height={47} className="mt-[10px] w-full object-cover grayscale" />
          </div>
        </Tile>
        <Tile title="Comments" body="Turn on thoughtful reader conversations for every post.">
          <div className="mx-[24px] mt-auto mb-[22px] flex gap-[12px] border-y border-hairline py-[12px]">
            <span className="grid size-[40px] shrink-0 place-items-center rounded-full bg-ink text-[15px] font-semibold text-paper">AR</span>
            <div className="text-[15px]">
              <p>
                <span className="font-semibold">Alex R.</span> <span className="text-ink-2">Reader · 2 days ago</span>
              </p>
              <p className="mt-[2px] leading-[1.35]">A clear and generous piece — this gave me a new way to think about the problem.</p>
            </div>
          </div>
        </Tile>
        <Tile title="Archive and SEO" body="A clean, searchable archive that’s built for readers and search engines.">
          <ul className="mt-auto px-[24px] pb-[14px] text-[15.5px]">
            {[
              ["The case for slower work", "Jan 14, 2026"],
              ["Progress, not productivity", "Jan 7, 2026"],
            ].map(([t, d]) => (
              <li key={t} className="flex items-center gap-[10px] border-t border-hairline py-[8px]">
                <FileText className="size-[16px] text-ink-2" />
                <span className="flex-1">{t}</span>
                <span className="text-ink-2">{d}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </Container>
  )
}
