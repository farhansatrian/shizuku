"use client";

import React, { useState } from "react";
import { KeyRound, Loader2, Save } from "lucide-react";

export function SkillsAndSecurityTab({
  notify,
}: {
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPw, setUpdatingPw] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPw(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Password update failed");
      setCurrentPassword("");
      setNewPassword("");
      notify("Admin password updated securely!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed", "err");
    } finally {
      setUpdatingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#745bc7]/20 pb-4">
        <h2 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
          Admin Security
        </h2>
        <p className="mt-0.5 text-xs text-[#5d5370]">
          Update your Admin Studio login password. This is completely separate
          from public SHIZUKU ID accounts.
        </p>
      </div>

      <form
        onSubmit={handlePasswordChange}
        className="max-w-lg space-y-4 border border-[#745bc7]/30 bg-[#fdfbff] p-5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center border border-[#745bc7]/35 bg-[#efe9fd] text-[#745bc7]">
            <KeyRound className="h-4 w-4" />
          </span>
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-[#745bc7] uppercase">
            Change Admin Password
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingPw}
          className="vn-btn-band px-4 py-2 text-[10px] disabled:opacity-60"
        >
          {updatingPw ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
}
