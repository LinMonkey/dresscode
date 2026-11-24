"use client"

// Clients: the list (type tabs, search, "owes money" filter, sortable columns, pages, row menu) and
// one client's page (stats, their invoices, payments and notes, contact, billing preferences and how
// fast they pay).
import { ArrowLeft, FilePlus2, FileText, Mail, MoreHorizontal, Pencil, Archive, Upload, UserPlus, Eye, Send, Link2, StickyNote } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { useOrbit, useParam } from "./context"
import { Head, Pager, SearchBox, SimpleSelect, SortHead, opts, type Sort } from "./controls"
import { CLIENTS, PAYMENTS, clientById, clientInvoices, money, moneyShort, type Client } from "./data"
import { ChartTip, ClientMark, EmptyState, Field, PageHeader, Panel, Pill, StatCard, StatusPill, flat } from "./ui"

type Col = "name" | "invoices" | "billed" | "outstanding" | "days"
type Kind = "All" | "Retainer" | "Project"
const compare: Record<Col, (a: Client, b: Client) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  invoices: (a, b) => a.invoices - b.invoices,
  billed: (a, b) => a.billed - b.billed,
  outstanding: (a, b) => a.outstanding - b.outstanding,
  days: (a, b) => a.daysToPay - b.daysToPay,
}

function PayDays({ days }: { days: number }) {
  const tone = days <= 10 ? "bg-[color:var(--chart-1)]" : days >= 20 ? "bg-[color:var(--dc-danger)]" : "bg-[color:var(--chart-2)]"
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-muted xl:block" aria-hidden="true">
        <span className={cn("block h-full rounded-full", tone)} style={{ width: `${Math.min(100, (days / 30) * 100)}%` }} />
      </span>
      <span className="dc-num w-14 text-right">{days} days</span>
    </span>
  )
}

