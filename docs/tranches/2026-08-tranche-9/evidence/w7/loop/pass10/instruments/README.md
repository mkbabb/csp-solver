# Homes v3 · the instruments' product homes (T9-W7 pass 10, batch 0)

> **The chair's fold supersedes this file's §1 bank (see `CHAIR-FOLD.md`).** Picks 10 and 18 reproduced in both engines on the non-author check and are FOLDED. Apply homes v3 by these shas: `homes.diff` `07257854047e9345962d11473df3fab75a42a9c2` (531,611 B, on `74a2b5d9` or `1d0dc4fd`) and `homes.on-WAVE.diff` `0723d5085bb55d245158723f8d6a854a2526044f` (139,131 B, on the WAVE, s10 or s13-s7-s3). The shas below are the lane's pre-fold bank, kept as `homes.pre-fold.diff` and `homes.on-WAVE.pre-fold.diff`; where this file says picks 10 and 18 are STRUCK, read FOLDED.

| File | sha1 | Bytes | `--shortstat` | Base |
|---|---|---|---|---|
| `homes.diff` | `be9a5af6ffa383f67c2bb5f2b9005cd20f17c8f0` | 513,021 | 13 files changed, 11,425 insertions(+), 1 deletion(-) | `74a2b5d9` → tree `cd5914b1` |
| `homes.on-WAVE.diff` | `88b48d946e4975131b5d01684e8c473addaa8840` | 110,429 | 8 files changed, 1,686 insertions(+), 69 deletions(-) | homes v2 tree `d17813ba` → `cd5914b1`, on the 13 home paths |
| `struck-10.diff` (pick 10, B-ROSTER) | `4f5effd2596e609c7f9d012a42a53e266ad213d5` | 18,723 | 2 files changed, 167 insertions(+), 4 deletions(-) | banked v3 `cd5914b1` → `6ca82905` |
| `struck-18.diff` (pick 18, stale-rebase + seek) | `184553a1045afddc5df6ea1bdf9319d77346f322` | 13,763 | 2 files changed, 117 insertions(+), 12 deletions(-) | banked v3 `cd5914b1` → `6741df38` |

Cut through temporary indexes, `--binary`, product paths only, no commit. Equalities read through a temporary
index: `74a2b5d9` + `homes.diff` = `cd5914b1`; + `struck-10` + `struck-18` = `ac862f1e` (the full author tree);
`954bbbab` + `homes.on-WAVE.diff` reads `cd5914b1`'s 13 home paths byte for byte.

`git apply --check`, each on a fresh `git archive` scratch with its own `.git` (exit read bare):

| Diff | Tree | Exit | Paths |
|---|---|---|---|
| `homes.diff` | `74a2b5d9` | 0 | 13 |
| `homes.diff` | `1d0dc4fd` | 0 | 13 |
| `homes.on-WAVE.diff` | the WAVE union `954bbbab` (74a2b5d9 + `pass9/integrate/WAVE.diff`) | 0 | 8 |
| `homes.on-WAVE.diff` | s10 (74a2b5d9 + `pass9/integrate/s10.diff`) | 0 | 8 |
| `homes.on-WAVE.diff` | s13-s7-s3 (74a2b5d9 + `pass9/integrate/s13-s7-s3.diff`) | 0 | 8 |
| `struck-10.diff`, `struck-18.diff` | `74a2b5d9` + `homes.diff`; and `954bbbab` + `homes.on-WAVE.diff` (temporary indexes) | 0, 0 | 2, 2 |

Tree ids, declared: the WAVE union reads `954bbbab` and s13-s7-s3 `2f11714f` through a temporary index. `s10.diff`
on `74a2b5d9` reads `2ba283b4`, not `1be6fe37` (that's s10's layer tree on the pass-8 base). The archive trees
read differently (`base74` 243fbf57, `wave` 044284b5), since `git add -A` drops gitignored tracked files; every
apply-check above ran on the archives. The WAVE, s10 and s13 each carry homes v2 byte-identical on all 13 paths,
so `git diff d17813ba` against each is empty and one on-WAVE step serves all three and every lane tree.

The bank greps clean in all four diffs and this README: 0 hits for LAWS P8 §K's four scratch-path patterns, and
0 dot-dir paths.

**Open-state check.** The work tree cut through a temporary index at open read `d17813ba`, diff sha1
`1f70cfda`, 437,922 B, the v2 bank byte for byte. There was no difference.

