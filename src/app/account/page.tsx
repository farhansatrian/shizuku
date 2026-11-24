import React, { Suspense } from "react";
import { getPublicPortfolio } from "@/lib/portfolio";
import { AccountView } from "@/components/public/AccountView";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const data = await getPublicPortfolio();
  return (
    <Suspense fallback={null}>
      <AccountView data={data} />
    </Suspense>
  );
}
