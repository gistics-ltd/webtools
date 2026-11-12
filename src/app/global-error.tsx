"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang={siteConfig.lang}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Something went wrong | Gistics Limited</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#1C3B38",
          color: "#181512",
          padding: 12,
          fontFamily:
            '"Open Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            minHeight: "calc(100vh - 24px)",
            background: "#FFFCF7",
            borderRadius: 24,
            padding: "clamp(24px, 5vw, 64px)",
            boxSizing: "border-box",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#181512",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            GISTICS <span style={{ color: "#E83E1C" }}>LIMITED</span>
          </Link>
          <main style={{ padding: "clamp(48px, 9vw, 120px) 0" }}>
            <p
              style={{
                color: "#E83E1C",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              500 · Server error
            </p>
            <div
              style={{
                fontSize: "clamp(72px, 12vw, 128px)",
                lineHeight: 0.9,
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: "#181512",
              }}
            >
              500
            </div>
            <h1
              style={{
                marginTop: 24,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.1,
                maxWidth: 640,
                fontWeight: 500,
              }}
            >
              Something went wrong on our side.
            </h1>
            <p
              style={{
                marginTop: 12,
                fontSize: 16,
                lineHeight: 1.6,
                color: "#6B645A",
                maxWidth: 620,
              }}
            >
              We could not finish loading this page. Please try again. If it keeps happening, email us and we will help directly.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  minHeight: 44,
                  border: 0,
                  borderRadius: 999,
                  background: "#E8AE1C",
                  color: "#181512",
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  minHeight: 44,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  border: "1px solid #181512",
                  color: "#181512",
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
              {/* <a
                href={`mailto:${siteConfig.email}`}
                style={{
                  minHeight: 44,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  border: "1px solid #181512",
                  color: "#181512",
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Email us
              </a> */}
            </div>
            {/* <p style={{ marginTop: 24, fontSize: 14, color: "#6B645A" }}>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                style={{ color: "#181512", fontWeight: 700 }}
              >
                Call {siteConfig.phone.display}
              </a>
            </p> */}
          </main>
        </div>
      </body>
    </html>
  );
}
