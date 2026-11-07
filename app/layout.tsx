import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { AttributionCapture } from "@/components/attribution-capture";
import { MetaPixel } from "@/components/meta-pixel";
import { TrafficShield } from "@/components/traffic-shield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        {/* The ads contractor's traffic filter, on every page of this site — see components/traffic-shield.tsx. */}
        <TrafficShield />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        {children}
        {/* Root layout, not the page: the landing URL's parameters only exist on first paint. */}
        <AttributionCapture />
        {/* Loads on the offer page only — see components/meta-pixel.tsx. */}
        <MetaPixel />
      </body>
    </html>
  );
}
