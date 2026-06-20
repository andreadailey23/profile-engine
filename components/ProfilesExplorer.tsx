"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { House, HouseStatus, HouseType } from "@/lib/engine/types";

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
  if (status === "live") return "border-emerald-400/30 text-emerald-200";
  if (status === "selling") return "border-amber-300/30 text-amber-200";
  if (status === "testing") return "border-sky-300/30 text-sky-200";
  if (status === "paused") return "border-zinc-500/30 text-zinc-300";
  return "border-orange-400/30 text-orange-200";
}

type Props = {
  profiles: House[];
};

export default function ProfilesExplorer({ profiles }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | HouseType>("all");
  const [status, setStatus] = useState<"all" | HouseStatus>("all");

  const types = useMemo(
    () => Array.from(new Set(profiles.map((profile) => profile.type))).sort(),
    [profiles],
  );
  const statuses = useMemo(
    () => Array.from(new Set(profiles.map((profile) => profile.status))).sort(),
    [profiles],
  );

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          profile.name,
          profile.shortDescription,
          profile.description,
          profile.owner,
          profile.type,
          profile.status,
          ...profile.tags,
          ...profile.vibes,
          ...profile.rooms,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesType = type === "all" || profile.type === type;
      const matchesStatus = status === "all" || profile.status === status;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [profiles, query, status, type]);

  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            profiles
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Browse profiles.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            A first pass at the profile directory. Click a profile to open the
            public profile page.
          </p>
        </section>

        <section className="grid gap-4 border-b border-white/10 py-5 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="block">
            <span className="mb-2 block text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              search
            </span>
            <input
              className="h-10 w-full border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none transition placeholder:text-[#8f8577] focus:border-[#ff6a00]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, tags, sections"
              type="search"
              value={query}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              type
            </span>
            <select
              className="h-10 w-full border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white outline-none transition focus:border-[#ff6a00]"
              onChange={(event) => setType(event.target.value as "all" | HouseType)}
              value={type}
            >
              <option value="all">all types</option>
              {types.map((profileType) => (
                <option key={profileType} value={profileType}>
                  {profileType}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              status
            </span>
            <select
              className="h-10 w-full border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white outline-none transition focus:border-[#ff6a00]"
              onChange={(event) => setStatus(event.target.value as "all" | HouseStatus)}
              value={status}
            >
              <option value="all">all statuses</option>
              {statuses.map((profileStatus) => (
                <option key={profileStatus} value={profileStatus}>
                  {statusLabels[profileStatus]}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="py-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              {filteredProfiles.length} profiles
            </div>
            {(query || type !== "all" || status !== "all") && (
              <button
                className="border-b border-white/20 pb-1 text-xs font-normal uppercase tracking-[0.12em] text-[#c8bdae] transition hover:border-white hover:text-white"
                onClick={() => {
                  setQuery("");
                  setType("all");
                  setStatus("all");
                }}
                type="button"
              >
                clear filters
              </button>
            )}
          </div>

          <div className="divide-y divide-white/10 border-t border-white/10">
            {filteredProfiles.map((profile) => (
              <Link
                className="grid gap-4 py-5 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1fr)_150px_130px]"
                href={`/${profile.handle}`}
                key={profile.id}
                style={{ borderLeft: `2px solid ${profile.primaryColor}`, paddingLeft: "14px" }}
              >
                <span className="min-w-0">
                  <span className="block text-[24px] font-normal uppercase leading-tight text-white">
                    {profile.name}
                  </span>
                  <span className="mt-2 block max-w-2xl text-sm leading-6 text-[#c8bdae]">
                    {profile.shortDescription}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
                    {profile.tags.slice(0, 5).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                </span>
                <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577] sm:pt-1">
                  {profile.type}
                </span>
                <span className={`h-fit w-fit border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(profile.status)}`}>
                  {statusLabels[profile.status]}
                </span>
              </Link>
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="border-t border-white/10 py-8 text-sm leading-6 text-[#c8bdae]">
              No profiles match those filters yet.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
