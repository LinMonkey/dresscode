#!/usr/bin/env node
// Checks every text/fill pair the DressCode themes put on screen, in both modes, against WCAG:
// text 4.5:1, button fills, control edges, focus rings and meaningful icons 3:1.
// The pairs mirror what the Orbit template and dresscode.css paint (see the `where` notes).
//
// Usage: node tools/dresscode-contrast.mjs [--all]   (--all prints passing pairs too; exit 1 on a failure)
// tools/build-dresscode-registry.mjs runs the same check and refuses to write a failing theme.
import { pathToFileURL } from "node:url"

import { contrast, mix, MODES, over, THEMES, themeVars } from "../registry/dresscode/themes.ts"

const TEXT = 4.5
const EDGE = 3

/** Every pair of one theme in one mode: [what, foreground, background, minimum, where]. */
export function pairs(t, mode) {
  const c = t.modes[mode]
  const v = themeVars(t, () => "", mode)
  const muted = v["--muted"]
  const announce = mix(c.ink, 3, c.page)
  const chip = over(c.ink, 0.06, c.page)
  const pillDangerBg = mix(c.danger, 13, c.surface)
  const pillDangerFg = mix(c.danger, 78, c.ink)
  const activeNav = mix(c.accent, 12, c.surface)
  const iconBg = mix(c.accent, 11, c.surface)
  // Pop: buttons wear the ink outline, so the outline (not the fill) is the button's edge.
  const fillEdge = (fill, bg, outline) => (t.brutal ? outline : fill)
  const p = [
    ["ink on page", c.ink, c.page, TEXT, "body text"],
    ["ink on surface", c.ink, c.surface, TEXT, "cards"],
    ["ink on popover", c.ink, v["--popover"], TEXT, "menus, sheets"],
    ["muted on page", c.muted, c.page, TEXT, "captions"],
    ["muted on surface", c.muted, c.surface, TEXT, "card captions"],
    ["muted on muted fill", c.muted, muted, TEXT, "Draft pill, bg-muted tiles"],
    ["muted on announcement", c.muted, announce, TEXT, "announcement bar"],
    ["ink 80% on page", over(c.ink, 0.8, c.page), c.page, TEXT, "nav links"],
    ["ink on hero chip", c.ink, chip, TEXT, "hero 'New' link"],
    ["accent on page", c.accent, c.page, TEXT, "kickers, stats, stars"],
    ["accent on surface", c.accent, c.surface, TEXT, "post tags, checks in cards"],
    ["accent on active nav", c.accent, activeNav, TEXT, "product preview sidebar"],
    ["danger on page", c.danger, c.page, TEXT, "destructive text"],
    ["danger pill", pillDangerFg, pillDangerBg, TEXT, "Overdue pill"],
    ["primary text", c.primaryInk, c.primary, TEXT, "buttons"],
    ["highlight text", c.highlightInk, c.highlight, TEXT, "Paid pill, stat card"],
    ["highlight text 80%", over(c.highlightInk, 0.8, c.highlight), c.highlight, TEXT, "stat card captions"],
    ["band text", c.bandInk, c.band, TEXT, "the band"],
    ["band muted", v["--dc-band-muted"], c.band, TEXT, "the band's captions"],
    ["band text 80%", over(c.bandInk, 0.8, c.band), c.band, TEXT, "nav links on a hero band"],
    ["band button text", c.bandPrimaryInk, c.bandPrimary, TEXT, "the band's button"],
    ["button on page", fillEdge(c.primary, c.page, c.ink), c.page, EDGE, "primary button edge"],
    ["button on surface", fillEdge(c.primary, c.surface, c.ink), c.surface, EDGE, "primary button in a card"],
    ["band button on band", fillEdge(c.bandPrimary, c.band, c.bandInk), c.band, EDGE, "the band's button edge"],
    ["input edge on page", v["--input"], c.page, EDGE, "inputs, checkboxes, outline buttons"],
    ["input edge on surface", v["--input"], c.surface, EDGE, "the same in cards"],
    ["band edge on band", v["--dc-band-edge"], c.band, EDGE, "outline button on the band"],
    ["focus ring on page", c.accent, c.page, EDGE, "--ring"],
    ["focus ring on surface", c.accent, c.surface, EDGE, "--ring in cards"],
    ["icon on icon tile", c.accent, iconBg, EDGE, ".dc-icon"],
    ["check on accent", c.page, c.accent, EDGE, "done step in Reminders"],
    // Pairs marked `template` (6th field) are the template's to fix: reported as WARN, never block the build.
    ["muted icon", c.muted, c.surface, EDGE, "'not included' in Compare plans (pricing.tsx)"],
  ]
  return p.map(([what, fg, bg, min, where, template = false]) => ({ what, fg, bg, min, where, template, ratio: contrast(fg, bg) }))
}

export function check() {
  const rows = []
  for (const t of THEMES) for (const mode of MODES) for (const r of pairs(t, mode)) rows.push({ theme: t.id, mode, ...r })
  return rows
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const all = process.argv.includes("--all")
  const rows = check()
  const fails = rows.filter((r) => r.ratio < r.min && !r.template)
  const warns = rows.filter((r) => r.ratio < r.min && r.template)
  for (const r of all ? rows : [...fails, ...warns])
    console.log(
      `${r.ratio >= r.min ? "ok  " : r.template ? "WARN" : "FAIL"} ${r.theme.padEnd(9)} ${r.mode.padEnd(5)} ${r.what.padEnd(24)} ${r.ratio.toFixed(2).padStart(5)} (min ${r.min}) ${r.fg} on ${r.bg}  ${r.where}`,
    )
  const lowest = {}
  for (const r of rows.filter((x) => !x.template)) {
    const k = `${r.theme} ${r.mode}`
    const m = r.ratio / r.min
    if (!lowest[k] || m < lowest[k].m) lowest[k] = { m, r }
  }
  console.log(`\n${rows.length} pairs (${THEMES.length} themes x ${MODES.length} modes x ${rows.length / THEMES.length / MODES.length}), ${fails.length} failing, ${warns.length} template warnings`)
  for (const [k, { r }] of Object.entries(lowest)) console.log(`  tightest ${k.padEnd(15)} ${r.what.padEnd(24)} ${r.ratio.toFixed(2)} (min ${r.min})`)
  process.exit(fails.length ? 1 : 0)
}
