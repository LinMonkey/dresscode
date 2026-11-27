import { Leaf } from "lucide-react"

export function GardenLeaf({ stage }: { stage: string }) {
  return <span className="inline-flex items-center gap-1.5"><Leaf aria-hidden="true" className="size-[1em] fill-[var(--dc-highlight)] text-[var(--dc-accent)]" />{stage}</span>
}
