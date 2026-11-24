import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "login",
  title: "Login pages",
  short: "Login",
  description:
    "Sign-in screens that check each field as you leave it and show what happens next. A centered card, a split page on the theme's band, providers first, a magic link and a six-digit code.",
  keywords: ["shadcn login page", "login form component", "sign in page tailwind", "shadcn otp login"],
  group: "application",
  order: 1,
  blocks: [
    { id: "card", title: "Centered card", description: "Email and password with a show toggle, remember me, a forgot-password link, Google and GitHub, and a spinner, then a signed-in state.", height: 760 },
    { id: "split", title: "Split with the band", description: "The form open on the page and, beside it on the theme's band, what Orbit does, two figures and a customer's words. The band steps aside on phones.", height: 760 },
    { id: "social", title: "Providers first", description: "Google, GitHub, Apple and single sign-on on one side, then email on the other; single sign-on turns the email side into a company lookup.", height: 720 },
    { id: "magic-link", title: "Magic link", description: "Email only. After sending, it says where the link went, with a resend button that counts down and a way to change the address.", height: 680 },
    { id: "two-factor", title: "Two-step code", description: "A six-digit code that checks itself when the last digit is in, an error for a wrong one, resend and a backup code. In the demo, 123456 is right.", height: 700 },
  ],
}

export default meta
