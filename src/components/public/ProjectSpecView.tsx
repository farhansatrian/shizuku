"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Globe,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { Footer } from "@/components/public/Footer";
import { RaindropIcon } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile, SerializedProject } from "@/lib/types";

export function ProjectSpecView({
  profile,
  project,
  related,
}: {
  profile: SerializedProfile;
  project: SerializedProject;
  related: SerializedProject[];
}) {
  const { pick } = useLocale();
  const description = pick(project.descriptionEn, project.descriptionId);
  const paragraphs = description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen shizuku-watercolor-bg">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#6a5c8d] transition hover:text-[#7650f3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {pick("Back to Projects Archive", "Kembali ke Arsip Proyek")}
        </Link>

        {/* Editorial Spec Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-[#7650f3] px-3.5 py-1 font-mono text-[10px] tracking-[0.18em] text-white uppercase">
              {project.category}
            </span>
            <span className="rounded-full border border-[#dfd4f8] bg-white/85 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-[#5c39d6] uppercase">
              {project.status}
            </span>
            <span className="font-mono text-xs text-[#6a5c8d]">
              {project.year}
            </span>
          </div>

          <h1 className="mt-4 font-editorial text-4xl font-semibold tracking-[0.04em] text-[#1e172b] sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#544872] sm:text-lg">
            {pick(project.summaryEn, project.summaryId)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white shadow-[0_10px_24px_-10px_rgba(118,80,243,0.7)] transition hover:bg-[#5e38dc]"
              >
                <Globe className="h-3.5 w-3.5" />
                {pick("Launch Live Site", "Buka Website Live")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#dfd4f8] bg-white/85 px-5 py-2.5 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <Code2 className="h-3.5 w-3.5" />
                {pick("Source Repository", "Kode Sumber GitHub")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Framed Editorial Cover Art */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="pastel-glass mt-8 overflow-hidden rounded-[2rem] p-2.5 sm:p-3"
        >
          <div className="aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-[#1e1733]">
            <img
              src={project.coverImage || "/assets/cover-platform.jpg"}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* System Specifications Datasheet + Overview */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Left 5 cols: System Specifications Card */}
          <div className="pastel-glass h-fit rounded-3xl p-6 lg:col-span-5">
            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#7650f3] uppercase">
              {pick("SYSTEM SPECIFICATIONS", "SPESIFIKASI SISTEM")}
            </p>
            <dl className="mt-4 divide-y divide-[#ece5fc] text-sm">
              <div className="py-3">
                <dt className="font-mono text-[10px] tracking-wider text-[#7e709f] uppercase">
                  {pick("Role", "Peran")}
                </dt>
                <dd className="mt-0.5 font-medium text-[#1e172b]">
                  {pick(project.roleEn, project.roleId)}
                </dd>
              </div>
              <div className="py-3">
                <dt className="font-mono text-[10px] tracking-wider text-[#7e709f] uppercase">
                  {pick("Status / Year", "Status / Tahun")}
                </dt>
                <dd className="mt-0.5 font-mono text-xs text-[#1e172b]">
                  {project.status} · {project.year}
                </dd>
              </div>
              {pick(project.impactMetricEn, project.impactMetricId) && (
                <div className="py-3">
                  <dt className="font-mono text-[10px] tracking-wider text-[#7e709f] uppercase">
                    {pick("Key Impact", "Dampak Utama")}
                  </dt>
                  <dd className="mt-0.5 font-medium text-[#6b44eb]">
                    {pick(project.impactMetricEn, project.impactMetricId)}
                  </dd>
                </div>
              )}
              <div className="pt-3">
                <dt className="font-mono text-[10px] tracking-wider text-[#7e709f] uppercase">
                  {pick("Core Technologies", "Teknologi Inti")}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[#e3d9fa] bg-[#f7f3ff] px-2.5 py-0.5 font-mono text-[11px] text-[#3d315c]"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right 7 cols: Narrative & Context */}
          <div className="pastel-glass rounded-3xl p-6 sm:p-8 lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#ee84b5] uppercase">
              {pick("PROJECT OVERVIEW", "GAMBARAN PROYEK")}
            </p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#463b63] sm:text-base">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{pick(project.summaryEn, project.summaryId)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Numbered Architecture Highlights (Supercomfy depth x TUYU beauty) */}
        {project.highlights.length > 0 && (
          <section className="mt-12">
            <p className="font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
              {pick("ARCHITECTURE HIGHLIGHTS", "SOROTAN ARSITEKTUR")}
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {project.highlights.map((hl) => (
                <div
                  key={hl.code}
                  className="pastel-glass rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#7650f3]">
                      {hl.code} /
                    </span>
                    <RaindropIcon className="h-4 w-4 text-[#ee84b5]" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[#1e172b]">
                    {pick(hl.titleEn, hl.titleId)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c5178]">
                    {pick(hl.detailEn, hl.detailId)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Works */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="raindrop-dotted mb-10 w-full" />
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-editorial text-2xl font-semibold text-[#1e172b] sm:text-3xl">
                {pick("More Works in shizuku", "Karya Lain di shizuku")}
              </h2>
              <Link
                href="/projects"
                className="font-mono text-xs text-[#7650f3] hover:underline"
              >
                {pick("View All →", "Semua →")}
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="pastel-glass pastel-glass-hover group rounded-3xl p-5"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[#7650f3] uppercase">
                    {item.category} · {item.year}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#62577a]">
                    {pick(item.summaryEn, item.summaryId)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#7650f3]">
                    {pick("Read Spec", "Baca Spec")}{" "}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
