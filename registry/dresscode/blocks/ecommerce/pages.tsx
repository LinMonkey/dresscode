// The store's other pages: shop (all, a department, a collection), search, cart, checkout and its
// confirmation, saved, account, sign in, an order, track an order, gift cards, journal and a post,
// about, help, contact and the 404.
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Photo, ProductCard, Section } from "./cards"
import { CartPageView } from "./cart"
import { CheckoutHeader, CheckoutView, ConfirmationView, OrderDetail } from "./checkout"
import { ABOUT, BRAND, CUSTOMER, FAQ, GIFT_CARD, ORDERS, POSTS, type Variant } from "./data"
import { ContactForm, GiftCardForm, SignInForm, TrackForm } from "./forms"
import { JournalCard } from "./homes"
import { AccountView, SavedView, SearchView } from "./pages-client"
import { Crumbs, PageFrame, PageIntro } from "./shell"
import { ShopView } from "./shop"
import { bestSelling, formatDate, formatLong, productOf, shopTitle, to, type ShopId } from "./site"
import { LINK, OUTLINE, PRIMARY, WRAP } from "./styles"

type P = { base: string; variant: Variant }

export function ShopPage({ base, variant, id }: P & { id: ShopId }) {
  const t = shopTitle(id)
  return (
    <PageFrame base={base} look={variant}>
      <div className={WRAP}>
        <Crumbs base={base} items={id === "all" ? [["Shop all"]] : [["Shop", "shop"], [t.name]]} className="pt-5" />
        <ShopView base={base} id={id} look={variant} title={t.name} lead={t.blurb} />
      </div>
    </PageFrame>
  )
}

export function SearchPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant}>
      <div className={WRAP}>
        <PageIntro title="Search" />
        <SearchView base={base} look={variant} />
      </div>
    </PageFrame>
  )
}

export function CartPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "pb-16")}>
        <PageIntro title="Your cart" />
        <CartPageView base={base} />
      </div>
    </PageFrame>
  )
}

export function CheckoutPage({ base }: P) {
  return (
    <>
      <CheckoutHeader base={base} />
      <main id="main" className="flex-1">
        <h1 className="sr-only">Checkout</h1>
        <CheckoutView base={base} />
      </main>
      <footer className="border-t border-border py-5 text-center text-[13px] text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.legal} ·{" "}
        <Link href={to(base, "help")} className="hover:text-foreground">
          Help
        </Link>{" "}
        ·{" "}
        <Link href={to(base, "contact")} className="hover:text-foreground">
          Contact
        </Link>
      </footer>
    </>
  )
}

export function ConfirmationPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <ConfirmationView base={base} />
    </PageFrame>
  )
}

export function SavedPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant}>
      <div className={WRAP}>
        <PageIntro title="Saved" lead="The things you saved, kept on this device." />
        <SavedView base={base} look={variant} />
      </div>
    </PageFrame>
  )
}

export function AccountPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "pb-16")}>
        <PageIntro title={`Hi, ${CUSTOMER.first}`} lead={`Signed in as ${CUSTOMER.email}.`} />
        <AccountView base={base} />
      </div>
    </PageFrame>
  )
}

export function SignInPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "py-12 sm:py-16")}>
        <h1 className="dc-h mb-8 text-center text-[clamp(2rem,4vw,2.8rem)]">Welcome back</h1>
        <SignInForm base={base} />
      </div>
    </PageFrame>
  )
}

export function OrderPage({ base, variant, number }: P & { number: number }) {
  const o = ORDERS.find((x) => x.number === number)!
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <OrderDetail base={base} o={o} />
    </PageFrame>
  )
}

export function TrackPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "pb-16")}>
        <PageIntro title="Track an order" lead="Enter your order number and the email you ordered with." />
        <TrackForm base={base} />
      </div>
    </PageFrame>
  )
}

export function GiftCardsPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant}>
      <div className={cn(WRAP, "grid gap-10 pt-8 lg:grid-cols-2 lg:gap-16")}>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="relative flex aspect-[8/5] flex-col justify-between overflow-hidden rounded-[calc(var(--dc-radius-card)+6px)] bg-primary p-8 text-primary-foreground shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
            <span className="dc-h text-[44px] leading-none">{BRAND.name}</span>
            <span className="absolute -right-16 -bottom-24 size-72 rounded-full border-[28px] border-current opacity-10" aria-hidden="true" />
            <span className="flex items-end justify-between">
              <span className="text-[15px] opacity-85">Gift card</span>
              <span className="dc-num text-[15px] opacity-85">Never expires</span>
            </span>
          </div>
          <ul className="mt-6 grid gap-2 text-[15px] text-muted-foreground">
            <li>Emailed straight away, with your note.</li>
            <li>Works on everything, and never expires.</li>
            <li>No shipping, so it&apos;s there in time for anything.</li>
          </ul>
        </div>
        <div>
          <Crumbs base={base} items={[["Gift cards"]]} />
          <h1 className="dc-h mt-3 text-[clamp(2rem,3.6vw,2.8rem)] leading-tight">{GIFT_CARD.title}</h1>
          <p className="mt-2 mb-8 text-[17px] text-muted-foreground">{GIFT_CARD.text}</p>
          <GiftCardForm />
        </div>
      </div>
    </PageFrame>
  )
}

