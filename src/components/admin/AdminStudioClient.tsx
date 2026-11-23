"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserCircle2,
  AlertCircle,
} from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { ProfileEditorTab } from "@/components/admin/ProfileEditorTab";
import { ProjectsManagerTab } from "@/components/admin/ProjectsManagerTab";
import { ExperiencesManagerTab } from "@/components/admin/ExperiencesManagerTab";
import { CertificatesManagerTab } from "@/components/admin/CertificatesManagerTab";
import { SkillsAndSecurityTab } from "@/components/admin/SkillsAndSecurityTab";
import type { PortfolioPayload } from "@/lib/types";
import type { AdminSessionPayload } from "@/lib/auth";

type SectionTab =
  | "dashboard"
  | "profile"
  | "projects"
  | "experiences"
  | "certificates"
  | "skills";

export function AdminStudioClient({
  initialData,
  adminUser,
}: {
  initialData: PortfolioPayload;
  adminUser: AdminSessionPayload;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionTab>("dashboard");
  const [profile, setProfile] = useState(initialData.profile);
  const [projects, setProjects] = useState(initialData.projects);
  const [experiences, setExperiences] = useState(initialData.experiences);
  const [certificates, setCertificates] = useState(initialData.certificates);
  const [skillGroups, setSkillGroups] = useState(initialData.skillGroups);
  const [toast, setToast] = useState<{
    message: string;
    tone: "ok" | "err";
  } | null>(null);

  const notify = useCallback((message: string, tone: "ok" | "err" = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems: {
    id: SectionTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: "dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "profile",
      label: "Profile & Hero",
      icon: <UserCircle2 className="h-4 w-4" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderKanban className="h-4 w-4" />,
      count: projects.length,
    },
    {
      id: "experiences",
      label: "Experiences",
      icon: <Briefcase className="h-4 w-4" />,
      count: experiences.length,
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: <Award className="h-4 w-4" />,
      count: certificates.length,
    },
    {
      id: "skills",
      label: "Skills & Security",
      icon: <Cpu className="h-4 w-4" />,
      count: skillGroups.length,
    },
  ];

  return (
    <div className="shizuku-watercolor-bg min-h-screen text-[#1e172b]">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 border-b border-[#dfd4f8] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7650f3] to-[#ee84b5] text-white shadow-xs">
              <UmbrellaMark className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-semibold tracking-wider text-[#1e172b]">
                  {profile.brandName}. studio
                </span>
                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-700 sm:inline-flex">
                  ● Live Sync
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#7a6d9c]">
                Signed in as @{adminUser.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white px-4 py-1.5 text-xs font-medium text-[#2c214a] transition hover:border-[#7650f3] hover:text-[#7650f3]"
            >
              View Live Site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-3.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="pastel-glass h-fit rounded-3xl p-3 lg:sticky lg:top-24">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition ${
                    active
                      ? "bg-[#7650f3] text-white shadow-[0_8px_20px_-8px_rgba(118,80,243,0.7)]"
                      : "text-[#534674] hover:bg-white/90 hover:text-[#7650f3]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[#f3ecff] text-[#7650f3]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Workspace */}
        <main className="min-w-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="twilight-card relative overflow-hidden rounded-3xl p-7 text-white">
                <div
                  className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#ee84b5]/25 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-[#fad8e8] uppercase">
                      <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                      shizuku Admin Studio · 雫
                    </p>
                    <h1 className="mt-2 font-editorial text-3xl font-semibold">
                      Welcome back, {profile.fullName.split(" ")[0]}!
                    </h1>
                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#ddd4f5] sm:text-sm">
                      Everything you edit here — profile copy (EN/ID), projects,
                      experiences, certificates, and skills — saves directly to
                      SQLite and refreshes your public portfolio automatically.
                    </p>
                  </div>
                  <img
                    src={profile.avatarImage}
                    alt={profile.fullName}
                    className="h-16 w-16 shrink-0 rounded-2xl border-2 border-white/40 object-cover"
                  />
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Published Projects",
                    value: projects.filter((p) => p.published).length,
                    total: projects.length,
                    tab: "projects" as SectionTab,
                    icon: <FolderKanban className="h-4 w-4" />,
                  },
                  {
                    label: "Experiences & Edu",
                    value: experiences.filter((e) => e.published).length,
                    total: experiences.length,
                    tab: "experiences" as SectionTab,
                    icon: <Briefcase className="h-4 w-4" />,
                  },
                  {
                    label: "Certificates Vault",
                    value: certificates.filter((c) => c.published).length,
                    total: certificates.length,
                    tab: "certificates" as SectionTab,
                    icon: <Award className="h-4 w-4" />,
                  },
                  {
                    label: "Skill Groups",
                    value: skillGroups.length,
                    total: skillGroups.reduce((a, g) => a + g.items.length, 0),
                    suffix: "skills",
                    tab: "skills" as SectionTab,
                    icon: <Cpu className="h-4 w-4" />,
                  },
                ].map((card) => (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => setActiveTab(card.tab)}
                    className="pastel-glass pastel-glass-hover rounded-3xl p-5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3ecff] text-[#7650f3]">
                        {card.icon}
                      </span>
                      <span className="font-mono text-[10px] text-[#7a6d9c]">
                        {card.suffix
                          ? `${card.total} ${card.suffix}`
                          : `${card.value}/${card.total} live`}
                      </span>
                    </div>
                    <p className="mt-4 font-mono text-2xl font-semibold text-[#1e172b]">
                      {card.value}
                    </p>
                    <p className="mt-0.5 text-xs text-[#645882]">{card.label}</p>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pastel-glass rounded-3xl p-6">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
                  Quick Studio Actions
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="rounded-full bg-[#7650f3] px-4 py-2 text-xs font-medium text-white hover:bg-[#5e38dc]"
                  >
                    Edit Profile & Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className="rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Manage Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("experiences")}
                    className="rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Update LinkedIn Experiences
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("certificates")}
                    className="rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#2c214a] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Upload Certificates
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <ProfileEditorTab
              key={profile.updatedAt}
              profile={profile}
              onSaved={setProfile}
              notify={notify}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsManagerTab
              projects={projects}
              setProjects={setProjects}
              notify={notify}
            />
          )}

          {activeTab === "experiences" && (
            <ExperiencesManagerTab
              experiences={experiences}
              setExperiences={setExperiences}
              notify={notify}
            />
          )}

          {activeTab === "certificates" && (
            <CertificatesManagerTab
              certificates={certificates}
              setCertificates={setCertificates}
              notify={notify}
            />
          )}

          {activeTab === "skills" && (
            <SkillsAndSecurityTab
              skillGroups={skillGroups}
              setSkillGroups={setSkillGroups}
              notify={notify}
            />
          )}
        </main>
      </div>

      {/* Floating Pastel Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`fixed right-5 bottom-5 z-[95] flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-medium shadow-xl backdrop-blur-md ${
              toast.tone === "err"
                ? "border-rose-200 bg-rose-50/95 text-rose-800"
                : "border-[#d8caf8] bg-white/95 text-[#1e172b]"
            }`}
          >
            {toast.tone === "err" ? (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#7650f3]" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
