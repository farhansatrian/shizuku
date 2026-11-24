import { NextRequest, NextResponse } from "next/server";
import {
  ecosystemPreflight,
  getEcosystemUserFromRequest,
  withEcosystemCors,
} from "@/lib/ecosystem-auth";

export function OPTIONS(req: NextRequest) {
  return ecosystemPreflight(req);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getEcosystemUserFromRequest(req);
    return withEcosystemCors(req, NextResponse.json({ user }));
  } catch (err) {
    console.error("Ecosystem session check error:", err);
    return withEcosystemCors(req, NextResponse.json({ user: null }));
  }
}
