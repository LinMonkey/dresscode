// Data table: rows of records on @tanstack/react-table and the stock shadcn/ui Table. Sorting,
// search and column filters, pagination, row selection (shift-click selects a range), column
// visibility, expandable rows, a totals footer, a sticky header and pinned columns.
// Pass columns and data; the toolbar slot gets the table instance for search, filters and bulk
// actions. Column meta (label, align, classes) is typed below. Built for shadcn/ui; reads only the
// theme's variables. The frame's background is var(--data-table-bg), the page background by default:
// set it to var(--card) when the table sits in a card, so pinned cells match.
"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type FilterFnOption,
  type InitialTableState,
  type Row,
  type RowData,
  type Table as TanstackTable,
  type TableOptions,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronRightIcon, ChevronsDownUpIcon, ChevronsUpDownIcon, MinusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "@/registry/dresscode/components/data-table/ui/data-table-pagination"

declare module "@tanstack/react-table" {
  // TData and TValue must stay: the declaration merges with TanStack's own.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** The column's name in the view menu and in screen-reader labels. Defaults to its id. */
    label?: string
    /** Right-align numbers and money; the header follows. */
    align?: "left" | "center" | "right"
    /** Extra classes for this column's header cell. */
    headerClassName?: string
    /** Extra classes for this column's body and footer cells. */
    cellClassName?: string
  }
}

type RowLabel = { singular: string; plural: string }

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Rendered above the table with the table instance: search, filters, view options, bulk actions. */
  toolbar?: (table: TanstackTable<TData>) => React.ReactNode
  /** A caption for screen readers, e.g. "Invoices". */
  caption?: string
  /** A stable id per row (an invoice number), so selection and expansion survive sorting and edits. */
  getRowId?: (row: TData, index: number) => string
  /** Lets rows be selected; on by default when the columns include selectColumn(). A function decides per row. */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  /** What an expanded row shows under itself; pair it with expandColumn(). */
  renderSubRow?: (row: Row<TData>) => React.ReactNode
  /** Which rows can expand. Defaults to every row when renderSubRow is set. */
  getRowCanExpand?: (row: Row<TData>) => boolean
  /** Starting sort, filters, page size, hidden and pinned columns, selection. */
  initialState?: InitialTableState
  /** Pages of rows with a footer to move between them. Off shows every row. */
  pagination?: boolean
  pageSizeOptions?: number[]
  /** What the pagination footer calls a row: "Showing 1–10 of 48 invoices". */
  rowLabel?: RowLabel
  /** Shows skeleton rows instead of data. */
  loading?: boolean
  /** Shown in place of rows when there are none (or none match the filters); a function gets the table. */
  empty?: React.ReactNode | ((table: TanstackTable<TData>) => React.ReactNode)
  /** Scroll the rows inside a box this tall; the header row sticks to its top. */
  maxHeight?: number | string
  /**
   * Go back to page 1 when the rows change. By default the table does so when the search, filters or
   * sort change, but stays on its page when the data does (an edit, a delete, a status change).
   */
  autoResetPageIndex?: boolean
  /** How the search box (table.setGlobalFilter) matches a row. Defaults to "contains" on text and number columns. */
  globalFilterFn?: FilterFnOption<TData>
  /** Anything else TanStack Table takes (meta, onRowSelectionChange, manual pagination...). */
  options?: Partial<TableOptions<TData>>
  className?: string
}

