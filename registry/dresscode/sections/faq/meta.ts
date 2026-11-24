import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "faq",
  title: "FAQ sections",
  short: "FAQ",
  description:
    "The questions people ask before they sign up, answered: an accordion, every answer open in two columns, a contact card beside the questions, or questions grouped by topic.",
  keywords: ["shadcn faq", "faq section", "faq accordion component", "tailwind faq section"],
  group: "marketing",
  order: 10,
  blocks: [
    { id: "accordion", title: "Accordion", description: "A centered heading over the questions as a column of cards that open one at a time.", height: 1055 },
    { id: "two-column", title: "Two columns, all open", description: "Every question and answer visible at once in a two-column grid, for short answers people should not have to click for.", height: 960 },
    { id: "with-contact", title: "With a contact card", description: "The heading and a card for people who still have a question on the left, the accordion on the right.", height: 700 },
    { id: "categories", title: "Grouped by topic", description: "Questions sorted into billing, payments, account and security, with a topic list beside an accordion for the chosen topic.", height: 820 },
  ],
}

export default meta
