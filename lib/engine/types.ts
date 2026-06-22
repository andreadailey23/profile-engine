export type ProfileThemeId =
  | "midnight"
  | "arcade"
  | "clean-white"
  | "redline"
  | "neon"
  | "cozy-dark"
  | "minimal-pro";

export type HouseType =
  | "person"
  | "brand"
  | "product"
  | "project"
  | "book"
  | "app"
  | "creator"
  | "collection"
  | "company"
  | "offer"
  | "community"
  | "studio";

export type HouseStatus =
  | "building"
  | "live"
  | "selling"
  | "testing"
  | "paused"
  | "planned"
  | "archived"
  | "coming-soon";

export type ProfileViewType =
  | "default"
  | "social"
  | "marketplace"
  | "professional"
  | "content"
  | "schedule"
  | "support"
  | "updates";

export type RoomType =
  | "identity"
  | "positioning"
  | "proof"
  | "work"
  | "products"
  | "posts"
  | "links"
  | "activity"
  | "schedule"
  | "shop"
  | "support"
  | "contact"
  | "details"
  | "offers"
  | "use-cases"
  | "buy"
  | "updates"
  | "media"
  | "community"
  | "clips"
  | "marketplace"
  | "games"
  | "streams"
  | "books"
  | "channels"
  | "reports"
  | "library";

export type ProfileHighlight = {
  label: string;
  value: string;
  detail?: string;
};

export type ProfileLibraryItemType =
  | "game"
  | "book"
  | "tool"
  | "music"
  | "show"
  | "product"
  | "resource";

export type ProfileLibraryItemStatus =
  | "playing"
  | "reading"
  | "using"
  | "recommend"
  | "want"
  | "finished";

export type ProfileLibraryItem = {
  id: string;
  houseId: string;
  title: string;
  type: ProfileLibraryItemType;
  status: ProfileLibraryItemStatus;
  tags: string[];
  note: string;
  url?: string;
};

export type House = {
  id: string;
  handle: string;
  name: string;
  type: HouseType;
  shortDescription: string;
  description: string;
  initials: string;
  avatarUrl?: string;
  bannerUrl?: string;
  live?: boolean;
  liveUrl?: string;
  liveEmbedUrl?: string;
  statusLine?: string;
  // Action wiring (host app drives these; engine emits events on click).
  supportUrl?: string;
  followable?: boolean;
  following?: boolean;
  viewerIsOwner?: boolean;
  level?: number;
  levelProgress?: number;
  primaryColor: string;
  themeId?: ProfileThemeId;
  status: HouseStatus;
  owner: string;
  roles: string[];
  tags: string[];
  vibes: string[];
  highlights?: ProfileHighlight[];
  selectedViews?: ProfileViewType[];
  defaultView?: ProfileViewType;
  rooms: RoomType[];
  visibility: "public" | "unlisted" | "private";
};

export type ProfileEntity = House;
export type ProfileEntityType = HouseType;
export type SectionBlock = HouseModule;

export type HouseRelationship = {
  from: string;
  to: string;
  kind: "owner" | "parent" | "related";
};

export type HouseModule = {
  id: string;
  houseId: string;
  room: RoomType;
  title: string;
  body: string;
  bullets?: string[];
  cta?: {
    label: string;
    href: string;
  };
};

export type HouseLink = {
  houseId: string;
  label: string;
  url: string;
  type: "website" | "shop" | "newsletter" | "social" | "contact" | "product";
};

export type HouseItem = {
  id: string;
  houseId: string;
  itemType:
    | "app"
    | "book"
    | "store"
    | "tool"
    | "media"
    | "project"
    | "pick"
    | "service"
    | "course"
    | "offer"
    | "collection"
    | "community"
    | "connector";
  kindLabel?: string;
  displayGroup?: "work" | "product" | "pick";
  title: string;
  description: string;
  url?: string;
  price?: string;
  ctaLabel?: string;
  status: HouseStatus;
  tags: string[];
};

export type ScheduleItem = {
  id: string;
  houseId: string;
  title: string;
  detail: string;
  startsAt: string;
  type:
    | "live"
    | "stream"
    | "podcast"
    | "event"
    | "drop"
    | "office-hours"
    | "location-hours"
    | "availability"
    | "launch"
    | "booking";
  tags: string[];
  url?: string;
  visible: boolean;
};

export type ActivityUpdate = {
  id: string;
  houseId: string;
  title: string;
  detail: string;
  status: HouseStatus;
  url?: string;
};
