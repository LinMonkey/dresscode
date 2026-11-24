import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "steps",
  title: "How-it-works sections",
  short: "Steps",
  description:
    "Show how someone gets from sign-up to the first result in three or four steps. Numbered cards, a timeline with a picture of the product at each step, or a row of cards joined by connectors.",
  keywords: ["shadcn how it works section", "how it works section", "steps section", "process timeline component"],
  group: "marketing",
  order: 5,
  blocks: [
    { id: "numbered", title: "Numbered cards", description: "Three steps in three cards, each with a big number, a short title and one line of help.", height: 720 },
    { id: "timeline", title: "Timeline with pictures", description: "A vertical line with numbered dots; each step has a title, a line of text and a small picture of the product at that step.", height: 1400 },
    { id: "cards", title: "Cards with connectors", description: "Four step cards in a row joined by arrows on desktop and stacked on phones, each with an icon and how long the step takes.", height: 700 },
  ],
}

export default meta