export function ClientsScreen() {
  const { href, openDialog } = useOrbit()
  const router = useRouter()
  const [kind, setKind] = useState<Kind>("All")
  const [query, setQuery] = useState("")
  const [owing, setOwing] = useState(false)
  const [sort, setSort] = useState<Sort<Col>>({ key: "billed", dir: "desc" })
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const dir = sort.dir === "asc" ? 1 : -1
    return CLIENTS.filter(
      (c) => (kind === "All" || c.kind === kind) && (!owing || c.outstanding > 0) && (!q || `${c.name} ${c.contact} ${c.email} ${c.city}`.toLowerCase().includes(q)),
    ).sort((a, b) => compare[sort.key](a, b) * dir)
  }, [kind, query, owing, sort])
  const pages = Math.max(1, Math.ceil(list.length / pageSize))
  const current = Math.min(page, pages - 1)
  const shown = list.slice(current * pageSize, (current + 1) * pageSize)
  const owed = CLIENTS.reduce((s, c) => s + c.outstanding, 0)
  const fastest = [...CLIENTS].sort((a, b) => a.daysToPay - b.daysToPay)[0]
  const slowest = [...CLIENTS].sort((a, b) => b.daysToPay - a.daysToPay)[0]
  const count = (k: Kind) => (k === "All" ? CLIENTS.length : CLIENTS.filter((c) => c.kind === k).length)

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Clients"
        description={`${CLIENTS.length} clients · ${money(owed)} owed to you`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Choose a CSV with name and email columns.", { description: "Orbit matches the rest for you." })}>
              <Upload /> Import
            </Button>
            <Button className="font-semibold" onClick={() => openDialog("client")}>
              <UserPlus /> Add client
            </Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Billed this year" value={moneyShort(CLIENTS.reduce((s, c) => s + c.billed, 0))} note="Across every client" />
        <StatCard label="Pays fastest" value={fastest.name} note={`${fastest.daysToPay} days on average`} />
        <StatCard label="Pays slowest" value={slowest.name} note={`${slowest.daysToPay} days, worth a firmer reminder plan`} />
      </div>

      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 lg:flex-row lg:items-center">
          <Tabs
            value={kind}
            onValueChange={(v) => {
              setKind(v as Kind)
              setPage(0)
            }}
          >
            <TabsList className="h-9">
              {(["All", "Retainer", "Project"] as Kind[]).map((k) => (
                <TabsTrigger key={k} value={k} className="h-full px-3 text-[13px]">
                  {k === "All" ? "All" : `${k}s`}
                  <span className="dc-num rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] px-1.5 text-[11px] leading-4 text-muted-foreground">{count(k)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
            <SearchBox
              value={query}
              onChange={(v) => {
                setQuery(v)
                setPage(0)
              }}
              placeholder="Search name, contact or city"
              label="Search clients"
              className="w-full sm:w-64"
            />
            <label className="flex items-center gap-2 text-[13px] font-medium">
              <Switch
                checked={owing}
                onCheckedChange={(v) => {
                  setOwing(v)
                  setPage(0)
                }}
              />
              Owes money
            </label>
          </div>
        </div>
        {shown.length === 0 ? (
          <EmptyState icon={UserPlus} title="No clients match" body="Try another name, or add them as a new client." actions={<Button onClick={() => openDialog("client")}>Add client</Button>} />
        ) : (
          <>
            <div className="hidden sm:block">
              <Table className="text-[14px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <SortHead label="Client" column="name" sort={sort} onSort={setSort} className="pl-5" />
                    <Head className="hidden lg:table-cell">Type</Head>
                    <SortHead label="Invoices" column="invoices" sort={sort} onSort={setSort} align="right" className="hidden md:table-cell" />
                    <SortHead label="Billed" column="billed" sort={sort} onSort={setSort} align="right" />
                    <SortHead label="Owes" column="outstanding" sort={sort} onSort={setSort} align="right" />
                    <SortHead label="Pays in" column="days" sort={sort} onSort={setSort} align="right" className="hidden md:table-cell" />
                    <Head className="hidden xl:table-cell">Last invoice</Head>
                    <Head className="w-12 pr-4">
                      <span className="sr-only">Actions</span>
                    </Head>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((c) => (
                    <TableRow key={c.id} className="cursor-pointer" onClick={() => router.push(href("client", { id: c.id }))}>
                      <TableCell className="pl-5">
                        <span className="flex items-center gap-3">
                          <ClientMark name={c.name} />
                          <span className="min-w-0">
                            <Link href={href("client", { id: c.id })} onClick={(e) => e.stopPropagation()} className="block max-w-[220px] truncate font-medium hover:underline">
                              {c.name}
                            </Link>
                            <span className="block max-w-[220px] truncate text-[12px] text-muted-foreground">
                              {c.contact} · {c.email}
                            </span>
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Pill tone={c.kind === "Retainer" ? "line" : "muted"}>{c.kind}</Pill>
                      </TableCell>
                      <TableCell className="dc-num hidden text-right md:table-cell">{c.invoices}</TableCell>
                      <TableCell className="dc-num text-right">{moneyShort(c.billed)}</TableCell>
                      <TableCell className={cn("dc-num text-right", c.outstanding ? "font-semibold" : "text-muted-foreground")}>{c.outstanding ? money(c.outstanding) : "—"}</TableCell>
                      <TableCell className="hidden text-right md:table-cell">
                        <PayDays days={c.daysToPay} />
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground xl:table-cell">{c.lastInvoice}</TableCell>
                      <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <ClientMenu c={c} onView={() => router.push(href("client", { id: c.id }))} onInvoice={() => router.push(href("invoice-new"))} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ul className="divide-y divide-border sm:hidden">
              {shown.map((c) => (
                <li key={c.id}>
                  <Link href={href("client", { id: c.id })} className="flex items-center gap-3 px-4 py-3 active:bg-muted">
                    <ClientMark name={c.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{c.name}</span>
                      <span className="block truncate text-[12px] text-muted-foreground">
                        {c.invoices} invoices · pays in {c.daysToPay} days
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="dc-num block text-[14px] font-semibold">{moneyShort(c.billed)}</span>
                      {c.outstanding ? <span className="dc-num block text-[12px] text-[color:var(--dc-danger)]">owes {money(c.outstanding)}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Pager
              page={current}
              pageSize={pageSize}
              total={list.length}
              onPage={setPage}
              onPageSize={(n) => {
                setPageSize(n)
                setPage(0)
              }}
              noun="clients"
            />
          </>
        )}
      </Panel>
    </div>
  )
}

function ClientMenu({ c, onView, onInvoice }: { c: Client; onView: () => void; onInvoice: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className={cn(flat, "text-muted-foreground")} aria-label={`Actions for ${c.name}`} />}>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onView}>
          <Eye /> View client
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onInvoice}>
          <FilePlus2 /> New invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success(`Statement sent to ${c.email}`, { description: "Every invoice this year, with what is still open." })}>
          <Send /> Send statement
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast(`${c.name} archived`, { description: "Their invoices stay in your reports." })}>
          <Archive /> Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ClientDetailScreen() {
  return (
    <Suspense fallback={<ClientDetail c={clientById("fernwood-studio")} />}>
      <ClientFromQuery />
    </Suspense>
  )
}

function ClientFromQuery() {
  const c = clientById(useParam("id") ?? "fernwood-studio")
  return <ClientDetail key={c.id} c={c} />
}

const daysConfig = { days: { label: "Days to pay", color: "var(--chart-1)" } } satisfies ChartConfig

function ClientDetail({ c }: { c: Client }) {
  const { href } = useOrbit()
  const router = useRouter()
  const invoices = [...clientInvoices(c)].sort((a, b) => b.issuedDay - a.issuedDay)
  const payments = PAYMENTS.filter((p) => p.clientId === c.id)
  const [remind, setRemind] = useState(true)
  const [autopay, setAutopay] = useState(c.kind === "Retainer")
  const [ccAccounts, setCcAccounts] = useState(false)
  const [terms, setTerms] = useState("Net 14")
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState([
    { text: "Prefers invoices on the 1st. Send to Mara, cc accounts for anything over $5k.", when: "Oct 2" },
    { text: "Agreed to a 5% rate rise from January.", when: "Sep 14" },
  ])
  const paidHistory = invoices
    .filter((i) => i.status === "Paid" && i.paidOn)
    .slice(0, 6)
    .reverse()
    .map((i, n) => ({ id: i.id, days: Math.max(2, c.daysToPay + ((n * 5) % 7) - 3) }))
  // A week-based scale that always shows the 14-day terms line.
  const daysTop = Math.max(21, Math.ceil(Math.max(0, ...paidHistory.map((p) => p.days)) / 7) * 7)

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow={
          <Link href={href("clients")} className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Clients
          </Link>
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            <ClientMark name={c.name} className="size-11 text-[13px]" />
            {c.name}
            <Pill tone={c.kind === "Retainer" ? "line" : "muted"}>{c.kind}</Pill>
          </span>
        }
        description={`${c.contact} · ${c.email} · ${c.city}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Edit opens the client form with these details.")}>
              <Pencil /> Edit
            </Button>
            <Button className="font-semibold" nativeButton={false} render={<Link href={href("invoice-new")} />}>
              <FilePlus2 /> New invoice
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => toast.success(`Statement sent to ${c.email}`)}>
                  <Send /> Send statement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Client portal link copied")}>
                  <Link2 /> Copy portal link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast(`${c.name} archived`)}>
                  <Archive /> Archive client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Billed in total" value={moneyShort(c.billed)} note={`${c.invoices} invoices`} highlight />
        <StatCard label="Owes you" value={money(c.outstanding)} note={c.outstanding ? "Open now" : "All paid up"} />
        <StatCard label="Pays in" value={`${c.daysToPay} days`} note={c.daysToPay <= 14 ? "Within terms" : `${c.daysToPay - 14} days past terms`} />
        <StatCard label="Client since" value={c.since} note={`Billed in ${c.currency}`} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel flush>
          <Tabs defaultValue="invoices" className="gap-0">
            <div className="border-b border-border px-4 py-3">
              <TabsList className="h-9">
                <TabsTrigger value="invoices" className="h-full px-3 text-[13px]">
                  <FileText /> Invoices
                </TabsTrigger>
                <TabsTrigger value="payments" className="h-full px-3 text-[13px]">
                  Payments
                </TabsTrigger>
                <TabsTrigger value="notes" className="h-full px-3 text-[13px]">
                  <StickyNote /> Notes
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="invoices">
              <Table className="text-[14px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <Head className="pl-5">Invoice</Head>
                    <Head className="hidden sm:table-cell">Issued</Head>
                    <Head>Status</Head>
                    <Head className="pr-5 text-right">Amount</Head>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="cursor-pointer" onClick={() => router.push(href("invoice", { id: inv.id }))}>
                      <TableCell className="pl-5">
                        <span className="dc-num block font-medium">{inv.id}</span>
                        <span className={cn("block text-[12px]", inv.status === "Overdue" ? "text-[color:var(--dc-danger)]" : "text-muted-foreground")}>{inv.note}</span>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{inv.issued}</TableCell>
                      <TableCell>
                        <StatusPill status={inv.status} />
                      </TableCell>
                      <TableCell className="dc-num pr-5 text-right font-medium">{money(inv.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-[13px] text-muted-foreground">
                <span>
                  Last {invoices.length} of {c.invoices} invoices
                </span>
                <Link href={href("invoices", { client: c.id })} className="font-medium text-foreground hover:underline">
                  See them all in Invoices
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="payments">
              {payments.length ? (
                <ul className="divide-y divide-border">
                  {payments.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3 text-[14px]">
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {p.method} <span className="font-normal text-muted-foreground">· {p.detail}</span>
                        </span>
                        <span className="block text-[12px] text-muted-foreground">
                          {p.date} · {p.invoiceId}
                        </span>
                      </span>
                      <Pill tone={p.status === "Succeeded" ? "hl" : p.status === "Pending" ? "line" : "muted"}>{p.status}</Pill>
                      <span className="dc-num w-24 text-right font-medium">{money(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={FileText} title="No payments through Orbit yet" body={`${c.name} paid by bank transfer outside Orbit. Record those payments so reports stay right.`} />
              )}
            </TabsContent>
            <TabsContent value="notes" className="p-5">
              <form
                className="grid gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!note.trim()) return
                  setNotes((n) => [{ text: note.trim(), when: "Just now" }, ...n])
                  setNote("")
                }}
              >
                <Textarea aria-label="New note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Something to remember about ${c.name}…`} rows={3} />
                <Button type="submit" variant="outline" size="sm" className="justify-self-end" disabled={!note.trim()}>
                  Add note
                </Button>
              </form>
              <ul className="mt-4 grid gap-3">
                {notes.map((n, i) => (
                  <li key={i} className="rounded-[calc(var(--radius)+2px)] bg-muted/60 px-3 py-2.5 text-[14px]">
                    <p>{n.text}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Ada Ruiz · {n.when}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </Panel>

        <aside className="grid gap-4">
          <Panel title="Contact">
            <dl className="divide-y divide-border">
              <Field label="Person">{c.contact}</Field>
              <Field label="Email">
                <a href={`mailto:${c.email}`} className="inline-flex max-w-[180px] items-center gap-1 truncate hover:underline">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" /> {c.email}
                </a>
              </Field>
              <Field label="City">{c.city}</Field>
              <Field label="Currency">{c.currency}</Field>
            </dl>
          </Panel>
          <Panel title="Billing preferences">
            <div className="grid gap-3 text-[14px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Payment terms</span>
                <SimpleSelect label="Payment terms" size="sm" value={terms} onChange={setTerms} options={opts("Due on receipt", "Net 7", "Net 14", "Net 30")} className="w-[132px]" />
              </div>
              <label className="flex items-center justify-between gap-3">
                <span>Automatic reminders</span>
                <Switch checked={remind} onCheckedChange={setRemind} />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Charge card on file</span>
                <Switch checked={autopay} onCheckedChange={setAutopay} />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Copy accounts on invoices</span>
                <Switch checked={ccAccounts} onCheckedChange={setCcAccounts} />
              </label>
            </div>
          </Panel>
          {paidHistory.length > 1 ? (
            <Panel title="How fast they pay" description="Days from sending to paid, last invoices">
              <ChartContainer config={daysConfig} className="aspect-auto h-[150px] w-full">
                <BarChart data={paidHistory} margin={{ left: -12, right: 4, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="id" tickLine={false} axisLine={false} tickFormatter={(v: string) => v.slice(4)} tickMargin={6} />
                  <YAxis tickLine={false} axisLine={false} width={36} domain={[0, daysTop]} ticks={[0, 7, 14, 21, 28].filter((t) => t <= daysTop)} />
                  <ReferenceLine y={14} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "Terms", position: "insideTopRight", fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTip format={(v) => `${v} days`} />} />
                  <Bar dataKey="days" name="Paid in" fill="var(--color-days)" radius={[3, 3, 0, 0]} maxBarSize={22} animationDuration={500} />
                </BarChart>
              </ChartContainer>
            </Panel>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
