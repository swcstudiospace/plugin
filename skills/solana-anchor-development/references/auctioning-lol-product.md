# auctioning.lol product north star

Repo: `/root/src/repos/auctioning`. Full file map: repo-root `AUCTIONING.md`.

## What it is

Upgraded **outbid.lol**. Outbid is a *static* pay-to-rank ad board: whoever paid most sits highest; the listing *is* the ad because you only see it if you open the site.

auctioning.lol keeps that ad inventory but the board is a **race**, not a frozen bid. Rank = race position. Spending RP is fuel/pace, not buying a slot.

## Pricing vs race pace

- **Sticker:** 1 purchased RP = $1 USD. Whop checkout and public copy stay 1:1.
- **Events do not change the dollar.** They change how much *race pace* that dollar writes (`event_multiplier` source: weekend blitz 1.5x, Double RP Hour, etc.).
- Ledger already has `RpSource::EventMultiplier`. Missing product: an operator event (name, multiplier, window, track) that actually credits extra race-RP at paid inflow time — not just tagging the source.

Free/promo RP stays off-chain, FIFO lots, never cashable. Never write it on-chain.

## Two boards (the news engine)

1. **Lifetime** (`GET /v1/grid`) — all-time allocations. Hermes can stay #1 forever.
2. **Windowed race** (`GET /v1/races/windows/{slug}/grid`) — Sprint / GP / Championship / Special. OpenClaw can overtake Hermes in a 2-week GP while still losing lifetime. That *is* the emerging-trend story.

Velocity = RP in last `velocity_secs` (default 3600). Momentum = this window minus the previous equal window. Events: `overtake`, `lead_change`, `photo_finish`, `dark_horse_rise`, `significant_spend`.

**Why the product exists:** those windowed events become news-worthy social posts (“OpenClaw +400% this GP, still #4 lifetime”) with a link back to the board. Operator approve-before-publish (`publish.rs`); no auto-post. Narrative templates must cite **window / % / not-overall** — do not invent standings.

## Hybrid stack (do not collapse)

- Private Postgres: balances, free lots, catalog, allocations, windows, ticks, narrative.
- Anchor mainnet: paid receipts + race open/settle only. Program id `3GGYRVymmKQhmxP9nw9yPs8HCf7YWw7WViPjkKFkZNGs` (set `PROGRAM_ID` secret; keypair gitignored `keys/auctioning-keypair.json`).
- MagicBlock ER: live ticks; settle back via `settle_race`.
- Backend prepares unsigned txs; Phantom signs. Keys never server-side.

## Next product slices (when asked to keep building)

1. Operator event rules applying multiplier at paid credit.
2. Narrative copy that cites windowed % vs lifetime rank.
3. Race-day board as the screenshot surface (not an admin button farm).
