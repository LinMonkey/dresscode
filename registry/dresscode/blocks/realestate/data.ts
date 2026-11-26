// Everything the Real estate site says lives here: the brokerage, its city and neighborhoods, the
// listings, the agents, the journal and the market numbers. Swap them for yours; every page reads
// from this file. Photos are keys into PHOTOS (assets.ts); give a listing your own photo URLs there.
// HOME picks the home page: "platform" (search first, for a brokerage or a local portal) or
// "boutique" (a full-bleed photograph and a few homes, for a private office or a single agent).

export type Variant = "platform" | "boutique"
export const HOME: Variant = "platform"

export const BRAND = {
  name: "Fieldhouse",
  legal: "Fieldhouse Realty",
  /** The boutique home's name (and its header). */
  private: "Fieldhouse Private",
  city: "Port Avery",
  since: 2009,
  agents: 40,
  phone: "(555) 347-1289",
  email: "hello@fieldhouse.example",
  address: "14 Quay Street, Port Avery",
  hours: "Mon–Sat, 9:00–18:00",
  tagline: "Find the home you'll grow into.",
  intro: "Homes for sale and rent across Port Avery, with agents who live on your street.",
  /** The boutique home. */
  privateTagline: "Homes with a sense of place.",
  privateIntro: "Private sales on the Westshore and in the hills of Bellmont.",
  license: "Licensed real estate broker · Lic. 01923-PA",
}

export type Status = "sale" | "rent" | "sold"
export type HomeType = "House" | "Condo" | "Townhouse" | "Loft"
export type Badge = "New" | "Just listed" | "Price cut" | "Open house" | "Pending"

export type Listing = {
  slug: string
  address: string
  unit?: string
  hood: string
  /** Asking price, or the monthly rent when status is "rent". */
  price: number
  status: Status
  badge?: Badge
  /** "Sat 1–3 PM"; shows on the card and the page. */
  openHouse?: string
  beds: number
  baths: number
  sqft: number
  /** Acres. */
  lot?: number
  type: HomeType
  year: number
  parking: string
  heating: string
  cooling: string
  hoa?: number
  /** The one line on cards and in search results. */
  summary: string
  description: string[]
  features: string[]
  /** Photo keys (assets.ts), the first is the cover. */
  photos: string[]
  /** Where the pin sits on the map, in % of its width and height. */
  at: [number, number]
  agent: string
  /** ISO date it was listed. */
  listed: string
  history: [string, string, number][]
  /** Shown on the boutique home and with the private office's look. */
  private?: boolean
  /** Floors, for the drawn floor plan. */
  floors: 1 | 2
  /** What "More filters" matches on. */
  tags: Feature[]
}

