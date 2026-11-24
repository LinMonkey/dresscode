// Sample data for the Orbit app template: one small studio's invoicing, clients and payments.
// It picks up where the landing page's product shot leaves off (same invoices, same chart, same
// numbers), so the two templates read as one product. Everything is fixed: "today" is Nov 24, 2026.
import { LAST_YEAR, MONTHS, THIS_YEAR } from "@/registry/dresscode/blocks/orbit/product-preview"

export { LAST_YEAR, MONTHS, THIS_YEAR }

export const TODAY = "Nov 24, 2026"

export type InvoiceStatus = "Draft" | "Due" | "Overdue" | "Paid"

export type LineItem = { description: string; qty: number; rate: number }

export type Invoice = {
  id: string
  clientId: string
  issued: string
  due: string
  /** Day of the year the invoice is due on, for sorting. */
  dueDay: number
  issuedDay: number
  status: InvoiceStatus
  amount: number
  paidOn?: string
  /** "4 days late", "due in 4 days", "paid in 13 days". */
  note: string
}

export type Client = {
  id: string
  name: string
  contact: string
  email: string
  city: string
  currency: "USD" | "EUR" | "GBP" | "CAD"
  kind: "Retainer" | "Project"
  billed: number
  outstanding: number
  invoices: number
  daysToPay: number
  since: string
  lastInvoice: string
}

export const ME = { name: "Ada Ruiz", first: "Ada", email: "ada@ruizstudio.co", initials: "AR", role: "Owner" }
export const WORKSPACES = [
  { id: "ruiz", name: "Ruiz Studio", plan: "Pro trial", initials: "RS" },
  { id: "personal", name: "Ada Ruiz", plan: "Free", initials: "AR" },
]

const HANDMADE: Omit<Client, "id">[] = [
  { name: "Fernwood Studio", contact: "Mara Lind", email: "mara@fernwood.studio", city: "Portland, OR", currency: "USD", kind: "Retainer", billed: 38400, outstanding: 4200, invoices: 11, daysToPay: 9, since: "Mar 2025", lastInvoice: "Nov 14" },
  { name: "Kato & Lee", contact: "Ken Kato", email: "ken@katolee.com", city: "Vancouver, BC", currency: "CAD", kind: "Project", billed: 12960, outstanding: 1860, invoices: 6, daysToPay: 21, since: "Jun 2025", lastInvoice: "Oct 21" },
  { name: "Northlight", contact: "Iris Novak", email: "billing@northlight.io", city: "Austin, TX", currency: "USD", kind: "Retainer", billed: 52150, outstanding: 0, invoices: 9, daysToPay: 13, since: "Jan 2025", lastInvoice: "Nov 4" },
  { name: "Juniper Labs", contact: "Theo Grant", email: "theo@juniperlabs.dev", city: "Denver, CO", currency: "USD", kind: "Project", billed: 16100, outstanding: 0, invoices: 7, daysToPay: 12, since: "Apr 2025", lastInvoice: "Oct 29" },
  { name: "Ola Bakery", contact: "Ola Bergstrom", email: "hello@olabakery.com", city: "Brooklyn, NY", currency: "USD", kind: "Project", billed: 2560, outstanding: 0, invoices: 4, daysToPay: 6, since: "Aug 2025", lastInvoice: "Nov 18" },
  { name: "Halcyon", contact: "June Park", email: "finance@halcyon.co", city: "Seattle, WA", currency: "USD", kind: "Retainer", billed: 18000, outstanding: 1500, invoices: 12, daysToPay: 10, since: "Nov 2024", lastInvoice: "Nov 12" },
  { name: "Pellucid Health", contact: "Dr. Ravi Shah", email: "accounts@pellucid.health", city: "Boston, MA", currency: "USD", kind: "Project", billed: 8750, outstanding: 1250, invoices: 5, daysToPay: 27, since: "Feb 2025", lastInvoice: "Oct 15" },
  { name: "Alder Coffee", contact: "Sam Alder", email: "sam@aldercoffee.com", city: "Oakland, CA", currency: "USD", kind: "Retainer", billed: 12600, outstanding: 1050, invoices: 12, daysToPay: 8, since: "Dec 2024", lastInvoice: "Nov 10" },
  { name: "Brightedge", contact: "Lena Ortiz", email: "ap@brightedge.com", city: "Chicago, IL", currency: "USD", kind: "Project", billed: 23200, outstanding: 0, invoices: 4, daysToPay: 14, since: "May 2025", lastInvoice: "Nov 3" },
  { name: "Mossgrove Architects", contact: "Paul Moss", email: "paul@mossgrove.archi", city: "London, UK", currency: "GBP", kind: "Project", billed: 9800, outstanding: 0, invoices: 3, daysToPay: 16, since: "Jul 2025", lastInvoice: "Nov 21" },
  { name: "Saltmarsh Films", contact: "Nadia Cole", email: "nadia@saltmarsh.film", city: "Los Angeles, CA", currency: "USD", kind: "Project", billed: 11250, outstanding: 0, invoices: 5, daysToPay: 11, since: "Mar 2025", lastInvoice: "Oct 28" },
  { name: "Verity Legal", contact: "Owen Price", email: "owen@veritylegal.com", city: "Toronto, ON", currency: "CAD", kind: "Retainer", billed: 7200, outstanding: 0, invoices: 6, daysToPay: 18, since: "May 2025", lastInvoice: "Nov 20" },
  { name: "Tidewater Co.", contact: "Hana Ito", email: "hana@tidewater.co", city: "Charleston, SC", currency: "USD", kind: "Project", billed: 10440, outstanding: 0, invoices: 3, daysToPay: 12, since: "Sep 2025", lastInvoice: "Oct 24" },
  { name: "Quill & Ink", contact: "Bea Marsh", email: "bea@quillandink.co", city: "Berlin, DE", currency: "EUR", kind: "Project", billed: 4600, outstanding: 0, invoices: 5, daysToPay: 15, since: "Oct 2025", lastInvoice: "Oct 20" },
]

