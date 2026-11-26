// The sample photographs, by key. Point a key at your own photo (a path under public/ or a URL), or
// give a product new keys in data.ts. Installed, the samples load from dresscodeui.com.
// Product shots are on pure white: the cards blend them into the theme's card color.
const KEYS = [
  "apron-natural", "board-oak", "bottle-lineup", "bottle-stone", "bowls-oat", "candle", "duvet-oat", "jars", "kettle-black",
  "napkins-sage", "nonstick-cream", "pant-grey", "plates-sage", "plates-trio", "sheets-white", "skillet-clay", "soap",
  "sweater-charcoal", "sweater-moss", "sweater-oat", "tee-white", "throw-rust", "towel-sand", "weekender-olive",
  "model-front", "model-back", "knit-detail", "model-kitchen",
  "hero-table", "room-bedroom", "story-skillet", "story-workshop",
  "dept-kitchen", "dept-bedding", "dept-bath", "dept-apparel", "dept-bags", "dept-gifts",
  "post-linen-wash", "post-cast-iron", "post-linen-guide",
] as const

export const PHOTOS: Record<string, string> = Object.fromEntries(KEYS.map((k) => [k, `/ecommerce/${k}.webp`]))

/** Photos that are product shots on white (blended into the card), not scenes. */
export const ON_WHITE = new Set<string>(KEYS.slice(0, 24))

export const photo = (key: string) => PHOTOS[key] ?? key
