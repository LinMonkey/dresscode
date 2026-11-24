// A changelog: one entry per release, the date and version on the left, what changed on the right.
import { Badge } from "@/components/ui/badge"
import { Timeline, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, TimelineTitle } from "@/registry/dresscode/components/timeline/ui/timeline"

const RELEASES = [
  {
    version: "2.4.0",
    date: "Nov 24, 2026",
    title: "Reminders in your own words",
    changes: [
      { kind: "New", text: "Write the first reminder yourself; the rest keep your tone." },
      { kind: "New", text: "Late fees, applied politely after the date you pick." },
      { kind: "Fixed", text: "Reminders no longer go out on public holidays." },
    ],
  },
  {
    version: "2.3.0",
    date: "Nov 10, 2026",
    title: "Recurring invoices",
    changes: [
      { kind: "New", text: "Retainers that bill themselves every month and stop when the contract ends." },
      { kind: "Improved", text: "The invoice editor remembers your last tax rate per client." },
    ],
  },
  {
    version: "2.2.1",
    date: "Oct 28, 2026",
    title: "Fixes",
    changes: [
      { kind: "Fixed", text: "PDF totals now round the same way as the screen." },
      { kind: "Fixed", text: "Search found archived clients twice." },
    ],
  },
]

const TONE: Record<string, "default" | "secondary" | "outline"> = { New: "default", Improved: "secondary", Fixed: "outline" }

export default function TimelineChangelog() {
  return (
    <Timeline className="w-full max-w-2xl">
      {RELEASES.map((r, i) => (
        <TimelineItem key={r.version} status={i === 0 ? "current" : "done"} className="sm:gap-6">
          <div className="hidden w-28 shrink-0 pt-1 text-right sm:block">
            <p className="text-sm font-medium">{r.date}</p>
            <p className="text-xs text-muted-foreground">v{r.version}</p>
          </div>
          <TimelineSeparator className="sm:left-[calc(9.5rem-0.5px)]!" />
          <TimelineDot />
          <TimelineContent className="pb-2">
            <p className="text-xs text-muted-foreground sm:hidden">
              {r.date} · v{r.version}
            </p>
            <TimelineTitle className="text-base">{r.title}</TimelineTitle>
            <ul className="mt-3 space-y-2">
              {r.changes.map((c) => (
                <li key={c.text} className="flex items-start gap-2 text-sm">
                  <Badge variant={TONE[c.kind]} className="mt-0.5 w-[4.75rem] shrink-0 justify-center">
                    {c.kind}
                  </Badge>
                  <span className="text-muted-foreground">{c.text}</span>
                </li>
              ))}
            </ul>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
