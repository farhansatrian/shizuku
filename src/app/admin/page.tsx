import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAdminPortfolio } from "@/lib/portfolio";
import { AdminStudioClient } from "@/components/admin/AdminStudioClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const data = await getAdminPortfolio();
  return <AdminStudioClient initialData={data} adminUser={session} />;
}
