"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

function Pipe() {
  return (
    <span className="mx-2 font-normal text-[#14100e]/35 select-none">|</span>
  );
}

export function AboutView({ data }: { data: PortfolioPayload }) {
  const { profile, experiences, certificates, skillGroups } = data;
  const { locale, pick } = useLocale();
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const storyParagraphs = pick(profile.aboutStoryEn, profile.aboutStoryId)
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="tuyu-subpage-canvas relative min-h-screen text-[#14100e]">
      <TuyuRainLayer />
      <CinematicHeader profile={profile} />

      <main className="font-condensed relative z-10 mx-auto w-[90%] max-w-[760px] pt-28 pb-28 md:pt-36 md:pb-32">
        {/* Minimal Centered Gallery Navigation (HOME / WORK / PROJECT / ABOUT) */}
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
          <Link
            href="/projects"
            className="pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("PROJECT", "PROYEK")}
          </Link>
          <span className="border-b-[1.5px] border-[#14100e] pb-1 text-[17px] font-medium tracking-[0.14em] text-[#14100e] uppercase sm:text-[19px]">
            {pick("ABOUT", "TENTANG")}
          </span>
        </nav>

        {/* Centered Square Portrait + Centered Minimal Bio */}
        <section className="mt-12 flex flex-col items-center text-center md:mt-16">
          <div className="h-[220px] w-[220px] overflow-hidden sm:h-[260px] sm:w-[260px]">
            {profile.avatarImage?.trim() ? (
              <img
                src={profile.avatarImage}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center"
                style={{
                  background:
                    "linear-gradient(145deg, #fbd9ea 0%, #dcd0f9 100%)",
                }}
              >
                <UmbrellaMark className="h-12 w-12 text-[#745bc7]" />
                <p className="mt-3 font-editorial text-2xl tracking-[0.26em] text-[#14100e] lowercase">
                  {profile.brandName}.
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-[#745bc7]">
                  {profile.brandKanji}
                </p>
              </div>
            )}
          </div>

          <p className="mt-9 max-w-[540px] text-[19px] leading-relaxed tracking-[0.03em] text-[#14100e] sm:text-[21px]">
            <span className="font-semibold">{profile.fullName}</span>{" "}
            {pick("—", "—")} {pick(profile.currentRoleEn, profile.currentRoleId)}
            , {profile.currentOrg}.
          </p>

          <div className="mt-6 max-w-[540px] space-y-5 text-[18px] leading-[1.85] tracking-[0.02em] text-[#14100e]/90 sm:text-[19px]">
            {storyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Quiet Pipe-Separated External Links */}
          <div className="mt-7 flex flex-wrap items-center justify-center text-[16px] tracking-[0.08em] text-[#14100e]/85 uppercase sm:text-[17px]">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#745bc7]"
              >
                LinkedIn
              </a>
            )}
            {profile.linkedinUrl && profile.githubUrl && <Pipe />}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#745bc7]"
              >
                GitHub
              </a>
            )}
            {profile.instagramUrl && (
              <>
                <Pipe />
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#745bc7]"
                >
                  Instagram
                </a>
              </>
            )}
            {profile.youtubeUrl && (
              <>
                <Pipe />
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#745bc7]"
                >
                  YouTube
                </a>
              </>
            )}
            {profile.resumeUrl && (
              <>
                <Pipe />
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#745bc7]"
                >
                  {pick("Resume", "CV")}
                </a>
              </>
            )}
          </div>
        </section>

        {/* Minimalist Pipe-Separated CV Lists (OMOCAT Style) */}
        <div className="mx-auto mt-20 max-w-[680px] space-y-12 md:mt-24 md:space-y-14">
          {/* Experience & Education */}
          <section id="experience" className="scroll-mt-24 space-y-9">
            {experiences.map((exp) => {
              const bullets =
                locale === "id" && exp.bullets.id.length > 0
                  ? exp.bullets.id
                  : exp.bullets.en;

              return (
                <article key={exp.id}>
                  <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                    <span>{exp.kind}</span>
                    <Pipe />
                    <span>{exp.organization}</span>
                    <Pipe />
                    <span>{pick(exp.periodEn, exp.periodId)}</span>
                  </h2>

                  <ul className="mt-3.5 list-disc space-y-2 pl-6 text-[17px] leading-[1.65] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
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
                    {pick(exp.summaryEn, exp.summaryId) && (
                      <li>{pick(exp.summaryEn, exp.summaryId)}</li>
                    )}
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                    {exp.tags.length > 0 && (
                      <li>
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

          {/* Certificates (Pipe-Separated Interactive List) */}
          {certificates.length > 0 && (
            <section id="certificates" className="scroll-mt-24">
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
                  {pick("VIEW GALLERY →", "GALERI →")}
                </Link>
              </div>

              <ul className="mt-4 list-disc space-y-2.5 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
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

          {/* Toolkit / Skills */}
          {skillGroups.length > 0 && (
            <section id="toolkit" className="scroll-mt-24">
              <h2 className="text-[19px] font-semibold tracking-[0.06em] text-[#14100e] uppercase sm:text-[21px]">
                <span>{pick("TOOLKIT", "KEAHLIAN")}</span>
                <Pipe />
                <span>{pick("SKILLS", "TEKNOLOGI")}</span>
              </h2>

              <ul className="mt-4 list-disc space-y-2.5 pl-6 text-[17px] leading-[1.6] tracking-[0.02em] text-[#14100e]/90 sm:text-[18px]">
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
      </main>

      <Footer profile={profile} />
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
