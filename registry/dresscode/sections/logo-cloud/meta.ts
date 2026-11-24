import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "logo-cloud",
  title: "Logo clouds",
  short: "Logo cloud",
  description:
    "Show who already uses the product: a quiet row of wordmarks, a bordered grid beside a heading, or a strip that scrolls sideways forever. The wordmarks take the theme's muted ink, light and dark.",
  keywords: ["shadcn logo cloud", "logo cloud", "tailwind logo cloud", "logo marquee"],
  group: "marketing",
  order: 2,
  blocks: [
    { id: "row", title: "Row of wordmarks", description: "One line of copy over a single row of customer wordmarks, each in its own type treatment, that wraps to two or three across on smaller screens.", height: 215 },
    { id: "grid", title: "Bordered grid", description: "A short heading, a line of copy and a link beside a grid of equal cells, one wordmark in each, three across on desktop and two on phones.", height: 485 },
    { id: "marquee", title: "Scrolling marquee", description: "Wordmarks that scroll sideways forever with faded edges. They pause under the pointer and stand still in a tidy grid on keyboard focus or for people who turn motion off.", height: 180 },
  ],
}

export default meta
