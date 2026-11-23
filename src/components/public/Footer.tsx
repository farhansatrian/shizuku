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
    <footer className="border-t border-[#d4c6f4] bg-[#f4effd]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <UmbrellaMark className="h-4 w-4 text-[#7650f3]" />
            <span className="font-editorial text-lg font-medium tracking-[0.2em] text-[#14100e] lowercase">
              {profile.brandName}.
            </span>
            <span className="text-xs text-[#7650f3]">{profile.brandKanji}</span>
          </Link>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] text-[#5c526e] uppercase"
          >
            <Link href="/workspace" className="transition hover:text-[#7650f3]">
              Workspace
            </Link>
            <Link href="/projects" className="transition hover:text-[#7650f3]">
              {pick("Projects", "Proyek")}
            </Link>
            <Link href="/about" className="transition hover:text-[#7650f3]">
              {pick("About", "Tentang")}
            </Link>
            <Link
              href="/certificates"
              className="transition hover:text-[#7650f3]"
            >
              {pick("Certificates", "Sertifikat")}
            </Link>
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition hover:text-[#7650f3]"
              >
                LinkedIn <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition hover:text-[#7650f3]"
              >
                GitHub <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#e0d4f8] pt-5 font-mono text-[11px] text-[#6d6188]">
          <span>
            © {year} {profile.fullName} · {profile.brandName} (
            {profile.brandKanji})
          </span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 transition hover:text-[#7650f3]"
          >
            <Lock className="h-3 w-3" />
            Admin Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
