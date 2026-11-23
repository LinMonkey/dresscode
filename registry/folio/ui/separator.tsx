"use client"

// Folio restyle of shadcn/ui's separator: a 1px hairline by default. Pass className="bg-divider" for a firmer
// rule between groups, or "h-[2px] bg-rule" for a strong rule. For the broadsheet double rule use DoubleRule.
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

function Separator({ className, orientation = "horizontal", ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn("shrink-0 bg-hairline data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", className)}
      {...props}
    />
  )
}

export { Separator }
