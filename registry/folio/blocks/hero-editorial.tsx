import Image from "next/image"

import { EditorPreview } from "./editor-preview"

// Broadsheet hero: a big serif headline on the left, the real product UI on the right,
// laid over a black-and-white newspaper photo and captioned like a printed figure.
export function HeroEditorial({
  title = "The newsletter platform for independent writers",
  subtitle = "Write, send and grow a paid publication, without hiring a designer.",
  primary = "Start writing free",
  secondary = "See an example issue",
  note = "Free for your first 1,000 subscribers. No card required.",
  caption = "Fig. 1 — The editor, as writers see it.",
  photo = "/folio/placeholder/hero-newspaper.png",
}: {
  title?: string
  subtitle?: string
  primary?: string
  secondary?: string
  note?: string
  caption?: string
  photo?: string
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1360px] px-5 pb-section-sm md:px-[25px] xl:grid-cols-[479px_1fr] xl:px-gutter xl:pb-section">
        {/* Anchored to the content column (not the viewport edge) so it keeps its place behind the editor at any width. */}
        <Image
          src={photo}
          alt="A folded newspaper on a table"
          width={447}
          height={542}
          priority
          className="pointer-events-none absolute top-[-3px] left-[833px] hidden h-[542px] w-[447px] object-cover xl:block"
        />
        <div className="relative pt-[44px] md:pt-[60px] xl:pt-[77px]">
          <h1 className="max-w-[640px] font-serif text-[44px] leading-[1] font-bold tracking-[-0.035em] text-ink md:text-[60px] xl:max-w-[480px] xl:text-display xl:leading-[70px]">{title}</h1>
          <p className="mt-[21px] max-w-[440px] text-[19px] leading-[1.35] text-ink-2 md:text-lead">{subtitle}</p>
          <div className="mt-[34px] flex flex-col gap-[12px] sm:flex-row">
            <a
              href="#start"
              className="inline-flex h-[46px] items-center justify-center bg-ink px-6 text-nav font-semibold text-paper hover:bg-ink-2 sm:w-[211px] sm:px-0"
            >
              {primary}
            </a>
            <a
              href="#example"
              className="inline-flex h-[46px] items-center justify-center border border-divider bg-paper px-6 text-nav font-medium text-ink hover:border-ink sm:w-[217px] sm:px-0"
            >
              {secondary}
            </a>
          </div>
          <p className="mt-[17px] text-note text-ink-2">{note}</p>
        </div>
        <figure className="relative overflow-hidden pt-12 xl:overflow-visible xl:pt-[176px]">
          <EditorPreview className="h-[399px] [zoom:0.42] sm:[zoom:0.7] md:[zoom:0.98] xl:[zoom:0.909]" />
          <figcaption className="mt-[6px] font-serif text-[17px] italic text-ink xl:-ml-[4px] xl:text-[19px]">{caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
