"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { SerializedExperience } from "@/lib/types";

type ExpKind = "EDUCATION" | "WORK" | "ORGANIZATION";

interface ExpDraft {
  id?: string;
  kind: ExpKind;
  organization: string;
  roleEn: string;
  roleId: string;
  location: string;
  periodEn: string;
  periodId: string;
  isCurrent: boolean;
  summaryEn: string;
  summaryId: string;
  bulletsEnText: string;
  bulletsIdText: string;
  published: boolean;
  sortOrder: number;
}

const SECTION_META: Record<
  ExpKind,
  {
    code: string;
    title: string;
    addLabel: string;
    emptyText: string;
    orgLabel: string;
    orgPlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    periodLabel: string;
    periodPlaceholder: string;
    summaryLabel: string;
    summaryPlaceholder: string;
    bulletsLabel: string;
    bulletsPlaceholder: string;
    icon: React.ReactNode;
  }
> = {
  EDUCATION: {
    code: "01 //",
    title: "Education",
    addLabel: "Add Education",
    emptyText: "No education entries yet.",
    orgLabel: "University / Institution",
    orgPlaceholder: "e.g. Telkom University",
    roleLabel: "Degree & Major",
    rolePlaceholder: "e.g. Bachelor's Degree (S1) in Informatics",
    periodLabel: "Graduation Year & GPA",
    periodPlaceholder: "e.g. 2026 | GPA: 3.68 / 4.0",
    summaryLabel: "Relevant Coursework (optional)",
    summaryPlaceholder:
      "e.g. Relevant Coursework: Machine Learning, Process Mining",
    bulletsLabel: "Extra Notes / Bullets (optional — 1 line per bullet)",
    bulletsPlaceholder: "Optional achievements or thesis highlights...",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  WORK: {
    code: "02 //",
    title: "Work Experience",
    addLabel: "Add Work",
    emptyText: "No work experience entries yet.",
    orgLabel: "Company / Organization",
    orgPlaceholder: "e.g. PT Bank Negara Indonesia (Persero) Tbk (BNI)",
    roleLabel: "Role / Position",
    rolePlaceholder: "e.g. Full-Stack Developer Intern",
    periodLabel: "Period",
    periodPlaceholder: "e.g. Jul 2023 - Jun 2024 or Present",
    summaryLabel: "Short Summary (optional)",
    summaryPlaceholder:
      "Optional 1-2 line overview (leave blank if using bullet points below)",
    bulletsLabel: "Key Responsibilities / Achievements (1 line per bullet)",
    bulletsPlaceholder:
      "Developed backend APIs using Java Spring Boot.\nManaged PostgreSQL databases and CRUD services.",
    icon: <Briefcase className="h-4 w-4" />,
  },
  ORGANIZATION: {
    code: "03 //",
    title: "Organizational Experience",
    addLabel: "Add Organization",
    emptyText: "No organizational or teaching entries yet.",
    orgLabel: "Organization / Lab / Campus",
    orgPlaceholder: "e.g. Chevalier LAB - Telkom University",
    roleLabel: "Role / Division / Course",
    rolePlaceholder: "e.g. Laboratory Assistant - Android Division Mentor",
    periodLabel: "Period",
    periodPlaceholder: "e.g. Sep 2022 - Oct 2023",
    summaryLabel: "Short Summary (optional)",
    summaryPlaceholder: "Optional overview (leave blank if using bullets below)",
    bulletsLabel: "Activities / Achievements (1 line per bullet)",
    bulletsPlaceholder:
      "Coordinated Android Division study group activities.\nCreated the syllabus and mentored participants.",
    icon: <Users className="h-4 w-4" />,
  },
};

const SECTION_ORDER: ExpKind[] = ["EDUCATION", "WORK", "ORGANIZATION"];

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[\s•\-*·]+/, "").trim())
    .filter(Boolean);
}

