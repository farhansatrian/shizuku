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
  Star,
  Trash2,
  X,
} from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { ProjectHighlight, SerializedProject } from "@/lib/types";

interface ProjectDraft {
  id?: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  status: string;
  roleEn: string;
  roleId: string;
  summaryEn: string;
  summaryId: string;
  descriptionEn: string;
  descriptionId: string;
  highlights: ProjectHighlight[];
  impactMetricEn: string;
  impactMetricId: string;
  techStack: string[];
  coverImage: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createEmptyDraft(nextOrder: number): ProjectDraft {
  return {
    slug: "",
    title: "",
    category: "FULLSTACK",
    year: String(new Date().getFullYear()),
    status: "PRODUCTION",
    roleEn: "Software Engineer",
    roleId: "Software Engineer",
    summaryEn: "",
    summaryId: "",
    descriptionEn: "",
    descriptionId: "",
    highlights: [],
    impactMetricEn: "",
    impactMetricId: "",
    techStack: [],
    coverImage: "/assets/cover-platform.jpg",
    liveUrl: "",
    repoUrl: "",
    featured: true,
    published: true,
    sortOrder: nextOrder,
  };
}

export function ProjectsManagerTab({
  projects,
  setProjects,
  notify,
}: {
  projects: SerializedProject[];
  setProjects: React.Dispatch<React.SetStateAction<SerializedProject[]>>;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [editing, setEditing] = useState<ProjectDraft | null>(null);
  const [langTab, setLangTab] = useState<"en" | "id">("en");
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setLangTab("en");
    setTechInput("");
    setEditing(createEmptyDraft(projects.length + 1));
  };

  const openEdit = (p: SerializedProject) => {
    setLangTab("en");
    setTechInput("");
    setEditing({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      year: p.year,
      status: p.status,
      roleEn: p.roleEn,
      roleId: p.roleId,
      summaryEn: p.summaryEn,
      summaryId: p.summaryId,
      descriptionEn: p.descriptionEn,
      descriptionId: p.descriptionId,
      highlights: p.highlights,
      impactMetricEn: p.impactMetricEn,
      impactMetricId: p.impactMetricId,
      techStack: p.techStack,
      coverImage: p.coverImage,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.roleEn.trim() || !editing.summaryEn.trim()) {
      setLangTab("en");
      notify(
        "Please fill in Role (EN) and Short Summary (EN) before saving.",
        "err"
      );
      return;
    }

    setSaving(true);
    try {
      const normalizedHighlights = editing.highlights
        .filter(
          (hl) =>
            hl.titleEn.trim() ||
            hl.titleId.trim() ||
            hl.detailEn.trim() ||
            hl.detailId.trim()
        )
        .map((hl, idx) => ({
          code: hl.code.trim() || String(idx + 1).padStart(2, "0"),
          titleEn: hl.titleEn.trim() || hl.titleId.trim(),
          titleId: hl.titleId.trim() || hl.titleEn.trim(),
          detailEn: hl.detailEn.trim() || hl.detailId.trim(),
          detailId: hl.detailId.trim() || hl.detailEn.trim(),
        }));

      const payload = {
        ...editing,
        slug: slugify(editing.slug || editing.title),
        highlights: normalizedHighlights,
        summaryId: editing.summaryId.trim() || editing.summaryEn.trim(),
        roleId: editing.roleId.trim() || editing.roleEn.trim(),
        descriptionId:
          editing.descriptionId.trim() || editing.descriptionEn.trim(),
        impactMetricId:
          editing.impactMetricId.trim() || editing.impactMetricEn.trim(),
      };
      const isUpdate = Boolean(editing.id);
      const url = isUpdate
        ? `/api/admin/projects/${editing.id}`
        : "/api/admin/projects";
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save project");

      const saved: SerializedProject = json.project;
      setProjects((prev) =>
        isUpdate
          ? prev.map((item) => (item.id === saved.id ? saved : item))
          : [...prev, saved]
      );
      setEditing(null);
      notify(
        isUpdate
          ? `Updated "${saved.title}" and synced live!`
          : `Created "${saved.title}" and published!`
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const quickToggle = async (
    p: SerializedProject,
    field: "featured" | "published"
  ) => {
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !p[field] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setProjects((prev) =>
        prev.map((item) => (item.id === p.id ? json.project : item))
      );
      notify(`Updated ${field} for "${p.title}"`);
    } catch {
      notify("Failed to update toggle", "err");
    }
  };

  const handleDelete = async (p: SerializedProject) => {
    if (!window.confirm(`Delete project "${p.title}"? This cannot be undone.`))
      return;
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((item) => item.id !== p.id));
      notify(`Deleted "${p.title}"`);
    } catch {
      notify("Failed to delete project", "err");
    }
  };

  const moveOrder = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const previous = projects;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const updated = reordered.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));
    setProjects(updated);
    try {
      const changed = updated.filter(
        (item) =>
          previous.find((p) => p.id === item.id)?.sortOrder !== item.sortOrder
      );
      const responses = await Promise.all(
        changed.map((item) =>
          fetch(`/api/admin/projects/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: item.sortOrder }),
          })
        )
      );
      if (responses.some((r) => !r.ok)) {
        throw new Error("Order sync failed");
      }
      notify("Project order updated!");
    } catch {
      setProjects(previous);
      notify("Failed to reorder projects", "err");
    }
  };

  const addTech = () => {
    const clean = techInput.trim();
    if (!clean || !editing) return;
    if (!editing.techStack.includes(clean)) {
      setEditing({ ...editing, techStack: [...editing.techStack, clean] });
    }
    setTechInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Projects & Spec Sheets
          </h2>
          <p className="text-xs text-[#645882]">
            Manage portfolio works, featured flags, architecture specs, and
            order.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#5e38dc]"
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3.5">
        {projects.map((p, idx) => (
          <div
            key={p.id}
            className="pastel-glass flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center"
          >
            <img
              src={p.coverImage || "/assets/cover-platform.jpg"}
              alt={p.title}
              className="h-24 w-full shrink-0 rounded-2xl border border-white object-cover sm:h-20 sm:w-32"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f3ecff] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#7650f3]">
                  {p.category}
                </span>
                <span className="font-mono text-[10px] text-[#7a6d9c]">
                  {p.status} · {p.year}
                </span>
                {!p.published && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] text-amber-800">
                    DRAFT
                  </span>
                )}
              </div>
              <h3 className="mt-1 truncate text-base font-semibold text-[#1e172b]">
                {p.title}
              </h3>
              <p className="line-clamp-1 text-xs text-[#645882]">
                {p.summaryEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => moveOrder(idx, -1)}
                disabled={idx === 0}
                title="Move up"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] transition hover:border-[#7650f3] disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveOrder(idx, 1)}
                disabled={idx === projects.length - 1}
                title="Move down"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] transition hover:border-[#7650f3] disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => quickToggle(p, "featured")}
                title="Toggle Featured on Home"
                className={`rounded-xl border p-2 transition ${
                  p.featured
                    ? "border-amber-300 bg-amber-50 text-amber-600"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => quickToggle(p, "published")}
                title={p.published ? "Published (click to hide)" : "Draft"}
                className={`rounded-xl border p-2 transition ${
                  p.published
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                {p.published ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              <Link
                href={`/projects/${p.slug}`}
                target="_blank"
                title="View live spec"
                className="rounded-xl border border-[#dfd4f8] bg-white p-2 text-[#5f4f85] transition hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p)}
                title="Delete project"
                className="rounded-xl border border-rose-200 bg-rose-50/70 p-2 text-rose-600 transition hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal Editor */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#19132b]/65 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#dfd4f8] bg-[#faf7ff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e7dffb] bg-white px-6 py-4">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1e172b]">
                  {editing.id ? "Edit Project" : "New Project"}
                </h3>
                <p className="font-mono text-[11px] text-[#7a6d9c]">
                  Auto-syncs to Home & /projects/{editing.slug || "..."}
                </p>
              </div>
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
                  className="rounded-full border border-[#dfd4f8] bg-white p-1.5 text-[#5f4f85] hover:text-[#7650f3]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditing({
                        ...editing,
                        title,
                        slug: editing.id ? editing.slug : slugify(title),
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    onBlur={(e) =>
                      setEditing({ ...editing, slug: slugify(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 font-mono text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  >
                    <option value="BANKING">BANKING</option>
                    <option value="AI">AI</option>
                    <option value="FULLSTACK">FULLSTACK</option>
                    <option value="PERSONAL">PERSONAL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Status
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="LIVE">LIVE</option>
                    <option value="OPEN_SOURCE">OPEN_SOURCE</option>
                    <option value="PROTOTYPE">PROTOTYPE</option>
                    <option value="INTERNAL">INTERNAL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Year
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.year}
                    onChange={(e) =>
                      setEditing({ ...editing, year: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 font-mono text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              {/* Bilingual copy block */}
              <div className="space-y-3.5 rounded-2xl border border-[#e7dffb] bg-white/80 p-4">
                <p className="font-mono text-[10px] tracking-[0.18em] text-[#ee84b5] uppercase">
                  Copy ({langTab === "en" ? "ENGLISH" : "INDONESIA"})
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                      Your Role ({langTab.toUpperCase()})
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
                      className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                      Impact Metric ({langTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={
                        langTab === "en"
                          ? editing.impactMetricEn
                          : editing.impactMetricId
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          ...(langTab === "en"
                            ? { impactMetricEn: e.target.value }
                            : { impactMetricId: e.target.value }),
                        })
                      }
                      placeholder="e.g. Zero errors · 40% faster"
                      className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Short Summary ({langTab.toUpperCase()})
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
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Full Case Study / Description ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={4}
                    value={
                      langTab === "en"
                        ? editing.descriptionEn
                        : editing.descriptionId
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ...(langTab === "en"
                          ? { descriptionEn: e.target.value }
                          : { descriptionId: e.target.value }),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              {/* Cover Media Uploader */}
              <MediaUploader
                label="Cover Image (16:9)"
                value={editing.coverImage}
                onChange={(url) => setEditing({ ...editing, coverImage: url })}
                presets={[
                  { label: "Banking Twilight", url: "/assets/cover-banking.jpg" },
                  { label: "AI Rainy Desk", url: "/assets/cover-ai.jpg" },
                  { label: "Cozy Window", url: "/assets/cover-platform.jpg" },
                  { label: "Hero Key Art", url: "/assets/hero-rainy-anime.jpg" },
                ]}
              />

              {/* Tech Stack Chips */}
              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Tech Stack
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {editing.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3 py-1 font-mono text-xs text-[#3b2e5e]"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            techStack: editing.techStack.filter(
                              (t) => t !== tech
                            ),
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
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="Type technology (e.g. Next.js) and press Enter"
                    className="flex-1 rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs font-medium text-[#7650f3] hover:bg-[#f4effd]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Architecture Highlights */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] text-[#5f4f85] uppercase">
                    Architecture Highlights ({langTab.toUpperCase()})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        highlights: [
                          ...editing.highlights,
                          {
                            code: String(editing.highlights.length + 1).padStart(
                              2,
                              "0"
                            ),
                            titleEn: "",
                            titleId: "",
                            detailEn: "",
                            detailId: "",
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3 py-1 text-xs text-[#7650f3] hover:bg-[#f4effd]"
                  >
                    <Plus className="h-3 w-3" /> Add Highlight
                  </button>
                </div>

                {editing.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 rounded-2xl border border-[#e7dffb] bg-white p-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl.code}
                        onChange={(e) => {
                          const next = [...editing.highlights];
                          next[idx] = { ...hl, code: e.target.value };
                          setEditing({ ...editing, highlights: next });
                        }}
                        className="w-12 rounded-lg border border-[#dfd4f8] px-2 py-1 text-center font-mono text-xs"
                      />
                      <input
                        type="text"
                        placeholder={`Highlight Title (${langTab.toUpperCase()})`}
                        value={langTab === "en" ? hl.titleEn : hl.titleId}
                        onChange={(e) => {
                          const next = [...editing.highlights];
                          next[idx] = {
                            ...hl,
                            ...(langTab === "en"
                              ? { titleEn: e.target.value }
                              : { titleId: e.target.value }),
                          };
                          setEditing({ ...editing, highlights: next });
                        }}
                        className="flex-1 rounded-lg border border-[#dfd4f8] px-2.5 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            highlights: editing.highlights.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="text-[#8f80b4] hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder={`Technical detail (${langTab.toUpperCase()})`}
                      value={langTab === "en" ? hl.detailEn : hl.detailId}
                      onChange={(e) => {
                        const next = [...editing.highlights];
                        next[idx] = {
                          ...hl,
                          ...(langTab === "en"
                            ? { detailEn: e.target.value }
                            : { detailId: e.target.value }),
                        };
                        setEditing({ ...editing, highlights: next });
                      }}
                      className="w-full rounded-lg border border-[#dfd4f8] px-2.5 py-1.5 text-xs"
                    />
                  </div>
                ))}
              </div>

              {/* URLs & Toggles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="text"
                    value={editing.liveUrl}
                    onChange={(e) =>
                      setEditing({ ...editing, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    GitHub Repository URL (optional)
                  </label>
                  <input
                    type="text"
                    value={editing.repoUrl}
                    onChange={(e) =>
                      setEditing({ ...editing, repoUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs text-[#4a3f66]">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) =>
                      setEditing({ ...editing, featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#7650f3]"
                  />
                  Show in Featured Projects on Home
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
                  Published (visible to visitors)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#e7dffb] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#dfd4f8] px-4 py-2 text-xs text-[#5f4f85] hover:bg-[#f4effd]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2 text-xs font-medium text-white hover:bg-[#5e38dc] disabled:opacity-60"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editing.id ? "Save Project" : "Create & Publish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
