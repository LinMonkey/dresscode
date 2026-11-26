// Everything the E-commerce store sells and says lives here: the brand, the store's rules (free
// shipping, returns, taxes, codes), the departments, 20 products with their colors, sizes, stock and
// copy, reviews, the journal, the help pages and a sample customer. Swap them for yours; every page
// reads from this file. Photos are keys into PHOTOS (assets.ts).
// HOME picks the home page and the look of every page: "department" (a big search, departments and
// rows of products, for a store with many lines) or "brand" (a full-bleed photograph, a serif masthead
// and stories, for a brand that makes its own things).

export type Variant = "department" | "brand"
export const HOME: Variant = "department"

export const BRAND = {
  name: "Hollis",
  legal: "Hollis Goods Co.",
  city: "Portland, Oregon",
  since: 2018,
  tagline: "Well-made things for everyday living.",
  email: "help@hollis.example",
  phone: "(555) 014-2290",
  hours: "Mon–Fri 8–5 PT",
  address: "2240 NW Raleigh Street, Portland, OR 97210",
}

/** The store's rules. Prices are US dollars. */
export const STORE = {
  currency: "USD",
  /** Free standard shipping from this subtotal (after discounts). */
  freeShippingOver: 75,
  standardShipping: 8,
  expressShipping: 15,
  /** Business days. */
  standardDays: [3, 5] as const,
  expressDays: [1, 2] as const,
  returnDays: 30,
  trialNights: 100,
  /** "or 4 interest-free payments of $32": your pay-later provider's split. 0 hides the line. */
  installments: 4,
  /** Stock at or under this shows "Only N left". */
  lowStock: 5,
  /** Show 1–5 star ratings on reviews and cards. Off: the reviews speak for themselves. */
  showRatings: false,
  /** The number the next order gets. */
  nextOrder: 1048,
  /** Dates in the sample (shipping estimates use the visitor's own today). */
  today: "2026-11-26",
}

export const NOTICE = {
  department: "Free shipping on orders over $75 · Free 30-day returns",
  brand: "Free shipping over $75 · Try our bedding for 100 nights",
}

/** Codes the checkout takes. percent: off the merchandise. */
export const DISCOUNTS: Record<string, { percent: number; label: string }> = {
  WELCOME10: { percent: 10, label: "10% off your first order" },
}

/** Gift cards and their balance, for the checkout's gift card tab. */
export const GIFT_CARDS: Record<string, number> = {
  "HOLLIS-GIFT-5000": 50,
}

/** Sales tax by state, in percent of the merchandise after discounts. Sample rates: use your tax
 *  service's numbers. States not listed use DEFAULT_TAX. */
export const TAX_RATES: Record<string, number> = {
  NY: 8.875, CA: 7.25, OR: 0, WA: 6.5, TX: 6.25, IL: 6.25, MA: 6.25, NJ: 6.625, PA: 6, FL: 6, CO: 2.9, MT: 0, NH: 0, DE: 0, AK: 0,
}
export const DEFAULT_TAX = 6

export const STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"],
  ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"],
  ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
]

/* Departments and collections ------------------------------------------------------------------ */

export type CategoryId = "kitchen-dining" | "bedding" | "bath-body" | "apparel" | "bags-travel"

export type Category = {
  id: CategoryId
  name: string
  /** The shorter name for tabs and tight spots. */
  short: string
  blurb: string
  photo: string
  /** The colored band on its products' pages, unless a product has its own. */
  why: Why
}

export type Why = { title: string; facts: [string, string][] }

export const CATEGORIES: Category[] = [
  {
    id: "kitchen-dining",
    name: "Kitchen & Dining",
    short: "Kitchen",
    blurb: "Stoneware, cast iron and linen for the table you use every day.",
    photo: "dept-kitchen",
    why: { title: "Made to be used", facts: [["Portugal", "Stoneware thrown and glazed by one family pottery."], ["450°F", "Plates and bowls go in the oven, dishwasher and microwave."], ["Lifetime", "Our cast iron is guaranteed for as long as you cook."]] },
  },
  {
    id: "bedding",
    name: "Bedding",
    short: "Bedding",
    blurb: "Washed linen and crisp percale, cut and sewn in Portugal.",
    photo: "dept-bedding",
    why: { title: "Why our linen", facts: [["100%", "European flax, grown in France and Belgium."], ["3×", "Stonewashed before it ships, so it arrives soft."], ["100 nights", "Sleep on it. Send it back if it isn't right."]] },
  },
  {
    id: "bath-body",
    name: "Bath & Body",
    short: "Bath",
    blurb: "Waffle towels that dry fast, and cedar and fig for the sink.",
    photo: "dept-bath",
    why: { title: "For the bathroom", facts: [["600 gsm", "Waffle weave that dries in half the time of terry."], ["Refillable", "Glass bottles, and refills in paper."], ["No synthetics", "Long-staple cotton and plant-based soap."]] },
  },
  {
    id: "apparel",
    name: "Apparel",
    short: "Apparel",
    blurb: "Merino, organic cotton and linen to wear around the house and out of it.",
    photo: "dept-apparel",
    why: { title: "Why merino", facts: [["18.5 micron", "Fine enough to wear against bare skin."], ["Cold wash", "Machine washable on the wool cycle."], ["No blends", "No polyester, and no plastic in the packaging."]] },
  },
  {
    id: "bags-travel",
    name: "Bags & Travel",
    short: "Travel",
    blurb: "Waxed canvas and steel that keep up with a long weekend.",
    photo: "dept-bags",
    why: { title: "Built for the trip", facts: [["16 oz", "Heavy cotton canvas, waxed to shed rain."], ["Lifetime", "Free repairs on straps and zips."], ["24 hours", "Cold stays cold in our bottle for a full day."]] },
  },
]

/** Collections that cut across departments. Their products are picked in `inCollection` (site.ts). */
export const COLLECTIONS = {
  gifts: { name: "Gifts", blurb: "Things we'd be glad to unwrap, most under $75.", photo: "dept-gifts" },
  sale: { name: "Sale", blurb: "The Ceramic Nonstick Pan and the Wool Throw, 20% off while they last.", photo: "dept-bedding" },
  new: { name: "New arrivals", blurb: "Just in: merino knits, a gooseneck kettle, linen napkins and a canvas weekender.", photo: "dept-apparel" },
} as const

export type CollectionId = keyof typeof COLLECTIONS

/* Colors -------------------------------------------------------------------------------------- */

