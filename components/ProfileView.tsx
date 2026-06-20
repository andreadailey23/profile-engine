"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Grid3X3,
  Link2,
  Package,
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
  ProfileViewType,
  ProfileThemeId,
  RoomType,
  ScheduleItem,
} from "@/lib/engine/types";
import { getProfileTheme, profileThemes } from "@/lib/engine/themes";
import type { ProfileRecord } from "@/lib/engine/selectors";

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

function productsSectionTitle(type: HouseType) {
  if (type === "book" || type === "collection" || type === "offer") return "Buy";
  if (type === "product" || type === "app") return "Use / buy";
  return "Products";
}

function profileThemeStorageKey(handle: string) {
  return `building-empires-profile-theme-${handle}`;
}

function profileAvatarStorageKey(handle: string) {
  return `building-empires-profile-avatar-${handle}`;
}

function validThemeId(value: string | null): ProfileThemeId | undefined {
  return profileThemes.some((theme) => theme.id === value) ? (value as ProfileThemeId) : undefined;
}

type AvatarSettings = {
  color: string;
  image?: string;
  mode: "fill" | "outline";
};

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

function profileThemeVars(theme: ReturnType<typeof getProfileTheme>) {
  return {
    "--profile-bg": theme.colors.canvas,
    "--profile-surface": theme.colors.surface,
    "--profile-surface-soft": theme.colors.surfaceSoft,
    "--profile-surface-lift": theme.colors.surfaceLift,
    "--profile-border": theme.colors.border,
    "--profile-border-strong": theme.colors.borderStrong,
    "--profile-text": theme.colors.text,
    "--profile-text-soft": theme.colors.textSoft,
    "--profile-muted": theme.colors.muted,
    "--profile-accent": theme.colors.accent,
    "--profile-accent-strong": theme.colors.accentStrong,
    "--profile-accent-soft": theme.colors.accentSoft,
    "--profile-button-text": theme.colors.buttonText,
    "--profile-shadow": theme.colors.shadow,
    "--profile-grid": theme.colors.grid,
  } as CSSProperties;
}

function coverBackground(color: string, theme: ReturnType<typeof getProfileTheme>) {
  const accent = color === "#050505" ? "#ff6a00" : color;

  return `
    linear-gradient(118deg, ${accent}42 0%, ${theme.colors.accentSoft} 34%, transparent 64%),
    linear-gradient(180deg, ${theme.colors.surfaceLift} 0%, ${theme.colors.surface} 100%)
  `;
}

type Props = {
  profile: NonNullable<ProfileRecord>;
};

const viewLabels: Record<ProfileViewType, string> = {
  default: "Profile",
  social: "Social",
  marketplace: "Marketplace",
  professional: "Professional",
  content: "Content",
  schedule: "Schedule",
  support: "Support",
  updates: "Updates",
};

