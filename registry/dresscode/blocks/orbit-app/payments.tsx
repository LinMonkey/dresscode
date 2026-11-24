"use client"

// Payments: the next payout, what came in and what it cost, how clients pay, and every payment with
// status tabs, a method filter, search, pages, refunds and receipts.
import { ArrowRight, Banknote, CreditCard, Download, Landmark, MoreHorizontal, ReceiptText, RotateCcw, Wallet, Copy, FileText } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { useOrbit } from "./context"
import { Head, Pager, SearchBox, SimpleSelect, opts } from "./controls"
import { PAYMENTS, PAYOUT, clientById, money, type Payment, type PaymentMethod } from "./data"
import { ClientMark, PageHeader, Panel, Pill, StatCard, Swatch, flat } from "./ui"

type Status = "All" | Payment["status"]
const METHOD_ICON: Record<PaymentMethod, typeof CreditCard> = { Card: CreditCard, "Bank transfer": Landmark, "ACH debit": Banknote, PayPal: Wallet }
const METHOD_COLOR: Record<PaymentMethod, string> = {
  Card: "var(--chart-1)",
  "Bank transfer": "var(--chart-2)",
  "ACH debit": "var(--chart-5)",
  PayPal: "var(--chart-4)",
}
const statusTone = (s: Payment["status"]) => (s === "Succeeded" ? "hl" : s === "Pending" ? "line" : "muted") as "hl" | "line" | "muted"

