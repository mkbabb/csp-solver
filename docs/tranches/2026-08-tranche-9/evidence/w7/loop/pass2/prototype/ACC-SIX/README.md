# ACC-SIX — the sixth crayon · pass-2 PROTOTYPE

Built and measured on the real surface, both engines, 2026-09-18. Worktree
`.claude/worktrees/wf_8630d340-e56-42`, branch `claude/wf_8630d340-e56-42`, uncommitted diff
(11 product/script files + 2 test files). Dev server 127.0.0.1:4237, private vite `cacheDir`,
killed on return. Probe sources in `probe/`, the MOVED r0 instrument in `instruments/`,
numbers in `readings/`, two crops in `frames/`.

## What the replay carried, and what it dropped

Pass 1's diff (`../../pass1/prototype/ACC-SIX/proto/acc-six-proto.diff`, 11 files) applied
`--3way` clean onto `a8fee1f5`. Pass 1 left no untracked product or test files. Dropped per the
spec and the chair: the `FRAME_PAD` hunk (chair §6.2 — the pads ship at HEAD's `12 / 0`), the
`--color-blue-ink` mint and its `--color-user-ink` alias, the `--color-focus-sketch` deletion
and the `gameCell.css` ring rewrite (chair §6.1 — §6 owns the token; this family reads it), the
`noteWriteMs` mint, and the tape's top-left straddle.

## The gates, as measured

| gate | reading | verdict |
|---|---|---|
| **G0 dash bound** | painted ring share at 1/5/10 writes of 20, desk light, reduce: chromium 3.16 / 18.33 / 45.76 · **webkit 19.66 / 94.72 / 96.91** | **RED — the cure does not work** |
| G1 kinship | six anchors, KIN_DEG 5, painted, both engines × both themes: `user-ink` 0.0° (was 11.5), `progress-ink` 0.0° / 0.3° (was 41.3), `solver-ink-2` 0.3° / 0.9° kin BY NAME. Exceptions left: stops 1/3/4 light, 1/4 dark, and the walk | GREEN |
| G2 the glow | painted filter carries the resolved token byte for byte, 5/5 runs, both engines: `drop-shadow(color(srgb 0.768627 0.709804 0.992157 / 0.3) 0 0 2px)` | GREEN |
| G3 print / forced | `.progress-trace` stroke `rgb(0,0,0)` under both media, both engines (chroma 0) | GREEN |
| G4 the verb | rest 4.99 light / 6.30 dark · hovered 4.69 / 5.08 · chroma 0.200 / 0.198 at both · ground `rgba(0,0,0,0)` · drawn box = the same red (3 of 4 arms read it; webkit dark returned no path — instrument gap) | GREEN, one arm unread |
| **G5 the tape** | laid at fill 1, `1 of 20 on the board` == `aria-valuetext`, `aria-hidden`, z 3, pointer-events none; `offsetTop` 0 (flush), right inset 1.18 % of the paper (7.49 px desk / 4.24 phone); masthead BOX and INK overlap 0 px² at all three viewports; **trace occlusion 0/0/0 desk both engines and phone chromium — 0/0/16 at 900×450 both engines, and 131/131/81 device px on webkit phone**; lifts 2530 ms after the third fill (2400 + 200, +0/−70); a fourth write shown, window not extended; undo-to-empty no resurrection; restored two-fill session no tape (unit) | **AMBER — the zero-occlusion claim fails at two of six arms** |
| G6 the seed | `clip-path` and `--washi-tilt` byte-equal across `1 of 20` → `2 of 20` on the live surface at all three viewports, both engines; three unit rows besides | GREEN |
| G7 the holder | `check-font-coverage` OK — 46 codepoints, 4312 B, **no re-cut**, the tape derived from the TEMPLATE (`tapeText`'s own literal), `:text="tapeText"` pinned in the bound census (4 pinned) | GREEN |
| G8 off-anchor | six anchors, 15° arc, painted board: light **0.13 %** chromium / **0.09 %** webkit (HEAD 64.29, gate ≤30) · dark **2.21 %** / **2.28 %** (HEAD 49.15, gate ≤5) | GREEN |
| G9 alias law | `check-theme-tokens` exits 0, but ALIAS-ONLY goes ∅ → **3** (`--color-answer-pale/-mid/-deep`). HEAD: 0 unreferenced, 0 alias-only | **AMBER — declared, see below** |
| G10 no stock hex | `#2563eb` / `#60a5fa` / `rgba(196,181,253` absent from `index.css` and `HandwrittenGlyph.vue` | GREEN |
| G11 guards | the four 1.4.11 ratios byte-identical to HEAD (3.36 / 3.85 light, 3.46 / 3.07 dark, both engines); digit 4.64 / 4.53 light, 7.70 / 7.86 dark; **filter census on the BUILT dist 12/12 both engines — `filterBudget` exact, area and all**; rainbow tolls ≥4.5; peer worst over 40 ≥4.5; `check-copy-register` 0 unadmitted; `check-live-regions` 10 regions unchanged; `lint:motion` 34/34; `check-theme-selectors`, `check-ink-pressure` OK; vue-tsc 0; vitest **66 files / 810 tests** at HEAD's battery + **23 new rows** | GREEN |

## The three findings this pass owns

**1. The dash law is not what §1 said it was, and the deletion does not cure it.** The DOM is
now honest in both engines — `poseLengths` agrees with `getTotalLength` to six figures
(3965.6307284166082 vs 3965.631591796875), and both engines compute the same
`stroke-dasharray` / `stroke-dashoffset` — yet WebKit paints the pattern REPEATING: at one
write of twenty chromium draws one short run from the top-left and WebKit draws three
disjoint runs (`frames/2-webkit-dash-repeats-desk-light.png`). Tried and measured: dash as a
presentation attribute with a CSS offset (webkit 19.88 %), both as presentation attributes
(19.88), both as CSS `px` (19.66). The declaration form is not the variable and `pathLength`
was not the cause. The next candidate is a deletion of the DASH, not of `pathLength`: slice
the pose polyline to the wanted arc length at bake time (`poseLengths` already walks it) and
render a partial path, which is engine-independent by construction. That trades one mutated
number for a re-baked `d` per fill, so it wants the beat measured before it lands.

**2. The tape's zero-occlusion claim is arithmetic, and the arithmetic has a floor.** The
front reaches `4·f·W` along the top edge, so the berth is clear iff `W·(1 − 4·f_max) ≥ inset +
tapeWidth`. Desk 636·0.4 = 254 ≥ 129 (125 px of margin); phone 365·0.4 = 146 ≥ 125 (21 px);
short-landscape 286·0.4 = 114 < 120 — it fails by 6 px, and the probe measures 16 device px of
violet under the tape at fill 3. The phone's 21 px of margin is also why WebKit's longer painted
front puts 131 px under the tape there. Cures for the critique, none taken here: a board-width
floor below which the tape does not lay down; `TAPE_FILLS` 2 on small boards; a shorter literal.

**3. Two r0 instrument rows are defective, both MOVED as diffs, neither re-worded to pass.**
`accent-kinship`'s inline-literal row tested the COMPUTED filter for a colour function — which
every computed `filter` carries, whatever the author wrote — so it was RED at HEAD and would
stay RED under any cure. Replaced with the claim it was written for: resolve the token the
sheet names and require the painted filter to CARRY it (a vacuity guard on the token first).
The anchor set gains the sixth (293°) and `solver-ink-2` leaves the exception list, kin by name
at 0.3°; `KIN_DEG` is unchanged at 5. The focus-ring row stays RED in both engines — it is
§10/§6's, untouched here.

## What is declared, and what the owner disposes

- **G9.** Three `@theme` tokens are now alias-only: the anchor's rungs, each read through
  `--color-progress-ink` / `--color-solver-ink-2` / `--sparkle-glow-*`. This is not pass 1's
  `--color-blue-ink` shape (one alias, one consumer, a third name): it is a named ramp whose
  rungs are addressed per theme. `check-theme-tokens` keeps them ("live through a live token")
  and exits 0. If the wave wants ALIAS-ONLY empty, the rungs must be inlined and the anchor
  stops being nameable — which is the family's whole sentence.
- **The ring ledger row was wrong in the spec and is corrected on painted bytes**: `#6AABEB`
  @.9 over the LIGHT card reads 2.17, not 3.89; the token `--color-crayon-blue` @.9 reads 2.88
  light / 6.42 dark, and `--color-focus-sketch` 3.63 / 3.69. The fallback trap is therefore
  sharper than stated: a bare deletion of the token lands on a light-mode ring UNDER 1.4.11.
- **The phone tape is 120.7 × 23.2 px, not ~105 × 20** — the tag voice does not shrink with the
  board, so the tape is 33 % of a 365-px board, not 28.7 %. It is the other half of finding 2.
- Owner (U-10): whether the hand may desaturate (C 0.215 → 0.131, 4.64 on card); whether the
  meter carries a tape at all, and for three fills; whether `on the board` reads better than
  `written` beside a `Fill` button (crop 1 shows the rail).

## Hand-offs

Six arcs to PAL-TIN (rose 14.2 · orange 68.7 · gold 83.7 · green 147.0 · blue 251.4 · the sixth
293.0; the pale rung is its contested berth). The mark's colour to PLR-SELF (`--color-user-ink`
at the ROOT, never inside a rebound cell). The seeded-geometry pin to CTRL-TAPE / PLR-COUNT /
MRK-LIVE — any tape whose text changes re-tore its paper until this diff. `DifficultyTally.vue:230-232`
to §10 (same `pathLength` + attribute-dash shape, and now the same unresolved WebKit paint).
Law 39 and the focus-ring token to §6. `FRAME_PAD` untouched, cited to chair §6.2.
