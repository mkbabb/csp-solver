# CTRL-TAPE · pass 10 · prototype (batch 3, §10 leader at 87)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-27` (HEAD `74a2b5d9`), lane port `:4230`, control `:4252`
(`w7-control`, `index-CubiZsMVSwTc.js`, CSS 93,634 B). Every reading below was re-measured this session; nothing
from the stopped continuation (`wf_111bb664-6da`) is cited.

## 0 · Gaps first (what is still open, with the number that holds it)

1. **`bounds()` as a PROPOSED library clause: NOT CUT.** It stays gate-local in `check-tape-foot.mjs`; no diff is
   filed under `instruments/`. Charter row 1's second half is open.
2. **The script-write arm is still a denylist.** Clause 12 admits DECLARATIONS (rules, `style=`, bound styles,
   utilities, template attributes); a script write has no declaration to admit, and the library reads script
   writes one property at a time (`scriptWrites(js, prop)`). `WATCHED[9]` grew by the critic's 16 properties
   (`min-block-size`, `row-gap`, `gap`, `writing-mode`, `flex-flow`, `border-bottom`, `margin-top`, `padding-top`,
   `font-size`, `order`, …) with two plants (S10a/S10b); a script write of a property outside the list is
   still GREEN. Needs a library reader of every style write (instruments lane).
3. **The roster is a union of three trees.** `scripts/tape-foot-admitted.json` holds 1,057 declarations: the lane
   tree's 611, the pass-9 WAVE's 994 and s10's 779, merged. A declaration admitted from the WAVE (443 are
   WAVE-only, 60 tree-only) is GREEN if a plant re-creates it on the lane tree. One roster serves all three
   trees, so the on-WAVE delta and the lane bank carry the same bytes.
4. **The match is content-keyed, not line-keyed.** The charter asks for "file+line"; the key is
   `role ⟂ file ⟂ at-rule context ⟂ selector ⟂ property ⟂ resolved value`, and the line is carried and printed.
   Reason, measured: the pass-10 berth edit (two comment lines and one value) moved the line of 250 of the 609
   unchanged entries, with no paint change (`readings/admitted-diff.txt`); a line key reds every entry below any
   sibling's edit in the same file at the s10 fold. Overrule this if the chair wants line keys; it's one join.
5. **The WAVE's `lint:tape-foot` reads 1, unchanged from pass 9, not this lane's.** Clause 4 ONE HAND reds on
   `index.css:981 @layer base @media (forced-colors: active) :focus-visible { outline: 2px solid Highlight }`
   reaching the bar, the verbs and the foot. The pass-9 gate reads the same three lines on the clean WAVE
   (`readings/gate.wave0.txt`), and pass-9 WAVE.md row 36 assigns it to MRK-LIVE as arm-born. The gate was not
   re-worded around it. On s10 and the lane tree the gate reads 0.
6. **`poseSettled` is not folded.** No PROPOSED `rest-probes` diff is cut. Per CHAIR pick 21 it's struck at the
   s10 integrator. `keys-crib.spec.ts` isn't on this lane's tree.
