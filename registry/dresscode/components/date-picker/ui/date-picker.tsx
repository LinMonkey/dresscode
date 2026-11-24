"use client"

// Date picker: a field-sized button that opens a calendar in a popover.
// DatePicker picks one day. DateRangePicker picks a range: two months side by side on wide screens and
// one on phones, an optional list of presets, and an Apply step so a half-picked range never leaks out.
// Both take min/max and disabled days, show a clear button once there is a value (Backspace or Delete
// on the trigger clears too), and write ISO dates to a hidden input when given a `name`.
// Pass `aria-labelledby` with your label's id: the picked date is appended to the accessible name.
// DatePickerCalendar is the calendar inside them, for inline use: roomier cells, arrow keys that move
// focus, and a grid that is not rebuilt each time the parent renders.
// Built on the shadcn/ui Calendar (react-day-picker) and Popover; reads only the theme's variables.
import * as React from "react"
import { differenceInCalendarDays, differenceInCalendarMonths, endOfMonth, format, isSameDay, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns"
import { CalendarIcon, CheckIcon, XIcon } from "lucide-react"
import { getDefaultClassNames, type DateRange, type DayButtonProps, type Matcher, type PropsBase, type RootProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/** Calendar options you can pass through; selection, month and disabled days are the picker's own. */
type CalendarOptions = Omit<PropsBase, "mode" | "required" | "disabled" | "month" | "onMonthChange" | "numberOfMonths">

// ---------------------------------------------------------------------------------------------
// Clock and helpers

const subscribeToMinutes = (onTick: () => void) => {
  const timer = window.setInterval(onTick, 60_000)
  return () => window.clearInterval(timer)
}

/**
 * Today at midnight, or undefined on the server and during hydration. Read "today" through this hook
 * when it shows up in what you render, so a page prerendered on another day (or in another time zone)
 * hydrates without a mismatch. It rolls over at midnight.
 */
function useToday() {
  const time = React.useSyncExternalStore(subscribeToMinutes, () => startOfDay(new Date()).getTime(), () => 0)
  return React.useMemo(() => (time ? new Date(time) : undefined), [time])
}

function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query],
  )
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

/** Controlled when the `value` prop is passed at all (even as undefined), uncontrolled otherwise. */
function useValue<T>(props: object, value: T | undefined, defaultValue: T | undefined, onChange?: (next: T | undefined) => void) {
  const controlled = "value" in props
  const [own, setOwn] = React.useState(defaultValue)
  const set = (next: T | undefined) => {
    if (!controlled) setOwn(next)
    onChange?.(next)
  }
  return [controlled ? value : own, set] as const
}

function toMatchers(min?: Date, max?: Date, disabledDays?: Matcher | Matcher[]): Matcher[] {
  const extra = disabledDays === undefined ? [] : Array.isArray(disabledDays) ? disabledDays : [disabledDays]
  return [...(min ? [{ before: startOfDay(min) }] : []), ...(max ? [{ after: startOfDay(max) }] : []), ...extra]
}

const rdp = getDefaultClassNames()
/** Month and year dropdowns that look like small select fields (the native select stays on top, invisible). */
const DROPDOWN_CLASSNAMES = {
  dropdown_root: cn(
    "relative rounded-md border border-input shadow-xs has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
    rdp.dropdown_root,
  ),
  dropdown: cn("absolute inset-0 cursor-pointer bg-popover opacity-0", rdp.dropdown),
  caption_label: cn(
    "flex h-7 items-center gap-1 rounded-md pr-1.5 pl-2 text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
    rdp.caption_label,
  ),
}

// ---------------------------------------------------------------------------------------------
// DatePickerCalendar

// Stable parts for the stock Calendar. It defines its Root and DayButton inline, so every render of
// the Calendar is a new component type and React rebuilds the grid (dropping keyboard focus); and its
// day button never moves DOM focus when the arrow keys move the focused day.
function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return <div data-slot="calendar" ref={rootRef} className={className} {...props} />
}

