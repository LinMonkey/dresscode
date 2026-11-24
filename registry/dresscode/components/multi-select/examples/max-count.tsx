"use client"

// Top skills: at most three picks. A meter and a hint count them, the list disables the rest once
// it is full (and says why), and the idle field shows two chips and "+1 more".
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MultiSelect, type MultiSelectOption } from "@/registry/dresscode/components/multi-select/ui/multi-select"
import { cn } from "@/lib/utils"

const MAX = 3

const SKILLS: MultiSelectOption[] = [
  { value: "ux-research", label: "UX research" },
  { value: "interaction-design", label: "Interaction design" },
  { value: "visual-design", label: "Visual design" },
  { value: "prototyping", label: "Prototyping" },
  { value: "design-systems", label: "Design systems" },
  { value: "copywriting", label: "UX writing", keywords: ["copywriting", "content"] },
  { value: "illustration", label: "Illustration" },
  { value: "motion-design", label: "Motion design", keywords: ["animation"] },
  { value: "frontend", label: "Frontend development", keywords: ["code", "react"] },
  { value: "accessibility", label: "Accessibility audits", keywords: ["a11y", "wcag"] },
  { value: "workshops", label: "Workshop facilitation" },
  { value: "brand-strategy", label: "Brand strategy" },
]

export default function MultiSelectMaxCount() {
  const [skills, setSkills] = React.useState<string[]>(["design-systems", "prototyping", "ux-research"])
  const full = skills.length >= MAX
  const labels = skills.map((v) => SKILLS.find((s) => s.value === v)?.label ?? v)

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Top skills</CardTitle>
        <CardDescription>Pick up to three. They show on your public profile and help clients find you in search.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="top-skills">Skills</Label>
        <MultiSelect
          id="top-skills"
          aria-describedby="top-skills-hint"
          options={SKILLS}
          value={skills}
          onValueChange={setSkills}
          max={MAX}
          maxChips={2}
          placeholder="Pick up to three skills…"
          emptyMessage={(query) => `No skill called “${query}”.`}
        />
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex gap-1">
            {Array.from({ length: MAX }, (_, i) => (
              <span key={i} className={cn("h-1.5 w-6 rounded-full transition-colors", i < skills.length ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
          <p id="top-skills-hint" aria-live="polite" className="text-xs text-muted-foreground">
            {full ? "3 of 3 picked. Remove one to choose another." : `${skills.length} of ${MAX} picked`}
          </p>
        </div>

        <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3">
          <p className="mb-2.5 text-xs text-muted-foreground">How clients see it</p>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm leading-tight font-medium">Maya Lindqvist</p>
              <p className="text-xs text-muted-foreground">Freelance product designer, Oslo</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {labels.length ? (
                  labels.map((l) => (
                    <Badge key={l} variant="outline">
                      {l}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Your top skills show here.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
