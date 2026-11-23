export function AnnouncementBar({
  label = "New:",
  text = "paid subscriptions now support annual plans.",
  linkText = "Read the changelog →",
  href = "#changelog",
}: {
  label?: string
  text?: string
  linkText?: string
  href?: string
}) {
  return (
    <div className="bg-newsprint">
      <p className="mx-auto flex min-h-[44px] max-w-[1360px] flex-wrap items-center px-5 py-2 text-[15px] text-ink md:px-[25px] md:text-[17px] xl:h-[44px] xl:px-gutter xl:py-0 xl:text-[19px]">
        <span className="mr-[6px] font-medium text-press">{label}</span>
        {text}
        <a href={href} className="ml-[6px] hover:underline">
          {linkText}
        </a>
      </p>
    </div>
  )
}
