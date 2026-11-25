"use client";

import React, { useState } from "react";
import { Loader2, Save } from "lucide-react";
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
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.fullName.trim() ||
      !form.bioEn.trim() ||
      !form.aboutStoryEn.trim() ||
      !form.currentRoleEn.trim()
    ) {
      setLangTab("en");
      notify("Please fill in required English (EN) fields.", "err");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        headlineEn: form.headlineEn.trim() || form.bioEn.trim().slice(0, 200),
        headlineId:
          form.headlineId.trim() ||
          (form.bioId.trim() || form.bioEn.trim()).slice(0, 200),
        bioId: form.bioId.trim() || form.bioEn.trim(),
        aboutStoryId: form.aboutStoryId.trim() || form.aboutStoryEn.trim(),
        currentRoleId: form.currentRoleId.trim() || form.currentRoleEn.trim(),
      };

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save profile");
      onSaved(json.profile);
      notify("Profile & artwork saved live!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#745bc7]/20 pb-4">
        <div>
          <h2 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
            Profile &amp; Artwork
          </h2>
          <p className="mt-0.5 text-xs text-[#5d5370]">
            Manage Hero art, About photo, Portfolio bio, and social links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex border border-[#745bc7]/55 bg-white font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setLangTab("en")}
              className={`px-3 py-1.5 font-semibold uppercase transition ${
                langTab === "en"
                  ? "bg-[#745bc7] text-white"
                  : "text-[#5d5370] hover:bg-[#f4effd]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLangTab("id")}
              className={`border-l border-[#745bc7]/40 px-3 py-1.5 font-semibold uppercase transition ${
                langTab === "id"
                  ? "bg-[#745bc7] text-white"
                  : "text-[#5d5370] hover:bg-[#f4effd]"
              }`}
            >
              ID
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="vn-btn-band px-4 py-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 1. Core Identity & Copy */}
      <section className="space-y-4">
        <p className="font-mono text-[10.5px] font-semibold tracking-[0.2em] text-[#745bc7] uppercase">
          {"01 //"} Identity &amp; Copy ({langTab.toUpperCase()})
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>

          <div className="grid grid-cols-[1fr_76px] gap-2">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                Brand
              </label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) =>
                  setForm({ ...form, brandName: e.target.value })
                }
                className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                Kanji
              </label>
              <input
                type="text"
                value={form.brandKanji}
                onChange={(e) =>
                  setForm({ ...form, brandKanji: e.target.value })
                }
                className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-center text-sm outline-none focus:border-[#745bc7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
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
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              Organization
            </label>
            <input
              type="text"
              required
              value={form.currentOrg}
              onChange={(e) => setForm({ ...form, currentOrg: e.target.value })}
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              Location
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              Portfolio Bio — shown on /portfolio ({langTab.toUpperCase()})
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
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
              About Text — shown on /about ({langTab.toUpperCase()})
            </label>
            <textarea
              rows={4}
              value={langTab === "en" ? form.aboutStoryEn : form.aboutStoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  ...(langTab === "en"
                    ? { aboutStoryEn: e.target.value }
                    : { aboutStoryId: e.target.value }),
                })
              }
              className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
            />
          </div>
        </div>
      </section>

      {/* 2. Social & Contact Links */}
      <section className="space-y-4 border-t border-[#745bc7]/20 pt-6">
        <p className="font-mono text-[10.5px] font-semibold tracking-[0.2em] text-[#745bc7] uppercase">
          {"02 //"} Social &amp; Contact Links
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["email", "Email Address", "farhansatria.07@gmail.com"],
              ["instagramUrl", "Instagram URL", "https://www.instagram.com/..."],
              ["youtubeUrl", "YouTube URL", "https://www.youtube.com/@..."],
              ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/in/..."],
              ["githubUrl", "GitHub URL", "https://github.com/..."],
              ["resumeUrl", "Resume / CV URL (optional)", "https://..."],
            ] as const
          ).map(([field, lbl, placeholder]) => (
            <div key={field}>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                {lbl}
              </label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                placeholder={placeholder}
                className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-[#745bc7]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Artwork & Photos */}
      <section className="space-y-4 border-t border-[#745bc7]/20 pt-6">
        <p className="font-mono text-[10.5px] font-semibold tracking-[0.2em] text-[#745bc7] uppercase">
          {"03 //"} Hero Artwork &amp; About Photo
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <MediaUploader
            label="Desktop Hero (16:9)"
            value={form.heroImage}
            onChange={(heroImage) => setForm({ ...form, heroImage })}
            aspectClass="aspect-[16/10]"
            allowClear
          />
          <MediaUploader
            label="Mobile Hero (Portrait)"
            value={form.heroImageMobile}
            onChange={(heroImageMobile) =>
              setForm({ ...form, heroImageMobile })
            }
            aspectClass="aspect-[4/5]"
            allowClear
          />
          <MediaUploader
            label="About Square Photo (1:1)"
            value={form.avatarImage}
            onChange={(avatarImage) => setForm({ ...form, avatarImage })}
            aspectClass="aspect-square"
            allowClear
          />
        </div>
      </section>
    </form>
  );
}
