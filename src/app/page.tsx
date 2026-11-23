import { getPublicPortfolio } from "@/lib/portfolio";
import { HomeView } from "@/components/public/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicPortfolio();
  return <HomeView data={data} />;
}