export const LISTINGS: Listing[] = [
  {
    slug: "908-cedar-heights-road",
    address: "908 Cedar Heights Road",
    hood: "cedar-heights",
    price: 940_000,
    status: "sale",
    badge: "New",
    openHouse: "Sat 1–3 PM",
    beds: 4,
    baths: 3,
    sqft: 2650,
    lot: 0.24,
    type: "House",
    year: 1998,
    parking: "2-car garage",
    heating: "Forced-air heating",
    cooling: "Central air",
    summary: "A two-story family house with a deep front porch and a garden that gets the evening sun.",
    description: [
      "A classic, well-kept house on one of the quietest streets in Cedar Heights. The main floor is open and bright: a living room with a fireplace, a dining room that looks onto the garden and a kitchen rebuilt in 2021 around a large marble island.",
      "Upstairs, the primary suite has a walk-in closet and its own bath, and three more bedrooms share a second bath. The back garden has a deck for dinners outside, raised beds and room for a swing set.",
    ],
    features: ["Kitchen renovated 2021", "Wood-burning fireplace", "Primary suite with walk-in closet", "Deck and raised garden beds", "Two blocks from Cedar Heights Elementary", "New roof 2019"],
    photos: ["cedar", "cedar-living", "cedar-kitchen", "cedar-dining", "cedar-bedroom", "cedar-yard", "cedar-porch"],
    at: [53, 36],
    agent: "maya-okafor",
    listed: "2026-11-20",
    history: [
      ["2026-11-20", "Listed", 940_000],
      ["2019-06-14", "Sold", 705_000],
      ["2012-03-02", "Sold", 512_000],
    ],
    floors: 2,
    tags: ["Garden", "Garage", "Fireplace"],
  },
  {
    slug: "12-pierline-avenue-5b",
    address: "12 Pierline Avenue",
    unit: "#5B",
    hood: "harbor-point",
    price: 1_240_000,
    status: "sale",
    badge: "Open house",
    openHouse: "Sat 1–3 PM",
    beds: 2,
    baths: 2,
    sqft: 1320,
    type: "Condo",
    year: 2017,
    parking: "1 deeded space",
    heating: "Radiant floor heating",
    cooling: "Central air",
    hoa: 640,
    summary: "A fifth-floor condo with floor-to-ceiling glass on the harbor and a balcony over the water.",
    description: [
      "Every room faces the harbor. The living room and kitchen open onto a balcony wide enough for a table for four; at night the ferry lights cross the whole window wall.",
      "Both bedrooms have their own bathrooms. The building has a doorman, a gym, bike storage and a roof terrace, and the ferry pier is a three-minute walk.",
    ],
    features: ["Harbor views from every room", "Balcony over the water", "Doorman and gym", "Deeded parking and storage", "Pets allowed"],
    photos: ["pierline", "cedar-kitchen", "cedar-bedroom", "cedar-dining"],
    at: [76, 78],
    agent: "daniel-reyes",
    listed: "2026-11-12",
    history: [
      ["2026-11-12", "Listed", 1_240_000],
      ["2021-08-30", "Sold", 1_010_000],
    ],
    floors: 1,
    tags: ["Water view", "Pets allowed"],
  },
  {
    slug: "41-linden-row",
    address: "41 Linden Row",
    hood: "old-mill",
    price: 685_000,
    status: "sale",
    badge: "Price cut",
    beds: 3,
    baths: 2,
    sqft: 1840,
    lot: 0.05,
    type: "Townhouse",
    year: 1904,
    parking: "Street parking",
    heating: "Hot-water radiators",
    cooling: "Mini-splits",
    summary: "A restored brick rowhouse with its original stair, new systems and a small walled garden.",
    description: [
      "Built in 1904 for the mill's foremen and restored down to the brick. The original staircase and pine floors stayed; the wiring, plumbing and windows are new.",
      "Three bedrooms on two upper floors, a kitchen that opens to a walled garden and a dry basement with room for a workshop.",
    ],
    features: ["Original 1904 staircase", "New wiring and plumbing 2023", "Walled garden", "Dry basement", "Walk to the Old Mill market"],
    photos: ["linden", "cedar-living", "cedar-kitchen", "cedar-bedroom"],
    at: [20, 47],
    agent: "priya-nair",
    listed: "2026-10-28",
    history: [
      ["2026-11-18", "Price cut", 685_000],
      ["2026-10-28", "Listed", 715_000],
      ["2015-05-11", "Sold", 398_000],
    ],
    floors: 2,
    tags: ["Garden"],
  },
  {
    slug: "77-bellmont-lane",
    address: "77 Bellmont Lane",
    hood: "bellmont",
    price: 2_450_000,
    status: "sale",
    badge: "Just listed",
    beds: 5,
    baths: 4.5,
    sqft: 4100,
    lot: 1.1,
    type: "House",
    year: 2016,
    parking: "3-car garage",
    heating: "Radiant floor heating",
    cooling: "Central air",
    summary: "A hillside house in wood and concrete with the whole bay in its windows.",
    description: [
      "Set into the slope above Bellmont, the house steps down the hill in three levels of wood, concrete and glass. The main floor is one long room that ends in a terrace over the bay.",
      "Five bedrooms, a study with its own entrance and a garden of pines and native grasses that needs almost nothing.",
    ],
    features: ["Bay views from every level", "Study with a separate entrance", "Native garden", "Heated terrace", "EV charging"],
    photos: ["bellmont", "saltmarsh-kitchen", "saltmarsh-bedroom", "cedar-living"],
    at: [87, 40],
    agent: "elena-marsh",
    listed: "2026-11-22",
    history: [["2026-11-22", "Listed", 2_450_000]],
    private: true,
    floors: 2,
    tags: ["Water view", "Garage", "Garden"],
  },
  {
    slug: "3-saltmarsh-way",
    address: "3 Saltmarsh Way",
    hood: "westshore",
    price: 3_900_000,
    status: "sale",
    beds: 4,
    baths: 4,
    sqft: 3600,
    lot: 0.6,
    type: "House",
    year: 2019,
    parking: "2 spaces",
    heating: "Ground-source heat pump",
    cooling: "Ground-source heat pump",
    summary: "A glass house in the dunes with the sea in every room.",
    description: [
      "A modern coastal house among the dunes on the Westshore, with walls of glass, warm stone and oak, and the sea in every room. Designed for year-round living by the water.",
      "The living room runs the width of the house and opens to a deck over the dunes; the four bedrooms each have their own bath and their own view.",
    ],
    features: ["Direct path to the beach", "Ground-source heating", "Stone fireplace", "Deck over the dunes", "Architect-designed, 2019"],
    photos: ["saltmarsh", "saltmarsh-living", "saltmarsh-kitchen", "saltmarsh-bedroom", "saltmarsh-deck"],
    at: [14, 87],
    agent: "elena-marsh",
    listed: "2026-10-15",
    history: [["2026-10-15", "Listed", 3_900_000]],
    private: true,
    floors: 1,
    tags: ["Water view", "Fireplace", "Garden"],
  },
  {
    slug: "220-foundry-street-12",
    address: "220 Foundry Street",
    unit: "#12",
    hood: "the-flats",
    price: 455_000,
    status: "sale",
    badge: "Just listed",
    beds: 1,
    baths: 1,
    sqft: 780,
    type: "Loft",
    year: 1921,
    parking: "Bike room",
    heating: "Forced-air heating",
    cooling: "Central air",
    hoa: 310,
    summary: "A loft in the old foundry: brick walls, steel windows and twelve-foot ceilings.",
    description: [
      "The foundry closed in 1974 and became lofts in 2008. This one keeps the brick and the steel windows, with a kitchen along one wall and a sleeping room behind glass.",
      "The Flats has the city's best coffee and its only record shop on the same block.",
    ],
    features: ["12-foot ceilings", "Original steel windows", "In-unit laundry", "Bike room", "Roof deck"],
    photos: ["foundry", "cedar-kitchen", "cedar-bedroom"],
    at: [39, 63],
    agent: "tom-lindqvist",
    listed: "2026-11-19",
    history: [
      ["2026-11-19", "Listed", 455_000],
      ["2018-02-01", "Sold", 341_000],
    ],
    floors: 1,
    tags: ["Pets allowed"],
  },
  {
    slug: "15-orchard-close",
    address: "15 Orchard Close",
    hood: "cedar-heights",
    price: 1_075_000,
    status: "sale",
    badge: "Open house",
    openHouse: "Sun 11–1 PM",
    beds: 3,
    baths: 2.5,
    sqft: 2180,
    lot: 0.4,
    type: "House",
    year: 1962,
    parking: "Carport",
    heating: "Heat pump",
    cooling: "Heat pump",
    summary: "A single-story house with an orchard of apple and pear trees behind it.",
    description: [
      "Everything is on one floor: three bedrooms, a long living room with a wall of windows onto the orchard and a kitchen with a door straight into the trees.",
      "Twelve apple and pear trees, a vegetable garden and a shed with power. The heat pump and the solar panels are three years old.",
    ],
    features: ["Single story", "Twelve fruit trees", "Solar panels", "Heat pump 2023", "Shed with power"],
    photos: ["orchard", "cedar-living", "cedar-kitchen", "cedar-yard"],
    at: [43, 27],
    agent: "maya-okafor",
    listed: "2026-11-08",
    history: [
      ["2026-11-08", "Listed", 1_075_000],
      ["2004-09-20", "Sold", 389_000],
    ],
    floors: 1,
    tags: ["Garden"],
  },
  {
    slug: "60-quay-street-3",
    address: "60 Quay Street",
    unit: "#3",
    hood: "harbor-point",
    price: 3_200,
    status: "rent",
    badge: "New",
    beds: 2,
    baths: 1,
    sqft: 960,
    type: "Condo",
    year: 1988,
    parking: "Street permit",
    heating: "Electric baseboard",
    cooling: "Window units",
    summary: "A bright two-bedroom by the harbor, available from January 1.",
    description: [
      "A second-floor flat on the quay with windows onto the moored boats. Two bedrooms, a living room with a bay window and a kitchen with a gas range.",
      "Available January 1 on a twelve-month lease. Heat and water included; one cat or small dog welcome.",
    ],
    features: ["Heat and water included", "Bay window on the harbor", "Gas range", "Pets considered", "12-month lease"],
    photos: ["quay", "cedar-kitchen", "cedar-bedroom"],
    at: [68, 72],
    agent: "daniel-reyes",
    listed: "2026-11-21",
    history: [["2026-11-21", "Listed for rent", 3_200]],
    floors: 1,
    tags: ["Water view", "Pets allowed"],
  },
  {
    slug: "5-larch-lane",
    address: "5 Larch Lane",
    hood: "cedar-heights",
    price: 1020000,
    status: "sold",
    beds: 4,
    baths: 2.5,
    sqft: 2480,
    lot: 0.3,
    type: "House",
    year: 1991,
    parking: "Driveway",
    heating: "Forced-air heating",
    cooling: "Central air",
    summary: "A white family house with a porch, sold above asking after one weekend.",
    description: ["A white family house with a porch, sold above asking after one weekend. Sold by Fieldhouse in 2026; ask us what a home like it would fetch today."],
    features: ["Sold 2026-10"],
    photos: ["sold-1"],
    at: [47, 22],
    agent: "maya-okafor",
    listed: "2026-10-30",
    history: [["2026-10-30", "Sold", 1020000]],
    floors: 2,
    tags: ["Garden", "Garage"],
  },
  {
    slug: "18-weir-street",
    address: "18 Weir Street",
    hood: "old-mill",
    price: 742000,
    status: "sold",
    beds: 3,
    baths: 2,
    sqft: 1720,
    lot: 0.04,
    type: "Townhouse",
    year: 1906,
    parking: "Driveway",
    heating: "Forced-air heating",
    cooling: "Central air",
    summary: "A brick rowhouse on Old Mill's sunniest street.",
    description: ["A brick rowhouse on Old Mill's sunniest street. Sold by Fieldhouse in 2026; ask us what a home like it would fetch today."],
    features: ["Sold 2026-10"],
    photos: ["sold-2"],
    at: [23, 41],
    agent: "priya-nair",
    listed: "2026-10-12",
    history: [["2026-10-12", "Sold", 742000]],
    floors: 2,
    tags: ["Garden"],
  },
  {
    slug: "31-ridge-road",
    address: "31 Ridge Road",
    hood: "bellmont",
    price: 2680000,
    status: "sold",
    beds: 5,
    baths: 4,
    sqft: 3900,
    lot: 0.9,
    type: "House",
    year: 2014,
    parking: "Driveway",
    heating: "Forced-air heating",
    cooling: "Central air",
    summary: "A glass-fronted house on the ridge, sold privately before it was listed.",
    description: ["A glass-fronted house on the ridge, sold privately before it was listed. Sold by Fieldhouse in 2026; ask us what a home like it would fetch today."],
    features: ["Sold 2026-09"],
    photos: ["sold-3"],
    at: [82, 33],
    agent: "elena-marsh",
    listed: "2026-09-18",
    history: [["2026-09-18", "Sold", 2680000]],
    floors: 2,
    tags: ["Water view", "Garage"],
  },
  {
    slug: "88-foundry-street-4",
    address: "88 Foundry Street",
    unit: "#4",
    hood: "the-flats",
    price: 610000,
    status: "sold",
    beds: 2,
    baths: 1,
    sqft: 1040,
    type: "Loft",
    year: 1919,
    parking: "Driveway",
    heating: "Forced-air heating",
    cooling: "Central air",
    summary: "A two-bedroom loft in the old pattern shop.",
    description: ["A two-bedroom loft in the old pattern shop. Sold by Fieldhouse in 2026; ask us what a home like it would fetch today."],
    features: ["Sold 2026-09"],
    photos: ["sold-4"],
    at: [35, 60],
    agent: "tom-lindqvist",
    listed: "2026-09-02",
    history: [["2026-09-02", "Sold", 610000]],
    floors: 2,
    tags: ["Pets allowed"],
  },
]

