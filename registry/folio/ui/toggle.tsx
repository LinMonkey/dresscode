"use client"

// Folio restyle of shadcn/ui's toggle. Same API as the stock component.
//   default: a quiet toolbar button (Bold, Italic); pressed = a grey fill and ink text.
//   outline: a ruled button; pressed = filled ink, like the segmented tabs (a large selected area is ink).
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-[6px] rounded-[2px] text-[14px] font-semibold whitespace-nowrap text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[17px]",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-secondary aria-pressed:bg-hairline",
        outline: "border border-input bg-background hover:border-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
      },
      size: {
        default: "h-[32px] min-w-[32px] px-[10px]",
        sm: "h-[28px] min-w-[28px] px-[8px] text-[13px] [&_svg:not([class*='size-'])]:size-[15px]",
        lg: "h-[36px] min-w-[36px] px-[12px] text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({ className, variant = "default", size = "default", ...props }: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />
}

export { Toggle, toggleVariants }
