import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import { getMergedProfileRecord } from "@/lib/profileOverrides";

// Render per request so saved profile edits (from the overrides store) show.
export const dynamic = "force-dynamic";

export default async function HousePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getMergedProfileRecord(handle);
  if (!profile) notFound();

  return (
    <ProfileView
      profile={profile}
    />
  );
}
