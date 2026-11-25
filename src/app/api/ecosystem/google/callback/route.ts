import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ECOSYSTEM_COOKIE_NAME,
  createEcosystemToken,
  getEcosystemCookieOptions,
} from "@/lib/ecosystem-auth";
import {
  GOOGLE_OAUTH_COOKIE_NAME,
  createGoogleOAuthSentinelHash,
  getGoogleOAuthConfig,
  getGoogleOAuthCookieOptions,
  resolvePublicBaseUrl,
  sanitizeRedirectPath,
  timingSafeStringsEqual,
  verifyOAuthStateCookie,
} from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

function redirectWithError(baseUrl: string, code: string) {
  const url = new URL("/account", baseUrl);
  url.searchParams.set("oauthError", code);
  const res = NextResponse.redirect(url);
  res.cookies.set(
    GOOGLE_OAUTH_COOKIE_NAME,
    "",
    getGoogleOAuthCookieOptions(true)
  );
  return res;
}

export async function GET(req: NextRequest) {
  const baseUrl = resolvePublicBaseUrl(req);
  const config = getGoogleOAuthConfig();

  if (!config) {
    return redirectWithError(baseUrl, "GOOGLE_NOT_CONFIGURED");
  }

  const googleError = req.nextUrl.searchParams.get("error");
  if (googleError) {
    return redirectWithError(
      baseUrl,
      googleError === "access_denied" ? "GOOGLE_CANCELLED" : "GOOGLE_AUTH_FAILED"
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const returnedState = req.nextUrl.searchParams.get("state");
  const cookieToken = req.cookies.get(GOOGLE_OAUTH_COOKIE_NAME)?.value;

  if (!code || !returnedState || !cookieToken) {
    return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
  }

  const stored = await verifyOAuthStateCookie(cookieToken);
  if (!stored || !timingSafeStringsEqual(stored.state, returnedState)) {
    return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
  }

  try {
    const callbackUri = `${baseUrl}/api/ecosystem/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: callbackUri,
        grant_type: "authorization_code",
        code_verifier: stored.codeVerifier,
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", tokenRes.status);
      return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
    }

    const tokenPayload = (await tokenRes.json()) as {
      access_token?: string;
    };

    if (!tokenPayload.access_token) {
      return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
    }

    const userInfoRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!userInfoRes.ok) {
      console.error("Google userinfo fetch failed:", userInfoRes.status);
      return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
    }

    const profile = (await userInfoRes.json()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };

    if (!profile.email || profile.email_verified !== true) {
      return redirectWithError(baseUrl, "GOOGLE_EMAIL_UNVERIFIED");
    }

    const normalizedEmail = profile.email.trim().toLowerCase();
    const fallbackName = normalizedEmail.split("@")[0] || "SHIZUKU User";
    const resolvedDisplayName = (profile.name || fallbackName)
      .trim()
      .slice(0, 60);

    // Find existing SHIZUKU ID by verified email (preserves existing SHIKAS data!)
    // or create a new EcosystemUser cleanly.
    let dbUser = await prisma.ecosystemUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!dbUser) {
      dbUser = await prisma.ecosystemUser.create({
        data: {
          email: normalizedEmail,
          displayName: resolvedDisplayName || fallbackName,
          passwordHash: createGoogleOAuthSentinelHash(),
        },
      });
    }

    const sessionUser = {
      id: dbUser.id,
      email: dbUser.email,
      displayName: dbUser.displayName,
      createdAt: dbUser.createdAt.toISOString(),
    };

    const sessionToken = await createEcosystemToken(sessionUser);
    const destination = new URL(sanitizeRedirectPath(stored.redirect), baseUrl);

    const res = NextResponse.redirect(destination);
    res.cookies.set(
      ECOSYSTEM_COOKIE_NAME,
      sessionToken,
      getEcosystemCookieOptions()
    );
    res.cookies.set(
      GOOGLE_OAUTH_COOKIE_NAME,
      "",
      getGoogleOAuthCookieOptions(true)
    );
    return res;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return redirectWithError(baseUrl, "GOOGLE_AUTH_FAILED");
  }
}