export type Hood = {
  slug: string
  name: string
  blurb: string
  description: string
  photo: string
  homes: number
  median: number
  /** Label position on the map, in %. */
  at: [number, number]
  scores: { walk: number; transit: number; bike: number }
  schools: [string, number, number][]
}

export const HOODS: Hood[] = [
  {
    slug: "harbor-point",
    name: "Harbor Point",
    blurb: "A lively, walkable waterfront with dining, marinas and sleek city residences.",
    description: "The old customs quay, now the city's front porch: ferries every twenty minutes, a fish market on Saturdays and condos with balconies over the water.",
    photo: "hood-harbor-point",
    homes: 96,
    median: 845_000,
    at: [80, 66],
    scores: { walk: 94, transit: 88, bike: 79 },
    schools: [
      ["Harbor Point Elementary", 7, 0.3],
      ["Quayside Middle", 7, 0.9],
      ["Port Avery High", 8, 1.6],
    ],
  },
  {
    slug: "old-mill",
    name: "Old Mill",
    blurb: "A historic neighborhood of brick homes, creative spaces and tree-lined streets.",
    description: "Rowhouses built for the mill's workers, now restored one by one. The mill itself is a market and studios; the river path runs behind it.",
    photo: "hood-old-mill",
    homes: 64,
    median: 642_000,
    at: [17, 38],
    scores: { walk: 86, transit: 62, bike: 84 },
    schools: [
      ["Mill Street Elementary", 8, 0.4],
      ["Old Mill Middle", 7, 0.6],
      ["Port Avery High", 8, 2.2],
    ],
  },
  {
    slug: "cedar-heights",
    name: "Cedar Heights",
    blurb: "Quiet streets, big trees and family houses close to good schools.",
    description: "Wide streets under old cedars, houses with porches and gardens, and three of the city's best-rated schools within a mile.",
    photo: "hood-cedar-heights",
    homes: 72,
    median: 918_000,
    at: [50, 18],
    scores: { walk: 72, transit: 48, bike: 81 },
    schools: [
      ["Cedar Heights Elementary", 8, 0.4],
      ["Old Mill Middle", 7, 1.1],
      ["Port Avery High", 8, 2.0],
    ],
  },
  {
    slug: "bellmont",
    name: "Bellmont",
    blurb: "Hillside living with dramatic views, quiet streets and contemporary homes.",
    description: "The hills east of the bay: modern houses on big lots, pine woods and a view of the whole harbor from almost every street.",
    photo: "hood-bellmont",
    homes: 58,
    median: 1_890_000,
    at: [86, 26],
    scores: { walk: 41, transit: 30, bike: 52 },
    schools: [
      ["Bellmont Elementary", 9, 0.8],
      ["Ridge Middle", 8, 1.4],
      ["Port Avery High", 8, 3.1],
    ],
  },
  {
    slug: "the-flats",
    name: "The Flats",
    blurb: "Warehouses turned into lofts, coffee and the city's only record shop.",
    description: "The old industrial flats by the rail yard. Foundries and warehouses are lofts and studios now, with the best coffee in Port Avery on every corner.",
    photo: "hood-the-flats",
    homes: 51,
    median: 498_000,
    at: [37, 55],
    scores: { walk: 91, transit: 84, bike: 90 },
    schools: [
      ["Foundry Street Elementary", 6, 0.5],
      ["Quayside Middle", 7, 1.0],
      ["Port Avery High", 8, 1.2],
    ],
  },
  {
    slug: "westshore",
    name: "Westshore",
    blurb: "A coastal stretch of dunes, beaches and modern homes with wide ocean views.",
    description: "Six miles of dunes and beach west of the city. Houses here sit low in the grass, and the only traffic jam is at the ice cream stand in August.",
    photo: "hood-westshore",
    homes: 48,
    median: 2_350_000,
    at: [14, 75],
    scores: { walk: 35, transit: 22, bike: 61 },
    schools: [
      ["Westshore Elementary", 8, 1.2],
      ["Ridge Middle", 8, 3.5],
      ["Port Avery High", 8, 4.0],
    ],
  },
]

