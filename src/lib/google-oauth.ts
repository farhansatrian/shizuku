import "server-only";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { isAllowedEcosystemOrigin } from "@/lib/ecosystem-auth";

export const GOOGLE_OAUTH_COOKIE_NAME = "shizuku_google_oauth";
export const GOOGLE_OAUTH_SENTINEL_PREFIX = "$oauth$google$";

function getOAuthStateSecret(): Uint8Array {
  const raw =
    process.env.ECOSYSTEM_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "shizuku-fallback-dev-secret-please-set-auth-secret-in-env";
  return new TextEncoder().encode(`google-oauth:${raw}`);
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured(): boolean {
  return getGoogleOAuthConfig() !== null;
}

export function resolvePublicBaseUrl(req: NextRequest): string {
  const configured = (process.env.PUBLIC_BASE_URL || "").trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const forwardedHost = req.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    const proto =
      forwardedProto === "http" || forwardedProto === "https"
        ? forwardedProto
        : "https";
    return `${proto}://${forwardedHost}`;
  }

  return req.nextUrl.origin.replace(/\/+$/, "");
}

export function sanitizeRedirectPath(value: string | null): string {
  if (!value) return "/account";
  const trimmed = value.trim();

  // Internal relative path on shizuku
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  // External companion app URL strictly validated against ECOSYSTEM_ALLOWED_ORIGINS
  try {
    const parsed = new URL(trimmed);
    if (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      isAllowedEcosystemOrigin(parsed.origin)
    ) {
      return `${parsed.origin}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Ignore malformed redirect URLs
  }

  return "/account";
}

export function isExternalRedirectTarget(target: string): boolean {
  return target.startsWith("http://") || target.startsWith("https://");
}

export function createPkceChallenge(): {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
} {
  const state = crypto.randomBytes(24).toString("base64url");
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { state, codeVerifier, codeChallenge };
}

export interface GoogleOAuthCookiePayload {
  state: string;
  codeVerifier: string;
  redirect: string;
}

export async function signOAuthStateCookie(
  payload: GoogleOAuthCookiePayload
): Promise<string> {
  return new SignJWT({
    state: payload.state,
    codeVerifier: payload.codeVerifier,
    redirect: payload.redirect,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getOAuthStateSecret());
}

export async function verifyOAuthStateCookie(
  token: string
): Promise<GoogleOAuthCookiePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getOAuthStateSecret());
    if (
      typeof payload.state !== "string" ||
      typeof payload.codeVerifier !== "string" ||
      typeof payload.redirect !== "string"
    ) {
      return null;
    }
    return {
      state: payload.state,
      codeVerifier: payload.codeVerifier,
      redirect: sanitizeRedirectPath(payload.redirect),
    };
  } catch {
    return null;
  }
}

export function timingSafeStringsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getGoogleOAuthCookieOptions(clear = false) {
  const secure = process.env.COOKIE_SECURE === "true";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/api/ecosystem/google",
    maxAge: clear ? 0 : 60 * 10, // 10 minutes
  };
}

export function createGoogleOAuthSentinelHash(): string {
  return `${GOOGLE_OAUTH_SENTINEL_PREFIX}${crypto.randomBytes(24).toString("hex")}`;
}
