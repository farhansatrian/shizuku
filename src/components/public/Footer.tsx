"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

export function Footer({ profile }: { profile: SerializedProfile }) {
  const { pick } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#dfd4f8] bg-white/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfd4f8] bg-[#f4effd] text-[#7650f3]">
                <UmbrellaMark className="h-5 w-5" />
              </span>
              <span className="font-editorial text-xl font-semibold tracking-[0.16em] text-[#1e172b] lowercase">
                {profile.brandName}.
              </span>
              <span className="text-xs text-[#7650f3]">{profile.brandKanji}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#62577a]">
              {pick(
                "A calm, rainy-day digital hub for software engineering, banking systems, and applied AI.",
                "Ruang digital bernuansa hujan untuk rekayasa perangkat lunak, sistem perbankan, dan AI terapan."
              )}
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#7650f3] uppercase">
              {pick("Pages", "Halaman")}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#4f4469]">
              <li>
                <Link href="/" className="transition hover:text-[#7650f3]">
                  {pick("Home", "Beranda")}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition hover:text-[#7650f3]"
                >
                  {pick("Projects & Specs", "Proyek & Spesifikasi")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-[#7650f3]">
                  {pick("About & Journey", "Tentang & Karier")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about#certificates"
                  className="transition hover:text-[#7650f3]"
                >
                  {pick("Certificates Vault", "Galeri Sertifikat")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#7650f3] uppercase">
              {pick("Connect", "Terhubung")}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#4f4469]">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                >
                  {profile.email} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
              {profile.linkedinUrl && (
                <li>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                  >
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              )}
              {profile.githubUrl && (
                <li>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                  >
                    GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              )}
              {profile.instagramUrl && (
                <li>
                  <a
                    href={profile.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                  >
                    Instagram <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8dffa] pt-6 text-xs text-[#70648d]">
          <p className="font-mono">
            © {year} {profile.fullName} · {profile.brandName} (
            {profile.brandKanji})
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white/80 px-3 py-1 font-mono text-[11px] text-[#62577a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
          >
            <Lock className="h-3 w-3" />
            Admin CMS
          </Link>
        </div>
      </div>
    </footer>
  );
}
