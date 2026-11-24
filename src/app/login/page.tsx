import { redirect } from "next/navigation";

export default async function LoginRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const sp = await searchParams;
  const suffix = sp.redirect
    ? `?mode=login&redirect=${encodeURIComponent(sp.redirect)}`
    : "?mode=login";
  redirect(`/account${suffix}`);
}
