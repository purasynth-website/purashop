import { ImageResponse } from "next/og";

/** Favicon: a moss tile with the masthead's initial. Generated at build time. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b3a2f",
          borderRadius: 14,
          color: "#eef4f0",
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        M
      </div>
    ),
    size,
  );
}
