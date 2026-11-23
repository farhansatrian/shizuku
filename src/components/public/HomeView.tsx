"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  Code2,
  FolderKanban,
  Globe,
  Settings,
  Sparkles,
  Terminal,
  User,
  Wallet,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { RainPreloader } from "@/components/public/RainPreloader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { HeroSection } from "@/components/public/HeroSection";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

type FeedTab = "ALL" | "PROJECTS" | "EXPERIENCE" | "CERTIFICATES";

interface FeedRow {
  id: string;
  kind: "PROJECTS" | "EXPERIENCE" | "CERTIFICATES";
  date: string;
  tag: string;
  title: string;
  href?: string;
  certificate?: SerializedCertificate;
}

export function renderWorkspaceIcon(icon: string, className = "h-4 w-4") {
  switch (icon) {
    case "bot":
      return <Bot className={className} />;
    case "wallet":
      return <Wallet className={className} />;
    case "folder":
      return <FolderKanban className={className} />;
    case "award":
      return <Award className={className} />;
    case "user":
      return <User className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "globe":
      return <Globe className={className} />;
    case "code":
      return <Code2 className={className} />;
    case "terminal":
      return <Terminal className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function HomeView({ data }: { data: PortfolioPayload }) {
  const { profile, workspaceApps, projects, experiences, certificates } = data;
  const { pick } = useLocale();
  const [feedTab, setFeedTab] = useState<FeedTab>("ALL");
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const feedRows = useMemo<FeedRow[]>(() => {
    const projectRows: FeedRow[] = projects.map((p) => ({
      id: `p-${p.id}`,
      kind: "PROJECTS",
      date: p.year,
      tag: p.category,
      title: p.title,
      href: `/projects/${p.slug}`,
    }));

    const expRows: FeedRow[] = experiences.map((e) => ({
      id: `e-${e.id}`,
      kind: "EXPERIENCE",
      date: pick(e.periodEn, e.periodId),
      tag: e.kind,
      title: `${pick(e.roleEn, e.roleId)} — ${e.organization}`,
      href: "/about#experience",
    }));

    const certRows: FeedRow[] = certificates.map((c) => ({
      id: `c-${c.id}`,
      kind: "CERTIFICATES",
      date: c.issuedDate,
      tag: c.category,
      title: `${pick(c.titleEn, c.titleId)} (${c.issuer})`,
      certificate: c,
    }));

    if (feedTab === "PROJECTS") return projectRows.slice(0, 5);
    if (feedTab === "EXPERIENCE") return expRows.slice(0, 5);
    if (feedTab === "CERTIFICATES") return certRows.slice(0, 5);

    return [
      ...projectRows.slice(0, 2),
      ...expRows.slice(0, 2),
      ...certRows.slice(0, 1),
    ];
  }, [projects, experiences, certificates, feedTab, pick]);

  const featuredWorks = useMemo(() => {
    const f = projects.filter((p) => p.featured);
    return f.length > 0 ? f : projects.slice(0, 3);
  }, [projects]);

  const moreHref =
    feedTab === "EXPERIENCE"
      ? "/about"
      : feedTab === "CERTIFICATES"
        ? "/certificates"
        : "/projects";

  return (
    <div className="relative min-h-screen text-[#14100e]">
      {/* Fixed ambient pink watercolor layer (exact tuyu.moe #section01_video-area z-index: -2) */}
      <div className="tuyu-fixed-watercolor" aria-hidden="true" />

      {/* Authentic 20-drop pure CSS vertical #2276a8 rain falling across splash & page */}
      <TuyuRainLayer overSplash />

      {/* Authentic tuyu.moe splash screen (panning pink watercolor + stationary watercolor umbrella) */}
      <RainPreloader
        brandName={profile.brandName}
        brandKanji={profile.brandKanji}
      />

      <CinematicHeader profile={profile} transparentOnTop />

      <main className="relative z-10">
        {/* 1. #top — Pure Full-Bleed 100svh Key Visual */}
        <HeroSection profile={profile} />

        {/* 2. #workspace — Calm Daily-Drive Launcher on Exact #e5dcfb Lavender */}
        <section
          id="workspace"
          className="scroll-mt-16 bg-[#e5dcfb] pt-12 pb-10 md:pt-16 md:pb-14"
        >
          <div className="mx-auto w-[90%] max-w-[1000px]">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-editorial text-[26px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[33px] md:tracking-[9px]">
                WORKSPACE
              </h2>
              <Link
                href="/workspace"
                className="font-editorial text-xs tracking-[0.22em] text-[#745bc7] uppercase transition hover:text-[#7650f3] hover:opacity-70 md:text-sm"
              >
                {pick("OPEN →", "BUKA →")}
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
              {workspaceApps.map((app) => {
                const card = (
                  <div className="tuyu-sheet tuyu-sheet-hover group flex h-full min-h-[104px] flex-col justify-between rounded-xl px-4 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e5dcfb] text-[#745bc7] transition-colors group-hover:bg-[#745bc7] group-hover:text-white">
                          {renderWorkspaceIcon(app.icon, "h-3.5 w-3.5")}
                        </span>
                        <h3 className="text-[13px] font-semibold tracking-wide text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                          {app.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {app.badge && (
                          <span className="rounded-[4px] bg-[#745bc7] px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-white uppercase">
                            {app.badge}
                          </span>
                        )}
                        {app.isExternal ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#745bc7]" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-[#745bc7]" />
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#5d5370]">
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
                    className="block"
                  >
                    {card}
                  </a>
                ) : (
                  <Link key={app.id} href={app.url} className="block">
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. #news / INDEX — Exact tuyu.moe News Architecture (Pipe Tabs + Raindrop Line PNG + MORE Pill) */}
        <section
          id="index"
          className="scroll-mt-16 bg-[#e5dcfb] pt-8 pb-16 md:pt-12 md:pb-24"
        >
          <div className="mx-auto w-[90%] max-w-[1000px]">
            <h2 className="font-editorial text-[26px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[33px] md:tracking-[9px]">
              INDEX
            </h2>

            {/* Exact tuyu.moe pipe-separated category tabs: | ALL | PROJECTS | EXPERIENCE | CERTIFICATES | */}
            <div className="mt-10 mb-8 flex justify-center md:mt-14 md:mb-12">
              <ul className="flex max-w-full flex-nowrap items-center overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(
                  [
                    ["ALL", "ALL", "ALL"],
                    ["PROJECTS", "PROJECTS", "PROYEK"],
                    ["EXPERIENCE", "EXPERIENCE", "KARIER"],
                    ["CERTIFICATES", "CERTIFICATES", "SERTIFIKAT"],
                  ] as const
                ).map(([tabKey, enLabel, idLabel], idx) => {
                  const active = feedTab === tabKey;
                  return (
                    <li
                      key={tabKey}
                      className={`shrink-0 border-r border-[#745bc7] ${
                        idx === 0 ? "border-l" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setFeedTab(tabKey)}
                        className={`whitespace-nowrap px-2.5 py-0.5 font-editorial text-[11px] tracking-[1.5px] text-[#745bc7] uppercase transition hover:text-[#d749d5] sm:px-3.5 sm:text-[12px] md:px-5 md:text-[14px] md:tracking-[3px] ${
                          active ? "font-bold" : "font-normal opacity-80"
                        }`}
                      >
                        {pick(enLabel, idLabel)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Exact tuyu.moe list rows with actual 3-color raindrop PNG bottom border */}
            <ul>
              {feedRows.map((row) => {
                const rowInner = (
                  <div className="group py-5 transition-opacity duration-300 hover:opacity-70 md:py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[12px] tracking-[2.5px] text-[#745bc7] md:text-[14px] md:tracking-[3px]">
                        {row.date}
                      </span>
                      <span className="inline-block rounded-[5px] bg-[#745bc7] px-2.5 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase md:px-3 md:text-[11px]">
                        {row.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#14100e] transition-colors duration-300 group-hover:text-[#7650f3] md:mt-2.5 md:text-[19px]">
                      {row.title}
                    </p>
                  </div>
                );

                return (
                  <li key={row.id} className="tuyu-raindrop-line pb-2">
                    {row.certificate ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCert(row.certificate!)}
                        className="w-full text-left focus:outline-none"
                      >
                        {rowInner}
                      </button>
                    ) : (
                      <Link
                        href={row.href || "/projects"}
                        className="block focus:outline-none"
                      >
                        {rowInner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Exact tuyu.moe centered outlined MORE button */}
            <div className="mt-14 flex justify-center md:mt-20">
              <Link href={moreHref} className="tuyu-more-btn">
                MORE
              </Link>
            </div>
          </div>
        </section>

        {/* 4. EXPOSED PARALLAX PINK WATERCOLOR BAND + WORKS SHOWCASE (Exact tuyu.moe #video_area trick!) */}
        <section
          id="works"
          className="relative mt-[170px] bg-[#e5dcfb] pt-10 pb-16 md:mt-[250px] md:pt-12 md:pb-20"
        >
          <div className="mx-auto w-[90%] max-w-[1000px]">
            {/* Heading pulled upward directly over the exposed fixed pink watercolor canvas! */}
            <h2 className="-mt-[135px] mb-10 font-editorial text-[26px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:-mt-[190px] md:mb-14 md:text-[33px] md:tracking-[9px]">
              WORKS
            </h2>

            {/* Horizontal scrollable / grid showcase matching tuyu.moe #video_area calm rhythm */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredWorks.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block transition-opacity duration-300 hover:opacity-80"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#1e1738]">
                    <img
                      src={project.coverImage || "/assets/cover-platform.jpg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-2.5 text-[13px] tracking-[1.4px] text-[#745bc7] md:text-[14px]">
                    {project.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] tracking-[1px] text-[#5d5370] uppercase">
                    {project.category} · {project.year}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-14 flex justify-center md:mt-16">
              <Link href="/projects" className="tuyu-more-btn">
                MORE
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Authentic tuyu.moe Vivid Magenta-Purple Watercolor Band Footer */}
      <Footer profile={profile} />

      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
