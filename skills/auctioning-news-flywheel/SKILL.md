---
name: auctioning-news-flywheel
description: Build auctioning.lol as a news flywheel, not a static board.
version: 0.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [auctioning, narrative, races, rp]
    related_skills: [auctioning-race-card, auctioning-hybrid-ledger]
---

# auctioning.lol news flywheel

Product is **news from races**, not a frozen pay-to-rank table. outbid.lol is the static ancestor (visit the site to see who paid). auctioning.lol keeps that ad inventory but rank is **race position in a window**. Implement in this repo's native stack (Shuttle/Axum/Postgres + Leptos + Anchor + MagicBlock). Do not revive the old Next.js/Supabase plan from early Grok chats.

## When to Use

- Designing or coding auctioning.lol product behaviour
- Writing narrative/tape/social copy from race events
- Deciding lifetime board vs a time-bounded race
- User mentions overtakes, trends, Hermes vs OpenClaw, 400% increase, play-to-rank

Don't use for: generic Solana deploy steps (use `auctioning-hybrid-ledger`); inventing extra race **names** (use `auctioning-race-card`).

## North star

- **Sticker price:** $1 purchased = 1 **paid** RP. Always. Transparent on the project page.
- **Events** may credit extra **race pace** as `event_multiplier` lots. Dollars do not change.
- **Lifetime grid** = all-time allocations. **Race window** = only RP inside `starts_at..ends_at`.
- The story we want: OpenClaw overtakes Hermes in a 2-week GP while Hermes still leads lifetime. That is an emerging trend, not "OpenClaw is bigger."
- Velocity = RP in the last `velocity_secs`. Momentum = this window minus the previous equal window. Percent increase is windowed velocity vs prior window — never implied as all-time.
- Every significant event (overtake, photo finish, lead change, dark-horse, significant spend) must be narratable: X, TikTok script, Instagram carousel, newsletter, timeline. Facts only from ledger + race_events. HITL before publish.

## Procedure

1. If a rank moved, ask: **which window?** If missing, do not write lifetime as if it were the race.
2. Paid inflow: write `source=paid` for the dollar amount; if an active card applies, also `grant_free_lot(..., EventMultiplier)` for the bonus pace.
3. Derive grid from `project_allocations` only. Do not invent standings in copy.
4. Narrative templates must include: handles, window name, P-from → P-to, optional % pace change, explicit "not overall" when lifetime rank differs.
5. Operator approve/skip/mark-published. No auto-post to social networks.

Completion: a windowed overtake produces copy that a stranger can screenshot without confusing it for the all-time board.

## Pitfalls

- Treating free RP as on-chain or cashable.
- Applying a multiplier to `paid_rp` instead of a separate multiplier lot (breaks 1:1 advertising).
- Using Sprint/GP names from Grok chats as the only catalog — lock names from `auctioning-race-card`.
- Empty board: seed outbid listings at 0 RP so races can start.

## Verification

- Unit: multiplier split (100 paid @ 1.5x → 100 paid + 50 event_multiplier).
- Narrative fixture: overtake in window, lifetime unchanged → body contains window name and "not overall" / equivalent.
- `cargo test -p shuttle-auctioning narrative`
