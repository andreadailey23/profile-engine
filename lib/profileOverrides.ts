import { getProfileRecord } from "@/lib/engine/selectors";

// The shared overrides store (public Supabase Storage) where each profile's
// saved edits live as {handle}.json. Same source every site reads, so an edit
// in the Streamo settings shows here too.
const OVERRIDES_BASE =
  "https://ivhbufgqamhguvpbdzbu.supabase.co/storage/v1/object/public/profile-engine-overrides";

const EDITABLE = [
  "name",
  "shortDescription",
  "description",
  "roles",
  "vibes",
  "tags",
  "primaryColor",
  "secondaryColor",
  "coverId",
  "avatarUrl",
  "avatarStyle",
  "bannerUrl",
] as const;

/** The seed record with the profile's saved overrides applied. */
export async function getMergedProfileRecord(handle: string) {
  const base = getProfileRecord(handle);
  if (!base) return null;
  try {
    const res = await fetch(`${OVERRIDES_BASE}/${encodeURIComponent(handle)}.json`, { cache: "no-store" });
    if (!res.ok) return base;
    const stored = (await res.json()) as Record<string, unknown> | null;
    if (!stored || typeof stored !== "object") return base;
    const overrides: Record<string, unknown> = {};
    for (const k of EDITABLE) {
      if (stored[k] !== undefined && stored[k] !== null && stored[k] !== "") overrides[k] = stored[k];
    }
    return { ...base, house: { ...base.house, ...overrides } };
  } catch {
    return base;
  }
}
