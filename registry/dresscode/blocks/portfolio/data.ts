// Sample content for the Portfolio template: a made-up designer, six made-up projects, four posts.
// Every page reads from here, so this is the one file to make it yours: swap the text, give each
// project an `image` (and `plates` with `src`) and set HOME to the home page you want.

/** Which home your site opens on: "index" (a text-first list of work, for developers and product people) or "grid" (covers first, for visual work). */
export const HOME: Variant = "index"

export type Variant = "index" | "grid"

export type Tag = "Product" | "Brand" | "Type" | "Print"

/**
 * A picture in a case study or a gallery. `src` is your image (a path under public/ or a URL). Without
 * it the plate shows the project's sample cover, or with `crop` a detail of it: where to look in the
 * square cover, as [across, down] in percent, and how far to zoom in.
 */
export type Plate = { src?: string; alt?: string; crop?: [number, number, number]; ratio: "4/5" | "1/1" | "4/3" | "3/2" | "16/9"; caption: string }

export type Project = {
  slug: string
  title: string
  year: string
  role: string
  client: string
  summary: string
  /** The work filter's categories; the first one is the card's label. */
  tags: Tag[]
  /** Your cover image (a path under public/ or a URL). Without one the drawn sample cover shows. */
  image?: string
  facts: [string, string][]
  /** "case-study" reads as a story with figures; "gallery" puts the pictures first. */
  layout: "case-study" | "gallery"
  brief: string
  sections: { title: string; body: string[] }[]
  metrics?: [string, string][]
  quote?: { text: string; name: string; role: string }
  plates: Plate[]
  credits: [string, string][]
}

export const PERSON = {
  name: "Noor Halvorsen",
  first: "Noor",
  last: "Halvorsen",
  initials: "NH",
  role: "Product designer & creative developer",
  city: "Lisbon",
  country: "Portugal",
  /** The index home's opening line, after your name. */
  headline: "designs and builds calm software for people who make things.",
  /** The grid home's opening line. */
  tagline: "Interfaces, brands and books, made in Lisbon.",
  intro: "I design and build calm software for people who make things: notebooks for field work, maps that move, type that behaves.",
  available: "Booking projects from March",
  email: "noor@example.com",
  site: "noorhalvorsen.example",
  /** Your photo (a path under public/ or a URL). Without one the About page shows your initials. */
  portrait: undefined as string | undefined,
  timeZone: "Europe/Lisbon",
  /** Where "Book a call" goes: your Cal.com or Calendly page. */
  calendar: "https://example.com/calendar",
  replies: "I answer within two working days.",
  previously: ["Tidewater Mobility", "Fernlight", "Atelier Noord"],
  links: [
    { label: "GitHub", href: "https://example.com/github" },
    { label: "Read.cv", href: "https://example.com/readcv" },
    { label: "Instagram", href: "https://example.com/instagram" },
  ],
  bio: [
    "I spent six years inside product teams, at a transit company and at a lab building tools for field scientists, before going independent in 2023.",
    "Now I take one product at a time, from the first interviews to the front-end that ships. Most of my clients make physical things and need software that stays out of the way.",
  ],
  now: "Designing a field guide for a herbarium in Porto, and learning to throw porcelain at Kiln on Thursdays.",
}

export const TAGS: Tag[] = ["Product", "Brand", "Type", "Print"]

export const PRINCIPLES = [
  { title: "One product at a time", body: "I take on one client per quarter, so the work gets my whole week and not the gaps between calls." },
  { title: "Watch the work first", body: "Before drawing anything I go where the product will be used: a pier at rush hour, a hillside in the rain." },
  { title: "Design in the browser early", body: "Prototypes in real code by week two, so we argue about how it feels, not how it looks in a mock-up." },
  { title: "Leave it easy to change", body: "Plain components, written-down decisions and a handover your team can run with the next morning." },
]

