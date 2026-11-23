---
version: alpha
name: Folio
description: "An editorial, broadsheet-inspired design system for shadcn/ui: Newsreader headlines, DM Sans interface text, ink and newsprint with a single press-red accent, ruled panels instead of shadows."
colors:
  primary: "#171A19"
  on-primary: "#FFFFFF"
  secondary: "#4B524F"
  on-secondary: "#FFFFFF"
  tertiary: "#A32420"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#F8E3DF"
  on-tertiary-container: "#A32420"
  tertiary-deep: "#7E1916"
  neutral: "#F4F5F2"
  on-neutral: "#171A19"
  surface: "#FFFFFF"
  on-surface: "#171A19"
  outline: "#AEB5B0"
  outline-variant: "#DCDFDB"
  rule: "#6E7877"
  error: "#A32420"
  success: "#2F6A3F"
  success-container: "#E3EEE2"
  warning: "#83560E"
  warning-container: "#F6EBD3"
  info: "#2C4D78"
  info-container: "#E2E9F2"
  neutral-container: "#E8EAE6"
typography:
  masthead:
    fontFamily: Newsreader
    fontSize: 74px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.035em
  headline-display:
    fontFamily: Newsreader
    fontSize: 67px
    fontWeight: 700
    lineHeight: 70px
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.025em
  figure:
    fontFamily: Newsreader
    fontSize: 37px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.03em
  lead:
    fontFamily: DM Sans
    fontSize: 25px
    fontWeight: 400
    lineHeight: 31px
  body-lg:
    fontFamily: DM Sans
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.4
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-lg:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
  table:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "'tnum' 1"
rounded:
  none: 0px
  sm: 6px
  md: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 30px
  heading: 56px
  section-sm: 96px
  section: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: 18px
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: 18px
  button-destructive:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: 18px
  button-destructive-hover:
    backgroundColor: "{colors.tertiary-deep}"
    textColor: "{colors.on-tertiary}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: 12px
  input-error:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-surface}"
  badge-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.success}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 8px
  badge-warning:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.warning}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 8px
  badge-info:
    backgroundColor: "{colors.info-container}"
    textColor: "{colors.info}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 8px
  badge-attention:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 8px
  badge-neutral:
    backgroundColor: "{colors.neutral-container}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 8px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: 16px
  card-title:
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-sm}"
  sidebar:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-neutral}"
    width: 210px
  sidebar-item:
    textColor: "{colors.on-neutral}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: 28px
    padding: 11px
  sidebar-item-active:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-surface}"
  tab-active:
    textColor: "{colors.tertiary}"
    typography: "{typography.label-lg}"
  segmented-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  tooltip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 10px
  table-row:
    textColor: "{colors.on-surface}"
    typography: "{typography.table}"
    height: 26px
  link:
    textColor: "{colors.tertiary}"
  double-rule:
    backgroundColor: "{colors.rule}"
    height: 8px
---

## Overview

Folio is a print-inspired design system with the authority of a well-set broadsheet. Pages read like an edition: a large serif masthead, a double rule under it, generous white space between sections, and columns divided by thin rules instead of floating cards. It suits publishing tools, newsletters, journals, research products, and any SaaS that wants to feel considered and literate rather than playful.

Three ideas carry the whole system:

