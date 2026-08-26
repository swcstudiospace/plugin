# Warp-quiet landing + timeline (aimeecodes, 2026-08-23 session)

Session record for the "make the TUI significantly cleaner, copy Warp CLI
verbatim" pass on `/root/src/repos/aimeecodes` (branch `feat/warp-quiet-tui`).
Class-level guidance lives in the two SKILL.md files; this file records the
concrete before/after and file map so a future slice can diff against it.

## What the operator rejected (before)

Landing was ~25 lines of chrome before the first prompt:

1. Framed splash card: rounded border titled `🍑 Aimee Codes 🍑`, version in
   the top-right title, `N agents · font: JetBrains Mono` bottom title.
2. `LOOP ━━━` LineGauge at ratio 1.0 (pure decoration).
3. Tabs row (`:sage research · :muse plan · :aimee implement · +14 specialists`).
4. Three rows of 17 agent chips.
5. Bold lime tagline `CLI agent flock · 17 specialists · Warp palette`.
6. Second framed box: `commands · Warp palette` table with 8 rows.
7. Third boxed TIP: zsh-plugin encouragement (DisplayBox).

Timeline noise: `HH:MM:SS` clock on every chip line; `DBG Initialize <uuid>`
per conversation; spinner suffix `· Ctrl+C to interrupt` every tick.

## What shipped (after)

Splash = figlet art + one muted meta line + one full-flock chip row:

```text
___    ____ __  _______ ______
 ...art...
v0.1.0 · 17 agents · font: JetBrains Mono      <- gold version, muted rest
:aimee implement  :muse plan  :sage research …  <- single flock row
/ for commands · : agents · ! for shell         <- dim hint line
```

Timeline line = `│ CHIP  Title  subtitle` (dim violet gutter, no clock):

```text
│ TOOL   Read  src/main.rs:1-50
│ AGNT   FE_RUST → implement the parser     (gold arrow)
```

Spinner = `⠋ Thinking 03s`. Conversation-id DEBUG removed via
`print_conversation_status` becoming a no-op (id still available via `:info`).

## File map

| Concern | Path |
|---------|------|
| Splash layout, command sheet, chips | `crates/aimee_main/src/banner.rs` |
| Chip/gutter rendering, clock removal | `crates/aimee_main/src/title_display.rs` |
| Spinner format (`styled_loader_line`) | `crates/aimee_spinner/src/lib.rs` |
| DBG conversation-id removal | `crates/aimee_main/src/ui.rs` (`print_conversation_status`) |
| Palette constants (unchanged) | `crates/aimee_main/src/theme.rs` |

## Gotchas hit

- `splash_area()` height must shrink with the layout; the old value (+9) left
  blank rows that buffer_to_ansi then trimmed unevenly.
- **Flock clipping:** the first quiet pass kept ONE flock row and only
  `:fe-web3` survived — chips are ~14–25 visible cols each, so 17 never fit.
  Fixed with greedy width wrapping (`wrap_chips(width)` → rows of owned
  `(String, String)`, reborrowed as `&str` per row for `render_chips_slice`);
  splash height = art + meta + wrapped-row count. Test needle must come from
  the LAST chip (`:plat-sre`) — a first-chip assertion passes even when the
  row clips everything after it. (Also tried `div_ceil(2)` halves first —
  same clipping, fixed counts are always wrong for variable-width chips.)
- Banner tests asserted removed chrome (`LOOP`, `🍑`, TAGLINE) — rewrite as
  negative assertions (`!contains('╭')`, `!contains('╰')`).
- Removing widgets orphaned imports (Block, BorderType, LineGauge, Row,
  Table, Tabs) and `chrono::Local` — clippy `-D warnings` catches these only
  at test-build time.
- `colored`: `.truecolor(r,g,b)` not `.fg()`; final hint line wrapped in
  `.dimmed()`.
- `styled_loader_line` had TWO format sites (`fixed` prefix and final
  `styled` string); removing the Ctrl+C suffix required editing both or the
  build fails on the orphaned `suffix`.
- **Concurrent-agent worktree hazard:** while this slice ran, another agent
  edited `ui.rs`/`pod.rs`/`.devcontainer/` in the same checkout. Committing
  `git add ui.rs` wholesale would have shipped their half-finished
  pod-attach feature. Surgical staging options: commit only files you own,
  or `git add -p`; leave their edits in the tree and say so in the PR.
