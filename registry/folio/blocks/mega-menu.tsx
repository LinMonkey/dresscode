// The Product dropdown from the masthead navigation (design image L2), drawn open.
type Item = { title: string; body: string }
type Column = { heading: string; items: Item[] }

const columns: Column[] = [
  {
    heading: "Write",
    items: [
      { title: "Editor", body: "A clean, focused editor built for long-form writing." },
      { title: "Templates", body: "Start faster with flexible, professional templates." },
      { title: "Scheduling", body: "Plan and publish posts on your own timeline." },
    ],
  },
  {
    heading: "Grow",
    items: [
      { title: "Recommendations", body: "Get discovered by new readers across the network." },
      { title: "Referral program", body: "Reward your biggest supporters for bringing in new subscribers." },
      { title: "Import subscribers", body: "Bring your existing audience with a simple import." },
    ],
  },
  {
    heading: "Earn",
    items: [
      { title: "Paid subscriptions", body: "Build a sustainable business with reader support." },
      { title: "Sponsorships", body: "Work with trusted sponsors that fit your publication." },
      { title: "Analytics", body: "Understand what’s working and grow with confidence." },
    ],
  },
]

export function MegaMenu() {
  return (
    <div className="grid border border-divider bg-newsprint px-[26px] py-[24px] md:grid-cols-[1fr_1fr_1fr_316px]">
      {columns.map((col) => (
        <div key={col.heading} className="pr-[24px] md:border-r md:border-divider [&:not(:first-child)]:md:pl-[30px]">
          <p className="font-serif text-[36px] leading-none font-bold tracking-[-0.02em] text-ink">{col.heading}</p>
          <ul className="mt-[34px] space-y-[24px]">
            {col.items.map((it) => (
              <li key={it.title}>
                <a href="#" className="group block">
                  <span className="block text-[20px] leading-[1.2] font-semibold text-ink group-hover:text-press">{it.title}</span>
                  <span className="mt-[4px] block max-w-[245px] text-[17px] leading-[1.35] text-ink-2">{it.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <a href="#changelog" className="mt-6 block border border-hairline border-t-[6px] border-t-press bg-paper px-[22px] pt-[22px] pb-[24px] md:mt-[12px] md:ml-[24px]">
        <p className="font-serif text-[20px] italic text-ink-2">From the changelog:</p>
        <p className="mt-[16px] font-serif text-[38px] leading-[1.05] font-bold tracking-[-0.03em] text-ink">Annual plans are here</p>
        <div className="mt-[18px] border-t border-divider pt-[22px] text-[18px] leading-[1.35] text-ink-2">
          Paid subscriptions now support annual plans, with simpler billing and more flexibility for your readers.
        </div>
        <p className="mt-[34px] font-serif text-[18px] italic text-ink-2">2026</p>
      </a>
    </div>
  )
}
