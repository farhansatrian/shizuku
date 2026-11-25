"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ExternalLink,
  FileText,
  KeyRound,
  LayoutGrid,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { UmbrellaMark } from "@/components/icons/RainMotifs";
import { ProfileEditorTab } from "@/components/admin/ProfileEditorTab";
import { WorkspaceManagerTab } from "@/components/admin/WorkspaceManagerTab";
import { ExperiencesManagerTab } from "@/components/admin/ExperiencesManagerTab";
import { CertificatesManagerTab } from "@/components/admin/CertificatesManagerTab";
import { SkillsAndSecurityTab } from "@/components/admin/SkillsAndSecurityTab";
import type { PortfolioPayload } from "@/lib/types";
import type { AdminSessionPayload } from "@/lib/auth";

type SectionTab =
  | "profile"
  | "workspace"
  | "experiences"
  | "certificates"
  | "security";

export function AdminStudioClient({
  initialData,
  adminUser,
}: {
  initialData: PortfolioPayload;
  adminUser: AdminSessionPayload;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionTab>("profile");
  const [profile, setProfile] = useState(initialData.profile);
  const [workspaceApps, setWorkspaceApps] = useState(initialData.workspaceApps);
  const [experiences, setExperiences] = useState(initialData.experiences);
  const [certificates, setCertificates] = useState(initialData.certificates);
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
      id: "profile",
      label: "Profile",
      icon: <UserCircle2 className="h-3.5 w-3.5" />,
    },
    {
      id: "workspace",
      label: "Work",
      icon: <LayoutGrid className="h-3.5 w-3.5" />,
      count: workspaceApps.length,
    },
    {
      id: "experiences",
      label: "Portfolio",
      icon: <FileText className="h-3.5 w-3.5" />,
      count: experiences.length,
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: <Award className="h-3.5 w-3.5" />,
      count: certificates.length,
    },
    {
      id: "security",
      label: "Security",
      icon: <KeyRound className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#14100e]">
      {/* Consistent calm watercolor backdrop */}
      <div className="shizuku-workspace-bg" aria-hidden="true" />

      {/* Clean Compact Studio Bar */}
      <header className="sticky top-0 z-40 border-b border-[#745bc7]/25 bg-[#fdf9ff]/92 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <UmbrellaMark className="h-5 w-5 shrink-0 text-[#745bc7]" />
            <span className="truncate font-editorial text-base font-bold tracking-[0.14em] text-[#745bc7] uppercase sm:text-lg sm:tracking-[0.2em]">
              {profile.brandName}{" "}
              <span className="hidden sm:inline">STUDIO</span>
            </span>
            <span className="hidden font-mono text-[10px] text-[#5d5370] sm:inline">
              · @{adminUser.username}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="vn-btn-action px-3 py-1.5 text-[10px]"
            >
              <span>View Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 border-[1.5px] border-rose-400 bg-white px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-rose-600 uppercase transition hover:bg-rose-600 hover:text-white"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[960px] px-4 py-6 sm:px-6 md:py-8">
        {/* Clean 5-Tab Bar Matching Live Public Pages 1-to-1 */}
        <nav
          aria-label="Admin sections"
          className="mb-6 flex max-w-full overflow-x-auto border-[1.5px] border-[#745bc7] bg-[#fdf9ff]/95 shadow-[3px_3px_0_0_rgba(116,91,199,0.16)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item, idx) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center justify-center gap-1.5 px-3.5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition md:flex-1 ${
                  idx > 0 ? "border-l border-[#745bc7]/30" : ""
                } ${
                  active
                    ? "bg-[#745bc7] text-white"
                    : "text-[#5d5370] hover:bg-[#efe9fd] hover:text-[#14100e]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#e5dcfb] text-[#745bc7]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Editor Sheet */}
        <main className="vn-frame overflow-hidden">
          <div className="bg-white/95 p-5 sm:p-7">
            {activeTab === "profile" && (
              <ProfileEditorTab
                key={profile.updatedAt}
                profile={profile}
                onSaved={setProfile}
                notify={notify}
              />
            )}

            {activeTab === "workspace" && (
              <WorkspaceManagerTab
                apps={workspaceApps}
                setApps={setWorkspaceApps}
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

            {activeTab === "security" && (
              <SkillsAndSecurityTab notify={notify} />
            )}
          </div>
        </main>
      </div>

      {/* Crisp Floating Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed right-5 bottom-5 z-[95] flex items-center gap-2.5 border-[1.5px] px-4 py-2.5 font-mono text-[11px] font-medium shadow-[3px_3px_0_0_rgba(116,91,199,0.22)] backdrop-blur-md ${
              toast.tone === "err"
                ? "border-rose-500 bg-rose-50/95 text-rose-700"
                : "border-[#745bc7] bg-[#fdf9ff]/95 text-[#14100e]"
            }`}
          >
            {toast.tone === "err" ? (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#745bc7]" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
