import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "settings",
  title: "Settings pages",
  short: "Settings",
  description:
    "The pages behind the gear icon: a profile form with a save bar, notification switches, plan and billing, and the team with roles and invites. Real labels, fieldsets and checks throughout.",
  keywords: ["shadcn settings page", "settings form", "account settings page", "team members settings"],
  group: "application",
  order: 4,
  blocks: [
    { id: "profile", title: "Profile form", description: "Photo from initials, name, email, business name, time zone and a short bio, checked as you go, with a save bar that appears only when something changed.", height: 845 },
    { id: "notifications", title: "Notifications", description: "Email and push switches for each event, in groups for invoices, payments, clients and product news, with a pause-all control and a reset to the defaults.", height: 1390 },
    { id: "billing", title: "Plan and billing", description: "The current plan with its renewal date and a plan change dialog, usage meters, the card on file and a history of bills to download.", height: 1255 },
    { id: "team", title: "Team and invites", description: "Members with their roles, an invite form, pending invites to resend or revoke, removal behind a confirm dialog and the seat count.", height: 830 },
  ],
}

export default meta
