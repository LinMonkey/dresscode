// DressCode themes: one shadcn/ui template, many dress codes (round 7, 2026-11-24).
// Each theme is the user's three-color palette re-cast with the proportions measured on 54 product
// sites (style-packs/research/2026-11-24-web-colors): neutral page and cards for most of the screen,
// at most one full-width band, the accent only on actions, the third color only as small marks.
// The mock-ups are style-packs/design/chatgpt/themes-v2/T0x-A*.png.
//
// Every theme comes in light and dark (round 8). `mode` is the one it was designed in and stays the
// default; `modes.light` / `modes.dark` hold both color sets, and `colors` is the default one.
// tools/dresscode-contrast.mjs checks every text/fill pair of both (text 4.5:1, edges 3:1).

export type FontKey =
  | "geist" | "geistMono" | "interTight" | "inter" | "fraunces" | "instrumentSans" | "manrope"
  | "bricolage" | "dmSans" | "instrumentSerif" | "jakarta" | "barlowCondensed" | "barlow"

export type Mode = "light" | "dark"
export const MODES: Mode[] = ["light", "dark"]

export type DcColors = {
  page: string
  surface: string
  band: string
  bandInk: string
  ink: string
  muted: string
  line: string
  primary: string
  primaryInk: string
  accent: string
  highlight: string
  highlightInk: string
  danger: string
  /** The primary button when it sits on the band. */
  bandPrimary: string
  bandPrimaryInk: string
}

export type DcTheme = {
  id: string
  name: string
  /** One line for the switcher and the theme gallery. */
  blurb: string
  /** The mode the theme was designed in, and the default wherever no mode is given. */
  mode: Mode
  /** The user's original three colors, for credit and for the swatch. */
  palette: [string, string, string]
  /** The colors in the default mode (the same object as modes[mode]). */
  colors: DcColors
  /** The colors in each mode. */
  modes: Record<Mode, DcColors>
  fonts: { heading: FontKey; body: FontKey; num?: FontKey }
  headingWeight: number
  headingTracking: string
  radius: { control: number; card: number }
  /** Where the one colored band goes on the landing page. */
  bandAt: "hero" | "feature" | "cta"
  /** How the headline marks its key words. In dark mode the highlighter becomes a solid marker box. */
  mark: "highlighter" | "accent" | "muted" | "italic" | "none"
  /** Ink outlines and hard offset shadows (Pop). */
  brutal?: boolean
  /** A faint accent glow behind the hero product shot (Midnight). */
  glow?: boolean
}

type ThemeDef = Omit<DcTheme, "colors" | "modes"> & { light: DcColors; dark: DcColors }

function define(d: ThemeDef): DcTheme {
  const { light, dark, ...rest } = d
  const modes = { light, dark }
  return { ...rest, colors: modes[d.mode], modes }
}

