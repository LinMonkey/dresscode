// Data table column header: the column's title as a menu button to sort it ascending or descending,
// clear the sort, or hide the column. The arrow shows the current sort; the header cell carries
// aria-sort (DataTable sets it). Right-aligned columns (meta.align) open the menu from the right.
// Built for shadcn/ui; reads only the theme's variables.
"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type DataTableColumnHeaderProps<TData, TValue> = React.ComponentProps<"div"> & {
  column: Column<TData, TValue>
  title: string
  /** Words for the two directions, e.g. { asc: "Oldest first", desc: "Newest first" }. */
  sortLabels?: { asc: string; desc: string }
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  sortLabels = { asc: "Ascending", desc: "Descending" },
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const align = column.columnDef.meta?.align
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const sorted = column.getIsSorted()
  const justify = align === "right" ? "justify-end" : align === "center" ? "justify-center" : undefined

  if (!canSort && !canHide) {
    return (
      <div data-slot="data-table-column-header" className={cn("flex items-center", justify, className)} {...props}>
        {title}
      </div>
    )
  }

  return (
    <div data-slot="data-table-column-header" className={cn("flex items-center", justify, className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 gap-1 px-2 font-medium text-muted-foreground hover:text-foreground data-popup-open:text-foreground",
                sorted && "text-foreground",
                align === "right" ? "-mr-2 flex-row-reverse" : "-ml-2",
              )}
            />
          }
        >
          <span>{title}</span>
          {sorted === "desc" ? (
            <ArrowDownIcon aria-hidden="true" />
          ) : sorted === "asc" ? (
            <ArrowUpIcon aria-hidden="true" />
          ) : (
            <ChevronsUpDownIcon aria-hidden="true" className="opacity-60" />
          )}
          <span className="sr-only">
            {sorted ? `, sorted ${(sorted === "asc" ? sortLabels.asc : sortLabels.desc).toLowerCase()}. ` : ". "}Column options
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align === "right" ? "end" : "start"} className="w-auto min-w-40">
          {canSort ? (
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup
                value={sorted || ""}
                onValueChange={(value) => (value === "asc" || value === "desc" ? column.toggleSorting(value === "desc") : column.clearSorting())}
              >
                <DropdownMenuRadioItem value="asc" closeOnClick>
                  <ArrowUpIcon className="text-muted-foreground" />
                  {sortLabels.asc}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc" closeOnClick>
                  <ArrowDownIcon className="text-muted-foreground" />
                  {sortLabels.desc}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              {sorted ? (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <XIcon className="text-muted-foreground" />
                  Clear sort
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
          ) : null}
          {canSort && canHide ? <DropdownMenuSeparator /> : null}
          {canHide ? (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon className="text-muted-foreground" />
              Hide column
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { DataTableColumnHeader }
export type { DataTableColumnHeaderProps }
