import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "stats",
  title: "Stats sections",
  short: "Stats",
  description:
    "The numbers that prove the product works: a quiet row under the hero, cards with a trend for each figure, or big numbers on the theme's colored band.",
  keywords: ["shadcn stats section", "stats section", "tailwind stats component", "kpi cards"],
  group: "marketing",
  order: 6,
  blocks: [
    { id: "row", title: "Row of figures", description: "Four results in a hairline grid, each a big figure in the accent color with one line on what it means.", height: 350 },
    { id: "cards", title: "Cards with trends", description: "A heading and four stat cards, each with a short caption, the change on last year and a small bar strip of the months behind it.", height: 700 },
    { id: "band", title: "On the colored band", description: "Big numbers on the theme's band color beside a heading, a line of copy and a link to the full report.", height: 520 },
  ],
}

export default meta
