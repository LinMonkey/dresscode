import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "contact",
  title: "Contact sections",
  short: "Contact",
  description:
    "Ways for people to reach the team: a contact form that checks itself, the support channels side by side, or a form to book a demo with sales.",
  keywords: ["shadcn contact form", "contact section", "contact us page", "book a demo form"],
  group: "marketing",
  order: 13,
  blocks: [
    { id: "form", title: "Contact form", description: "Name, email, topic and message, checked as you leave each field and on send, with the other ways to reach the team beside it.", height: 700 },
    { id: "options", title: "Support channels", description: "Chat, email, the help center and sales in four cards, each with what it is for, how fast it answers and an action.", height: 820 },
    { id: "sales", title: "Book a demo", description: "A short pitch with three benefits next to a form for work email, company, team size and a preferred time.", height: 880 },
  ],
}

export default meta
