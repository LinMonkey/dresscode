"use client"

// Reviewers: pick teammates with their avatar and role, shown as avatar chips (an avatar stack when
// they fold into "+N"). Composed from the parts, so the chips, rows and overflow are your own markup.
// The team loads when the list first opens, and people who are away can't be picked.
import * as React from "react"
import { CircleCheckIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  MultiSelectChip,
  MultiSelectChips,
  MultiSelectClear,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectField,
  MultiSelectFooter,
  MultiSelectInput,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectOverflow,
  MultiSelectRoot,
  MultiSelectStatus,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/registry/dresscode/components/multi-select/ui/multi-select"

type Person = { value: string; label: string; role: string; initials: string; away?: string }

const TEAM: Person[] = [
  { value: "ada", label: "Ada Lin", role: "Finance lead", initials: "AL" },
  { value: "tom", label: "Tom Okafor", role: "Account manager", initials: "TO" },
  { value: "grace", label: "Grace Mensah", role: "Founder", initials: "GM" },
  { value: "sofia", label: "Sofía Reyes", role: "Bookkeeper", initials: "SR" },
  { value: "maya", label: "Maya Lindqvist", role: "Product designer", initials: "ML" },
  { value: "noah", label: "Noah Fischer", role: "Operations", initials: "NF", away: "Out of office until Dec 2" },
  { value: "kenji", label: "Kenji Watanabe", role: "Engineer", initials: "KW" },
  { value: "priya", label: "Priya Raman", role: "Engineer", initials: "PR" },
  { value: "leo", label: "Léo Martin", role: "Sales", initials: "LM" },
]

const NEEDED = 2
const firstName = (p: Person) => p.label.split(" ")[0]
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
const listNames = (people: Person[]) =>
  people.length < 2 ? people.map(firstName).join("") : `${people.slice(0, -1).map(firstName).join(", ")} and ${firstName(people[people.length - 1])}`

function PersonAvatar({ person, className }: { person: Person; className?: string }) {
  return (
    <Avatar size="sm" className={className}>
      <AvatarFallback className="bg-background text-[10px] font-medium text-foreground">{person.initials}</AvatarFallback>
    </Avatar>
  )
}

export default function MultiSelectAssignees() {
  const [reviewers, setReviewers] = React.useState<Person[]>([TEAM[0], TEAM[1]])
  const [team, setTeam] = React.useState<Person[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [requested, setRequested] = React.useState<string | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  // Stands in for a request to your API the first time the list opens.
  const loadTeam = (open: boolean) => {
    if (!open || team || loading) return
    setLoading(true)
    timer.current = setTimeout(() => {
      setTeam(TEAM)
      setLoading(false)
    }, 700)
  }

  const missing = Math.max(0, NEEDED - reviewers.length)

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Request a review</CardTitle>
        <CardDescription>INV-1043 for Fernwood Studio is over $5,000, so two people sign it off before it goes out.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="invoice-reviewers">Reviewers</Label>
        <MultiSelectRoot<Person>
          id="invoice-reviewers"
          items={team ?? []}
          value={reviewers}
          onValueChange={(next) => {
            setReviewers(next)
            setRequested(null)
          }}
          isItemEqualToValue={(a, b) => a.value === b.value}
          filter={(p, query) => [p.label, p.role].some((text) => fold(text).includes(fold(query.trim())))}
          onOpenChange={loadTeam}
          autoHighlight
        >
          <MultiSelectField>
            <MultiSelectChips>
              <MultiSelectValue<Person>
                max={3}
                overflow={(hidden) => (
                  <MultiSelectOverflow className="gap-1 pl-0.5" title={hidden.map((p) => p.label).join(", ")}>
                    <span className="flex -space-x-1.5">
                      {hidden.slice(0, 3).map((p) => (
                        <PersonAvatar key={p.value} person={p} className="size-5 ring-2 ring-background" />
                      ))}
                    </span>
                    +{hidden.length}
                  </MultiSelectOverflow>
                )}
              >
                {(p) => (
                  <MultiSelectChip key={p.value} removeLabel={`Remove ${p.label}`} className="gap-1.5 pl-0.5">
                    <PersonAvatar person={p} className="size-5" />
                    <span className="truncate">{firstName(p)}</span>
                  </MultiSelectChip>
                )}
              </MultiSelectValue>
              <MultiSelectInput placeholder={reviewers.length ? undefined : "Add reviewers…"} aria-describedby="invoice-reviewers-hint" />
            </MultiSelectChips>
            <MultiSelectClear />
            <MultiSelectTrigger />
          </MultiSelectField>
          <MultiSelectContent>
            <MultiSelectStatus className="sr-only">{loading ? "Loading teammates" : team ? `${team.length} teammates` : ""}</MultiSelectStatus>
            <MultiSelectEmpty>
              {loading || !team ? (
                <span className="flex items-center gap-2">
                  <Spinner aria-hidden="true" />
                  Loading teammates…
                </span>
              ) : (
                "Nobody on the team matches that name or role."
              )}
            </MultiSelectEmpty>
            <MultiSelectList>
              {(p: Person) => (
                <MultiSelectItem key={p.value} value={p} disabled={Boolean(p.away)}>
                  <PersonAvatar person={p} className="size-7" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{p.label}</span>
                    <span className="truncate text-xs text-muted-foreground">{p.away ?? p.role}</span>
                  </span>
                </MultiSelectItem>
              )}
            </MultiSelectList>
            <MultiSelectFooter>Only people who can see invoices are listed.</MultiSelectFooter>
          </MultiSelectContent>
        </MultiSelectRoot>
        <p id="invoice-reviewers-hint" aria-live="polite" className="text-xs text-muted-foreground">
          {missing ? `Pick ${missing} more ${missing === 1 ? "reviewer" : "reviewers"}.` : "Each reviewer gets an email and a task in their inbox."}
        </p>
      </CardContent>
      <CardFooter className="flex-wrap justify-end gap-2">
        <p aria-live="polite" className="mr-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          {requested ? (
            <>
              <CircleCheckIcon aria-hidden="true" className="size-4 text-primary" />
              Review requested from {requested}.
            </>
          ) : null}
        </p>
        <Button disabled={missing > 0 || Boolean(requested)} onClick={() => setRequested(listNames(reviewers))}>
          {requested ? "Requested" : "Request review"}
        </Button>
      </CardFooter>
    </Card>
  )
}
