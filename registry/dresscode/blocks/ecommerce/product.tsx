// A product page: photos and the buy box, the colored band (why this material), pairs well with,
// reviews and more like it. It carries schema.org Product data for search engines.
import { cn } from "@/lib/utils"

import { photo } from "./assets"
import { CompactCard, Section } from "./cards"
import { BRAND, type Variant } from "./data"
import { PairsWellWith, ProductView, Reviews } from "./product-client"
import { Crumbs, PageFrame } from "./shell"
import { categoryOf, inStock, priceOf, productOf, shopPath, to } from "./site"
import { WRAP } from "./styles"

export function ProductPage({ base, variant, slug }: { base: string; variant: Variant; slug: string }) {
  const p = productOf(slug)!
  const cat = categoryOf(p.category)
  const why = p.why ?? cat.why
  const also = p.also.map((s) => productOf(s)!).filter(Boolean)
  const prices = (p.sizes ?? [{ name: "" }]).map((s) => priceOf(p, s.name || undefined))
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    image: p.photos.map(photo),
    brand: { "@type": "Brand", name: BRAND.name },
    category: cat.name,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  }
  return (
    <PageFrame base={base} look={variant}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className={cn(WRAP, "pt-5")}>
        <Crumbs base={base} items={[["Shop", "shop"], [cat.name, shopPath(cat.id)], [p.name]]} className="mb-5" />
        <ProductView p={p} />
      </div>

      <section aria-labelledby="ec-why" className={cn(WRAP, "mt-14")}>
        <div className="dc-band grid gap-6 rounded-[var(--dc-radius-card)] px-6 py-7 sm:px-10 lg:grid-cols-[auto_repeat(3,minmax(0,1fr))] lg:items-center lg:gap-0">
          <h2 id="ec-why" className="dc-h text-[clamp(1.8rem,3vw,2.5rem)] leading-none lg:pr-10">
            {why.title}
          </h2>
          {why.facts.map(([k, v]) => (
            <div key={k} className="lg:border-l lg:border-[color:var(--dc-band-line)] lg:px-8">
              <p className="dc-h text-[clamp(1.3rem,2vw,1.6rem)] leading-tight">{k}</p>
              <p className="mt-1 text-[14px] opacity-90">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="ec-pairs" title="Pairs well with" className={cn(WRAP, "mt-14")}>
        <PairsWellWith base={base} p={p} />
      </Section>

      <Section id="ec-reviews" title="Reviews" className={cn(WRAP, "mt-14")}>
        <Reviews p={p} />
      </Section>

      <Section id="ec-also" title="You may also like" link={{ href: to(base, shopPath(cat.id)), label: `More ${cat.name}` }} className={cn(WRAP, "mt-14")}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {also.map((x) => (
            <li key={x.slug}>
              <CompactCard base={base} p={x} className="h-full" />
            </li>
          ))}
        </ul>
      </Section>
    </PageFrame>
  )
}