function createEmptyExp(kind: ExpKind, nextOrder: number): ExpDraft {
  return {
    kind,
    organization: "",
    roleEn: "",
    roleId: "",
    location: "Indonesia",
    periodEn: "",
    periodId: "",
    isCurrent: false,
    summaryEn: "",
    summaryId: "",
    bulletsEnText: "",
    bulletsIdText: "",
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
  const [saving, setSaving] = useState(false);

  const byKind = useMemo(() => {
    const grouped: Record<ExpKind, SerializedExperience[]> = {
      EDUCATION: [],
      WORK: [],
      ORGANIZATION: [],
    };
    for (const exp of experiences) {
      const k: ExpKind =
        exp.kind === "EDUCATION" || exp.kind === "ORGANIZATION"
          ? exp.kind
          : "WORK";
      grouped[k].push(exp);
    }
    return grouped;
  }, [experiences]);

  // Existing org names for quick-pick grouping on Organization entries
  const existingOrgNames = useMemo(() => {
    const set = new Set<string>();
    for (const exp of byKind.ORGANIZATION) {
      if (exp.organization.trim()) set.add(exp.organization.trim());
    }
    return Array.from(set);
  }, [byKind.ORGANIZATION]);

  const openAdd = (kind: ExpKind) => {
    setLangTab("en");
    const maxOrder = experiences.reduce((m, e) => Math.max(m, e.sortOrder), 0);
    setEditing(createEmptyExp(kind, maxOrder + 1));
  };

  const openEdit = (e: SerializedExperience) => {
    setLangTab("en");
    const kind: ExpKind =
      e.kind === "EDUCATION" || e.kind === "ORGANIZATION" ? e.kind : "WORK";
    setEditing({
      id: e.id,
      kind,
      organization: e.organization,
      roleEn: e.roleEn,
      roleId: e.roleId,
      location: e.location,
      periodEn: e.periodEn,
      periodId: e.periodId,
      isCurrent: e.isCurrent,
      summaryEn: e.summaryEn,
      summaryId: e.summaryId,
      bulletsEnText: e.bullets.en.join("\n"),
      bulletsIdText: e.bullets.id.join("\n"),
      published: e.published,
      sortOrder: e.sortOrder,
    });
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    if (
      !editing.organization.trim() ||
      !editing.roleEn.trim() ||
      !editing.periodEn.trim()
    ) {
      setLangTab("en");
      notify(
        "Please fill in Organization, Role/Degree (EN), and Period (EN).",
        "err"
      );
      return;
    }

    setSaving(true);
    try {
      const bulletsEn = parseLines(editing.bulletsEnText);
      const bulletsId = parseLines(editing.bulletsIdText);
      const payload = {
        kind: editing.kind,
        organization: editing.organization.trim(),
        roleEn: editing.roleEn.trim(),
        roleId: editing.roleId.trim() || editing.roleEn.trim(),
        location: editing.location.trim() || "Indonesia",
        periodEn: editing.periodEn.trim(),
        periodId: editing.periodId.trim() || editing.periodEn.trim(),
        isCurrent:
          editing.periodEn.toLowerCase().includes("present") ||
          editing.isCurrent,
        summaryEn: editing.summaryEn.trim(),
        summaryId: editing.summaryId.trim() || editing.summaryEn.trim(),
        bullets: {
          en: bulletsEn,
          id: bulletsId.length > 0 ? bulletsId : bulletsEn,
        },
        tags: [],
        published: editing.published,
        sortOrder: editing.sortOrder,
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
      if (!res.ok) throw new Error(json.error || "Failed to save entry");
      const saved: SerializedExperience = json.experience;
      setExperiences((prev) =>
        isUpdate
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved]
      );
      setEditing(null);
      notify(
        isUpdate
          ? "Portfolio entry updated live!"
          : `${SECTION_META[editing.kind].title} entry added!`
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
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
      notify(
        json.experience.published
          ? "Shown on /portfolio"
          : "Hidden from /portfolio"
      );
    } catch {
      notify("Failed to update visibility", "err");
    }
  };

  const handleDelete = async (e: SerializedExperience) => {
    if (!window.confirm(`Delete "${e.roleEn}" at "${e.organization}"?`)) return;
    try {
      const res = await fetch(`/api/admin/experiences/${e.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setExperiences((prev) => prev.filter((x) => x.id !== e.id));
      notify("Entry deleted");
    } catch {
      notify("Delete failed", "err");
    }
  };

  const moveWithinSection = async (
    kind: ExpKind,
    sectionIndex: number,
    dir: -1 | 1
  ) => {
    const group = byKind[kind];
    const target = sectionIndex + dir;
    if (target < 0 || target >= group.length) return;

    const itemA = group[sectionIndex];
    const itemB = group[target];
    const idxA = experiences.findIndex((x) => x.id === itemA.id);
    const idxB = experiences.findIndex((x) => x.id === itemB.id);
    if (idxA < 0 || idxB < 0) return;

    const previous = experiences;
    const next = [...experiences];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    const reindexed = next.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setExperiences(reindexed);

    try {
      const changed = reindexed.filter(
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
      notify("Order updated");
    } catch {
      setExperiences(previous);
      notify("Failed to reorder", "err");
    }
  };

  const activeMeta = editing ? SECTION_META[editing.kind] : null;

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#745bc7]/20 pb-4">
        <div>
          <h2 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
            Portfolio (CV)
          </h2>
          <p className="mt-0.5 text-xs text-[#5d5370]">
            Add, edit, or reorder Education, Work Experience, and Organizational
            Experience shown on /portfolio.
          </p>
        </div>
        <Link
          href="/portfolio"
          target="_blank"
          className="vn-btn-action px-3.5 py-2 text-[10px]"
        >
          <span>Preview /portfolio</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* 3 Clear Sections Matching /portfolio 1-to-1 */}
      <div className="space-y-8">
        {SECTION_ORDER.map((kind) => {
          const meta = SECTION_META[kind];
          const items = byKind[kind];

          return (
            <section key={kind} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#745bc7]/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#745bc7]">{meta.icon}</span>
                  <span className="font-mono text-[10.5px] font-semibold tracking-[0.18em] text-[#745bc7] uppercase">
                    {meta.code}
                  </span>
                  <h3 className="text-sm font-bold tracking-[0.04em] text-[#14100e] uppercase">
                    {meta.title}
                  </h3>
                  <span className="bg-[#efe9fd] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#745bc7]">
                    {items.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openAdd(kind)}
                  className="vn-btn-band px-3.5 py-1.5 text-[10px]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{meta.addLabel}</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="border border-dashed border-[#745bc7]/35 bg-[#faf7ff] px-4 py-6 text-center text-xs text-[#5d5370]">
                  {meta.emptyText}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className={`flex flex-col gap-3 border border-[#745bc7]/30 bg-[#fdfbff] p-4 transition hover:border-[#745bc7] sm:flex-row sm:items-center ${
                        exp.published ? "" : "opacity-60"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <h4 className="text-sm font-bold text-[#14100e]">
                            {kind === "ORGANIZATION"
                              ? exp.organization
                              : exp.roleEn}
                          </h4>
                          <span className="font-mono text-[11px] text-[#745bc7]">
                            ({exp.periodEn})
                          </span>
                          {!exp.published && (
                            <span className="bg-amber-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-amber-800 uppercase">
                              HIDDEN
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-[#5d5370]">
                          {kind === "ORGANIZATION"
                            ? exp.roleEn
                            : exp.organization}
                        </p>
                        {(exp.summaryEn || exp.bullets.en.length > 0) && (
                          <p className="mt-1 truncate text-[11.5px] text-[#6d6285]">
                            {exp.summaryEn
                              ? exp.summaryEn
                              : `${exp.bullets.en.length} bullet point${exp.bullets.en.length === 1 ? "" : "s"} · ${exp.bullets.en[0]}`}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveWithinSection(kind, idx, -1)}
                          disabled={idx === 0}
                          title="Move up"
                          className="border border-[#745bc7]/35 bg-white p-1.5 text-[#5d5370] transition hover:border-[#745bc7] hover:text-[#745bc7] disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveWithinSection(kind, idx, 1)}
                          disabled={idx === items.length - 1}
                          title="Move down"
                          className="border border-[#745bc7]/35 bg-white p-1.5 text-[#5d5370] transition hover:border-[#745bc7] hover:text-[#745bc7] disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePublished(exp)}
                          title={
                            exp.published
                              ? "Visible on /portfolio"
                              : "Hidden from /portfolio"
                          }
                          className={`border p-1.5 transition ${
                            exp.published
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-[#745bc7]/35 bg-white text-[#8c7eb0]"
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
                          className="inline-flex items-center gap-1 border border-[#745bc7]/45 bg-white px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-[#14100e] uppercase transition hover:bg-[#745bc7] hover:text-white"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(exp)}
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
            </section>
          );
        })}
      </div>

      {/* Tailored Add / Edit Modal */}
      {editing && activeMeta && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#19132b]/65 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="vn-frame flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden"
          >
            {/* Modal Band Header */}
            <div className="vn-band-strip flex items-center justify-between gap-2 px-5 py-3 text-white">
              <div className="flex items-center gap-2">
                {activeMeta.icon}
                <h3 className="font-mono text-xs font-semibold tracking-[0.16em] uppercase drop-shadow-2xs">
                  {editing.id
                    ? `Edit ${activeMeta.title}`
                    : activeMeta.addLabel}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex border border-white/55 bg-white/15 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setLangTab("en")}
                    className={`px-2.5 py-1 font-semibold uppercase transition ${
                      langTab === "en"
                        ? "bg-white text-[#745bc7]"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangTab("id")}
                    className={`border-l border-white/40 px-2.5 py-1 font-semibold uppercase transition ${
                      langTab === "id"
                        ? "bg-white text-[#745bc7]"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    ID
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="border border-white/55 bg-white/15 p-1 text-white transition hover:bg-white/30"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#fdfbff] p-5 sm:p-6">
              {/* Section Switcher (in case user wants to move an entry between sections) */}
              <div className="grid grid-cols-3 border border-[#745bc7]/40 bg-white font-mono text-[10.5px]">
                {SECTION_ORDER.map((k, idx) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setEditing({ ...editing, kind: k })}
                    className={`py-2 font-semibold uppercase transition ${
                      idx > 0 ? "border-l border-[#745bc7]/30" : ""
                    } ${
                      editing.kind === k
                        ? "bg-[#745bc7] text-white"
                        : "text-[#5d5370] hover:bg-[#f4effd]"
                    }`}
                  >
                    {k === "ORGANIZATION" ? "Organization" : k}
                  </button>
                ))}
              </div>

              {/* Organization / University */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  {activeMeta.orgLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeMeta.orgPlaceholder}
                  value={editing.organization}
                  onChange={(e) =>
                    setEditing({ ...editing, organization: e.target.value })
                  }
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
                {editing.kind === "ORGANIZATION" &&
                  existingOrgNames.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[9.5px] text-[#6d6285] uppercase">
                        Group under:
                      </span>
                      {existingOrgNames.map((orgName) => (
                        <button
                          key={orgName}
                          type="button"
                          onClick={() =>
                            setEditing({ ...editing, organization: orgName })
                          }
                          className={`border px-2 py-0.5 text-[11px] transition ${
                            editing.organization === orgName
                              ? "border-[#745bc7] bg-[#745bc7] text-white"
                              : "border-[#745bc7]/35 bg-white text-[#5d5370] hover:border-[#745bc7]"
                          }`}
                        >
                          {orgName}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Role / Degree + Period */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    {activeMeta.roleLabel} ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required={langTab === "en"}
                    placeholder={activeMeta.rolePlaceholder}
                    value={langTab === "en" ? editing.roleEn : editing.roleId}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ...(langTab === "en"
                          ? { roleEn: e.target.value }
                          : { roleId: e.target.value }),
                      })
                    }
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    {activeMeta.periodLabel} ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required={langTab === "en"}
                    placeholder={activeMeta.periodPlaceholder}
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
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                  />
                </div>
              </div>

              {/* Summary / Coursework */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  {activeMeta.summaryLabel} ({langTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  placeholder={activeMeta.summaryPlaceholder}
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
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
              </div>

              {/* Easy Multiline Bullets (Paste or type 1 line per bullet!) */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    {activeMeta.bulletsLabel} ({langTab.toUpperCase()})
                  </label>
                  <span className="font-mono text-[10px] text-[#745bc7]">
                    {
                      parseLines(
                        langTab === "en"
                          ? editing.bulletsEnText
                          : editing.bulletsIdText
                      ).length
                    }{" "}
                    bullets
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder={activeMeta.bulletsPlaceholder}
                  value={
                    langTab === "en"
                      ? editing.bulletsEnText
                      : editing.bulletsIdText
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      ...(langTab === "en"
                        ? { bulletsEnText: e.target.value }
                        : { bulletsIdText: e.target.value }),
                    })
                  }
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-[#745bc7]"
                />
                {langTab === "id" && (
                  <p className="mt-1 text-[11px] text-[#6d6285]">
                    Indonesian fields are optional — leaving them empty
                    automatically falls back to English.
                  </p>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[#3b3150]">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#745bc7]"
                />
                Show on public /portfolio page
              </label>
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
                <span>Save Entry</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
