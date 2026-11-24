import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "pricing",
  title: "Pricing sections",
  short: "Pricing",
  description:
    "What it costs and what you get: three plans with a monthly or yearly switch, a full comparison table, one plan on its own, a usage calculator and a calm Free against Pro.",
  keywords: ["shadcn pricing", "pricing table component", "pricing section", "tailwind pricing page"],
  group: "marketing",
  order: 9,
  blocks: [
    { id: "tiers", title: "Three plans", description: "Three plans with the middle one recommended and a monthly or yearly switch that changes the prices and says what yearly saves.", height: 1030 },
    { id: "compare", title: "Comparison table", description: "Every feature of every plan in one table. On phones it scrolls sideways inside its own box while the feature names stay put.", height: 1620 },
    { id: "single", title: "Single plan", description: "One plan and one price, everything it includes as a two-column checklist, a single action and a line of reassurance.", height: 890 },
    { id: "calculator", title: "Usage calculator", description: "Usage pricing with a slider for invoices a month: the price, the plan it falls in and the cost per invoice follow as you drag.", height: 865 },
    { id: "two-plans", title: "Free and Pro", description: "Two plans side by side, Free and Pro, with what changes when you upgrade said in plain words.", height: 960 },
  ],
}

export default meta
