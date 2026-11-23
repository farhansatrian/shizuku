"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Cpu,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SerializedProfile, SerializedSkillGroup } from "@/lib/types";

type TabId = "overview" | "banking" | "stack" | "currently";

export function PastelOsWindow({
  profile,
  skillGroups,
}: {
  profile: SerializedProfile;
  skillGroups: SerializedSkillGroup[];
}) {
  const { pick } = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dropsTapped, setDropsTapped] = useState(0);

  const tabs: { id: TabId; labelEn: string; labelId: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      labelEn: "Overview",
      labelId: "Ringkasan",
      icon: <User className="h-3.5 w-3.5" />,
    },
    {
      id: "banking",
      labelEn: "Banking & AI",
      labelId: "Perbankan & AI",
      icon: <Building2 className="h-3.5 w-3.5" />,
    },
    {
      id: "stack",
      labelEn: "Tech Stack",
      labelId: "Skill & Tech",
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    {
      id: "currently",
      labelEn: "Currently",
      labelId: "Saat Ini",
      icon: <Sparkles className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="pastel-glass flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Pastel macOS Window Titlebar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8dffb] bg-white/75 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#f3a3c7] ring-1 ring-[#e280ad]/40" />
          <span className="h-3 w-3 rounded-full bg-[#cfb8fb] ring-1 ring-[#a985f5]/40" />
          <span className="h-3 w-3 rounded-full bg-[#9cd5f2] ring-1 ring-[#6eb8df]/40" />
          <span className="ml-2 font-mono text-xs text-[#6e608e]">
            {profile.brandName}_profile.card
          </span>
        </div>

        {/* Cute interactive umbrella raindrop micro-delight */}
        <button
          type="button"
          onClick={() => setDropsTapped((n) => n + 1)}
          title={pick("Tap for a rainy chime drop!", "Klik untuk tetes hujan!")}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[#e3d8fa] bg-[#f7f2ff] px-2.5 py-1 font-mono text-[11px] text-[#7650f3] transition hover:border-[#7650f3]/40 hover:bg-[#efe6ff] active:scale-95"
        >
          <UmbrellaMark className="h-3.5 w-3.5 transition-transform group-hover:-rotate-12" />
          <span>{dropsTapped === 0 ? profile.brandKanji : `${dropsTapped} 雫`}</span>
        </button>
      </div>

      {/* Interactive Sliding Pill Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#ece5fc] bg-[#faf7ff]/70 px-4 py-2.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-[#5d517a] hover:bg-white/80 hover:text-[#7650f3]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="pastelOsActiveTab"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#7650f3] shadow-[0_6px_16px_-6px_rgba(118,80,243,0.65)]"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {pick(tab.labelEn, tab.labelId)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <img
                    src={profile.avatarImage || "/assets/avatar-rainy.jpg"}
                    alt={profile.fullName}
                    className="h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-[0_10px_25px_-10px_rgba(118,80,243,0.35)]"
                  />
                  <span
                    className="absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#7650f3] text-[10px] font-bold text-white shadow-xs"
                    title={profile.brandName}
                  >
                    {profile.brandKanji}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1e172b]">
                    {profile.fullName}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-[#7650f3]">
                    {pick(profile.currentRoleEn, profile.currentRoleId)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-[#6a5f85]">
                    <MapPin className="h-3.5 w-3.5 text-[#ee84b5]" />
                    {profile.location}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#4b4066]">
                {pick(profile.bioEn, profile.bioId)}
              </p>

              {/* KPI Stats Grid */}
              {profile.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5 pt-1 sm:gap-3">
                  {profile.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center rounded-2xl border border-[#e5dcfb] bg-white/85 px-2.5 py-3 text-center transition hover:border-[#7650f3]/40 sm:px-3.5"
                    >
                      <p className="whitespace-nowrap font-mono text-sm font-semibold text-[#7650f3] sm:text-lg">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-tight text-[#62577a] sm:text-[11px]">
                        {pick(stat.labelEn, stat.labelId)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "banking" && (
            <motion.div
              key="banking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-[#e3d9fa] bg-gradient-to-br from-[#f8f3ff] to-[#fef4f9] p-4">
                <p className="font-mono text-[11px] tracking-[0.16em] text-[#7650f3] uppercase">
                  {pick("ENTERPRISE BANKING TRACK", "JALUR TEKNOLOGI PERBANKAN")}
                </p>
                <p className="mt-1.5 text-base font-semibold text-[#1e172b]">
                  {profile.currentOrg}
                </p>
                <p className="mt-1 text-sm text-[#574b75]">
                  {pick(profile.currentRoleEn, profile.currentRoleId)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e7dffb] bg-[#1e1733] p-4 font-mono text-xs leading-relaxed text-[#e8e1fb]">
                <p className="text-[#ee84b5]">{"// focus_matrix.ts"}</p>
                <p className="mt-1">
                  <span className="text-[#a894f9]">const</span> focus = {"{"}
                </p>
                <p className="pl-4">
                  engineering:{" "}
                  <span className="text-[#9ae6c5]">
                    &quot;Reliable Full-Stack &amp; Banking Systems&quot;
                  </span>
                  ,
                </p>
                <p className="pl-4">
                  business:{" "}
                  <span className="text-[#9ae6c5]">
                    &quot;Process Clarity &amp; Measurable Impact&quot;
                  </span>
                  ,
                </p>
                <p className="pl-4">
                  ai:{" "}
                  <span className="text-[#9ae6c5]">
                    &quot;Applied LLMs &amp; Practical Automation&quot;
                  </span>
                  ,
                </p>
                <p>{"};"}</p>
              </div>
            </motion.div>
          )}

          {activeTab === "stack" && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="grid gap-3.5 sm:grid-cols-2"
            >
              {skillGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-[#e6defb] bg-white/80 p-3.5"
                >
                  <p className="font-mono text-[11px] font-medium tracking-wider text-[#7650f3] uppercase">
                    {pick(group.nameEn, group.nameId)}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#e3d9fa] bg-[#f7f3ff] px-2.5 py-0.5 font-mono text-[11px] text-[#3c3159]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "currently" && (
            <motion.div
              key="currently"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-[#e7dffb] bg-white/85 p-4">
                <p className="font-mono text-[11px] tracking-[0.16em] text-[#ee84b5] uppercase">
                  {pick("RAINY DESK LOG · NOW", "CATATAN MEJA HUJAN · SAAT INI")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#463b61]">
                  {pick(profile.currentlyEn, profile.currentlyId)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#7650f3] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#5e38dc]"
                >
                  {pick("Say Hello", "Sapa via Email")}{" "}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
