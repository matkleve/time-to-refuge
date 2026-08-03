import { NextResponse } from "next/server";

/**
 * Millisecond UTC for the clock probe (`lib/network-time.ts`).
 * Same-origin so the browser can use Cristian's algorithm without CORS.
 * Vercel / Node clocks are NTP-synced; still not a lab atomic lock.
 */
export const dynamic = "force-dynamic";
export const runtime = "edge";

export function GET() {
  return NextResponse.json(
    { utcMs: Date.now() },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
