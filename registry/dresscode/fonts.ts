// The families the DressCode themes use, self-hosted by next/font. Most are not preloaded: a browser
// only downloads the family the current theme puts on screen. Three are: Geist and Geist Mono, which
// are also the site's own fonts (app/layout.tsx uses these same two definitions), and Plus Jakarta
// Sans, the first theme the site shows (Sorbet, on the home page and the block pages).
// next/font names each face by its real family ("Geist"), so a family must be defined only once: two
// definitions made two @font-face rules, and pages used the later, unpreloaded one, so text swapped
// fonts about two seconds after it first drew (11-25). The ones not preloaded use display "block":
// they show off a theme's type, so its text waits for them (up to three seconds, the first time only)
// rather than drawing in a stand-in font and jumping when they arrive. The preloaded three arrive
// before the first paint and keep "swap". The themes reference each family by its global font-family
// name (font.style.fontFamily), so portals (menus, sheets) get it too.
// The options match FONT_SPECS in themes.ts, which the installable themes' fonts files are written from.
import {
  Barlow,
  Barlow_Condensed,
  Bricolage_Grotesque,
  DM_Sans,
  Fraunces,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  Inter_Tight,
  Manrope,
  Plus_Jakarta_Sans,
} from "next/font/google"

import { FONT_SPECS, type FontKey } from "./themes"

export const geist = Geist({ subsets: ["latin"] })
export const geistMono = Geist_Mono({ subsets: ["latin"] })
const interTight = Inter_Tight({ subsets: ["latin"], preload: false, display: "block" })
const inter = Inter({ subsets: ["latin"], preload: false, display: "block" })
const fraunces = Fraunces({ subsets: ["latin"], preload: false, display: "block", style: ["normal", "italic"], axes: ["opsz"] })
const instrumentSans = Instrument_Sans({ subsets: ["latin"], preload: false, display: "block" })
const manrope = Manrope({ subsets: ["latin"], preload: false, display: "block" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false, display: "block", axes: ["opsz"] })
const dmSans = DM_Sans({ subsets: ["latin"], preload: false, display: "block" })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], preload: false, display: "block", weight: "400", style: ["normal", "italic"] })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], preload: false, display: "block", weight: ["500", "600", "700"] })
const barlow = Barlow({ subsets: ["latin"], preload: false, display: "block", weight: ["400", "500", "600", "700"] })

const FONTS: Record<FontKey, { style: { fontFamily: string } }> = {
  geist, geistMono, interTight, inter, fraunces, instrumentSans, manrope, bricolage, dmSans, instrumentSerif, jakarta, barlowCondensed, barlow,
}

export function fontStack(key: FontKey): string {
  return `${FONTS[key].style.fontFamily}, ${FONT_SPECS[key].fallback}`
}
