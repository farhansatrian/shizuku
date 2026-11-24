import { NextRequest, NextResponse } from "next/server";
import {
  ECOSYSTEM_COOKIE_NAME,
  ecosystemPreflight,
  getEcosystemCookieOptions,
  withEcosystemCors,
} from "@/lib/ecosystem-auth";

export function OPTIONS(req: NextRequest) {
  return ecosystemPreflight(req);
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ECOSYSTEM_COOKIE_NAME, "", {
    ...getEcosystemCookieOptions(),
    maxAge: 0,
  });
  return withEcosystemCors(req, res);
}
