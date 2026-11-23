# DressCode UI

Free React components in Folio, an original editorial style: white paper, Newsreader headlines, ruled lines,
square corners, and one deep red kept for links, checked controls, errors and anything that deletes.
Built on [Base UI](https://base-ui.com) and Tailwind CSS v4, installed with the shadcn CLI, with a DESIGN.md and
a rules file that keep Claude Code, Cursor and other coding agents on-style.

Docs, live examples and props for every component: **https://dresscodeui.com/docs**

## Install

In any project set up with shadcn/ui on Base UI (`npx shadcn@latest init -b base`):

```bash
npx shadcn@latest add https://dresscodeui.com/r/button.json
```

That works with no setup and also installs the Folio theme. To use short names, register the namespace once:

```bash
npx shadcn@latest registry add "@dresscode=https://dresscodeui.com/r/{name}.json"
npx shadcn@latest add @dresscode/button @dresscode/input @dresscode/dialog
```

Then load the fonts in your root layout (see [Installation](https://dresscodeui.com/docs/installation)).

## What's here

- `registry/folio/folio.css`: the theme. Colors, type scale and spacing as Tailwind v4 theme variables, mapped onto
  shadcn's variables.
- `registry/folio/ui`: 41 components. 35 are shadcn/ui's, restyled with the same names and props;
  6 are for long-form writing: Prose, Article header, Pull quote, Footnotes, Table of contents, Newsletter signup.
- `registry/folio/blocks`: the files behind 16 free blocks (marketing sections, empty states, form fields,
  a date range picker). Their photos are placeholders in `public/folio/placeholder`.
- `registry/folio/lib/folio-fonts.ts`: Newsreader and DM Sans with next/font.
- `registry/folio/DESIGN.md`: the style written down, for people and agents.
- `registry/folio/rules.md`: a short rules file for CLAUDE.md, AGENTS.md or Cursor.
- `registry.json` and `public/r`: the shadcn registry. `public/r` is exactly what https://dresscodeui.com/r serves.
- `examples`: whole pages built from the components and blocks (article, landing, magazine), and
  `examples/charts.tsx`, eight charts on the shadcn chart in Folio's colors.

## Make it yours

[Themes](https://dresscodeui.com/themes) tunes Folio's accent, paper, type pairing, corners and rules on real
components, and gives you one command for your version:

```bash
npx shadcn@latest add https://dresscodeui.com/r/themes/<your-theme-code>.json
```

See the pages live at [dresscodeui.com/examples](https://dresscodeui.com/examples) and the charts at
[dresscodeui.com/docs/charts](https://dresscodeui.com/docs/charts).

## The Sundial template

[Sundial](https://dresscodeui.com/templates/sundial) is a paid dashboard template built from these components:
sixteen app screens with phone layouts, more than fifty app blocks, a Next.js starter and the full agent kit. It
is not in this repository.

## License

MIT. The components are restyled from [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT); see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Newsreader and DM Sans are under the SIL Open Font License.
