"use client"

// Chat: the parts of a conversation UI. A message list that keeps to the newest message unless the
// reader has scrolled up (then a "New messages" button jumps back down), messages placed by sender with
// an avatar, a name, a time and a delivery status, bubbles for text, files, images and code, a typing
// indicator, quick-reply chips, and a composer whose textarea grows as you type (Enter sends,
// Shift+Enter adds a line). The list is a polite live region, so new messages are read out.
// Built for shadcn/ui; reads only the theme's variables.
import * as React from "react"
import { AlertCircle, ArrowDown, ArrowUp, Check, CheckCheck, Clock, Copy, FileText, Loader2, Paperclip, RotateCw, Square, X } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatSide = "start" | "end"
type ChatMessageStatusValue = "sending" | "sent" | "delivered" | "read" | "failed"

/** A column that holds a header, a ChatMessageList and a ChatInput. Give it a height. */
function Chat({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chat" className={cn("flex min-h-0 flex-col overflow-hidden", className)} {...props} />
}

// ---------------------------------------------------------------------------------------------
// The message list

type ChatMessageListProps = React.ComponentProps<"div"> & {
  /** Classes for the inner column that holds the messages (padding, gap, max width). */
  contentClassName?: string
  /** How near the bottom, in px, still counts as reading the newest message. */
  threshold?: number
  /** The jump button's text when the reader has scrolled up. */
  jumpLabel?: string
  /** The jump button's text when something new arrived below. */
  newMessagesLabel?: string
}

/**
 * The scrolling list of messages. It follows the newest message as messages arrive or stream in,
 * unless the reader has scrolled up; then a button offers to jump back. Takes the remaining height
 * of a flex column (or give it one). It is a log: assistive tech reads out messages as they are added.
 */
function ChatMessageList({
  className,
  contentClassName,
  children,
  threshold = 48,
  jumpLabel = "Jump to latest",
  newMessagesLabel = "New messages",
  onScroll,
  ...props
}: ChatMessageListProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const following = React.useRef(true)
  const jumping = React.useRef(false)
  const lastHeight = React.useRef(0)
  const [away, setAway] = React.useState(false)
  const [unseen, setUnseen] = React.useState(false)

  const toBottom = React.useCallback((smooth = false) => {
    const el = viewportRef.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? "smooth" : "auto" })
  }, [])

  React.useLayoutEffect(() => {
    toBottom()
  }, [toBottom])

  React.useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return
    const onContent = new ResizeObserver(() => {
      const height = content.offsetHeight
      const grew = height > lastHeight.current + 1
      lastHeight.current = height
      if (following.current) toBottom()
      else if (grew) setUnseen(true)
    })
    const onViewport = new ResizeObserver(() => {
      if (following.current) toBottom()
    })
    // A message you send (side "end") always brings you back to the newest message.
    const onAdded = new MutationObserver((records) => {
      const mine = records.some((r) => [...r.addedNodes].some((n) => n instanceof HTMLElement && n.matches("[data-slot=chat-message][data-side=end]")))
      if (!mine) return
      following.current = true
      setAway(false)
      setUnseen(false)
      toBottom()
    })
    onContent.observe(content)
    onViewport.observe(viewport)
    onAdded.observe(content, { childList: true })
    return () => {
      onContent.disconnect()
      onViewport.disconnect()
      onAdded.disconnect()
    }
  }, [toBottom])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(e)
    const el = e.currentTarget
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
    if (jumping.current) {
      if (!atBottom) return
      jumping.current = false
    }
    following.current = atBottom
    setAway(!atBottom)
    if (atBottom) setUnseen(false)
  }

  // The reader took over (wheel, touch, keys): stop treating the scroll as our own jump.
  const interrupt = () => {
    jumping.current = false
  }

  const jump = () => {
    following.current = true
    jumping.current = true
    setAway(false)
    setUnseen(false)
    toBottom(true)
    window.setTimeout(() => {
      jumping.current = false
    }, 900)
  }

  return (
    <div data-slot="chat-message-list" className={cn("relative min-h-0 flex-1", className)}>
      <div
        ref={viewportRef}
        role="log"
        aria-label="Messages"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
        className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
        {...props}
        onScroll={handleScroll}
        onWheel={interrupt}
        onTouchStart={interrupt}
        onPointerDown={interrupt}
        onKeyDown={interrupt}
      >
        <div
          ref={contentRef}
          data-slot="chat-message-list-content"
          className={cn("flex min-h-full flex-col justify-end gap-4 p-4", contentClassName)}
        >
          {children}
        </div>
      </div>
      {away ? (
        <Button
          type="button"
          size="sm"
          variant={unseen ? "default" : "secondary"}
          onClick={jump}
          data-slot="chat-jump"
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border-border px-3 shadow-md"
        >
          <ArrowDown aria-hidden="true" />
          {unseen ? newMessagesLabel : jumpLabel}
        </Button>
      ) : null}
    </div>
  )
}

