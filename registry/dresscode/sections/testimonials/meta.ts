import type { BlockCategoryMeta } from "../types"

const meta: BlockCategoryMeta = {
  name: "testimonials",
  title: "Testimonial sections",
  short: "Testimonials",
  description:
    "What customers say, in their own words: a lead quote with two smaller ones, one featured story with its result, a wall of short quotes, or a carousel that shows one at a time.",
  keywords: ["shadcn testimonials", "testimonial section", "testimonial carousel", "customer quotes wall"],
  group: "marketing",
  order: 7,
  blocks: [
    { id: "grid", title: "Lead quote and two more", description: "One large quote in a card beside two smaller ones with star ratings, each with the person's initials, name and role.", height: 780 },
    { id: "featured", title: "Featured story", description: "One large quote with the person, their role and their company's wordmark, and the result it brought beside it in big figures.", height: 610 },
    { id: "wall", title: "Wall of quotes", description: "A masonry wall of twelve short quotes of different lengths under a heading and an overall rating.", height: 1300 },
    { id: "carousel", title: "Carousel", description: "One quote at a time with previous and next buttons and position dots. No autoplay, arrow keys work, and each change is announced politely.", height: 790 },
  ],
}

export default meta
