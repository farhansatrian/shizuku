"use client";

import React from "react";
import Link from "next/link";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { RainPreloader } from "@/components/public/RainPreloader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { HeroSection } from "@/components/public/HeroSection";
import { Footer } from "@/components/public/Footer";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function HomeView({ data }: { data: PortfolioPayload }) {
  const { profile } = data;
  const { pick } = useLocale();

  return (
    <div className="relative min-h-screen text-[#14100e]">
      {/* Fixed ambient pink watercolor layer (exact tuyu.moe parallax backdrop z-index: -2) */}
      <div className="tuyu-fixed-watercolor" aria-hidden="true" />

      {/* Authentic 20-drop pure CSS vertical #2276a8 rain falling across splash & page */}
      <TuyuRainLayer overSplash />

      {/* Authentic tuyu.moe splash screen (panning pink watercolor + stationary watercolor umbrella) */}
      <RainPreloader
        brandName={profile.brandName}
        brandKanji={profile.brandKanji}
      />

      <CinematicHeader profile={profile} transparentOnTop />

      <main className="relative z-10">
        {/* 1. #top — Pure Full-Bleed 100svh Key Visual */}
        <HeroSection profile={profile} />

        {/* 2. Minimalist Gallery Showcase on Parallax Pink Watercolor + #e5dcfb Lavender Split */}
        <section
          id="gallery"
          className="relative scroll-mt-16 pt-20 pb-24 md:pt-28 md:pb-32"
        >
          {/* Lower #e5dcfb lavender half — leaves upper half open to reveal fixed parallax pink watercolor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[54%] bottom-0 bg-[#e5dcfb] md:top-[52%]"
          />

          <div className="relative z-10 mx-auto w-[90%] max-w-[920px]">
            <nav
              aria-label="Gallery navigation"
              className="flex items-center justify-center gap-7 sm:gap-11 md:gap-14"
            >
              <a
                href="#top"
                className="font-condensed text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
              >
                {pick("HOME", "BERANDA")}
              </a>
              <Link
                href="/workspace"
                className="font-condensed text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
              >
                {pick("WORK", "WORK")}
              </Link>
              <Link
                href="/projects"
                className="font-condensed text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
              >
                {pick("PROJECT", "PROYEK")}
              </Link>
              <Link
                href="/about"
                className="font-condensed text-[17px] font-normal tracking-[0.14em] text-[#14100e] uppercase transition hover:text-[#745bc7] sm:text-[19px]"
              >
                {pick("ABOUT", "TENTANG")}
              </Link>
            </nav>

            <div className="mx-auto mt-10 w-full max-w-[840px] md:mt-14">
              <img
                src="/assets/IMG_20210913_0002.webp"
                alt={`${profile.brandName} monochrome artwork`}
                className="block h-auto w-full select-none shadow-[0_18px_48px_rgba(32,20,64,0.08)]"
              />
            </div>
          </div>
        </section>
      </main>

      {/* 3. Vivid Magenta-Purple Watercolor Band Footer */}
      <Footer profile={profile} />
    </div>
  );
}
