import { PERSON } from "../portfolio/data"

/** The About window's photo: yours (PERSON.portrait in data.ts) or the sample. The registry packs the sample into the installed template. */
export const DESKTOP_PORTRAIT = {
  src: PERSON.portrait ?? "/portfolio/styles/portrait-studio.webp",
  alt: `Portrait of ${PERSON.name}`,
  width: 371,
  height: 421,
}
