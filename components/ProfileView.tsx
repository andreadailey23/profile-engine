"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Grid3X3,
  Link2,
  MoreVertical,
  Package,
  Sparkles,
  Settings,
  UserRound,
} from "lucide-react";
import type {
  HouseItem,
  HouseLink,
  HouseStatus,
  HouseType,
  ProfileLibraryItem,
  ProfileLibraryItemStatus,
  ProfileLibraryItemType,
  ProfileThemeId,
  RoomType,
  ScheduleItem,
} from "../lib/engine/types";
import { getProfileTheme, profileThemes } from "../lib/engine/themes";
import {
  getProfileCover,
  profileCoverBackground,
  validProfileCoverId,
  type ProfileCoverId,
} from "../lib/engine/covers";
import type { ProfileRecord } from "../lib/engine/selectors";

const statusLabels: Record<HouseStatus, string> = {
  building: "building",
  live: "live",
  selling: "selling",
  testing: "testing",
  paused: "paused",
  planned: "planned",
  archived: "archived",
  "coming-soon": "coming soon",
};

const libraryTypeLabels: Record<ProfileLibraryItemType, string> = {
  game: "Game",
  book: "Book",
  tool: "Tool",
  music: "Music",
  show: "Show",
  product: "Product",
  resource: "Resource",
};

const libraryStatusLabels: Record<ProfileLibraryItemStatus, string> = {
  playing: "Playing",
  reading: "Reading",
  using: "Using",
  recommend: "Recommend",
  want: "Want",
  finished: "Finished",
};

const libraryTypeOrder: ProfileLibraryItemType[] = ["book", "game", "tool", "music", "show", "product", "resource"];
const ownerProfileHandle = "andrea-dailey";

function statusStyle(status: HouseStatus) {
  if (status === "live") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "selling") return "border-amber-300/30 bg-amber-300/10 text-amber-200";
  if (status === "testing") return "border-sky-300/30 bg-sky-300/10 text-sky-200";
  if (status === "paused") return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
  return "border-orange-400/30 bg-orange-400/10 text-orange-200";
}

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function roomLabel(room: RoomType) {
  return room.replace(/-/g, " ");
}

function profileRoomLabel(room: RoomType, type: HouseType) {
  if (room === "posts") return "content";
  if (room === "shop" || room === "buy") return "buy";
  if (room === "books" && type !== "person") return "buy";
  if (room === "use-cases") return "use cases";
  return roomLabel(room);
}

function itemDisplayGroup(item: HouseItem) {
  if (item.displayGroup) return item.displayGroup;
  if (item.itemType === "pick") return "pick";
  if (["project", "media", "service", "community"].includes(item.itemType)) return "work";
  return "product";
}

function workSectionTitle(name: string, type: HouseType) {
  if (type === "person") return `Built by ${name.split(" ")[0]}`;
  if (type === "creator" || type === "studio") return "Work and channels";
  return "Work";
}

function schedulePreviewLabel(type: ScheduleItem["type"]) {
  if (type === "location-hours") return "Hours";
  if (type === "availability") return "Availability";
  if (type === "office-hours") return "Office hours";
  if (type === "stream") return "Next stream";
  if (type === "live") return "Next live";
  if (type === "event") return "Next event";
  if (type === "drop") return "Next drop";
  if (type === "launch") return "Launch";
  if (type === "booking") return "Booking";
  return "Next up";
}

function profileThemeStorageKey(handle: string) {
  return `building-empires-profile-theme-${handle}`;
}

function profileAvatarStorageKey(handle: string) {
  return `building-empires-profile-avatar-${handle}`;
}

function profileCoverStorageKey(handle: string) {
  return `building-empires-profile-cover-${handle}`;
}

function profileAccentStorageKey(handle: string) {
  return `building-empires-profile-accent-${handle}`;
}

function profileSecondaryAccentStorageKey(handle: string) {
  return `building-empires-profile-accent-secondary-${handle}`;
}

function profileBannerIdentityStorageKey(handle: string) {
  return `building-empires-profile-banner-identities-${handle}`;
}

function profileBannerVisibleStorageKey(handle: string) {
  return `building-empires-profile-banner-visible-${handle}`;
}

function profileRecommendedStorageKey(handle: string) {
  return `building-empires-profile-recommended-${handle}`;
}

function validThemeId(value: string | null): ProfileThemeId | undefined {
  return profileThemes.some((theme) => theme.id === value) ? (value as ProfileThemeId) : undefined;
}

function validAccentColor(value: string | null | undefined) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : undefined;
}

function profileThemeColors(
  theme: ReturnType<typeof getProfileTheme>,
  accentOverride: string | undefined,
  secondaryAccentOverride: string | undefined,
) {
  if (!accentOverride && !secondaryAccentOverride) return theme.colors;

  const accent = accentOverride ?? theme.colors.accent;

  return {
    ...theme.colors,
    accent,
    accentStrong: secondaryAccentOverride ?? (accentOverride ? accentOverride : theme.colors.accentStrong),
    accentSoft: `${accent}24`,
  };
}

