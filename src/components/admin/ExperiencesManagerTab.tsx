"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { BilingualBullets, SerializedExperience } from "@/lib/types";

interface ExpDraft {
  id?: string;
  kind: "WORK" | "EDUCATION" | "ORGANIZATION";
  organization: string;
  roleEn: string;
  roleId: string;
  location: string;
  periodEn: string;
  periodId: string;
  isCurrent: boolean;
  summaryEn: string;
  summaryId: string;
  bullets: BilingualBullets;
  tags: string[];
  published: boolean;
  sortOrder: number;
}

function createEmptyExp(nextOrder: number): ExpDraft {
  return {
    kind: "WORK",
    organization: "",
    roleEn: "",
    roleId: "",
    location: "Jakarta, Indonesia",
    periodEn: "",
    periodId: "",
    isCurrent: false,
    summaryEn: "",
    summaryId: "",
    bullets: { en: [], id: [] },
    tags: [],
    published: true,
    sortOrder: nextOrder,
  };
}

export function ExperiencesManagerTab({
  experiences,
  setExperiences,
  notify,
}: {
  experiences: SerializedExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<SerializedExperience[]>>;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [editing, setEditing] = useState<ExpDraft | null>(null);
  const [langTab, setLangTab] = useState<"en" | "id">("en");
  const [bulletInput, setBulletInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = (e: SerializedExperience) => {
    setLangTab("en");
    setBulletInput("");
    setTagInput("");
    setEditing({
      id: e.id,
      kind: (e.kind as ExpDraft["kind"]) || "WORK",
      organization: e.organization,
      roleEn: e.roleEn,
      roleId: e.roleId,
      location: e.location,
      periodEn: e.periodEn,
      periodId: e.periodId,
      isCurrent: e.isCurrent,
      summaryEn: e.summaryEn,
      summaryId: e.summaryId,
      bullets: e.bullets,
      tags: e.tags,
      published: e.published,
      sortOrder: e.sortOrder,
    });
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    if (
      !editing.roleEn.trim() ||
      !editing.periodEn.trim() ||
      !editing.summaryEn.trim()
    ) {
      setLangTab("en");
      notify(
        "Please fill in Role (EN), Period (EN), and Summary (EN) before saving.",
        "err"
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editing,
        roleId: editing.roleId.trim() || editing.roleEn.trim(),
        periodId: editing.periodId.trim() || editing.periodEn.trim(),
        summaryId: editing.summaryId.trim() || editing.summaryEn.trim(),
      };
      const isUpdate = Boolean(editing.id);
      const res = await fetch(
        isUpdate
          ? `/api/admin/experiences/${editing.id}`
          : "/api/admin/experiences",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save experience");
      const saved: SerializedExperience = json.experience;
      setExperiences((prev) =>
        isUpdate
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved]
      );
      setEditing(null);
      notify(isUpdate ? "Experience updated live!" : "Experience added live!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: SerializedExperience) => {
    if (!window.confirm(`Delete experience at "${e.organization}"?`)) return;
    try {
      const res = await fetch(`/api/admin/experiences/${e.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setExperiences((prev) => prev.filter((x) => x.id !== e.id));
      notify("Experience deleted");
    } catch {
      notify("Delete failed", "err");
    }
  };

  const togglePublished = async (e: SerializedExperience) => {
    try {
      const res = await fetch(`/api/admin/experiences/${e.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !e.published }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setExperiences((prev) =>
        prev.map((x) => (x.id === e.id ? json.experience : x))
      );
      notify("Visibility updated");
    } catch {
      notify("Failed to update visibility", "err");
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= experiences.length) return;
    const previous = experiences;
    const list = [...experiences];
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    const updated = list.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setExperiences(updated);
    try {
      const changed = updated.filter(
        (item) =>
          previous.find((p) => p.id === item.id)?.sortOrder !== item.sortOrder
      );
      const responses = await Promise.all(
        changed.map((item) =>
          fetch(`/api/admin/experiences/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: item.sortOrder }),
          })
        )
      );
      if (responses.some((r) => !r.ok)) throw new Error();
      notify("Timeline order updated");
    } catch {
      setExperiences(previous);
      notify("Failed to reorder experiences", "err");
    }
  };

  const addBullet = () => {
    const val = bulletInput.trim();
    if (!val || !editing) return;
    setEditing({
      ...editing,
      bullets: {
        ...editing.bullets,
        [langTab]: [...editing.bullets[langTab], val],
      },
    });
    setBulletInput("");
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (!val || !editing) return;
    if (!editing.tags.includes(val)) {
      setEditing({ ...editing, tags: [...editing.tags, val] });
    }
    setTagInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Experience & Education Timeline
          </h2>
          <p className="text-xs text-[#645882]">
            Add work roles (e.g. ODP IT BNI), education, and organizations from
            your LinkedIn.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLangTab("en");
            setEditing(createEmptyExp(experiences.length + 1));
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#5e38dc]"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-3.5">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="pastel-glass flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3ecff] text-[#7650f3]">
              {exp.kind === "EDUCATION" ? (
                <GraduationCap className="h-5 w-5" />
              ) : exp.kind === "ORGANIZATION" ? (
                <Users className="h-5 w-5" />
              ) : (
                <Briefcase className="h-5 w-5" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-medium text-[#7650f3] uppercase">
                  {exp.kind}
                </span>
                <span className="font-mono text-[10px] text-[#7a6d9c]">
                  {exp.periodEn} · {exp.location}
                </span>
                {exp.isCurrent && (
                  <span className="rounded-full bg-[#fce4f0] px-2 py-0.5 font-mono text-[10px] text-[#c54784]">
                    CURRENT
                  </span>
                )}
              </div>
              <h3 className="mt-0.5 text-base font-semibold text-[#1e172b]">
                {exp.roleEn}
              </h3>
              <p className="text-xs text-[#645882]">{exp.organization}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => moveOrder(idx, -1)}
                disabled={idx === 0}
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveOrder(idx, 1)}
                disabled={idx === experiences.length - 1}
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => togglePublished(exp)}
                className={`rounded-xl border p-2 ${
                  exp.published
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                {exp.published ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => openEdit(exp)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(exp)}
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
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[#dfd4f8] bg-[#faf7ff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e7dffb] bg-white px-6 py-4">
              <h3 className="font-editorial text-xl font-semibold text-[#1e172b]">
                {editing.id ? "Edit Experience" : "Add Experience"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex rounded-full border border-[#dfd4f8] bg-[#f7f3ff] p-0.5 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLangTab("en")}
                    className={`rounded-full px-3 py-1 ${
                      langTab === "en"
                        ? "bg-[#7650f3] text-white"
                        : "text-[#5f4f85]"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangTab("id")}
                    className={`rounded-full px-3 py-1 ${
                      langTab === "id"
                        ? "bg-[#7650f3] text-white"
                        : "text-[#5f4f85]"
                    }`}
                  >
                    ID
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-[#dfd4f8] bg-white p-1.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Type
                  </label>
                  <select
                    value={editing.kind}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        kind: e.target.value as ExpDraft["kind"],
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs"
                  >
                    <option value="WORK">WORK</option>
                    <option value="EDUCATION">EDUCATION</option>
                    <option value="ORGANIZATION">ORGANIZATION</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Organization / University
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.organization}
                    onChange={(e) =>
                      setEditing({ ...editing, organization: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Role / Degree ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required={langTab === "en"}
                    value={langTab === "en" ? editing.roleEn : editing.roleId}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ...(langTab === "en"
                          ? { roleEn: e.target.value }
                          : { roleId: e.target.value }),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Period ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required={langTab === "en"}
                    placeholder="e.g. Jan 2025 - Present"
                    value={
                      langTab === "en" ? editing.periodEn : editing.periodId
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ...(langTab === "en"
                          ? { periodEn: e.target.value }
                          : { periodId: e.target.value }),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Location
                </label>
                <input
                  type="text"
                  value={editing.location}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Summary ({langTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  required={langTab === "en"}
                  value={
                    langTab === "en" ? editing.summaryEn : editing.summaryId
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      ...(langTab === "en"
                        ? { summaryEn: e.target.value }
                        : { summaryId: e.target.value }),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Key Achievements / Bullets ({langTab.toUpperCase()})
                </label>
                <ul className="mt-1.5 space-y-1.5">
                  {editing.bullets[langTab].map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-2 rounded-xl border border-[#e7dffb] bg-white px-3 py-2 text-xs"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            bullets: {
                              ...editing.bullets,
                              [langTab]: editing.bullets[langTab].filter(
                                (_, idx) => idx !== i
                              ),
                            },
                          })
                        }
                        className="text-[#9e8cc9] hover:text-rose-600"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBullet();
                      }
                    }}
                    placeholder="Add bullet point and press Enter"
                    className="flex-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addBullet}
                    className="rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs font-medium text-[#7650f3]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Tags
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {editing.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-2.5 py-0.5 font-mono text-xs"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            tags: editing.tags.filter((x) => x !== t),
                          })
                        }
                        className="text-[#9e8cc9] hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add skill/domain tag"
                    className="flex-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="rounded-xl border border-[#dfd4f8] bg-white px-3 py-1.5 text-xs text-[#7650f3]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs text-[#4a3f66]">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.isCurrent}
                    onChange={(e) =>
                      setEditing({ ...editing, isCurrent: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#7650f3]"
                  />
                  Current / Active Role
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
                  Published
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
                Save Experience
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
