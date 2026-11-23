"use client"

// Folio restyle of shadcn/ui's checkbox: an 18px square with the theme's corners (capped at 4px); checked is a press-red box with a white tick
// (small selection markers are press red). Indeterminate (some rows of a table checked) is the same box with a dash.
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative flex size-[18px] shrink-0 items-center justify-center rounded-[min(var(--radius),4px)] border border-ink-2 bg-background transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-1 disabled:cursor-not-allowed data-disabled:border-hairline data-disabled:bg-secondary aria-invalid:border-destructive data-checked:border-press data-checked:bg-press data-checked:text-paper data-indeterminate:border-press data-indeterminate:bg-press data-indeterminate:text-paper data-disabled:data-checked:border-divider data-disabled:data-checked:bg-divider",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none [&>svg]:size-[14px]">
        <CheckIcon strokeWidth={3} className="group-data-indeterminate/checkbox:hidden" />
        <MinusIcon strokeWidth={3} className="hidden group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