export const SERVICES = [
  {
    title: "Product design",
    note: "Research, flows and interface for one product, end to end.",
    body: "Interviews and site visits, then flows, then the interface, tested with the people who will use it every day.",
    gets: ["Field research and a short findings deck", "Flows and a tested prototype", "A design system in Figma and code"],
  },
  {
    title: "Design engineering",
    note: "The React front-end that ships what we designed, with tests.",
    body: "I build the front-end myself, in React and TypeScript, so nothing gets lost between the design and the product.",
    gets: ["Production React and TypeScript", "Accessible components with tests", "Docs your team can extend"],
  },
  {
    title: "Brand for studios",
    note: "A small identity and site for makers, bookings included.",
    body: "For studios, workshops and shops: a mark, a type pairing and a site that takes bookings and payments.",
    gets: ["Wordmark and a small palette", "A site with bookings and payments", "Templates for print and social"],
  },
  {
    title: "Data and maps",
    note: "Live maps and charts that read at a glance on any screen.",
    body: "Live positions, schedules and counts turned into maps and charts that work on a phone and on a pier screen.",
    gets: ["Live maps in WebGL or SVG", "Charts that read at a glance", "Kiosk and screen builds"],
  },
]

export const PACKAGES = [
  {
    name: "Design sprint",
    price: "€6,500",
    per: "fixed",
    length: "Two weeks",
    body: "One flow, from a blank page to a clickable prototype tested with five of your users.",
    includes: ["Kick-off workshop", "Prototype in real code", "Five user tests, recorded", "Findings and next steps"],
  },
  {
    name: "Product, end to end",
    price: "From €24,000",
    per: "per project",
    length: "Eight to twelve weeks",
    body: "Research, design and the front-end that ships, for one product. My usual way of working.",
    includes: ["Everything in the sprint", "Full interface and design system", "Production front-end", "Two weeks of support after launch"],
    featured: true,
  },
  {
    name: "Retainer",
    price: "€4,800",
    per: "per month",
    length: "Two days a week",
    body: "Ongoing design and front-end for a team that has shipped and wants to keep the quality up.",
    includes: ["A standing weekly slot", "Design and code reviews", "Cancel with a month's notice"],
  },
]

export const PROCESS = [
  { title: "A call", body: "Thirty minutes to hear what you are making and whether I am the right person for it." },
  { title: "A proposal", body: "A two-page plan within a week: scope, weeks, price and what you will have at the end." },
  { title: "Work in the open", body: "A shared board, a short video every Friday and a prototype you can click from week two." },
  { title: "Handover", body: "Code, files and a recorded walkthrough, plus two weeks of answers once it is live." },
]

export const FAQ = [
  { q: "Do you work with teams outside Europe?", a: "Yes. About half my clients are in other time zones; I keep three hours a day that overlap with yours." },
  { q: "Can you join our team instead of working on a project?", a: "For a retainer, yes: two days a week inside your tools and rituals, with a standing weekly slot." },
  { q: "Do you only design, or build too?", a: "Both. Most projects end with production React and TypeScript that I wrote, reviewed by your engineers." },
  { q: "How far ahead are you booked?", a: "Usually six to ten weeks. The current opening is on the home page and on the contact form." },
  { q: "What do you need from us to start?", a: "One person who can decide, access to the people who will use the product, and a deposit of a third." },
]

export const TESTIMONIALS = [
  { text: "Riders stopped asking the crew whether the boat was full. The pier screen answers before they reach the gate.", name: "Rui Matos", role: "Head of operations, Quay Ferries" },
  { text: "It is the first tool our field teams asked to keep using after the pilot. Noor came to the hills with us twice.", name: "Marta Quintela", role: "Survey lead, Northwind Herbarium" },
  { text: "Our wheel classes sell out on the site now, and the brand finally looks like the studio smells: clay and coffee.", name: "Inês Carvalho", role: "Founder, Kiln Studio" },
]

export const CLIENTS = ["Tidewater Mobility", "Kiln Studio", "Fernlight", "Atelier Noord", "Northwind Herbarium", "Slow Press", "Quay Ferries", "Field & Frame"]

