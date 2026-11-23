// Folio's spinner (same as shadcn/ui's): it takes the text color, so it reads in ink, paper or press.
import { cn } from "cn"
import { LoaderCircleIcon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <LoaderCircleIcon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-[15px] animate-spin", className)} {...props} />
}

export { Spinner }
