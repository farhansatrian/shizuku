"use client";

import React, { useMemo, useState } from "react";
import { Award, ExternalLink, Search } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { CertificateModal } from "@/components/public/CertificateModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload, SerializedCertificate } from "@/lib/types";

export function CertificatesVaultView({ data }: { data: PortfolioPayload }) {
  const { profile, certificates } = data;
  const { pick } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [selectedCert, setSelectedCert] =
    useState<SerializedCertificate | null>(null);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(certificates.map((c) => c.category)));
    return ["ALL", ...uniq];
  }, [certificates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return certificates.filter((c) => {
      const catOk =
        selectedCategory === "ALL" || c.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        c.titleEn.toLowerCase().includes(q) ||
        c.titleId.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.issuedDate.toLowerCase().includes(q)
      );
    });
  }, [certificates, selectedCategory, query]);

  return (
    <div className="tuyu-subpage-canvas relative min-h-screen text-[#14100e]">
      <TuyuRainLayer />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto w-[90%] max-w-[1000px] pt-28 pb-24 md:pt-36">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#745bc7] uppercase">
            VAULT · {certificates.length} {pick("CREDENTIALS", "SERTIFIKAT")}
          </p>
          <h1 className="mt-2 font-editorial text-[28px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:text-[36px] md:tracking-[9px]">
            CERTIFICATES
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5d5370]">
            {pick(
              "Certifications, training milestones, and verified credentials. Tap any card to inspect details.",
              "Sertifikasi, pelatihan, dan kredensial terverifikasi. Klik kartu mana pun untuk melihat detail."
            )}
          </p>
        </div>

        {/* Exact tuyu.moe Pipe-Separated Tabs + Search */}
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex max-w-full flex-nowrap items-center overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat, idx) => {
              const active = selectedCategory === cat;
              return (
                <li
                  key={cat}
                  className={`shrink-0 border-r border-[#745bc7] ${
                    idx === 0 ? "border-l" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-2.5 py-0.5 font-editorial text-[11px] tracking-[1.5px] text-[#745bc7] uppercase transition hover:text-[#d749d5] md:px-4 md:text-[13px] md:tracking-[3px] ${
                      active ? "font-bold" : "font-normal opacity-80"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#745bc7]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick("Search certificates...", "Cari sertifikat...")}
              className="w-full rounded-full border border-[#745bc7]/40 bg-white/80 py-2 pr-4 pl-9 text-xs text-[#14100e] outline-none transition placeholder:text-[#7f719c] focus:border-[#745bc7] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-8 w-full" />

        {filtered.length === 0 ? (
          <div className="tuyu-sheet rounded-xl p-10 text-center">
            <p className="text-sm text-[#5d5370]">
              {pick(
                "No certificates match this filter.",
                "Belum ada sertifikat yang cocok."
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setSelectedCert(cert)}
                className="tuyu-sheet tuyu-sheet-hover group flex flex-col overflow-hidden rounded-xl text-left"
              >
                {cert.imageUrl ? (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#745bc7]/15 bg-white">
                    <img
                      src={cert.imageUrl}
                      alt={pick(cert.titleEn, cert.titleId)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center border-b border-[#745bc7]/15 bg-[#f4effd]">
                    <Award className="h-8 w-8 text-[#745bc7]/70" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="rounded-[5px] bg-[#745bc7] px-2 py-0.5 text-white uppercase">
                      {cert.category}
                    </span>
                    <span className="text-[#745bc7]">{cert.issuedDate}</span>
                  </div>

                  <h2 className="mt-2.5 text-sm font-semibold text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                    {pick(cert.titleEn, cert.titleId)}
                  </h2>
                  <p className="mt-1 text-xs text-[#5d5370]">{cert.issuer}</p>

                  <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[11px] text-[#745bc7] group-hover:text-[#7650f3]">
                    <span>{pick("Inspect", "Detail")}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
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
