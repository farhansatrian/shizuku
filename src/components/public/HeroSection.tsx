"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

export function HeroSection({ profile }: { profile: SerializedProfile }) {
  const { pick } = useLocale();
  const hasDesktopArt = Boolean(profile.heroImage?.trim());
  const hasMobileArt = Boolean(profile.heroImageMobile?.trim());
  const hasAnyArt = hasDesktopArt || hasMobileArt;

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-[#1a1333]"
    >
      {/* Pure Full-Bleed Key Visual (Exact tuyu.moe #top .main_visual) */}
      {hasAnyArt ? (
        <div className="absolute inset-0 z-0">
          {hasMobileArt ? (
            <>
              <img
                src={profile.heroImageMobile}
                alt={`${profile.brandName} mobile hero`}
                className="h-full w-full object-cover object-center md:hidden"
              />
              <img
                src={profile.heroImage || profile.heroImageMobile}
                alt={`${profile.brandName} desktop hero`}
                className="hidden h-full w-full object-cover object-center md:block"
              />
            </>
          ) : (
            <img
              src={profile.heroImage}
              alt={`${profile.brandName} hero`}
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center text-white"
          style={{
            background:
              "linear-gradient(180deg, #171229 0%, #2a1e52 55%, #745bc7 100%)",
          }}
        >
          <UmbrellaMark className="h-14 w-14 text-white/90" />
          <p className="mt-4 font-editorial text-5xl tracking-[0.28em] uppercase">
            {profile.brandName}
          </p>
        </div>
      )}

      {/* Sleek Twilight Anime Special-Banner Card (matching tuyu.moe #top > a bottom-left slot) */}
      <Link
        href="/workspace"
        className="group absolute bottom-[25px] left-[5%] z-10 block w-[216px] overflow-hidden rounded-lg border border-white/25 bg-[#17102e]/74 px-4 py-3.5 text-white shadow-[0_12px_36px_rgba(14,8,34,0.48)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f7a6dc]/75 hover:bg-[#1e153d]/82 md:left-[3%] md:w-[246px] md:px-[18px] md:py-4"
      >
        {/* Subtle violet-to-sakura luminous diagonal wash */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#745bc7]/35 via-transparent to-[#f48fd0]/25 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* Delicate ghosted Kanji watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1.5 -bottom-3 select-none font-editorial text-6xl leading-none text-white/[0.08]"
        >
          {profile.brandKanji}
        </span>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[9px] tracking-[0.26em] text-[#f8b8e3] uppercase">
              {profile.brandName} · {profile.brandKanji}
            </span>
            <UmbrellaMark className="h-3.5 w-3.5 text-[#f8b8e3]/90" />
          </div>

          <p className="mt-1.5 font-editorial text-[19px] font-medium leading-none tracking-[0.22em] text-white uppercase md:text-[21px]">
            WORKSPACE
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/15 pt-2">
            <span className="truncate font-mono text-[10px] tracking-[0.08em] text-[#e5dcfb]/90">
              {pick("Daily Hub & Agents", "Pusat Harian & Agent")}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#f8b8e3] transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </section>
  );
}