/** A centered label between messages: a day ("Today"), or an event ("Maya joined the chat"). */
function ChatSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-separator"
      className={cn(
        "flex items-center gap-3 py-1 text-center text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------------------------
// One message

type ChatMessageProps = React.ComponentProps<"div"> & {
  /** "start" for the other person, "end" for you. */
  side?: ChatSide
  /** Follows a message from the same sender: tighter spacing, no avatar or header shown. */
  grouped?: boolean
  /** Set while the text is still streaming in, so assistive tech waits for the whole message. */
  streaming?: boolean
  /** The delivery status, for styling the bubble while sending or after a failure. */
  status?: ChatMessageStatusValue
}

function ChatMessage({ className, side = "start", grouped = false, streaming, status, ...props }: ChatMessageProps) {
  return (
    <div
      data-slot="chat-message"
      data-side={side}
      data-grouped={grouped || undefined}
      data-status={status}
      aria-busy={streaming || undefined}
      className={cn("group/chat-message flex w-full items-start gap-2.5", side === "end" && "flex-row-reverse", grouped && "-mt-3", className)}
      {...props}
    />
  )
}

type ChatMessageAvatarProps = Omit<React.ComponentProps<typeof Avatar>, "children"> & {
  src?: string
  /** Initials or an icon, shown until the image loads (or instead of it). */
  fallback: React.ReactNode
  /** Adds a dot for "online now". */
  online?: boolean
}

/** The sender's picture. Hidden (but still taking its space) on grouped messages. */
function ChatMessageAvatar({ className, src, fallback, online, ...props }: ChatMessageAvatarProps) {
  return (
    <Avatar aria-hidden="true" className={cn("group-data-[grouped=true]/chat-message:invisible", className)} {...props}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="text-xs font-medium [&_svg]:size-4">{fallback}</AvatarFallback>
      {online ? <AvatarBadge /> : null}
    </Avatar>
  )
}

/** The column of header, bubbles, attachments and status. Lines up with the sender's side. */
function ChatMessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-content"
      className={cn(
        "flex max-w-[min(80%,36rem)] min-w-0 flex-col items-start gap-1 group-data-[side=end]/chat-message:items-end",
        className,
      )}
      {...props}
    />
  )
}

/** Name and time above the first message of a run. On grouped messages it stays for screen readers only. */
function ChatMessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-header"
      className={cn(
        "flex items-baseline gap-2 px-1 text-xs leading-5 group-data-[grouped=true]/chat-message:sr-only group-data-[side=end]/chat-message:flex-row-reverse",
        className,
      )}
      {...props}
    />
  )
}

