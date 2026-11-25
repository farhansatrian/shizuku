"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Globe } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
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
    <div className="tuyu-subpage-canvas relative min-h-screen text-[#14100e]">
      <TuyuRainLayer />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-[90%] max-w-[960px] pt-28 pb-24 md:pt-36">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#745bc7] transition hover:text-[#7650f3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {pick("Back to Portfolio", "Kembali ke Portfolio")}
        </Link>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase">
            <span className="rounded-[5px] bg-[#745bc7] px-2.5 py-0.5 text-white">
              {project.category}
            </span>
            <span className="text-[#745bc7]">
              {project.status} · {project.year}
            </span>
          </div>

          <h1 className="mt-4 font-editorial text-3xl font-normal tracking-[0.08em] text-[#745bc7] sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#5d5370] sm:text-base">
            {pick(project.summaryEn, project.summaryId)}
          </p>

          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-full bg-[#745bc7] px-5 py-2 font-mono text-xs text-white transition hover:bg-[#7650f3]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {pick("Launch Site", "Buka Website")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-[#745bc7] bg-white/80 px-5 py-2 font-mono text-xs text-[#745bc7] transition hover:bg-[#745bc7] hover:text-white"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  {pick("Repository", "Kode Sumber")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {project.coverImage && (
          <div className="tuyu-sheet mt-8 overflow-hidden rounded-2xl p-2">
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#211a38]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="tuyu-sheet h-fit rounded-2xl p-5 sm:p-6 lg:col-span-5">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              {pick("SYSTEM SPECIFICATIONS", "SPESIFIKASI SISTEM")}
            </p>
            <dl className="mt-4 divide-y divide-[#e8dffb] text-sm">
              <div className="py-2.5">
                <dt className="font-mono text-[10px] tracking-wider text-[#6d6188] uppercase">
                  {pick("Role", "Peran")}
                </dt>
                <dd className="mt-0.5 text-[#14100e]">
                  {pick(project.roleEn, project.roleId)}
                </dd>
              </div>
              <div className="py-2.5">
                <dt className="font-mono text-[10px] tracking-wider text-[#6d6188] uppercase">
                  {pick("Status", "Status")}
                </dt>
                <dd className="mt-0.5 font-mono text-xs text-[#14100e]">
                  {project.status} · {project.year}
                </dd>
              </div>
              {pick(project.impactMetricEn, project.impactMetricId) && (
                <div className="py-2.5">
                  <dt className="font-mono text-[10px] tracking-wider text-[#6d6188] uppercase">
                    {pick("Impact", "Dampak")}
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-[#7650f3]">
                    {pick(project.impactMetricEn, project.impactMetricId)}
                  </dd>
                </div>
              )}
              <div className="pt-3">
                <dt className="font-mono text-[10px] tracking-wider text-[#6d6188] uppercase">
                  {pick("Stack", "Teknologi")}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[#dfd4f8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#3c3159]"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="tuyu-sheet rounded-2xl p-5 sm:p-6 lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              {pick("OVERVIEW", "GAMBARAN")}
            </p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#3d334c] sm:text-[15px]">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{pick(project.summaryEn, project.summaryId)}</p>
              )}
            </div>
          </div>
        </div>

        {project.highlights.length > 0 && (
          <section className="mt-10">
            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#7650f3] uppercase">
              {pick("ARCHITECTURE HIGHLIGHTS", "SOROTAN ARSITEKTUR")}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {project.highlights.map((hl) => (
                <div key={hl.code} className="tuyu-sheet rounded-2xl p-5">
                  <span className="font-mono text-xs font-semibold text-[#7650f3]">
                    {hl.code} /
                  </span>
                  <h2 className="mt-2 text-sm font-semibold text-[#14100e]">
                    {pick(hl.titleEn, hl.titleId)}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#5c526e] sm:text-sm">
                    {pick(hl.detailEn, hl.detailId)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14">
            <div className="raindrop-dotted mb-8 w-full" />
            <div className="flex items-end justify-between">
              <h2 className="font-editorial text-2xl font-normal tracking-[0.16em] text-[#14100e] uppercase">
                {pick("MORE WORKS", "KARYA LAIN")}
              </h2>
              <Link
                href="/portfolio"
                className="font-mono text-xs text-[#7650f3] hover:underline"
              >
                {pick("All →", "Semua →")}
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="tuyu-sheet tuyu-sheet-hover group rounded-2xl p-4"
                >
                  <span className="font-mono text-[10px] text-[#7650f3] uppercase">
                    {item.category} · {item.year}
                  </span>
                  <h3 className="mt-1.5 text-sm font-semibold text-[#14100e] group-hover:text-[#7650f3]">
                    {item.title}
                  </h3>
                  <span className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] text-[#5c526e] group-hover:text-[#7650f3]">
                    {pick("Read", "Baca")} <ArrowRight className="h-3 w-3" />
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
