export type ProfileCoverId = "grid-glow" | "soft-spotlight" | "clean-band" | "signal-lines";

export type ProfileCoverColors = {
  accent: string;
  accentSoft: string;
  canvas: string;
  grid: string;
  surface: string;
  surfaceLift: string;
};

export type ProfileCover = {
  description: string;
  grid: boolean;
  id: ProfileCoverId;
  label: string;
  name: string;
};

export const profileCovers: ProfileCover[] = [
  {
    id: "grid-glow",
    label: "Default",
    name: "Grid Glow",
    description: "The clean profile grid with a soft accent wash.",
    grid: true,
  },
  {
    id: "soft-spotlight",
    label: "Soft",
    name: "Spotlight",
    description: "A quieter cover with one focused glow.",
    grid: false,
  },
  {
    id: "clean-band",
    label: "Minimal",
    name: "Clean Band",
    description: "Simple, calm, and more editorial.",
    grid: false,
  },
  {
    id: "signal-lines",
    label: "Signal",
    name: "Signal Lines",
    description: "Structured lines for a sharper profile.",
    grid: false,
  },
];

export function validProfileCoverId(value: string | null): ProfileCoverId | undefined {
  return profileCovers.some((cover) => cover.id === value) ? (value as ProfileCoverId) : undefined;
}

export function getProfileCover(value: ProfileCoverId | undefined) {
  return profileCovers.find((cover) => cover.id === value) ?? profileCovers[0];
}

export function profileCoverBackground(colors: ProfileCoverColors, coverId: ProfileCoverId) {
  if (coverId === "soft-spotlight") {
    return `
      radial-gradient(circle at 22% 32%, ${colors.accent}52 0%, transparent 34%),
      radial-gradient(circle at 78% 18%, ${colors.accentSoft} 0%, transparent 34%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  if (coverId === "clean-band") {
    return `
      linear-gradient(90deg, ${colors.accentSoft} 0%, transparent 28%, transparent 72%, ${colors.accentSoft} 100%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  if (coverId === "signal-lines") {
    return `
      repeating-linear-gradient(115deg, ${colors.grid} 0 1px, transparent 1px 18px),
      linear-gradient(118deg, ${colors.accent}36 0%, transparent 42%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.canvas} 100%)
    `;
  }

  return `
    linear-gradient(118deg, ${colors.accent}42 0%, ${colors.accentSoft} 34%, transparent 64%),
    linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
  `;
}
