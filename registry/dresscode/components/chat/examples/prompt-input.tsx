"use client"

// A rich prompt composer on its own: files and images (pick, drop or paste them) with upload progress,
// errors and remove, a mode toggle that changes the placeholder, voice input, a character count with a
// limit, and send that turns into Stop while the answer is being written.
import { ChartLine, Loader2, MessageSquare, Mic, PenLine, Plus, Square, Upload } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChatInput,
  ChatInputAttach,
  ChatInputAttachment,
  ChatInputAttachments,
  ChatInputSubmit,
  ChatInputTextarea,
  ChatInputToolbar,
  formatFileSize,
} from "@/registry/dresscode/components/chat/ui/chat"

type Pending = { id: string; name: string; size: number; kind: "image" | "file"; src?: string; sample?: boolean; progress: number; error?: string }
type Sent = { text: string; mode: string; files: number; state: "sending" | "answering" | "done" | "stopped"; seconds?: number }

const LIMIT = 2000
const MAX_FILES = 6
const MAX_BYTES = 20 * 1024 * 1024
const ACCEPT = "image/*,.pdf,.csv,.xlsx,.docx,.txt"

const MODES = [
  { value: "ask", label: "Ask", icon: MessageSquare, placeholder: "Ask about an invoice, a client or a payment…" },
  { value: "draft", label: "Draft", icon: PenLine, placeholder: "Describe the email, note or invoice to write…" },
  { value: "analyse", label: "Analyse", icon: ChartLine, placeholder: "What should Orbit look into in your numbers?" },
]

const TRANSCRIPTS = [
  "Remind Kato and Lee that INV-1041 is due on Friday, and keep it friendly.",
  "How much did Pellucid Health pay us this quarter?",
  "Draft a thank-you note for Harlow Books for paying early.",
]

const INITIAL_FILES: Pending[] = [
  { id: "f1", name: "october-payouts.csv", size: 48_200, kind: "file", progress: 100, sample: true },
  { id: "f2", name: "receipt-scan.jpg", size: 1_240_000, kind: "image", progress: 100, sample: true },
]

