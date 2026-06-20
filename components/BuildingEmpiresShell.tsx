"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Check,
  Copy,
  ExternalLink,
  Home,
  Info,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type AvatarSettings = {
  color: string;
  image?: string;
  mode: "fill" | "outline";
};

const primaryNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
];

const siteNav: NavItem[] = [
  { href: "/profiles", label: "Profiles", icon: UserRound },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/best-of", label: "Best of", icon: Star },
];

const socialLinks = [
  { name: "instagram", href: "https://www.instagram.com/andreainpublic" },
  { name: "facebook", href: "https://www.facebook.com/andreainpublic" },
  { name: "pinterest", href: "https://www.pinterest.com/andreainpublic" },
  { name: "tiktok", href: "https://www.tiktok.com/@andreainpublic" },
  { name: "youtube", href: "https://www.youtube.com/@andreainpublic" },
] as const;

const avatarColors = ["#ff6a00", "#d22f2f", "#38bdf8", "#8faa88", "#8b5cf6", "#f7f0df"];
const defaultAvatarSettings: AvatarSettings = { color: "#ff6a00", mode: "fill" };
const profileHandle = "andrea-dailey";
const profilePath = `/${profileHandle}`;
const productionOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildingempires.co";

function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItems({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return items.map((item) => {
    const Icon = item.icon;

    return (
      <Link className={isActivePath(pathname, item.href) ? "active" : undefined} href={item.href} key={item.href}>
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    );
  });
}

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["name"] }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="16.9" cy="7.1" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8.3h2.1V5.1c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2v2.9H5v3.6h3.1V24h3.8v-7.4h3l.5-3.6h-3.5v-2.5c0-1 .3-2.2 2.1-2.2Z" />
      </svg>
    );
  }

  if (name === "pinterest") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.2 2.4c-5.3 0-8 3.8-8 7.1 0 2 .8 3.8 2.6 4.5.3.1.5 0 .6-.3l.3-1.1c.1-.3.1-.4-.1-.7-.5-.6-.9-1.4-.9-2.4 0-2.9 2.2-5.5 5.7-5.5 3.1 0 4.8 1.9 4.8 4.4 0 3.3-1.5 6.1-3.7 6.1-1.2 0-2.1-1-1.8-2.2.3-1.5 1-3.1 1-4.2 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.6 6.8c-.5 2.1-.1 4.6 0 4.9 0 .2.3.2.4.1.2-.2 2.4-3 3.1-5.1l.9-3.3c.4.8 1.6 1.5 2.9 1.5 3.8 0 6.4-3.5 6.4-8.1 0-3.5-3-6.8-7.1-6.8Z" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.2 3c.3 2.4 1.7 4 4.1 4.3v3.3a7 7 0 0 1-4.1-1.4v6.6c0 3.4-2.2 5.2-5 5.2-2.9 0-5.2-2.1-5.2-4.9 0-3.2 2.7-5.3 5.8-4.8v3.4c-1.4-.4-2.5.4-2.5 1.6 0 1 .8 1.7 1.8 1.7 1.2 0 1.9-.7 1.9-2.4V3h3.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function profileAvatarStorageKey(handle: string) {
  return `building-empires-profile-avatar-${handle}`;
}

function parseAvatarSettings(value: string | null): AvatarSettings {
  if (!value) return defaultAvatarSettings;

  try {
    const parsed = JSON.parse(value) as Partial<AvatarSettings>;
    const mode = parsed.mode === "outline" ? "outline" : "fill";
    const color = typeof parsed.color === "string" ? parsed.color : defaultAvatarSettings.color;
    const image = typeof parsed.image === "string" && parsed.image.startsWith("data:image/") ? parsed.image : undefined;

    return { color, image, mode };
  } catch {
    return defaultAvatarSettings;
  }
}

function AvatarPreview({
  avatar,
  initials,
  size = "sm",
}: {
  avatar: AvatarSettings;
  initials: string;
  size?: "sm" | "md";
}) {
  const hasImage = Boolean(avatar.image);
  const isOutline = avatar.mode === "outline" && !hasImage;

  return (
    <span
      className={`site-avatar-preview ${size === "md" ? "site-avatar-preview-md" : "site-avatar-preview-sm"} ${
        isOutline ? "is-outline" : "is-fill"
      }`}
      style={
        {
          "--avatar-color": avatar.color,
          background: isOutline ? "transparent" : avatar.color,
          borderColor: avatar.color,
          color: isOutline ? avatar.color : "#1f1a16",
        } as CSSProperties
      }
    >
      {avatar.image ? <img alt="" src={avatar.image} /> : initials}
    </span>
  );
}

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

