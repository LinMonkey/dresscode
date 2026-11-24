"use client"

// The picker as an always-open panel beside a live preview: a shared calendar's color, shown on its
// events, its all-day banner and its sidebar entry as you drag.
import * as React from "react"
import { CheckIcon, UsersIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerRecent,
  ColorPickerSwatches,
  getReadableTextColor,
} from "@/registry/dresscode/components/color-picker/ui/color-picker"

const PRESETS = [
  { value: "#d50000", label: "Tomato" },
  { value: "#f4511e", label: "Tangerine" },
  { value: "#f6bf26", label: "Banana" },
  { value: "#33b679", label: "Sage" },
  { value: "#0b8043", label: "Basil" },
  { value: "#039be5", label: "Peacock" },
  { value: "#3f51b5", label: "Blueberry" },
  { value: "#8e24aa", label: "Grape" },
  { value: "#616161", label: "Graphite" },
]

const EVENTS = [
  { time: "09:30 – 10:00", title: "Launch readiness check-in", where: "Room 4B" },
  { time: "13:00 – 14:00", title: "Release notes review", where: "Video call" },
  { time: "16:00 – 16:30", title: "Go or no-go for version 4.2", where: "Room 2A" },
]

export default function ColorPickerInline() {
  const [color, setColor] = React.useState("#039be5")
  const tint = `color-mix(in oklch, ${color} 16%, var(--card))`
  const onSolid = getReadableTextColor(color)

  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-[18rem_1fr]">
      <section aria-labelledby="cp-inline-title" className="flex flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="cp-inline-title" className="text-sm font-medium">
            Calendar color
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">{color}</span>
        </div>
        <ColorPicker aria-label="Calendar color" value={color} onValueChange={setColor} defaultRecentColors={["#e67c73", "#7986cb"]} maxRecentColors={9}>
          <ColorPickerArea className="h-36" />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <ColorPickerHue />
          </div>
          <div className="flex items-start gap-1.5">
            <ColorPickerFormatSelect />
            <ColorPickerInput />
          </div>
          <ColorPickerSwatches label="Calendar colors" colors={PRESETS} columns={9} />
          <ColorPickerRecent label="Custom" emptyText="Drag in the square to make your own." columns={9} />
        </ColorPicker>
      </section>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full" style={{ background: color }} />
            Product launches
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <UsersIcon className="size-3.5" />
            Shared with 14 people
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Tuesday, December 2</p>
            <div className="rounded-md px-2.5 py-1.5 text-sm font-medium" style={{ background: color, color: onSolid }}>
              Code freeze starts · all day
            </div>
          </div>
          <ul className="grid gap-2">
            {EVENTS.map((e) => (
              <li key={e.title} className="rounded-md border-l-4 py-2 pr-3 pl-3" style={{ background: tint, borderColor: color }}>
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {e.time} · {e.where}
                </p>
              </li>
            ))}
          </ul>
          <div className="grid gap-1.5 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground">My calendars</p>
            <div className="flex items-center gap-2.5 text-sm">
              <span className="flex size-4 items-center justify-center rounded-[4px]" style={{ background: color, color: onSolid }}>
                <CheckIcon className="size-3" strokeWidth={3} />
              </span>
              Product launches
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="size-4 rounded-[4px] border border-input" />
              Team holidays
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
