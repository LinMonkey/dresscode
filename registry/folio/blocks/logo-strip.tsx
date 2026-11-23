// Placeholder customer logos. Replace with real ones — never ship invented brands.
const marks = [
  <path key="a" d="M6 30 16 6h9L15 30Zm13 0L29 6h9L28 30Z" />,
  <circle key="b" cx="20" cy="18" r="13" />,
  <path key="c" d="M5 5h7a13 13 0 0 1 0 26H5Zm14 0h4a13 13 0 0 1 0 26h-4Z" />,
  <path key="d" d="M5 5h12v12H5Zm15 0h12v12H20ZM5 20h12v12H5Zm15 0h12v12H20Z" />,
  <path key="e" d="m20 4 13 7.5v15L20 34 7 26.5v-15Z" />,
  <path key="f" d="M5 8h30v5H5Zm0 9h30v5H5Zm0 9h30v5H5Z" />,
]

export function LogoStrip({ label = "Read by subscribers at", names = Array(6).fill("Logoipsum") }: { label?: string; names?: string[] }) {
  return (
    <section className="mx-auto max-w-[1360px] px-5 md:px-[25px] xl:px-gutter">
      <p className="text-[17px] leading-[1.2] text-ink-2 xl:text-[21px]">{label}</p>
      <ul className="mt-[25px] grid grid-cols-2 items-center gap-y-5 md:grid-cols-3 xl:grid-cols-6 xl:gap-y-0">
        {names.map((name, i) => (
          <li
            key={i}
            className="flex h-[42px] items-center gap-[10px] text-[19px] font-semibold tracking-[-0.01em] text-ink-2 xl:gap-[12px] xl:border-l xl:border-divider xl:px-[30px] xl:text-[23px] xl:first:border-l-0 xl:first:pl-[8px]"
          >
            <svg viewBox="0 0 40 36" className="h-[32px] w-[36px] shrink-0 fill-current" aria-hidden>
              {marks[i % marks.length]}
            </svg>
            {name}
          </li>
        ))}
      </ul>
      <div className="mt-[21px] h-[7px] border-t-2 border-b border-rule" />
    </section>
  )
}
