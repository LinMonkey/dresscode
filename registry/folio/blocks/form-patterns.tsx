"use client"

// Form patterns from design image S1 that need a little state: a tag input and a date picker.
// Both are built from Folio's restyled shadcn primitives (input field style, popover, calendar, button).
import { CalendarDays, X } from "lucide-react"
import { useId, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/folio/ui/button"
import { Calendar } from "@/registry/folio/ui/calendar"
import { fieldClass } from "@/registry/folio/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/folio/ui/popover"

/** Type a tag and press Enter or comma; Backspace on an empty field removes the last tag. */
export function TagInput({
  defaultTags = [],
  placeholder = "Add a tag…",
  label,
  className,
}: {
  defaultTags?: string[]
  placeholder?: string
  label?: string
  className?: string
}) {
  const [tags, setTags] = useState(defaultTags)
  const [draft, setDraft] = useState("")
  const id = useId()
  const add = (t: string) => {
    const v = t.trim()
    if (v && !tags.some((x) => x.toLowerCase() === v.toLowerCase())) setTags([...tags, v])
    setDraft("")
  }
  return (
    <div className={cn(fieldClass, "flex min-h-[36px] flex-wrap items-center gap-[6px] px-[6px] py-[4px] focus-within:border-foreground focus-within:ring-2 focus-within:ring-ring/15", className)}>
      {tags.map((t) => (
        <span key={t} className="inline-flex h-[24px] items-center gap-[6px] rounded-(--radius) bg-secondary pr-[4px] pl-[8px] text-[14px]">
          {t}
          <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="grid size-[16px] place-items-center rounded-(--radius) text-ink-2 hover:bg-hairline hover:text-ink" aria-label={`Remove ${t}`}>
            <X className="size-[12px]" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-label={label ?? "Add a tag"}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add(draft)
          } else if (e.key === "Backspace" && !draft && tags.length) setTags(tags.slice(0, -1))
        }}
        onBlur={() => draft && add(draft)}
        className="h-[24px] min-w-[80px] flex-1 bg-transparent px-[4px] text-[15px] outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

/** A button that opens a calendar in a popover. */
export function DatePicker({ defaultDate, className }: { defaultDate?: Date; className?: string }) {
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn("w-full justify-start gap-[10px] px-[12px] font-normal", !date && "text-muted-foreground", className)}>
            <CalendarDays className="size-[17px]" />
            {date ? fmt.format(date) : "Pick a date"}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => {
            setDate(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
