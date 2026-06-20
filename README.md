# Profile engine

One profile infrastructure for every product: people, brands, products,
projects, books, apps, offers, communities, studios, and shops are all the same
thing: a public profile with rooms, links, items, schedule rows, relationships,
and an append-only event ledger.

This repo is the standalone MVP. It renders public profile pages from seed data
today, exposes a small selector API for other projects, and includes the
Postgres schema for moving the same shapes into Supabase.

## Run it

```bash
npm run dev
```

Open http://localhost:3000. Pick a profile, click the room tabs, and confirm the
same record can show identity, proof, products/offers, schedule, links,
relationships, and activity.

## Where things live

- `lib/engine/types.ts` — the engine's data model
- `lib/engine/seed.ts` — fake data standing in for the database
- `lib/engine/selectors.ts` — reusable profile resolvers for standalone and cross-project views
- `components/ProfileView.tsx` — the profile shell: header, rooms, modules, products/offers, schedule, links, relationships, updates
- `sql/schema.sql` — the real Supabase/Postgres schema, multi-tenant from day one

## V1 shape

The north star from the saved Building Empires notes:

> A simple public home for everything you are, make, sell, share, and do.

V1 includes:

- Public profile pages by handle.
- Controlled profile types, statuses, rooms, vibes, and tags.
- Show/hide room modules, no drag-and-drop builder.
- External offer/product cards, no native checkout.
- Simple schedule rows, no full calendar app.
- Contact/support modules that link out.
- Activity updates and relationships.
- Context presets so Andrea in Public, Building Empires, Atla, Streamo, and Habits can show different rooms from the same profile.

Cut from V1: marketplace, leaderboards, native checkout, memberships, customer
portal, custom domains, comments, and complex site building.

## Going live later

1. Create a Supabase project and run `sql/schema.sql`.
2. Replace the seed imports inside `lib/engine/selectors.ts` with Supabase
   queries. Keep the selector function names stable so consuming sites do not
   change.
3. Enable RLS policies scoped by `workspace_id`.

Design notes: activity/progress should always derive from the `events` ledger
instead of stored counters, badge rules should stay data not code, and each
site should consume profiles through selectors instead of reading tables
directly.