export type Agent = {
  slug: string
  name: string
  role: string
  phone: string
  email: string
  photo: string
  bio: string
  sold: number
  days: number
  years: number
  hoods: string[]
  private?: boolean
}

export const AGENTS: Agent[] = [
  {
    slug: "maya-okafor",
    name: "Maya Okafor",
    role: "Founder, listing agent",
    phone: "(555) 418-3027",
    email: "maya@fieldhouse.example",
    photo: "agent-maya",
    bio: "Maya started Fieldhouse in 2009 with one desk on Quay Street. She has sold more houses in Cedar Heights than anyone, and still answers her own phone.",
    sold: 186,
    days: 18,
    years: 17,
    hoods: ["cedar-heights", "old-mill"],
  },
  {
    slug: "daniel-reyes",
    name: "Daniel Reyes",
    role: "Real estate agent",
    phone: "(555) 418-3051",
    email: "daniel@fieldhouse.example",
    photo: "agent-daniel",
    bio: "Daniel grew up above a bakery on the quay. He knows every building on Harbor Point, which ones have the best light and which ones have the best boards.",
    sold: 94,
    days: 22,
    years: 8,
    hoods: ["harbor-point", "the-flats"],
  },
  {
    slug: "priya-nair",
    name: "Priya Nair",
    role: "Real estate agent",
    phone: "(555) 418-3066",
    email: "priya@fieldhouse.example",
    photo: "agent-priya",
    bio: "Priya restored two rowhouses in Old Mill before she sold her first one. Buyers bring her to inspections for the questions she asks.",
    sold: 71,
    days: 20,
    years: 6,
    hoods: ["old-mill", "the-flats"],
  },
  {
    slug: "tom-lindqvist",
    name: "Tom Lindqvist",
    role: "Real estate agent",
    phone: "(555) 418-3078",
    email: "tom@fieldhouse.example",
    photo: "agent-tom",
    bio: "Tom was an architect for twenty years. He helps first-time buyers see past the paint, and sellers decide what is worth fixing before they list.",
    sold: 58,
    days: 25,
    years: 9,
    hoods: ["the-flats", "harbor-point"],
  },
  {
    slug: "elena-marsh",
    name: "Elena Marsh",
    role: "Director of Fieldhouse Private",
    phone: "(555) 418-3099",
    email: "elena@fieldhouse.example",
    photo: "agent-elena",
    bio: "Elena runs Fieldhouse Private, the office for the Westshore and Bellmont. She sells a handful of homes a year, mostly before they are ever listed.",
    sold: 62,
    days: 41,
    years: 10,
    hoods: ["westshore", "bellmont"],
    private: true,
  },
]

