"use client";

type QuoteRequestButtonProps = {
  vehicleSlug: string;
  vehicleName: string;
  muted?: boolean;
};

export function QuoteRequestButton({
  vehicleSlug,
  vehicleName,
  muted = false,
}: QuoteRequestButtonProps) {
  return (
    <a
      href="#quote"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("gistics:select-vehicle", { detail: { slug: vehicleSlug } }),
        );
      }}
      className={`focusable inline-flex min-h-10 w-full items-center justify-center rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
        muted
          ? "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-brand-white"
          : "bg-gold text-ink hover:bg-[#f2c04a]"
      }`}
    >
      Request a quote
      <span className="sr-only"> for the {vehicleName}</span>
    </a>
  );
}