/** The color families the shop filters by; each product color belongs to one. */
export const FAMILIES: { name: string; hex: string }[] = [
  { name: "Oat", hex: "#D8CBB2" },
  { name: "Sage", hex: "#A3AE94" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Clay", hex: "#B4624A" },
  { name: "Forest", hex: "#2F4A3A" },
  { name: "Black", hex: "#1C1C1C" },
  { name: "White", hex: "#F5F3EE" },
  { name: "Sand", hex: "#D9C4A1" },
  { name: "Moss", hex: "#687148" },
  { name: "Rust", hex: "#A0522D" },
  { name: "Grey", hex: "#B8B8B5" },
  { name: "Navy", hex: "#1F2B45" },
  { name: "Olive", hex: "#6B6A3C" },
  { name: "Cream", hex: "#EFE8D8" },
]

export type Color = {
  name: string
  hex: string
  /** The filter family; the name when it is one. */
  family?: string
  /** Drawn as a check instead of a flat dot. */
  check?: boolean
  /** Photo keys for this color; the product's own when missing. */
  photos?: string[]
}

const c = (name: string, hex: string, more: Partial<Color> = {}): Color => ({ name, hex, ...more })

/* Products ------------------------------------------------------------------------------------ */

export type Material = "Stoneware" | "Cast iron" | "Aluminum" | "Stainless steel" | "Glass" | "Linen" | "Oak" | "Cotton" | "Wool" | "Merino wool" | "Soy wax" | "Canvas"
export const MATERIALS: Material[] = ["Stoneware", "Cast iron", "Linen", "Cotton", "Merino wool", "Wool", "Glass", "Oak", "Stainless steel", "Aluminum", "Canvas", "Soy wax"]

export type Size = { name: string; /** When it costs more (or less) than the product's price. */ price?: number; /** The cart's longer name. */ label?: string }

export type Product = {
  slug: string
  name: string
  category: CategoryId
  /** The price of the first size, in dollars. */
  price: number
  /** The price before the sale; the card shows both and the "−20%". */
  compareAt?: number
  badge?: "New" | "Bestseller"
  /** Best-selling order, 1 first. */
  rank: number
  /** ISO date it went on sale, for "Newest". */
  added: string
  material?: Material
  colors: Color[]
  sizes?: Size[]
  /** "Size", "Length"… the size picker's label. */
  sizeLabel?: string
  /** Stock by variant ("Oat / XL", "Clay", "King", "" for a product with neither); 24 when missing. */
  stock?: Record<string, number>
  /** Photo keys: the cover, then the one the card shows on hover. */
  photos: string[]
  /** The product page's pictures (all colors), when there are more than the cover. */
  gallery?: string[]
  summary: string
  details: string[]
  care: string[]
  /** A line under the sizes. */
  fitNote?: string
  /** Where the dots sit on "How it fits" and "Feels": -1 to 1. Apparel only. */
  fit?: { size: number; feel: number }
  /** Model's height and size, on the first photo. */
  model?: string
  /** The colored band; the department's when missing. */
  why?: Why
  /** "Pairs well with": slugs. */
  pairs: string[]
  /** "You may also like": slugs. */
  also: string[]
  /** In the Gifts collection. */
  gift?: boolean
  /** Extra words search should match. */
  keywords?: string
}

const OAT = "#D8CBB2", SAGE = "#A3AE94", CHARCOAL = "#3A3A3A", CLAY = "#B4624A", FOREST = "#2F4A3A", BLACK = "#1C1C1C", CREAM = "#EFE8D8"
const STONE = "#DCD6CB", STEEL = "#B9BBBD", NATURAL = "#D9CDB8", RUST = "#A0522D", INK = "#1F2A3A", WHITE = "#F5F3EE", TERRACOTTA = "#C26A4A"
const SAND = "#D9C4A1", MOSS = "#687148", HEATHER = "#B8B8B5", NAVY = "#1F2B45", OLIVE = "#6B6A3C"
const APPAREL = ["XS", "S", "M", "L", "XL"].map((name) => ({ name }))

export const PRODUCTS: Product[] = [
  {
    slug: "stoneware-dinner-plates",
    name: "Stoneware Dinner Plates, Set of 4",
    category: "kitchen-dining",
    price: 64,
    badge: "Bestseller",
    rank: 2,
    added: "2023-03-14",
    material: "Stoneware",
    colors: [c("Sage", SAGE, { photos: ["plates-sage", "plates-trio", "hero-table"] }), c("Oat", OAT, { photos: ["plates-trio", "hero-table"] }), c("Charcoal", CHARCOAL, { photos: ["plates-trio", "hero-table"] })],
    photos: ["plates-sage", "plates-trio"],
    summary: "Matte stoneware plates, 10.5 in across, glazed by hand in Portugal.",
    details: ["10.5 in across and 1 in tall; four to a set", "Matte reactive glaze, so no two plates are quite alike", "Thrown from local stoneware clay in Alcobaça, Portugal", "Dishwasher, microwave and oven safe to 450°F"],
    care: ["Dishwasher safe; washing by hand keeps the glaze matte longer", "Avoid going straight from the fridge to a hot oven", "Cutlery can leave grey marks: a paste of baking soda lifts them"],
    pairs: ["stoneware-bowls", "linen-napkins", "oak-cutting-board"],
    also: ["stoneware-bowls", "linen-napkins", "glass-storage-jars", "cast-iron-skillet"],
    keywords: "dinnerware dishes plate tableware",
  },
  {
    slug: "stoneware-bowls",
    name: "Stoneware Bowls, Set of 4",
    category: "kitchen-dining",
    price: 56,
    rank: 11,
    added: "2023-03-14",
    material: "Stoneware",
    colors: [c("Oat", OAT), c("Sage", SAGE), c("Charcoal", CHARCOAL)],
    photos: ["bowls-oat", "hero-table"],
    gallery: ["bowls-oat", "hero-table", "plates-trio"],
    summary: "Deep stoneware bowls for soup, grains and cereal, 6.5 in across.",
    details: ["6.5 in across, 3 in deep, holds 24 oz", "Speckled matte glaze outside, glossy inside", "Stack neatly with the dinner plates", "Dishwasher, microwave and oven safe to 450°F"],
    care: ["Dishwasher safe", "Let a hot bowl cool before it meets cold water", "Baking soda lifts cutlery marks"],
    pairs: ["stoneware-dinner-plates", "linen-napkins", "glass-storage-jars"],
    also: ["stoneware-dinner-plates", "linen-napkins", "gooseneck-kettle", "oak-cutting-board"],
    gift: false,
    keywords: "dinnerware soup cereal bowl tableware",
  },
  {
    slug: "cast-iron-skillet",
    name: "Enameled Cast Iron Skillet",
    category: "kitchen-dining",
    price: 95,
    rank: 6,
    added: "2022-09-01",
    material: "Cast iron",
    colors: [c("Clay", CLAY), c("Forest", FOREST), c("Black", BLACK)],
    sizes: [{ name: "10 in", label: "10 in" }, { name: "12 in", price: 120, label: "12 in" }],
    photos: ["skillet-clay", "story-skillet"],
    gallery: ["skillet-clay", "story-skillet", "post-cast-iron"],
    summary: "Enameled cast iron that goes from stove to oven to table. No seasoning, no fuss.",
    details: ["Black satin enamel inside that gets better with use", "Two pouring lips and a helper handle", "Works on gas, electric, induction and in the oven to 500°F", "10 in weighs 5.1 lb; 12 in weighs 6.6 lb"],
    care: ["Wash by hand in warm, soapy water", "Heat slowly; cast iron holds heat for a long time", "Guaranteed for life against cracks and chips from normal use"],
    why: { title: "One pan for forty years", facts: [["Lifetime", "Guaranteed against cracks and chipping."], ["500°F", "Stove to oven to table in one pan."], ["No seasoning", "The satin enamel never needs oiling."]] },
    pairs: ["linen-apron", "oak-cutting-board", "gooseneck-kettle"],
    also: ["ceramic-nonstick-pan", "gooseneck-kettle", "oak-cutting-board", "linen-apron"],
    gift: true,
    keywords: "pan frying pan cookware skillet",
  },
  {
    slug: "ceramic-nonstick-pan",
    name: "Ceramic Nonstick Pan, 11 in",
    category: "kitchen-dining",
    price: 88,
    compareAt: 110,
    rank: 7,
    added: "2024-02-20",
    material: "Aluminum",
    colors: [c("Cream", CREAM), c("Sage", SAGE)],
    photos: ["nonstick-cream", "story-skillet"],
    summary: "A light, quick-heating pan with a ceramic coating and an oak handle.",
    details: ["11 in across, 2.3 lb", "Ceramic nonstick coating made without PFAS", "Heavy aluminum core that heats evenly and fast", "Oak handle stays cool on the stove"],
    care: ["Wash by hand; a soft sponge keeps the coating smooth", "Low to medium heat is all it needs", "Not for the oven (the handle is oak)"],
    pairs: ["linen-apron", "oak-cutting-board", "cast-iron-skillet"],
    also: ["cast-iron-skillet", "gooseneck-kettle", "linen-apron", "glass-storage-jars"],
    keywords: "frying pan cookware nonstick",
  },
  {
    slug: "gooseneck-kettle",
    name: "Gooseneck Kettle, 1 L",
    category: "kitchen-dining",
    price: 79,
    badge: "New",
    rank: 8,
    added: "2026-11-12",
    material: "Stainless steel",
    colors: [c("Matte Black", BLACK, { family: "Black" }), c("Stone", STONE, { family: "Grey" }), c("Brushed Steel", STEEL, { family: "Grey" })],
    photos: ["kettle-black", "story-skillet"],
    summary: "A stovetop kettle with a slow, steady pour for coffee and tea.",
    details: ["Holds 1 L; fill to 0.8 L for pour-over", "A thin gooseneck spout for a slow, even pour", "Works on gas, electric and induction", "Stainless steel body; the handle stays cool"],
    care: ["Rinse and dry after use", "Descale with a cup of vinegar in water once a month", "Never heat it empty"],
    pairs: ["stoneware-bowls", "glass-storage-jars", "linen-napkins"],
    also: ["glass-storage-jars", "cast-iron-skillet", "stoneware-bowls", "insulated-bottle"],
    gift: true,
    keywords: "coffee tea pour over kettle",
  },
  {
    slug: "glass-storage-jars",
    name: "Glass Storage Jars, Set of 3",
    category: "kitchen-dining",
    price: 38,
    rank: 14,
    added: "2023-06-02",
    material: "Glass",
    colors: [],
    photos: ["jars", "hero-table"],
    summary: "Three heavy glass jars with oak lids, for oats, coffee and pasta.",
    details: ["Small 16 oz, medium 32 oz, tall 54 oz", "Borosilicate glass that shrugs off hot water", "Oak lids with a silicone seal", "They stack when they're empty"],
    care: ["Glass in the dishwasher; wipe the lids by hand", "Oil the lids once a season with food-safe oil"],
    pairs: ["gooseneck-kettle", "stoneware-bowls", "oak-cutting-board"],
    also: ["gooseneck-kettle", "stoneware-bowls", "linen-napkins", "oak-cutting-board"],
    gift: true,
    keywords: "pantry storage jar canister",
  },
  {
    slug: "linen-apron",
    name: "Linen Apron",
    category: "kitchen-dining",
    price: 42,
    rank: 15,
    added: "2023-10-10",
    material: "Linen",
    colors: [c("Natural", NATURAL, { family: "Oat" }), c("Rust", RUST), c("Ink", INK, { family: "Navy" })],
    photos: ["apron-natural", "story-skillet"],
    summary: "A heavy washed-linen apron with two deep pockets. One size fits most.",
    details: ["One size: 34 in long, ties adjust the fit", "Two front pockets and a towel loop", "Heavy 260 gsm washed linen", "Cut and sewn in Portugal"],
    care: ["Machine wash warm with like colors", "Tumble dry low or line dry", "Gets softer with every wash"],
    pairs: ["cast-iron-skillet", "linen-napkins", "oak-cutting-board"],
    also: ["linen-napkins", "cast-iron-skillet", "oak-cutting-board", "ceramic-nonstick-pan"],
    gift: true,
    keywords: "kitchen apron linen",
  },
  {
    slug: "oak-cutting-board",
    name: "Oak Cutting Board",
    category: "kitchen-dining",
    price: 68,
    rank: 16,
    added: "2023-10-10",
    material: "Oak",
    colors: [],
    sizes: [{ name: "Medium", label: "Medium, 16 × 10 in" }, { name: "Large", price: 88, label: "Large, 20 × 12 in" }],
    sizeLabel: "Size",
    photos: ["board-oak", "hero-table"],
    gallery: ["board-oak", "hero-table"],
    summary: "Solid white oak, finished with oil and wax, to chop on and to serve from.",
    details: ["Medium 16 × 10 in, Large 20 × 12 in; 1 in thick", "One piece of solid white oak", "A hanging hole and rounded corners", "Finished with food-safe oil and beeswax"],
    care: ["Wash by hand and dry standing up", "Oil it once a month, or when it looks pale", "Never in the dishwasher"],
    pairs: ["stoneware-dinner-plates", "linen-napkins", "cast-iron-skillet"],
    also: ["cast-iron-skillet", "linen-apron", "glass-storage-jars", "stoneware-dinner-plates"],
    gift: true,
    keywords: "chopping board serving board wood",
  },
  {
    slug: "linen-napkins",
    name: "Linen Napkins, Set of 4",
    category: "kitchen-dining",
    price: 36,
    badge: "New",
    rank: 13,
    added: "2026-11-10",
    material: "Linen",
    colors: [c("Sage", SAGE), c("Natural", NATURAL, { family: "Oat" }), c("Rust", RUST), c("White", WHITE)],
    photos: ["napkins-sage", "hero-table"],
    gallery: ["napkins-sage", "hero-table"],
    summary: "Stonewashed linen napkins with a soft frayed edge, four to a set.",
    details: ["20 × 20 in each; four to a set", "Stonewashed European linen", "Frayed edges that stay put after washing", "Cut and sewn in Portugal"],
    care: ["Machine wash warm", "Tumble dry low; no ironing needed", "Gets softer with every wash"],
    pairs: ["stoneware-dinner-plates", "stoneware-bowls", "linen-apron"],
    also: ["stoneware-dinner-plates", "linen-apron", "stoneware-bowls", "cedar-fig-candle"],
    gift: true,
    keywords: "table linen napkin dinner",
  },
  {
    slug: "washed-linen-duvet-cover",
    name: "Washed Linen Duvet Cover",
    category: "bedding",
    price: 248,
    badge: "Bestseller",
    rank: 1,
    added: "2021-04-01",
    material: "Linen",
    colors: [c("Oat", OAT), c("Sage", SAGE), c("Terracotta", TERRACOTTA, { family: "Clay" }), c("White", WHITE)],
    sizes: [{ name: "Full/Queen", label: "Full/Queen, 90 × 92 in" }, { name: "King", price: 288, label: "King, 106 × 92 in" }],
    photos: ["duvet-oat", "room-bedroom"],
    gallery: ["duvet-oat", "room-bedroom", "dept-bedding", "post-linen-guide"],
    summary: "Stonewashed European flax that gets softer every night. Two pillowcases included.",
    details: ["Full/Queen 90 × 92 in, King 106 × 92 in, with two pillowcases", "100% European flax, 170 gsm", "Coconut buttons and inside corner ties", "Cut and sewn in Portugal"],
    care: ["Machine wash warm, gentle cycle", "Tumble dry low and take it out a little damp", "No ironing: the creases are the point"],
    fitNote: "Fits standard duvets and comforters up to 12 in thick.",
    pairs: ["percale-sheet-set", "wool-throw", "cedar-fig-candle"],
    also: ["percale-sheet-set", "wool-throw", "cedar-fig-candle", "waffle-bath-towel"],
    keywords: "bedding duvet cover comforter linen bed",
  },
  {
    slug: "percale-sheet-set",
    name: "Percale Sheet Set",
    category: "bedding",
    price: 149,
    rank: 4,
    added: "2021-04-01",
    material: "Cotton",
    colors: [c("White", WHITE), c("Stone", STONE, { family: "Grey" }), c("Sage", SAGE)],
    sizes: [{ name: "Full" }, { name: "Queen", price: 169 }, { name: "King", price: 189 }],
    photos: ["sheets-white", "room-bedroom"],
    summary: "Crisp, cool long-staple cotton percale: a fitted sheet, a flat sheet and two pillowcases.",
    details: ["Fitted sheet, flat sheet and two pillowcases", "Long-staple cotton percale, 300 thread count", "Fitted sheet fits mattresses up to 16 in deep", "Woven and sewn in Portugal"],
    care: ["Machine wash warm", "Tumble dry low, or line dry for the crispest feel", "Wash before first use"],
    pairs: ["washed-linen-duvet-cover", "wool-throw", "cedar-fig-candle"],
    also: ["washed-linen-duvet-cover", "wool-throw", "waffle-bath-towel", "cedar-fig-candle"],
    keywords: "bedding sheets cotton bed",
  },
  {
    slug: "wool-throw",
    name: "Wool Throw",
    category: "bedding",
    price: 108,
    compareAt: 135,
    rank: 10,
    added: "2024-10-01",
    material: "Wool",
    colors: [c("Rust check", RUST, { family: "Rust", check: true }), c("Cream check", CREAM, { family: "Cream", check: true })],
    photos: ["throw-rust", "room-bedroom"],
    gallery: ["throw-rust", "room-bedroom"],
    summary: "A heavy lambswool throw in a big check, with a knotted fringe.",
    details: ["51 × 71 in, 2.2 lb", "100% lambswool, brushed for a soft hand", "Hand-knotted fringe", "Woven in Portugal"],
    care: ["Dry clean, or hand wash cold and dry flat", "Air it outside to freshen it", "Store with a cedar block"],
    pairs: ["washed-linen-duvet-cover", "cedar-fig-candle", "merino-crew-sweater"],
    also: ["washed-linen-duvet-cover", "cedar-fig-candle", "percale-sheet-set", "merino-crew-sweater"],
    gift: true,
    keywords: "blanket throw wool plaid",
  },
  {
    slug: "waffle-bath-towel",
    name: "Waffle Bath Towel",
    category: "bath-body",
    price: 36,
    rank: 3,
    added: "2022-01-15",
    material: "Cotton",
    colors: [c("Sand", SAND), c("White", WHITE), c("Moss", MOSS)],
    sizes: [{ name: "Bath towel", label: "Bath towel" }, { name: "Set of 4", price: 98, label: "Set of 4: 2 bath, 2 hand" }],
    sizeLabel: "Set",
    photos: ["towel-sand", "dept-bath"],
    gallery: ["towel-sand", "dept-bath"],
    summary: "A light waffle-weave towel that dries fast and never smells musty.",
    details: ["Bath towel 30 × 56 in; hand towel 18 × 30 in", "Long-staple cotton waffle weave, 600 gsm", "Dries in half the time of terry", "Woven in Portugal"],
    care: ["Machine wash warm; no fabric softener", "Tumble dry low", "The waffle gets deeper after the first few washes"],
    pairs: ["cedar-fig-hand-soap", "cedar-fig-candle", "organic-cotton-lounge-pant"],
    also: ["cedar-fig-hand-soap", "cedar-fig-candle", "percale-sheet-set", "everyday-tee"],
    keywords: "towel bath bathroom",
  },
  {
    slug: "cedar-fig-hand-soap",
    name: "Cedar & Fig Hand Soap, 12 oz",
    category: "bath-body",
    price: 24,
    rank: 17,
    added: "2023-05-05",
    material: "Glass",
    colors: [],
    photos: ["soap", "dept-bath"],
    gallery: ["soap", "dept-bath"],
    summary: "A plant-based hand soap that smells of cedarwood and ripe fig, in amber glass.",
    details: ["12 oz in a refillable amber glass bottle", "Plant-based and gentle on hands", "Notes of cedarwood, fig leaf and vetiver", "Refills come in a paper pouch"],
    care: ["Keep out of direct sun", "Rinse the bottle before refilling"],
    pairs: ["cedar-fig-candle", "waffle-bath-towel", "linen-napkins"],
    also: ["cedar-fig-candle", "waffle-bath-towel", "glass-storage-jars", "linen-apron"],
    gift: true,
    keywords: "soap hand wash scent",
  },
  {
    slug: "cedar-fig-candle",
    name: "Cedar & Fig Candle, 8 oz",
    category: "bath-body",
    price: 42,
    rank: 9,
    added: "2023-05-05",
    material: "Soy wax",
    colors: [],
    stock: { "": 4 },
    photos: ["candle", "room-bedroom"],
    gallery: ["candle", "room-bedroom"],
    summary: "Soy wax and a cotton wick in amber glass, with an oak lid. Burns about 50 hours.",
    details: ["8 oz, about 50 hours", "Soy wax and a cotton wick", "Notes of cedarwood, fig leaf and vetiver", "Poured in Portland, Oregon"],
    care: ["Trim the wick to 1/4 in before each burn", "Burn for no more than 4 hours at a time", "Never leave a burning candle alone"],
    pairs: ["cedar-fig-hand-soap", "wool-throw", "washed-linen-duvet-cover"],
    also: ["cedar-fig-hand-soap", "wool-throw", "linen-napkins", "waffle-bath-towel"],
    gift: true,
    keywords: "candle scent fragrance",
  },
  {
    slug: "merino-crew-sweater",
    name: "Merino Crew Sweater",
    category: "apparel",
    price: 128,
    badge: "New",
    rank: 5,
    added: "2026-11-05",
    material: "Merino wool",
    colors: [
      c("Oat", OAT, { photos: ["model-front", "model-back", "knit-detail", "model-kitchen"] }),
      c("Charcoal", CHARCOAL, { photos: ["sweater-charcoal", "knit-detail"] }),
      c("Moss", MOSS, { photos: ["sweater-moss", "knit-detail"] }),
    ],
    sizes: APPAREL,
    stock: { "Oat / XL": 0, "Oat / S": 3 },
    photos: ["sweater-oat", "model-front"],
    summary: "A midweight crew in extra-fine merino. Knit in Portugal.",
    details: ["Relaxed fit through the body", "100% extra-fine merino, 18.5 micron", "Ribbed collar, cuffs and hem", "Midweight 12-gauge knit"],
    care: ["Machine wash cold on the wool cycle", "Dry flat; never tumble dry", "A sweater comb takes care of any pilling"],
    fitNote: "Fits true to size. Size down for a closer fit.",
    fit: { size: 0, feel: 0.2 },
    model: "Model is 5'10\" and wears S",
    pairs: ["organic-cotton-lounge-pant", "everyday-tee", "canvas-weekender"],
    also: ["everyday-tee", "organic-cotton-lounge-pant", "wool-throw", "insulated-bottle"],
    gift: true,
    keywords: "sweater jumper knit wool merino",
  },
  {
    slug: "organic-cotton-lounge-pant",
    name: "Organic Cotton Lounge Pant",
    category: "apparel",
    price: 78,
    rank: 18,
    added: "2025-09-15",
    material: "Cotton",
    colors: [c("Heather Grey", HEATHER, { family: "Grey" }), c("Navy", NAVY)],
    sizes: APPAREL,
    photos: ["pant-grey", "dept-apparel"],
    summary: "A soft, straight-leg pant in brushed organic cotton, with a drawstring waist.",
    details: ["Straight leg; 30 in inseam on size M", "Brushed organic cotton fleece, 320 gsm", "Drawstring waist and two side pockets", "Sewn in Portugal"],
    care: ["Machine wash cold", "Tumble dry low", "Wash with similar colors"],
    fitNote: "Fits true to size, with room through the leg.",
    fit: { size: 0, feel: 0.1 },
    pairs: ["merino-crew-sweater", "everyday-tee", "waffle-bath-towel"],
    also: ["everyday-tee", "merino-crew-sweater", "wool-throw", "waffle-bath-towel"],
    keywords: "pants trousers joggers sweatpants lounge",
  },
  {
    slug: "everyday-tee",
    name: "Everyday Tee",
    category: "apparel",
    price: 38,
    rank: 12,
    added: "2025-09-15",
    material: "Cotton",
    colors: [c("White", WHITE), c("Black", BLACK), c("Oat", OAT)],
    sizes: [...APPAREL, { name: "XXL" }],
    photos: ["tee-white", "dept-apparel"],
    summary: "A heavy organic cotton tee with a close neck that keeps its shape.",
    details: ["Regular fit, slightly boxy", "Heavy 220 gsm organic cotton jersey", "Ribbed crew neck", "Sewn in Portugal"],
    care: ["Machine wash cold", "Tumble dry low or line dry", "Iron inside out if you like"],
    fitNote: "Fits true to size. Size up for a looser fit.",
    fit: { size: 0, feel: 0 },
    pairs: ["organic-cotton-lounge-pant", "merino-crew-sweater", "canvas-weekender"],
    also: ["merino-crew-sweater", "organic-cotton-lounge-pant", "insulated-bottle", "canvas-weekender"],
    keywords: "t-shirt tshirt tee top",
  },
  {
    slug: "canvas-weekender",
    name: "Canvas Weekender, 40 L",
    category: "bags-travel",
    price: 168,
    badge: "New",
    rank: 19,
    added: "2026-11-18",
    material: "Canvas",
    colors: [c("Olive", OLIVE), c("Sand", SAND), c("Black", BLACK)],
    photos: ["weekender-olive", "dept-bags"],
    gallery: ["weekender-olive", "dept-bags"],
    summary: "Waxed cotton canvas and dark brown leather, sized for three nights away.",
    details: ["40 L; 21 × 11 × 11 in", "16 oz waxed cotton canvas and full-grain leather handles", "Detachable shoulder strap and an inside zip pocket", "Fits under most airline seats"],
    care: ["Spot clean with a damp cloth", "Re-wax once a year to keep it shedding rain", "Free repairs on straps and zips, for life"],
    pairs: ["insulated-bottle", "merino-crew-sweater", "everyday-tee"],
    also: ["insulated-bottle", "merino-crew-sweater", "organic-cotton-lounge-pant", "everyday-tee"],
    gift: true,
    keywords: "bag duffel travel weekend holdall",
  },
  {
    slug: "insulated-bottle",
    name: "Insulated Bottle, 20 oz",
    category: "bags-travel",
    price: 34,
    rank: 20,
    added: "2024-05-20",
    material: "Stainless steel",
    colors: [c("Stone", STONE, { family: "Grey", photos: ["bottle-stone", "bottle-lineup"] }), c("Moss", MOSS, { photos: ["bottle-lineup"] }), c("Clay", CLAY, { photos: ["bottle-lineup"] }), c("Black", BLACK, { photos: ["bottle-lineup"] })],
    stock: { Clay: 0 },
    photos: ["bottle-stone", "bottle-lineup"],
    summary: "Double-walled steel with a bamboo lid: cold for 24 hours, hot for 12.",
    details: ["Holds 20 oz", "Double-walled stainless steel", "Cold for 24 hours, hot for 12", "Bamboo lid with a steel thread"],
    care: ["Wash by hand", "Not for the freezer or the microwave"],
    pairs: ["canvas-weekender", "everyday-tee", "gooseneck-kettle"],
    also: ["canvas-weekender", "gooseneck-kettle", "everyday-tee", "glass-storage-jars"],
    gift: true,
    keywords: "water bottle flask thermos",
  },
]

/* Reviews ------------------------------------------------------------------------------------- */

export type Review = {
  product: string
  title: string
  body: string
  name: string
  city?: string
  /** "Oat, size S" */
  variant: string
  /** For the size filter on apparel. */
  size?: string
  date: string
  /** 1–5, shown only with STORE.showRatings. */
  rating?: number
  /** On the brand home's "In their words". */
  featured?: boolean
}

export const REVIEWS: Review[] = [
  { product: "merino-crew-sweater", title: "Finally, a sweater that doesn't itch", body: "I usually can't wear wool on bare skin. I wear this one over a tank top all day.", name: "Hannah L.", variant: "Oat, size S", size: "S", date: "2026-11-12", rating: 5 },
  { product: "merino-crew-sweater", title: "Size down if you're between sizes", body: "It's roomy in the body. I'm usually a medium, and the small fits the way the photos look.", name: "Jordan K.", variant: "Charcoal, size S", size: "S", date: "2026-11-03", rating: 4 },
  { product: "merino-crew-sweater", title: "Held up after five washes", body: "No pilling yet. I wash it on the wool cycle and dry it flat.", name: "Sofia M.", variant: "Moss, size M", size: "M", date: "2026-10-28", rating: 5 },
  { product: "washed-linen-duvet-cover", title: "The first one is still the softest", body: "I bought one duvet cover in 2023. I now own three, and the first one is still the softest.", name: "Dana R.", city: "Seattle", variant: "Oat, Full/Queen", date: "2026-10-02", rating: 5, featured: true },
  { product: "washed-linen-duvet-cover", title: "Cool in summer, warm enough in winter", body: "We run hot. This is the only cover we haven't kicked off by two in the morning.", name: "Ellis P.", city: "Austin", variant: "White, King", date: "2026-08-19", rating: 5 },
  { product: "washed-linen-duvet-cover", title: "Order the size up if your duvet is thick", body: "Our down duvet is a big one and the Full/Queen was snug. The King fits it perfectly.", name: "Maya O.", city: "Denver", variant: "Sage, King", date: "2026-07-07", rating: 4 },
  { product: "cast-iron-skillet", title: "Heavy in the best way", body: "It went straight from the stove into the oven and onto the table. Heavy in the best way.", name: "Marcus T.", city: "Chicago", variant: "Clay, 10 in", date: "2026-09-21", rating: 5, featured: true },
  { product: "cast-iron-skillet", title: "Eggs slide right out", body: "Took a week to learn the heat. Now my eggs slide out with a little butter.", name: "Ana V.", city: "Phoenix", variant: "Black, 12 in", date: "2026-06-30", rating: 5 },
  { product: "waffle-bath-towel", title: "Dry by the next shower", body: "The waffle towels dry fast and never smell musty, even in our tiny bathroom.", name: "Priya S.", city: "Brooklyn", variant: "Sand, Set of 4", date: "2026-10-15", rating: 5, featured: true },
  { product: "waffle-bath-towel", title: "Thin but absorbent", body: "They look thin, but they take everything in. They take up half the space of my old towels too.", name: "Tom W.", city: "Boston", variant: "White, Bath towel", date: "2026-09-02", rating: 4 },
  { product: "stoneware-dinner-plates", title: "The glaze is lovely up close", body: "Every plate is a slightly different green. They look like they came from a market in Lisbon.", name: "Grace H.", city: "San Diego", variant: "Sage", date: "2026-10-09", rating: 5 },
  { product: "stoneware-dinner-plates", title: "Big enough for real dinners", body: "A full plate of pasta fits without sliding off the edge. Our old plates were too small.", name: "Owen D.", city: "Minneapolis", variant: "Charcoal", date: "2026-08-11", rating: 5 },
  { product: "gooseneck-kettle", title: "My pour-over got better", body: "The pour is so easy to control. My morning coffee is more even than it has ever been.", name: "Lina K.", city: "Portland", variant: "Matte Black", date: "2026-11-20", rating: 5 },
]

/* Journal ------------------------------------------------------------------------------------- */

export type Post = {
  slug: string
  title: string
  tag: string
  date: string
  minutes: number
  photo: string
  summary: string
  /** Paragraphs; a string that starts with "## " is a heading. */
  body: string[]
  products: string[]
}

export const POSTS: Post[] = [
  {
    slug: "how-to-wash-linen",
    title: "How to wash linen so it lasts",
    tag: "Care",
    date: "2026-11-18",
    minutes: 4,
    photo: "post-linen-wash",
    summary: "Warm water, a gentle cycle and a little patience: how to keep linen soft for twenty years.",
    body: [
      "Linen is one of the oldest fabrics there is, and one of the toughest. Treat it a little gently and a duvet cover will outlast the bed it's on. Here is how we wash ours.",
      "## Wash warm, not hot",
      "Use warm water, around 40°C (104°F), and the gentle cycle. Hot water won't get it cleaner; it just wears the fibers faster. Give the machine room: linen needs to move to come out clean.",
      "## Go easy on the soap",
      "Use half the detergent you think you need, and skip fabric softener and bleach. Softener coats the fibers and makes linen less absorbent, which is the opposite of what you bought it for.",
      "## Dry it low, or on a line",
      "Tumble dry on low and take it out while it's still a little damp. Shake it out and put it straight back on the bed; it will finish drying there and the creases will relax. On a sunny day, a washing line does it better than any machine.",
      "## Leave the iron in the closet",
      "Washed linen is meant to look lived in. If you like it crisp, iron it while it's damp, on the linen setting.",
    ],
    products: ["washed-linen-duvet-cover", "linen-napkins", "linen-apron"],
  },
  {
    slug: "seasoning-cast-iron",
    title: "Seasoning cast iron in four steps",
    tag: "Kitchen",
    date: "2026-11-06",
    minutes: 3,
    photo: "post-cast-iron",
    summary: "Our enameled skillet never needs it, but the bare pan you inherited does. Here's how.",
    body: [
      "Our Enameled Cast Iron Skillet has a satin enamel inside, so it never needs seasoning. But plenty of kitchens have a bare cast iron pan in a cupboard, rusty or sticky, waiting for an afternoon. This is that afternoon.",
      "## 1. Scrub it back",
      "Scrub the pan with hot water, a little soap and a stiff brush or steel wool until any rust is gone. Dry it completely on the stove over low heat.",
      "## 2. Oil it thinly",
      "Rub a teaspoon of neutral oil over every surface, inside and out, then wipe it all off with a paper towel as if you made a mistake. What's left is the right amount.",
      "## 3. Bake it upside down",
      "Put the pan upside down in a 450°F oven for an hour, with a sheet of foil on the rack below. Turn the oven off and let it cool inside.",
      "## 4. Repeat, then cook",
      "Do it three times for a good base. After that, the best seasoning is cooking: fry, sear and roast in it as often as you can.",
    ],
    products: ["cast-iron-skillet", "linen-apron", "oak-cutting-board"],
  },
  {
    slug: "percale-sateen-or-linen",
    title: "Percale, sateen or linen? A quick guide",
    tag: "Bedding",
    date: "2026-10-29",
    minutes: 6,
    photo: "post-linen-guide",
    summary: "How each one feels, who it suits and how it ages, from the people who sew all three.",
    body: [
      "Shopping for sheets means choosing a weave, and the words don't help much. Here's what they mean in bed.",
      "## Percale: crisp and cool",
      "Percale is a plain one-over-one-under weave of cotton. It feels like a freshly ironed shirt: matte, light and cool. If you sleep hot, or love that hotel-bed feeling, start here. Our Percale Sheet Set is 300 thread count, long-staple cotton.",
      "## Sateen: smooth and warm",
      "Sateen floats more threads on the surface, so it has a soft sheen and drapes closer to you. It's warmer than percale and a little less breathable. We don't make it, because we think percale and linen cover most sleepers better.",
      "## Linen: relaxed and textured",
      "Linen is woven from flax. It's the most breathable of the three and the most textured, and it gets softer every time you wash it. It never looks perfectly flat, and that's the charm. Our Washed Linen Duvet Cover is stonewashed three times so it arrives soft.",
      "## Or both",
      "Our own beds have percale sheets under a linen duvet cover: crisp where you lie, relaxed on top.",
    ],
    products: ["percale-sheet-set", "washed-linen-duvet-cover", "wool-throw"],
  },
]

/* Home pages ---------------------------------------------------------------------------------- */

export const HOME_DEPARTMENT = {
  hero: { title: "The table, reset.", text: "Matte stoneware in Sage, Oat and Charcoal, made in Portugal. Plates from $64 a set of four.", cta: "Shop tableware", href: "shop/kitchen-dining", photo: "hero-table" },
  promos: [
    { kicker: "", title: "Washed linen bedding", text: "Softer with every wash. Try it for 100 nights.", cta: "Shop bedding", href: "shop/bedding", photo: "duvet-oat" },
    { kicker: "Winter sale", title: "20% off", text: "The Ceramic Nonstick Pan and the Wool Throw, while they last.", cta: "Shop the sale", href: "shop/sale", photo: "nonstick-cream" },
  ],
  promises: ["Free shipping over $75", "Free 30-day returns", "100-night trial on bedding", "Lifetime warranty on cast iron"],
  /** Shop the room: hotspots on the photo, in % of its width and height. */
  room: {
    photo: "room-bedroom",
    title: "Shop the room",
    text: "Everything on this bed ships free.",
    items: [
      { slug: "washed-linen-duvet-cover", color: "Oat", size: "Full/Queen", at: [72, 32] as [number, number] },
      { slug: "wool-throw", color: "Rust check", at: [74, 66] as [number, number] },
      { slug: "cedar-fig-candle", at: [37, 37] as [number, number] },
    ],
  },
}

export const HOME_BRAND = {
  hero: { title: "Linen that gets better every night.", text: "Stonewashed European flax, cut and sewn in Portugal. Duvet covers from $248.", cta: "Shop bedding", href: "shop/bedding", link: "How it's made", linkHref: "about", photo: "room-bedroom", tag: "On the bed: Washed Linen Duvet Cover in Oat", tagHref: "products/washed-linen-duvet-cover" },
  rooms: [
    { name: "Bedroom", href: "shop/bedding", photo: "dept-bedding" },
    { name: "Bathroom", href: "shop/bath-body", photo: "dept-bath" },
    { name: "Kitchen", href: "shop/kitchen-dining", photo: "dept-kitchen" },
  ],
  band: { title: "Flax, water and time. Nothing else.", text: "Our linen is grown in France and Belgium, woven in Portugal, then washed three times so it arrives soft.", cta: "Read about our linen", href: "journal/percale-sateen-or-linen", facts: [["100%", "European flax"], ["3×", "stonewashed before it ships"], ["100 nights", "to try it at home"]] as [string, string][] },
  story: { kicker: "The Skillet", title: "One pan for the next forty years.", text: "Enameled cast iron that goes from stove to oven to table. No seasoning, no fuss, and a lifetime warranty.", slug: "cast-iron-skillet", photo: "story-skillet" },
  maker: { title: "Made by people we know.", text: "We work with four family-run workshops in Portugal and one foundry in France, and we visit each of them twice a year.", photo: "story-workshop" },
}

/* About, help ---------------------------------------------------------------------------------- */

export const ABOUT = {
  title: "Made by people we know.",
  lead: "Hollis started in 2018 with one linen duvet cover and a question: why is it so hard to buy things that last?",
  story: [
    "We were tired of sheets that pilled in a season and pans that lost their coating in a year. So we went looking for the people who still make things the slow way, and asked if they would make them for us.",
    "Today we work with four family-run workshops in Portugal and one foundry in France. We visit each of them twice a year, we pay for samples, and we order what we can sell, not what fills a container.",
    "Everything we sell is something we use at home. When we can't make it better than what's out there, we don't make it.",
  ],
  makers: [
    ["Linen", "A family workshop near Guimarães cuts and sews our bedding, napkins and aprons."],
    ["Stoneware", "A pottery in Alcobaça throws and glazes our plates and bowls by hand."],
    ["Knitwear", "A third-generation mill outside Porto knits our merino."],
    ["Towels", "A weaver in Barcelos makes our waffle towels on looms from the 1970s."],
    ["Cast iron", "A foundry in northern France casts and enamels our skillets."],
  ] as [string, string][],
  materials: [
    ["European flax", "Grown in France and Belgium, where the rain does the watering."],
    ["Merino wool", "Extra-fine 18.5 micron wool from mulesing-free farms."],
    ["Organic cotton", "Certified organic, long-staple, for our tees, pants and percale."],
    ["Recycled packaging", "Paper and card only. No plastic bags, no plastic tape."],
  ] as [string, string][],
}

export const FAQ: { id: string; title: string; items: [string, string][] }[] = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      ["How much is shipping?", "Standard shipping is free on orders over $75 and $8 below that. Express shipping is $15."],
      ["When will my order arrive?", "Standard orders arrive in 3–5 business days and express orders in 1–2. Orders placed before 1 PM Pacific ship the same day."],
      ["Do you ship outside the US?", "Not yet. We ship to all 50 states and DC, including PO boxes."],
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    items: [
      ["What is your return policy?", "Return anything unused within 30 days for a full refund. Returns are free: we email you a label."],
      ["How does the 100-night bedding trial work?", "Sleep on your bedding for up to 100 nights. If it isn't right, send it back, washed or not, and we refund you."],
      ["How do I start a return?", "Go to Account, open the order and choose Start a return. Or write to us with your order number and we'll do it for you."],
    ],
  },
  {
    id: "orders",
    title: "Orders",
    items: [
      ["Can I change or cancel my order?", "Yes, within an hour of placing it. After that it's usually packed, but write to us and we'll do our best."],
      ["Where is my order?", "Every order gets a tracking link by email when it ships. You can also look it up on Track order with your order number and email."],
      ["Do you gift wrap?", "Every order ships in plain brown paper. Add a gift note in your cart and we'll leave out the receipt."],
    ],
  },
  {
    id: "products",
    title: "Products & care",
    items: [
      ["What does the cast iron warranty cover?", "Cracks, chips and enamel failure from normal cooking, for as long as you own the pan."],
      ["How do I care for linen?", "Wash warm on a gentle cycle, skip the softener and dry on low. Our journal has a full guide."],
      ["Where are your products made?", "Most in Portugal, our skillets in France, and our candles in Portland, Oregon."],
    ],
  },
]

