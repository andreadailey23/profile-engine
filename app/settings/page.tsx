"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  Eye,
  Link2,
  Palette,
  Plus,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { getProfileTheme, profileThemes } from "@/lib/engine/themes";
import type { ProfileThemeId } from "@/lib/engine/types";

type SettingsTab = "profile" | "library" | "links" | "schedule" | "appearance" | "sharing" | "account";

const profilePath = "/andrea-dailey";
const profileHandle = "andrea-dailey";
const productionOrigin = "https://buildingempires.co";
const profileThemeStorageKey = `building-empires-profile-theme-${profileHandle}`;

const tabs: { key: SettingsTab; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "library", label: "Library", icon: BookOpen },
  { key: "links", label: "Links", icon: Link2 },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "sharing", label: "Sharing", icon: Share2 },
  { key: "account", label: "Account", icon: CreditCard },
];

const validTabs = new Set<SettingsTab>(tabs.map((tab) => tab.key));
const validThemeIds = new Set<ProfileThemeId>(profileThemes.map((theme) => theme.id));

async function writeClipboardText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function currentProfileUrl() {
  if (typeof window === "undefined") return `${productionOrigin}${profilePath}`;

  const localOrigin =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1";

  return `${localOrigin ? productionOrigin : window.location.origin}${profilePath}`;
}

function settingsTabFromUrl() {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return tab && validTabs.has(tab as SettingsTab) ? (tab as SettingsTab) : "profile";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [selectedTheme, setSelectedTheme] = useState<ProfileThemeId>("midnight");

  useEffect(() => {
    function syncTabFromUrl() {
      setActiveTab(settingsTabFromUrl());
    }

    function onSettingsTab(event: Event) {
      const tab = (event as CustomEvent<{ tab?: string }>).detail?.tab;

      if (tab && validTabs.has(tab as SettingsTab)) {
        setActiveTab(tab as SettingsTab);
        return;
      }

      syncTabFromUrl();
    }

    window.requestAnimationFrame(syncTabFromUrl);
    window.addEventListener("popstate", syncTabFromUrl);
    window.addEventListener("buildingempires:settings-tab", onSettingsTab);

    return () => {
      window.removeEventListener("popstate", syncTabFromUrl);
      window.removeEventListener("buildingempires:settings-tab", onSettingsTab);
    };
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(profileThemeStorageKey);
    if (storedTheme && validThemeIds.has(storedTheme as ProfileThemeId)) {
      window.requestAnimationFrame(() => setSelectedTheme(storedTheme as ProfileThemeId));
    }
  }, []);

  function selectTab(tab: SettingsTab) {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }

  async function copyProfileLink() {
    const url = currentProfileUrl();
    setCopyLabel("Copied");

    try {
      const copied = await writeClipboardText(url);
      if (!copied) setCopyLabel(url);
    } catch {
      setCopyLabel(url);
    }

    window.setTimeout(() => setCopyLabel("Copy"), 1600);
  }

  function selectTheme(themeId: ProfileThemeId) {
    setSelectedTheme(themeId);
    window.localStorage.setItem(profileThemeStorageKey, themeId);
    window.dispatchEvent(
      new CustomEvent("buildingempires:profile-theme", {
        detail: { handle: profileHandle, themeId },
      }),
    );
  }

  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <div className="flex min-h-[calc(100vh-var(--topbar-h)-var(--footer-h))]">
        <aside className="hidden w-[224px] shrink-0 border-r border-white/10 bg-[#0d0d0d] p-3 md:block">
          <SettingsTabs activeTab={activeTab} onSelect={selectTab} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-white/10 bg-[#0d0d0d] px-4 py-3 md:hidden">
            <div className="flex gap-1 overflow-x-auto">
              <SettingsTabs activeTab={activeTab} compact onSelect={selectTab} />
            </div>
          </div>

          <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "library" && <LibrarySettings />}
            {activeTab === "links" && <LinksSettings />}
            {activeTab === "schedule" && <ScheduleSettings />}
            {activeTab === "appearance" && <AppearanceSettings selectedTheme={selectedTheme} onSelectTheme={selectTheme} />}
            {activeTab === "sharing" && <SharingSettings copyLabel={copyLabel} onCopy={copyProfileLink} />}
            {activeTab === "account" && <AccountSettings />}
          </section>
        </div>
      </div>
    </main>
  );
}

