"use client"

// Folio restyle of shadcn/ui's tabs. Two looks:
//   default (alias "line"): newspaper section tabs. A divider rule under the row; the active tab is press red
//                           with a 2px press underline (a small marker).
//   segmented:              a boxed switch; the active segment is filled ink (a large selected area);
//                           only inactive segments get the hover fill, so the ink one never washes out.
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-[14px] data-horizontal:flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva("group/tabs-list inline-flex items-center text-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col", {
  variants: {
    variant: {
      default: "w-full justify-start gap-[24px] border-b border-divider group-data-vertical/tabs:w-fit group-data-vertical/tabs:gap-0 group-data-vertical/tabs:border-r group-data-vertical/tabs:border-b-0",
      line: "w-full justify-start gap-[24px] border-b border-divider group-data-vertical/tabs:w-fit group-data-vertical/tabs:gap-0 group-data-vertical/tabs:border-r group-data-vertical/tabs:border-b-0",
      segmented: "h-[30px] w-fit border border-input",
    },
  },
  defaultVariants: { variant: "default" },
})

function TabsList({ className, variant = "default", ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), className)} {...props} />
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-[6px] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        // section tabs
        "group-data-[variant=default]/tabs-list:-mb-px group-data-[variant=default]/tabs-list:h-[40px] group-data-[variant=default]/tabs-list:border-b-2 group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:text-[15px] group-data-[variant=default]/tabs-list:hover:text-press group-data-[variant=default]/tabs-list:data-active:border-press group-data-[variant=default]/tabs-list:data-active:font-semibold group-data-[variant=default]/tabs-list:data-active:text-press",
        "group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:h-[40px] group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:text-[15px] group-data-[variant=line]/tabs-list:hover:text-press group-data-[variant=line]/tabs-list:data-active:border-press group-data-[variant=line]/tabs-list:data-active:font-semibold group-data-[variant=line]/tabs-list:data-active:text-press",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:px-[12px] group-data-vertical/tabs:group-data-[variant=default]/tabs-list:-mr-px group-data-vertical/tabs:group-data-[variant=default]/tabs-list:mb-0 group-data-vertical/tabs:group-data-[variant=default]/tabs-list:border-r-2 group-data-vertical/tabs:group-data-[variant=default]/tabs-list:border-b-0",
        // segmented switch
        "group-data-[variant=segmented]/tabs-list:h-full group-data-[variant=segmented]/tabs-list:min-w-[50px] group-data-[variant=segmented]/tabs-list:px-[14px] group-data-[variant=segmented]/tabs-list:text-[13px] group-data-[variant=segmented]/tabs-list:not-data-active:hover:bg-secondary group-data-[variant=segmented]/tabs-list:data-active:bg-primary group-data-[variant=segmented]/tabs-list:data-active:font-semibold group-data-[variant=segmented]/tabs-list:data-active:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("flex-1 text-[15px] outline-none", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger }
