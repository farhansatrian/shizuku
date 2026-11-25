"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEcosystemAuth } from "@/components/providers/EcosystemAuthProvider";
import type { PortfolioPayload } from "@/lib/types";

const GAUGE_SEGMENTS = 20;

const CATEGORY_COLORS: Record<string, string> = {
  APP: "#2276a8",
  AGENT: "#d749d5",
  INTERNAL: "#745bc7",
  BOOKMARK: "#7650f3",
};

function SegmentedRpgBar({
  percent,
  variant,
}: {
  percent: number;
  variant: "blue" | "magenta";
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filledCount = Math.round((clamped / 100) * GAUGE_SEGMENTS);

  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${GAUGE_SEGMENTS}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: GAUGE_SEGMENTS }).map((_, i) => {
        const active = i < filledCount;
        let bg = "rgba(116, 91, 199, 0.13)";
        if (active) {
          bg =
            variant === "blue"
              ? i < 10
                ? "#2276a8"
                : "#745bc7"
              : i < 10
                ? "#d749d5"
                : "#b8339f";
        }
        return (
          <span
            key={i}
            className="h-2.5 w-full transition-colors duration-200"
            style={{ backgroundColor: bg }}
          />
        );
      })}
    </div>
  );
}

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
    <p className="mt-2.5 min-h-[42px] font-mono text-xs leading-relaxed text-[#14100e] sm:text-[13px]">
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

  const [category, setCategory] = useState<string>("ALL");
  const [query, setQuery] = useState("");
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

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(workspaceApps.map((a) => a.category)));
    return ["ALL", ...uniq];
  }, [workspaceApps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workspaceApps.filter((a) => {
      const catOk = category === "ALL" || a.category === category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.descriptionEn.toLowerCase().includes(q) ||
        a.descriptionId.toLowerCase().includes(q) ||
        a.badge.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [workspaceApps, category, query]);

  const liveAppsCount = useMemo(
    () =>
      workspaceApps.filter(
        (a) => a.badge.trim().toUpperCase() !== "PLANNED"
      ).length,
    [workspaceApps]
  );

  const plannedCount = workspaceApps.length - liveAppsCount;
  const activeRatio =
    workspaceApps.length > 0
      ? Math.round((liveAppsCount / workspaceApps.length) * 100)
      : 0;
  const agentRatio =
    workspaceApps.length > 0
      ? Math.min(100, Math.max(15, Math.round((plannedCount / workspaceApps.length) * 100) + 20))
      : 25;

  const dialogueLines = useMemo(() => {
    const lines: string[] = [];
    if (ecoUser) {
      lines.push(
        pick(
          `Welcome back, ${ecoUser.displayName}. Your SHIZUKU ID (${ecoUser.email}) is synced across workspace & SHIKAS.`,
          `Selamat datang kembali, ${ecoUser.displayName}. SHIZUKU ID (${ecoUser.email}) aktif dan tersinkron dengan workspace & SHIKAS.`
        )
      );
    } else {
      lines.push(
        pick(
          `SHIZUKU Workspace ready with ${workspaceApps.length} modules. Sign in with SHIZUKU ID to share one session with SHIKAS & companion apps.`,
          `SHIZUKU Workspace siap dengan ${workspaceApps.length} modul. Masuk dengan SHIZUKU ID untuk berbagi satu sesi bersama SHIKAS & aplikasi lainnya.`
        )
      );
    }

    lines.push(
      pick(
        "Agent Workspace is architected as the next phase — personal AI workflow runners and private automations will live directly inside this shell.",
        "Agent Workspace disiapkan sebagai tahap berikutnya — asisten AI pribadi dan otomasi harian akan berjalan langsung di dalam shell ini."
      )
    );

    lines.push(
      pick(
        "You can add, reorder, or customize every workspace shortcut anytime from Admin Studio without redeploying.",
        "Kamu bisa menambah, mengurutkan, atau mengubah setiap pintasan workspace kapan saja dari Admin Studio tanpa deploy ulang."
      )
    );
    return lines;
  }, [ecoUser, workspaceApps.length, pick]);

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

  const hasActiveFilter = category !== "ALL" || query.trim() !== "";

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Exact SHIKAS full-screen pink watercolor backdrop (/assets/bg-watercolor-pc.jpg) */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />

      {/* Authentic 20-drop pure CSS vertical rain gently falling behind RPG frames */}
      <TuyuRainLayer behindContent />

      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-full max-w-[960px] flex-1 px-5 pt-28 pb-16 sm:px-8 md:pt-32 md:pb-20">
        {/* Minimal Centered Gallery Nav (Consistent across Home, Work, Portfolio, About) */}
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
              1. TOP STAGE: SHIZUKU Sanctuary Clock + RPG Command Status Panel
             ================================================================= */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left: SHIZUKU Sanctuary Vessel / Live Jakarta Time Frame */}
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
                <div className="animate-umbrella-float flex h-24 w-24 items-center justify-center border border-[#745bc7]/45 bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] p-3 shadow-[3px_3px_0_0_rgba(116,91,199,0.14)]">
                  {umbrellaFailed ? (
                    <UmbrellaMark className="h-12 w-12 text-[#745bc7]" />
                  ) : (
                    <img
                      src="/api/uploads/tuyu-umbrella.png"
                      alt={`${profile.brandName} umbrella`}
                      onError={() => setUmbrellaFailed(true)}
                      className="h-16 w-auto object-contain select-none"
                    />
                  )}
                </div>

                <p className="mt-5 font-mono text-[32px] font-bold leading-none tracking-[0.08em] text-[#14100e] tabular-nums">
                  {clock.time}
                </p>
                <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.16em] text-[#5d5370] uppercase">
                  {clock.date || profile.location}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 border border-[#745bc7]/40 bg-white/80 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
                  <span
                    className="h-2 w-2 shrink-0"
                    style={{
                      backgroundColor: ecoUser ? "#2276a8" : "#745bc7",
                    }}
                  />
                  <span className="text-[#14100e]">
                    {ecoUser
                      ? pick("ECOSYSTEM SYNCED", "EKOSISTEM AKTIF")
                      : pick("WORKSPACE READY", "WORKSPACE SIAP")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: RPG Command & SHIZUKU ID Status Panel */}
            <div className="vn-frame flex flex-col justify-between overflow-hidden lg:col-span-7">
              <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-white">
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                  {"WORKSPACE // COMMAND HUB"}
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
                  {String(workspaceApps.length).padStart(2, "0")}{" "}
                  {pick("MODULES", "MODUL")}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
                {/* Identity / Title Readout */}
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#745bc7]/20 pb-3.5">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-[#5d5370] uppercase">
                      {ecoUser ? "SHIZUKU ID // ACTIVE" : "DAILY HUB // 雫"}
                    </p>
                    <h1 className="mt-1 truncate font-editorial text-2xl font-bold tracking-[0.16em] text-[#14100e] uppercase sm:text-[28px]">
                      {ecoUser ? ecoUser.displayName : "WORKSPACE"}
                    </h1>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-mono text-[10px] tracking-[0.16em] text-[#5d5370] uppercase">
                      {ecoUser ? pick("ACCOUNT", "AKUN") : pick("SESSION", "SESI")}
                    </p>
                    <p className="mt-0.5 max-w-[200px] truncate font-mono text-xs font-bold text-[#745bc7]">
                      {ecoUser ? ecoUser.email : pick("Guest Mode", "Mode Tamu")}
                    </p>
                  </div>
                </div>

                {/* Notched 20-Segment RPG Gauges (Exact SHIKAS aesthetic) */}
                <div className="space-y-2.5">
                  <div>
                    <div className="mb-1 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
                      <span className="font-semibold text-[#2276a8]">
                        {pick("LIVE MODULES", "MODUL AKTIF")}
                      </span>
                      <span className="font-semibold text-[#14100e]">
                        {liveAppsCount} / {workspaceApps.length} ({activeRatio}%)
                      </span>
                    </div>
                    <SegmentedRpgBar percent={activeRatio} variant="blue" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
                      <span className="font-semibold text-[#c837a5]">
                        {pick("AGENT ROADMAP", "ROADMAP AGENT")}
                      </span>
                      <span className="font-semibold text-[#14100e]">
                        {pick("NEXT PHASE", "TAHAP BERIKUTNYA")}
                      </span>
                    </div>
                    <SegmentedRpgBar percent={agentRatio} variant="magenta" />
                  </div>
                </div>

                {/* Inline 2-Cell Interactive Category Stat Strip */}
                <div className="grid grid-cols-2 border border-[#745bc7]/30 bg-white/60">
                  <button
                    type="button"
                    onClick={() =>
                      setCategory(category === "APP" ? "ALL" : "APP")
                    }
                    className={`border-r border-[#745bc7]/30 px-3 py-2 text-left transition ${
                      category === "APP"
                        ? "bg-[#2276a8]/12"
                        : "hover:bg-[#e5dcfb]/45"
                    }`}
                  >
                    <span className="flex items-center justify-between font-mono text-[9px] tracking-[0.16em] text-[#5d5370] uppercase">
                      <span>{pick("APPS & TOOLS", "APLIKASI")}</span>
                      {category === "APP" && (
                        <span className="text-[#2276a8]">▶</span>
                      )}
                    </span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[#2276a8] sm:text-base">
                      {String(
                        workspaceApps.filter((a) => a.category === "APP").length
                      ).padStart(2, "0")}{" "}
                      <span className="text-[11px] font-medium text-[#5d5370]">
                        {pick("READY", "SIAP")}
                      </span>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategory(category === "AGENT" ? "ALL" : "AGENT")
                    }
                    className={`px-3 py-2 text-left transition ${
                      category === "AGENT"
                        ? "bg-[#d749d5]/12"
                        : "hover:bg-[#e5dcfb]/45"
                    }`}
                  >
                    <span className="flex items-center justify-between font-mono text-[9px] tracking-[0.16em] text-[#5d5370] uppercase">
                      <span>{pick("AI AGENTS", "AI AGENT")}</span>
                      {category === "AGENT" && (
                        <span className="text-[#c837a5]">▶</span>
                      )}
                    </span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[#c837a5] sm:text-base">
                      {String(
                        workspaceApps.filter((a) => a.category === "AGENT")
                          .length
                      ).padStart(2, "0")}{" "}
                      <span className="text-[11px] font-medium text-[#5d5370]">
                        {pick("QUEUED", "RENCANA")}
                      </span>
                    </p>
                  </button>
                </div>

                {/* 2 Sharp RPG Primary Action Buttons */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    href={ecoUser ? "/account" : "/account?redirect=/workspace"}
                    className="vn-btn-band px-4 py-2.5"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>
                      {ecoUser
                        ? pick("SHIZUKU ACCOUNT", "AKUN SHIZUKU")
                        : pick("SIGN IN · SHIZUKU ID", "MASUK · SHIZUKU ID")}
                    </span>
                  </Link>
                  <Link href="/admin" className="vn-btn-action px-4 py-2.5">
                    <Settings className="h-3.5 w-3.5" />
                    <span>{pick("CUSTOMIZE APPS", "ATUR APLIKASI")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              2. VISUAL NOVEL DIALOGUE BOX (Exact SHIKAS Silent Chronicle)
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
              "Workspace dialogue — click for next note",
              "Kotak dialog workspace — klik untuk catatan berikutnya"
            )}
          >
            <div className="flex items-start gap-4">
              {/* SHIZUKU Portrait Box */}
              <div className="hidden shrink-0 flex-col items-center sm:flex">
                <div className="relative flex h-16 w-16 items-center justify-center border border-[#745bc7] bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] p-2">
                  {umbrellaFailed ? (
                    <UmbrellaMark className="h-9 w-9 text-[#745bc7]" />
                  ) : (
                    <img
                      src="/api/uploads/tuyu-umbrella.png"
                      alt="SHIZUKU"
                      onError={() => setUmbrellaFailed(true)}
                      className="h-11 w-auto object-contain"
                    />
                  )}
                </div>
                <span
                  className="mt-1.5 w-full border border-current px-1.5 py-0.5 text-center font-mono text-[9px] font-bold tracking-[0.16em] uppercase"
                  style={{ color: ecoUser ? "#2276a8" : "#745bc7" }}
                >
                  {ecoUser ? pick("SYNCED", "AKTIF") : pick("READY", "SIAP")}
                </span>
              </div>

              {/* Dialogue Body */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#745bc7]/20 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-sm font-bold tracking-[0.22em] text-[#745bc7] uppercase">
                      {profile.brandName}
                    </span>
                    <span className="font-mono text-[10px] text-[#5d5370]">
                      ({profile.brandKanji})
                    </span>
                    <span
                      className="border border-current px-1.5 font-mono text-[9px] font-bold tracking-[0.14em] uppercase sm:hidden"
                      style={{ color: ecoUser ? "#2276a8" : "#745bc7" }}
                    >
                      {ecoUser ? pick("SYNCED", "AKTIF") : pick("READY", "SIAP")}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#5d5370]">
                    {String(safeDialogueIdx + 1).padStart(2, "0")} /{" "}
                    {String(dialogueLines.length).padStart(2, "0")}
                  </span>
                </div>

                <VnTypewriterBody
                  key={`${safeDialogueIdx}-${currentDialogue}`}
                  text={currentDialogue}
                  forceComplete={dialogueReveal}
                />

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.16em] text-[#5d5370]/80 uppercase">
                    {pick(
                      "CLICK DIALOGUE TO CONTINUE",
                      "KLIK DIALOG UNTUK LANJUT"
                    )}
                  </span>
                  <span className="animate-vn-next font-mono text-[11px] font-bold text-[#d749d5]">
                    ▼
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              3. WORKSPACE APP LAUNCHER FRAME (Exact SHIKAS Sharp RPG Deck)
             ================================================================= */}
          <section className="vn-frame overflow-hidden">
            {/* Vivid Watercolor Window Header Strip */}
            <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-white">
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
                {pick("APPLICATION DECK // 雫", "DAFTAR APLIKASI // 雫")}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/95 uppercase drop-shadow-2xs">
                {filtered.length} {pick("ENTRIES", "ITEM")}
              </span>
            </div>

            {/* Single-Row Unified Toolbar (Sharp Segmented Tabs + Sharp Search Box) */}
            <div className="flex flex-col gap-2.5 border-b border-[#745bc7]/20 bg-[#fdf9ff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="inline-flex w-fit max-w-full overflow-x-auto border border-[#745bc7]/55 bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((cat, idx) => {
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`shrink-0 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition ${
                        idx > 0 ? "border-l border-[#745bc7]/40" : ""
                      } ${
                        active
                          ? "bg-[#745bc7] text-white"
                          : "text-[#5d5370] hover:bg-[#f4effd] hover:text-[#14100e]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 border border-[#745bc7]/40 bg-white px-2.5 py-1.5 transition focus-within:border-[#745bc7] sm:w-56">
                <Search className="h-3.5 w-3.5 shrink-0 text-[#745bc7]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={pick("Filter apps...", "Cari aplikasi...")}
                  className="w-full bg-transparent font-mono text-[11px] text-[#14100e] outline-none placeholder:text-[#5d5370]/75"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-[#5d5370] hover:text-[#14100e]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sharp Command Cards Grid */}
            {filtered.length === 0 ? (
              <div className="bg-white/95 px-6 py-14 text-center">
                <p className="font-editorial text-lg font-semibold tracking-[0.14em] text-[#745bc7] uppercase">
                  {pick("NO MATCHING APPS", "BELUM ADA APLIKASI COCOK")}
                </p>
                <p className="mt-1.5 font-mono text-xs text-[#5d5370]">
                  {pick(
                    "Try clearing your filter or add new shortcuts in Admin Studio.",
                    "Coba reset filter atau tambahkan pintasan baru lewat Admin Studio."
                  )}
                </p>
                {hasActiveFilter && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("ALL");
                        setQuery("");
                      }}
                      className="vn-btn-action px-4 py-2"
                    >
                      ▶ {pick("RESET FILTERS", "RESET FILTER")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/95 p-4 sm:p-5">
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filtered.map((app, index) => {
                    const num = String(index + 1).padStart(2, "0");
                    const dotColor = CATEGORY_COLORS[app.category] ?? "#745bc7";

                    const inner = (
                      <div className="vn-cmd group flex h-full flex-col justify-between p-4">
                        {/* Left 3px hover accent bar */}
                        <span
                          aria-hidden="true"
                          className="absolute top-0 bottom-0 left-0 w-[3px] opacity-0 transition group-hover:opacity-100"
                          style={{ backgroundColor: dotColor }}
                        />

                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                              <span className="font-bold tracking-[0.14em] text-[#745bc7]">
                                {num}
                              </span>
                              <span
                                className="h-1.5 w-1.5 shrink-0"
                                style={{ backgroundColor: dotColor }}
                              />
                              <span className="tracking-[0.14em] text-[#5d5370] uppercase">
                                {app.category}
                              </span>
                              {app.badge && (
                                <span
                                  className="border px-1.5 py-[1px] text-[9px] font-bold tracking-[0.12em] uppercase"
                                  style={{
                                    borderColor: dotColor,
                                    color: dotColor,
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

                          <h2 className="mt-2.5 flex items-center gap-1.5 text-[15px] font-semibold text-[#14100e] transition-colors group-hover:text-[#745bc7]">
                            <span className="font-mono text-[10px] text-[#d749d5] opacity-0 transition-opacity group-hover:opacity-100">
                              ▶
                            </span>
                            <span>{app.name}</span>
                          </h2>

                          <p className="mt-1 text-xs leading-relaxed text-[#5d5370]">
                            {pick(app.descriptionEn, app.descriptionId)}
                          </p>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between border-t border-[#745bc7]/15 pt-2 font-mono text-[10px] tracking-[0.12em] text-[#745bc7] uppercase">
                          <span className="truncate text-[#5d5370]/85">
                            {app.url}
                          </span>
                          <span className="shrink-0 font-semibold">
                            {app.isExternal
                              ? pick("LAUNCH ↗", "BUKA ↗")
                              : pick("ENTER →", "MASUK →")}
                          </span>
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
