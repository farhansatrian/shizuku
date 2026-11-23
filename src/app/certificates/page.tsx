import { getPublicPortfolio } from "@/lib/portfolio";
import { CertificatesVaultView } from "@/components/public/CertificatesVaultView";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const data = await getPublicPortfolio();
  return <CertificatesVaultView data={data} />;
}
