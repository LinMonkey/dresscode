// Folio restyle of shadcn/ui's badge: a small rectangular tag in sentence case.
// Status variants (review fix #7) use Folio's status tokens, never ad-hoc greens or ambers:
//   success  done / healthy        (Sent, Paid, Active)
//   warning  needs a look soon     (Past due, Expiring)
//   info     neutral and planned   (Scheduled, Trial)
//   attention  press red, for the one thing on screen that needs action
//   neutral  inactive              (Draft, Paused)
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-[20px] w-fit shrink-0 items-center justify-center gap-[4px] overflow-hidden rounded-[2px] border border-transparent px-[8px] text-[12px] leading-none font-semibold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-[12px]!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-input text-foreground",
        success: "bg-success-tint text-success",
        warning: "bg-warning-tint text-warning",
        info: "bg-info-tint text-info",
        attention: "bg-press-tint text-press",
        neutral: "bg-neutral-tint text-ink-2",
        destructive: "bg-destructive text-paper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", render, ...props }: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: cn(badgeVariants({ variant }), className) }, props),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
