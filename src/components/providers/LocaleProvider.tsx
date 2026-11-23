"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "@/lib/types";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  pick: <T>(en: T, id: T) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "shizuku_locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Default language is strictly English ("en") as requested
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "id") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "id" : "en");
  }, [locale, setLocale]);

  const pick = useCallback(
    <T,>(en: T, id: T): T => (locale === "id" ? id : en),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, pick }),
    [locale, setLocale, toggleLocale, pick]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return ctx;
}
