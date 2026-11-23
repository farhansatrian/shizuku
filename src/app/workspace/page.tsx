import { getPublicPortfolio } from "@/lib/portfolio";
import { WorkspaceView } from "@/components/public/WorkspaceView";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const data = await getPublicPortfolio();
  return <WorkspaceView data={data} />;
}
