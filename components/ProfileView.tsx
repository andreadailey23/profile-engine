"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
  RoomType,
  ScheduleItem,
} from "@/lib/engine/types";
import type { ProfileRecord } from "@/lib/engine/selectors";

const statusLabels: Record<HouseStatus, string> = {
  building: "building",
  live: "live",
  selling: "selling",
  testing: "testing",
  paused: "paused",
  planned: "planned",
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

function coverBackground(color: string) {
  const accent = color === "#050505" ? "#ff6a00" : color;

  return `
    radial-gradient(circle at 16% 18%, ${accent}66, transparent 28%),
    radial-gradient(circle at 86% 16%, rgba(255, 255, 255, 0.16), transparent 24%),
    linear-gradient(135deg, ${accent}33 0%, rgba(255,255,255,0.06) 42%, rgba(5,5,5,0.92) 100%)
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

  const roomModules = useMemo(
    () =>
      activeRoom === "overview"
        ? []
        : modules.filter((module) => module.room === activeRoom),
    [activeRoom, modules],
  );

  const visibleItems = useMemo(
    () =>
      activeRoom === "overview" ||
      ["products", "shop", "books", "channels", "games", "work", "offers", "support"].includes(activeRoom)
        ? items.filter((item) => item.itemType !== "pick")
        : [],
    [activeRoom, items],
  );

  const visibleSchedule = activeRoom === "overview" || activeRoom === "schedule" ? schedule : [];
  const visibleUpdates = activeRoom === "overview" || activeRoom === "activity" ? updates : [];
  const relationships = [
    ...parentHouses.map((item) => ({ label: "part of", house: item })),
    ...ownerHouses.map((item) => ({ label: "owned by", house: item })),
    ...ownsHouses.map((item) => ({ label: "runs", house: item })),
    ...childHouses.map((item) => ({ label: "contains", house: item })),
    ...relatedHouses.map((item) => ({ label: "related", house: item })),
  ];
  const overviewStats = [
    { label: "sections", value: visibleRooms.length },
    { label: "links", value: links.length },
    { label: "items", value: items.length },
    { label: "updates", value: updates.length + schedule.length },
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
        items.length > 0
          ? items
              .filter((item) => item.itemType !== "pick")
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
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
        <article className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-[0_22px_90px_rgba(0,0,0,0.28)]">
          <div className="relative min-h-[230px] border-b border-white/10" style={{ background: coverBackground(house.primaryColor) }}>
            <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7">
              <span className={`rounded-full border px-3 py-1 text-[10px] font-normal uppercase tracking-[0.14em] ${statusStyle(house.status)}`}>
                {statusLabels[house.status]}
              </span>
              <span className="rounded-full border border-white/18 bg-black/25 px-3 py-1 text-[10px] font-normal uppercase tracking-[0.14em] text-white backdrop-blur">
                {house.type}
              </span>
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <div
                  className="mb-5 grid size-24 place-items-center rounded-full border-4 border-[#0d0d0d] text-[48px] font-normal leading-none shadow-[0_20px_55px_rgba(0,0,0,0.28)]"
                  style={{
                    background: house.primaryColor,
                    color: house.primaryColor === "#050505" ? "#fff8ed" : "#050505",
                  }}
                  aria-hidden="true"
                >
                  {house.initials}
                </div>
                <h1 className="max-w-5xl text-[42px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
                  {house.name}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#d8cfc0] sm:text-lg">
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
                        ? "border-[#ff6a00] bg-[#ff6a00] text-black hover:bg-[#e55f00]"
                        : "border-white/10 bg-white/[0.035] text-white hover:border-white/25"
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
              {overviewStats.map((stat) => (
                <div key={stat.label} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                  <div className="text-3xl font-normal leading-none text-white">{stat.value}</div>
                  <div className="mt-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
              {house.vibes.map((vibe) => (
                <span key={vibe} className="text-[#ffb16b]">{vibe}</span>
              ))}
              {house.tags.map((tag) => (
                <span key={tag} style={{ color: house.primaryColor === "#050505" ? "#a99f91" : house.primaryColor }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <section className="mt-5 rounded-lg border border-white/10 bg-[#0d0d0d] p-5">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6a00]">
              <UserRound size={17} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-normal text-white">{identityTitle}</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {identityCards.map((card) => (
              <article key={card.label} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <div className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
                  {card.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#d8cfc0]">{card.value}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <aside className="grid content-start gap-4">
            <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4 lg:sticky lg:top-[72px]">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
                <Grid3X3 size={14} aria-hidden="true" />
                sections
              </div>
              <div className="grid gap-1">
                <RoomButton active={activeRoom === "overview"} label="overview" onClick={() => setActiveRoom("overview")} />
                {visibleRooms.map((room) => (
                  <RoomButton
                    key={room}
                    active={activeRoom === room}
                    label={roomLabel(room)}
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
                  <p className="text-base leading-7 text-[#d8cfc0]">{house.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {house.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-[#c8bdae]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-[#ff6a00]/25 bg-[#ff6a00]/10 p-4">
                  <p className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#ffb16b]">Profile state</p>
                  <p className="mt-2 text-2xl font-normal leading-tight text-white">{statusLabels[house.status]}</p>
                  <p className="mt-2 text-sm leading-6 text-[#c8bdae]">
                    A public profile with sections, links, products, activity, and context.
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
                          ? "border-[#ff6a00]/40 bg-[#ff6a00] text-black hover:bg-[#e55f00]"
                          : "border-white/10 bg-white/[0.035] text-white hover:border-[#ff6a00]/50"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-base font-normal">{link.label}</span>
                        <span className={`mt-1 block truncate text-sm ${index === 0 ? "text-black/70" : "text-[#8f8577]"}`}>
                          {displayUrl(link.url)}
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
                {socialLinks.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="mb-3 text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
                      social profiles
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {socialLinks.map((link) => (
                        <a
                          key={`${link.label}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm font-normal text-white transition hover:border-[#ff6a00]/45"
                        >
                          <span className="block">{link.label}</span>
                          <span className="mt-1 block truncate text-xs text-[#8f8577]">{displayUrl(link.url)}</span>
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
                    <article key={module.id} className="rounded-md border border-white/10 bg-white/[0.035] p-5">
                      <div
                        className="mb-2 text-[10px] font-normal uppercase tracking-[0.16em]"
                        style={{ color: house.primaryColor === "#050505" ? "#a99f91" : house.primaryColor }}
                      >
                        {roomLabel(module.room)}
                      </div>
                      <h2 className="text-[25px] font-normal uppercase leading-tight text-white">{module.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-[#c8bdae]">{module.body}</p>
                      {module.bullets && (
                        <div className="mt-4 grid gap-2 md:grid-cols-3">
                          {module.bullets.map((bullet) => (
                            <div key={bullet} className="rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-5 text-[#d8cfc0]">
                              {bullet}
                            </div>
                          ))}
                        </div>
                      )}
                      {module.cta && (
                        <a
                          href={module.cta.href}
                          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#ff6a00]/35 px-3 text-xs font-normal uppercase tracking-[0.12em] text-[#ffb16b] transition hover:border-[#ff6a00]"
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

            {visibleItems.length > 0 && (
              <ProfileSection icon={<Package size={17} />} id="products" title="Products and offers">
                <div className="grid gap-3 md:grid-cols-2">
                  {visibleItems.map((item) => (
                    <ItemCard item={item} key={item.id} />
                  ))}
                </div>
              </ProfileSection>
            )}

            {visibleSchedule.length > 0 && (
              <ProfileSection icon={<CalendarDays size={17} />} id="schedule" title="Schedule">
                <div className="divide-y divide-white/10 border-t border-white/10">
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
                      className="rounded-md border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#ff6a00]/45"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-normal text-white">{update.title}</h3>
                        <span className={`shrink-0 border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(update.status)}`}>
                          {statusLabels[update.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#b8ad9f]">{update.detail}</p>
                    </a>
                  ))}
                </div>
              </ProfileSection>
            )}

          </section>

          <aside className="grid content-start gap-5">
            {relationships.length > 0 && (
              <Panel icon={<UserRound size={17} />} title="Relationships">
                <div className="grid gap-2">
                  {relationships.map(({ label, house: relatedHouse }) => (
                    <Link
                      key={`${label}-${relatedHouse.id}`}
                      href={`/${relatedHouse.handle}`}
                      className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#ff6a00]/45"
                    >
                      <span className="block truncate text-sm font-normal text-white">{relatedHouse.name}</span>
                      <span className="mt-1 block text-[10px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
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
          ? "bg-[#ff6a00] text-black"
          : "text-[#a99f91] hover:bg-white/[0.04] hover:text-white"
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
    <section id={id} className="scroll-mt-24 rounded-lg border border-white/10 bg-[#0d0d0d] p-5">
      <div className="flex items-center gap-2">
        <span className="text-[#ff6a00]">{icon}</span>
        <h2 className="text-xl font-normal text-white">{title}</h2>
      </div>
      <div className="mt-4 text-base leading-7 text-[#c8bdae]">{children}</div>
    </section>
  );
}

function Panel({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
        <span className="text-[#ff6a00]">{icon}</span>
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
      className="rounded-md border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#ff6a00]/45"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
          {item.itemType}
        </span>
        <span className={`border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(item.status)}`}>
          {statusLabels[item.status]}
        </span>
      </div>
      <h3 className="text-lg font-normal text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#b8ad9f]">{item.description}</p>
      {(item.price || item.ctaLabel) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-normal uppercase tracking-[0.12em] text-[#d8cfc0]">
          {item.price && <span className="text-[#ffb16b]">{item.price}</span>}
          {item.ctaLabel && <span>{item.ctaLabel}</span>}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
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
      className="grid gap-3 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[140px_minmax(0,1fr)_auto]"
    >
      <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
        {formatScheduleDate(item.startsAt)}
      </span>
      <span className="min-w-0">
        <span className="mb-2 inline-flex border border-white/10 px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] text-[#ffb16b]">
          {scheduleTypeLabel(item.type)}
        </span>
        <span className="block text-base font-normal text-white">{item.title}</span>
        {item.tags.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}
      </span>
      {item.url && (
        <span className="inline-flex max-w-[180px] items-center gap-2 truncate text-[10px] font-normal uppercase tracking-[0.12em] text-[#ffb16b] sm:justify-self-end">
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