**The two conditional folds were STRUCK** (CHAIR-RULINGS 10 and 18). Each folded and self-tested on the author's
tree in chromium (§9 below), but no non-author run reproduced either in both engines by batch 0's close. The
non-author check lane's scratch stops mid-cut, with no reproduction filed, so `homes.diff` carries
`edge-bands` at its pre-roster bytes and `postpaint` at homes v2's. Each struck fold is its own separable hunk set
beside the bank, applying 0 on the banked library; a non-author reproduction later folds it by sha.

## 1 · `web/frontend/scripts/shape-census.mjs` (+ `shape-census.d.mts`)

- **Source families.** FACE, TAPE, RULE, TIN, WALK, LADDER, ERASE, LEDGER, GRAPHITE (registry-v9 §8.1 batch 0), and the chair.
- **Clauses: 100**, up from v2's 83; **156** self-test rows. Every clause has a plant in the ONE self-test and a row under `SHAPE_SABOTAGE=<id>`.
- **Folded as filed (4 PROPOSED diffs, applied by sha, each 0 on homes v2):**
  - RULE `logical-sides` (`LOGICAL_SIDES`: `padding-block(-end)`, `margin-block(-end)`, `inset-block(-end)` are sites of the physical side).
  - TIN `strip-paren-kw` (a `/` after an `if`/`while`/`for`/`with` head's `)` opens a regex).
  - LADDER `clock-context` (`clockReads(…).ctx`: logical, ternary, comma, indexed-literal, call-apply) and `obj-bracket` (a literal-keyed bracket write on a script style object is a write).
  - LEDGER `r4-unresolved` (no font or line site is UNRESOLVED, never a typed 16 / 1.2×) and `reserveReading` EXPORTED (the ONE reader).
- **Cut by the chair from the critics' specs (no diff was filed):**
  - FACE CHECK 7, the string-RULE arm: `str-unescape` (a script string's JS escapes are decoded before its CSS is parsed: S2's `\"Comic Sans MS\"` read as nothing) and `string-rule` (rule text a script writes is FOLDED through `foldText` and read as rules; `via` names the sink: insertRule, replaceSync, replace, appendRule, textContent, innerHTML, innerText, outerHTML; a rule the raw scan read is not doubled).
  - FACE CHECK 7, the CSS-wide-keyword arm: `css-wide-kw`, `cssWide(value, map)` → `{keyword, via, resets, invalid?}` (S8 `revert-layer`, S9 `initial`, S10 `font: initial`, S11 `--k: revert; var(--k)` = `invalid`, `var-fallback`). `resets` is what a face law reads before it admits a keyword as lawful; FACE's `KEYWORD.test(first) → lawful` is the consumer line that owes it.
  - WALK X8/X9: `tok-string-fold` (tokenSites' string arm reads the FOLDED text too; X8's concatenated rule publishes `0.5`, X9's template with an interpolated VALUE is an UNRESOLVED site).
  - TIN gate 4: `callee-norm` (`calleeNormal(js, m)`: `.call`, `.apply`, `Reflect.apply`, `?.()`, `(0, f)()`, a literal- or const-keyed bracket, an assigned alias, rewritten to the direct call; wired into `scriptWrites`, `tokenSites` and `propertyRegistrations`), N6 and N2 planted; `pct-decode` (`pctDecode`: a non-base64 `data:` URI's `%23` decoded before colour literals; N21/N22 planted). N1 (Typed OM) and N34 (`@property` on an arm) already read on v2's library: each gains a regression row under its own clause (`typed-om`, `at-property-site`). TIN's gate reading them is TIN's consumer line.
  - ERASE row 2: the six spellings resolve by name through `callee-norm`; `register-callee` reads what is left (`queue(CSS.registerProperty)`, an opaque `CSS[f](…)`) as an UNRESOLVED registration, never dropped; a `typeof` probe is not.
  - LADDER C1y/C17y: `component-tree`, `componentReach(fe)` → `{roots, reaches, deepReaches, fallThrough}` (a scoped rule reaches its own elements and each child component's root; a dynamic `<component>`/`<RouterView>` may render any; a class on a component tag falls through to its root). `elementSites` takes the fall-through classes on the target's roots. The Other.vue NEG-NEG renders no child and reaches nothing.
  - GRAPHITE → LADDER: `selector-key`, `selectorKey(sel)`: the whole list, whitespace collapsed; `check-motion-bands`' `selectorOf` (80-char cut) is LADDER's consumer line.
  - TAPE: `admitted`, `admittedSites(sites, list, {key})` → `{unadmitted, stale, ok}` (the admitted-list inversion, file:line:prop keyed; a stale entry reds); `bounds`, `bounds(value, regime)` lifted verbatim from `check-tape-foot.mjs` (C6 `999rem` → 15,984 px; `calc(100dvh + 1px)` → 801 at 1280×800).
  - LEDGER C1–C6: `r4-descend`. R4 reads the voice's LINE BOX: each descendant's font, line, height, vertical-align and block-axis padding/margin/border, and the voice's own (a `:has()` rule included), bounded by the component tree (another file's scoped rule never reaches the star; a `:deep()` of a component that renders the note does). The shipped ink + star reads GREEN.
  - LEDGER row 3, the per-file cache: `rulesOf` is cached per file keyed on its TEXT (a plant that rewrites a file re-parses it), `componentReach` per tree signature; `cacheStats` printed; `SHAPE_NOCACHE=1` disables both.

## 2 · `web/frontend/e2e/lib/glyph-pop.mjs` (+ `glyph-pop.d.mts`)

- **Source families.** PLR-COUNT (`g5tol`, the G3 re-key), the chair.
- **Clauses.** `GLYPH_CLAUSES` = `G5core`, `G3clamp`, `anchor`, `g4tol`, **`g5tol`**.
  - `g5tol` (COUNT's `glyph-pop.g5tol.diff`, applied by sha, CHAIR §9's condition met): `glyphPopulation(…, {g5tolerate})` takes the CONTROL's `glyphCores`; glyph k under the floor is tolerated only where the control's glyph k is too AND this read is no worse by more than `G5_EPS` (0.05). Plant HEAD12 on `#g-long`: tolerated GREEN (5 glyphs), against the unplanted control RED, a deeper 8 % fade RED.
  - `G3clamp` RE-KEYED on the BOUND (COUNT's critic, gap 7): any bound ≥ 0.95 is held half-way from its reference to 1. Plant SLK20: reference 0.817 at slack 0.20 bounds **0.9085** (the reference-keyed v2 clamp: **1.0170**, G3 unable to fire). Declared moves: 0.93 at slack 0.05 bounds 0.965 (v2 0.980); 0.90 → 0.95 and 0.5 → 0.55 unchanged.

## 3 · `web/frontend/e2e/lib/edge-bands.mjs` (+ `edge-bands.d.mts`)

- **Source families.** ACC-GRAPHITE (the band statistic), MRK-LIVE (`inkkey`, the absent edge), the chair. PLR-SELF's drawn roster (B-ROSTER) is STRUCK into `struck-10.diff`.
- **Clauses (banked).** `EDGE_CLAUSES` += **`B7`**, **`inkkey`** (10). With `struck-10.diff`: + **`drawn`** (11).
  - `B7`, the band statistic (GRAPHITE's G2 at its class, through the four-band read): each band's α50 SUB-PIXEL width (`alphaWidth`: the run of a station's |ON−OFF| coverage at ≥ half the strip's own p99 move, both crossings interpolated, band-stat.mjs `d2e2d620`'s `runWidth` on the coverage), median over the band; with `widthRef` and `widthWindow` every band's ratio must lie inside. Plants: HALFCLIP (`clip-path: inset(-1px)` on a 2 px outline; `thick: 1` so B7 alone may red) reds B7 alone on all four bands (1 / 2 = 0.500); X6 (`inset(0 22% 0 22%)`, no left, no right) reds B7 left and right.
  - `inkkey` (LIVE's CRIT-FCMOVE): with `ink` (`[r,g,b]`, `#hex`, `rgb()`, or a system colour like `Highlight` resolved by the page) only pixels painting within `inkTol` (48) of the ink count. Plant CRIT-FCMOVE (`#f-fc`: outline clipped to nothing, card moved 4 px): keyed RED; unkeyed GREEN 14.0 / depth 4 (the hole, printed).
  - The absent edge (LIVE §9.12): a `{fade}` (or empty) plant that computes no CSS returns a no-op undo; B0 carries the red. Row: `.f-none-edge` → no-op undo, B0 RED, no throw.
  - STRUCK, in `struck-10.diff` only: `drawn`, B-ROSTER (pick 10; §9 below): SELF's `DRAWN_FRAMES` (`head-sheet` 1.5 × 1, `tray-well` 1.5 × 4) and `authoredStroke` verbatim; **thickTol REFUSED** (a typed `thick` or `thickTol` beside `drawn` throws; `DRAWN_TOL` = 0.9 is a literal); an unreadable roster file is a `why`, never a throw; `DRAWN_PLANTS(edge, width)` = THIN_1PX + the 0.55× plant; the **tray-well consumer** is `--roster tray-well [--fe <served tree>]`: every painted site read under `drawn` on the served page, the source pin, the site count, both plants.

## 4 · `web/frontend/e2e/lib/rest-probes.mjs` (+ `rest-probes.d.mts`)

- **Source family.** MRK-LIVE (the hold-refusal class, CRIT-ANC55), the chair.
- **Clauses.** `REST_CLAUSES` += **`HR1`**, **`HR2`**. `holdPoses(page, {edge, ring, exempt})` holds each binary `will-change: opacity` pose layer outside the edge and the ring, and REFUSES (pins nothing, `ok: false`) when a layer holds a ring or a focus stop (HR1) or sits at an opacity other than 0 or 1 (HR2). Rows (f): CLEAN holds 2; ANC55 (the ring's parent at 0.55) refused; HR1ONLY (a layer at 1 holding a button) refused by HR1 alone; HR2ONLY (a layer at 0.55 holding nothing) refused by HR2 alone. LIVE's spec-local `holdPoses` is the consumer line that owes the import.

## 5 · `web/frontend/e2e/lib/postpaint.mjs` (+ `postpaint.d.mts`)

- **Banked: unchanged from homes v2** (5 clauses). Pick 18 is STRUCK, so GA1 stays open on VERB's banked record.
- **In `struck-18.diff` only.** MOT-VERB (`stale-rebase`, `37adb2cb`), its critic (the seek), the chair. `PP_CLAUSES` += **`stale-rebase`**, **`seek-guard`** (7).
  - `stale-rebase` (VERB's diff, applied by sha): a stale RUNNING post read carries its frame's clock back, `ct − (tlNow − tl) × rate`; reads carry `pr`. Unit U5: clean rebased 0 GREEN; startTime 150 early rebased 150, F1ct RED.
  - `seek-guard` (the critic's missing disjunct, pick 18's condition): the sampler logs every write of the SUBJECT's clock (`currentTime`/`startTime` setters, `play`/`pause`/`finish`/`reverse`/`updatePlaybackRate`) with its sampler frame and whether it ran inside a rAF; a write between frame k's in-rAF read and its post read, other than the frame's own in-rAF start, is a SEEK and the read is UNREAD, never rebased. Unit U6: a task seek winding a 150 ms skip back to ct 17 → frame 1 UNREAD, F1ct RED on frame 2 (seeks 1); the frame's own start alone GREEN; a later frame's write RED.

## 6 · `web/frontend/e2e/lib/paint-lib.mjs` (+ `.d.mts`) and `web/frontend/knip.json`

- Unchanged from homes v2.

## 7 · Folded (v9 §8.1 batch 0, in the row's order)

Twenty of the row's twenty-two items are folded into `homes.diff`. Items 6 and 21 folded on the author's tree and are STRUCK from the bank (§9).

| # | Item | Family | Home · clause | Plant (born-RED on v2) |
|---|---|---|---|---|
| 1 | CHECK 7, string-RULE arm | CTRL-FACE | shape-census `str-unescape`, `string-rule` | S2 escaped face; S2–S4 insertRule / replaceSync / textContent rules |
| 2 | CHECK 7, CSS-wide keyword arm | CTRL-FACE | shape-census `css-wide-kw` (`cssWide`) | S8 `revert-layer`, S9 `initial`, S10 `font: initial`, S11 `var(--k)` = invalid |
| 3 | The admitted-list inversion, file:line keyed | CTRL-TAPE | shape-census `admitted` (`admittedSites`) | an unadmitted site RED; a stale entry RED |
| 4 | `bounds()` | CTRL-TAPE | shape-census `bounds` | C6 `999rem` → 15,984; `calc(100dvh + 1px)` → 801 |
| 5 | Logical sides | CTRL-RULE | shape-census `logical-sides` (diff `82de9e70`) | RULE's own rows |
| 6 · **STRUCK** (`struck-10.diff`) | `authoredStroke`, SELF's drawn roster, the tray-well consumer, the 0.55× plant; thickTol REFUSED | PLR-SELF | edge-bands `drawn`, `--roster` (diff `462dd40a`, hand-merged) | THIN_1PX, P055; typed thick/thickTol beside `drawn` throws |
| 7 | The four-band read and the band statistic | ACC-GRAPHITE | edge-bands `B7` (`alphaWidth`) | HALFCLIP (B7 alone, four bands); X6 (left + right) |
| 8 | The ink-keyed FC strip read | MRK-LIVE | edge-bands `inkkey` (`inkOf`) | CRIT-FCMOVE keyed RED, unkeyed GREEN (printed) |
| 9 | The absent-edge no-op undo | MRK-LIVE | edge-bands `applyEdgePlant` | `.f-none-edge`: no-op undo, B0 RED, no throw |
| 10 | The hold-refusal class | MRK-LIVE | rest-probes `HR1`, `HR2` (`holdPoses`) | ANC55; HR1ONLY; HR2ONLY |
| 11 | `glyph-pop.g5tol` | PLR-COUNT | glyph-pop `g5tol` (diff `09b51332`) | HEAD12 tolerated vs control; 8 % fade RED |
| 12 | The G3 clamp re-key | PLR-COUNT | glyph-pop `G3clamp` | SLK20 → 0.9085 (v2 1.0170) |
| 13 | Gate 4 N1/N6/N21/N22/N34 | PAL-TIN | shape-census `callee-norm`, `pct-decode`, `typed-om`, `at-property-site` | N6 `.call`/`.apply`/`(0,f)`/`?.()`; N2 bracket; N21/N22 `%23` |
| 14 | `tin9-strip-paren-kw` | PAL-TIN | shape-census (diff `c283417b`) | TIN's own row |
| 15 | X8/X9 tok-string-rule | PAL-WALK | shape-census `tok-string-fold` | X8 concatenated `0.5`; X9 interpolated value UNRESOLVED |
| 16 | The component-tree universe (C1y/C17y) | MOT-LADDER | shape-census `component-tree` (`componentReach`) | Child / Parent / Other / Host fixture |
| 17 | clock-context, obj-bracket | MOT-LADDER | shape-census (diff `dc9ad416`) | LADDER's own rows |
| 18 | `propertyRegistrations` callee resolution, ERASE's six spellings | NOTE-ERASE | shape-census `callee-norm`, `register-callee` | the six spellings; `queue(CSS.registerProperty)`, `CSS[f](…)` UNRESOLVED |
| 19 | `reserveReading` with a per-file cache | NOTE-LEDGER | shape-census `r4-unresolved` (diff `ac82c1c1`), `cacheStats`, `SHAPE_NOCACHE` | LEDGER's own rows |
| 20 | r4-element descendants | NOTE-LEDGER | shape-census `r4-descend` | C1–C6; OTHER scoped svg GREEN; HOST `:deep(svg)` RED |
| 21 · **STRUCK** (`struck-18.diff`) | The stale-rebase, plus the critic's seek plant | MOT-VERB | postpaint `stale-rebase` (diff `37adb2cb`), `seek-guard` | U5; U6 seek between frame 1's read and its post read |
| 22 | `selectorOf`'s 80-char cut | ACC-GRAPHITE → MOT-LADDER | shape-census `selector-key` (`selectorKey`) | a third selector added past char 80 changes the key; whitespace never does |

## 8 · Refused

- **Pick 10 (B-ROSTER) and pick 18 (the stale-rebase), STRUCK by the chair's rulings 10 and 18.** No non-author run reproduced either in both engines by batch 0's close (§9).

- **NOTE-ERASE `PROPOSED-fence-running.on-WAVE.diff`** (`cbe5c15d`, 654 B): it edits `src/components/MarginNote.vue`, which is product, not an instrument. It's ERASE's own fence at batch 1.
- **NOTE-LEDGER `PROPOSED-lint-ink-collapse.diff`** (`e9d06197`, 10,086 B): it edits `scripts/check-ink-pressure.mjs`, a consumer gate rather than a home, and it isn't on the batch-0 row. It stays LEDGER's.
- **PAL-TIN `G5-rung.PROPOSED.md`**: a ruling ask, not a diff. COUNT's `g5tol` (item 11) is the control-anchored G5 it asks for, so the rung itself is left to the chair.
- **SELF's `thickTol`**: refused by pick 10. `DRAWN_TOL` is a literal (0.9), and a typed `thick` or `thickTol` beside `drawn` throws.
- **The consumer lines.** No home edits a consumer. Each one owes an import, named per instrument above: FACE's `KEYWORD.test`, LIVE's spec-local `holdPoses`, TIN's gate, `check-motion-bands`' `selectorOf`, and TAPE's `check-tape-foot` `bounds`.

## 9 · The two conditional folds, STRUCK, each a separable hunk set

Each one folded LAST on the author's tree, each from a snapshot taken just before it (`edge-bands` pre-roster,
`postpaint` = homes v2), so each hunk set is exactly that fold. Neither has a non-author reproduction in both
engines, so both are struck per CHAIR-RULINGS 10 and 18. They're banked beside `homes.diff`, not in it.

**`struck-10.diff`, pick 10, B-ROSTER** (`e2e/lib/edge-bands.mjs` + `.d.mts`, 167+/4−). PLR-SELF's
`proposed/edge-bands.drawn.diff` (`462dd40a`), hand-merged onto v3's edge-bands:

- `DRAWN_FRAMES` (`head-sheet` 1.5 × 1, `tray-well` 1.5 × 4) and `authoredStroke`, verbatim.
- `thickTol` REFUSED. A typed `thick` or `thickTol` beside `drawn` throws, and `DRAWN_TOL` = 0.9 is a literal.
- `DRAWN_PLANTS(edge, width)` = THIN_1PX + the 0.55× plant.
- The tray-well consumer, `--roster tray-well --fe <tree>`.
- An unreadable roster file is a `why`, never a throw.
- The browser is closed in a `finally`.

Author proof, chromium:

- Edge self-test exit 0.
- Sabotage `drawn off` → self-test exit 3 (BITES).
- Served roster, control and tree, exit 1 and 1, with identical verdicts. That's 4 painted sites (the roster pins 4),
  source `src/games/shared/GameControlPanel.vue` widths 1.5 ×4, so the pin holds. The CLEAN read on site 1 is RED on
  the product: bottom core 1 < 3, occluded by `div.action-bar`, depth 0 < 1.35. THIN_1PX reds B3 at 0.97 < 1.35,
  and P055 (0.825 px) reds B3 at 0.80.

**`struck-18.diff`, pick 18, the stale-rebase plus the critic's seek** (`e2e/lib/postpaint.mjs` + `.d.mts`, 117+/12−).

- VERB's `PROPOSED-postpaint-stale-rebase.diff` (`37adb2cb`), applied by sha. A stale RUNNING post read carries its
  frame's clock back.
- The `seek-guard` clause, the critic's missing disjunct. The sampler logs every write of the subject's clock, and a
  write between frame k's in-rAF read and its post read is a SEEK. That read is UNREAD and never rebased.

Author proof, chromium:

- Unit U5: clean rebased 0 GREEN; startTime 150 early reads F1ct RED.
- Unit U6: a task seek winding a 150 ms skip back to ct 17 leaves frame 1 UNREAD, and F1ct reads RED on frame 2.
- pp self-test exit 0, pp sabotage 7/7 exit 0, the r16 sampler stress exit 0.
- The served GA1 rows (`.board-peek-host`, desk + phone, r2), control and tree, both exit 1, all four cells F1 RED
  (POST F1 k24–25 ct 7.6–8.4).

The WebKit column for both, on the author's full tree, is in §10. The author can't supply the non-author run.

## 10 · Proof (exits read bare from files the batteries write)

**Browserless, on the final bytes** (`shape-census` is the same in the bank and on the author's tree):

| Row | Exit | Reading |
|---|---|---|
| `node scripts/shape-census.mjs --self-test` | 0 | 156/156 read as the law, clauses planted 100/100, 4 s |
| `--sabotage-battery` | 0 | 100/100 clauses red the self-test when deleted |
| born-RED, `--self-test --lib` on homes v2's library (the seed placed inside the tree) | 1 | 139/156, 17 fail = exactly the 17 rows of the new clauses, listed below |
| `--tree` on the WAVE union (v3) | 0 | 0 FAIL, 185 s |
| `--tree` on the WAVE union under v2's library | 0 | 0 FAIL, 201 s |
| `--tree` on the control `74a2b5d9` (v3) | 2 | 14 FAIL, each `PLANT DID NOT MOVE THE SOURCE (anchor absent)` or NN on the control, which lacks the WAVE's margin-note voice the reserve plants anchor on |
| `--tree` on the control under v2's library (the negative control) | 2 | the same 14 FAIL, row for row, 79 s, so the control's reds are v2's too, not v3's |
| `reserveReading` × 155 files on the WAVE, cache on | 0 | cold 8,803 ms, warm 7,311 / 7,399 ms, cache 273 misses |
| the same, `SHAPE_NOCACHE=1` | 0 | cold 22,605 ms, warm 21,666 / 19,445 ms |
| `vue-tsc --noEmit -p tsconfig.e2e.json` | 0 | |
| `knip` | 0 | |
| `eslint e2e/lib scripts/shape-census.mjs` | 0 | |
| `prettier --check` on the 13 paths | 0 | |
| tree `vite build` on the final bytes | 0 | CSS 7/7 byte-identical to the control's dist (96,800 B); JS `index-BOytrTnLSO5X.js` (the control's `index-CubiZsMVSwTc.js` differs by node_modules, which moved at `4131e427`) |

Born-RED's 17 rows on v2: `strip-paren-kw` C2; `logical-sides` p9; `clock-context`; `obj-bracket` K1;
`str-unescape` S2; `string-rule` S2–S4; `css-wide-kw` S8–S11; `tok-string-fold` X8/X9; `callee-norm` N6
(TIN); `callee-norm` (ERASE's six); `register-callee`; `pct-decode` N21/N22; `component-tree` C1y/C17y;
`selector-key`; `admitted`; `bounds`; `r4-descend` C1–C6.

**Browser libraries, chromium** (the author's full tree; each row its own `guarded` call, zone and load
printed in each log):

| Row | Exit | Reading | zone inuse | load start → end |
|---|---|---|---|---|
| glyph-pop `--self-test --dprs 1,2` | 0 | 176 verdict rows as the law | 9,665 | 16.07 → 17.20 |
| glyph-pop `--sabotage-battery` | 0 | 5/5 clauses bite (`g5tol` → exit 3) | 9,620 | 17.20 → 14.67 |
| edge-bands `--self-test --dprs 1,2` | 0 | 180 verdict rows, incl. B7 HALFCLIP/X6, INKKEY, ABSENT-EDGE, drawn | 9,621 | 14.67 → 13.11 |
| edge-bands `--sabotage-battery` | 0 | 11/11 clauses bite, exit 3 each (B0–B6, ownfill, B7, inkkey, drawn) | 9,632 | 13.11 → 12.25 |
| postpaint `--self-test` | 0 | as the law | 9,711 | 12.25 → 11.94 |
| postpaint `--sabotage-battery` | 0 | 7/7 | 9,711 | 11.94 → 13.29 |
| postpaint sampler stress r16 | 0 | | 9,647 | 13.29 → 11.87 |
| rest-probes `--self-test` | 0 | HR1ONLY / HR2ONLY / ANC55 refused as the law | 9,716 | 11.87 → 11.73 |
| rest-probes `--sabotage-battery` | 0 | 4/4 | 9,716 | 11.73 → 14.26 |

The browser libraries have no `--lib` seed, since v2's library lacks the new API. Their born-RED is the
clause sabotage: deleting the new clause restores v2's reading, and every new row reds (exit 3).

**Served, chromium.** The control is `w7-control` on :4256, serving `index-CubiZsMVSwTc.js`. The tree is this work
tree on :4233, serving `index-BOytrTnLSO5X.js`. Both answered 200 before every row. The tree's product is the
control's, so the served rows read the PRODUCT through each instrument, and the control's exit stands beside the
tree's:

| Row | Control exit | Tree exit | Verdicts equal | Reading | zone inuse (c / t) |
|---|---|---|---|---|---|
| glyph-pop `.section-heading`, default-deal-desk | 1 | 1 | yes | CLEAN RED G4: column 4 core 2.63 < 3.00; all 9 plants RED | 9,863 / 9,861 |
| edge-bands `.drawer-case` | 1 | 1 | yes | CLEAN RED B4: top holes 0.061 > 0.02 (16 stations, 1 run) | 9,922 / 9,861 |
| edge-bands `--roster tray-well` (struck-10's consumer) | 1 | 1 | yes | 4 sites pinned, pin holds; site 1 bottom occluded by `div.action-bar`; THIN_1PX and P055 RED B3 | 9,922 / 9,928 |
| rest-probes touch `.drawer-tab` 390×844 | 0 | 0 | yes | GREEN, toggles 1 | 9,861 / 9,898 |
| postpaint GA1 `.board-peek-host`, desk + phone, r2 | 1 | 1 | RED in every cell (the timing digits differ) | POST F1 RED in all four cells | 9,861 / 9,898 |

The loads ran 12.8–16.6 for the whole column, under the 120 bar. No timing row here is a verdict on the product,
only on the instrument's reading.

**The WAVE's browserless consumers, v2 against v3.** These ran on a copy of the WAVE union (its own `.git`). The
first column is the union's own library (homes v2). For the second, the 13 home paths were overlaid with v3's full
author bytes. Exits were read bare:

| Consumer | v2 | v3 | What moved |
|---|---|---|---|
| check-ink-pressure `--self-test` | 0 | 0 | nothing |
| check-theme-tokens `--self-test` | 2 | 2 | nothing |
| check-tape-foot `--self-test` | 1 | 1 | nothing (the WAVE's own 2 FAILED: clause 4 ONE HAND at `index.css:981`) |
| check-motion-bands `--self-test` | 1 | 1 | **5 → 7 failures: B13 ARITHMETIC +2**, `MarginNote.vue:314` `reduced ? 0 : MOTION.rungs.note` and `gridPaths.ts:737`'s ternary. LADDER's `clock-context` (K17, the ternary) now carries the clock through, so these are new READINGS on the WAVE product that §13 owes, not instrument faults |
| check-font-coverage `--self-test` | 1 | 1 | nothing |
| check-peer-tin `--self-test` | 1 | 1 | gate 4's 4 findings unchanged. `pct-decode` re-words `planted.ts`'s `#ffb2f3` (now decoded, not "blanked"). The nearest innocent literal moves to `e2e/lib/edge-bands.mjs` `[102, 178, 255]` (the `#f-fc` INKKEY fixture), ΔE **0.0307**, only 0.0007 above the 0.03 bound. That's a declared fragility of a home's own fixture |
| check-peer-arcs `--self-test` | 1 | 1 | nothing |
| check-favicon `--self-test` | 0 | 0 | nothing |
| knip | 0 | 0 | nothing |
| vue-tsc e2e | 0 | 0 | nothing |
| MarginNote unit (vitest, maxWorkers 2) | 0 | 0 | 2/2 |

The v2 reds belong to the WAVE: `check-motion-bands`' negative-negative also wants `74a2b5d9` in the clone,
which a scratch copy lacks. v3 adds no red to any consumer except the two B13 readings above.

## 11 · WebKit: UNREAD

Every WebKit row was queued under `guarded --exclusive webkit`, one row per call. None of them ran. The
machine-wide WebKit lock was held or contended by other repos' runs from 10:10 to 10:43: the first libs queue at
10:10, then from 10:17:40 behind served chromium. That's an `attslot` job at `--timeout 88`, two sci-report and
u-build waiters past 1 h 20 m, and a glass-ui run. The lane's turn ran out first. These rows are UNREAD by name,
engine WebKit, zone inuse 9,812–10,013 throughout (under 8M, so the zone did not stop them):

- glyph-pop `--self-test` and `--sabotage-battery`
- edge-bands `--self-test` and `--sabotage-battery`
- postpaint `--self-test`, `--sabotage-battery` and the r16 stress
- rest-probes `--self-test` and `--sabotage-battery`
- served control/tree glyph, edge, roster, rest and GA1
- the struck-library edge-bands `--self-test` and `--sabotage-battery`, in BOTH engines

That last row was never run: it's queued to follow the WebKit rows, and the edge-bands bytes in `homes.diff`
(pre-roster) have only the author's pre-roster chromium run, `edge-st-cr-3`, exit 0.

The replay route is `bat/libs.sh webkit`, then `bat/served.sh webkit`, then `bat/strike.sh` (which waits on the
chain). These are the lane's scratch scripts, named in the return.

## 12 · Incidents, self-declared

1. The first sitting (agent `ab555680`) was cut off by its turn limit, with homes v3 built but not banked. This
   sitting continued from its files and rebuilt nothing that was done.
2. A stray `cp` of v2's glyph-pop and paint-lib into the tree's `e2e/` went to trash within one step. It was never
   built or banked.
3. Stall law, twice. `shape-census --tree` on the WAVE ran in the foreground past 115 s and the harness moved it to
   the background. In this sitting a foreground prettier and eslint pair did the same: it sat 110 s waiting for a
   BROWSER slot, because `guarded` reads `rest-probes` in a file argument as a probe. It was re-run by directory, and
   both exit 0.
4. The `SHAPE_NOCACHE=1` `--tree` timing row on the WAVE was stopped by this lane at 7 min 53 s, against 185 s
   cached (exit 143). It was optional, and the per-file timing row (8.8 s against 22.6 s cold) carries the cache's
   number.
5. Build 1 minted `.inline-block`, a T9-R6 class taken from the shape-census r4-descend fixture text. The fixture
   was re-spelled with no `display` in it. Build 2 and this sitting's build 3 read CSS 7/7 byte-identical to the
   control.
6. The first `r4-descend` reading on the WAVE was RED at 67.6, from HandwrittenLogo's `?text`. The folded scan
   used hole `?`, not `\u0000`, so holeBoundary missed. That was cured, and `r4-descend`'s reach was bounded
   through `componentReach`, with plants OTHER (neg) and HOST `:deep` (pos).
7. The WebKit lock is machine-wide and was held by other repos' runs for much of this sitting. The first queued
   libs run was stopped while waiting (never started) and re-queued behind served chromium in one sequential chain,
   so this lane never had two heavy runs at once.
