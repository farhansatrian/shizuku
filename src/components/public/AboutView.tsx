"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { Footer } from "@/components/public/Footer";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function AboutView({ data }: { data: PortfolioPayload }) {
  const { profile } = data;
  const { pick } = useLocale();
  const [umbrellaFailed, setUmbrellaFailed] = useState(false);

  const paragraphs = pick(profile.aboutStoryEn, profile.aboutStoryId)
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] ?? "";
  const bodyParagraphs = paragraphs.slice(1);

  return (
    <div className="relative flex min-h-screen flex-col text-[#14100e]">
      {/* Exact /assets/bg-watercolor-pc.jpg pink watercolor backdrop */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />
      <TuyuRainLayer behindContent />
      <CinematicHeader profile={profile} />

      <main className="relative z-10 mx-auto flex w-[90%] max-w-[760px] flex-1 flex-col pt-28 pb-20 md:pt-34 md:pb-24">
        {/* Minimal Centered Navigation (HOME · WORK · PORTFOLIO · ABOUT) */}
        <nav
          aria-label="Section navigation"
          className="flex items-center justify-center gap-7 sm:gap-11 md:gap-14"
        >
          <Link
            href="/"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            {pick("HOME", "BERANDA")}
          </Link>
          <Link
            href="/workspace"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            WORK
          </Link>
          <Link
            href="/portfolio"
            className="font-condensed pb-1 text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
          >
            PORTFOLIO
          </Link>
          <span className="font-condensed border-b-[1.5px] border-[#14100e] pb-1 text-[17px] font-medium tracking-[0.14em] text-[#14100e] uppercase sm:text-[19px]">
            {pick("ABOUT", "TENTANG")}
          </span>
        </nav>

        {/* Centered Minimal Showcase (Exact SHIKAS Home & OMOCAT About rhythm) */}
        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center md:py-14">
          <div className="h-[220px] w-[220px] overflow-hidden border border-[#14100e]/16 bg-white/85 shadow-[0_18px_44px_-30px_rgba(20,16,14,0.45)] sm:h-[260px] sm:w-[260px]">
            {profile.avatarImage?.trim() ? (
              <img
                src={profile.avatarImage}
                alt={profile.brandName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#faf6ff] to-[#fdebf6] p-6">
                {umbrellaFailed ? (
                  <UmbrellaMark className="h-14 w-14 text-[#745bc7]" />
                ) : (
                  <img
                    src="/api/uploads/tuyu-umbrella.png"
                    alt={`${profile.brandName} umbrella`}
                    onError={() => setUmbrellaFailed(true)}
                    className="h-24 w-auto object-contain select-none"
                  />
                )}
                <p className="mt-4 font-editorial text-xl tracking-[0.28em] text-[#745bc7] uppercase">
                  {profile.brandName} ({profile.brandKanji})
                </p>
              </div>
            )}
          </div>

          <div className="font-condensed mt-8 max-w-[520px] space-y-5 px-2 text-[18px] leading-[1.72] tracking-[0.025em] text-[#14100e] sm:mt-9 sm:text-[20px]">
            {leadParagraph && <p className="font-medium">{leadParagraph}</p>}
            {bodyParagraphs.map((para, i) => (
              <p key={i} className="font-normal text-[#14100e]/88">
                {para}
              </p>
            ))}
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