export const THEMES: DcTheme[] = [
  define({
    id: "mono", name: "Mono", blurb: "No color at all. Type and the product carry the page.", mode: "light",
    palette: ["#FAFAFA", "#0A0A0A", "#666666"],
    light: {
      page: "#FAFAFA", surface: "#FFFFFF", band: "#111111", bandInk: "#FAFAFA", ink: "#0A0A0A", muted: "#666666", line: "#E8E8E8",
      primary: "#171717", primaryInk: "#FFFFFF", accent: "#171717", highlight: "#EDEDED", highlightInk: "#0A0A0A", danger: "#D92D20",
      bandPrimary: "#FFFFFF", bandPrimaryInk: "#111111",
    },
    dark: {
      page: "#0A0A0A", surface: "#141414", band: "#EDEDED", bandInk: "#0A0A0A", ink: "#EDEDED", muted: "#A1A1A1", line: "#262626",
      primary: "#EDEDED", primaryInk: "#0A0A0A", accent: "#EDEDED", highlight: "#2A2A2A", highlightInk: "#EDEDED", danger: "#FF6B5E",
      bandPrimary: "#0A0A0A", bandPrimaryInk: "#FAFAFA",
    },
    fonts: { heading: "geist", body: "geist", num: "geistMono" }, headingWeight: 600, headingTracking: "-0.035em",
    radius: { control: 10, card: 14 }, bandAt: "cta", mark: "muted",
  }),
  define({
    id: "cobalt", name: "Cobalt", blurb: "White and navy ink, cobalt for every action, a yellow highlighter.", mode: "light",
    palette: ["#FCE61E", "#0824A8", "#E8340C"],
    light: {
      page: "#FFFFFF", surface: "#F6F7FB", band: "#0824A8", bandInk: "#FFFFFF", ink: "#0B1030", muted: "#545A72", line: "#E3E6EF",
      primary: "#0824A8", primaryInk: "#FFFFFF", accent: "#0824A8", highlight: "#FCE61E", highlightInk: "#0B1030", danger: "#D42F08",
      bandPrimary: "#FFFFFF", bandPrimaryInk: "#0824A8",
    },
    dark: {
      page: "#080C24", surface: "#0F1533", band: "#1A36D1", bandInk: "#FFFFFF", ink: "#F1F3FB", muted: "#9DA4C7", line: "#1F2850",
      primary: "#3B5BFF", primaryInk: "#FFFFFF", accent: "#93A6FF", highlight: "#FCE61E", highlightInk: "#0B1030", danger: "#FF6B4D",
      bandPrimary: "#FFFFFF", bandPrimaryInk: "#1A36D1",
    },
    fonts: { heading: "interTight", body: "inter" }, headingWeight: 650, headingTracking: "-0.03em",
    radius: { control: 8, card: 12 }, bandAt: "cta", mark: "highlighter",
  }),
  define({
    id: "matcha", name: "Matcha", blurb: "Parchment paper, book-black ink and one band of matcha green.", mode: "light",
    palette: ["#E7DBBB", "#121212", "#A4CE46"],
    light: {
      page: "#F5F1E6", surface: "#FBF9F3", band: "#A4CE46", bandInk: "#141414", ink: "#141414", muted: "#5E5848", line: "#E3DCC8",
      primary: "#141414", primaryInk: "#F5F1E6", accent: "#497213", highlight: "#A4CE46", highlightInk: "#141414", danger: "#B3362B",
      bandPrimary: "#141414", bandPrimaryInk: "#F5F1E6",
    },
    dark: {
      page: "#13130F", surface: "#1B1B16", band: "#A4CE46", bandInk: "#141414", ink: "#EFEADB", muted: "#A8A291", line: "#2C2B23",
      primary: "#EFEADB", primaryInk: "#141414", accent: "#A4CE46", highlight: "#A4CE46", highlightInk: "#141414", danger: "#F0705F",
      bandPrimary: "#141414", bandPrimaryInk: "#F5F1E6",
    },
    fonts: { heading: "fraunces", body: "instrumentSans" }, headingWeight: 560, headingTracking: "-0.02em",
    radius: { control: 10, card: 16 }, bandAt: "feature", mark: "none",
  }),
  define({
    id: "harbor", name: "Harbor", blurb: "A deep indigo night where the tangerine button is the only warm thing.", mode: "dark",
    palette: ["#2E4980", "#FFFFFF", "#F3693A"],
    light: {
      page: "#F6F7FA", surface: "#FFFFFF", band: "#2B4579", bandInk: "#FFFFFF", ink: "#0F1A2E", muted: "#536079", line: "#E1E5ED",
      primary: "#EA5F2C", primaryInk: "#0F1A2E", accent: "#2E4980", highlight: "#FFE4D8", highlightInk: "#7E2A0D", danger: "#C93A22",
      bandPrimary: "#F3693A", bandPrimaryInk: "#0F1A2E",
    },
    dark: {
      page: "#0F1A2E", surface: "#16233D", band: "#2B4579", bandInk: "#FFFFFF", ink: "#F2F4F8", muted: "#9BA8C4", line: "#263453",
      primary: "#F3693A", primaryInk: "#0F1A2E", accent: "#F68A62", highlight: "#3A2A2E", highlightInk: "#F8B597", danger: "#F0644F",
      bandPrimary: "#F3693A", bandPrimaryInk: "#0F1A2E",
    },
    fonts: { heading: "manrope", body: "manrope" }, headingWeight: 750, headingTracking: "-0.03em",
    radius: { control: 10, card: 14 }, bandAt: "feature", mark: "accent",
  }),
  define({
    id: "pop", name: "Pop", blurb: "Ink outlines and hard shadows, pink buttons, a lemon highlighter.", mode: "light",
    palette: ["#43991B", "#FEEE01", "#FD6ECB"],
    light: {
      page: "#F6F5EF", surface: "#FFFFFF", band: "#FD6ECB", bandInk: "#0F0F0F", ink: "#0F0F0F", muted: "#55554C", line: "#E4E3DA",
      primary: "#FD6ECB", primaryInk: "#0F0F0F", accent: "#2F7A12", highlight: "#FEEE01", highlightInk: "#0F0F0F", danger: "#C9261A",
      bandPrimary: "#0F0F0F", bandPrimaryInk: "#FFFFFF",
    },
    dark: {
      page: "#11110F", surface: "#1A1A17", band: "#FD6ECB", bandInk: "#0F0F0F", ink: "#F6F5EF", muted: "#B3B2A7", line: "#33332D",
      primary: "#FD6ECB", primaryInk: "#0F0F0F", accent: "#6FD13F", highlight: "#FEEE01", highlightInk: "#0F0F0F", danger: "#FF6E5E",
      bandPrimary: "#0F0F0F", bandPrimaryInk: "#FFFFFF",
    },
    fonts: { heading: "bricolage", body: "dmSans" }, headingWeight: 800, headingTracking: "-0.04em",
    radius: { control: 10, card: 14 }, bandAt: "feature", mark: "highlighter", brutal: true,
  }),
  define({
    id: "midnight", name: "Midnight", blurb: "Midnight black and silver, violet only where you act.", mode: "dark",
    palette: ["#0E0E16", "#E7E7E7", "#715CB2"],
    light: {
      page: "#F7F7FA", surface: "#FFFFFF", band: "#1B1830", bandInk: "#EDEDF0", ink: "#0E0E16", muted: "#5D5D6E", line: "#E3E3EA",
      primary: "#715CB2", primaryInk: "#FFFFFF", accent: "#5A46A6", highlight: "#ECE8FA", highlightInk: "#4B3A9C", danger: "#D0344F",
      bandPrimary: "#715CB2", bandPrimaryInk: "#FFFFFF",
    },
    dark: {
      page: "#0E0E16", surface: "#15151F", band: "#1B1830", bandInk: "#EDEDF0", ink: "#EDEDF0", muted: "#9696A8", line: "#262634",
      primary: "#715CB2", primaryInk: "#FFFFFF", accent: "#A897E6", highlight: "#251F3D", highlightInk: "#C9BEF2", danger: "#F0607A",
      bandPrimary: "#715CB2", bandPrimaryInk: "#FFFFFF",
    },
    fonts: { heading: "geist", body: "geist", num: "geistMono" }, headingWeight: 600, headingTracking: "-0.035em",
    radius: { control: 8, card: 12 }, bandAt: "feature", mark: "accent", glow: true,
  }),
  define({
    id: "klein", name: "Klein", blurb: "A gallery: warm apricot paper, Klein blue for actions and big numbers.", mode: "light",
    palette: ["#F6D3A9", "#817EA3", "#2E3192"],
    light: {
      page: "#FCF6EE", surface: "#FFFFFF", band: "#F6D3A9", bandInk: "#15163F", ink: "#15163F", muted: "#5E5B7F", line: "#EDE1D1",
      primary: "#2E3192", primaryInk: "#FFFFFF", accent: "#2E3192", highlight: "#E9E8F2", highlightInk: "#2E3192", danger: "#BC3A2C",
      bandPrimary: "#2E3192", bandPrimaryInk: "#FFFFFF",
    },
    dark: {
      page: "#101016", surface: "#17171F", band: "#F6D3A9", bandInk: "#15163F", ink: "#F4EEE6", muted: "#ABA7B9", line: "#2A2A36",
      primary: "#5C61F2", primaryInk: "#FFFFFF", accent: "#A3A6FF", highlight: "#24254D", highlightInk: "#CDCFFF", danger: "#F0735F",
      bandPrimary: "#2E3192", bandPrimaryInk: "#FFFFFF",
    },
    fonts: { heading: "instrumentSerif", body: "dmSans" }, headingWeight: 400, headingTracking: "-0.01em",
    radius: { control: 6, card: 10 }, bandAt: "feature", mark: "italic",
  }),
  define({
    id: "sorbet", name: "Sorbet", blurb: "One big lilac hero with a sunset-orange button, then white.", mode: "light",
    palette: ["#F29B05", "#7A5CE6", "#F2B6C6"],
    light: {
      page: "#FFFFFF", surface: "#FBF8FF", band: "#6241D2", bandInk: "#FFFFFF", ink: "#1E1240", muted: "#635A7A", line: "#ECE6F5",
      primary: "#7A5CE6", primaryInk: "#FFFFFF", accent: "#6A4DD6", highlight: "#F2B6C6", highlightInk: "#1E1240", danger: "#CF3B2A",
      bandPrimary: "#FFA51C", bandPrimaryInk: "#1E1240",
    },
    dark: {
      page: "#110D1D", surface: "#191428", band: "#6241D2", bandInk: "#FFFFFF", ink: "#F3EFFF", muted: "#ACA3C4", line: "#2C2442",
      primary: "#7A5CE6", primaryInk: "#FFFFFF", accent: "#B5A2FF", highlight: "#F2B6C6", highlightInk: "#1E1240", danger: "#FF7461",
      bandPrimary: "#FFA51C", bandPrimaryInk: "#1E1240",
    },
    fonts: { heading: "jakarta", body: "jakarta" }, headingWeight: 800, headingTracking: "-0.035em",
    radius: { control: 12, card: 18 }, bandAt: "hero", mark: "none",
  }),
  define({
    id: "hivis", name: "Hi-Vis", blurb: "A sunflower-yellow hero, cream and carbon, orange-red for alerts.", mode: "light",
    palette: ["#FFCC12", "#121212", "#F04424"],
    light: {
      page: "#FFFDF7", surface: "#FFFFFF", band: "#FFCC12", bandInk: "#121212", ink: "#121212", muted: "#5A574F", line: "#E9E4D6",
      primary: "#121212", primaryInk: "#FFFFFF", accent: "#C4361B", highlight: "#FFCC12", highlightInk: "#121212", danger: "#D8371A",
      bandPrimary: "#121212", bandPrimaryInk: "#FFFFFF",
    },
    dark: {
      page: "#131312", surface: "#1B1B19", band: "#FFCC12", bandInk: "#121212", ink: "#F4F1E8", muted: "#ABA79B", line: "#2E2D29",
      primary: "#FFCC12", primaryInk: "#121212", accent: "#F35D3F", highlight: "#FFCC12", highlightInk: "#121212", danger: "#FF6A4D",
      bandPrimary: "#121212", bandPrimaryInk: "#FFFFFF",
    },
    fonts: { heading: "barlowCondensed", body: "barlow" }, headingWeight: 700, headingTracking: "-0.01em",
    radius: { control: 4, card: 8 }, bandAt: "hero", mark: "none",
  }),
]

