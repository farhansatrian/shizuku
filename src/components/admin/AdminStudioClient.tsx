"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  Briefcase,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { ProfileEditorTab } from "@/components/admin/ProfileEditorTab";
import { WorkspaceManagerTab } from "@/components/admin/WorkspaceManagerTab";
import { ProjectsManagerTab } from "@/components/admin/ProjectsManagerTab";
import { ExperiencesManagerTab } from "@/components/admin/ExperiencesManagerTab";
import { CertificatesManagerTab } from "@/components/admin/CertificatesManagerTab";
import { SkillsAndSecurityTab } from "@/components/admin/SkillsAndSecurityTab";
import type { PortfolioPayload } from "@/lib/types";
import type { AdminSessionPayload } from "@/lib/auth";

type SectionTab =
  | "dashboard"
  | "workspace"
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
  const [workspaceApps, setWorkspaceApps] = useState(initialData.workspaceApps);
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
      id: "workspace",
      label: "Workspace Apps",
      icon: <LayoutGrid className="h-4 w-4" />,
      count: workspaceApps.length,
    },
    {
      id: "profile",
      label: "Hero & Profile",
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
    <div className="shizuku-watercolor-bg min-h-screen overflow-x-hidden text-[#14100e]">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 border-b border-[#dfd4f8] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7650f3] text-white">
              <UmbrellaMark className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-editorial text-lg font-medium tracking-[0.14em] text-[#14100e]">
                  {profile.brandName}. studio
                </span>
                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-700 sm:inline-flex">
                  ● Live Sync
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#6d6188]">
                @{adminUser.username}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#dfd4f8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#14100e] transition hover:border-[#7650f3] hover:text-[#7650f3]"
            >
              View Site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-6">
        {/* Mobile-friendly Horizontal Scroll / Desktop Sticky Sidebar */}
        <aside className="pastel-glass h-fit w-full min-w-0 max-w-full overflow-hidden rounded-2xl p-2 lg:sticky lg:top-24">
          <nav className="flex w-full flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex min-h-[40px] shrink-0 items-center justify-between gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-[#7650f3] text-white"
                      : "text-[#534674] hover:bg-white hover:text-[#7650f3]"
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
              <div className="twilight-card rounded-2xl p-6 text-white sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-[#fad8e8] uppercase">
                      <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                      shizuku Admin Studio · 雫
                    </p>
                    <h1 className="mt-2 font-editorial text-3xl font-normal tracking-wide">
                      Welcome back, {profile.fullName.split(" ")[0]}.
                    </h1>
                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#ddd4f5] sm:text-sm">
                      Upload your official TUYU / Omutatsu Desktop & Mobile Hero
                      art, manage daily-drive workspace shortcuts, and edit all
                      projects, experiences & certificates live.
                    </p>
                  </div>
                  {profile.avatarImage?.trim() ? (
                    <img
                      src={profile.avatarImage}
                      alt={profile.fullName}
                      className="h-14 w-14 shrink-0 rounded-xl border border-white/30 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[#fad8e8]">
                      <UmbrellaMark className="h-7 w-7" />
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
                {[
                  {
                    label: "Workspace Apps",
                    value: workspaceApps.filter((a) => a.published).length,
                    total: workspaceApps.length,
                    tab: "workspace" as SectionTab,
                    icon: <LayoutGrid className="h-4 w-4" />,
                  },
                  {
                    label: "Projects",
                    value: projects.filter((p) => p.published).length,
                    total: projects.length,
                    tab: "projects" as SectionTab,
                    icon: <FolderKanban className="h-4 w-4" />,
                  },
                  {
                    label: "Experiences",
                    value: experiences.filter((e) => e.published).length,
                    total: experiences.length,
                    tab: "experiences" as SectionTab,
                    icon: <Briefcase className="h-4 w-4" />,
                  },
                  {
                    label: "Certificates",
                    value: certificates.filter((c) => c.published).length,
                    total: certificates.length,
                    tab: "certificates" as SectionTab,
                    icon: <Award className="h-4 w-4" />,
                  },
                ].map((card) => (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => setActiveTab(card.tab)}
                    className="pastel-glass pastel-glass-hover rounded-2xl p-4 text-left sm:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5dcfb] text-[#7650f3]">
                        {card.icon}
                      </span>
                      <span className="font-mono text-[10px] text-[#6d6188]">
                        {card.value}/{card.total} live
                      </span>
                    </div>
                    <p className="mt-3 font-mono text-2xl font-semibold text-[#14100e]">
                      {card.value}
                    </p>
                    <p className="mt-0.5 text-xs text-[#5c526e]">{card.label}</p>
                  </button>
                ))}
              </div>

              <div className="pastel-glass rounded-2xl p-5 sm:p-6">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7650f3] uppercase">
                  Quick Studio Actions
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="min-h-[40px] rounded-full bg-[#7650f3] px-4 py-2 text-xs font-medium text-white hover:bg-[#5e38dc]"
                  >
                    Upload Hero Artwork (Desktop & Mobile)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("workspace")}
                    className="min-h-[40px] rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#14100e] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Edit Daily Workspace Apps
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className="min-h-[40px] rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#14100e] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Manage Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("certificates")}
                    className="min-h-[40px] rounded-full border border-[#dfd4f8] bg-white px-4 py-2 text-xs font-medium text-[#14100e] hover:border-[#7650f3] hover:text-[#7650f3]"
                  >
                    Upload Certificates
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "workspace" && (
            <WorkspaceManagerTab
              apps={workspaceApps}
              setApps={setWorkspaceApps}
              notify={notify}
            />
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
                : "border-[#d8caf8] bg-white/95 text-[#14100e]"
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
