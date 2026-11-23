"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ExternalLink, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedCertificate } from "@/lib/types";

export function CertificateModal({
  certificate,
  onClose,
}: {
  certificate: SerializedCertificate | null;
  onClose: () => void;
}) {
  const { pick } = useLocale();

  useEffect(() => {
    if (!certificate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [certificate, onClose]);

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#19132b]/70 p-4 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={pick(certificate.titleEn, certificate.titleId)}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#dfd4f8] bg-[#faf7ff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e8dffb] bg-white/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3ecff] text-[#7650f3]">
                  <Award className="h-4 w-4" />
                </span>
                <span className="font-mono text-xs tracking-wider text-[#7650f3] uppercase">
                  {certificate.category}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close certificate preview"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dfd4f8] bg-white text-[#4f4469] transition hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              {certificate.imageUrl ? (
                <div className="mb-5 overflow-hidden rounded-2xl border border-[#e3d8fa] bg-white">
                  <img
                    src={certificate.imageUrl}
                    alt={pick(certificate.titleEn, certificate.titleId)}
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4c4f7] bg-gradient-to-br from-[#f4eeff] to-[#fdeef6] py-12 text-center">
                  <Award className="h-10 w-10 text-[#7650f3]/70" />
                  <p className="mt-2 font-mono text-xs text-[#6d5f8d]">
                    {pick(
                      "Upload certificate visual anytime in /admin",
                      "Upload gambar sertifikat kapan saja melalui /admin"
                    )}
                  </p>
                </div>
              )}

              <h3 className="text-xl font-semibold text-[#1e172b]">
                {pick(certificate.titleEn, certificate.titleId)}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#7650f3]">
                {certificate.issuer}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-[#62577a]">
                <span className="rounded-full border border-[#dfd4f8] bg-white px-3 py-1">
                  {pick("Issued:", "Diterbitkan:")} {certificate.issuedDate}
                </span>
                {certificate.credentialId && (
                  <span className="rounded-full border border-[#dfd4f8] bg-white px-3 py-1">
                    ID: {certificate.credentialId}
                  </span>
                )}
              </div>

              {certificate.credentialUrl && (
                <div className="mt-6">
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#5e38dc]"
                  >
                    {pick("Verify Credential", "Verifikasi Kredensial")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
