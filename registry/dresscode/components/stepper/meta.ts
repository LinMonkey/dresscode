import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "stepper",
  title: "Stepper",
  description:
    "Numbered steps across the top or down the side, with done, current, loading and error states. Controlled or uncontrolled, linear or in any order, with arrow-key navigation. For checkouts, form wizards and onboarding.",
  keywords: ["shadcn stepper", "react stepper component", "tailwind stepper", "shadcn multi step form"],
  variants: [
    { id: "horizontal", title: "Checkout", description: "Steps across the top with titles and descriptions; collapses to “Step 2 of 4” on phones.", height: 520 },
    { id: "vertical", title: "Onboarding checklist", description: "Steps down the side with the current step's form or action right under it.", height: 700 },
    { id: "form-wizard", title: "Form wizard", description: "Create an invoice in four steps, with checks per step and a review that links back to each one.", height: 650, layout: "top" },
    { id: "progress", title: "Progress bar", description: "A compact segmented bar with step labels under it, leading a short setup survey.", height: 480 },
    { id: "non-linear", title: "Any order", description: "Sections you can fill in any order, each marked done or with what to fix; publish unlocks when all are done.", height: 480 },
  ],
}

export default meta