export const PROJECTS: Project[] = [
  {
    slug: "fieldnotes",
    tags: ["Product"],
    title: "Fieldnotes",
    year: "2025",
    role: "Product design, front-end",
    client: "Northwind Herbarium",
    summary: "An offline-first notebook for botanists. Photo, position and species name in one tap, synced when the signal comes back.",
    facts: [["Role", "Lead designer"], ["Team", "Four people"], ["Shipped", "iPad and web"]],
    layout: "case-study",
    brief: "The herbarium's survey teams logged plants on paper and typed it all up at night. They wanted one tap per specimen, in the rain, with no signal for days.",
    sections: [
      {
        title: "Watching the work",
        body: [
          "We spent nine days on two surveys in the Serra da Estrela before drawing a screen. The notebooks were wet, the gloves stayed on, and the light changed every ten minutes.",
          "Three things kept coming up: the species name was the slow part, the position was always copied wrong, and nobody trusted an app to keep a day's work without a signal.",
        ],
      },
      {
        title: "One tap, three facts",
        body: [
          "The capture button takes the photo, the position and the time together. The species field suggests names from the plants already logged on that hillside, so the third Erica of the morning is two letters away.",
          "Every target is at least 56 points, every label passes contrast in direct sun, and the whole flow works with a gloved thumb.",
        ],
      },
      {
        title: "Offline first, for real",
        body: [
          "Records save to the device first and sync in the background when a signal comes back, oldest first, with a count of what is still waiting. Nothing is ever lost to a spinner.",
        ],
      },
    ],
    metrics: [["3×", "faster than paper per specimen"], ["0", "records lost in the first season"], ["11 days", "longest stretch offline"]],
    quote: { text: "It is the first tool our field teams asked to keep using after the pilot. Noor came to the hills with us twice.", name: "Marta Quintela", role: "Survey lead, Northwind Herbarium" },
    plates: [
      { crop: [42, 58, 1.45], ratio: "4/3", caption: "The plot screen: today's specimens, newest first, each with its position." },
      { crop: [76, 50, 2.1], ratio: "4/3", caption: "Waiting for signal: the day's records stay on the device, counted, until it comes back." },
    ],
    credits: [["Design and front-end", "Noor Halvorsen"], ["Engineering", "Ilse Brandt, Tomás Ferraz"], ["Research partner", "Northwind Herbarium"]],
  },
  {
    slug: "tidewater",
    tags: ["Product"],
    title: "Tidewater",
    year: "2024",
    role: "Data visualisation",
    client: "Quay Ferries",
    summary: "A live map of eleven ferry lines: where every boat is and how full it is, on the pier screens and in your pocket.",
    facts: [["Role", "Design and WebGL"], ["Data", "Every 5 seconds"], ["Screens", "38 piers"]],
    layout: "case-study",
    brief: "Eleven ferry lines, 38 piers and a quarter of a million riders who mostly want to know one thing: will I fit on the next boat?",
    sections: [
      {
        title: "Starting at the pier",
        body: [
          "The old screens showed a timetable. Riders read it, then asked the crew anyway. We stood at four piers during rush hour and counted the questions: two in three were about how full the boat was.",
        ],
      },
      {
        title: "A map that moves calmly",
        body: [
          "Positions arrive every five seconds. Instead of jumping, each boat glides to its new place along the route, so the map reads like a window and not like a refresh.",
          "Lines keep their colors from the printed map, piers sit where they are on the river, and the next boat for this pier is the only thing in bold.",
        ],
      },
      {
        title: "Fullness, not timetables",
        body: [
          "Each boat carries a load bar fed by the gate counters. The pier screen leads with it: Line C to Market Pier, 64 percent full, two minutes. The phone version shows the same card for the pier you are walking to.",
        ],
      },
    ],
    metrics: [["38", "pier screens live"], ["−41%", "questions to the crew"], ["5 s", "between position updates"]],
    quote: { text: "Riders stopped asking the crew whether the boat was full. The pier screen answers before they reach the gate.", name: "Rui Matos", role: "Head of operations, Quay Ferries" },
    plates: [
      { crop: [50, 40, 1.05], ratio: "16/9", caption: "The river at rush hour: four lines, every boat gliding between updates." },
      { crop: [28, 84, 2.3], ratio: "4/3", caption: "The load card for the next boat, as the pier screen shows it." },
      { crop: [62, 22, 2], ratio: "4/3", caption: "Piers keep their names and places from the printed map." },
    ],
    credits: [["Design and WebGL", "Noor Halvorsen"], ["Data platform", "Quay Ferries engineering"], ["Screens", "Field & Frame"]],
  },
  {
    slug: "kiln",
    tags: ["Brand"],
    title: "Kiln",
    year: "2024",
    role: "Brand and website",
    client: "Kiln Studio",
    summary: "Booking for wheel classes and firing slots, with a brand drawn from a wall of glaze tests.",
    facts: [["Role", "Brand, site, booking"], ["Timeline", "Ten weeks"], ["Stack", "Next.js, Stripe"]],
    layout: "gallery",
    brief: "A ceramics studio in Lisbon with a waiting list on paper. The brand came off the wall of glaze tests by the kiln; the site sells classes and firing slots.",
    sections: [
      {
        title: "About the project",
        body: [
          "The palette is twelve glazes from the studio's own test wall, photographed and matched. The wordmark is cut from the same rounded letters as the clay stamps.",
          "Classes and firing slots book and pay in two steps, and the studio prints the day's list from the same page.",
        ],
      },
    ],
    plates: [
      { ratio: "4/5", caption: "The identity in one frame: wordmark, glazes and a class ticket." },
      { crop: [21, 15, 2.6], ratio: "1/1", caption: "The wordmark, cut from the studio's clay stamps." },
      { crop: [74, 22, 2.2], ratio: "4/3", caption: "Twelve glazes from the test wall became the palette." },
      { crop: [32, 80, 1.9], ratio: "3/2", caption: "A wheel-class ticket, as the booking confirms it." },
      { ratio: "16/9", caption: "The same system, set wide for the site's header." },
      { crop: [70, 24, 3.4], ratio: "4/5", caption: "Glaze tests up close." },
    ],
    credits: [["Brand and site", "Noor Halvorsen"], ["Photography", "Slow Press"], ["Studio", "Kiln, Lisbon"]],
  },
  {
    slug: "lumen-type",
    tags: ["Type"],
    title: "Lumen Type",
    year: "2023",
    role: "Type and motion",
    client: "Self-initiated",
    summary: "A variable-font specimen you play like an instrument: weight follows the cursor, width follows the music.",
    facts: [["Role", "Everything"], ["Axes", "Weight, width, slant"], ["Built with", "Canvas, Web Audio"]],
    layout: "case-study",
    brief: "Type specimens show a font sitting still. Lumen asks what a variable font feels like when you play it.",
    sections: [
      {
        title: "Axes as strings",
        body: [
          "Weight follows the cursor across the page, width follows the loudness of whatever is playing, and slant follows the scroll. Each axis eases toward its target, so the letters breathe instead of jittering.",
        ],
      },
      {
        title: "Built to be borrowed",
        body: [
          "The specimen is one page of plain HTML, a canvas and a hundred lines of Web Audio. Two foundries now ship a version of it with their own families.",
        ],
      },
    ],
    metrics: [["3", "axes played live"], ["2", "foundries using it"], ["120 kB", "for the whole page"]],
    plates: [
      { crop: [50, 48, 1.15], ratio: "16/9", caption: "Lumen at rest: the weight breathes between 300 and 850." },
      { crop: [50, 84, 1.7], ratio: "4/3", caption: "Four cuts and the slider that plays them." },
    ],
    credits: [["Design, type and code", "Noor Halvorsen"], ["Music", "Field recordings, Lisbon"]],
  },
  {
    slug: "northbound",
    tags: ["Product", "Print"],
    title: "Northbound",
    year: "2022",
    role: "iOS app",
    client: "Independent",
    summary: "A travel journal that draws your route from your photos and prints it as a fold-out map.",
    facts: [["Role", "Design and Swift"], ["Platform", "iPhone"], ["Print", "A2 fold-out"]],
    layout: "gallery",
    brief: "Five weeks by train from Lisbon to Tromsø, one photo at every stop. The app drew the route from the photos; the print shop folded it into a map.",
    sections: [
      {
        title: "About the project",
        body: [
          "Northbound reads the place and time from each photo, draws the route between them and lets you write a line per stop. At the end it lays the trip out as an A2 sheet that folds to pocket size.",
          "Three hundred travellers printed their maps in the first year; the trip on these pages is mine.",
        ],
      },
    ],
    plates: [
      { ratio: "16/9", caption: "Lisbon to Tromsø, folded out." },
      { crop: [28, 58, 2.4], ratio: "4/5", caption: "The first stops, south of the fold." },
      { crop: [74, 32, 2.4], ratio: "4/5", caption: "North of the Arctic Circle." },
      { ratio: "1/1", caption: "The sheet, square." },
      { crop: [50, 90, 2.4], ratio: "16/9", caption: "The caption strip, set from the journal's own notes." },
    ],
    credits: [["Design and Swift", "Noor Halvorsen"], ["Printing", "Slow Press"]],
  },
  {
    slug: "small-rooms",
    tags: ["Print"],
    title: "Atlas of Small Rooms",
    year: "2021",
    role: "Photo book and site",
    client: "Self-published",
    summary: "Forty flats under 30 m², each photographed from the same corner, with floor plans drawn by the people who live there.",
    facts: [["Role", "Photos, design"], ["Pages", "184"], ["Edition", "500 copies"]],
    layout: "gallery",
    brief: "Forty flats under 30 square metres, each photographed from the same corner at the same height, each with a floor plan drawn by the person who lives there.",
    sections: [
      {
        title: "About the project",
        body: [
          "The book started as my graduation project and took six more years. Every spread pairs one photograph with one hand-drawn plan; the site lets you walk the flats in order of size.",
          "The edition of 500 sold out in four months. A second printing is planned for 2027.",
        ],
      },
    ],
    plates: [
      { ratio: "4/5", caption: "The book, 184 pages, cloth spine." },
      { crop: [40, 55, 2.3], ratio: "4/3", caption: "A floor plan, drawn by the person who lives there." },
      { ratio: "3/2", caption: "Cover and slipcase." },
      { crop: [49, 45, 3.6], ratio: "1/1", caption: "Plan detail: the kitchen is a cupboard." },
      { crop: [70, 45, 1.8], ratio: "4/5", caption: "The second volume, behind the first." },
      { ratio: "16/9", caption: "Set wide for the book's site." },
    ],
    credits: [["Photographs and design", "Noor Halvorsen"], ["Printing", "Slow Press, Porto"], ["Edition", "500 copies, sold out"]],
  },
]

