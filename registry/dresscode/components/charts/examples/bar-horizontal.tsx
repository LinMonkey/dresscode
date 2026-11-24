"use client"

// Top clients by revenue: horizontal bars with the client on the left and the amount at the end of each
// bar. The top three keep the full color; the tooltip adds the share of revenue and the change on 2025.
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  rest: { label: "Revenue", color: "color-mix(in oklab, var(--chart-1) 45%, var(--card))" },
} satisfies ChartConfig

// Sample data: revenue by client, January 1 to November 24, 2026, against the same stretch of 2025.
const REVENUE_YTD = 470_200
const CLIENTS = [
  { client: "Fernwood Studio", revenue: 64200, lastYear: 51800, invoices: 22 },
  { client: "Kato & Lee", revenue: 52800, lastYear: 55100, invoices: 11 },
  { client: "Pellucid Health", revenue: 41350, lastYear: 28900, invoices: 14 },
  { client: "Northgate Logistics", revenue: 33900, lastYear: 30400, invoices: 9 },
  { client: "Marlow & Finch", revenue: 27450, lastYear: 0, invoices: 8 },
  { client: "Bluefield Schools", revenue: 21600, lastYear: 19750, invoices: 6 },
  { client: "Quarry Lane Coffee", revenue: 18240, lastYear: 16300, invoices: 12 },
].map((c, i) => ({ ...c, fill: i < 3 ? "var(--color-revenue)" : "var(--color-rest)" }))
type Client = (typeof CLIENTS)[number]

const TOP3 = CLIENTS.slice(0, 3).reduce((n, c) => n + c.revenue, 0)

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 })

export default function ChartsBarHorizontal() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Top clients by revenue</CardTitle>
        <CardDescription>January 1 to November 24, 2026</CardDescription>
        <CardAction className="text-right">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{Math.round((TOP3 / REVENUE_YTD) * 100)}%</p>
          <p className="text-xs text-muted-foreground">of revenue from the top three</p>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-foreground rounded-md has-[.recharts-surface:focus-visible]:ring-3 has-[.recharts-surface:focus-visible]:ring-ring/50 [&_g[tabindex]]:outline-hidden">
          <BarChart data={CLIENTS} layout="vertical" margin={{ top: 0, right: 52, bottom: 0, left: 0 }} barCategoryGap="22%">
            <XAxis type="number" dataKey="revenue" hide />
            <YAxis
              type="category"
              dataKey="client"
              tickLine={false}
              axisLine={false}
              width={156}
              tickMargin={6}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              content={
                <ChartTooltipContent
                  className="min-w-52"
                  formatter={(value, _name, item) => {
                    const c = item.payload as Client
                    const change = c.lastYear ? ((c.revenue - c.lastYear) / c.lastYear) * 100 : null
                    return (
                      <div className="grid w-full gap-1">
                        <div className="flex items-center gap-2">
                          <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: c.fill }} />
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="ml-auto font-medium text-foreground tabular-nums">{usd.format(Number(value))}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-4.5 text-muted-foreground">
                          Share of revenue
                          <span className="ml-auto text-foreground tabular-nums">{((c.revenue / REVENUE_YTD) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2 pl-4.5 text-muted-foreground">
                          On 2025
                          <span className="ml-auto text-foreground tabular-nums">
                            {change == null ? "New client" : `${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(0)}%`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pl-4.5 text-muted-foreground">
                          Invoices
                          <span className="ml-auto text-foreground tabular-nums">{c.invoices}</span>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar dataKey="revenue" radius={4} maxBarSize={30}>
              <LabelList
                dataKey="revenue"
                position="right"
                offset={8}
                className="fill-foreground tabular-nums"
                fontSize={12}
                formatter={(v) => usdShort.format(Number(v))}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <table className="sr-only">
          <caption>Top clients by revenue, 2026 so far</caption>
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Revenue</th>
              <th scope="col">Share of revenue</th>
              <th scope="col">Invoices</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr key={c.client}>
                <th scope="row">{c.client}</th>
                <td>{usd.format(c.revenue)}</td>
                <td>{((c.revenue / REVENUE_YTD) * 100).toFixed(1)}%</td>
                <td>{c.invoices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-x-4 gap-y-2 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">{usd.format(TOP3)}</span> of {usd.format(REVENUE_YTD)} came from three clients
        </p>
        <Button variant="outline" size="sm">
          All clients
        </Button>
      </CardFooter>
    </Card>
  )
}