export function PaymentsScreen() {
  const { href, openDialog } = useOrbit()
  const [rows, setRows] = useState(PAYMENTS)
  const [status, setStatus] = useState<Status>("All")
  const [method, setMethod] = useState("All methods")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [refund, setRefund] = useState<Payment | null>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (p) =>
        (status === "All" || p.status === status) &&
        (method === "All methods" || p.method === method) &&
        (!q || `${p.id} ${p.invoiceId} ${clientById(p.clientId).name} ${p.amount}`.toLowerCase().includes(q)),
    )
  }, [rows, status, method, query])
  const pageSize = 10
  const pages = Math.max(1, Math.ceil(list.length / pageSize))
  const current = Math.min(page, pages - 1)
  const shown = list.slice(current * pageSize, (current + 1) * pageSize)

  const november = rows.filter((p) => p.date.startsWith("Nov") && p.status === "Succeeded")
  const collected = november.reduce((s, p) => s + p.amount, 0)
  const fees = november.reduce((s, p) => s + p.fee, 0)
  const pending = rows.filter((p) => p.status === "Pending")
  const byMethod = (Object.keys(METHOD_ICON) as PaymentMethod[])
    .map((m) => ({ method: m, total: rows.filter((p) => p.method === m && p.status === "Succeeded").reduce((s, p) => s + p.amount, 0) }))
    .filter((m) => m.total > 0)
  const all = byMethod.reduce((s, m) => s + m.total, 0)
  const count = (s: Status) => (s === "All" ? rows.length : rows.filter((p) => p.status === s).length)

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Payments"
        description="Money in, what it cost, and when it reaches your bank."
        actions={
          <>
            <Button variant="outline" onClick={() => toast(`Exporting ${list.length} payments to CSV…`)}>
              <Download /> Export
            </Button>
            <Button className="font-semibold" onClick={() => openDialog("payment")}>
              <Wallet /> Record payment
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div className="dc-card dc-band flex flex-col justify-between gap-4 p-5 text-[color:var(--dc-band-fg)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] opacity-85">Next payout</p>
            <span className="dc-pill bg-[color:color-mix(in_oklab,var(--dc-band-fg)_16%,transparent)]">Arrives {PAYOUT.date}</span>
          </div>
          <p className="dc-num text-[30px] leading-none font-semibold tracking-tight">{money(PAYOUT.amount)}</p>
          <p className="flex items-center gap-1.5 text-[13px] opacity-85">
            <Landmark className="size-3.5" aria-hidden="true" /> {PAYOUT.bank} · daily, two business days
          </p>
        </div>
        <StatCard label="Collected in November" value={money(collected)} note={`${november.length} payments`} />
        <StatCard label="Fees in November" value={money(fees)} note={`${((fees / collected) * 100).toFixed(2)}% of what came in`} />
        <StatCard label="On the way" value={money(pending.reduce((s, p) => s + p.amount, 0))} note={`${pending.length} bank debit clearing`} />
      </div>

      <Panel title="How clients pay" description="Share of payments this year, by method">
        <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={byMethod.map((m) => `${m.method} ${Math.round((m.total / all) * 100)}%`).join(", ")}>
          {byMethod.map((m) => (
            <span key={m.method} className="h-full border-r-2 border-[color:var(--card)] last:border-r-0" style={{ width: `${(m.total / all) * 100}%`, background: METHOD_COLOR[m.method] }} />
          ))}
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {byMethod.map((m) => {
            const Icon = METHOD_ICON[m.method]
            return (
              <li key={m.method} className="flex items-center gap-3">
                <Swatch color={METHOD_COLOR[m.method]} className="size-3" />
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-[14px] font-medium">{m.method}</span>
                <span className="dc-num ml-auto text-[14px] text-muted-foreground">{Math.round((m.total / all) * 100)}%</span>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="-mx-1 overflow-x-auto px-1">
            <Tabs
              value={status}
              onValueChange={(v) => {
                setStatus(v as Status)
                setPage(0)
              }}
            >
              <TabsList className="h-9">
                {(["All", "Succeeded", "Pending", "Refunded"] as Status[]).map((s) => (
                  <TabsTrigger key={s} value={s} className="h-full px-3 text-[13px]">
                    {s}
                    <span className="dc-num rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] px-1.5 text-[11px] leading-4 text-muted-foreground">{count(s)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <SearchBox
              value={query}
              onChange={(v) => {
                setQuery(v)
                setPage(0)
              }}
              placeholder="Search client or invoice"
              label="Search payments"
              className="w-full sm:w-64"
            />
            <SimpleSelect
              label="Method"
              value={method}
              onChange={(v) => {
                setMethod(v)
                setPage(0)
              }}
              options={opts("All methods", "Card", "Bank transfer", "ACH debit", "PayPal")}
              className="w-[150px]"
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <Table className="text-[14px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <Head className="pl-5">Date</Head>
                <Head>Client</Head>
                <Head className="hidden md:table-cell">Invoice</Head>
                <Head className="hidden lg:table-cell">Method</Head>
                <Head className="text-right">Amount</Head>
                <Head className="hidden text-right xl:table-cell">Fee</Head>
                <Head className="hidden text-right md:table-cell">Net</Head>
                <Head>Status</Head>
                <Head className="w-12 pr-4">
                  <span className="sr-only">Actions</span>
                </Head>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((p) => {
                const c = clientById(p.clientId)
                const Icon = METHOD_ICON[p.method]
                return (
                  <TableRow key={p.id} className={cn(p.status === "Refunded" && "text-muted-foreground")}>
                    <TableCell className="pl-5 whitespace-nowrap">{p.date}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2.5">
                        <ClientMark name={c.name} className="size-7 text-[10px]" />
                        <span className="max-w-[180px] truncate font-medium">{c.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Link href={href("invoice", { id: p.invoiceId })} className="dc-num hover:underline">
                        {p.invoiceId}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                        {p.detail}
                      </span>
                    </TableCell>
                    <TableCell className={cn("dc-num text-right font-medium", p.status === "Refunded" && "line-through")}>{money(p.amount)}</TableCell>
                    <TableCell className="dc-num hidden text-right text-muted-foreground xl:table-cell">−{money(p.fee)}</TableCell>
                    <TableCell className="dc-num hidden text-right md:table-cell">{money(p.status === "Refunded" ? 0 : p.amount - p.fee)}</TableCell>
                    <TableCell>
                      <Pill tone={statusTone(p.status)}>{p.status}</Pill>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className={cn(flat, "text-muted-foreground")} aria-label={`Actions for ${p.id}`} />}>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem render={<Link href={href("invoice", { id: p.invoiceId })} />}>
                            <FileText /> View invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast(`Downloading receipt ${p.id}.pdf`)}>
                            <ReceiptText /> Download receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success(`${p.id} copied`)}>
                            <Copy /> Copy payment ID
                          </DropdownMenuItem>
                          {p.status === "Succeeded" ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => setRefund(p)}>
                                <RotateCcw /> Refund
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <ul className="divide-y divide-border sm:hidden">
          {shown.map((p) => {
            const c = clientById(p.clientId)
            return (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <ClientMark name={c.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{c.name}</span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {p.date} · {p.method} · {p.invoiceId}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span className="dc-num text-[15px] font-semibold">{money(p.amount)}</span>
                  <Pill tone={statusTone(p.status)}>{p.status}</Pill>
                </span>
              </li>
            )
          })}
        </ul>
        <Pager page={current} pageSize={pageSize} total={list.length} onPage={setPage} noun="payments" />
      </Panel>

      <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        Payout schedule, bank account and statement descriptor live in{" "}
        <Link href={href("settings", { tab: "billing" })} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
          Settings <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </p>

      <AlertDialog open={!!refund} onOpenChange={(o) => !o && setRefund(null)}>
        <AlertDialogContent className="dc-card ring-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="dc-h text-[18px]">Refund {refund ? money(refund.amount) : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              {refund ? `${clientById(refund.clientId).name} gets the money back on ${refund.detail} in 5 to 10 days. ${refund.invoiceId} opens again, and the ${money(refund.fee)} fee is not returned.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (refund) {
                  setRows((all) => all.map((p) => (p.id === refund.id ? { ...p, status: "Refunded" } : p)))
                  toast(`Refund of ${money(refund.amount)} started`, { description: `${refund.invoiceId} is open again.` })
                }
                setRefund(null)
              }}
            >
              Refund payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
