"use client";

import React from "react";

// Exact 20-drop distribution, V-wave vertical offsets, and varied durations from tuyu.moe
const TUYU_RAINDROPS = [
  { left: "5%", top: "-190px", dur: "13s" },
  { left: "10%", top: "-180px", dur: "14s" },
  { left: "15%", top: "-170px", dur: "11s" },
  { left: "20%", top: "-160px", dur: "15s" },
  { left: "25%", top: "-150px", dur: "13s" },
  { left: "30%", top: "-150px", dur: "14s" },
  { left: "35%", top: "-160px", dur: "16s" },
  { left: "40%", top: "-170px", dur: "10s" },
  { left: "45%", top: "-180px", dur: "12s" },
  { left: "50%", top: "-190px", dur: "14s" },
  { left: "55%", top: "-190px", dur: "13s" },
  { left: "60%", top: "-180px", dur: "9s" },
  { left: "65%", top: "-170px", dur: "17s" },
  { left: "70%", top: "-160px", dur: "15s" },
  { left: "75%", top: "-150px", dur: "13s" },
  { left: "80%", top: "-150px", dur: "17s" },
  { left: "85%", top: "-160px", dur: "11s" },
  { left: "90%", top: "-170px", dur: "12s" },
  { left: "95%", top: "-180px", dur: "14s" },
  { left: "100%", top: "-190px", dur: "16s" },
];

export function TuyuRainLayer({
  overSplash = false,
  behindContent = false,
}: {
  overSplash?: boolean;
  behindContent?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${
        behindContent ? "z-0" : overSplash ? "z-30 md:z-[95]" : "z-30"
      }`}
      aria-hidden="true"
    >
      {TUYU_RAINDROPS.map((drop, i) => (
        <span
          key={i}
          className="tuyu-rain-drop"
          style={{
            left: drop.left,
            top: drop.top,
            animationDuration: drop.dur,
          }}
        />
      ))}
    </div>
  );
}
