import { redirect } from "next/navigation";

export default async function RegisterRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const sp = await searchParams;
  const suffix = sp.redirect
    ? `?mode=register&redirect=${encodeURIComponent(sp.redirect)}`
    : "?mode=register";
  redirect(`/account${suffix}`);
}
