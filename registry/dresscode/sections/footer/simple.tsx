// A compact footer in one row: the logo and a few links on the left, social icons and the copyright on
// the right. On phones it wraps into a centered stack. The icons are generic ones (swap in your own
// brand marks); each link has a name for screen readers.
import { AtSign, MessagesSquare, PlayCircle, Rss } from "lucide-react"

import { cn } from "@/lib/utils"

const LINKS = ["Pricing", "Help center", "Privacy", "Terms"]

const SOCIAL = [
  { icon: AtSign, label: "Orbit on social media", href: "#social" },
  { icon: MessagesSquare, label: "Community forum", href: "#community" },
  { icon: PlayCircle, label: "Video tutorials", href: "#videos" },
  { icon: Rss, label: "Blog feed", href: "#rss" },
]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em]", className)}>
      <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="16.5" cy="5.5" r="3" fill="var(--dc-accent)" />
      </svg>
      <span className="dc-h">Orbit</span>
    </span>
  )
}

export default function FooterSimple() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-5 sm:px-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-5 md:flex-row md:gap-10">
          <a href="#top" aria-label="Orbit home" className={cn("inline-flex rounded-sm", focus)}>
            <Logo />
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground">
              {LINKS.map((l) => (
                <li key={l}>
                  <a href={`#${slug(l)}`} className={cn("rounded-sm transition-colors hover:text-foreground", focus)}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <ul aria-label="Follow Orbit" className="flex items-center gap-1">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className={cn("grid size-9 place-items-center rounded-[var(--radius)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", focus)}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-muted-foreground">© 2026 Orbit Labs</p>
        </div>
      </div>
    </footer>
  )
}
