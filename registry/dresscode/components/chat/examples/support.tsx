"use client"

// A customer support conversation: a screenshot sent as an image (click it to see it full size), read
// receipts under your last message, the agent typing and replying, and a satisfaction rating once the
// agent marks the conversation as solved. Writing again reopens it.
import { Angry, Frown, ImagePlus, Laugh, Mail, Meh, MoreHorizontal, CircleCheck, Smile } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Chat,
  ChatAttachment,
  ChatBubble,
  ChatImage,
  ChatInput,
  ChatInputAttach,
  ChatInputAttachment,
  ChatInputAttachments,
  ChatInputSubmit,
  ChatInputTextarea,
  ChatInputToolbar,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageHeader,
  ChatMessageList,
  ChatMessageName,
  ChatMessageStatus,
  ChatMessageTime,
  ChatSeparator,
  ChatTypingIndicator,
  formatFileSize,
  type ChatMessageStatusValue,
} from "@/registry/dresscode/components/chat/ui/chat"

type Attachment = { id: string; kind: "image"; name: string; src?: string } | { id: string; kind: "file"; name: string; size: string }
type Msg = { type: "msg"; id: string; from: "agent" | "me"; text?: string; attachments?: Attachment[]; time: string; status?: ChatMessageStatusValue; readAt?: string }
type Item = Msg | { type: "event"; id: string; text: string } | { type: "rating"; id: string }

const AGENT = { name: "Sam Rivera", first: "Sam", initials: "SR" }

const INITIAL: Item[] = [
  { type: "event", id: "e0", text: "Today" },
  {
    type: "msg",
    id: "m1",
    from: "me",
    time: "10:31 AM",
    text: "Hi! A client says their card was declined when paying INV-1042, but their bank says nothing was blocked.",
  },
  { type: "msg", id: "m2", from: "me", time: "10:31 AM", attachments: [{ id: "a1", kind: "image", name: "payment-declined.png" }] },
  {
    type: "msg",
    id: "m3",
    from: "agent",
    time: "10:34 AM",
    text: "Thanks for the screenshot, that helps. The decline came from the card network's fraud check, not from Orbit or the bank.",
  },
  {
    type: "msg",
    id: "m4",
    from: "agent",
    time: "10:34 AM",
    text: "I've added Kato & Lee's card to the allow list for your workspace. Could you ask Tom to try once more?",
  },
  { type: "msg", id: "m5", from: "me", time: "10:41 AM", text: "He just paid. Thank you so much!", status: "read", readAt: "10:41 AM" },
  { type: "msg", id: "m6", from: "agent", time: "10:42 AM", text: "Great to hear. I'll mark this as solved, but you can reply here any time." },
  { type: "event", id: "e1", text: "Sam marked this conversation as solved" },
  { type: "rating", id: "r1" },
]

function replyTo(text: string, hasImage: boolean) {
  const t = text.toLowerCase()
  if (/refund/.test(t)) return "You can refund a payment from the invoice page: open it, choose Refund, then pick the full amount or part of it. The money reaches your client in 5 to 10 days."
  if (/fee|price|plan|cost|charge/.test(t)) return "Card payments cost 2.9% + 30¢ on every plan. Bank transfers are 0.8%, capped at $5. There's no monthly fee for taking payments."
  if (/thank|thanks|great|perfect/.test(t)) return "You're welcome, Ada! Have a lovely rest of your day."
  if (hasImage) return "Thanks, I can see it. Give me a moment to check this with the payments team."
  return "Good question. Let me check with the payments team and get back to you in a few minutes. You'll get an email too when I reply."
}

const clock = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

