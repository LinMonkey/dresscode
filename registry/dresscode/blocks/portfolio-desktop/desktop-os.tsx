"use client"

// The Desktop style's computer: a menu bar, icons on the right, windows you can drag, stack, shrink
// into the dock and close, a dock, and a note stuck to the wallpaper. On a phone (under 1024px) the
// same pieces become a home screen: the icons are apps, and an app opens full screen.
// Positions and sizes are percentages of the desktop, so the layout holds at any window size and the
// server can draw the first frame exactly as the visitor will see it.
import { Clock, FileText, FileUser, Folder, Image as ImageIcon, Mail, Minus, SquareTerminal, StickyNote, Trash2, X, ChevronLeft, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { LocalTime, ModeToggle, useReducedMotion } from "../portfolio/ui"

/** Icons by name: the server passes names, since components cannot cross into the client. */
const ICONS: Record<string, LucideIcon> = {
  folder: Folder,
  file: FileText,
  about: FileUser,
  photos: ImageIcon,
  notes: StickyNote,
  mail: Mail,
  trash: Trash2,
  terminal: SquareTerminal,
  clock: Clock,
}
export type IconName = "folder" | "file" | "about" | "photos" | "notes" | "mail" | "trash" | "terminal" | "clock"

export type Win = {
  id: string
  title: string
  icon: IconName
  content: ReactNode
  /** Left, top, width, height in % of the desktop. */
  box: [number, number, number, number]
  /** Open when the page loads. */
  open?: boolean
  /** Scrolls inside (long pages); short windows size to their content. */
  scroll?: boolean
}

export type Launcher = {
  label: string
  icon: IconName
  open?: string
  href?: string
}

type Props = {
  base: string
  name: string
  initials: string
  city: string
  windows: Win[]
  /** The window the page is about (an inner page), in front. Closing it goes back to the desktop. */
  front?: string
  icons: Launcher[]
  dock: Launcher[]
  menu: Launcher[]
  note?: string
  /** The phone's home-screen card. */
  widget: ReactNode
}

const today = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
})

