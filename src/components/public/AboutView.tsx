"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { Footer } from "@/components/public/Footer";
import { RaindropIcon, UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function AboutView({ data }: { data: PortfolioPayload }) {
  const { profile, experiences, certificates, skillGroups } = data;
  const { locale, pick } = useLocale();
  const [expFilter, setExpFilter] = useState<string>("ALL");

  const storyParagraphs = pick(profile.aboutStoryEn, profile.aboutStoryId)
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const filteredExperiences = useMemo(() => {
    if (expFilter === "ALL") return experiences;
    return experiences.filter((e) => e.kind === expFilter);
  }, [experiences, expFilter]);

  return (
    <div className="tuyu-subpage-canvas min-h-screen text-[#14100e]">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        {/* Clean Editorial Story + Optional Portrait */}
        <section className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#7650f3] uppercase">
              PROFILE · {profile.location}
            </p>
            <h1 className="mt-2 font-editorial text-4xl font-normal tracking-[0.14em] text-[#14100e] uppercase sm:text-5xl">
              {profile.fullName}
            </h1>
            <p className="mt-2 font-mono text-xs text-[#5c526e]">
              {pick(profile.currentRoleEn, profile.currentRoleId)} —{" "}
              {profile.currentOrg}
            </p>

            <div className="mt-7 space-y-4 text-sm leading-relaxed text-[#3a3147] sm:text-[15px]">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#14100e] px-5 py-2 font-mono text-xs text-white transition hover:bg-[#7650f3]"
                >
                  LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#d4c6f4] bg-white px-5 py-2 font-mono text-xs text-[#14100e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                >
                  GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#d4c6f4] bg-white px-5 py-2 font-mono text-xs text-[#14100e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                >
                  {pick("Resume", "CV")} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Right Quiet Frame (Uses custom uploaded avatar if set, otherwise clean umbrella emblem) */}
          <div className="lg:col-span-4">
            <div className="tuyu-sheet overflow-hidden rounded-2xl p-4">
              {profile.avatarImage?.trim() ? (
                <div className="aspect-square overflow-hidden rounded-xl bg-[#e5dcfb]">
                  <img
                    src={profile.avatarImage}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex aspect-square flex-col items-center justify-center rounded-xl text-center"
                  style={{
                    background:
                      "linear-gradient(145deg, #fbd9ea 0%, #e5dcfb 100%)",
                  }}
                >
                  <UmbrellaMark className="h-12 w-12 text-[#7650f3]" />
                  <p className="mt-3 font-editorial text-2xl tracking-[0.22em] text-[#14100e] lowercase">
                    {profile.brandName}.
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#5c526e]">
                    {profile.brandKanji}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between px-1 font-mono text-[11px] text-[#5c526e]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#7650f3]" />
                  {profile.location}
                </span>
                <span>{certificates.length} certs</span>
              </div>
            </div>
          </div>
        </section>

        <div className="raindrop-dotted my-14 w-full" />

        {/* Experience & Education Timeline */}
        <section id="experience" className="scroll-mt-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-editorial text-3xl font-normal tracking-[0.2em] text-[#14100e] uppercase">
                {pick("EXPERIENCE", "PENGALAMAN")}
              </h2>
              <p className="mt-1 text-xs text-[#5c526e]">
                {pick("Career, banking technology & academic timeline", "Riwayat karier, teknologi perbankan & pendidikan")}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["ALL", "WORK", "EDUCATION", "ORGANIZATION"].map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setExpFilter(kind)}
                  className={`pb-1 font-mono text-xs tracking-[0.14em] uppercase transition ${
                    expFilter === kind
                      ? "border-b-2 border-[#7650f3] font-semibold text-[#7650f3]"
                      : "border-b-2 border-transparent text-[#5c526e] hover:text-[#14100e]"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="tuyu-sheet mt-8 rounded-2xl p-8 text-center">
              <p className="text-sm text-[#5c526e]">
                {pick(
                  "No timeline entries in this category yet.",
                  "Belum ada riwayat pada kategori ini."
                )}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {filteredExperiences.map((exp) => {
                const bullets =
                  locale === "id" && exp.bullets.id.length > 0
                    ? exp.bullets.id
                    : exp.bullets.en;
                return (
                  <article
                    key={exp.id}
                    className="tuyu-sheet rounded-2xl p-5 sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e5dcfb]/80 text-[#7650f3]">
                          {exp.kind === "EDUCATION" ? (
                            <GraduationCap className="h-4 w-4" />
                          ) : exp.kind === "ORGANIZATION" ? (
                            <Users className="h-4 w-4" />
                          ) : (
                            <Briefcase className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-[#14100e]">
                            {pick(exp.roleEn, exp.roleId)}
                          </h3>
                          <p className="text-sm text-[#7650f3]">
                            {exp.organization}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-[#6d6188]">
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:shrink-0">
                        {exp.isCurrent && (
                          <span className="rounded-full bg-[#fad8e8] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#9e3168] uppercase">
                            {pick("Current", "Aktif")}
                          </span>
                        )}
                        <span className="font-mono text-xs text-[#5c526e]">
                          {pick(exp.periodEn, exp.periodId)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#423854]">
                      {pick(exp.summaryEn, exp.summaryId)}
                    </p>

                    {bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {bullets.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs leading-relaxed text-[#544a69] sm:text-sm"
                          >
                            <RaindropIcon className="mt-1 h-3 w-3 shrink-0 text-[#7650f3]" />
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
                            className="rounded-full border border-[#dfd4f8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#514470]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Skills Matrix */}
        {skillGroups.length > 0 && (
          <section className="mt-14">
            <div className="raindrop-dotted mb-12 w-full" />
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-editorial text-3xl font-normal tracking-[0.2em] text-[#14100e] uppercase">
                {pick("TOOLKIT", "KEAHLIAN")}
              </h2>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#7650f3] hover:underline"
              >
                {pick("View Certificates Vault", "Lihat Galeri Sertifikat")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group) => (
                <div key={group.id} className="tuyu-sheet rounded-2xl p-5">
                  <h3 className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#7650f3] uppercase">
                    {pick(group.nameEn, group.nameId)}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#dfd4f8] bg-white px-2.5 py-0.5 font-mono text-[11px] text-[#3c3159]"
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
    </div>
  );
}
