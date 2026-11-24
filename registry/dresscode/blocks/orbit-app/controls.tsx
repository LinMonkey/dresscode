"use client"

// Form and table helpers the Orbit app screens share: a select from a list, a labeled field, a search
// box, sortable column headers, a pager and a copy-to-clipboard field.
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronLeft, ChevronRight, Copy, Search, X } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { flat } from "./ui"

export type Option = { value: string; label: string }
export const opts = (...labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }))

export function SimpleSelect({
  value,
  onChange,
  options,
  className,
  id,
  label,
  size = "default",
}: {
  value: string
  onChange: (v: string) => void
  options: Option[]
  className?: string
  id?: string
  /** For a select with no visible label. */
  label?: string
  size?: "sm" | "default"
}) {
  return (
    <Select items={options} value={value} onValueChange={(v) => v != null && onChange(String(v))}>
      <SelectTrigger id={id} size={size} aria-label={label} className={cn("bg-[color:var(--card)]", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: string | null
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-[13px] font-medium">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-[color:var(--dc-danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
  label: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 bg-[color:var(--card)] pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-1.5 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export type Sort<K extends string> = { key: K; dir: "asc" | "desc" }

/** A column header that sorts its table: click once for one direction, again for the other. */
export function SortHead<K extends string>({
  label,
  column,
  sort,
  onSort,
  align = "left",
  className,
}: {
  label: string
  column: K
  sort: Sort<K>
  onSort: (s: Sort<K>) => void
  align?: "left" | "right"
  className?: string
}) {
  const active = sort.key === column
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown
  return (
    <TableHead aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={cn(align === "right" && "text-right", className)}>
      <button
        type="button"
        onClick={() => onSort({ key: column, dir: active && sort.dir === "desc" ? "asc" : "desc" })}
        className={cn(
          "-mx-1.5 inline-flex h-7 items-center gap-1 rounded-[calc(var(--radius)-2px)] px-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          active && "text-foreground",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-50")} aria-hidden="true" />
      </button>
    </TableHead>
  )
}

/** Plain header cell in the same small type as the sortable ones. */
export function Head({ children, className }: { children?: ReactNode; className?: string }) {
  return <TableHead className={cn("text-[12px] font-medium text-muted-foreground", className)}>{children}</TableHead>
}

export function Pager({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  noun,
}: {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
  onPageSize?: (n: number) => void
  noun: string
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total ? page * pageSize + 1 : 0
  const to = Math.min(total, (page + 1) * pageSize)
  const numbers = Array.from({ length: pages }, (_, i) => i).filter((i) => pages <= 5 || Math.abs(i - page) <= 1 || i === 0 || i === pages - 1)
  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="dc-num font-medium text-foreground">{from}</span>–<span className="dc-num font-medium text-foreground">{to}</span> of{" "}
        <span className="dc-num font-medium text-foreground">{total}</span> {noun}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {onPageSize ? (
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <SimpleSelect size="sm" label="Rows per page" value={String(pageSize)} onChange={(v) => onPageSize(Number(v))} options={opts("10", "20", "50")} className="w-[72px]" />
          </div>
        ) : null}
        <nav aria-label="Pages" className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={page === 0} onClick={() => onPage(page - 1)}>
            <ChevronLeft />
          </Button>
          {numbers.map((n, i) => (
            <span key={n} className="flex items-center gap-1">
              {i > 0 && n - numbers[i - 1] > 1 ? <span className="px-1">…</span> : null}
              <Button
                variant={n === page ? "secondary" : "ghost"}
                size="icon-sm"
                aria-current={n === page ? "page" : undefined}
                onClick={() => onPage(n)}
                className={cn(flat, "dc-num", n === page && "font-semibold text-foreground")}
              >
                {n + 1}
              </Button>
            </span>
          ))}
          <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}>
            <ChevronRight />
          </Button>
        </nav>
      </div>
    </div>
  )
}

export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-1.5">
      <Input readOnly value={value} aria-label={label} className="h-8 min-w-0 flex-1 bg-muted/60 text-[13px] text-muted-foreground" onFocus={(e) => e.currentTarget.select()} />
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={() => {
          navigator.clipboard?.writeText(value).catch(() => {})
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        }}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

/** A checkbox-and-text row for settings and dialogs. */
export function CheckRow({ children }: { children: ReactNode }) {
  return <label className="flex items-start gap-2.5 text-[14px] leading-snug [&>[data-slot=checkbox]]:mt-0.5">{children}</label>
}
