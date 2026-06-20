import {
  activity,
  houses,
  items,
  links,
  modules,
  relationships,
  schedule,
} from "./seed";
import type { House, RoomType } from "./types";

export type ProfileContext =
  | "standalone"
  | "building-empires"
  | "andrea-in-public"
  | "atla"
  | "streamo"
  | "habits";

export type ProfileRecord = ReturnType<typeof getProfileRecord>;

export const profileContexts: Array<{
  id: ProfileContext;
  label: string;
  description: string;
  rooms: RoomType[];
}> = [
  {
    id: "standalone",
    label: "Standalone",
    description: "The full public profile for a person, brand, product, or community.",
    rooms: ["identity", "positioning", "proof", "products", "offers", "schedule", "links", "contact", "activity"],
  },
  {
    id: "building-empires",
    label: "Building Empires",
    description: "Tools, systems, offers, store paths, and profile setup.",
    rooms: ["identity", "positioning", "proof", "products", "offers", "schedule", "support", "links", "activity"],
  },
  {
    id: "andrea-in-public",
    label: "Andrea in Public",
    description: "Build logs, essays, products, offers, and public proof.",
    rooms: ["identity", "positioning", "proof", "work", "products", "posts", "links", "activity"],
  },
  {
    id: "atla",
    label: "Atla",
    description: "Work sections, products, reports, files, support, and activity.",
    rooms: ["identity", "positioning", "proof", "work", "products", "reports", "support", "links", "activity"],
  },
  {
    id: "streamo",
    label: "Streamo",
    description: "Games, streams, creator links, community proof, and schedule.",
    rooms: ["identity", "positioning", "proof", "games", "streams", "products", "schedule", "links", "activity"],
  },
  {
    id: "habits",
    label: "Habits That Matter",
    description: "Books, shop, offers, posts, support, and useful habit proof.",
    rooms: ["identity", "positioning", "proof", "books", "shop", "offers", "support", "links", "activity"],
  },
];

export function getPublicProfiles() {
  return houses.filter((house) => house.visibility === "public");
}

export function getProfileByHandle(handle: string) {
  return houses.find((house) => house.handle === handle);
}

export function getProfilesForContext(context: ProfileContext) {
  const allowed = new Set(getContext(context).rooms);

  return getPublicProfiles().filter((house) =>
    house.rooms.some((room) => allowed.has(room)),
  );
}

export function getContext(context: ProfileContext) {
  return profileContexts.find((item) => item.id === context) ?? profileContexts[0];
}

export function getProfileRecord(handle: string, context: ProfileContext = "standalone") {
  const house = getProfileByHandle(handle);
  if (!house) return undefined;

  const byId = (id: string) => houses.find((item) => item.id === id);
  const isHouse = (item: House | undefined): item is House => Boolean(item);
  const contextRooms = new Set(getContext(context).rooms);
  const visibleRooms = house.rooms.filter((room) => context === "standalone" || contextRooms.has(room));

  return {
    house,
    context: getContext(context),
    visibleRooms,
    modules: modules.filter((module) => module.houseId === house.id && visibleRooms.includes(module.room)),
    links: links.filter((link) => link.houseId === house.id),
    parentHouses: relationships
      .filter((relationship) => relationship.from === house.id && relationship.kind === "parent")
      .map((relationship) => byId(relationship.to))
      .filter(isHouse),
    childHouses: relationships
      .filter((relationship) => relationship.to === house.id && relationship.kind === "parent")
      .map((relationship) => byId(relationship.from))
      .filter(isHouse),
    ownerHouses: relationships
      .filter((relationship) => relationship.to === house.id && relationship.kind === "owner")
      .map((relationship) => byId(relationship.from))
      .filter(isHouse),
    ownsHouses: relationships
      .filter((relationship) => relationship.from === house.id && relationship.kind === "owner")
      .map((relationship) => byId(relationship.to))
      .filter(isHouse),
    relatedHouses: relationships
      .filter((relationship) => relationship.kind === "related" && (relationship.from === house.id || relationship.to === house.id))
      .map((relationship) => byId(relationship.from === house.id ? relationship.to : relationship.from))
      .filter(isHouse),
    items: items.filter((item) => item.houseId === house.id),
    schedule: schedule
      .filter((item) => item.houseId === house.id && item.visible)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    updates: activity.filter((update) => update.houseId === house.id),
  };
}

export function getEngineStats() {
  const publicProfiles = getPublicProfiles();

  return {
    profiles: publicProfiles.length,
    roomTypes: new Set(publicProfiles.flatMap((house) => house.rooms)).size,
    products: items.length,
    scheduled: schedule.filter((item) => item.visible).length,
  };
}
