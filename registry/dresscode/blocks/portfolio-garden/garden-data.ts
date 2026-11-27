// What only the Garden layout shows, beside the content it shares with the Portfolio template
// (components/portfolio/data.ts): an editorial version of a post (a standfirst, numbered margin notes,
// photographs) and a short caption for each project on the home page. Keyed by slug; a post or
// project with no entry here uses its shared text.
import type { Block } from "../portfolio/data"

import type { GARDEN_IMAGES } from "./assets"

export type GardenFigure = { type: "figure"; image: keyof typeof GARDEN_IMAGES; alt: string; caption: string }

/** A paragraph can carry a margin note; a figure is one of the sample photographs. */
export type GardenBlock = Block | { type: "p"; text: string; sidenote: string } | GardenFigure

export type Edition = { summary?: string; updated?: string; body?: GardenBlock[]; figure?: GardenFigure }

/** The issue line under your name on the home page. */
export const ISSUE = "Issue 14 · November 2026"

export const EDITIONS: Record<string, Edition> = {
  "design-for-gloves": {
    summary: "On a wet morning, the easiest button to find is the one you can feel sure of.",
    updated: "2026-11-02",
    body: [
      {
        type: "p",
        text: "The first time I tried to save a note on the quay, I took my glove off. Rain ran down the glass while I aimed for a small tick in the corner. I went home with a wet hand and a better idea of what the button needed to do.",
        sidenote: "The first trial was on the morning crossing.",
      },
      { type: "h2", text: "Cold hands" },
      { type: "p", text: "The wool at the tip of my thumb covered both the tick and the cross beside it. I could see the two controls until I reached for one." },
      { type: "h2", text: "A bigger target" },
      { type: "p", text: "I moved Save into a wide button at the foot of the screen. The next morning I could reach it with my thumb while my other hand held the notebook." },
      { type: "figure", image: "gloves", alt: "A gloved thumb reaches a wide green Save note button on a rain-covered phone by the water.", caption: "Testing Fieldnotes on the quay." },
      { type: "h2", text: "Reading the screen" },
      {
        type: "p",
        text: "Pale grey text vanished in the reflection of the sky. A darker label stayed readable when I tilted the screen toward the water.",
        sidenote: "Wet glass caught the brightest part of the sky.",
      },
      { type: "quote", text: "A button earns its place on a cold morning." },
      { type: "h2", text: "Back at the quay" },
      { type: "p", text: "The useful test was simple. Could I save what I had seen before the ferry pulled away?" },
    ],
  },
  "a-map-that-breathes": {
    summary: "A live map of eleven ferry lines, where small changes add up to a calmer, more useful picture of the city.",
    figure: { type: "figure", image: "ferry", alt: "A ferry route display stands beside the water.", caption: "The Tidewater display at the ferry pier." },
  },
  "variable-fonts-as-instruments": {
    figure: { type: "figure", image: "type", alt: "A type specimen shows letterforms at different weights.", caption: "A specimen from Lumen Type." },
  },
  "pricing-small-projects": {
    figure: { type: "figure", image: "estimate", alt: "A paper project estimate with handwritten notes.", caption: "Working through the scope of a small project." },
  },
}

/** Short captions under the work on the home page. */
export const CAPTIONS: Record<string, string> = {
  "fieldnotes": "An offline-first notebook for botanists.",
  "kiln": "Booking for a pottery studio.",
  "small-rooms": "Forty flats under 30 m².",
}
