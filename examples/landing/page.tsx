import { AnnouncementBar } from "@/components/folio/announcement-bar"
import { BentoGrid } from "@/components/folio/bento-grid"
import { ClosingCTA, Footer, SubscribeBand } from "@/components/folio/closing"
import { FAQ, Journal } from "@/components/folio/faq-journal"
import { FeatureAlternating } from "@/components/folio/feature-alternating"
import { FeatureShowcase } from "@/components/folio/feature-showcase"
import { HeroEditorial } from "@/components/folio/hero-editorial"
import { IntegrationsList } from "@/components/folio/integrations-list"
import { LogoStrip } from "@/components/folio/logo-strip"
import { MastheadNav } from "@/components/folio/masthead-nav"
import { CompareTable, PricingPlans } from "@/components/folio/pricing"
import { StepsAndStats } from "@/components/folio/steps-stats"
import { Testimonials } from "@/components/folio/testimonials"

// The complete Folio landing page: all 17 modules, with Folio's section spacing between them.
export default function Page() {
  return (
    <main>
      <AnnouncementBar />
      <MastheadNav />
      <HeroEditorial />
      <div className="space-y-section-sm xl:space-y-section">
        <LogoStrip />
        <FeatureShowcase />
        <FeatureAlternating />
        <BentoGrid />
        <StepsAndStats />
        <Testimonials />
        <IntegrationsList />
        <PricingPlans />
        <CompareTable />
        <FAQ />
        <Journal />
        <SubscribeBand />
        <ClosingCTA />
        <Footer />
      </div>
    </main>
  )
}
