"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Meta Pixel for the offer page.
 *
 * Every Meta and TikTok ad that uses this page lands HERE, not on the store. A
 * Landing Page View can only be recorded by a pixel on the page the ad
 * actually landed on, so without this Meta's funnel reads "click → nothing →
 * purchase" and has no mid-funnel signal until the visitor reaches purasynth.com.
 *
 * The two ids are the same pair the store runs, so whichever one an ad account
 * is attached to sees the landing. Meta's snippet supports several
 * `fbq('init', id)` calls and a later `fbq('track', …)` broadcasts to all of
 * them, with no double-count inside any one pixel.
 *
 * Loaded afterInteractive so it never blocks the tap-through this page exists
 * for. Purchases are NOT reported from here — they happen on purasynth.com and
 * are sent server-side from there.
 */
const META_PIXEL_IDS = ["1770584240889402", "863857110028263"] as const;

/** The only route that loads the pixel: the offer page. The reading room is pixel-free. */
const PIXEL_PATHS = new Set(["/offer"]);

export function MetaPixel() {
  const pathname = usePathname();
  if (!PIXEL_PATHS.has(pathname)) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${META_PIXEL_IDS.map((id) => `fbq('init', '${id}');`).join("\n")}
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {META_PIXEL_IDS.map((id) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={id}
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          />
        ))}
      </noscript>
    </>
  );
}
