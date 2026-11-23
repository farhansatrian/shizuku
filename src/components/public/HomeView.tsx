"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  Check,
  Code2,
  Copy,
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
  subtitle: string;
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
  const {
    profile,
    workspaceApps,
    projects,
    experiences,
    certificates,
  } = data;
  const { pick } = useLocale();
  const [feedTab, setFeedTab] = useState<FeedTab>("ALL");
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const feedRows = useMemo<FeedRow[]>(() => {
    const projectRows: FeedRow[] = projects.map((p) => ({
      id: `p-${p.id}`,
      kind: "PROJECTS",
      date: p.year,
      tag: p.category,
      title: p.title,
      subtitle: pick(p.summaryEn, p.summaryId),
      href: `/projects/${p.slug}`,
    }));

    const expRows: FeedRow[] = experiences.map((e) => ({
      id: `e-${e.id}`,
      kind: "EXPERIENCE",
      date: pick(e.periodEn, e.periodId),
      tag: e.kind,
      title: `${pick(e.roleEn, e.roleId)} — ${e.organization}`,
      subtitle: pick(e.summaryEn, e.summaryId),
      href: "/about#experience",
    }));

    const certRows: FeedRow[] = certificates.map((c) => ({
      id: `c-${c.id}`,
      kind: "CERTIFICATES",
      date: c.issuedDate,
      tag: c.category,
      title: pick(c.titleEn, c.titleId),
      subtitle: c.issuer,
      certificate: c,
    }));

    if (feedTab === "PROJECTS") return projectRows.slice(0, 6);
    if (feedTab === "EXPERIENCE") return expRows.slice(0, 6);
    if (feedTab === "CERTIFICATES") return certRows.slice(0, 6);

    // Balanced calm overview when ALL is selected
    return [
      ...projectRows.slice(0, 3),
      ...expRows.slice(0, 2),
      ...certRows.slice(0, 2),
    ];
  }, [projects, experiences, certificates, feedTab, pick]);

  const moreHref =
    feedTab === "EXPERIENCE"
      ? "/about"
      : feedTab === "CERTIFICATES"
        ? "/certificates"
        : "/projects";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#e5dcfb] text-[#14100e]">
      <RainPreloader
        brandName={profile.brandName}
        brandKanji={profile.brandKanji}
      />
      <CinematicHeader profile={profile} transparentOnTop />

      <main>
        {/* 1. Pure TUYU Full-Viewport Anime Hero */}
        <HeroSection profile={profile} />

        {/* Everything below lives on a single calm, flat lavender canvas (#e5dcfb) */}
        <div className="tuyu-canvas">
          {/* 2. Daily-Drive Workspace Launcher (First Section After Hero!) */}
          <section
            id="workspace"
            className="mx-auto max-w-5xl scroll-mt-20 px-5 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20"
          >
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-editorial text-3xl font-normal tracking-[0.24em] text-[#14100e] uppercase sm:text-4xl">
                  WORKSPACE
                </h2>
                <p className="mt-1.5 text-xs tracking-[0.14em] text-[#5c526e]">
                  {pick(
                    "Daily-drive launcher, tools & personal spaces",
                    "Ruang kerja harian, aplikasi & pintu masuk utama"
                  )}
                </p>
              </div>

              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 py-1 font-mono text-[11px] tracking-[0.16em] text-[#7650f3] uppercase transition hover:opacity-75"
              >
                {pick("Open Workspace", "Buka Workspace")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {workspaceApps.map((app) => {
                const cardInner = (
                  <div className="tuyu-sheet tuyu-sheet-hover group flex h-full min-h-[116px] flex-col justify-between rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5dcfb]/75 text-[#7650f3] transition-colors group-hover:bg-[#7650f3] group-hover:text-white">
                          {renderWorkspaceIcon(app.icon, "h-4 w-4")}
                        </span>
                        <h3 className="text-sm font-semibold text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                          {app.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {app.badge && (
                          <span className="rounded-full bg-[#f4effd] px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-[#7650f3] uppercase">
                            {app.badge}
                          </span>
                        )}
                        {app.isExternal ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#7650f3]/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-[#7650f3]/70 transition-transform group-hover:translate-x-0.5" />
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#5c526e]">
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
                    {cardInner}
                  </a>
                ) : (
                  <Link
                    key={app.id}
                    href={app.url}
                    className="block focus:outline-none"
                  >
                    {cardInner}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 3. Editorial Index — Directly Inspired by tuyu.moe's Clean #news List */}
          <section
            id="index"
            className="mx-auto max-w-4xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24"
          >
            <div className="text-center">
              <h2 className="font-editorial text-3xl font-normal tracking-[0.26em] text-[#14100e] uppercase sm:text-4xl">
                INDEX
              </h2>

              {/* Flat TUYU Category Filter Tabs */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-9">
                {(
                  [
                    ["ALL", "ALL", "SEMUA"],
                    ["PROJECTS", "PROJECTS", "PROYEK"],
                    ["EXPERIENCE", "EXPERIENCE", "KARIER"],
                    ["CERTIFICATES", "CERTIFICATES", "SERTIFIKAT"],
                  ] as const
                ).map(([tabKey, enLabel, idLabel]) => {
                  const active = feedTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setFeedTab(tabKey)}
                      className={`pb-1.5 font-mono text-xs tracking-[0.18em] uppercase transition ${
                        active
                          ? "border-b-2 border-[#7650f3] font-semibold text-[#7650f3]"
                          : "border-b-2 border-transparent text-[#5c526e] hover:text-[#14100e]"
                      }`}
                    >
                      {pick(enLabel, idLabel)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Raindrop-Dotted Editorial Rows */}
            <div className="mt-10">
              <div className="raindrop-dotted w-full" />
              {feedRows.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#5c526e]">
                  {pick("No items published yet.", "Belum ada item dipublikasikan.")}
                </p>
              ) : (
                <ul>
                  {feedRows.map((row) => {
                    const rowContent = (
                      <div className="group flex flex-col gap-1.5 py-5 transition-colors sm:flex-row sm:items-baseline sm:gap-6">
                        <div className="flex shrink-0 items-center gap-3 sm:w-48">
                          <span className="font-mono text-xs text-[#5c526e]">
                            {row.date}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.14em] text-[#7650f3] uppercase">
                            {row.tag}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#14100e] transition-colors group-hover:text-[#7650f3] sm:text-[15px]">
                            {row.title}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-[#5c526e]">
                            {row.subtitle}
                          </p>
                        </div>

                        <ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-[#7650f3]/50 transition-all group-hover:translate-x-1 group-hover:text-[#7650f3] sm:block" />
                      </div>
                    );

                    return (
                      <li key={row.id}>
                        {row.certificate ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCert(row.certificate!)}
                            className="w-full text-left focus:outline-none"
                          >
                            {rowContent}
                          </button>
                        ) : (
                          <Link
                            href={row.href || "/projects"}
                            className="block focus:outline-none"
                          >
                            {rowContent}
                          </Link>
                        )}
                        <div className="raindrop-dotted w-full" />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Signature Centered TUYU White "MORE" Pill */}
            <div className="mt-12 flex justify-center">
              <Link href={moreHref} className="tuyu-pill-btn px-10 py-3 text-sm">
                MORE
              </Link>
            </div>
          </section>

          {/* 4. Quiet Personal Info Strip (Zero Bulky Dark CTA Card!) */}
          <section
            id="contact"
            className="mx-auto max-w-4xl scroll-mt-20 px-5 pt-6 pb-20 sm:px-8 sm:pb-24"
          >
            <div className="tuyu-sheet rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-lg">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-[#7650f3] uppercase">
                    INFO · {profile.location}
                  </p>
                  <h2 className="mt-2 font-editorial text-2xl font-medium tracking-[0.06em] text-[#14100e] sm:text-3xl">
                    {profile.fullName}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c526e]">
                    {pick(profile.bioEn, profile.bioId)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#14100e] px-5 py-2 font-mono text-xs text-white transition hover:bg-[#7650f3]"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        {pick("Copied", "Tersalin")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {profile.email}
                      </>
                    )}
                  </button>
                  <Link
                    href="/about"
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-[#d4c6f4] bg-white px-5 py-2 font-mono text-xs text-[#14100e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    {pick("About", "Tentang")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} />
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
