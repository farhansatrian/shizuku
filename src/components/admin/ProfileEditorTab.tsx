"use client";

import React, { useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { SerializedProfile } from "@/lib/types";

export function ProfileEditorTab({
  profile,
  onSaved,
  notify,
}: {
  profile: SerializedProfile;
  onSaved: (next: SerializedProfile) => void;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [form, setForm] = useState<SerializedProfile>(profile);
  const [langTab, setLangTab] = useState<"en" | "id">("en");
  const [roleDraftEn, setRoleDraftEn] = useState("");
  const [roleDraftId, setRoleDraftId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save profile");
      onSaved(json.profile);
      notify("Profile & Hero settings saved and synced live!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const addRole = (lang: "en" | "id") => {
    const val = (lang === "en" ? roleDraftEn : roleDraftId).trim();
    if (!val) return;
    setForm((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [lang]: [...prev.roles[lang], val],
      },
    }));
    if (lang === "en") setRoleDraftEn("");
    else setRoleDraftId("");
  };

  const removeRole = (lang: "en" | "id", idx: number) => {
    setForm((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [lang]: prev.roles[lang].filter((_, i) => i !== idx),
      },
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header & Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Profile, Hero & Brand Identity
          </h2>
          <p className="text-xs text-[#645882]">
            Edit both English (default) and Indonesian versions seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[#dfd4f8] bg-white p-0.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setLangTab("en")}
              className={`rounded-full px-3.5 py-1 transition ${
                langTab === "en"
                  ? "bg-[#7650f3] text-white"
                  : "text-[#5f5084] hover:text-[#7650f3]"
              }`}
            >
              English (Default)
            </button>
            <button
              type="button"
              onClick={() => setLangTab("id")}
              className={`rounded-full px-3.5 py-1 transition ${
                langTab === "id"
                  ? "bg-[#7650f3] text-white"
                  : "text-[#5f5084] hover:text-[#7650f3]"
              }`}
            >
              Indonesia
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#7650f3] px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#5e38dc] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Identity & Artwork */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="pastel-glass space-y-4 rounded-3xl p-6 lg:col-span-7">
          <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
            Core Identity
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>
            <div className="grid grid-cols-[1fr_76px] gap-2">
              <div>
                <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={form.brandName}
                  onChange={(e) =>
                    setForm({ ...form, brandName: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                  Kanji
                </label>
                <input
                  type="text"
                  value={form.brandKanji}
                  onChange={(e) =>
                    setForm({ ...form, brandKanji: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-center text-sm outline-none focus:border-[#7650f3]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Current Organization
              </label>
              <input
                type="text"
                required
                value={form.currentOrg}
                onChange={(e) =>
                  setForm({ ...form, currentOrg: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Location
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>
          </div>

          {/* Bilingual Fields based on active tab */}
          <div className="space-y-4 rounded-2xl border border-[#e7dffb] bg-[#faf7ff] p-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#ee84b5] uppercase">
              Editing Copy ({langTab === "en" ? "ENGLISH" : "INDONESIA"})
            </p>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Current Role ({langTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={langTab === "en" ? form.currentRoleEn : form.currentRoleId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { currentRoleEn: e.target.value }
                      : { currentRoleId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Hero Headline ({langTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={langTab === "en" ? form.headlineEn : form.headlineId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { headlineEn: e.target.value }
                      : { headlineId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Availability Badge ({langTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={
                  langTab === "en" ? form.availabilityEn : form.availabilityId
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { availabilityEn: e.target.value }
                      : { availabilityId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Hero Cycling Roles ({langTab.toUpperCase()})
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {form.roles[langTab].map((r, i) => (
                  <span
                    key={`${r}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white px-3 py-1 font-mono text-xs text-[#3b2e5e]"
                  >
                    {r}
                    <button
                      type="button"
                      onClick={() => removeRole(langTab, i)}
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
                  value={langTab === "en" ? roleDraftEn : roleDraftId}
                  onChange={(e) =>
                    langTab === "en"
                      ? setRoleDraftEn(e.target.value)
                      : setRoleDraftId(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRole(langTab);
                    }
                  }}
                  placeholder="Add a cycling role..."
                  className="flex-1 rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-1.5 text-xs outline-none focus:border-[#7650f3]"
                />
                <button
                  type="button"
                  onClick={() => addRole(langTab)}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-1.5 text-xs font-medium text-[#7650f3] hover:bg-[#f4effd]"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Short Bio — OS Window ({langTab.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={langTab === "en" ? form.bioEn : form.bioId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { bioEn: e.target.value }
                      : { bioId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Currently / Rainy Desk Log ({langTab.toUpperCase()})
              </label>
              <textarea
                rows={2}
                value={langTab === "en" ? form.currentlyEn : form.currentlyId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { currentlyEn: e.target.value }
                      : { currentlyId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#5f4f85] uppercase">
                Full About Story ({langTab.toUpperCase()})
              </label>
              <textarea
                rows={5}
                value={langTab === "en" ? form.aboutStoryEn : form.aboutStoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ...(langTab === "en"
                      ? { aboutStoryEn: e.target.value }
                      : { aboutStoryId: e.target.value }),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
              />
            </div>
          </div>
        </div>

        {/* Right 5 cols: Media & Socials */}
        <div className="space-y-6 lg:col-span-5">
          <div className="pastel-glass space-y-5 rounded-3xl p-6">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              Artwork & Avatar
            </p>
            <MediaUploader
              label="Hero Key Visual (16:9)"
              value={form.heroImage}
              onChange={(url) => setForm({ ...form, heroImage: url })}
              presets={[
                { label: "Rainy Anime Hero", url: "/assets/hero-rainy-anime.jpg" },
                { label: "Twilight Skyline", url: "/assets/cover-banking.jpg" },
              ]}
            />
            <MediaUploader
              label="Profile Avatar (1:1)"
              value={form.avatarImage}
              onChange={(url) => setForm({ ...form, avatarImage: url })}
              aspectClass="aspect-square max-w-[180px]"
              presets={[
                { label: "Rainy Anime Avatar", url: "/assets/avatar-rainy.jpg" },
              ]}
            />
          </div>

          <div className="pastel-glass space-y-3.5 rounded-3xl p-6">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              Links & Contact
            </p>
            {(
              [
                ["email", "Email Address", "farhansatria.07@gmail.com"],
                ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/in/..."],
                ["githubUrl", "GitHub URL", "https://github.com/..."],
                ["instagramUrl", "Instagram URL (optional)", "https://instagram.com/..."],
                ["resumeUrl", "Resume / CV URL (optional)", "https://..."],
              ] as const
            ).map(([field, lbl, placeholder]) => (
              <div key={field}>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  {lbl}
                </label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  placeholder={placeholder}
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats & Engineering Pillars */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="pastel-glass space-y-4 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              OS Window Stats (KPIs)
            </p>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  stats: [
                    ...form.stats,
                    { value: "New", labelEn: "Label EN", labelId: "Label ID" },
                  ],
                })
              }
              className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3 py-1 text-xs text-[#7650f3] hover:bg-[#f4effd]"
            >
              <Plus className="h-3 w-3" /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {form.stats.map((st, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[90px_1fr_1fr_auto] items-center gap-2 rounded-2xl border border-[#e7dffb] bg-white/80 p-3"
              >
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[idx] = { ...st, value: e.target.value };
                    setForm({ ...form, stats: next });
                  }}
                  placeholder="Value"
                  className="rounded-lg border border-[#dfd4f8] px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[#7650f3]"
                />
                <input
                  type="text"
                  value={st.labelEn}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[idx] = { ...st, labelEn: e.target.value };
                    setForm({ ...form, stats: next });
                  }}
                  placeholder="Label EN"
                  className="rounded-lg border border-[#dfd4f8] px-2.5 py-1.5 text-xs outline-none focus:border-[#7650f3]"
                />
                <input
                  type="text"
                  value={st.labelId}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[idx] = { ...st, labelId: e.target.value };
                    setForm({ ...form, stats: next });
                  }}
                  placeholder="Label ID"
                  className="rounded-lg border border-[#dfd4f8] px-2.5 py-1.5 text-xs outline-none focus:border-[#7650f3]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      stats: form.stats.filter((_, i) => i !== idx),
                    })
                  }
                  className="p-1 text-[#8f80b4] hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pastel-glass space-y-4 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
              Bento Core Pillars ({langTab.toUpperCase()})
            </p>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  pillars: [
                    ...form.pillars,
                    {
                      code: String(form.pillars.length + 1).padStart(2, "0"),
                      titleEn: "New Pillar",
                      titleId: "Pilar Baru",
                      descEn: "Description in English",
                      descId: "Deskripsi dalam Bahasa Indonesia",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 rounded-full border border-[#dfd4f8] bg-white px-3 py-1 text-xs text-[#7650f3] hover:bg-[#f4effd]"
            >
              <Plus className="h-3 w-3" /> Add Pillar
            </button>
          </div>

          <div className="space-y-3">
            {form.pillars.map((pl, idx) => (
              <div
                key={idx}
                className="space-y-2 rounded-2xl border border-[#e7dffb] bg-white/80 p-3.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pl.code}
                    onChange={(e) => {
                      const next = [...form.pillars];
                      next[idx] = { ...pl, code: e.target.value };
                      setForm({ ...form, pillars: next });
                    }}
                    className="w-14 rounded-lg border border-[#dfd4f8] px-2 py-1 font-mono text-xs text-center outline-none focus:border-[#7650f3]"
                  />
                  <input
                    type="text"
                    value={langTab === "en" ? pl.titleEn : pl.titleId}
                    onChange={(e) => {
                      const next = [...form.pillars];
                      next[idx] = {
                        ...pl,
                        ...(langTab === "en"
                          ? { titleEn: e.target.value }
                          : { titleId: e.target.value }),
                      };
                      setForm({ ...form, pillars: next });
                    }}
                    className="flex-1 rounded-lg border border-[#dfd4f8] px-2.5 py-1 text-xs font-medium outline-none focus:border-[#7650f3]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        pillars: form.pillars.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-1 text-[#8f80b4] hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={langTab === "en" ? pl.descEn : pl.descId}
                  onChange={(e) => {
                    const next = [...form.pillars];
                    next[idx] = {
                      ...pl,
                      ...(langTab === "en"
                        ? { descEn: e.target.value }
                        : { descId: e.target.value }),
                    };
                    setForm({ ...form, pillars: next });
                  }}
                  className="w-full rounded-lg border border-[#dfd4f8] px-2.5 py-1.5 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
