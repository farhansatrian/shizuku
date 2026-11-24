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

const registerSchema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(1).max(60).optional(),
  password: z.string().min(6).max(128),
});

export function OPTIONS(req: NextRequest) {
  return ecosystemPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const emailErr = parsed.error.issues.some((i) => i.path.includes("email"));
      const code = emailErr ? "INVALID_EMAIL" : "SHORT_PASSWORD";
      return withEcosystemCors(
        req,
        NextResponse.json({ error: code }, { status: 400 })
      );
    }

    const email = parsed.data.email.toLowerCase();
    const displayName =
      parsed.data.displayName?.trim() || email.split("@")[0] || "Shizuku User";

    const existing = await prisma.ecosystemUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 })
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const created = await prisma.ecosystemUser.create({
      data: {
        email,
        displayName,
        passwordHash,
        shikasSettings: {
          create: {
            locale: "en",
            privacyMode: false,
            rainEnabled: true,
          },
        },
      },
      select: { id: true, email: true, displayName: true, createdAt: true },
    });

    const user = {
      id: created.id,
      email: created.email,
      displayName: created.displayName,
      createdAt: created.createdAt.toISOString(),
    };

    const token = await createEcosystemToken(user);
    const res = NextResponse.json({ user, token }, { status: 201 });
    res.cookies.set(ECOSYSTEM_COOKIE_NAME, token, getEcosystemCookieOptions());
    return withEcosystemCors(req, res);
  } catch (err) {
    console.error("Ecosystem register error:", err);
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "REGISTER_FAILED" }, { status: 500 })
    );
  }
}
