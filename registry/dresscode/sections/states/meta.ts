import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "states",
  title: "Empty and error states",
  short: "Empty and error states",
  description:
    "What a screen says when there is nothing to show or something broke, and the way out it offers. A first-run empty list, a search with no matches, a 404 page and a 500 page.",
  keywords: ["shadcn empty state", "empty state component", "404 page tailwind", "500 error page"],
  group: "application",
  order: 5,
  blocks: [
    { id: "empty", title: "First-run empty list", description: "The invoice list before the first invoice: an icon, a line, the main action and two other ways to start, importing or a template.", height: 800 },
    { id: "no-results", title: "No search results", description: "What was searched, the filters as chips you can remove, a clear-filters button and suggestions that say which filter hides the matches.", height: 720 },
    { id: "not-found", title: "404 page", description: "A big 404 in the theme's display face, a search that finds the page as you type, the way back home and a few useful places.", height: 790 },
    { id: "error", title: "500 page", description: "A plain apology, a retry that shows a spinner, a status page link and an error reference with a copy button.", height: 660 },
  ],
}

export default meta
