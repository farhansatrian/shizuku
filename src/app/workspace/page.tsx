import { getPublicPortfolio } from "@/lib/portfolio";
import { getAdminSession } from "@/lib/auth";
import { WorkspaceView } from "@/components/public/WorkspaceView";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const [data, adminSession] = await Promise.all([
    getPublicPortfolio(),
    getAdminSession(),
  ]);
  return <WorkspaceView data={data} isAdmin={Boolean(adminSession)} />;
}
