import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "multi-select",
  title: "Multi select",
  description:
    "A field for picking several values from a searchable list: the picks show as removable chips, with groups, disabled options, a limit, an empty state and new values created on the spot. Full keyboard support, controlled or uncontrolled.",
  keywords: ["shadcn multi select", "react multi select component", "shadcn multiselect", "tailwind multi select", "shadcn tags input"],
  variants: [
    { id: "tags", title: "Labels", description: "Tag a project with colored labels, with a usage count per label and one-click suggestions.", height: 480, layout: "top" },
    { id: "grouped", title: "Grouped with search", description: "Countries grouped by region; search matches names, codes and other names, and long picks fold into “+N more”.", height: 550, layout: "top" },
    { id: "creatable", title: "Creatable", description: "Find a tag or create one when nothing matches; new tags join the list.", height: 500, layout: "top" },
    { id: "max-count", title: "Limit", description: "At most three picks: a meter and hint count them and the rest of the list is disabled once full.", height: 550, layout: "top" },
    { id: "assignees", title: "Assignees", description: "Pick teammates with avatars and roles, shown as avatar chips; the team loads when the list opens.", height: 530, layout: "top" },
    { id: "form-field", title: "In a form", description: "Label, hint, required validation on submit and the picks sent as plain form values.", height: 550, layout: "top" },
  ],
}

export default meta
