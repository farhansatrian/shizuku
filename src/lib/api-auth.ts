import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession, type AdminSessionPayload } from "./auth";

export async function requireAdminApi(): Promise<
  { session: AdminSessionPayload } | { error: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}

export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/workspace");
  revalidatePath("/portfolio");
  revalidatePath("/projects");
  revalidatePath("/about");
  revalidatePath("/certificates");
}
