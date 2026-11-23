"use client"

// Folio restyle of shadcn/ui's sonner toaster: a ruled paper slip with the theme's corner, ink text, a small icon
// (success = the status green, error = press red), and an ink action link. Folio is light only, so no theme hook.
// Mount <Toaster /> once (DashboardShell does) and call toast("Saved") / toast.success(…) / toast.error(…).
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-[17px] text-success" />,
        info: <InfoIcon className="size-[17px] text-info" />,
        warning: <TriangleAlertIcon className="size-[17px] text-warning" />,
        error: <OctagonXIcon className="size-[17px] text-press" />,
        loading: <Loader2Icon className="size-[17px] animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-paper)",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-divider)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans !text-[14.5px] !shadow-md !shadow-shade/10",
          title: "!font-semibold",
          description: "!text-ink-2",
          actionButton: "!rounded-(--radius) !bg-ink !text-paper !font-semibold",
          cancelButton: "!rounded-(--radius) !bg-secondary !text-ink",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
