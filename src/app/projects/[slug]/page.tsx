import { redirect } from "next/navigation";

export default async function ProjectSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/portfolio/${slug}`);
}
