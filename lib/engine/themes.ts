import type { ProfileThemeId } from "./types";

export type ProfileTheme = {
  id: ProfileThemeId;
  name: string;
  label: string;
  description: string;
  colors: {
    canvas: string;
    surface: string;
    surfaceSoft: string;
    surfaceLift: string;
    border: string;
    borderStrong: string;
    text: string;
    textSoft: string;
    muted: string;
    accent: string;
    accentStrong: string;
    accentSoft: string;
    buttonText: string;
    shadow: string;
    grid: string;
  };
};

export const profileThemes: ProfileTheme[] = [
  {
    id: "midnight",
    name: "Midnight",
    label: "Dark",
    description: "Black canvas, cream type, restrained signal.",
    colors: {
      canvas: "#050505",
      surface: "#0d0d0d",
      surfaceSoft: "rgba(255, 255, 255, 0.035)",
      surfaceLift: "rgba(255, 255, 255, 0.055)",
      border: "rgba(255, 255, 255, 0.1)",
      borderStrong: "rgba(255, 255, 255, 0.18)",
      text: "#f7f0df",
      textSoft: "#d8cfc0",
      muted: "#8f8577",
      accent: "#ff6a00",
      accentStrong: "#ffb16b",
      accentSoft: "rgba(255, 106, 0, 0.16)",
      buttonText: "#050505",
      shadow: "rgba(0, 0, 0, 0.32)",
      grid: "rgba(255, 255, 255, 0.08)",
    },
  },
  {
    id: "arcade",
    name: "Arcade",
    label: "Play",
    description: "Dark stage, violet signal, creator energy.",
    colors: {
      canvas: "#070611",
      surface: "#111022",
      surfaceSoft: "rgba(233, 213, 255, 0.045)",
      surfaceLift: "rgba(233, 213, 255, 0.075)",
      border: "rgba(192, 132, 252, 0.16)",
      borderStrong: "rgba(192, 132, 252, 0.3)",
      text: "#fbf7ff",
      textSoft: "#ddd2ee",
      muted: "#9487aa",
      accent: "#a855f7",
      accentStrong: "#d8b4fe",
      accentSoft: "rgba(168, 85, 247, 0.16)",
      buttonText: "#080411",
      shadow: "rgba(0, 0, 0, 0.4)",
      grid: "rgba(192, 132, 252, 0.08)",
    },
  },
  {
    id: "clean-white",
    name: "Clean White",
    label: "Light",
    description: "Gallery surface, ink type, quiet premium finish.",
    colors: {
      canvas: "#f7f7f2",
      surface: "#ffffff",
      surfaceSoft: "rgba(10, 14, 20, 0.035)",
      surfaceLift: "rgba(10, 14, 20, 0.055)",
      border: "rgba(10, 14, 20, 0.12)",
      borderStrong: "rgba(10, 14, 20, 0.2)",
      text: "#101316",
      textSoft: "#3d4147",
      muted: "#707782",
      accent: "#ef3b2d",
      accentStrong: "#111827",
      accentSoft: "rgba(239, 59, 45, 0.1)",
      buttonText: "#ffffff",
      shadow: "rgba(10, 14, 20, 0.12)",
      grid: "rgba(10, 14, 20, 0.08)",
    },
  },
  {
    id: "redline",
    name: "Redline",
    label: "Sharp",
    description: "Black editorial base with precise red signal.",
    colors: {
      canvas: "#070707",
      surface: "#111111",
      surfaceSoft: "rgba(255, 255, 255, 0.04)",
      surfaceLift: "rgba(255, 255, 255, 0.065)",
      border: "rgba(255, 255, 255, 0.11)",
      borderStrong: "rgba(239, 68, 68, 0.32)",
      text: "#f8f3ee",
      textSoft: "#d9d0ca",
      muted: "#978c86",
      accent: "#ef4444",
      accentStrong: "#ffb4b4",
      accentSoft: "rgba(239, 68, 68, 0.14)",
      buttonText: "#050505",
      shadow: "rgba(0, 0, 0, 0.36)",
      grid: "rgba(255, 255, 255, 0.075)",
    },
  },
  {
    id: "neon",
    name: "Neon",
    label: "Signal",
    description: "Graphite base with one luminous green accent.",
    colors: {
      canvas: "#050806",
      surface: "#0e1411",
      surfaceSoft: "rgba(220, 255, 225, 0.045)",
      surfaceLift: "rgba(220, 255, 225, 0.07)",
      border: "rgba(190, 242, 100, 0.15)",
      borderStrong: "rgba(190, 242, 100, 0.28)",
      text: "#f4fff1",
      textSoft: "#d8ead3",
      muted: "#8fa188",
      accent: "#a3e635",
      accentStrong: "#f1ff9a",
      accentSoft: "rgba(163, 230, 53, 0.14)",
      buttonText: "#07110d",
      shadow: "rgba(0, 0, 0, 0.38)",
      grid: "rgba(190, 242, 100, 0.075)",
    },
  },
  {
    id: "cozy-dark",
    name: "Cozy Dark",
    label: "Warm",
    description: "Soft dark room, warm type, calmer contrast.",
    colors: {
      canvas: "#0b0a08",
      surface: "#15120f",
      surfaceSoft: "rgba(255, 246, 229, 0.04)",
      surfaceLift: "rgba(255, 246, 229, 0.065)",
      border: "rgba(255, 246, 229, 0.12)",
      borderStrong: "rgba(255, 213, 128, 0.26)",
      text: "#fbf1df",
      textSoft: "#decfb8",
      muted: "#9a8c76",
      accent: "#f59e0b",
      accentStrong: "#ffe0a3",
      accentSoft: "rgba(245, 158, 11, 0.13)",
      buttonText: "#120c05",
      shadow: "rgba(0, 0, 0, 0.35)",
      grid: "rgba(255, 246, 229, 0.07)",
    },
  },
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    label: "Work",
    description: "Titanium black, silver type, product-system polish.",
    colors: {
      canvas: "#08090a",
      surface: "#111316",
      surfaceSoft: "rgba(235, 245, 250, 0.045)",
      surfaceLift: "rgba(235, 245, 250, 0.075)",
      border: "rgba(226, 232, 240, 0.12)",
      borderStrong: "rgba(226, 232, 240, 0.22)",
      text: "#f5f7f7",
      textSoft: "#d7dedf",
      muted: "#8e979f",
      accent: "#94a3b8",
      accentStrong: "#f1f5f9",
      accentSoft: "rgba(148, 163, 184, 0.14)",
      buttonText: "#06080a",
      shadow: "rgba(0, 0, 0, 0.38)",
      grid: "rgba(215, 226, 232, 0.08)",
    },
  },
];

export function getProfileTheme(themeId?: ProfileThemeId) {
  return profileThemes.find((theme) => theme.id === themeId) ?? profileThemes[0];
}
