export const GARDEN_STAGES = ["Seedling", "Budding", "Evergreen"] as const

export type GardenNote = {
  slug: string
  stage: (typeof GARDEN_STAGES)[number]
  title: string
  summary: string
  body: string
  links: readonly string[]
}

export const GARDEN_NOTES: readonly GardenNote[] = [
  {
    slug: "targets-for-cold-hands",
    stage: "Seedling",
    title: "Targets for cold hands",
    summary: "Designing touch targets that work with gloves, rain and low light.",
    body: "On a survey last autumn, the capture button was hard to aim at once our gloves got wet. Moving it to the same place on every screen helped as much as enlarging it. Next time I want to test the distance between Capture and Undo, with the phone held in one hand.",
    links: ["design-for-gloves"],
  },
  {
    slug: "why-ferries-are-late-on-fridays",
    stage: "Budding",
    title: "Why ferries are late on Fridays",
    summary: "A few patterns I've noticed in the ferry data, and what might explain them.",
    body: "The delays I marked start at boarding and carry over to the next crossing. Adding the time of the last departure to my map made that pattern easier to see. I'd like to compare Fridays with ordinary weekdays before I decide what else should appear on the pier screen.",
    links: ["a-map-that-breathes"],
  },
  {
    slug: "glaze-tests-as-a-colour-system",
    stage: "Evergreen",
    title: "Glaze tests as a colour system",
    summary: "How small, messy tests turned into a simple and useful palette.",
    body: "I photographed the studio's glaze tiles by the window, then printed the swatches to compare them with the originals. The dark greens and browns became the working palette, and the bright glazes stayed in the photos. Keeping the tests small let the studio make its colour decisions in a single afternoon.",
    links: ["pricing-small-projects"],
  },
  {
    slug: "fitting-a-map-in-a-pocket",
    stage: "Budding",
    title: "Fitting a map in a pocket",
    summary: "Trade-offs, tricks and thresholds for mobile maps that feel calm.",
    body: "At the pier I can see the whole river. On a phone, I can usually see one useful bit of it. Putting the next boat's departure at the bottom of the screen gives people somewhere familiar to look, even when the network stalls or the map pans away from their pier.",
    links: ["design-for-gloves", "a-map-that-breathes"],
  },
  {
    slug: "the-space-between-letters",
    stage: "Evergreen",
    title: "The space between letters",
    summary: "What I've learned about spacing from building a variable font.",
    body: "When I varied the weight in Lumen, I checked words as well as individual letters. A couple of pairs looked tight as the stems grew, even when the line still fit the same width. I adjusted the side bearings and tested the transitions at reading size, where small changes in rhythm were easiest to spot.",
    links: ["variable-fonts-as-instruments"],
  },
  {
    slug: "notes-from-a-small-room",
    stage: "Seedling",
    title: "Notes from a small room",
    summary: "Living and working in under 30 m², with a few things that help.",
    body: "One of the flats in the atlas had a long shelf just below the window. In the morning it was a desk. In the evening the owner put the chair away and watered the plants on it. I want to photograph a few more small rooms at two different times of day.",
    links: [],
  },
]
