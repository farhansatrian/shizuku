"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  useEcosystemAuth,
  type PublicEcosystemUser,
} from "@/components/providers/EcosystemAuthProvider";
import type { PortfolioPayload } from "@/lib/types";

type AuthMode = "login" | "register";

function isSafeInternalRedirect(value: string | null): value is string {
  if (!value) return false;
  return value.startsWith("/") && !value.startsWith("//");
}

export function AccountView({
  data,
  initialMode = "login",
}: {
  data: PortfolioPayload;
  initialMode?: AuthMode;
}) {
  const { profile, workspaceApps } = data;
  const { locale, pick } = useLocale();
  const { user, loading, setUser, signOut } = useEcosystemAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryMode = searchParams.get("mode");
  const redirectTarget = searchParams.get("redirect");

  const [manualMode, setManualMode] = useState<AuthMode | null>(null);
  const mode: AuthMode =
    manualMode ??
    (queryMode === "register"
      ? "register"
      : queryMode === "login"
        ? "login"
        : initialMode);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [shikasResult, setShikasResult] = useState<{
    userId: string;
    txCount: number | null;
  } | null>(null);

  // Fetch live SHIKAS sync summary once signed in (async state updates only)
  useEffect(() => {
    if (!user) return;
    let active = true;
    const currentUserId = user.id;

    fetch("/api/shikas/store", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!active) return;
        const count = Array.isArray(payload?.transactions)
          ? payload.transactions.length
          : 0;
        setShikasResult({ userId: currentUserId, txCount: count });
      })
      .catch(() => {
        if (!active) return;
        setShikasResult({ userId: currentUserId, txCount: null });
      });

    return () => {
      active = false;
    };
  }, [user]);

  const shikasSync = {
    loading: Boolean(user && shikasResult?.userId !== user.id),
    txCount:
      user && shikasResult?.userId === user.id ? shikasResult.txCount : null,
  };

  const shikasApp = useMemo(() => {
    const fromWorkspace = workspaceApps.find(
      (a) =>
        a.name.toLowerCase().includes("shikas") ||
        a.url.toLowerCase().includes("shikas")
    );
    if (fromWorkspace) return fromWorkspace;
    const envUrl = process.env.NEXT_PUBLIC_SHIKAS_URL?.trim();
    if (envUrl) {
      return {
        name: "SHIKAS",
        url: envUrl,
        isExternal: true,
      };
    }
    return null;
  }, [workspaceApps]);

  const resolveErrorMessage = (code: string | null): string | null => {
    if (!code) return null;
    switch (code) {
      case "INVALID_EMAIL":
        return pick(
          "Please enter a valid email address.",
          "Masukkan alamat email yang valid."
        );
      case "SHORT_PASSWORD":
        return pick(
          "Password must be at least 6 characters.",
          "Kata sandi minimal 6 karakter."
        );
      case "EMAIL_EXISTS":
        return pick(
          "This email is already registered with SHIZUKU ID. Try signing in instead.",
          "Email ini sudah terdaftar di SHIZUKU ID. Silakan masuk menggunakan akun tersebut."
        );
      case "ACCOUNT_NOT_FOUND":
        return pick(
          "No SHIZUKU ID found with this email. Create a new account first.",
          "Akun SHIZUKU ID dengan email ini belum ditemukan. Daftar akun baru terlebih dahulu."
        );
      case "INVALID_CREDENTIALS":
        return pick(
          "Incorrect email or password.",
          "Email atau kata sandi tidak sesuai."
        );
      case "NETWORK_ERROR":
        return pick(
          "Unable to reach SHIZUKU servers. Please try again.",
          "Tidak dapat terhubung ke server SHIZUKU. Silakan coba lagi."
        );
      default:
        return pick(
          "Authentication failed. Please check your details and try again.",
          "Autentikasi gagal. Periksa kembali data kamu lalu coba lagi."
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCode(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorCode("INVALID_EMAIL");
      return;
    }
    if (password.length < 6) {
      setErrorCode("SHORT_PASSWORD");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint =
        mode === "register" ? "/api/ecosystem/register" : "/api/ecosystem/login";
      const body =
        mode === "register"
          ? {
              email: trimmedEmail,
              ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
              password,
            }
          : {
              email: trimmedEmail,
              password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        user?: PublicEcosystemUser;
        error?: string;
      };

      if (!res.ok || !payload.user) {
        setErrorCode(payload.error || "AUTH_FAILED");
        return;
      }

      setUser(payload.user);
      setPassword("");

      if (isSafeInternalRedirect(redirectTarget)) {
        router.push(redirectTarget);
      }
    } catch {
      setErrorCode("NETWORK_ERROR");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setEmail("");
      setDisplayName("");
      setPassword("");
      setErrorCode(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSigningOut(false);
    }
  };

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "";
    try {
      return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(user.createdAt));
    } catch {
      return user.createdAt.slice(0, 10);
    }
  }, [user, locale]);

  const errorMessage = resolveErrorMessage(errorCode);

  return (
    <div className="tuyu-subpage-canvas relative flex min-h-screen flex-col text-[#14100e]">
      <TuyuRainLayer />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto flex w-[90%] max-w-[760px] flex-1 flex-col pt-28 pb-24 md:pt-36 md:pb-28">
        {/* Minimal Centered Gallery Navigation */}
        <nav
          aria-label="Section navigation"
          className="flex items-center justify-center gap-7 sm:gap-11 md:gap-14"
        >
          <Link
            href="/"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("HOME", "BERANDA")}
          </Link>
          <Link
            href="/workspace"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            WORK
          </Link>
          <Link
            href="/projects"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("PROJECT", "PROYEK")}
          </Link>
          <Link
            href="/about"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("ABOUT", "TENTANG")}
          </Link>
        </nav>

        {/* Loading State */}
        {loading ? (
          <div className="mx-auto mt-20 flex flex-col items-center gap-3 text-[#745bc7]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
              {pick("Checking SHIZUKU ID...", "Memeriksa SHIZUKU ID...")}
            </p>
          </div>
        ) : user ? (
          /* ================================================================
             SIGNED-IN VIEW: Pure Boxless SHIZUKU ID Hub
             ================================================================ */
          <section className="mx-auto mt-14 w-full max-w-[560px] md:mt-16">
            <div className="flex flex-col items-center text-center">
              <UmbrellaMark className="h-9 w-9 text-[#745bc7]" />
              <p className="mt-3 font-mono text-[11px] tracking-[0.26em] text-[#745bc7] uppercase">
                {profile.brandName.toUpperCase()} ID · {profile.brandKanji}
              </p>
              <h1 className="mt-2 font-editorial text-[28px] font-normal leading-tight tracking-[5px] text-[#745bc7] uppercase md:text-[36px] md:tracking-[7px]">
                {user.displayName}
              </h1>
              <p className="mt-2 font-mono text-xs tracking-[0.06em] text-[#5d5370]">
                {user.email}
                {memberSince && (
                  <>
                    <span className="mx-2 text-[#745bc7]/45">|</span>
                    {pick(`Since ${memberSince}`, `Sejak ${memberSince}`)}
                  </>
                )}
              </p>
            </div>

            <div className="raindrop-dotted my-10 w-full" />

            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-[#745bc7] uppercase">
                {pick("CONNECTED ECOSYSTEM", "EKOSISTEM TERHUBUNG")}
              </p>

              <ul className="mt-4">
                {/* 01 — SHIKAS Personal Cashflow */}
                <li className="tuyu-raindrop-line py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-[12px] tracking-[2px] text-[#745bc7]">
                          01
                        </span>
                        <span className="inline-block rounded-[5px] bg-[#745bc7] px-2 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase">
                          SHIKAS
                        </span>
                        <span className="font-mono text-[11px] text-[#5d5370]">
                          {shikasSync.loading
                            ? pick("Syncing...", "Menyinkronkan...")
                            : shikasSync.txCount !== null
                              ? pick(
                                  `${shikasSync.txCount} entries synced`,
                                  `${shikasSync.txCount} transaksi tersinkron`
                                )
                              : pick("Isolated cloud store", "Database cloud terisolasi")}
                        </span>
                      </div>
                      <h2 className="mt-2 text-[17px] text-[#14100e]">
                        {pick("SHIKAS — Personal Cashflow", "SHIKAS — Keuangan Pribadi")}
                      </h2>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#5d5370]">
                        {pick(
                          "Sign in to SHIKAS with this same email & password to sync your transactions privately.",
                          "Masuk ke SHIKAS dengan email & kata sandi yang sama untuk sinkronisasi transaksi secara privat."
                        )}
                      </p>
                    </div>

                    {shikasApp &&
                      (shikasApp.isExternal ? (
                        <a
                          href={shikasApp.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex shrink-0 items-center gap-1 font-mono text-[11px] tracking-[0.14em] text-[#745bc7] uppercase transition hover:text-[#7650f3]"
                        >
                          {pick("OPEN", "BUKA")}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={shikasApp.url}
                          className="mt-1 inline-flex shrink-0 items-center gap-1 font-mono text-[11px] tracking-[0.14em] text-[#745bc7] uppercase transition hover:text-[#7650f3]"
                        >
                          {pick("OPEN", "BUKA")}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                  </div>
                </li>

                {/* 02 — SHIZUKU Workspace */}
                <li className="tuyu-raindrop-line py-5">
                  <Link
                    href="/workspace"
                    className="group flex items-start justify-between gap-4 transition-opacity hover:opacity-75"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[12px] tracking-[2px] text-[#745bc7]">
                          02
                        </span>
                        <span className="inline-block rounded-[5px] bg-[#745bc7] px-2 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase">
                          WORK
                        </span>
                      </div>
                      <h2 className="mt-2 text-[17px] text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                        {pick("SHIZUKU Workspace", "SHIZUKU Workspace")}
                      </h2>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#5d5370]">
                        {pick(
                          "Daily hub, shortcuts, and upcoming personal AI agents under your SHIZUKU ID.",
                          "Pusat harian, pintasan aplikasi, dan AI agent mendatang di bawah SHIZUKU ID kamu."
                        )}
                      </p>
                    </div>
                    <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-[#745bc7] transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="tuyu-more-btn gap-2 disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>{pick("SIGN OUT", "KELUAR")}</span>
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================
             SIGNED-OUT VIEW: Serene Minimalist TUYU Sign In / Register
             ================================================================ */
          <section className="mx-auto mt-14 w-full max-w-[430px] md:mt-16">
            <div className="flex flex-col items-center text-center">
              <UmbrellaMark className="h-9 w-9 text-[#745bc7]" />
              <p className="mt-3 font-mono text-[11px] tracking-[0.26em] text-[#745bc7] uppercase">
                {profile.brandName.toUpperCase()} ID · {profile.brandKanji}
              </p>
              <h1 className="mt-2 font-editorial text-[28px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[34px] md:tracking-[9px]">
                {mode === "login"
                  ? pick("SIGN IN", "MASUK")
                  : pick("REGISTER", "DAFTAR")}
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-[#5d5370]">
                {pick(
                  "One account across shizuku, shikas, and future companion apps.",
                  "Satu akun untuk shizuku, shikas, dan aplikasi ekosistem berikutnya."
                )}
              </p>
            </div>

            {/* Exact tuyu.moe pipe-separated mode switcher */}
            <div className="mt-8 flex justify-center">
              <ul className="flex items-center">
                <li className="border-x border-[#745bc7]">
                  <button
                    type="button"
                    onClick={() => {
                      setManualMode("login");
                      setErrorCode(null);
                    }}
                    className={`px-5 py-0.5 font-editorial text-[13px] tracking-[3px] text-[#745bc7] uppercase transition hover:text-[#d749d5] ${
                      mode === "login" ? "font-bold" : "font-normal opacity-75"
                    }`}
                  >
                    {pick("SIGN IN", "MASUK")}
                  </button>
                </li>
                <li className="border-r border-[#745bc7]">
                  <button
                    type="button"
                    onClick={() => {
                      setManualMode("register");
                      setErrorCode(null);
                    }}
                    className={`px-5 py-0.5 font-editorial text-[13px] tracking-[3px] text-[#745bc7] uppercase transition hover:text-[#d749d5] ${
                      mode === "register"
                        ? "font-bold"
                        : "font-normal opacity-75"
                    }`}
                  >
                    {pick("REGISTER", "DAFTAR")}
                  </button>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="eco-display-name"
                    className="block font-mono text-[10px] tracking-[0.2em] text-[#745bc7] uppercase"
                  >
                    {pick("Display Name (optional)", "Nama Tampilan (opsional)")}
                  </label>
                  <input
                    id="eco-display-name"
                    type="text"
                    autoComplete="name"
                    maxLength={60}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={pick("e.g. Farhan", "mis. Farhan")}
                    className="mt-1.5 w-full border-b border-[#745bc7]/50 bg-transparent py-2.5 text-[15px] text-[#14100e] outline-none transition placeholder:text-[#745bc7]/45 focus:border-[#7650f3]"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="eco-email"
                  className="block font-mono text-[10px] tracking-[0.2em] text-[#745bc7] uppercase"
                >
                  {pick("Email", "Email")}
                </label>
                <input
                  id="eco-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full border-b border-[#745bc7]/50 bg-transparent py-2.5 text-[15px] text-[#14100e] outline-none transition placeholder:text-[#745bc7]/45 focus:border-[#7650f3]"
                />
              </div>

              <div>
                <label
                  htmlFor="eco-password"
                  className="block font-mono text-[10px] tracking-[0.2em] text-[#745bc7] uppercase"
                >
                  {pick("Password", "Kata Sandi")}
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="eco-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={pick("Minimum 6 characters", "Minimal 6 karakter")}
                    className="w-full border-b border-[#745bc7]/50 bg-transparent py-2.5 pr-9 text-[15px] text-[#14100e] outline-none transition placeholder:text-[#745bc7]/45 focus:border-[#7650f3]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-1 -translate-y-1/2 p-1 text-[#745bc7]/70 transition hover:text-[#745bc7]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="border-l-2 border-rose-500 pl-3 text-[13px] text-rose-700"
                >
                  {errorMessage}
                </p>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-[40px] min-w-[210px] items-center justify-center gap-2 rounded-full border border-[#745bc7] bg-[#745bc7] px-7 font-editorial text-[14px] font-bold tracking-[0.22em] text-white uppercase transition hover:bg-[#7650f3] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {mode === "login"
                      ? pick("SIGN IN", "MASUK")
                      : pick("CREATE ID", "BUAT AKUN")}
                  </span>
                </button>
              </div>
            </form>

            <div className="raindrop-dotted mt-12 mb-6 w-full" />

            <p className="text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-[#5d5370]">
              {pick(
                "Protected by isolated per-user sessions. Separate from portfolio Admin CMS.",
                "Dilindungi sesi terisolasi per pengguna. Terpisah dari Admin CMS portofolio."
              )}
            </p>
          </section>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
