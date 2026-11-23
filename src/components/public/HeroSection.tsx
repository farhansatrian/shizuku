"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

const RAIN_STREAKS = [
  { left: "10%", dur: "5.2s", delay: "0.2s", height: "48px" },
  { left: "24%", dur: "4.6s", delay: "1.6s", height: "58px" },
  { left: "41%", dur: "5.8s", delay: "0.7s", height: "42px" },
  { left: "60%", dur: "4.9s", delay: "2.2s", height: "54px" },
  { left: "78%", dur: "5.4s", delay: "1.1s", height: "46px" },
  { left: "90%", dur: "4.4s", delay: "2.7s", height: "52px" },
];

export function HeroSection({ profile }: { profile: SerializedProfile }) {
  const { pick } = useLocale();
  const hasDesktopArt = Boolean(profile.heroImage?.trim());
  const hasMobileArt = Boolean(profile.heroImageMobile?.trim());
  const hasAnyArt = hasDesktopArt || hasMobileArt;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#19142b] text-white"
    >
      {/* Full-Bleed Artwork Layer (Pure TUYU: zero text clutter over the illustration!) */}
      {hasAnyArt ? (
        <div className="absolute inset-0 z-0">
          {hasMobileArt ? (
            <>
              <img
                src={profile.heroImageMobile}
                alt={`${profile.brandName} mobile key visual`}
                className="h-full w-full object-cover object-center md:hidden"
              />
              <img
                src={profile.heroImage || profile.heroImageMobile}
                alt={`${profile.brandName} key visual`}
                className="hidden h-full w-full object-cover object-center md:block"
              />
            </>
          ) : (
            <img
              src={profile.heroImage}
              alt={`${profile.brandName} key visual`}
              className="h-full w-full object-cover object-center"
            />
          )}
          {/* Ultra-light top gradient strictly so the minimal transparent header stays readable */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{
              background:
                "linear-gradient(180deg, rgba(20, 16, 36, 0.42) 0%, transparent 100%)",
            }}
          />
        </div>
      ) : (
        /* Serene Minimalist Rainy Twilight Canvas (Zero AI face — clean until official TUYU HD art is uploaded in /admin) */
        <div
          className="absolute inset-0 z-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, #171229 0%, #271e47 46%, #4a3a7a 76%, #c8b6f2 93%, #e5dcfb 100%)",
          }}
        >
          {/* Subtle Watercolor Blush Glow */}
          <div
            className="pointer-events-none absolute right-[12%] bottom-[22%] h-72 w-72 rounded-full bg-[#fad8e8]/20 blur-3xl sm:h-96 sm:w-96"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-[20%] left-[14%] h-64 w-64 rounded-full bg-[#7650f3]/20 blur-3xl"
            aria-hidden="true"
          />

          {/* Quiet Editorial Centerpiece */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center px-6 pb-16 text-center"
          >
            <UmbrellaMark className="h-14 w-14 text-[#efe8ff]/90 sm:h-16 sm:w-16" />
            <h1 className="mt-5 font-editorial text-5xl font-normal tracking-[0.28em] text-white lowercase sm:text-6xl md:text-7xl">
              {profile.brandName}.
            </h1>
            <p className="mt-3 font-mono text-[11px] tracking-[0.28em] text-[#e5dcfb]/80 uppercase">
              {profile.brandKanji} ·{" "}
              {pick("Personal Hub & Workspace", "Ruang Digital & Workspace")}
            </p>
          </motion.div>
        </div>
      )}

      {/* Subtle Drifting Raindrops */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        {RAIN_STREAKS.map((drop, i) => (
          <span
            key={i}
            className="rain-streak absolute top-0 w-px bg-gradient-to-b from-transparent via-[#e5dcfb]/60 to-[#fad8e8]/80"
            style={
              {
                left: drop.left,
                height: drop.height,
                "--rain-dur": drop.dur,
                "--rain-delay": drop.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Bottom Corner Row — Directly inspired by tuyu.moe's clean bottom-left floating banner */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-4 pb-12 sm:px-8 sm:pb-16">
        <motion.a
          href="#workspace"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="group flex w-full max-w-[330px] items-center justify-between gap-4 rounded-xl bg-white/92 px-4 py-3.5 text-[#14100e] backdrop-blur-sm transition hover:bg-white sm:max-w-sm sm:px-5 sm:py-4"
        >
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#7650f3] uppercase">
              {profile.brandName} · {profile.brandKanji} {"// "}
              {pick("HUB", "HUB")}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-[#14100e]">
              {profile.fullName}
            </p>
            <p className="truncate text-[11px] text-[#5c526e]">
              {pick(profile.currentRoleEn, profile.currentRoleId)}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#7650f3] transition-transform group-hover:translate-x-1" />
        </motion.a>

        {/* Quiet Scroll Indicator on Desktop */}
        <a
          href="#workspace"
          aria-label="Scroll to workspace"
          className="hidden flex-col items-center gap-2 font-mono text-[10px] tracking-[0.26em] text-white/80 uppercase transition hover:text-white md:flex"
        >
          <span>SCROLL</span>
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </div>

      {/* Subtle Soft Lavender Mist Edge into #e5dcfb */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-10 sm:h-14"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(229, 220, 251, 0.72) 65%, #e5dcfb 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
