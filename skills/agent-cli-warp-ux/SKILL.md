---
name: agent-cli-warp-ux
description: "Use when building Warp-like multi-agent CLI UX."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [warp, cli, tui, ratatui, rustyline, agents, slash-commands, aimee]
    related_skills: [ratatui-agent-tui, omega-loops-cli, hermes-telegram-remote-control]
    created_by: agent
---

# Agent CLI Warp UX

Class skill for multi-agent coding CLIs that should feel like **Warp CLI**:
quiet timeline, full agent flock on splash, slash command palette, enterprise
XML prompt packs, and parallel specialist swarm.

**Canonical operator tree:** `/root/src/repos/aimeecodes` (bin `aimee`). Also
applies to any ratatui + rustyline agent CLI with the same preferences.

## When to use

- Operator wants Warp 1:1 palette/font or “make it look like Warp”
- Landing only shows 3 agents but the tree has a full specialist roster
- `/` does not open a command menu
- Only 1 built-in slash command; need enterprise packs with XML bodies
- Turns feel serial / one-agent-at-a-time despite multi-agent design
- Timeline lacks TOOL / SKILL / AGENT hop visibility

Don't use for: Telegram stop photos (`hermes-telegram-remote-control`), pure
install/smoke without UX (`omega-loops-cli` install section only).

## Operator preferences (hard)

1. **Warp dark palette + IBM Plex Mono** — font face follows the
   os.swcstudio.space house font (`--font-mono-stack: "IBM Plex Mono", …`),
   NOT Warp's JetBrains Mono. Font stays host-side: `theme::WARP_FONT_FACE`
   documents it and `.devcontainer/devcontainer.json` sets
   `terminal.integrated.fontFamily`/`fontSize` (14 = VS Code default 12+2).
2. Timeline lanes: **TOOL / SKIL / AGNT → / DONE** — not prose titles or bubble mockups.
3. Splash lists **all** built-in agents; prompt chips stay compact.
4. **`/` or `:` on empty line opens the full command palette.**
5. Multi-lane work **swarms** via parallel `task` subagents (`/swarm` + orchestrator policy).
6. **Quiet landing beats framed chrome.** The operator rejected the framed
   splash card (bordered box + gauge + tabs + 3 chip rows + framed command
   table + TIP box = ~25 lines before the first prompt) as "significantly
   not clean". Warp-quiet contract: figlet art + ONE dim meta line
   (`v0.1.0 · 17 agents · font: IBM Plex Mono`) + ONE flock row, then a
   single dim hint line (`/ for commands · : agents · ! for shell`). No
   frames (`╭╰`), no gauges/tabs on the landing, no boxed tips.
7. **Timeline quietness:** no clock on every timeline line — chip carries
   kind, title carries payload; drop session-id DEBUG lines (`Initialize
   <uuid>`) from the visual flow; spinner is `tick message elapsed` with NO
   `Ctrl+C to interrupt` suffix (trusts the keyboard).
8. **Width-adaptive surfaces (2026-08 pass):** splash/chips clamp to real
   terminal width via `crate::utils::terminal_columns()`, flock-row count is
   computed from wrapped rows (no constant height), `chips_ansi` swaps to a
   compact tail under ~90 cols, and editor.rs suppresses the right-aligned
   status prompt when `left + 20 input columns + right > width`.
9. **Context-fill meter on the right prompt (2026-08, Grok Build pattern):**
   `ctx N%` between tokens and model — dimmed ≤70%, bold yellow 71–90%, red
   91%+. Hidden without a known `Model.context_length` or when inactive
   (never fake a baseline). Lives in BOTH `prompt.rs` (`AimeePrompt`) and
   `zsh/rprompt.rs` (`ZshRPrompt`, 256-color twins of the truecolor bands);
   keep the two in sync. Source: `/root/src/repos/grok-build`
   `xai-grok-status-line` contract treats context used/total as first-class.

## Procedure

### 1. Palette

Lock Warp dark RGB in theme module + unit tests:

| Token | RGB |
|-------|-----|
| Accent blue | `01 A4 FF` |
| Green | `00 D6 7E` |
| Gold | `FF CC 02` |
| Magenta | `BF 7A F0` |
| Violet | `7C 5C FF` |
| Body | `E6 E6 E6` |
| Void | `0B 0D 12` |
| Red | `F1 4C 4C` |

Also: `ratatui-agent-tui/references/warp-palette-and-slash-menu.md`.

### 2. Timeline

Domain categories Tool/Skill/Agent + presentation gutter/chip + short tool verbs
+ agent `NAME → task`. See `ratatui-agent-tui` Warp-clean timeline.

### 3. Splash flock

