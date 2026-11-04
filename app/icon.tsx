import { ImageResponse } from "next/og";

/** Favicon: the ruler mark on a cobalt tile. Generated at build time. */
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
          background: "#2451d6",
          borderRadius: 14,
        }}
      >
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path d="M4 15.5h16" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 15.5v-4M12 15.5v-7M17 15.5v-4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