export function DesktopOS({ base, name, initials, city, windows, front, icons, dock, menu, note, widget }: Props) {
  const router = useRouter()
  const reduced = useReducedMotion()
  const desk = useRef<HTMLDivElement>(null)
  const [boxes, setBoxes] = useState<Record<string, [number, number, number, number]>>(() => Object.fromEntries(windows.map((w) => [w.id, w.box])))
  // Open windows, back to front. Running = open or in the dock.
  const [order, setOrder] = useState<string[]>(() => windows.filter((w) => w.open).map((w) => w.id))
  const [running, setRunning] = useState<string[]>(() => windows.filter((w) => w.open).map((w) => w.id))
  // On a phone, the one app on screen.
  const [app, setApp] = useState<string | null>(front ?? null)
  const [selected, setSelected] = useState<string | null>(null)
  const [date, setDate] = useState("")
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const touch = useRef(false)

  useEffect(() => {
    const id = window.setTimeout(() => setDate(today.format(new Date())), 0)
    return () => window.clearTimeout(id)
  }, [])

  const focus = useCallback((id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]), [])
  const open = useCallback((id: string) => {
    setOrder((o) => [...o.filter((x) => x !== id), id])
    setRunning((r) => (r.includes(id) ? r : [...r, id]))
    setApp(id)
  }, [])
  const minimize = (id: string) => setOrder((o) => o.filter((x) => x !== id))
  const close = (id: string) => {
    if (id === front) return router.push(base)
    setOrder((o) => o.filter((x) => x !== id))
    setRunning((r) => r.filter((x) => x !== id))
    setApp(null)
  }
  const launch = (l: Launcher) => {
    if (l.href) router.push(l.href)
    else if (l.open) open(l.open)
  }

  const onDragStart = (id: string, e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !desk.current || !window.matchMedia("(min-width: 1024px)").matches) return
    if ((e.target as HTMLElement).closest("button,a")) return
    const r = desk.current.getBoundingClientRect()
    const [x, y] = boxes[id]
    drag.current = {
      id,
      dx: e.clientX - (r.left + (x / 100) * r.width),
      dy: e.clientY - (r.top + (y / 100) * r.height),
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    focus(id)
  }
  const onDragMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || !desk.current) return
    const r = desk.current.getBoundingClientRect()
    const [, , w] = boxes[d.id]
    const x = Math.min(100 - 8, Math.max(-w + 12, ((e.clientX - d.dx - r.left) / r.width) * 100))
    const y = Math.min(92, Math.max(0, ((e.clientY - d.dy - r.top) / r.height) * 100))
    setBoxes((b) => ({ ...b, [d.id]: [x, y, b[d.id][2], b[d.id][3]] }))
  }
  const onDragEnd = () => {
    drag.current = null
  }

  const Desk = front ? "div" : "main"
  const iconKey = (l: Launcher, e: KeyboardEvent) => {
    if (e.key === "Enter") launch(l)
  }

  return (
    <div className="dk-root relative flex h-dvh flex-col overflow-hidden">
      {/* Menu bar (the status bar on a phone) */}
      <div className="dk-chrome relative z-30 flex h-11 shrink-0 items-center gap-3 border-b border-border bg-card px-3 text-[15px] sm:gap-5 sm:px-4">
        <Link href={base} className="flex items-center gap-2.5 font-semibold">
          <span className="grid h-7 min-w-7 place-items-center rounded-md bg-primary px-1.5 text-[12px] font-bold text-primary-foreground">{initials}</span>
          <span className="max-sm:hidden">{name}</span>
        </Link>
        <span className="h-5 w-px bg-border max-lg:hidden" aria-hidden="true" />
        <nav aria-label="Main" className="flex items-center gap-4 max-lg:hidden">
          {menu.map((m) => (
            <button key={m.label} type="button" onClick={() => launch(m)} className="cursor-pointer rounded px-1 py-0.5 hover:bg-muted">
              {m.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="dc-num text-[14px] whitespace-nowrap">
            <span className="max-sm:hidden">{date} </span>
            <LocalTime /> <span className="max-sm:hidden">{city}</span>
          </span>
          <ModeToggle className="size-8" />
        </div>
      </div>

      {/* The desktop */}
      <Desk ref={desk} id={front ? undefined : "main"} className="dk-desk dc-band relative flex-1 overflow-hidden">
        <div className="dk-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Phone: the home-screen card */}
        <div className="dk-chrome relative z-0 mx-4 mt-5 lg:hidden">{widget}</div>

        {/* Icons: a column on the right of the desktop, a grid on a phone */}
        <ul aria-label="Desktop" className="dk-chrome relative z-0 mx-2 mt-5 grid grid-cols-4 gap-y-4 lg:absolute lg:top-5 lg:right-3 lg:m-0 lg:grid-cols-1 lg:gap-y-1">
          {icons.map((l) => {
            const Icon = ICONS[l.icon]
            const on = selected === l.label
            return (
              <li key={l.label}>
                <button
                  type="button"
                  onPointerDown={(e) => {
                    touch.current = e.pointerType !== "mouse"
                    setSelected(l.label)
                  }}
                  onClick={() => {
                    if (touch.current || !window.matchMedia("(min-width: 1024px)").matches) launch(l)
                  }}
                  onDoubleClick={() => launch(l)}
                  onKeyDown={(e) => iconKey(l, e)}
                  onBlur={() => setSelected((s) => (s === l.label ? null : s))}
                  aria-label={`Open ${l.label}`}
                  className="group mx-auto flex w-[84px] cursor-default flex-col items-center gap-1.5 rounded-lg p-1.5 text-center outline-none"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-card text-foreground shadow-[0_6px_18px_-8px_rgb(0_0_0/0.45)] transition-transform group-active:scale-95 lg:size-12 lg:bg-transparent lg:text-[color:var(--dc-band-fg)] lg:shadow-none">
                    <Icon className="size-7 lg:size-9 lg:stroke-[1.5]" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-px text-[13px] leading-tight font-medium text-[color:var(--dc-band-fg)] group-focus-visible:outline-2 group-focus-visible:outline-[color:var(--dc-band-fg)]",
                      on && "lg:bg-[color:var(--dc-highlight)] lg:text-[color:var(--dc-highlight-fg)]",
                    )}
                  >
                    {l.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* The note on the wallpaper (the home page only) */}
        {note ? (
          <p className="dk-chrome dk-note absolute bottom-8 left-8 z-0 w-[230px] -rotate-3 bg-[color:var(--dc-highlight)] px-5 py-4 text-[18px] leading-snug text-[color:var(--dc-highlight-fg)] shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)] max-lg:hidden">
            {note}
          </p>
        ) : null}

        {/* Windows */}
        {windows.map((w) => {
          const z = order.indexOf(w.id)
          const isOpen = z >= 0
          const [x, y, ww, hh] = boxes[w.id]
          const Icon = ICONS[w.icon]
          const top = z === order.length - 1
          const Body = w.id === front ? "main" : "div"
          return (
            <section
              key={w.id}
              aria-label={w.title}
              onPointerDown={() => isOpen && !top && focus(w.id)}
              className={cn(
                "dk-win dc-card flex flex-col overflow-hidden p-0",
                "max-lg:fixed max-lg:inset-0 max-lg:top-11 max-lg:z-40 max-lg:rounded-none max-lg:border-0",
                app === w.id ? "max-lg:flex" : "max-lg:hidden",
                "lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:z-[var(--z)] lg:w-[var(--w)] lg:max-h-[var(--h)]",
                w.scroll && "lg:h-[var(--h)]",
                isOpen ? "lg:flex" : "lg:hidden",
                top ? "dk-top" : "dk-behind",
                !reduced && "dk-pop",
              )}
              style={
                {
                  ["--x" as string]: `${x}%`,
                  ["--y" as string]: `${y}%`,
                  ["--w" as string]: `${ww}%`,
                  ["--h" as string]: `${hh}%`,
                  ["--z" as string]: 10 + Math.max(0, z),
                } as CSSProperties
              }
            >
              <header
                onPointerDown={(e) => onDragStart(w.id, e)}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
                className="flex h-11 shrink-0 touch-none items-center gap-2 border-b border-border bg-card px-3 select-none lg:cursor-grab lg:active:cursor-grabbing"
              >
                <button
                  type="button"
                  onClick={() => (w.id === front ? router.push(base) : setApp(null))}
                  className="flex items-center gap-1 text-[15px] font-medium text-[color:var(--dc-accent)] lg:hidden"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" /> Home
                </button>
                <Icon className="size-4 text-muted-foreground max-lg:hidden" aria-hidden="true" />
                <h2 className="truncate text-[15px] font-semibold max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">{w.title}</h2>
                <span className="ml-auto flex items-center gap-0.5 max-lg:hidden">
                  <button type="button" onClick={() => minimize(w.id)} aria-label={`Minimize ${w.title}`} className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-muted">
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => close(w.id)} aria-label={`Close ${w.title}`} className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-muted">
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </span>
              </header>
              <Body id={w.id === front ? "main" : undefined} className="dk-body min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background">
                {w.content}
              </Body>
            </section>
          )
        })}

        {/* Dock */}
        <nav
          aria-label="Dock"
          className={cn(
            "dk-chrome absolute inset-x-0 bottom-3 z-20 mx-auto flex",
            app && "max-lg:hidden",
            " w-fit items-end gap-2 rounded-[22px] border border-white/30 bg-card/75 p-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)] backdrop-blur-md sm:gap-2.5 sm:p-2.5",
          )}
        >
          {dock.map((l) => {
            const Icon = ICONS[l.icon]
            const live = l.open ? running.includes(l.open) : false
            return (
              <button
                key={l.label}
                type="button"
                onClick={() => launch(l)}
                aria-label={l.label}
                title={l.label}
                className="group relative grid size-12 cursor-pointer place-items-center rounded-[14px] border border-border bg-card text-[color:var(--dc-accent)] transition-transform duration-200 hover:-translate-y-1.5 sm:size-[52px]"
              >
                <Icon className="size-6" aria-hidden="true" />
                <span className={cn("absolute -bottom-2 size-1 rounded-full bg-foreground transition-opacity", live ? "opacity-100" : "opacity-0")} aria-hidden="true" />
              </button>
            )
          })}
        </nav>
      </Desk>
    </div>
  )
}

/** A tiny shell: a few commands that answer from the portfolio. */
export function Terminal({ lines, commands }: { lines: string[]; commands: Record<string, string | { go: string }> }) {
  const router = useRouter()
  const [out, setOut] = useState<string[]>(lines)
  const [value, setValue] = useState("")
  const end = useRef<HTMLDivElement>(null)
  // Keep the newest line in view, scrolling only the window (not the desktop behind it).
  useEffect(() => {
    const box = end.current?.closest<HTMLElement>(".dk-body")
    if (box) box.scrollTop = box.scrollHeight
  }, [out])
  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    if (cmd === "clear") return setOut([])
    const hit = commands[cmd]
    const reply = hit === undefined ? `command not found: ${cmd}. Try "help".` : typeof hit === "string" ? hit : `opening ${hit.go}…`
    setOut((o) => [...o, `$ ${raw}`, ...reply.split("\n")])
    if (hit && typeof hit !== "string") router.push(hit.go)
  }
  return (
    <div className="dc-num min-h-full bg-[color:var(--dc-ink)] p-4 text-[14px] leading-relaxed text-[color:var(--dc-page)]">
      {out.map((l, i) => (
        <p key={i} className={cn("break-words whitespace-pre-wrap", l.startsWith("$") && "opacity-70")}>
          {l}
        </p>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(value)
          setValue("")
        }}
        className="flex items-center gap-2"
      >
        <label htmlFor="dk-shell" className="shrink-0">
          $
        </label>
        <input
          id="dk-shell"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent caret-current outline-none"
          aria-label="Command"
        />
      </form>
      <div ref={end} />
    </div>
  )
}
