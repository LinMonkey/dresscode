// Steps, numbered cards: how it works in three steps, each in a card with its number, a short title and
// one line of help, then the action that starts step one. From the Orbit landing template.
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const STEPS = [
  { title: "Add your clients", body: "Import a CSV or type them in. Orbit remembers addresses, currencies and tax." },
  { title: "Send the first invoice", body: "Use your logo and terms once; every invoice after that takes a minute." },
  { title: "Let Orbit follow up", body: "Pick a reminder plan. Orbit chases, records the payment and sends the receipt." },
]

export default function StepsNumbered() {
  return (
    <section aria-labelledby="steps-numbered-title" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-sm font-semibold text-[color:var(--dc-accent)]">How it works</p>
          <h2 id="steps-numbered-title" className="dc-h mt-3 text-[32px] leading-[1.1] sm:text-[42px]">
            Set up in ten minutes, paid sooner every month
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Three steps from a list of clients to money in the bank. You do the first two once.
          </p>
        </div>
        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="dc-card p-6">
              <span className="dc-num grid size-9 place-items-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              <h3 className="dc-h mt-5 text-[21px]">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-11 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#start" />}>
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <p className="text-[14px] text-muted-foreground">Free for your first three clients. No card needed.</p>
        </div>
      </div>
    </section>
  )
}
