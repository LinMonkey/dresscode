"use client"

// Color picker: a saturation/brightness area, a hue slider, an optional alpha slider, hex, RGB and
// HSL inputs, an eyedropper (where the browser has one), preset swatches and recent colors.
// Compose the parts inside <ColorPicker>; it works controlled (value, onValueChange) or uncontrolled
// (defaultValue). The value is a hex string: #rrggbb, or #rrggbbaa when `alpha` is on and the color
// is translucent. The conversions are below and exported, with a WCAG contrast helper.
// Built for shadcn/ui; the frame, labels and inputs read only the theme's variables.
import * as React from "react"
import { CheckIcon, PipetteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------------------------
// Color math

/** h 0-360, s and v 0-100, a 0-1 */
type Hsva = { h: number; s: number; v: number; a: number }
/** r, g and b 0-255, a 0-1 */
type Rgba = { r: number; g: number; b: number; a: number }
/** h 0-360, s and l 0-100, a 0-1 */
type Hsla = { h: number; s: number; l: number; a: number }
type ColorFormat = "hex" | "rgb" | "hsl"

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const round = (n: number, digits = 0) => {
  const p = 10 ** digits
  return Math.round(n * p) / p
}

function hsvaToRgba({ h, s, v, a }: Hsva): Rgba {
  const S = s / 100
  const V = v / 100
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return Math.round((V - V * S * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
  }
  return { r: f(5), g: f(3), b: f(1), a }
}

function rgbaToHsva({ r, g, b, a }: Rgba): Hsva {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const d = max - Math.min(R, G, B)
  let h = 0
  if (d) {
    if (max === R) h = ((G - B) / d) % 6
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100, a }
}

function hsvaToHsla({ h, s, v, a }: Hsva): Hsla {
  const S = s / 100
  const V = v / 100
  const l = V * (1 - S / 2)
  const sl = l === 0 || l === 1 ? 0 : (V - l) / Math.min(l, 1 - l)
  return { h, s: sl * 100, l: l * 100, a }
}

function hslaToHsva({ h, s, l, a }: Hsla): Hsva {
  const S = s / 100
  const L = l / 100
  const v = L + S * Math.min(L, 1 - L)
  return { h, s: v === 0 ? 0 : 2 * (1 - L / v) * 100, v: v * 100, a }
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0")
const HEX = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function parseHex(input: string): Rgba | null {
  const m = HEX.exec(input.trim())
  if (!m) return null
  const x = m[1].length <= 4 ? [...m[1]].map((c) => c + c).join("") : m[1]
  const n = (i: number) => parseInt(x.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: x.length === 8 ? round(n(6) / 255, 3) : 1 }
}

/** Reads #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() and hsl()/hsla() (comma or space syntax). */
function parseColor(input: string | null | undefined): Hsva | null {
  if (!input) return null
  const s = input.trim().toLowerCase()
  const hex = parseHex(s)
  if (hex) return rgbaToHsva(hex)
  const fn = /^(rgba?|hsla?)\(([^)]*)\)$/.exec(s)
  if (!fn) return null
  const parts = fn[2].split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3 || parts.length > 4) return null
  const num = (p: string, scale: number) => (p.endsWith("%") ? (parseFloat(p) / 100) * scale : parseFloat(p))
  const a = parts[3] === undefined ? 1 : clamp(num(parts[3], 1), 0, 1)
  if (fn[1].startsWith("rgb")) {
    const [r, g, b] = parts.slice(0, 3).map((p) => clamp(num(p, 255), 0, 255))
    if (![r, g, b, a].every(Number.isFinite)) return null
    return rgbaToHsva({ r, g, b, a })
  }
  const h = parseFloat(parts[0])
  const [sat, l] = parts.slice(1, 3).map((p) => clamp(parseFloat(p), 0, 100))
  if (![h, sat, l, a].every(Number.isFinite)) return null
  return hslaToHsva({ h: ((h % 360) + 360) % 360, s: sat, l, a })
}

/** The color as #rrggbb, #rrggbbaa, rgb()/rgba() or hsl()/hsla(). */
function formatColor(color: Hsva, format: ColorFormat | "hex8" = "hex"): string {
  const { r, g, b, a } = hsvaToRgba(color)
  const alpha = round(a, 2)
  if (format === "hex") return `#${hex2(r)}${hex2(g)}${hex2(b)}`
  if (format === "hex8") return `#${hex2(r)}${hex2(g)}${hex2(b)}${hex2(a * 255)}`
  if (format === "rgb") return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`
  const hsl = hsvaToHsla(color)
  const body = `${Math.round(hsl.h) % 360}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
  return alpha < 1 ? `hsla(${body}, ${alpha})` : `hsl(${body})`
}

/** What the picker emits: #rrggbb, or #rrggbbaa when alpha is allowed and the color is translucent. */
const toValue = (color: Hsva, alpha: boolean) => (alpha && color.a < 1 ? formatColor(color, "hex8") : formatColor(color))

/** Every way of writing a color, for readouts and copy buttons. */
function getColorDetails(color: string | Hsva) {
  const hsva = typeof color === "string" ? (parseColor(color) ?? { h: 0, s: 0, v: 0, a: 1 }) : color
  return {
    hex: formatColor(hsva, "hex"),
    hex8: formatColor(hsva, "hex8"),
    rgb: formatColor(hsva, "rgb"),
    hsl: formatColor(hsva, "hsl"),
    alpha: round(hsva.a, 2),
    hsva,
    rgba: hsvaToRgba(hsva),
    hsla: hsvaToHsla(hsva),
  }
}
type ColorDetails = ReturnType<typeof getColorDetails>

const linear = (c: number) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = ({ r, g, b }: Rgba) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)

