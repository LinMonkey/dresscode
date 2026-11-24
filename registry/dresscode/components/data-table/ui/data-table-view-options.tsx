// Data table view options: a menu of checkboxes to show and hide columns, named by each column's
// meta.label. The last visible column cannot be hidden; "Reset columns" brings back the defaults.
// Built for shadcn/ui; reads only the theme's variables.
"use client"

import type { Table } from "@tanstack/react-table"
import { RotateCcwIcon, Settings2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  className?: string
}

function DataTableViewOptions<TData>({ table, className }: DataTableViewOptionsProps<TData>) {
  const columns = table.getAllLeafColumns().filter((c) => c.accessorFn !== undefined && c.getCanHide())
  const visible = columns.filter((c) => c.getIsVisible())
  const initial = table.initialState.columnVisibility ?? {}
  const isDefault = columns.every((c) => c.getIsVisible() === (initial[c.id] ?? true))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className={cn("data-popup-open:bg-muted", className)} />}>
        <Settings2Icon />
        <span className="max-sm:sr-only">View</span>
        {visible.length < columns.length ? (
          <span className="text-muted-foreground tabular-nums max-sm:hidden">
            {visible.length}/{columns.length}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show columns</DropdownMenuLabel>
          {columns.map((column) => {
            const only = column.getIsVisible() && visible.length === 1
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                disabled={only}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                {column.columnDef.meta?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isDefault} onClick={() => table.resetColumnVisibility()}>
          <RotateCcwIcon className="text-muted-foreground" />
          Reset columns
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableViewOptions }
export type { DataTableViewOptionsProps }
