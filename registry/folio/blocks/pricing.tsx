// Three-plan pricing (design image L9) and the plan comparison table (design image L10).
// Button rule (review fix #1): every plan button is ink or outline; press red only marks the recommended plan.
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonClass, Container, DoubleRule, SectionHeader } from "./shared"

export type Plan = { name: string; price: string; period?: string; body: string; features: string[]; cta: string; featured?: boolean }

const defaultPlans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    body: "Start writing and build an audience at no cost.",
    features: ["Publish a newsletter", "Up to 1,000 subscribers", "Basic analytics", "Standard templates", "Email support", "No credit card required"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    body: "Grow a paid audience and get more from your newsletter.",
    features: ["Everything in Free", "Paid subscriptions", "Advanced analytics", "Custom domain", "Subscriber segmentation", "Priority support"],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Publication",
    price: "$49",
    period: "/ month",
    body: "A complete platform for serious independent publications.",
    features: ["Everything in Pro", "Multiple team members", "Collaborator roles and permissions", "Multiple newsletters", "Advanced audience tools", "Dedicated support"],
    cta: "Start Publication",
  },
]

export function PricingPlans({ title = "Simple pricing for every stage", plans = defaultPlans }: { title?: string; plans?: Plan[] }) {
  return (
    <Container>
      <DoubleRule />
      <SectionHeader className="mt-[42px]" title={title} align="center" />
      <div className="mt-[30px] flex justify-center">
        <div className="inline-flex border border-ink-2 text-[16px] md:text-[20px]" role="tablist" aria-label="Billing period">
          <button className="h-[44px] px-[20px] text-ink md:px-[34px]" role="tab" aria-selected="false">
            Monthly
          </button>
          <button className="flex h-[44px] items-center gap-[10px] bg-press px-[18px] font-semibold whitespace-nowrap text-paper md:gap-[16px] md:px-[28px]" role="tab" aria-selected="true">
            Yearly <span className="h-[22px] w-px bg-paper/50" /> <span className="font-normal">2 months free</span>
          </button>
        </div>
      </div>
      <div className="mt-[50px] grid gap-[24px] md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={cn("flex flex-col border px-[28px] pt-[26px] pb-[30px]", p.featured ? "border-press bg-newsprint" : "border-divider bg-paper")}>
            <div className="flex items-start justify-between">
              <p className="font-serif text-[44px] leading-none font-bold tracking-[-0.03em] text-ink">{p.name}</p>
              {p.featured && <span className="bg-press px-[12px] py-[6px] text-[16px] font-semibold text-paper">Most popular</span>}
            </div>
            <p className="mt-[20px] text-ink">
              <span className="font-serif text-[60px] leading-none font-bold tracking-[-0.03em]">{p.price}</span>
              {p.period && <span className="ml-[8px] text-[26px]">{p.period}</span>}
            </p>
            <p className="mt-[20px] min-h-[54px] text-[19px] leading-[1.35] text-ink-2">{p.body}</p>
            <ul className="mt-[18px] space-y-[8px] border-t border-divider pt-[20px] text-[17.5px] text-ink">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-[14px]">
                  <Check className="size-[18px] shrink-0" strokeWidth={2.25} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className={cn(buttonClass(p.featured ? "primary" : "secondary", "lg"), "mt-[30px] w-full")}>
              {p.cta}
            </a>
          </div>
        ))}
      </div>
    </Container>
  )
}

export type Cell = boolean | string
export type CompareGroup = { name: string; rows: [string, ...Cell[]][] }

const defaultGroups: CompareGroup[] = [
  {
    name: "Writing",
    rows: [
      ["Publish posts", true, true, true],
      ["Schedule posts", false, true, true],
      ["Drafts", "3", "Unlimited", "Unlimited"],
      ["Rich editing", true, true, true],
      ["Collaborators", false, "3", "Unlimited"],
    ],
  },
  {
    name: "Growth & revenue",
    rows: [
      ["Subscribers", "1,000", "Unlimited", "Unlimited"],
      ["Email delivery", true, true, true],
      ["Paid subscriptions", false, true, true],
      ["Analytics", "Basic", "Advanced", "Advanced"],
      ["Monthly revenue", false, true, true],
    ],
  },
]

function Value({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto size-[20px]" strokeWidth={2.25} aria-label="Included" />
  if (v === false) return <Minus className="mx-auto size-[20px] text-ink-2" aria-label="Not included" />
  return <span>{v}</span>
}

export function CompareTable({
  title = "Compare plans",
  plans: names = ["Free", "Pro", "Publication"],
  groups = defaultGroups,
}: {
  title?: string
  plans?: string[]
  groups?: CompareGroup[]
}) {
  return (
    <Container>
      <div className="xl:mx-[78px]">
      <DoubleRule />
      <SectionHeader className="mt-[35px]" title={title} />
      <div className="mt-[30px] overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[16px] text-ink md:text-[19px]">
          <thead>
            <tr className="border-b border-ink bg-newsprint">
              <th className="w-[38%] py-[16px]" />
              {names.map((n) => (
                <th key={n} className="py-[14px] text-center font-serif text-[28px] font-bold tracking-[-0.02em]">
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.name}>
              <tr className="border-b border-divider">
                <th colSpan={names.length + 1} className="px-[14px] pt-[10px] pb-[6px] text-left text-[19px] font-semibold text-press">
                  {g.name}
                </th>
              </tr>
              {g.rows.map(([label, ...cells]) => (
                <tr key={label} className="border-b border-divider">
                  <td className="px-[14px] py-[6px] leading-[1.3]">{label}</td>
                  {cells.map((c, i) => (
                    <td key={i} className="py-[6px] text-center leading-[1.3]">
                      <Value v={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <DoubleRule className="mt-[36px]" />
      </div>
    </Container>
  )
}
