"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

function Pipe() {
  return (
    <span className="mx-2 font-normal text-[#14100e]/35 select-none">|</span>
  );
}

export function ProjectsArchiveView({ data }: { data: PortfolioPayload }) {
  const { profile, projects, experiences, certificates, skillGroups } = data;
  const { locale, pick } = useLocale();
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const contactLinks = [
    profile.linkedinUrl
      ? { label: "LinkedIn", href: profile.linkedinUrl, external: true }
      : null,
    profile.githubUrl
      ? { label: "GitHub", href: profile.githubUrl, external: true }
      : null,
    profile.email
      ? { label: profile.email, href: `mailto:${profile.email}`, external: false }
      : null,
    profile.resumeUrl
      ? { label: pick("Resume", "CV"), href: profile.resumeUrl, external: true }
      : null,
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Exact /assets/bg-watercolor-pc.jpg pink watercolor backdrop */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />
      <TuyuRainLayer behindContent />
      <CinematicHeader profile={profile} />

      <main className="font-condensed relative z-10 mx-auto w-[90%] max-w-[780px] flex-1 pt-28 pb-24 md:pt-34 md:pb-28">
        {/* Minimal Centered Navigation (HOME · WORK · PORTFOLIO · ABOUT) */}
        <nav
          aria-label="Section navigation"
          className="flex items-center justify-center gap-7 sm:gap-11 md:gap-14"
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

        {/* Clean Crisp Paper Frame for Comfortable Reading over Watercolor */}
        <div className="vn-frame mt-10 overflow-hidden md:mt-12">
          <div className="vn-band-strip flex flex-wrap items-center justify-between gap-2 px-5 py-2 text-white">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
              {"PORTFOLIO // PROFILE & WORKS"}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase drop-shadow-2xs">
              {profile.location}
            </span>
          </div>

          <div className="bg-white/92 px-6 py-9 sm:px-10 sm:py-12">
            {/* 1. Personal Profile Header */}
            <header className="text-center">
              <h1 className="text-[30px] font-semibold leading-tight tracking-[0.08em] text-[#14100e] uppercase sm:text-[36px]">
                {profile.fullName}
              </h1>
              <p className="mt-2 text-[17px] tracking-[0.04em] text-[#745bc7] sm:text-[19px]">
                {pick(profile.currentRoleEn, profile.currentRoleId)}
                <Pipe />
                {profile.currentOrg}
              </p>

              <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.72] tracking-[0.02em] text-[#14100e]/88 sm:text-[18.5px]">
                {pick(profile.bioEn, profile.bioId)}
              </p>

              {contactLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center text-[15px] tracking-[0.08em] text-[#14100e]/80 uppercase sm:text-[16px]">
                  {contactLinks.map((item, idx) => (
                    <React.Fragment key={item.label}>
                      {idx > 0 && <Pipe />}
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="transition hover:text-[#745bc7]"
                      >
                        {item.label}
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </header>

            <div className="raindrop-dotted my-10 w-full opacity-75" />

            {/* 2. Experience & Education */}
            <div className="space-y-11">
              {experiences.length > 0 && (
                <section id="experience" className="space-y-7">
                  {experiences.map((exp) => {
                    const bullets =
                      locale === "id" && exp.bullets.id.length > 0
                        ? exp.bullets.id
                        : exp.bullets.en;
                    const summary = pick(exp.summaryEn, exp.summaryId);

                    return (
                      <article key={exp.id}>
                        <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                          <span>{exp.kind}</span>
                          <Pipe />
                          <span>{exp.organization}</span>
                          <Pipe />
                          <span>{pick(exp.periodEn, exp.periodId)}</span>
                        </h2>

                        <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/88 sm:text-[18px]">
                          <li>
                            <span className="font-medium text-[#14100e]">
                              {pick(exp.roleEn, exp.roleId)}
                            </span>
                            {exp.location && (
                              <>
                                <Pipe />
                                <span>{exp.location}</span>
                              </>
                            )}
                          </li>
                          {summary && <li>{summary}</li>}
                          {bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                          {exp.tags.length > 0 && (
                            <li className="text-[#5d5370]">
                              {exp.tags.map((tag, i) => (
                                <React.Fragment key={tag}>
                                  {i > 0 && <Pipe />}
                                  <span>{tag}</span>
                                </React.Fragment>
                              ))}
                            </li>
                          )}
                        </ul>
                      </article>
                    );
                  })}
                </section>
              )}

              {/* 3. Selected Projects */}
              {projects.length > 0 && (
                <section id="projects">
                  <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                    <span>{pick("PROJECTS", "PROYEK")}</span>
                    <Pipe />
                    <span>{pick("SELECTED WORKS", "KARYA PILIHAN")}</span>
                  </h2>

                  <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
                    {projects.map((project) => (
                      <li key={project.id}>
                        <div className="inline">
                          <span>{project.year}</span>
                          <Pipe />
                          <Link
                            href={`/portfolio/${project.slug}`}
                            className="font-medium text-[#14100e] underline-offset-4 transition hover:text-[#745bc7] hover:underline"
                          >
                            {project.title}
                          </Link>
                          <Pipe />
                          <span className="text-[#745bc7] uppercase">
                            {project.category}
                          </span>
                          {project.repoUrl && (
                            <>
                              <Pipe />
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-0.5 text-[15px] text-[#5d5370] transition hover:text-[#745bc7]"
                              >
                                GitHub
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </>
                          )}
                        </div>
                        <p className="mt-0.5 font-sans text-[12.5px] leading-relaxed text-[#5d5370]">
                          {pick(project.summaryEn, project.summaryId)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 4. Certificates (Shown cleanly once added in /admin) */}
              {certificates.length > 0 && (
                <section id="certificates">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                      <span>{pick("CERTIFICATES", "SERTIFIKAT")}</span>
                      <Pipe />
                      <span>{pick("CREDENTIALS", "KREDENSIAL")}</span>
                    </h2>
                    <Link
                      href="/certificates"
                      className="text-[14px] tracking-[0.12em] text-[#745bc7] uppercase transition hover:opacity-70"
                    >
                      {pick("GALLERY →", "GALERI →")}
                    </Link>
                  </div>

                  <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
                    {certificates.map((cert) => (
                      <li key={cert.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedCert(cert)}
                          className="inline text-left transition hover:text-[#745bc7] focus:outline-none"
                        >
                          <span>{cert.issuedDate}</span>
                          <Pipe />
                          <span className="font-medium text-[#14100e] underline-offset-4 hover:text-[#745bc7] hover:underline">
                            {pick(cert.titleEn, cert.titleId)}
                          </span>
                          <Pipe />
                          <span>{cert.category}</span>
                          <Pipe />
                          <span>{cert.issuer}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 5. Skills */}
              {skillGroups.length > 0 && (
                <section id="skills">
                  <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                    <span>{pick("SKILLS", "KEAHLIAN")}</span>
                    <Pipe />
                    <span>{pick("STACK", "TEKNOLOGI")}</span>
                  </h2>

                  <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
                    {skillGroups.map((group) => (
                      <li key={group.id}>
                        <span className="font-medium text-[#14100e]">
                          {pick(group.nameEn, group.nameId)}
                        </span>
                        {group.items.map((item) => (
                          <React.Fragment key={item}>
                            <Pipe />
                            <span>{item}</span>
                          </React.Fragment>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
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
