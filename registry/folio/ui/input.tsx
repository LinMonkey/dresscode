// Folio restyle of shadcn/ui's input: a 36px ruled field with the theme's corners (6px by default).
// Focus is an ink border with a faint ink ring; an invalid field (aria-invalid) turns press red on a press tint.
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

const fieldClass =
  "w-full min-w-0 rounded-(--radius) border border-input bg-background text-[15px] text-foreground transition-colors outline-none placeholder:text-muted-foreground hover:border-ink-2 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-hairline disabled:bg-secondary disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:bg-press-tint/45 aria-invalid:focus-visible:ring-destructive/20"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        fieldClass,
        "h-[36px] px-[12px] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-[14px] file:font-semibold file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { fieldClass, Input }
