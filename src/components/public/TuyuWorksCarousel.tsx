"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SerializedProject } from "@/lib/types";

interface TuyuWorksCarouselProps {
  projects: SerializedProject[];
}

export function TuyuWorksCarousel({ projects }: TuyuWorksCarouselProps) {
  const count = projects.length;
  const canLoop = count >= 2;
  const copies = canLoop ? 5 : 1;
  const middleStart = canLoop ? count * 2 : 0;

  const [trackIndex, setTrackIndex] = useState(middleStart);
  const [animate, setAnimate] = useState(true);
  const [dragDx, setDragDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
    lockedAxis: "none" | "x" | "y";
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const slides = useMemo(() => {
    if (count === 0) return [];
    const list: { project: SerializedProject; copyIdx: number; idx: number }[] =
      [];
    for (let c = 0; c < copies; c++) {
      for (let i = 0; i < count; i++) {
        list.push({ project: projects[i], copyIdx: c, idx: i });
      }
    }
    return list;
  }, [projects, count, copies]);

  const activeRealIndex = count > 0 ? ((trackIndex % count) + count) % count : 0;

  // Keep trackIndex centered inside middle copy silently once transition finishes
  const normalizeTrackIndex = useCallback(() => {
    if (!canLoop) return;
    if (trackIndex < count || trackIndex >= count * 4) {
      const normalized = middleStart + (((trackIndex % count) + count) % count);
      setAnimate(false);
      setTrackIndex(normalized);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }
  }, [canLoop, count, middleStart, trackIndex]);

  // Safety re-center if user clicks rapidly near track edges
  const stepBy = useCallback(
    (delta: number) => {
      if (!canLoop) return;
      setAnimate(true);
      setTrackIndex((curr) => {
        const next = curr + delta;
        if (next <= 0 || next >= count * copies - 1) {
          return middleStart + (((next % count) + count) % count);
        }
        return next;
      });
    },
    [canLoop, count, copies, middleStart]
  );

  const goPrev = useCallback(() => stepBy(-1), [stepBy]);
  const goNext = useCallback(() => stepBy(1), [stepBy]);

  const goToRealIndex = useCallback(
    (targetReal: number) => {
      if (!canLoop) return;
      const currentReal = ((trackIndex % count) + count) % count;
      let diff = targetReal - currentReal;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      stepBy(diff);
    },
    [canLoop, count, stepBy, trackIndex]
  );

  useEffect(() => {
    if (!animate) {
      const id = window.requestAnimationFrame(() => setAnimate(true));
      return () => window.cancelAnimationFrame(id);
    }
  }, [animate]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canLoop) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    suppressClickRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
      lockedAxis: "none",
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    if (start.lockedAxis === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        start.lockedAxis = "x";
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore if capture is unavailable
        }
      } else {
        start.lockedAxis = "y";
        return;
      }
    }

    if (start.lockedAxis === "x") {
      start.moved = true;
      suppressClickRef.current = true;
      setDragDx(dx);
    }
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;

    const finalDx = e.clientX - start.x;
    const wasHorizontal = start.lockedAxis === "x";
    dragStartRef.current = null;
    setIsDragging(false);
    setDragDx(0);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (wasHorizontal) {
      if (finalDx <= -50) {
        goNext();
      } else if (finalDx >= 50) {
        goPrev();
      }
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);
    }
  };

  if (count === 0) return null;

  return (
    <div
      className="tuyu-carousel-viewport relative w-full select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured works"
    >
      {/* Full-bleed edge-to-edge sliding track */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        className={`relative w-full overflow-hidden touch-pan-y ${
          canLoop ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      >
        <div
          onTransitionEnd={normalizeTrackIndex}
          className={`flex items-start ${
            animate && !isDragging
              ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "transition-none"
          }`}
          style={{
            gap: "var(--slide-gap)",
            transform: `translate3d(calc(50% - var(--slide-w) / 2 - ${trackIndex} * (var(--slide-w) + var(--slide-gap)) + ${dragDx}px), 0, 0)`,
          }}
        >
          {slides.map((slide, i) => {
            const isActive = i === trackIndex;
            const isLeft = i < trackIndex;
            const { project } = slide;

            return (
              <div
                key={`${slide.copyIdx}-${project.id}`}
                style={{ width: "var(--slide-w)" }}
                className={`shrink-0 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                {isActive ? (
                  <Link
                    href={`/projects/${project.slug}`}
                    draggable={false}
                    onClick={(e) => {
                      if (suppressClickRef.current) e.preventDefault();
                    }}
                    className="group block focus:outline-none"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-[#1e1738] shadow-[0_14px_40px_rgba(38,24,78,0.16)]">
                      <img
                        src={project.coverImage || "/assets/cover-platform.jpg"}
                        alt={project.title}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-3 text-[13px] tracking-[1.4px] text-[#745bc7] transition-colors group-hover:text-[#7650f3] md:mt-3.5 md:text-[15px]">
                      {project.title}
                    </p>
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label={`View ${project.title}`}
                    onClick={() => {
                      if (suppressClickRef.current) return;
                      if (isLeft) goPrev();
                      else goNext();
                    }}
                    className="group block w-full text-left focus:outline-none"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-[#1e1738]">
                      <img
                        src={project.coverImage || "/assets/cover-platform.jpg"}
                        alt={project.title}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-3 truncate text-[13px] tracking-[1.4px] text-[#745bc7]/85 md:mt-3.5 md:text-[15px]">
                      {project.title}
                    </p>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Left & Right subtle iris-purple slide controls */}
        {canLoop && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous work"
              className="absolute top-[42%] left-2.5 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#745bc7]/35 bg-white/80 text-[#745bc7] backdrop-blur-sm transition hover:border-[#745bc7] hover:bg-[#745bc7] hover:text-white md:left-6 md:h-11 md:w-11"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next work"
              className="absolute top-[42%] right-2.5 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#745bc7]/35 bg-white/80 text-[#745bc7] backdrop-blur-sm transition hover:border-[#745bc7] hover:bg-[#745bc7] hover:text-white md:right-6 md:h-11 md:w-11"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Minimal dot indicators */}
      {canLoop && (
        <div
          className="mt-6 flex items-center justify-center gap-2 md:mt-8"
          role="tablist"
          aria-label="Choose work slide"
        >
          {projects.map((p, idx) => {
            const active = idx === activeRealIndex;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${idx + 1}: ${p.title}`}
                onClick={() => goToRealIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active
                    ? "w-7 bg-[#745bc7]"
                    : "w-1.5 bg-[#745bc7]/35 hover:bg-[#745bc7]/65"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
