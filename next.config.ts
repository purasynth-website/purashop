import type { NextConfig } from "next";

// Baseline security headers on every response.
// Ref: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // The first version of the series used these paths for a day.
  async redirects() {
    return [
      { source: "/articles", destination: "/primers", permanent: true },
      { source: "/articles/:slug", destination: "/primers", permanent: true },
      { source: "/reference", destination: "/tables", permanent: true },
      { source: "/tools", destination: "/calculators", permanent: true },
    ];
  },
};

export default nextConfig;
