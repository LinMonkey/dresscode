"use client"

// An inbox: conversations on the left (search, an unread filter, unread counts, online dots, drafts, a
// failed message flagged) beside the open thread. Opening a conversation marks it read; new messages
// move it to the top. On phones the list and the thread are separate screens with a back button.
import { AlertCircle, ArrowLeft, Search, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import {
  Chat,
  ChatAttachment,
  ChatBubble,
  ChatInput,
  ChatInputAttach,
  ChatInputAttachment,
  ChatInputAttachments,
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
  ChatSeparator,
  ChatTypingIndicator,
  formatFileSize,
  type ChatMessageStatusValue,
} from "@/registry/dresscode/components/chat/ui/chat"

type FileRef = { name: string; size: string }
type Msg = { id: string; from: "me" | "them"; text: string; day: string; time: string; status?: ChatMessageStatusValue; files?: FileRef[] }
type Convo = {
  id: string
  name: string
  company: string
  initials: string
  online: boolean
  lastSeen?: string
  unread: number
  order: number
  messages: Msg[]
  replies: string[]
}

const CONVOS: Convo[] = [
  {
    id: "tom",
    name: "Tom Okafor",
    company: "Kato & Lee",
    initials: "TO",
    online: true,
    unread: 2,
    order: 9,
    replies: ["That works for us, thank you!", "Perfect. I'll pay the first half today.", "Great, thanks Ada."],
    messages: [
      { id: "t1", from: "me", day: "Yesterday", time: "4:12 PM", text: "Hi Tom, INV-1042 for the brand refresh is in your inbox. It's due December 8.", status: "read" },
      { id: "t2", from: "them", day: "Yesterday", time: "4:30 PM", text: "Thanks Ada, got it." },
      { id: "t3", from: "them", day: "Today", time: "9:50 AM", text: "Quick question about this one." },
      { id: "t4", from: "them", day: "Today", time: "9:52 AM", text: "Can we split INV-1042 into two payments? Half now and half in January." },
    ],
  },
  {
    id: "maya",
    name: "Maya Lindqvist",
    company: "Bookkeeper",
    initials: "ML",
    online: true,
    unread: 1,
    order: 8,
    replies: ["Got it, I'll take a look this afternoon.", "Thanks, that's everything for October then."],
    messages: [
      { id: "m1", from: "me", day: "Today", time: "8:05 AM", text: "Morning! Could you check the October payouts when you have a minute?", status: "read" },
      { id: "m2", from: "them", day: "Today", time: "9:15 AM", text: "I've reconciled October. Two payments are missing a receipt: INV-1031 and INV-1034." },
    ],
  },
  {
    id: "priya",
    name: "Priya Raman",
    company: "Pellucid Health",
    initials: "PR",
    online: false,
    lastSeen: "Last seen 2 hours ago",
    unread: 0,
    order: 7,
    replies: [],
    messages: [
      { id: "p1", from: "them", day: "Nov 21", time: "11:20 AM", text: "We're waiting on our finance team to approve INV-1036." },
      {
        id: "p2",
        from: "me",
        day: "Today",
        time: "8:40 AM",
        text: "Hi Priya, following up on INV-1036. It's now 15 days past due. Is there anything I can do to help it along?",
        status: "failed",
      },
    ],
  },
  {
    id: "jonas",
    name: "Jonas Berg",
    company: "Harlow Books",
    initials: "JB",
    online: false,
    lastSeen: "Last seen yesterday",
    unread: 0,
    order: 6,
    replies: [],
    messages: [
      {
        id: "j1",
        from: "me",
        day: "Yesterday",
        time: "2:02 PM",
        text: "I've updated your billing address. Here's the new copy.",
        status: "read",
        files: [{ name: "INV-1039.pdf", size: "182 KB" }],
      },
      { id: "j2", from: "them", day: "Yesterday", time: "2:30 PM", text: "Thanks, the new address is on the invoice now." },
    ],
  },
  {
    id: "sam",
    name: "Sam Rivera",
    company: "Orbit support",
    initials: "SR",
    online: true,
    unread: 0,
    order: 5,
    replies: ["Thanks for writing back. How can I help?"],
    messages: [{ id: "s1", from: "them", day: "Mon", time: "10:42 AM", text: "Glad that sorted it! I'll mark this as solved, but you can reply here any time." }],
  },
  {
    id: "lena",
    name: "Lena Fischer",
    company: "Brightline Films",
    initials: "LF",
    online: false,
    lastSeen: "Last seen Nov 20",
    unread: 3,
    order: 4,
    replies: [],
    messages: [
      { id: "l1", from: "them", day: "Nov 20", time: "3:05 PM", text: "Hi Ada, could you resend the October invoice as a PDF?" },
      { id: "l2", from: "them", day: "Nov 20", time: "3:06 PM", text: "Our accounts team can't open the link." },
      { id: "l3", from: "them", day: "Nov 20", time: "3:10 PM", text: "Thank you!" },
    ],
  },
]

const clock = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
const when = (m: Msg) => (m.day === "Today" ? m.time : m.day)

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)")
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
/** Both panes side by side (md and up), or one screen at a time. */
const useWide = () => useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 768px)").matches, () => false)

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

