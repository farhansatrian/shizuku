"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UmbrellaMark } from "@/components/icons/RainMotifs";

const PRELOADER_KEY = "shizuku_preloader_seen";

export function RainPreloader({
  brandName = "shizuku",
  brandKanji = "雫",
}: {
  brandName?: string;
  brandKanji?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let hideTimer = 0;
    try {
      const seen = window.sessionStorage.getItem(PRELOADER_KEY);
      if (seen) return;
      window.sessionStorage.setItem(PRELOADER_KEY, "1");
      rafId = window.requestAnimationFrame(() => {
        setVisible(true);
        hideTimer = window.setTimeout(() => setVisible(false), 950);
      });
    } catch {
      return;
    }
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, #fde2ef 0%, #ebe1fc 52%, #ddd2fb 100%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 text-[#452f8c]"
          >
            <UmbrellaMark className="h-12 w-12" />
            <div className="flex items-center gap-2 font-editorial text-2xl tracking-[0.28em] uppercase text-[#241842]">
              <span>{brandName}</span>
              <span className="text-lg text-[#7650f3]">{brandKanji}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-1.5 rounded-full bg-[#7650f3]/70"
                  animate={{ y: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    delay: i * 0.14,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
