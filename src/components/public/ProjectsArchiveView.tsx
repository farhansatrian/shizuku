"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { Footer } from "@/components/public/Footer";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function ProjectsArchiveView({ data }: { data: PortfolioPayload }) {
  const { profile, projects } = data;
  const { pick } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(projects.map((p) => p.category)));
    return ["ALL", ...uniq];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const catOk =
        selectedCategory === "ALL" || p.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summaryEn.toLowerCase().includes(q) ||
        p.summaryId.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, selectedCategory, query]);

  return (
    <div className="min-h-screen shizuku-watercolor-bg">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-6xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        {/* Editorial Header */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.24em] text-[#7650f3] uppercase">
            ARCHIVE // {pick("PROJECTS & SPECS · 作品", "PROYEK & SPESIFIKASI · 作品")}
          </p>
          <h1 className="mt-3 font-editorial text-4xl font-semibold tracking-[0.06em] text-[#1e172b] sm:text-5xl">
            {pick("Systems, Experiments & Works", "Sistem, Eksperimen & Karya")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#5c5178]">
            {pick(
              "A curated index of software engineering platforms, banking IT architectures, and applied AI tools — each documented like an editorial technical datasheet.",
              "Indeks pilihan dari platform software engineering, arsitektur IT perbankan, dan eksplorasi AI terapan — masing-masing terdokumentasi rapi."
            )}
          </p>
        </div>

        {/* TUYU-Style Category Filter Tabs + Search */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.14em] uppercase transition ${
                    active
                      ? "border-[#7650f3] bg-[#7650f3] text-white shadow-[0_8px_20px_-8px_rgba(118,80,243,0.65)]"
                      : "border-[#dfd4f8] bg-white/80 text-[#534674] hover:border-[#7650f3]/50 hover:text-[#7650f3]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8979ad]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick("Search projects or stack...", "Cari proyek atau tech...")}
              className="w-full rounded-full border border-[#dfd4f8] bg-white/85 py-2 pr-4 pl-10 text-xs text-[#1e172b] outline-none transition placeholder:text-[#9689b8] focus:border-[#7650f3] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-8 w-full" />

        {/* Project Grid */}
        {filtered.length === 0 ? (
          <div className="pastel-glass rounded-3xl p-12 text-center">
            <p className="font-editorial text-2xl text-[#1e172b]">
              {pick("No matching projects found.", "Belum ada proyek yang cocok.")}
            </p>
            <p className="mt-2 text-sm text-[#62577a]">
              {pick(
                "Try another filter or add new projects via /admin.",
                "Coba filter lain atau tambahkan proyek baru melalui /admin."
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
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
                  <span className="absolute top-3.5 left-3.5 rounded-full border border-white/25 bg-[#1a132c]/65 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-md">
                    {project.category}
                  </span>
                  <span className="absolute top-3.5 right-3.5 rounded-full bg-white/85 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#5c39d6]">
                    {project.status}
                  </span>
                  <span className="absolute right-3.5 bottom-3 font-mono text-[11px] text-white/90">
                    {project.year}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/projects/${project.slug}`}>
                    <h2 className="text-lg font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                      {project.title}
                    </h2>
                  </Link>
                  <p className="mt-1 font-mono text-[11px] text-[#7b6ba0]">
                    {pick(project.roleEn, project.roleId)}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#5c5178]">
                    {pick(project.summaryEn, project.summaryId)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[#e3d9fa] bg-white/90 px-2.5 py-0.5 font-mono text-[10px] text-[#514470]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#7650f3] transition group-hover:gap-2.5"
                    >
                      {pick("Open Spec Sheet", "Buka Datasheet Proyek")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
