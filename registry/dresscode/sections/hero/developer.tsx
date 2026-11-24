"use client"

// Hero with a code sample, for an API or a developer tool: the pitch and the actions on the left; on the
// right, one request in three languages (tabs) with a copy button, and the response it gets back.
import { ArrowRight, Check, Copy } from "lucide-react"
import { Fragment, useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SAMPLES = {
  node: {
    label: "Node",
    code: `import Orbit from '@orbit/node'

const orbit = new Orbit(process.env.ORBIT_KEY)

// Send an invoice; Orbit chases it for you.
const invoice = await orbit.invoices.create({
  client: 'cli_fernwood',
  lines: [{ item: 'Brand identity', amount: 3200 }],
  due: '2026-11-28',
  remind: 'friendly',
})`,
  },
  python: {
    label: "Python",
    code: `import os
from orbit import Orbit

orbit = Orbit(os.environ["ORBIT_KEY"])

# Send an invoice; Orbit chases it for you.
invoice = orbit.invoices.create(
    client="cli_fernwood",
    lines=[{"item": "Brand identity", "amount": 3200}],
    due="2026-11-28",
    remind="friendly",
)`,
  },
  curl: {
    label: "cURL",
    code: `# Send an invoice; Orbit chases it for you.
curl https://api.orbit.dev/v1/invoices \\
  -H "Authorization: Bearer $ORBIT_KEY" \\
  -d client="cli_fernwood" \\
  -d "lines[0][item]"="Brand identity" \\
  -d "lines[0][amount]"=3200 \\
  -d due="2026-11-28" \\
  -d remind="friendly"`,
  },
} as const
type Lang = keyof typeof SAMPLES

const RESPONSE = `{ "id": "inv_1042", "status": "sent", "remind_at": "2026-11-25" }`

/** Strings in the accent color, comments muted; enough to read the sample at a glance. (The Node sample
 * uses single quotes, so the registry's import scan doesn't take it for an import of this file.) */
function Highlight({ code }: { code: string }) {
  return code.split("\n").map((line, i) => (
    <Fragment key={i}>
      {/^\s*(\/\/|#)/.test(line) ? (
        <span className="text-muted-foreground">{line}</span>
      ) : (
        line.split(/("[^"]*"|'[^']*')/).map((part, j) =>
          /^["']/.test(part) ? (
            <span key={j} className="text-[color:var(--dc-accent)]">
              {part}
            </span>
          ) : (
            part
          ),
        )
      )}
      {"\n"}
    </Fragment>
  ))
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      onClick={async () => {
        await navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
      <span className="sr-only" aria-live="polite">
        {copied ? "Code copied" : ""}
      </span>
    </Button>
  )
}

export default function HeroDeveloper() {
  const [lang, setLang] = useState<Lang>("node")
  return (
    <section aria-labelledby="hero-developer-title" className="py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="max-w-[540px]">
          <span className="dc-pill dc-pill-line">Orbit API · v1</span>
          <h1 id="hero-developer-title" className="dc-h mt-5 text-[40px] leading-[1.05] sm:text-[54px]">
            Invoices from your own code.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
            Create, send and chase invoices with one request. Orbit handles the reminders, the payment page and the receipts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#keys" />}>
              Get an API key <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-[16px] font-semibold" nativeButton={false} render={<a href="#docs" />}>
              Read the docs
            </Button>
          </div>
          <ul className="mt-9 grid gap-2.5 text-[15px]">
            {["Safe to retry: every request takes an idempotency key", "A webhook for every payment, reminder and refund", "Libraries for Node, Python and Go"].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--dc-accent)]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="dc-card min-w-0 overflow-hidden">
          <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <div className="flex items-center justify-between gap-2 border-b border-border py-2 pr-2 pl-3">
              <TabsList aria-label="Language">
                {(Object.keys(SAMPLES) as Lang[]).map((k) => (
                  <TabsTrigger key={k} value={k}>
                    {SAMPLES[k].label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <CopyButton text={SAMPLES[lang].code} />
            </div>
            {(Object.keys(SAMPLES) as Lang[]).map((k) => (
              <TabsContent key={k} value={k}>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7]">
                  <code>
                    <Highlight code={SAMPLES[k].code} />
                  </code>
                </pre>
              </TabsContent>
            ))}
          </Tabs>
          <div className="border-t border-border bg-muted/60 px-5 py-3.5">
            <p className="text-[12px] font-medium text-muted-foreground">Response · 201 Created</p>
            <pre className="mt-1 overflow-x-auto font-mono text-[13px]">
              <code>{RESPONSE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
