import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  ECOSYSTEM_COOKIE_NAME,
  createEcosystemToken,
  ecosystemPreflight,
  getEcosystemCookieOptions,
  withEcosystemCors,
} from "@/lib/ecosystem-auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(128),
});

export function OPTIONS(req: NextRequest) {
  return ecosystemPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 400 })
      );
    }

    const email = parsed.data.email.toLowerCase();
    const dbUser = await prisma.ecosystemUser.findUnique({
      where: { email },
    });

    if (!dbUser) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "ACCOUNT_NOT_FOUND" }, { status: 401 })
      );
    }

    if (dbUser.passwordHash.startsWith("$oauth$")) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 })
      );
    }

    const ok = await bcrypt.compare(parsed.data.password, dbUser.passwordHash);
    if (!ok) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 })
      );
    }

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      displayName: dbUser.displayName,
      createdAt: dbUser.createdAt.toISOString(),
    };

    const token = await createEcosystemToken(user);
    const res = NextResponse.json({ user, token });
    res.cookies.set(ECOSYSTEM_COOKIE_NAME, token, getEcosystemCookieOptions());
    return withEcosystemCors(req, res);
  } catch (err) {
    console.error("Ecosystem login error:", err);
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 500 })
    );
  }
}
