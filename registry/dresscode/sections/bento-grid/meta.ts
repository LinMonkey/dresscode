import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "bento-grid",
  title: "Bento grids",
  short: "Bento grid",
  description:
    "Features in cells of mixed sizes, each with a small working picture of the product, numbers or charts. Tidy rows on desktop that fold to one column on phones, in every theme, light and dark.",
  keywords: ["shadcn bento grid", "bento grid", "tailwind bento grid", "bento grid template"],
  group: "marketing",
  order: 4,
  blocks: [
    { id: "product", title: "Product features", description: "Six cells of mixed spans, one wide, one tall and one wide again, each a feature with a small picture of it working.", height: 1520 },
    { id: "metrics", title: "Metrics and charts", description: "Five cells built around one big number each, backed by a tiny chart: monthly bars, a progress ring, a sparkline, a split bar and weekday bars.", height: 1110 },
    { id: "showcase", title: "Showcase cell", description: "One large cell with a rich picture of the product that runs off its edges, beside four smaller cells with a small picture each.", height: 1030 },
    { id: "three-up", title: "Three-up", description: "One wide and two narrow cells in a row, each an inset panel with a picture of the product above a short title and a line.", height: 900 },
  ],
}

export default meta
