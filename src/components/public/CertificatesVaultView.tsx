"use client";

import React, { useMemo, useState } from "react";
import { Award, ExternalLink, Search } from "lucide-react";
import { CinematicHeader } from "@/components/public/CinematicHeader";
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
    <div className="tuyu-subpage-canvas min-h-screen text-[#14100e]">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#7650f3] uppercase">
            VAULT · {certificates.length} {pick("CREDENTIALS", "SERTIFIKAT")}
          </p>
          <h1 className="mt-2 font-editorial text-4xl font-normal tracking-[0.2em] text-[#14100e] uppercase sm:text-5xl">
            CERTIFICATES
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#5c526e]">
            {pick(
              "Certifications, training milestones, and verified credentials. Tap any card to inspect details.",
              "Sertifikasi, pelatihan, dan kredensial terverifikasi. Klik kartu mana pun untuk melihat detail."
            )}
          </p>
        </div>

        {/* Flat TUYU Tabs + Search */}
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-1.5 font-mono text-xs tracking-[0.14em] uppercase transition ${
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
              placeholder={pick("Search certificates...", "Cari sertifikat...")}
              className="w-full rounded-full border border-[#d4c6f4] bg-white/85 py-2 pr-4 pl-9 text-xs text-[#14100e] outline-none transition placeholder:text-[#8c7fab] focus:border-[#7650f3] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-7 w-full" />

        {filtered.length === 0 ? (
          <div className="tuyu-sheet rounded-2xl p-10 text-center">
            <p className="text-sm text-[#5c526e]">
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
                className="tuyu-sheet tuyu-sheet-hover group flex flex-col overflow-hidden rounded-2xl text-left"
              >
                {cert.imageUrl ? (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#e8dffb] bg-white">
                    <img
                      src={cert.imageUrl}
                      alt={pick(cert.titleEn, cert.titleId)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center border-b border-[#e8dffb] bg-[#f4effd]">
                    <Award className="h-8 w-8 text-[#7650f3]/70" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="text-[#7650f3] uppercase">
                      {cert.category}
                    </span>
                    <span className="text-[#6d6188]">{cert.issuedDate}</span>
                  </div>

                  <h2 className="mt-2 text-sm font-semibold text-[#14100e] transition-colors group-hover:text-[#7650f3]">
                    {pick(cert.titleEn, cert.titleId)}
                  </h2>
                  <p className="mt-1 text-xs text-[#5c526e]">{cert.issuer}</p>

                  <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[11px] text-[#7650f3]">
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
