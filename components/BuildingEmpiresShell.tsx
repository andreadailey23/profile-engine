"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  ExternalLink,
  Home,
  Info,
  LogIn,
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

const primaryNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
];

const siteNav: NavItem[] = [
  { href: "/profiles", label: "Profiles", icon: UserRound },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/best-of", label: "Best of", icon: Star },
];

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
  const [copyMessage, setCopyMessage] = useState("Copy profile link");
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const profilePath = "/andrea-dailey";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("building-empires-theme", theme);
  }, [theme]);

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
            {collapsed ? (
              <ChevronsRight size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
              <ChevronsLeft size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>

        <nav className="aw-nav" aria-label="Primary navigation">
          <div className="aw-nav-group aw-nav-group-main">
            <NavItems items={primaryNav} pathname={pathname} />
          </div>
          <div className="aw-nav-group">
            <div className="aw-nav-label">The Site</div>
            <NavItems items={siteNav} pathname={pathname} />
          </div>
        </nav>

        <div className="aw-spacer" />
        <div className="aw-rail-footer">
          <p className="aw-rail-note">
            TOOLS NOW. PROFILES NEXT<span className="aw-rail-note-dot">.</span>
          </p>
        </div>
      </aside>

      <div className="aw-canvas">
        <header className="site-topbar" aria-label="Site navigation">
          <div className="site-topbar-title">Explore</div>
          <label className="site-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Search" placeholder="Search" type="search" />
          </label>
          <nav className="site-account-nav" aria-label="Account navigation">
            <Link className="site-login-link" href="/login">
              <LogIn size={15} strokeWidth={2} aria-hidden="true" />
              <span>Log in</span>
            </Link>

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
                AD
              </button>

              {accountOpen && (
                <div className="site-settings-menu" role="menu">
                  <div className="site-settings-head">
                    <span className="site-settings-avatar" aria-hidden="true">AD</span>
                    <span className="site-settings-who">
                      <span className="site-settings-name">Andrea Dailey</span>
                      <span className="site-settings-handle">{profilePath}</span>
                    </span>
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
                    <Link className="site-settings-row" href={`${profilePath}#basics`} onClick={() => setAccountOpen(false)} role="menuitem">
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
                        <span>Settings</span>
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
            <span className="site-footer-tagline">
              Express your world<span className="site-footer-dot">.</span>
            </span>
          </span>
          <span className="site-footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/profiles">Profiles</Link>
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/best-of">Best of</Link>
          </span>
          <span className="site-footer-parent">
            Powered by the profile engine
          </span>
        </footer>
      </div>
    </div>
  );
}
