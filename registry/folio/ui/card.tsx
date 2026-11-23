// Folio restyle of shadcn/ui's card: a ruled panel, not a floating tile. Twice the theme's corner
// (12px by default), a 1px divider border, no shadow, and a Newsreader headline. Same exports as the
// stock component.
import * as React from "react"
import { cn } from "cn"

function Card({ className, size = "default", ...props }: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-gap) rounded-[calc(var(--radius)*2)] border border-divider bg-card pt-[9px] pb-(--card-spacing) text-[14px] text-card-foreground [--card-gap:6px] [--card-spacing:--spacing(4)] data-[size=sm]:[--card-spacing:--spacing(3)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-x-4 gap-y-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-serif text-[23px] leading-[1.1] font-bold tracking-[-0.025em] sm:text-[26px] group-data-[size=sm]/card:text-[21px]", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-[14px] text-muted-foreground", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-(--card-spacing)", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center border-t border-divider px-(--card-spacing) pt-(--card-spacing)", className)} {...props} />
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
