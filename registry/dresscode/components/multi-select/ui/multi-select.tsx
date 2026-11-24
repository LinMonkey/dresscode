"use client"

// Multi select: pick several values from a searchable list. The picks sit in the field as removable
// chips (folded into "+N more" while the field is idle, if you set maxChips), the list opens below
// with a check box per option, and it can hold groups, disabled options, a most-picks limit, an empty
// or loading state and a "Create “…”" row for values that are not in the list yet.
//
// Built on Base UI's Combobox in multiple mode, the primitive behind shadcn/ui's combobox, so the
// keyboard works as people expect: type to filter, ArrowUp/ArrowDown to move, Enter to toggle,
// Backspace in the empty input removes the last chip, ArrowLeft walks the chips (Backspace or Delete
// removes the focused one), Escape closes the list. Unlike the primitive, Escape never wipes the picks.
// Built for shadcn/ui; reads only the theme's variables.
//
//   <MultiSelect options={...} value={...} onValueChange={...} />   the ready field, for most cases
//   <MultiSelectRoot> with MultiSelectField, MultiSelectValue, MultiSelectChip, MultiSelectInput,
//   MultiSelectContent, MultiSelectList, MultiSelectItem, ...          the parts, to compose your own
import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { CheckIcon, ChevronDownIcon, LoaderCircleIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type MultiSelectContextValue = {
  anchorRef: React.RefObject<HTMLDivElement | null>
  open: boolean
  /** Focus is in the field or the list is open: every chip shows, none fold into "+N more". */
  expanded: boolean
  setFocused: (focused: boolean) => void
  disabled: boolean
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(null)

function useMultiSelect() {
  const context = React.useContext(MultiSelectContext)
  if (!context) throw new Error("MultiSelect parts must be inside <MultiSelectRoot>.")
  return context
}

// ---------------------------------------------------------------------------------------------
// The parts

type MultiSelectRootProps<Value> = Omit<ComboboxPrimitive.Root.Props<Value, true>, "multiple">

/** Holds the picked values (value/defaultValue/onValueChange) and the list's open state. */
function MultiSelectRoot<Value>({ open: openProp, defaultOpen = false, onOpenChange, disabled = false, ...props }: MultiSelectRootProps<Value>) {
  const anchorRef = React.useRef<HTMLDivElement | null>(null)
  const [openState, setOpenState] = React.useState(defaultOpen)
  const [focused, setFocused] = React.useState(false)
  const open = openProp ?? openState
  const context = React.useMemo(
    () => ({ anchorRef, open, expanded: open || focused, setFocused, disabled }),
    [open, focused, disabled],
  )
  return (
    <MultiSelectContext.Provider value={context}>
      <ComboboxPrimitive.Root<Value, true>
        multiple
        open={open}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details)
          if (!details.isCanceled) setOpenState(next)
        }}
        disabled={disabled}
        {...props}
      />
    </MultiSelectContext.Provider>
  )
}

type MultiSelectFieldProps = Omit<ComboboxPrimitive.Chips.Props, "className" | "ref"> & { className?: string }

/** The box that looks like an input: chips and the search input on the left, clear and the chevron on the right. */
function MultiSelectField({ className, onFocus, onBlur, ...props }: MultiSelectFieldProps) {
  const { anchorRef, setFocused, disabled } = useMultiSelect()
  return (
    <ComboboxPrimitive.Chips
      ref={anchorRef}
      data-slot="multi-select-field"
      data-disabled={disabled || undefined}
      onFocus={(event) => {
        onFocus?.(event)
        setFocused(true)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      className={cn(
        "group/multi-select relative flex min-h-8 w-full min-w-0 cursor-text items-center gap-1 rounded-lg border border-input bg-transparent py-0.5 pr-1 pl-1 text-sm transition-[color,box-shadow,border-color] outline-none",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

/** The wrapping row of chips and the input, inside MultiSelectField. */
function MultiSelectChips({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="multi-select-chips" className={cn("flex min-w-0 flex-1 flex-wrap items-center gap-1", className)} {...props} />
}

type MultiSelectValueProps<Value> = {
  /** Renders one chip; give it a key. */
  children: (value: Value, index: number) => React.ReactNode
  /** Chips to show while the field is idle. The rest fold into "+N more" until the field has focus. */
  max?: number
  /** Replaces the default "+N more" chip; gets the values that are folded away. */
  overflow?: (hidden: Value[]) => React.ReactNode
}

/** The picked values as chips, in the order they were picked. */
function MultiSelectValue<Value>({ children, max, overflow }: MultiSelectValueProps<Value>) {
  const { expanded } = useMultiSelect()
  return (
    <ComboboxPrimitive.Value>
      {(values: Value[]) => {
        const fold = max !== undefined && !expanded && values.length > max
        const shown = fold ? values.slice(0, max) : values
        const hidden = fold ? values.slice(max) : []
        return (
          <>
            {shown.map((value, index) => children(value, index))}
            {hidden.length ? (overflow ? overflow(hidden) : <MultiSelectOverflow>+{hidden.length} more</MultiSelectOverflow>) : null}
          </>
        )
      }}
    </ComboboxPrimitive.Value>
  )
}

type MultiSelectChipProps = Omit<ComboboxPrimitive.Chip.Props, "className"> & {
  className?: string
  /** The remove button's accessible name, e.g. "Remove Design". */
  removeLabel?: string
  removable?: boolean
}

function MultiSelectChip({ className, children, removeLabel = "Remove", removable = true, ...props }: MultiSelectChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="multi-select-chip"
      className={cn(
        "flex h-6 max-w-full min-w-0 items-center gap-1 rounded-md bg-foreground/10 pl-2 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring",
        removable ? "pr-0.5" : "pr-2",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? <span className="truncate">{children}</span> : children}
      {removable ? (
        <ComboboxPrimitive.ChipRemove
          aria-label={removeLabel}
          data-slot="multi-select-chip-remove"
          className="flex size-5 shrink-0 cursor-default items-center justify-center rounded-sm opacity-60 transition-opacity hover:bg-foreground/10 hover:opacity-100 disabled:pointer-events-none"
        >
          <XIcon aria-hidden="true" className="size-3" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  )
}

/** The "+N more" chip MultiSelectValue shows when it folds chips away. */
function MultiSelectOverflow({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="multi-select-overflow"
      className={cn("flex h-6 shrink-0 items-center rounded-md border border-dashed border-border px-1.5 text-xs font-medium text-muted-foreground tabular-nums", className)}
      {...props}
    />
  )
}

type MultiSelectInputProps = Omit<ComboboxPrimitive.Input.Props, "className"> & { className?: string }

function MultiSelectInput({ className, onKeyDown, ...props }: MultiSelectInputProps) {
  const { open, expanded } = useMultiSelect()
  return (
    <ComboboxPrimitive.Input
      data-slot="multi-select-input"
      onKeyDown={(event) => {
        onKeyDown?.(event)
        // The primitive clears every pick on Escape while the list is closed; here Escape only closes it.
        if (event.key === "Escape" && !open) event.preventBaseUIHandler()
      }}
      className={cn(
        "h-6 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
        // Room to type while editing; while idle it squeezes in after the chips instead of taking a row.
        expanded ? "min-w-20" : "min-w-0 not-placeholder-shown:px-0",
        className,
      )}
      {...props}
    />
  )
}

type MultiSelectButtonProps = Omit<ComboboxPrimitive.Clear.Props, "className"> & { className?: string }

const iconButton =
  "flex size-6 shrink-0 cursor-default items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:size-4"

/** Removes every pick. Shows only while something is picked; reachable with Tab. */
function MultiSelectClear({ className, children, ...props }: MultiSelectButtonProps) {
  return (
    <ComboboxPrimitive.Clear data-slot="multi-select-clear" aria-label="Clear all" tabIndex={0} className={cn(iconButton, className)} {...props}>
      {children ?? <XIcon aria-hidden="true" />}
    </ComboboxPrimitive.Clear>
  )
}

type MultiSelectTriggerProps = Omit<ComboboxPrimitive.Trigger.Props, "className"> & { className?: string }

/** The chevron that opens and closes the list. */
function MultiSelectTrigger({ className, children, ...props }: MultiSelectTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="multi-select-trigger"
      aria-label="Show options"
      className={cn(iconButton, "[&_svg]:transition-transform data-popup-open:[&_svg]:rotate-180", className)}
      {...props}
    >
      {children ?? <ChevronDownIcon aria-hidden="true" />}
    </ComboboxPrimitive.Trigger>
  )
}

type MultiSelectContentProps = Omit<ComboboxPrimitive.Popup.Props, "className"> & { className?: string } & Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset"
  >

/** The list's popup, as wide as the field and anchored below it. */
function MultiSelectContent({ className, side = "bottom", sideOffset = 6, align = "start", alignOffset = 0, ...props }: MultiSelectContentProps) {
  const { anchorRef } = useMultiSelect()
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner anchor={anchorRef} side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} className="isolate z-50">
        <ComboboxPrimitive.Popup
          data-slot="multi-select-content"
          className={cn(
            "group/multi-select-content flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

type MultiSelectListProps = Omit<ComboboxPrimitive.List.Props, "className"> & { className?: string }

function MultiSelectList({ className, ...props }: MultiSelectListProps) {
  return (
    <ComboboxPrimitive.List
      data-slot="multi-select-list"
      className={cn("max-h-72 min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0", className)}
      {...props}
    />
  )
}

const itemClass =
  "group/multi-select-item relative flex w-full cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"

type MultiSelectItemProps = Omit<ComboboxPrimitive.Item.Props, "className"> & { className?: string }

/** An option with a check box that fills when it is picked. */
function MultiSelectItem({ className, children, ...props }: MultiSelectItemProps) {
  return (
    <ComboboxPrimitive.Item data-slot="multi-select-item" className={cn(itemClass, className)} {...props}>
      <span
        aria-hidden="true"
        data-slot="multi-select-check"
        className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input text-transparent transition-colors group-data-[selected]/multi-select-item:border-primary group-data-[selected]/multi-select-item:bg-primary group-data-[selected]/multi-select-item:text-primary-foreground"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </span>
      {children}
    </ComboboxPrimitive.Item>
  )
}

/** The "Create “…”" row: an option without a check box, for a value that is not in the list yet. */
function MultiSelectCreate({ className, children, ...props }: MultiSelectItemProps) {
  return (
    <ComboboxPrimitive.Item data-slot="multi-select-create" className={cn(itemClass, className)} {...props}>
      <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center text-muted-foreground group-data-highlighted/multi-select-item:text-accent-foreground">
        <PlusIcon className="size-4" />
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </ComboboxPrimitive.Item>
  )
}

type MultiSelectGroupProps = Omit<ComboboxPrimitive.Group.Props, "className"> & { className?: string }

function MultiSelectGroup({ className, ...props }: MultiSelectGroupProps) {
  return <ComboboxPrimitive.Group data-slot="multi-select-group" className={cn("not-first:mt-1", className)} {...props} />
}

type MultiSelectGroupLabelProps = Omit<ComboboxPrimitive.GroupLabel.Props, "className"> & { className?: string }

function MultiSelectGroupLabel({ className, ...props }: MultiSelectGroupLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="multi-select-group-label"
      className={cn("sticky top-0 z-10 -mx-1 bg-popover px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Renders a group's items; use inside MultiSelectGroup with a function child. */
const MultiSelectCollection = ComboboxPrimitive.Collection

type MultiSelectEmptyProps = Omit<ComboboxPrimitive.Empty.Props, "className"> & { className?: string }

/** Shows its children only when nothing matches (it stays mounted as a live region). */
function MultiSelectEmpty({ className, ...props }: MultiSelectEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="multi-select-empty"
      className={cn("flex flex-col items-center justify-center gap-1 px-4 py-6 text-center text-sm text-muted-foreground empty:p-0", className)}
      {...props}
    />
  )
}

function MultiSelectSeparator({ className, ...props }: Omit<ComboboxPrimitive.Separator.Props, "className"> & { className?: string }) {
  return <ComboboxPrimitive.Separator data-slot="multi-select-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
}

/** A polite live region, e.g. "4 results", for screen readers. Usually with className="sr-only". */
function MultiSelectStatus({ className, ...props }: Omit<ComboboxPrimitive.Status.Props, "className"> & { className?: string }) {
  return <ComboboxPrimitive.Status data-slot="multi-select-status" className={className} {...props} />
}

/** A strip under the list for a hint such as "2 of 3 picked". */
function MultiSelectFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="multi-select-footer"
      className={cn("flex items-center gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------------------------
// The ready field

type MultiSelectOption = {
  value: string
  label: string
  /** A second line under the label, such as a role or an email. Search matches it too. */
  description?: string
  /** More words search should match, such as a country code. */
  keywords?: string[]
  disabled?: boolean
}

type MultiSelectOptionGroup<T extends MultiSelectOption = MultiSelectOption> = { label: string; options: readonly T[] }

const CREATE = Symbol("multi-select-create")
type CreateEntry = MultiSelectOption & { [CREATE]: true }
type Entry<T> = T | CreateEntry
type EntryGroup<T> = { label: string | null; items: Entry<T>[] }

const isCreate = (entry: MultiSelectOption): entry is CreateEntry => CREATE in entry
const isGroup = <T extends MultiSelectOption>(entry: T | MultiSelectOptionGroup<T>): entry is MultiSelectOptionGroup<T> => "options" in entry
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
const matches = (option: MultiSelectOption, query: string) =>
  !query || [option.label, option.description ?? "", ...(option.keywords ?? [])].some((text) => normalize(text).includes(query))

type InputAriaProps = Pick<React.ComponentProps<"input">, "aria-label" | "aria-labelledby" | "aria-describedby" | "aria-invalid">

type MultiSelectProps<T extends MultiSelectOption> = InputAriaProps & {
  /** A flat list, or groups of { label, options }. Options outside a group list first. */
  options: readonly (T | MultiSelectOptionGroup<T>)[]
  /** The picked option values, when controlled. */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Shown while nothing is picked. */
  placeholder?: string
  /** Most picks allowed. Once full, the options not picked are disabled and the list says so. */
  max?: number
  /** Chips to show while the field is idle; the rest fold into "+N more" until it has focus. */
  maxChips?: number
  /** Offer "Create “…”" when the typed text matches no option's label. */
  creatable?: boolean
  /** Called with the typed text when someone creates a value. Return the new option, or nothing to use the text as value and label. */
  onCreate?: (label: string) => T | void
  /** What the list says when nothing matches. A function gets the typed text. */
  emptyMessage?: React.ReactNode | ((query: string) => React.ReactNode)
  /** Show a spinner row instead of the options, e.g. while they load from your API. */
  loading?: boolean
  loadingMessage?: React.ReactNode
  /** An option's content after its check box. Defaults to the label with the description under it. */
  renderOption?: (option: T) => React.ReactNode
  /** A chip's content. Defaults to the label. */
  renderChip?: (option: T) => React.ReactNode
  chipClassName?: string
  /** A strip under the list. With max set it defaults to "N of max picked"; pass null to hide it. */
  footer?: React.ReactNode
  /** Show the clear-all button while something is picked. */
  clearable?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  required?: boolean
  /** Submits each picked value under this name with the form. */
  name?: string
  /** Goes on the input, for <Label htmlFor>. */
  id?: string
  className?: string
}

function MultiSelect<T extends MultiSelectOption = MultiSelectOption>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  max,
  maxChips,
  creatable = false,
  onCreate,
  emptyMessage = "No matches.",
  loading = false,
  loadingMessage = "Loading…",
  renderOption,
  renderChip,
  chipClassName,
  footer,
  clearable = true,
  open,
  onOpenChange,
  disabled,
  required,
  name,
  id,
  className,
  ...aria
}: MultiSelectProps<T>) {
  const [valueState, setValueState] = React.useState<string[]>(defaultValue ?? [])
  const value = valueProp ?? valueState
  const [query, setQuery] = React.useState("")
  const [created, setCreated] = React.useState<T[]>([])

  const grouped = options.some(isGroup)
  const groups = React.useMemo(() => {
    const loose = options.filter((o): o is T => !isGroup(o))
    const list: { label: string | null; options: readonly T[] }[] = [
      ...(loose.length || !options.some(isGroup) ? [{ label: null, options: loose }] : []),
      ...options.filter(isGroup).map((g) => ({ label: g.label, options: g.options })),
    ]
    const known = new Set(list.flatMap((g) => g.options.map((o) => o.value)))
    const extra = created.filter((o) => !known.has(o.value))
    if (extra.length) {
      if (list.length === 1 && list[0].label === null) list[0] = { label: null, options: [...list[0].options, ...extra] }
      else list.push({ label: "Added by you", options: extra })
    }
    return list
  }, [options, created])
  const byValue = React.useMemo(() => new Map(groups.flatMap((g) => g.options.map((o) => [o.value, o] as const))), [groups])
  const selected = React.useMemo(() => value.map((v) => byValue.get(v) ?? ({ value: v, label: v } as T)), [value, byValue])
  const full = max !== undefined && value.length >= max

  const trimmed = query.trim().replace(/\s+/g, " ")
  const q = normalize(trimmed)
  const createEntry: CreateEntry | null =
    creatable && trimmed && ![...byValue.values()].some((o) => normalize(o.label) === q) ? { value: `\u0000create:${trimmed}`, label: trimmed, [CREATE]: true } : null

  const allGroups: EntryGroup<T>[] = groups.map((g) => ({ label: g.label, items: [...g.options] }))
  const shownGroups: EntryGroup<T>[] = loading
    ? []
    : groups.map((g) => ({ label: g.label, items: g.options.filter((o) => matches(o, q)) as Entry<T>[] })).filter((g) => g.items.length)
  if (createEntry && !loading) {
    if (grouped) shownGroups.push({ label: null, items: [createEntry] })
    else if (shownGroups.length) shownGroups[0].items.push(createEntry)
    else shownGroups.push({ label: null, items: [createEntry] })
  }
  const shownCount = shownGroups.reduce((n, g) => n + g.items.filter((e) => !isCreate(e)).length, 0)

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setValueState(next)
    onValueChange?.(next)
  }
  const handleChange = (next: Entry<T>[]) => {
    const kept = next.filter((e) => !isCreate(e)).map((e) => e.value)
    const create = next.find(isCreate)
    if (!create) return setValue(kept)
    const made = onCreate?.(create.label) ?? ({ value: create.label, label: create.label } as T)
    if (!byValue.has(made.value)) setCreated((list) => [...list, made])
    setValue([...kept.filter((v) => v !== made.value), made.value])
  }

  const renderEntry = (entry: Entry<T>) =>
    isCreate(entry) ? (
      <MultiSelectCreate key={entry.value} value={entry} disabled={full}>
        Create “{entry.label}”
      </MultiSelectCreate>
    ) : (
      <MultiSelectItem key={entry.value} value={entry} disabled={entry.disabled || (full && !value.includes(entry.value))}>
        {renderOption ? (
          renderOption(entry)
        ) : (
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate">{entry.label}</span>
            {entry.description ? <span className="truncate text-xs text-muted-foreground">{entry.description}</span> : null}
          </span>
        )}
      </MultiSelectItem>
    )

  const footerContent =
    footer !== undefined ? footer : max !== undefined ? (full ? `${max} of ${max} picked. Remove one to pick another.` : `${value.length} of ${max} picked`) : null

  return (
    <MultiSelectRoot<Entry<T>>
      items={grouped ? allGroups : allGroups[0].items}
      filteredItems={grouped ? shownGroups : (shownGroups[0]?.items ?? [])}
      value={selected}
      onValueChange={handleChange}
      inputValue={query}
      onInputValueChange={setQuery}
      isItemEqualToValue={(a, b) => a.value === b.value}
      itemToStringLabel={(entry) => entry.label}
      itemToStringValue={(entry) => entry.value}
      autoHighlight
      open={open}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
    >
      <MultiSelectField className={className}>
        <MultiSelectChips>
          <MultiSelectValue<Entry<T>>
            max={maxChips}
            overflow={(hidden) => (
              <MultiSelectOverflow title={hidden.map((h) => h.label).join(", ")}>
                +{hidden.length} more
              </MultiSelectOverflow>
            )}
          >
            {(entry) => (
              <MultiSelectChip key={entry.value} removeLabel={`Remove ${entry.label}`} className={chipClassName}>
                {renderChip && !isCreate(entry) ? renderChip(entry) : entry.label}
              </MultiSelectChip>
            )}
          </MultiSelectValue>
          <MultiSelectInput placeholder={value.length ? undefined : placeholder} {...aria} />
        </MultiSelectChips>
        {clearable ? <MultiSelectClear /> : null}
        <MultiSelectTrigger />
      </MultiSelectField>
      <MultiSelectContent>
        <MultiSelectStatus className="sr-only">{trimmed && !loading ? `${shownCount} ${shownCount === 1 ? "result" : "results"}` : ""}</MultiSelectStatus>
        <MultiSelectEmpty>
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />
              {loadingMessage}
            </span>
          ) : typeof emptyMessage === "function" ? (
            emptyMessage(trimmed)
          ) : (
            emptyMessage
          )}
        </MultiSelectEmpty>
        <MultiSelectList>
          {grouped
            ? (group: EntryGroup<T>, index: number) => (
                <MultiSelectGroup key={group.label ?? `group-${index}`} items={group.items}>
                  {group.label ? <MultiSelectGroupLabel>{group.label}</MultiSelectGroupLabel> : null}
                  <MultiSelectCollection>{(entry: Entry<T>) => renderEntry(entry)}</MultiSelectCollection>
                </MultiSelectGroup>
              )
            : (entry: Entry<T>) => renderEntry(entry)}
        </MultiSelectList>
        {footerContent ? <MultiSelectFooter aria-live="polite">{footerContent}</MultiSelectFooter> : null}
      </MultiSelectContent>
    </MultiSelectRoot>
  )
}

export {
  MultiSelect,
  MultiSelectChip,
  MultiSelectChips,
  MultiSelectClear,
  MultiSelectCollection,
  MultiSelectContent,
  MultiSelectCreate,
  MultiSelectEmpty,
  MultiSelectField,
  MultiSelectFooter,
  MultiSelectGroup,
  MultiSelectGroupLabel,
  MultiSelectInput,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectOverflow,
  MultiSelectRoot,
  MultiSelectSeparator,
  MultiSelectStatus,
  MultiSelectTrigger,
  MultiSelectValue,
  type MultiSelectOption,
  type MultiSelectOptionGroup,
  type MultiSelectProps,
}
