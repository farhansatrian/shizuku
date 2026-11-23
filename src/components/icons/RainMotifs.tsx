"use client";

import React from "react";

export function UmbrellaMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 4V6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 17.5C5 11.425 9.925 6.5 16 6.5C22.075 6.5 27 11.425 27 17.5C24.8 16.2 22.8 16.2 21 17.5C19.2 16.2 17.4 16.2 16 17.5C14.6 16.2 12.8 16.2 11 17.5C9.2 16.2 7.2 16.2 5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path
        d="M16 17.5V24.5C16 26.2 14.7 27.5 13 27.5C11.7 27.5 10.6 26.6 10.3 25.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8.5" r="1.1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="25.5" cy="9.5" r="1.3" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export function RaindropIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 2C10 2 3 10.2 3 15C3 18.866 6.134 22 10 22C13.866 22 17 18.866 17 15C17 10.2 10 2 10 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        d="M7.2 14.8C7.2 16.6 8.3 18 10 18.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function ThreeRaindropsMenu({
  open,
  className = "w-7 h-7",
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {open ? (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 28 24" fill="none" className="w-7 h-6">
          <path
            d="M5.5 5C5.5 5 2.5 9.1 2.5 11.4C2.5 13.06 3.84 14.4 5.5 14.4C7.16 14.4 8.5 13.06 8.5 11.4C8.5 9.1 5.5 5 5.5 5Z"
            fill="currentColor"
          />
          <path
            d="M14 9C14 9 11 13.1 11 15.4C11 17.06 12.34 18.4 14 18.4C15.66 18.4 17 17.06 17 15.4C17 13.1 14 9 14 9Z"
            fill="currentColor"
            opacity="0.88"
          />
          <path
            d="M22.5 5C22.5 5 19.5 9.1 19.5 11.4C19.5 13.06 20.84 14.4 22.5 14.4C24.16 14.4 25.5 13.06 25.5 11.4C25.5 9.1 22.5 5 22.5 5Z"
            fill="currentColor"
            opacity="0.72"
          />
        </svg>
      )}
    </div>
  );
}

export function WatercolorMistTransition() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden leading-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        className="h-16 w-full sm:h-24 md:h-28"
      >
        <path
          d="M0 78C180 112 340 24 540 58C740 92 910 18 1130 56C1285 82 1385 68 1440 52V120H0V78Z"
          fill="#fad8e8"
          fillOpacity="0.45"
        />
        <path
          d="M0 86C220 44 410 108 660 72C910 36 1120 104 1440 66V120H0V86Z"
          fill="#e5dcfb"
          fillOpacity="0.68"
        />
        <path
          d="M0 98C260 68 520 118 820 88C1080 62 1280 96 1440 84V120H0V98Z"
          fill="#f5f0fd"
        />
      </svg>
    </div>
  );
}
