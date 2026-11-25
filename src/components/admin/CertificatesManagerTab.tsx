"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
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

  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

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
        titleEn: editing.titleEn.trim(),
        titleId: editing.titleId.trim() || editing.titleEn.trim(),
        issuer: editing.issuer.trim(),
        issuedDate: editing.issuedDate.trim(),
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

  const togglePublished = async (c: SerializedCertificate) => {
    try {
      const res = await fetch(`/api/admin/certificates/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !c.published }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setCertificates((prev) =>
        prev.map((x) => (x.id === c.id ? json.certificate : x))
      );
      notify(
        json.certificate.published
          ? "Shown on /portfolio"
          : "Hidden from /portfolio"
      );
    } catch {
      notify("Failed to update visibility", "err");
    }
  };

  const handleDelete = async (c: SerializedCertificate) => {
    if (!window.confirm(`Delete certificate "${c.titleEn}"?`)) return;
    try {
      const res = await fetch(`/api/admin/certificates/${c.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCertificates((prev) => prev.filter((x) => x.id !== c.id));
      notify("Certificate deleted");
    } catch {
      notify("Failed to delete certificate", "err");
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= certificates.length) return;
    const previous = certificates;
    const list = [...certificates];
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    const updated = list.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setCertificates(updated);
    try {
      const changed = updated.filter(
        (item) =>
          previous.find((p) => p.id === item.id)?.sortOrder !== item.sortOrder
      );
      const responses = await Promise.all(
        changed.map((item) =>
          fetch(`/api/admin/certificates/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: item.sortOrder }),
          })
        )
      );
      if (responses.some((r) => !r.ok)) throw new Error();
      notify("Order updated");
    } catch {
      setCertificates(previous);
      notify("Failed to reorder", "err");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#745bc7]/20 pb-4">
        <div>
          <h2 className="font-editorial text-2xl font-bold tracking-[0.12em] text-[#14100e] uppercase">
            Certificates
          </h2>
          <p className="mt-0.5 text-xs text-[#5d5370]">
            Automatically appears at the bottom of /portfolio once you add a
            certificate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyCert(certificates.length + 1))}
          className="vn-btn-band px-4 py-2 text-[10px]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="border border-dashed border-[#745bc7]/35 bg-[#faf7ff] px-5 py-10 text-center">
          <Award className="mx-auto h-7 w-7 text-[#745bc7]/60" />
          <p className="mt-2.5 text-xs font-medium text-[#14100e]">
            No certificates yet
          </p>
          <p className="mt-1 text-xs text-[#5d5370]">
            The Certificates section stays hidden on /portfolio until you add
            your first credential here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id}
              className={`flex flex-col gap-3 border border-[#745bc7]/30 bg-[#fdfbff] p-4 transition hover:border-[#745bc7] sm:flex-row sm:items-center ${
                cert.published ? "" : "opacity-60"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.titleEn}
                    className="h-12 w-16 shrink-0 border border-[#745bc7]/30 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#745bc7]/30 bg-[#efe9fd] text-[#745bc7]">
                    <Award className="h-4 w-4" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-bold text-[#14100e]">
                      {cert.titleEn}
                    </h3>
                    <span className="font-mono text-[11px] text-[#745bc7]">
                      ({cert.issuedDate})
                    </span>
                  </div>
                  <p className="text-xs text-[#5d5370]">
                    {cert.issuer} · {cert.category}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-nowrap items-center gap-1 sm:gap-1.5">
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
                  disabled={idx === certificates.length - 1}
                  title="Move down"
                  className="border border-[#745bc7]/35 bg-white p-1.5 text-[#5d5370] transition hover:border-[#745bc7] hover:text-[#745bc7] disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePublished(cert)}
                  title={
                    cert.published
                      ? "Visible on /portfolio"
                      : "Hidden from /portfolio"
                  }
                  className={`border p-1.5 transition ${
                    cert.published
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-[#745bc7]/35 bg-white text-[#8c7eb0]"
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
                  className="inline-flex items-center gap-1 border border-[#745bc7]/45 bg-white px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-[#14100e] uppercase transition hover:bg-[#745bc7] hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert)}
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

      {/* Clean Sharp Add / Edit Modal */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#19132b]/65 p-2.5 backdrop-blur-sm sm:p-4"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="vn-frame flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden"
          >
            <div className="vn-band-strip flex shrink-0 items-center justify-between px-4 py-3 text-white sm:px-5">
              <h3 className="font-mono text-xs font-semibold tracking-[0.16em] uppercase drop-shadow-2xs">
                {editing.id ? "Edit Certificate" : "Add Certificate"}
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

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fdfbff] p-4 sm:p-6">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Certificate Title (EN)
                </label>
                <input
                  type="text"
                  required
                  value={editing.titleEn}
                  onChange={(e) =>
                    setEditing({ ...editing, titleEn: e.target.value })
                  }
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Certificate Title (ID — optional)
                </label>
                <input
                  type="text"
                  value={editing.titleId}
                  onChange={(e) =>
                    setEditing({ ...editing, titleId: e.target.value })
                  }
                  placeholder="Defaults to English title if empty"
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.issuer}
                    onChange={(e) =>
                      setEditing({ ...editing, issuer: e.target.value })
                    }
                    placeholder="e.g. Amazon Web Services"
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#745bc7]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
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
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-[#745bc7]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-xs outline-none focus:border-[#745bc7]"
                  >
                    <option value="SOFTWARE ENG">SOFTWARE ENG</option>
                    <option value="BANKING & LEADERSHIP">
                      BANKING &amp; LEADERSHIP
                    </option>
                    <option value="AI & DATA">AI &amp; DATA</option>
                    <option value="CLOUD & DEVOPS">CLOUD &amp; DEVOPS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                    Credential ID (optional)
                  </label>
                  <input
                    type="text"
                    value={editing.credentialId}
                    onChange={(e) =>
                      setEditing({ ...editing, credentialId: e.target.value })
                    }
                    className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-[#745bc7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#5d5370] uppercase">
                  Verification URL (optional)
                </label>
                <input
                  type="text"
                  value={editing.credentialUrl}
                  onChange={(e) =>
                    setEditing({ ...editing, credentialUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1 w-full border border-[#745bc7]/40 bg-white px-3 py-2 text-xs outline-none focus:border-[#745bc7]"
                />
              </div>

              <MediaUploader
                label="Certificate Image (optional)"
                value={editing.imageUrl}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                allowClear
              />

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

            <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[#745bc7]/20 bg-white px-4 py-3 sm:px-5 sm:py-3.5">
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
                <span>Save Certificate</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
