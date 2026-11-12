import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /** Use the red-background raster tile if the white/transparent SVG is unavailable. */
  variant?: "white" | "tile";
  /** `ink` renders the supplied white SVG as a dark mark on light surfaces. */
  tone?: "white" | "ink";
};

export function Logo({ variant = "white", tone = "white" }: LogoProps) {
  const tile = variant === "tile";

  return (
    <Link
      href="/"
      aria-label="Gistics Limited home"
      className="focusable inline-flex items-center rounded-sm"
    >
      {tile ? (
        <span className="flex items-center rounded p-1.5">
          <Image
            src="/brand/gistics-logo-red.png"
            alt="Gistics Limited"
            width={1400}
            height={360}
            className="h-9 w-auto sm:h-10"
            sizes="160px"
          />
        </span>
      ) : (
        <Image
          src="/brand/gistics-logo.svg"
          alt="Gistics Limited"
          width={1400}
          height={360}
          className={`h-10 w-auto sm:h-12 ${tone === "ink" ? "brightness-0" : ""}`}
          sizes="160px"
          unoptimized
        />
      )}
    </Link>
  );
}