export type Experience = { years: string; role: string; org: string; place: string; note: string; highlights: string[] }

/** The résumé, newest first. The home page lists the roles; the résumé page adds the highlights. */
export const EXPERIENCE: Experience[] = [
  {
    years: "2023 – now",
    role: "Independent designer & developer",
    org: "Studio Halvorsen",
    place: "Lisbon",
    note: "Small teams, one product at a time: research, design and the front-end that ships it.",
    highlights: ["Seven products shipped for transit, science and craft clients", "Design and production front-end on every project", "Fieldnotes cut survey logging time by two thirds"],
  },
  {
    years: "2020 – 2023",
    role: "Senior product designer",
    org: "Tidewater Mobility",
    place: "Porto",
    note: "Led design for live transit maps used on 38 piers and a quarter of a million phones.",
    highlights: ["Led a team of three designers across rider and operator tools", "Designed the live ferry map now on 38 pier screens", "Set up the design system shared by web, iOS and Android"],
  },
  {
    years: "2017 – 2020",
    role: "Product designer",
    org: "Fernlight",
    place: "Copenhagen",
    note: "Offline-first tools for scientists in the field; learned to design for gloves and bad light.",
    highlights: ["Designed offline data capture for 40 research teams", "Ran field studies in Greenland, Iceland and Norway"],
  },
  {
    years: "2015 – 2017",
    role: "Front-end developer",
    org: "Atelier Noord",
    place: "Rotterdam",
    note: "Built sites for museums and type foundries; fell for variable fonts.",
    highlights: ["Built twelve sites for museums and foundries", "Shipped one of the first variable-font specimens on the web"],
  },
]

