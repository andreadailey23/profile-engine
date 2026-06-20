export type ProfileCoverId =
  | "grid-glow"
  | "soft-spotlight"
  | "clean-band"
  | "signal-lines"
  | "harlequin"
  | "arcade-grid"
  | "bookplate"
  | "soundwave"
  | "artist-geometry";

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
  {
    id: "harlequin",
    label: "Classic",
    name: "Harlequin",
    description: "A clean diamond pattern with editorial drama.",
    grid: false,
  },
  {
    id: "arcade-grid",
    label: "Gamer",
    name: "Arcade Grid",
    description: "A sharp game-world grid without visual noise.",
    grid: false,
  },
  {
    id: "bookplate",
    label: "Books",
    name: "Bookplate",
    description: "Quiet page bands for authors and readers.",
    grid: false,
  },
  {
    id: "soundwave",
    label: "Music",
    name: "Soundwave",
    description: "Soft signal bars for music and media profiles.",
    grid: false,
  },
  {
    id: "artist-geometry",
    label: "Artist",
    name: "Geometry",
    description: "Clean geometric blocks for visual profiles.",
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

  if (coverId === "harlequin") {
    return `
      repeating-conic-gradient(from 45deg, ${colors.accentSoft} 0% 25%, transparent 0% 50%) 0 0 / 42px 42px,
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  if (coverId === "arcade-grid") {
    return `
      radial-gradient(circle at 18% 28%, ${colors.accent}55 0%, transparent 22%),
      linear-gradient(${colors.grid} 1px, transparent 1px) 0 0 / 34px 34px,
      linear-gradient(90deg, ${colors.grid} 1px, transparent 1px) 0 0 / 34px 34px,
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.canvas} 100%)
    `;
  }

  if (coverId === "bookplate") {
    return `
      linear-gradient(90deg, transparent 0 11%, ${colors.accentSoft} 11% 13%, transparent 13% 24%, ${colors.grid} 24% 25%, transparent 25%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  if (coverId === "soundwave") {
    return `
      repeating-linear-gradient(90deg, transparent 0 16px, ${colors.accentSoft} 16px 22px, transparent 22px 38px),
      radial-gradient(circle at 76% 22%, ${colors.accent}42 0%, transparent 28%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  if (coverId === "artist-geometry") {
    return `
      linear-gradient(135deg, ${colors.accentSoft} 0 18%, transparent 18% 100%),
      linear-gradient(45deg, transparent 0 62%, ${colors.grid} 62% 64%, transparent 64% 100%),
      radial-gradient(circle at 74% 34%, ${colors.accent}38 0%, transparent 24%),
      linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
    `;
  }

  return `
    linear-gradient(118deg, ${colors.accent}42 0%, ${colors.accentSoft} 34%, transparent 64%),
    linear-gradient(180deg, ${colors.surfaceLift} 0%, ${colors.surface} 100%)
  `;
}
