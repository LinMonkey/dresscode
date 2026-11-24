# DressCode UI

Ready-made themes for [shadcn/ui](https://ui.shadcn.com), and templates that wear all of them. Each theme has its
own colors, fonts and corners, in light and dark, and installs with one shadcn command. Free and MIT.

See every theme live: **https://dresscodeui.com/themes**

## Themes

9 themes: Mono, Cobalt, Matcha, Harbor, Pop, Midnight, Klein, Sorbet, Hi-Vis. Pick one and install it into a project set up
with shadcn/ui on Base UI (`npx shadcn@latest init -b base`):

```bash
npx shadcn@latest add https://dresscodeui.com/r/dresscode/mono.json
```

That writes both modes' colors into your globals.css (`:root` is light, `.dark` is dark), adds the fonts with
next/font, sets the corners, and adds `lib/dresscode-theme.ts`, which the templates read. Stock shadcn/ui
components pick the theme up as they are.

Every theme starts from three hand-picked colors, re-cast the way good product sites spend color: neutral page
and cards for most of the screen, the main color on actions, one colored band, the third color only in small
marks. Every text and control pair passes WCAG AA contrast in both modes (`tools/dresscode-contrast.mjs`).

## Templates

Install a theme first, then:

```bash
npx shadcn@latest add https://dresscodeui.com/r/dresscode/orbit-landing.json   # landing page, 18 sections, at /orbit
npx shadcn@latest add https://dresscodeui.com/r/dresscode/orbit-app.json       # app dashboard, 13 screens, at /orbit-app
```

Orbit is a made-up invoicing product. The landing page and the dashboard are built from shadcn/ui components and
nothing else, so they wear whichever theme is installed. Live demos in every theme:
[dresscodeui.com/templates](https://dresscodeui.com/templates).

## Folio components

Free React components in Folio, an original editorial style: white paper, Newsreader headlines, ruled lines,
square corners, and one deep red kept for links, checked controls, errors and anything that deletes.
Built on [Base UI](https://base-ui.com) and Tailwind CSS v4, installed with the shadcn CLI, with a DESIGN.md and
a rules file that keep Claude Code, Cursor and other coding agents on-style.

Docs, live examples and props for every component: **https://dresscodeui.com/docs**

### Install

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

- `registry/dresscode/themes.ts`: the 9 themes (every color role in both modes, fonts, corners) and how they map
  onto shadcn's variables; `dresscode.css` holds the few classes the templates add.
- `registry/dresscode/blocks/orbit` and `blocks/orbit-app`: the Orbit landing page and dashboard.
- `tools/build-dresscode-registry.mjs`: builds `public/r/dresscode` from those sources and refuses a theme that fails
  `tools/dresscode-contrast.mjs`.
- `examples/orbit` and `examples/orbit-app`: the pages the two templates install into `app/`.
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

### Make Folio yours

The [Folio tuner](https://dresscodeui.com/tuner) tunes Folio's accent, paper, type pairing, corners and rules on real
components, and gives you one command for your version:

```bash
npx shadcn@latest add https://dresscodeui.com/r/themes/<your-theme-code>.json
```

See the pages live at [dresscodeui.com/examples](https://dresscodeui.com/examples) and the charts at
[dresscodeui.com/docs/charts](https://dresscodeui.com/docs/charts).

### The Sundial template

[Sundial](https://dresscodeui.com/templates/sundial) is a paid dashboard template built from these components:
sixteen app screens with phone layouts, more than fifty app blocks, a Next.js starter and the full agent kit. It
is not in this repository.

## License

MIT. The components are restyled from [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT); see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Newsreader and DM Sans are under the SIL Open Font License.