/** The boutique home's quote and numbers. */
export const PRIVATE_OFFICE = {
  agent: "elena-marsh",
  quote: "I sell a handful of homes a year, and I know every one of them by the light in the kitchen.",
  stats: [
    ["$184M", "sold since 2016"],
    ["62", "homes"],
    ["9", "neighborhoods"],
  ] as [string, string][],
}

/** The city's market, for the valuation band. */
export const MARKET = {
  median: 612_000,
  days: 21,
  aboveAsking: 38,
  period: "last 12 months",
}

/** What buyers pay on top of the loan, for the payment calculator. */
export const MORTGAGE = {
  /** Annual rate, %. */
  rate: 6.1,
  years: 30,
  /** Down payment, %. */
  down: 20,
  /** Property tax, % of the price per year. */
  tax: 0.523,
  /** Home insurance, per month. */
  insurance: 150,
}

export type Post = { slug: string; title: string; category: string; date: string; photo: string; summary: string; body: { h?: string; p: string[] }[] }

export const POSTS: Post[] = [
  {
    slug: "first-time-buyers-guide",
    title: "A first-time buyer's guide to Port Avery",
    category: "Buying",
    date: "2026-03-10",
    photo: "post-buyers-guide",
    summary: "What to sort out before your first viewing, what to ask at it and how offers work here.",
    body: [
      { p: ["Buying your first home is mostly waiting, with a few days of very fast decisions in between. This is how to be ready for the fast days."] },
      { h: "Before you look", p: ["Get pre-approved, not pre-qualified: sellers here ask for the letter with the offer. Know your number for the whole month, not just the price: taxes, insurance and the HOA can add a fifth."] },
      { h: "At the viewing", p: ["Open the windows and the cupboards, run the taps, look at the ceiling under every bathroom. Ask when the roof, the boiler and the windows were last replaced, and ask for the bills."] },
      { h: "Making an offer", p: ["In Port Avery, 38% of homes sold above asking last year, most of them in Cedar Heights and Old Mill. Your agent will tell you what the last three sales on the street went for; start there."] },
    ],
  },
  {
    slug: "what-a-home-inspection-covers",
    title: "What a home inspection really covers",
    category: "Homeownership",
    date: "2026-03-05",
    photo: "post-inspection",
    summary: "The inspector's report is long. Here are the five pages that matter.",
    body: [
      { p: ["A general inspection looks at what an inspector can see and reach in three hours. It is not a guarantee, and it does not open walls."] },
      { h: "What it covers", p: ["The roof, the structure, the electrics, the plumbing, the heating and cooling, the windows and doors, and anything that is obviously wet."] },
      { h: "What it does not", p: ["Sewer lines, chimneys, pools, wells, radon and pests need their own specialists. In Old Mill, always scope the sewer line; in Westshore, ask about the dune permits."] },
    ],
  },
  {
    slug: "the-quiet-streets-of-old-mill",
    title: "The quiet streets of Old Mill",
    category: "Neighborhoods",
    date: "2026-02-27",
    photo: "post-old-mill",
    summary: "A walk through the rowhouses, the market and the river path, with the three streets we would buy on.",
    body: [
      { p: ["Old Mill was built in twenty years for the people who worked at the mill, and it has hardly changed shape since. The houses are brick, the streets are narrow and the trees are older than the cars."] },
      { h: "Where to walk", p: ["Start at the market in the old mill, take the river path north and come back along Linden Row. On Saturdays the bakery on Weir Street sells out by ten."] },
      { h: "Where we would buy", p: ["Linden Row for the gardens, Weir Street for the light and Cooper Lane for the quiet. Expect to pay about $380 a square foot for a restored rowhouse."] },
    ],
  },
]