// The other 50 of the 64 clients, made from word lists so the list pages like a real one.
const FIRST = ["Arbor", "Beacon", "Cinder", "Delta", "Ember", "Fable", "Granite", "Hollow", "Indigo", "Jasper", "Kestrel", "Lumen", "Meridian", "Nimbus", "Orchard", "Pine", "Quarry", "Rook", "Sable", "Thistle", "Umber", "Vale", "Willow", "Yarrow", "Zephyr"]
const LAST = ["Studio", "Labs", "& Co.", "Partners", "Goods", "Collective", "Works", "Supply", "Media", "Health"]
const PEOPLE = ["Alex", "Bo", "Cam", "Dana", "Eli", "Fran", "Gus", "Hal", "Ines", "Jo", "Kai", "Lou", "Mia", "Nico", "Oren"]
const CITIES = ["Portland, OR", "Austin, TX", "Denver, CO", "Brooklyn, NY", "Seattle, WA", "Chicago, IL", "Toronto, ON", "London, UK"]
const SINCE = ["Jan 2025", "Mar 2025", "May 2025", "Jul 2025", "Sep 2025", "Nov 2025", "Feb 2026", "Apr 2026", "Jun 2026", "Aug 2026"]
const LASTDATE = ["Nov 2", "Oct 30", "Oct 22", "Oct 15", "Oct 8", "Sep 29", "Sep 18", "Sep 4", "Aug 21", "Aug 6"]

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export const CLIENTS: Client[] = [
  ...HANDMADE,
  ...Array.from({ length: 50 }, (_, i): Omit<Client, "id"> => {
    const name = `${FIRST[(i * 7) % FIRST.length]} ${LAST[(i * 3 + Math.floor(i / 10)) % LAST.length]}`
    const person = PEOPLE[(i * 4) % PEOPLE.length]
    const invoices = 1 + ((i * 5) % 9)
    return {
      name,
      contact: `${person} ${FIRST[(i * 11 + 3) % FIRST.length]}`,
      email: `${person.toLowerCase()}@${slug(name).replace(/-and-co$|-/g, "")}.com`,
      city: CITIES[i % CITIES.length],
      currency: i % 9 === 4 ? "GBP" : i % 7 === 3 ? "EUR" : "USD",
      kind: i % 3 === 0 ? "Retainer" : "Project",
      billed: invoices * (600 + ((i * 137) % 9) * 150),
      outstanding: 0,
      invoices,
      daysToPay: 7 + ((i * 3) % 17),
      since: SINCE[i % SINCE.length],
      lastInvoice: LASTDATE[(i * 3) % LASTDATE.length],
    }
  }),
]
  .map((c) => ({ ...c, id: slug(c.name) }))
  // Two generated names can collide; keep the first.
  .filter((c, i, all) => all.findIndex((x) => x.id === c.id) === i)

