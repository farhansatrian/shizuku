"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Check,
  Copy,
  GraduationCap,
  Mail,
  Sparkles,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { RainPreloader } from "@/components/public/RainPreloader";
import { HeroSection } from "@/components/public/HeroSection";
import { PastelOsWindow } from "@/components/public/PastelOsWindow";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { RaindropIcon } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

export function HomeView({ data }: { data: PortfolioPayload }) {
  const { profile, projects, experiences, certificates, skillGroups } = data;
  const { pick } = useLocale();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  const featuredCerts = certificates.filter((c) => c.featured).slice(0, 3);
  const displayCerts =
    featuredCerts.length > 0 ? featuredCerts : certificates.slice(0, 3);

  const allSkills = skillGroups.flatMap((g) => g.items);
  const marqueeItems =
    allSkills.length > 0
      ? [...allSkills, ...allSkills]
      : ["Next.js", "TypeScript", "Banking IT", "Applied AI", "Docker"];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0fd]">
      <RainPreloader
        brandName={profile.brandName}
        brandKanji={profile.brandKanji}
      />
      <CinematicHeader profile={profile} transparentOnTop />

      <main>
        {/* 1. Full-Bleed TUYU x Omutatsu Rainy Anime Hero */}
        <HeroSection profile={profile} />

        {/* Everything below the Hero lives on the serene watercolor lavender canvas */}
        <div className="shizuku-watercolor-bg">
          {/* 2. Interactive Pastel OS Window + Bento Workspace */}
          <section
            id="overview"
            className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-14 pb-20 sm:px-8 sm:pt-20"
          >
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
                  01 // {pick("DIGITAL WORKSPACE", "RUANG DIGITAL")}
                </p>
                <h2 className="mt-2 font-editorial text-3xl font-semibold tracking-[0.06em] text-[#1e172b] sm:text-4xl">
                  {pick("Profile & Core Craft", "Profil & Fokus Karya")}
                </h2>
              </div>
              <span className="font-mono text-xs text-[#6d608b]">
                雨 · {profile.location}
              </span>
            </div>

            {/* Main Asymmetric Bento Row */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left 7 cols: Interactive Pastel OS Window */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-7"
              >
                <PastelOsWindow profile={profile} skillGroups={skillGroups} />
              </motion.div>

              {/* Right 5 cols: Stacked Twilight & Cozy Bento Tiles */}
              <div className="grid gap-6 lg:col-span-5">
                {/* Twilight High-Contrast Role Spotlight Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="twilight-card relative overflow-hidden rounded-3xl p-6 text-white"
                >
                  <div
                    className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#ee84b5]/25 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-[#fad8e8] uppercase">
                        <Sparkles className="h-3 w-3" />
                        {pick("CURRENT CHAPTER", "BABAK SAAT INI")}
                      </span>
                      <span className="font-mono text-xs text-[#cbbaf8]">
                        {profile.brandKanji}
                      </span>
                    </div>

                    <h3 className="mt-5 font-editorial text-2xl font-semibold tracking-wide text-white">
                      {pick(profile.currentRoleEn, profile.currentRoleId)}
                    </h3>
                    <p className="mt-1 text-sm text-[#d9cef8]">
                      {profile.currentOrg}
                    </p>

                    <div className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-[#e6e0f5]/85">
                      {pick(profile.currentlyEn, profile.currentlyId)}
                    </div>
                  </div>
                </motion.div>

                {/* Pastel Quick Actions & Digital Hub Tile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.14 }}
                  className="pastel-glass flex flex-col justify-between rounded-3xl p-6"
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-[#7650f3] uppercase">
                      {pick("SHIZUKU ECOSYSTEM", "EKOSISTEM SHIZUKU")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f4469]">
                      {pick(
                        "More than a static resume — a living personal hub where software engineering, banking insights, and AI experiments stay organized.",
                        "Lebih dari sekadar CV statis — ruang digital hidup tempat proyek software engineering, wawasan perbankan, dan eksperimen AI tersusun rapi."
                      )}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#1e172b] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#7650f3]"
                    >
                      {pick("Read Full Story", "Baca Cerita Lengkap")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs font-medium text-[#3b2f59] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                      >
                        GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs font-medium text-[#3b2f59] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                      >
                        LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Infinite Pastel Tech & Domain Marquee Strip */}
            <div className="mt-8 overflow-hidden rounded-full border border-[#dfd4f8] bg-white/65 py-3 backdrop-blur-md">
              <div className="animate-marquee flex w-max items-center gap-6 px-4">
                {marqueeItems.map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="flex items-center gap-6 whitespace-nowrap"
                  >
                    <span className="font-mono text-xs tracking-[0.14em] text-[#4c3f6b] uppercase">
                      {item}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ee84b5]" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Column Engineering, Business & AI Pillars Bento Row */}
            {profile.pillars.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {profile.pillars.map((pillar, idx) => (
                  <motion.div
                    key={pillar.code}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="pastel-glass pastel-glass-hover rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#7650f3]">
                        {pillar.code} /
                      </span>
                      <RaindropIcon className="h-4 w-4 text-[#ee84b5]" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#1e172b]">
                      {pick(pillar.titleEn, pillar.titleId)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5c5178]">
                      {pick(pillar.descEn, pillar.descId)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* TUYU-inspired Raindrop Dotted Divider */}
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="raindrop-dotted w-full" />
          </div>

          {/* 3. Featured Projects Showcase */}
          <section
            id="projects"
            className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8"
          >
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
                  02 // {pick("SELECTED WORKS · 作品", "KARYA UNGGULAN · 作品")}
                </p>
                <h2 className="mt-2 font-editorial text-3xl font-semibold tracking-[0.06em] text-[#1e172b] sm:text-4xl">
                  {pick("Featured Projects", "Proyek Unggulan")}
                </h2>
              </div>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-[#dfd4f8] bg-white/80 px-5 py-2.5 text-xs font-medium tracking-wider text-[#2f2350] uppercase transition hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                {pick("All Projects", "Semua Proyek")} ({projects.length})
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.48, delay: idx * 0.08 }}
                  className="pastel-glass pastel-glass-hover group flex flex-col overflow-hidden rounded-3xl"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#201838]"
                  >
                    <img
                      src={project.coverImage || "/assets/cover-platform.jpg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#19132b]/55 via-transparent to-transparent" />
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="rounded-full border border-white/25 bg-[#1a132c]/65 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>
                    <span className="absolute right-3.5 bottom-3 font-mono text-[11px] text-white/90">
                      {project.year}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="text-lg font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#5c5178]">
                      {pick(project.summaryEn, project.summaryId)}
                    </p>

                    {pick(project.impactMetricEn, project.impactMetricId) && (
                      <p className="mt-3 rounded-xl bg-[#f4effd] px-3 py-1.5 font-mono text-[11px] text-[#6641e3]">
                        ✦ {pick(project.impactMetricEn, project.impactMetricId)}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[#e3d9fa] bg-white/90 px-2.5 py-0.5 font-mono text-[10px] text-[#514470]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="rounded-full border border-[#e3d9fa] bg-white/90 px-2.5 py-0.5 font-mono text-[10px] text-[#7650f3]">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-5">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#7650f3] transition group-hover:gap-2.5"
                      >
                        {pick("Read System Spec", "Baca Spesifikasi")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="raindrop-dotted w-full" />
          </div>

          {/* 4. Experience Timeline & Certificates Preview */}
          <section
            id="journey"
            className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8"
          >
            <div className="grid gap-10 lg:grid-cols-12">
              {/* Left 7 cols: Experience & Education Highlights */}
              <div className="lg:col-span-7">
                <div className="mb-7 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
                      03 // {pick("JOURNEY · 経歴", "PERJALANAN · 経歴")}
                    </p>
                    <h2 className="mt-2 font-editorial text-3xl font-semibold tracking-[0.06em] text-[#1e172b]">
                      {pick("Experience & Education", "Pengalaman & Pendidikan")}
                    </h2>
                  </div>
                  <Link
                    href="/about"
                    className="font-mono text-xs text-[#7650f3] hover:underline"
                  >
                    {pick("Full Timeline →", "Selengkapnya →")}
                  </Link>
                </div>

                <div className="space-y-4">
                  {experiences.slice(0, 3).map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                      className="pastel-glass rounded-3xl p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3ecff] text-[#7650f3]">
                            {exp.kind === "EDUCATION" ? (
                              <GraduationCap className="h-4 w-4" />
                            ) : (
                              <Briefcase className="h-4 w-4" />
                            )}
                          </span>
                          <div>
                            <h3 className="text-base font-semibold text-[#1e172b]">
                              {pick(exp.roleEn, exp.roleId)}
                            </h3>
                            <p className="text-sm text-[#7650f3]">
                              {exp.organization}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {exp.isCurrent && (
                            <span className="rounded-full bg-[#fce4f0] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#c54784] uppercase">
                              {pick("Current", "Aktif")}
                            </span>
                          )}
                          <span className="font-mono text-xs text-[#6a5e88]">
                            {pick(exp.periodEn, exp.periodId)}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#5c5178]">
                        {pick(exp.summaryEn, exp.summaryId)}
                      </p>

                      {exp.tags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[#e3d9fa] bg-white/85 px-2.5 py-0.5 font-mono text-[10px] text-[#554777]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right 5 cols: Certificates Preview */}
              <div className="lg:col-span-5">
                <div className="mb-7 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs tracking-[0.22em] text-[#ee84b5] uppercase">
                      04 // {pick("CREDENTIALS", "SERTIFIKASI")}
                    </p>
                    <h2 className="mt-2 font-editorial text-3xl font-semibold tracking-[0.06em] text-[#1e172b]">
                      {pick("Certificates", "Sertifikat")}
                    </h2>
                  </div>
                  <Link
                    href="/certificates"
                    className="font-mono text-xs text-[#7650f3] hover:underline"
                  >
                    {pick("View Vault →", "Lihat Semua →")}
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {displayCerts.map((cert, idx) => (
                    <motion.button
                      key={cert.id}
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="pastel-glass pastel-glass-hover group w-full rounded-3xl p-5 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3ecff] to-[#fdebf5] text-[#7650f3]">
                          <Award className="h-4 w-4" />
                        </span>
                        <span className="rounded-full border border-[#e5dcfb] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#6d608b]">
                          {cert.issuedDate}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                        {pick(cert.titleEn, cert.titleId)}
                      </h3>
                      <p className="mt-1 text-xs text-[#645882]">
                        {cert.issuer} ·{" "}
                        <span className="font-mono text-[10px] text-[#7650f3]">
                          {cert.category}
                        </span>
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Dreamy Contact CTA Card */}
          <section
            id="contact"
            className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 sm:px-8"
          >
            <div className="twilight-card relative overflow-hidden rounded-[2rem] px-7 py-12 text-white sm:px-12 sm:py-16">
              <div
                className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#7650f3]/35 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-[#ee84b5]/30 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="font-mono text-xs tracking-[0.22em] text-[#fad8e8] uppercase">
                    GET IN TOUCH · {profile.brandKanji}
                  </p>
                  <h2 className="mt-3 font-editorial text-3xl font-semibold tracking-wide text-white sm:text-4xl">
                    {pick(
                      "Let’s build calm, impactful technology together.",
                      "Mari berdiskusi & membangun solusi digital yang berdampak."
                    )}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#ddd4f5] sm:text-base">
                    {pick(
                      "Always happy to chat about banking software engineering, applied AI workflows, creative web interfaces, or new ideas.",
                      "Selalu terbuka untuk berdiskusi seputar software engineering perbankan, alur kerja AI terapan, desain web kreatif, atau ide kolaborasi baru."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1e172b] transition hover:-translate-y-0.5 hover:bg-[#f6eefe]"
                  >
                    <Mail className="h-4 w-4 text-[#7650f3]" />
                    {pick("Email Me", "Kirim Email")}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 font-mono text-xs text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#9ae6c5]" />
                        {pick("Copied!", "Tersalin!")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {profile.email}
                      </>
                    )}
                  </button>
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
