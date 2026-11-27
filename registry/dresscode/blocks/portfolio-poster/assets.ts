import { PERSON } from "../portfolio/data"

/** The home page's photo: yours (PERSON.portrait in data.ts) or the sample. The registry packs the sample into the installed template. */
export const POSTER_PORTRAIT = {
  src: PERSON.portrait ?? "/portfolio/styles/portrait-street.webp",
  alt: `Portrait of ${PERSON.name}`,
  width: 472,
  height: 374,
}