type AvatarSettings = {
  color: string;
  image?: string;
  mode: "fill" | "outline";
};

type ProfileThemeColors = ReturnType<typeof getProfileTheme>["colors"];

function parseAvatarSettings(value: string | null): AvatarSettings | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value) as Partial<AvatarSettings>;
    const mode = parsed.mode === "outline" ? "outline" : "fill";
    const color = typeof parsed.color === "string" ? parsed.color : "#ff6a00";
    const image = typeof parsed.image === "string" && parsed.image.startsWith("data:image/") ? parsed.image : undefined;

    return { color, image, mode };
  } catch {
    return undefined;
  }
}

function parseBannerIdentities(value: string | null, availableIdentities: string[]) {
  const fallback = availableIdentities.slice(0, 3);

  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;

    const selected = parsed.filter((item): item is string => availableIdentities.includes(item)).slice(0, 3);
    return selected.length > 0 ? selected : fallback;
  } catch {
    return fallback;
  }
}

function profileThemeVars(colors: ProfileThemeColors) {
  return {
    "--profile-bg": colors.canvas,
    "--profile-surface": colors.surface,
    "--profile-surface-soft": colors.surfaceSoft,
    "--profile-surface-lift": colors.surfaceLift,
    "--profile-border": colors.border,
    "--profile-border-strong": colors.borderStrong,
    "--profile-text": colors.text,
    "--profile-text-soft": colors.textSoft,
    "--profile-muted": colors.muted,
    "--profile-accent": colors.accent,
    "--profile-accent-strong": colors.accentStrong,
    "--profile-accent-soft": colors.accentSoft,
    "--profile-button-text": colors.buttonText,
    "--profile-shadow": colors.shadow,
    "--profile-grid": colors.grid,
  } as CSSProperties;
}

type Props = {
  profile: NonNullable<ProfileRecord>;
};

type ProfileActionTab = "connect" | "offers" | "professional";

const profileActionTabs: { key: ProfileActionTab; label: string }[] = [
  { key: "connect", label: "Connect" },
  { key: "offers", label: "Offers" },
  { key: "professional", label: "Professional" },
];

const professionalRooms: RoomType[] = ["positioning", "proof", "work", "reports", "contact"];

