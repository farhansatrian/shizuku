"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  Bot,
  Code2,
  Eye,
  EyeOff,
  ExternalLink,
  FolderKanban,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  User,
  Wallet,
  X,
} from "lucide-react";
import type { SerializedWorkspaceApp } from "@/lib/types";

function renderWorkspaceIcon(icon: string, className = "h-4 w-4") {
  switch (icon) {
    case "bot":
      return <Bot className={className} />;
    case "wallet":
      return <Wallet className={className} />;
    case "folder":
      return <FolderKanban className={className} />;
    case "award":
      return <Award className={className} />;
    case "user":
      return <User className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "globe":
      return <Globe className={className} />;
    case "code":
      return <Code2 className={className} />;
    case "terminal":
      return <Terminal className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

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

const ICON_OPTIONS = [
  "bot",
  "wallet",
  "folder",
  "user",
  "award",
  "settings",
  "globe",
  "code",
  "terminal",
  "sparkles",
] as const;

function createEmptyApp(nextOrder: number): WorkspaceDraft {
  return {
    name: "",
    category: "APP",
    descriptionEn: "",
    descriptionId: "",
    url: "",
    icon: "globe",
    badge: "DAILY",
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
      category: (a.category as WorkspaceDraft["category"]) || "APP",
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
        descriptionId:
          editing.descriptionId.trim() || editing.descriptionEn.trim(),
      };
      const isUpdate = Boolean(editing.id);
      const res = await fetch(
        isUpdate
          ? `/api/admin/workspace/${editing.id}`
          : "/api/admin/workspace",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      const saved: SerializedWorkspaceApp = json.workspaceApp;
      setApps((prev) =>
        isUpdate
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved]
      );
      setEditing(null);
      notify(
        isUpdate
          ? `Updated "${saved.name}" in Workspace!`
          : `Added "${saved.name}" to Workspace!`
      );
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
      notify(`Updated visibility for "${a.name}"`);
    } catch {
      notify("Failed to update visibility", "err");
    }
  };

  const handleDelete = async (a: SerializedWorkspaceApp) => {
    if (!window.confirm(`Remove "${a.name}" from Workspace launcher?`)) return;
    try {
      const res = await fetch(`/api/admin/workspace/${a.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setApps((prev) => prev.filter((x) => x.id !== a.id));
      notify(`Removed "${a.name}"`);
    } catch {
      notify("Failed to delete workspace app", "err");
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
      notify("Workspace order updated");
    } catch {
      setApps(previous);
      notify("Failed to reorder workspace apps", "err");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Work &amp; Ecosystem Apps
          </h2>
          <p className="text-xs text-[#645882]">
            Manage the apps shown on your Work (/workspace) page — add, edit,
            reorder, or remove entries anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyApp(apps.length + 1))}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#5e38dc]"
        >
          <Plus className="h-4 w-4" />
          Add App / Shortcut
        </button>
      </div>

      <div className="space-y-3">
        {apps.map((app, idx) => (
          <div
            key={app.id}
            className="pastel-glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5dcfb] text-[#7650f3]">
              {renderWorkspaceIcon(app.icon, "h-4 w-4")}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-[#14100e]">
                  {app.name}
                </h3>
                <span className="rounded-full bg-[#f4effd] px-2 py-0.5 font-mono text-[10px] text-[#7650f3]">
                  {app.category}
                </span>
                {app.badge && (
                  <span className="rounded-full border border-[#dfd4f8] bg-white px-2 py-0.5 font-mono text-[10px] text-[#5c526e]">
                    {app.badge}
                  </span>
                )}
                {!app.published && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] text-amber-800">
                    HIDDEN
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-[#5c526e]">
                {app.descriptionEn}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] text-[#7c6e9c]">
                {app.url} {app.isExternal ? "(external)" : "(internal)"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => moveOrder(idx, -1)}
                disabled={idx === 0}
                title="Move up"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveOrder(idx, 1)}
                disabled={idx === apps.length - 1}
                title="Move down"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => togglePublished(app)}
                title="Toggle visibility"
                className={`rounded-xl border p-2 ${
                  app.published
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                {app.published ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              <a
                href={app.url}
                target={app.isExternal ? "_blank" : undefined}
                rel={app.isExternal ? "noreferrer" : undefined}
                title="Open link"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => openEdit(app)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(app)}
                title="Delete"
                className="rounded-xl border border-rose-200 bg-rose-50/70 p-2 text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#19132b]/65 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#dfd4f8] bg-[#faf7ff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e7dffb] bg-white px-6 py-4">
              <h3 className="font-editorial text-xl font-semibold text-[#1e172b]">
                {editing.id ? "Edit Workspace App" : "Add Workspace App"}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#dfd4f8] bg-white p-1.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    App Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="e.g. KostKas / Agent Hub"
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category: e.target.value as WorkspaceDraft["category"],
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs"
                  >
                    <option value="AGENT">AGENT</option>
                    <option value="APP">APP</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="BOOKMARK">BOOKMARK</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Target URL (internal /path or https://...)
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
                      });
                    }}
                    placeholder="/workspace or https://..."
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 font-mono text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Short Badge
                  </label>
                  <input
                    type="text"
                    value={editing.badge}
                    onChange={(e) =>
                      setEditing({ ...editing, badge: e.target.value })
                    }
                    placeholder="APP / SOON"
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 font-mono text-xs uppercase outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Icon
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setEditing({ ...editing, icon: ic })}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[11px] transition ${
                        editing.icon === ic
                          ? "border-[#7650f3] bg-[#7650f3] text-white"
                          : "border-[#dfd4f8] bg-white text-[#5c526e] hover:border-[#7650f3]"
                      }`}
                    >
                      {renderWorkspaceIcon(ic, "h-3.5 w-3.5")}
                      <span>{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Description (EN)
                </label>
                <input
                  type="text"
                  required
                  value={editing.descriptionEn}
                  onChange={(e) =>
                    setEditing({ ...editing, descriptionEn: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Description (ID — optional)
                </label>
                <input
                  type="text"
                  value={editing.descriptionId}
                  onChange={(e) =>
                    setEditing({ ...editing, descriptionId: e.target.value })
                  }
                  placeholder="Defaults to English if left blank"
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs text-[#4a3f66]">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.isExternal}
                    onChange={(e) =>
                      setEditing({ ...editing, isExternal: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#7650f3]"
                  />
                  Open in new tab (External)
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#7650f3]"
                  />
                  Published on Home & Workspace
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#e7dffb] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#dfd4f8] px-4 py-2 text-xs text-[#5f4f85]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2 text-xs font-medium text-white hover:bg-[#5e38dc] disabled:opacity-60"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save App
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