/** When the résumé was last updated (it shows on the page and in the PDF). */
export const RESUME_UPDATED = "2026-11-01"

export const EDUCATION = [{ years: "2011 – 2015", title: "BA Interaction Design", org: "Applied Arts Academy, Eindhoven", note: "Graduated with a photo book about small rooms, which became a real one six years later." }]

export const SKILLS = [
  { group: "Design", items: ["Field research", "Interaction design", "Design systems", "Prototyping", "Type and layout"] },
  { group: "Engineering", items: ["React and TypeScript", "Next.js", "CSS and motion", "WebGL and SVG maps", "Swift and SwiftUI"] },
  { group: "Tools", items: ["Figma", "Linear", "Framer", "Glyphs", "Blender"] },
]

export const TALKS = [
  { year: "2026", title: "Designing for gloves and bad light", where: "Design Matters, Copenhagen" },
  { year: "2025", title: "Maps that move calmly", where: "Smashing Conference, Antwerp" },
  { year: "2023", title: "Variable fonts as instruments", where: "ATypI, Paris" },
]

export const LANGUAGES = ["English", "Portuguese", "Norwegian", "Dutch (reading)"]

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "note"; text: string }
  | { type: "code"; lang: "ts" | "tsx" | "css"; file?: string; code: string }

export type Post = { slug: string; title: string; date: string; minutes: number; summary: string; tags: string[]; body: Block[] }