export const TESTIMONIALS = [
  { quote: "Maya told us which house not to bid on. We bought the one two doors down and have never been happier.", who: "J. and M., Cedar Heights" },
  { quote: "We sold before the sign went up, for more than we asked, without a single open house.", who: "R. T., Westshore" },
]

/** Features buyers filter by ("More filters"). */
export const FEATURES = ["Garden", "Water view", "Garage", "Fireplace", "Pets allowed"] as const
export type Feature = (typeof FEATURES)[number]

/* The platform home's further sections ----------------------------------------------------------- */

/** What the brokerage does, each with the page it opens. icon: search, key, tag or landmark. */
export const SERVICES: { icon: "search" | "key" | "tag" | "landmark"; title: string; text: string; path: string; cta: string }[] = [
  { icon: "search", title: "Buy", text: "Every home for sale in Port Avery, then a tour with an agent who knows the street.", path: "buy", cta: "Search homes" },
  { icon: "key", title: "Rent", text: "Apartments, lofts and houses to rent, with viewings most days of the week.", path: "rent", cta: "Find a rental" },
  { icon: "tag", title: "Sell", text: "A free valuation, photographs and a plan, from an agent who has sold near you.", path: "sell", cta: "Get a valuation" },
  { icon: "landmark", title: "Finance", text: "What you can afford, and what a home would cost you each month.", path: "mortgage", cta: "Work out a budget" },
]

