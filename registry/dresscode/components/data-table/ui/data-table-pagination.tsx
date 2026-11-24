// Data table pagination: which rows are showing (or how many are selected), rows per page, page n of m
// and first / previous / next / last. On phones the first and last buttons and the label fold away.
// Built for shadcn/ui; reads only the theme's variables.
"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type DataTablePaginationProps<TData> = React.ComponentProps<"div"> & {
  table: Table<TData>
  pageSizeOptions?: number[]
  /** What a row is called: "Showing 1–10 of 48 invoices". */
  rowLabel?: { singular: string; plural: string }
}

function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50],
  rowLabel = { singular: "row", plural: "rows" },
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const labelId = React.useId()
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const pageCount = Math.max(table.getPageCount(), 1)
  const selectable = Boolean(table.options.enableRowSelection)
  const selected = selectable ? table.getFilteredSelectedRowModel().rows.length : 0
  const from = total ? pageIndex * pageSize + 1 : 0
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const noun = total === 1 ? rowLabel.singular : rowLabel.plural
  const sizes = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b)
  const items = sizes.map((s) => ({ label: String(s), value: String(s) }))

  return (
    <div
      data-slot="data-table-pagination"
      className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-1 text-sm", className)}
      {...props}
    >
      <p className="text-muted-foreground tabular-nums" aria-live="polite">
        {selected > 0 ? (
          <>
            <span className="font-medium text-foreground">{selected}</span> of {total} {noun} selected
          </>
        ) : total ? (
          <>
            Showing {from}–{to} of {total} {noun}
          </>
        ) : (
          <>No {rowLabel.plural}</>
        )}
      </p>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <span id={labelId} className="hidden font-medium sm:inline">
            Rows per page
          </span>
          <Select items={items} value={String(pageSize)} onValueChange={(value) => value != null && table.setPageSize(Number(value))}>
            <SelectTrigger size="sm" aria-labelledby={labelId} className="w-[4.5rem] tabular-nums">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value} className="tabular-nums">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="font-medium whitespace-nowrap tabular-nums">
          Page {Math.min(pageIndex + 1, pageCount)} of {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Go to previous page">
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Go to next page">
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DataTablePagination }
export type { DataTablePaginationProps }
