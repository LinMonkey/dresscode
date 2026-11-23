"use client"

// Folio restyle of shadcn/ui's radio group: an 18px ring; the chosen option gets a press-red ring and dot.
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid w-full gap-[10px]", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-[18px] shrink-0 rounded-full border border-ink-2 bg-background outline-none after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-1 disabled:cursor-not-allowed data-disabled:border-hairline data-disabled:bg-secondary aria-invalid:border-destructive data-checked:border-[1.5px] data-checked:border-press",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-group-indicator" className="flex size-full items-center justify-center">
        <span className="size-[8px] rounded-full bg-press" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