/** A drawn screenshot of Orbit's payment page with the decline error, sized in em so it scales. */
function PaymentScreenshot({ className }: { className?: string }) {
  return (
    <div className={`flex aspect-[16/10] flex-col gap-[0.9em] bg-background p-[1.4em] text-foreground ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[0.5em] font-semibold">
          <span className="size-[1.4em] rounded-full bg-primary" />
          Fernwood Studio
        </span>
        <span className="text-muted-foreground">INV-1042</span>
      </div>
      <div>
        <div className="text-muted-foreground">Amount due</div>
        <div className="text-[2em] leading-tight font-semibold">$1,860.00</div>
      </div>
      <div className="rounded-[0.5em] border border-destructive/40 bg-destructive/10 px-[0.8em] py-[0.5em] text-destructive">
        Your card was declined. Try another card or contact your bank.
      </div>
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-[0.5em] gap-y-[0.3em] text-muted-foreground">
        <span>Card number</span>
        <span>Expiry</span>
        <span>CVC</span>
        <span className="flex h-[2.2em] items-center rounded-[0.4em] border border-destructive/60 bg-card px-[0.6em] text-foreground tabular-nums">4000 •••• •••• 0119</span>
        <span className="flex h-[2.2em] items-center rounded-[0.4em] border bg-card px-[0.6em] text-foreground tabular-nums">08 / 28</span>
        <span className="flex h-[2.2em] items-center rounded-[0.4em] border bg-card px-[0.6em] text-foreground">•••</span>
        <span className="col-span-3 mt-[0.4em]">Name on card</span>
        <span className="col-span-3 flex h-[2.2em] items-center rounded-[0.4em] border bg-card px-[0.6em] text-foreground">Tom Okafor</span>
      </div>
      <span className="mt-auto flex h-[2.4em] items-center justify-center rounded-[0.4em] bg-primary font-medium text-primary-foreground">Pay $1,860.00</span>
    </div>
  )
}

const FACES = [
  { value: 1, label: "Terrible", icon: Angry },
  { value: 2, label: "Bad", icon: Frown },
  { value: 3, label: "Okay", icon: Meh },
  { value: 4, label: "Good", icon: Smile },
  { value: 5, label: "Great", icon: Laugh },
]

function Rating() {
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [sent, setSent] = useState(false)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + FACES.length) % FACES.length
    setRating(FACES[next].value)
    refs.current[next]?.focus()
  }

  if (sent) {
    const face = FACES.find((f) => f.value === rating)
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center">
        {face ? <face.icon aria-hidden="true" className="size-7 text-primary" /> : null}
        <p className="text-sm font-medium">Thanks for rating this chat “{face?.label.toLowerCase()}”.</p>
        <p className="text-xs text-muted-foreground">Your feedback goes to Sam and the support team lead.</p>
      </div>
    )
  }

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-3 rounded-xl border bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (rating) setSent(true)
      }}
    >
      <div className="text-center">
        <p id="rate-title" className="text-sm font-medium">
          How was your chat with Sam?
        </p>
        <p className="text-xs text-muted-foreground">Your answer helps us get better.</p>
      </div>
      <div role="radiogroup" aria-labelledby="rate-title" className="grid grid-cols-5 gap-1">
        {FACES.map((f, i) => {
          const checked = rating === f.value
          return (
            <button
              key={f.value}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (rating === null && i === 0) ? 0 : -1}
              onClick={() => setRating(f.value)}
              onKeyDown={(e) => move(e, i)}
              className="flex flex-col items-center gap-1 rounded-lg border border-transparent px-1 py-2 text-xs text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:border-primary aria-checked:bg-primary/10 aria-checked:text-foreground"
            >
              <f.icon aria-hidden="true" className="size-6" />
              {f.label}
            </button>
          )
        })}
      </div>
      {rating ? (
        <>
          <Textarea
            aria-label="Tell us more (optional)"
            placeholder={rating >= 4 ? "What did Sam do well? (optional)" : "What could we have done better? (optional)"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-16 bg-background"
          />
          <Button type="submit">Send feedback</Button>
        </>
      ) : null}
    </form>
  )
}

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

export default function ChatSupport() {
  const [items, setItems] = useState<Item[]>(INITIAL)
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState<Attachment[]>([])
  const [typing, setTyping] = useState(0)
  const [sending, setSending] = useState(false)
  const idRef = useRef(100)
  const urls = useRef(new Set<string>())
  const later = useTimers()

  useEffect(() => {
    const set = urls.current
    return () => set.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const nextId = () => `n${idRef.current++}`
  // Solved until you write again (or reopened by the last solve/reopen event).
  const lastState = items.findLast((i): i is Extract<Item, { type: "event" }> => i.type === "event" && /solved|reopened/.test(i.text))
  const solved = !!lastState && /solved/.test(lastState.text)
  const lastMine = items.findLast((i): i is Msg => i.type === "msg" && i.from === "me")

  const setStatus = (id: string, status: ChatMessageStatusValue, readAt?: string) =>
    setItems((xs) => xs.map((x) => (x.type === "msg" && x.id === id ? { ...x, status, readAt } : x)))

  const deliver = (id: string, text: string, hasImage: boolean) => {
    later(() => {
      setStatus(id, "delivered")
      setSending(false)
    }, 700)
    later(() => setStatus(id, "read", clock()), 1700)
    later(() => setTyping((n) => n + 1), 2100)
    later(
      () => {
        const reply: Msg = { type: "msg", id: nextId(), from: "agent", time: clock(), text: replyTo(text, hasImage) }
        setTyping((n) => n - 1)
        setItems((xs) => [...xs, reply])
      },
      2100 + Math.min(3200, 1200 + text.length * 12),
    )
  }

  const send = (text: string) => {
    const id = nextId()
    const attachments = pending
    const add: Item[] = []
    if (solved) add.push({ type: "event", id: nextId(), text: "You reopened the conversation" })
    add.push({ type: "msg", id, from: "me", time: clock(), text: text.trim() || undefined, attachments, status: "sending" })
    setItems((xs) => [...xs, ...add])
    setDraft("")
    setPending([])
    setSending(true)
    deliver(id, text, attachments.some((a) => a.kind === "image"))
  }

  const addFiles = (files: File[]) => {
    const next = files.slice(0, 4).map((f): Attachment => {
      if (f.type.startsWith("image/")) {
        const src = URL.createObjectURL(f)
        urls.current.add(src)
        return { id: nextId(), kind: "image", name: f.name, src }
      }
      return { id: nextId(), kind: "file", name: f.name, size: formatFileSize(f.size) }
    })
    setPending((p) => [...p, ...next].slice(0, 4))
  }

  const addItems = (...add: Item[]) => setItems((xs) => [...xs, ...add])
  const solve = () => addItems({ type: "event", id: nextId(), text: "You marked this conversation as solved" }, { type: "rating", id: nextId() })

  return (
    <Chat className="h-[640px] w-full max-w-2xl rounded-xl border bg-background text-foreground shadow-sm">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <ChatMessageAvatar fallback={AGENT.initials} online size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{AGENT.name}</h2>
          <p className="truncate text-xs text-muted-foreground">Orbit support · usually replies in 2 minutes</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="Conversation options" />}>
            <MoreHorizontal aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => addItems({ type: "event", id: nextId(), text: "Transcript sent to ada@fernwood.studio" })}>
              <Mail aria-hidden="true" />
              Email me a transcript
            </DropdownMenuItem>
            <DropdownMenuItem disabled={solved} onClick={solve}>
              <CircleCheck aria-hidden="true" />
              Mark as solved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ChatMessageList aria-label="Conversation with Sam Rivera" contentClassName="px-3 sm:px-5">
        {items.map((item, i) => {
          if (item.type === "event") return <ChatSeparator key={item.id}>{item.text}</ChatSeparator>
          if (item.type === "rating") return <Rating key={item.id} />
          const prev = items[i - 1]
          const grouped = prev?.type === "msg" && prev.from === item.from
          const mine = item.from === "me"
          return (
            <ChatMessage key={item.id} side={mine ? "end" : "start"} grouped={grouped} status={item.status}>
              {mine ? null : <ChatMessageAvatar fallback={AGENT.initials} />}
              <ChatMessageContent>
                <ChatMessageHeader>
                  <ChatMessageName className={mine ? "sr-only" : undefined}>{mine ? "You" : AGENT.first}</ChatMessageName>
                  <ChatMessageTime>{item.time}</ChatMessageTime>
                </ChatMessageHeader>
                {item.attachments?.map((a) =>
                  a.kind === "file" ? (
                    <ChatAttachment key={a.id} name={a.name} detail={a.size} />
                  ) : (
                    <Dialog key={a.id}>
                      <DialogTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`Open ${a.name}`}
                            className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          />
                        }
                      >
                        <ChatImage label={a.src ? a.name : "Screenshot: the payment page for INV-1042 says the card was declined"} className="aspect-[16/10]">
                          {a.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.src} alt="" />
                          ) : (
                            <PaymentScreenshot className="text-[6.5px]" />
                          )}
                        </ChatImage>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{a.name}</DialogTitle>
                          <DialogDescription>
                            Sent by {mine ? "you" : AGENT.first} at {item.time}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="overflow-hidden rounded-lg border">
                          {a.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.src} alt={a.name} className="max-h-[70svh] w-full object-contain" />
                          ) : (
                            <PaymentScreenshot className="text-[9px] sm:text-[13px]" />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ),
                )}
                {item.text ? <ChatBubble>{item.text}</ChatBubble> : null}
                {mine && item.id === lastMine?.id && item.status ? (
                  <ChatMessageStatus status={item.status} time={item.status === "read" ? item.readAt : undefined} />
                ) : null}
              </ChatMessageContent>
            </ChatMessage>
          )
        })}
        {typing > 0 ? (
          <ChatMessage>
            <ChatMessageAvatar fallback={AGENT.initials} />
            <ChatMessageContent>
              <ChatTypingIndicator name={AGENT.first} />
            </ChatMessageContent>
          </ChatMessage>
        ) : null}
      </ChatMessageList>

      <div className="border-t p-3">
        <ChatInput value={draft} onValueChange={setDraft} onSubmit={send} busy={sending} canSubmit={draft.trim().length > 0 || pending.length > 0}>
          {pending.length ? (
            <ChatInputAttachments>
              {pending.map((a) => (
                <ChatInputAttachment
                  key={a.id}
                  name={a.name}
                  detail={a.kind === "file" ? a.size : undefined}
                  preview={
                    a.kind === "image" && a.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.src} alt="" />
                    ) : undefined
                  }
                  onRemove={() => setPending((p) => p.filter((x) => x.id !== a.id))}
                />
              ))}
            </ChatInputAttachments>
          ) : null}
          <div className="flex items-end gap-1">
            <ChatInputAttach label="Attach a screenshot or file" accept="image/*,.pdf,.csv" onFiles={addFiles}>
              <ImagePlus aria-hidden="true" />
            </ChatInputAttach>
            <ChatInputTextarea aria-label="Message Sam" placeholder={solved ? "Write to reopen this conversation…" : "Write a message…"} />
            <ChatInputToolbar className="shrink-0">
              <ChatInputSubmit />
            </ChatInputToolbar>
          </div>
        </ChatInput>
      </div>
    </Chat>
  )
}
