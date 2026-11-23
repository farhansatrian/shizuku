"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

export function Footer({ profile }: { profile: SerializedProfile }) {
  const { pick } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="tuyu-footer-band relative z-10 px-6 py-9 text-center text-white md:py-16">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-5">
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-editorial text-[12px] tracking-[0.22em] text-white/95 uppercase md:gap-x-8 md:text-[13px]"
        >
          <Link href="/" className="transition-opacity hover:opacity-70">
            TOP
          </Link>
          <Link
            href="/workspace"
            className="transition-opacity hover:opacity-70"
          >
            WORKSPACE
          </Link>
          <Link
            href="/projects"
            className="transition-opacity hover:opacity-70"
          >
            {pick("PROJECTS", "PROYEK")}
          </Link>
          <Link href="/about" className="transition-opacity hover:opacity-70">
            {pick("ABOUT", "TENTANG")}
          </Link>
          <Link
            href="/certificates"
            className="transition-opacity hover:opacity-70"
          >
            {pick("CERTIFICATES", "SERTIFIKAT")}
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          >
            <Lock className="h-3 w-3" />
            ADMIN
          </Link>
        </nav>

        <p className="font-mono text-[10px] tracking-[3px] text-white/90 md:text-[11px] md:tracking-[4px]">
          ©{year} {profile.brandName.toUpperCase()} ({profile.brandKanji}) ·{" "}
          {profile.fullName}
        </p>
      </div>
    </footer>
  );
}
