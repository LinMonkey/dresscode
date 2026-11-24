// Empty state, first run: the invoice list before the first invoice. The list's frame is there (its
// header and columns), so the page already looks like the place invoices will live; inside it, an
// icon, one line on what goes here, the main action and two other ways to start.
import { FileSpreadsheet, FileText, LayoutTemplate, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

const COLUMNS = ["Invoice", "Client", "Due", "Status", "Amount"]
const WAYS = [
  { icon: FileSpreadsheet, title: "Import from a spreadsheet", body: "A CSV from Excel, Google Sheets or the tool you used before.", href: "#import" },
  { icon: LayoutTemplate, title: "Start from a template", body: "Hourly work, a fixed project or a monthly retainer, ready to edit.", href: "#templates" },
]

export default function StatesEmpty() {
  return (
    <section aria-labelledby="states-empty-title" className="min-h-[660px] bg-background py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="states-empty-title" className="dc-h text-[28px] leading-tight sm:text-[32px]">
              Invoices
            </h1>
            <p className="mt-1.5 text-[15px] text-muted-foreground">Everything you send, and where it stands.</p>
          </div>
        </div>

        <div className="dc-card mt-6 overflow-hidden">
          <div className="hidden grid-cols-[1fr_1.4fr_1fr_1fr_1fr] gap-4 border-b border-border px-5 py-3 text-[12px] font-medium text-muted-foreground sm:grid" aria-hidden="true">
            {COLUMNS.map((c, i) => (
              <span key={c} className={i === COLUMNS.length - 1 ? "text-right" : undefined}>
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center px-5 py-14 text-center sm:px-8 sm:py-16">
            <span className="dc-icon size-14">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <h2 className="dc-h mt-5 text-[22px] leading-tight sm:text-[24px]">No invoices yet</h2>
            <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-pretty text-muted-foreground">
              Send your first one and it shows up here, with who has paid, who is late and what Orbit has already reminded them about.
            </p>
            <Button className="mt-6 h-10 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#new-invoice" />}>
              <Plus className="size-4" aria-hidden="true" /> Create your first invoice
            </Button>

            <div className="mt-10 flex w-full max-w-[640px] items-center gap-3 text-[13px] text-muted-foreground">
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              or start another way
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <ul className="mt-5 grid w-full max-w-[640px] gap-3 text-left sm:grid-cols-2">
              {WAYS.map((w) => (
                <li key={w.title} className="flex">
                  <a
                    href={w.href}
                    className="flex w-full items-start gap-3 rounded-[calc(var(--radius)+2px)] border border-border p-4 outline-none transition-colors hover:border-input hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius)] bg-muted text-foreground">
                      <w.icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold">{w.title}</span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">{w.body}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