1. **Ink and newsprint, one red.** Almost everything is ink (#171A19) on white or newsprint (#F4F5F2). Press red (#A32420) is the only accent, and it is used sparingly, so it always means something.
2. **Rules, not shadows.** Structure comes from 1px dividers, 2px rules and the double rule. Panels sit flat on the page.
3. **Serif for reading, sans for working.** Newsreader sets headlines, titles and large numbers; DM Sans sets every control, label and line of interface text.

Folio ships as a shadcn/ui style: the same component APIs (Button, Input, Select, Tabs, Sidebar, Table, Card and so on) restyled, plus editorial blocks for marketing pages and dashboards. The free Quarterly variant swaps press red for vermilion (#C43D25) and keeps everything else.

## Colors

The palette is high-contrast neutrals plus a single accent.

- **Ink (#171A19), `primary`:** headlines, body text, primary buttons, filled selections.
- **Secondary ink (#4B524F), `secondary`:** supporting text, captions, metadata, inactive labels.
- **Press red (#A32420), `tertiary`:** the accent. Use it for links, the active tab underline, the active navigation marker, checked checkboxes, radios and switches, chart lines and bars, the recommended pricing plan, errors, and destructive buttons.
- **Press tint (#F8E3DF), `tertiary-container`:** the selected row in a sidebar, the "attention" badge, and the background of an invalid field.
- **Newsprint (#F4F5F2), `neutral`:** sidebars, table headers, quiet bands and hover fills.
- **White (#FFFFFF), `surface`:** the page and every panel.
- **Divider (#AEB5B0), `outline`:** panel borders, input borders, table row rules.
- **Hairline (#DCDFDB), `outline-variant`:** the lightest rules, bar tracks, the KPI row rule.
- **Rule (#6E7877), `rule`:** the 2px double rule and the rule under a table header.

**Ink is for doing; press red is for noticing.** Primary actions are always ink. Red never appears on an ordinary "go" button, so a red button always means danger. A large filled selection (the active segment of a segmented control, the current page in pagination, the selected calendar day) is ink; a small marker (an underline, a tick, a dot, the 4px bar beside the active sidebar item) is press red.

**Status colors** come with a tinted background and a dark text color, and every pair passes WCAG AA:

| Status | Text | Tint | Use for |
|---|---|---|---|
| success | #2F6A3F | #E3EEE2 | Sent, Paid, Active |
| warning | #83560E | #F6EBD3 | Expiring, Past due |
| info | #2C4D78 | #E2E9F2 | Scheduled, Trial |
| attention | #A32420 | #F8E3DF | Failed, needs action |
| neutral | #4B524F | #E8EAE6 | Draft, Paused |

Never add other hues: no blue links, no orange highlights, no purple gradients. Charts use press red first, then ink and the greys (`--chart-1` to `--chart-5`).

**Shade (#171A19, black in dark mode), `shade`:** only for dialog and sheet scrims (`bg-shade/40`) and the one soft shadow under floating layers (`shadow-shade/10`). Never for text or fills.

### Dark mode

Put `.dark` on `<html>` (the shadcn convention) and every token turns over; components need no `dark:` classes. Paper becomes ink-dark, ink becomes newsprint-light, and press red is lifted so it still reads:

| Token | Light | Dark |
|---|---|---|
| paper, background, card | #FFFFFF | #171A19 |
| newsprint, secondary, muted, sidebar | #F4F5F2 | #1F2321 |
| ink, foreground, primary | #171A19 | #EEF0EC |
| ink-2, muted-foreground | #4B524F | #A9B1AC |
| press, destructive, chart-1 | #A32420 | #E16464 |
| press-tint, accent | #F8E3DF | #292120 |
| hairline, border | #DCDFDB | #2D3330 |
| divider, input | #AEB5B0 | #4B524F |
| rule | #6E7877 | #858E8A |
| success / tint | #2F6A3F / #E3EEE2 | #7CC08C / #1D2E22 |
| warning / tint | #83560E / #F6EBD3 | #E2B25E / #322814 |
| info / tint | #2C4D78 / #E2E9F2 | #8DB2E3 / #1C2736 |

The rules stay the same: primary buttons are the light ink with dark text, press red is still only for noticing, and every text-on-tint pair passes WCAG AA.

## Typography

Two families, loaded with `next/font` (Newsreader with its optical-size axis, so display sizes get the tighter display cut automatically):

- **Newsreader**, bold, slightly negative tracking: mastheads, page and section headlines, card titles, large figures (KPI numbers, prices, step numbers), pull quotes, and italic kickers and captions.
- **DM Sans**: everything else. Buttons and labels are semibold (600); body and controls are regular (400).

| Token | Size / line | Use |
|---|---|---|
| masthead | 74 / 1, -0.035em | Site brand in the masthead |
| headline-display | 67 / 70 | Landing page H1 |
| headline-lg | 64 / 1.05 | Section headlines (40px on phones) |
| headline-md | 36 / 1.1 | Dashboard greeting, H3 |
| headline-sm | 26 / 1.1 | Card and panel titles (23px on phones) |
| figure | 37 / 1 | KPI figures |
| lead | 25 / 31 | Hero lead paragraph |
| body-lg | 19 / 1.4 | Marketing body |
| body-md | 16 / 24 | App body, inputs |
| body-sm | 14 / 20 | Secondary text, sidebar items |
| label-lg / md / sm | 15 / 14 / 12, semibold | Buttons, form labels, badges |
| table | 13 / 1.3, tabular figures | Dense tables |

Rules:

- **Sentence case everywhere**, including navigation group labels ("Publish", "Audience"), table headers, tabs and badges.
- **No small all-caps labels.** A section kicker is an italic Newsreader word ("Craft"), not an uppercase, letter-spaced eyebrow.
- Image captions are italic Newsreader: "Fig. 1 — The reading room, 2026."
- Use tabular figures for numbers in tables, KPIs and prices.

## Layout

- **Container:** max width 1360px with a 30px gutter on desktop (20px on phones, 25px on tablets).
- **Breakpoints:** phone by default, `md` 768px, `lg` 1024px (the dashboard sidebar appears), `xl` 1280px (the full desktop layout).
- **Section rhythm on marketing pages:** 128px between sections (`section`), 96px on smaller desktops (`section-sm`), at least 64px on phones. 56px from a section headline to its content (`heading`). Every section opens with the double rule.
- **Text measure:** keep running text under about 640px wide.
- **Spacing scale:** 4, 8, 16, 24, 32, 48, 64. Cards in a dashboard sit 16px apart; cards on marketing pages 24–32px apart.
- **Dashboard:** a 210px newsprint sidebar, an 18px content gutter, a 48px top bar closed by the double rule, then a greeting, a ruled KPI row, and panels in a `1fr 416px` grid on desktop. Density is newspaper-like: 28px navigation rows, 26px table rows, 13px table text inside panels. A full-page list (posts, members, invoices) is roomier: 32px rows, 14px text, Newsreader for the main column, a chalk bulk-action band when rows are checked, and numbered pages below.
- On phones the dashboard sidebar becomes a sheet behind a menu button, and a five-item tab bar sits at the bottom.

## Elevation & Depth

Folio is flat. Depth comes from rules and tone, not shadows.

- 1px divider (#AEB5B0) around panels, inputs and table rows; 1px hairline (#DCDFDB) for the lightest separations.
- 2px rule (#6E7877) under table headers and as a strong separator.
- **The double rule** (two 2px rules with a 4px gap) under the masthead, under the dashboard top bar, and at the top of every marketing section.
- Newsprint bands and the sidebar give a second surface tone.
- Only floating layers get a shadow: menus, selects, popovers and dialogs carry one soft, ink-tinted shadow (`shadow-lg shadow-shade/10`). Dialog and sheet scrims are ink at 40%.
- Never put drop shadows on cards, tiles, buttons or images.

## Shapes

- **0px** for ruled panels inside a page (dashboard panels, tables) and for images.
- **6px** (`rounded.sm`, `--radius`) for buttons, inputs, badges, tooltips and menu items. Checkboxes cap it at 4px so they stay square.
- **12px** (`rounded.md`, twice `--radius`) for cards and floating layers (menus, popovers, dialogs) and for the sidebar's switcher and search fields.
- **Circles** only where the shape carries meaning: avatars, radios, switches, timeline dots and step numbers.
- **Images** are high-contrast, grainy black-and-white photographs, full-bleed inside their column, with an italic "Fig." caption. Grain and the Quarterly duotone are added in CSS, not baked into the files.

## Components

Restyled shadcn/ui primitives (same props and slots as the stock components):

- **Button:** `default` (ink), `outline` (white with a divider border that turns ink on hover), `secondary` (newsprint), `ghost`, `destructive` (press red, deep red on hover), `link` (press red, underlined). Sizes 30 / 36 / 44px. A loading button shows the Spinner and a present-tense label ("Publishing…").
- **Input, Textarea, Select:** 36px ruled fields with 6px corners. Focus is an ink border with a faint ink ring. An invalid field (`aria-invalid`) gets a press-red border on a press tint, with the message in press red underneath.
- **Checkbox, Radio, Switch:** 18px controls; checked states are press red with white marks; the switch track is hairline grey when off.
- **Tabs:** `default` is newspaper section tabs (a divider rule under the row; the active tab is press red with a 2px underline); `segmented` is a boxed switch with the active segment filled ink.
- **Badge:** sentence-case tags, 20px tall: `success`, `warning`, `info`, `attention`, `neutral`, plus ink `default`.
- **Card:** a ruled panel with a 26px Newsreader title, no radius and no shadow.
- **Table:** 13px tabular text, 26px rows ruled in divider grey, a rule-grey line under the header.
- **Sidebar:** 210px newsprint panel; group labels in sentence case; the active item has a press tint and a 4px press-red bar on its left edge.
- **Tooltip:** a small ink slip with white 13px text.
- **Dropdown menu, Popover, Dialog:** white ruled sheets with 4px corners and the single soft shadow; dialog titles are Newsreader.
- **Breadcrumb:** links in press red, the current page in ink.
- **Pagination:** outlined Prev / Next, plain page numbers, the current page as a filled ink square.
- **Avatar:** initials in Newsreader on ink; 28 / 36 / 44px.
- **Calendar:** the selected day is a filled ink square; today has a press-red underline.

Folio blocks (marketing): announcement bar, masthead navigation with mega menu, editorial hero, logo strip, feature showcase, alternating features, bento grid, steps with a stats band, pull-quote testimonials, integrations list, pricing plans, plan comparison table, FAQ, journal, subscribe band, closing call to action, footer.

Folio blocks (app): dashboard shell (sidebar, top bar, phone tab bar), KPI row with sparklines, subscriber growth chart with a 7D / 30D / 12M switch, revenue by plan, recent posts table, activity timeline, goal bar, stepper, timeline, tag input, date picker.

## Do's and Don'ts

Do:

- Keep primary buttons ink and keep press red rare enough that it always signals something.
- Open sections with the double rule and give them room: 128px between sections on desktop.
- Set headlines, titles and big numbers in Newsreader; set every control in DM Sans.
- Write labels, navigation and table headers in sentence case.
- Use real interface mock-ups built from components, not screenshots inside fake browser frames.
- Use status badges for state and keep the five status colors exactly as defined.
- Keep demo data consistent: one "today", numbers that add up, scheduled items in the future.

Don't:

- Don't use small uppercase, letter-spaced eyebrow labels, and never monospace caps.
- Don't add gradients, gradient text, glassmorphism, or glow.
- Don't round cards (no `rounded-xl` / `rounded-2xl`) and don't put drop shadows on them.
- Don't build grids of identical icon-in-a-square feature cards; use ruled lists, mixed-size bento tiles or real mock-ups.
- Don't draw three dots at the top of a screenshot to fake a window.
- Don't introduce other accent colors (orange, indigo, teal) or ad-hoc greens for success; use the status tokens.
- Don't put emoji in headings or use lorem ipsum.
- Don't make red the color of an ordinary call to action.
