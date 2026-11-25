"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { SerializedWorkspaceApp } from "@/lib/types";

interface WorkspaceDraft {
  id?: string;
  name: string;
  category: "INTERNAL" | "APP" | "AGENT" | "BOOKMARK";
  descriptionEn: string;
  descriptionId: string;
  url: string;
  icon: string;
  badge: string;
  isExternal: boolean;
  published: boolean;
  sortOrder: number;
}

function createEmptyApp(nextOrder: number): WorkspaceDraft {
  return {
    name: "",
    category: "APP",
    descriptionEn: "",
    descriptionId: "",
    url: "https://",
    icon: "globe",
    badge: "APP",
    isExternal: true,
    published: true,
    sortOrder: nextOrder,
  };
}

export function WorkspaceManagerTab({
  apps,
  setApps,
  notify,
}: {
  apps: SerializedWorkspaceApp[];
  setApps: React.Dispatch<React.SetStateAction<SerializedWorkspaceApp[]>>;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [editing, setEditing] = useState<WorkspaceDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (a: SerializedWorkspaceApp) => {
    setEditing({
      id: a.id,
      name: a.name,
      category: a.category as WorkspaceDraft["category"],
      descriptionEn: a.descriptionEn,
      descriptionId: a.descriptionId,
      url: a.url,
      icon: a.icon,
      badge: a.badge,
      isExternal: a.isExternal,
      published: a.published,
      sortOrder: a.sortOrder,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        name: editing.name.trim(),
        badge: editing.badge.trim().toUpperCase(),
        url: editing.url.trim(),
        descriptionEn: editing.descriptionEn.trim(),
        descriptionId:
          editing.descriptionId.trim() || editing.descriptionEn.trim(),
      };
      const isUpdate = Boolean(editing.id);
      const res = await fetch(
        isUpdate ? `/api/admin/workspace/${editing.id}` : "/api/admin/workspace",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save work item");
      const saved: SerializedWorkspaceApp = json.workspaceApp;
      setApps((prev) =>
        isUpdate
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved]
      );
      setEditing(null);
      notify(isUpdate ? `Updated "${saved.name}"` : `Added "${saved.name}"!`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (a: SerializedWorkspaceApp) => {
    try {
      const res = await fetch(`/api/admin/workspace/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !a.published }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setApps((prev) =>
        prev.map((x) => (x.id === a.id ? json.workspaceApp : x))
      );
      notify(
        json.workspaceApp.published
          ? `Shown "${a.name}" on /workspace`
          : `Hidden "${a.name}"`
      );
    } catch {
      notify("Failed to update visibility", "err");
    }
  };

  const handleDelete = async (a: SerializedWorkspaceApp) => {
    if (!window.confirm(`Remove "${a.name}" from Work (/workspace)?`)) return;
    try {
      const res = await fetch(`/api/admin/workspace/${a.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setApps((prev) => prev.filter((x) => x.id !== a.id));
      notify(`Removed "${a.name}"`);
    } catch {
      notify("Failed to delete item", "err");
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= apps.length) return;
    const previous = apps;
    const list = [...apps];
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    const updated = list.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setApps(updated);
    try {
      const changed = updated.filter(
        (item) =>
          previous.find((p) => p.id === item.id)?.sortOrder !== item.sortOrder
      );
      const responses = await Promise.all(
        changed.map((item) =>
          fetch(`/api/admin/workspace/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: item.sortOrder }),
          })
        )
      );
      if (responses.some((r) => !r.ok)) throw new Error();
      notify("Order updated");
    } catch {
      setApps(previous);
      notify("Failed to reorder", "err");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#745bc7]/20 pb-4">
        <div>
          <h2 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
            Work &amp; Ecosystem Apps
          </h2>
          <p className="mt-0.5 text-xs text-[#5d5370]">
            Manage the ecosystem apps displayed on /workspace — add, edit,
            reorder, or remove anytime.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/workspace"
            target="_blank"
            className="vn-btn-action px-3.5 py-2 text-[10px]"
          >
            <span>Preview /workspace</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => setEditing(createEmptyApp(apps.length + 1))}
            className="vn-btn-band px-4 py-2 text-[10px]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Work App</span>
          </button>
        </div>
      </div>

      {/* Sharp Card List */}
      {apps.length === 0 ? (
        <div className="border border-dashed border-[#745bc7]/35 bg-[#faf7ff] px-5 py-10 text-center text-xs text-[#5d5370]">
          No ecosystem works yet. Click &ldquo;Add Work App&rdquo; to publish
          your first app on /workspace.
        </div>
      ) : (
        <div className="space-y-2.5">
          {apps.map((app, idx) => (
            <div
              key={app.id}
              className={`flex flex-col gap-3 border border-[#745bc7]/30 bg-[#fdfbff] p-4 transition hover:border-[#745bc7] sm:flex-row sm:items-center ${
                app.published ? "" : "opacity-60"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10.5px] font-bold text-[#745bc7]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-editorial text-base font-bold tracking-[0.1em] text-[#14100e] uppercase">
                    {app.name}
                  </h3>
                  {app.badge && (
                    <span className="border border-[#745bc7]/45 bg-[#efe9fd] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-[#745bc7] uppercase">
                      {app.badge}
                    </span>
                  )}
                  {!app.published && (
                    <span className="bg-amber-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-amber-800 uppercase">
                      HIDDEN
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#5d5370]">
                  {app.descriptionEn}
                </p>
                <p className="mt-0.5 truncate font-mono text-[10.5px] text-[#7b6f94]">
                  {app.url} {app.isExternal ? "(new tab)" : "(internal)"}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveOrder(idx, -1)}
                  disabled={idx === 0}
                  title="Move up"
                  className="border border-[#745bc7]/35 bg-white p-1.5 text-[#5d5370] transition hover:border-[#745bc7] hover:text-[#745bc7] disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOrder(idx, 1)}
                  disabled={idx === apps.length - 1}
                  title="Move down"
                  className="border border-[#745bc7]/35 bg-white p-1.5 text-[#5d5370] transition hover:border-[#745bc7] hover:text-[#745bc7] disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePublished(app)}
                  title={
                    app.published
                      ? "Visible on /workspace"
                      : "Hidden from /workspace"
                  }
                  className={`border p-1.5 transition ${
                    app.published
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-[#745bc7]/35 bg-white text-[#8c7eb0]"
                  }`}
                >
                  {app.published ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(app)}
                  className="inline-flex items-center gap-1 border border-[#745bc7]/45 bg-white px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-[#14100e] uppercase transition hover:bg-[#745bc7] hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app)}
                  title="Delete"
                  className="border border-rose-300 bg-rose-50/80 p-1.5 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clean Minimal Add / Edit Modal (Only Active Fields Shown on /workspace) */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#19132b]/65 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="vn-frame flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden"
          >
            <div className="vn-band-strip flex items-center justify-between px-5 py-3 text-white">
              <h3 className="font-mono text-xs font-semibold tracking-[0.16em] uppercase drop-shadow-2xs">
                {editing.id ? "Edit Work App" : "Add Work App"}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border border-white/55 bg-white/15 p-1 text-white transition hover:bg-white/30"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#fdfbff] p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    App Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="e.g. SHIKAS / SHIKOST"
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editing.badge}
                    onChange={(e) =>
                      setEditing({ ...editing, badge: e.target.value })
                    }
                    placeholder="HUB / FINANCE"
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 font-mono text-xs uppercase outline-none focus:border-[#745bc7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Target URL (https://... or internal /path)
                </label>
                <input
                  type="text"
                  required
                  value={editing.url}
                  onChange={(e) => {
                    const nextUrl = e.target.value;
                    setEditing({
                      ...editing,
                      url: nextUrl,
                      isExternal: nextUrl.startsWith("http"),
                      category: nextUrl.startsWith("http") ? "APP" : "INTERNAL",
                    });
                  }}
                  placeholder="https://shikas.yourdomain.dev"
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-[#745bc7]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Short Description (EN)
                </label>
                <input
                  type="text"
                  required
                  value={editing.descriptionEn}
                  onChange={(e) =>
                    setEditing({ ...editing, descriptionEn: e.target.value })
                  }
                  placeholder="1-line summary shown on the Work card"
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Short Description (ID — optional)
                </label>
                <input
                  type="text"
                  value={editing.descriptionId}
                  onChange={(e) =>
                    setEditing({ ...editing, descriptionId: e.target.value })
                  }
                  placeholder="Defaults to English if left blank"
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs text-[#3b3150]">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.isExternal}
                    onChange={(e) =>
                      setEditing({ ...editing, isExternal: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#745bc7]"
                  />
                  Open in new tab
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#745bc7]"
                  />
                  Show on /workspace
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#745bc7]/20 bg-white px-5 py-3.5">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="vn-btn-action px-4 py-2 text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="vn-btn-band px-4 py-2 text-[10px] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save App</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
