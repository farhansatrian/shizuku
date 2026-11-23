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
  const [contactInView, setContactInView] = useState(false);
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
    const onScroll = () => {
      setScrolled(window.scrollY > 44);
      if (pathname === "/") {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          const rect = contactEl.getBoundingClientRect();
          setContactInView(
            rect.top <= window.innerHeight * 0.55 && rect.bottom >= 120
          );
        } else {
          setContactInView(false);
        }
      } else {
        setContactInView(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [pathname]);

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
    { href: "/projects", code: "02", en: "PROJECTS", id: "PROYEK" },
    { href: "/about", code: "03", en: "ABOUT", id: "TENTANG" },
    { href: "/certificates", code: "04", en: "CERTIFICATES", id: "SERTIFIKAT" },
    { href: "/#contact", code: "05", en: "CONTACT", id: "KONTAK" },
  ];

  const isItemActive = (href: string): boolean => {
    if (href === "/") return pathname === "/" && !contactInView;
    if (href === "/#contact") return pathname === "/" && contactInView;
    if (href === "/projects")
      return pathname === "/projects" || pathname.startsWith("/projects/");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setDrawerOpen(false);
    if (href === "/#contact" && pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/#contact");
        setContactInView(true);
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
      setContactInView(false);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          drawerOpen
            ? "bg-transparent text-[#1e172b]"
            : isLightText
              ? "bg-transparent text-white"
              : "border-b border-[#dfd4f8]/80 bg-white/78 text-[#1e172b] backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(118,80,243,0.18)]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-18 sm:px-8">
          {/* Brand Monogram */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${
                isLightText
                  ? "border-white/25 bg-white/10 text-white group-hover:bg-white/20"
                  : "border-[#dfd4f8] bg-[#f4effd] text-[#7650f3] group-hover:border-[#7650f3]/40"
              }`}
            >
              <UmbrellaMark className="h-5 w-5" />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-editorial text-xl font-semibold tracking-[0.16em] lowercase">
                {profile.brandName}.
              </span>
              <span
                className={`text-xs ${
                  isLightText ? "text-[#e5dcfb]/85" : "text-[#7650f3]"
                }`}
              >
                {profile.brandKanji}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation + Locale Switcher + 3-Raindrop Trigger */}
          <div className="flex items-center gap-3 sm:gap-5">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-6 md:flex"
            >
              {navItems.slice(1, 5).map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative text-xs font-medium tracking-[0.16em] uppercase transition-colors ${
                      isLightText
                        ? active
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                        : active
                          ? "text-[#7650f3]"
                          : "text-[#4a3f66] hover:text-[#7650f3]"
                    }`}
                  >
                    {pick(item.en, item.id)}
                    {active && (
                      <span
                        className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                          isLightText ? "bg-[#fad8e8]" : "bg-[#7650f3]"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* EN | ID Switcher (inspired by tuyu.moe's JP | EN) */}
            <div
              className={`flex items-center rounded-full border p-0.5 font-mono text-[11px] tracking-wider ${
                isLightText
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-[#dfd4f8] bg-[#f4effd]/80 text-[#4a3f66]"
              }`}
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  locale === "en"
                    ? isLightText
                      ? "bg-white text-[#231942] font-semibold"
                      : "bg-[#7650f3] text-white font-semibold shadow-xs"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("id")}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  locale === "id"
                    ? isLightText
                      ? "bg-white text-[#231942] font-semibold"
                      : "bg-[#7650f3] text-white font-semibold shadow-xs"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                ID
              </button>
            </div>

            {/* Iconic 3-Raindrop Drawer Trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                drawerOpen
                  ? "border-[#7650f3]/30 bg-white/90 text-[#231942]"
                  : isLightText
                    ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                    : "border-[#dfd4f8] bg-white/80 text-[#7650f3] hover:border-[#7650f3]/50"
              }`}
            >
              <ThreeRaindropsMenu open={drawerOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* TUYU-Inspired Full-Screen Pastel Watercolor Menu Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex overflow-y-auto"
            style={{
              background:
                "linear-gradient(135deg, #fbd9ea 0%, #e8defc 54%, #dbcefc 100%)",
            }}
          >
            {/* Giant vertical rotated brand typography (TUYU signature!) */}
            <div
              className="pointer-events-none hidden select-none items-center justify-center pl-8 md:flex lg:pl-14"
              aria-hidden="true"
            >
              <span
                className="font-editorial text-[7.5rem] font-semibold leading-none tracking-[0.22em] text-white/65 uppercase lg:text-[9.5rem]"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {profile.brandName}
              </span>
            </div>

            {/* Drawer Main Content */}
            <div className="mx-auto flex w-full max-w-4xl flex-col justify-between px-7 pt-24 pb-10 sm:px-12">
              <div className="my-auto grid gap-10 md:grid-cols-[1.3fr_0.9fr] md:items-center">
                <nav aria-label="Full menu" className="flex flex-col gap-4">
                  <p className="mb-1 font-mono text-xs tracking-[0.22em] text-[#7650f3] uppercase">
                    {pick("Navigation · 雫", "Navigasi · 雫")}
                  </p>
                  {navItems.map((item, idx) => {
                    const active = isItemActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className={`group flex items-baseline gap-4 py-1 transition-colors ${
                            active
                              ? "text-[#7650f3]"
                              : "text-[#1e172b] hover:text-[#7650f3]"
                          }`}
                        >
                          <span className="font-mono text-xs text-[#7650f3]/80">
                            {item.code}
                          </span>
                          <span className="font-editorial text-3xl font-medium tracking-[0.18em] uppercase sm:text-4xl">
                            {pick(item.en, item.id)}
                          </span>
                          {active && (
                            <span className="ml-1 h-2 w-2 rounded-full bg-[#7650f3]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Right Editorial Card inside Drawer */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="rounded-3xl border border-white/80 bg-white/70 p-6 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={profile.avatarImage}
                      alt={profile.fullName}
                      className="h-14 w-14 rounded-2xl border border-white object-cover shadow-xs"
                    />
                    <div>
                      <p className="font-semibold text-[#1e172b]">
                        {profile.fullName}
                      </p>
                      <p className="font-mono text-xs text-[#62577a]">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#4f4469]">
                    {pick(profile.currentlyEn, profile.currentlyId)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2d214e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                      >
                        LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2d214e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                      >
                        GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2d214e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                    >
                      Email <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#7650f3]/15 pt-5 text-xs text-[#5d4f7c]">
                <span className="font-mono">
                  {profile.brandName} ({profile.brandKanji}) ·{" "}
                  {pick("Rainy Cozy Digital Hub", "Ruang Digital Pribadi")}
                </span>
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1 font-mono text-[11px] text-[#5d4f7c] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                >
                  <Lock className="h-3 w-3" />
                  Admin Studio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
