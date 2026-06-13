import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import {
  badges,
  blocks,
  earnedBadges,
  entities,
  events,
  links,
  relationships,
} from "@/lib/engine/seed";
import type { Entity } from "@/lib/engine/types";

export function generateStaticParams() {
  return entities.map((e) => ({ handle: e.handle }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const entity = entities.find((e) => e.handle === handle);
  if (!entity) notFound();

  const byId = (id: string) => entities.find((e) => e.id === id);
  const isEntity = (e: Entity | undefined): e is Entity => Boolean(e);

  const parents = relationships
    .filter((r) => r.from === entity.id && r.kind === "parent")
    .map((r) => byId(r.to))
    .filter(isEntity);
  const childEntities = relationships
    .filter((r) => r.to === entity.id && r.kind === "parent")
    .map((r) => byId(r.from))
    .filter(isEntity);
  const owners = relationships
    .filter((r) => r.to === entity.id && r.kind === "owner")
    .map((r) => byId(r.from))
    .filter(isEntity);
  const owns = relationships
    .filter((r) => r.from === entity.id && r.kind === "owner")
    .map((r) => byId(r.to))
    .filter(isEntity);

  const earnedIds = new Set(
    earnedBadges.filter((eb) => eb.entityId === entity.id).map((eb) => eb.badgeId)
  );
  const entityBadges = badges.filter((b) => earnedIds.has(b.id));
  // Locked badges show only on profiles that have started earning — aspiration
  // mechanics for people, not noise on brand/product pages.
  const lockedBadges = entityBadges.length > 0 ? badges.filter((b) => !earnedIds.has(b.id)) : [];

  return (
    <ProfileView
      entity={entity}
      blocks={blocks.filter((b) => b.entityId === entity.id)}
      links={links.filter((l) => l.entityId === entity.id)}
      parents={parents}
      childEntities={childEntities}
      owners={owners}
      owns={owns}
      initialEvents={events.filter((e) => e.entityId === entity.id)}
      badges={entityBadges}
      lockedBadges={lockedBadges}
    />
  );
}
