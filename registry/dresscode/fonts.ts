// The families the DressCode themes use, self-hosted by next/font. Not preloaded: a browser only
// downloads the family the current theme puts on screen. The themes reference each family by its
// global font-family name (font.style.fontFamily), so portals (menus, sheets) get it too.
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

const geist = Geist({ subsets: ["latin"], preload: false })
const geistMono = Geist_Mono({ subsets: ["latin"], preload: false })
const interTight = Inter_Tight({ subsets: ["latin"], preload: false })
const inter = Inter({ subsets: ["latin"], preload: false })
const fraunces = Fraunces({ subsets: ["latin"], preload: false, style: ["normal", "italic"], axes: ["opsz"] })
const instrumentSans = Instrument_Sans({ subsets: ["latin"], preload: false })
const manrope = Manrope({ subsets: ["latin"], preload: false })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false, axes: ["opsz"] })
const dmSans = DM_Sans({ subsets: ["latin"], preload: false })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], preload: false, weight: "400", style: ["normal", "italic"] })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], preload: false })
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], preload: false, weight: ["500", "600", "700"] })
const barlow = Barlow({ subsets: ["latin"], preload: false, weight: ["400", "500", "600", "700"] })

const FONTS: Record<FontKey, { style: { fontFamily: string } }> = {
  geist, geistMono, interTight, inter, fraunces, instrumentSans, manrope, bricolage, dmSans, instrumentSerif, jakarta, barlowCondensed, barlow,
}

export function fontStack(key: FontKey): string {
  return `${FONTS[key].style.fontFamily}, ${FONT_SPECS[key].fallback}`
}
