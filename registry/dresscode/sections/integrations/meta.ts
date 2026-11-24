import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "integrations",
  title: "Integration sections",
  short: "Integrations",
  description:
    "Show what the product connects to: a grid of integration tiles beside the pitch, the product at the center of a hub, or a full list grouped by kind with a live search.",
  keywords: ["shadcn integrations section", "integrations section", "integration grid", "integrations page search"],
  group: "marketing",
  order: 8,
  blocks: [
    { id: "grid", title: "Grid beside the pitch", description: "The pitch on the left and eight integration tiles on the right, each a kind of tool with an icon and one line on what it does.", height: 510 },
    { id: "hub", title: "Hub", description: "The Orbit mark in the middle with eight integration tiles around it, joined by lines; on phones it becomes a plain grid.", height: 960 },
    { id: "list", title: "Grouped list with search", description: "Every integration grouped by kind, with a search field that filters them as you type and an empty state when nothing matches.", height: 1400 },
  ],
}

export default meta
