"use client";

import React from "react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import type { SerializedProfile } from "@/lib/types";

export function HeroSection({ profile }: { profile: SerializedProfile }) {
  const hasDesktopArt = Boolean(profile.heroImage?.trim());
  const hasMobileArt = Boolean(profile.heroImageMobile?.trim());
  const hasAnyArt = hasDesktopArt || hasMobileArt;

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-[#1a1333]"
    >
      {/* Pure Unobstructed Full-Bleed Key Visual */}
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
    </section>
  );
}