export default function ProfileView({ profile }: Props) {
  const {
    house,
    modules,
    links,
    parentHouses,
    childHouses,
    ownerHouses,
    ownsHouses,
    relatedHouses,
    items,
    libraryItems,
    schedule,
    updates,
  } = profile;
  const [activeActionTab, setActiveActionTab] = useState<ProfileActionTab>("connect");
  const [accentOverride, setAccentOverride] = useState<string | undefined>();
  const [avatarOverride, setAvatarOverride] = useState<AvatarSettings | undefined>();
  const [bannerIdentities, setBannerIdentities] = useState<string[]>(house.roles.slice(0, 3));
  const [bannerVisible, setBannerVisible] = useState(true);
  const [coverOverride, setCoverOverride] = useState<ProfileCoverId | undefined>();
  const [libraryFilter, setLibraryFilter] = useState<ProfileLibraryItemType | "all">("all");
  const [recommended, setRecommended] = useState(false);
  const [secondaryAccentOverride, setSecondaryAccentOverride] = useState<string | undefined>();
  const [themeOverride, setThemeOverride] = useState<ProfileThemeId | undefined>();
  const theme = getProfileTheme(themeOverride ?? house.themeId);
  const colors = profileThemeColors(theme, accentOverride, secondaryAccentOverride);
  const cover = getProfileCover(coverOverride);

  useEffect(() => {
    function syncStoredTheme() {
      setThemeOverride(validThemeId(window.localStorage.getItem(profileThemeStorageKey(house.handle))));
    }

    function onThemeChange(event: Event) {
      const detail = (event as CustomEvent<{ handle?: string; themeId?: ProfileThemeId }>).detail;
      if (detail?.handle !== house.handle) return;
      setThemeOverride(detail.themeId);
    }

    syncStoredTheme();
    window.addEventListener("storage", syncStoredTheme);
    window.addEventListener("buildingempires:profile-theme", onThemeChange);

    return () => {
      window.removeEventListener("storage", syncStoredTheme);
      window.removeEventListener("buildingempires:profile-theme", onThemeChange);
    };
  }, [house.handle]);

  useEffect(() => {
    function syncStoredAccent() {
      setAccentOverride(validAccentColor(window.localStorage.getItem(profileAccentStorageKey(house.handle))));
    }

    function onAccentChange(event: Event) {
      const detail = (event as CustomEvent<{ accent?: string; handle?: string }>).detail;
      if (detail?.handle !== house.handle) return;
      setAccentOverride(validAccentColor(detail.accent));
    }

    syncStoredAccent();
    window.addEventListener("storage", syncStoredAccent);
    window.addEventListener("buildingempires:profile-accent", onAccentChange);

    return () => {
      window.removeEventListener("storage", syncStoredAccent);
      window.removeEventListener("buildingempires:profile-accent", onAccentChange);
    };
  }, [house.handle]);

  useEffect(() => {
    function syncStoredSecondaryAccent() {
      setSecondaryAccentOverride(
        validAccentColor(window.localStorage.getItem(profileSecondaryAccentStorageKey(house.handle))),
      );
    }

    function onSecondaryAccentChange(event: Event) {
      const detail = (event as CustomEvent<{ accent?: string; handle?: string }>).detail;
      if (detail?.handle !== house.handle) return;
      setSecondaryAccentOverride(validAccentColor(detail.accent));
    }

    syncStoredSecondaryAccent();
    window.addEventListener("storage", syncStoredSecondaryAccent);
    window.addEventListener("buildingempires:profile-accent-secondary", onSecondaryAccentChange);

    return () => {
      window.removeEventListener("storage", syncStoredSecondaryAccent);
      window.removeEventListener("buildingempires:profile-accent-secondary", onSecondaryAccentChange);
    };
  }, [house.handle]);

  useEffect(() => {
    function syncStoredBanner() {
      setBannerVisible(window.localStorage.getItem(profileBannerVisibleStorageKey(house.handle)) !== "false");
      setBannerIdentities(parseBannerIdentities(window.localStorage.getItem(profileBannerIdentityStorageKey(house.handle)), house.roles));
    }

    function onBannerChange(event: Event) {
      const detail = (event as CustomEvent<{ handle?: string; identities?: string[]; visible?: boolean }>).detail;
      if (detail?.handle !== house.handle) return;

      setBannerVisible(detail.visible ?? true);
      setBannerIdentities(
        Array.isArray(detail.identities)
          ? detail.identities.filter((item) => house.roles.includes(item)).slice(0, 3)
          : house.roles.slice(0, 3),
      );
    }

    syncStoredBanner();
    window.addEventListener("storage", syncStoredBanner);
    window.addEventListener("buildingempires:profile-banner", onBannerChange);

    return () => {
      window.removeEventListener("storage", syncStoredBanner);
      window.removeEventListener("buildingempires:profile-banner", onBannerChange);
    };
  }, [house.handle, house.roles]);

  useEffect(() => {
    function syncStoredAvatar() {
      setAvatarOverride(parseAvatarSettings(window.localStorage.getItem(profileAvatarStorageKey(house.handle))));
    }

    function onAvatarChange(event: Event) {
      const detail = (event as CustomEvent<{ avatar?: AvatarSettings; handle?: string }>).detail;
      if (detail?.handle !== house.handle) return;
      setAvatarOverride(detail.avatar);
    }

    syncStoredAvatar();
    window.addEventListener("storage", syncStoredAvatar);
    window.addEventListener("buildingempires:profile-avatar", onAvatarChange);

    return () => {
      window.removeEventListener("storage", syncStoredAvatar);
      window.removeEventListener("buildingempires:profile-avatar", onAvatarChange);
    };
  }, [house.handle]);

  useEffect(() => {
    function syncStoredCover() {
      setCoverOverride(validProfileCoverId(window.localStorage.getItem(profileCoverStorageKey(house.handle))));
    }

    function onCoverChange(event: Event) {
      const detail = (event as CustomEvent<{ coverId?: ProfileCoverId; handle?: string }>).detail;
      if (detail?.handle !== house.handle) return;
      setCoverOverride(validProfileCoverId(detail.coverId ?? null));
    }

    syncStoredCover();
    window.addEventListener("storage", syncStoredCover);
    window.addEventListener("buildingempires:profile-cover", onCoverChange);

    return () => {
      window.removeEventListener("storage", syncStoredCover);
      window.removeEventListener("buildingempires:profile-cover", onCoverChange);
    };
  }, [house.handle]);

  useEffect(() => {
    function syncRecommended() {
      setRecommended(window.localStorage.getItem(profileRecommendedStorageKey(house.handle)) === "true");
    }

    syncRecommended();
    window.addEventListener("storage", syncRecommended);

    return () => {
      window.removeEventListener("storage", syncRecommended);
    };
  }, [house.handle]);

  function toggleRecommended() {
    const nextRecommended = !recommended;
    setRecommended(nextRecommended);
    window.localStorage.setItem(profileRecommendedStorageKey(house.handle), String(nextRecommended));
  }

  const professionalModules = useMemo(
    () => modules.filter((module) => professionalRooms.includes(module.room)),
    [modules],
  );

  const workItems = useMemo(
    () => items.filter((item) => itemDisplayGroup(item) === "work"),
    [items],
  );
  const pinnedItems = useMemo(
    () =>
      items
        .filter((item) => Boolean(item.url) && (item.displayGroup === "pick" || item.itemType === "media"))
        .slice(0, 3),
    [items],
  );
  const offerItems = useMemo(
    () =>
      items.filter(
        (item) =>
          itemDisplayGroup(item) === "product" ||
          ["app", "book", "collection", "connector", "course", "offer", "service", "store", "tool"].includes(item.itemType),
      ),
    [items],
  );
  const offerGroups = useMemo(
    () =>
      [
        {
          title: "Products / Offers",
          items: offerItems.filter((item) => item.itemType !== "app" && item.itemType !== "connector"),
        },
        { title: "Apps", items: offerItems.filter((item) => item.itemType === "app") },
        { title: "Connectors", items: offerItems.filter((item) => item.itemType === "connector") },
      ].filter((group) => group.items.length > 0),
    [offerItems],
  );

  const connectedProfiles = [
    ...parentHouses.map((item) => ({ label: "part of", house: item })),
    ...ownerHouses.map((item) => ({ label: "built by", house: item })),
    ...ownsHouses.map((item) => ({ label: "connected", house: item })),
    ...childHouses.map((item) => ({ label: "contains", house: item })),
    ...relatedHouses.map((item) => ({ label: "also connected", house: item })),
  ];
  const socialLinks = links.filter((link) => link.type === "social");
  const coreLinks = links.filter((link) => link.type !== "social");
  const nextScheduleItem = schedule[0];
  const showLibrary = libraryItems.length > 0;
  const libraryTypes = Array.from(new Set(libraryItems.map((item) => item.type)));
  const visibleLibraryItems =
    libraryFilter === "all" ? libraryItems : libraryItems.filter((item) => item.type === libraryFilter);
  const featuredLibraryItems = visibleLibraryItems.slice(0, 3);
  const linkedLibraryItems = visibleLibraryItems.slice(3);
  const linkedLibraryGroups = libraryTypeOrder
    .map((type) => ({
      type,
      items: linkedLibraryItems.filter((item) => item.type === type),
    }))
    .filter((group) => group.items.length > 0);
  const libraryTitle = house.handle === "streamo" ? "My Games" : "Library";
  const avatarColor = colors.accent;
  const avatarImage = avatarOverride?.image ?? house.avatarUrl;
  const avatarIsOutline = avatarOverride?.mode === "outline" && !avatarImage;
  const visibleBannerIdentities = bannerVisible ? bannerIdentities.slice(0, 3) : [];
  const isOwnProfile = house.handle === ownerProfileHandle;

  return (
    <main className="min-h-full bg-[var(--profile-bg)] text-[var(--profile-text)]" style={profileThemeVars(colors)}>
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
        <article className="relative isolate overflow-hidden rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] shadow-[0_22px_90px_var(--profile-shadow)]">
          {isOwnProfile && (
            <Link
              aria-label="Profile settings"
              className="absolute right-3 top-3 z-30 inline-grid size-10 place-items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface)]/80 text-[var(--profile-text-soft)] backdrop-blur transition hover:border-[var(--profile-accent)] hover:text-[var(--profile-accent-strong)]"
              href="/settings?tab=appearance"
              title="Profile settings"
            >
              <Settings size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          )}
          {house.live && (
            <div className={`relative z-20 flex items-center justify-between gap-3 bg-[#ff1f3d] px-5 py-2.5 sm:px-7 ${isOwnProfile ? "pr-16 sm:pr-16" : ""}`}>
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-white" />
                </span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Live now
                </span>
                {house.statusLine && (
                  <span className="truncate text-[12px] font-normal text-white/85">{house.statusLine}</span>
                )}
              </div>
              {house.liveUrl && (
                <a
                  className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff1f3d] transition hover:opacity-90"
                  href={house.liveUrl}
                  target={house.liveUrl.startsWith("http") ? "_blank" : undefined}
                  rel={house.liveUrl.startsWith("http") ? "noreferrer" : undefined}
                >
                  Watch
                  <ArrowUpRight size={12} strokeWidth={2.2} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
          <div className="relative z-0 min-h-[150px] border-b border-[var(--profile-border)] sm:min-h-[168px]" style={{ background: house.bannerUrl ? `center / cover no-repeat url(${house.bannerUrl})` : profileCoverBackground(colors, cover.id) }}>
            {cover.grid && !house.bannerUrl && (
              <div className="pointer-events-none absolute inset-0 z-0 opacity-45 [background-image:linear-gradient(var(--profile-grid)_1px,transparent_1px),linear-gradient(90deg,var(--profile-grid)_1px,transparent_1px)] [background-size:44px_44px]" />
            )}
            {visibleBannerIdentities.length > 0 && (
              <div className="absolute left-5 right-16 top-4 z-10 flex flex-wrap gap-2 sm:left-7">
                {visibleBannerIdentities.map((identity) => (
                  <span
                    className="rounded-md border border-[var(--profile-accent)] bg-[var(--profile-surface)]/60 px-3 py-1.5 text-[10px] font-normal uppercase tracking-[0.13em] text-[var(--profile-accent-strong)] backdrop-blur"
                    key={identity}
                  >
                    {identity}
                  </span>
                ))}
              </div>
            )}
            <div className="absolute inset-x-5 bottom-4 z-10 sm:inset-x-7 sm:pl-[8.75rem]">
              <h1 className="max-w-3xl text-balance text-[30px] font-normal uppercase leading-[0.95] tracking-normal text-[var(--profile-text)] sm:text-[38px]">
                {house.name}
              </h1>
            </div>
          </div>

          <div className="relative z-10 px-5 pb-6 sm:px-7">
            <div className="grid gap-4 sm:grid-cols-[6.75rem_minmax(0,1fr)] sm:gap-5">
              <div
                className="relative z-20 -mt-[54px] grid size-[108px] shrink-0 place-items-center overflow-hidden rounded-full border-4 text-[52px] font-normal leading-none shadow-[0_20px_55px_var(--profile-shadow)]"
                style={{
                  background: avatarImage ? colors.surface : avatarIsOutline ? "transparent" : avatarColor,
                  borderColor: avatarIsOutline ? avatarColor : colors.surface,
                  color: avatarIsOutline ? avatarColor : colors.buttonText,
                }}
                aria-hidden="true"
              >
                {avatarImage ? <img alt="" className="h-full w-full object-cover" src={avatarImage} /> : house.initials}
              </div>
              <div className="min-w-0 pt-4 sm:pt-5">
                {house.statusLine && !house.live && (
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-normal text-[var(--profile-text-soft)]">{house.statusLine}</span>
                  </div>
                )}
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <p className="max-w-3xl text-[15px] leading-6 text-[var(--profile-text-soft)]">
                    {house.shortDescription}
                  </p>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5 lg:self-end">
                    <button className="inline-flex h-7 items-center rounded-md border border-[var(--profile-accent)] bg-[var(--profile-accent)] px-2.5 text-[9px] font-normal uppercase tracking-[0.1em] text-[var(--profile-button-text)] transition hover:opacity-90" type="button">
                      Follow
                    </button>
                    <button className="inline-flex h-7 items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-2.5 text-[9px] font-normal uppercase tracking-[0.1em] text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]" type="button">
                      Support
                    </button>
                    <button
                      aria-pressed={recommended}
                      className={
                        recommended
                          ? "inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] px-2.5 text-[9px] font-normal uppercase tracking-[0.1em] text-[var(--profile-accent-strong)] transition hover:opacity-90"
                          : "inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-2.5 text-[9px] font-normal uppercase tracking-[0.1em] text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]"
                      }
                      onClick={toggleRecommended}
                      type="button"
                    >
                      <Sparkles size={11} strokeWidth={1.9} aria-hidden="true" />
                      Recommend
                    </button>
                    <button
                      aria-label="More profile actions"
                      className="inline-grid size-7 place-items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]"
                      onClick={() => setActiveActionTab("professional")}
                      type="button"
                    >
                      <MoreVertical size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <aside className="grid content-start gap-4">
            <section className="grid gap-4 rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-4 lg:sticky lg:top-[72px]">
              <ProfileSpineBlock title="About">
                <p className="text-sm leading-6 text-[var(--profile-text-soft)]">{house.description}</p>
              </ProfileSpineBlock>

              <ProfileSpineBlock title="Identity">
                <PillList items={house.roles.slice(0, 5)} />
              </ProfileSpineBlock>

              <ProfileSpineBlock title="Vibe">
                <PillList items={house.vibes.slice(0, 5)} accent />
              </ProfileSpineBlock>

              {house.highlights && house.highlights.length > 0 && (
                <ProfileSpineBlock title="Stats">
                  <div className="grid gap-2">
                    {typeof house.level === "number" && (
                      <div className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-normal text-[var(--profile-text)]">Level {house.level}</span>
                          <span className="text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
                            {Math.round((house.levelProgress ?? 0) * 100)}% to {house.level + 1}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--profile-border)]">
                          <div className="h-full rounded-full bg-[var(--profile-accent)]" style={{ width: `${Math.round((house.levelProgress ?? 0) * 100)}%` }} />
                        </div>
                      </div>
                    )}
                    {house.highlights.slice(0, 4).map((highlight) => (
                      <div
                        className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3"
                        key={`${highlight.label}-${highlight.value}`}
                      >
                        <div className="text-lg font-normal leading-none text-[var(--profile-text)]">
                          {highlight.value}
                        </div>
                        <div className="mt-1 text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
                          {highlight.label}
                        </div>
                        {highlight.detail && (
                          <p className="mt-2 text-xs leading-5 text-[var(--profile-text-soft)]">
                            {highlight.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ProfileSpineBlock>
              )}

              {pinnedItems.length > 0 && (
                <ProfileSpineBlock title="Pinned">
                  <div className="grid gap-2">
                    {pinnedItems.map((item) => (
                      <PinnedItem item={item} key={item.id} />
                    ))}
                  </div>
                </ProfileSpineBlock>
              )}

              {showLibrary && (
                <ProfileSpineBlock title={libraryTitle}>
                  <div className="grid gap-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`rounded-md border px-3 py-2 text-[10px] font-normal uppercase tracking-[0.12em] transition ${
                          libraryFilter === "all"
                            ? "border-[var(--profile-accent)] bg-[var(--profile-accent)] text-[var(--profile-button-text)]"
                            : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-muted)] hover:border-[var(--profile-accent)] hover:text-[var(--profile-text)]"
                        }`}
                        onClick={() => setLibraryFilter("all")}
                        type="button"
                      >
                        All
                      </button>
                      {libraryTypes.map((type) => (
                        <button
                          className={`rounded-md border px-3 py-2 text-[10px] font-normal uppercase tracking-[0.12em] transition ${
                            libraryFilter === type
                              ? "border-[var(--profile-accent)] bg-[var(--profile-accent)] text-[var(--profile-button-text)]"
                              : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-muted)] hover:border-[var(--profile-accent)] hover:text-[var(--profile-text)]"
                          }`}
                          key={type}
                          onClick={() => setLibraryFilter(type)}
                          type="button"
                        >
                          {libraryTypeLabels[type]}
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-3">
                      {featuredLibraryItems.map((item) => (
                        <LibraryCard item={item} key={item.id} />
                      ))}
                    </div>
                    {linkedLibraryGroups.length > 0 && (
                      <div className="grid gap-4 border-t border-[var(--profile-border)] pt-4">
                        {linkedLibraryGroups.map((group) => (
                          <div className="grid gap-2" key={group.type}>
                            <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                              {libraryTypeLabels[group.type]}
                            </div>
                            <div className="divide-y divide-[var(--profile-border)] overflow-hidden rounded-md border border-[var(--profile-border)]">
                              {group.items.map((item) => (
                                <LibraryLinkRow item={item} key={item.id} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ProfileSpineBlock>
              )}
            </section>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)]">
            <div className="flex gap-2 overflow-x-auto border-b border-[var(--profile-border)] bg-[var(--profile-surface)] p-3">
              {profileActionTabs.map((tab) => (
                <button
                  className={`inline-flex h-8 shrink-0 items-center rounded-md border px-3 text-[10px] font-normal uppercase tracking-[0.12em] transition ${
                    activeActionTab === tab.key
                      ? "border-[var(--profile-accent)] bg-[var(--profile-accent)] text-[var(--profile-button-text)]"
                      : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-muted)] hover:border-[var(--profile-accent)] hover:text-[var(--profile-text)]"
                  }`}
                  key={tab.key}
                  onClick={() => setActiveActionTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {activeActionTab === "connect" && (
                <div id="contact" className="scroll-mt-24">
                  <ProfileTabHeader icon={<Link2 size={18} />} title="Connect" />
                  {nextScheduleItem && (
                    <div className="mb-5">
                      <div className="mb-3 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        {schedulePreviewLabel(nextScheduleItem.type)}
                      </div>
                      <SchedulePreview item={nextScheduleItem} />
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {coreLinks.map((link) => (
                      <RightRailLink link={link} key={`${link.label}-${link.url}`} />
                    ))}
                  </div>
                  {socialLinks.length > 0 && (
                    <div className="mt-5 border-t border-[var(--profile-border)] pt-5">
                      <div className="mb-3 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        Social
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {socialLinks.map((link) => (
                          <RightRailLink link={link} key={`${link.label}-${link.url}`} compact />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeActionTab === "offers" && (
                <div id="products" className="scroll-mt-24">
                  <ProfileTabHeader
                    icon={<Package size={18} />}
                    title={house.handle === "building-empires" ? "Products / Offers" : "Products / Services / Offers"}
                  />
                  {offerGroups.length > 0 ? (
                    <div className="grid gap-5">
                      {offerGroups.map((group) => (
                        <section className="grid gap-3" key={group.title}>
                          <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                            {group.title}
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            {group.items.map((item) => (
                              <ItemCard item={item} key={item.id} />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-6 text-[var(--profile-text-soft)]">
                      No public offers yet.
                    </p>
                  )}
                </div>
              )}

              {activeActionTab === "professional" && (
                <div id="professional" className="scroll-mt-24">
                  <ProfileTabHeader icon={<UserRound size={18} />} title="Professional profile" />

                  {professionalModules.length > 0 && (
                    <div className="grid gap-4">
                      {professionalModules.map((module) => (
                        <article key={module.id} className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-5">
                          <div className="mb-2 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-accent)]">
                            {profileRoomLabel(module.room, house.type)}
                          </div>
                          <h2 className="text-[24px] font-normal uppercase leading-tight text-[var(--profile-text)]">{module.title}</h2>
                          <p className="mt-3 text-sm leading-7 text-[var(--profile-text-soft)]">{module.body}</p>
                          {module.bullets && (
                            <div className="mt-4 grid gap-2 md:grid-cols-3">
                              {module.bullets.map((bullet) => (
                                <div key={bullet} className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-lift)] p-3 text-sm leading-5 text-[var(--profile-text-soft)]">
                                  {bullet}
                                </div>
                              ))}
                            </div>
                          )}
                          {module.cta && (
                            <a
                              href={module.cta.href}
                              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--profile-accent)] px-3 text-xs font-normal uppercase tracking-[0.12em] text-[var(--profile-accent-strong)] transition hover:bg-[var(--profile-accent-soft)]"
                            >
                              {module.cta.label}
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                          )}
                        </article>
                      ))}
                    </div>
                  )}

                  {workItems.length > 0 && (
                    <div className="mt-5 border-t border-[var(--profile-border)] pt-5">
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        <Grid3X3 size={14} aria-hidden="true" />
                        {workSectionTitle(house.name, house.type)}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {workItems.map((item) => (
                          <ItemCard item={item} key={item.id} />
                        ))}
                      </div>
                    </div>
                  )}

                  {connectedProfiles.length > 0 && (
                    <div className="mt-5 border-t border-[var(--profile-border)] pt-5">
                      <div className="mb-3 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        Work profile
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {connectedProfiles.map(({ label, house: relatedHouse }) => (
                          <Link
                            key={`${label}-${relatedHouse.id}`}
                            href={`/${relatedHouse.handle}`}
                            className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
                          >
                            <span className="block truncate text-sm font-normal text-[var(--profile-text)]">{relatedHouse.name}</span>
                            <span className="mt-1 block text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
                              {label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {schedule.length > 0 && (
                    <div className="mt-5 border-t border-[var(--profile-border)] pt-5">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        <CalendarDays size={14} aria-hidden="true" />
                        Schedule
                      </div>
                      <div className="divide-y divide-[var(--profile-border)] border-t border-[var(--profile-border)]">
                        {schedule.map((item) => (
                          <ScheduleRow item={item} key={item.id} />
                        ))}
                      </div>
                    </div>
                  )}

                  {updates.length > 0 && (
                    <div className="mt-5 border-t border-[var(--profile-border)] pt-5">
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-muted)]">
                        <Activity size={14} aria-hidden="true" />
                        Activity
                      </div>
                      <div className="grid gap-3">
                        {updates.map((update) => (
                          <a
                            key={update.id}
                            href={update.url ?? "#"}
                            target={update.url ? "_blank" : undefined}
                            rel={update.url ? "noreferrer" : undefined}
                            className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-normal text-[var(--profile-text)]">{update.title}</h3>
                              <span className={`shrink-0 border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(update.status)}`}>
                                {statusLabels[update.status]}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-[var(--profile-text-soft)]">{update.detail}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ProfileSpineBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="border-b border-[var(--profile-border)] pb-4">
      <div className="mb-3 text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--profile-muted)]">
        {title}
      </div>
      {children}
    </div>
  );
}

function PillList({ accent = false, items }: { accent?: boolean; items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className={`rounded-md border px-3 py-1 text-[10px] font-normal uppercase tracking-[0.12em] ${
            accent
              ? "border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] text-[var(--profile-accent-strong)]"
              : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-text-soft)]"
          }`}
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ProfileTabHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <span className="text-[var(--profile-accent)]">{icon}</span>
      <h2 className="text-lg font-normal text-[var(--profile-text)]">{title}</h2>
    </div>
  );
}

function PinnedItem({ item }: { item: HouseItem }) {
  const content = (
    <>
      <span className="min-w-0">
        <span className="mb-1 block text-[9px] font-normal uppercase tracking-[0.13em] text-[var(--profile-muted)]">
          {item.kindLabel ?? item.itemType}
        </span>
        <span className="block truncate text-sm font-normal text-[var(--profile-text)]">{item.title}</span>
      </span>
      {item.url && <ArrowUpRight size={13} className="shrink-0 text-[var(--profile-accent)]" aria-hidden="true" />}
    </>
  );

  if (!item.url) {
    return (
      <div className="flex min-h-14 items-center justify-between gap-3 rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-3 py-2">
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target={item.url.startsWith("http") ? "_blank" : undefined}
      rel={item.url.startsWith("http") ? "noreferrer" : undefined}
      className="flex min-h-14 items-center justify-between gap-3 rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-3 py-2 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
    >
      {content}
    </a>
  );
}

function SchedulePreview({ item }: { item: ScheduleItem }) {
  const content = (
    <>
      <span className="min-w-0">
        <span className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-accent-strong)]">
          {formatScheduleDate(item.startsAt)}
        </span>
        <span className="mt-2 block text-lg font-normal text-[var(--profile-text)]">{item.title}</span>
        <span className="mt-1 block text-sm leading-6 text-[var(--profile-text-soft)]">{item.detail}</span>
      </span>
      {item.url && <ArrowUpRight size={16} className="shrink-0 text-[var(--profile-accent)]" aria-hidden="true" />}
    </>
  );

  if (!item.url) {
    return (
      <div className="flex items-start justify-between gap-4 rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4">
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target={item.url.startsWith("http") ? "_blank" : undefined}
      rel={item.url.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-start justify-between gap-4 rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
    >
      {content}
    </a>
  );
}

function RightRailLink({ compact = false, link }: { compact?: boolean; link: HouseLink }) {
  return (
    <a
      href={link.url}
      target={link.url.startsWith("http") ? "_blank" : undefined}
      rel={link.url.startsWith("http") ? "noreferrer" : undefined}
      className="group rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="min-w-0">
          <span className={`${compact ? "text-sm" : "text-base"} block truncate font-normal text-[var(--profile-text)]`}>
            {link.label}
          </span>
          <span className="mt-1 block truncate text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
            {displayUrl(link.url)}
          </span>
        </span>
        <ArrowUpRight
          size={14}
          className="shrink-0 text-[var(--profile-accent)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

function LibraryCard({ item }: { item: ProfileLibraryItem }) {
  const card = (
    <article className="h-full rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
          {libraryTypeLabels[item.type]}
        </span>
        <span className="rounded-md border border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] text-[var(--profile-accent-strong)]">
          {libraryStatusLabels[item.status]}
        </span>
      </div>
      <h3 className="text-lg font-normal text-[var(--profile-text)]">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--profile-text-soft)]">{item.note}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );

  if (!item.url) return card;

  return (
    <a href={item.url} target={item.url.startsWith("http") ? "_blank" : undefined} rel={item.url.startsWith("http") ? "noreferrer" : undefined}>
      {card}
    </a>
  );
}

function LibraryLinkRow({ item }: { item: ProfileLibraryItem }) {
  const content = (
    <>
      <span className="min-w-0">
        <span className="block truncate text-sm font-normal text-[var(--profile-text)]">{item.title}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
          <span>{libraryStatusLabels[item.status]}</span>
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      </span>
      {item.url && <ArrowUpRight size={14} className="shrink-0 text-[var(--profile-accent)]" aria-hidden="true" />}
    </>
  );

  if (!item.url) {
    return (
      <div className="flex min-h-14 items-center justify-between gap-3 bg-[var(--profile-surface-soft)] px-3 py-2">
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target={item.url.startsWith("http") ? "_blank" : undefined}
      rel={item.url.startsWith("http") ? "noreferrer" : undefined}
      className="flex min-h-14 items-center justify-between gap-3 bg-[var(--profile-surface-soft)] px-3 py-2 transition hover:bg-[var(--profile-surface-lift)]"
    >
      {content}
    </a>
  );
}

function ItemCard({ item }: { item: HouseItem }) {
  return (
    <a
      href={item.url ?? "#"}
      target={item.url?.startsWith("http") ? "_blank" : undefined}
      rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
          {item.kindLabel ?? item.itemType}
        </span>
        <span className={`border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(item.status)}`}>
          {statusLabels[item.status]}
        </span>
      </div>
      <h3 className="text-lg font-normal text-[var(--profile-text)]">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--profile-text-soft)]">{item.description}</p>
      {(item.price || item.ctaLabel) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-text-soft)]">
          {item.price && <span className="text-[var(--profile-accent-strong)]">{item.price}</span>}
          {item.ctaLabel && <span>{item.ctaLabel}</span>}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </a>
  );
}

function ScheduleRow({ item }: { item: ScheduleItem }) {
  return (
    <a
      href={item.url ?? "#"}
      target={item.url?.startsWith("http") ? "_blank" : undefined}
      rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
      className="grid gap-3 py-4 transition hover:bg-[var(--profile-surface-soft)] sm:grid-cols-[140px_minmax(0,1fr)_auto]"
    >
      <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
        {formatScheduleDate(item.startsAt)}
      </span>
      <span className="min-w-0">
        <span className="mb-2 inline-flex border border-[var(--profile-border)] px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] text-[var(--profile-accent-strong)]">
          {scheduleTypeLabel(item.type)}
        </span>
        <span className="block text-base font-normal text-[var(--profile-text)]">{item.title}</span>
        {item.tags.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}
      </span>
      {item.url && (
        <span className="inline-flex max-w-[180px] items-center gap-2 truncate text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-accent-strong)] sm:justify-self-end">
          {displayUrl(item.url)}
          <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      )}
    </a>
  );
}

function scheduleTypeLabel(type: ScheduleItem["type"]) {
  return type.replace(/-/g, " ");
}

function formatScheduleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