export function JournalPage({ base, variant }: P) {
  const [lead, ...rest] = POSTS
  return (
    <PageFrame base={base} look={variant}>
      <div className={WRAP}>
        <PageIntro title="Journal" lead="Care guides, kitchen notes and how things are made." />
        <Link href={to(base, "journal", lead.slug)} className="group grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <span className="block aspect-[3/2] overflow-hidden rounded-[var(--dc-radius-card)]">
            <Photo src={lead.photo} alt="" priority imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
          </span>
          <span>
            <span className="text-[14px] font-medium text-[color:var(--dc-accent)]">{lead.tag}</span>
            <span className="dc-h mt-2 block text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight group-hover:underline">{lead.title}</span>
            <span className="mt-3 block text-[17px] text-muted-foreground">{lead.summary}</span>
            <span className="mt-4 block text-[14px] text-muted-foreground">
              {formatDate(lead.date)} · {lead.minutes} min read
            </span>
          </span>
        </Link>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2">
          {rest.map((p) => (
            <li key={p.slug}>
              <JournalCard base={base} post={p} look="stack" />
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  )
}

export function PostPage({ base, variant, slug }: P & { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug)!
  const products = post.products.map((s) => productOf(s)!).filter(Boolean)
  const others = POSTS.filter((p) => p.slug !== slug)
  return (
    <PageFrame base={base} look={variant}>
      <article>
        <header className={cn(WRAP, "max-w-[860px] pt-8 text-center")}>
          <Crumbs base={base} items={[["Journal", "journal"], [post.title]]} className="flex justify-center" />
          <p className="mt-6 text-[14px] font-medium text-[color:var(--dc-accent)]">{post.tag}</p>
          <h1 className="dc-h mt-2 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">{post.title}</h1>
          <p className="mx-auto mt-4 max-w-[34em] text-[18px] text-muted-foreground">{post.summary}</p>
          <p className="mt-4 text-[14px] text-muted-foreground">
            <time dateTime={post.date}>{formatLong(post.date)}</time> · {post.minutes} min read
          </p>
        </header>
        <div className={cn(WRAP, "mt-8 max-w-[1100px]")}>
          <div className="aspect-[2/1] overflow-hidden rounded-[var(--dc-radius-card)]">
            <Photo src={post.photo} alt="" priority />
          </div>
        </div>
        <div className={cn(WRAP, "mt-10 max-w-[720px] text-[18px] leading-[1.7]")}>
          {post.body.map((b, i) =>
            b.startsWith("## ") ? (
              <h2 key={i} className="dc-h mt-10 mb-3 text-[26px] leading-tight">
                {b.slice(3)}
              </h2>
            ) : (
              <p key={i} className="mt-5 first:mt-0">
                {b}
              </p>
            ),
          )}
        </div>
      </article>
      <Section id="ec-in-post" title="In this story" className={cn(WRAP, "mt-16 max-w-[1100px]")}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard base={base} p={p} look={variant} />
            </li>
          ))}
        </ul>
      </Section>
      <Section id="ec-more-posts" title="More from the journal" className={cn(WRAP, "mt-16 max-w-[1100px]")}>
        <ul className="grid gap-8 sm:grid-cols-2">
          {others.map((p) => (
            <li key={p.slug}>
              <JournalCard base={base} post={p} look="stack" />
            </li>
          ))}
        </ul>
      </Section>
    </PageFrame>
  )
}

export function AboutPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant}>
      <section className={cn(WRAP, "grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16")}>
        <div>
          <p className="text-[14px] font-medium text-[color:var(--dc-accent)]">Our story</p>
          <h1 className="ec-rise dc-h mt-2 text-[clamp(2.3rem,4.8vw,3.8rem)] leading-[1.02]">{ABOUT.title}</h1>
          <p className="ec-rise mt-4 text-[19px] text-muted-foreground">{ABOUT.lead}</p>
        </div>
        <div className="aspect-[3/2] overflow-hidden rounded-[var(--dc-radius-card)]">
          <Photo src="story-workshop" alt="A seamstress sewing linen in a small workshop in Portugal" priority />
        </div>
      </section>
      <div className={cn(WRAP, "mt-14 max-w-[760px] grid gap-5 text-[18px] leading-relaxed")}>
        {ABOUT.story.map((s) => (
          <p key={s}>{s}</p>
        ))}
      </div>
      <section id="makers" aria-labelledby="ec-makers" className={cn(WRAP, "mt-16 scroll-mt-6")}>
        <h2 id="ec-makers" className="dc-h text-[clamp(1.7rem,3vw,2.3rem)]">
          Who makes what
        </h2>
        <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.makers.map(([k, v]) => (
            <li key={k} className="border-t border-border pt-4">
              <p className="text-[17px] font-semibold">{k}</p>
              <p className="mt-1 text-[15px] text-muted-foreground">{v}</p>
            </li>
          ))}
        </ul>
      </section>
      <section id="materials" aria-labelledby="ec-materials" className="dc-band mt-16 scroll-mt-6">
        <div className={cn(WRAP, "py-12")}>
          <h2 id="ec-materials" className="dc-h text-[clamp(1.7rem,3vw,2.3rem)]">
            What we make things from
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT.materials.map(([k, v]) => (
              <div key={k}>
                <dt className="dc-h text-[22px]">{k}</dt>
                <dd className="mt-1 text-[15px] opacity-90">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={cn(WRAP, "mt-16 flex flex-wrap items-center justify-between gap-4")}>
        <p className="dc-h max-w-[18em] text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">Start with the thing we started with: a washed linen duvet cover.</p>
        <Link href={to(base, "products", "washed-linen-duvet-cover")} className={cn(PRIMARY, "h-12 px-6 text-[16px]")}>
          Shop the duvet cover <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </PageFrame>
  )
}