7. **Hint ink is not ink under `boardInk`.** A hint writes in the solver's tone, so a board whose only non-clue
   digits are hints reads pristine. Pass 9's walk counted them. The ruling's words ("a digit restored on reload
   is player ink") don't settle hints. Flagged for the chair.
8. **INTAKE-22 rows 19/21, check-doc-truth 6, real iOS:** not read this pass (charter row 9, carried).
9. **`ZONE-ARMED` was present the whole session** (armed 21:30:49, slope 40.7/s, then 203/s at 21:58; inuse
   30,389 → 295,144, under the 8M line). Owner guidance relayed by the chair: start no new long battery while
   the marker exists. This lane ran short guarded rows only (one spec file, `-g`-selected, `--workers=1`),
   with the zone and the marker printed on every row's first line.

## 1 · Numbers (gate, browserless)

| Reading | Tree | s10 + delta | WAVE + delta |
|---|---|---|---|
| `check-tape-foot` bare | **0** (12 clauses hold) | **0** | **1**: clause 4 ×3, LIVE's arm (gap 5) |
| critic's pass-9 63 (`breaks9`) | 0/61 GREEN, controls 0/2 GREEN | 0/61, 0/2 (new-fail reading) | 0/61, 0/2 (new-fail reading) |
| V8 / V9 / V10 | RED / RED / RED | RED ×3 | RED ×3 (new-fail reading) |
| pass-7 43 / pass-8 41 | 0/29 + 0/14 / 0/41 GREEN | — | — |
| `--self-test` | 157 plants red, 7 boundaries green, live green | — | — |
| `lint:sleep` | 0 | — | — |
| `check-copy-register` | 0 (no new product copy) | — | — |
| `vue-tsc -b` / e2e `tsc` | 0 / 0 | — | — |
| unit (ink + undo + fill) / `src/games/shared` + `src/pencil/sheet` chunk | 37/37 / 36 files, 446 tests, exit 0 | — | — |

"New-fail reading" (`instruments/breaks9-new.mjs`, `v8gate-new.mjs`): the critic's battery with the live fails
subtracted, so a sibling counts as RED only when it adds a fail the tree doesn't already carry. On the WAVE the
bare battery would read every sibling RED through gap 5's three live lines.

## 2 · What changed, row by row

**Row 1 + gap 2 · clause 12, THE ADMITTED LIST** (`scripts/check-tape-foot.mjs`, roster
`scripts/tape-foot-admitted.json`). The subjects are the chain's six boxes, the case's and the frame's outline
subtrees, every element under the bar (the verbs, their buttons, the words `span.icon-sublabel`, the glyphs),
and the case's ancestors in GameScene's template (`.scene-controls`, `.app-layout`). A component under the bar
is MOUNTED one level: its template root's tag and classes merge into the host and its subtree hangs under it,
so `.action-bar svg` reaches EraserIcon's `<svg>`. Every site `sitesOf` returns for a subject (rules with their
pseudo-elements, `style=`, bound styles keyed by expression, Tailwind candidates) must be on the roster, plus
the subject's template attributes (`class`, `:class`, `:style`, `v-show`, `v-if`, `hidden`, `:inert`, …), so an
unparsed utility (T16 `mt-[100vh]`) reds as a changed `class`. Root-published tokens (`--*` on `:root`/`html`)
are skipped as sites; what they feed is read through `val()` on the declaration that spends them, and the
resolved value is part of the key. Two arms with their own sabotage ids: `12a` attributes, `12d` declarations.

**4a re-keyed.** The voice is read on `.icon-sublabel`'s own `font-size`/`font` (the element that sets the
painted 14.384 px), lower bound 10 px at desk-1280×800. Plants: V8 (`font-size: 0`) and the ±ε pair 9.99 px
(RED) / 10.01 px (GREEN boundary).

**Row 3 · 11b evaluates, 11c reads the ancestors.** `constantOf(expr)` compiles the Teleport's `:disabled`
and evaluates it under every assignment of its free names (true, false, 0, 1, "", "x", null, undefined, {},
NaN, and deep objects whose every member is true or false; JS globals keep their values). Anything but
"varies" reds. `!footBerth` varies; `Boolean(1)`, `!footBerth || true`, `!undefined`, `footBerth ? false : false`
are constant. 11c: `v-show`/`v-if`/`v-else*`/`hidden` on any ancestor of the case in GameScene's template.

**Row 5 / CHAIR pick 7 · board ink is the truth.** `useGameState.boardInk`: a value that is neither a clue nor
in the solver's tone, or any player note. `GameShell` hands it to the panel as `isDirty`. The pass-9 session
walk (`useUndoHistory.inkSinceDeal`) and its six unit rows are deleted, and the dormant `resize` arm (gap 5,
D6) goes with them. Unit: `useGameState.ink.test.ts`, 6 rows. Born-RED: with `boardInk := undoDepth > 0`
planted, R and C RED (2 failed / 4 passed, exit 1). Restored: 6/6, exit 0.

**Row 6 / CHAIR pick 8 · the seed's inputs as tokens.** `index.css` publishes `--washi-wide-cap: 15rem` and
`--washi-tilt-band: 1.5deg` once. `.washi-wide` spends the cap. The berth is
`calc(var(--washi-wide-cap) / 2 * sin(var(--washi-tilt-band)) + 0.5px)`, the same value as pass 9's
`calc(7.5rem * sin(1.5deg) + 0.5px)`, and clause 12 holds the resolved value, so any change to either token reds
the roster. Clause 12s pins SheetWashiLabel's JS tilt literal (`(rng() - 0.5) * 3`) to twice the band's
degrees and requires both tokens published. Plants: the literal re-rolled to `* 4`, and the band unpublished.

