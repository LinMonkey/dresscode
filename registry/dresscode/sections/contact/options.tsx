// Support channels: chat, email, the help center and sales in four cards of equal height, each with what
// it is for, how fast it answers, when it is open and an action; the parts line up from card to card. A line under the cards gives the
// service's status.
import { ArrowRight, BookOpen, Briefcase, Clock, Mail, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "Live chat",
    body: "Quick questions about an invoice, a reminder or your account.",
    speed: "Replies in about 5 minutes",
    hours: "Weekdays, 8:00 to 20:00 CET",
    action: { label: "Start a chat", href: "#chat" },
    fastest: true,
  },
  {
    icon: Mail,
    title: "Email",
    body: "Anything that needs a screenshot, a file or a longer answer.",
    speed: "Replies within 4 hours",
    hours: "Every day, weekends a little slower",
    action: { label: "Write to us", href: "mailto:help@orbit.app" },
  },
  {
    icon: BookOpen,
    title: "Help center",
    body: "Guides for setup, payments, taxes and exports, with screenshots.",
    speed: "Answers right away",
    hours: "180 guides, updated weekly",
    action: { label: "Browse guides", href: "#help" },
  },
  {
    icon: Briefcase,
    title: "Sales",
    body: "Teams of ten or more, custom terms or moving over from another tool.",
    speed: "Replies within one business day",
    hours: "Weekdays, 9:00 to 17:00 ET",
    action: { label: "Talk to sales", href: "#sales" },
  },
]

export default function ContactOptions() {
  return (
    <section aria-labelledby="contact-options-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">Support</p>
          <h2 id="contact-options-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            How can we help?
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Pick the way that suits the question. The same small team answers all of them.
          </p>
        </div>

        {/* Each card spans four rows of the list's grid (subgrid), so the dividers, the reply times and the
            buttons line up across a row of cards whatever the copy's length. */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, title, body, speed, hours, action, fastest }) => (
            <li key={title} className="dc-card row-span-4 grid grid-rows-subgrid p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="dc-icon size-11">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {fastest ? <span className="dc-pill dc-pill-hl">Fastest</span> : null}
              </div>
              <div className="pt-1">
                <h3 className="dc-h text-[20px]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
              <div className="mt-2 border-t border-border pt-4 text-[14px]">
                <p className="flex items-start gap-2 font-semibold">
                  <Clock className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                  {speed}
                </p>
                <p className="mt-1 pl-6 text-muted-foreground">{hours}</p>
              </div>
              <Button
                variant={fastest ? "default" : "outline"}
                size="lg"
                className="mt-1 h-10 w-full self-end font-semibold"
                nativeButton={false}
                render={<a href={action.href} />}
              >
                {action.label} <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[14px] text-muted-foreground">
          <span className="dc-pill dc-pill-hl">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            All systems normal
          </span>
          <span>Payments, reminders and sign-in are running.</span>
          <a href="#status" className="rounded-sm font-semibold text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
            See the status page
          </a>
        </p>
      </div>
    </section>
  )
}