export const clientById = (id: string) => CLIENTS.find((c) => c.id === id) ?? CLIENTS[0]

// Day-of-year helpers for the fixed calendar (2026 is not a leap year).
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const dayOf = (label: string) => {
  const [m, d] = label.split(" ")
  return MONTH_START[SHORT.indexOf(m)] + Number(d)
}
const labelOf = (day: number) => {
  let m = 11
  while (MONTH_START[m] >= day) m--
  return `${SHORT[m]} ${day - MONTH_START[m]}`
}
export const TODAY_DAY = dayOf("Nov 24")

type Seed = [id: number, client: string, issued: string, due: string, status: InvoiceStatus, amount: number, paidOn?: string]
const RECENT: Seed[] = [
  [1042, "fernwood-studio", "Nov 14", "Nov 28", "Due", 4200],
  [1041, "kato-and-lee", "Oct 21", "Nov 20", "Overdue", 1860],
  [1040, "northlight", "Nov 4", "Nov 18", "Paid", 7450, "Nov 17"],
  [1039, "juniper-labs", "Oct 29", "Nov 12", "Paid", 2300, "Nov 10"],
  [1038, "ola-bakery", "Nov 18", "", "Draft", 640],
  [1037, "halcyon", "Nov 12", "Dec 2", "Due", 1500],
  [1036, "pellucid-health", "Oct 15", "Nov 9", "Overdue", 1250],
  [1035, "alder-coffee", "Nov 10", "Nov 30", "Due", 1050],
  [1034, "brightedge", "Nov 3", "Nov 17", "Paid", 5800, "Nov 16"],
  [1033, "mossgrove-architects", "Nov 21", "", "Draft", 3900],
  [1032, "saltmarsh-films", "Oct 28", "Nov 11", "Paid", 2750, "Nov 8"],
  [1031, "verity-legal", "Nov 20", "", "Draft", 1200],
  [1030, "tidewater-co", "Oct 24", "Nov 7", "Paid", 3480, "Nov 5"],
  [1029, "quill-and-ink", "Oct 20", "Nov 3", "Paid", 920, "Nov 2"],
]
const OLDER_CLIENTS = ["northlight", "fernwood-studio", "halcyon", "alder-coffee", "juniper-labs", "brightedge", "saltmarsh-films", "kato-and-lee", "verity-legal", "tidewater-co", "ola-bakery", "pellucid-health", "quill-and-ink"]
const OLDER_AMOUNTS = [6200, 1500, 1050, 2900, 4400, 820, 3150, 1860, 5100, 1200, 2480, 7450, 960]

export const INVOICES: Invoice[] = [
  ...RECENT,
  // Older invoices, all paid: one every three or four days back to mid-summer.
  ...Array.from({ length: 28 }, (_, i): Seed => {
    const issuedDay = dayOf("Oct 17") - Math.round(i * 3.4)
    const term = i % 3 === 0 ? 30 : 14
    const paidAfter = 6 + ((i * 5) % 14)
    return [1028 - i, OLDER_CLIENTS[i % OLDER_CLIENTS.length], labelOf(issuedDay), labelOf(issuedDay + term), "Paid", OLDER_AMOUNTS[i % OLDER_AMOUNTS.length], labelOf(issuedDay + paidAfter)]
  }),
].map(([n, clientId, issued, due, status, amount, paidOn]) => {
  const issuedDay = dayOf(issued)
  const dueDay = due ? dayOf(due) : 999
  const note =
    status === "Paid" && paidOn
      ? `Paid ${paidOn}`
      : status === "Overdue"
        ? `${TODAY_DAY - dueDay} days late`
        : status === "Due"
          ? `Due in ${dueDay - TODAY_DAY} days`
          : "Not sent"
  return { id: `INV-${n}`, clientId, issued, due: due || "—", issuedDay, dueDay, status, amount, paidOn, note }
})

