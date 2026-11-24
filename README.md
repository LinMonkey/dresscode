# DressCode UI

Ready-made themes for [shadcn/ui](https://ui.shadcn.com), and templates that wear all of them. Each theme has its
own colors, fonts and corners, in light and dark, and installs with one shadcn command. Free and MIT.

See every theme live: **https://dresscodeui.com/themes**

## Themes

9 themes: Mono, Cobalt, Matcha, Harbor, Pop, Midnight, Klein, Sorbet, Hi-Vis. Pick one and install it into a project set up with shadcn/ui on
Base UI (`npx shadcn@latest init -b base`):

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
[dresscodeui.com/templates](https://dresscodeui.com/templates). Docs: [dresscodeui.com/docs](https://dresscodeui.com/docs).

## Short names

```bash
npx shadcn@latest registry add "@dresscode=https://dresscodeui.com/r/dresscode/{name}.json"
npx shadcn@latest add @dresscode/sorbet @dresscode/orbit-landing
```

## What's here

- `registry/dresscode/themes.ts`: the 9 themes (every color role in both modes, fonts, corners) and how they map
  onto shadcn's variables; `dresscode.css` holds the few classes the templates add; `fonts.ts` loads the families.
- `registry/dresscode/blocks/orbit` and `blocks/orbit-app`: the Orbit landing page and dashboard.
- `tools/build-dresscode-registry.mjs`: builds `public/r/dresscode` from those sources and refuses a theme that fails
  `tools/dresscode-contrast.mjs`.
- `registry.json` and `public/r/dresscode`: the shadcn registry, exactly what https://dresscodeui.com/r/dresscode serves.
- `examples/orbit` and `examples/orbit-app`: the pages the two templates install into `app/`.

## History

DressCode UI started as Folio, an editorial component library with its own restyled components. It was retired
on November 24, 2026 in favour of the themes; its code is under the tag `folio-archive`.

## License

MIT. Built for [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
The fonts are under the SIL Open Font License.
