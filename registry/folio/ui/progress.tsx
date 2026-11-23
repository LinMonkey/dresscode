"use client"

// Folio restyle of shadcn/ui's progress (Base UI Progress): a flat 12px bar, a hairline track and a press-red
// fill (the same bar as the goal and plan-share bars). Same API as the stock component.
// Put a ProgressLabel and ProgressValue inside for the "Emails sent this month   48,210 of 100,000" line.
// tone="warning" (amber) from 80%, tone="danger" (press, with a heavier track) at or over the limit.
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "cn"

function Progress({ className, children, value, tone = "default", ...props }: ProgressPrimitive.Root.Props & { tone?: "default" | "warning" | "danger" }) {
  return (
    <ProgressPrimitive.Root value={value} data-slot="progress" data-tone={tone} className={cn("group/progress flex flex-wrap items-baseline gap-x-3 gap-y-[10px]", className)} {...props}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn("relative flex h-[12px] w-full items-center overflow-x-hidden bg-hairline group-data-[tone=danger]/progress:bg-press-tint", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full bg-press transition-all group-data-[tone=warning]/progress:bg-warning motion-reduce:transition-none", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return <ProgressPrimitive.Label className={cn("text-[15px]", className)} data-slot="progress-label" {...props} />
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return <ProgressPrimitive.Value className={cn("ml-auto text-[15px] tabular-nums", className)} data-slot="progress-value" {...props} />
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue }
