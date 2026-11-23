"use client"

// Folio restyle of shadcn/ui's combobox (Base UI Combobox). Same API as the stock component.
//   Single:   <ComboboxInput /> is a 36px ruled field with a chevron.
//   Multiple: <ComboboxChips> holds removable newsprint chips and a typing input (the tag filter in D4).
// Items show a Folio checkbox when `multiple` is set (pass `checkbox` to ComboboxItem), otherwise an ink tick.
import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { fieldClass } from "@/registry/folio/ui/input"

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("grid size-[28px] shrink-0 place-items-center rounded-(--radius) text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/25", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-[16px] transition-transform in-data-popup-open:rotate-180" strokeWidth={2.25} />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn("grid size-[24px] place-items-center rounded-(--radius) text-ink-2 hover:bg-secondary hover:text-foreground", className)}
      {...props}
    >
      <XIcon className="pointer-events-none size-[14px]" />
    </ComboboxPrimitive.Clear>
  )
}

/** The single-value field: an input with a chevron (and an optional clear button). */
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & { showTrigger?: boolean; showClear?: boolean }) {
  return (
    <div data-slot="combobox-field" className={cn("group/combobox relative flex h-[36px] items-center", className)}>
      <ComboboxPrimitive.Input disabled={disabled} className={cn(fieldClass, "h-full pr-[64px] pl-[12px]")} {...props} />
      <div className="absolute right-[4px] flex items-center gap-[2px]">
        {showClear && <ComboboxClear disabled={disabled} />}
        {showTrigger && <ComboboxTrigger disabled={disabled} />}
      </div>
      {children}
    </div>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props & Pick<ComboboxPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} anchor={anchor} className="isolate z-50">
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-[calc(var(--radius)*2)] border border-divider bg-popover text-popover-foreground shadow-lg shadow-ink/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("max-h-[min(300px,calc(var(--available-height)-12px))] scroll-py-1 overflow-y-auto overscroll-contain p-[4px] data-empty:p-0", className)}
      {...props}
    />
  )
}

/** An option. With `checkbox` it shows a Folio checkbox on the left (multi-select lists). */
function ComboboxItem({ className, children, checkbox = false, ...props }: ComboboxPrimitive.Item.Props & { checkbox?: boolean }) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "group/combobox-item relative flex w-full cursor-pointer items-center gap-[10px] rounded-(--radius) px-[10px] py-[6px] text-[14px] outline-hidden select-none data-highlighted:bg-secondary data-disabled:pointer-events-none data-disabled:opacity-50 data-[selected]:font-semibold [&_svg]:pointer-events-none [&_svg]:shrink-0",
        !checkbox && "pr-[32px]",
        className
      )}
      {...props}
    >
      {checkbox && (
        <span
          aria-hidden
          className="grid size-[18px] shrink-0 place-items-center rounded-(--radius) border border-ink-2 bg-background text-paper group-data-[selected]/combobox-item:border-press group-data-[selected]/combobox-item:bg-press"
        >
          <CheckIcon className="hidden size-[14px] group-data-[selected]/combobox-item:block" strokeWidth={3} />
        </span>
      )}
      {children}
      {!checkbox && (
        <ComboboxPrimitive.ItemIndicator render={<span className="pointer-events-none absolute right-[10px] flex size-[16px] items-center justify-center" />}>
          <CheckIcon className="size-[16px]" strokeWidth={2.25} />
        </ComboboxPrimitive.ItemIndicator>
      )}
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return <ComboboxPrimitive.GroupLabel data-slot="combobox-label" className={cn("px-[10px] pt-[8px] pb-[4px] text-[12.5px] font-semibold text-muted-foreground", className)} {...props} />
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("hidden w-full justify-center py-[12px] text-center text-[14px] text-ink-2 group-data-empty/combobox-content:flex", className)}
      {...props}
    />
  )
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return <ComboboxPrimitive.Separator data-slot="combobox-separator" className={cn("-mx-[4px] my-[4px] h-px bg-hairline", className)} {...props} />
}

/** The multi-value field: chips plus a typing input. Give it the ref from useComboboxAnchor() and pass that to ComboboxContent's `anchor`. */
function ComboboxChips({ className, ...props }: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "group/combobox flex min-h-[36px] flex-wrap items-center gap-[6px] rounded-(--radius) border border-input bg-background px-[8px] py-[4px] text-[14px] transition-colors hover:border-ink-2 focus-within:border-foreground focus-within:ring-2 focus-within:ring-ring/15",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({ className, children, showRemove = true, ...props }: ComboboxPrimitive.Chip.Props & { showRemove?: boolean }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[24px] w-fit items-center gap-[4px] rounded-(--radius) bg-secondary pl-[9px] text-[13.5px] font-semibold whitespace-nowrap text-foreground outline-none data-highlighted:bg-hairline",
        !showRemove && "pr-[9px]",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove data-slot="combobox-chip-remove" className="grid h-full w-[22px] place-items-center rounded-r-(--radius) text-ink-2 hover:bg-hairline hover:text-foreground">
          <XIcon className="pointer-events-none size-[13px]" strokeWidth={2.25} />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return <ComboboxPrimitive.Input data-slot="combobox-chip-input" className={cn("h-[26px] min-w-[64px] flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground", className)} {...props} />
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