function SettingsTabs({
  activeTab,
  compact = false,
  onSelect,
}: {
  activeTab: SettingsTab;
  compact?: boolean;
  onSelect: (tab: SettingsTab) => void;
}) {
  return (
    <>
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = activeTab === key;

        return (
          <button
            className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-normal transition ${
              active
                ? "bg-white/[0.07] text-white"
                : "text-[#8f8577] hover:bg-white/[0.04] hover:text-[#f7f0df]"
            } ${compact ? "" : "w-full"}`}
            key={key}
            onClick={() => onSelect(key)}
            type="button"
          >
            <Icon className={active ? "text-[#ff6a00]" : ""} size={16} strokeWidth={1.8} />
            {label}
          </button>
        );
      })}
    </>
  );
}

function SettingsHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-6 border-b border-white/10 pb-5">
      <div className="mb-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#ff6a00]">
        {eyebrow}
      </div>
      <h1 className="text-[32px] font-normal uppercase leading-none text-white sm:text-[42px]">
        {title}
      </h1>
    </header>
  );
}

function ProfileSettings() {
  return (
    <>
      <SettingsHeader eyebrow="profile" title="Public profile" />
      <SettingsPanel>
        <Field label="Name" value="Andrea Dailey" />
        <Field label="Handle" value="@andrea-dailey" />
        <Field label="Bio" value="Builder, author, product operator, and public systems maker." />
        <Field label="Identity" value="Author, Entrepreneur, Builder, Product Builder, Systems Thinker" />
        <Field label="Vibe" value="Sharp, Minimal, Useful, Funny, High Signal" />
        <Field label="Highlights" value="Products shipped: 10+, Books published: 2, Systems built: 6" />
        <Field label="Views" value="Default, Marketplace, Professional" />
        <Field label="Avatar" value="Photo upload, initials fill or outline, and color" />
      </SettingsPanel>
    </>
  );
}

function LinksSettings() {
  return (
    <>
      <SettingsHeader eyebrow="links" title="Links" />
      <SettingsPanel>
        <Field label="Website" value="andreainpublic.com" />
        <Field label="Instagram" value="@andreainpublic" />
        <Field label="TikTok" value="@andreainpublic" />
        <Field label="YouTube" value="@andreainpublic" />
      </SettingsPanel>
    </>
  );
}

type LibraryDraft = {
  id: string;
  note: string;
  status: string;
  tags: string;
  title: string;
  type: string;
};

const libraryTypeOptions = ["Book", "Game", "Tool", "Music", "Show", "Product", "Resource"];
const libraryStatusOptions = ["Recommend", "Using", "Playing", "Reading", "Want", "Finished"];
const libraryTagOptions = ["systems", "habits", "workflow", "gaming", "cozy", "books", "tools", "music", "local", "resources"];

const initialLibraryDrafts: LibraryDraft[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    type: "Book",
    status: "Recommend",
    tags: "habits, systems",
    note: "Useful baseline for systems and small repeatable actions.",
  },
  {
    id: "stream-deck",
    title: "Stream Deck",
    type: "Tool",
    status: "Using",
    tags: "workflow, studio",
    note: "Fast shortcuts for repeated workflows.",
  },
  {
    id: "lofi-work",
    title: "Lo-fi work playlists",
    type: "Music",
    status: "Using",
    tags: "focus, building",
    note: "Default background layer for long build days.",
  },
  {
    id: "stop-collection",
    title: "STOP Collection",
    type: "Product",
    status: "Recommend",
    tags: "habits, book, journal",
    note: "Books and journals for stopping patterns that cost too much.",
  },
];

function LibrarySettings() {
  const [items, setItems] = useState<LibraryDraft[]>(initialLibraryDrafts);

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: `library-${Date.now()}`,
        title: "New library item",
        type: "Book",
        status: "Recommend",
        tags: "systems",
        note: "Short note",
      },
    ]);
  }

  return (
    <>
      <SettingsHeader eyebrow="library" title="Library" />
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
          <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8f8577]">
            shelf tags
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {libraryTagOptions.map((tag) => (
              <span
                className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-normal uppercase tracking-[0.12em] text-[#c8bdae]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#ff6a00] bg-[#ff6a00] px-4 text-sm font-normal text-[#050505] transition hover:opacity-90"
          onClick={addItem}
          type="button"
        >
          <Plus size={16} aria-hidden="true" />
          Add item
        </button>
      </div>
      <SettingsPanel>
        {items.map((item, index) => (
          <LibraryField featured={index < 3} item={item} key={item.id} />
        ))}
      </SettingsPanel>
    </>
  );
}

function ScheduleSettings() {
  return (
    <>
      <SettingsHeader eyebrow="schedule" title="Scheduled items" />
      <SettingsPanel>
        <ScheduleField date="Jun 22, 9:00 AM" title="Weekly build rhythm" type="Launch" tags="build, public" url="andreainpublic.com/log" />
        <ScheduleField date="Add" title="New scheduled item" type="Event, stream, booking, hours, availability" tags="custom tags" url="optional link" />
      </SettingsPanel>
    </>
  );
}

function AppearanceSettings({
  selectedTheme,
  onSelectTheme,
}: {
  selectedTheme: ProfileThemeId;
  onSelectTheme: (themeId: ProfileThemeId) => void;
}) {
  const activeTheme = getProfileTheme(selectedTheme);

  return (
    <>
      <SettingsHeader eyebrow="appearance" title="Themes" />
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
          <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
            <div>
              <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8f8577]">
                active
              </div>
              <div className="mt-1 text-xl font-normal uppercase leading-none text-white">
                {activeTheme.name}
              </div>
            </div>
            <div className="grid grid-cols-5 overflow-hidden rounded-md border border-white/10">
              {Object.entries(activeTheme.colors)
                .filter(([key]) => ["canvas", "surface", "text", "accent", "accentStrong"].includes(key))
                .map(([key, color]) => (
                  <span
                    aria-label={key}
                    className="h-11"
                    key={key}
                    style={{ background: color }}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {profileThemes.map((theme) => {
            const active = selectedTheme === theme.id;

            return (
              <button
                className={`group rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-[#ff6a00] bg-[#ff6a00]/10"
                    : "border-white/10 bg-[#0d0d0d] hover:border-white/25"
                }`}
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                type="button"
              >
                <div
                  className="mb-4 h-28 overflow-hidden rounded-md border"
                  style={{
                    background: `
                      linear-gradient(120deg, ${theme.colors.accentSoft}, transparent 54%),
                      ${theme.colors.canvas}
                    `,
                    borderColor: theme.colors.border,
                  }}
                >
                  <div className="grid h-full grid-cols-[1fr_72px]">
                    <div className="p-4">
                      <div
                        className="mb-3 h-3 w-20 rounded-full"
                        style={{ background: theme.colors.accent }}
                      />
                      <div
                        className="mb-2 h-2 w-32 rounded-full"
                        style={{ background: theme.colors.text }}
                      />
                      <div
                        className="h-2 w-24 rounded-full"
                        style={{ background: theme.colors.muted }}
                      />
                    </div>
                    <div
                      className="border-l"
                      style={{ borderColor: theme.colors.border, background: theme.colors.surface }}
                    />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#ffb16b]">
                      {theme.label}
                    </div>
                    <h2 className="mt-1 text-xl font-normal uppercase leading-none text-white">
                      {theme.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#b8ad9f]">{theme.description}</p>
                  </div>
                  <span
                    className={`mt-1 size-4 shrink-0 rounded-full border ${
                      active ? "border-[#ff6a00] bg-[#ff6a00]" : "border-white/20"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function SharingSettings({ copyLabel, onCopy }: { copyLabel: string; onCopy: () => void }) {
  return (
    <>
      <SettingsHeader eyebrow="sharing" title="Profile link" />
      <section className="rounded-lg border border-white/10 bg-[#0d0d0d]">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8f8577]">
              public url
            </div>
            <div className="mt-1 truncate text-sm text-white">{currentProfileUrl()}</div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#ff6a00]/35 px-3 text-sm font-normal text-[#ffb16b] transition hover:border-[#ff6a00]"
              onClick={onCopy}
              type="button"
            >
              {copyLabel === "Copied" ? <Check size={15} /> : <Copy size={15} />}
              {copyLabel}
            </button>
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-normal text-[#d8cfc0] transition hover:border-[#ff6a00]/45"
              href={profilePath}
            >
              <Eye size={15} />
              View
            </Link>
          </div>
        </div>
        <div className="grid gap-0 sm:grid-cols-3">
          <Field label="Default" value="Whole profile" />
          <Field label="Slices" value="Later" />
          <Field label="Visibility" value="Public" />
        </div>
      </section>
    </>
  );
}

function AccountSettings() {
  return (
    <>
      <SettingsHeader eyebrow="account" title="Account" />
      <SettingsPanel>
        <Field label="Plan" value="Free profile" />
        <Field label="Upgrade" value="Custom profile versions later" />
        <Field label="Marketplace" value="V2" />
      </SettingsPanel>
    </>
  );
}

function SettingsPanel({ children }: { children: React.ReactNode }) {
  return (
    <section className="divide-y divide-white/10 rounded-lg border border-white/10 bg-[#0d0d0d]">
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 p-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
      <label className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8f8577]">
        {label}
      </label>
      <input
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
        defaultValue={value}
      />
    </div>
  );
}

function LibraryField({ featured = false, item }: { featured?: boolean; item: LibraryDraft }) {
  return (
    <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_130px_150px]">
      <div className="flex items-center gap-2 lg:col-span-3">
        <span className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
          {featured ? "Visual card" : "Link row"}
        </span>
      </div>
      <input
        aria-label="Title"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
        defaultValue={item.title}
      />
      <select
        aria-label="Type"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
        defaultValue={item.type}
      >
        {libraryTypeOptions.map((type) => (
          <option className="bg-[#0d0d0d]" key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        aria-label="Status"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
        defaultValue={item.status}
      >
        {libraryStatusOptions.map((status) => (
          <option className="bg-[#0d0d0d]" key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        aria-label="Tags"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60 lg:col-span-1"
        defaultValue={item.tags}
        list="library-tag-options"
      />
      <input
        aria-label="Note"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60 lg:col-span-2"
        defaultValue={item.note}
      />
      <datalist id="library-tag-options">
        {libraryTagOptions.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
    </div>
  );
}

function ScheduleField({
  date,
  tags,
  title,
  type,
  url,
}: {
  date: string;
  tags: string;
  title: string;
  type: string;
  url: string;
}) {
  return (
    <div className="grid gap-3 p-4 lg:grid-cols-[140px_minmax(0,1fr)_140px]">
      <input
        aria-label="Date"
        className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
        defaultValue={date}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          aria-label="Title"
          className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60 sm:col-span-3"
          defaultValue={title}
        />
        <input
          aria-label="Type"
          className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
          defaultValue={type}
        />
        <input
          aria-label="Tags"
          className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
          defaultValue={tags}
        />
        <input
          aria-label="URL"
          className="min-h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm font-normal text-white outline-none transition focus:border-[#ff6a00]/60"
          defaultValue={url}
        />
      </div>
      <button
        className="min-h-10 rounded-md border border-white/10 px-3 text-sm font-normal text-[#d8cfc0] transition hover:border-[#ff6a00]/45"
        type="button"
      >
        Visible
      </button>
    </div>
  );
}
