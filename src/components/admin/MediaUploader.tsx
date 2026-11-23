"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  presets?: { label: string; url: string }[];
  aspectClass?: string;
  allowClear?: boolean;
}

export function MediaUploader({
  label,
  value,
  onChange,
  presets,
  aspectClass = "aspect-[16/9]",
  allowClear = false,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block font-mono text-[11px] font-medium tracking-wider text-[#5f4f85] uppercase">
          {label}
        </label>
        {allowClear && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-600 hover:underline"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition ${
          dragOver
            ? "border-[#7650f3] bg-[#f1e9ff]"
            : "border-[#dfd4f8] bg-white/80 hover:border-[#b79ff5]"
        }`}
      >
        {value ? (
          <div
            className={`relative w-full overflow-hidden bg-[#1e1733] ${aspectClass}`}
          >
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-[#1e172b]/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-[#7650f3]"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading..." : "Change Image"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 py-8 text-center text-xs text-[#6a5c8d]"
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin text-[#7650f3]" />
            ) : (
              <ImagePlus className="h-7 w-7 text-[#7650f3]/75" />
            )}
            <span>
              {uploading
                ? "Uploading to persistent storage..."
                : "Drag & drop image here, or click to browse (JPG/PNG/WebP, max 25MB, original quality)"}
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Direct URL input fallback */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/api/uploads/... or https://..."
        className="w-full rounded-xl border border-[#dfd4f8] bg-white px-3.5 py-2 font-mono text-xs text-[#1e172b] outline-none focus:border-[#7650f3]"
      />

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] text-[#7c6ea0]">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.url}
              type="button"
              onClick={() => onChange(p.url)}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition ${
                value === p.url
                  ? "border-[#7650f3] bg-[#7650f3] text-white"
                  : "border-[#dfd4f8] bg-white text-[#5c4f7d] hover:border-[#7650f3]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
