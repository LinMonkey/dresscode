// The shape of a DressCode component folder: registry/dresscode/components/<name>/
//
//   meta.ts               export default a ComponentMeta (this file's type)
//   ui/<file>.tsx         the component itself, if it has one; installs to components/ui/<file>.tsx
//   examples/<id>.tsx     one file per variant; `export default function`; installs to
//                         components/dresscode/<name>-<id>.tsx
//
// Examples import stock shadcn/ui from "@/components/ui/..." and the component from
// "@/registry/dresscode/components/<name>/ui/<file>" (rewritten to "@/components/ui/<file>" on install).
// tools/build-dresscode-registry.mjs finds the folders, writes the registry items and the site's index
// (components/generated.ts and generated-code.json); nothing else needs editing to add a component.

export type ComponentVariant = {
  /** kebab-case; the example file is examples/<id>.tsx */
  id: string
  title: string
  /** One sentence on what this variant shows. */
  description: string
  /** Height of the live preview on the docs page, in px. */
  height: number
  /** How the demo page places the example: centered in the frame (default), or from the top full width. */
  layout?: "center" | "top"
}

export type ComponentMeta = {
  /** kebab-case, the folder name and the registry item name */
  name: string
  title: string
  /** One or two sentences for the page header and the meta description. */
  description: string
  /** What people search for that this page answers, e.g. "shadcn timeline". */
  keywords: string[]
  variants: ComponentVariant[]
}
