"use client"

// A compact grid of preset swatches for a project label. "Custom…" opens the full picker; colors
// made there are kept in a row of their own under the presets.
import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerRecent,
  ColorPickerSwatches,
  getReadableTextColor,
} from "@/registry/dresscode/components/color-picker/ui/color-picker"

const PRESETS = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#eab308", label: "Yellow" },
  { value: "#84cc16", label: "Lime" },
  { value: "#22c55e", label: "Green" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#d946ef", label: "Fuchsia" },
  { value: "#ec4899", label: "Pink" },
  { value: "#78716c", label: "Stone" },
  { value: "#64748b", label: "Slate" },
  { value: "#171717", label: "Black" },
]

export default function ColorPickerSwatchesExample() {
  const [name, setName] = React.useState("Needs design review")
  const [color, setColor] = React.useState("#8b5cf6")
  const [open, setOpen] = React.useState(false)
  const label = name.trim() || "Untitled label"

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edit label</CardTitle>
        <CardDescription>Labels group issues across every project in the workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="cp-label-name">Name</Label>
          <Input id="cp-label-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <ColorPicker aria-label="Label color" value={color} onValueChange={setColor} defaultRecentColors={["#0f766e", "#b45309"]} maxRecentColors={8} className="gap-4">
          <ColorPickerSwatches label="Color" colors={PRESETS} columns={8} />
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <p id="cp-custom-colors" className="text-xs font-medium text-muted-foreground">
                Custom colors
              </p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger render={<Button variant="outline" size="xs" />}>
                  <PlusIcon />
                  Custom…
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 gap-3" aria-label="Custom label color">
                  <ColorPickerArea className="h-36" />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper size="icon-sm" />
                    <ColorPickerHue />
                  </div>
                  <ColorPickerInput />
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            <ColorPickerRecent label="" aria-labelledby="cp-custom-colors" columns={8} emptyText="Colors you make with Custom… show up here." />
          </div>
        </ColorPicker>

        <div className="grid gap-2 rounded-lg border p-3">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="shrink-0 text-muted-foreground tabular-nums">FW-482</span>
            <span className="truncate">Checkout page spacing on small screens</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex h-6 max-w-full items-center truncate rounded-full px-2.5 text-xs font-medium" style={{ background: color, color: getReadableTextColor(color) }}>
              {label}
            </span>
            <span
              className="inline-flex h-6 max-w-full items-center gap-1.5 truncate rounded-full border px-2.5 text-xs font-medium"
              style={{ background: `color-mix(in oklch, ${color} 14%, var(--card))`, borderColor: `color-mix(in oklch, ${color} 40%, var(--card))` }}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
              {label}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save label</Button>
      </CardFooter>
    </Card>
  )
}
