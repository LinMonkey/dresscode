"use client"

// Stepper: numbered steps for checkouts, wizards and onboarding, across the top or down the side.
// Stepper holds the current step (controlled `value` + `onValueChange`, or `defaultValue`) and renders
// the labelled list. Each StepperItem has a 1-based `step` and can be `completed`, `disabled`,
// `loading` or `invalid`; with `linear` on the Stepper, a step opens only once every step before it is
// completed. The step buttons take one Tab stop: arrow keys, Home and End move between them, Enter or
// Space opens one. The current one carries aria-current="step".
// Built for shadcn/ui; reads only the theme's variables.
import * as React from "react"
import { CheckIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Orientation = "horizontal" | "vertical"
/** What a step looks like: the current one wins, then an error, then done. */
type StepState = "active" | "invalid" | "completed" | "inactive"

type StepperContextValue = {
  value: number
  setValue: (step: number) => void
  orientation: Orientation
  linear: boolean
  canOpen: (step: number) => boolean
  register: (step: number, completed: boolean) => () => void
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

/** The current step and a way to change it, for buttons and custom parts inside a Stepper. */
function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error("Stepper parts must be used inside <Stepper>.")
  const { value, setValue, orientation, linear, canOpen } = context
  return { value, setValue, orientation, linear, canOpen }
}

type StepperItemContextValue = {
  step: number
  state: StepState
  active: boolean
  completed: boolean
  disabled: boolean
  loading: boolean
  invalid: boolean
  /** The step can be opened now: not disabled, and allowed by `linear`. */
  reachable: boolean
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(null)

function useStepperItem() {
  const context = React.useContext(StepperItemContext)
  if (!context) throw new Error("This Stepper part must be used inside <StepperItem>.")
  return context
}

function useStepperContext() {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error("Stepper parts must be used inside <Stepper>.")
  return context
}

type StepperProps = Omit<React.ComponentProps<"ol">, "defaultValue"> & {
  /** The current step, 1-based. Pair with onValueChange. */
  value?: number
  /** The step to start on when value is not controlled. */
  defaultValue?: number
  onValueChange?: (step: number) => void
  orientation?: Orientation
  /** Block jumping ahead: a step opens only once every step before it is completed. */
  linear?: boolean
}

function Stepper({
  value: valueProp,
  defaultValue = 1,
  onValueChange,
  orientation = "horizontal",
  linear = false,
  className,
  onKeyDown,
  ...props
}: StepperProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const setValue = React.useCallback(
    (step: number) => {
      if (valueProp === undefined) setUncontrolled(step)
      onValueChange?.(step)
    },
    [valueProp, onValueChange],
  )

  // Which steps are completed, so `linear` can tell whether a later step may open.
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({})
  const register = React.useCallback((step: number, done: boolean) => {
    setCompleted((prev) => (prev[step] === done ? prev : { ...prev, [step]: done }))
    return () =>
      setCompleted((prev) => {
        if (!(step in prev)) return prev
        const next = { ...prev }
        delete next[step]
        return next
      })
  }, [])
  const canOpen = React.useCallback(
    (step: number) => {
      if (!linear || step <= value) return true
      for (let s = 1; s < step; s++) if (!completed[s]) return false
      return true
    },
    [linear, value, completed],
  )

  const context = React.useMemo(
    () => ({ value, setValue, orientation, linear, canOpen, register }),
    [value, setValue, orientation, linear, canOpen, register],
  )

  function handleKeyDown(event: React.KeyboardEvent<HTMLOListElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const target = event.target as HTMLElement
    if (target.dataset.slot !== "stepper-trigger") return
    const list = event.currentTarget
    const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-slot="stepper-trigger"]')).filter(
      (t) => !t.disabled && t.closest('[data-slot="stepper"]') === list,
    )
    const index = triggers.indexOf(target as HTMLButtonElement)
    if (index === -1) return
    const rtl = getComputedStyle(list).direction === "rtl"
    const back = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft"
    const forward = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"
    let to: number
    if (event.key === forward) to = (index + 1) % triggers.length
    else if (event.key === back) to = (index - 1 + triggers.length) % triggers.length
    else if (event.key === "Home") to = 0
    else if (event.key === "End") to = triggers.length - 1
    else return
    event.preventDefault()
    triggers[to]?.focus()
  }

  return (
    <StepperContext.Provider value={context}>
      <ol
        data-slot="stepper"
        data-orientation={orientation}
        aria-label={props["aria-labelledby"] ? undefined : "Progress"}
        onKeyDown={handleKeyDown}
        className={cn("group/stepper flex", orientation === "horizontal" ? "w-full items-center gap-3" : "flex-col", className)}
        {...props}
      />
    </StepperContext.Provider>
  )
}

