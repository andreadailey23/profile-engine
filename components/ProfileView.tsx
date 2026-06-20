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
  Package,
  Sparkles,
  UserRound,
} from "lucide-react";
import type {
  HouseItem,
  HouseStatus,
  HouseType,
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

function validThemeId(value: string | null): ProfileThemeId | undefined {
  return profileThemes.some((theme) => theme.id === value) ? (value as ProfileThemeId) : undefined;
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

type ProfileRoom = RoomType | "overview";

export default function ProfileView({ profile }: Props) {
  const {
    house,
    visibleRooms,
    modules,
    links,
    parentHouses,
    childHouses,
    ownerHouses,
    ownsHouses,
    relatedHouses,
    items,
    schedule,
    updates,
  } = profile;
  const [activeRoom, setActiveRoom] = useState<ProfileRoom>("overview");
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

  const roomModules = useMemo(
    () =>
      activeRoom === "overview"
        ? []
        : modules.filter((module) => module.room === activeRoom),
    [activeRoom, modules],
  );

  const workItems = useMemo(
    () => items.filter((item) => itemDisplayGroup(item) === "work"),
    [items],
  );
  const productItems = useMemo(
    () => items.filter((item) => itemDisplayGroup(item) === "product"),
    [items],
  );
  const showWorkItems =
    activeRoom === "overview" ||
    ["work", "channels", "media", "games", "streams", "community"].includes(activeRoom);
  const showProductItems =
    activeRoom === "overview" ||
    ["products", "shop", "books", "offers", "support", "buy"].includes(activeRoom);
  const visibleWorkItems = showWorkItems ? workItems : [];
  const visibleProductItems = showProductItems ? productItems : [];

  const visibleSchedule = activeRoom === "overview" || activeRoom === "schedule" ? schedule : [];
  const visibleUpdates = activeRoom === "overview" || activeRoom === "activity" ? updates : [];
  const connectedProfiles = [
    ...parentHouses.map((item) => ({ label: "part of", house: item })),
    ...ownerHouses.map((item) => ({ label: "built by", house: item })),
    ...ownsHouses.map((item) => ({ label: "connected", house: item })),
    ...childHouses.map((item) => ({ label: "contains", house: item })),
    ...relatedHouses.map((item) => ({ label: "also connected", house: item })),
  ];
  const overviewStats = [
    { label: "sections", value: visibleRooms.length },
    { label: "links", value: links.length },
    { label: "work", value: workItems.length },
    { label: "products", value: productItems.length },
  ];
  const socialLinks = links.filter((link) => link.type === "social");
  const coreLinks = links.filter((link) => link.type !== "social");
  const profileSharePath = `/${house.handle}`;
  const identityTitle = house.type === "person" || house.type === "creator" ? "Who I am" : "What this is";
  const identityCards = [
    {
      label: "about",
      value: house.description,
    },
    {
      label: "work",
      value:
        workItems.length > 0
          ? workItems
              .slice(0, 4)
              .map((item) => item.title)
              .join(" / ")
          : visibleRooms.slice(0, 4).map(roomLabel).join(" / "),
    },
    {
      label: "vibe",
      value: Array.from(new Set([...house.vibes, ...house.tags])).slice(0, 7).join(" / "),
    },
    {
      label: "start",
      value: links[0] ? `${links[0].label} / ${displayUrl(links[0].url)}` : profileSharePath,
    },
  ];

  return (
    <main className="min-h-full bg-[var(--profile-bg)] text-[var(--profile-text)]" style={profileThemeVars(theme)}>
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
        <article className="relative isolate overflow-hidden rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] shadow-[0_22px_90px_var(--profile-shadow)]">
          <div className="relative z-0 min-h-[230px] border-b border-[var(--profile-border)]" style={{ background: coverBackground(house.primaryColor, theme) }}>
            <div className="pointer-events-none absolute inset-0 z-0 opacity-45 [background-image:linear-gradient(var(--profile-grid)_1px,transparent_1px),linear-gradient(90deg,var(--profile-grid)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2 sm:left-7">
              <span className={`rounded-full border px-3 py-1 text-[10px] font-normal uppercase tracking-[0.14em] ${statusStyle(house.status)}`}>
                {statusLabels[house.status]}
              </span>
              <span className="rounded-full border border-[var(--profile-border-strong)] bg-[var(--profile-surface-soft)] px-3 py-1 text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-text)] backdrop-blur">
                {house.type}
              </span>
            </div>
          </div>

          <div className="relative z-10 px-5 pb-6 sm:px-7">
            <div className="-mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <div
                  className="relative z-20 mb-5 grid size-24 place-items-center rounded-full border-4 border-[var(--profile-surface)] text-[48px] font-normal leading-none shadow-[0_20px_55px_var(--profile-shadow)]"
                  style={{
                    background: house.primaryColor,
                    color: theme.colors.buttonText,
                  }}
                  aria-hidden="true"
                >
                  {house.initials}
                </div>
                <h1 className="max-w-5xl text-[42px] font-normal uppercase leading-[0.95] tracking-normal text-[var(--profile-text)] sm:text-6xl lg:text-7xl">
                  {house.name}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--profile-text-soft)] sm:text-lg">
                  {house.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {links.slice(0, 3).map((link, index) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-normal transition ${
                      index === 0
                        ? "border-[var(--profile-accent)] bg-[var(--profile-accent)] text-[var(--profile-button-text)] hover:opacity-90"
                        : "border-[var(--profile-border)] bg-[var(--profile-surface-soft)] text-[var(--profile-text)] hover:border-[var(--profile-border-strong)]"
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-[var(--profile-border)] pt-5 sm:grid-cols-4">
              {overviewStats.map((stat) => (
                <div key={stat.label} className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4">
                  <div className="text-3xl font-normal leading-none text-[var(--profile-text)]">{stat.value}</div>
                  <div className="mt-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
              {house.vibes.map((vibe) => (
                <span key={vibe} className="text-[var(--profile-accent-strong)]">{vibe}</span>
              ))}
              {house.tags.map((tag) => (
                <span key={tag} className="text-[var(--profile-accent)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <section className="mt-5 rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-5">
          <div className="flex items-center gap-2">
            <span className="text-[var(--profile-accent)]">
              <UserRound size={17} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-normal text-[var(--profile-text)]">{identityTitle}</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {identityCards.map((card) => (
              <article key={card.label} className="rounded-md border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] p-4">
                <div className="text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-muted)]">
                  {card.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--profile-text-soft)]">{card.value}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <aside className="grid content-start gap-4">
            <section className="rounded-lg border border-[var(--profile-border)] bg-[var(--profile-surface)] p-4 lg:sticky lg:top-[72px]">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[var(--profile-muted)]">
                <Grid3X3 size={14} aria-hidden="true" />
                sections
              </div>
              <div className="grid gap-1">
                <RoomButton active={activeRoom === "overview"} label="overview" onClick={() => setActiveRoom("overview")} />
                {visibleRooms.map((room) => (
                  <RoomButton
                    key={room}
                    active={activeRoom === room}
                    label={profileRoomLabel(room, house.type)}
                    onClick={() => setActiveRoom(room)}
                  />
                ))}
              </div>
            </section>
          </aside>

          <section className="grid min-w-0 content-start gap-5">
            <ProfileSection icon={<Sparkles size={17} />} id="overview" title="Overview">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <p className="text-base leading-7 text-[var(--profile-text-soft)]">{house.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {house.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[var(--profile-border)] bg-[var(--profile-surface-soft)] px-3 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--profile-text-soft)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-[var(--profile-accent)] bg-[var(--profile-accent-soft)] p-4">
                  <p className="text-[10px] font-normal uppercase tracking-[0.14em] text-[var(--profile-accent-strong)]">Profile state</p>
                  <p className="mt-2 text-2xl font-normal leading-tight text-[var(--profile-text)]">{statusLabels[house.status]}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--profile-text-soft)]">
                    One identity layer with reusable public sections.
                  </p>
                </div>
              </div>
            </ProfileSection>

            {links.length > 0 && (
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
            {connectedProfiles.length > 0 && (
              <Panel icon={<UserRound size={17} />} title="Connected">
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

function RoomButton({
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
        <h2 className="text-xl font-normal text-[var(--profile-text)]">{title}</h2>
      </div>
      <div className="mt-4 text-base leading-7 text-[var(--profile-text-soft)]">{children}</div>
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
