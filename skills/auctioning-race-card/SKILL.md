---
name: auctioning-race-card
description: Unique auctioning.lol race formats and operator event cards.
version: 0.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [auctioning, races, events, multipliers]
    related_skills: [auctioning-news-flywheel, auctioning-hybrid-ledger]
---

# Race cards (formats + operator events)

Canonical **names** for tracks and timed modifiers. Do not ship generic "weekend blitz" as a product name. $1 still buys 1 paid RP; cards only add `event_multiplier` pace.

Full catalog: `references/catalog.md` in this skill directory.

## When to Use

- Creating `race_windows`, operator events, or admin UI
- Seeding default GPs / genre tracks
- Applying purchase-time multipliers
- Naming live visual states or specials

Don't use for: narrative copy rules (news-flywheel) or Solana tx prep (hybrid-ledger).

## Race formats (windows)

Store as `race_windows.race_type` + `rules` JSON. Durations are defaults; operator can override `starts_at`/`ends_at`.

| slug | display | default length | notes |
|---|---|---|---|
| `green_flag` | Green Flag | 1h | Qualifying heat. Fast grid, high velocity noise. |
| `pace_lap` | Pace Lap | 6h | Short attention burst. |
| `sector_scrap` | Sector Scrap | 48h | One `tag`/genre only (AI, coffee, agents, …). |
| `grand_tour` | Grand Tour | 7d | Default weekly GP. |
| `title_fight` | Title Fight | 30d | Championship. Reigns matter. |
| `photo_card` | Photo Card | last 10% of parent | Nested final-lap overlay on another window. |
| `open_grid` | Open Grid | unbounded | Lifetime board treated as a race for telemetry only. |

Genre tracks = `race_windows.tag` (NULL = whole board). Categories compete **inside** a Sector Scrap, not by mixing lifetime totals.

## Operator event cards (multipliers)

Table `operator_events`: `slug`, `name`, `multiplier_bps` (10000 = 1.0x), `starts_at`, `ends_at`, optional `tag`, optional `window_id`.

On paid credit: `bonus = floor(paid * (bps - 10000) / 10000)` as EventMultiplier lot. If bps <= 10000, no bonus.

Locked slugs (do not rename casually):

| slug | display | default bps | vibe |
|---|---|---|---|
| `afterburner` | Afterburner | 15000 | 1.5x pace. The example formerly called "weekend blitz". |
| `night_grid` | Night Grid | 20000 | 2x, typically 00:00–06:00 UTC. |
| `pit_lane` | Pit Lane | 12500 | 1.25x, mid-week recovery. |
| `green_monday` | Green Monday | 15000 | Week-open surge. |
| `darkhorse_window` | Darkhorse Window | 17500 | 1.75x, underdog hours. |
| `rivalry_card` | Rivalry Card | 15000 | Scoped to two handles in `rules`. |
| `final_lap` | Final Lap | 12500 | Auto-attached to last 10% of a Grand Tour. |

Visual states (UX only, not extra RP): `CLEAR_TRACK`, `HOT_TRACK`, `NIGHT_GRID`.

## Procedure

1. Look up **active** operator_events overlapping `now()` and matching tag/window.
2. If several match, use the **highest** bps (do not stack unless `rules.stack=true`).
3. Credit paid 1:1, then multiplier lot with `reason = event:{slug}`.
4. Seed at least one live `grand_tour` + one `sector_scrap` on boot if none exist.
5. Narrative must name the **card** ("Afterburner") not "bonus RP".

Completion: `GET /v1/events/active` returns the live card; a test purchase during Afterburner writes paid + event_multiplier.

## Pitfalls

- Stacking Afterburner + Night Grid by accident (default: max, not product).
- Putting bonus into `paid_rp` (breaks 1:1 advertising and on-chain receipts).
- Using outbid-style static "bid amount" as rank.

## Verification

- `split_purchase(100, 15000) == (100, 50)`
- Inactive card → bonus 0
- `cargo test -p shuttle-auctioning events`