/** WCAG 2 contrast ratio, 1 to 21. A translucent foreground is laid over the background first. */
function getContrastRatio(foreground: string, background: string): number {
  const bgColor = parseColor(background)
  const fgColor = parseColor(foreground)
  if (!bgColor || !fgColor) return 1
  const bg = hsvaToRgba({ ...bgColor, a: 1 })
  const fgRaw = hsvaToRgba(fgColor)
  const mix = (f: number, b: number) => f * fgRaw.a + b * (1 - fgRaw.a)
  const fg = { r: mix(fgRaw.r, bg.r), g: mix(fgRaw.g, bg.g), b: mix(fgRaw.b, bg.b), a: 1 }
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Whichever of two text colors reads better on the background. */
function getReadableTextColor(background: string, light = "#ffffff", dark = "#0a0a0a") {
  return getContrastRatio(light, background) >= getContrastRatio(dark, background) ? light : dark
}

const HUE_NAMES: [number, string][] = [
  [15, "red"],
  [40, "orange"],
  [65, "yellow"],
  [90, "lime"],
  [150, "green"],
  [175, "teal"],
  [200, "cyan"],
  [250, "blue"],
  [280, "indigo"],
  [310, "purple"],
  [335, "pink"],
]
const hueName = (h: number) => HUE_NAMES.find(([max]) => h < max)?.[1] ?? "red"

/** Grays and black have no hue (and black no saturation): keep the previous ones so the thumbs stay put. */
function keepHue(next: Hsva, prev: Hsva): Hsva {
  return { ...next, h: next.s < 0.5 || next.v < 0.5 ? prev.h : next.h, s: next.v < 0.5 ? prev.s : next.s }
}

/** A checkerboard from the theme, behind anything translucent. */
const CHECKER =
  "repeating-conic-gradient(color-mix(in oklch, var(--foreground) 22%, var(--background)) 0 25%, var(--background) 0 50%)"

// ---------------------------------------------------------------------------------------------
// State

type CommitOptions = { recent?: boolean }
type ColorPickerContextValue = {
  color: Hsva
  value: string
  alpha: boolean
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
  setColor: (color: Hsva) => void
  commit: (color: Hsva, options?: CommitOptions) => void
  recent: string[]
  id: string
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null)

function useColorPicker() {
  const ctx = React.useContext(ColorPickerContext)
  if (!ctx) throw new Error("Color picker parts must be inside <ColorPicker>")
  return ctx
}

function useControllable<T>(prop: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [inner, setInner] = React.useState(initial)
  const controlled = prop !== undefined
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange],
  )
  return [controlled ? prop : inner, set] as const
}

type ColorPickerProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** Any CSS hex, rgb() or hsl() color. */
  value?: string
  defaultValue?: string
  /** While the color changes (every drag step and keystroke). */
  onValueChange?: (value: string, details: ColorDetails) => void
  /** When the person settles on a color: end of a drag, Enter or blur in an input, a swatch, the eyedropper. */
  onValueCommit?: (value: string) => void
  /** Allow translucent colors: shows ColorPickerAlpha and the A inputs, and emits #rrggbbaa. */
  alpha?: boolean
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  recentColors?: string[]
  defaultRecentColors?: string[]
  onRecentColorsChange?: (colors: string[]) => void
  maxRecentColors?: number
}

function ColorPicker({
  value,
  defaultValue = "#2563eb",
  onValueChange,
  onValueCommit,
  alpha = false,
  format: formatProp,
  defaultFormat = "hex",
  onFormatChange,
  recentColors,
  defaultRecentColors = [],
  onRecentColorsChange,
  maxRecentColors = 8,
  className,
  children,
  ...props
}: ColorPickerProps) {
  const id = React.useId()
  const [color, setColorState] = React.useState<Hsva>(() => {
    const parsed = parseColor(value ?? defaultValue) ?? { h: 0, s: 0, v: 0, a: 1 }
    return alpha ? parsed : { ...parsed, a: 1 }
  })
  // Follow the value prop, but keep our own hue and saturation when it is the color we already show.
  const [syncedValue, setSyncedValue] = React.useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    const parsed = parseColor(value)
    if (parsed && toValue(parsed, alpha) !== toValue(color, alpha)) setColorState(keepHue(alpha ? parsed : { ...parsed, a: 1 }, color))
  }
  const [format, setFormat] = useControllable(formatProp, defaultFormat, onFormatChange)
  const [recent, setRecent] = useControllable(recentColors, defaultRecentColors, onRecentColorsChange)
  const current = toValue(color, alpha)

  const setColor = (next: Hsva) => {
    const n = alpha ? next : { ...next, a: 1 }
    setColorState(n)
    const v = toValue(n, alpha)
    if (v !== current) onValueChange?.(v, getColorDetails(n))
  }
  const commit = (next: Hsva, { recent: addToRecent = true }: CommitOptions = {}) => {
    const v = toValue(alpha ? next : { ...next, a: 1 }, alpha)
    onValueCommit?.(v)
    if (addToRecent) setRecent([v, ...recent.filter((c) => c.toLowerCase() !== v)].slice(0, maxRecentColors))
  }

  return (
    <ColorPickerContext.Provider value={{ color, value: current, alpha, format, setFormat, setColor, commit, recent, id }}>
      <div
        role="group"
        aria-label="Color picker"
        data-slot="color-picker"
        className={cn("flex w-full min-w-0 flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </ColorPickerContext.Provider>
  )
}

// ---------------------------------------------------------------------------------------------
// Area and sliders

const thumbClass =
  "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.35)] outline-none focus-visible:ring-3 focus-visible:ring-ring/60"

/** Pointer dragging with capture: works for mouse, pen and touch. */
function useDrag(onMove: (x: number, y: number) => void, onEnd: () => void) {
  const dragging = React.useRef(false)
  const at = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    onMove(clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1))
  }
  const end = () => {
    if (!dragging.current) return
    dragging.current = false
    onEnd()
  }
  return {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      dragging.current = true
      ;(e.currentTarget.querySelector("[role=slider]") as HTMLElement | null)?.focus({ preventScroll: true })
      at(e)
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (dragging.current) at(e)
    },
    onPointerUp: end,
    onPointerCancel: end,
    onLostPointerCapture: end,
  }
}

