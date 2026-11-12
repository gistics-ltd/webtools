/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const ogSize = { width: 1200, height: 630 };

function logoDataUri(): string | null {
  try {
    const buffer = readFileSync(path.join(process.cwd(), "public", "brand", "gistics-logo-red.png"));
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function renderOgImage() {
  const logo = logoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0D",
          color: "#FFFFFF",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 16,
            background: "#E83E1C",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 90,
            width: 480,
            height: 480,
            borderRadius: 240,
            background: "#E8AE1C",
            opacity: 0.12,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {logo ? (
            <img
              src={logo}
              width={334}
              height={86}
              alt=""
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: 2 }}>GISTICS</div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 12, color: "#E8AE1C" }}>
                LIMITED
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              fontWeight: 800,
              maxWidth: 940,
              letterSpacing: -1,
            }}
          >
            {SITE_TITLE}
          </div>
          <div style={{ fontSize: 27, color: "#D4D4D4", maxWidth: 900, lineHeight: 1.35 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#E8AE1C",
            fontWeight: 700,
          }}
        >
          <div>Chauffeur · Corporate · Journey</div>
          <div>Kampala · Entebbe · Uganda</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
