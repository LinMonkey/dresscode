import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "hero",
  title: "Hero sections",
  short: "Hero",
  description:
    "The first screen of a landing page: one promise, the actions that follow it and a look at the product. Centered or split, with an email sign-up, an aurora background, the theme's colored band or a code sample.",
  keywords: ["shadcn hero section", "hero section", "tailwind hero section", "aurora background"],
  group: "marketing",
  order: 1,
  blocks: [
    { id: "centered", title: "Centered with product shot", description: "A headline, two actions and three reassurances over a picture of the product, drawn in markup so it wears the theme.", height: 1180 },
    { id: "split", title: "Split with product cards", description: "Copy and actions on the left, the invoice, the payment and the reminder it sends stacked on the right.", height: 720 },
    { id: "signup", title: "Email sign-up", description: "A centered promise with the sign-up form in the hero itself, checked as you type, and a thank-you when it is sent.", height: 640 },
    { id: "aurora", title: "Aurora background", description: "Slow, soft color drifting behind a large headline, made from the theme's own colors. It stands still for people who turn motion off.", height: 720 },
    { id: "band", title: "On the colored band", description: "The copy on the theme's band color, with the product overlapping the band's lower edge.", height: 1120 },
    { id: "developer", title: "With a code sample", description: "For an API or developer tool: the pitch on the left and a request in three languages, with a copy button, on the right.", height: 700 },
  ],
}

export default meta
