import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "blog",
  title: "Blog sections",
  short: "Blog",
  description:
    "Recent posts on a landing page or a blog index: a row of cards, one featured post beside three more, or a compact list with a topic filter. The covers are typographic, in the theme's colors, so no photos are needed.",
  keywords: ["shadcn blog section", "blog section", "blog card component", "tailwind blog list"],
  group: "marketing",
  order: 11,
  blocks: [
    { id: "cards", title: "Post cards", description: "Three recent posts as cards, each with its own typographic cover, under a heading with a link to every article.", height: 730 },
    { id: "featured", title: "Featured post", description: "One large featured post with a big-number cover beside a list of three more.", height: 890 },
    { id: "list", title: "List with topic filter", description: "A compact list of posts with date, topic and reading time, filtered by topic.", height: 1260 },
  ],
}

export default meta
