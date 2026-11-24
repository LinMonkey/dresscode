"use client"

// An onboarding checklist down the side: each step says what it is for, and the current step opens
// its form or action right under it. Linear: done steps reopen, later ones wait for the ones before.
import * as React from "react"
import { Landmark, PartyPopper, Send, Upload, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/registry/dresscode/components/stepper/ui/stepper"

const STEPS = [
  { title: "Add your business details", description: "Your name and tax number appear on every invoice." },
  { title: "Connect a bank account", description: "Client payments land here, two working days after they pay." },
  { title: "Import your clients", description: "Bring your client list over from a spreadsheet." },
  { title: "Brand your invoices", description: "An accent color and a note for the footer." },
  { title: "Send your first invoice", description: "Send a test to yourself first if you like." },
]

const ACCENTS = [
  { id: "1", name: "Accent 1", className: "bg-(--chart-1)" },
  { id: "2", name: "Accent 2", className: "bg-(--chart-2)" },
  { id: "3", name: "Accent 3", className: "bg-(--chart-3)" },
  { id: "4", name: "Accent 4", className: "bg-(--chart-4)" },
  { id: "5", name: "Accent 5", className: "bg-(--chart-5)" },
]

export default function StepperVertical() {
  const [step, setStep] = React.useState(2)
  const [done, setDone] = React.useState([true, false, false, false, false])
  const [busy, setBusy] = React.useState<number | null>(null)
  const [business, setBusiness] = React.useState({ name: "Fernwood Studio", tax: "84-2193706" })
  const [imported, setImported] = React.useState<string | null>(null)
  const [accent, setAccent] = React.useState("1")
  const [footer, setFooter] = React.useState("Thank you for your business.")
  const fileInput = React.useRef<HTMLInputElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const doneCount = done.filter(Boolean).length
  const allDone = doneCount === STEPS.length

  /** Mark a step done and open the first one still to do. */
  function complete(s: number) {
    const next = done.map((d, i) => d || i === s - 1)
    setDone(next)
    const todo = next.findIndex((d) => !d)
    if (todo !== -1) setStep(todo + 1)
  }

  /** The same, after a pretend round trip to the server. */
  function completeLater(s: number) {
    setBusy(s)
    timer.current = setTimeout(() => {
      setBusy(null)
      complete(s)
    }, 1400)
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{allDone ? "You're all set" : "Get started with Orbit"}</CardTitle>
        <CardDescription>
          {allDone ? "Orbit is ready for your first real invoice." : `${doneCount} of ${STEPS.length} done · about ${(STEPS.length - doneCount) * 2} minutes left`}
        </CardDescription>
        <Progress value={(doneCount / STEPS.length) * 100} aria-label="Setup progress" className="mt-3" />
      </CardHeader>
      <CardContent>
        <Stepper aria-label="Setup checklist" orientation="vertical" value={step} onValueChange={setStep} linear>
          {STEPS.map((s, i) => {
            const n = i + 1
            return (
              <StepperItem key={s.title} step={n} completed={done[i]} loading={busy === n} className="pb-6">
                <StepperSeparator />
                <StepperTrigger disabled={busy !== null}>
                  <StepperIndicator />
                  <StepperTitle>{s.title}</StepperTitle>
                  <StepperDescription>{s.description}</StepperDescription>
                </StepperTrigger>
                <StepperContent>
                  {n === 1 ? (
                    <form
                      className="grid gap-3"
                      onSubmit={(e) => {
                        e.preventDefault()
                        complete(1)
                      }}
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                          <Label htmlFor="ob-name">Business name</Label>
                          <Input id="ob-name" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} required />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="ob-tax">Tax number</Label>
                          <Input id="ob-tax" value={business.tax} onChange={(e) => setBusiness({ ...business, tax: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Button type="submit" size="sm">
                          Save details
                        </Button>
                      </div>
                    </form>
                  ) : null}

                  {n === 2 ? (
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <p className="text-sm text-muted-foreground">
                        {done[1] && busy !== 2 ? (
                          <>
                            Payouts go to the <span className="font-medium text-foreground">checking account ending 4402</span>.
                          </>
                        ) : (
                          "Orbit asks your bank for read-only access to confirm the account. It never moves money on its own."
                        )}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button size="sm" variant={done[1] ? "outline" : "default"} onClick={() => completeLater(2)} disabled={busy === 2}>
                          {busy === 2 ? <Spinner data-icon="inline-start" aria-hidden="true" /> : <Landmark data-icon="inline-start" />}
                          {busy === 2 ? "Connecting…" : done[1] ? "Use a different account" : "Connect bank account"}
                        </Button>
                        {done[1] ? null : <span className="text-xs text-muted-foreground">Takes about two minutes</span>}
                      </div>
                    </div>
                  ) : null}

                  {n === 3 ? (
                    <div className="grid gap-3">
                      <input
                        ref={fileInput}
                        type="file"
                        accept=".csv,text/csv"
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setImported(file.name)
                            complete(3)
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => fileInput.current?.click()}>
                          <Upload data-icon="inline-start" />
                          Upload a CSV
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setImported("12 sample clients")
                            complete(3)
                          }}
                        >
                          <Users data-icon="inline-start" />
                          Add sample clients
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {imported ? `Imported ${imported}. Upload again to replace them.` : "Orbit looks for name, email and address columns."}
                      </p>
                    </div>
                  ) : null}

                  {n === 4 ? (
                    <form
                      className="grid gap-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        complete(4)
                      }}
                    >
                      <fieldset>
                        <legend className="mb-2 text-sm font-medium">Accent color</legend>
                        <div className="flex gap-2.5">
                          {ACCENTS.map((a) => (
                            <label key={a.id} className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="ob-accent"
                                value={a.id}
                                checked={accent === a.id}
                                onChange={() => setAccent(a.id)}
                                className="peer sr-only"
                              />
                              <span className="sr-only">{a.name}</span>
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "block size-7 rounded-full ring-offset-2 ring-offset-card transition-shadow peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                                  a.className,
                                )}
                              />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="grid gap-1.5">
                        <Label htmlFor="ob-footer">Footer note</Label>
                        <Input id="ob-footer" value={footer} onChange={(e) => setFooter(e.target.value)} maxLength={80} />
                      </div>
                      <div>
                        <Button type="submit" size="sm">
                          Save branding
                        </Button>
                      </div>
                    </form>
                  ) : null}

                  {n === 5 ? (
                    done[4] ? (
                      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                        <PartyPopper className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        <p>
                          A test invoice is on its way to <span className="font-medium">maya@example.com</span>. Check how it looks, then send the
                          real thing from Invoices.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => completeLater(5)} disabled={busy === 5}>
                          {busy === 5 ? <Spinner data-icon="inline-start" aria-hidden="true" /> : <Send data-icon="inline-start" />}
                          {busy === 5 ? "Sending…" : "Send a test to me"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => complete(5)} disabled={busy === 5}>
                          Create an invoice
                        </Button>
                      </div>
                    )
                  ) : null}
                </StepperContent>
              </StepperItem>
            )
          })}
        </Stepper>
        <p className="sr-only" aria-live="polite">
          {allDone ? "All steps done." : `${doneCount} of ${STEPS.length} steps done. Current: ${STEPS[step - 1].title}.`}
        </p>
      </CardContent>
    </Card>
  )
}
