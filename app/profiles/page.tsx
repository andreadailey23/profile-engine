import ProfilesExplorer from "@/components/ProfilesExplorer";
import { getPublicProfiles } from "@/lib/engine/selectors";

export const metadata = {
  title: "Profiles | Building Empires",
  description: "Browse public profiles on Building Empires.",
};

export default function ProfilesPage() {
  return <ProfilesExplorer profiles={getPublicProfiles()} />;
}
