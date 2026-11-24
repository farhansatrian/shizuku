"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
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

/* Bold solid brand SVGs calibrated to match tuyu.moe's prominent SNS icon bar */
function InstagramGlyph({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm4.25 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.35-2.6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
    </svg>
  );
}

function YouTubeGlyph({ className = "h-6 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9ZM11.2 14.3V5.7L18.5 10l-7.3 4.3Z" />
    </svg>
  );
}

function LinkedInGlyph({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.6 18.2H6V10h2.6v8.2ZM7.3 8.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm10.9 9.3h-2.6v-4c0-.96-.02-2.2-1.34-2.2-1.35 0-1.55 1.05-1.55 2.13v4.07h-2.6V10h2.5v1.12h.03c.35-.66 1.2-1.35 2.47-1.35 2.64 0 3.13 1.74 3.13 4v4.43Z" />
    </svg>
  );
}

function GitHubGlyph({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function MailGlyph({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 3.75 4.5Zm.32 2 7.93 5.56L19.93 6.5H4.07Zm16.43 10.75V8.53l-7.93 5.56a1 1 0 0 1-1.14 0L3.5 8.53v8.72c0 .14.11.25.25.25h16.5c.14 0 .25-.11.25-.25Z" />
    </svg>
  );
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

  const socialLinks = [
    profile.instagramUrl
      ? {
          key: "instagram",
          href: profile.instagramUrl,
          label: "Instagram",
          icon: <InstagramGlyph className="h-[24px] w-[24px] md:h-[27px] md:w-[27px]" />,
        }
      : null,
    profile.youtubeUrl
      ? {
          key: "youtube",
          href: profile.youtubeUrl,
          label: "YouTube",
          icon: <YouTubeGlyph className="h-[22px] w-[30px] md:h-[24px] md:w-[33px]" />,
        }
      : null,
    profile.linkedinUrl
      ? {
          key: "linkedin",
          href: profile.linkedinUrl,
          label: "LinkedIn",
          icon: <LinkedInGlyph className="h-[24px] w-[24px] md:h-[27px] md:w-[27px]" />,
        }
      : null,
    profile.githubUrl
      ? {
          key: "github",
          href: profile.githubUrl,
          label: "GitHub",
          icon: <GitHubGlyph className="h-[24px] w-[24px] md:h-[27px] md:w-[27px]" />,
        }
      : null,
    profile.email
      ? {
          key: "email",
          href: `mailto:${profile.email}`,
          label: "Email",
          icon: <MailGlyph className="h-[24px] w-[24px] md:h-[27px] md:w-[27px]" />,
          isMail: true,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: React.ReactNode;
    isMail?: boolean;
  }[];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          drawerOpen
            ? "bg-transparent text-[#745bc7]"
            : isHeroWhite
              ? "bg-gradient-to-b from-[#17112a]/55 via-[#17112a]/20 to-transparent text-white [text-shadow:0_1px_8px_rgba(20,16,14,0.45)]"
              : "bg-[#e5dcfb]/88 text-[#745bc7] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full items-center justify-between px-[5%] md:h-[92px] md:px-[3%]">
          {/* Left: Prominent TUYU-scale logo + umbrella */}
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="group flex items-center gap-2.5 py-2 transition-opacity hover:opacity-75 focus:outline-none md:gap-3"
          >
            <span className="font-editorial text-[22px] font-medium tracking-[0.32em] uppercase sm:text-[26px] md:text-[31px] md:tracking-[0.36em]">
              {profile.brandName}
            </span>
            <UmbrellaMark className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
          </Link>

          {/* Right: Pure tuyu.moe Social Icons + Large EN | ID + Large 3-Raindrop Burger */}
          <div className="flex items-center gap-4 sm:gap-5 md:gap-8">
            {/* Desktop Social Media Icon Bar (hidden when full-screen drawer is open) */}
            {!drawerOpen && (
              <div
                aria-label="Social links"
                className="hidden items-center gap-5 md:flex lg:gap-7"
              >
                {socialLinks.map((sns) => (
                  <a
                    key={sns.key}
                    href={sns.href}
                    target={sns.isMail ? undefined : "_blank"}
                    rel={sns.isMail ? undefined : "noreferrer"}
                    aria-label={sns.label}
                    title={sns.label}
                    className="inline-flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
                  >
                    {sns.icon}
                  </a>
                ))}
              </div>
            )}

            {/* Large tuyu.moe-scale JP | EN style language switcher */}
            <div
              className="flex items-center gap-1.5 font-editorial text-[18px] font-bold tracking-[0.14em] sm:text-[20px] md:gap-2 md:text-[25px]"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-0.5 py-1 transition-opacity ${
                  locale === "en" ? "opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              >
                EN
              </button>
              <span className="font-normal opacity-75">|</span>
              <button
                type="button"
                onClick={() => setLocale("id")}
                className={`px-0.5 py-1 transition-opacity ${
                  locale === "id" ? "opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              >
                ID
              </button>
            </div>

            {/* Prominent tuyu.moe 3-Raindrop PNG Button -> Close X PNG */}
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
                    className="h-8 w-8 object-contain md:h-10 md:w-10"
                  />
                )
              ) : menuIconFailed ? (
                <ThreeRaindropsMenu open={false} />
              ) : (
                <img
                  src="/api/uploads/tuyu-menu-open.png"
                  alt=""
                  onError={() => setMenuIconFailed(true)}
                  className={`h-[24px] w-auto object-contain transition-all duration-300 md:h-[34px] ${
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

          {/* Bottom-right bold iris purple SNS icons (exact tuyu.moe .d_nav_sns) */}
          <div className="flex items-center justify-end gap-5 text-[#745bc7] md:gap-7">
            {socialLinks.map((sns) => (
              <a
                key={sns.key}
                href={sns.href}
                target={sns.isMail ? undefined : "_blank"}
                rel={sns.isMail ? undefined : "noreferrer"}
                tabIndex={drawerOpen ? 0 : -1}
                aria-label={sns.label}
                title={sns.label}
                className="inline-flex items-center justify-center transition hover:text-[#d749d5] hover:opacity-75"
              >
                {sns.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