/** Arrow keys move by 1, Shift + arrows by 10; Page Up/Down by 10; Home/End jump to the ends. */
function stepFromKey(e: React.KeyboardEvent): { x: number; y: number; jump?: "min" | "max" } | null {
  const step = e.shiftKey ? 10 : 1
  switch (e.key) {
    case "ArrowLeft":
      return { x: -step, y: 0 }
    case "ArrowRight":
      return { x: step, y: 0 }
    case "ArrowUp":
      return { x: 0, y: step }
    case "ArrowDown":
      return { x: 0, y: -step }
    case "PageUp":
      return { x: 0, y: 10 }
    case "PageDown":
      return { x: 0, y: -10 }
    case "Home":
      return { x: 0, y: 0, jump: "min" }
    case "End":
      return { x: 0, y: 0, jump: "max" }
    default:
      return null
  }
}

/** Commits once when focus leaves a control that the keyboard changed. */
function useKeyboardCommit() {
  const { color, commit } = useColorPicker()
  const changed = React.useRef(false)
  return {
    mark: () => {
      changed.current = true
    },
    onBlur: () => {
      if (!changed.current) return
      changed.current = false
      commit(color)
    },
  }
}

function ColorPickerArea({ className, style, ...props }: React.ComponentProps<"div">) {
  const { color, setColor, commit } = useColorPicker()
  const latest = React.useRef(color)
  const keys = useKeyboardCommit()
  const drag = useDrag(
    (x, y) => {
      latest.current = { ...color, s: x * 100, v: (1 - y) * 100 }
      setColor(latest.current)
    },
    () => commit(latest.current),
  )
  const s = Math.round(color.s)
  const v = Math.round(color.v)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = stepFromKey(e)
    if (!d) return
    e.preventDefault()
    const ns = d.jump ? (d.jump === "min" ? 0 : 100) : clamp(s + d.x, 0, 100)
    setColor({ ...color, s: ns, v: clamp(v + d.y, 0, 100) })
    keys.mark()
  }
  return (
    <div
      data-slot="color-picker-area"
      className={cn("relative h-40 w-full shrink-0 cursor-crosshair touch-none rounded-lg select-none", className)}
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${color.h} 100% 50%))`,
        ...style,
      }}
      {...drag}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-foreground/10 ring-inset" />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-roledescription="2D slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={s}
        aria-valuetext={`Saturation ${s}%, brightness ${v}%`}
        data-slot="color-picker-area-thumb"
        className={thumbClass}
        style={{ left: `${color.s}%`, top: `${100 - color.v}%`, background: formatColor({ ...color, a: 1 }) }}
        onKeyDown={onKeyDown}
        onBlur={keys.onBlur}
      />
    </div>
  )
}

type SliderProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  label: string
  value: number
  max: number
  valueText: string
  track: React.CSSProperties
  thumb: string
  /** The picker color for a slider value. */
  toColor: (value: number) => Hsva
}

function ColorSlider({ label, value, max, valueText, track, thumb, toColor, className, ...props }: SliderProps) {
  const { color, setColor, commit } = useColorPicker()
  const keys = useKeyboardCommit()
  const latest = React.useRef(color)
  const drag = useDrag(
    (x) => {
      latest.current = toColor(round(x * max))
      setColor(latest.current)
    },
    () => commit(latest.current),
  )
  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = stepFromKey(e)
    if (!d) return
    e.preventDefault()
    setColor(toColor(d.jump ? (d.jump === "min" ? 0 : max) : clamp(Math.round(value) + d.x + d.y, 0, max)))
    keys.mark()
  }
  return (
    <div
      className={cn("relative h-3 w-full min-w-0 cursor-pointer touch-none rounded-full select-none", className)}
      style={track}
      {...drag}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-foreground/10 ring-inset" />
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        aria-valuetext={valueText}
        className={cn(thumbClass, "top-1/2")}
        style={{ left: `${(value / max) * 100}%`, background: thumb }}
        onKeyDown={onKeyDown}
        onBlur={keys.onBlur}
      />
    </div>
  )
}

const HUE_GRADIENT = "linear-gradient(to right, #f00 0%, #ff0 16.67%, #0f0 33.33%, #0ff 50%, #00f 66.67%, #f0f 83.33%, #f00 100%)"

function ColorPickerHue({ className, ...props }: React.ComponentProps<"div">) {
  const { color } = useColorPicker()
  const h = Math.round(color.h)
  return (
    <ColorSlider
      data-slot="color-picker-hue"
      label="Hue"
      value={color.h}
      max={360}
      valueText={`${h} degrees, ${hueName(h)}`}
      track={{ background: HUE_GRADIENT }}
      thumb={`hsl(${color.h} 100% 50%)`}
      toColor={(h) => ({ ...color, h })}
      className={className}
      {...props}
    />
  )
}

/** Renders only when the ColorPicker has `alpha`. */
function ColorPickerAlpha({ className, ...props }: React.ComponentProps<"div">) {
  const { color, alpha } = useColorPicker()
  if (!alpha) return null
  const { r, g, b } = hsvaToRgba(color)
  const pct = Math.round(color.a * 100)
  return (
    <ColorSlider
      data-slot="color-picker-alpha"
      label="Opacity"
      value={pct}
      max={100}
      valueText={`${pct}%`}
      track={{
        backgroundImage: `linear-gradient(to right, rgb(${r} ${g} ${b} / 0), rgb(${r} ${g} ${b})), ${CHECKER}`,
        backgroundSize: "100% 100%, 8px 8px",
      }}
      thumb={`rgb(${r} ${g} ${b} / ${color.a})`}
      toColor={(p) => ({ ...color, a: p / 100 })}
      className={className}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------------------------
// Eyedropper

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> }
const noSubscribe = () => () => {}

/** A button that samples a color from anywhere on screen. Renders nothing where the browser has no EyeDropper. */
function ColorPickerEyeDropper({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { color, setColor, commit } = useColorPicker()
  const supported = React.useSyncExternalStore(
    noSubscribe,
    () => "EyeDropper" in window,
    () => false,
  )
  if (!supported) return null
  const pick = async () => {
    try {
      const Dropper = (window as unknown as { EyeDropper: EyeDropperCtor }).EyeDropper
      const { sRGBHex } = await new Dropper().open()
      const picked = parseColor(sRGBHex)
      if (!picked) return
      const next = { ...picked, a: color.a }
      setColor(next)
      commit(next)
    } catch {
      // Cancelled with Escape.
    }
  }
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Pick a color from the screen"
      title="Pick a color from the screen"
      data-slot="color-picker-eyedropper"
      className={className}
      onClick={pick}
      {...props}
    >
      <PipetteIcon />
    </Button>
  )
}

// ---------------------------------------------------------------------------------------------
// Inputs

const FORMATS = [
  { value: "hex", label: "Hex" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
]

/** Switches ColorPickerInput between hex, RGB and HSL. */
function ColorPickerFormatSelect({ className }: { className?: string }) {
  const { format, setFormat } = useColorPicker()
  return (
    <Select items={FORMATS} value={format} onValueChange={(v) => v && setFormat(v as ColorFormat)}>
      <SelectTrigger size="sm" aria-label="Color format" data-slot="color-picker-format" className={cn("h-8 w-[4.75rem] shrink-0", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {FORMATS.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Field({ short, className, children }: { short: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex min-w-0 flex-1 flex-col items-center gap-1", className)}>
      {children}
      <span aria-hidden="true" className="text-xs leading-none text-muted-foreground">
        {short}
      </span>
    </label>
  )
}

/** A whole-number field: type a value, or Arrow Up/Down (Shift for 10). Out of range values clamp on blur. */
function NumberField({ label, short, value, max, toColor }: { label: string; short: string; value: number; max: number; toColor: (n: number) => Hsva }) {
  const { color, alpha, setColor, commit } = useColorPicker()
  const shown = String(Math.round(value))
  const [draft, setDraft] = React.useState<{ text: string; for: string } | null>(null)
  const start = React.useRef<string | null>(null)
  const text = draft && draft.for === shown ? draft.text : shown
  /** Applies what was typed (clamped) and returns the color the field settled on. */
  const finish = () => {
    let next = color
    if (draft && draft.for === shown) {
      const n = parseFloat(draft.text)
      if (Number.isFinite(n)) {
        next = toColor(clamp(Math.round(n), 0, max))
        setColor(next)
      }
    }
    setDraft(null)
    return next
  }
  const commitIfChanged = (next: Hsva) => {
    if (start.current !== null && start.current !== toValue(next, alpha)) commit(next)
  }
  return (
    <Field short={short}>
      <Input
        inputMode="numeric"
        aria-label={label}
        value={text}
        className="h-8 px-1 text-center tabular-nums"
        onFocus={(e) => {
          start.current = toValue(color, alpha)
          e.currentTarget.select()
        }}
        onChange={(e) => {
          const t = e.target.value.replace(/[^\d.]/g, "").slice(0, 3)
          const n = parseFloat(t)
          if (Number.isFinite(n) && n >= 0 && n <= max) {
            setColor(toColor(n))
            setDraft({ text: t, for: String(Math.round(n)) })
          } else setDraft({ text: t, for: shown })
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            const step = (e.shiftKey ? 10 : 1) * (e.key === "ArrowUp" ? 1 : -1)
            setColor(toColor(clamp(Math.round(value) + step, 0, max)))
            setDraft(null)
          } else if (e.key === "Enter") {
            const next = finish()
            commitIfChanged(next)
            start.current = toValue(next, alpha)
          }
        }}
        onBlur={() => {
          commitIfChanged(finish())
          start.current = null
        }}
      />
    </Field>
  )
}

/** What is typed, the color it was typed over, and whether typing already changed the color. */
type HexDraft = { text: string; for: string; invalid?: boolean; applied?: boolean } | null

/** Hex digits apply as you type once there are six or eight; three, four or a pasted rgb()/hsl() wait for Enter or blur. */
function HexField({ draft, setDraft, errorId }: { draft: HexDraft; setDraft: (d: HexDraft) => void; errorId: string }) {
  const { color, alpha, setColor, commit } = useColorPicker()
  const shown = formatColor(color, "hex")
  const active = draft && draft.for === shown ? draft : null

  const read = (text: string) => {
    const rgba = parseHex(text)
    if (rgba) {
      const digits = text.trim().replace("#", "").length
      return keepHue({ ...rgbaToHsva(rgba), a: alpha && (digits === 4 || digits === 8) ? rgba.a : color.a }, color)
    }
    const parsed = parseColor(text)
    return parsed ? keepHue(alpha ? parsed : { ...parsed, a: color.a }, color) : null
  }
  const apply = () => {
    if (!active) return
    if (active.text.trim().replace("#", "").toLowerCase() === shown.slice(1)) {
      setDraft(null)
      if (active.applied) commit(color)
      return
    }
    const next = read(active.text)
    if (!next) return setDraft({ ...active, invalid: true })
    setDraft(null)
    setColor(next)
    commit(next)
  }

  return (
    <Field short="Hex" className="flex-[2.4]">
      <Input
        aria-label="Hex color"
        spellCheck={false}
        autoComplete="off"
        value={active ? active.text : shown}
        aria-invalid={active?.invalid || undefined}
        aria-describedby={active?.invalid ? errorId : undefined}
        className="h-8 px-2 tabular-nums"
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const text = e.target.value
          const next = /^#?([0-9a-f]{6}|[0-9a-f]{8})$/i.test(text.trim()) ? read(text) : null
          if (next) {
            setColor(next)
            setDraft({ text, for: formatColor(next, "hex"), applied: true })
          } else setDraft({ text, for: shown, applied: active?.applied })
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") apply()
          if (e.key === "Escape" && active) {
            // Undo the typing instead of closing a surrounding popover.
            e.stopPropagation()
            setDraft(null)
          }
        }}
        onBlur={apply}
      />
    </Field>
  )
}

/** The fields for the current format (hex, RGB or HSL), plus opacity when the picker has alpha. */
function ColorPickerInput({ className, ...props }: React.ComponentProps<"div">) {
  const { color, alpha, format, id } = useColorPicker()
  const [hexDraft, setHexDraft] = React.useState<HexDraft>(null)
  const rgba = hsvaToRgba(color)
  const hsla = hsvaToHsla(color)
  const fromRgb = (patch: Partial<Rgba>) => keepHue(rgbaToHsva({ ...rgba, ...patch }), color)
  const fromHsl = (patch: Partial<Hsla>) => hslaToHsva({ ...hsla, ...patch })
  const errorId = `${id}-hex-error`
  const hexInvalid = format === "hex" && !!hexDraft?.invalid && hexDraft.for === formatColor(color, "hex")
  return (
    <div data-slot="color-picker-input" className={cn("flex min-w-0 flex-1 flex-col gap-1.5", className)} {...props}>
      <div className="flex min-w-0 gap-1.5">
        {format === "hex" ? <HexField draft={hexDraft} setDraft={setHexDraft} errorId={errorId} /> : null}
        {format === "rgb" ? (
          <>
            <NumberField label="Red" short="R" value={rgba.r} max={255} toColor={(r) => fromRgb({ r })} />
            <NumberField label="Green" short="G" value={rgba.g} max={255} toColor={(g) => fromRgb({ g })} />
            <NumberField label="Blue" short="B" value={rgba.b} max={255} toColor={(b) => fromRgb({ b })} />
          </>
        ) : null}
        {format === "hsl" ? (
          <>
            <NumberField label="Hue, degrees" short="H" value={hsla.h} max={360} toColor={(h) => fromHsl({ h })} />
            <NumberField label="Saturation, percent" short="S" value={hsla.s} max={100} toColor={(s) => fromHsl({ s })} />
            <NumberField label="Lightness, percent" short="L" value={hsla.l} max={100} toColor={(l) => fromHsl({ l })} />
          </>
        ) : null}
        {alpha ? (
          <NumberField label="Opacity, percent" short="A" value={color.a * 100} max={100} toColor={(n) => ({ ...color, a: n / 100 })} />
        ) : null}
      </div>
      {hexInvalid ? (
        <p id={errorId} role="alert" data-slot="color-picker-input-error" className="text-xs text-destructive">
          Use 3, 6 or 8 hex digits, like #3b82f6.
        </p>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Swatches

type SwatchColor = string | { value: string; label?: string }

/** A color chip with a checkerboard behind it, for triggers and readouts. Shows the picker's color by default. */
function ColorPickerSwatch({ color, className, ...props }: React.ComponentProps<"span"> & { color?: string }) {
  const ctx = React.useContext(ColorPickerContext)
  const c = color ?? ctx?.value ?? "transparent"
  return (
    <span
      data-slot="color-picker-swatch"
      aria-hidden="true"
      className={cn("relative inline-block size-5 shrink-0 overflow-hidden rounded-md", className)}
      style={{ backgroundImage: CHECKER, backgroundSize: "8px 8px" }}
      {...props}
    >
      <span className="absolute inset-0" style={{ background: c }} />
      <span className="absolute inset-0 rounded-[inherit] ring-1 ring-foreground/15 ring-inset" />
    </span>
  )
}

type SwatchGridProps = React.ComponentProps<"div"> & {
  colors: SwatchColor[]
  /** A visible heading for the row; without one, pass aria-label or aria-labelledby (they go on the swatch group). */
  label?: string
  /** Shown in place of the swatches when there are none. */
  emptyText?: string
  /** Lay the swatches out in this many equal columns that fill the width, instead of a wrapping row. */
  columns?: number
}

/** Swatch buttons in a wrapping row. Arrow keys move between them; Enter or Space picks one. `children` go at the end of the row. */
function SwatchGrid({ colors, label, emptyText, columns, recent, className, children, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: SwatchGridProps & { recent?: boolean }) {
  const { color, value, alpha, setColor, commit } = useColorPicker()
  const labelId = React.useId()
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null)
  const items = colors
    .map((c) => (typeof c === "string" ? { value: c } : c))
    .map((c) => ({ ...c, color: parseColor(c.value) }))
    .filter((c): c is { value: string; label?: string; color: Hsva } => !!c.color)
  const selected = items.findIndex((c) => toValue(alpha ? c.color : { ...c.color, a: 1 }, alpha) === value)
  const tabbable = focusIndex !== null && focusIndex < items.length ? focusIndex : Math.max(selected, 0)

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const buttons = refs.current.slice(0, items.length).filter(Boolean) as HTMLButtonElement[]
    const top = buttons[0]?.offsetTop
    const cols = Math.max(1, buttons.filter((b) => b.offsetTop === top).length)
    const keys: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + cols, ArrowUp: i - cols, Home: 0, End: items.length - 1 }
    const next = keys[e.key]
    if (next === undefined) return
    e.preventDefault()
    const n = clamp(next, 0, items.length - 1)
    refs.current[n]?.focus()
    setFocusIndex(n)
  }

  return (
    <div data-slot={recent ? "color-picker-recent" : "color-picker-swatches"} className={cn("flex flex-col gap-2", className)} {...props}>
      {label ? (
        <p id={labelId} className="text-xs font-medium text-muted-foreground">
          {label}
        </p>
      ) : null}
      <div
        role="group"
        aria-labelledby={label ? labelId : ariaLabelledBy} aria-label={label ? undefined : ariaLabel}
        className={columns ? "grid gap-1.5" : "flex flex-wrap items-center gap-1.5"}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {!items.length && emptyText ? <p className="col-span-full mr-1 text-xs text-muted-foreground">{emptyText}</p> : null}
        {items.map((c, i) => {
          const on = i === selected
          const opaque = formatColor({ ...c.color, a: 1 })
          return (
            <button
              key={`${c.value}-${i}`}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              aria-label={c.label ? `${c.label}, ${c.value}` : c.value}
              aria-pressed={on}
              title={c.label ?? c.value}
              tabIndex={i === tabbable ? 0 : -1}
              data-slot="color-picker-swatch-button"
              className={cn(
                "relative flex shrink-0 cursor-pointer",
                columns ? "aspect-square w-full" : "size-[var(--swatch-size,1.5rem)]",
                "items-center justify-center overflow-hidden rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60 aria-pressed:ring-2 aria-pressed:ring-ring aria-pressed:ring-offset-2 aria-pressed:ring-offset-background",
              )}
              style={{ backgroundImage: CHECKER, backgroundSize: "8px 8px" }}
              onFocus={() => setFocusIndex(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onClick={() => {
                const next = keepHue(alpha ? c.color : { ...c.color, a: 1 }, color)
                setColor(next)
                commit(next, { recent: false })
              }}
            >
              <span className="absolute inset-0" style={{ background: c.value }} />
              <span className="absolute inset-0 rounded-[inherit] ring-1 ring-foreground/15 ring-inset" />
              {on ? <CheckIcon className="relative size-3.5" strokeWidth={3} style={{ color: getReadableTextColor(opaque) }} /> : null}
            </button>
          )
        })}
        {children}
      </div>
    </div>
  )
}

/** Preset colors. Picking one sets the color without adding it to the recent list. */
function ColorPickerSwatches(props: SwatchGridProps) {
  return <SwatchGrid {...props} />
}

/** Colors the person settled on, newest first (see onValueCommit). Shows `emptyText` until there are some. */
function ColorPickerRecent({ label = "Recent", emptyText = "Colors you pick show up here.", ...props }: Omit<SwatchGridProps, "colors">) {
  const { recent } = useColorPicker()
  return <SwatchGrid colors={recent} label={label} emptyText={emptyText} recent {...props} />
}

export {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerRecent,
  ColorPickerSwatch,
  ColorPickerSwatches,
  formatColor,
  getColorDetails,
  getContrastRatio,
  getReadableTextColor,
  parseColor,
  useColorPicker,
}
export type { ColorDetails, ColorFormat, Hsla, Hsva, Rgba, SwatchColor }