/** Any invoice by number, including the older ones on a client's page. Unknown numbers open INV-1042. */
export const invoiceById = (id: string): Invoice =>
  INVOICES.find((i) => i.id === id) ?? (/^INV-0\d+$/.test(id) ? CLIENTS.flatMap((c) => clientInvoices(c)).find((i) => i.id === id) : undefined) ?? INVOICES[0]

export const STATUS_COUNTS = {
  All: INVOICES.length,
  Draft: INVOICES.filter((i) => i.status === "Draft").length,
  Due: INVOICES.filter((i) => i.status === "Due").length,
  Overdue: INVOICES.filter((i) => i.status === "Overdue").length,
  Paid: INVOICES.filter((i) => i.status === "Paid").length,
}

export const OUTSTANDING = INVOICES.filter((i) => i.status === "Due" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0)
export const OVERDUE = INVOICES.filter((i) => i.status === "Overdue")
export const OVERDUE_TOTAL = OVERDUE.reduce((s, i) => s + i.amount, 0)

/** The line items behind an invoice. INV-1042 is written out; the rest split the amount in two or three. */
export function lineItems(inv: Invoice): { items: LineItem[]; taxRate: number; discount: number } {
  if (inv.id === "INV-1042") {
    return {
      items: [
        { description: "Brand identity refresh, phase 2", qty: 1, rate: 2400 },
        { description: "Website design, page templates", qty: 6, rate: 200 },
        { description: "Design review calls (hours)", qty: 5, rate: 80 },
      ],
      taxRate: 5,
      discount: 0,
    }
  }
  const n = Number(inv.id.slice(4))
  const main = Math.round((inv.amount * 0.62) / 10) * 10
  // Amounts are whole tens, so 4, 5, 8 or 10 hours always split the rest into whole cents.
  const hours = [4, 5, 8, 10][n % 4]
  const rest = inv.amount - main
  return {
    items: [
      { description: n % 3 === 0 ? "Monthly retainer" : n % 3 === 1 ? "Design sprint" : "Brand and web design", qty: 1, rate: main },
      { description: "Production hours", qty: hours, rate: rest / hours },
    ],
    taxRate: 0,
    discount: 0,
  }
}

export type PaymentMethod = "Card" | "Bank transfer" | "ACH debit" | "PayPal"
export type Payment = {
  id: string
  invoiceId: string
  clientId: string
  date: string
  method: PaymentMethod
  detail: string
  amount: number
  fee: number
  status: "Succeeded" | "Pending" | "Refunded"
}

const METHODS: [PaymentMethod, string][] = [
  ["Card", "Visa ·· 4242"],
  ["Bank transfer", "BofA ·· 1187"],
  ["Card", "Mastercard ·· 5100"],
  ["ACH debit", "Wells ·· 3321"],
  ["PayPal", "PayPal"],
  ["Card", "Amex ·· 1008"],
]
const feeFor = (method: PaymentMethod, amount: number) =>
  method === "Card" ? Math.round((amount * 0.029 + 0.3) * 100) / 100 : method === "PayPal" ? Math.round(amount * 0.034 * 100) / 100 : Math.min(5, Math.round(amount * 0.008 * 100) / 100)

