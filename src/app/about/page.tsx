import { getPublicPortfolio } from "@/lib/portfolio";
import { AboutView } from "@/components/public/AboutView";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getPublicPortfolio();
  return <AboutView data={data} />;
}
