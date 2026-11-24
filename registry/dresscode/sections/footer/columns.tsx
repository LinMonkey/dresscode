// Footer with link columns, ported from the Orbit template: the logo and a line on the left, four
// columns of links on the right, and a bar underneath with the copyright and the social links. Each
// column title names its list (aria-labelledby), so a screen reader hears "Product, list, 5 items".
import { cn } from "@/lib/utils"

const COLUMNS = [
  { title: "Product", links: ["Invoices", "Reminders", "Payments", "Recurring billing", "Pricing"] },
  { title: "Resources", links: ["Blog", "Invoice templates", "Help center", "API docs"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
]

const SOCIAL = ["X", "LinkedIn", "YouTube", "Status"]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[19px] font-bold tracking-[-0.02em]", className)}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

const link = "rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

export default function FooterColumns() {
  return (
    <footer className="border-t border-border pt-16 pb-10">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <a href="#top" aria-label="Orbit home" className={cn(link, "inline-flex")}>
              <Logo />
            </a>
            <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
              Invoicing for small studios and freelancers who would rather be doing the work.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p id={`footer-columns-${slug(c.title)}`} className="text-[14px] font-semibold">
                  {c.title}
                </p>
                <ul aria-labelledby={`footer-columns-${slug(c.title)}`} className="mt-3 space-y-2.5 text-[14px] text-muted-foreground">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href={`#${slug(l)}`} className={link}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 Orbit Labs. All rights reserved.</p>
          <ul aria-label="Social and status" className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL.map((s) => (
              <li key={s}>
                <a href={`#${slug(s)}`} className={link}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