export const DEFAULT_THEME = "mono"

export function getTheme(id: string | undefined | null): DcTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === DEFAULT_THEME)!
}

/** A theme's colors in one mode (its own mode when none is given). */
export const colorsFor = (t: DcTheme, mode: Mode = t.mode): DcColors => t.modes[mode]

// ---------------------------------------------------------------------------------------------
// Fonts: how each family loads with next/font. registry/dresscode/fonts.ts makes the same calls for
// the site; tools/build-dresscode-registry.mjs writes them into the fonts file a theme installs.

const SANS = "ui-sans-serif, system-ui, sans-serif"
export const FONT_SPECS: Record<FontKey, { name: string; loader: string; options?: Record<string, unknown>; fallback: string }> = {
  geist: { name: "Geist", loader: "Geist", fallback: SANS },
  geistMono: { name: "Geist Mono", loader: "Geist_Mono", fallback: "ui-monospace, monospace" },
  interTight: { name: "Inter Tight", loader: "Inter_Tight", fallback: SANS },
  inter: { name: "Inter", loader: "Inter", fallback: SANS },
  fraunces: { name: "Fraunces", loader: "Fraunces", options: { style: ["normal", "italic"], axes: ["opsz"] }, fallback: "Georgia, serif" },
  instrumentSans: { name: "Instrument Sans", loader: "Instrument_Sans", fallback: SANS },
  manrope: { name: "Manrope", loader: "Manrope", fallback: SANS },
  bricolage: { name: "Bricolage Grotesque", loader: "Bricolage_Grotesque", options: { axes: ["opsz"] }, fallback: SANS },
  dmSans: { name: "DM Sans", loader: "DM_Sans", fallback: SANS },
  instrumentSerif: { name: "Instrument Serif", loader: "Instrument_Serif", options: { weight: "400", style: ["normal", "italic"] }, fallback: "Georgia, serif" },
  jakarta: { name: "Plus Jakarta Sans", loader: "Plus_Jakarta_Sans", fallback: SANS },
  barlowCondensed: { name: "Barlow Condensed", loader: "Barlow_Condensed", options: { weight: ["500", "600", "700"] }, fallback: SANS },
  barlow: { name: "Barlow", loader: "Barlow", options: { weight: ["400", "500", "600", "700"] }, fallback: SANS },
}

