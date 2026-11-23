"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Lock, Mail } from "lucide-react";
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
  const [overHero, setOverHero] = useState(transparentOnTop);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [menuIconFailed, setMenuIconFailed] = useState(false);
  const [closeIconFailed, setCloseIconFailed] = useState(false);
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
      if (!transparentOnTop) {
        setOverHero(false);
        return;
      }
      // Match tuyu.moe .header_on: white over the 100vh hero, iris purple #745bc7 once past hero
      setOverHero(window.scrollY < Math.max(window.innerHeight - 90, 260));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [transparentOnTop]);

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

  const isHeroWhite = overHero && !drawerOpen;

  const navItems = [
    { href: "/", en: "TOP", id: "BERANDA" },
    { href: "/workspace", en: "WORKSPACE", id: "WORKSPACE" },
    { href: "/projects", en: "PROJECTS", id: "PROYEK" },
    { href: "/about", en: "ABOUT", id: "TENTANG" },
    { href: "/certificates", en: "CERTIFICATES", id: "SERTIFIKAT" },
    { href: "/admin", en: "ADMIN STUDIO", id: "ADMIN STUDIO" },
  ];

  const isItemActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          drawerOpen
            ? "bg-transparent text-[#745bc7]"
            : isHeroWhite
              ? "bg-gradient-to-b from-[#17112a]/60 via-[#17112a]/24 to-transparent text-white [text-shadow:0_1px_6px_rgba(20,16,14,0.45)]"
              : "bg-[#e5dcfb]/85 text-[#745bc7] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[60px] w-full items-center justify-between px-[5%] md:h-[80px] md:px-[3%]">
          {/* Left: TUYU-style airy tracked logo + mini umbrella */}
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="group flex items-center gap-2 py-2 transition-opacity hover:opacity-75 focus:outline-none"
          >
            <span className="font-editorial text-xl font-medium tracking-[0.28em] uppercase md:text-2xl">
              {profile.brandName}
            </span>
            <UmbrellaMark className="h-5 w-5 md:h-6 md:w-6" />
          </Link>

          {/* Right: Social icons (Desktop) + JP|EN style EN|ID + Exact 3-Raindrop PNG Button */}
          <div className="flex items-center gap-4 md:gap-7">
            {/* Hide center links & social bar while drawer is open (exact tuyu.moe clean drawer chrome) */}
            {!drawerOpen && (
              <>
                <nav
                  aria-label="Primary"
                  className="hidden items-center gap-6 lg:flex"
                >
                  {navItems.slice(1, 5).map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative font-editorial text-[13px] tracking-[0.24em] uppercase transition-opacity hover:opacity-70 ${
                          active ? "font-bold" : "font-normal opacity-95"
                        }`}
                      >
                        {pick(item.en, item.id)}
                        {active && (
                          <span
                            className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                              isHeroWhite ? "bg-white" : "bg-[#745bc7]"
                            }`}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="hidden items-center gap-3.5 md:flex">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="transition-opacity hover:opacity-70"
                    >
                      <Github className="h-[18px] w-[18px]" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="transition-opacity hover:opacity-70"
                    >
                      <Linkedin className="h-[18px] w-[18px]" />
                    </a>
                  )}
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                    className="transition-opacity hover:opacity-70"
                  >
                    <Mail className="h-[18px] w-[18px]" />
                  </a>
                </div>
              </>
            )}

            {/* Exact tuyu.moe JP | EN typography style */}
            <div
              className="flex items-center gap-1.5 font-editorial text-[15px] font-bold tracking-[0.14em] md:text-[21px]"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-0.5 py-1 transition-opacity ${
                  locale === "en" ? "opacity-100" : "opacity-65 hover:opacity-90"
                }`}
              >
                EN
              </button>
              <span className="font-normal opacity-75">|</span>
              <button
                type="button"
                onClick={() => setLocale("id")}
                className={`px-0.5 py-1 transition-opacity ${
                  locale === "id" ? "opacity-100" : "opacity-65 hover:opacity-90"
                }`}
              >
                ID
              </button>
            </div>

            {/* Exact tuyu.moe 3-Raindrop PNG Button -> Close X PNG */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              className="flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-75 md:h-12 md:w-12"
            >
              {drawerOpen ? (
                closeIconFailed ? (
                  <ThreeRaindropsMenu open />
                ) : (
                  <img
                    src="/api/uploads/tuyu-menu-close.png"
                    alt=""
                    onError={() => setCloseIconFailed(true)}
                    className="h-7 w-7 object-contain md:h-9 md:w-9"
                  />
                )
              ) : menuIconFailed ? (
                <ThreeRaindropsMenu open={false} />
              ) : (
                <img
                  src="/api/uploads/tuyu-menu-open.png"
                  alt=""
                  onError={() => setMenuIconFailed(true)}
                  className={`h-[20px] w-auto object-contain transition-all duration-300 md:h-[30px] ${
                    isHeroWhite ? "brightness-0 invert" : ""
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Authentic tuyu.moe Full-Screen Panning Pink Watercolor Drawer (.dropdown_nav) */}
      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-300 ease-out ${
          drawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="tuyu-watercolor-pan-pc absolute inset-0 hidden md:block" />
        <div className="tuyu-watercolor-pan-sp absolute inset-0 md:hidden" />

        {/* Giant vertical rotated white SHIZUKU wordmark pinned top-left (exact tuyu.moe .nav_bg) */}
        <div
          className="pointer-events-none absolute top-0 left-0 select-none overflow-hidden pt-24 pl-2 sm:pl-4 md:pt-28 md:pl-6"
          aria-hidden="true"
        >
          <span
            className="block font-editorial text-[5.2rem] font-normal leading-none tracking-[0.26em] text-white/80 uppercase sm:text-[7rem] md:text-[8.5rem]"
            style={{ writingMode: "vertical-rl" }}
          >
            {profile.brandName}
          </span>
        </div>

        {/* Right-aligned wide-tracked iris-purple Menu Links (exact tuyu.moe ul.menu) */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end px-[5%] pb-10 md:px-[3%] md:pb-12">
          <nav
            aria-label="Full navigation"
            className="mb-10 flex flex-col items-end gap-2.5 md:mb-14 md:gap-3"
          >
            {navItems.map((item, idx) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={drawerOpen ? 0 : -1}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    transitionDelay: drawerOpen ? `${idx * 35}ms` : "0ms",
                  }}
                  className={`inline-flex items-center gap-2.5 py-1 font-editorial text-[19px] tracking-[0.34em] uppercase transition-all duration-300 hover:text-[#d749d5] hover:opacity-75 sm:text-[23px] md:text-[26px] md:tracking-[0.42em] ${
                    drawerOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  } ${
                    active ? "font-bold text-[#d749d5]" : "font-normal text-[#745bc7]"
                  }`}
                >
                  {item.href === "/admin" && <Lock className="h-4 w-4" />}
                  <span>{pick(item.en, item.id)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom-right iris purple SNS icons (exact tuyu.moe .d_nav_sns) */}
          <div className="flex items-center justify-end gap-5 text-[#745bc7] md:gap-7">
            <a
              href={`mailto:${profile.email}`}
              tabIndex={drawerOpen ? 0 : -1}
              aria-label="Email"
              className="transition hover:text-[#d749d5] hover:opacity-75"
            >
              <Mail className="h-6 w-6 md:h-7 md:w-7" />
            </a>
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={drawerOpen ? 0 : -1}
                aria-label="LinkedIn"
                className="transition hover:text-[#d749d5] hover:opacity-75"
              >
                <Linkedin className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={drawerOpen ? 0 : -1}
                aria-label="GitHub"
                className="transition hover:text-[#d749d5] hover:opacity-75"
              >
                <Github className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