type StepperItemProps = React.ComponentProps<"li"> & {
  /** This step's number, 1-based. */
  step: number
  completed?: boolean
  disabled?: boolean
  /** Shows a spinner in the indicator, e.g. while the step saves. */
  loading?: boolean
  /** Marks the step as having errors. */
  invalid?: boolean
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  invalid = false,
  className,
  ...props
}: StepperItemProps) {
  const { value, orientation, canOpen, register } = useStepperContext()
  React.useLayoutEffect(() => register(step, completed), [register, step, completed])

  const active = value === step
  const state: StepState = active ? "active" : invalid ? "invalid" : completed ? "completed" : "inactive"
  const reachable = !disabled && canOpen(step)
  const item = React.useMemo(
    () => ({ step, state, active, completed, disabled, loading, invalid, reachable }),
    [step, state, active, completed, disabled, loading, invalid, reachable],
  )

  return (
    <StepperItemContext.Provider value={item}>
      <li
        data-slot="stepper-item"
        data-state={state}
        data-active={active ? "" : undefined}
        data-completed={completed ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-loading={loading ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "group/stepper-item relative",
          orientation === "horizontal" ? "flex flex-1 items-center gap-3 last:flex-none" : "flex flex-col pb-8 last:pb-0",
          disabled && "opacity-50",
          className,
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

/** Words a screen reader hears before the step's title, e.g. "Step 2, completed:". */
function statusText(item: StepperItemContextValue) {
  const status = item.loading ? ", in progress" : item.invalid ? ", needs attention" : item.completed ? ", completed" : ""
  return `Step ${item.step}${status}: `
}

/** The button that opens a step. Put the indicator, title and description inside it. */
function StepperTrigger({ className, children, onClick, disabled, ...props }: React.ComponentProps<"button">) {
  const { setValue, orientation } = useStepperContext()
  const item = useStepperItem()
  return (
    <button
      type="button"
      data-slot="stepper-trigger"
      data-state={item.state}
      aria-current={item.active ? "step" : undefined}
      aria-busy={item.loading || undefined}
      tabIndex={item.active ? 0 : -1}
      disabled={disabled || !item.reachable}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && !item.active) setValue(item.step)
      }}
      className={cn(
        "group/stepper-trigger -m-1 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-lg p-1 text-start outline-none transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50 enabled:cursor-pointer disabled:cursor-default",
        "enabled:hover:*:data-[state=inactive]:data-[slot=stepper-title]:text-foreground enabled:hover:*:data-[state=inactive]:data-[slot=stepper-indicator]:border-primary/60",
        // horizontal: the title row stretches to the indicator's height when there is no description
        orientation === "horizontal" ? "grid-rows-[1fr_auto] items-center" : "items-start",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{statusText(item)}</span>
      {children}
    </button>
  )
}

/** The circle: the step number (or your icon), a check when completed, a spinner when loading. */
function StepperIndicator({ className, children, ...props }: React.ComponentProps<"span">) {
  const { orientation } = useStepperContext()
  const item = useStepperItem()
  const look = item.loading ? "loading" : item.invalid ? "invalid" : item.completed ? "completed" : item.active ? "active" : "inactive"
  return (
    <span
      aria-hidden="true"
      data-slot="stepper-indicator"
      data-state={look}
      data-active={item.active ? "" : undefined}
      className={cn(
        "row-span-2 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground tabular-nums transition-[color,background-color,border-color,box-shadow] [&_svg]:size-4",
        "data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=loading]:border-primary data-[state=loading]:text-foreground",
        "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
        "data-[state=invalid]:border-destructive data-[state=invalid]:bg-destructive/10 data-[state=invalid]:text-destructive",
        "data-active:ring-4 data-active:ring-primary/15 data-active:data-[state=invalid]:ring-destructive/15",
        orientation === "horizontal" ? "self-center" : "self-start",
        className,
      )}
      {...props}
    >
      {item.loading ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : item.invalid ? (
        <TriangleAlertIcon />
      ) : item.completed ? (
        <CheckIcon />
      ) : (
        (children ?? item.step)
      )}
    </span>
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
  const { orientation } = useStepperContext()
  const item = useStepperItem()
  return (
    <span
      data-slot="stepper-title"
      data-state={item.state}
      className={cn(
        "block text-sm leading-5 font-medium text-foreground transition-colors data-[state=inactive]:text-muted-foreground data-[state=invalid]:text-destructive",
        orientation === "horizontal" ? "self-center whitespace-nowrap" : "flex min-h-8 items-center",
        className,
      )}
      {...props}
    />
  )
}

function StepperDescription({ className, ...props }: React.ComponentProps<"span">) {
  const { orientation } = useStepperContext()
  const item = useStepperItem()
  return (
    <span
      data-slot="stepper-description"
      data-state={item.state}
      className={cn(
        "col-start-2 block text-muted-foreground",
        orientation === "horizontal" ? "self-start text-xs leading-4 whitespace-nowrap" : "-mt-1 text-sm",
        className,
      )}
      {...props}
    />
  )
}

/** The line from this step to the next; filled once this step is completed. Hidden on the last step. */
function StepperSeparator({ className, ...props }: React.ComponentProps<"span">) {
  const { orientation } = useStepperContext()
  const item = useStepperItem()
  return (
    <span
      aria-hidden="true"
      data-slot="stepper-separator"
      data-state={item.completed ? "completed" : "pending"}
      className={cn(
        "rounded-full bg-border transition-colors group-last/stepper-item:hidden data-[state=completed]:bg-primary",
        orientation === "horizontal" ? "h-0.5 min-w-6 flex-1" : "absolute start-[calc(--spacing(4)-1px)] top-10 bottom-2 w-0.5",
        className,
      )}
      {...props}
    />
  )
}

/** What shows under the current step in a vertical stepper. Renders only while its step is current. */
function StepperContent({ className, ...props }: React.ComponentProps<"div">) {
  const item = useStepperItem()
  if (!item.active) return null
  return <div data-slot="stepper-content" className={cn("ps-11 pt-3", className)} {...props} />
}

export {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  useStepper,
}
