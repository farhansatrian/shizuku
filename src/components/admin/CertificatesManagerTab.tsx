"use client";

import React, { useState } from "react";
import {
  Award,
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
import type { SerializedCertificate } from "@/lib/types";

interface CertDraft {
  id?: string;
  titleEn: string;
  titleId: string;
  issuer: string;
  category: string;
  issuedDate: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

function createEmptyCert(nextOrder: number): CertDraft {
  return {
    titleEn: "",
    titleId: "",
    issuer: "",
    category: "SOFTWARE ENG",
    issuedDate: String(new Date().getFullYear()),
    credentialId: "",
    credentialUrl: "",
    imageUrl: "",
    featured: true,
    published: true,
    sortOrder: nextOrder,
  };
}

export function CertificatesManagerTab({
  certificates,
  setCertificates,
  notify,
}: {
  certificates: SerializedCertificate[];
  setCertificates: React.Dispatch<
    React.SetStateAction<SerializedCertificate[]>
  >;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [editing, setEditing] = useState<CertDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (c: SerializedCertificate) => {
    setEditing({
      id: c.id,
      titleEn: c.titleEn,
      titleId: c.titleId,
      issuer: c.issuer,
      category: c.category,
      issuedDate: c.issuedDate,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      imageUrl: c.imageUrl,
      featured: c.featured,
      published: c.published,
      sortOrder: c.sortOrder,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        titleId: editing.titleId || editing.titleEn,
      };
      const isUpdate = Boolean(editing.id);
      const res = await fetch(
        isUpdate
          ? `/api/admin/certificates/${editing.id}`
          : "/api/admin/certificates",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      const saved: SerializedCertificate = json.certificate;
      setCertificates((prev) =>
        isUpdate
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved]
      );
      setEditing(null);
      notify(isUpdate ? "Certificate updated live!" : "Certificate added!");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const quickToggle = async (
    c: SerializedCertificate,
    field: "featured" | "published"
  ) => {
    const res = await fetch(`/api/admin/certificates/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !c[field] }),
    });
    if (res.ok) {
      const json = await res.json();
      setCertificates((prev) =>
        prev.map((x) => (x.id === c.id ? json.certificate : x))
      );
      notify("Certificate updated");
    }
  };

  const handleDelete = async (c: SerializedCertificate) => {
    if (!window.confirm(`Delete certificate "${c.titleEn}"?`)) return;
    const res = await fetch(`/api/admin/certificates/${c.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCertificates((prev) => prev.filter((x) => x.id !== c.id));
      notify("Certificate deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1e172b]">
            Certificates & Credentials Vault
          </h2>
          <p className="text-xs text-[#645882]">
            Upload certificate images, verification URLs, and highlight key
            credentials on Home.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyCert(certificates.length + 1))}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#5e38dc]"
        >
          <Plus className="h-4 w-4" />
          Add Certificate
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="pastel-glass flex flex-col justify-between gap-4 rounded-3xl p-5"
          >
            <div className="flex items-start gap-3.5">
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.titleEn}
                  className="h-16 w-24 shrink-0 rounded-xl border border-white object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3ecff] text-[#7650f3]">
                  <Award className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] text-[#7650f3] uppercase">
                  {cert.category} · {cert.issuedDate}
                </span>
                <h3 className="mt-0.5 text-sm font-semibold text-[#1e172b]">
                  {cert.titleEn}
                </h3>
                <p className="text-xs text-[#645882]">{cert.issuer}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 border-t border-[#ece5fc] pt-3">
              <button
                type="button"
                onClick={() => quickToggle(cert, "featured")}
                title="Featured on Home"
                className={`rounded-xl border p-2 ${
                  cert.featured
                    ? "border-amber-300 bg-amber-50 text-amber-600"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => quickToggle(cert, "published")}
                title="Published"
                className={`rounded-xl border p-2 ${
                  cert.published
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#dfd4f8] bg-white text-[#8c7eb0]"
                }`}
              >
                {cert.published ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => openEdit(cert)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cert)}
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
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-[#dfd4f8] bg-[#faf7ff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e7dffb] bg-white px-6 py-4">
              <h3 className="font-editorial text-xl font-semibold text-[#1e172b]">
                {editing.id ? "Edit Certificate" : "Add Certificate"}
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
              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Certificate Title (EN)
                </label>
                <input
                  type="text"
                  required
                  value={editing.titleEn}
                  onChange={(e) =>
                    setEditing({ ...editing, titleEn: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Certificate Title (ID — optional)
                </label>
                <input
                  type="text"
                  value={editing.titleId}
                  onChange={(e) =>
                    setEditing({ ...editing, titleId: e.target.value })
                  }
                  placeholder="Defaults to English title if empty"
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-sm outline-none focus:border-[#7650f3]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.issuer}
                    onChange={(e) =>
                      setEditing({ ...editing, issuer: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3 py-2 text-xs"
                  >
                    <option value="BANKING & LEADERSHIP">
                      BANKING & LEADERSHIP
                    </option>
                    <option value="SOFTWARE ENG">SOFTWARE ENG</option>
                    <option value="AI & DATA">AI & DATA</option>
                    <option value="CLOUD & DEVOPS">CLOUD & DEVOPS</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Issued Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 2025"
                    value={editing.issuedDate}
                    onChange={(e) =>
                      setEditing({ ...editing, issuedDate: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 font-mono text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                    Credential ID (optional)
                  </label>
                  <input
                    type="text"
                    value={editing.credentialId}
                    onChange={(e) =>
                      setEditing({ ...editing, credentialId: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 font-mono text-xs outline-none focus:border-[#7650f3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#5f4f85] uppercase">
                  Verification URL (optional)
                </label>
                <input
                  type="text"
                  value={editing.credentialUrl}
                  onChange={(e) =>
                    setEditing({ ...editing, credentialUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#7650f3]"
                />
              </div>

              <MediaUploader
                label="Certificate Image (optional — uploaded persistently)"
                value={editing.imageUrl}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
              />

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
                  Featured on Home
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
                Save Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
