"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import {
  ThreeRaindropsMenu,
  UmbrellaMark,
} from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

interface CinematicHeaderProps {
  profile: SerializedProfile;
  transparentOnTop?: boolean;
}

export function CinematicHeader({
  profile,
  transparentOnTop = false,
}: CinematicHeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale, pick } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const drawerOpen = openPath === pathname;

  const setDrawerOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    setOpenPath((curr) => {
      const currOpen = curr === pathname;
      const target = typeof next === "function" ? next(currOpen) : next;
      return target ? pathname : null;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const isLightText = transparentOnTop && !scrolled && !drawerOpen;

  const navItems = [
    { href: "/", code: "01", en: "TOP", id: "BERANDA" },
    { href: "/workspace", code: "02", en: "WORKSPACE", id: "WORKSPACE" },
    { href: "/projects", code: "03", en: "PROJECTS", id: "PROYEK" },
    { href: "/about", code: "04", en: "ABOUT", id: "TENTANG" },
    { href: "/certificates", code: "05", en: "CERTIFICATES", id: "SERTIFIKAT" },
  ];

  const isItemActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          drawerOpen
            ? "bg-transparent text-[#14100e]"
            : isLightText
              ? "bg-transparent text-white"
              : "border-b border-[#d4c6f4]/80 bg-[#e5dcfb]/88 text-[#14100e] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-8">
          {/* Ultra-minimal TUYU-style Brand Monogram */}
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="group flex items-center gap-2 py-2 focus:outline-none"
          >
            <UmbrellaMark
              className={`h-5 w-5 transition-transform duration-300 group-hover:-rotate-6 ${
                isLightText ? "text-white" : "text-[#7650f3]"
              }`}
            />
            <span className="font-editorial text-xl font-medium tracking-[0.2em] lowercase">
              {profile.brandName}.
            </span>
            <span
              className={`text-xs ${
                isLightText ? "text-white/75" : "text-[#7650f3]"
              }`}
            >
              {profile.brandKanji}
            </span>
          </Link>

          {/* Right Controls: Clean Links (Desktop) + Flat EN | ID + 3-Raindrop Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 md:flex"
            >
              {navItems.slice(1).map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-1 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors ${
                      isLightText
                        ? active
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                        : active
                          ? "text-[#7650f3]"
                          : "text-[#14100e]/75 hover:text-[#7650f3]"
                    }`}
                  >
                    {pick(item.en, item.id)}
                    {active && (
                      <span
                        className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                          isLightText ? "bg-[#fad8e8]" : "bg-[#7650f3]"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Minimalist TUYU-style EN | ID Toggle */}
            <div
              className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] ${
                isLightText ? "text-white/85" : "text-[#14100e]/70"
              }`}
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-1 py-1.5 transition ${
                  locale === "en"
                    ? isLightText
                      ? "font-semibold text-white underline underline-offset-4"
                      : "font-semibold text-[#7650f3] underline underline-offset-4"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                EN
              </button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                onClick={() => setLocale("id")}
                className={`px-1 py-1.5 transition ${
                  locale === "id"
                    ? isLightText
                      ? "font-semibold text-white underline underline-offset-4"
                      : "font-semibold text-[#7650f3] underline underline-offset-4"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                ID
              </button>
            </div>

            {/* Iconic TUYU 3-Raindrop Menu Trigger (44px touch-friendly target) */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                drawerOpen
                  ? "text-[#14100e] hover:bg-white/40"
                  : isLightText
                    ? "text-white hover:bg-white/10"
                    : "text-[#7650f3] hover:bg-white/60"
              }`}
            >
              <ThreeRaindropsMenu open={drawerOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Authentic TUYU Full-Screen Pink-Lavender Watercolor Overlay Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 flex overflow-y-auto"
            style={{
              background:
                "linear-gradient(145deg, #fbd9ea 0%, #ede3fc 48%, #e5dcfb 100%)",
            }}
          >
            {/* Giant vertical rotated white typography on the left (TUYU signature!) */}
            <div
              className="pointer-events-none hidden select-none items-center justify-center pl-10 md:flex lg:pl-16"
              aria-hidden="true"
            >
              <span
                className="font-editorial text-[8rem] font-normal leading-none tracking-[0.26em] text-white/75 uppercase lg:text-[10rem]"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {profile.brandName}
              </span>
            </div>

            {/* Clean Navigation Column */}
            <div className="mx-auto flex w-full max-w-3xl flex-col justify-between px-6 pt-24 pb-10 sm:px-12">
              <nav
                aria-label="Full menu"
                className="my-auto flex flex-col gap-3 sm:gap-4"
              >
                {navItems.map((item, idx) => {
                  const active = isItemActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * idx, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`group flex items-baseline gap-5 py-1.5 transition-colors ${
                          active
                            ? "text-[#7650f3]"
                            : "text-[#14100e] hover:text-[#7650f3]"
                        }`}
                      >
                        <span className="font-mono text-xs text-[#7650f3]/75">
                          {item.code}
                        </span>
                        <span className="font-editorial text-3xl font-normal tracking-[0.22em] uppercase sm:text-4xl">
                          {pick(item.en, item.id)}
                        </span>
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#7650f3]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="raindrop-dotted my-4 max-w-xs" />

                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex w-fit items-center gap-2 py-1 font-mono text-xs tracking-[0.18em] text-[#5c526e] uppercase transition hover:text-[#7650f3]"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Admin Studio
                </Link>
              </nav>

              {/* Calm Minimal Bottom Strip */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#14100e]/10 pt-5 text-xs text-[#5c526e]">
                <div className="flex flex-wrap items-center gap-5 font-mono">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                  >
                    Email <ArrowUpRight className="h-3 w-3" />
                  </a>
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                    >
                      LinkedIn <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 transition hover:text-[#7650f3]"
                    >
                      GitHub <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <span className="font-mono text-[11px]">
                  {profile.fullName} · {profile.location}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
