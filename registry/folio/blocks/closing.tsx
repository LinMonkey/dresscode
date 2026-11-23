// Newsletter sign-up band, closing call to action and footer (design image L12).
// Footer layout follows the house rule: brand in a left column, link columns to its right,
// copyright centred on its own row under a hairline.
import { buttonClass, Container, DoubleRule } from "./shared"

export function SubscribeBand({ title = "Get one useful email a month about growing a newsletter." }: { title?: string }) {
  return (
    <Container>
      <DoubleRule />
      <form className="py-[44px] md:py-[48px]" action="#">
        <p className="max-w-[720px] font-serif text-[34px] leading-[1.05] font-bold tracking-[-0.03em] text-ink md:text-[50px]">{title}</p>
        <div className="mt-[30px] flex flex-col gap-[14px] sm:flex-row md:gap-[19px]">
          <label className="sr-only" htmlFor="subscribe-email">
            Email address
          </label>
          <input
            id="subscribe-email"
            type="email"
            placeholder="Your email address"
            className="h-[53px] flex-1 border border-ink-2 bg-paper px-[24px] text-[19px] text-ink placeholder:text-ink-2 focus:border-ink focus:outline-none"
          />
          <button className={`${buttonClass("primary", "lg")} md:w-[177px]`}>Subscribe</button>
        </div>
      </form>
      <DoubleRule />
    </Container>
  )
}

export function ClosingCTA({
  title = "Start your publication today",
  body = "A simple, powerful platform for independent writers who want to grow and get paid.",
}: {
  title?: string
  body?: string
}) {
  return (
    <Container>
      <div className="bg-newsprint px-6 py-[60px] text-center md:py-[64px]">
        <p className="mx-auto max-w-[560px] font-serif text-[44px] leading-[1] font-bold tracking-[-0.035em] text-ink md:text-[64px] md:leading-[0.98]">{title}</p>
        <p className="mx-auto mt-[22px] max-w-[580px] text-[19px] leading-[1.4] text-ink-2 md:text-[24px]">{body}</p>
        <div className="mt-[36px] flex flex-col justify-center gap-[14px] sm:flex-row md:gap-[23px]">
          <a href="#start" className={`${buttonClass("primary", "lg")} md:w-[266px]`}>
            Start writing free
          </a>
          <a href="#example" className={`${buttonClass("secondary", "lg")} md:w-[264px]`}>
            See an example issue
          </a>
        </div>
      </div>
    </Container>
  )
}

const columns: [string, string[]][] = [
  ["Product", ["Features", "Pricing", "Changelog", "Roadmap"]],
  ["Resources", ["Guides", "Examples", "Help center", "Blog"]],
  ["Company", ["About", "Careers", "Contact", "Press"]],
  ["Legal", ["Terms", "Privacy", "Security", "Cookies"]],
]

export function Footer({ brand = "Sundial", tagline = "A newsletter platform for independent writers.", year = 2026 }: { brand?: string; tagline?: string; year?: number }) {
  return (
    <footer>
      <Container>
        <DoubleRule />
        <div className="grid gap-10 pt-[34px] pb-[30px] md:grid-cols-[1.2fr_2fr] md:gap-[24px] md:pt-[34px]">
          <div>
            <p className="font-serif text-[52px] leading-none font-bold tracking-[-0.035em] text-ink">{brand}</p>
            <p className="mt-[18px] max-w-[230px] text-[18px] leading-[1.35] text-ink-2">{tagline}</p>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map(([head, links]) => (
              <div key={head}>
                <p className="text-[17px] font-bold text-ink">{head}</p>
                <ul className="mt-[12px] space-y-[5px] text-[16.5px] text-ink">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-press">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="border-t border-divider py-[16px] text-center text-[15.5px] text-ink-2">
          © {year} {brand}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
