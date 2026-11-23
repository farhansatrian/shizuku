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

      {/* Exact tuyu.moe Bottom-Left Floating Card (#top > a: left 3% desktop / 5% mobile, bottom 25px) */}
      <Link
        href="/workspace"
        className="group absolute bottom-[25px] left-[5%] z-10 block w-[232px] overflow-hidden rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-[#14100e] backdrop-blur-md transition-opacity duration-300 hover:opacity-80 md:left-[3%] md:w-[280px] md:px-4 md:py-3.5"
      >
        <p className="font-mono text-[9px] tracking-[0.2em] text-[#745bc7] uppercase">
          {profile.brandName} · {profile.brandKanji} {"// "}WORKSPACE
        </p>
        <p className="mt-1 truncate text-xs font-semibold text-[#14100e] md:text-sm">
          {profile.fullName}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-[#5d5370] md:text-[11px]">
          <span className="leading-snug">
            {profile.currentOrg} · {pick("Daily Hub", "Pusat Harian")}
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#745bc7] transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}