export default function ChatInbox() {
  const [convos, setConvos] = useState(CONVOS)
  const [selected, setSelected] = useState("tom")
  const [view, setView] = useState<"list" | "thread">("list")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, FileRef[]>>({})
  const [typing, setTyping] = useState<Record<string, boolean>>({})
  const [announce, setAnnounce] = useState("")
  const wide = useWide()
  const listRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const idRef = useRef(100)
  const later = useTimers()

  const threadOpen = wide || view === "thread"
  const open = convos.find((c) => c.id === selected) ?? convos[0]
  const unreadOf = (c: Convo) => (threadOpen && c.id === selected ? 0 : c.unread)
  const totalUnread = convos.reduce((n, c) => n + unreadOf(c), 0)

  const update = (id: string, change: (c: Convo) => Partial<Convo>) => setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, ...change(c) } : c)))
  const setStatus = (cid: string, mid: string, status: ChatMessageStatusValue) =>
    update(cid, (c) => ({ messages: c.messages.map((m) => (m.id === mid ? { ...m, status } : m)) }))

  // A message from Maya arrives a few seconds in, to show unread counts and reordering at work.
  const selectedRef = useRef(selected)
  const threadOpenRef = useRef(threadOpen)
  useEffect(() => {
    selectedRef.current = selected
    threadOpenRef.current = threadOpen
  })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const viewing = threadOpenRef.current && selectedRef.current === "maya"
      const msg: Msg = { id: "m3", from: "them", day: "Today", time: clock(), text: "Also, the Pellucid deposit landed this morning." }
      setConvos((cs) => cs.map((c) => (c.id === "maya" ? { ...c, messages: [...c.messages, msg], unread: viewing ? 0 : c.unread + 1, order: Date.now() } : c)))
      if (!viewing) setAnnounce("New message from Maya Lindqvist")
    }, 7000)
    return () => window.clearTimeout(t)
  }, [])

  const select = (id: string) => {
    // The conversation you are leaving was on screen, so it has been read.
    setConvos((cs) => cs.map((c) => (c.id === id || (threadOpen && c.id === selected) ? { ...c, unread: 0 } : c)))
    setSelected(id)
    setView("thread")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const back = () => {
    setConvos((cs) => cs.map((c) => (c.id === selected ? { ...c, unread: 0 } : c)))
    setView("list")
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLButtonElement>(`[data-convo="${selected}"]`)?.focus())
  }

  const deliver = (c: Convo, mid: string) => {
    later(() => setStatus(c.id, mid, "sent"), 500)
    later(() => setStatus(c.id, mid, "delivered"), 1300)
    if (!c.online || !c.replies.length) return
    later(() => setStatus(c.id, mid, "read"), 2000)
    later(() => setTyping((t) => ({ ...t, [c.id]: true })), 2300)
    later(() => {
      const reply: Msg = { id: `r${idRef.current++}`, from: "them", day: "Today", time: clock(), text: c.replies[idRef.current % c.replies.length] }
      setTyping((t) => ({ ...t, [c.id]: false }))
      setConvos((cs) =>
        cs.map((x) => (x.id === c.id ? { ...x, messages: [...x.messages, reply], order: Date.now(), unread: threadOpenRef.current && selectedRef.current === c.id ? 0 : x.unread + 1 } : x)),
      )
      if (!(threadOpenRef.current && selectedRef.current === c.id)) setAnnounce(`New message from ${c.name}`)
    }, 4300)
  }

  const send = (text: string) => {
    const c = open
    const msg: Msg = { id: `s${idRef.current++}`, from: "me", day: "Today", time: clock(), text: text.trim(), status: "sending", files: files[c.id] }
    update(c.id, (x) => ({ messages: [...x.messages, msg], order: Date.now() }))
    setDrafts((d) => ({ ...d, [c.id]: "" }))
    setFiles((f) => ({ ...f, [c.id]: [] }))
    deliver(c, msg.id)
  }

  const retry = (c: Convo, mid: string) => {
    setStatus(c.id, mid, "sending")
    later(() => setStatus(c.id, mid, "delivered"), 900)
  }

  const q = query.trim().toLowerCase()
  const shown = [...convos]
    .sort((a, b) => b.order - a.order)
    .filter((c) => (filter === "unread" ? unreadOf(c) > 0 : true))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.messages.some((m) => m.text.toLowerCase().includes(q)))

  const pendingFiles = files[open.id] ?? []
  const draft = drafts[open.id] ?? ""
  const lastMine = open.messages.findLast((m) => m.from === "me")

  return (
    <div className="flex h-[640px] w-full max-w-5xl overflow-hidden rounded-xl border bg-background text-foreground shadow-sm">
      <div role="status" aria-live="polite" className="sr-only">
        {announce}
      </div>

      {/* Conversation list */}
      <section aria-label="Conversations" className={`${threadOpen && !wide ? "hidden" : "flex"} w-full min-w-0 flex-col bg-card md:flex md:w-80 md:shrink-0 md:border-r`}>
        <div className="space-y-3 border-b p-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <h2 className="text-base font-semibold">Messages</h2>
            {totalUnread ? <span className="text-xs text-muted-foreground">{totalUnread} unread</span> : null}
          </div>
          <InputGroup className="bg-background">
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput aria-label="Search conversations" placeholder="Search people and messages" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X aria-hidden="true" />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          <div role="group" aria-label="Show" className="flex gap-1">
            {(["all", "unread"] as const).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={filter === f ? "secondary" : "ghost"}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className="rounded-full"
              >
                {f === "all" ? "All" : "Unread"}
              </Button>
            ))}
          </div>
        </div>
        {shown.length ? (
          <ul ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {shown.map((c) => {
              const last = c.messages[c.messages.length - 1]
              const unread = unreadOf(c)
              const draftText = c.id !== selected || !threadOpen ? drafts[c.id] : ""
              const failed = last.from === "me" && last.status === "failed"
              const active = c.id === selected && threadOpen
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    data-convo={c.id}
                    aria-current={active ? "true" : undefined}
                    onClick={() => select(c.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=true]:bg-muted"
                  >
                    <Avatar size="lg" aria-hidden="true">
                      <AvatarFallback className="text-sm font-medium">{c.initials}</AvatarFallback>
                      {c.online ? <AvatarBadge /> : null}
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-sm ${unread ? "font-semibold" : "font-medium"}`}>{c.name}</span>
                        <span className={`shrink-0 text-xs tabular-nums ${unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>{when(last)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className={`flex min-w-0 flex-1 items-center gap-1 truncate text-sm ${unread ? "text-foreground" : "text-muted-foreground"}`}>
                          {typing[c.id] ? (
                            <span className="text-primary">typing…</span>
                          ) : draftText ? (
                            <span className="truncate">
                              <span className="text-primary">Draft: </span>
                              {draftText}
                            </span>
                          ) : failed ? (
                            <span className="flex min-w-0 items-center gap-1 text-destructive">
                              <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
                              <span className="truncate">Not sent: {last.text}</span>
                            </span>
                          ) : (
                            <span className="truncate">
                              {last.from === "me" ? "You: " : ""}
                              {last.text || last.files?.[0]?.name}
                            </span>
                          )}
                        </span>
                        {unread ? (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground tabular-nums">
                            {unread}
                            <span className="sr-only"> unread</span>
                          </span>
                        ) : null}
                      </span>
                      <span className="sr-only">
                        , {c.company}, {c.online ? "online" : "offline"}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-muted-foreground">{q ? `No conversations match “${query.trim()}”.` : "You're all caught up. No unread messages."}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("")
                setFilter("all")
              }}
            >
              Show all conversations
            </Button>
          </div>
        )}
      </section>

      {/* The open thread */}
      <Chat aria-label={`Conversation with ${open.name}`} className={`${threadOpen ? "flex" : "hidden"} min-w-0 flex-1 md:flex`} role="region">
        <header className="flex items-center gap-3 border-b px-3 py-2.5 md:px-4">
          <Button type="button" variant="ghost" size="icon" className="-ml-1 md:hidden" onClick={back} aria-label="Back to conversations">
            <ArrowLeft aria-hidden="true" />
          </Button>
          <ChatMessageAvatar fallback={open.initials} online={open.online} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{open.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {open.company} · {typing[open.id] ? "typing…" : open.online ? "Online" : open.lastSeen}
            </p>
          </div>
        </header>

        <ChatMessageList key={open.id} aria-label={`Messages with ${open.name}`} contentClassName="px-3 md:px-5">
          {open.messages.map((m, i) => {
            const prev = open.messages[i - 1]
            const newDay = !prev || prev.day !== m.day
            const grouped = !newDay && prev?.from === m.from
            const mine = m.from === "me"
            return [
              newDay ? <ChatSeparator key={`d-${m.id}`}>{m.day}</ChatSeparator> : null,
              <ChatMessage key={m.id} side={mine ? "end" : "start"} grouped={grouped} status={m.status}>
                {mine ? null : <ChatMessageAvatar fallback={open.initials} />}
                <ChatMessageContent>
                  <ChatMessageHeader>
                    <ChatMessageName className={mine ? "sr-only" : undefined}>{mine ? "You" : open.name.split(" ")[0]}</ChatMessageName>
                    <ChatMessageTime>{m.time}</ChatMessageTime>
                  </ChatMessageHeader>
                  {m.files?.map((f) => (
                    <ChatAttachment key={f.name} name={f.name} detail={f.size} />
                  ))}
                  {m.text ? <ChatBubble>{m.text}</ChatBubble> : null}
                  {mine && m.status && (m.id === lastMine?.id || m.status === "failed") ? (
                    <ChatMessageStatus status={m.status} onRetry={m.status === "failed" ? () => retry(open, m.id) : undefined} />
                  ) : null}
                </ChatMessageContent>
              </ChatMessage>,
            ]
          })}
          {typing[open.id] ? (
            <ChatMessage>
              <ChatMessageAvatar fallback={open.initials} />
              <ChatMessageContent>
                <ChatTypingIndicator name={open.name.split(" ")[0]} />
              </ChatMessageContent>
            </ChatMessage>
          ) : null}
        </ChatMessageList>

        <div className="border-t p-3">
          <ChatInput
            value={draft}
            onValueChange={(v) => setDrafts((d) => ({ ...d, [open.id]: v }))}
            onSubmit={send}
            canSubmit={draft.trim().length > 0 || pendingFiles.length > 0}
            inputRef={inputRef}
          >
            {pendingFiles.length ? (
              <ChatInputAttachments>
                {pendingFiles.map((f) => (
                  <ChatInputAttachment
                    key={f.name}
                    name={f.name}
                    detail={f.size}
                    onRemove={() => setFiles((all) => ({ ...all, [open.id]: pendingFiles.filter((x) => x.name !== f.name) }))}
                  />
                ))}
              </ChatInputAttachments>
            ) : null}
            <div className="flex items-end gap-1">
              <ChatInputAttach
                label="Attach a file"
                onFiles={(picked) =>
                  setFiles((all) => ({ ...all, [open.id]: [...pendingFiles, ...picked.map((p) => ({ name: p.name, size: formatFileSize(p.size) }))].slice(0, 5) }))
                }
              />
              <ChatInputTextarea aria-label={`Message ${open.name}`} placeholder={`Message ${open.name.split(" ")[0]}…`} />
              <ChatInputSubmit />
            </div>
          </ChatInput>
        </div>
      </Chat>
    </div>
  )
}
