import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "timeline",
  title: "Timeline",
  description:
    "A list of events joined by a line, vertical or horizontal, with a status for each step: done, in progress or still to come. For activity feeds, changelogs, order tracking and roadmaps.",
  keywords: ["shadcn timeline", "react timeline component", "tailwind timeline"],
  variants: [
    { id: "activity", title: "Activity feed", description: "Who did what and when, with an icon or avatar per event.", height: 600 },
    { id: "changelog", title: "Changelog", description: "Releases with their date and version on the left and what changed on the right.", height: 560 },
    { id: "order-tracking", title: "Order tracking", description: "Done, in progress and upcoming steps in a card, with overall progress.", height: 600 },
    { id: "milestones", title: "Roadmap", description: "A horizontal timeline of milestones that scrolls sideways on phones.", height: 300 },
  ],
}

export default meta
