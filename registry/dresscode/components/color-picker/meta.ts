import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "color-picker",
  title: "Color picker",
  description:
    "A color picker with a saturation and brightness area, hue and alpha sliders, hex, RGB and HSL inputs, an eyedropper, preset swatches and recent colors. Keyboard and touch friendly, controlled or uncontrolled, no extra packages.",
  keywords: ["shadcn color picker", "react color picker", "tailwind color picker", "shadcn color input"],
  variants: [
    { id: "popover", title: "In a popover", description: "A swatch button in a settings form that opens the full picker for a brand color.", height: 700, layout: "top" },
    { id: "inline", title: "Inline panel", description: "The picker always open beside a live preview that uses the color.", height: 640 },
    { id: "swatches", title: "Swatch grid", description: "A compact grid of presets, with a Custom… button that opens the full picker.", height: 720 },
    { id: "alpha", title: "With alpha", description: "A translucent overlay color with an opacity slider, written out as rgba and 8-digit hex.", height: 640 },
    { id: "theme-editor", title: "Theme editor", description: "Three pickers restyle a button, a badge and a card, with a contrast check for each text pair.", height: 680, layout: "top" },
  ],
}

export default meta
