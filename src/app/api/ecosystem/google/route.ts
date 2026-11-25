import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_OAUTH_COOKIE_NAME,
  createPkceChallenge,
  getGoogleOAuthConfig,
  getGoogleOAuthCookieOptions,
  resolvePublicBaseUrl,
  sanitizeRedirectPath,
  signOAuthStateCookie,
} from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const baseUrl = resolvePublicBaseUrl(req);
  const config = getGoogleOAuthConfig();
  const redirectTarget = sanitizeRedirectPath(
    req.nextUrl.searchParams.get("redirect")
  );

  if (!config) {
    const fallbackUrl = new URL("/account", baseUrl);
    fallbackUrl.searchParams.set("oauthError", "GOOGLE_NOT_CONFIGURED");
    return NextResponse.redirect(fallbackUrl);
  }

  const { state, codeVerifier, codeChallenge } = createPkceChallenge();
  const signedState = await signOAuthStateCookie({
    state,
    codeVerifier,
    redirect: redirectTarget,
  });

  const callbackUri = `${baseUrl}/api/ecosystem/google/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("redirect_uri", callbackUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authUrl);
  res.cookies.set(
    GOOGLE_OAUTH_COOKIE_NAME,
    signedState,
    getGoogleOAuthCookieOptions(false)
  );
  return res;
}
