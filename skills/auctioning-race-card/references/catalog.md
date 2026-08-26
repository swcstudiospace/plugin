# Race + event catalog (canonical names)

Origin: grok.com share `c2hhcmQtNA_5d8ea637-fbba-49e2-a2a6-a3ea59e7e18f` (perpetual race / GitHub-trending overtakes) and share `bGVnYWN5LWNvcHk_be55c0a5-c645-4898-954d-b4077979237d` (horse/F1 for businesses). Product names below are **ours**, not outbid clones and not “weekend blitz”.

## Formats (`race_windows.race_type` / slug)

| slug | display | default | from the chats |
|---|---|---|---|
| green_flag | Green Flag | 1h | daily sprint / flash auction window |
| pace_lap | Pace Lap | 6h | short attention burst |
| sector_scrap | Sector Scrap | 48h | category = track |
| grand_tour | Grand Tour | 7d | Grand Prix |
| title_fight | Title Fight | 30d | Championship / hold the line |
| photo_card | Photo Card | last 10% of parent | photo-finish overlay |
| open_grid | Open Grid | unbounded | lifetime / perpetual race |

## Operator cards (`operator_events`)

multiplier_bps: 10000 = 1.0x. Bonus pace only (`event_multiplier`). Paid RP stays 1 USD = 1 RP.

| slug | display | bps | chat analog |
|---|---|---|---|
| afterburner | Afterburner | 15000 | “weekend boost” / cheaper impact |
| night_grid | Night Grid | 20000 | Night Race visual + 2x |
| pit_lane | Pit Lane | 12500 | mid-week recovery |
| green_monday | Green Monday | 15000 | week-open surge |
| darkhorse_window | Darkhorse Window | 17500 | come-from-behind |
| rivalry_card | Rivalry Card | 15000 | two-handle battle |
| final_lap | Final Lap | 12500 | last 10% of Grand Tour |

Do not stack cards unless `rules.stack=true`. Default = highest bps wins.

## UX states (no extra RP)

CLEAR_TRACK, HOT_TRACK, NIGHT_GRID — velocity arrows, surging badges, “just overtook” feed (GitHub-trending analog).
