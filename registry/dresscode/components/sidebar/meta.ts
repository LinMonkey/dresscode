import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "sidebar",
  title: "Sidebar",
  description:
    "Full app layouts built on the shadcn/ui sidebar: a rail that folds to icons, floating and inset panels, a nested docs tree, a workspace switcher, and a second sidebar on the right for details. Each one becomes a sheet on phones.",
  keywords: ["shadcn sidebar", "shadcn sidebar examples", "shadcn sidebar layout", "react sidebar component", "tailwind sidebar"],
  variants: [
    {
      id: "icon-collapse",
      title: "Folds to icons",
      description: "Grouped links with counts and a user menu. Folded, it is a rail of icons with tooltips.",
      height: 688,
      layout: "top",
    },
    {
      id: "floating",
      title: "Floating",
      description: "Floats off the edge, with a search that filters the links, project menus and a plan card.",
      height: 688,
      layout: "top",
    },
    {
      id: "inset",
      title: "Inset",
      description: "The page sits in a rounded panel on the sidebar's color, here a dashboard with a chart.",
      height: 688,
      layout: "top",
    },
    {
      id: "nested",
      title: "Nested docs tree",
      description: "Sections, pages and sub-pages that fold, four levels deep, with badges and a version menu.",
      height: 688,
      layout: "top",
    },
    {
      id: "team-switcher",
      title: "Workspace switcher",
      description: "Switch workspaces from the header, create from a quick menu, and open the user menu at the foot.",
      height: 688,
      layout: "top",
    },
    {
      id: "right-panel",
      title: "Right details panel",
      description: "A support inbox: nav on the left, the picked conversation's details in a sidebar on the right.",
      height: 688,
      layout: "top",
    },
  ],
}

export default meta
