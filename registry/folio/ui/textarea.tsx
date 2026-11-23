// Folio restyle of shadcn/ui's textarea: the same ruled field as Folio's input, growing with its content.
import * as React from "react"
import { cn } from "cn"

import { fieldClass } from "./input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldClass, "flex field-sizing-content min-h-[88px] px-[12px] py-[9px] leading-[1.45]", className)} {...props} />
}

export { Textarea }
