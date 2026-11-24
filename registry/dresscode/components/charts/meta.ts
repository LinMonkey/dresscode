import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "charts",
  title: "Charts",
  description:
    "Dashboard chart cards built on the shadcn/ui chart and Recharts: area, stacked bar, line, donut, radial and sparkline charts, each with a title, the key number, a tooltip and a footer note. Colors come only from the theme's chart variables, so every theme recolors them.",
  keywords: ["shadcn charts", "shadcn chart examples", "recharts dashboard", "react chart components"],
  variants: [
    { id: "area-interactive", title: "Area chart with time range", description: "Two gradient areas, invoiced and collected, with a 7 day, 30 day or 3 month range select.", height: 540 },
    { id: "bar-stacked", title: "Stacked bars", description: "Billing by month stacked by kind of work, with a legend that filters and a tooltip with totals.", height: 540 },
    { id: "line-comparison", title: "Year over year", description: "This year against last year and a dashed target, with dots on hover and a year-to-date view.", height: 570 },
    { id: "donut", title: "Donut with legend", description: "Payment methods around the month's total, with each method's amount and share beside it.", height: 470 },
    { id: "radial", title: "Radial goals", description: "Three quarter goals as progress rings, each named with its figure, target and pace.", height: 460 },
    { id: "kpi-sparklines", title: "KPI cards with sparklines", description: "Four figures with a change badge that knows good from bad, and a 12-week sparkline each.", height: 300 },
    { id: "bar-horizontal", title: "Horizontal bars", description: "Top clients by revenue with the amount at the end of each bar.", height: 540 },
  ],
}

export default meta
