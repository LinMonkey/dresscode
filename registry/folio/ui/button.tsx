// Folio restyle of shadcn/ui's button. Same API as the stock component.
// Rule (review fix #1): the primary action is always ink. Press red is for attention, not for "go":
// use variant="destructive" for dangerous actions and keep red off ordinary buttons.
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-(--radius) border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-ink-2",
        outline: "border-input bg-background text-foreground hover:border-foreground aria-expanded:border-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-hairline aria-expanded:bg-hairline",
        ghost: "hover:bg-secondary aria-expanded:bg-secondary",
        destructive: "bg-destructive text-paper hover:bg-press-deep focus-visible:ring-destructive",
        link: "font-normal text-press underline decoration-1 underline-offset-[3px] hover:text-ink",
      },
      size: {
        default: "h-[36px] gap-[8px] px-[18px] text-[15px]",
        xs: "h-[24px] gap-[4px] px-[8px] text-[12px] [&_svg:not([class*='size-'])]:size-[12px]",
        sm: "h-[30px] gap-[6px] px-[14px] text-[14px] [&_svg:not([class*='size-'])]:size-[14px]",
        lg: "h-[44px] gap-[10px] px-[24px] text-[16px]",
        icon: "size-[36px]",
        "icon-xs": "size-[24px] [&_svg:not([class*='size-'])]:size-[12px]",
        "icon-sm": "size-[30px]",
        "icon-lg": "size-[44px] [&_svg:not([class*='size-'])]:size-[20px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
