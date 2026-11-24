import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "navbar",
  title: "Navbar",
  description:
    "Top navigation for sites and apps, built from stock shadcn/ui parts: simple, mega menu, centered logo, search with a command dialog, an app header with notifications and a user menu, and an announcement bar. Every one has a phone menu in a sheet and a visible keyboard focus.",
  keywords: ["shadcn navbar", "shadcn navigation bar", "react navbar component", "tailwind navbar", "shadcn mega menu", "shadcn header"],
  variants: [
    { id: "simple", title: "Simple", description: "Logo, four links, sign in and the main call to action, with the links in a sheet on phones.", height: 380, layout: "top" },
    {
      id: "mega-menu",
      title: "Mega menu",
      description: "A Product menu that opens a wide panel of features in columns beside a highlighted card, plus a shorter Resources menu.",
      height: 500,
      layout: "top",
    },
    { id: "centered", title: "Centered logo", description: "Links split left and right around a centered logo; the phone menu opens from the left.", height: 400, layout: "top" },
    {
      id: "search",
      title: "With search",
      description: "A search button with a Ctrl K hint that opens a command dialog with grouped results and recent searches.",
      height: 540,
      layout: "top",
    },
    {
      id: "app-header",
      title: "App header",
      description: "A product top bar: breadcrumb, search with suggestions, a notifications popover with unread counts, a user menu and section tabs.",
      height: 540,
      layout: "top",
    },
    {
      id: "announcement",
      title: "Announcement bar",
      description: "A dismissible announcement above a sticky navbar that turns solid with a border once the page scrolls.",
      height: 480,
      layout: "top",
    },
  ],
}

export default meta
