import Link from "next/link";
import { getEngineStats, getPublicProfiles, profileContexts } from "@/lib/engine/selectors";
import type { HouseStatus } from "@/lib/engine/types";

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

const buildingLanes = [
  {
    id: "tools",
    title: "Tools",
    body: "A curated index of useful products, software, creator tools, affiliate paths, and operating stacks.",
    items: ["Profile setup", "WhatDeployed", "Go High Level", "Beehiiv", "Canva"],
  },
  {
    id: "content",
    title: "Content",
    body: "Plain-English notes, build context, recommendations, and useful explainers around what is worth using.",
    items: ["Tool notes", "Build logs", "How-tos", "Recommendations"],
  },
  {
    id: "profiles",
    title: "Profiles",
    body: "A public profile layer anyone can use to collect their links, tools, offers, products, content, and context.",
    items: ["People", "Brands", "Products", "Projects"],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    body: "The v2 path for profile setup, templates, tool stacks, affiliate bundles, and useful products.",
    items: ["V2", "Templates", "Setup", "Tool stacks"],
  },
];

export default function Home() {
  const publicHouses = getPublicProfiles();
  const stats = getEngineStats();

  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
              tools / content / profiles / marketplace
            </div>
            <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Tools and profiles for people with a world to share.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#c8bdae] sm:text-lg">
              Building Empires is the public site for tools and content now,
              with profiles next and a marketplace in v2.
            </p>
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
              <Metric label="profiles" value={stats.profiles} />
              <Metric label="section types" value={stats.roomTypes} />
              <Metric label="tools / items" value={stats.products} />
            </div>
          </div>

          <aside className="border-t border-white/10 pt-5 lg:border-t-0 lg:pt-0">
            <div className="mb-4 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              what this becomes
            </div>
            <div className="divide-y divide-white/10">
              {[
                {
                  title: "Profiles",
                  body: "A profile anyone can create to hold links, products, offers, content, contact paths, and proof.",
                },
                {
                  title: "Sections",
                  body: "Flexible blocks for identity, proof, products, links, activity, schedule, shop, support, and more.",
                },
                {
                  title: "Engine",
                  body: "The same profile engine can power Building Empires and also support Andrea's other tools later.",
                },
              ].map((item) => (
                <section key={item.title} className="py-4 first:pt-0 last:pb-0">
                  <h2 className="text-[18px] font-normal uppercase leading-tight text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#b8ad9f]">{item.body}</p>
                </section>
              ))}
            </div>

            <div className="mt-5 border-t border-[#ff6a00]/35 pt-4">
              <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#ffb16b]">
                Product path
              </div>
              <h2 className="mt-2 text-lg font-normal text-white">Profiles first, marketplace next</h2>
              <p className="mt-2 text-sm leading-6 text-[#c8bdae]">
                V1 proves the profile shape. V2 adds the marketplace and the
                monetization paths around tools, setup, templates, and offers.
              </p>
            </div>
          </aside>
        </section>

        <SectionHeading eyebrow="building empires" title="Tools, content, profiles, marketplace" />
        <section className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {buildingLanes.map((lane) => (
            <section id={lane.id} key={lane.id} className="scroll-mt-20 border-t border-white/10 pt-4">
              <div className="mb-3 text-[10px] font-normal uppercase tracking-[0.18em] text-[#ff6a00]">
                {lane.title}
              </div>
              <p className="text-sm leading-6 text-[#c8bdae]">
                {lane.body}
              </p>
              <div className="mt-5 divide-y divide-white/10 border-t border-white/10">
                {lane.items.map((item) => (
                  <div key={item} className="py-2 text-sm font-normal text-[#d8cfc0]">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </section>

        <SectionHeading eyebrow="profile engine" title="One profile, many surfaces" />
        <section id="contexts" className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-3">
          {profileContexts.map((context) => (
            <article key={context.id} className="border-t border-white/10 pt-4">
              <div className="mb-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#ff6a00]">
                {context.label}
              </div>
              <p className="text-sm leading-6 text-[#c8bdae]">
                {context.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
                {context.rooms.slice(0, 6).map((room) => (
                  <span key={room}>{room}</span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <SectionHeading eyebrow="profiles" title="Profiles" />
        <section id="profiles" className="grid scroll-mt-20 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {publicHouses.map((house) => (
            <Link
              key={house.id}
              href={`/${house.handle}`}
              className="group flex min-h-[210px] flex-col border-t border-white/10 pt-4 transition hover:border-white/25"
              style={{ borderTopColor: house.primaryColor }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
                  {house.type}
                </div>
                <span className={`border px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] ${statusStyle(house.status)}`}>
                  {statusLabels[house.status]}
                </span>
              </div>
              <h3 className="text-[23px] font-normal uppercase leading-tight text-white">
                {house.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#c8bdae]">
                {house.shortDescription}
              </p>
              <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
                {house.rooms.slice(0, 4).map((room) => (
                  <span key={room}>{room}</span>
                ))}
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="pt-10 pb-4">
      <div className="mb-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
        {eyebrow}
      </div>
      <h2 className="text-[30px] font-normal uppercase leading-tight text-white">
        {title}
      </h2>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <div className="text-[34px] font-normal leading-none text-white">{value}</div>
      <div className="mt-2 text-[9px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
        {label}
      </div>
    </div>
  );
}
