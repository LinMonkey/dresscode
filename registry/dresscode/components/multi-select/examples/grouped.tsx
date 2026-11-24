"use client"

// Sales regions: pick countries grouped by region. Search matches names, codes and other names
// ("UK", "Holland"), countries that are not supported yet are disabled, and the field folds long
// lists into "+N more" while you are not editing it.
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectOptionGroup,
} from "@/registry/dresscode/components/multi-select/ui/multi-select"

type Country = MultiSelectOption & { note?: string }

const country = (value: string, label: string, extra: Partial<Country> = {}): Country => ({
  value,
  label,
  ...extra,
  keywords: [value, ...(extra.keywords ?? [])],
})

const REGIONS: MultiSelectOptionGroup<Country>[] = [
  {
    label: "Europe",
    options: [
      country("AT", "Austria"),
      country("BE", "Belgium"),
      country("DK", "Denmark"),
      country("FI", "Finland"),
      country("FR", "France"),
      country("DE", "Germany", { keywords: ["Deutschland"] }),
      country("IE", "Ireland"),
      country("IT", "Italy"),
      country("NL", "Netherlands", { keywords: ["Holland"] }),
      country("NO", "Norway"),
      country("PL", "Poland"),
      country("PT", "Portugal"),
      country("ES", "Spain", { keywords: ["España"] }),
      country("SE", "Sweden"),
      country("CH", "Switzerland"),
      country("GB", "United Kingdom", { keywords: ["UK", "Britain", "England", "Scotland", "Wales"] }),
    ],
  },
  {
    label: "North America",
    options: [country("CA", "Canada"), country("MX", "Mexico"), country("US", "United States", { keywords: ["USA", "America"] })],
  },
  {
    label: "Latin America",
    options: [
      country("AR", "Argentina"),
      country("BR", "Brazil", { disabled: true, note: "From January" }),
      country("CL", "Chile"),
      country("CO", "Colombia"),
    ],
  },
  {
    label: "Asia Pacific",
    options: [
      country("AU", "Australia"),
      country("IN", "India", { disabled: true, note: "Not supported yet" }),
      country("JP", "Japan"),
      country("NZ", "New Zealand"),
      country("SG", "Singapore"),
      country("KR", "South Korea", { keywords: ["Korea"] }),
    ],
  },
  {
    label: "Middle East and Africa",
    options: [
      country("IL", "Israel"),
      country("KE", "Kenya"),
      country("NG", "Nigeria"),
      country("ZA", "South Africa"),
      country("AE", "United Arab Emirates", { keywords: ["UAE", "Dubai"] }),
    ],
  },
]

export default function MultiSelectGrouped() {
  const [countries, setCountries] = React.useState<string[]>(["DE", "FR", "NL", "GB", "IE", "ES", "US", "CA", "AU"])
  const byRegion = REGIONS.map((r) => ({ label: r.label, count: r.options.filter((c) => countries.includes(c.value)).length })).filter((r) => r.count)

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Sales regions</CardTitle>
        <CardDescription>Customers in these countries can check out. Prices show in their currency and tax follows the country.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="sales-countries">Countries</Label>
        <MultiSelect
          id="sales-countries"
          options={REGIONS}
          value={countries}
          onValueChange={setCountries}
          maxChips={4}
          placeholder="Search countries…"
          emptyMessage={(query) => (
            <>
              <span className="font-medium text-foreground">No country matches “{query}”</span>
              <span>Try its English name or its two-letter code.</span>
            </>
          )}
          renderOption={(c) => (
            <>
              <span className="min-w-0 flex-1 truncate">{c.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{c.note ?? c.value}</span>
            </>
          )}
        />
        <p className="text-xs text-muted-foreground">Brazil opens for checkout in January. India is not supported yet.</p>
      </CardContent>
      <CardFooter className="flex-wrap gap-1.5">
        {byRegion.length ? (
          <>
            <span className="mr-1 text-xs text-muted-foreground">
              {countries.length} {countries.length === 1 ? "country" : "countries"} in {byRegion.length} {byRegion.length === 1 ? "region" : "regions"}
            </span>
            {byRegion.map((r) => (
              <Badge key={r.label} variant="outline" className="tabular-nums">
                {r.label} · {r.count}
              </Badge>
            ))}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">No countries yet: nobody can check out.</span>
        )}
      </CardFooter>
    </Card>
  )
}
