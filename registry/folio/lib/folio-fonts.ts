// Folio's two families, loaded with next/font. Put both variables on <html> in app/layout.tsx:
//
//   import { folioFonts } from "@/lib/folio-fonts"
//   <html lang="en" className={folioFonts}>
//
// Newsreader (with its optical-size axis) carries headlines and figures; DM Sans carries the interface.
import { DM_Sans, Newsreader } from "next/font/google"

export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
})

export const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const folioFonts = `${newsreader.variable} ${dmSans.variable}`
