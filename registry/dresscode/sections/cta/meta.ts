import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "cta",
  title: "Call-to-action sections",
  short: "Call to action",
  description:
    "The section that asks for the sign-up before the footer: on the theme's colored band, in a centered card, with an email form or beside a look at the product.",
  keywords: ["shadcn cta section", "call to action section", "tailwind cta", "cta block"],
  group: "marketing",
  order: 12,
  blocks: [
    { id: "band", title: "On the colored band", description: "The closing promise and two actions on the theme's band color, the way the Orbit template ends its page.", height: 440 },
    { id: "card", title: "Centered card", description: "A raised card on the page with a heading, a line, two actions and three small reassurances under them.", height: 640 },
    { id: "signup", title: "Split with email sign-up", description: "The promise on the left and an email form on the right that checks the address and says thank you when it is sent.", height: 360 },
    { id: "product", title: "With a product picture", description: "Copy and actions beside a small picture of the product, drawn in markup, inside one large rounded panel.", height: 750 },
  ],
}

export default meta
