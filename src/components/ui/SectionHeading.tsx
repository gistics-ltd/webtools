export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow flex items-center gap-2 text-flame">
        {/* <span aria-hidden="true" className="h-px w-6 bg-flame" /> */}
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-5 font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.25rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