function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  caption,
  getRowId,
  enableRowSelection,
  renderSubRow,
  getRowCanExpand,
  initialState,
  pagination = true,
  pageSizeOptions = [10, 20, 50],
  rowLabel,
  loading = false,
  empty,
  maxHeight,
  autoResetPageIndex,
  globalFilterFn = "auto",
  options,
  className,
}: DataTableProps<TData, TValue>) {
  "use no memo" // TanStack Table mutates its instance; keep the React Compiler from caching renders.

  // A render with new data skips TanStack's page reset, so editing a row on page 3 stays on page 3.
  const [seenData, setSeenData] = React.useState(data)
  const dataChanged = seenData !== data
  if (dataChanged) setSeenData(data)

  // eslint-disable-next-line react-hooks/incompatible-library -- opted out of the compiler above
  const table = useReactTable<TData>({
    data,
    columns,
    getRowId,
    enableRowSelection: enableRowSelection ?? columns.some((c) => c.id === "select"),
    getRowCanExpand: getRowCanExpand ?? (renderSubRow ? () => true : undefined),
    globalFilterFn,
    autoResetPageIndex: autoResetPageIndex ?? !dataChanged,
    initialState: {
      ...initialState,
      pagination: { pageIndex: 0, pageSize: pageSizeOptions[0] ?? 10, ...initialState?.pagination },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    ...options,
  })

  // After a delete the current page can be past the end: step back to the last page.
  const { pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()
  React.useEffect(() => {
    if (pagination && pageIndex > 0 && pageIndex >= pageCount) table.setPageIndex(Math.max(pageCount - 1, 0))
  }, [pagination, pageIndex, pageCount, table])

  const sticky = maxHeight !== undefined
  const rows = table.getRowModel().rows
  const columnCount = table.getVisibleLeafColumns().length
  const footerGroups = table.getFooterGroups()
  const hasFooter = footerGroups.some((g) => g.headers.some((h) => h.column.columnDef.footer !== undefined))
  const skeletonRows = Math.min(table.getState().pagination.pageSize, 8)

  return (
    <div data-slot="data-table" className={cn("flex min-w-0 flex-col gap-3", className)}>
      {toolbar?.(table)}
      <div
        data-slot="data-table-frame"
        className={cn(
          "@container/data-table overflow-hidden rounded-lg border bg-(--data-table-bg,var(--background))",
          sticky && "*:data-[slot=table-container]:max-h-(--data-table-max-h) *:data-[slot=table-container]:overscroll-x-contain",
        )}
        style={sticky ? ({ "--data-table-max-h": typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight } as React.CSSProperties) : undefined}
      >
        <Table aria-busy={loading || undefined}>
          {caption ? <TableCaption className="sr-only">{caption}</TableCaption> : null}
          <TableHeader className={cn(sticky && "[&_tr]:border-b-0")}>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={ariaSort(header.column)}
                    style={columnStyle(header.column)}
                    className={cn(
                      "px-3 text-muted-foreground first:pl-4 last:pr-4",
                      alignClass(header.column),
                      edgeClasses(header.column, sticky ? "sticky-head" : "head"),
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id} style={columnStyle(column)} className={cn("h-12 px-3 first:pl-4 last:pr-4", edgeClasses(column, "cell"))}>
                      <Skeleton className={cn("h-4", column.id === "select" || column.id === "expand" ? "w-4" : "w-full max-w-32", column.columnDef.meta?.align === "right" && "ml-auto")} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() ? "selected" : undefined} data-expanded={row.getIsExpanded() || undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={columnStyle(cell.column)}
                        className={cn("h-12 px-3 first:pl-4 last:pr-4", alignClass(cell.column), edgeClasses(cell.column, "cell"), cell.column.columnDef.meta?.cellClassName)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubRow && row.getIsExpanded() ? (
                    <TableRow data-slot="data-table-sub-row" className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
                        {/* As wide as the visible frame and held at its left edge, so on a narrow screen the
                            details stay in view while the wide row above scrolls sideways. */}
                        <div className="sticky left-0 w-[100cqw]">{renderSubRow(row)}</div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-40 px-4 text-center whitespace-normal text-muted-foreground">
                  {(typeof empty === "function" ? empty(table) : empty) ?? "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {hasFooter && !loading && rows.length ? (
            <TableFooter>
              {footerGroups.slice(0, 1).map((group) => (
                <TableRow key={group.id} className="hover:bg-transparent">
                  {group.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={columnStyle(header.column)}
                      className={cn("h-11 px-3 first:pl-4 last:pr-4", alignClass(header.column), edgeClasses(header.column, "foot"), header.column.columnDef.meta?.cellClassName)}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          ) : null}
        </Table>
      </div>
      {pagination ? <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} rowLabel={rowLabel} /> : null}
    </div>
  )
}

function ariaSort<TData>(column: Column<TData, unknown>): React.AriaAttributes["aria-sort"] {
  if (!column.getCanSort()) return undefined
  const sorted = column.getIsSorted()
  return sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
}

function alignClass<TData>(column: Column<TData, unknown>) {
  const align = column.columnDef.meta?.align
  return align === "right" ? "text-right" : align === "center" ? "text-center" : undefined
}

/**
 * Pinned columns get a fixed width (the column's `size`, 150px unless set) and their offset, so
 * several can stick side by side. Other columns size to their content.
 */
function columnStyle<TData>(column: Column<TData, unknown>): React.CSSProperties | undefined {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  const size = column.getSize()
  return {
    width: size,
    minWidth: size,
    maxWidth: size,
    ...(pinned === "left" ? { left: column.getStart("left") } : { right: column.getAfter("right") }),
  }
}

/**
 * Sticky header cells and pinned columns need an opaque background (the frame's) and draw their
 * borders as inset shadows, because collapsed table borders do not travel with sticky cells.
 */
function edgeClasses<TData>(column: Column<TData, unknown>, part: "head" | "sticky-head" | "cell" | "foot") {
  const pinned = column.getIsPinned()
  const lastLeft = pinned === "left" && column.getIsLastColumn("left")
  const firstRight = pinned === "right" && column.getIsFirstColumn("right")
  const bg = "bg-(--data-table-bg,var(--background))"
  if (part === "sticky-head") {
    return cn(
      "sticky top-0",
      bg,
      pinned ? "z-30" : "z-20",
      lastLeft ? "shadow-[inset_-1px_-1px_0_var(--border)]" : firstRight ? "shadow-[inset_1px_-1px_0_var(--border)]" : "shadow-[inset_0_-1px_0_var(--border)]",
    )
  }
  if (!pinned) return undefined
  return cn(
    "sticky z-10",
    part === "foot" ? "bg-[color-mix(in_srgb,var(--muted)_50%,var(--data-table-bg,var(--background)))]" : bg,
    part === "cell" &&
      "[tr:hover>&]:bg-[color-mix(in_srgb,var(--muted)_50%,var(--data-table-bg,var(--background)))] [tr[data-state=selected]>&]:bg-muted",
    lastLeft && "shadow-[inset_-1px_0_0_var(--border)]",
    firstRight && "shadow-[inset_1px_0_0_var(--border)]",
  )
}

// ---------------------------------------------------------------------------------------------
// Column helpers: a checkbox column for selection and a chevron column for expandable rows.

/** The row last clicked in each table, and whether shift is down, for shift-click range selection. */
const selectionAnchors = new WeakMap<object, string>()
const shiftHeld = new WeakMap<object, boolean>()

/**
 * A checkbox column: the header checkbox selects every row on the page (and shows a dash when only
 * some are), each row's checkbox selects that row, and shift-click selects the rows in between.
 * (The dash fill is bg-primary! so it also beats the stock checkbox's dark-mode background.)
 */
function selectColumn<TData>({ label }: { label?: (row: Row<TData>) => string } = {}): ColumnDef<TData> {
  return {
    id: "select",
    size: 44,
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: { label: "Select", headerClassName: "w-11 pr-0", cellClassName: "w-11 pr-0" },
    header: ({ table }) => {
      const some = table.getIsSomePageRowsSelected()
      return (
        <span className="relative flex w-fit">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={some}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all rows on this page"
            className="data-indeterminate:border-primary data-indeterminate:bg-primary! data-indeterminate:[&_[data-slot=checkbox-indicator]]:hidden"
          />
          {some ? <MinusIcon aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto size-3 text-primary-foreground" /> : null}
        </span>
      )
    },
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        aria-label={`Select ${label ? label(row) : `row ${row.index + 1}`}`}
        // The change event comes from a hidden input, so read shift from the press itself.
        onPointerDown={(event) => shiftHeld.set(table, event.shiftKey)}
        onKeyDown={(event) => shiftHeld.set(table, event.shiftKey)}
        onCheckedChange={(value) => {
          const anchor = selectionAnchors.get(table)
          const shift = shiftHeld.get(table) ?? false
          selectionAnchors.set(table, row.id)
          shiftHeld.delete(table)
          if (!shift || !anchor || anchor === row.id) return row.toggleSelected(value)
          const pageRows = table.getRowModel().rows
          const a = pageRows.findIndex((r) => r.id === anchor)
          const b = pageRows.findIndex((r) => r.id === row.id)
          if (a === -1) return row.toggleSelected(value)
          const range = pageRows.slice(Math.min(a, b), Math.max(a, b) + 1).filter((r) => r.getCanSelect())
          table.setRowSelection((prev) => {
            const next = { ...prev }
            for (const r of range) {
              if (value) next[r.id] = true
              else delete next[r.id]
            }
            return next
          })
        }}
      />
    ),
  }
}

/**
 * A chevron column for rows that expand (DataTable's renderSubRow). The header button opens or
 * closes every row at once.
 */
function expandColumn<TData>({ label }: { label?: (row: Row<TData>) => string } = {}): ColumnDef<TData> {
  return {
    id: "expand",
    size: 48,
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: { label: "Details", headerClassName: "w-12 pr-0", cellClassName: "w-12 pr-0" },
    header: ({ table }) => {
      const all = table.getIsAllRowsExpanded()
      return (
        <Button
          variant="ghost"
          size="icon-sm"
          className="-ml-1.5 text-muted-foreground"
          onClick={() => table.toggleAllRowsExpanded(!all)}
          aria-label={all ? "Collapse all rows" : "Expand all rows"}
        >
          {all ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
        </Button>
      )
    },
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="icon-sm"
          className="-ml-1.5"
          onClick={row.getToggleExpandedHandler()}
          aria-expanded={row.getIsExpanded()}
          aria-label={`${row.getIsExpanded() ? "Hide" : "Show"} details for ${label ? label(row) : `row ${row.index + 1}`}`}
        >
          {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Button>
      ) : null,
  }
}

export { DataTable, expandColumn, selectColumn }
export type { DataTableProps }
