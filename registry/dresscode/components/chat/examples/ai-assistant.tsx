"use client"

// An assistant chat: suggestions while the chat is empty, answers that stream in word by word (with
// numbered lists and code blocks), copy, regenerate and feedback under each answer, earlier versions of
// a regenerated answer, and a model picker and file attach in the composer. Stop (or Escape) ends an answer early.
import { BarChart3, Check, ChevronLeft, ChevronRight, Copy, FileText, Mail, Percent, RefreshCw, Sparkles, SquarePen, ThumbsDown, ThumbsUp, Webhook } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Chat,
  ChatAttachment,
  ChatBubble,
  ChatCodeBlock,
  ChatInput,
  ChatInputAttach,
  ChatInputAttachment,
  ChatInputAttachments,
  ChatInputSubmit,
  ChatInputTextarea,
  ChatInputToolbar,
  ChatMessage,
  ChatMessageActions,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageHeader,
  ChatMessageList,
  ChatMessageName,
  ChatSuggestion,
  ChatTypingIndicator,
  formatFileSize,
  useCopyToClipboard,
} from "@/registry/dresscode/components/chat/ui/chat"

type Block = { type: "p"; text: string } | { type: "ol"; items: string[] } | { type: "quote"; text: string } | { type: "code"; language: string; filename?: string; code: string }
type File_ = { name: string; size: string }
type UserTurn = { id: string; role: "user"; text: string; files: File_[] }
type AssistantTurn = {
  id: string
  role: "assistant"
  topic: string
  versions: Block[][]
  version: number
  /** Words shown so far of the current version. */
  shown: number
  state: "thinking" | "streaming" | "done" | "stopped"
  thoughtFor?: number
  feedback?: "up" | "down"
}
type Turn = UserTurn | AssistantTurn

const MODELS = [
  { value: "quick", label: "Quick", note: "Short answers, fastest", think: 350 },
  { value: "balanced", label: "Balanced", note: "Good for most questions", think: 900 },
  { value: "deep", label: "Deep think", note: "Takes longer, checks its work", think: 2400 },
]

const WEBHOOK_CODE = `import { verifySignature } from './lib/orbit'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('orbit-signature')
  if (!verifySignature(body, signature, process.env.ORBIT_WEBHOOK_SECRET!)) {
    return new Response('Bad signature', { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.type === 'invoice.paid') {
    await markPaid(event.data.invoice_id, event.data.amount_paid)
  }
  return new Response(null, { status: 204 })
}`