/** Posts, newest first. Text in `backticks` sets as code. */
export const POSTS: Post[] = [
  {
    slug: "design-for-gloves",
    title: "Designing for gloves and bad light",
    date: "2026-10-14",
    minutes: 7,
    tags: ["Field tools", "Accessibility"],
    summary: "What six years of field tools taught me about targets, contrast and offline sync.",
    body: [
      { type: "p", text: "Most interfaces are designed at a desk, in good light, with a mouse. Field tools get used on a hillside at noon, with gloves on, by someone who has been walking since six. The rules change, and most of them are rules we should follow everywhere." },
      { type: "h2", text: "Targets you can hit with a glove" },
      { type: "p", text: "A gloved thumb covers about 18 millimetres. Apple asks for 44 points and Google for 48 dp; in the field I never go below 56, and the main action is twice that. The easiest way to keep it honest is a token every control reads." },
      { type: "code", lang: "css", file: "tokens.css", code: ":root {\n  /* A gloved thumb, plus room for a shaky hand */\n  --target: 56px;\n  --target-main: 112px;\n}\n\n.button {\n  min-height: var(--target);\n  min-width: var(--target);\n}" },
      { type: "h2", text: "Contrast for noon sun" },
      { type: "p", text: "Direct sun on a screen washes out anything under about 7:1. That is WCAG AAA for body text, and it is the floor, not the goal, outdoors. Three things helped more than any palette:" },
      { type: "list", items: ["Weight over color: state changes use bold and an icon, never color alone.", "No thin grays: secondary text stays at 7:1 too, it just gets smaller.", "A sun mode that drops the background to pure white and the text to pure black."] },
      { type: "h2", text: "Sync is a feature, not a spinner" },
      { type: "p", text: "Nobody in the field will wait for a network. Every record saves to the device first, and a queue sends them oldest first when a signal comes back. The interface shows the count of what is still waiting, never a spinner." },
      { type: "code", lang: "ts", file: "queue.ts", code: "// Save locally first; send when the network allows.\nexport async function save(record: Specimen) {\n  await db.put(\"pending\", record)\n  if (navigator.onLine) void flush()\n}\n\nexport async function flush() {\n  for (const r of await db.getAll(\"pending\")) {\n    await api.post(\"/specimens\", r) // oldest first\n    await db.delete(\"pending\", r.id)\n  }\n}" },
      { type: "quote", text: "If it is not usable with gloves, at noon, with no signal, it is not finished." },
      { type: "p", text: "None of this is exotic. Big targets, real contrast and work that never waits for the network make a better office app too. The field just makes it impossible to pretend otherwise." },
    ],
  },
  {
    slug: "a-map-that-breathes",
    title: "A map that breathes every five seconds",
    date: "2026-08-02",
    minutes: 9,
    tags: ["Maps", "Motion"],
    summary: "Animating 40 ferries on a pier screen without making anyone seasick.",
    body: [
      { type: "p", text: "The ferry data arrives every five seconds. The first version moved every boat to its new position the moment it arrived, and the map ticked like a clock. Riders said it looked broken." },
      { type: "h2", text: "Glide, do not jump" },
      { type: "p", text: "Each boat now eases toward its latest position over the next update window, along the route rather than in a straight line. The map is always a little behind the data, and nobody notices, because the boat is never anywhere it could not be." },
      { type: "code", lang: "ts", file: "boats.ts", code: "// Ease each boat toward where the data says it is, once per frame.\nconst ease = 1 - Math.pow(0.001, dt / 5000)\nfor (const boat of boats) {\n  boat.t += (boat.target - boat.t) * ease\n  boat.position = route(boat.line).at(boat.t)\n}" },
      { type: "h2", text: "One thing in bold" },
      { type: "p", text: "Forty moving boats are a lot to read. The pier screen draws them all in the line's color at half strength, and only the next boat for this pier at full strength, with its load card. The eye goes there first." },
      { type: "note", text: "With reduced motion on, the boats move once per update with no glide, and the load card does not animate." },
      { type: "p", text: "The rest is restraint: no pulsing, no trails, no zoom. A map on a wall should move like water does, slowly and all the time." },
    ],
  },
  {
    slug: "variable-fonts-as-instruments",
    title: "Variable fonts as instruments",
    date: "2026-05-21",
    minutes: 5,
    tags: ["Type", "Motion"],
    summary: "Mapping a cursor and a microphone onto weight, width and slant.",
    body: [
      { type: "p", text: "A variable font is a set of dials. Specimens usually show them as sliders; Lumen plays them. Weight follows the cursor, width follows the sound, slant follows the scroll." },
      { type: "code", lang: "css", file: "lumen.css", code: ".lumen {\n  font-variation-settings:\n    \"wght\" var(--weight, 400),\n    \"wdth\" var(--width, 100),\n    \"slnt\" var(--slant, 0);\n  transition: font-variation-settings 120ms linear;\n}" },
      { type: "p", text: "The trick is easing. Raw input jitters, and jittering letters are hard to read. Each axis moves a fraction of the way to its target every frame, so a sharp sound swells the letters and lets them settle." },
      { type: "code", lang: "ts", file: "lumen.ts", code: "const weight = ease(current.weight, 300 + pointer.x * 550, 0.12)\nel.style.setProperty(\"--weight\", weight.toFixed(0))" },
      { type: "p", text: "With reduced motion on, the specimen stays still and the dials become plain sliders again." },
    ],
  },
  {
    slug: "pricing-small-projects",
    title: "How I price small projects",
    date: "2026-02-09",
    minutes: 6,
    tags: ["Business"],
    summary: "Fixed weeks, one product, and why I stopped quoting by the hour.",
    body: [
      { type: "p", text: "For my first year on my own I quoted by the hour. Every project became a negotiation about time instead of a conversation about the product. Now I sell weeks, at a fixed price, for one product at a time." },
      { type: "h2", text: "What a week buys" },
      { type: "list", items: ["Four days of focused work and one day for calls, reviews and writing things down.", "A short video every Friday with what changed and what is next.", "A prototype you can click from the second week."] },
      { type: "h2", text: "Why fixed" },
      { type: "p", text: "A fixed price makes me the one who carries the risk of a slow week, which is where it belongs: I know how long things take better than my clients do. It also means nobody hesitates to ask a question because the meter is running." },
      { type: "quote", text: "Price the outcome you can promise, in weeks you can count." },
      { type: "p", text: "The packages on my services page are the result: a two-week sprint, a full project, or a retainer. Everything else is one of those, bent a little." },
    ],
  },
]

