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
    id: "obsidian-ember",
    name: "Obsidian Ember",
    label: "Edition",
    description: "Black glass, warm signal, sharp editorial contrast.",
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
    id: "liquid-graphite",
    name: "Liquid Graphite",
    label: "Glass",
    description: "Titanium black, cool light, quiet product-system finish.",
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
      accent: "#7dd3fc",
      accentStrong: "#d8f3ff",
      accentSoft: "rgba(125, 211, 252, 0.14)",
      buttonText: "#061015",
      shadow: "rgba(0, 0, 0, 0.38)",
      grid: "rgba(215, 226, 232, 0.08)",
    },
  },
  {
    id: "porcelain-ink",
    name: "Porcelain Ink",
    label: "Gallery",
    description: "Bright gallery surface, ink type, redline energy.",
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
    id: "garden-lumen",
    name: "Garden Lumen",
    label: "Calm",
    description: "Deep botanical canvas with clean luminous highlights.",
    colors: {
      canvas: "#07110d",
      surface: "#0e1a15",
      surfaceSoft: "rgba(233, 250, 238, 0.045)",
      surfaceLift: "rgba(233, 250, 238, 0.075)",
      border: "rgba(209, 250, 229, 0.12)",
      borderStrong: "rgba(209, 250, 229, 0.22)",
      text: "#eef7ef",
      textSoft: "#d5e7db",
      muted: "#8fa79a",
      accent: "#a3e635",
      accentStrong: "#f8ff99",
      accentSoft: "rgba(163, 230, 53, 0.14)",
      buttonText: "#07110d",
      shadow: "rgba(0, 0, 0, 0.35)",
      grid: "rgba(209, 250, 229, 0.08)",
    },
  },
];

export function getProfileTheme(themeId?: ProfileThemeId) {
  return profileThemes.find((theme) => theme.id === themeId) ?? profileThemes[0];
}