All built-in agent chips must actually render — **never split the roster by
fixed counts** (`div_ceil(2)` halves clipped at ~82 cols; only `:fe-web3` of
row 1 survived). Chips are variable width (` key ` + ` label ` + gap ≈
14–25 cols), so use **greedy width wrapping**: accumulate chips into rows
while they fit the buffer width, then lay out N single-line rows via
`Layout::vertical(repeat_n(Length(1), n))`. Verify with a test needle from
the LAST chip (`:plat-sre`) plus a no-frame assertion (`!contains('╭╰')`) —
a first-chip-only test passes even when the row clips everything after it.
Prompt chips stay compact regardless: loop trio + `+N more · / for cmds`.
Note `render_chips_slice(&str, &str)` borrows — own the wrapped rows as
`Vec<Vec<(String, String)>>` and reborrow per row.

### 4. Slash palette (rustyline 18)

```text
Empty bol `/` or `:` → ConditionalEventHandler → Cmd::Complete
Mid-line `/` → None → SelfInsert
Completer: empty line = full menu with sentinel `/`
File pick: only @[path]
Ctrl+/ → Complete
```

**No** `EventHandler::from(Vec<Cmd>)` — rustyline 18 does not implement it.

### 5. Enterprise commands

`commands/*.md` with YAML frontmatter + XML prompt body. Embed in loader
`init_default` via `include_str!`. Pack includes review, harden, incident,
ship, oncall, rfc, adr, migrate, perf, slo, threat-model, compliance, runbook,
postmortem, api-contract, k8s-review, cost, data-privacy, test-plan, swarm.

### 6. Swarm policy

Runtime often already parallelizes task tools (`join_all`). Serial feel =
orchestrator prompt. Teach orchestrator to fan out concurrent specialists;
ship `/swarm` for explicit multi-agent runs.

## Pitfalls

1. Selling synthetic bubble cards as “the TUI”
2. Hardcoding 3 splash agents
3. Sequence bindings on rustyline 18
4. File picker on every Complete (breaks URLs)
5. Inventing a new executor when task parallel already exists
6. Forgetting host font is JetBrains Mono (operator Warp 1:1)
7. **Splash test needles drift after de-chroming** — when the landing drops
   frames/tagline, update banner assertions together (`test_render_splash_*`
   asserted `LOOP`, `🍑`, tagline text; new quiet landing asserts absence of
   `╭╰` instead). Also delete now-dead imports/widgets (LineGauge, Tabs,
   Table, Block) or clippy `-D warnings` fails.
8. **`colored` API trap:** `.bold().fg(rgb)` does not exist — use
   `.truecolor(r, g, b)`; `nu_ansi_term` uses `.fg(Color::Rgb(...))`. Mixing
   them up across theme boundaries breaks the build.
9. **Spinner format is one function** — `styled_loader_line` builds tick +
   message + elapsed (+ optional suffix) twice via a `fixed` prefix and the
   final `styled` line; change BOTH format strings or the build breaks on the
   orphaned variable.
10. **`terminal_size` crate returns None when rows == 0** — `script`-style
    ptys, some CI runners, and fresh tmux panes report winsize (0, cols), so
    the crate's probe fails and every width-aware render silently falls back
    to 80. Use `crate::utils::terminal_columns()` (raw TIOCGWINSZ on stdout,
    then stderr, accepting rows==0).
11. **Right-prompt cursor escapes clamp at the margin** — `\x1b[999C` cannot
    move past the last column, so an over-wide right-aligned status paints
    over the user's typing instead of sitting beside it. Always gate on a fit
    check (`editor::right_fits`, ≥20 input columns reserved) and unit-test
    suppression at a narrow width plus retention at wide/None.
12. **Hardcoded splash widths wrap mid-chip** — an 82-col ratatui buffer on a
    ≤80-col terminal wraps every row; clamp width to the probed terminal and
    derive buffer height from the wrapped row count. PTY-smoke at 40/60/100
    cols (`script -qec "stty cols N; …"`) — unit tests can't see real width.

## Verification

```bash
cd /root/src/repos/aimeecodes
cargo test -p aimee_main --lib -- banner:: theme:: title_display::
cargo test -p aimee_services --lib -- command::
cargo test -p aimee_app --lib -- fmt::
```

Live: splash shows full flock; `/` opens menu; TOOL/SKIL/AGNT lanes in a run.

## Support files

- `ratatui-agent-tui/references/warp-palette-and-slash-menu.md`
- `omega-loops-cli/references/aimee-cli-ux.md`

## Related

- `ratatui-agent-tui` — banners, chips, timeline presentation
- `omega-loops-cli` — build/smoke for aimee/omega trees
- `omega-loops-agents` — agent prompt bodies
