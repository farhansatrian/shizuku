import { getPublicPortfolio } from "@/lib/portfolio";
import { ProjectsArchiveView } from "@/components/public/ProjectsArchiveView";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const data = await getPublicPortfolio();
  return <ProjectsArchiveView data={data} />;
}
