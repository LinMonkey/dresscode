// The shape of a DressCode block category: registry/dresscode/sections/<category>/
//
//   meta.ts        export default a BlockCategoryMeta (this file's type)
//   <id>.tsx       one file per block; `export default function`; installs to
//                  components/dresscode/<category>-<id>.tsx
//
// A block is one section of a page (a hero, a pricing table, a sign-in form) in a single file. It imports
// stock shadcn/ui from "@/components/ui/...", DressCode components from
// "@/registry/dresscode/components/<name>/ui/<file>" (rewritten to "@/components/ui/<file>" on install),
// "@/lib/utils" and npm packages, nothing else. It may use the dc-* classes every DressCode theme installs
// (dc-h, dc-num, dc-card, dc-band, dc-icon, dc-pill-*, dc-mark-*) and the --dc-* variables.
// tools/build-dresscode-registry.mjs finds the folders and writes the registry items and the site's index
// (sections/generated.ts and generated-code.json); nothing else needs editing to add a category.

export type BlockMeta = {
  /** kebab-case; the file is <id>.tsx and the registry item is <category>-<id> */
  id: string
  title: string
  /** One sentence on what this block is for and what it shows. */
  description: string
  /** Height of the preview at desktop width before the frame measures the block, in px. */
  height: number
}

export type BlockCategoryMeta = {
  /** kebab-case, the folder name and the page slug: /blocks/<name> */
  name: string
  /** The page title, e.g. "Hero sections". */
  title: string
  /** The short name on cards and in lists, e.g. "Hero". */
  short: string
  /** One or two sentences for the page header and the meta description. */
  description: string
  /** What people search for that this page answers, e.g. "shadcn hero section". */
  keywords: string[]
  group: "marketing" | "application"
  /** Order on the /blocks index within the group; lower first. */
  order: number
  blocks: BlockMeta[]
}
