import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ORG_NAME, SITE_DOMAIN, SITE_URL } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${ORG_NAME} — ${SITE_DOMAIN}`,
    template: `%s — ${ORG_NAME}`,
  },
  description:
    "Research-grade peptides and reference materials for laboratory research. Research Use Only.",
  openGraph: {
    type: "website",
    siteName: ORG_NAME,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink text-white">
        {children}
        {/* Root layout, not the page: the landing URL's parameters only exist on first paint. */}
        <AttributionCapture />
        {/* Every ad lands on this domain, so the Landing Page View has to be
            recorded here — on the store it would already be one click too late. */}
        <MetaPixel />
      </body>
    </html>
  );
}
