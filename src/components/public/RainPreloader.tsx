"use client";

import React, { useEffect, useState } from "react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";

// Persists across SPA navigations so returning to "/" does not replay the splash,
// while a fresh load or browser refresh replays the calm tuyu.moe curtain cleanly.
// Setting this only once fade-out begins keeps it 100% safe under React 19 Strict Mode.
let splashPlayedInPageLoad = false;

export function RainPreloader({
  brandName = "shizuku",
}: {
  brandName?: string;
  brandKanji?: string;
}) {
  // Phases: active -> spinner-out -> overlay-out -> hidden
  const [phase, setPhase] = useState<
    "active" | "spinner-out" | "overlay-out" | "hidden"
  >(() =>
    typeof window !== "undefined" && splashPlayedInPageLoad
      ? "hidden"
      : "active"
  );
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (splashPlayedInPageLoad) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = prefersReduced ? 350 : 1200;
    const umbrellaFadeMs = prefersReduced ? 150 : 850;
    const curtainFadeMs = prefersReduced ? 150 : 460;

    let t2 = 0;
    let t3 = 0;

    const t1 = window.setTimeout(() => {
      splashPlayedInPageLoad = true;
      setPhase("spinner-out");
      t2 = window.setTimeout(() => {
        setPhase("overlay-out");
        t3 = window.setTimeout(() => {
          setPhase("hidden");
        }, curtainFadeMs);
      }, umbrellaFadeMs);
    }, holdMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      data-testid="tuyu-splash"
      onClick={() => {
        splashPlayedInPageLoad = true;
        setPhase("hidden");
      }}
      role="presentation"
      className={`fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-[450ms] ease-out ${
        phase === "overlay-out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Desktop panning pink watercolor backdrop */}
      <div className="tuyu-watercolor-pan-pc absolute inset-0 hidden md:block" />
      {/* Mobile panning pale pink watercolor backdrop */}
      <div className="tuyu-watercolor-pan-sp absolute inset-0 md:hidden" />

      {/* Stationary centered watercolor umbrella (exact tuyu.moe calm aesthetic) */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-opacity duration-[800ms] ease-out ${
          phase === "active" ? "opacity-100" : "opacity-0"
        }`}
      >
        {imgFailed ? (
          <UmbrellaMark className="h-20 w-20 text-[#745bc7] md:h-24 md:w-24" />
        ) : (
          <img
            src="/api/uploads/tuyu-umbrella.png"
            alt={`${brandName} loading umbrella`}
            onError={() => setImgFailed(true)}
            className="w-[78px] max-w-[100px] select-none md:w-[100px]"
          />
        )}
      </div>
    </div>
  );
}
