import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "data-table",
  title: "Data table",
  description:
    "A shadcn/ui data table on TanStack Table: sortable columns, search and faceted filters, pagination, row selection with bulk actions, column visibility, expandable rows, inline editing, a sticky header and pinned columns.",
  keywords: ["shadcn data table", "shadcn table", "tanstack table shadcn", "react data table component"],
  variants: [
    {
      id: "sorting-pagination",
      title: "Sorting and pagination",
      description: "Sort menus on every header, money right-aligned with totals, page size and page controls, and loading rows.",
      height: 840,
      layout: "top",
    },
    {
      id: "filters",
      title: "Search and filters",
      description: "Search across columns, faceted status and client filters with counts, a reset button and a column visibility menu.",
      height: 700,
      layout: "top",
    },
    {
      id: "row-selection",
      title: "Row selection and bulk actions",
      description: "Checkboxes with select all and shift-click ranges, a bulk bar to remind, export or delete, and a menu on each row.",
      height: 840,
      layout: "top",
    },
    {
      id: "expandable-rows",
      title: "Expandable rows",
      description: "Rows that open in place to show an invoice's line items, totals and payment details.",
      height: 890,
      layout: "top",
    },
    {
      id: "editable-cells",
      title: "Editable cells",
      description: "Edit an email, terms or rate in place, with save and cancel, validation messages and undo.",
      height: 820,
      layout: "top",
    },
    {
      id: "sticky-columns",
      title: "Sticky header and pinned columns",
      description: "Twenty-one columns that scroll both ways inside the table, with the header, first column and actions held in place.",
      height: 600,
      layout: "top",
    },
  ],
}

export default meta
