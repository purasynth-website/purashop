import { NextResponse, type NextRequest } from "next/server";
import { TRAFFIC_SHIELD_CID, TRAFFIC_SHIELD_VERIFY_PARAM } from "@/lib/traffic-shield";

/**
 * Next.js 16 proxy. One job: answer TrafficShield's installation probe the way
 * the vendor's own PHP integration does. A request carrying the `4f5e78hgfhd`
 * query parameter gets the bare campaign id back as text/plain, so the
 * dashboard's "Verify Installation" confirms the campaign on any page URL of
 * this site. shield.js does the same client-side (it writes the id over the
 * body), but a verifier that only fetches HTML never runs it. Every other
 * request passes straight through.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.searchParams.has(TRAFFIC_SHIELD_VERIFY_PARAM)) {
    return new NextResponse(TRAFFIC_SHIELD_CID, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "private, no-store",
        "x-robots-tag": "noindex",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  // Every page; static assets are left alone.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
