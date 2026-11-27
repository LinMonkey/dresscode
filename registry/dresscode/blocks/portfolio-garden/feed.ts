import { PERSON, POSTS } from "../portfolio/data"

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

/** Resolve item URLs against the actual mount point, in both the demo and the installed site. */
export function portfolioFeed(request: Request) {
  const home = new URL("./", request.url)
  const items = POSTS.map((post) => {
    const href = xml(new URL("writing/" + encodeURIComponent(post.slug), home).href)
    const published = new Date(post.date + "T00:00:00Z").toUTCString()
    return `<item><title>${xml(post.title)}</title><link>${href}</link><guid>${href}</guid><pubDate>${published}</pubDate><description>${xml(post.summary)}</description></item>`
  })
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(PERSON.name)}</title><link>${xml(home.href)}</link><description>Essays and notes from ${xml(PERSON.city)}.</description>${items.join("")}</channel></rss>`
  return new Response(rss, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
