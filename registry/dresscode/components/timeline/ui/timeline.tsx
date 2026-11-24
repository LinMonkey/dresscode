// Timeline: a list of events joined by a line. Vertical by default, horizontal for roadmaps.
// Each item has an indicator (a dot, an icon or a number) whose look follows its status:
// "done" fills with the primary color, "current" rings it, "upcoming" stays quiet.
// Built for shadcn/ui; reads only the theme's variables.
import * as React from "react"

import { cn } from "@/lib/utils"

type Orientation = "vertical" | "horizontal"
type Status = "done" | "current" | "upcoming"

function Timeline({ className, orientation = "vertical", ...props }: React.ComponentProps<"ol"> & { orientation?: Orientation }) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      className={cn("group/timeline flex", orientation === "vertical" ? "flex-col" : "flex-row overflow-x-auto pb-2", className)}
      {...props}
    />
  )
}

function TimelineItem({ className, status, ...props }: React.ComponentProps<"li"> & { status?: Status }) {
  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      className={cn(
        "group/timeline-item relative flex gap-4",
        // vertical: indicator column on the left, the line runs down from it to the next item
        "group-data-[orientation=vertical]/timeline:pb-8 group-data-[orientation=vertical]/timeline:last:pb-0",
        // horizontal: indicator on top, the line runs right
        "group-data-[orientation=horizontal]/timeline:min-w-40 group-data-[orientation=horizontal]/timeline:flex-1 group-data-[orientation=horizontal]/timeline:flex-col group-data-[orientation=horizontal]/timeline:gap-3 group-data-[orientation=horizontal]/timeline:pr-6",
        className,
      )}
      {...props}
    />
  )
}

/** The line between this item and the next. Put it inside a TimelineItem; hidden on the last one. */
function TimelineSeparator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="timeline-separator"
      className={cn(
        "absolute bg-border group-last/timeline-item:hidden",
        "group-data-[orientation=vertical]/timeline:top-8 group-data-[orientation=vertical]/timeline:bottom-0 group-data-[orientation=vertical]/timeline:left-[calc(--spacing(4)-0.5px)] group-data-[orientation=vertical]/timeline:w-px",
        "group-data-[orientation=horizontal]/timeline:top-[calc(--spacing(4)-0.5px)] group-data-[orientation=horizontal]/timeline:right-0 group-data-[orientation=horizontal]/timeline:left-10 group-data-[orientation=horizontal]/timeline:h-px",
        "group-data-[status=done]/timeline-item:bg-primary",
        className,
      )}
      {...props}
    />
  )
}

function TimelineIndicator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-indicator"
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground [&_svg]:size-4",
        "group-data-[status=done]/timeline-item:border-primary group-data-[status=done]/timeline-item:bg-primary group-data-[status=done]/timeline-item:text-primary-foreground",
        "group-data-[status=current]/timeline-item:border-primary group-data-[status=current]/timeline-item:text-primary group-data-[status=current]/timeline-item:ring-4 group-data-[status=current]/timeline-item:ring-primary/15",
        className,
      )}
      {...props}
    />
  )
}

/** A small dot instead of the 32px indicator, for dense feeds. */
function TimelineDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="timeline-dot" className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center", className)} {...props}>
      <span className="size-2.5 rounded-full bg-muted-foreground/50 ring-4 ring-background group-data-[status=current]/timeline-item:bg-primary group-data-[status=done]/timeline-item:bg-primary" />
    </span>
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-content" className={cn("min-w-0 flex-1 pt-1", className)} {...props} />
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-header" className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)} {...props} />
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("text-sm leading-6 font-medium group-data-[status=upcoming]/timeline-item:text-muted-foreground", className)}
      {...props}
    />
  )
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return <time data-slot="timeline-time" className={cn("text-xs text-muted-foreground tabular-nums", className)} {...props} />
}

function TimelineDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-description" className={cn("mt-1 text-sm text-muted-foreground", className)} {...props} />
}

export {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
}
