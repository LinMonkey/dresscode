"use client"

// A support widget: a launcher in the corner opens a compact chat panel with a greeting, office hours,
// quick replies and the conversation, then asks for an email so replies can follow you. Escape or the
// minimize button closes it; replies that arrive while it's closed show as a count on the launcher.
// On phones the panel takes the whole screen.
import { ChevronDown, Clock, Mail, MessageCircle, X } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChatBubble,
  ChatInput,
  ChatInputSubmit,
  ChatInputTextarea,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageHeader,
  ChatMessageList,
  ChatMessageName,
  ChatMessageStatus,
  ChatMessageTime,
  ChatSuggestion,
  ChatSuggestions,
  ChatTypingIndicator,
  type ChatMessageStatusValue,
} from "@/registry/dresscode/components/chat/ui/chat"

type Msg = { id: string; from: "sam" | "me"; text: string; time: string; status?: ChatMessageStatusValue }

const TEAM = [
  { initials: "SR", name: "Sam" },
  { initials: "JN", name: "Juno" },
  { initials: "KA", name: "Kofi" },
]

const GREETING: Msg[] = [
  { id: "g1", from: "sam", time: "Just now", text: "Hi there! I'm Sam from Orbit support." },
  { id: "g2", from: "sam", time: "Just now", text: "Ask us anything about invoices, payments or your account. We usually reply in a couple of minutes." },
]

const QUICK = ["I can't send an invoice", "A question about my bill", "Set up card payments", "Talk to a person"]

function replyTo(text: string) {
  const t = text.toLowerCase()
  if (/can't send|cannot send|send an invoice|stuck/.test(t))
    return "Sorry about that! Most of the time it's a missing client email. Open the invoice, check the Bill to field, then press Send again. Still stuck? Tell me the invoice number."
  if (/bill|charge|plan|price|refund/.test(t)) return "Happy to help with billing. Your plan renews on December 1. What would you like to change?"
  if (/card|stripe|payment|pay/.test(t)) return "Card payments take two minutes: go to Settings → Payments, press Connect, and confirm your bank details. Clients can then pay from every invoice."
  if (/person|human|agent|someone/.test(t)) return "You're talking to one! I'm Sam, on the support team in Lisbon. What's going on?"
  return "Thanks! Let me look into that. I'll reply here, and by email if you leave the page."
}

const clock = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

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

function EmailCapture() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const id = useId()
  if (saved)
    return (
      <div className="flex items-start gap-2.5 rounded-lg border bg-card p-3 text-sm">
        <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          We’ll email <span className="font-medium">{saved}</span> if you’ve left by the time we reply.
        </p>
      </div>
    )
  return (
    <form
      noValidate
      className="space-y-2 rounded-lg border bg-card p-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter an email like ada@studio.com.")
        setSaved(email.trim())
      }}
    >
      <label htmlFor={id} className="block text-sm font-medium">
        Get replies by email
      </label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => {
            setEmail(e.target.value)
            setError("")
          }}
          className="bg-background"
        />
        <Button type="submit">Save</Button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  )
}

