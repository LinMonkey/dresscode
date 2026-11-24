"use client"

// A checkout's steps across the top, with a title and a short description each. In a narrow container
// (a phone) the row collapses to "Step 2 of 4" with the current title and a segmented bar.
// Linear: you can go back to any step, and forward only to steps you have already filled in.
import * as React from "react"
import { ArrowLeft, ArrowRight, CreditCard, FileText, Landmark, Layers, Minus, NotebookText, PackageCheck, PenTool, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/dresscode/components/stepper/ui/stepper"

const PRODUCTS = [
  { id: "notebook", icon: NotebookText, name: "Linen notebook, A5", detail: "Dot grid · Sage", price: 18 },
  { id: "mat", icon: Layers, name: "Felt desk mat, large", detail: "Charcoal · 90 × 40 cm", price: 46 },
  { id: "pen", icon: PenTool, name: "Brass fountain pen", detail: "Fine nib · 6 cartridges", price: 54 },
]

const ADDRESSES = [
  { id: "home", label: "Home", lines: "Maya Lindqvist, 214 Alder Street, Portland, OR 97205" },
  { id: "studio", label: "Studio", lines: "Fernwood Studio, 88 Mill Road, Suite 3, Portland, OR 97209" },
]

const DELIVERY = [
  { id: "standard", label: "Standard", price: 0, speed: "3 to 5 working days", arrives: "Nov 27 to Dec 1" },
  { id: "express", label: "Express", price: 12, speed: "Next working day", arrives: "Wednesday, Nov 25" },
]

const PAYMENT = [
  { id: "card", icon: CreditCard, label: "Card ending 2817", note: "Expires 08/28. Billing address: Home." },
  { id: "transfer", icon: Landmark, label: "Bank transfer", note: "We ship once the transfer clears, usually 1 to 2 working days." },
  { id: "invoice", icon: FileText, label: "Pay by invoice", note: "Net 30 for business accounts. The invoice goes to your email." },
]

const TAX_RATE = 0.08
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

export default function StepperHorizontal() {
  const [step, setStep] = React.useState(2)
  const [furthest, setFurthest] = React.useState(2)
  const [qty, setQty] = React.useState<Record<string, number>>({ notebook: 2, mat: 1, pen: 1 })
  const [address, setAddress] = React.useState("home")
  const [delivery, setDelivery] = React.useState("standard")
  const [payment, setPayment] = React.useState("card")
  const [placing, setPlacing] = React.useState(false)
  const [placed, setPlaced] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const doneHeading = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => () => clearTimeout(timer.current), [])
  React.useEffect(() => {
    if (placed) doneHeading.current?.focus()
  }, [placed])

  const count = PRODUCTS.reduce((n, p) => n + qty[p.id], 0)
  const subtotal = PRODUCTS.reduce((n, p) => n + qty[p.id] * p.price, 0)
  const shipping = DELIVERY.find((d) => d.id === delivery)!
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = subtotal + shipping.price + tax

  const steps = [
    { title: "Cart", description: `${count} items` },
    { title: "Shipping", description: "Address and speed" },
    { title: "Payment", description: "Card or transfer" },
    { title: "Review", description: "Place your order" },
  ]

  function go(to: number) {
    setStep(to)
    setFurthest((f) => Math.max(f, to))
  }

  function placeOrder() {
    setPlacing(true)
    timer.current = setTimeout(() => {
      setPlacing(false)
      setPlaced(true)
    }, 1400)
  }

  function startOver() {
    setPlaced(false)
    setStep(1)
    setFurthest(1)
  }

  const current = steps[step - 1]

  return (
    <div className="@container w-full max-w-4xl">
      <Card className="gap-0 py-0">
        <div className="border-b border-border px-4 py-5 @md:px-6">
          {/* Narrow containers: the current step and a segmented bar instead of the full row. */}
          <div aria-hidden="true" className="@2xl:hidden">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{placed ? "Order placed" : `Step ${step} of ${steps.length}`}</span>
              {!placed && step < steps.length ? <span>Next: {steps[step].title}</span> : null}
            </div>
            <p className="mt-1 text-base font-semibold">{placed ? "Thank you" : current.title}</p>
            <div className="mt-3 flex gap-1.5">
              {steps.map((s, i) => (
                <span key={s.title} className={cn("h-1.5 flex-1 rounded-full bg-primary/15 transition-colors", (placed || i < step) && "bg-primary")} />
              ))}
            </div>
          </div>
          <Stepper aria-label="Checkout" value={step} onValueChange={go} linear className="hidden @2xl:flex">
            {steps.map((s, i) => (
              <StepperItem key={s.title} step={i + 1} completed={placed || i + 1 < furthest} loading={placing && i + 1 === steps.length}>
                <StepperTrigger disabled={placing || placed}>
                  <StepperIndicator />
                  <StepperTitle>{s.title}</StepperTitle>
                  <StepperDescription>{s.description}</StepperDescription>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
            ))}
          </Stepper>
          <p className="sr-only" aria-live="polite">
            {placed ? "Order placed." : `Step ${step} of ${steps.length}: ${current.title}`}
          </p>
        </div>

        {placed ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PackageCheck className="size-6" aria-hidden="true" />
            </span>
            <h2 ref={doneHeading} tabIndex={-1} className="mt-4 text-lg font-semibold outline-none">
              Order FS-20418 is confirmed
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              A receipt is on its way to maya@example.com. {shipping.label} delivery arrives {shipping.arrives}.
            </p>
            <Button variant="outline" className="mt-6" onClick={startOver}>
              Start a new order
            </Button>
          </div>
        ) : (
          <>
            <section aria-labelledby="checkout-step" className="px-4 py-6 @md:px-6">
              <h2 id="checkout-step" className="text-base font-semibold">
                {["Your cart", "Where should we send it?", "How would you like to pay?", "Check your order"][step - 1]}
              </h2>

              {step === 1 ? (
                <ul className="mt-4 divide-y divide-border">
                  {PRODUCTS.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 @md:gap-4">
                      <span className="hidden size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground @sm:flex">
                        <p.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.detail}</p>
                      </div>
                      <div className="flex items-center gap-1" role="group" aria-label={`Quantity of ${p.name}`}>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label="One fewer"
                          disabled={qty[p.id] <= 1}
                          onClick={() => setQty((q) => ({ ...q, [p.id]: q[p.id] - 1 }))}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {qty[p.id]}
                        </span>
                        <Button variant="outline" size="icon-sm" aria-label="One more" onClick={() => setQty((q) => ({ ...q, [p.id]: q[p.id] + 1 }))}>
                          <Plus />
                        </Button>
                      </div>
                      <p className="w-16 text-right text-sm font-medium tabular-nums">{money(qty[p.id] * p.price)}</p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {step === 2 ? (
                <div className="mt-4 grid gap-6 @2xl:grid-cols-2">
                  <ChoiceGroup legend="Ship to" value={address} onChange={setAddress} options={ADDRESSES.map((a) => ({ id: a.id, label: a.label, note: a.lines }))} />
                  <ChoiceGroup
                    legend="Delivery"
                    value={delivery}
                    onChange={setDelivery}
                    options={DELIVERY.map((d) => ({ id: d.id, label: d.label, note: `${d.speed}, arrives ${d.arrives}`, aside: d.price ? money(d.price) : "Free" }))}
                  />
                </div>
              ) : null}

              {step === 3 ? (
                <div className="mt-4 max-w-xl">
                  <ChoiceGroup legend="Payment method" hideLegend value={payment} onChange={setPayment} options={PAYMENT} />
                </div>
              ) : null}

              {step === 4 ? (
                <div className="mt-4 grid gap-6 @2xl:grid-cols-[minmax(0,1fr)_16rem]">
                  <dl className="divide-y divide-border rounded-lg border border-border text-sm">
                    {[
                      { term: "Items", detail: PRODUCTS.map((p) => `${qty[p.id]} × ${p.name}`).join(", "), to: 1 },
                      { term: "Ship to", detail: ADDRESSES.find((a) => a.id === address)!.lines, to: 2 },
                      { term: "Delivery", detail: `${shipping.label}, arrives ${shipping.arrives}`, to: 2 },
                      { term: "Payment", detail: PAYMENT.find((p) => p.id === payment)!.label, to: 3 },
                    ].map((row) => (
                      <div key={row.term} className="flex items-start gap-3 px-3 py-2.5">
                        <dt className="w-20 shrink-0 text-muted-foreground">{row.term}</dt>
                        <dd className="min-w-0 flex-1">{row.detail}</dd>
                        <dd className="shrink-0">
                          <Button variant="link" size="sm" className="h-5 px-0" onClick={() => setStep(row.to)} disabled={placing}>
                            Change<span className="sr-only"> {row.term.toLowerCase()}</span>
                          </Button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd className="tabular-nums">{money(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd className="tabular-nums">{shipping.price ? money(shipping.price) : "Free"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sales tax (8%)</dt>
                      <dd className="tabular-nums">{money(tax)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-semibold">
                      <dt>Total</dt>
                      <dd className="tabular-nums">{money(total)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </section>

            <div className="flex flex-col gap-3 border-t border-border bg-muted/50 px-4 py-4 @md:flex-row @md:items-center @md:justify-between @md:px-6">
              <p className="text-sm">
                <span className="text-muted-foreground">{step === 1 ? "Subtotal" : "Total"} </span>
                <span className="font-semibold tabular-nums">{money(step === 1 ? subtotal : total)}</span>
                {step === 1 ? <span className="text-muted-foreground"> · shipping and tax next</span> : null}
              </p>
              <div className="flex gap-2">
                {step > 1 ? (
                  <Button variant="outline" className="flex-1 @md:flex-none" onClick={() => setStep(step - 1)} disabled={placing}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                  </Button>
                ) : null}
                {step < steps.length ? (
                  <Button className="flex-1 @md:flex-none" onClick={() => go(step + 1)}>
                    Continue to {steps[step].title.toLowerCase()}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                ) : (
                  <Button className="flex-1 @md:flex-none" onClick={placeOrder} disabled={placing}>
                    {placing ? <Spinner data-icon="inline-start" aria-hidden="true" /> : null}
                    {placing ? "Placing order…" : `Place order · ${money(total)}`}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

type Choice = { id: string; label: string; note: string; aside?: string; icon?: React.ComponentType<{ className?: string }> }

/** A radio group drawn as bordered cards: the whole card is the label. */
function ChoiceGroup({
  legend,
  hideLegend,
  value,
  onChange,
  options,
}: {
  legend: string
  hideLegend?: boolean
  value: string
  onChange: (id: string) => void
  options: Choice[]
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={cn("mb-2 text-sm font-medium", hideLegend && "sr-only")}>{legend}</legend>
      <RadioGroup value={value} onValueChange={(v) => onChange(String(v))} className="gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
          >
            <RadioGroupItem value={o.id} className="mt-0.5" />
            {o.icon ? <o.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{o.label}</span>
              <span className="block text-xs text-muted-foreground">{o.note}</span>
            </span>
            {o.aside ? <span className="text-sm font-medium tabular-nums">{o.aside}</span> : null}
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}
