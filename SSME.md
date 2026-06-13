# SSME — the ship gate

Simple. Scalable. Minimal. Effective. Not a slogan — a gate. Nothing merges
into the engine until it passes all four questions. A failing answer means
redesign, not exception.

## 1. Simple — does it reuse a concept or invent one?

The engine has exactly four concepts: entity, edge, event, block. A new
feature must be expressible in those. If it genuinely needs a fifth concept,
it must replace one — never sit beside the others.

- Pass: vibe tags = edges to tag entities. No new concept.
- Fail: a separate "interests system" with its own tables and its own UI.

## 2. Scalable — does it work the same at 1 user and 100,000?

Multi-tenant by default (workspace_id on every table). Derived, never
duplicated: XP is a sum over the ledger, not a stored counter. No feature may
require critical mass to be useful — it must earn its place at N=1.

- Pass: proof-of-work feed (useful on day one, alone).
- Fail: a matching feature shipped before there is anyone to match.

## 3. Minimal — is the choice set curated?

Options are a curated set, not an open field. Patterns, not custom CSS.
Four facets, not user-defined taxonomies. Could we ship half of this and
learn the same thing? Then ship half.

- Pass: 7 accent colors x 5 patterns.
- Fail: a theme builder with a CSS box (MySpace died of this).

## 4. Effective — does it do something, or just say something?

Every block earns its place by enabling an action (book, buy, follow, vote)
or showing proof (ledger receipts, live data). Self-reported text is the
last resort, never the centerpiece. Receipts over claims.

- Pass: "Work with me" with a booking action attached.
- Fail: an "endorsements" list anyone can type into.

## How to use this file

Reviewing a feature, a PR, or an idea: answer all four questions in one
sentence each. Write the answers in the PR description. If any answer
needs a paragraph of justification, the answer is no.
