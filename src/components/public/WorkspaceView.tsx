"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Settings,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
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
            className="inline-flex min-h-[36px] w-fit items-center gap-2 rounded-full border border-[#745bc7] bg-transparent px-4 py-1.5 font-editorial text-[12px] font-bold tracking-[0.2em] text-[#745bc7] uppercase transition hover:border-[#7650f3] hover:text-[#7650f3] hover:opacity-75"
          >
            <Settings className="h-3.5 w-3.5" />
            {pick("Customize", "Atur")}
          </Link>
        </div>

        {/* Exact tuyu.moe Pipe-Separated Filter Tabs + Minimal Underline Search */}
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

          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-1 h-3.5 w-3.5 -translate-y-1/2 text-[#745bc7]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick("Filter apps...", "Cari aplikasi...")}
              className="w-full border-b border-[#745bc7]/55 bg-transparent py-1.5 pr-2 pl-7 text-xs text-[#14100e] outline-none transition placeholder:text-[#745bc7]/65 focus:border-[#7650f3]"
            />
          </div>
        </div>

        {/* Pure Boxless tuyu.moe Editorial Directory */}
        {filtered.length === 0 ? (
          <div className="tuyu-raindrop-line mt-10 py-10 text-center">
            <p className="text-sm text-[#5d5370]">
              {pick(
                "No workspace apps match this filter. Add or edit them in /admin.",
                "Belum ada aplikasi yang cocok. Tambah atau edit lewat /admin."
              )}
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-x-14 md:mt-10 md:grid-cols-2">
            {filtered.map((app, index) => {
              const num = String(index + 1).padStart(2, "0");
              const rowInner = (
                <div className="group py-5 transition-opacity duration-300 hover:opacity-70 md:py-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] tracking-[2.5px] text-[#745bc7] md:text-[13px]">
                        {num}
                      </span>
                      <span className="inline-block rounded-[5px] bg-[#745bc7] px-2.5 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase">
                        {app.badge || app.category}
                      </span>
                    </div>
                    {app.isExternal ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#745bc7] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#745bc7] transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </div>

                  <h2 className="mt-2.5 text-[18px] font-normal tracking-[0.03em] text-[#14100e] transition-colors duration-300 group-hover:text-[#7650f3] md:text-[20px]">
                    {app.name}
                  </h2>

                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#5d5370] md:text-[13px]">
                    {pick(app.descriptionEn, app.descriptionId)}
                  </p>
                </div>
              );

              return (
                <li key={app.id} className="tuyu-raindrop-line pb-2">
                  {app.isExternal ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block focus:outline-none"
                    >
                      {rowInner}
                    </a>
                  ) : (
                    <Link href={app.url} className="block focus:outline-none">
                      {rowInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Quiet Boxless Architectural Note for Future Agent Workspace */}
        <section className="mt-16 border-l-2 border-[#745bc7] pl-5 md:mt-20 md:pl-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] tracking-[2.5px] text-[#745bc7] uppercase">
              AGENT WORKSPACE
            </span>
            <span className="inline-block rounded-[5px] bg-[#745bc7] px-2.5 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase">
              {pick("NEXT PHASE", "TAHAP BERIKUTNYA")}
            </span>
          </div>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-[#5d5370] md:text-[14px]">
            {pick(
              "Architected to host personal AI agents, daily workflow runners, and private automations under the same shizuku shell and auth session.",
              "Disiapkan untuk menampung AI agent pribadi, otomasi tugas harian, dan asisten kerja di dalam shell serta sesi autentikasi shizuku yang sama."
            )}
          </p>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
