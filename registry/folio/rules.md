# Design system: Folio

This project uses Folio, a style from DressCode UI (https://dresscodeui.com). For any UI work:

- Read `DESIGN.md` first. It is the source of truth for colors, type, spacing, shapes and rules.
- Build from the Folio components in `components/ui/` (added with `npx shadcn@latest add https://dresscodeui.com/r/<name>.json`). Each one is documented with examples at https://dresscodeui.com/docs/components, and as Markdown at https://dresscodeui.com/llms/components/<name>.md.
- Use Folio tokens only (`text-ink`, `text-ink-2`, `bg-newsprint`, `border-hairline`, `border-divider`, `text-press`, `font-serif`, …). No hex values, no Tailwind palette colors, no new fonts, no monospace in the interface.
- Primary buttons are ink. Press red is only for links, active markers, checked controls, charts, errors and destructive actions.
- Panels are ruled, with small corners (6px on controls, 12px on cards and dialogs) and no shadows. Sentence case everywhere; no small uppercase eyebrow labels.
- Status is shown with the status tokens (success, warning, info, neutral) as dark text on its own tint.
