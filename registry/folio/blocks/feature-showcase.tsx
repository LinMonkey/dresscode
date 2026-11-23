import { EditorPreview } from "./editor-preview"

export type Feature = { title: string; body: string }

const defaultFeatures: Feature[] = [
  { title: "Focused editor", body: "A clean, distraction-free writing space that keeps your words at the center." },
  { title: "Email-first layouts", body: "Turn your writing into beautiful, readable emails with just a few clicks." },
  { title: "Drafts and scheduling", body: "Save work in progress, come back anytime, and schedule your next issue for 2026." },
]

// A section headline, a short list of features marked with press-red rules, and the product UI.
export function FeatureShowcase({
  title = "A writing desk, not a dashboard",
  subtitle = "A focused, writer-first space to draft, refine, and send your work to readers.",
  features = defaultFeatures,
}: {
  title?: string
  subtitle?: string
  features?: Feature[]
}) {
  return (
    <section className="mx-auto max-w-[1360px] px-5 md:px-[25px] xl:px-gutter">
      <h2 className="font-serif text-[40px] leading-[1.02] font-bold tracking-[-0.03em] text-ink md:text-[60px] xl:text-h2 xl:leading-[1.05]">{title}</h2>
      <p className="mt-[10px] text-[18px] leading-[1.4] text-ink-2 md:text-[22px] xl:text-lead-lg">{subtitle}</p>
      <div className="mt-[45px] grid gap-10 xl:grid-cols-[401px_1fr] xl:gap-0">
        <ul className="space-y-8 md:grid md:grid-cols-3 md:gap-6 md:space-y-0 xl:block xl:space-y-[48px] xl:pt-[15px]">
          {features.map((f) => (
            <li key={f.title} className="relative pl-[21px]">
              <span className="absolute top-0 left-[2px] h-[35px] w-[6px] bg-press" aria-hidden />
              <h3 className="font-serif text-h3 font-bold text-ink">{f.title}</h3>
              <p className="mt-[2px] max-w-[380px] text-body-lg text-ink-2">{f.body}</p>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <EditorPreview className="[zoom:0.42] sm:[zoom:0.7] md:[zoom:0.98] xl:[zoom:1]" />
        </div>
      </div>
    </section>
  )
}
