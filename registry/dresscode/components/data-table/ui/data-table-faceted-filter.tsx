// Data table faceted filter: a dashed button that opens a searchable list of a column's values, each
// with a checkbox and how many rows have it (counted with the other filters applied). Pick several;
// the button shows what is picked. Give the column `filterFn: facetedFilterFn`.
// Built for shadcn/ui; reads only the theme's variables.
"use client"

import * as React from "react"
import type { Column, Row } from "@tanstack/react-table"
import { CheckIcon, PlusCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type FacetOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title: string
  options: FacetOption[]
  /** Show the search box at the top of the list. On by default when there are more than 6 options. */
  searchable?: boolean
  className?: string
}

/** Keeps rows whose value is one of the picked values. Use as the column's filterFn. */
function facetedFilterFn<TData>(row: Row<TData>, columnId: string, value: string[] | undefined) {
  return !value?.length || value.includes(String(row.getValue(columnId)))
}
facetedFilterFn.autoRemove = (value: unknown) => !Array.isArray(value) || value.length === 0

function DataTableFacetedFilter<TData, TValue>({ column, title, options, searchable, className }: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? [])
  const picked = options.filter((o) => selected.has(o.value))
  const withSearch = searchable ?? options.length > 6

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column?.setFilterValue(next.size ? options.map((o) => o.value).filter((v) => next.has(v)) : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" size="sm" className={cn("border-dashed data-popup-open:bg-muted", selected.size > 0 && "border-solid", className)} />}
      >
        <PlusCircleIcon className="text-muted-foreground" />
        {title}
        {picked.length > 0 ? (
          <>
            <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-border" />
            <Badge variant="secondary" className="rounded-sm px-1.5 font-normal tabular-nums lg:hidden">
              {picked.length}
              <span className="sr-only"> selected</span>
            </Badge>
            <span className="hidden gap-1 lg:flex">
              {picked.length > 2 ? (
                <Badge variant="secondary" className="rounded-sm px-1.5 font-normal">
                  {picked.length} selected
                </Badge>
              ) : (
                picked.map((o) => (
                  <Badge key={o.value} variant="secondary" className="max-w-32 rounded-sm px-1.5 font-normal">
                    <span className="truncate">{o.label}</span>
                  </Badge>
                ))
              )}
            </span>
          </>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 gap-0 p-0">
        <Command>
          {withSearch ? <CommandInput placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title.toLowerCase()}`} /> : null}
          <CommandList aria-label={title}>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.value)
                const count = facets?.get(option.value) ?? 0
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggle(option.value)}
                    aria-checked={isSelected}
                    className="[&>svg:last-child]:hidden"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input",
                        isSelected && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {isSelected ? <CheckIcon className="size-3" /> : null}
                    </span>
                    {option.icon ? <option.icon className="text-muted-foreground" /> : null}
                    <span className="truncate">{option.label}</span>
                    <span className={cn("ml-auto text-xs tabular-nums text-muted-foreground", count === 0 && "opacity-60")}>
                      {count}
                      <span className="sr-only"> {count === 1 ? "row" : "rows"}</span>
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem value="__clear" onSelect={() => column?.setFilterValue(undefined)} className="justify-center [&>svg:last-child]:hidden">
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { DataTableFacetedFilter, facetedFilterFn }
export type { DataTableFacetedFilterProps, FacetOption }