const PAYMENTS_UNSORTED: Payment[] = [
  // A partial payment on the way for the Due invoice at Halcyon, then every paid invoice.
  { id: "PAY-2290", invoiceId: "INV-1037", clientId: "halcyon", date: "Nov 23", method: "ACH debit", detail: "Wells ·· 3321", amount: 750, fee: 5, status: "Pending" },
  ...INVOICES.filter((i) => i.status === "Paid").map((inv, i): Payment => {
    const [method, detail] = METHODS[i % METHODS.length]
    return {
      id: `PAY-${2289 - i}`,
      invoiceId: inv.id,
      clientId: inv.clientId,
      date: inv.paidOn ?? inv.due,
      method,
      detail,
      amount: inv.amount,
      fee: feeFor(method, inv.amount),
      status: i === 6 ? "Refunded" : "Succeeded",
    }
  }),
]

/** Newest first. */
export const PAYMENTS: Payment[] = [...PAYMENTS_UNSORTED].sort((a, b) => dayOf(b.date) - dayOf(a.date))

export const PAYOUT = { amount: 6214.4, date: "Nov 26", bank: "Chase ·· 6789" }

export type Role = "Owner" | "Admin" | "Accountant" | "Viewer"
export const TEAM: { name: string; email: string; initials: string; role: Role; lastSeen: string }[] = [
  { name: "Ada Ruiz", email: "ada@ruizstudio.co", initials: "AR", role: "Owner", lastSeen: "Now" },
  { name: "Marco Bell", email: "marco@ruizstudio.co", initials: "MB", role: "Admin", lastSeen: "2 hours ago" },
  { name: "Priya Nair", email: "priya@nairbooks.com", initials: "PN", role: "Accountant", lastSeen: "Yesterday" },
  { name: "Sam Okafor", email: "sam@ruizstudio.co", initials: "SO", role: "Viewer", lastSeen: "Nov 12" },
]
export const PENDING_INVITES = [{ email: "jo@ruizstudio.co", role: "Admin" as Role, sent: "Nov 22" }]

export type Notice = { id: string; kind: "paid" | "viewed" | "reminder" | "payout" | "overdue"; text: string; detail: string; time: string; unread: boolean }
export const NOTIFICATIONS: Notice[] = [
  { id: "n1", kind: "paid", text: "Northlight paid INV-1040", detail: "$7,450.00 by card", time: "2h", unread: true },
  { id: "n2", kind: "viewed", text: "Kato & Lee opened INV-1041", detail: "Third view, 4 days late", time: "5h", unread: true },
  { id: "n3", kind: "overdue", text: "INV-1036 is 15 days late", detail: "Pellucid Health, $1,250.00", time: "9h", unread: true },
  { id: "n4", kind: "reminder", text: "Reminder sent to Halcyon", detail: "INV-1037, due Dec 2", time: "Yesterday", unread: false },
  { id: "n5", kind: "payout", text: "Payout of $6,214.40 is on its way", detail: "Arrives Nov 26 at Chase ·· 6789", time: "Yesterday", unread: false },
]

export const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
export const moneyShort = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)

export const initialsOf = (name: string) =>
  name
    .replace(/&|\./g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

/** A client's recent invoices, newest first: the real ones, then older paid ones up to eight. */
export function clientInvoices(c: Client): Invoice[] {
  const real = INVOICES.filter((i) => i.clientId === c.id).sort((a, b) => b.issuedDay - a.issuedDay)
  const want = Math.min(c.invoices, 8)
  if (real.length >= want) return real
  const idx = CLIENTS.findIndex((x) => x.id === c.id)
  const each = Math.round(c.billed / c.invoices / 10) * 10
  const from = real.length ? real[real.length - 1].issuedDay - 21 : dayOf(c.lastInvoice)
  const count = want - real.length
  const step = Math.max(7, Math.min(30, Math.floor((from - 5) / count)))
  return [
    ...real,
    ...Array.from({ length: count }, (_, i): Invoice => {
      const issuedDay = from - i * step
      const paidDay = issuedDay + c.daysToPay
      return {
        id: `INV-0${100 + idx * 8 + i}`,
        clientId: c.id,
        issued: labelOf(issuedDay),
        due: labelOf(issuedDay + 14),
        issuedDay,
        dueDay: issuedDay + 14,
        status: "Paid",
        amount: each,
        paidOn: labelOf(paidDay),
        note: `Paid ${labelOf(paidDay)}`,
      }
    }),
  ]
}