/* A sample customer and orders, for the account pages --------------------------------------- */

export const CUSTOMER = {
  first: "Sam",
  last: "Rivera",
  email: "sam.rivera@example.com",
  address: { line1: "48 Bergen Street", line2: "Apt 3", city: "Brooklyn", state: "NY", zip: "11201", country: "United States" },
}

export type OrderStatus = "Confirmed" | "Shipped" | "Delivered"

export type OrderLine = { slug: string; color?: string; size?: string; qty: number; price: number }

export type Order = {
  number: number
  date: string
  status: OrderStatus
  lines: OrderLine[]
  discount: number
  shipping: number
  tax: number
  /** "Standard · Arrives Nov 24" */
  delivery: string
  tracking?: string
  payment: string
  email: string
  address: typeof CUSTOMER.address
  name: string
}

export const ORDERS: Order[] = [
  {
    number: 1041,
    date: "2026-11-19",
    status: "Shipped",
    lines: [
      { slug: "linen-napkins", color: "Sage", qty: 1, price: 36 },
      { slug: "linen-apron", color: "Rust", qty: 1, price: 42 },
    ],
    discount: 0,
    shipping: 0,
    tax: 6.92,
    delivery: "Standard · Arrives Nov 25–27",
    tracking: "HLS-41790-2264",
    payment: "Card ending 1881",
    email: CUSTOMER.email,
    address: CUSTOMER.address,
    name: "Sam Rivera",
  },
  {
    number: 1031,
    date: "2026-10-30",
    status: "Delivered",
    lines: [
      { slug: "washed-linen-duvet-cover", color: "Oat", size: "Full/Queen", qty: 1, price: 248 },
      { slug: "percale-sheet-set", color: "White", size: "Queen", qty: 1, price: 169 },
    ],
    discount: 0,
    shipping: 0,
    tax: 37.01,
    delivery: "Standard · Delivered Nov 4",
    tracking: "HLS-31046-8820",
    payment: "Card ending 1881",
    email: CUSTOMER.email,
    address: CUSTOMER.address,
    name: "Sam Rivera",
  },
  {
    number: 1012,
    date: "2026-09-14",
    status: "Delivered",
    lines: [
      { slug: "waffle-bath-towel", color: "Sand", size: "Set of 4", qty: 1, price: 98 },
      { slug: "cedar-fig-hand-soap", qty: 1, price: 24 },
    ],
    discount: 0,
    shipping: 0,
    tax: 10.83,
    delivery: "Standard · Delivered Sep 18",
    tracking: "HLS-10128-5507",
    payment: "Card ending 1881",
    email: CUSTOMER.email,
    address: CUSTOMER.address,
    name: "Sam Rivera",
  },
]

/** The sample cart (the demo's "Sample cart" and the design's order). */
export const SAMPLE_CART = [
  { slug: "merino-crew-sweater", color: "Oat", size: "M", qty: 1 },
  { slug: "stoneware-dinner-plates", color: "Sage", qty: 1 },
  { slug: "cedar-fig-candle", qty: 1 },
]

export const GIFT_CARD = {
  amounts: [25, 50, 100, 150, 200],
  title: "Hollis Gift Card",
  text: "Emailed on the day you choose, with your note. Never expires, and works on everything.",
}
