"use client"

// A small theme editor: three color pickers (primary, accent, background) restyle a preview of a
// button, a badge and a card. Text colors are picked for contrast, and each text pair shows its
// WCAG contrast ratio with a pass or fail for normal-size text.
import * as React from "react"
import { CheckIcon, ChevronDownIcon, CopyIcon, RotateCcwIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  type SwatchColor,
} from "@/registry/dresscode/components/color-picker/ui/color-picker"

const DEFAULTS = { primary: "#2563eb", accent: "#fde68a", background: "#ffffff" }
type Role = keyof typeof DEFAULTS

const FIELDS: { role: Role; label: string; hint: string; presets: SwatchColor[] }[] = [
  {
    role: "primary",
    label: "Primary",
    hint: "Buttons, links and checks",
    presets: [
      { value: "#2563eb", label: "Ocean" },
      { value: "#4f46e5", label: "Indigo" },
      { value: "#7c3aed", label: "Violet" },
      { value: "#db2777", label: "Rose" },
      { value: "#dc2626", label: "Tomato" },
      { value: "#ea580c", label: "Tangerine" },
      { value: "#16a34a", label: "Green" },
      { value: "#0d9488", label: "Teal" },
      { value: "#0f172a", label: "Ink" },
    ],
  },
  {
    role: "accent",
    label: "Accent",
    hint: "Badges and highlights",
    presets: [
      { value: "#fde68a", label: "Butter" },
      { value: "#fed7aa", label: "Peach" },
      { value: "#fecdd3", label: "Blush" },
      { value: "#e9d5ff", label: "Lilac" },
      { value: "#bfdbfe", label: "Sky" },
      { value: "#a7f3d0", label: "Mint" },
      { value: "#d9f99d", label: "Lime" },
      { value: "#facc15", label: "Sunflower" },
      { value: "#f97316", label: "Orange" },
    ],
  },
  {
    role: "background",
    label: "Background",
    hint: "The page and its cards",
    presets: [
      { value: "#ffffff", label: "White" },
      { value: "#fafaf9", label: "Paper" },
      { value: "#fdf6ec", label: "Cream" },
      { value: "#f1f5f9", label: "Mist" },
      { value: "#ecfdf5", label: "Mint wash" },
      { value: "#18181b", label: "Charcoal" },
      { value: "#0b1120", label: "Midnight" },
      { value: "#1c1917", label: "Espresso" },
      { value: "#111827", label: "Graphite" },
    ],
  },
]