// ---------------------------------------------------------------------------------------------
// Color math: sRGB hex <-> OKLab, mixing the way CSS color-mix(in oklab, ...) does, WCAG contrast.

type RGB = [number, number, number]
const hexRgb = (hex: string): RGB => {
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.replace(/./g, (c) => c + c)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB
}
const rgbHex = (rgb: RGB) =>
  "#" + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase()
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(0, c) ** (1 / 2.4) - 0.055)

function oklab(hex: string): RGB {
  const [r, g, b] = hexRgb(hex).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
function fromOklab([L, a, b]: RGB): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return rgbHex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(gam) as RGB,
  )
}

/** `pct`% of `a` in `b`, as color-mix(in oklab, a pct%, b) gives it. */
export function mix(a: string, pct: number, b: string): string {
  const p = pct / 100
  const A = oklab(a)
  const B = oklab(b)
  return fromOklab([0, 1, 2].map((i) => A[i] * p + B[i] * (1 - p)) as RGB)
}

/** `fg` at `alpha` (0..1) painted over `bg`: what text-foreground/80 or opacity-80 shows. */
export function over(fg: string, alpha: number, bg: string): string {
  const f = hexRgb(fg)
  const b = hexRgb(bg)
  return rgbHex(f.map((c, i) => c * alpha + b[i] * (1 - alpha)) as RGB)
}

