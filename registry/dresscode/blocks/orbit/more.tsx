// Integrations, FAQ, resources from the blog, the closing call to action and the footer.
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  CreditCard,
  Landmark,
  Mail,
  MessageSquare,
  Sheet as SheetIcon,
  Webhook,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { Container, Logo, onBandOutline, Section, SectionHeading } from "./shared"

const INTEGRATIONS = [
  { icon: CreditCard, name: "Card payments", body: "Visa, Mastercard, Amex and wallets" },
  { icon: Landmark, name: "Bank transfer", body: "Local transfers in 30 currencies" },
  { icon: Calculator, name: "Accounting", body: "Sync invoices and payments" },
  { icon: SheetIcon, name: "Spreadsheets", body: "Export or live-sync to a sheet" },
  { icon: Mail, name: "Email", body: "Send from your own address" },
  { icon: MessageSquare, name: "Team chat", body: "A ping when an invoice is paid" },
  { icon: CalendarDays, name: "Calendar", body: "Due dates on your calendar" },
  { icon: Webhook, name: "Webhooks and API", body: "Build anything on top of Orbit" },
]

export function Integrations() {
  return (
    <Section labelledBy="int-title">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <SectionHeading
          id="int-title"
          align="left"
          kicker="Integrations"
          title="Works with the tools you already pay for"
          body="Connect payments, accounting and your inbox in a couple of clicks. Everything else talks to Orbit through webhooks and a tidy API."
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INTEGRATIONS.map(({ icon: Icon, name, body }) => (
            <li key={name} className="dc-card p-4">
              <span className="dc-icon size-9">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[15px] font-semibold">{name}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

const FAQS = [
  ["Is Orbit really free for three clients?", "Yes. The Free plan has no time limit and no card on file. You only pay when you add a fourth client or want the Studio features."],
  ["What does it cost to get paid?", "Card payments cost 2.9% + 30¢ and bank transfers 0.8%, capped at $5. Fees are shown on every invoice before you send it, and you can pass them on to the client."],
  ["Will my clients need an account?", "No. They get an email with a link to the invoice and pay in a minute. They can come back to the same link to download receipts."],
  ["Can reminders really sound like me?", "You write the first reminder, or pick a tone, and Orbit keeps that voice for the others. You can read every reminder before it goes out."],
  ["Can I import my clients and old invoices?", "Yes. Import a CSV from your spreadsheet or your old tool, and Orbit keeps the invoice numbers going from where you left off."],
  ["Is my data safe?", "Data is encrypted in transit and at rest, sign-in supports two-step codes, and every change is logged. You can export or delete everything at any time."],
  ["Can I cancel any time?", "Yes. Cancel from settings and you drop to the Free plan at the end of the period. Your invoices stay where they are."],
]

export function FAQ() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading id="faq-title" align="left" kicker="FAQ" title="Questions, answered" />
          <div className="dc-card mt-8 p-6">
            <p className="font-semibold">Still wondering about something?</p>
            <p className="mt-1 text-muted-foreground">A person reads every message, usually within a few hours.</p>
            <Button variant="outline" className="mt-4 h-10 px-4 font-semibold">
              Write to us
            </Button>
          </div>
        </div>
        <Accordion defaultValue={["0"]} className="divide-y divide-border border-y border-border">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={String(i)} className="border-0">
              <AccordionTrigger className="py-5 text-left text-[17px] font-semibold hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  )
}

const POSTS = [
  { tag: "Guide", title: "How to write a reminder that gets paid, not ignored", date: "Nov 18, 2026", time: "6 min read" },
  { tag: "Template", title: "A freelance invoice template your accountant will like", date: "Nov 6, 2026", time: "4 min read" },
  { tag: "Story", title: "How Fernwood Studio cut late payments in half", date: "Oct 28, 2026", time: "5 min read" },
]

export function Resources() {
  return (
    <Section labelledBy="blog-title">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="blog-title" align="left" kicker="From the blog" title="Get paid, and get paid sooner" />
          <Button variant="link" className="dc-flat h-auto px-0 text-[15px] font-semibold text-foreground">
            All articles <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <li key={p.title}>
              <a href="#blog" className="dc-card group flex h-full flex-col overflow-hidden">
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex h-40 items-end p-5",
                    i === 0 ? "bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]" : i === 1 ? "bg-muted" : "bg-[color:color-mix(in_oklab,var(--dc-accent)_14%,var(--card))]",
                  )}
                >
                  <BookOpen className="size-8 opacity-70" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[13px] font-semibold text-[color:var(--dc-accent)]">{p.tag}</span>
                  <h3 className="dc-h mt-2 text-[20px] leading-snug group-hover:underline">{p.title}</h3>
                  <p className="mt-auto pt-4 text-[13px] text-muted-foreground">
                    {p.date} · {p.time}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

export function ClosingCTA({ band = false }: { band?: boolean }) {
  return (
    <section aria-labelledby="cta-title" className={cn(band ? "dc-band py-24 sm:py-28" : "py-20 sm:py-28")}>
      <Container className="flex flex-col items-center text-center">
        <h2 id="cta-title" className="dc-h max-w-[720px] text-[36px] leading-[1.06] sm:text-[56px]">
          Start sending invoices today.
        </h2>
        <p className="mt-5 max-w-[520px] text-[17px] text-muted-foreground">Set up in ten minutes. Free for your first three clients, no card needed.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="h-12 px-6 text-[16px] font-semibold">
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" className={`h-12 px-6 text-[16px] font-semibold ${onBandOutline}`}>
            Book a demo
          </Button>
        </div>
      </Container>
    </section>
  )
}

const COLUMNS = [
  { title: "Product", links: ["Invoices", "Reminders", "Payments", "Recurring billing", "Pricing"] },
  { title: "Resources", links: ["Blog", "Invoice templates", "Help center", "API docs"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
]

export function Footer() {
  return (
    <footer className="border-t border-border pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[320px] text-muted-foreground">Invoicing for small studios and freelancers who would rather be doing the work.</p>
            <form className="mt-6 max-w-[380px]" action="#">
              <label htmlFor="footer-email" className="text-[14px] font-semibold">
                A short email each month on getting paid
              </label>
              <div className="mt-2 flex gap-2">
                <Input id="footer-email" type="email" placeholder="you@studio.com" className="h-10 bg-card" />
                <Button type="submit" className="h-10 px-4 font-semibold">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="text-[14px] font-semibold">{c.title}</p>
                <ul className="mt-3 space-y-2.5 text-[14px] text-muted-foreground">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className="hover:text-foreground">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row">
          <p>© 2026 Orbit Labs. All rights reserved.</p>
          <p className="flex gap-5">
            <a href="#top" className="hover:text-foreground">X</a>
            <a href="#top" className="hover:text-foreground">LinkedIn</a>
            <a href="#top" className="hover:text-foreground">YouTube</a>
            <a href="#top" className="hover:text-foreground">Status</a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
