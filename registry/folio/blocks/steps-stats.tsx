// "From first draft to paid publication" steps plus the stats band (design image L6).
import { Bold, ChevronDown, Copy, Italic, Link, List } from "lucide-react"

import type { ReactNode } from "react"

import { Container, DoubleRule, SectionHeader } from "./shared"

const card = "mt-auto border border-divider bg-paper px-[16px] pt-[12px] pb-[16px] text-ink"

function WriteCard() {
  return (
    <div className={card}>
      <div className="flex items-center justify-between border-b border-hairline pb-[8px]">
        <span className="font-serif text-[17px] font-bold">New issue</span>
        <span className="bg-ink px-[12px] py-[3px] text-[12px] font-semibold text-paper">Publish</span>
      </div>
      <p className="mt-[14px] font-serif text-[26px] leading-none font-bold tracking-[-0.02em]">The long view</p>
      <div className="mt-[14px] space-y-[7px]">
        <div className="h-[5px] w-full bg-hairline" />
        <div className="h-[5px] w-[92%] bg-hairline" />
        <div className="h-[5px] w-[70%] bg-hairline" />
      </div>
      <div className="mt-[16px] flex items-center gap-[12px] border-t border-hairline pt-[8px] text-[12px]">
        <span className="flex items-center gap-[2px]">
          Paragraph <ChevronDown className="size-[12px]" />
        </span>
        <Bold className="size-[14px]" />
        <Italic className="size-[14px]" />
        <Link className="size-[14px]" />
        <List className="size-[14px]" />
      </div>
    </div>
  )
}

function InviteCard() {
  return (
    <div className={card}>
      <p className="border-b border-hairline pb-[8px] font-serif text-[17px] font-bold">Invite readers</p>
      <p className="mt-[12px] flex items-center justify-between border border-divider px-[10px] py-[6px] text-[13px]">
        sundial.co/your-letter <Copy className="size-[14px]" />
      </p>
      {[
        ["Share sign-up link", true],
        ["Add to your site", false],
        ["Send an invitation", false],
      ].map(([label, on]) => (
        <p key={label as string} className="mt-[10px] flex items-center gap-[10px] text-[14px]">
          <span className={on ? "grid size-[16px] place-items-center bg-press text-[11px] text-paper" : "size-[16px] border border-ink-2"}>{on ? "✓" : ""}</span>
          {label}
        </p>
      ))}
    </div>
  )
}

function PaidCard() {
  return (
    <div className={card}>
      <p className="border-b border-hairline pb-[8px] font-serif text-[17px] font-bold">Subscriptions</p>
      <p className="mt-[14px] flex items-center justify-between border-b border-hairline pb-[12px] text-[14px]">
        Paid subscriptions
        <span className="flex h-[20px] w-[36px] items-center justify-end rounded-full bg-press px-[3px]">
          <span className="size-[14px] rounded-full bg-paper" />
        </span>
      </p>
      <p className="mt-[10px] text-[14px]">Price</p>
      <p className="mt-[6px] flex items-center justify-between border border-divider px-[10px] py-[6px] text-[14px]">
        $8 per month <ChevronDown className="size-[13px]" />
      </p>
    </div>
  )
}

export type Step = { n: string; title: string; body: string; card?: ReactNode }
export type Stat = { value: string; label: string }

const defaultSteps: Step[] = [
  { n: "1", title: "Write your first issue", body: "Start with a draft and turn it into a polished publication in a simple editor.", card: <WriteCard /> },
  { n: "2", title: "Invite your readers", body: "Grow your audience by sharing a sign-up link with your community.", card: <InviteCard /> },
  { n: "3", title: "Turn on paid subscriptions", body: "Offer a paid plan, set your price, and start earning from your writing.", card: <PaidCard /> },
]

const defaultStats: Stat[] = [
  { value: "0%", label: "fees on the Free plan" },
  { value: "52%", label: "average open rate" },
  { value: "2", label: "minutes to import a list" },
  { value: "24h", label: "support reply time" },
]

export function StepsAndStats({
  title = "From first draft to paid publication",
  steps = defaultSteps,
  stats = defaultStats,
  source = "Based on Sundial data, Nov 2026",
}: {
  title?: string
  steps?: Step[]
  stats?: Stat[]
  source?: string
}) {
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[38px] max-w-[620px]" title={title} />
      <ol className="mt-[40px] grid gap-10 md:grid-cols-3 md:gap-[22px] xl:gap-[40px]">
        {steps.map((s) => (
          <li key={s.n} className="flex flex-col">
            <span className="font-serif text-[80px] leading-[0.8] font-medium text-press md:text-[108px]">{s.n}</span>
            <h3 className="mt-[18px] font-serif text-[28px] leading-[1.05] font-bold tracking-[-0.02em] text-ink md:min-h-[68px] md:text-[32px]">{s.title}</h3>
            <p className="mt-[14px] mb-[28px] text-[18px] leading-[1.4] text-ink-2 md:text-[19px]">{s.body}</p>
            {s.card}
          </li>
        ))}
      </ol>
      <DoubleRule className="mt-section-sm md:mt-[150px]" />
      <dl className="grid grid-cols-2 gap-y-10 py-[44px] md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={i % 2 === 1 || i > 0 ? "md:border-l md:border-divider md:pl-[28px]" : ""}>
            <dt className="font-serif text-[64px] leading-none font-bold tracking-[-0.04em] text-ink md:text-[72px] xl:text-[88px]">{s.value}</dt>
            <dd className="mt-[14px] max-w-[160px] text-[20px] leading-[1.3] text-ink-2 md:text-[24px]">{s.label}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[16px] text-ink-2">{source}</p>
      <DoubleRule className="mt-[34px]" />
    </Container>
  )
}
