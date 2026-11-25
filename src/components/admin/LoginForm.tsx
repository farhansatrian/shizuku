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
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12 text-[#14100e]">
      <div className="shizuku-workspace-bg" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[440px]">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-[#14100e]/80 uppercase transition hover:text-[#745bc7]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to shizuku
        </Link>

        <div className="vn-frame overflow-hidden">
          <div className="vn-band-strip flex items-center justify-between px-5 py-2.5 text-white">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase drop-shadow-2xs">
              {"SHIZUKU STUDIO // 雫"}
            </span>
            <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase drop-shadow-2xs">
              ADMIN
            </span>
          </div>

          <div className="bg-white/96 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#745bc7]/45 bg-gradient-to-b from-[#efe9fd] to-[#fde8f6] text-[#745bc7]">
                <UmbrellaMark className="h-5 w-5" />
              </span>
              <div>
                <h1 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
                  Admin Studio
                </h1>
                <p className="text-xs text-[#5d5370]">
                  Manage Profile, Work, Portfolio CV, and Certificates.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#5d5370] uppercase">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="farhan"
                  className="shizuku-input mt-1.5 w-full border border-[#745bc7]/45 bg-white px-3.5 py-2.5 text-sm text-[#14100e] outline-none transition placeholder:text-[#8b7fa6] focus:border-[#745bc7] focus:ring-2 focus:ring-[#745bc7]/15"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#5d5370] uppercase">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="shizuku-input w-full border border-[#745bc7]/45 bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#14100e] outline-none transition placeholder:text-[#8b7fa6] focus:border-[#745bc7] focus:ring-2 focus:ring-[#745bc7]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-[#745bc7]/70 hover:text-[#745bc7]"
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
                <div className="border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="vn-btn-band mt-2 w-full py-3 text-[11px] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
                <span>{loading ? "Signing in..." : "Enter Admin Studio"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
