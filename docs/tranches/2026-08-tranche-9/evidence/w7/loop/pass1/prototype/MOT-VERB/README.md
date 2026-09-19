# MOT-VERB — pass 1, PROTOTYPE · the pencil verbs, running

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52`,
branch `worktree-wf_e58b4764-0fc-52`, cut at `aab67b92`. Nothing committed; the agglomerator
reads `git -C <worktree> diff --stat` (26 files, +351/-89, plus two new scripts).

It RUNS. Two BUILT dists — the prototype and a HEAD control, both `npx vite build` — served
static, chromium and webkit headless, 390x844 dsf3 touch and 1280x800, both themes. Every
number below is a reading off those dists, and every born-RED figure is re-measured on the
control rather than quoted from the spec.

**PORTS, a declared deviation.** The charter names 4247, "the next free in 4230-4249"
otherwise. At run time all twenty were held by concurrent lanes (`lsof` scan banked in this
record: 4247 is the MAIN tree's own dev server, 4246 is worktree `…-0fc-48`). Each dist is
therefore served by the probe's own static server on `127.0.0.1:0`, an OS-assigned ephemeral
port, which cannot collide with a lane that names one. **The first I1 readings of this session
were taken against 4246/4247 before that was noticed and are void** — they measured other
people's trees. Every figure here is from the probe's own servers.

---

## 1. The gates

| gate | HEAD (measured on the control) | prototype | verdict |
|---|---|---|---|
| P6 `lint:verbs` unadmitted | **51** unadmitted · 19 admitted · 0 stale (70 declarations fail the law) | **0** unadmitted · 19 admitted · 0 stale | GREEN, exit 0 |
| P4 publisher | set absent (`--rung-`/`--verb-` count 0 in HEAD's index.css) | **13 of 13 rows, divergent 0**; own-ms verbs 1 (dusk) | GREEN |
| P5 twins, midpoint opacity ratio | **19.30** chromium · **19.30** webkit | **1.00** · **1.00** | GREEN |
| RUB OUT live | `native: false`, no exit animation on `.margin-note-ink` | `native: true` — `ink-rub-out 0.2s cubic-bezier(0.32, 0, 0.67, 0) backwards` | GREEN, 4/4 cells |
| PRM at the ladder | DrawerTab **150ms** under reduce (live element) · CrayonHeart **240ms** · WashiLabel **150ms** | **0s · 0s · 0s**, both engines | GREEN |
| I1 exit fold plays | RED x4 — `exitRunning 0`, first state `finished`, no transform | **GREEN x4** — 61/62 (chromium), 30/31 (webkit) running frames with a live transform | GREEN |
| I3-A mirror | GREEN | GREEN | holds |
| I3-B glass durations homed | RED, **8 homeless** | **0 homeless**, 2 distinct glass durations, both named | GREEN |
| I6 every duration named | RED, 77 declarations / 35 literals | RED, **28 / 22** | see §4 — GREEN is unreachable for this instrument |
| `check-theme-tokens` | GREEN (0 dead) | GREEN (0 dead) — two dead tokens found and cured mid-pass, §3 | holds |
| `lint:motion` | GREEN 34 specs | GREEN 34 specs | holds |
| `check-copy-register` | GREEN, 2 admitted | GREEN, 2 admitted, zero new strings | holds |
| r6 law probe (9 rows) | 6 GREEN / 3 born-RED | identical, row for row | pi |
| vue-tsc · vitest · prettier | — | **0 errors · 810/810 in 66 files · clean** | GREEN |

Born-RED banked BEFORE the cure: `readings/born-red-HEAD.txt` (the gate run with
`SRC=<HEAD export>`). 51 cure by assignment, 19 admit, 70 total — the synthesis said 70/52/18,
so the split is one row different and the total is exact.

## 2. The surfaces, measured

**The twins** (`readings/p5-twins.json`). The cascade read: each rule's own declaration off
the built stylesheet, its custom properties resolved against `:root`, its curve evaluated at
t=100ms of its own window.

- control: deck `opacity .2s var(--ease-glassGlide)` -> 0.045 · chrome `opacity .2s var(--ease-fadeOut)` -> 0.872 · **ratio 19.30**
- prototype: both read `opacity var(--rung-breath) var(--verb-lift-ease)` -> **0.872 / 0.872, ratio 1.00**, identical in both engines.

**The exit fold** (`readings/i1-exit-fold.txt`). The mechanism cure is one line in
`restoreBoardAnims`: a CSS animation carries a name and a transition a property, a script
mover carries neither, so `animKey(a) === ""` is the whole discriminator and the walk stops
finishing the fold it was arming one tick later. Measured cause, not a guess: a
`finish`/`cancel` trace on the host named `restoreBoardAnims` as the caller, at `currentTime
0`, 1ms after the mover was created.

**The drawer and the dock** (`readings/drawer-identity.json`). Read as geometry, because the
pixel arm the brief asks for has a noise floor this rig cannot clear (two loads deal different
puzzles and start the boil on different phases: a cross-dist screenshot diff read 225,811
differing pixels on the desk, which is the deal and the grain, not the drawer). The claim the
cure makes is read off the movers instead — every mover's duration, easing, fill and its
transform matrix at t=260ms:

- desk 1280x800: **IDENTICAL**, both engines. Four movers (board, tab, masthead, controls), all `520ms`, all `cubic-bezier(0.32, 0.72, 0, 1)`, `fill none`, same matrix to the last digit (`matrix(1,0,0,1,-8.59116,0)` chromium).
- dock 390x844: the sheet mover **identical** (520ms, glass, `translateY 28.3797px` at t=260ms). The control carries ONE MORE running animation that the prototype does not: `sparkle-icon`, `200ms ease` — the `transition: all` leak into the dock gesture that the synthesis predicted (R4 D8). Cured: the census reads 2 movers at HEAD and 1 here.

**The dusk** (`readings/dusk-and-gestures.json`). Six alternating flips, chromium at 4x CPU:

| | control | prototype |
|---|---|---|
| warm median | 8.70ms / 114.9 fps | 8.70ms / 114.9 fps |
| worst warm frame | 59.2ms | 58.3ms |
| webkit (1x) median | 17.00ms / 58.8 fps | 17.00ms / 58.8 fps |

Parity to the digit. The guard's ABSOLUTE thresholds (median >=116 fps, worst <=34ms) are not
reproduced by this harness — **the control fails them too** — so the honest reading is
control-versus-prototype parity, not a pass against a number taken on another rig. The painted
curve is identical by construction and the built CSS says so: control `background-color .35s,
color .35s!important` (the minifier drops `ease`, which is the initial value), prototype
`background-color var(--verb-dusk-ms) var(--verb-dusk-ease), …` resolving to `.35s
cubic-bezier(.25,.1,.25,1)` — which IS `ease`'s definition.

**The fifteen gestures at 1x**: frames >33ms, control 0 (chromium) / 1 at 35.0ms (webkit);
prototype **0 / 0**. Zero new long frames. Live filters 27 elements / 13 distinct / 15 `<filter>`
elements — identical on both dists.

**RUB OUT** (`readings/` + the four crops). On a real hint note ("only 6 fits here"):
`ink-rub-out`, `0.2s`, `cubic-bezier(0.32, 0, 0.67, 0)`, `backwards`; **1 distinct glyph box
across 14 frames**; font unchanged every frame; clip retreats to `inset(0 0 0 100%)` and
opacity holds 0 at rest. Under `reduce` the animation is `none` and the SAME FRAME already
reads `inset(0 0 0 100%)` / opacity 0 — the rest pose is the end pose, so no `fill: forwards`
and no `FILL_ALLOWLIST` row. Crops are the verb paused at exactly t=100ms: clip **12.78%**,
opacity **0.8722**, identical in both engines — which is LIFT's curve at its midpoint, the same
0.872 the twins read.

Frames (4, 30KB total, 390x844 dsf3): `frames/rubout-t100-{dark,light}-{chromium,webkit}.png`.

## 3. What the prototype found that the spec did not

1. **A verb the stylesheet never spends must not be published.** `--verb-turn-ease` had no CSS
   consumer (every turn is a script mover) and `check-theme-tokens` red on it as dead ink.
   `turn` now carries `published: false`; the publisher emits **13 rows, not 14**, and the
   two-layer diff still covers every token that exists. TURN's CSS mirror, where CSS needs one,
   is `--ease-glassGlide` — byte-identical, unmoved, I3-A GREEN.
2. **A second `--ease-*` folds whole.** The ghost draw-on's two sites are the focus ghost being
   WRITTEN IN, so the verb took them and `--ease-ghostDraw` lost its last consumer. Retired
   with the same ruling as `--ease-fadeOut`. Two tokens die this pass, not one. It also carries
   the pass's second visible retime: **180ms -> 200ms** on the focus ghost.
3. **LAY DOWN may not spend `breath`.** The spec assigns the sparkle's cure "LAY DOWN @ breath"
   and LAY DOWN's own rung set is page/sheet/mark/touch. Built as **LAY DOWN @ mark** (200 ->
   250, +50ms on a hover), which the gate accepts. Either the rung set gains `breath` or the
   row is `touch`; the agglomerator rules.
4. **The fence belongs on the DURATION, not the delay.** Three rows red on rung-set violations
   that were all DELAYS (`player-row-close` at step, the star tuck at page, and a second
   property's own duration read as the first's). A delay is a wait, not a gesture: the gate now
   splits a shorthand at top-level commas and fences the first time in each term.
5. **A ledger keyed on line numbers reds for reasons nobody caused.** Three false stale runs
   while this family was built — a comment added above, then prettier reflowing two files. The
   key is now `file :: declaration text`, stable under reflow and still exact-matched both ways.
6. **The drawer has ONE clock in code, not two.** "desk TURN @ page, dock SLIDE @ page" is one
   `spend()` at one seam: both verbs ride the glass curve and both may spend `page`, so the
   three poses keep the single clock they have always shared. The dock's rung question stays a
   one-word edit at that seam (U-10).
7. **I2's defect has a sibling: I6.** I6 counts comments, the dev rig, `var(--x, 160ms)`
   fallbacks and every admitted row, so GREEN is unreachable for it by construction. It drops
   77/35 -> **28/22**, and the 28 decompose exactly: **19 admitted + 4 dev rig + 2 var()
   fallbacks + 2 `visibility 0s` steps + 1 comment**. P6 is its ledger-aware successor; I6
   should be marked superseded beside I2 in the r0 record.

## 4. Gaps, honestly

- **The pixel-diff arm of proof 5 is not delivered as asked.** 0 differing pixels is
  unreachable on this rig at all: the deal and the boil phase differ between two loads. The
  geometry reading above is what replaces it, and it is a stronger claim about the movers and a
  weaker one about the frame. A real pixel arm needs a seeded deal and a frozen boil.
- **The dusk guard's absolute thresholds are not reproduced here** (the control reads 114.9 fps
  / 59.2ms against a floor of 116 fps / 34ms). Parity is proven; the floor is not tested.
- **Colour steps are sampler-dependent** on this harness (control 16-21, prototype 17-21), so
  the "<=17 steps" clause has no reliable reading here.
- **The critique lane's independent re-assignment (proof 9) has not been banked**, so the sweep
  went in on the p2 table as adopted. Every row the sweep spent is in the diff and the gate
  reads all of them; a disagreement list against p2 is still owed.
- **Goldens 4/4 were not re-run** (they need the golden config and a served dist on a named
  port; the band was full). No golden is mid-transition, so no DELTA is claimed — unverified,
  not asserted.
- **`check-font-coverage` was not re-run.** Zero rendered strings changed (copy register GREEN,
  no template text in the diff), so the claim is structural, not measured.
- **The I1 cure is carried but not adjudicated.** It edits `restoreBoardAnims`, which is App's
  seam, not this family's file. The tuple is MOT-VERB's; the mechanism row belongs to whoever
  the agglomerator says.
- **`--ease-accelIn`'s two timing consumers** moved to LIFT as the spec says, and the token
  keeps its two shape consumers — but the AUC claim ("within 2%, invisible") is argued, not
  measured. No one looked at the laminate leave in this pass.
- The per-file PRM blocks the ladder now covers are still in place (spec: they die next pass),
  and the three duration aliases still stand.
