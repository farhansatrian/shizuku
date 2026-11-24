import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const ECOSYSTEM_COOKIE_NAME = "shizuku_eco_session";

const DEV_DEFAULT_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3001",
  "http://localhost:3001",
];

function getEcosystemSecret(): Uint8Array {
  const raw =
    process.env.ECOSYSTEM_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "shizuku-fallback-dev-secret-please-set-auth-secret-in-env";
  return new TextEncoder().encode(raw);
}

export interface EcosystemSessionUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export async function createEcosystemToken(
  user: EcosystemSessionUser
): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getEcosystemSecret());
}

export async function verifyEcosystemToken(
  token: string
): Promise<{ userId: string; email: string; displayName: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getEcosystemSecret());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.displayName !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      displayName: payload.displayName,
    };
  } catch {
    return null;
  }
}

export async function getEcosystemUserFromRequest(
  req: NextRequest
): Promise<EcosystemSessionUser | null> {
  const authHeader = req.headers.get("authorization");
  const bearerToken =
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;

  const cookieToken = req.cookies.get(ECOSYSTEM_COOKIE_NAME)?.value ?? null;
  const token = bearerToken || cookieToken;
  if (!token) return null;

  const verified = await verifyEcosystemToken(token);
  if (!verified) return null;

  const dbUser = await prisma.ecosystemUser.findUnique({
    where: { id: verified.userId },
    select: { id: true, email: true, displayName: true, createdAt: true },
  });
  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    displayName: dbUser.displayName,
    createdAt: dbUser.createdAt.toISOString(),
  };
}

export function getEcosystemCookieOptions() {
  const secure = process.env.COOKIE_SECURE === "true";
  const domain = (process.env.ECOSYSTEM_COOKIE_DOMAIN || "").trim() || undefined;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    ...(domain ? { domain } : {}),
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

function getAllowedOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  const configured = (process.env.ECOSYSTEM_ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const allowed =
    process.env.NODE_ENV === "production"
      ? configured
      : [...DEV_DEFAULT_ORIGINS, ...configured];

  if (allowed.includes("*") || allowed.includes(origin)) {
    return origin;
  }
  return null;
}

export function withEcosystemCors<T>(
  req: NextRequest,
  res: NextResponse<T>
): NextResponse<T> {
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Vary", "Origin");
  }
  return res;
}

export function ecosystemPreflight(req: NextRequest): NextResponse {
  return withEcosystemCors(req, new NextResponse(null, { status: 204 }));
}
