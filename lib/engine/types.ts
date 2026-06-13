// Entity types and facets mirror sql/schema.sql — keep the check constraints in sync.
export type EntityType = "person" | "brand" | "product" | "gamer" | "seller";
export type Facet = "work" | "play" | "life" | "stuff";

export type PatternKind = "dots" | "grid" | "diagonal" | "diamond" | "none";

export type Theme = {
  accent: string;
  pattern: PatternKind;
};

export type Entity = {
  id: string;
  handle: string;
  name: string;
  type: EntityType;
  tagline: string;
  about?: string;
  initials: string;
  theme: Theme;
  // Vibe tags, generalized from Streamo: short expressive taste/personality
  // chips. In the real schema these become edges to canonical tag entities.
  tags: string[];
  // Current consecutive-day activity streak; derived from the ledger once live.
  streak?: number;
};

export type Relationship = {
  from: string;
  to: string;
  kind: "parent" | "owner";
};

export type Block = {
  id: string;
  entityId: string;
  facet: Facet;
  title: string;
  body: string;
  cta?: string;
};

export type LinkItem = {
  entityId: string;
  label: string;
  url: string;
};

export type EngineEvent = {
  id: string;
  entityId: string;
  facet: Facet;
  kind: string;
  label: string;
  xp: number;
  at: string;
};

export type Badge = {
  id: string;
  name: string;
  desc: string;
  icon: string;
};

export type EarnedBadge = {
  entityId: string;
  badgeId: string;
};