export const USES = [
  {
    group: "Desk",
    items: [
      { name: "MacBook Pro 14\", M4", note: "One machine for design, code and the field. It survives rain in a dry bag." },
      { name: "Studio Display", note: "Calibrated once a month, because the pier screens are not." },
      { name: "Keychron Q1, brown switches", note: "Quiet enough for calls." },
      { name: "A pine trestle table", note: "Built from the studio's offcuts, with a slot for sketchbooks." },
    ],
  },
  {
    group: "Software",
    items: [
      { name: "Figma", note: "Flows and the design system; prototypes move to code by week two." },
      { name: "Cursor and VS Code", note: "React, TypeScript and a lot of CSS." },
      { name: "Linear", note: "One board per client, shared with them." },
      { name: "Glyphs", note: "For the type experiments." },
    ],
  },
  {
    group: "Field kit",
    items: [
      { name: "iPad mini and a rugged case", note: "Every field tool gets tested on it, with gloves." },
      { name: "Rite in the Rain notebook", note: "Pencil works when the iPad does not." },
      { name: "Ricoh GR III", note: "For the pictures that end up in case studies." },
    ],
  },
  {
    group: "Type",
    items: [
      { name: "Your theme's fonts", note: "This site wears whichever DressCode theme is installed, fonts included." },
      { name: "Lumen", note: "My own variable family, for the specimen and nothing else (yet)." },
    ],
  },
]

export const NOW = {
  updated: "2026-11-12",
  items: [
    { title: "Working on", body: "A field guide for Northwind Herbarium in Porto: 900 species, offline, with keys you can use with one hand." },
    { title: "Learning", body: "Throwing porcelain at Kiln on Thursday nights. My bowls are getting thinner; my cylinders are not." },
    { title: "Reading", body: "The Hidden Life of Trees, slowly, and every issue of a small Norwegian maps quarterly." },
    { title: "Not doing", body: "New retainers until March, conference talks until spring, and any project with a launch date set before the research." },
  ],
}
