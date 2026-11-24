// Order tracking: steps that are done, the one in progress, and what is still to come.
import { Check, Home, Package, PackageCheck, Truck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

const STEPS = [
  { icon: PackageCheck, title: "Order placed", note: "Payment confirmed.", time: "Nov 21, 09:14", status: "done" },
  { icon: Package, title: "Packed", note: "Two boxes, 3.4 kg.", time: "Nov 22, 16:40", status: "done" },
  { icon: Truck, title: "In transit", note: "Left the Leeds depot. Next stop: Manchester.", time: "Nov 24, 07:02", status: "current" },
  { icon: Truck, title: "Out for delivery", note: "Expected Nov 25, 9:00 to 13:00.", status: "upcoming" },
  { icon: Home, title: "Delivered", status: "upcoming" },
] as const

export default function TimelineOrderTracking() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Order #48213</CardTitle>
        <CardDescription>Arriving tomorrow, Nov 25</CardDescription>
        <Progress value={58} aria-label="Delivery progress" className="mt-3" />
      </CardHeader>
      <CardContent>
        <Timeline>
          {STEPS.map((s) => (
            <TimelineItem key={s.title} status={s.status}>
              <TimelineSeparator />
              <TimelineIndicator>{s.status === "done" ? <Check /> : <s.icon />}</TimelineIndicator>
              <TimelineContent>
                <TimelineHeader className="justify-between">
                  <TimelineTitle>{s.title}</TimelineTitle>
                  {"time" in s ? <TimelineTime>{s.time}</TimelineTime> : null}
                </TimelineHeader>
                {"note" in s ? <TimelineDescription>{s.note}</TimelineDescription> : null}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}
