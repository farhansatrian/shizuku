"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { RaindropIcon } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

export function AboutView({ data }: { data: PortfolioPayload }) {
  const { profile, experiences, certificates, skillGroups } = data;
  const { locale, pick } = useLocale();

  const [expFilter, setExpFilter] = useState<string>("ALL");
  const [certFilter, setCertFilter] = useState<string>("ALL");
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const storyParagraphs = pick(profile.aboutStoryEn, profile.aboutStoryId)
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const filteredExperiences = useMemo(() => {
    if (expFilter === "ALL") return experiences;
    return experiences.filter((e) => e.kind === expFilter);
  }, [experiences, expFilter]);

  const certCategories = useMemo(() => {
    const uniq = Array.from(new Set(certificates.map((c) => c.category)));
    return ["ALL", ...uniq];
  }, [certificates]);

  const filteredCerts = useMemo(() => {
    if (certFilter === "ALL") return certificates;
    return certificates.filter((c) => c.category === certFilter);
  }, [certificates, certFilter]);

  return (
    <div className="min-h-screen shizuku-watercolor-bg">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-6xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        {/* Top Story & Anime Portrait Section */}
        <section className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-xs tracking-[0.24em] text-[#7650f3] uppercase">
              PROFILE // {pick("ABOUT ME · 自己紹介", "TENTANG SAYA · 自己紹介")}
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-semibold tracking-[0.05em] text-[#1e172b] sm:text-5xl">
              {profile.fullName}
            </h1>
            <p className="mt-2 font-mono text-xs text-[#7650f3]">
              {pick(profile.currentRoleEn, profile.currentRoleId)} ·{" "}
              {profile.currentOrg}
            </p>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#4b4066] sm:text-base">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#5e38dc]"
                >
                  LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white/85 px-5 py-2.5 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                >
                  GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white/85 px-5 py-2.5 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                >
                  {pick("Resume / CV", "Unduh CV")}{" "}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Portrait & Quick Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="pastel-glass overflow-hidden rounded-[2rem] p-4 lg:col-span-5"
          >
            <div className="aspect-square overflow-hidden rounded-[1.5rem] border border-white bg-[#efe8fd]">
              <img
                src={profile.avatarImage || "/assets/avatar-rainy.jpg"}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#5d517a]">
                <MapPin className="h-3.5 w-3.5 text-[#ee84b5]" />
                {profile.location}
              </span>
              <span className="rounded-full bg-[#f3ecff] px-3 py-1 font-mono text-[11px] text-[#7650f3]">
                {profile.brandName} · {profile.brandKanji}
              </span>
            </div>
          </motion.div>
        </section>

        <div className="raindrop-dotted my-16 w-full" />

        {/* Experience & Education Timeline */}
        <section id="experience">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
                TIMELINE // {pick("EXPERIENCE & EDUCATION", "PENGALAMAN & PENDIDIKAN")}
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#1e172b] sm:text-4xl">
                {pick("Career & Academic Path", "Perjalanan Karier & Akademik")}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "WORK", "EDUCATION", "ORGANIZATION"].map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setExpFilter(kind)}
                  className={`rounded-full border px-3.5 py-1 font-mono text-[11px] uppercase transition ${
                    expFilter === kind
                      ? "border-[#7650f3] bg-[#7650f3] text-white"
                      : "border-[#dfd4f8] bg-white/80 text-[#594b7a] hover:border-[#7650f3]/40"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="relative space-y-5 pl-6 before:absolute before:top-4 before:bottom-4 before:left-2 before:w-px before:bg-gradient-to-b before:from-[#7650f3] before:via-[#ee84b5] before:to-transparent">
            {filteredExperiences.map((exp) => {
              const bullets =
                locale === "id" && exp.bullets.id.length > 0
                  ? exp.bullets.id
                  : exp.bullets.en;
              return (
                <div
                  key={exp.id}
                  className="pastel-glass relative rounded-3xl p-6"
                >
                  <span className="absolute top-7 -left-[22px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#7650f3] bg-[#faf7ff]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ee84b5]" />
                  </span>

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3ecff] text-[#7650f3]">
                        {exp.kind === "EDUCATION" ? (
                          <GraduationCap className="h-5 w-5" />
                        ) : exp.kind === "ORGANIZATION" ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          <Briefcase className="h-5 w-5" />
                        )}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-[#1e172b]">
                          {pick(exp.roleEn, exp.roleId)}
                        </h3>
                        <p className="text-sm font-medium text-[#7650f3]">
                          {exp.organization}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-[#7b6e9e]">
                          {exp.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {exp.isCurrent && (
                        <span className="rounded-full bg-[#fce4f0] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#c54784] uppercase">
                          {pick("Current", "Aktif")}
                        </span>
                      )}
                      <span className="rounded-full border border-[#e3d8fa] bg-white px-3 py-1 font-mono text-xs text-[#544775]">
                        {pick(exp.periodEn, exp.periodId)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#4f436b]">
                    {pick(exp.summaryEn, exp.summaryId)}
                  </p>

                  {bullets.length > 0 && (
                    <ul className="mt-3.5 space-y-2">
                      {bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#574c75]"
                        >
                          <RaindropIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-[#ee84b5]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#e3d9fa] bg-white/85 px-2.5 py-0.5 font-mono text-[10px] text-[#514470]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="raindrop-dotted my-16 w-full" />

        {/* Certificates Vault */}
        <section id="certificates">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-[#ee84b5] uppercase">
                VAULT // {pick("CERTIFICATES & AWARDS", "SERTIFIKAT & PENGHARGAAN")}
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#1e172b] sm:text-4xl">
                {pick("Verified Credentials", "Sertifikasi & Kredensial")}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {certCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCertFilter(cat)}
                  className={`rounded-full border px-3.5 py-1 font-mono text-[11px] uppercase transition ${
                    certFilter === cat
                      ? "border-[#7650f3] bg-[#7650f3] text-white"
                      : "border-[#dfd4f8] bg-white/80 text-[#594b7a] hover:border-[#7650f3]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCerts.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setSelectedCert(cert)}
                className="pastel-glass pastel-glass-hover group flex flex-col overflow-hidden rounded-3xl text-left"
              >
                {cert.imageUrl ? (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#e8dffb] bg-white">
                    <img
                      src={cert.imageUrl}
                      alt={pick(cert.titleEn, cert.titleId)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center border-b border-[#e8dffb] bg-gradient-to-br from-[#f4eeff] via-[#faf5ff] to-[#fdebf5]">
                    <Award className="h-10 w-10 text-[#7650f3]/65" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] tracking-wider text-[#7650f3] uppercase">
                      {cert.category}
                    </span>
                    <span className="font-mono text-[11px] text-[#7a6d9c]">
                      {cert.issuedDate}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                    {pick(cert.titleEn, cert.titleId)}
                  </h3>
                  <p className="mt-1 text-xs text-[#645882]">{cert.issuer}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Skills Matrix */}
        {skillGroups.length > 0 && (
          <section className="mt-16">
            <div className="raindrop-dotted mb-12 w-full" />
            <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
              TOOLKIT // {pick("SKILLS & DOMAINS", "KEAHLIAN & DOMAIN")}
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group) => (
                <div key={group.id} className="pastel-glass rounded-3xl p-5">
                  <h3 className="font-mono text-xs font-semibold tracking-wider text-[#7650f3] uppercase">
                    {pick(group.nameEn, group.nameId)}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#e3d9fa] bg-white/90 px-2.5 py-0.5 font-mono text-[11px] text-[#3c3159]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer profile={profile} />
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
