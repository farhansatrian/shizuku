import { notFound } from "next/navigation";
import { getPublicProjectBySlug } from "@/lib/portfolio";
import { ProjectSpecView } from "@/components/public/ProjectSpecView";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { profile, project, related } = await getPublicProjectBySlug(slug);
  if (!project) {
    notFound();
  }
  return (
    <ProjectSpecView profile={profile} project={project} related={related} />
  );
}