**Row 8 · `__asked`.** The new reload row proves its recorder in-run: it must read TRUE across the press that
mounts the question (R), then FALSE across the press that must not (C).

## 5 · Incidents (the lane's own)

1. **The tree carried one stray file at open**: `web/frontend/dist.cls` (0 B, Oct 8 16:43), outside the pass-9
   bank. Excluding it, the tree's temp-index diff equals `pass9.diff` byte for byte (843,606 B). Moved to the
   lane's trash. Homes v3 was NOT on the tree; the stopped continuation left no product edit and no evidence.
2. **Homes v3 applied without `--3way`**: `git apply` of `homes.on-WAVE.diff` (sha1 0723d508) checked 0 and
   applied clean (10 paths). The 13 home paths then match `homes.diff` (07257854) blob for blob (all 13 ids).
   Plain apply was chosen so the worktree's own index stays untouched.
3. **Four killed runs, my own, never cited**: three sabotage batteries stopped because the gate changed under
   them (4a re-key, 12s, the 12a/12d split), and one vitest run withdrawn from the heavy queue (20 waiting) and
   re-run `--light` as one unit file set. Killed by PID after a cwd check on this tree.
4. **The first lane server died with its shell**: `guarded … vite preview … &` in a foreground call; guarded
   logged `KILLED: caller died`, and the first chromium attempt read `ERR_CONNECTION_REFUSED` (exit 1, moved to
   trash). Servers since run as background tasks.
5. **The scratch tree builder mislabelled its log lines** (`mk-trees.log` prints the diff path where the tree
   name belongs, a `shift` bug). The applies are right: `wave/` = 74a2b5d9 + WAVE.diff (187 paths, exit 0) +
   homes.on-WAVE (10 paths, exit 0); `s10/` = + s10.diff (64, exit 0) + homes.on-WAVE (10, exit 0). Each has its
   own `.git` (`git init`, no commit), printed beside the apply.
6. **The increment did not apply on the WAVE or s10 by patch** (`zone-grammar.spec.ts`: the WAVE appends rows
   after the M12 block; `GameControlPanel.vue`: a hunk context miss at the berth). It was ported by
   `instruments/port.py`: apply the other ten paths, append the reload block, and three asserted one-to-one
   string replacements in the panel. The on-WAVE delta is cut from that ported tree, never hand-edited.

## 6 · Replay route

- **Lane tree.** `74a2b5d9` + `pass10/instruments/homes.diff` (sha1 07257854, 13 home paths) + `pass10.diff`
  (38 product paths, disjoint from the homes). Equivalently: the pass-9 bank `pass9.diff` + `homes.on-WAVE.diff`
  (0723d508) + the 12-path increment.
- **The WAVE.** `74a2b5d9` + `pass9/integrate/WAVE.diff` + `homes.on-WAVE.diff` + `pass10.delta.on-WAVE.diff`
  (declared base: that WAVE+homes tree, temp-index tree `9528a8ec` in the scratch repo). The same delta applies
  on s10 (`74a2b5d9` + `pass9/integrate/s10.diff` + `homes.on-WAVE.diff`).
- **Gate.** From `web/frontend`: `node scripts/check-tape-foot.mjs [--self-test] [--sabotage-battery]`;
  `--admitted-dump` prints the live roster. The critic's sets: `FE=$PWD node <pass9 critique>/instruments/breaks9.mjs`
  (and `breaks7`, `breaks8`); on a tree whose gate is already red, `instruments/breaks9-new.mjs` and
  `instruments/v8gate-new.mjs` (live fails subtracted).
- **Units.** `npx vitest run src/games/shared/useGameState.ink.test.ts`; born-RED `instruments/bornred-ink.sh`
  (plants `boardInk := undoDepth > 0`, runs, restores, re-runs).
- **Rows on paint.** `vite build` in the tree (its worktree `.git` bounds Tailwind), `vite preview --strictPort` on
  `:4230`, then through a config with `webServer` removed:
  `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4230 npx playwright test e2e/zone-grammar.spec.ts --project <engine>
  --workers=1 -g "T9-M12|row 7|painted bottom"`, WebKit under `guarded --exclusive webkit`. The control is the
  same command against `:4252`.