export function luminance(hex: string): number {
  const [r, g, b] = hexRgb(hex).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** The least of `toward` mixed into `from` that stands 3:1 (or `min`) against every color in `against`. */
export function edge(from: string, toward: string, against: string[], min = 3): string {
  for (let pct = 0; pct <= 100; pct++) {
    const c = mix(toward, pct, from)
    if (against.every((bg) => contrast(c, bg) >= min + 0.04)) return c
  }
  return toward
}

// ---------------------------------------------------------------------------------------------

/**
 * Every CSS variable a theme sets in one mode: shadcn's own (so stock components follow) plus --dc-*
 * for the band, the highlight, card shape and type. `font` maps a FontKey to a font-family stack.
 * `mode` defaults to the theme's own.
 */
export function themeVars(t: DcTheme, font: (k: FontKey) => string, mode: Mode = t.mode): Record<string, string> {
  const c = t.modes[mode]
  const dark = mode === "dark"
  const shadow = t.brutal
    ? `3px 3px 0 ${c.ink}`
    : dark
      ? "inset 0 1px 0 rgb(255 255 255 / 0.04)"
      : "0 1px 2px rgb(16 24 40 / 0.04), 0 10px 28px -14px rgb(16 24 40 / 0.12)"
  // Inputs, checkboxes, switches and outline buttons: an edge that stands 3:1 on the page and on cards.
  const input = edge(c.line, c.ink, [c.page, c.surface])
  const bandLine = mix(c.bandInk, 18, c.band)
  return {
    "--background": c.page,
    "--foreground": c.ink,
    "--card": c.surface,
    "--card-foreground": c.ink,
    "--popover": dark ? mix(c.surface, 92, "#FFFFFF") : c.surface === c.page ? "#FFFFFF" : c.surface,
    "--popover-foreground": c.ink,
    "--primary": c.primary,
    "--primary-foreground": c.primaryInk,
    "--secondary": mix(c.ink, 6, c.page),
    "--secondary-foreground": c.ink,
    "--muted": mix(c.ink, 5, c.page),
    "--muted-foreground": c.muted,
    "--accent": mix(c.ink, 6, c.page),
    "--accent-foreground": c.ink,
    "--destructive": c.danger,
    "--border": c.line,
    "--input": input,
    "--ring": c.accent,
    "--chart-1": c.accent,
    "--chart-2": mix(c.accent, 35, c.page),
    "--chart-3": c.band,
    "--chart-4": c.muted,
    "--chart-5": c.highlight,
    "--radius": `${t.radius.control}px`,
    "--sidebar": c.surface,
    "--sidebar-foreground": c.ink,
    "--sidebar-primary": c.primary,
    "--sidebar-primary-foreground": c.primaryInk,
    "--sidebar-accent": mix(c.ink, 6, c.surface),
    "--sidebar-accent-foreground": c.ink,
    "--sidebar-border": c.line,
    "--sidebar-ring": c.accent,
    "--font-sans": font(t.fonts.body),
    "--dc-page": c.page,
    "--dc-surface": c.surface,
    "--dc-ink": c.ink,
    "--dc-muted": c.muted,
    "--dc-line": c.line,
    "--dc-input": input,
    "--dc-primary": c.primary,
    "--dc-primary-fg": c.primaryInk,
    "--dc-accent": c.accent,
    "--dc-highlight": c.highlight,
    "--dc-highlight-fg": c.highlightInk,
    "--dc-danger": c.danger,
    "--dc-band": c.band,
    "--dc-band-fg": c.bandInk,
    "--dc-band-muted": mix(c.bandInk, 78, c.band),
    "--dc-band-line": bandLine,
    "--dc-band-edge": edge(bandLine, c.bandInk, [c.band]),
    "--dc-band-primary": c.bandPrimary,
    "--dc-band-primary-fg": c.bandPrimaryInk,
    "--dc-radius-card": `${t.radius.card}px`,
    "--dc-bw": t.brutal ? "1.5px" : "1px",
    "--dc-card-border": t.brutal ? c.ink : c.line,
    "--dc-outline": c.ink,
    "--dc-shadow": shadow,
    "--dc-font-heading": font(t.fonts.heading),
    "--dc-font-body": font(t.fonts.body),
    "--dc-font-num": font(t.fonts.num ?? t.fonts.body),
    "--dc-heading-weight": String(t.headingWeight),
    "--dc-heading-tracking": t.headingTracking,
  }
}

/** The variables that are the same in both modes (type and shape); the rest change with the mode. */
export const MODELESS_VARS = [
  "--radius", "--font-sans", "--dc-radius-card", "--dc-bw", "--dc-font-heading", "--dc-font-body", "--dc-font-num",
  "--dc-heading-weight", "--dc-heading-tracking",
]
