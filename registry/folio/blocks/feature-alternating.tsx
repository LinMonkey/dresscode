// Two feature rows that alternate text and product UI (design image L4).
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Container } from "./shared"

function MockSidebar({ active }: { active: string }) {
  return (
    <aside className="hidden w-[94px] shrink-0 border-r border-hairline bg-newsprint pt-[12px] text-[12.5px] sm:block">
      <p className="px-[12px] font-serif text-[20px] leading-none font-bold tracking-[-0.03em]">Sundial</p>
      <ul className="mt-[26px] space-y-[14px]">
        {["Compose", "Posts", "Subscribers", "Analytics", "Settings"].map((n) => (
          <li key={n} className={cn("px-[12px]", n === active && "border-l-2 border-press bg-press-tint py-[4px] pl-[10px]")}>
            {n}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function AnalyticsMock() {
  return (
    <div className="flex border border-divider bg-paper text-ink">
      <MockSidebar active="Analytics" />
      <div className="min-w-0 flex-1 px-[18px] pt-[18px] pb-[14px]">
        <p className="border-b border-divider pb-[10px] font-serif text-[22px] font-bold tracking-[-0.02em]">Subscriber analytics</p>
        <div className="mt-[14px] grid grid-cols-2 gap-[10px]">
          {[
            ["Total subscribers", "12,480"],
            ["Paid subscribers", "618"],
          ].map(([k, v]) => (
            <div key={k} className="border border-hairline px-[12px] py-[10px]">
              <p className="text-[12px] text-ink-2">{k}</p>
              <p className="mt-[4px] font-serif text-[30px] leading-none font-bold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-[10px] border border-hairline px-[12px] py-[10px]">
          <p className="text-[13px] font-semibold">Subscriber growth</p>
          <svg viewBox="0 0 300 90" className="mt-[6px] h-[90px] w-full" preserveAspectRatio="none" aria-hidden>
            {[18, 36, 54, 72].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} className="stroke-hairline" strokeWidth="1" />
            ))}
            <path d="M0 86 L20 80 L40 78 L60 72 L80 70 L100 63 L120 60 L140 55 L160 54 L180 48 L200 46 L220 40 L240 32 L260 28 L280 18 L300 6 L300 90 L0 90Z" className="fill-press-tint" />
            <path d="M0 86 L20 80 L40 78 L60 72 L80 70 L100 63 L120 60 L140 55 L160 54 L180 48 L200 46 L220 40 L240 32 L260 28 L280 18 L300 6" className="fill-none stroke-press" strokeWidth="2" />
          </svg>
        </div>
        <p className="mt-[14px] border-t border-divider pt-[10px] text-[13px] font-semibold">Top sources</p>
        <ul className="mt-[6px] text-[13px]">
          {["Direct", "Search", "Recommendations"].map((s) => (
            <li key={s} className="flex items-center gap-[10px] border-b border-hairline py-[6px] last:border-0">
              <span className="size-[10px] bg-divider" />
              <span className="flex-1">{s}</span>
              <ArrowRight className="size-[13px]" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function PaidPlansMock() {
  return (
    <div className="border border-divider bg-newsprint px-[18px] pt-[16px] pb-[20px] text-ink">
      <p className="border-b border-divider pb-[10px] font-serif text-[22px] font-bold tracking-[-0.02em]">Sundial</p>
      <p className="mt-[16px] font-serif text-[22px] font-bold">Pricing</p>
      <p className="mt-[4px] text-[14px] text-ink-2">Choose a plan for your publication. Change anytime.</p>
      <div className="mt-[16px] flex items-center gap-[12px]">
        <div className="grid flex-1 grid-cols-2 border border-ink-2 text-center text-[14px]">
          <span className="py-[6px]">Monthly</span>
          <span className="bg-press py-[6px] font-semibold text-paper">Yearly</span>
        </div>
        <span className="bg-hairline px-[8px] py-[3px] text-[12px]">Save 20%</span>
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[12px]">
        {[
          { name: "Starter", body: "Everything you need to publish and earn from readers.", price: "$8", on: false },
          { name: "Pro", body: "Built for growing publications with deeper insights.", price: "$16", on: true },
        ].map((p) => (
          <div key={p.name} className={cn("border bg-paper px-[12px] py-[12px]", p.on ? "border-press" : "border-hairline")}>
            <div className="flex items-center justify-between">
              <p className="font-serif text-[18px] font-bold">{p.name}</p>
              <span className={cn("grid size-[15px] place-items-center rounded-full border", p.on ? "border-press" : "border-ink-2")}>
                {p.on && <span className="size-[7px] rounded-full bg-press" />}
              </span>
            </div>
            <p className="mt-[6px] text-[12.5px] leading-[1.35] text-ink-2">{p.body}</p>
            <p className="mt-[10px]">
              <span className="font-serif text-[22px] font-bold">{p.price}</span>
              <span className="text-[13px] text-ink-2"> / month</span>
            </p>
            <p className="text-[12px] text-ink-2">Billed annually</p>
          </div>
        ))}
      </div>
      <div className="mt-[16px] flex items-center justify-between border-t border-divider pt-[12px]">
        <div>
          <p className="text-[14px] font-semibold">Start with a free trial</p>
          <p className="text-[12.5px] text-ink-2">Try any plan free for 14 days.</p>
        </div>
        <span className="flex h-[20px] w-[36px] items-center justify-end rounded-full bg-press px-[3px]">
          <span className="size-[14px] rounded-full bg-paper" />
        </span>
      </div>
    </div>
  )
}

export type FeatureRow = { title: string; body: string[]; link?: string; visual: ReactNode }

const defaultRows: FeatureRow[] = [
  {
    title: "Grow without guesswork",
    body: [
      "Understand what’s working, where readers come from, and how to turn more of them into paying subscribers.",
      "Clear, practical insights that help you grow a sustainable publication.",
    ],
    link: "Learn more",
    visual: <AnalyticsMock />,
  },
  {
    title: "Get paid by readers",
    body: [
      "Offer a paid subscription, set a price that works for you, and keep more of what you earn.",
      "Flexible plans and a free trial make it easy to get started.",
    ],
    link: "Learn more",
    visual: <PaidPlansMock />,
  },
]

export function FeatureAlternating({ rows = defaultRows }: { rows?: FeatureRow[] }) {
  return (
    <Container className="space-y-20 md:space-y-[150px]">
      {rows.map((row, i) => (
        <div key={row.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-[22px] xl:gap-[60px]">
          <div className={cn(i % 2 === 1 && "md:order-2 md:pl-[10px]")}>
            <h3 className="font-serif text-[40px] leading-[1] font-bold tracking-[-0.03em] text-ink md:text-[56px] md:leading-[0.97]">{row.title}</h3>
            {row.body.map((p) => (
              <p key={p} className="mt-[20px] max-w-[420px] text-[18px] leading-[1.35] text-ink-2 md:mt-[24px] md:text-[21px]">
                {p}
              </p>
            ))}
            {row.link && (
              <a href="#" className="mt-[24px] inline-flex items-center gap-[6px] border-b-2 border-press pb-[2px] text-[20px] text-press">
                {row.link} <ArrowRight className="size-[18px]" />
              </a>
            )}
          </div>
          <div className={cn(i % 2 === 1 && "md:order-1")}>{row.visual}</div>
        </div>
      ))}
    </Container>
  )
}
