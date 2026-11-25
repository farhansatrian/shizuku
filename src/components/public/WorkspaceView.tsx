"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Settings, User, UserPlus } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEcosystemAuth } from "@/components/providers/EcosystemAuthProvider";
import type { PortfolioPayload } from "@/lib/types";

const BADGE_ACCENTS: Record<string, string> = {
  HUB: "#745bc7",
  FINANCE: "#2276a8",
  LEDGER: "#d749d5",
  APP: "#2276a8",
  AGENT: "#d749d5",
  INTERNAL: "#745bc7",
};

function VnTypewriterBody({
  text,
  forceComplete,
}: {
  text: string;
  forceComplete: boolean;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || forceComplete || text.length === 0) return;

    let current = 0;
    const id = window.setInterval(() => {
      current += 2;
      if (current >= text.length) {
        setVisibleChars(text.length);
        window.clearInterval(id);
      } else {
        setVisibleChars(current);
      }
    }, 18);

    return () => window.clearInterval(id);
  }, [text, forceComplete]);

  const shownCount = forceComplete ? text.length : visibleChars;
  const isTyping = !forceComplete && shownCount < text.length;

  return (
    <p className="mt-2 min-h-[38px] font-mono text-xs leading-relaxed text-[#14100e] sm:text-[13px]">
      {text.slice(0, shownCount)}
      {isTyping && (
        <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-[#d749d5] align-middle" />
      )}
    </p>
  );
}

