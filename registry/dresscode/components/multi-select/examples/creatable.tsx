"use client"

// Invoice tags: find a tag or type a new one and pick "Create “…”" (or press Enter). New tags join the
// workspace list, so they show up for the next invoice too.
import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MultiSelect, type MultiSelectOption } from "@/registry/dresscode/components/multi-select/ui/multi-select"

const WORKSPACE_TAGS: MultiSelectOption[] = [
  { value: "retainer", label: "Retainer", description: "Used on 24 invoices" },
  { value: "consulting", label: "Consulting", description: "Used on 18 invoices" },
  { value: "design-sprint", label: "Design sprint", description: "Used on 9 invoices" },
  { value: "recurring", label: "Recurring", description: "Used on 31 invoices" },
  { value: "rush-job", label: "Rush job", description: "Used on 4 invoices" },
  { value: "hardware", label: "Hardware", description: "Used on 6 invoices" },
  { value: "software-licences", label: "Software licences", description: "Used on 11 invoices" },
  { value: "travel", label: "Travel", description: "Used on 7 invoices" },
  { value: "q4-2026", label: "Q4 2026", description: "Used on 15 invoices" },
]

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export default function MultiSelectCreatable() {
  const [tags, setTags] = React.useState<MultiSelectOption[]>(WORKSPACE_TAGS)
  const [picked, setPicked] = React.useState<string[]>(["retainer", "q4-2026"])
  const [lastCreated, setLastCreated] = React.useState<string | null>(null)

  const create = (text: string) => {
    const label = text.charAt(0).toUpperCase() + text.slice(1)
    const value = slug(label) || label
    // "Rush job!" is the "Rush job" tag that already exists: pick that one instead of a twin.
    const existing = tags.find((t) => t.value === value)
    if (existing) return existing
    const option = { value, label, description: "New tag" }
    setTags((list) => [...list, option])
    setLastCreated(label)
    return option
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Tags for INV-1043</CardTitle>
        <CardDescription>Tags group invoices in reports. Type to find one, or create a new tag on the spot.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="invoice-tags">Tags</Label>
        <MultiSelect
          id="invoice-tags"
          aria-describedby="invoice-tags-hint"
          options={tags}
          value={picked}
          onValueChange={setPicked}
          creatable
          onCreate={create}
          placeholder="Find or create a tag…"
          emptyMessage="Type a name to create your first tag."
        />
        <p id="invoice-tags-hint" className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
          {lastCreated ? (
            <>
              <SparklesIcon aria-hidden="true" className="size-3.5 text-primary" />
              Created “{lastCreated}”. It is in the workspace tag list now.
            </>
          ) : (
            `${tags.length} tags in this workspace. Press Enter to create the one you typed.`
          )}
        </p>
      </CardContent>
    </Card>
  )
}