export default function BuildingEmpiresShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [accountOpen, setAccountOpen] = useState(false);
  const [avatar, setAvatar] = useState<AvatarSettings>(defaultAvatarSettings);
  const [copyMessage, setCopyMessage] = useState("Copy profile link");
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const avatarKey = `${avatar.mode}-${avatar.color}-${avatar.image ? avatar.image.length : 0}`;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("building-empires-theme", theme);
  }, [theme]);

  useEffect(() => {
    function syncStoredAvatar() {
      setAvatar(parseAvatarSettings(window.localStorage.getItem(profileAvatarStorageKey(profileHandle))));
    }

    function onAvatarChange(event: Event) {
      const detail = (event as CustomEvent<{ avatar?: AvatarSettings; handle?: string }>).detail;
      if (detail?.handle !== profileHandle || !detail.avatar) return;
      setAvatar(detail.avatar);
    }

    syncStoredAvatar();
    window.addEventListener("storage", syncStoredAvatar);
    window.addEventListener("buildingempires:profile-avatar", onAvatarChange);

    return () => {
      window.removeEventListener("storage", syncStoredAvatar);
      window.removeEventListener("buildingempires:profile-avatar", onAvatarChange);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    function onAway(event: MouseEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }

    window.addEventListener("mousedown", onAway);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("mousedown", onAway);
      window.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("building-empires-theme", nextTheme);
  }

  function saveAvatar(nextAvatar: AvatarSettings) {
    setAvatar(nextAvatar);
    window.localStorage.setItem(profileAvatarStorageKey(profileHandle), JSON.stringify(nextAvatar));
    window.dispatchEvent(
      new CustomEvent("buildingempires:profile-avatar", {
        detail: { avatar: nextAvatar, handle: profileHandle },
      }),
    );
  }

  function chooseAvatarFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") return;
      saveAvatar({ ...avatar, image: reader.result });
    });
    reader.readAsDataURL(file);
  }

  async function copyProfileLink() {
    const localOrigin =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1";
    const origin = localOrigin ? productionOrigin : window.location.origin;
    const url = `${origin}${profilePath}`;

    setCopyMessage("Copied");

    try {
      const copied = await writeClipboardText(url);
      if (!copied) throw new Error("Copy failed");
      window.setTimeout(() => setCopyMessage("Copy profile link"), 1600);
    } catch {
      setCopyMessage(url);
    }
  }

  function openProfileSettings() {
    setAccountOpen(false);
    window.dispatchEvent(new CustomEvent("buildingempires:settings-tab", { detail: { tab: "profile" } }));
  }

  return (
    <div className={collapsed ? "aw-shell rail-collapsed" : "aw-shell"}>
      <aside className="aw-side">
        <div className="aw-brand-row">
          <Link className="aw-brand" href="/" title="Building Empires">
            <div className="aw-mark" aria-hidden="true">B</div>
            <div className="aw-name">
              <span>BUILDING<span className="aw-accent">EMPIRES</span></span>
            </div>
          </Link>
          <button
            aria-label={collapsed ? "Expand rail" : "Collapse rail"}
            className="aw-rail-toggle"
            onClick={() => setCollapsed((value) => !value)}
            title={collapsed ? "Expand rail" : "Collapse rail"}
            type="button"
          >
            <span aria-hidden="true">{collapsed ? ">>" : "<<"}</span>
          </button>
        </div>

        <nav className="aw-nav" aria-label="Primary navigation">
          <div className="aw-nav-group aw-nav-group-main">
            <NavItems items={primaryNav} pathname={pathname} />
          </div>
          <div className="aw-nav-group">
            <div className="aw-nav-label">Explore</div>
            <NavItems items={siteNav} pathname={pathname} />
          </div>
        </nav>

        <div className="aw-spacer" />
        <div className="aw-rail-footer">
          <p className="aw-rail-note">
            EXPRESS YOUR WORLD
          </p>
        </div>
      </aside>

      <div className="aw-canvas">
        <header className="site-topbar" aria-label="Site navigation">
          <div className="site-topbar-spacer" aria-hidden="true" />
          <label className="site-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Search" placeholder="Search" type="search" />
          </label>
          <nav className="site-account-nav" aria-label="Account navigation">
            <div className="site-account-menu" ref={accountMenuRef}>
              <button
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="site-account-trigger"
                onClick={() => setAccountOpen((value) => !value)}
                title="Account"
                type="button"
              >
                <AvatarPreview avatar={avatar} initials="AD" key={`trigger-${avatarKey}`} />
              </button>

              <input
                accept="image/*"
                className="site-avatar-input"
                onChange={(event) => {
                  chooseAvatarFile(event.currentTarget.files?.[0]);
                  event.currentTarget.value = "";
                }}
                ref={avatarInputRef}
                type="file"
              />

              {accountOpen && (
                <div className="site-settings-menu" role="menu">
                  <div className="site-settings-head">
                    <button
                      aria-label="Change profile picture"
                      className="site-settings-avatar-button"
                      onClick={() => avatarInputRef.current?.click()}
                      title="Change profile picture"
                      type="button"
                    >
                      <AvatarPreview avatar={avatar} initials="AD" key={`menu-${avatarKey}`} size="md" />
                    </button>
                    <span className="site-settings-who">
                      <span className="site-settings-name">Andrea Dailey</span>
                      <span className="site-settings-handle">{profilePath}</span>
                    </span>
                  </div>

                  <div className="site-settings-section">
                    <div className="site-settings-label">Profile photo</div>
                    <div className="site-avatar-tools">
                      <button className="site-avatar-action" onClick={() => avatarInputRef.current?.click()} type="button">
                        Upload photo
                      </button>
                      <button
                        className="site-avatar-action"
                        disabled={!avatar.image}
                        onClick={() => saveAvatar({ ...avatar, image: undefined })}
                        type="button"
                      >
                        Use initials
                      </button>
                    </div>
                    <div className="site-avatar-controls" aria-label="Initials style">
                      {(["fill", "outline"] as const).map((mode) => (
                        <button
                          className={avatar.mode === mode ? "is-active" : undefined}
                          key={mode}
                          onClick={() => saveAvatar({ ...avatar, mode })}
                          type="button"
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <div className="site-avatar-swatches" aria-label="Initials color">
                      {avatarColors.map((color) => (
                        <button
                          aria-label={`Use ${color}`}
                          className={avatar.color === color ? "is-active" : undefined}
                          key={color}
                          onClick={() => saveAvatar({ ...avatar, color })}
                          style={{ backgroundColor: color }}
                          type="button"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="site-settings-section">
                    <div className="site-settings-label">Profile</div>
                    <button className="site-settings-row" onClick={copyProfileLink} role="menuitem" type="button">
                      <span className="site-settings-row-main">
                        {copyMessage === "Copied" ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Copy size={16} aria-hidden="true" />
                        )}
                        <span>{copyMessage}</span>
                      </span>
                    </button>
                    <Link className="site-settings-row" href={profilePath} onClick={() => setAccountOpen(false)} role="menuitem">
                      <span className="site-settings-row-main">
                        <ExternalLink size={16} aria-hidden="true" />
                        <span>View profile</span>
                      </span>
                    </Link>
                    <Link className="site-settings-row" href="/settings?tab=profile" onClick={openProfileSettings} role="menuitem">
                      <span className="site-settings-row-main">
                        <Settings size={16} aria-hidden="true" />
                        <span>Profile settings</span>
                      </span>
                    </Link>
                  </div>

                  <div className="site-settings-section">
                    <div className="site-settings-label">Account</div>
                    <button className="site-settings-row" onClick={toggleTheme} role="menuitem" type="button">
                      <span className="site-settings-row-main">
                        {theme === "light" ? (
                          <Moon size={16} aria-hidden="true" />
                        ) : (
                          <Sun size={16} aria-hidden="true" />
                        )}
                        <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
                      </span>
                      <span className={theme === "light" ? "site-settings-switch is-on" : "site-settings-switch"} aria-hidden="true" />
                    </button>
                    <Link className="site-settings-row" href="/settings" onClick={() => setAccountOpen(false)} role="menuitem">
                      <span className="site-settings-row-main">
                        <Settings size={16} aria-hidden="true" />
                        <span>Account settings</span>
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>
        <div className="page">{children}</div>
        <footer className="site-footer" aria-label="Site footer">
          <span className="site-footer-brand">
            <span>BUILDING EMPIRES © 2026</span>
          </span>
          <span className="site-footer-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/help">Help</Link>
          </span>
          <span className="site-social-links" aria-label="Social accounts">
            {socialLinks.map((link) => (
              <a
                aria-label={link.name}
                href={link.href}
                key={link.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <SocialIcon name={link.name} />
              </a>
            ))}
          </span>
        </footer>
      </div>
    </div>
  );
}