const viewRooms: Record<ProfileViewType, RoomType[]> = {
  default: ["identity", "positioning", "work", "products", "library", "links", "activity"],
  social: ["posts", "activity", "schedule", "community", "library", "links"],
  marketplace: ["products", "offers", "shop", "books", "support", "links"],
  professional: ["positioning", "proof", "work", "reports", "contact"],
  content: ["posts", "media", "channels", "books", "library", "activity", "links"],
  schedule: ["schedule", "contact", "links"],
  support: ["support", "offers", "products", "contact", "links"],
  updates: ["activity", "updates", "posts"],
};

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
  const selectedViews = useMemo<ProfileViewType[]>(
    () => (house.selectedViews && house.selectedViews.length > 0 ? house.selectedViews.slice(0, 3) : ["default"]),
    [house.selectedViews],
  );
  const initialView =
    house.defaultView && selectedViews.includes(house.defaultView)
      ? house.defaultView
      : selectedViews[0] ?? "default";
  const [activeView, setActiveView] = useState<ProfileViewType>(initialView);
  const [avatarOverride, setAvatarOverride] = useState<AvatarSettings | undefined>();
  const [libraryFilter, setLibraryFilter] = useState<ProfileLibraryItemType | "all">("all");
  const [themeOverride, setThemeOverride] = useState<ProfileThemeId | undefined>();
  const theme = getProfileTheme(themeOverride ?? house.themeId);

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

  const activeRooms = viewRooms[activeView] ?? viewRooms.default;
  const roomModules = useMemo(
    () => modules.filter((module) => activeRooms.includes(module.room)),
    [activeRooms, modules],
  );

  const workItems = useMemo(
    () => items.filter((item) => itemDisplayGroup(item) === "work"),
    [items],
  );
  const productItems = useMemo(
    () => items.filter((item) => itemDisplayGroup(item) === "product"),
    [items],
  );
  const showWorkItems = ["default", "professional", "content", "social"].includes(activeView);
  const showProductItems = ["default", "marketplace", "support"].includes(activeView);
  const visibleWorkItems = showWorkItems ? workItems : [];
  const visibleProductItems = showProductItems ? productItems : [];

  const visibleSchedule = ["default", "social", "schedule"].includes(activeView) ? schedule : [];
  const visibleUpdates = ["default", "social", "content", "updates", "professional"].includes(activeView) ? updates : [];
  const connectedProfiles = [
    ...parentHouses.map((item) => ({ label: "part of", house: item })),
    ...ownerHouses.map((item) => ({ label: "built by", house: item })),
    ...ownsHouses.map((item) => ({ label: "connected", house: item })),
    ...childHouses.map((item) => ({ label: "contains", house: item })),
    ...relatedHouses.map((item) => ({ label: "also connected", house: item })),
  ];
  const socialLinks = links.filter((link) => link.type === "social");
  const coreLinks = links.filter((link) => link.type !== "social");
  const rightRailOffers = items
    .filter(
      (item) =>
        itemDisplayGroup(item) === "product" ||
        ["book", "collection", "course", "offer", "service", "store", "tool"].includes(item.itemType),
    )
    .slice(0, 4);
  const showLinks = activeRooms.includes("links");
  const showLibrary = activeRooms.includes("library") && libraryItems.length > 0;
  const libraryTypes = Array.from(new Set(libraryItems.map((item) => item.type)));
  const visibleLibraryItems =
    libraryFilter === "all" ? libraryItems : libraryItems.filter((item) => item.type === libraryFilter);
  const libraryTitle = house.handle === "streamo" ? "My Games" : "Library";
  const avatarColor = avatarOverride?.color ?? house.primaryColor;
  const avatarImage = avatarOverride?.image;
  const avatarIsOutline = avatarOverride?.mode === "outline" && !avatarImage;

  return (
    <main className="min-h-full bg-[var(--profile-bg)] text-[var(--profile-text)]" style={profileThemeVars(theme)}>
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
        <article className="relative isolate overflow-hidden rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] shadow-[0_22px_90px_var(--profile-shadow)]">
          <div className="relative z-0 min-h-[230px] border-b border-[var(--profile-border)]" style={{ background: coverBackground(house.primaryColor, theme) }}>
            <div className="pointer-events-none absolute inset-0 z-0 opacity-45 [background-image:linear-gradient(var(--profile-grid)_1px,transparent_1px),linear-gradient(90deg,var(--profile-grid)_1px,transparent_1px)] [background-size:44px_44px]" />
          </div>

          <div className="relative z-10 px-5 pb-6 sm:px-7">
            <div className="-mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div
                    className="relative z-20 grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 text-[48px] font-normal leading-none shadow-[0_20px_55px_var(--profile-shadow)]"
                    style={{
                      background: avatarImage ? theme.colors.surface : avatarIsOutline ? "transparent" : avatarColor,
                      borderColor: avatarIsOutline ? avatarColor : theme.colors.surface,
                      color: avatarIsOutline ? avatarColor : theme.colors.buttonText,
                    }}
                    aria-hidden="true"
                  >
                    {avatarImage ? <img alt="" className="h-full w-full object-cover" src={avatarImage} /> : house.initials}
                  </div>
                  <div className="min-w-0 pb-1">
                    <h1 className="max-w-5xl text-[38px] font-normal uppercase leading-[0.95] tracking-normal text-[var(--profile-text)] sm:text-5xl lg:text-6xl">
                      {house.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--profile-text-soft)] sm:text-lg">
                      {house.shortDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button className="inline-flex min-h-11 items-center rounded-md border border-[var(--profile-accent)] bg-[var(--profile-accent)] px-4 text-sm font-normal text-[var(--profile-button-text)] transition hover:opacity-90" type="button">
                  Follow
                </button>
                <button className="inline-flex min-h-11 items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-4 text-sm font-normal text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]" type="button">
                  Support
                </button>
                <a className="inline-flex min-h-11 items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-4 text-sm font-normal text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]" href="#contact">
                  Contact
                </a>
                <a className="inline-flex min-h-11 items-center rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-4 text-sm font-normal text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]" href="#links">
                  More
                </a>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
          <aside className="grid content-start gap-4">
            <section className="rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-4 lg:sticky lg:top-[72px]">
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
                <ProfileSpineBlock title="Highlights">
                  <div className="grid gap-2">
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

              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--profile-muted)]">
                  <Grid3X3 size={14} aria-hidden="true" />
                  Navigation
                </div>
                <div className="grid gap-1">
                  {selectedViews.map((view) => (
                    <ViewButton
                      key={view}
                      active={activeView === view}
                      label={viewLabels[view]}
                      onClick={() => setActiveView(view)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </aside>

          <section className="grid min-w-0 content-start gap-5">
            {showLinks && links.length > 0 && (
              <ProfileSection icon={<Link2 size={17} />} id="links" title="Links and socials">
                <div className="grid gap-3 md:grid-cols-2">
                  {coreLinks.map((link, index) => (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex min-h-[76px] items-center justify-between gap-4 rounded-md border p-4 transition ${
                        index === 0
                          ? "border-[var(--profile-accent)] bg-[var(--profile-accent)] text-[var(--profile-button-text)] hover:opacity-90"
                          : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-text)] hover:border-[var(--profile-accent)]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-base font-normal">{link.label}</span>
                        <span className={`mt-1 block truncate text-sm ${index === 0 ? "opacity-70" : "text-[var(--profile-muted)]"}`}>
                          {displayUrl(link.url)}
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
                {socialLinks.length > 0 && (
                  <div className="mt-4 border-t border-[var(--profile-border)] pt-4">
                    <p className="mb-3 text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
                      social profiles
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {socialLinks.map((link) => (
                        <a
                          key={`${link.label}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3 text-sm font-normal text-[var(--profile-text)] transition hover:border-[var(--profile-accent)]"
                        >
                          <span className="block">{link.label}</span>
                          <span className="mt-1 block truncate text-xs text-[var(--profile-muted)]">{displayUrl(link.url)}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </ProfileSection>
            )}

            {showLibrary && (
              <ProfileSection icon={<BookOpen size={17} />} id="library" title={libraryTitle}>
                <div className="grid gap-4">
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
                  <div className="grid gap-3 md:grid-cols-2">
                    {visibleLibraryItems.map((item) => (
                      <LibraryCard item={item} key={item.id} />
                    ))}
                  </div>
                </div>
              </ProfileSection>
            )}

            {roomModules.length > 0 && (
              <ProfileSection icon={<Grid3X3 size={17} />} id="sections" title="Profile sections">
                <div className="grid gap-4">
                  {roomModules.map((module) => (
                    <article key={module.id} className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-5">
                      <div
                        className="mb-2 text-[10px] font-normal uppercase tracking-[0.16em] text-[var(--profile-accent)]"
                      >
                        {profileRoomLabel(module.room, house.type)}
                      </div>
                      <h2 className="text-[25px] font-normal uppercase leading-tight text-[var(--profile-text)]">{module.title}</h2>
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
              </ProfileSection>
            )}

            {visibleWorkItems.length > 0 && (
              <ProfileSection icon={<Grid3X3 size={17} />} id="work" title={workSectionTitle(house.name, house.type)}>
                <div className="grid gap-3 md:grid-cols-2">
                  {visibleWorkItems.map((item) => (
                    <ItemCard item={item} key={item.id} />
                  ))}
                </div>
              </ProfileSection>
            )}

            {visibleProductItems.length > 0 && (
              <ProfileSection icon={<Package size={17} />} id="products" title={productsSectionTitle(house.type)}>
                <div className="grid gap-3 md:grid-cols-2">
                  {visibleProductItems.map((item) => (
                    <ItemCard item={item} key={item.id} />
                  ))}
                </div>
              </ProfileSection>
            )}

            {visibleSchedule.length > 0 && (
              <ProfileSection icon={<CalendarDays size={17} />} id="schedule" title="Schedule">
                <div className="divide-y divide-[var(--profile-border)] border-t border-[var(--profile-border)]">
                  {visibleSchedule.map((item) => (
                    <ScheduleRow item={item} key={item.id} />
                  ))}
                </div>
              </ProfileSection>
            )}

            {visibleUpdates.length > 0 && (
              <ProfileSection icon={<Activity size={17} />} id="activity" title="Activity">
                <div className="grid gap-3">
                  {visibleUpdates.map((update) => (
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
              </ProfileSection>
            )}

          </section>

          <aside className="grid content-start gap-5">
            {(coreLinks.length > 0 || socialLinks.length > 0) && (
              <Panel icon={<Link2 size={17} />} title="Connect">
                <div className="grid gap-2">
                  {coreLinks.slice(0, 4).map((link) => (
                    <RightRailLink link={link} key={`${link.label}-${link.url}`} />
                  ))}
                </div>
                {socialLinks.length > 0 && (
                  <div className="mt-3 border-t border-[var(--profile-border)] pt-3">
                    <div className="mb-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
                      Social
                    </div>
                    <div className="grid gap-2">
                      {socialLinks.slice(0, 4).map((link) => (
                        <RightRailLink link={link} key={`${link.label}-${link.url}`} compact />
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            {rightRailOffers.length > 0 && (
              <Panel icon={<Package size={17} />} title="Products / Services / Offers">
                <div className="grid gap-2">
                  {rightRailOffers.map((item) => (
                    <RightRailItem item={item} key={item.id} />
                  ))}
                </div>
              </Panel>
            )}

            {connectedProfiles.length > 0 && (
              <Panel icon={<UserRound size={17} />} title="Work Profile">
                <div className="grid gap-2">
                  {connectedProfiles.map(({ label, house: relatedHouse }) => (
                    <Link
                      key={`${label}-${relatedHouse.id}`}
                      href={`/${relatedHouse.handle}`}
                      className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
                    >
                      <span className="block truncate text-sm font-normal text-[var(--profile-text)]">{relatedHouse.name}</span>
                      <span className="mt-1 block text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </Panel>
            )}
          </aside>
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

function ViewButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-md px-3 text-left text-[12px] font-normal uppercase tracking-[0.12em] transition ${
        active
          ? "bg-[var(--profile-accent)] text-[var(--profile-button-text)]"
          : "text-[var(--profile-muted)] hover:bg-[var(--profile-surface-soft)] hover:text-[var(--profile-text)]"
      }`}
    >
      {label}
    </button>
  );
}

function ProfileSection({
  children,
  icon,
  id,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-5">
      <div className="flex items-center gap-2">
        <span className="text-[var(--profile-accent)]">{icon}</span>
        <h2 className="text-lg font-normal text-[var(--profile-text)]">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-6 text-[var(--profile-text-soft)]">{children}</div>
    </section>
  );
}

function Panel({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--profile-muted)]">
        <span className="text-[var(--profile-accent)]">{icon}</span>
        {title}
      </div>
      {children}
    </section>
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

function RightRailItem({ item }: { item: HouseItem }) {
  const content = (
    <span className="block">
      <span className="mb-2 block text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-muted)]">
        {item.kindLabel ?? item.itemType}
      </span>
      <span className="block text-sm font-normal text-[var(--profile-text)]">{item.title}</span>
      {(item.price || item.ctaLabel) && (
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-accent-strong)]">
          {item.price && <span>{item.price}</span>}
          {item.ctaLabel && <span>{item.ctaLabel}</span>}
        </span>
      )}
    </span>
  );

  if (!item.url) {
    return (
      <div className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3">
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target={item.url.startsWith("http") ? "_blank" : undefined}
      rel={item.url.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-3 transition hover:border-[var(--profile-accent)] hover:bg-[var(--profile-surface-lift)]"
    >
      {content}
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
