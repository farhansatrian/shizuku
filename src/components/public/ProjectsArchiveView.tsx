"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
    <div className="tuyu-subpage-canvas min-h-screen text-[#14100e]">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#7650f3] uppercase">
            ARCHIVE · {projects.length} {pick("WORKS", "KARYA")}
          </p>
          <h1 className="mt-2 font-editorial text-4xl font-normal tracking-[0.2em] text-[#14100e] uppercase sm:text-5xl">
            PROJECTS
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#5c526e]">
            {pick(
              "Banking technology systems, applied AI explorations, and self-hosted software — each with clean architectural specifications.",
              "Sistem teknologi perbankan, eksplorasi AI terapan, dan perangkat lunak mandiri — masing-masing dilengkapi spesifikasi arsitektur."
            )}
          </p>
        </div>

        {/* Clean TUYU Flat Tabs + Search */}
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-1.5 font-mono text-xs tracking-[0.16em] uppercase transition ${
                    active
                      ? "border-b-2 border-[#7650f3] font-semibold text-[#7650f3]"
                      : "border-b-2 border-transparent text-[#5c526e] hover:text-[#14100e]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#7f719c]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick("Search works...", "Cari proyek...")}
              className="w-full rounded-full border border-[#d4c6f4] bg-white/85 py-2 pr-4 pl-9 text-xs text-[#14100e] outline-none transition placeholder:text-[#8c7fab] focus:border-[#7650f3] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-7 w-full" />

        {filtered.length === 0 ? (
          <div className="tuyu-sheet rounded-2xl p-10 text-center">
            <p className="text-sm text-[#5c526e]">
              {pick("No matching projects found.", "Belum ada proyek yang cocok.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="tuyu-sheet tuyu-sheet-hover group flex flex-col overflow-hidden rounded-2xl"
              >
                {project.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden border-b border-[#e5dcfb] bg-[#211a38]">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.14em] uppercase">
                    <span className="text-[#7650f3]">{project.category}</span>
                    <span className="text-[#6d6188]">
                      {project.status} · {project.year}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                    {project.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-[#5c526e]">
                    {pick(project.summaryEn, project.summaryId)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[#e2d8f8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#514470]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#7650f3]">
                      {pick("Open Spec Sheet", "Buka Spesifikasi")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