function ChatMessageName({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="chat-message-name" className={cn("font-medium text-foreground", className)} {...props} />
}

function ChatMessageTime({ className, ...props }: React.ComponentProps<"time">) {
  return <time data-slot="chat-message-time" className={cn("text-muted-foreground tabular-nums", className)} {...props} />
}

type ChatBubbleProps = React.ComponentProps<"div"> & {
  /** "default" is a filled bubble; "ghost" is plain text for long, rich answers (lists, code). */
  variant?: "default" | "ghost"
}

/** The message text. Muted for the other person, the primary color for you. */
function ChatBubble({ className, variant = "default", ...props }: ChatBubbleProps) {
  return (
    <div
      data-slot="chat-bubble"
      data-variant={variant}
      className={cn(
        "max-w-full min-w-0 text-sm leading-relaxed [overflow-wrap:anywhere]",
        variant === "default" &&
          "w-fit rounded-xl bg-muted px-3.5 py-2 whitespace-pre-wrap text-foreground group-data-[side=end]/chat-message:bg-primary group-data-[side=end]/chat-message:text-primary-foreground group-data-[status=failed]/chat-message:opacity-70 group-data-[status=sending]/chat-message:opacity-70 [&_a]:underline [&_a]:underline-offset-2",
        variant === "ghost" && "w-full text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
      {...props}
    />
  )
}

type ChatAttachmentProps = React.ComponentProps<"div"> & {
  name: string
  /** A line under the name: the size, the type, or both ("2.4 MB · PDF"). */
  detail?: React.ReactNode
  /** Replaces the file icon. */
  icon?: React.ReactNode
  /** Put a download link or button here. */
  action?: React.ReactNode
}

/** A file sent with a message: icon, name, size, and an optional action. */
function ChatAttachment({ className, name, detail, icon, action, ...props }: ChatAttachmentProps) {
  return (
    <div
      data-slot="chat-attachment"
      className={cn("flex w-64 max-w-full items-center gap-3 rounded-lg border bg-background p-2 pr-2.5 text-foreground", className)}
      {...props}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
        {icon ?? <FileText />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{name}</span>
        {detail ? <span className="block truncate text-xs text-muted-foreground">{detail}</span> : null}
      </span>
      {action}
    </div>
  )
}

/** An image sent with a message. Put an <img> inside, or any preview; `label` names it for screen readers. */
function ChatImage({ className, label, ...props }: React.ComponentProps<"div"> & { label: string }) {
  return (
    <div
      data-slot="chat-image"
      role="img"
      aria-label={label}
      className={cn("relative w-64 max-w-full overflow-hidden rounded-lg border bg-muted [&_img]:block [&_img]:size-full [&_img]:object-cover", className)}
      {...props}
    />
  )
}

/** Copy text and say so for two seconds. Returns [copied, copy]. */
function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        return false
      }
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), timeout)
      return true
    },
    [timeout],
  )
  return [copied, copy] as const
}

type ChatCodeBlockProps = React.ComponentProps<"div"> & {
  code: string
  /** Shown in the header, e.g. "TypeScript". */
  language?: string
  /** Shown instead of the language, e.g. "app/api/webhooks/route.ts". */
  filename?: string
}