const ANSWERS: Record<string, Block[][]> = {
  webhook: [
    [
      { type: "p", text: "Here's a route handler that checks the signature, then marks the invoice as paid when Orbit sends an `invoice.paid` event:" },
      { type: "code", language: "TypeScript", filename: "app/api/orbit/webhook/route.ts", code: WEBHOOK_CODE },
      {
        type: "ol",
        items: [
          "Add the endpoint in **Settings → Developers → Webhooks** and pick the `invoice.paid` event.",
          "Copy the signing secret into `ORBIT_WEBHOOK_SECRET`. Never commit it.",
          "Respond quickly with a success status. Orbit retries for 24 hours if your server doesn't answer within 10 seconds.",
        ],
      },
      { type: "p", text: "Want me to add the `invoice.payment_failed` event too?" },
    ],
    [
      { type: "p", text: "A shorter version, if you only need to log payments for now:" },
      {
        type: "code",
        language: "TypeScript",
        filename: "app/api/orbit/webhook/route.ts",
        code: `export async function POST(req: Request) {
  const event = await req.json()
  if (event.type === 'invoice.paid') {
    console.log('Paid', event.data.invoice_id, event.data.amount_paid)
  }
  return new Response(null, { status: 204 })
}`,
      },
      {
        type: "ol",
        items: [
          "This skips the signature check, so only use it on a test workspace.",
          "Send a test event from **Settings → Developers → Webhooks → Send test** to see it arrive.",
        ],
      },
    ],
  ],
  reminder: [
    [
      { type: "p", text: "Here's a reminder for **INV-1036** to Pellucid Health. It's friendly, names the amount and gives one clear next step:" },
      {
        type: "quote",
        text: "Hi Priya,\n\nA quick note that invoice INV-1036 for $2,450.00 was due on November 9. You can pay by card or bank transfer from the link below, and it only takes a minute.\n\nIf it's already on its way, thank you, and please ignore this.\n\nBest,\nAda",
      },
      { type: "ol", items: ["Send it from the invoice page so the payment link is attached.", "Turn on **automatic reminders** to send the next one in 7 days."] },
    ],
    [
      { type: "p", text: "A firmer version, for an invoice that's more than two weeks late:" },
      {
        type: "quote",
        text: "Hi Priya,\n\nInvoice INV-1036 for $2,450.00 is now 15 days overdue. Could you let me know when we can expect payment? Per our terms, a 2% late fee applies after 30 days.\n\nThanks,\nAda",
      },
    ],
  ],
  late: [
    [
      { type: "p", text: "Over the last 12 months, these clients paid late most often:" },
      {
        type: "ol",
        items: [
          "**Pellucid Health**: 7 of 9 invoices late, 18 days on average.",
          "**Kato & Lee**: 4 of 12 late, 6 days on average. Usually after the first reminder.",
          "**Harlow Books**: 3 of 5 late, 11 days on average.",
        ],
      },
      { type: "p", text: "Moving Pellucid Health to 14-day terms with a deposit up front would cut most of that waiting." },
    ],
    [
      { type: "p", text: "Ranked by money waiting rather than how often:" },
      { type: "ol", items: ["**Pellucid Health**: $6,120.00 currently overdue.", "**Harlow Books**: $1,980.00 overdue.", "**Kato & Lee**: nothing overdue right now."] },
    ],
  ],
  fees: [
    [
      { type: "p", text: "Late fees are added to an invoice automatically once it passes its due date. You set them up once:" },
      {
        type: "ol",
        items: [
          "Open **Settings → Payments → Late fees**.",
          "Choose a flat fee (say $25) or a percentage of the balance (say 2%).",
          "Set the grace period: how many days after the due date before the fee applies.",
          "Pick which clients it applies to. New invoices use it right away; existing ones don't change.",
        ],
      },
      { type: "p", text: "Clients see the fee as its own line on the invoice and in the reminder email." },
    ],
    [
      { type: "p", text: "In short: a late fee is a line Orbit adds to an overdue invoice after a grace period you choose. Set it in **Settings → Payments → Late fees**, as a flat amount or a percentage." },
    ],
  ],
}

const SUGGESTIONS = [
  { icon: Mail, text: "Draft a reminder for an overdue invoice", topic: "reminder" },
  { icon: BarChart3, text: "Which clients pay late most often?", topic: "late" },
  { icon: Percent, text: "Explain the late fee settings", topic: "fees" },
  { icon: Webhook, text: "Write a webhook handler for paid invoices", topic: "webhook" },
]

function topicFor(text: string) {
  const t = text.toLowerCase()
  if (/webhook|code|api|handler/.test(t)) return "webhook"
  if (/remind|overdue|chase|email/.test(t)) return "reminder"
  if (/late fee|fee|penalt/.test(t)) return "fees"
  if (/late|slow|pay/.test(t)) return "late"
  return "other"
}

function answersFor(topic: string, prompt: string): Block[][] {
  if (ANSWERS[topic]) return ANSWERS[topic]
  const short = prompt.length > 60 ? `${prompt.slice(0, 57).trimEnd()}…` : prompt
  return [
    [
      { type: "p", text: `Here's how I'd go about “${short}” in Orbit:` },
      {
        type: "ol",
        items: [
          "Open the invoices it affects. Filter by client or status to narrow the list.",
          "Check the payment terms and due dates, since most questions come down to those.",
          "If something needs to change, edit the draft or send a reminder from the invoice page.",
        ],
      },
      { type: "p", text: "Tell me the invoice number or the client and I can be more specific." },
    ],
    [{ type: "p", text: "I can help with that. Which client or invoice is it about? With a name or an invoice number I can look at the real figures." }],
  ]
}

// Words, keeping the spacing in front of each, so a prefix of them is a prefix of the text.
const words = (s: string) => s.match(/\s*\S+/g) ?? []
const blockWords = (b: Block) => (b.type === "ol" ? b.items.reduce((n, it) => n + words(it).length, 0) : words(b.type === "code" ? b.code : b.text).length)
const totalWords = (blocks: Block[]) => blocks.reduce((n, b) => n + blockWords(b), 0)

/** The first `n` words of an answer, block by block. */
function reveal(blocks: Block[], n: number): Block[] {
  const out: Block[] = []
  let left = n
  for (const b of blocks) {
    if (left <= 0) break
    const count = blockWords(b)
    if (left >= count) {
      out.push(b)
      left -= count
      continue
    }
    if (b.type === "ol") {
      const items: string[] = []
      for (const it of b.items) {
        if (left <= 0) break
        const w = words(it)
        items.push(w.slice(0, left).join(""))
        left -= w.length
      }
      out.push({ type: "ol", items })
    } else if (b.type === "code") out.push({ ...b, code: words(b.code).slice(0, left).join("") })
    else out.push({ ...b, text: words(b.text).slice(0, left).join("") })
    break
  }
  return out
}

