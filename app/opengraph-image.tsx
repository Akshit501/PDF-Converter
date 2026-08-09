import { ImageResponse } from "next/og";

export const alt = "flip. // pdf converter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5F2FF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Dot pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(11, 11, 20, 0.12) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Card Container */}
        <div
          style={{
            background: "#FFFFFF",
            border: "6px solid #0B0B14",
            borderRadius: "32px",
            padding: "48px 64px",
            boxShadow: "16px 16px 0 #0B0B14",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            maxWidth: "1000px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              background: "#C6FF3D",
              color: "#0B0B14",
              border: "4px solid #0B0B14",
              borderRadius: "50px",
              padding: "8px 24px",
              fontSize: "20px",
              fontWeight: "bold",
              transform: "rotate(-2deg)",
            }}
          >
            ✦ ZERO INSTALLS · 100% IN-BROWSER
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              color: "#0B0B14",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            turn any file into a{" "}
            <span
              style={{
                background: "#6E3CF6",
                color: "#FFFFFF",
                padding: "0 16px",
                borderRadius: "12px",
                transform: "rotate(-1deg)",
                display: "inline-block",
              }}
            >
              PDF
            </span>{" "}
            in seconds.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#54506A",
              fontWeight: "600",
            }}
          >
            Merge, Split, Compress, Dark Mode & Images to PDF — Files Never Leave Your Device.
          </div>

          {/* Logo Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#0B0B14",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                background: "#0B0B14",
                color: "#C6FF3D",
                borderRadius: "12px",
                padding: "4px 16px",
                transform: "rotate(-6deg)",
              }}
            >
              /f
            </div>
            <span>flip.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
