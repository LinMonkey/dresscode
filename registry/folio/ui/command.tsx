"use client"

// Folio restyle of shadcn/ui's command (cmdk). Same API as the stock component.
// A paper sheet with a ruled search field, sentence-case group headings in ink-2, and the highlighted row
// in press tint (like the sidebar's current page). Shortcuts are small ruled key caps: <CommandShortcut keys={["G", "H"]} />.
// In a dialog: <CommandDialog open onOpenChange><Command><CommandInput />…</Command></CommandDialog>.
// For the app-wide ⌘K palette use the CommandMenu block, which wires this to the keyboard and the nav.
import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "cn"
import { SearchIcon } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/registry/folio/ui/dialog"

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive data-slot="command" className={cn("flex size-full flex-col overflow-hidden bg-popover text-popover-foreground", className)} {...props} />
}

function CommandDialog({
  title = "Command menu",
  description = "Search for a page, an action or a post",
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & { title?: string; description?: string; className?: string; children: React.ReactNode }) {
  return (
    <Dialog {...props}>
      <DialogContent showCloseButton={false} className={cn("top-[14%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-[520px]", className)}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({ className, hint, ...props }: React.ComponentProps<typeof CommandPrimitive.Input> & { hint?: React.ReactNode }) {
  return (
    <div data-slot="command-input-wrapper" className="p-[10px] pb-[8px]">
      <div className="flex h-[38px] items-center gap-[10px] rounded-(--radius) border border-input px-[12px] focus-within:border-foreground">
        <SearchIcon className="size-[17px] shrink-0 text-ink-2" strokeWidth={2} />
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn("h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)}
          {...props}
        />
        {hint}
      </div>
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[min(540px,66vh)] scroll-py-[6px] overflow-x-hidden overflow-y-auto overscroll-contain outline-none", className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn("px-[16px] py-[28px] text-center text-[14.5px] text-ink-2", className)} {...props} />
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden px-[8px] pb-[6px] text-foreground **:[[cmdk-group-heading]]:px-[8px] **:[[cmdk-group-heading]]:pt-[8px] **:[[cmdk-group-heading]]:pb-[4px] **:[[cmdk-group-heading]]:text-[13px] **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-ink-2",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("mx-[16px] h-px bg-hairline", className)} {...props} />
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex h-[32px] cursor-pointer items-center gap-[12px] rounded-(--radius) px-[8px] text-[14.5px] outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-press-tint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[17px] data-selected:[&_svg]:text-press",
        className
      )}
      {...props}
    />
  )
}

/** Key caps on the right of an item, e.g. keys={["G", "H"]} or keys={["Ctrl", "K"]}. */
function CommandShortcut({ className, keys, children, ...props }: React.ComponentProps<"span"> & { keys?: string[] }) {
  return (
    <span data-slot="command-shortcut" className={cn("ml-auto flex items-center gap-[4px] text-[12px] text-ink-2", className)} {...props}>
      {keys
        ? keys.map((k, i) => (
            <kbd key={i} className="inline-grid h-[20px] min-w-[20px] place-items-center rounded-(--radius) border border-hairline bg-background px-[5px] font-sans text-[11.5px] font-semibold text-foreground">
              {k}
            </kbd>
          ))
        : children}
    </span>
  )
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut }
