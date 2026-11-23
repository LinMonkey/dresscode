// Folio restyle of shadcn/ui's accordion (Base UI): ruled sections with a Newsreader heading and a chevron that
// turns when open. Same API as the stock component. Use `multiple` and `defaultValue` with every section's
// value to start all open (a settings side panel); use single for FAQs.
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex w-full flex-col", className)} {...props} />
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-hairline last:border-b-0", className)} {...props} />
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-[12px] py-[12px] text-left font-serif text-[21px] leading-[1.15] font-bold tracking-[-0.02em] outline-none hover:text-ink-2 focus-visible:underline data-disabled:pointer-events-none data-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none size-[17px] shrink-0 text-foreground transition-transform group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none" strokeWidth={2.25} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel data-slot="accordion-content" className="overflow-hidden text-[15px] data-open:animate-accordion-down data-closed:animate-accordion-up" {...props}>
      <div className={cn("h-(--accordion-panel-height) pb-[14px] data-ending-style:h-0 data-starting-style:h-0 [&_a]:text-press [&_a]:underline [&_a]:underline-offset-3", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
