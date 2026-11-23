import { ChevronDown, Menu } from "lucide-react"
import Link from "next/link"

import { MegaMenu } from "./mega-menu"

type NavItem = { label: string; href: string; menu?: boolean }

const defaultItems: NavItem[] = [
  { label: "Product", href: "#product", menu: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Writers", href: "#writers" },
  { label: "Resources", href: "#resources", menu: true },
  { label: "Changelog", href: "#changelog" },
]

// Broadsheet navigation: a large serif masthead, thin column rules, and the double rule underneath.
export function MastheadNav({
  brand = "Sundial",
  items = defaultItems,
  menuOpen = false,
  active,
  compact = false,
}: {
  brand?: string
  items?: NavItem[]
  /** Show the Product menu open (used by previews and screenshots). */
  menuOpen?: boolean
  /** Label of the current section; it is set in press red. */
  active?: string
  /** A shorter bar for inner pages (design system, docs). */
  compact?: boolean
}) {
  return (
    <header className="relative">
      <div className={`mx-auto flex max-w-[1360px] items-center px-5 md:px-[25px] xl:px-gutter ${compact ? "h-[64px] xl:h-[60px]" : "h-[76px] md:h-[90px] xl:h-[101px]"}`}>
        <Link href="/" className={`font-serif leading-none font-bold tracking-[-0.035em] text-ink ${compact ? "text-[38px] xl:text-[46px]" : "text-[44px] md:text-[60px] xl:mt-[10px] xl:text-masthead"}`}>
          {brand}
        </Link>
        <span className={`mx-[33px] hidden w-px bg-divider xl:block ${compact ? "h-[34px]" : "h-[46px]"}`} aria-hidden />
        <nav className={`hidden items-center gap-[46px] text-nav whitespace-nowrap text-ink xl:flex ${compact ? "" : "mb-[7px]"}`}>
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.label === active ? "page" : undefined}
              className={`flex items-center gap-[7px] hover:text-press ${item.label === active ? "font-medium text-press" : ""} ${menuOpen && item.menu && item.label === "Product" ? "-mx-[18px] bg-newsprint px-[18px] py-[12px] font-medium" : ""}`}
            >
              {item.label}
              {item.menu && <ChevronDown className="size-[17px]" strokeWidth={2.25} />}
            </a>
          ))}
        </nav>
        <span className={`mx-[36px] ml-auto hidden w-px bg-divider xl:block ${compact ? "h-[34px]" : "h-[46px]"}`} aria-hidden />
        <a href="#signin" className="mb-[7px] hidden text-nav whitespace-nowrap text-ink hover:text-press xl:inline">
          Sign in
        </a>
        <a
          href="#start"
          className="ml-auto inline-flex h-[38px] items-center bg-ink px-[16px] text-[15px] font-semibold whitespace-nowrap text-paper hover:bg-ink-2 xl:ml-[36px] xl:h-[41px] xl:px-[21px] xl:text-nav"
        >
          Start writing
        </a>
        <button className="ml-3 grid size-[38px] place-items-center border border-divider xl:hidden" aria-label="Open menu">
          <Menu className="size-[20px]" />
        </button>
      </div>
      <div className="mx-auto max-w-[1360px] px-5 md:px-[25px] xl:px-gutter">
        <div className="folio-double-rule" />
      </div>
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-10 mx-auto mt-[22px] max-w-[1360px] px-5 md:px-[25px] xl:px-[27px]">
          <MegaMenu />
        </div>
      )}
    </header>
  )
}
