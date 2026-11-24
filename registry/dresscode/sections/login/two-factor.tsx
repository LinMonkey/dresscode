"use client"

// Login, two-step code: six digits in the shadcn InputOTP. The code is checked as soon as the sixth digit
// is in (or on Verify); a wrong one shows an error on the slots and clears them. Resend counts down
// before it can be used again, and a backup code can stand in for the phone. In this demo 123456 is the
// right code and any backup code shaped like 4f7k-29xq works; replace verify() with your own check.
import { ArrowRight, Check, KeyRound, LoaderCircle, ShieldCheck, Smartphone } from "lucide-react"
import { type FocusEvent, type FormEvent, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

const WAIT = 30
const BACKUP = /^[a-z0-9]{4}-?[a-z0-9]{4}$/i
const focus = "rounded-[2px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
// Leaving a field for a button in the same form (submit, the password toggle) skips the blur check: an
// error appearing above that button would move it out from under the click. Submit checks everything.
const toButton = (e: FocusEvent<HTMLInputElement>) => e.relatedTarget instanceof HTMLButtonElement && e.relatedTarget.form === e.currentTarget.form
const clock = (s: number) => `0:${String(s).padStart(2, "0")}`
const slot = "size-10 text-[18px] dc-num font-semibold sm:size-12 sm:text-[20px] bg-[color:var(--card)]"

export default function LoginTwoFactor() {
  const id = useId()
  const [mode, setMode] = useState<"code" | "backup">("code")
  const [code, setCode] = useState("")
  const [backup, setBackup] = useState("")
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(false)
  const [done, setDone] = useState(false)
  const [trust, setTrust] = useState(true)
  const [left, setLeft] = useState(WAIT)
  const [resent, setResent] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const otp = useRef<HTMLInputElement>(null)
  const backupInput = useRef<HTMLInputElement>(null)
  const doneTitle = useRef<HTMLHeadingElement>(null)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  useEffect(() => {
    if (done) doneTitle.current?.focus()
  }, [done])

  const verify = (value: string) => {
    setChecking(true)
    setError("")
    // Replace the timeout with your own check of the code.
    timer.current = setTimeout(() => {
      setChecking(false)
      const ok = mode === "backup" ? BACKUP.test(value.trim()) : value === "123456"
      if (ok) return setDone(true)
      if (mode === "code") {
        setError("That code didn't work. Check the newest text from Orbit and try again.")
        setCode("")
        requestAnimationFrame(() => otp.current?.focus())
      } else {
        setError("That backup code didn't work. Each one works only once.")
        backupInput.current?.focus()
      }
    }, 900)
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === "code") {
      if (code.length < 6) {
        setError("Enter all six digits.")
        otp.current?.focus()
      } else verify(code)
    } else if (!BACKUP.test(backup.trim())) {
      setError(backup.trim() ? "Backup codes look like 4f7k-29xq." : "Enter one of your backup codes.")
      backupInput.current?.focus()
    } else verify(backup)
  }
  const switchMode = (m: "code" | "backup") => {
    setMode(m)
    setError("")
    requestAnimationFrame(() => (m === "code" ? otp.current : backupInput.current)?.focus())
  }
  const resend = () => {
    // Send a new code here.
    setLeft(WAIT)
    setResent(true)
    setError("")
    setCode("")
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-h-[700px] items-center justify-center bg-muted px-4 py-16 sm:px-8">
      <div className="dc-card w-full max-w-[460px] overflow-hidden">
        {done ? (
          <div role="status" className="flex flex-col items-center px-6 py-14 text-center sm:px-10">
            <span className="grid size-14 place-items-center rounded-full bg-[color:var(--dc-highlight)] text-[color:var(--dc-highlight-fg)]">
              <Check className="size-6" aria-hidden="true" />
            </span>
            <h1 id={`${id}-title`} ref={doneTitle} tabIndex={-1} className="dc-h mt-6 text-[26px] leading-tight outline-none">
              You&rsquo;re in
            </h1>
            <p className="mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
              {trust ? "We won't ask for a code on this device for 30 days." : "We'll ask for a code the next time you sign in."}
              {mode === "backup" ? " That backup code is used up now; you have 9 left." : ""}
            </p>
            <Button className="mt-7 h-10 px-5 text-[15px] font-semibold" nativeButton={false} render={<a href="#overview" />}>
              Continue to Orbit <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <>
            <form noValidate onSubmit={onSubmit} className="flex flex-col items-center px-5 pt-9 pb-8 text-center sm:px-10">
              <span className="dc-icon size-12">
                {mode === "code" ? <ShieldCheck className="size-5" aria-hidden="true" /> : <KeyRound className="size-5" aria-hidden="true" />}
              </span>
              <h1 id={`${id}-title`} className="dc-h mt-5 text-[26px] leading-tight">
                {mode === "code" ? "Enter your code" : "Use a backup code"}
              </h1>
              <p className="mt-2 max-w-[340px] text-[15px] leading-relaxed text-muted-foreground">
                {mode === "code" ? (
                  <>
                    We texted a 6-digit code to your phone ending in <span className="dc-num font-medium text-foreground">42</span>. It expires in 10 minutes.
                  </>
                ) : (
                  "Enter one of the codes you saved when you turned on two-step sign-in. Each works once."
                )}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 text-[13px]">
                <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-muted text-[10px] font-bold">
                  AR
                </span>
                ada@ruizstudio.co
                <a href="#sign-in" className={`font-medium text-[color:var(--dc-accent)] hover:underline ${focus}`}>
                  Not you?
                </a>
              </p>

              <div className="mt-7 grid w-full justify-items-center gap-2">
                {mode === "code" ? (
                  <>
                    <Label htmlFor={`${id}-code`} className="sr-only">
                      Six-digit code
                    </Label>
                    <InputOTP
                      ref={otp}
                      id={`${id}-code`}
                      maxLength={6}
                      pattern="^\d+$"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(v) => {
                        setCode(v)
                        if (error) setError("")
                      }}
                      onComplete={verify}
                      disabled={checking}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${id}-error` : undefined}
                      containerClassName="gap-2 sm:gap-3"
                    >
                      <InputOTPGroup>
                        {[0, 1, 2].map((i) => (
                          <InputOTPSlot key={i} index={i} className={slot} aria-invalid={error ? true : undefined} />
                        ))}
                      </InputOTPGroup>
                      <InputOTPSeparator className="text-muted-foreground" />
                      <InputOTPGroup>
                        {[3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} className={slot} aria-invalid={error ? true : undefined} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </>
                ) : (
                  <div className="grid w-full max-w-[300px] gap-1.5 text-left">
                    <Label htmlFor={`${id}-backup`} className="text-[13px]">
                      Backup code
                    </Label>
                    <Input
                      ref={backupInput}
                      id={`${id}-backup`}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="xxxx-xxxx"
                      value={backup}
                      onChange={(e) => {
                        setBackup(e.target.value)
                        if (error) setError("")
                      }}
                      onBlur={(e) => backup.trim() && !toButton(e) && !BACKUP.test(backup.trim()) && setError("Backup codes look like 4f7k-29xq.")}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${id}-error` : undefined}
                      className="dc-num h-11 text-center text-[17px] tracking-[0.12em]"
                    />
                  </div>
                )}
                <p id={`${id}-error`} role="alert" className="min-h-5 max-w-[340px] text-[13px] text-destructive">
                  {error}
                </p>
              </div>

              <label className="mt-2 flex items-center gap-2.5 text-[14px]">
                <Checkbox checked={trust} onCheckedChange={(v) => setTrust(v === true)} />
                Trust this device for 30 days
              </label>
              <Button type="submit" className="mt-6 h-10 w-full max-w-[340px] text-[15px] font-semibold" disabled={checking}>
                {checking ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                {checking ? "Checking…" : "Verify"}
              </Button>
            </form>

            <p className="sr-only" aria-live="polite">
              {resent && mode === "code" ? "We texted you a new code." : ""}
            </p>
            <div className="flex flex-col items-center gap-2 border-t border-border bg-muted/60 px-5 py-4 text-[14px] sm:flex-row sm:justify-between sm:px-8">
              {mode === "code" ? (
                <p className="text-muted-foreground">
                  {left > 0 ? (
                    <>
                      {resent ? "New code sent. " : "No text yet? "}Resend in <span className="dc-num">{clock(left)}</span>
                    </>
                  ) : (
                    <>
                      No text yet?{" "}
                      <button type="button" onClick={resend} className={`font-medium text-foreground underline underline-offset-2 hover:text-[color:var(--dc-accent)] ${focus}`}>
                        Resend code
                      </button>
                    </>
                  )}
                </p>
              ) : (
                <button type="button" onClick={() => switchMode("code")} className={`inline-flex items-center gap-1.5 font-medium text-foreground hover:underline ${focus}`}>
                  <Smartphone className="size-4 text-muted-foreground" aria-hidden="true" />
                  Use the code from your phone
                </button>
              )}
              {mode === "code" ? (
                <button type="button" onClick={() => switchMode("backup")} className={`inline-flex items-center gap-1.5 font-medium text-foreground hover:underline ${focus}`}>
                  <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
                  Use a backup code instead
                </button>
              ) : (
                <a href="#recovery" className={`font-medium text-muted-foreground hover:text-foreground ${focus}`}>
                  Lost your codes too?
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
