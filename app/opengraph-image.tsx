import { ImageResponse } from "next/og";

// The default Open Graph card for hsw.london.
// Branded composition: deep navy background, gold HSW mark, italic tagline,
// editorial corner marks. Rendered as a single 1200x630 image at request
// time and cached at the edge.

export const runtime = "edge";
export const alt = "HSW — A human oil change, on Harley Street.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #060912 0%, #0B0F1A 60%, #1a2540 100%)",
          color: "#F5F1E8",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* warm halo */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(228,201,122,0.25) 0%, rgba(201,163,71,0.08) 30%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top row — brand + edition */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: "#C9A347", letterSpacing: 12, lineHeight: 1 }}>
              HSW
            </div>
            <div style={{ fontSize: 12, color: "#9C9586", letterSpacing: 4, marginTop: 8 }}>
              HARLEY STREET WELLNESS
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", color: "#9C9586", fontSize: 14, letterSpacing: 3 }}>
            <span style={{ color: "#C9A347" }}>PL. I</span>
            <span style={{ marginTop: 6 }}>EBOO · CT-1500</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 60, height: 1, background: "#C9A347", display: "flex" }} />
            <span style={{ fontSize: 14, color: "#C9A347", letterSpacing: 6, marginLeft: 16, fontFamily: "monospace", fontWeight: 500 }}>
              EXTRACORPOREAL BLOOD OXYGENATION
            </span>
          </div>
          <div style={{ fontSize: 96, lineHeight: 0.96, fontWeight: 300, color: "#F5F1E8", letterSpacing: -1, display: "flex", flexDirection: "column" }}>
            <span>A human</span>
            <span style={{ fontStyle: "italic", color: "#C9A347", paddingLeft: 28 }}>oil change.</span>
          </div>
          <div style={{ fontSize: 30, color: "#9C9586", marginTop: 18, fontWeight: 300 }}>
            On Harley Street.
          </div>
        </div>

        {/* Bottom plate */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9C9586", fontSize: 13, letterSpacing: 3, fontFamily: "monospace" }}>
          <span>HSW · LONDON W1 · MMXXVI</span>
          <span style={{ color: "#C9A347" }}>●</span>
          <span>hsw.london</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
