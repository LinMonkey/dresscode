// A real, static rendering of the Sundial editor, used inside marketing blocks
// (hero, feature showcase) instead of a screenshot. No fake window chrome.
// Sizes follow design image L3 (panel 819 x 387 at a 1280px page).
import { Bold, ChevronDown, Italic, Link, List, ListOrdered, Quote } from "lucide-react"

import { cn } from "@/lib/utils"

const nav = ["Posts", "Subscribers", "Analytics", "Settings"]

export function EditorPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid h-[387px] w-[819px] grid-cols-[152px_461px_206px] grid-rows-[46px_1fr] overflow-hidden border border-hairline bg-paper text-ink",
        className,
      )}
      aria-label="The Sundial editor"
    >
      {/* Sidebar */}
      <aside className="row-span-2 border-r border-hairline bg-newsprint">
        <p className="mt-[11px] px-[16px] font-serif text-[24px] leading-[1.2] font-bold tracking-[-0.03em]">Sundial</p>
        <p className="mt-[22px] ml-[14px] mr-[13px] flex h-[30px] items-center border-l-[3px] border-press bg-press-tint pl-[9px] text-[15px]">
          Compose
        </p>
        <ul className="mt-[11px] text-[15px] leading-[1.25]">
          {nav.map((item) => (
            <li key={item} className="flex h-[32.5px] items-center pl-[25px]">
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* Header spans the editor and settings columns */}
      <header className="col-span-2 flex items-center justify-between border-b border-hairline pl-[22px] pr-[13px]">
        <p className="font-serif text-[19px] font-bold tracking-[-0.02em]">The Long Letter</p>
        <div className="flex items-center gap-[12px] text-[13px]">
          <span className="text-ink-2">Saved</span>
          <span className="inline-flex h-[27px] items-center bg-ink px-[17px] font-medium text-paper">Publish</span>
        </div>
      </header>

      {/* Editor */}
      <div className="flex flex-col border-r border-hairline px-[22px] pb-[14px]">
        <h3 className="mt-[29px] font-serif text-[37px] leading-[1.05] font-bold tracking-[-0.03em]">
          The case for slower work
        </h3>
        <p className="mt-[9px] max-w-[350px] text-[17.5px] leading-[23.3px] text-ink-2">
          A few notes on attention, pace, and doing better work over the long term.
        </p>
        <p className="mt-[21px] text-[16.5px] leading-[21.7px]">
          The more I write, the more I&rsquo;m convinced that sustainable work is not about doing more, but about
          doing what matters with greater care.
        </p>
        <p className="mt-[14px] max-w-[400px] text-[16.5px] leading-[21.7px]">
          Here are a few practices that have helped me keep a steadier pace.
          <span className="ml-[2px] inline-block h-[19px] w-px translate-y-[3px] bg-ink" />
        </p>
        <div className="mt-auto flex h-[37px] items-center gap-[24px] border-y border-hairline px-[12px] text-[13px]">
          <span className="flex items-center gap-[4px]">
            Paragraph <ChevronDown className="size-[13px]" />
          </span>
          <span className="h-[18px] w-px bg-hairline" />
          <Bold className="size-[16px]" strokeWidth={2.5} />
          <Italic className="size-[16px]" />
          <Link className="size-[16px]" />
          <List className="size-[16px]" />
          <ListOrdered className="size-[16px]" />
          <Quote className="size-[16px]" />
        </div>
      </div>

      {/* Settings */}
      <div className="px-[19px] text-[14.5px]">
        <p className="mt-[30px] font-serif text-[17px] leading-none font-bold">Audience</p>
        <div className="mt-[5px] flex h-[30px] items-center justify-between border border-divider px-[10px]">
          All subscribers <ChevronDown className="size-[13px]" />
        </div>
        <div className="mt-[19px] border-t border-hairline pt-[18px]">
          <p className="font-serif text-[17px] leading-none font-bold">Send</p>
          <label className="mt-[9px] flex items-center gap-[10px]">
            <span className="grid size-[16px] place-items-center rounded-full border-2 border-press">
              <span className="size-[7px] rounded-full bg-press" />
            </span>
            Publish now
          </label>
          <label className="mt-[4px] flex items-center gap-[10px]">
            <span className="size-[16px] rounded-full border border-ink-2" />
            Schedule for later
          </label>
        </div>
        <div className="mt-[26px] border-t border-hairline pt-[16px]">
          <p className="font-serif text-[17px] leading-none font-bold">Settings</p>
          <label className="mt-[12px] flex items-center gap-[10px]">
            <span className="size-[16px] border border-ink-2" />
            Email this post
          </label>
        </div>
      </div>
    </div>
  )
}