export default function ChatFloatingWidget() {
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState<Msg[]>(GREETING)
  const [draft, setDraft] = useState("")
  const [typing, setTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [unseen, setUnseen] = useState(0)
  const [teaser, setTeaser] = useState(true)
  const openRef = useRef(open)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const idRef = useRef(1)
  const later = useTimers()
  const titleId = useId()
  const panelId = useId()

  useEffect(() => {
    openRef.current = open
  })

  const started = messages.some((m) => m.from === "me")
  const replied = messages.some((m, i) => m.from === "sam" && i >= GREETING.length)
  const lastMine = messages.findLast((m) => m.from === "me")

  const show = () => {
    setOpen(true)
    setUnseen(0)
    setTeaser(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }
  const hide = () => {
    setOpen(false)
    requestAnimationFrame(() => launcherRef.current?.focus())
  }

  const setStatus = (id: string, status: ChatMessageStatusValue) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m)))

  const send = (text: string) => {
    const id = `u${idRef.current++}`
    setMessages((ms) => [...ms, { id, from: "me", text: text.trim(), time: clock(), status: "sending" }])
    setDraft("")
    setSending(true)
    later(() => {
      setStatus(id, "delivered")
      setSending(false)
    }, 600)
    later(() => setStatus(id, "read"), 1500)
    later(() => setTyping(true), 1800)
    later(() => {
      const reply: Msg = { id: `r${idRef.current++}`, from: "sam", text: replyTo(text), time: clock() }
      setTyping(false)
      setMessages((ms) => [...ms, reply])
      if (!openRef.current) {
        setUnseen((n) => n + 1)
        setTeaser(true)
      }
    }, 3800)
  }

  const lastReply = messages.findLast((m) => m.from === "sam")

  return (
    <>
      {open ? (
        <section
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation()
              hide()
            }
          }}
          className="fixed inset-0 z-40 flex animate-in flex-col overflow-hidden bg-background text-foreground duration-200 fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(600px,calc(100svh-8rem))] sm:w-[380px] sm:rounded-xl sm:border sm:shadow-xl"
        >
          <header className="flex items-start gap-3 bg-primary px-4 pt-4 pb-5 text-primary-foreground">
            <div className="min-w-0 flex-1 space-y-3">
              <AvatarGroup className="*:data-[slot=avatar]:ring-primary">
                {TEAM.map((p) => (
                  <Avatar key={p.initials} aria-hidden="true">
                    <AvatarFallback className="bg-primary-foreground text-xs font-medium text-primary">{p.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <div>
                <h2 id={titleId} className="text-base font-semibold">
                  Orbit support
                </h2>
                <p className="flex items-center gap-1.5 text-sm opacity-90">
                  <span aria-hidden="true" className="size-2 rounded-full bg-primary-foreground" />
                  Online · we reply in about 2 minutes
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-xs opacity-80">
                  <Clock aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                  <span>
                    <span className="sr-only">Office hours: </span>Mon to Fri, 8 am to 6 pm GMT. Sat, 10 am to 2 pm. Sunday messages get a reply on Monday.
                  </span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={hide}
              aria-label="Minimize chat"
              className="-mt-1 -mr-1 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <ChevronDown aria-hidden="true" className="max-sm:hidden" />
              <X aria-hidden="true" className="sm:hidden" />
            </Button>
          </header>

          <ChatMessageList aria-label="Conversation with Orbit support" contentClassName="justify-start gap-4 px-3 py-4">
            {messages.map((m, i) => {
              const mine = m.from === "me"
              const grouped = i > 0 && messages[i - 1].from === m.from
              return (
                <ChatMessage key={m.id} side={mine ? "end" : "start"} grouped={grouped} status={m.status}>
                  {mine ? null : <ChatMessageAvatar fallback="SR" size="sm" className="mt-1" />}
                  <ChatMessageContent className="max-w-[85%]">
                    <ChatMessageHeader>
                      <ChatMessageName className={mine ? "sr-only" : undefined}>{mine ? "You" : "Sam"}</ChatMessageName>
                      <ChatMessageTime>{m.time}</ChatMessageTime>
                    </ChatMessageHeader>
                    <ChatBubble>{m.text}</ChatBubble>
                    {mine && m.id === lastMine?.id && m.status ? <ChatMessageStatus status={m.status} /> : null}
                  </ChatMessageContent>
                </ChatMessage>
              )
            })}
            {!started ? (
              <ChatSuggestions aria-label="Quick replies" className="justify-end pl-10">
                {QUICK.map((q) => (
                  <ChatSuggestion key={q} onClick={() => send(q)}>
                    {q}
                  </ChatSuggestion>
                ))}
              </ChatSuggestions>
            ) : null}
            {typing ? (
              <ChatMessage>
                <ChatMessageAvatar fallback="SR" size="sm" className="mt-1" />
                <ChatMessageContent>
                  <ChatTypingIndicator name="Sam" />
                </ChatMessageContent>
              </ChatMessage>
            ) : null}
            {replied ? <EmailCapture /> : null}
          </ChatMessageList>

          <div className="border-t p-3">
            <ChatInput value={draft} onValueChange={setDraft} onSubmit={send} busy={sending} inputRef={inputRef} className="flex-row items-end">
              <ChatInputTextarea aria-label="Message Orbit support" placeholder="Write a message…" className="min-h-9 py-1.5" />
              <ChatInputSubmit size="icon-sm" className="mb-0.5" />
            </ChatInput>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Replies also go to your email. We never share it.</p>
          </div>
        </section>
      ) : null}

      {!open && teaser && lastReply ? (
        <div className="fixed right-4 bottom-22 z-40 flex max-w-[min(18rem,calc(100vw-2rem))] animate-in items-start gap-2 rounded-xl border bg-popover p-3 text-sm text-popover-foreground shadow-lg duration-200 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none sm:right-6 sm:bottom-24">
          <button type="button" onClick={show} className="min-w-0 flex-1 text-left outline-none focus-visible:underline">
            <span className="block text-xs font-medium text-muted-foreground">{unseen ? "Sam replied" : "Sam from Orbit"}</span>
            <span className="line-clamp-2">{lastReply.text}</span>
          </button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Dismiss" onClick={() => setTeaser(false)} className="-mt-1 -mr-1 text-muted-foreground">
            <X aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={open ? hide : show}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Minimize chat" : unseen ? `Open chat, ${unseen} new ${unseen === 1 ? "reply" : "replies"}` : "Open chat with Orbit support"}
        className={`fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:right-6 sm:bottom-6 ${open ? "max-sm:hidden" : ""}`}
      >
        {open ? <ChevronDown aria-hidden="true" className="size-6" /> : <MessageCircle aria-hidden="true" className="size-6" />}
        {!open && unseen ? (
          <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-background ring-2 ring-background">
            {unseen}
          </span>
        ) : null}
      </button>
    </>
  )
}
