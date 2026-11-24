// FAQ with a contact card: the heading and a "still have questions" card on the left (it stays in view
// while the questions scroll on wide screens), the accordion on the right. On phones the card comes after
// the heading and before the questions.
import { Clock, Mail } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const FAQS = [
  ["Is Orbit really free for three clients?", "Yes. The Free plan has no time limit and no card on file. You only pay when you add a fourth client or want the Studio features."],
  ["What does it cost to get paid?", "Card payments cost 2.9% + 30¢ and bank transfers 0.8%, capped at $5. Fees are shown on every invoice before you send it, and you can pass them on to the client."],
  ["Will my clients need an account?", "No. They get an email with a link to the invoice and pay in a minute. They can come back to the same link to download receipts."],
  ["Can reminders really sound like me?", "You write the first reminder, or pick a tone, and Orbit keeps that voice for the others. You can read every reminder before it goes out."],
  ["Can I import my clients and old invoices?", "Yes. Import a CSV from your spreadsheet or your old tool, and Orbit keeps the invoice numbers going from where you left off."],
  ["Can I cancel any time?", "Yes. Cancel from settings and you drop to the Free plan at the end of the period. Your invoices stay where they are."],
]

const TEAM = ["AL", "KM", "JS"]

export default function FaqWithContact() {
  return (
    <section aria-labelledby="faq-with-contact-title" className="py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">FAQ</p>
          <h2 id="faq-with-contact-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Questions, answered
          </h2>
          <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-muted-foreground">What people ask before they move their invoicing to Orbit.</p>

          <div className="dc-card mt-8 max-w-[460px] p-6">
            <div className="flex -space-x-2" aria-hidden="true">
              {TEAM.map((p) => (
                <span key={p} className="grid size-10 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--dc-accent)_16%,var(--card))] text-[12px] font-bold ring-2 ring-[color:var(--card)]">
                  {p}
                </span>
              ))}
            </div>
            <h3 className="dc-h mt-4 text-[20px] leading-snug">Still have a question?</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">Ada, Kofi and Jun read every message themselves. No bots, no ticket numbers.</p>
            <p className="mt-3 flex items-center gap-2 text-[14px] text-muted-foreground">
              <Clock className="size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
              Usually a reply within three hours on weekdays
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button className="h-10 px-4 font-semibold" nativeButton={false} render={<a href="#contact" />}>
                <Mail className="size-4" aria-hidden="true" /> Write to us
              </Button>
              <Button variant="outline" className="h-10 px-4 font-semibold" nativeButton={false} render={<a href="#call" />}>
                Book a call
              </Button>
            </div>
          </div>
        </div>

        <Accordion defaultValue={["0"]} className="divide-y divide-border self-start border-y border-border">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={String(i)} className="border-0">
              <AccordionTrigger className="py-5 text-[17px] leading-6 font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:mt-1">{q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
