"use client"

// Use cases: one tab each for freelancers, studios and agencies, with what Orbit does for them.
import { Check } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Container, Section, SectionHeading } from "./shared"

const CASES = [
  {
    id: "freelancers",
    label: "Freelancers",
    title: "Stop being your own accounts department",
    body: "Send the invoice from your phone when the job is done, and let Orbit do the chasing while you start the next one.",
    points: ["Invoices in a minute, even on your phone", "Reminders that keep the client relationship warm", "A tax-ready export every quarter"],
    stat: { value: "9 days", label: "average time to get paid for freelancers on Orbit" },
  },
  {
    id: "studios",
    label: "Studios",
    title: "One place for every client and retainer",
    body: "Recurring invoices bill your retainers, the forecast shows the month ahead, and everyone on the team sees the same numbers.",
    points: ["Recurring invoices for retainers", "Roles for partners and your bookkeeper", "A forecast you can plan hiring on"],
    stat: { value: "$18,450", label: "expected next month, in one glance" },
  },
  {
    id: "agencies",
    label: "Agencies",
    title: "Bill many clients in many currencies",
    body: "Separate brands, currencies and payment terms per client, with approvals before anything goes out.",
    points: ["Multiple brands and invoice designs", "30 currencies with local payment methods", "Approvals and an audit log"],
    stat: { value: "30", label: "currencies, paid out in yours" },
  },
]

export function UseCases() {
  return (
    <Section labelledBy="cases-title">
      <Container>
        <SectionHeading id="cases-title" kicker="Who it is for" title="Built for people who bill for their time" />
        <Tabs defaultValue="studios" className="mt-12 items-center">
          <TabsList className="h-11! p-1">
            {CASES.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="h-full px-4 text-[15px]">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {CASES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-8 w-full">
              <div className="dc-card grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div>
                  <h3 className="dc-h text-[26px] leading-tight sm:text-[32px]">{c.title}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{c.body}</p>
                  <ul className="mt-6 space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <Check className="mt-0.5 size-5 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--dc-radius-card)] bg-[color:var(--dc-highlight)] p-8 text-[color:var(--dc-highlight-fg)]">
                  <p className="dc-h dc-num text-[48px] leading-none">{c.stat.value}</p>
                  <p className="mt-3 text-[16px] opacity-85">{c.stat.label}</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </Section>
  )
}
