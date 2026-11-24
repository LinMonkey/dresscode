"use client"

// Project labels: tag a project with colored labels, see how often each one is used, and add the
// suggested ones in one click. Controlled: the suggestions and the count read the same state.
import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MultiSelect, type MultiSelectOption } from "@/registry/dresscode/components/multi-select/ui/multi-select"

type ProjectLabel = MultiSelectOption & { color: string; projects: number }

const LABELS: ProjectLabel[] = [
  { value: "design", label: "Design", color: "var(--chart-1)", projects: 14 },
  { value: "frontend", label: "Frontend", color: "var(--chart-2)", projects: 11 },
  { value: "backend", label: "Backend", color: "var(--chart-3)", projects: 9 },
  { value: "copywriting", label: "Copywriting", color: "var(--chart-4)", projects: 6 },
  { value: "research", label: "Research", color: "var(--chart-5)", projects: 5 },
  { value: "client-request", label: "Client request", color: "var(--chart-2)", projects: 10 },
  { value: "needs-review", label: "Needs review", color: "var(--chart-3)", projects: 8 },
  { value: "quick-win", label: "Quick win", color: "var(--chart-4)", projects: 7 },
  { value: "accessibility", label: "Accessibility", color: "var(--chart-1)", projects: 4 },
  { value: "performance", label: "Performance", color: "var(--chart-5)", projects: 3 },
  { value: "blocked", label: "Blocked", color: "var(--destructive)", projects: 2 },
  { value: "legacy-site", label: "Legacy site", color: "var(--muted-foreground)", projects: 0, disabled: true },
]

const SUGGESTED = ["accessibility", "performance", "quick-win"]

function Dot({ color }: { color: string }) {
  return <span aria-hidden="true" className="size-2 shrink-0 rounded-full ring-1 ring-foreground/15 ring-inset" style={{ backgroundColor: color }} />
}

export default function MultiSelectTags() {
  const [labels, setLabels] = React.useState<string[]>(["design", "frontend", "client-request"])
  const suggestions = LABELS.filter((l) => SUGGESTED.includes(l.value) && !labels.includes(l.value))

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Website relaunch</CardTitle>
        <CardDescription>Labels help the team find this project on boards and in reports.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="project-labels">Labels</Label>
        <MultiSelect
          id="project-labels"
          options={LABELS}
          value={labels}
          onValueChange={setLabels}
          placeholder="Add labels…"
          emptyMessage={(query) => `No labels match “${query}”.`}
          renderChip={(l) => (
            <>
              <Dot color={l.color} />
              <span className="truncate">{l.label}</span>
            </>
          )}
          renderOption={(l) => (
            <>
              <Dot color={l.color} />
              <span className="min-w-0 flex-1 truncate">{l.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {l.disabled ? "Archived" : `${l.projects} ${l.projects === 1 ? "project" : "projects"}`}
              </span>
            </>
          )}
          chipClassName="pl-1.5"
        />
        {suggestions.length ? (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="mr-0.5 text-xs text-muted-foreground">Suggested</span>
            {suggestions.map((l) => (
              <Button key={l.value} variant="outline" size="xs" onClick={() => setLabels((current) => [...current, l.value])}>
                <PlusIcon data-icon="inline-start" />
                {l.label}
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between gap-4 text-xs text-muted-foreground">
        <span aria-live="polite">
          {labels.length === 0 ? "No labels yet" : `${labels.length} ${labels.length === 1 ? "label" : "labels"}`}
        </span>
        <span>Changes save automatically</span>
      </CardFooter>
    </Card>
  )
}
