# DressCode UI

Ready-made themes for [shadcn/ui](https://ui.shadcn.com), and the templates, components and blocks that wear all of
them. Each theme has its own colors, fonts and corners, in light and dark, and installs with one shadcn command.
Free and MIT.

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
npx shadcn@latest add https://dresscodeui.com/r/dresscode/portfolio.json       # personal site, two homes, at /portfolio
npx shadcn@latest add https://dresscodeui.com/r/dresscode/realestate.json      # real estate site, two homes, at /realestate
npx shadcn@latest add https://dresscodeui.com/r/dresscode/ecommerce.json       # online store, two homes, at /store
```

Orbit is a made-up invoicing product; the portfolio belongs to a made-up designer, the real estate site to a
made-up brokerage and the store to a made-up home goods brand. All five are built from shadcn/ui components and
nothing else, so they wear whichever theme is installed. The portfolio has two home pages (a text-first index or a
grid of covers) and every page a personal site needs: work, case studies and galleries, about, a resume that prints
to one A4 page, services with prices, writing, contact, uses and now. The real estate site has a platform home and a
boutique one, search with a drawn map (no map service or key), listing pages with tour booking and a payment
calculator, agents, neighborhoods, a valuation, compare and saved homes. The store has a department-store home and a
brand one, shop pages with filters, product pages with colors and sizes, a cart drawer, one-page checkout (payment is
one function for your provider), an account with orders, gift cards and a journal. Their sample photographs load
from dresscodeui.com until you point them at yours. Live demos in every theme:
[dresscodeui.com/templates](https://dresscodeui.com/templates). Docs: [dresscodeui.com/docs](https://dresscodeui.com/docs).

## Components

10 components shadcn/ui doesn't ship, each with several examples (56 in all):
charts, chat, color-picker, data-table, date-picker, multi-select, navbar, sidebar, stepper, timeline. Every example installs with one command, together with the component it is built on:

```bash
npx shadcn@latest add https://dresscodeui.com/r/dresscode/data-table-filters.json
```

Every example live, in every theme: [dresscodeui.com/components](https://dresscodeui.com/components).

## Blocks

75 blocks in 19 categories, each one file: bento-grid, blog, contact, cta, faq, features, footer, hero, integrations, login, logo-cloud, pricing, settings, signup, stat-cards, states, stats, steps, testimonials. A block is a section of a
landing page or an app (a hero, a pricing table, a sign-in page) built from shadcn/ui's components, and it wears
the installed theme:

```bash
npx shadcn@latest add https://dresscodeui.com/r/dresscode/bento-grid-product.json
```

Every block live, in every theme, at desktop and phone width: [dresscodeui.com/blocks](https://dresscodeui.com/blocks).

## Short names

```bash
npx shadcn@latest registry add "@dresscode=https://dresscodeui.com/r/dresscode/{name}.json"
npx shadcn@latest add @dresscode/sorbet @dresscode/orbit-landing
```

## What's here

- `registry/dresscode/themes.ts`: the 9 themes (every color role in both modes, fonts, corners) and how they map
  onto shadcn's variables; `dresscode.css` holds the few classes the templates and blocks use; `fonts.ts` loads the families.
- `registry/dresscode/blocks/orbit` and `blocks/orbit-app`: the Orbit landing page and dashboard;
  `blocks/portfolio`, `blocks/realestate` and `blocks/ecommerce`: the Portfolio site, the Real estate site and
  the E-commerce store (each one's content is all in its `data.ts`).
- `registry/dresscode/components/<name>`: each component (`ui/`, installs to `components/ui`) and its examples
  (`examples/`, install to `components/dresscode/<name>-<example>.tsx`).
- `registry/dresscode/sections/<category>`: the blocks, one file each (install to
  `components/dresscode/<category>-<block>.tsx`), and the category's `meta.ts`.
- `tools/build-dresscode-registry.mjs`: builds `public/r/dresscode` from those sources and refuses a theme that fails
  `tools/dresscode-contrast.mjs`.
- `registry.json` and `public/r/dresscode`: the shadcn registry, exactly what https://dresscodeui.com/r/dresscode serves.
- `examples/orbit`, `examples/orbit-app`, `examples/portfolio`, `examples/realestate` and `examples/store`: the
  pages the templates install into `app/`.

## History

DressCode UI started as Folio, an editorial component library with its own restyled components. It was retired
on November 24, 2026 in favour of the themes; its code is under the tag `folio-archive`.

## License

MIT. Built for [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
The fonts are under the SIL Open Font License.
