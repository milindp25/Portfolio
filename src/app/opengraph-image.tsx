import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Milind Prabhakar — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Cyan accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#22d3ee",
          }}
        />

        {/* Terminal prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            fontSize: "18px",
            color: "#737373",
          }}
        >
          <span style={{ color: "#22d3ee" }}>$</span>
          <span>whoami</span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#e5e5e5",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Milind Prabhakar
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
            marginBottom: "40px",
          }}
        >
          Senior Software Engineer at Capital One
        </div>

        {/* Tech stack */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {["Java", "Spring Boot", "React", "Next.js", "AWS", "Kafka"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#111111",
                  color: "#a3a3a3",
                  fontSize: "16px",
                }}
              >
                {tech}
              </div>
            ),
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "18px",
            color: "#22d3ee",
          }}
        >
          milindprabhakar.com
        </div>
      </div>
    ),
    { ...size },
  );
}
