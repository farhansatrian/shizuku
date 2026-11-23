"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Sign in failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shizuku-watercolor-bg flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-[#6a5c8d] transition hover:text-[#7650f3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to shizuku.
        </Link>

        <div className="pastel-glass overflow-hidden rounded-[2rem] p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7650f3] to-[#ee84b5] text-white shadow-sm">
              <UmbrellaMark className="h-6 w-6" />
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#7650f3] uppercase">
                shizuku · 雫
              </p>
              <h1 className="font-editorial text-2xl font-semibold text-[#1e172b]">
                Admin Studio Login
              </h1>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#62577a]">
            Sign in to update your profile, projects, experiences, certificates,
            and skills. Changes sync live to the public portfolio immediately.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-medium tracking-wider text-[#58497c] uppercase">
                Username or Email
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="farhan"
                className="mt-1.5 w-full rounded-xl border border-[#dfd4f8] bg-white px-4 py-2.5 text-sm text-[#1e172b] outline-none transition focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-medium tracking-wider text-[#58497c] uppercase">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#dfd4f8] bg-white py-2.5 pr-11 pl-4 text-sm text-[#1e172b] outline-none transition focus:border-[#7650f3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7c6ea0] hover:text-[#7650f3]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#7650f3] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_26px_-10px_rgba(118,80,243,0.75)] transition hover:bg-[#5e38dc] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Signing in..." : "Enter Admin Studio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
