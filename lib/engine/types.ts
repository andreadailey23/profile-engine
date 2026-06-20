export type HouseType =
  | "person"
  | "brand"
  | "product"
  | "project"
  | "book"
  | "app"
  | "creator"
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
  | "planned";

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
  | "offers"
  | "games"
  | "streams"
  | "books"
  | "channels"
  | "reports";

export type House = {
  id: string;
  handle: string;
  name: string;
  type: HouseType;
  shortDescription: string;
  description: string;
  initials: string;
  primaryColor: string;
  status: HouseStatus;
  owner: string;
  tags: string[];
  vibes: string[];
  rooms: RoomType[];
  visibility: "public" | "private";
};

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
    | "community";
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
