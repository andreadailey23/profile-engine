import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import { getProfileRecord, getPublicProfiles } from "@/lib/engine/selectors";

export function generateStaticParams() {
  return getPublicProfiles().map((house) => ({ handle: house.handle }));
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = getProfileRecord(handle);
  if (!profile) notFound();

  return (
    <ProfileView
      profile={profile}
    />
  );
}