- **π.** `A=<control> B=<lane> node instruments/pi10.mjs <engine>`: every element outside `.drawer-case`, keyed by
  tag path and occurrence, rect ±0.5 px and nine computed paint properties, three cells × light/dark, pinned
  board, reduced motion, DPR 2. `A=B` is the control-vs-control floor.

## 3 · Rows on paint (lane tree, served dist `index-8d15OH18y0jq.js`, CSS 98,331 B; control `index-CubiZsMVSwTc.js`, CSS 93,634 B)

`e2e/zone-grammar.spec.ts -g "T9-M12|row 7|painted bottom"`, 9 rows: the foot's painted bottom at four cells,
row 7 (the berth at ±1.5° with the pass-8 0.1rem negative in-run), the three M12 rows, and the two new
reload cells (fine, coarse with the `(pointer: coarse)` witness).

| Run | Exit | Rows | Load (1-min) at start / end | Zone inuse | `ZONE-ARMED` |
|---|---|---|---|---|---|
| tree, chromium | **0** | 9 passed (26.5 s) | 26.96 / 30.04 | 349,531 | present |
| tree, WebKit (`--exclusive webkit`) | **0** | 9 passed (41.6 s) | 21.98 / 20.78 | 379,326 → 404,143 | present |
| control, chromium | **1** | 9 failed: the control has no `#card-foot` (null rect on the four foot cells, locator time-outs on the rest) | 30.04 / 22.65 | 349,531 → 379,326 | present |

Row 7, the berth on the token-tied rule, overlap px² into the verbs at the band's two edges and the in-run
negative: chromium 0 / 0 / 0 at +1.5° and −1.5° (spill −22.80, −0.96, −23.18 px), NEG 47.18 / 71.22 / 29.80;
WebKit 0 / 0 / 0 (spill −22.65, −1.02, −23.06), NEG 55.91 / 71.22 / 36.64. The thin edge holds: Fill's note
clears the verbs by 0.96 px (chromium) and 1.02 px (WebKit), the same as pass 9's 0.96 / 1.02. The literal → token
edit moved nothing on paint.

M12 on the tree, both engines: a pristine Clear never asks; a dirty Clear paints `clear the board?` in the bar
(chromium askW 83.42 px, verbs 0, notes 0); a fresh deal solves unasked (20 → 0 empties); one player digit asks;
**R** a restored digit asks before Clear and the answer clears it; **C** after that answered Clear, Solve acts on
one press and the recorder reads `__asked` false. Both cells (fine and coarse), both engines.

**π vs `74a2b5d9`, outside the case** (`instruments/pi10.mjs`, chromium, pinned board, reduce, DPR 2; load at
open 19.87, zone 404,143): rect **0**, paint **0** at rail1440 and coarse1280, light and dark; **rect 1** at
dock390shut light and dark (the element is not named: the probe prints four examples and the tag rows fill
them, a probe defect of this lane); **tag 29** at every cell (855/877 elements on the control, 858/880 on the
lane), every listed example a `button` subtree at `#board-edge` and under the scene, the drawer tab the pass-9
bank re-mounted, not a pass-10 edit. Control vs control: 0 / 0 / 0 at all six. WebKit (`--exclusive webkit`, load 17.71 → 14.47, zone 503,264 → 523,462): the same figures cell for cell (rect 0/0/1/1/0/0,
paint 0 everywhere, tag 29). WebKit control-vs-control floor not run. This lane's π keys by tag path, pass 9's by its own wrapper key,
so the tag count is not comparable to pass 9's "1 tag".

## 7 · The charter's rows, judged by the lane (the number is the critic's)

