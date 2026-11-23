"use client";

import React, { useState } from "react";
import { KeyRound, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { SerializedSkillGroup } from "@/lib/types";

export function SkillsAndSecurityTab({
  skillGroups,
  setSkillGroups,
  notify,
}: {
  skillGroups: SerializedSkillGroup[];
  setSkillGroups: React.Dispatch<React.SetStateAction<SerializedSkillGroup[]>>;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameId, setNewNameId] = useState("");
  const [newItems, setNewItems] = useState("");
  const [creating, setCreating] = useState(false);
  const [chipDrafts, setChipDrafts] = useState<Record<string, string>>({});

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPw, setUpdatingPw] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameEn.trim()) return;
    setCreating(true);
    try {
      const items = newItems
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: newNameEn.trim(),
          nameId: newNameId.trim() || newNameEn.trim(),
          items,
          sortOrder: skillGroups.length + 1,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSkillGroups((prev) => [...prev, json.skillGroup]);
      setNewNameEn("");
      setNewNameId("");
      setNewItems("");
      notify("Skill group created!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Create failed", "err");
    } finally {
      setCreating(false);
    }
  };

  const addSkillChip = async (group: SerializedSkillGroup) => {
    const val = (chipDrafts[group.id] || "").trim();
    if (!val) return;
    const nextItems = group.items.includes(val)
      ? group.items
      : [...group.items, val];
    try {
      const res = await fetch(`/api/admin/skills/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: nextItems }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSkillGroups((prev) =>
        prev.map((g) => (g.id === group.id ? json.skillGroup : g))
      );
      setChipDrafts((prev) => ({ ...prev, [group.id]: "" }));
      notify(`Added "${val}" to ${group.nameEn}`);
    } catch {
      notify("Failed to add skill", "err");
    }
  };

  const removeSkillChip = async (
    group: SerializedSkillGroup,
    skill: string
  ) => {
    const nextItems = group.items.filter((x) => x !== skill);
    try {
      const res = await fetch(`/api/admin/skills/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: nextItems }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSkillGroups((prev) =>
        prev.map((g) => (g.id === group.id ? json.skillGroup : g))
      );
      notify(`Removed "${skill}"`);
    } catch {
      notify("Failed to remove skill", "err");
    }
  };

  const deleteGroup = async (group: SerializedSkillGroup) => {
    if (!window.confirm(`Delete skill group "${group.nameEn}"?`)) return;
    try {
      const res = await fetch(`/api/admin/skills/${group.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setSkillGroups((prev) => prev.filter((g) => g.id !== group.id));
      notify("Skill group deleted");
    } catch {
      notify("Failed to delete skill group", "err");
    }
  };

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
    <div className="space-y-8">
      {/* Skill Groups Manager */}
      <div className="space-y-4">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Skills & Marquee Toolkit
          </h2>
          <p className="text-xs text-[#645882]">
            Directly feeds the Pastel OS Window &ldquo;Tech Stack&rdquo; tab,
            Home skill marquee, and About toolkit.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.id} className="pastel-glass rounded-3xl p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-mono text-xs font-semibold tracking-wider text-[#7650f3] uppercase">
                    {group.nameEn}
                  </h3>
                  <p className="text-[11px] text-[#7a6d9c]">ID: {group.nameId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGroup(group)}
                  className="rounded-lg p-1.5 text-[#9a8bc2] hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full border border-[#e3d9fa] bg-white px-2.5 py-0.5 font-mono text-[11px] text-[#3c3159]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeSkillChip(group, item)}
                      className="text-[#9e8cc9] hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="mt-3.5 flex gap-2">
                <input
                  type="text"
                  value={chipDrafts[group.id] || ""}
                  onChange={(e) =>
                    setChipDrafts((prev) => ({
                      ...prev,
                      [group.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void addSkillChip(group);
                    }
                  }}
                  placeholder="Add skill..."
                  className="flex-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-1.5 text-xs outline-none focus:border-[#7650f3]"
                />
                <button
                  type="button"
                  onClick={() => addSkillChip(group)}
                  className="rounded-xl border border-[#dfd4f8] bg-white px-3 py-1.5 text-xs font-medium text-[#7650f3] hover:bg-[#f4effd]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new group form */}
        <form
          onSubmit={handleCreateGroup}
          className="pastel-glass grid gap-3 rounded-3xl p-5 sm:grid-cols-4 sm:items-end"
        >
          <div>
            <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
              New Group (EN)
            </label>
            <input
              type="text"
              required
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              placeholder="e.g. Cloud & Security"
              className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
              New Group (ID)
            </label>
            <input
              type="text"
              value={newNameId}
              onChange={(e) => setNewNameId(e.target.value)}
              placeholder="e.g. Cloud & Keamanan"
              className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
              Initial Skills (comma-separated)
            </label>
            <input
              type="text"
              value={newItems}
              onChange={(e) => setNewItems(e.target.value)}
              placeholder="Docker, Nginx, OAuth"
              className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#7650f3] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#5e38dc] disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Create Group
          </button>
        </form>
      </div>

      {/* Security: Password Update */}
      <form
        onSubmit={handlePasswordChange}
        className="pastel-glass max-w-xl space-y-4 rounded-3xl p-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3ecff] text-[#7650f3]">
            <KeyRound className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#1e172b]">
              Admin Account Security
            </h3>
            <p className="text-xs text-[#645882]">
              Update your Admin Studio login password anytime.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingPw}
          className="inline-flex items-center gap-2 rounded-full bg-[#1e172b] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#7650f3] disabled:opacity-60"
        >
          {updatingPw ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Update Password
        </button>
      </form>
    </div>
  );
}