export function WorkspaceView({ data }: { data: PortfolioPayload }) {
  const { profile, workspaceApps } = data;
  const { locale, pick } = useLocale();
  const { user: ecoUser } = useEcosystemAuth();

  const [clock, setClock] = useState<{ time: string; date: string }>({
    time: "--:--",
    date: "",
  });
  const [umbrellaFailed, setUmbrellaFailed] = useState(false);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [dialogueReveal, setDialogueReveal] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const time = new Intl.DateTimeFormat(
          locale === "id" ? "id-ID" : "en-US",
          {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        ).format(now);
        const date = new Intl.DateTimeFormat(
          locale === "id" ? "id-ID" : "en-US",
          {
            timeZone: "Asia/Jakarta",
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        ).format(now);
        setClock({ time, date });
      } catch {
        setClock({ time: "--:--", date: profile.location });
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
  }, [locale, profile.location]);

  const dialogueLines = useMemo(() => {
    if (ecoUser) {
      return [
        pick(
          `Signed in as ${ecoUser.displayName}. One SHIZUKU ID connects every web app in this ecosystem.`,
          `Masuk sebagai ${ecoUser.displayName}. Satu SHIZUKU ID menghubungkan semua web app di ekosistem ini.`
        ),
        pick(
          "Manage or add upcoming ecosystem apps anytime from Admin Studio.",
          "Tambah atau ubah daftar aplikasi ekosistem kapan saja melalui Admin Studio."
        ),
      ];
    }

    return [
      pick(
        "One SHIZUKU ID — sign in once to use SHIKAS, SHIKOST, and upcoming companion apps.",
        "Satu SHIZUKU ID — buat akun sekali untuk dipakai di SHIKAS, SHIKOST, dan aplikasi ekosistem lainnya."
      ),
      pick(
        "Every work listed below is part of the SHIZUKU personal web ecosystem.",
        "Setiap aplikasi di bawah ini terhubung dalam satu ekosistem web SHIZUKU."
      ),
    ];
  }, [ecoUser, pick]);

  const safeDialogueIdx = dialogueIdx % dialogueLines.length;
  const currentDialogue = dialogueLines[safeDialogueIdx] ?? "";

  const handleAdvanceDialogue = () => {
    if (!dialogueReveal) {
      setDialogueReveal(true);
    } else {
      setDialogueReveal(false);
      setDialogueIdx((i) => i + 1);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Full-screen pink watercolor backdrop (/assets/bg-watercolor-pc.jpg) */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />

      {/* Authentic 20-drop vertical rain falling softly behind RPG frames */}
      <TuyuRainLayer behindContent />

      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-full max-w-[960px] flex-1 px-5 pt-28 pb-16 sm:px-8 md:pt-32 md:pb-20">
        {/* Minimal Centered Navigation (HOME · WORK · PORTFOLIO · ABOUT) */}
        <nav
          aria-label="Section navigation"
          className="mb-8 flex items-center justify-center gap-7 sm:gap-11 md:mb-10 md:gap-14"
        >
          <Link
            href="/"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("HOME", "BERANDA")}
          </Link>
          <span className="font-condensed border-b-[1.5px] border-[#14100e] pb-1 text-[17px] font-medium tracking-[0.14em] text-[#14100e] uppercase sm:text-[19px]">
            WORK
          </span>
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

        <div className="space-y-6">
          {/* =================================================================
              1. COMPACT 2-PANEL STAGE: Sanctuary Clock + Shared SHIZUKU ID
             ================================================================= */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left: SHIZUKU Umbrella & Jakarta Clock */}
            <div className="vn-frame flex flex-col justify-between overflow-hidden lg:col-span-5">
              <div className="vn-band-strip flex items-center justify-between gap-2 px-4 py-2 text-white">
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                  {profile.brandName.toUpperCase()} {"//"} {profile.brandKanji}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
                  WIB · JKT
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center px-5 py-6 text-center">
                <div className="animate-umbrella-float flex h-20 w-20 items-center justify-center border border-[#745bc7]/45 bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] p-2.5 shadow-[3px_3px_0_0_rgba(116,91,199,0.14)]">
                  {umbrellaFailed ? (
                    <UmbrellaMark className="h-10 w-10 text-[#745bc7]" />
                  ) : (
                    <img
                      src="/api/uploads/tuyu-umbrella.png"
                      alt={`${profile.brandName} umbrella`}
                      onError={() => setUmbrellaFailed(true)}
                      className="h-14 w-auto object-contain select-none"
                    />
                  )}
                </div>

                <p className="mt-4 font-mono text-[30px] font-bold leading-none tracking-[0.08em] text-[#14100e] tabular-nums">
                  {clock.time}
                </p>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-[#5d5370] uppercase">
                  {clock.date || profile.location}
                </p>
              </div>
            </div>

            {/* Right: Minimalist SHIZUKU ID Portal Card */}
            <div className="vn-frame flex flex-col justify-between overflow-hidden lg:col-span-7">
              <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-white">
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                  {"SHIZUKU ID // ECOSYSTEM"}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
                  {ecoUser ? pick("ACTIVE", "AKTIF") : "SSO"}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#745bc7]/20 pb-3">
                    <h1 className="font-editorial text-2xl font-bold tracking-[0.16em] text-[#14100e] uppercase sm:text-[26px]">
                      {ecoUser ? ecoUser.displayName : "SHIZUKU ID"}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#745bc7]">
                      <span
                        className="h-2 w-2 shrink-0"
                        style={{
                          backgroundColor: ecoUser ? "#2276a8" : "#745bc7",
                        }}
                      />
                      <span className="max-w-[200px] truncate">
                        {ecoUser
                          ? ecoUser.email
                          : pick("Single Sign-On", "Akun Terpadu")}
                      </span>
                    </span>
                  </div>

                  <p className="mt-3.5 text-[13px] leading-relaxed text-[#5d5370]">
                    {ecoUser
                      ? pick(
                          "Your shared account is active across SHIZUKU, SHIKAS, SHIKOST, and future apps.",
                          "Akun terpadumu aktif untuk SHIZUKU, SHIKAS, SHIKOST, dan aplikasi berikutnya."
                        )
                      : pick(
                          "One account for all web apps in the SHIZUKU ecosystem.",
                          "Satu akun untuk semua web app dalam ekosistem SHIZUKU."
                        )}
                  </p>
                </div>

                {/* Clean 2-Action RPG Button Row */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ecoUser ? (
                    <>
                      <Link href="/account" className="vn-btn-band px-4 py-2.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{pick("ACCOUNT", "AKUN SAYA")}</span>
                      </Link>
                      <Link href="/admin" className="vn-btn-action px-4 py-2.5">
                        <Settings className="h-3.5 w-3.5" />
                        <span>{pick("MANAGE WORK", "KELOLA WORK")}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/account?mode=login&redirect=/workspace"
                        className="vn-btn-band px-4 py-2.5"
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>{pick("SIGN IN", "MASUK")}</span>
                      </Link>
                      <Link
                        href="/account?mode=register&redirect=/workspace"
                        className="vn-btn-action px-4 py-2.5"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>{pick("CREATE ACCOUNT", "BUAT AKUN")}</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              2. SHORT VISUAL NOVEL NOTE (Minimalist SHIKAS Dialogue Box)
             ================================================================= */}
          <div
            onClick={handleAdvanceDialogue}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAdvanceDialogue();
              }
            }}
            className="vn-dialogue group cursor-pointer select-none p-4 transition hover:border-[#7650f3] sm:p-5"
            aria-label={pick(
              "Ecosystem note — click for next line",
              "Catatan ekosistem — klik untuk lanjut"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 flex-col items-center sm:flex">
                <div className="flex h-14 w-14 items-center justify-center border border-[#745bc7] bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] p-2">
                  {umbrellaFailed ? (
                    <UmbrellaMark className="h-8 w-8 text-[#745bc7]" />
                  ) : (
                    <img
                      src="/api/uploads/tuyu-umbrella.png"
                      alt="SHIZUKU"
                      onError={() => setUmbrellaFailed(true)}
                      className="h-10 w-auto object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 border-b border-[#745bc7]/20 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-sm font-bold tracking-[0.22em] text-[#745bc7] uppercase">
                      {profile.brandName}
                    </span>
                    <span className="font-mono text-[10px] text-[#5d5370]">
                      ({profile.brandKanji})
                    </span>
                  </div>
                  <span className="animate-vn-next font-mono text-[11px] font-bold text-[#d749d5]">
                    ▼
                  </span>
                </div>

                <VnTypewriterBody
                  key={`${safeDialogueIdx}-${currentDialogue}`}
                  text={currentDialogue}
                  forceComplete={dialogueReveal}
                />
              </div>
            </div>
          </div>

          {/* =================================================================
              3. ECOSYSTEM WORKS DECK (All Apps Shown Directly — Zero Filters)
             ================================================================= */}
          <section className="vn-frame overflow-hidden">
            <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-white">
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                {"ECOSYSTEM WORKS // 雫"}
              </span>
              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                <span className="text-white/95 drop-shadow-2xs">
                  {String(workspaceApps.length).padStart(2, "0")}{" "}
                  {pick("APPS", "APP")}
                </span>
                <Link
                  href="/admin"
                  className="border border-white/55 bg-white/15 px-2 py-0.5 text-[9.5px] font-semibold text-white transition hover:bg-white/30"
                >
                  {pick("EDIT", "ATUR")}
                </Link>
              </div>
            </div>

            {workspaceApps.length === 0 ? (
              <div className="bg-white/95 px-6 py-12 text-center">
                <p className="font-mono text-xs text-[#5d5370]">
                  {pick(
                    "No ecosystem apps yet. Add them anytime in /admin.",
                    "Belum ada aplikasi ekosistem. Tambahkan kapan saja di /admin."
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-white/95 p-4 sm:p-5">
                <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {workspaceApps.map((app, index) => {
                    const num = String(index + 1).padStart(2, "0");
                    const accent =
                      BADGE_ACCENTS[app.badge.toUpperCase()] ??
                      BADGE_ACCENTS[app.category.toUpperCase()] ??
                      "#745bc7";

                    const inner = (
                      <div className="vn-cmd group flex h-full flex-col justify-between p-4">
                        <span
                          aria-hidden="true"
                          className="absolute top-0 bottom-0 left-0 w-[3px] opacity-0 transition group-hover:opacity-100"
                          style={{ backgroundColor: accent }}
                        />

                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                              <span className="font-bold tracking-[0.14em] text-[#745bc7]">
                                {num}
                              </span>
                              <span
                                className="h-1.5 w-1.5 shrink-0"
                                style={{ backgroundColor: accent }}
                              />
                              {app.badge && (
                                <span
                                  className="border px-1.5 py-[1px] text-[9px] font-bold tracking-[0.12em] uppercase"
                                  style={{
                                    borderColor: accent,
                                    color: accent,
                                  }}
                                >
                                  {app.badge}
                                </span>
                              )}
                            </div>

                            {app.isExternal ? (
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#745bc7] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#745bc7] transition-transform group-hover:translate-x-0.5" />
                            )}
                          </div>

                          <h2 className="mt-3 flex items-center gap-1.5 font-editorial text-lg font-bold tracking-[0.12em] text-[#14100e] uppercase transition-colors group-hover:text-[#745bc7]">
                            <span className="font-mono text-[10px] text-[#d749d5] opacity-0 transition-opacity group-hover:opacity-100">
                              ▶
                            </span>
                            <span>{app.name}</span>
                          </h2>

                          <p className="mt-1.5 text-xs leading-relaxed text-[#5d5370]">
                            {pick(app.descriptionEn, app.descriptionId)}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-end border-t border-[#745bc7]/15 pt-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#745bc7] uppercase">
                          {app.isExternal
                            ? pick("OPEN ↗", "BUKA ↗")
                            : pick("ENTER →", "MASUK →")}
                        </div>
                      </div>
                    );

                    return (
                      <li key={app.id}>
                        {app.isExternal ? (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block h-full focus:outline-none"
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link
                            href={app.url}
                            className="block h-full focus:outline-none"
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
