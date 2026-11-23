"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Search,
  Settings,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { renderWorkspaceIcon } from "@/components/public/HomeView";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function WorkspaceView({ data }: { data: PortfolioPayload }) {
  const { profile, workspaceApps } = data;
  const { locale, pick } = useLocale();
  const [category, setCategory] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [clockText, setClockText] = useState("");

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
          }
        ).format(now);
        setClockText(`${date} · ${time} WIB`);
      } catch {
        setClockText("");
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
  }, [locale]);

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
        a.badge.toLowerCase().includes(q)
      );
    });
  }, [workspaceApps, category, query]);

  return (
    <div className="tuyu-subpage-canvas relative min-h-screen text-[#14100e]">
      <TuyuRainLayer />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-[90%] max-w-[1000px] pt-28 pb-24 md:pt-36">
        {/* Quiet TUYU Editorial Header + Jakarta Clock */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#745bc7] uppercase">
              {clockText || `${profile.brandName} · ${profile.location}`}
            </p>
            <h1 className="mt-2 font-editorial text-[28px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[36px] md:tracking-[9px]">
              WORKSPACE
            </h1>
            <p className="mt-3 text-sm text-[#5d5370]">
              {pick(
                "Daily-drive launcher for personal apps, shortcuts, and upcoming AI agents.",
                "Pusat aplikasi harian, pintasan kerja, dan ruang AI agent mendatang."
              )}
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-[38px] w-fit items-center gap-2 rounded-full border border-[#745bc7] bg-white/75 px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] text-[#745bc7] uppercase transition hover:bg-[#745bc7] hover:text-white"
          >
            <Settings className="h-3.5 w-3.5" />
            {pick("Customize Apps", "Atur Aplikasi")}
          </Link>
        </div>

        {/* Exact tuyu.moe Pipe-Separated Filter Tabs + Search */}
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex max-w-full flex-nowrap items-center overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat, idx) => {
              const active = category === cat;
              return (
                <li
                  key={cat}
                  className={`shrink-0 border-r border-[#745bc7] ${
                    idx === 0 ? "border-l" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-2.5 py-0.5 font-editorial text-[11px] tracking-[1.5px] text-[#745bc7] uppercase transition hover:text-[#d749d5] md:px-4 md:text-[13px] md:tracking-[3px] ${
                      active ? "font-bold" : "font-normal opacity-80"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#745bc7]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick("Filter apps...", "Cari aplikasi...")}
              className="w-full rounded-full border border-[#745bc7]/40 bg-white/80 py-2 pr-4 pl-9 text-xs text-[#14100e] outline-none transition placeholder:text-[#7f719c] focus:border-[#745bc7] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-8 w-full" />

        {/* Launcher Grid */}
        {filtered.length === 0 ? (
          <div className="tuyu-sheet rounded-2xl p-10 text-center">
            <p className="text-sm text-[#5d5370]">
              {pick(
                "No workspace apps match this filter. Add or edit them in /admin.",
                "Belum ada aplikasi yang cocok. Tambah atau edit lewat /admin."
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => {
              const card = (
                <div className="tuyu-sheet tuyu-sheet-hover group flex h-full min-h-[124px] flex-col justify-between rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e5dcfb] text-[#745bc7] transition-colors group-hover:bg-[#745bc7] group-hover:text-white">
                        {renderWorkspaceIcon(app.icon, "h-4 w-4")}
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                          {app.name}
                        </h2>
                        <p className="font-mono text-[10px] tracking-[0.14em] text-[#745bc7] uppercase">
                          {app.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {app.badge && (
                        <span className="rounded-[5px] bg-[#745bc7] px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-white uppercase">
                          {app.badge}
                        </span>
                      )}
                      {app.isExternal ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#745bc7] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-[#745bc7] transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#5d5370]">
                    {pick(app.descriptionEn, app.descriptionId)}
                  </p>
                </div>
              );

              return app.isExternal ? (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block focus:outline-none"
                >
                  {card}
                </a>
              ) : (
                <Link
                  key={app.id}
                  href={app.url}
                  className="block focus:outline-none"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        )}

        {/* Future Agent Workspace Architectural Slot */}
        <section className="mt-14">
          <div className="raindrop-dotted mb-10 w-full" />
          <div className="tuyu-sheet rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5dcfb] text-[#7650f3]">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-[#14100e]">
                      {pick("Agent Workspace", "Agent Workspace")}
                    </h2>
                    <span className="rounded-full border border-[#d4c6f4] bg-white px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-[#7650f3] uppercase">
                      {pick("NEXT PHASE", "TAHAP BERIKUTNYA")}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#5c526e] sm:text-sm">
                    {pick(
                      "This space is architected to host personal AI agents, daily workflow runners, and private automations under the same shizuku shell and auth session.",
                      "Ruang ini disiapkan untuk menampung AI agent pribadi, otomasi tugas harian, dan asisten kerja di dalam shell serta sesi autentikasi shizuku yang sama."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
