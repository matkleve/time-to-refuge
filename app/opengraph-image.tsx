import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/site";

export const runtime = "edge";

export const alt = `${siteName} — Refuge Ceremony Timer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f3f1ee 0%, #eaf1fd 55%, #fef6e7 100%)",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 28,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#2A4394",
              fontWeight: 600,
            }}
          >
            Time to Refuge
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 72,
              fontWeight: 700,
              color: "#1f1b16",
              lineHeight: 1.05,
            }}
          >
            {siteName}
          </p>
          <p
            style={{
              margin: 0,
              maxWidth: 880,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#5f574e",
            }}
          >
            {siteDescription}
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
