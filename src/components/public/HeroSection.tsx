"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import {
  RaindropIcon,
  WatercolorMistTransition,
} from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

const RAIN_STREAKS = [
  { left: "7%", dur: "4.6s", delay: "0.2s", height: "54px" },
  { left: "16%", dur: "5.4s", delay: "1.4s", height: "42px" },
  { left: "24%", dur: "4.1s", delay: "2.1s", height: "62px" },
  { left: "34%", dur: "5.8s", delay: "0.8s", height: "48px" },
  { left: "46%", dur: "4.4s", delay: "2.8s", height: "56px" },
  { left: "58%", dur: "5.1s", delay: "1.1s", height: "44px" },
  { left: "72%", dur: "4.8s", delay: "0.5s", height: "58px" },
  { left: "84%", dur: "5.5s", delay: "1.9s", height: "46px" },
  { left: "93%", dur: "4.3s", delay: "2.5s", height: "52px" },
];

export function HeroSection({ profile }: { profile: SerializedProfile }) {
  const { locale, pick } = useLocale();
  const roles =
    locale === "id" && profile.roles.id.length > 0
      ? profile.roles.id
      : profile.roles.en.length > 0
        ? profile.roles.en
        : ["Software Engineer", "ODP IT · Banking Systems", "AI Enthusiast"];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const id = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  const activeRole = roles[roleIndex % roles.length] ?? roles[0];

  return (
    <section
      id="top"
      className="relative flex min-h-[94vh] w-full items-center overflow-hidden bg-[#171226] text-white md:min-h-screen"
    >
      {/* Full-Bleed Omutatsu-Inspired Rainy Anime Key Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src={profile.heroImage || "/assets/hero-rainy-anime.jpg"}
          alt={`${profile.brandName} rainy anime key visual`}
          className="h-full w-full object-cover object-[78%_20%] sm:object-center"
        />
        {/* Gentle cinematic scrim on the left so white editorial text pops while character art on the right stays vivid */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(20, 15, 38, 0.9) 0%, rgba(24, 18, 44, 0.68) 46%, rgba(28, 21, 52, 0.2) 76%, rgba(28, 21, 52, 0.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 15, 38, 0.45) 0%, transparent 26%, transparent 72%, rgba(23, 18, 38, 0.52) 100%)",
          }}
        />
      </div>

      {/* Subtle Ambient Rain Streaks */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        {RAIN_STREAKS.map((drop, i) => (
          <span
            key={i}
            className="rain-streak absolute top-0 w-px bg-gradient-to-b from-transparent via-[#e5dcfb]/75 to-[#fad8e8]/90"
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

      {/* Main Editorial Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-32 sm:px-8 md:pt-32 md:pb-36">
        <div className="max-w-xl">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fad8e8] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ee84b5]" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.18em] text-[#efe8ff] uppercase">
              {profile.brandKanji} {"// "}
              {pick(profile.availabilityEn, profile.availabilityId)}
            </span>
          </motion.div>

          {/* Editorial Display Name */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 font-editorial text-4xl font-semibold leading-[1.08] tracking-[0.04em] text-white sm:text-5xl md:text-6xl"
          >
            {profile.fullName}
          </motion.h1>

          {/* Cycling Role Line */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-4 flex items-center gap-2.5 font-mono text-sm text-[#e5dcfb] sm:text-base"
          >
            <RaindropIcon className="h-4 w-4 shrink-0 text-[#ee84b5]" />
            <motion.span
              key={activeRole}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="tracking-wide"
            >
              {activeRole}
            </motion.span>
            <span className="inline-block h-4 w-[2px] animate-pulse bg-[#fad8e8]" />
          </motion.div>

          {/* Poetic 1-sentence Headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-[#e6e0f5]/90 sm:text-lg"
          >
            {pick(profile.headlineEn, profile.headlineId)}
          </motion.p>

          {/* Dual Pastel CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-[#7650f3] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(118,80,243,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8764f8]"
            >
              {pick("Explore Projects", "Lihat Proyek")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#overview"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fad8e8]/60 hover:bg-white/20"
            >
              {pick("Open Profile Card", "Buka Kartu Profil")}
            </a>
          </motion.div>
        </div>

        {/* TUYU-Inspired Bottom-Left Floating Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-md sm:mt-16"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7650f3] to-[#ee84b5] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#fad8e8] uppercase">
              {pick("CURRENT STATION", "PERAN SAAT INI")}
            </p>
            <p className="truncate text-xs font-medium text-white sm:text-sm">
              {pick(profile.currentRoleEn, profile.currentRoleId)} ·{" "}
              <span className="text-[#e5dcfb]">{profile.currentOrg}</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Raindrop Cue */}
      <a
        href="#overview"
        aria-label="Scroll to overview"
        className="absolute bottom-14 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-white/75 uppercase transition hover:text-white md:flex"
      >
        <span>SCROLL</span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>

      {/* Soft Pastel Lavender/Blush Watercolor Mist Transition */}
      <WatercolorMistTransition />
    </section>
  );
}