function CalendarFocusDayButton(props: DayButtonProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const focused = props.modifiers.focused
  React.useEffect(() => {
    if (focused) ref.current?.querySelector("button")?.focus()
  }, [focused])
  return (
    <span ref={ref} className="contents">
      <CalendarDayButton {...props} />
    </span>
  )
}

/** The pickers' calendar, for inline use too. Takes every Calendar (react-day-picker) prop. */
function DatePickerCalendar({ className, components, formatters, ...props }: React.ComponentProps<typeof Calendar>) {
  return (
    <Calendar
      // Roomier day cells than the stock calendar, and finger-sized on phones.
      className={cn("p-3 [--cell-size:--spacing(9)] sm:[--cell-size:--spacing(8)]", className)}
      components={{ Root: CalendarRoot, DayButton: CalendarFocusDayButton, ...components }}
      // Month names in the calendar's own locale (the stock dropdown uses the browser's).
      formatters={{ formatMonthDropdown: (month, dateLib) => (dateLib ? dateLib.format(month, "LLL") : format(month, "LLL")), ...formatters }}
      {...props}
    />
  )
}

/** "Nov 3, 2026", "Oct 26 – Nov 24, 2026" or "Dec 15, 2025 – Jan 14, 2026". */
function formatDateRange(range: DateRange | undefined, placeholder = "") {
  if (!range?.from) return placeholder
  const { from, to } = range
  if (!to || isSameDay(from, to)) return format(from, "MMM d, yyyy")
  if (from.getFullYear() === to.getFullYear()) return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`
  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`
}

const sameRange = (a?: DateRange, b?: DateRange) =>
  !!a?.from && !!b?.from && !!a.to && !!b.to && isSameDay(a.from, b.from) && isSameDay(a.to, b.to)

function clampRange(range: DateRange, min?: Date, max?: Date): DateRange | undefined {
  let { from, to } = range
  if (from && min && from < startOfDay(min)) from = startOfDay(min)
  if (to && max && to > startOfDay(max)) to = startOfDay(max)
  if (!from || (to && from > to)) return undefined
  return { from, to }
}

// ---------------------------------------------------------------------------------------------
// The field: trigger button, clear button and hidden input

type PickerBaseProps = {
  id?: string
  /** Writes the value to a hidden input: yyyy-MM-dd, or yyyy-MM-dd/yyyy-MM-dd for a range. */
  name?: string
  placeholder?: string
  disabled?: boolean
  /** Show a button that clears the value. Default true. */
  clearable?: boolean
  clearLabel?: string
  /** The earliest day that can be picked; also where month navigation stops. */
  min?: Date
  /** The latest day that can be picked; also where month navigation stops. */
  max?: Date
  /** More days that cannot be picked: dates, ranges, { dayOfWeek: [0, 6] }, a function... */
  disabledDays?: Matcher | Matcher[]
  align?: "start" | "center" | "end"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** The field wrapper. */
  className?: string
  triggerClassName?: string
  calendarProps?: CalendarOptions
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  "aria-labelledby"?: string
  "aria-label"?: string
}

type PickerFieldProps = Pick<
  PickerBaseProps,
  "id" | "name" | "disabled" | "clearLabel" | "className" | "triggerClassName" | "aria-invalid" | "aria-describedby" | "aria-labelledby" | "aria-label"
> & {
  slot: string
  hasValue: boolean
  showClear: boolean
  hiddenValue: string
  onClear: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  children: React.ReactNode
}