/** Reviews for the home page; score is out of 5. */
export const REVIEWS = {
  score: 4.9,
  count: 1240,
  items: [
    {
      name: "Jordan & Mei",
      hood: "cedar-heights",
      kind: "Bought",
      agent: "maya-okafor",
      stars: 5,
      quote: "Maya told us which house not to bid on. We bought the one two doors down a month later and have never been happier.",
    },
    {
      name: "Ruth T.",
      hood: "old-mill",
      kind: "Sold",
      agent: "priya-nair",
      stars: 5,
      quote: "Priya priced our rowhouse honestly, had it photographed on the one sunny day that week and we had three offers by Monday.",
    },
    {
      name: "Sam O.",
      hood: "the-flats",
      kind: "Rented",
      agent: "tom-lindqvist",
      stars: 5,
      quote: "Tom showed me four lofts in one lunch break and talked me out of the one with the noisy bar downstairs.",
    },
  ],
}

/** Questions buyers and sellers ask first. */
export const FAQ: [string, string][] = [
  [
    "How much does it cost to sell with Fieldhouse?",
    "Our fee is agreed before we list, usually 2 to 2.5% of the sale price, and you pay nothing until the sale closes. Photography, the floor plan and the listing are included.",
  ],
  ["How long does it take to sell a home in Port Avery?", "Homes we listed this year went under contract in 21 days on average. Well-priced homes in Cedar Heights and Old Mill often go in a week."],
  ["Do I need a mortgage pre-approval before I tour?", "No, but it helps. A pre-approval tells you your budget and makes your offer stronger; our calculator gives you a first idea in a minute."],
  ["Can I buy and sell at the same time?", "Yes. Many of our clients do. We plan both sales together so you are not carrying two homes, or left without one."],
  [
    "What is a buyer's agent, and who pays for one?",
    "A buyer's agent finds homes, books tours, advises on price and negotiates for you. Their fee is agreed with you in writing before your first tour.",
  ],
  ["Do you handle rentals?", "Yes, for tenants and for owners: we list, show, check references and draw up the lease. Rentals have their own search."],
]

