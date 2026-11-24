// FAQ, accordion: a centered heading over the questions, each one its own card that opens in place. One
// answer is open at a time and the first starts open, so the section never looks empty.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQS = [
  ["Is Orbit really free for three clients?", "Yes. The Free plan has no time limit and no card on file. You only pay when you add a fourth client or want the Studio features."],
  ["What does it cost to get paid?", "Card payments cost 2.9% + 30¢ and bank transfers 0.8%, capped at $5. Fees are shown on every invoice before you send it, and you can pass them on to the client."],
  ["Will my clients need an account?", "No. They get an email with a link to the invoice and pay in a minute. They can come back to the same link to download receipts."],
  ["Can reminders really sound like me?", "You write the first reminder, or pick a tone, and Orbit keeps that voice for the others. You can read every reminder before it goes out."],
  ["Can I import my clients and old invoices?", "Yes. Import a CSV from your spreadsheet or your old tool, and Orbit keeps the invoice numbers going from where you left off."],
  ["Is my data safe?", "Data is encrypted in transit and at rest, sign-in supports two-step codes, and every change is logged. You can export or delete everything at any time."],
  ["Can I cancel any time?", "Yes. Cancel from settings and you drop to the Free plan at the end of the period. Your invoices stay where they are."],
]

const link = "rounded-sm font-semibold text-foreground underline underline-offset-4 outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50"

export default function FaqAccordion() {
  return (
    <section aria-labelledby="faq-accordion-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">FAQ</p>
          <h2 id="faq-accordion-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Questions, answered
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">The things people ask most before they send their first invoice with Orbit.</p>
        </div>

        <Accordion defaultValue={["0"]} className="mx-auto mt-12 max-w-[780px] gap-3">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={String(i)} className="dc-card px-5 not-last:border-b-[length:var(--dc-bw)] sm:px-6">
              <AccordionTrigger className="py-5 text-[17px] leading-6 font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:mt-1">{q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-10 text-center text-[15px] text-muted-foreground">
          Still unsure? Browse the{" "}
          <a href="#help" className={link}>
            help center
          </a>{" "}
          or{" "}
          <a href="#contact" className={link}>
            write to us
          </a>
          .
        </p>
      </div>
    </section>
  )
}
