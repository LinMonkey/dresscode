// Class strings the store's buttons and fields share, so every page's controls match.
export const WRAP = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8"

export const BTN =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] font-semibold whitespace-nowrap transition-[background-color,color,opacity,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
export const PRIMARY = `${BTN} bg-primary text-primary-foreground hover:opacity-90`
export const OUTLINE = `${BTN} border border-[color:var(--input)] bg-transparent text-foreground hover:bg-muted`
export const LINK = "font-medium text-[color:var(--dc-accent)] underline-offset-4 hover:underline"

export const FIELD =
  "h-11 w-full rounded-[var(--radius)] border border-[color:var(--input)] bg-card px-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-[color:var(--ring)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]/25 aria-[invalid=true]:border-[color:var(--dc-danger)]"
export const LABEL = "text-[14px] font-medium"
