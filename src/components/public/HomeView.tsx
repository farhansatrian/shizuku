"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { CinematicHeader } from "@/components/public/CinematicHeader";
import { RainPreloader } from "@/components/public/RainPreloader";
import { TuyuRainLayer } from "@/components/public/TuyuRainLayer";
import { HeroSection } from "@/components/public/HeroSection";
import { TuyuWorksCarousel } from "@/components/public/TuyuWorksCarousel";
import { Footer } from "@/components/public/Footer";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PortfolioPayload } from "@/lib/types";

export function HomeView({ data }: { data: PortfolioPayload }) {
  const { profile, projects } = data;
  const { pick } = useLocale();

  const carouselWorks = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    return [...featured, ...rest];
  }, [projects]);

  return (
    <div className="relative min-h-screen text-[#14100e]">
      {/* Fixed ambient pink watercolor layer (exact tuyu.moe #section01_video-area z-index: -2) */}
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

        {/* 2. Minimalist Gallery Showcase (HOME / WORK / PROJECT / ABOUT + Monochrome Diptych) */}
        <section
          id="gallery"
          className="scroll-mt-16 bg-[#e5dcfb] pt-16 pb-20 md:pt-24 md:pb-28"
        >
          <div className="mx-auto w-[90%] max-w-[920px]">
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

        {/* 3. EXPOSED PARALLAX PINK WATERCOLOR BAND + FULL-BLEED WORKS CAROUSEL */}
        <section
          id="works"
          className="relative mt-[210px] bg-[#e5dcfb] pt-10 pb-16 md:mt-[340px] md:pt-12 md:pb-20"
        >
          {/* Heading pulled upward inside the exposed fixed pink watercolor canvas */}
          <div className="mx-auto w-[90%] max-w-[1000px]">
            <h2 className="-mt-[185px] mb-7 font-editorial text-[26px] font-normal leading-none tracking-[7px] text-[#745bc7] uppercase md:-mt-[318px] md:mb-12 md:text-[33px] md:tracking-[9px]">
              WORKS
            </h2>
          </div>

          {/* Full-bleed 100vw centered carousel straddling the pink watercolor / lavender boundary */}
          <TuyuWorksCarousel projects={carouselWorks} />

          <div className="mx-auto mt-10 flex w-[90%] max-w-[1000px] justify-center md:mt-14">
            <Link href="/projects" className="tuyu-more-btn">
              MORE
            </Link>
          </div>
        </section>
      </main>

      {/* 4. Vivid Magenta-Purple Watercolor Band Footer */}
      <Footer profile={profile} />
    </div>
  );
}