/** **bold** and `code` inside a line. An unclosed marker at the end (mid-stream) still styles what's there. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+(?:\*\*|$)|`[^`]+(?:`|$))/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-semibold">{part.replace(/\*\*/g, "")}</strong>
    if (part.startsWith("`"))
      return (
        <code key={i} className="rounded-md bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {part.replace(/`/g, "")}
        </code>
      )
    return part
  })
}

const plain = (s: string) => s.replace(/\*\*|`/g, "")
function toText(blocks: Block[]) {
  return blocks
    .map((b) => {
      if (b.type === "ol") return b.items.map((it, i) => `${i + 1}. ${plain(it)}`).join("\n")
      if (b.type === "code") return "```\n" + b.code + "\n```"
      return plain(b.text)
    })
    .join("\n\n")
}

/** The blinking block at the end of an answer that is still coming in. */
const Caret = () => <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-foreground/60 align-[-2px] motion-reduce:animate-none" />

function Blocks({ blocks, caret }: { blocks: Block[]; caret?: boolean }) {
  return blocks.map((b, i) => {
    const end = caret && i === blocks.length - 1 ? <Caret /> : null
    if (b.type === "p")
      return (
        <p key={i}>
          {inline(b.text)}
          {end}
        </p>
      )
    if (b.type === "ol")
      return (
        <ol key={i} className="list-decimal space-y-1.5 pl-5 marker:text-muted-foreground">
          {b.items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it)}
              {j === b.items.length - 1 ? end : null}
            </li>
          ))}
        </ol>
      )
    if (b.type === "quote")
      return (
        <blockquote key={i} className="rounded-lg border-l-2 border-primary bg-muted/60 py-2.5 pr-3 pl-3.5 whitespace-pre-wrap">
          {b.text}
          {end}
        </blockquote>
      )
    return <ChatCodeBlock key={i} language={b.language} filename={b.filename} code={b.code} />
  })
}

const INITIAL: Turn[] = [
  { id: "u1", role: "user", text: "Write a webhook handler for paid invoices", files: [] },
  { id: "a1", role: "assistant", topic: "webhook", versions: [ANSWERS.webhook[0]], version: 0, shown: Infinity, state: "done", thoughtFor: 1 },
]

function useTimers() {
  const timers = useRef(new Set<number>())
  useEffect(() => {
    const set = timers.current
    return () => set.forEach((t) => window.clearTimeout(t))
  }, [])
  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
  }, [])
}

function IconAction({ label, onClick, pressed, disabled, children }: { label: string; onClick: () => void; pressed?: boolean; disabled?: boolean; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            aria-pressed={pressed}
            disabled={disabled}
            onClick={onClick}
            className="text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function AnswerActions({
  turn,
  isLast,
  busy,
  onRegenerate,
  onFeedback,
  onVersion,
}: {
  turn: AssistantTurn
  isLast: boolean
  busy: boolean
  onRegenerate: () => void
  onFeedback: (f: "up" | "down") => void
  onVersion: (v: number) => void
}) {
  const [copied, copy] = useCopyToClipboard()
  const blocks = reveal(turn.versions[turn.version], turn.shown)
  return (
    <ChatMessageActions className="-ml-1.5">
      {turn.versions.length > 1 ? (
        <div className="mr-1 flex items-center text-xs tabular-nums">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Previous version" disabled={busy || turn.version === 0} onClick={() => onVersion(turn.version - 1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          <span aria-live="polite">
            {turn.version + 1} / {turn.versions.length}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Next version"
            disabled={busy || turn.version === turn.versions.length - 1}
            onClick={() => onVersion(turn.version + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      ) : null}
      <IconAction label={copied ? "Copied" : "Copy answer"} onClick={() => copy(toText(blocks))}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </IconAction>
      {isLast ? (
        <IconAction label="Regenerate" onClick={onRegenerate} disabled={busy}>
          <RefreshCw aria-hidden="true" />
        </IconAction>
      ) : null}
      <IconAction label="Good answer" pressed={turn.feedback === "up"} onClick={() => onFeedback("up")}>
        <ThumbsUp aria-hidden="true" />
      </IconAction>
      <IconAction label="Bad answer" pressed={turn.feedback === "down"} onClick={() => onFeedback("down")}>
        <ThumbsDown aria-hidden="true" />
      </IconAction>
      {turn.feedback ? <span className="ml-1 text-xs">Thanks for the feedback.</span> : null}
    </ChatMessageActions>
  )
}

export default function ChatAiAssistant() {
  const [turns, setTurns] = useState<Turn[]>(INITIAL)
  const [draft, setDraft] = useState("")
  const [files, setFiles] = useState<File_[]>([])
  const [model, setModel] = useState("balanced")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamRef = useRef<number | undefined>(undefined)
  // Bumped by Stop and New chat, so a pending answer knows it was cancelled.
  const runRef = useRef(0)
  const idRef = useRef(10)
  const later = useTimers()

  const last = turns[turns.length - 1]
  const busy = last?.role === "assistant" && (last.state === "thinking" || last.state === "streaming")

  useEffect(() => () => window.clearInterval(streamRef.current), [])

  const patch = useCallback((id: string, change: (t: AssistantTurn) => Partial<AssistantTurn>) => {
    setTurns((ts) => ts.map((t) => (t.id === id && t.role === "assistant" ? { ...t, ...change(t) } : t)))
  }, [])

  /** Think for a moment, then stream the turn's current version in word by word. */
  const play = (id: string, blocks: Block[]) => {
    const think = MODELS.find((m) => m.value === model)?.think ?? 900
    const run = ++runRef.current
    later(() => {
      if (runRef.current !== run) return
      patch(id, () => ({ state: "streaming", shown: 0, thoughtFor: Math.max(1, Math.round(think / 1000)) }))
      const total = totalWords(blocks)
      let shown = 0
      window.clearInterval(streamRef.current)
      streamRef.current = window.setInterval(() => {
        shown += 2
        if (shown >= total) {
          window.clearInterval(streamRef.current)
          patch(id, () => ({ shown: Infinity, state: "done" }))
        } else patch(id, () => ({ shown }))
      }, 45)
    }, think)
  }

  const ask = (text: string, topic = topicFor(text)) => {
    const userId = `u${idRef.current++}`
    const answerId = `a${idRef.current++}`
    const versions = answersFor(topic, text)
    setTurns((ts) => [
      ...ts,
      { id: userId, role: "user", text, files },
      { id: answerId, role: "assistant", topic, versions: [versions[0]], version: 0, shown: 0, state: "thinking" },
    ])
    setDraft("")
    setFiles([])
    play(answerId, versions[0])
  }

  const stop = () => {
    runRef.current++
    window.clearInterval(streamRef.current)
    if (last?.role === "assistant" && busy) patch(last.id, (t) => ({ state: "stopped", shown: t.state === "thinking" ? 0 : t.shown }))
    inputRef.current?.focus()
  }

  const regenerate = (turn: AssistantTurn) => {
    const prompt = [...turns].reverse().find((t): t is UserTurn => t.role === "user")?.text ?? ""
    const all = answersFor(turn.topic, prompt)
    const next = all[turn.versions.length % all.length]
    patch(turn.id, (t) => ({ versions: [...t.versions, next], version: t.versions.length, shown: 0, state: "thinking", feedback: undefined }))
    play(turn.id, next)
  }

  const newChat = () => {
    runRef.current++
    window.clearInterval(streamRef.current)
    setTurns([])
    setDraft("")
    setFiles([])
    inputRef.current?.focus()
  }

  return (
    <Chat className="h-[640px] w-full max-w-3xl rounded-xl border bg-background text-foreground shadow-sm">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">Orbit assistant</h2>
          <p className="truncate text-xs text-muted-foreground">Answers from your invoices, clients and settings</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={newChat} disabled={turns.length === 0}>
          <SquarePen aria-hidden="true" />
          <span className="max-sm:sr-only">New chat</span>
        </Button>
      </header>

      <ChatMessageList contentClassName="mx-auto w-full max-w-2xl gap-6 px-4 py-6">
        {turns.length === 0 ? (
          <div className="my-auto flex flex-col items-center gap-6 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold">How can I help with your invoices?</p>
              <p className="text-sm text-muted-foreground">Ask about clients, payments or settings. Answers use your workspace data.</p>
            </div>
            <div role="group" aria-label="Suggestions" className="grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <ChatSuggestion key={s.text} onClick={() => ask(s.text, s.topic)} className="rounded-lg px-3.5 py-3">
                  <s.icon aria-hidden="true" />
                  {s.text}
                </ChatSuggestion>
              ))}
            </div>
          </div>
        ) : (
          turns.map((turn, i) => {
            if (turn.role === "user")
              return (
                <ChatMessage key={turn.id} side="end">
                  <ChatMessageContent>
                    <span className="sr-only">You said:</span>
                    {turn.files.map((f) => (
                      <ChatAttachment key={f.name} name={f.name} detail={f.size} />
                    ))}
                    {turn.text ? <ChatBubble>{turn.text}</ChatBubble> : null}
                  </ChatMessageContent>
                </ChatMessage>
              )
            const blocks = reveal(turn.versions[turn.version], turn.shown)
            return (
              <ChatMessage key={turn.id} streaming={turn.state === "streaming"}>
                <ChatMessageAvatar fallback={<Sparkles />} className="*:data-[slot=avatar-fallback]:bg-primary *:data-[slot=avatar-fallback]:text-primary-foreground" />
                <ChatMessageContent className="max-w-none flex-1 gap-2">
                  <ChatMessageHeader>
                    <ChatMessageName>Orbit assistant</ChatMessageName>
                    {turn.thoughtFor && turn.state !== "thinking" ? (
                      <span className="text-muted-foreground">
                        Thought for {turn.thoughtFor} {turn.thoughtFor === 1 ? "second" : "seconds"}
                      </span>
                    ) : null}
                  </ChatMessageHeader>
                  {turn.state === "thinking" ? (
                    <ChatTypingIndicator label="Orbit assistant is thinking" />
                  ) : (
                    <ChatBubble variant="ghost" className="space-y-3">
                      <Blocks blocks={blocks} caret={turn.state === "streaming"} />
                    </ChatBubble>
                  )}
                  {turn.state === "stopped" ? <p className="text-xs text-muted-foreground italic">You stopped this answer.</p> : null}
                  {turn.state === "done" || turn.state === "stopped" ? (
                    <AnswerActions
                      turn={turn}
                      isLast={i === turns.length - 1}
                      busy={busy}
                      onRegenerate={() => regenerate(turn)}
                      onFeedback={(f) => patch(turn.id, (t) => ({ feedback: t.feedback === f ? undefined : f }))}
                      onVersion={(v) => patch(turn.id, () => ({ version: v, shown: Infinity, state: "done" }))}
                    />
                  ) : null}
                </ChatMessageContent>
              </ChatMessage>
            )
          })
        )}
      </ChatMessageList>

      <div className="px-3 pb-3 sm:px-4">
        <ChatInput
          className="mx-auto max-w-2xl"
          value={draft}
          onValueChange={setDraft}
          onSubmit={(text) => ask(text.trim())}
          busy={busy}
          onStop={stop}
          inputRef={inputRef}
        >
          {files.length ? (
            <ChatInputAttachments>
              {files.map((f) => (
                <ChatInputAttachment key={f.name} name={f.name} detail={f.size} onRemove={() => setFiles((fs) => fs.filter((x) => x.name !== f.name))} />
              ))}
            </ChatInputAttachments>
          ) : null}
          <ChatInputTextarea
            aria-label="Message Orbit assistant"
            placeholder="Ask about an invoice, a client or a setting…"
            onKeyDown={(e) => {
              if (e.key === "Escape" && busy) {
                e.preventDefault()
                stop()
              }
            }}
          />
          <ChatInputToolbar>
            <ChatInputAttach
              label="Attach a file"
              onFiles={(picked) =>
                setFiles((fs) => [...fs, ...picked.filter((p) => !fs.some((f) => f.name === p.name)).map((p) => ({ name: p.name, size: formatFileSize(p.size) }))])
              }
            >
              <FileText aria-hidden="true" />
            </ChatInputAttach>
            <Select items={MODELS} value={model} onValueChange={(v) => v != null && setModel(String(v))}>
              <SelectTrigger size="sm" aria-label="Model" className="border-transparent bg-transparent shadow-none hover:bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="top" align="start" className="min-w-56">
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <span className="flex flex-col">
                      <span>{m.label}</span>
                      <span className="text-xs text-muted-foreground">{m.note}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">{busy ? "Esc to stop" : "Shift + Enter for a new line"}</span>
            <ChatInputSubmit className="ml-2 max-sm:ml-auto" />
          </ChatInputToolbar>
        </ChatInput>
        <p className="mt-2 text-center text-xs text-muted-foreground">Orbit assistant can make mistakes. Check totals before you send an invoice.</p>
      </div>
    </Chat>
  )
}
