// The Orbit landing page: all 18 modules a SaaS landing page needs, in order, for a made-up invoicing
// product. The colors, fonts and corners come from the DressCode theme's CSS variables; the props are
// the theme's layout choices (where its one band goes, how the headline marks its key words).
import { Bento, FeatureGrid, FeatureRows, HowItWorks } from "./features"
import { Hero } from "./hero"
import { ClosingCTA, FAQ, Footer, Integrations, Resources } from "./more"
import { AnnouncementBar, Navbar } from "./navbar"
import { ComparePlans, Pricing } from "./pricing"
import { type Mark } from "./shared"
import { LogoCloud, Stats, Testimonials } from "./social-proof"
import { UseCases } from "./use-cases"

export type OrbitLayout = {
  /** Where the theme's one colored band goes. */
  bandAt?: "hero" | "feature" | "cta"
  /** How the hero headline marks its key words. */
  mark?: Mark
  /** A faint accent glow behind the hero product shot. */
  glow?: boolean
  /** Ink outlines and hard shadows on buttons and icons. */
  brutal?: boolean
}

export function OrbitLanding({ bandAt = "cta", mark = "none", glow = false, brutal = false }: OrbitLayout) {
  const bandHero = bandAt === "hero"
  return (
    <div className={brutal ? "dc-theme dc-brutal" : "dc-theme"}>
      <AnnouncementBar onBand={bandHero} />
      <Navbar onBand={bandHero} />
      <main>
        <Hero mark={mark} band={bandHero} glow={glow} />
        <LogoCloud />
        <FeatureGrid />
        <UseCases />
        <FeatureRows band={bandAt === "feature"} />
        <Bento />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Integrations />
        <Pricing />
        <ComparePlans />
        <FAQ />
        <Resources />
        <ClosingCTA band={bandAt === "cta"} />
      </main>
      <Footer />
    </div>
  )
}