/** Code in a message, with its language and a copy button. Scrolls sideways instead of wrapping. */
function ChatCodeBlock({ className, code, language, filename, ...props }: ChatCodeBlockProps) {
  const [copied, copy] = useCopyToClipboard()
  return (
    <div
      data-slot="chat-code-block"
      className={cn("w-full min-w-0 overflow-hidden rounded-lg border bg-card text-card-foreground", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/60 py-1 pr-1 pl-3">
        <span className="truncate text-xs text-muted-foreground">{filename ?? language ?? "Code"}</span>
        <Button type="button" variant="ghost" size="xs" onClick={() => copy(code)} aria-label={copied ? "Copied" : "Copy code"}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed whitespace-pre">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}

const STATUS: Record<ChatMessageStatusValue, { icon: typeof Check; label: string }> = {
  sending: { icon: Clock, label: "Sending" },
  sent: { icon: Check, label: "Sent" },
  delivered: { icon: CheckCheck, label: "Delivered" },
  read: { icon: CheckCheck, label: "Read" },
  failed: { icon: AlertCircle, label: "Not sent" },
}

type ChatMessageStatusProps = React.ComponentProps<"div"> & {
  status: ChatMessageStatusValue
  /** Shown after the label, e.g. "Read 10:42". */
  time?: string
  /** Offers a retry button when the status is "failed". */
  onRetry?: () => void
}

/** Sending, sent, delivered, read, or not sent with a retry. Goes under your last message. */
function ChatMessageStatus({ className, status, time, onRetry, ...props }: ChatMessageStatusProps) {
  const { icon: Icon, label } = STATUS[status]
  return (
    <div
      data-slot="chat-message-status"
      data-status={status}
      className={cn("flex items-center gap-1 px-1 text-xs text-muted-foreground data-[status=failed]:text-destructive", className)}
      {...props}
    >
      <Icon aria-hidden="true" className={cn("size-3.5 shrink-0", status === "read" && "text-primary")} />
      {status === "failed" ? (
        <span role="alert">{label}</span>
      ) : (
        <span>
          {label}
          {time ? <span className="tabular-nums"> {time}</span> : null}
        </span>
      )}
      {status === "failed" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 inline-flex items-center gap-1 rounded-md px-1 font-medium underline-offset-2 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <RotateCw aria-hidden="true" className="size-3" />
          Retry
        </button>
      ) : null}
    </div>
  )
}

/** Buttons under a message: copy, regenerate, feedback. */
function ChatMessageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-actions"
      role="group"
      aria-label="Message actions"
      className={cn("flex flex-wrap items-center gap-0.5 text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Three pulsing dots in a bubble. `name` makes the screen-reader text "Maya is typing". */
function ChatTypingIndicator({ className, name, label, ...props }: React.ComponentProps<"div"> & { name?: string; label?: string }) {
  return (
    <div
      data-slot="chat-typing-indicator"
      role="status"
      className={cn("inline-flex h-9 w-fit items-center gap-1 rounded-xl bg-muted px-3.5", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-duration:1.1s] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <span className="sr-only">{label ?? (name ? `${name} is typing` : "Typing")}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Quick replies

function ChatSuggestions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chat-suggestions" role="group" aria-label="Suggestions" className={cn("flex flex-wrap gap-2", className)} {...props} />
}

function ChatSuggestion({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="chat-suggestion"
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-left text-sm text-foreground transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------------------------
// The composer

type ChatInputContextValue = {
  value: string
  setValue: (value: string) => void
  submit: () => void
  ready: boolean
  busy: boolean
  disabled: boolean
  onStop?: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const ChatInputContext = React.createContext<ChatInputContextValue | null>(null)

/** The composer's state, for parts you build yourself inside a ChatInput. */
function useChatInput() {
  const ctx = React.useContext(ChatInputContext)
  if (!ctx) throw new Error("useChatInput must be used inside <ChatInput>")
  return ctx
}

type ChatInputProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  value: string
  onValueChange: (value: string) => void
  /** Called by Enter or the send button, only when there is something to send and nothing is in flight. */
  onSubmit: (value: string) => void
  /** A message is sending or an answer is coming in: sending is paused, the button shows progress or Stop. */
  busy?: boolean
  /** With busy, the send button becomes a Stop button that calls this. */
  onStop?: () => void
  /** The whole composer is off, e.g. the conversation is closed. */
  disabled?: boolean
  /** Whether there is something to send. Defaults to "the text is not blank"; pass true when files are attached. */
  canSubmit?: boolean
  /** A ref to the textarea, to focus it from outside (after picking a suggestion, say). */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

/** The box around the textarea, attachments and toolbar. A form: Enter or the send button submits it. */
function ChatInput({ className, value, onValueChange, onSubmit, busy = false, onStop, disabled = false, canSubmit, inputRef, children, ...props }: ChatInputProps) {
  const ownRef = React.useRef<HTMLTextAreaElement>(null)
  const textareaRef = inputRef ?? ownRef
  const ready = (canSubmit ?? value.trim().length > 0) && !busy && !disabled
  const submit = () => {
    if (ready) onSubmit(value)
  }
  return (
    <ChatInputContext.Provider value={{ value, setValue: onValueChange, submit, ready, busy, disabled, onStop, textareaRef }}>
      <form
        data-slot="chat-input"
        data-busy={busy || undefined}
        data-disabled={disabled || undefined}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={cn(
          "flex flex-col gap-1 rounded-xl border border-input bg-background p-1.5 text-foreground shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {children}
      </form>
    </ChatInputContext.Provider>
  )
}

/** Grows with its text up to `max-h-48`, then scrolls. Enter sends, Shift+Enter adds a line. */
function ChatInputTextarea({ className, onKeyDown, onChange, rows = 1, ...props }: React.ComponentProps<"textarea">) {
  const { value, setValue, submit, disabled, textareaRef } = useChatInput()
  React.useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value, textareaRef])
  return (
    <textarea
      ref={textareaRef}
      data-slot="chat-input-textarea"
      rows={rows}
      value={value}
      disabled={disabled}
      onChange={(e) => {
        setValue(e.target.value)
        onChange?.(e)
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        // Enter while an input method is composing (Chinese, Japanese) picks a candidate, not send.
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
          e.preventDefault()
          submit()
        }
      }}
      className={cn(
        "max-h-48 min-h-10 w-full resize-none bg-transparent px-2.5 py-2 text-base leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

/** The row under the textarea: attach, pickers, then the send button (put a `ml-auto` before it). */
function ChatInputToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chat-input-toolbar" className={cn("flex items-center gap-1", className)} {...props} />
}

/** Opens the file picker; hands back the picked files. */
function ChatInputAttach({
  className,
  onFiles,
  accept,
  multiple = true,
  label = "Attach files",
  children,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & { onFiles: (files: File[]) => void; accept?: string; multiple?: boolean; label?: string }) {
  const ctx = React.useContext(ChatInputContext)
  const fileRef = React.useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        disabled={disabled ?? ctx?.disabled}
        onClick={() => fileRef.current?.click()}
        className={cn("text-muted-foreground", className)}
        {...props}
      >
        {children ?? <Paperclip aria-hidden="true" />}
      </Button>
      <input
        ref={fileRef}
        type="file"
        hidden
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        data-slot="chat-input-file"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ""
          if (files.length) onFiles(files)
        }}
      />
    </>
  )
}

/** Send while idle; a spinner while busy; Stop while busy if the ChatInput has onStop. */
function ChatInputSubmit({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "type">) {
  const { ready, busy, disabled, onStop } = useChatInput()
  if (busy && onStop)
    return (
      <Button type="button" size="icon" onClick={onStop} aria-label="Stop" data-slot="chat-input-submit" className={cn("rounded-full", className)} {...props}>
        <Square aria-hidden="true" className="size-3 fill-current" />
      </Button>
    )
  return (
    <Button
      type="submit"
      size="icon"
      disabled={!ready || disabled}
      aria-label={busy ? "Sending" : "Send message"}
      data-slot="chat-input-submit"
      className={cn("rounded-full", className)}
      {...props}
    >
      {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <ArrowUp aria-hidden="true" />}
    </Button>
  )
}

/** The files waiting in the composer. */
function ChatInputAttachments({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="chat-input-attachments" aria-label="Attachments" className={cn("flex flex-wrap gap-2 p-1", className)} {...props} />
}

type ChatInputAttachmentProps = React.ComponentProps<"li"> & {
  name: string
  /** The size or type, shown under the name. */
  detail?: React.ReactNode
  /** An image preview (an <img>, say). Turns the chip into a square thumbnail. */
  preview?: React.ReactNode
  /** Upload progress, 0 to 100. Below 100 it shows a bar. */
  progress?: number
  /** Why the file can't be sent, e.g. "Larger than 20 MB". */
  error?: string
  onRemove?: () => void
}

/** A file or image waiting to be sent, with upload progress, an error, and a remove button. */
function ChatInputAttachment({ className, name, detail, preview, progress, error, onRemove, ...props }: ChatInputAttachmentProps) {
  const uploading = progress !== undefined && progress < 100 && !error
  const remove = onRemove ? (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${name}`}
      className="absolute -top-1.5 -right-1.5 z-10 flex size-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <X aria-hidden="true" className="size-3" />
    </button>
  ) : null
  const bar = uploading ? (
    <span className="absolute inset-x-1.5 bottom-1 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
      <span className="block h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
    </span>
  ) : null
  const status = error ?? (uploading ? `Uploading, ${progress}%` : null)

  if (preview)
    return (
      <li
        data-slot="chat-input-attachment"
        data-error={error ? true : undefined}
        title={error ? `${name}: ${error}` : name}
        className={cn("relative size-16 shrink-0 rounded-lg border bg-muted", error && "border-destructive", className)}
        {...props}
      >
        <span className={cn("block size-full overflow-hidden rounded-[inherit] [&_img]:size-full [&_img]:object-cover", (uploading || error) && "opacity-60")}>
          {preview}
        </span>
        <span className="sr-only">
          {name}
          {status ? `, ${status}` : ""}
        </span>
        {error ? (
          <span className="absolute inset-x-0 bottom-0 truncate rounded-b-lg bg-background/90 px-1 text-center text-[10px] font-medium text-destructive" aria-hidden="true">
            {error}
          </span>
        ) : null}
        {bar}
        {remove}
      </li>
    )

  return (
    <li
      data-slot="chat-input-attachment"
      data-error={error ? true : undefined}
      className={cn("relative flex h-16 w-56 max-w-full items-center gap-2.5 rounded-lg border bg-card p-2 pr-3 text-sm", error && "border-destructive", className)}
      {...props}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
        {error ? <AlertCircle aria-hidden="true" className="text-destructive" /> : <FileText aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{name}</span>
        <span className={cn("block truncate text-xs text-muted-foreground", error && "text-destructive")}>{status ?? detail}</span>
      </span>
      {bar}
      {remove}
    </li>
  )
}

/** "1.4 MB", "820 KB": a file size for attachment chips. */
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export {
  Chat,
  ChatAttachment,
  ChatBubble,
  ChatCodeBlock,
  ChatImage,
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
  ChatMessageStatus,
  ChatMessageTime,
  ChatSeparator,
  ChatSuggestion,
  ChatSuggestions,
  ChatTypingIndicator,
  formatFileSize,
  useChatInput,
  useCopyToClipboard,
}
export type { ChatMessageStatusValue, ChatSide }
