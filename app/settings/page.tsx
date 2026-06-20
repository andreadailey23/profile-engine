"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  Eye,
  Link2,
  Palette,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type SettingsTab = "profile" | "links" | "schedule" | "appearance" | "sharing" | "account";

const profilePath = "/andrea-dailey";
const productionOrigin = "https://buildingempires.co";

const tabs: { key: SettingsTab; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "links", label: "Links", icon: Link2 },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "sharing", label: "Sharing", icon: Share2 },
  { key: "account", label: "Account", icon: CreditCard },
];

const validTabs = new Set<SettingsTab>(tabs.map((tab) => tab.key));

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [copyLabel, setCopyLabel] = useState("Copy");

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (!tab || !validTabs.has(tab as SettingsTab)) return;
    window.requestAnimationFrame(() => setActiveTab(tab as SettingsTab));
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
            {activeTab === "links" && <LinksSettings />}
            {activeTab === "schedule" && <ScheduleSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
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
        <Field label="Photo" value="Initials for MVP" />
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

function AppearanceSettings() {
  return (
    <>
      <SettingsHeader eyebrow="appearance" title="Theme" />
      <SettingsPanel>
        <Field label="Vibe" value="Builder" />
        <Field label="Theme" value="Dark" />
        <Field label="Accent" value="#ff6a00" />
        <Field label="Logo" value="B block" />
      </SettingsPanel>
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