| Charter row | State | Holds it |
|---|---|---|
| 1 the admitted list | **closed at its class for declarations**: 61/61 + V8/V9/V10 RED on tree, s10 and WAVE; open for script writes (gap 2) and `bounds()` (gap 1) | §1 |
| 2 11b evaluates | **closed**: `constantOf`, five constant spellings RED, `!footBerth` GREEN; 11c reads the ancestors (T7 and `hidden` RED) | self-test |
| 3 M12 across a reload | **closed on the tree and the WAVE, both engines, both pointers**; unit born-RED R and C; dormant `resize` arm deleted with the walk | §3, §4 |
| 4 the berth's inputs | **closed**: tokens + clause 12s; row 7 re-read on tree and WAVE both engines, 0 px² at ±1.5°, Fill's 0.96/1.02 px unchanged. FACE row 7 is FACE's to re-read on the union in its return (CHAIR pick 8): this lane's edit is value-neutral | §3 |
| 5 `poseSettled` / `__asked` | `__asked` proven in-run; `poseSettled` **not folded**, struck at s10 per pick 21 | gap 6 |
| 6 the WAVE's WebKit column | zone-grammar's M12, row 7 and the four painted-bottom cells read on the WAVE + delta, both engines (§4); π on the WAVE not read | §4 |
| 7 the bank | home-free, `dist.cls` trashed, every apply line prints its git dir and `GIT_CEILING_DIRECTORIES` | BANKED.txt |
| charter gap 4 (station 1) | **not touched**: FACE's frame and FACE's ring (CHAIR pick 14) | — |
| charter gap 9 (INTAKE-22, doc-truth, iOS) | not read | gap 8 |

## 4 · The WAVE + delta (`74a2b5d9` + WAVE.diff + homes.on-WAVE + `pass10.delta.on-WAVE.diff`, scratch with its own `.git`; served `index-C4XhP1GGwTpm.js`, CSS 112,571 B)

The WAVE's own `zone-grammar.spec.ts` (its rows plus the delta's appended reload block), same `-g`:

| Run | Exit | Rows | Load start / end | Zone inuse | `ZONE-ARMED` |
|---|---|---|---|---|---|
| WAVE, chromium | **0** | 9 passed (25.6 s) | 14.96 / 14.34 | 465,166 → 484,124 | present |
| WAVE, WebKit (`--exclusive webkit`) | **0** | 9 passed (38.5 s) | 14.34 / 17.85 | 484,124 → 503,264 | present |

Row 7 on the WAVE: chromium 0 px² at ±1.5° (Fill's spill −0.96), NEG 47.47 / 71.22 / 29.98; WebKit 0 px²
(Fill −1.02), NEG 56.25 / 71.22 / 36.86. M12 on the WAVE: the five M12 rows green in both engines, the reload
cell R asked and C unasked at both pointers. This is the pass-9 WAVE's WebKit column for these rows (charter
gap 10, `zone-grammar:1667` and M12 and row 7), read by the lane on the union + its delta. The pass-9 WAVE
without the delta was not re-read here; WAVE9-read.md is that tree's number.

`lint:tape-foot` on the WAVE + delta exits 1 on LIVE's three clause-4 lines alone (gap 5); clause 12 and the
rest of the twelve hold on 994 WAVE declarations.

## 8 · The bank line

`pass10.diff` 593,538 B, sha1 `8f01aaaf`, 38 files +7,420/−743, base `74a2b5d9` (+ homes v3 by sha, disjoint),
apply --check exit **0** on a fresh `74a2b5d9` archive. `pass10.delta.on-WAVE.diff` 207,814 B, sha1 `d1b8dc0e`,
12 files +1,652/−98, declared base the WAVE `954bbbab` + `homes.on-WAVE.diff` `0723d508`, apply --check exit
**0** there and **0** on s10 + `homes.on-WAVE.diff`. The batch gate (the trio's deltas apply 0 on `74a2b5d9`,
s10 and the WAVE) is met for this lane. The cumulative `pass10.diff` exits 1 on the WAVE and on s10, as it
must (they already carry pass 9). Leak grep 0/0; one dot path (`.github/workflows/ci.yml`, carried since
pass 8). Full lines in `BANKED.txt` and `readings/applychecks.txt`. Never committed; the work tree's diff at
return is product files only (the scratch Playwright config and the build outputs are ignored or outside it).

## 9 · Sabotage and threshold batteries (final gate, bytes as banked)

`node scripts/check-tape-foot.mjs --self-test --sabotage-battery`, exit **0**: self-test 157 plants red,
7 boundaries green, live green; **26/26** clause ids red the self-test when deleted, the five new ones by
these counts of plants that go green: `11c` 2, `12` 21, `12a` (the attribute arm) 2, `12d` (the declaration arm)
17, `12s` 1. Threshold: the one new numeric bound (4a's 10 px on the words) is pinned by the literal pair
9.99 px RED / 10.01 px GREEN. Not planted: 12s's third condition (`--washi-wide-cap` unpublished), and the
`constantOf` probe set itself (no plant removes a probe value). Both are open rows of this gate.
