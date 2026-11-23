// Folio restyle of shadcn/ui's alert: a ruled band with a 3px left rule in the tone's color, a semibold title
// and an ink-2 description. Square corners, no shadow. Same API as the stock component.
//   default   newsprint band, ink rule (tips, offers)
//   info      info tint (planned things: "Your plan renews Feb 14")
//   warning   warning tint (needs a look soon: card expiring, usage at 90%)
//   destructive  press tint (something failed: a payment was declined)
// Put an AlertAction inside for one small button on the right.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "group/alert relative grid w-full gap-[2px] border border-l-[3px] px-[14px] py-[12px] text-left text-[15px] has-data-[slot=alert-action]:pr-[150px] max-sm:has-data-[slot=alert-action]:pr-[14px] has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-[10px] *:[svg]:row-span-2 *:[svg]:translate-y-[2px] *:[svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: "border-hairline border-l-ink bg-secondary text-foreground *:[svg]:text-foreground",
        info: "border-info-tint border-l-info bg-info-tint/60 text-foreground *:[svg]:text-info",
        warning: "border-warning-tint border-l-warning bg-warning-tint/60 text-foreground *:[svg]:text-warning",
        destructive: "border-press-tint border-l-press bg-press-tint/60 text-foreground *:[svg]:text-press",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role={variant === "destructive" || variant === "warning" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-[14px] leading-[1.45] text-ink-2 group-has-[>svg]/alert:col-start-2 [&_a]:text-press [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-3", className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("mt-[10px] sm:absolute sm:top-1/2 sm:right-[14px] sm:mt-0 sm:-translate-y-1/2 group-has-[>svg]/alert:col-start-2", className)} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
