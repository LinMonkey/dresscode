// An activity feed: who did what and when, with an icon per kind of event and a way to load more.
import { CreditCard, FileText, Mail, MessageSquare, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
} from "@/registry/dresscode/components/timeline/ui/timeline"

const EVENTS = [
  { icon: CreditCard, who: "Kato & Lee", what: "paid INV-1041", detail: "$1,860.00 by card, 4 days after the reminder.", when: "10 min ago", at: "2026-11-24T09:50" },
  { icon: Mail, who: "Orbit", what: "sent a reminder to Pellucid Health", detail: "INV-1036 is 15 days late. The next one goes out on Friday.", when: "1 hour ago", at: "2026-11-24T09:00" },
  { icon: MessageSquare, who: "Tom Okafor", what: "commented on INV-1042", detail: "“Can we split this into two payments?”", when: "Yesterday", at: "2026-11-23T16:12", initials: "TO" },
  { icon: FileText, who: "Ada Lin", what: "created INV-1043 for Fernwood Studio", detail: "$4,200.00, due Dec 8.", when: "Nov 22", at: "2026-11-22T11:30", initials: "AL" },
  { icon: UserPlus, who: "Maya Lindqvist", what: "joined the workspace as an editor", when: "Nov 21", at: "2026-11-21T08:05", initials: "ML" },
]

export default function TimelineActivity() {
  return (
    <div className="w-full max-w-xl">
      <h2 className="mb-5 text-base font-semibold">Activity</h2>
      <Timeline>
        {EVENTS.map((e) => (
          <TimelineItem key={e.at}>
            <TimelineSeparator />
            <TimelineIndicator>
              {e.initials ? (
                <Avatar className="size-full">
                  <AvatarFallback className="text-[11px]">{e.initials}</AvatarFallback>
                </Avatar>
              ) : (
                <e.icon />
              )}
            </TimelineIndicator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>
                  {e.who} <span className="font-normal text-muted-foreground">{e.what}</span>
                </TimelineTitle>
                <TimelineTime dateTime={e.at}>{e.when}</TimelineTime>
              </TimelineHeader>
              {e.detail ? <TimelineDescription>{e.detail}</TimelineDescription> : null}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Button variant="outline" size="sm" className="mt-6 ml-12">
        Load older activity
      </Button>
    </div>
  )
}