/** A drawn receipt, standing in for a photo in the sample attachment. */
function ReceiptThumb() {
  return (
    <span className="flex size-full flex-col gap-1 bg-background p-2">
      <span className="h-1.5 w-8 rounded-full bg-foreground/70" />
      <span className="h-1 w-10 rounded-full bg-muted-foreground/40" />
      <span className="h-1 w-7 rounded-full bg-muted-foreground/40" />
      <span className="h-1 w-9 rounded-full bg-muted-foreground/40" />
      <span className="mt-auto h-1.5 w-6 self-end rounded-full bg-primary" />
    </span>
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

function Hint({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function ChatPromptInput() {
  const [text, setText] = useState("Compare the October payouts with the invoices marked paid, and list anything that doesn't match.")
  const [files, setFiles] = useState<Pending[]>(INITIAL_FILES)
  const [mode, setMode] = useState("analyse")
  const [voice, setVoice] = useState<"idle" | "listening" | "transcribing">("idle")
  const [seconds, setSeconds] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState("")
  const [sent, setSent] = useState<Sent | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const idRef = useRef(10)
  const spoken = useRef(0)
  const urls = useRef(new Set<string>())
  const voiceTimer = useRef<number | undefined>(undefined)
  const answerRun = useRef(0)
  const later = useTimers()
  const countId = useId()

  useEffect(() => {
    const set = urls.current
    return () => {
      set.forEach((u) => URL.revokeObjectURL(u))
      window.clearInterval(voiceTimer.current)
    }
  }, [])

  const current = MODES.find((m) => m.value === mode) ?? MODES[0]
  const count = text.length
  const over = count - LIMIT
  const uploading = files.some((f) => f.progress < 100 && !f.error)
  const broken = files.some((f) => f.error)
  const busy = sent?.state === "sending" || sent?.state === "answering"
  const canSend = (text.trim().length > 0 || files.length > 0) && over <= 0 && !uploading && !broken && voice === "idle"
  const blocker = over > 0
    ? `Shorten your message by ${over.toLocaleString("en-US")} ${over === 1 ? "character" : "characters"}.`
    : broken
      ? "Remove the files that can't be sent."
      : uploading
        ? "Waiting for uploads to finish…"
        : ""

  const addFiles = (picked: File[]) => {
    const room = MAX_FILES - files.length
    if (room <= 0) return setNotice(`You can attach up to ${MAX_FILES} files.`)
    setNotice(picked.length > room ? `Only the first ${room} ${room === 1 ? "file was" : "files were"} added. The limit is ${MAX_FILES}.` : "")
    const added = picked.slice(0, room).map((f): Pending => {
      const image = f.type.startsWith("image/")
      const ok = image || /\.(pdf|csv|xlsx|docx|txt)$/i.test(f.name)
      const src = image ? URL.createObjectURL(f) : undefined
      if (src) urls.current.add(src)
      return {
        id: `f${idRef.current++}`,
        name: f.name,
        size: f.size,
        kind: image ? "image" : "file",
        src,
        progress: 0,
        error: !ok ? "This file type isn't supported" : f.size > MAX_BYTES ? "Larger than 20 MB" : undefined,
      }
    })
    setFiles((fs) => [...fs, ...added])
    // Fake the upload: a few steps to 100%.
    for (const a of added.filter((x) => !x.error))
      for (let step = 1; step <= 5; step++) later(() => setFiles((fs) => fs.map((f) => (f.id === a.id ? { ...f, progress: step * 20 } : f))), step * 260 + Math.random() * 120)
  }

  const remove = (id: string) => {
    const f = files.find((x) => x.id === id)
    if (f?.src) {
      URL.revokeObjectURL(f.src)
      urls.current.delete(f.src)
    }
    setFiles((fs) => fs.filter((x) => x.id !== id))
    setNotice("")
    inputRef.current?.focus()
  }

  const startVoice = () => {
    setVoice("listening")
    setSeconds(0)
    window.clearInterval(voiceTimer.current)
    voiceTimer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
  }
  const stopVoice = () => {
    window.clearInterval(voiceTimer.current)
    setVoice("transcribing")
    later(() => {
      const said = TRANSCRIPTS[spoken.current++ % TRANSCRIPTS.length]
      setText((t) => (t.trim() ? `${t.trimEnd()} ${said}` : said))
      setVoice("idle")
      inputRef.current?.focus()
    }, 900)
  }

  const send = () => {
    const run = ++answerRun.current
    const started = Date.now()
    setSent({ text: text.trim(), mode: current.label, files: files.length, state: "sending" })
    setText("")
    setFiles([])
    setNotice("")
    later(() => {
      if (answerRun.current === run) setSent((s) => (s ? { ...s, state: "answering" } : s))
    }, 500)
    later(() => {
      if (answerRun.current !== run) return
      setSent((s) => (s ? { ...s, state: "done", seconds: Math.round((Date.now() - started) / 100) / 10 } : s))
    }, 4200)
  }

  const stop = () => {
    answerRun.current++
    setSent((s) => (s ? { ...s, state: "stopped" } : s))
    inputRef.current?.focus()
  }

  const editLast = () => {
    if (!sent) return
    setText(sent.text)
    setSent(null)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      {sent ? (
        <div className="flex items-start gap-3 rounded-xl border bg-card p-3 text-sm text-card-foreground">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <current.icon aria-hidden="true" className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2">{sent.text || `${sent.files} ${sent.files === 1 ? "file" : "files"}`}</p>
            <p role="status" className="mt-0.5 text-xs text-muted-foreground">
              {sent.mode}
              {sent.files ? ` · ${sent.files} ${sent.files === 1 ? "file" : "files"}` : ""} ·{" "}
              {sent.state === "sending"
                ? "Sending…"
                : sent.state === "answering"
                  ? "Orbit assistant is writing an answer…"
                  : sent.state === "stopped"
                    ? "You stopped the answer."
                    : `Answered in ${sent.seconds} s`}
            </p>
          </div>
          {!busy ? (
            <Button type="button" variant="ghost" size="sm" onClick={editLast}>
              Edit
            </Button>
          ) : null}
        </div>
      ) : null}

      <ChatInput
        value={text}
        onValueChange={setText}
        onSubmit={send}
        busy={busy}
        onStop={stop}
        canSubmit={canSend}
        inputRef={inputRef}
        className="relative gap-0 rounded-xl p-2 shadow-sm"
        aria-label="Prompt"
        onDragEnter={(e) => {
          if (e.dataTransfer.types.includes("Files")) setDragging(true)
        }}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("Files")) return
          e.preventDefault()
          e.dataTransfer.dropEffect = "copy"
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(Array.from(e.dataTransfer.files))
        }}
      >
        {dragging ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-[inherit] border-2 border-dashed border-primary bg-background/95 text-sm font-medium">
            <Upload aria-hidden="true" className="size-5 text-primary" />
            Drop files to attach
          </div>
        ) : null}

        {files.length ? (
          <ChatInputAttachments className="px-1 pt-1 pb-0">
            {files.map((f) => (
              <ChatInputAttachment
                key={f.id}
                name={f.name}
                detail={`${formatFileSize(f.size)} · ${f.name.split(".").pop()?.toUpperCase()}`}
                progress={f.progress}
                error={f.error}
                preview={
                  f.kind === "image" && !f.error ? (
                    f.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.src} alt="" />
                    ) : (
                      <ReceiptThumb />
                    )
                  ) : undefined
                }
                onRemove={() => remove(f.id)}
              />
            ))}
          </ChatInputAttachments>
        ) : null}

        <ChatInputTextarea
          aria-label={`Prompt, ${current.label} mode`}
          aria-describedby={countId}
          placeholder={current.placeholder}
          className="min-h-16 px-2 pt-2.5"
          onPaste={(e) => {
            const pasted = Array.from(e.clipboardData.files)
            if (pasted.length) {
              e.preventDefault()
              addFiles(pasted)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && busy) {
              e.preventDefault()
              stop()
            }
          }}
        />

        <ChatInputToolbar className="flex-wrap gap-1.5 pt-1">
          <ChatInputAttach label="Attach files or images" accept={ACCEPT} onFiles={addFiles} variant="outline" size="icon-sm" className="rounded-full text-foreground">
            <Plus aria-hidden="true" />
          </ChatInputAttach>
          <ToggleGroup
            aria-label="Mode"
            size="sm"
            spacing={0}
            variant="outline"
            value={[mode]}
            onValueChange={(v) => {
              if (v[0]) setMode(String(v[0]))
            }}
          >
            {MODES.map((m) => (
              <ToggleGroupItem key={m.value} value={m.value} aria-label={m.label} className="aria-pressed:bg-primary/10 aria-pressed:text-primary">
                <m.icon aria-hidden="true" />
                <span className="max-sm:sr-only">{m.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <span className="ml-auto flex items-center gap-2">
            {voice !== "idle" ? (
              <span role="status" className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                {voice === "listening" ? (
                  <>
                    <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-destructive motion-reduce:animate-none" />
                    Listening 0:{String(seconds).padStart(2, "0")}
                  </>
                ) : (
                  <>
                    <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                    Transcribing…
                  </>
                )}
              </span>
            ) : (
              <span id={countId} className={`text-xs tabular-nums ${over > 0 ? "font-medium text-destructive" : count > LIMIT * 0.9 ? "text-foreground" : "text-muted-foreground"}`}>
                {count.toLocaleString("en-US")} / {LIMIT.toLocaleString("en-US")}
                <span className="sr-only"> characters</span>
              </span>
            )}
            <Hint label={voice === "listening" ? "Stop and transcribe" : "Voice input"}>
              <Button
                type="button"
                variant={voice === "listening" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label={voice === "listening" ? "Stop voice input" : "Voice input"}
                aria-pressed={voice === "listening"}
                disabled={voice === "transcribing" || busy}
                onClick={voice === "listening" ? stopVoice : startVoice}
                className="rounded-full"
              >
                {voice === "listening" ? <Square aria-hidden="true" className="size-3 fill-current" /> : <Mic aria-hidden="true" />}
              </Button>
            </Hint>
            <ChatInputSubmit size="icon-sm" />
          </span>
        </ChatInputToolbar>
      </ChatInput>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
        <p role="status" className={blocker || notice ? "text-destructive" : undefined}>
          {blocker || notice || (busy ? "Press Esc to stop." : "Drop or paste files to attach them. Up to 6, 20 MB each.")}
        </p>
        <p className="hidden items-center gap-1 sm:flex">
          <Kbd>Enter</Kbd> to send, <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for a new line
        </p>
      </div>
    </div>
  )
}
