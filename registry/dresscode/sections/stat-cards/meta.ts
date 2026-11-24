import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "stat-cards",
  title: "Stat cards",
  short: "Stat cards",
  description:
    "The row of figures at the top of a dashboard: the number, how it moved since last month and what it means. With trend badges, small charts, progress toward a goal or a period switch.",
  keywords: ["shadcn stat cards", "kpi cards", "dashboard stats component", "tailwind stats section"],
  group: "application",
  order: 3,
  blocks: [
    { id: "trend", title: "With trend badges", description: "Four figures for the month in one card split four ways, each with its change on last month as an up or down badge and a line of context.", height: 330 },
    { id: "sparkline", title: "With small charts", description: "Four wide cards, each pairing a figure with its own small chart: a running total, weekly bars, a line against your terms and a stepped balance.", height: 575 },
    { id: "progress", title: "Goals with progress", description: "This month's targets: a ring for the revenue goal with what is left and the pace, and bars for the other goals.", height: 660 },
    { id: "comparison", title: "With a period switch", description: "Switch between this month, last month and this quarter; every figure, change and comparison bar follows.", height: 370 },
  ],
}

export default meta
