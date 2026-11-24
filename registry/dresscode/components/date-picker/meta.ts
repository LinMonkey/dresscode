import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "date-picker",
  title: "Date picker",
  description:
    "A date field that opens a calendar in a popover: a single date, or a range with presets and two months side by side. With min and max dates, disabled days, a clear button and hidden inputs for forms.",
  keywords: ["shadcn date picker", "shadcn date range picker", "react date picker", "tailwind date picker"],
  variants: [
    { id: "single", title: "Due date", description: "A single date field with a label, a hint, payment-term shortcuts and past days disabled.", height: 640 },
    { id: "range-presets", title: "Date range with presets", description: "A report period with presets beside a two-month calendar and an Apply step.", height: 640 },
    { id: "date-time", title: "Date and time", description: "A day plus a time in 15-minute steps for scheduling a reminder, with the result in words.", height: 680 },
    { id: "month-year", title: "Month and year dropdowns", description: "Month and year menus in the caption to jump to a birth date or a date years away.", height: 680 },
    { id: "form-field", title: "In a form", description: "Validation for required dates, dates in the past and an end before the start, with submit disabled until valid.", height: 700 },
    { id: "inline-booking", title: "Inline booking calendar", description: "A calendar without a popover beside the free time slots for the picked day.", height: 460 },
  ],
}

export default meta