function ColorField({
  role,
  label,
  hint,
  presets,
  value,
  onChange,
  recent,
  onRecentChange,
}: (typeof FIELDS)[number] & { value: string; onChange: (v: string) => void; recent: string[]; onRecentChange: (c: string[]) => void }) {
  const id = `cp-theme-${role}`
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-medium">
          {label}
        </p>
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      </div>
      <Popover>
        <PopoverTrigger
          aria-labelledby={`${id}-label ${id}-value`}
          render={<Button variant="outline" className="w-32 shrink-0 justify-start gap-2 pr-2 pl-1.5 font-normal" />}
        >
          <ColorPickerSwatch color={value} />
          <span id={`${id}-value`} className="tabular-nums">
            {value}
          </span>
          <ChevronDownIcon className="ml-auto text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72">
          <ColorPicker aria-label={`${label} color`} value={value} onValueChange={onChange} recentColors={recent} onRecentColorsChange={onRecentChange} maxRecentColors={9}>
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <ColorPickerHue />
            </div>
            <div className="flex items-start gap-1.5">
              <ColorPickerFormatSelect />
              <ColorPickerInput />
            </div>
            <ColorPickerSwatches label="Presets" colors={presets} />
            <ColorPickerRecent />
          </ColorPicker>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ContrastRow({ label, fg, bg }: { label: string; fg: string; bg: string }) {
  const ratio = getContrastRatio(fg, bg)
  const level = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "Fail"
  return (
    <li className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-sm text-[0.625rem] font-semibold ring-1 ring-foreground/15" style={{ background: bg, color: fg }}>
          Aa
        </span>
        <span className="truncate">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-muted-foreground tabular-nums">{ratio.toFixed(2)}:1</span>
        <Badge variant={level === "Fail" ? "destructive" : "secondary"} className="w-14">
          {level === "Fail" ? <XIcon /> : <CheckIcon />}
          {level}
        </Badge>
      </span>
    </li>
  )
}

export default function ColorPickerThemeEditor() {
  const [colors, setColors] = React.useState(DEFAULTS)
  const [recent, setRecent] = React.useState<string[]>(["#0891b2", "#fbcfe8"])
  const [copied, setCopied] = React.useState(false)
  const { primary, accent, background } = colors
  const foreground = getReadableTextColor(background, "#fafafa", "#0a0a0a")
  const onPrimary = getReadableTextColor(primary, "#ffffff", "#0a0a0a")
  const onAccent = getReadableTextColor(accent, "#ffffff", "#0a0a0a")
  const muted = `color-mix(in oklch, ${foreground} 64%, ${background})`
  const border = `color-mix(in oklch, ${foreground} 14%, ${background})`
  const card = `color-mix(in oklch, ${foreground} 3%, ${background})`
  const css = [
    ":root {",
    `  --background: ${background};`,
    `  --foreground: ${foreground};`,
    `  --primary: ${primary};`,
    `  --primary-foreground: ${onPrimary};`,
    `  --accent: ${accent};`,
    `  --accent-foreground: ${onAccent};`,
    "}",
  ].join("\n")
  const changed = FIELDS.some((f) => colors[f.role] !== DEFAULTS[f.role])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked; nothing to do.
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-[20rem_1fr]">
      <section aria-labelledby="cp-theme-title" className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground">
        <div>
          <h2 id="cp-theme-title" className="text-sm font-medium">
            Theme colors
          </h2>
          <p className="text-xs text-muted-foreground">Text colors follow, picked for contrast.</p>
        </div>
        <div className="grid gap-3">
          {FIELDS.map((f) => (
            <ColorField key={f.role} {...f} value={colors[f.role]} onChange={(v) => setColors((c) => ({ ...c, [f.role]: v }))} recent={recent} onRecentChange={setRecent} />
          ))}
        </div>
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground">Contrast for normal text (AA needs 4.5:1)</p>
          <ul className="mt-1 divide-y">
            <ContrastRow label="Body text" fg={foreground} bg={background} />
            <ContrastRow label="Button label" fg={onPrimary} bg={primary} />
            <ContrastRow label="Badge label" fg={onAccent} bg={accent} />
            <ContrastRow label="Links" fg={primary} bg={background} />
          </ul>
        </div>
        <div className="mt-auto flex gap-2">
          <Button variant="outline" size="sm" disabled={!changed} onClick={() => setColors(DEFAULTS)}>
            <RotateCcwIcon />
            Reset
          </Button>
          <Button variant="outline" size="sm" className="ml-auto" onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy CSS variables"}
          </Button>
        </div>
      </section>

      <section aria-label="Theme preview" className="flex min-w-0 items-center justify-center rounded-xl border p-4 sm:p-6" style={{ background, color: foreground }}>
        <div className="w-full max-w-sm rounded-xl border p-5" style={{ background: card, borderColor: border }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">Studio plan</p>
              <p className="text-sm" style={{ color: muted }}>
                For teams of up to 20
              </p>
            </div>
            <span className="inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium" style={{ background: accent, color: onAccent }}>
              Most popular
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tabular-nums">
            $24
            <span className="text-sm font-normal" style={{ color: muted }}>
              {" "}
              per seat a month
            </span>
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {["Unlimited projects", "Client portal with your logo", "Priority support"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="size-4 shrink-0" style={{ color: primary }} />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium" style={{ background: primary, color: onPrimary }}>
              Start free trial
            </span>
            <span className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium" style={{ borderColor: border }}>
              Compare plans
            </span>
          </div>
          <p className="mt-4 text-xs" style={{ color: muted }}>
            Questions?{" "}
            <span className="font-medium underline underline-offset-2" style={{ color: primary }}>
              Talk to sales
            </span>
          </p>
        </div>
      </section>
    </div>
  )
}
