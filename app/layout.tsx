import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { BLOG_DESCRIPTION, BLOG_NAME, BLOG_TAGLINE } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { AttributionCapture } from "@/components/attribution-capture";
import { MetaPixel } from "@/components/meta-pixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BLOG_NAME} — ${BLOG_TAGLINE}`,
    template: `%s — ${BLOG_NAME}`,
  },
  description: BLOG_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: BLOG_NAME,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-stone-900">
        {children}
        {/* Root layout, not the page: the landing URL's parameters only exist on first paint. */}
        <AttributionCapture />
        {/* Loads on the offer page only — see components/meta-pixel.tsx. */}
        <MetaPixel />
      </body>
    </html>
  );
}
