import { ImageResponse } from "next/og";
import { getMessage, isLocale, type Locale } from "@/lib/i18n";

// Imagen OG por idioma: /en/opengraph-image y /es/opengraph-image.
export const alt = "Rodrigo Villarreal — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STACK = ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "MongoDB"];

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const subtitle = getMessage(l, "meta.og.subtitle");
  const tagline = getMessage(l, "meta.og.tagline");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#020617",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              color: "#ffffff",
            }}
          >
            RV
          </div>
          <div style={{ display: "flex", fontSize: "24px", color: "#94a3b8", letterSpacing: "4px" }}>
            VILLARREALRODRIGO.COM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", fontSize: "80px", lineHeight: 1.05, letterSpacing: "-2px" }}>
            Rodrigo Villarreal
          </div>
          <div style={{ display: "flex", fontSize: "38px", color: "#c7d2fe" }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#94a3b8" }}>
            {tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {STACK.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "999px",
                border: "2px solid #334155",
                fontSize: "24px",
                color: "#cbd5e1",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
