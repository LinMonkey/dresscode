// FAQ, two columns: every question and its answer visible at once, no clicking. Good for short answers.
// The heading sits left with a link to the help center on the right; the questions run in two columns on
// wider screens and one on phones, as a description list.
import { ArrowRight } from "lucide-react"

const FAQS = [
  ["How long does it take to set up?", "About ten minutes. Add your logo and bank details, import your clients from a CSV, and the first invoice is ready to send."],
  ["Do my clients need an account?", "No. They get an email with a link, see the invoice in their browser and pay in a minute, on any device."],
  ["How can clients pay?", "By card, Apple Pay, Google Pay or bank transfer. You choose which methods appear on each invoice."],
  ["When does the money reach my bank?", "Card payments land in two working days. Bank transfers arrive as soon as your client's bank sends them."],
  ["Can I bill in other currencies?", "Yes. Studio covers five currencies and Agency thirty. Orbit shows the rate it used on every payment."],
  ["Does Orbit handle tax?", "Set a tax rate per client or per line, and Orbit adds it and keeps a tax report you can export at the end of the quarter."],
  ["Can my accountant get access?", "Invite them for free. They can read and export everything but can't send invoices or change your settings."],
  ["What happens if I leave?", "Export every invoice and payment as CSV and PDF. We delete your data 30 days after you close the account."],
]

export default function FaqTwoColumn() {
  return (
    <section aria-labelledby="faq-two-column-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-[560px]">
            <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Good to know</p>
            <h2 id="faq-two-column-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">Short answers to what freelancers and studios ask us most. Everything else is in the help center.</p>
          </div>
          <a
            href="#help"
            className="inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold outline-none hover:text-[color:var(--dc-accent)] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Visit the help center <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <dl className="mt-12 grid gap-x-14 md:grid-cols-2">
          {FAQS.map(([q, a]) => (
            <div key={q} className="border-t border-border py-7">
              <dt className="text-[17px] font-semibold">{q}</dt>
              <dd className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
