"use client"

// Folio restyle of shadcn/ui's input-otp: separate ruled boxes (not one joined strip), Newsreader digits, the box
// you are typing in gets an ink border. aria-invalid on <InputOTP> turns every box press red (a wrong code).
// Same API as the stock component. Size the boxes with className on InputOTPSlot (e.g. "h-[80px] flex-1").
import * as React from "react"
import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("cn-input-otp group/otp flex items-center has-disabled:opacity-50", containerClassName)}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-[12px]", className)} {...props} />
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={char ? "" : undefined}
      className={cn(
        "relative flex h-[56px] w-[48px] items-center justify-center rounded-(--radius) border border-input bg-background font-serif text-[28px] leading-none text-foreground tabular-nums transition-colors",
        "group-hover/otp:border-ink-2 data-[active=true]:z-10 data-[active=true]:border-2 data-[active=true]:border-foreground data-[active=true]:ring-2 data-[active=true]:ring-ring/15",
        "group-has-aria-invalid/otp:border-destructive group-has-aria-invalid/otp:bg-press-tint/45",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[45%] w-[1.5px] animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" className={cn("flex items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-[16px]", className)} role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