export function HelpPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "pb-16")}>
        <PageIntro title="Help & FAQ" lead="Shipping, returns, orders and care. Can't find it here? We answer within one business day." />
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <nav aria-label="Topics" className="hidden lg:block">
            <ul className="sticky top-6 grid gap-1 text-[15px]">
              {FAQ.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="block rounded-[var(--radius)] px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-10">
            {FAQ.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`ec-faq-${g.id}`} className="scroll-mt-6">
                <h2 id={`ec-faq-${g.id}`} className="dc-h text-[24px]">
                  {g.title}
                </h2>
                <div className="mt-3 border-t border-border">
                  {g.items.map(([q, a]) => (
                    <details key={q} className="group border-b border-border">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                        {q}
                        <span className="text-[20px] leading-none text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <p className="pb-4 text-[15px] text-muted-foreground">{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="dc-card h-fit p-6 lg:sticky lg:top-6">
            <h2 className="text-[17px] font-semibold">Still need help?</h2>
            <ul className="mt-4 grid gap-3 text-[15px]">
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4" aria-hidden="true" /> Chat, {BRAND.hours}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4" aria-hidden="true" />
                <a href={`mailto:${BRAND.email}`} className={LINK}>
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4" aria-hidden="true" /> {BRAND.phone}
              </li>
            </ul>
            <Link href={to(base, "contact")} className={cn(OUTLINE, "mt-5 h-10 w-full text-[14px]")}>
              Write to us
            </Link>
            <Link href={to(base, "track")} className={cn(LINK, "mt-4 block text-center text-[14px]")}>
              Track an order
            </Link>
          </aside>
        </div>
      </div>
    </PageFrame>
  )
}

export function ContactPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant} newsletter={false}>
      <div className={cn(WRAP, "pb-16")}>
        <PageIntro title="Contact us" lead="Real people in Portland answer every message, usually the same day." />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <ContactForm />
          <aside className="grid gap-4 text-[15px]">
            <div className="dc-card p-6">
              <h2 className="text-[17px] font-semibold">Talk to us</h2>
              <p className="mt-2 text-muted-foreground">Chat or call, {BRAND.hours}.</p>
              <p className="mt-3">
                <a href={`mailto:${BRAND.email}`} className={LINK}>
                  {BRAND.email}
                </a>
                <br />
                {BRAND.phone}
              </p>
            </div>
            <div className="dc-card p-6">
              <h2 className="text-[17px] font-semibold">Studio</h2>
              <p className="mt-2 text-muted-foreground">{BRAND.address}</p>
              <p className="mt-2 text-muted-foreground">Not a shop, but come and say hello on Saturdays, 10–2.</p>
            </div>
          </aside>
        </div>
      </div>
    </PageFrame>
  )
}

export function NotFoundPage({ base, variant }: P) {
  return (
    <PageFrame base={base} look={variant}>
      <div className={cn(WRAP, "py-16 text-center")}>
        <p className="dc-num text-[15px] text-muted-foreground">404</p>
        <h1 className="dc-h mt-2 text-[clamp(2.2rem,4.6vw,3.4rem)]">We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-3 max-w-[30em] text-[17px] text-muted-foreground">It may have sold out for good, or the link has a typo. These are what most people are looking for:</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={to(base)} className={cn(PRIMARY, "h-11 px-5 text-[15px]")}>
            Home
          </Link>
          <Link href={to(base, "shop")} className={cn(OUTLINE, "h-11 px-5 text-[15px]")}>
            Shop all
          </Link>
          <Link href={to(base, "search")} className={cn(OUTLINE, "h-11 px-5 text-[15px]")}>
            Search
          </Link>
        </div>
        <ul className="mx-auto mt-12 grid max-w-[1000px] grid-cols-2 gap-x-4 gap-y-8 text-left lg:grid-cols-4">
          {bestSelling().slice(0, 4).map((p) => (
            <li key={p.slug}>
              <ProductCard base={base} p={p} look={variant} />
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  )
}
