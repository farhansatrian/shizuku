"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

        {/* 2. #workspace — Pure Boxless tuyu.moe Editorial Directory on #e5dcfb Lavender */}
        <section
          id="workspace"
          className="scroll-mt-16 bg-[#e5dcfb] pt-14 pb-12 md:pt-20 md:pb-16"
        >
          <div className="mx-auto w-[90%] max-w-[1000px]">
            <h2 className="font-editorial text-[26px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[33px] md:tracking-[9px]">
              WORKSPACE
            </h2>

            <ul className="mt-8 grid grid-cols-1 gap-x-14 md:mt-12 md:grid-cols-2">
              {workspaceApps.map((app, index) => {
                const num = String(index + 1).padStart(2, "0");
                const rowInner = (
                  <div className="group py-5 transition-opacity duration-300 hover:opacity-70 md:py-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[12px] tracking-[2.5px] text-[#745bc7] md:text-[13px]">
                          {num}
                        </span>
                        {app.badge && (
                          <span className="inline-block rounded-[5px] bg-[#745bc7] px-2.5 py-[2px] font-mono text-[10px] tracking-[0.8px] text-white uppercase">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      {app.isExternal ? (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#745bc7] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      ) : (
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#745bc7] transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </div>

                    <h3 className="mt-2.5 text-[17px] font-normal tracking-[0.03em] text-[#14100e] transition-colors duration-300 group-hover:text-[#7650f3] md:text-[19px]">
                      {app.name}
                    </h3>

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

            <div className="mt-12 flex justify-center md:mt-16">
              <Link href="/workspace" className="tuyu-more-btn">
                MORE
              </Link>
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
