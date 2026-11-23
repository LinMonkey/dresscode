// Folio restyle of shadcn/ui's skeleton: a flat hairline-grey block with 2px corners that pulses while data loads.
// Size it like the text it stands in for (a 13px table cell is about h-[12px]); never round it into pills.
import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-[2px] bg-hairline motion-reduce:animate-none", className)} {...props} />
}

export { Skeleton }
