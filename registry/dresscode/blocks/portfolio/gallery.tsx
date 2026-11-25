"use client"

// A project's pictures as a gallery: columns that keep each picture's own shape, and a full-screen
// viewer (arrow keys, Esc, swipe-free buttons) when you open one.
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

import { PlateImage } from "./covers"
import type { Project } from "./data"

export function Gallery({ project }: { project: Project }) {
  const [open, setOpen] = useState<number | null>(null)
  const plates = project.plates
  return (
    <>
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {plates.map((plate, i) => (
          <li key={i} className="pf-rise mb-8 break-inside-avoid" style={{ animationDelay: `${80 + i * 60}ms` }}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full cursor-zoom-in text-left" aria-label={`Open picture ${i + 1}: ${plate.caption}`}>
              <span className="relative block overflow-hidden rounded-[var(--dc-radius-card)]" style={{ aspectRatio: plate.ratio }}>
                <span className="block size-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03]">
                  <PlateImage project={project} plate={plate} />
                </span>
                <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-2.5 flex gap-3 text-[13px] text-muted-foreground">
                <span className="dc-num">{String(i + 1).padStart(2, "0")}</span>
                {plate.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <Lightbox project={project} index={open} onIndex={setOpen} onClose={() => setOpen(null)} /> : null}
    </>
  )
}

function Lightbox({ project, index, onIndex, onClose }: { project: Project; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const plates = project.plates
  const plate = plates[index]
  const close = useRef<HTMLButtonElement>(null)
  const prev = (index + plates.length - 1) % plates.length
  const next = (index + 1) % plates.length

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    close.current?.focus({ preventScroll: true })
    const before = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = before
      opener?.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onIndex(prev)
      if (e.key === "ArrowRight") onIndex(next)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onIndex, prev, next])

  // The picture as large as the screen allows, in its own shape.
  const [w, h] = plate.ratio.split("/").map(Number)
  return (
    <div role="dialog" aria-modal="true" aria-label={`${project.title}, picture ${index + 1} of ${plates.length}`} className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-5 sm:px-8">
        <p className="dc-num text-[13px] text-muted-foreground">
          {project.title} · {String(index + 1).padStart(2, "0")} / {String(plates.length).padStart(2, "0")}
        </p>
        <Button ref={close} variant="outline" size="icon-lg" className="size-10" aria-label="Close" onClick={onClose}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="grid min-h-0 flex-1 place-items-center px-5 sm:px-20">
        <div key={index} className="pf-rise overflow-hidden rounded-[var(--dc-radius-card)]" style={{ aspectRatio: plate.ratio, width: `min(100%, calc((100svh - 11rem) * ${w / h}))` }}>
          <PlateImage project={project} plate={plate} />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <p className="max-w-[640px] text-[14px] text-muted-foreground" aria-live="polite">
          {plate.caption}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon-lg" className="size-10" aria-label="Previous picture" onClick={() => onIndex(prev)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon-lg" className="size-10" aria-label="Next picture" onClick={() => onIndex(next)}>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
