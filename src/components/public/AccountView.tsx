"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  ShieldCheck,
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
  const initialLetter = user
    ? (user.displayName.trim() || user.email).slice(0, 1).toUpperCase()
    : "";

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Consistent pink watercolor backdrop (/assets/bg-watercolor-pc.jpg) */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />
      <TuyuRainLayer behindContent />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto flex w-[92%] max-w-[760px] flex-1 flex-col pt-28 pb-24 md:pt-34 md:pb-28">
        {/* Minimal Centered Navigation */}
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
            href="/portfolio"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            PORTFOLIO
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
          <div className="vn-frame mx-auto mt-12 w-full max-w-[440px] overflow-hidden">
            <div className="flex flex-col items-center gap-3 bg-white/95 px-6 py-14 text-[#745bc7]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
                {pick("Checking SHIZUKU ID...", "Memeriksa SHIZUKU ID...")}
              </p>
            </div>
          </div>
        ) : user ? (
          /* ================================================================
             SIGNED-IN VIEW: Crisp SHIZUKU ID Account Hub (.vn-frame)
             ================================================================ */
          <section className="vn-frame mx-auto mt-10 w-full max-w-[600px] overflow-hidden md:mt-12">
            <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-white">
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                {profile.brandName.toUpperCase()} {"ID //"} {profile.brandKanji}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {pick("SIGNED IN", "AKTIF")}
              </span>
            </div>

            <div className="bg-white/96 p-6 sm:p-8">
              {/* Identity Row */}
              <div className="flex flex-col gap-4 border-b border-[#745bc7]/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border-[1.5px] border-[#745bc7] bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] font-editorial text-xl font-bold text-[#745bc7]">
                    {initialLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h1 className="truncate font-editorial text-xl font-bold tracking-[0.08em] text-[#14100e] uppercase sm:text-2xl">
                        {user.displayName}
                      </h1>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                    <p className="truncate font-mono text-xs text-[#5d5370]">
                      {user.email}
                    </p>
                    {memberSince && (
                      <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-[#7b6f94] uppercase">
                        {pick(`Member since ${memberSince}`, `Bergabung ${memberSince}`)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 border-[1.5px] border-rose-400 bg-white px-3.5 py-2 font-mono text-[10.5px] font-semibold tracking-[0.12em] text-rose-600 uppercase transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                >
                  {signingOut ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  <span>{pick("SIGN OUT", "KELUAR")}</span>
                </button>
              </div>

              {/* Connected Ecosystem Apps */}
              <div className="mt-6">
                <p className="font-mono text-[10.5px] font-semibold tracking-[0.18em] text-[#745bc7] uppercase">
                  {pick("CONNECTED ECOSYSTEM", "EKOSISTEM TERHUBUNG")}
                </p>

                <div className="mt-3 space-y-3">
                  {/* 01 — SHIKAS */}
                  <div className="vn-cmd flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                        <span className="font-bold text-[#745bc7]">01</span>
                        <span className="border border-[#2276a8] px-1.5 py-0.5 text-[9.5px] font-bold text-[#2276a8] uppercase">
                          SHIKAS
                        </span>
                        <span className="text-[#5d5370]">
                          {shikasSync.loading
                            ? pick("Syncing...", "Menyinkronkan...")
                            : shikasSync.txCount !== null
                              ? pick(
                                  `${shikasSync.txCount} entries synced`,
                                  `${shikasSync.txCount} transaksi tersinkron`
                                )
                              : pick("Isolated cloud store", "Database terisolasi")}
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-sm font-bold text-[#14100e]">
                        {pick(
                          "SHIKAS — Personal Cashflow",
                          "SHIKAS — Keuangan Pribadi"
                        )}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#5d5370]">
                        {pick(
                          "Sign in to SHIKAS with this same email & password to sync privately.",
                          "Masuk ke SHIKAS dengan email & kata sandi ini untuk sinkronisasi privat."
                        )}
                      </p>
                    </div>

                    {shikasApp &&
                      (shikasApp.isExternal ? (
                        <a
                          href={shikasApp.url}
                          target="_blank"
                          rel="noreferrer"
                          className="vn-btn-band shrink-0 px-3.5 py-2 text-[10px]"
                        >
                          <span>{pick("OPEN", "BUKA")}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={shikasApp.url}
                          className="vn-btn-band shrink-0 px-3.5 py-2 text-[10px]"
                        >
                          <span>{pick("OPEN", "BUKA")}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                  </div>

                  {/* 02 — WORK Hub */}
                  <Link
                    href="/workspace"
                    className="vn-cmd group flex items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="font-bold text-[#745bc7]">02</span>
                        <span className="border border-[#745bc7] px-1.5 py-0.5 text-[9.5px] font-bold text-[#745bc7] uppercase">
                          WORK
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-sm font-bold text-[#14100e] transition-colors group-hover:text-[#745bc7]">
                        {pick("SHIZUKU Ecosystem Works", "Daftar Aplikasi Ekosistem")}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#5d5370]">
                        {pick(
                          "Browse SHIZUKU, SHIKAS, SHIKOST, and upcoming companion apps.",
                          "Lihat SHIZUKU, SHIKAS, SHIKOST, dan aplikasi ekosistem berikutnya."
                        )}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#745bc7] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* ================================================================
             SIGNED-OUT VIEW: Crisp SHIZUKU / SHIKAS Sign In & Register Card
             ================================================================ */
          <section className="vn-frame mx-auto mt-10 w-full max-w-[460px] overflow-hidden md:mt-12">
            {/* Signature Watercolor Band Strip */}
            <div className="vn-band-strip flex items-center justify-between gap-2 px-5 py-2.5 text-white">
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                {profile.brandName.toUpperCase()} {"ID //"} {profile.brandKanji}
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
                {mode === "login"
                  ? pick("SIGN IN", "MASUK")
                  : pick("REGISTER", "DAFTAR")}
              </span>
            </div>

            <div className="bg-white/96 p-6 sm:p-8">
              {/* Emblem & Title */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center border border-[#745bc7]/45 bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] text-[#745bc7] shadow-[2px_2px_0_0_rgba(116,91,199,0.14)]">
                  <UmbrellaMark className="h-6 w-6" />
                </div>
                <h1 className="mt-4 font-editorial text-2xl font-bold tracking-[0.18em] text-[#14100e] uppercase sm:text-[26px]">
                  {mode === "login"
                    ? pick("SIGN IN", "MASUK")
                    : pick("CREATE ACCOUNT", "BUAT AKUN")}
                </h1>
                <p className="mt-1.5 text-xs leading-relaxed text-[#5d5370]">
                  {pick(
                    "One SHIZUKU ID across SHIZUKU, SHIKAS, SHIKOST, and future apps.",
                    "Satu SHIZUKU ID untuk SHIZUKU, SHIKAS, SHIKOST, dan aplikasi berikutnya."
                  )}
                </p>
              </div>

              {/* Clean Sharp 2-Tab Mode Switcher */}
              <div
                role="tablist"
                aria-label="Authentication mode"
                className="mt-6 grid grid-cols-2 border-[1.5px] border-[#745bc7] bg-[#fdfbff] font-mono text-[11px]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  onClick={() => {
                    setManualMode("login");
                    setErrorCode(null);
                  }}
                  className={`py-2.5 font-semibold tracking-[0.14em] uppercase transition ${
                    mode === "login"
                      ? "bg-[#745bc7] text-white"
                      : "text-[#5d5370] hover:bg-[#efe9fd] hover:text-[#14100e]"
                  }`}
                >
                  {pick("SIGN IN", "MASUK")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "register"}
                  onClick={() => {
                    setManualMode("register");
                    setErrorCode(null);
                  }}
                  className={`border-l border-[#745bc7] py-2.5 font-semibold tracking-[0.14em] uppercase transition ${
                    mode === "register"
                      ? "bg-[#745bc7] text-white"
                      : "text-[#5d5370] hover:bg-[#efe9fd] hover:text-[#14100e]"
                  }`}
                >
                  {pick("REGISTER", "DAFTAR")}
                </button>
              </div>

              {/* Crisp Bordered Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {mode === "register" && (
                  <div>
                    <label
                      htmlFor="eco-display-name"
                      className="block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#5d5370] uppercase"
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
                      className="shizuku-input mt-1.5 w-full border border-[#745bc7]/45 bg-white px-3.5 py-2.5 text-sm text-[#14100e] outline-none transition placeholder:text-[#8b7fa6] focus:border-[#745bc7] focus:ring-2 focus:ring-[#745bc7]/15"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="eco-email"
                    className="block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#5d5370] uppercase"
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
                    className="shizuku-input mt-1.5 w-full border border-[#745bc7]/45 bg-white px-3.5 py-2.5 text-sm text-[#14100e] outline-none transition placeholder:text-[#8b7fa6] focus:border-[#745bc7] focus:ring-2 focus:ring-[#745bc7]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eco-password"
                    className="block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#5d5370] uppercase"
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
                      placeholder={pick(
                        "Minimum 6 characters",
                        "Minimal 6 karakter"
                      )}
                      className="shizuku-input w-full border border-[#745bc7]/45 bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#14100e] outline-none transition placeholder:text-[#8b7fa6] focus:border-[#745bc7] focus:ring-2 focus:ring-[#745bc7]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-[#745bc7]/70 transition hover:text-[#745bc7]"
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
                    className="border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs leading-relaxed text-rose-700"
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="vn-btn-band mt-2 w-full py-3 text-[11px] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {mode === "login"
                      ? pick("SIGN IN", "MASUK")
                      : pick("CREATE SHIZUKU ID", "BUAT SHIZUKU ID")}
                  </span>
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#745bc7]/18 pt-4 text-center font-mono text-[10px] leading-relaxed text-[#6a5e82]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#745bc7]" />
                <span>
                  {pick(
                    "Isolated per-user ecosystem session · Separate from Admin Studio",
                    "Sesi ekosistem terisolasi per pengguna · Terpisah dari Admin Studio"
                  )}
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