/* The boutique home's further sections ----------------------------------------------------------- */

/** Where the private office has been written about (made-up titles: put your own press here). */
export const PRESS = ["The Avery Ledger", "Coastline", "House & Harbour", "Quarterly Interiors", "The Northshore Review"]

/** The boutique home's collections: a photo and the search each one opens (status sale). */
export const COLLECTIONS: { title: string; photo: string; hood?: string; type?: HomeType; tag?: Feature }[] = [
  { title: "On the water", photo: "saltmarsh-deck", tag: "Water view" },
  { title: "In the hills", photo: "hood-bellmont", hood: "bellmont" },
  { title: "Town houses", photo: "hood-old-mill", type: "Townhouse" },
  { title: "With a garden", photo: "cedar-yard", tag: "Garden" },
]

/** How the private office works, in four parts. */
export const PRIVATE_SERVICES: [string, string][] = [
  ["Private sales", "Most of our homes sell before they are listed, to buyers we already know and have already met."],
  ["Presentation", "Architectural photography, a short film and a printed book for every residence we take on."],
  ["Representation", "We buy for a few clients a year, and only homes we would be glad to live in ourselves."],
  ["Valuation", "A considered price in writing, from someone who has sold on your street, within the week."],
]

/** What private clients say. */
export const PRIVATE_WORDS = [
  { quote: "We sold before the sign went up, for more than we asked, without a single open house.", who: "R. and T. Hale, Westshore" },
  { quote: "Elena found us a house that was never on the market, and then talked us down from paying too much for it.", who: "A. Moreau, Bellmont" },
  { quote: "The book she made for our home was so good the buyers asked to keep it.", who: "D. Ishikawa, Harbor Point" },
]