function PickerField({ slot, hasValue, showClear, hiddenValue, onClear, triggerRef, clearLabel, className, triggerClassName, children, ...props }: PickerFieldProps) {
  const valueId = React.useId()
  const clear = () => {
    onClear()
    triggerRef.current?.focus()
  }
  return (
    <div data-slot={slot} className={cn("relative w-full", className)}>
      <PopoverTrigger
        ref={triggerRef}
        id={props.id}
        disabled={props.disabled}
        aria-invalid={props["aria-invalid"] || undefined}
        aria-describedby={props["aria-describedby"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"] ? `${props["aria-labelledby"]} ${valueId}` : undefined}
        onKeyDown={(e) => {
          if (showClear && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault()
            onClear()
          }
        }}
        render={
          <Button
            variant="outline"
            data-slot={`${slot}-trigger`}
            className={cn(
              // Looks like the other fields (border-input, no fill); the open state keeps the button's muted fill.
              "w-full justify-start gap-2 border-input bg-transparent px-2.5 text-left font-normal hover:bg-transparent",
              showClear && "pr-9",
              !hasValue && "text-muted-foreground hover:text-muted-foreground aria-expanded:text-muted-foreground",
              triggerClassName,
            )}
          />
        }
      >
        <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
        <span id={valueId} className="min-w-0 flex-1 truncate">
          {children}
        </span>
      </PopoverTrigger>
      {showClear ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          data-slot={`${slot}-clear`}
          aria-label={clearLabel}
          onClick={clear}
          className="absolute inset-y-0 right-1 my-auto text-muted-foreground hover:text-foreground"
        >
          <XIcon />
        </Button>
      ) : null}
      {props.name ? <input type="hidden" name={props.name} value={hiddenValue} /> : null}
    </div>
  )
}

/** On keyboard open, focus the picked day (or today) so the arrow keys move through the grid at once. */
function useDayFocus() {
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const initialFocus = (openType: string) =>
    openType === "keyboard" ? (bodyRef.current?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]') ?? true) : true
  return { bodyRef, initialFocus }
}

// ---------------------------------------------------------------------------------------------
// DatePicker

type DatePickerProps = PickerBaseProps & {
  value?: Date | undefined
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  /** date-fns format for the button text. Default "MMM d, yyyy" (Nov 24, 2026). */
  displayFormat?: string
  /** "dropdown" puts month and year selects in the caption, for birth dates and far-off dates. */
  captionLayout?: PropsBase["captionLayout"]
  /** Close the popover once a day is picked. Default true. */
  closeOnSelect?: boolean
  /** Rendered in the popover under the calendar. */
  footer?: React.ReactNode
}

function DatePicker(props: DatePickerProps) {
  const {
    defaultValue,
    onValueChange,
    placeholder = "Pick a date",
    displayFormat = "MMM d, yyyy",
    min,
    max,
    disabledDays,
    captionLayout = "label",
    closeOnSelect = true,
    footer,
    clearable = true,
    clearLabel = "Clear date",
    disabled,
    align = "start",
    open: openProp,
    onOpenChange,
    calendarProps,
    ...field
  } = props
  const [value, setValue] = useValue(props, props.value, defaultValue, onValueChange)
  const [ownOpen, setOwnOpen] = React.useState(false)
  const open = openProp ?? ownOpen
  const setOpen = (next: boolean) => {
    setOwnOpen(next)
    onOpenChange?.(next)
  }
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const { bodyRef, initialFocus } = useDayFocus()
  const dropdowns = captionLayout !== "label"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerField
        {...field}
        slot="date-picker"
        disabled={disabled}
        clearLabel={clearLabel}
        hasValue={!!value}
        showClear={clearable && !!value && !disabled}
        hiddenValue={value ? format(value, "yyyy-MM-dd") : ""}
        onClear={() => setValue(undefined)}
        triggerRef={triggerRef}
      >
        {value ? format(value, displayFormat) : placeholder}
      </PickerField>
      <PopoverContent align={align} initialFocus={initialFocus} className="max-h-(--available-height) w-auto gap-0 overflow-y-auto p-0">
        <div ref={bodyRef} data-slot="date-picker-content">
          <DatePickerCalendar
            {...calendarProps}
            mode="single"
            required
            selected={value}
            onSelect={(day) => {
              setValue(day)
              if (closeOnSelect) setOpen(false)
            }}
            defaultMonth={value ?? calendarProps?.defaultMonth}
            startMonth={calendarProps?.startMonth ?? min}
            endMonth={calendarProps?.endMonth ?? max}
            disabled={toMatchers(min, max, disabledDays)}
            captionLayout={captionLayout}
            classNames={dropdowns ? { ...DROPDOWN_CLASSNAMES, ...calendarProps?.classNames } : calendarProps?.classNames}
          />
          {footer ? (
            <div data-slot="date-picker-footer" className="border-t p-3">
              {footer}
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------------------------
// DateRangePicker

type DateRangePreset = {
  label: string
  /** The preset's range, given today at midnight. */
  getRange: (today: Date) => DateRange
}

/** Report-style presets. "This month" and "This year" run up to today. */
const dateRangePresets: DateRangePreset[] = [
  { label: "Today", getRange: (today) => ({ from: today, to: today }) },
  { label: "Last 7 days", getRange: (today) => ({ from: subDays(today, 6), to: today }) },
  { label: "Last 30 days", getRange: (today) => ({ from: subDays(today, 29), to: today }) },
  { label: "This month", getRange: (today) => ({ from: startOfMonth(today), to: today }) },
  {
    label: "Last month",
    getRange: (today) => {
      const month = subMonths(today, 1)
      return { from: startOfMonth(month), to: startOfDay(endOfMonth(month)) }
    },
  },
  { label: "This year", getRange: (today) => ({ from: startOfYear(today), to: today }) },
]

type DateRangePickerProps = PickerBaseProps & {
  value?: DateRange | undefined
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  /** Shortcuts beside the calendar (above it on phones). See `dateRangePresets`. */
  presets?: DateRangePreset[]
  /** Default: 2 on screens 768px and wider, 1 below. */
  numberOfMonths?: number
  /** Keep the change as a draft until Apply (default). false: commit as soon as both ends are picked. */
  confirm?: boolean
  /** The shortest and longest range, in days. */
  minDays?: number
  maxDays?: number
  /** Start over when a range would include a disabled day. */
  excludeDisabled?: boolean
  applyLabel?: string
}

function DateRangePicker(props: DateRangePickerProps) {
  const {
    defaultValue,
    onValueChange,
    placeholder = "Pick a date range",
    presets,
    numberOfMonths,
    confirm = true,
    minDays,
    maxDays,
    excludeDisabled,
    applyLabel = "Apply",
    min,
    max,
    disabledDays,
    clearable = true,
    clearLabel = "Clear dates",
    disabled,
    align = "start",
    open: openProp,
    onOpenChange,
    calendarProps,
    ...field
  } = props
  const [value, setValue] = useValue(props, props.value, defaultValue, onValueChange)
  const today = useToday()
  const wide = useMediaQuery("(min-width: 768px)")
  const months = numberOfMonths ?? (wide ? 2 : 1)
  const [ownOpen, setOwnOpen] = React.useState(false)
  const open = openProp ?? ownOpen
  const [draft, setDraft] = React.useState<DateRange | undefined>(value)
  const [month, setMonth] = React.useState<Date>()
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const { bodyRef, initialFocus } = useDayFocus()

  const presetRange = (preset: DateRangePreset) => (today ? clampRange(preset.getRange(today), min, max) : undefined)
  const activePreset = value ? presets?.find((p) => sameRange(presetRange(p), value)) : undefined
  // The first month to show: where the range starts if it fits, else so it ends on the last month shown;
  // then kept inside the navigable months (a report ending today shows last month and this one).
  const monthFor = (range: DateRange | undefined) => {
    const end = range?.to ?? range?.from ?? today ?? new Date()
    const start = range?.from ?? end
    let first = startOfMonth(differenceInCalendarMonths(end, start) < months ? start : subMonths(end, months - 1))
    const lastMonth = calendarProps?.endMonth ?? max
    const firstMonth = calendarProps?.startMonth ?? min
    if (lastMonth && differenceInCalendarMonths(lastMonth, first) < months - 1) first = startOfMonth(subMonths(lastMonth, months - 1))
    if (firstMonth && first < startOfMonth(firstMonth)) first = startOfMonth(firstMonth)
    return first
  }

  const setOpen = (next: boolean) => {
    if (next) {
      setDraft(value)
      setMonth(monthFor(value))
    }
    setOwnOpen(next)
    onOpenChange?.(next)
  }
  const commit = (range: DateRange | undefined) => {
    setValue(range?.from ? { from: range.from, to: range.to ?? range.from } : undefined)
    setOpen(false)
  }
  const pickPreset = (range: DateRange) => {
    if (!confirm) return commit(range)
    setDraft(range)
    setMonth(monthFor(range))
  }

  const days = draft?.from && draft.to ? differenceInCalendarDays(draft.to, draft.from) + 1 : 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerField
        {...field}
        slot="date-range-picker"
        disabled={disabled}
        clearLabel={clearLabel}
        hasValue={!!value?.from}
        showClear={clearable && !!value?.from && !disabled}
        hiddenValue={value?.from ? `${format(value.from, "yyyy-MM-dd")}/${format(value.to ?? value.from, "yyyy-MM-dd")}` : ""}
        onClear={() => setValue(undefined)}
        triggerRef={triggerRef}
      >
        {activePreset ? <span className="hidden text-muted-foreground sm:inline">{activePreset.label} · </span> : null}
        {formatDateRange(value, placeholder)}
      </PickerField>
      <PopoverContent
        align={align}
        initialFocus={initialFocus}
        className="max-h-(--available-height) w-auto max-w-[calc(100vw-1rem)] gap-0 overflow-y-auto p-0"
      >
        <div ref={bodyRef} data-slot="date-range-picker-content" className="flex flex-col sm:flex-row">
          {presets?.length ? (
            <div
              role="group"
              aria-label="Presets"
              data-slot="date-range-picker-presets"
              className="grid grid-cols-2 gap-1 border-b p-2 sm:flex sm:w-36 sm:shrink-0 sm:flex-col sm:border-r sm:border-b-0"
            >
              {presets.map((preset) => {
                const range = presetRange(preset)
                const active = sameRange(range, draft)
                return (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-pressed={active}
                    disabled={!range}
                    onClick={() => range && pickPreset(range)}
                    className="justify-between font-normal aria-pressed:bg-muted aria-pressed:font-medium aria-pressed:text-foreground"
                  >
                    {preset.label}
                    {active ? <CheckIcon aria-hidden="true" /> : null}
                  </Button>
                )
              })}
            </div>
          ) : null}
          <DatePickerCalendar
            {...calendarProps}
            mode="range"
            resetOnSelect
            selected={draft}
            onSelect={(range) => {
              setDraft(range)
              if (!confirm && range?.from && range.to) commit(range)
            }}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={months}
            min={minDays}
            max={maxDays}
            excludeDisabled={excludeDisabled}
            startMonth={calendarProps?.startMonth ?? min}
            endMonth={calendarProps?.endMonth ?? max}
            disabled={toMatchers(min, max, disabledDays)}
            className={cn("max-sm:mx-auto", calendarProps?.className)}
          />
        </div>
        {confirm ? (
          <div data-slot="date-range-picker-footer" className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t p-3">
            <p aria-live="polite" className="text-sm">
              {!draft?.from ? (
                <span className="text-muted-foreground">Pick a start date</span>
              ) : !draft.to ? (
                <>
                  <span className="font-medium">{format(draft.from, "MMM d, yyyy")}</span>
                  <span className="text-muted-foreground"> – pick an end date</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{formatDateRange(draft)}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {days} {days === 1 ? "day" : "days"}
                  </span>
                </>
              )}
            </p>
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" disabled={!draft?.from} onClick={() => commit(draft)}>
                {applyLabel}
              </Button>
            </div>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, DatePickerCalendar, DateRangePicker, dateRangePresets, formatDateRange, useToday }
export type { DatePickerProps, DateRange, DateRangePickerProps, DateRangePreset }
