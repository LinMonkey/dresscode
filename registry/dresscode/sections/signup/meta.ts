import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "signup",
  title: "Sign-up pages",
  short: "Sign-up",
  description:
    "Account creation that checks each field as you leave it and says what happens next. A card with a password strength meter, a split page with the free plan beside the form, and a team invite.",
  keywords: ["shadcn signup page", "sign up form component", "password strength meter", "accept team invite page"],
  group: "application",
  order: 2,
  blocks: [
    { id: "card", title: "Card with password rules", description: "Name, work email and a password with a strength meter and the rules it still misses, the terms, and a spinner, then a confirm-your-email state.", height: 860 },
    { id: "split", title: "Split with the free plan", description: "The form beside a panel listing what the free plan includes and a customer's words. On phones the form comes first.", height: 820 },
    { id: "invite", title: "Team invite", description: "Who invited you to which workspace, your role and who is already there, then your name and a password and one button to join.", height: 900 },
  ],
}

export default meta
