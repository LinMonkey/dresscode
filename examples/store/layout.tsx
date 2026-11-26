// The E-commerce store in your DressCode theme (lib/dresscode-theme.ts, written by the theme install).
// Light or dark is <html class="dark">, as in shadcn/ui: until a visitor picks, the site follows your root
// layout (a theme designed dark wants className="dark" there, or next-themes). The site's switch remembers
// the pick under localStorage "theme", the key next-themes uses; this applies it before the first paint.
import type { ReactNode } from "react"

const MODE = `try{var m=localStorage.getItem("theme"),h=document.documentElement;if(m==="light"||m==="dark"){h.classList.toggle("dark",m==="dark");h.style.colorScheme=m}}catch(e){}`

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MODE }} />
      {children}
    </>
  )
}
