// A horizontal roadmap: milestones left to right, scrolling sideways on narrow screens.
import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
} from "@/registry/dresscode/components/timeline/ui/timeline"

const MILESTONES = [
  { quarter: "Q1 2026", title: "Invoices", note: "Send, track and get paid by card.", status: "done" },
  { quarter: "Q2 2026", title: "Reminders", note: "Automatic follow-ups in your tone.", status: "done" },
  { quarter: "Q3 2026", title: "Recurring billing", note: "Retainers that bill themselves.", status: "done" },
  { quarter: "Q4 2026", title: "Multi-currency", note: "Bill in 30 currencies.", status: "current" },
  { quarter: "Q1 2027", title: "Accounting sync", note: "Two-way sync with your books.", status: "upcoming" },
] as const

export default function TimelineMilestones() {
  return (
    <section aria-labelledby="roadmap" className="w-full max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id="roadmap" className="text-base font-semibold">
          Roadmap
        </h2>
        <Badge variant="secondary">Updated Nov 24</Badge>
      </div>
      <Timeline orientation="horizontal">
        {MILESTONES.map((m, i) => (
          <TimelineItem key={m.title} status={m.status}>
            <TimelineSeparator />
            <TimelineIndicator>{i + 1}</TimelineIndicator>
            <TimelineContent className="pt-0">
              <TimelineTime>{m.quarter}</TimelineTime>
              <TimelineTitle className="mt-0.5">{m.title}</TimelineTitle>
              <TimelineDescription>{m.note}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  )
}
