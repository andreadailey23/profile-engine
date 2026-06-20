-- Profile engine schema, for Supabase (Postgres).
-- Multi-tenant from day one: every row hangs off a workspace so the engine
-- can serve other people's products later without a rewrite.

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- One row per person, brand, product, project, app, book, offer, community,
-- studio, or shop.
-- Flexible fields go in data (jsonb), same pattern as Atla's nodes table.
create table entities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  handle text not null unique,
  type text not null check (type in ('person','brand','product','project','book','app','creator','collection','company','offer','community','studio')),
  name text not null,
  tagline text,
  about text,
  status text not null default 'building'
    check (status in ('building','live','selling','testing','paused','planned','archived','coming-soon')),
  visibility text not null default 'public'
    check (visibility in ('public','private')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table relationships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  from_entity uuid not null references entities(id),
  to_entity uuid not null references entities(id),
  kind text not null check (kind in ('parent','owner','related')),
  unique (from_entity, to_entity, kind)
);

-- Blocks are the public modules rendered in the profile shell.
-- room powers show/hide modules and site-specific views.
create table blocks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  entity_id uuid not null references entities(id),
  room text not null check (room in (
    'identity',
    'positioning',
    'proof',
    'work',
    'products',
    'posts',
    'links',
    'activity',
    'schedule',
    'shop',
    'support',
    'contact',
    'details',
    'offers',
    'use-cases',
    'buy',
    'updates',
    'media',
    'community',
    'clips',
    'marketplace',
    'games',
    'streams',
    'books',
    'channels',
    'reports'
  )),
  kind text not null default 'text',
  title text not null,
  body text,
  cta text,
  position int not null default 0,
  config jsonb not null default '{}'::jsonb
);

create table links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  entity_id uuid not null references entities(id),
  label text not null,
  url text not null,
  position int not null default 0
);

-- External offer/product cards first. Native checkout waits until later.
create table items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  entity_id uuid not null references entities(id),
  item_type text not null check (item_type in ('app','book','store','tool','media','project','pick','service','course','offer','collection','community')),
  kind_label text,
  display_group text check (display_group in ('work','product','pick')),
  title text not null,
  description text,
  url text,
  price text,
  cta_label text,
  status text not null default 'building'
    check (status in ('building','live','selling','testing','paused','planned','archived','coming-soon')),
  data jsonb not null default '{}'::jsonb,
  position int not null default 0
);

-- Simple schedule module. No full calendar app in V1.
create table schedule_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  entity_id uuid not null references entities(id),
  title text not null,
  detail text,
  starts_at timestamptz not null,
  type text not null check (type in ('live','stream','podcast','event','drop','office-hours','location-hours','availability','launch','booking')),
  tags text[] not null default '{}',
  url text,
  visible boolean not null default true,
  data jsonb not null default '{}'::jsonb
);

-- Append-only ledger. Single source of truth for XP, streaks, badges,
-- activity feeds, and proof-of-work blocks. Never update or delete rows.
create table events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  entity_id uuid not null references entities(id),
  room text not null check (room in ('identity','positioning','proof','work','products','posts','links','activity','schedule','shop','support','contact','details','offers','use-cases','buy','updates','media','community','clips','marketplace','games','streams','books','channels','reports')),
  kind text not null,
  label text not null,
  xp int not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index events_entity_idx on events (entity_id, created_at desc);

-- Vibe tags, generalized from Streamo: canonical tags as rows, profiles
-- point at them via edges. Same pattern later for games/artists/films
-- (taste layer) — matching is "count shared edges", never string compares.
create table tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  name text not null,
  kind text not null default 'vibe',
  unique (workspace_id, kind, name)
);

create table entity_tags (
  entity_id uuid not null references entities(id),
  tag_id uuid not null references tags(id),
  primary key (entity_id, tag_id)
);

-- Per-profile appearance: owner-chosen accent color and pattern, plus
-- avatar/banner storage paths once Supabase storage is wired up.
create table themes (
  entity_id uuid primary key references entities(id),
  accent text not null default '#8b5cf6',
  pattern text not null default 'none'
    check (pattern in ('dots','grid','diagonal','diamond','none')),
  avatar_url text,
  banner_url text
);

-- Badge definitions are data, not code: no hardcoded UUIDs in routes,
-- conditions live in rule (jsonb) and are evaluated by one checker.
create table badges (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  name text not null,
  description text,
  icon text,
  xp_reward int not null default 0,
  rule jsonb not null default '{}'::jsonb
);

create table earned_badges (
  entity_id uuid not null references entities(id),
  badge_id uuid not null references badges(id),
  earned_at timestamptz not null default now(),
  primary key (entity_id, badge_id)
);

-- XP is always derived from the ledger, never stored as a counter.
create view entity_xp as
  select entity_id, coalesce(sum(xp), 0) as xp_total
  from events
  group by entity_id;

-- TODO before production: enable row level security on every table and
-- scope policies by workspace_id.
