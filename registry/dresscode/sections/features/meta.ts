import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "features",
  title: "Feature sections",
  short: "Features",
  description:
    "Say what the product does: a grid of six features, alternating rows with pictures of the product, tabs that swap the picture per job, a checklist, three cards or a side-by-side comparison. Every picture is drawn in markup, so it wears the theme.",
  keywords: ["shadcn features section", "feature section", "tailwind feature section", "feature comparison"],
  group: "marketing",
  order: 3,
  blocks: [
    { id: "grid", title: "Six-feature grid", description: "A centered heading over six features in three columns, each an icon in a soft accent square, a title and a line or two.", height: 770 },
    { id: "rows", title: "Alternating rows", description: "Three features down the page, each a heading, a line and three points beside a small picture of the product, switching sides row by row.", height: 1520 },
    { id: "tabs", title: "Tabs per job", description: "A tab for each job the product does, keyboard-friendly, each swapping in a picture of the product doing it.", height: 820 },
    { id: "checklist", title: "Checklist with product", description: "A heading and six checked points with a short line each, beside the client portal they add up to.", height: 690 },
    { id: "cards", title: "Three cards", description: "Three cards of equal height in a row, each a small picture of the feature over a title, a line and a link.", height: 750 },
    { id: "comparison", title: "Comparison", description: "The product against spreadsheets and email: the same six jobs in two columns, crosses against checks, the product's column raised.", height: 1080 },
  ],
}

export default meta
