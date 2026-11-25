"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import type {
  PortfolioPayload,
  SerializedCertificate,
  SerializedExperience,
} from "@/lib/types";

function DividerPipe() {
  return <span className="mx-1.5 text-[#14100e]/30 select-none">|</span>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-[#14100e]/28 pb-1.5 text-[16px] font-bold tracking-[0.01em] text-[#14100e] sm:text-[17px]">
      {children}
    </h2>
  );
}

interface OrgGroup {
  organization: string;
  entries: SerializedExperience[];
}

function groupByOrganization(items: SerializedExperience[]): OrgGroup[] {
  const groups: OrgGroup[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.organization === item.organization) {
      last.entries.push(item);
    } else {
      groups.push({ organization: item.organization, entries: [item] });
    }
  }
  return groups;
}

export function ProjectsArchiveView({ data }: { data: PortfolioPayload }) {
  const { profile, experiences, certificates } = data;
  const { locale, pick } = useLocale();
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const educationList = experiences.filter((e) => e.kind === "EDUCATION");
  const workList = experiences.filter((e) => e.kind === "WORK");
  const orgGroups = groupByOrganization(
    experiences.filter((e) => e.kind === "ORGANIZATION")
  );

  const contactItems = [
    profile.email
      ? { label: profile.email, href: `mailto:${profile.email}`, external: false }
      : null,
    profile.location ? { label: profile.location, href: null, external: false } : null,
    profile.linkedinUrl
      ? { label: "LinkedIn", href: profile.linkedinUrl, external: true }
      : null,
    profile.githubUrl
      ? { label: "GitHub", href: profile.githubUrl, external: true }
      : null,
    profile.resumeUrl
      ? { label: pick("Resume", "CV"), href: profile.resumeUrl, external: true }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string | null;
    external: boolean;
  }[];

  const getBullets = (exp: SerializedExperience) =>
    locale === "id" && exp.bullets.id.length > 0
      ? exp.bullets.id
      : exp.bullets.en;

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Exact /assets/bg-watercolor-pc.jpg pink watercolor backdrop */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />
      <TuyuRainLayer behindContent />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-[92%] max-w-[820px] flex-1 pt-28 pb-24 md:pt-34 md:pb-28">
        {/* Minimal Centered Navigation (HOME · WORK · PORTFOLIO · ABOUT) */}
        <nav
          aria-label="Section navigation"
          className="font-condensed flex items-center justify-center gap-7 sm:gap-11 md:gap-14"
        >
          <Link
            href="/"
            className="pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("HOME", "BERANDA")}
          </Link>
          <Link
            href="/workspace"
            className="pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            WORK
          </Link>
          <span className="border-b-[1.5px] border-[#14100e] pb-1 text-[17px] font-medium tracking-[0.14em] text-[#14100e] uppercase sm:text-[19px]">
            PORTFOLIO
          </span>
          <Link
            href="/about"
            className="pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("ABOUT", "TENTANG")}
          </Link>
        </nav>

        {/* Clean CV Paper Sheet inside SHIZUKU / SHIKAS Double-Border Frame */}
        <article className="vn-frame mt-10 overflow-hidden md:mt-12">
          <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-5 py-2 text-white">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
              {"PORTFOLIO // CURRICULUM VITAE"}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase drop-shadow-2xs">
              {profile.location}
            </span>
          </div>

          <div className="bg-white/96 px-6 py-8 font-sans text-[#1b1726] sm:px-11 sm:py-11">
            {/* 1. CV Header & General Bio */}
            <header>
              <h1 className="text-[24px] font-bold tracking-[0.03em] text-[#14100e] uppercase sm:text-[28px]">
                {profile.fullName}
              </h1>

              {(profile.currentRoleEn || profile.currentOrg) && (
                <p className="mt-1 text-[13.5px] font-medium text-[#5f47a8] sm:text-[14px]">
                  {pick(profile.currentRoleEn, profile.currentRoleId)}
                  {profile.currentOrg ? ` · ${profile.currentOrg}` : ""}
                </p>
              )}

              {contactItems.length > 0 && (
                <div className="mt-1.5 flex flex-wrap items-center text-[13px] leading-relaxed text-[#4f4663]">
                  {contactItems.map((item, idx) => (
                    <React.Fragment key={item.label}>
                      {idx > 0 && <DividerPipe />}
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-0.5 transition hover:text-[#745bc7] hover:underline"
                        >
                          {item.label}
                          {item.external && (
                            <ArrowUpRight className="h-3 w-3 opacity-70" />
                          )}
                        </a>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <p className="mt-4 text-[13.5px] leading-[1.68] text-[#262033] sm:text-[14px]">
                {pick(profile.bioEn, profile.bioId)}
              </p>
            </header>

            <div className="mt-7 space-y-7">
              {/* 2. Education */}
              {educationList.length > 0 && (
                <section id="education">
                  <SectionHeading>
                    {pick("Education", "Pendidikan")}
                  </SectionHeading>

                  <div className="mt-3.5 space-y-3.5">
                    {educationList.map((edu) => {
                      const summary = pick(edu.summaryEn, edu.summaryId);
                      const bullets = getBullets(edu);
                      return (
                        <div key={edu.id}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13.5px] leading-snug sm:text-[14px]">
                            <p className="text-[#14100e]">
                              <span className="font-bold">
                                {pick(edu.roleEn, edu.roleId)}
                              </span>
                              {", "}
                              <span>{edu.organization}</span>
                            </p>
                            <span className="text-[13px] text-[#4f4663]">
                              {pick(edu.periodEn, edu.periodId)}
                            </span>
                          </div>
                          {summary && (
                            <p className="mt-1 text-[13px] leading-[1.58] text-[#3a324a] sm:text-[13.5px]">
                              {summary}
                            </p>
                          )}
                          {bullets.length > 0 && (
                            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-[1.58] text-[#2d263b] sm:text-[13.5px]">
                              {bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. Work Experience */}
              {workList.length > 0 && (
                <section id="work-experience">
                  <SectionHeading>
                    {pick("Work Experience", "Pengalaman Kerja")}
                  </SectionHeading>

                  <div className="mt-3.5 space-y-5">
                    {workList.map((work) => {
                      const summary = pick(work.summaryEn, work.summaryId);
                      const bullets = getBullets(work);
                      return (
                        <div key={work.id}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13.5px] sm:text-[14px]">
                            <h3 className="font-bold text-[#14100e]">
                              {pick(work.roleEn, work.roleId)}
                            </h3>
                            <span className="text-[13px] text-[#4f4663]">
                              ({pick(work.periodEn, work.periodId)})
                            </span>
                          </div>
                          <p className="mt-0.5 text-[13px] font-medium text-[#524669] sm:text-[13.5px]">
                            {work.organization}
                          </p>
                          {summary && (
                            <p className="mt-1.5 text-[13px] leading-[1.6] text-[#2d263b] sm:text-[13.5px]">
                              {summary}
                            </p>
                          )}
                          {bullets.length > 0 && (
                            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-[1.6] text-[#2d263b] sm:text-[13.5px]">
                              {bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 4. Organizational Experience */}
              {orgGroups.length > 0 && (
                <section id="organizational-experience">
                  <SectionHeading>
                    {pick(
                      "Organizational Experience",
                      "Pengalaman Organisasi & Mengajar"
                    )}
                  </SectionHeading>

                  <div className="mt-3.5 space-y-5">
                    {orgGroups.map((group) => (
                      <div key={group.organization} className="space-y-3.5">
                        {group.entries.map((entry, idx) => {
                          const summary = pick(
                            entry.summaryEn,
                            entry.summaryId
                          );
                          const bullets = getBullets(entry);
                          const isFirst = idx === 0;

                          return (
                            <div key={entry.id}>
                              {isFirst ? (
                                <>
                                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13.5px] sm:text-[14px]">
                                    <h3 className="font-bold text-[#14100e]">
                                      {group.organization}
                                    </h3>
                                    <span className="text-[13px] text-[#4f4663]">
                                      ({pick(entry.periodEn, entry.periodId)})
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-[13px] font-medium text-[#524669] sm:text-[13.5px]">
                                    {pick(entry.roleEn, entry.roleId)}
                                  </p>
                                </>
                              ) : (
                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13px] sm:text-[13.5px]">
                                  <p className="font-medium text-[#3b3150]">
                                    {pick(entry.roleEn, entry.roleId)}
                                  </p>
                                  <span className="text-[13px] text-[#4f4663]">
                                    ({pick(entry.periodEn, entry.periodId)})
                                  </span>
                                </div>
                              )}

                              {summary && (
                                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#2d263b] sm:text-[13.5px]">
                                  {summary}
                                </p>
                              )}
                              {bullets.length > 0 && (
                                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-[1.6] text-[#2d263b] sm:text-[13.5px]">
                                  {bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 5. Certificates (Shown cleanly once added in /admin) */}
              {certificates.length > 0 && (
                <section id="certificates">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#14100e]/28 pb-1.5">
                    <h2 className="text-[16px] font-bold tracking-[0.01em] text-[#14100e] sm:text-[17px]">
                      {pick("Certificates", "Sertifikat")}
                    </h2>
                    <Link
                      href="/certificates"
                      className="font-mono text-[11px] tracking-[0.12em] text-[#745bc7] uppercase transition hover:opacity-75"
                    >
                      {pick("Gallery →", "Galeri →")}
                    </Link>
                  </div>

                  <ul className="mt-3.5 list-disc space-y-1.5 pl-5 text-[13px] leading-[1.6] text-[#262033] sm:text-[13.5px]">
                    {certificates.map((cert) => (
                      <li key={cert.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedCert(cert)}
                          className="inline text-left transition hover:text-[#745bc7] focus:outline-none"
                        >
                          <span className="font-bold text-[#14100e] underline-offset-4 hover:text-[#745bc7] hover:underline">
                            {pick(cert.titleEn, cert.titleId)}
                          </span>{" "}
                          <span className="text-[#4f4663]">
                            ({cert.issuedDate})
                          </span>
                          {" — "}
                          <span>{cert.issuer}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer profile={profile} />
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
