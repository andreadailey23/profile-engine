"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  Badge,
  Block,
  EngineEvent,
  Entity,
  Facet,
  LinkItem,
  PatternKind,
  Theme,
} from "@/lib/engine/types";
import { nextLevelAt, totalXp, xpToLevel } from "@/lib/engine/logic";

const FACETS: Facet[] = ["work", "play", "life", "stuff"];

const FACET_PILL: Record<Facet, string> = {
  work: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  play: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  life: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  stuff: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

const TYPE_PILL: Record<string, string> = {
  person: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  brand: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  product: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  gamer: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  seller: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const SIMS: { kind: string; label: string; feed: string; facet: Facet; xp: number }[] = [
  { kind: "shipped", label: "+ Ship something", feed: "Shipped something new", facet: "work", xp: 50 },
  { kind: "streamed", label: "+ Stream a session", feed: "Streamed a session", facet: "play", xp: 15 },
  { kind: "wrote", label: "+ Write a page", feed: "Wrote a page", facet: "life", xp: 10 },
  { kind: "sold", label: "+ Sell something", feed: "Sold something, direct", facet: "stuff", xp: 25 },
];

const SWATCHES = ["#8b5cf6", "#ef4444", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#14b8a6"];
const PATTERNS: PatternKind[] = ["dots", "grid", "diagonal", "diamond", "none"];

function patternStyle(theme: Theme): React.CSSProperties {
  const a = theme.accent;
  const base: React.CSSProperties = { backgroundColor: a + "14" };
  switch (theme.pattern) {
    case "dots":
      return {
        ...base,
        backgroundImage: `radial-gradient(${a}55 1.2px, transparent 1.2px)`,
        backgroundSize: "12px 12px",
      };
    case "grid":
      return {
        ...base,
        backgroundImage: `linear-gradient(${a}33 1px, transparent 1px), linear-gradient(90deg, ${a}33 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      };
    case "diagonal":
      return {
        ...base,
        backgroundImage: `repeating-linear-gradient(45deg, ${a}40 0 2px, transparent 2px 10px)`,
      };
    case "diamond":
      return {
        ...base,
        backgroundImage: `repeating-linear-gradient(45deg, ${a}33 0 1.5px, transparent 1.5px 12px), repeating-linear-gradient(-45deg, ${a}33 0 1.5px, transparent 1.5px 12px)`,
      };
    default:
      return base;
  }
}

type Props = {
  entity: Entity;
  blocks: Block[];
  links: LinkItem[];
  parents: Entity[];
  childEntities: Entity[];
  owners: Entity[];
  owns: Entity[];
  initialEvents: EngineEvent[];
  badges: Badge[];
  lockedBadges: Badge[];
};

function Module({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 mb-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Stat({ v, l, accent }: { v: string | number; l: string; accent: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-center">
      <div className="text-base font-semibold" style={{ color: accent }}>
        {v}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">{l}</div>
    </div>
  );
}

function EntityLink({ e }: { e: Entity }) {
  return (
    <Link
      href={`/${e.handle}`}
      className="flex items-center gap-2 py-1 text-sm text-zinc-300 hover:text-white"
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium"
        style={{ backgroundColor: e.theme.accent + "33", color: "#fff" }}
      >
        {e.initials}
      </span>
      {e.name}
      <span className="text-[10px] text-zinc-600">{e.type}</span>
    </Link>
  );
}

export default function ProfileView({
  entity,
  blocks,
  links,
  parents,
  childEntities,
  owners,
  owns,
  initialEvents,
  badges,
  lockedBadges,
}: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [facet, setFacet] = useState<"all" | Facet>("all");
  const [theme, setTheme] = useState<Theme>(entity.theme);
  const [tagline, setTagline] = useState(entity.tagline);
  const [tags, setTags] = useState(entity.tags);
  const [editingTagline, setEditingTagline] = useState(false);
  const [newTag, setNewTag] = useState("");

  const xp = totalXp(events);
  const level = xpToLevel(xp);
  const next = nextLevelAt(level);
  const prev = (level - 1) * (level - 1) * 100;
  const progress = Math.min(100, Math.round(((xp - prev) / (next - prev)) * 100));
  const visibleBlocks = blocks.filter((b) => facet === "all" || b.facet === facet);
  const feed = events.filter((e) => facet === "all" || e.facet === facet);
  const railGroups = FACETS.map((f) => ({
    facet: f,
    items: blocks.filter((b) => b.facet === f),
  })).filter((g) => g.items.length > 0);

  function simulate(sim: (typeof SIMS)[number]) {
    setEvents((p) => [
      {
        id: crypto.randomUUID(),
        entityId: entity.id,
        facet: sim.facet,
        kind: sim.kind,
        label: sim.feed,
        xp: sim.xp,
        at: "Just now",
      },
      ...p,
    ]);
  }

  function addTag() {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setNewTag("");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
        ← All profiles
      </Link>

      <header className="mt-3 rounded-2xl bg-[#11141d] border border-white/[0.07] overflow-hidden">
        <div className="h-24" style={patternStyle(theme)} />
        <div className="px-5 pb-0">
          <div className="flex items-end gap-4 flex-wrap -mt-7">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold text-white border-2"
              style={{
                backgroundColor: theme.accent + "40",
                borderColor: theme.accent,
                backdropFilter: "blur(4px)",
              }}
            >
              {entity.initials}
            </div>
            <div className="flex-1 min-w-[200px] pt-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold">{entity.name}</h1>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${TYPE_PILL[entity.type]}`}
                >
                  {entity.type}
                </span>
              </div>
              {editingTagline ? (
                <input
                  autoFocus
                  defaultValue={tagline}
                  onBlur={(e) => {
                    if (e.target.value.trim()) setTagline(e.target.value.trim());
                    setEditingTagline(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="mt-0.5 w-full max-w-md bg-white/5 border border-white/20 rounded px-2 py-0.5 text-sm text-zinc-200 outline-none"
                />
              ) : (
                <p
                  className="text-sm text-zinc-400 mt-0.5 cursor-text hover:text-zinc-200"
                  title="Click to edit — the profile is the editor"
                  onClick={() => setEditingTagline(true)}
                >
                  {tagline} <span className="text-zinc-600 text-xs">✎</span>
                </p>
              )}
              {badges.length > 0 && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {badges.slice(0, 3).map((b) => (
                    <span
                      key={b.id}
                      className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300"
                      title={b.desc}
                    >
                      {b.icon} {b.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1"
                    style={{
                      backgroundColor: theme.accent + "1f",
                      borderColor: theme.accent + "55",
                      color: "#fff",
                    }}
                  >
                    {t}
                    <button
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="text-white/40 hover:text-white"
                      aria-label={`Remove ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTag();
                  }}
                  placeholder="+ vibe"
                  className="w-20 bg-transparent border border-dashed border-white/15 rounded-full px-2 py-0.5 text-[11px] text-zinc-300 outline-none placeholder:text-zinc-600"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-8 pb-1">
              <button className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10">
                Follow
              </button>
              <button className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10">
                Say hi
              </button>
              {entity.type === "person" && (
                <button
                  className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  Hire direct
                </button>
              )}
            </div>
          </div>

          {events.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                <span>
                  Lv {level} → Lv {level + 1}
                </span>
                <span>
                  {xp.toLocaleString()} / {next.toLocaleString()} XP
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: theme.accent }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <Stat v={level} l="Level" accent={theme.accent} />
                <Stat v={xp.toLocaleString()} l="Total XP" accent={theme.accent} />
                <Stat v={events.length} l="Receipts" accent={theme.accent} />
                {entity.streak ? (
                  <Stat v={`${entity.streak} 🔥`} l="Day streak" accent={theme.accent} />
                ) : (
                  <Stat v={badges.length} l="Badges" accent={theme.accent} />
                )}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap items-center">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Find me
              </span>
              {links.map((l) => (
                <a
                  key={l.url + l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/25"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          <nav className="flex gap-5 mt-4">
            {(["all", ...FACETS] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFacet(f)}
                className={`text-sm pb-2.5 border-b-2 capitalize ${
                  facet === f
                    ? "text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
                style={facet === f ? { borderColor: theme.accent } : undefined}
              >
                {f}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="grid lg:grid-cols-[180px_1fr_240px] gap-5 mt-5">
        <aside>
          {railGroups.map((g) => (
            <div key={g.facet} className="mb-4">
              <button
                onClick={() => setFacet(g.facet)}
                className="w-full flex items-center justify-between text-xs font-medium capitalize text-zinc-300 hover:text-white"
              >
                {g.facet}
                <span className={`w-2 h-2 rounded-full border ${FACET_PILL[g.facet]}`} />
              </button>
              {g.items.map((b) => (
                <div key={b.id} className="text-xs text-zinc-500 pl-2 pt-1.5">
                  {b.title}
                </div>
              ))}
            </div>
          ))}
        </aside>

        <section>
          {visibleBlocks.map((b) => (
            <div
              key={b.id}
              className="rounded-xl bg-[#11141d] border border-white/[0.07] p-4 mb-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold">{b.title}</h2>
                <span
                  className={`text-[10px] px-1.5 py-px rounded-full border ${FACET_PILL[b.facet]}`}
                >
                  {b.facet}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{b.body}</p>
              {b.cta && (
                <button
                  className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  {b.cta}
                </button>
              )}
            </div>
          ))}

          {events.length > 0 && (
            <div className="rounded-xl bg-[#11141d] border border-white/[0.07] p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-sm font-semibold">Proof of work</h2>
                <span className="text-[11px] text-zinc-500">
                  {events.length} receipts · pulled from the ledger, not claimed
                </span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {SIMS.map((s) => (
                  <button
                    key={s.kind}
                    onClick={() => simulate(s)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-dashed border-white/15 text-zinc-400 hover:text-white hover:border-white/30"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <ul className="mt-3 divide-y divide-white/[0.05]">
                {feed.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 py-2.5">
                    <span className={`w-2 h-2 rounded-full border shrink-0 ${FACET_PILL[e.facet]}`} />
                    <span className="text-sm text-zinc-300 flex-1">{e.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-px rounded-full border ${FACET_PILL[e.facet]}`}
                    >
                      {e.facet}
                    </span>
                    <span className="text-[11px] text-emerald-400 w-10 text-right">
                      +{e.xp}
                    </span>
                    <span className="text-[11px] text-zinc-600 w-14 text-right">{e.at}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside>
          <Module title="Appearance">
            <div className="flex gap-1.5 flex-wrap">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  aria-label={`Accent ${c}`}
                  onClick={() => setTheme((t) => ({ ...t, accent: c }))}
                  className="w-6 h-6 rounded-full border-2"
                  style={{
                    backgroundColor: c,
                    borderColor: theme.accent === c ? "#fff" : "transparent",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  onClick={() => setTheme((t) => ({ ...t, pattern: p }))}
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    theme.pattern === p
                      ? "border-white/60 text-white"
                      : "border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">
              Photo + banner uploads come with Supabase. Colors and patterns save
              per profile.
            </p>
          </Module>

          {owns.length > 0 && (
            <Module title="Runs">
              {owns.map((e) => (
                <EntityLink key={e.id} e={e} />
              ))}
            </Module>
          )}
          {parents.length > 0 && (
            <Module title="Part of">
              {parents.map((e) => (
                <EntityLink key={e.id} e={e} />
              ))}
            </Module>
          )}
          {childEntities.length > 0 && (
            <Module title="Inside">
              {childEntities.map((e) => (
                <EntityLink key={e.id} e={e} />
              ))}
            </Module>
          )}
          {owners.length > 0 && (
            <Module title="By">
              {owners.map((e) => (
                <EntityLink key={e.id} e={e} />
              ))}
            </Module>
          )}

          {(badges.length > 0 || lockedBadges.length > 0) && (
            <Module title="Badges">
              {badges.map((b) => (
                <div key={b.id} className="flex items-center gap-2 py-1" title={b.desc}>
                  <span className="text-base">{b.icon}</span>
                  <span className="text-sm text-zinc-300">{b.name}</span>
                </div>
              ))}
              {lockedBadges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 py-1 opacity-40"
                  title={`Locked — ${b.desc}`}
                >
                  <span className="text-base">🔒</span>
                  <span className="text-sm text-zinc-400">{b.name}</span>
                </div>
              ))}
            </Module>
          )}

        </aside>
      </div>
    </main>
  );
}
