import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "footer",
  title: "Footers",
  short: "Footer",
  description:
    "The bottom of every page: link columns with the logo, a newsletter sign-up, one compact row or a large wordmark across the bottom edge. Real footer, nav and list markup throughout.",
  keywords: ["shadcn footer", "footer component", "tailwind footer", "website footer"],
  group: "marketing",
  order: 14,
  blocks: [
    { id: "columns", title: "Link columns", description: "The logo and a line beside four columns of links, with the copyright and the social links in a bar underneath.", height: 385 },
    { id: "newsletter", title: "With a newsletter", description: "An email sign-up across the top that checks the address and says thank you, then five link columns and the bottom bar.", height: 580 },
    { id: "simple", title: "One compact row", description: "The logo, a few links, social icons and the copyright in a single row that wraps neatly on phones.", height: 100 },
    { id: "wordmark", title: "Large wordmark", description: "Links and a call to action above, and the Orbit wordmark set very large across the bottom edge.", height: 600 },
  ],
}

export default meta
