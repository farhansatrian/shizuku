"use client";

import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile } from "@/lib/types";

export function Footer({ profile }: { profile: SerializedProfile }) {
  const { pick } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="tuyu-footer-band relative z-10 px-6 py-10 text-center text-white md:py-16">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center space-y-2">
        <p className="font-mono text-[10px] tracking-[3px] text-white/95 md:text-[11px] md:tracking-[4px]">
          ©{year} {profile.brandName.toUpperCase()} ({profile.brandKanji})
        </p>
        <p className="font-mono text-[9px] tracking-[2px] text-white/80 md:text-[10px]">
          {pick("Special thanks & inspiration:", "Special thanks & inspirasi:")}{" "}
          <a
            href="https://tuyu.moe/en/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/45 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            TUYU
          </a>{" "}
          &amp;{" "}
          <a
            href="https://www.omo-cat.com/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/45 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            OMOCAT
          </a>
        </p>
      </div>
    </footer>
  );
}
