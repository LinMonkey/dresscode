"use client"

// Picking a translucent overlay for a hero image: the alpha slider and the A field set the opacity,
// and the value is written out as rgba() and as an 8-digit hex, ready to copy.
import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatches,
  getColorDetails,
} from "@/registry/dresscode/components/color-picker/ui/color-picker"

const PRESETS = [
  { value: "#0f172a8c", label: "Night, 55%" },
  { value: "#00000066", label: "Black, 40%" },
  { value: "#ffffff4d", label: "Mist, 30%" },
  { value: "#7c2d1299", label: "Ember, 60%" },
  { value: "#1e3a8a80", label: "Deep blue, 50%" },
  { value: "#065f4673", label: "Pine, 45%" },
  { value: "#581c8766", label: "Plum, 40%" },
  { value: "#f59e0b40", label: "Golden hour, 25%" },
]

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked: the value is still selectable.
    }
  }
  return (
    <div className="flex h-8 items-center gap-2 rounded-md border pr-1 pl-2.5 text-xs">
      <span className="w-9 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate tabular-nums select-all">{value}</span>
      <Button variant="ghost" size="icon-xs" aria-label={copied ? `Copied ${label}` : `Copy ${label} value`} onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

export default function ColorPickerAlphaExample() {
  const [overlay, setOverlay] = React.useState("#0f172a8c")
  const details = getColorDetails(overlay)

  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-[1fr_18rem]">
      <figure className="flex min-w-0 flex-col gap-2">
        <div
          role="img"
          aria-label={`Hero image with a ${Math.round(details.alpha * 100)}% overlay`}
          className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/11]"
          style={{ background: "linear-gradient(180deg, #fbd3a0 0%, #f4a77c 40%, #c8716c 64%, #6d4f73 100%)" }}
        >
          <div className="absolute top-[22%] left-[58%] size-14 rounded-full" style={{ background: "#fff3d1", boxShadow: "0 0 70px 24px rgb(255 226 168 / 0.65)" }} />
          <div className="absolute -bottom-[28%] -left-[12%] h-[62%] w-[78%] rounded-[50%]" style={{ background: "#4a6b58" }} />
          <div className="absolute -right-[18%] -bottom-[34%] h-[66%] w-[86%] rounded-[50%]" style={{ background: "#2c463b" }} />
          <div className="absolute inset-x-0 bottom-0 h-[18%]" style={{ background: "linear-gradient(180deg, #5d7f9c, #3c5670)" }} />
          <div className="absolute inset-0" style={{ background: overlay }} />
          <div className="absolute inset-x-0 bottom-0 grid gap-1 p-5" style={{ color: "#ffffff" }}>
            <p className="text-xs font-medium opacity-90">Oct 18 – 20 · Alpine lake lodge</p>
            <p className="text-2xl leading-tight font-semibold text-balance">Autumn team retreat</p>
            <span className="mt-2 inline-flex h-8 w-fit items-center rounded-md px-3 text-sm font-medium" style={{ background: "#ffffff", color: "#1c1917" }}>
              Save your spot
            </span>
          </div>
        </div>
        <figcaption className="text-xs text-muted-foreground">The overlay keeps the headline readable on any photo.</figcaption>
      </figure>

      <section aria-labelledby="cp-alpha-title" className="flex flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="cp-alpha-title" className="text-sm font-medium">
            Image overlay
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">{Math.round(details.alpha * 100)}% opacity</span>
        </div>
        <ColorPicker aria-label="Overlay color" alpha value={overlay} onValueChange={setOverlay}>
          <ColorPickerArea className="h-36" />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <ColorPickerFormatSelect />
            <ColorPickerInput />
          </div>
          <ColorPickerSwatches label="Overlays" colors={PRESETS} />
        </ColorPicker>
        <div className="grid gap-1.5 border-t pt-3">
          <CopyRow label={details.alpha < 1 ? "rgba" : "rgb"} value={details.rgb} />
          <CopyRow label="hex8" value={details.hex8} />
        </div>
      </section>
    </div>
  )
}
