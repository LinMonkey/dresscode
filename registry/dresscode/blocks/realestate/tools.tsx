"use client"

// Saved homes and searches (kept on this device) and the side-by-side comparison.
import { Heart, Plus, Search, X } from "lucide-react"
import Link from "next/link"
import { useState, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ListingCard, Photo } from "./cards"
import { LISTINGS, type Listing } from "./data"
import { fullAddress, hoodOf, money, payment, plain, to } from "./site"
import { useSaved } from "./ui"

const noop = () => () => {}

export function SavedHomes({ base }: { base: string }) {
  const { saved } = useSaved()
  const searches: string[] = JSON.parse(
    useSyncExternalStore(
      noop,
      () => {
        try {
          return localStorage.getItem("re-searches") ?? "[]"
        } catch {
          return "[]"
        }
      },
      () => "[]",
    ),
  )
  const homes = saved.map((s) => LISTINGS.find((l) => l.slug === s)).filter((l): l is Listing => !!l)
  return (
    <div className="grid gap-12">
      <section aria-labelledby="saved-homes">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="saved-homes" className="dc-h text-[26px]">
            {homes.length ? `${homes.length} saved ${homes.length === 1 ? "home" : "homes"}` : "No saved homes yet"}
          </h2>
          {homes.length > 1 ? (
            <Button variant="outline" size="lg" className="h-10 px-4" nativeButton={false} render={<Link href={`${to(base, "compare")}?homes=${homes.slice(0, 3).map((h) => h.slug).join(",")}`} />}>
              Compare {Math.min(3, homes.length)} homes
            </Button>
          ) : null}
        </div>
        {homes.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((l) => (
              <li key={l.slug}>
                <ListingCard base={base} l={l} onHover />
              </li>
            ))}
          </ul>
        ) : (
          <div className="dc-card flex flex-col items-start gap-3 p-6">
            <p className="flex items-center gap-2 text-[15px] text-muted-foreground">
              <Heart className="size-4" aria-hidden="true" /> Tap the heart on any home to keep it here.
            </p>
            <Button size="lg" className="h-10 px-4" nativeButton={false} render={<Link href={to(base, "buy")} />}>
              Find homes
            </Button>
          </div>
        )}
      </section>
      <section aria-labelledby="saved-searches">
        <h2 id="saved-searches" className="dc-h mb-4 text-[26px]">
          Saved searches
        </h2>
        {searches.length ? (
          <ul className="grid gap-2">
            {searches.map((s) => (
              <li key={s}>
                <Link href={s} className="dc-card flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-muted">
                  <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate">{describe(s)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-muted-foreground">Use “Save search” on the search page to keep a search here.</p>
        )}
      </section>
    </div>
  )
}

function describe(url: string) {
  const [path, qs = ""] = url.split("?")
  const q = new URLSearchParams(qs)
  const kind = path.endsWith("/rent") ? "For rent" : path.endsWith("/sold") ? "Sold" : "For sale"
  const bits = [kind]
  if (q.get("hood")) bits.push(hoodOf(q.get("hood")!).name)
  if (q.get("beds")) bits.push(`${q.get("beds")}+ bd`)
  if (q.get("max")) bits.push(`up to ${money(Number(q.get("max")))}`)
  if (q.get("type")) bits.push(q.get("type")!.replaceAll(",", ", "))
  if (q.get("tags")) bits.push(q.get("tags")!.replaceAll(",", ", "))
  return bits.join(" · ")
}

export function CompareHomes({ base }: { base: string }) {
  const fromUrl = useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get("homes") ?? "", () => "")
  const [picked, setPicked] = useState<string[] | null>(null)
  const chosen = (picked ?? (fromUrl ? fromUrl.split(",") : ["908-cedar-heights-road", "15-orchard-close", "41-linden-row"]))
    .map((s) => LISTINGS.find((l) => l.slug === s))
    .filter((l): l is Listing => !!l)
    .slice(0, 3)
  const update = (next: string[]) => {
    setPicked(next)
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?homes=${next.join(",")}`)
  }
  const rows: [string, (l: Listing) => string][] = [
    ["Price", (l) => money(l.price, l.status)],
    ["Est. monthly cost", (l) => (l.status === "sale" ? `${money(payment(l.price).total)}/mo` : "—")],
    ["Bedrooms", (l) => String(l.beds)],
    ["Bathrooms", (l) => String(l.baths)],
    ["Living area", (l) => `${plain(l.sqft)} sq ft`],
    ["Price per sq ft", (l) => (l.status === "rent" ? "—" : money(Math.round(l.price / l.sqft)))],
    ["Lot", (l) => (l.lot ? `${l.lot} acres` : "—")],
    ["Home type", (l) => l.type],
    ["Year built", (l) => String(l.year)],
    ["Parking", (l) => l.parking],
    ["HOA", (l) => (l.hoa ? `${money(l.hoa)}/mo` : "None")],
    ["Neighborhood", (l) => hoodOf(l.hood).name],
    ["Walk score", (l) => String(hoodOf(l.hood).scores.walk)],
  ]
  const others = LISTINGS.filter((l) => !chosen.some((c) => c.slug === l.slug))
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-[15px]">
        <caption className="sr-only">Homes side by side</caption>
        <thead>
          <tr>
            <th className="w-44" />
            {chosen.map((l) => (
              <th key={l.slug} scope="col" className="px-3 pb-4 text-left align-top font-normal">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden rounded-[var(--dc-radius-card)]">
                    <Photo src={l.photos[0]} alt="" />
                  </div>
                  <button type="button" onClick={() => update(chosen.filter((c) => c.slug !== l.slug).map((c) => c.slug))} aria-label={`Remove ${fullAddress(l)}`} className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-white/95 text-[#0f1a2e] shadow">
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <Link href={to(base, "homes", l.slug)} className="mt-3 block font-semibold hover:underline">
                  {fullAddress(l)}
                </Link>
              </th>
            ))}
            {chosen.length < 3 ? (
              <th scope="col" className="px-3 pb-4 align-top">
                <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-[var(--dc-radius-card)] border-2 border-dashed border-border text-[14px] font-medium text-muted-foreground hover:bg-muted">
                  <span className="grid place-items-center gap-2">
                    <Plus className="size-5" aria-hidden="true" /> Add a home
                    <select
                      value=""
                      onChange={(e) => e.target.value && update([...chosen.map((c) => c.slug), e.target.value])}
                      className="h-9 max-w-[180px] rounded-[var(--radius)] border border-[color:var(--input)] bg-background px-2 text-[14px] text-foreground"
                    >
                      <option value="">Choose…</option>
                      {others.map((l) => (
                        <option key={l.slug} value={l.slug}>
                          {fullAddress(l)}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => (
            <tr key={label} className="border-t border-border">
              <th scope="row" className="py-3 pr-3 text-left text-[14px] font-medium text-muted-foreground">
                {label}
              </th>
              {chosen.map((l) => (
                <td key={l.slug} className={cn("px-3 py-3 tabular-nums", label === "Price" && "dc-h text-[20px]")}>
                  {get(l)}
                </td>
              ))}
              {chosen.length < 3 ? <td /> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
