# Profile engine

One profile infrastructure for every product: people, brands, products, gamer
personas, and shops are all the same thing — an entity with blocks, links,
relationships, and an append-only event ledger.

This repo is the runnable prototype: a dev viewer UI over seed data, plus the
real Postgres schema for when it moves to Supabase.

## Run it

```bash
npm run dev
```

Open http://localhost:3000 — pick a profile, click the facet tabs
(work / play / life / stuff), and use the dashed "+" buttons in Proof of work
to simulate ledger events and watch XP and the feed update live.

## Where things live

- `lib/engine/types.ts` — the engine's data model
- `lib/engine/seed.ts` — fake data standing in for the database
- `lib/engine/logic.ts` — XP math (Streamo's level curve, lifted as-is)
- `components/ProfileView.tsx` — the profile shell (header, facet tabs, rails, blocks, ledger feed)
- `sql/schema.sql` — the real Supabase/Postgres schema, multi-tenant from day one

## Going live later

1. Create a Supabase project and run `sql/schema.sql`.
2. Replace the imports from `lib/engine/seed.ts` with Supabase queries
   (the shapes match the tables one-to-one).
3. Enable RLS policies scoped by `workspace_id`.

Design notes: XP is always derived from the `events` ledger (never a stored
counter), badge rules are data not code, and scores stay scoped per product
while badges travel with the person.
