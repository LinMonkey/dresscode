"use client"

// A settings form where the brand color is a swatch button that opens the full picker in a popover.
// The form owns the value and the recent colors, so both survive the popover closing.
import * as React from "react"
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerRecent,
  ColorPickerSwatch,
  ColorPickerSwatches,
  getContrastRatio,
  getReadableTextColor,
} from "@/registry/dresscode/components/color-picker/ui/color-picker"

const DEFAULT_COLOR = "#4f46e5"
const PRESETS = [
  { value: "#4f46e5", label: "Indigo" },
  { value: "#2563eb", label: "Ocean" },
  { value: "#0e7490", label: "Lagoon" },
  { value: "#047857", label: "Fern" },
  { value: "#b45309", label: "Amber" },
  { value: "#c2410c", label: "Tangerine" },
  { value: "#be123c", label: "Rose" },
  { value: "#7e22ce", label: "Orchid" },
  { value: "#1f2937", label: "Ink" },
]

export default function ColorPickerPopover() {
  const [name, setName] = React.useState("Fernwood Studio")
  const [color, setColor] = React.useState(DEFAULT_COLOR)
  const [saved, setSaved] = React.useState(DEFAULT_COLOR)
  const [recent, setRecent] = React.useState(["#0f766e", "#9d174d", "#ca8a04"])
  const [justSaved, setJustSaved] = React.useState(false)
  const text = getReadableTextColor(color)
  const ratio = getContrastRatio(text, color)
  const dirty = color !== saved

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Workspace branding</CardTitle>
        <CardDescription>Shown on invoices, reminder emails and your client portal.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-[1fr_15rem]">
        <div className="grid content-start gap-5">
          <div className="grid gap-2">
            <Label htmlFor="cp-workspace">Workspace name</Label>
            <Input id="cp-workspace" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label id="cp-brand-label">Brand color</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger
                  aria-labelledby="cp-brand-label cp-brand-value"
                  render={<Button variant="outline" className="w-40 justify-start gap-2 pr-2 pl-1.5 font-normal" />}
                >
                  <ColorPickerSwatch color={color} />
                  <span id="cp-brand-value" className="tabular-nums">
                    {color}
                  </span>
                  <ChevronDownIcon className="ml-auto text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-72 gap-0">
                  <ColorPicker
                    aria-label="Brand color"
                    value={color}
                    onValueChange={setColor}
                    recentColors={recent}
                    onRecentColorsChange={setRecent}
                    maxRecentColors={9}
                  >
                    <ColorPickerArea />
                    <div className="flex items-center gap-2">
                      <ColorPickerEyeDropper />
                      <ColorPickerHue />
                    </div>
                    <div className="flex items-start gap-1.5">
                      <ColorPickerFormatSelect />
                      <ColorPickerInput />
                    </div>
                    <ColorPickerSwatches label="Presets" colors={PRESETS} />
                    <ColorPickerRecent />
                  </ColorPicker>
                </PopoverContent>
              </Popover>
              {color !== DEFAULT_COLOR ? (
                <Button variant="ghost" size="sm" onClick={() => setColor(DEFAULT_COLOR)}>
                  <RotateCcwIcon />
                  Reset
                </Button>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">Used for buttons, links and the header of every email.</p>
            {ratio < 4.5 ? (
              <p className="flex items-start gap-1.5 text-sm text-destructive" role="status">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                Text on this color is hard to read ({ratio.toFixed(1)}:1). Try a deeper shade.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid content-start gap-2">
          <p className="text-sm font-medium">Email preview</p>
          <div className="overflow-hidden rounded-lg border bg-background text-xs" aria-label="Email preview" role="img">
            <div className="flex items-center gap-2 px-3 py-2.5 font-medium" style={{ background: color, color: text }}>
              <span className="flex size-5 items-center justify-center rounded-sm text-[0.625rem] font-semibold" style={{ background: text, color }}>
                {name.trim().charAt(0).toUpperCase() || "F"}
              </span>
              <span className="truncate">{name.trim() || "Your workspace"}</span>
            </div>
            <div className="grid gap-2 p-3">
              <p className="font-medium text-foreground">Invoice INV-1043 is ready</p>
              <p className="text-muted-foreground">$4,200.00 for November&apos;s design work, due Dec 8.</p>
              <span className="mt-1 inline-flex h-7 w-fit items-center rounded-md px-3 font-medium" style={{ background: color, color: text }}>
                Pay invoice
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {justSaved ? (
          <span className="mr-auto flex items-center gap-1.5 text-sm text-muted-foreground" role="status">
            <CheckIcon className="size-4" />
            Saved
          </span>
        ) : null}
        <Button variant="outline" disabled={!dirty} onClick={() => setColor(saved)}>
          Discard
        </Button>
        <Button
          disabled={!dirty}
          onClick={() => {
            setSaved(color)
            setJustSaved(true)
            window.setTimeout(() => setJustSaved(false), 2000)
          }}
        >
          Save changes
        </Button>
      </CardFooter>
    </Card>
  )
}
