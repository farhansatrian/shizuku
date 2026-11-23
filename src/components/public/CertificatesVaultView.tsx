"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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

  const issuerCount = useMemo(
    () => new Set(certificates.map((c) => c.issuer)).size,
    [certificates]
  );

  return (
    <div className="min-h-screen shizuku-watercolor-bg">
      <CinematicHeader profile={profile} />

      <main className="mx-auto max-w-6xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
        {/* Editorial Vault Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.24em] text-[#ee84b5] uppercase">
              VAULT //{" "}
              {pick(
                "CERTIFICATES & CREDENTIALS · 資格",
                "SERTIFIKAT & KREDENSIAL · 資格"
              )}
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-semibold tracking-[0.05em] text-[#1e172b] sm:text-5xl">
              {pick("Verified Credentials", "Sertifikasi & Pencapaian")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#5c5178]">
              {pick(
                "A living gallery of banking technology certifications, software engineering credentials, and AI training milestones. Click any card to inspect full details.",
                "Galeri hidup sertifikasi teknologi perbankan, software engineering, dan pelatihan AI. Klik kartu mana pun untuk melihat detail dan verifikasi."
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="pastel-glass rounded-2xl px-4 py-3 text-center">
              <p className="font-mono text-xl font-semibold text-[#7650f3]">
                {certificates.length}
              </p>
              <p className="font-mono text-[10px] tracking-wider text-[#6a5d8a] uppercase">
                {pick("Total", "Total")}
              </p>
            </div>
            <div className="pastel-glass rounded-2xl px-4 py-3 text-center">
              <p className="font-mono text-xl font-semibold text-[#ee84b5]">
                {issuerCount}
              </p>
              <p className="font-mono text-[10px] tracking-wider text-[#6a5d8a] uppercase">
                {pick("Issuers", "Penerbit")}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs + Search */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition ${
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
              placeholder={pick(
                "Search title or issuer...",
                "Cari judul atau penerbit..."
              )}
              className="w-full rounded-full border border-[#dfd4f8] bg-white/85 py-2 pr-4 pl-10 text-xs text-[#1e172b] outline-none transition placeholder:text-[#9689b8] focus:border-[#7650f3] focus:bg-white"
            />
          </div>
        </div>

        <div className="raindrop-dotted my-8 w-full" />

        {/* Certificates Grid */}
        {filtered.length === 0 ? (
          <div className="pastel-glass rounded-3xl p-12 text-center">
            <Award className="mx-auto h-10 w-10 text-[#7650f3]/60" />
            <p className="mt-3 font-editorial text-2xl text-[#1e172b]">
              {pick(
                "No certificates match this filter.",
                "Belum ada sertifikat yang cocok."
              )}
            </p>
            <p className="mt-1.5 text-sm text-[#62577a]">
              {pick(
                "Try switching categories or add new credentials from /admin.",
                "Coba pilih kategori lain atau tambahkan sertifikat baru dari /admin."
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert, idx) => (
              <motion.button
                key={cert.id}
                type="button"
                onClick={() => setSelectedCert(cert)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
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
                  <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 border-b border-[#e8dffb] bg-gradient-to-br from-[#f4eeff] via-[#faf5ff] to-[#fdebf5]">
                    <Award className="h-10 w-10 text-[#7650f3]/70 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-mono text-[10px] tracking-[0.18em] text-[#8d7eb3] uppercase">
                      {cert.category}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#f4effd] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#7650f3] uppercase">
                      {cert.category}
                    </span>
                    <span className="font-mono text-xs text-[#7a6d9c]">
                      {cert.issuedDate}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-semibold text-[#1e172b] transition-colors group-hover:text-[#7650f3]">
                    {pick(cert.titleEn, cert.titleId)}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-[#645882]">
                    {cert.issuer}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[11px] text-[#7650f3]">
                    <span>{pick("Inspect details", "Lihat detail")}</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.button>
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
