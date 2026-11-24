// FAQ grouped by topic: billing, payments, account and security. A topic list (tabs; the arrow keys move
// between topics) sits beside a card with the chosen topic's questions in an accordion. On phones the
// topics become a grid of buttons above the card.
import { type LucideIcon, Receipt, ShieldCheck, UserRound, Wallet } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TOPICS: { id: string; label: string; icon: LucideIcon; body: string; faqs: [string, string][] }[] = [
  {
    id: "billing",
    label: "Billing",
    icon: Receipt,
    body: "Your plan, when we charge you and changing what you pay.",
    faqs: [
      ["When will I be charged?", "On the day your trial ends, then on the same date each month or year. We email you three days before every charge."],
      ["Can I switch between monthly and yearly?", "Yes, from Settings. Moving to yearly takes effect straight away and we credit what is left of the month."],
      ["Do you give refunds?", "If you forget to cancel a yearly plan, write to us within 14 days of the renewal and we refund it in full."],
      ["Do I get invoices for my own books?", "Every charge comes with a PDF invoice showing your company details and tax number. They all live under Settings, Billing."],
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: Wallet,
    body: "How your clients pay you and when the money arrives.",
    faqs: [
      ["Which payment methods can my clients use?", "Card, Apple Pay, Google Pay and bank transfer. Turn each one on or off for every invoice."],
      ["What are the fees?", "Cards cost 2.9% + 30¢ and bank transfers 0.8%, capped at $5. There is no monthly fee for taking payments."],
      ["When does the money reach my bank?", "Card payments land in two working days. Bank transfers arrive as soon as your client's bank sends them."],
      ["Can a client pay in parts?", "Yes. Turn on payment plans and a client can split an invoice into up to four payments. Orbit chases each one."],
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: UserRound,
    body: "Your team, your accountant and the businesses you run.",
    faqs: [
      ["Can I add someone from my team?", "Studio includes two seats and Agency five. Each person signs in with their own email and sees only what their role allows."],
      ["Can my accountant see my invoices?", "Invite them for free as a read-only member. They can export everything but can't send or change anything."],
      ["Can I run two businesses from one account?", "On Agency, yes. Each brand keeps its own logo, invoice numbers and bank details."],
      ["How do I close my account?", "From Settings. Export your data first: we delete everything 30 days after you close the account."],
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
    body: "Where your data lives and who can see it.",
    faqs: [
      ["Where is my data stored?", "In data centers in the EU or the US, encrypted in transit and at rest. You pick the region when you sign up."],
      ["Do you support two-step sign-in?", "Yes, with an authenticator app or a passkey. Agency owners can make it required for everyone."],
      ["Who at Orbit can see my invoices?", "Nobody, unless you ask support to look at something. Every access is logged, and you can read the log in Settings."],
      ["What if someone signs in from a new device?", "We email you straight away with the device and where it is, and one click signs it out."],
    ],
  },
]

export default function FaqCategories() {
  return (
    <section aria-labelledby="faq-categories-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Help center</p>
          <h2 id="faq-categories-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Find an answer by topic
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">Pick a topic to see the questions people ask about it most.</p>
        </div>

        <Tabs defaultValue="billing" className="mt-10 flex-col gap-8 sm:mt-12 lg:grid lg:grid-cols-[260px_1fr] lg:gap-14">
          <TabsList
            aria-label="Topics"
            className="grid h-auto w-full grid-cols-2 gap-2 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:grid-cols-4 lg:flex lg:flex-col lg:items-stretch lg:self-start"
          >
            {TOPICS.map(({ id, label, icon: Icon, faqs }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="h-11 w-full flex-none justify-start gap-2.5 rounded-[var(--radius)] border border-border px-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground data-active:border-transparent data-active:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] data-active:text-[color:var(--dc-accent)] data-active:hover:bg-[color:color-mix(in_oklab,var(--dc-accent)_12%,transparent)] data-active:hover:text-[color:var(--dc-accent)] dark:text-muted-foreground dark:hover:text-foreground dark:data-active:border-transparent dark:data-active:bg-[color:color-mix(in_oklab,var(--dc-accent)_16%,transparent)] dark:data-active:text-[color:var(--dc-accent)] dark:data-active:hover:bg-[color:color-mix(in_oklab,var(--dc-accent)_16%,transparent)] dark:data-active:hover:text-[color:var(--dc-accent)] lg:border-transparent"
              >
                <Icon className="size-[18px]" aria-hidden="true" />
                {label}
                <span aria-hidden="true" className="dc-num ml-auto text-[12px] font-medium opacity-70">
                  {faqs.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TOPICS.map(({ id, label, body, faqs }) => (
            <TabsContent key={id} value={id} className="dc-card min-w-0 px-5 pt-6 pb-2 focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-8 sm:pt-8">
              <h3 className="dc-h text-[24px] leading-tight">{label}</h3>
              <p className="mt-1.5 text-[16px] text-muted-foreground">{body}</p>
              <Accordion defaultValue={[`${id}-0`]} className="mt-4 divide-y divide-border">
                {faqs.map(([q, a], i) => (
                  <AccordionItem key={q} value={`${id}-${i}`} className="border-0">
                    <AccordionTrigger className="py-5 text-[17px] leading-6 font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:mt-1">{q}</AccordionTrigger>
                    <AccordionContent className="pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
